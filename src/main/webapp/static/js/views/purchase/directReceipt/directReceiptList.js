
var gridName = "gridDirectList";

$(function(){
	initConditionParams();
	
	//待处理采购订单
	initDatagridFormPA();
	
	//直送收货单
	initDirectDatagrid();
	
	changeStatus();
	
	$('#tabs').tabs({
		border:false,
		onSelect:function(title){
			changeBtnStatus();
			query();
		}
	});
	
	initTabGrid();
	changeBtnStatus();
	
	//机构选择
	$('#branchComponent').branchSelect();
	//供应商选择
	$('#supplierComponent').supplierSelect({
		//数据过滤
		loadFilter:function(data){
			data.supplierId = data.id;
			return data;
		}
	});
	//操作人选择
	$('#operatorComponent').operatorSelect({
		//数据过滤
		loadFilter:function(data){
			data.operateUserId = data.id;
			return data;
		}
	});
})


//改变btn操作
function changeBtnStatus(){
	var _index = getTabIndex();
	if(_index == 0){
		$('.preBtn').removeClass('ubtns-item').addClass('ubtns-item-disabled event-none');
		
		$('#refFormNoDiv').addClass('unhide');
		$('#radioItemDiv').addClass('unhide');
	}else if(_index == 1){
		$('.preBtn').addClass('ubtns-item').removeClass('ubtns-item-disabled event-none');
		
		$('#refFormNoDiv').removeClass('unhide');
		$('#radioItemDiv').removeClass('unhide');
	}
}

//初始化默认条件
function initConditionParams(){
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}


//单据状态切换
function changeStatus(){
	$(".radioItem").change(function(){
	  	query();
	});
}


var gridHandel = new GridClass();

function query(){
	
	var _index = getTabIndex();
	
	var fromObjStr = $("#queryForm").serializeObject();
	
	fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)
    fromObjStr.operateUserName = fromObjStr.operateUserName.substring(fromObjStr.operateUserName.lastIndexOf(']')+1)
    fromObjStr.supplierName = fromObjStr.supplierName.substring(fromObjStr.supplierName.lastIndexOf(']')+1)
	
	if(_index == 1){
		//直送收货单
		$("#"+gridName).datagrid("options").queryParams = fromObjStr;
		$("#"+gridName).datagrid("options").method = "post";
		$("#"+gridName).datagrid("options").url = contextPath+'/directReceipt/getList';
		$("#"+gridName).datagrid("load");
	}else if(_index == 0){
		//待处理采购订单
		fromObjStr.isDirectSupplier = 1;
		fromObjStr.formType = 'PA';
		$("#"+tableIdName).datagrid("options").queryParams = fromObjStr;
		$("#"+tableIdName).datagrid("options").method = "post";
		$("#"+tableIdName).datagrid("options").url = contextPath+'/form/purchaseSelect/getPurchaseFormList';
		$("#"+tableIdName).datagrid("load");
	}
}


//新增直送收货单
function directAdd(){
	toAddTab("新增直送收货单",contextPath + "/directReceipt/add");
}

//删除直送收货单 批量
function directDelete(){
	var rows = $("#"+gridName).datagrid("getChecked");
	if($("#"+gridName).datagrid("getChecked").length <= 0){
		 $_jxc.alert('请选中一行进行删除！');
		return null;
	}
	
    var formIds = [];
	var flag = true;
	rows.forEach(function(data,index){
		formIds.push(data.id);
	});
	
	$_jxc.confirm('是否要删除选中数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/directReceipt/delete",
		    	data:{
		    		formIds:formIds
		    	}
		    },function(result){
	    		
	    		if(result['code'] == 0){
	    			$_jxc.alert("删除成功");
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
	    		$("#"+gridName).datagrid('reload');
		    });
		}
	});
}

//获取tabindex
function getTabIndex(){
	var index = -1;
	var tab = $('#tabs').tabs('getSelected');
	var index = $('#tabs').tabs('getTabIndex',tab);
	return index;
}

function initTabGrid(){
	query();
}


var tableIdName = 'receiptOrderList';
//初始化表格 单据选择（采购）
function initDatagridFormPA(){
	$("#"+tableIdName).datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        pageSize:50,
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单号',width:'200px',align:'left',formatter:function(value,row,index){
				var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'新增直送收货单\',\''+ contextPath +'/directReceipt/add?formId='+ row.id +'&formType=PM\')">' + value + '</a>';
				return strHtml;
			}},
            {field:'branchName',title:'收货机构',width:200,align:'left'},
            {field:'supplierName',title:'供应商',width:200,align:'left'},
            {field:'untaxedAmount',title:'不含税单据金额',width:'140px',align:'right',
            	formatter : function(value, row, index) {
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            },
            {field:'amount',title:'单据金额',width:200,align:'right',
            	formatter:function(value, row, index) {
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	}
            },
            {field:'validTime',title:'审核时间',width:200,align:'center', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd hh:mm');
                }
                return "";
            }}
        ]],
        onLoadSuccess : function() {
        	$('.datagrid-header').find('div.datagrid-cell').css('text-align','center');
        },
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(tableIdName,["amount","untaxedAmount"])
    }
}


function initDirectDatagrid(){
	gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        method:'post',
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        showFooter:true,
		height:'100%',
		width:'100%',
		pageSize:50,
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单据编号',width:'140px',align:'left',
            	formatter:function(value,row,index){
	            	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'直送收货单详细\',\''+ contextPath+'/directReceipt/edit?formId='+ row.id +'\')">' + value + '</a>';
            		return strHtml;
            	}
            },
            {field:'branchCode',title:'收货机构',width:'120px',align:'left'},
            {field:'status',title:'审核状态',width:'100px',align:'center',formatter:function(value,row,index){
            	if(value == '0'){
            		return '未审核';
            	}else if(value == '1'){
            		return '已审核';
            	}else{
            		return '未知类型：'+ value;
            	}
            }},
            {field:'branchName',title:'机构名称',width:'140px',align:'left'},
            {field:'supplierCode',title:'供应商编号',width:'80px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'untaxedAmount',title:'不含税总金额',width:'140px',align:'right',
            	formatter:function(value,row,index){
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'amount',title:'总金额',width:100,align:'right',
            	formatter:function(value,row,index){
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'refFormNo',title:'采购单号',width:'140px',align:'left'},
            {field:'createUserName',title:'操作人',width:'130px',align:'left'},
            {field:'createTimeStr',title:'操作时间',width:'150px',align:'center', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd hh:mm');
                }
                return "";
            }},
            {field:'validUserName',title:'审核人',width:'130px',align:'left'},
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
    });
    //query();
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(gridName,["amount"])
    }
    
}

//打印
function printList() {
	var fromObjStr = $('#queryForm').serialize();
	
	parent.addTabPrint("DirectReceiptPrint","直送收货单列表打印",contextPath+"/directReceipt/print?"+fromObjStr);
}


