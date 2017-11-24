/**
 * Created by huangj02 on 2016/8/9.
 */
$(function(){
	
	//初始化默认条件
    initConditionParams();
    initDatagridOrders();
   
    //单据状态切换 
    changeStatus();
    
    
    //机构选择组件初始化
    $('#branchSelect').branchSelect()
    
    //供应商组件初始化
    $('#supplierSelect').supplierSelect({
    	loadFilter:function(data){
			data.supplierId = data.id;
			return data;
		}
    })
    
    //操作员组件初始化
	$('#operateorSelect').operatorSelect({
		loadFilter:function(data){
			data.operateUserId = data.id;
			return data;
		}
	});
    
    
});

//单据状态切换
function changeStatus(){
	$(".radioItem").change(function(){
		query();
    });
}

//初始化默认条件
function initConditionParams(){
    
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    
}

var gridHandel = new GridClass();
//初始化表格
function initDatagridOrders(){
    $("#gridOrders").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        //url:contextPath+'/form/purchase/returnListData',
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
            	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购退货详细\',\''+contextPath+'/form/purchase/returnEdit?formId='+row.id+'\')">' + value + '</a>';
            	return strHtml;
            }},
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
            {field:'branchName',title:'退货机构',width:'140px',align:'left'},
            {field:'supplierCode',title:'供应商编号',width:'200px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'amount',title:'总金额',width:'120px',align:'right',
                formatter : function(value, row, index) {
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'refFormNo',title:'引用单号',width:'200px',align:'left'},
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
    query();
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("gridOrders",["amount"])
    }
}
function receiptAdd(){
	toAddTab("新增采购退货订单",contextPath + "/form/purchase/returnAdd");
}


function query(){
	var formStr = $("#queryForm").serializeObject();
	//2.7精确查询
	formStr.branchName = "";
	formStr.operateUserName = "";
	formStr.supplierName = "";
	
	$("#gridOrders").datagrid("options").queryParams = formStr;
	$("#gridOrders").datagrid("options").method = "post";
	$("#gridOrders").datagrid("options").url = contextPath+'/form/purchase/returnListData';
	$("#gridOrders").datagrid("load");
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
//		$("#operateUserName").val("["+data.userCode+"]"+data.userName);
	});
}

/**
 * 重置
 */
function resetForm(){
	 $("#queryForm").form('clear');
};

//删除
function returnDelete(){
	var rows =$("#gridOrders").datagrid("getChecked");
	if($("#gridOrders").datagrid("getChecked").length <= 0){
		 $_jxc.alert('请选中一行进行删除！');
		return null;
	}
	 var formIds='';
	    $.each(rows,function(i,v){
	    	formIds+=v.id+",";
	    });
	$_jxc.confirm('是否要删除选中数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/purchase/delete",
		    	data:{
		    		formIds:formIds
		    	}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("删除成功");
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
	    		$("#gridOrders").datagrid('reload');
		    });
		}
	});
}

function printPreview() {
    var rows = $("#gridOrders").datagrid('getSelections');
    if(rows.length == 1){
        toPrintPreview('PR','/form/purchase/','gridOrders');
    }else{
        $_jxc.alert('请选择一行数据.')
    }
}