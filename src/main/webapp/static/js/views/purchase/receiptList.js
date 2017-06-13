/**
 * Created by huangj02 on 2016/8/9.
 */

var indexTab = 0;
var tableIdName = 'receiptOrderList';
var tempURL = '/form/purchaseSelect/getPurchaseFormList';
$(function(){
	$("#refFormNo").val('');
	$('#radioItemDiv').prop("style", "visibility:hidden;");
    $('#refFormNoDiv').prop("style", "visibility:hidden;");
	loadTabs();
    toBtnDisable('','','btnPrint');
	//初始化默认条件
    initConditionParams();
    initDatagridFormPA();
    //单据状态切换
    changeStatus();
    if(getUrlQueryString('message')=='0'){
    	$('#tabs').tabs({'selected':1});
        toBtnDisable('','','btnPrint');
    	query();
    }else{
        $('#radioItemDiv').prop('hide',true);
        $('#refFormNoDiv').prop('hide',true);
		$("#refFormNo").val('');
		toBtnEnable('btnAdd','btnDel','');
		setQueryDataPA();
		initDatagridFormPA();
		query();
    }
});

//加载选项卡
function loadTabs(){
	$('#tabs').tabs({
		border:false,
		onSelect:function(title){
			// 获取选项卡下标
			indexTab = $('#tabs').tabs('getTabIndex',$('#tabs').tabs('getSelected'));
			if (indexTab === 0) {
                $('#radioItemDiv').prop("style", "visibility:hidden;");
                $('#refFormNoDiv').prop("style", "visibility:hidden;");
				$("#refFormNo").val('');
				toBtnEnable('btnAdd','btnDel','');
                toBtnDisable('','','btnPrint');
				setQueryDataPA();
				initDatagridFormPA();
			} else {
				$("input[type='radio'][name='status']").get(0).checked = true;
                $('#radioItemDiv').prop("style", "visibility:visible;");
                $('#refFormNoDiv').prop("style", "visibility:visible;");
                toBtnEnable('','','btnPrint');
				toBtnDisable('btnAdd','btnDel','');
				setQueryDataPI();
				initDatagridOrders();
			}
		}
	});
}

//设置值 收货单
function setQueryDataPI() {
	tempURL = '/form/purchase/receiptListData';
	tableIdName = 'gridOrders';
}
// 设置值 采购单
function setQueryDataPA() {
	tempURL = '/form/purchaseSelect/getPurchaseFormList';
	tableIdName = 'receiptOrderList';
}

/**
 * 禁用按钮
 * @param id
 */
function toBtnDisable(addId,delId,printId){
	$("#"+addId).removeClass('ubtns-item').addClass('ubtns-item-disabled').removeAttr('onclick');
	$("#"+delId).removeClass('ubtns-item').addClass('ubtns-item-disabled').removeAttr('onclick');
    $("#"+printId).removeClass('ubtns-item').addClass('ubtns-item-disabled').removeAttr('onclick');
}
/**
 * 开启按钮
 * @param id
 */
function toBtnEnable(addId,delId,printId){
	$("#"+addId).removeClass('ubtns-item-disabled').addClass('ubtns-item').attr('onclick','receiptAdd()');
	$("#"+delId).removeClass('ubtns-item-disabled').addClass('ubtns-item').attr('onclick','receiptDelete()');
    $("#"+printId).removeClass('ubtns-item-disabled').addClass('ubtns-item').attr('onclick','printPreview()');
}
//单据状态切换
function changeStatus(){
	$(".radioItem").change(function(){
		indexTab = $('#tabs').tabs('getTabIndex',$('#tabs').tabs('getSelected'));
		if (indexTab === 1) {
			query();
		}
    });
}

//初始化默认条件
function initConditionParams(){
    
	$("#txtStartDate").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM-dd"));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    
}

var gridHandel = new GridClass();
//初始化表格
function initDatagridOrders(){
    $("#"+tableIdName).datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        url:contextPath+tempURL,
        queryParams : {startTime : $("#txtStartDate").val(),
        	           endTime: $("#txtEndDate").val(),
        	           status : $('#radioItemDiv input[name="status"]:checked ').val()
                       },
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
		height:'100%',
		width:'100%',
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
            	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购收货详细\',\''+contextPath+'/form/purchase/receiptEdit?formId='+row.id+'\')">' + value + '</a>';
            	return strHtml;
            
            }},
            {field:'branchName',title:'收货机构',width:'100px',align:'left'},
            {field:'status',title:'审核状态',width:'100px',align:'center',formatter:function(value,row,index){
            	if(value == '0'){
            		return '待审核';
            	}else if(value == '1'){
            		return '审核通过';
            	}else if(value == '2'){
            		return '审核失败';
            	}else{
            		return '未知类型：'+ value;
            	}
            }},
            {field:'supplierCode',title:'供应商编号',width:'200px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'amount',title:'总金额',width:'120px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'refFormNo',title:'采购单号',width:'200px',align:'left'},
            {field:'updateUserName',title:'操作员',width:'130px',align:'left'},
            {field:'createTime',title:'操作时间',width:'150px',align:'center', formatter: function (value, row, index) {
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
   // query();
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(tableIdName,["amount"])
	}
}


//初始化表格 单据选择（采购）
function initDatagridFormPA(){
	$("#"+tableIdName).datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        queryParams : {formType : 'PA',startTime : $("#txtStartDate").val(),
            endTime: $("#txtEndDate").val(),
            status : $('#radioItemDiv input[name="status"]:checked ').val()},
        //url:contextPath+tempURL,
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单号',width:'200px',align:'left',formatter:function(value,row,index){
				var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'新增采购收货单\',\''+ contextPath +'/form/purchase/addReceiptForm?id='+ row.id +'&formType=PI\')">' + value + '</a>';
				return strHtml;
			}},
            {field:'branchName',title:'收货机构',width:200,align:'left'},
            {field:'supplierName',title:'供应商',width:200,align:'left'},
            {field:'amount',title:'单据金额',width:200,align:'right',
            	formatter : function(value, row, index) {
            		return parseFloat(value||0).toFixed(2);
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
        priceGrantUtil.grantPurchasePrice(tableIdName,["amount"])
    }
}


function receiptAdd(){
	toAddTab("新增采购收货单",contextPath + "/form/purchase/receiptAdd");
}

function query(){
	var fromObjStr = $('#queryForm').serializeObject();
	$("#" + tableIdName).datagrid('options').url = contextPath+tempURL;
	//$("#" + tableIdName).datagrid('options').queryParams = fromObjStr;
	$("#" + tableIdName).datagrid('load',fromObjStr);
}

function receiptDelete(){
	var row =  $("#"+tableIdName).datagrid("getSelected");
	if(rowIsNull(row)){
		return null;
	}
	var rows =$("#"+tableIdName).datagrid("getChecked");
	if($("#"+tableIdName).datagrid("getChecked").length <= 0){
		 $_jxc.alert('请选中一行进行删除！');
		return null;
	}
	 var formIds='';
	    $.each(rows,function(i,v){
	    	formIds+=v.id+",";
	    });
	
	
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/purchase/delete",
		    	data:{
		    		formIds:formIds
		    	}
		    },function(result){
	    		console.log(result);
	    		if(result['code'] == 0){
	    			$_jxc.alert("删除成功");
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
	    		$("#"+tableIdName).datagrid('reload');
		    });
		}
	});
}

function selectSupplier(){
	new publicSupplierService(function(data){
//		$("#supplierId").val(data.id);
		$("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
	});
}
function selectOperator(){
	new publicOperatorService(function(data){
//		$("#operateUserId").val(data.id);
		$("#operateUserName").val(data.userName);
	});
}
function selectBranch(){
	new publicBranchService(function(data){
//		$("#branchId").val(data.branchesId);
		$("#branchName").val("["+data.branchCode+"]"+data.branchName);
	},0);
}

/**
 * 重置
 */
function resetForm(){
	 $("#queryForm").form('clear');
};


function printPreview() {
	var rows = $("#"+tableIdName).datagrid('getSelections');
	if(rows.length == 1){
        toPrintPreview('PI','/form/purchase/',tableIdName);
	}else{
		$_jxc.alert('请选择一行数据.')
	}
}
