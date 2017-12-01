/**
 * Created by wxl on 2016/10/12.
 * 成本调整单-列表
 */
$(function(){
	//开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    initDatagridRequireOrders();
  //单据状态切换
    changeStatus();
    
  //机构组件初始化
	$('#branchSelect').branchSelect({
		param:{
			formType:'DO'
		}
	});
	
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
		queryForm();
    });
}
var gridHandel = new GridClass();
//初始化表格
function initDatagridRequireOrders(){
    $("#costFromList").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
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
            {field:'adjustNo',title:'单号',width:'135px',align:'left',formatter:function(value,row,index){
            	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看成本调价单详细\',\''+contextPath+'/cost/costAdjust/edit?id='+row.id+'\')">' + value + '</a>';
            	return strHtml;
            }},
            {field:'status',title: '审核状态', width: '100px', align: 'left',
            	   formatter: function(value,row,index){
            		 
                       if (value==1){
                           return "已审核";
                       }else if(value==2){
                    	   return "不通过";
                       } 
                       else {
                           return "未审核";
                       }
                   }
            },
			{field: 'branchCode', title: '机构编号', width: '200px', align: 'left'},
			{field: 'branchName', title: '机构名称', width: '220px', align: 'left'},
			{field: 'untaxedAmount', title: '不含税金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
			},
			{field: 'totalMoney', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }
			},
			{field: 'adjustReasonName', title: '调整原因', width: '200px', align: 'left'},
            {field: 'adjustReason', title: '调整原因', width: '200px', align: 'left',hidden:true},
            {field: 'createTime', title: '创建时间', width: '150px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm:ss');
					}
					return "";
				}
			},
            {field: 'updateUserName', title: '操作人员', width: '130px', align: 'left'},
            {field: 'updateTime', title: '操作时间', width: '150px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}
			},
            {field: 'validUserName', title: '审核人员', width: '130px', align: 'left'},
            {field: 'remark', title: '备注', width: '200px', align: 'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
        
    });
    queryForm();

    if(hasCostPrice==false){
        priceGrantUtil.grantCostPrice("costFromList",["totalMoney","untaxedAmount"])
    }
}

//新增入库单
function addStockForm(){
	toAddTab("新增成本调价单",contextPath + "/cost/costAdjust/add");
}

//查询入库单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	//2.7精确查询
	fromObjStr.branchName = "";
	fromObjStr.operateUserName = "";
	
	$("#costFromList").datagrid("options").method = "post";
	$("#costFromList").datagrid('options').url = contextPath + '/cost/costAdjust/queryList';
	$("#costFromList").datagrid('load', fromObjStr);
	//
}

//删除
function delStockForm(){
	var dg = $("#costFromList");
	var row = dg.datagrid("getSelected");
	if(rowIsNull(row)){
		return null;
	}
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/cost/costAdjust/deleteCostForm",
		    	data:{
		    		formId : row.deliverFormId
		    	}
		    },function(result){
	    		
	    		if(result['code'] == 0){
                    $_jxc.alert("删除成功");
	    			dg.datagrid('reload');
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
//		$("#branchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
	},'DO','');
}
/**
 * 操作员
 */
function selectOperator(){
	new publicOperatorService(function(data){
//		$("#operateUserId").val(data.id);
		$("#operateUserName").val(data.userName);
	});
}

//打印
function printDesign(){
     var dg = $("#gridRequireOrders");
     var row = dg.datagrid("getSelected");
     if(rowIsNull(row)){
           return null;
     }
     //弹出打印页面
     parent.addTabPrint('PASheet' + row.id,row.adjustNo+'单据打印',contextPath + '/printdesign/design?page=PASheet&controller=/form/purchase&template=-1&sheetNo=' + row.id + '&gridFlag=PAGrid','');
}

/**
 * 导出
 */
function exportExcel(){
	var isValid = $("#queryForm").form('validate');
	if(!isValid){
		return;
	}

	var length = $("#goodsTab").datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	if(length > exportMaxRow){
		$_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#queryForm").attr("action",contextPath+"/goods/report/exportList");
	$("#queryForm").submit(); 

}

/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};