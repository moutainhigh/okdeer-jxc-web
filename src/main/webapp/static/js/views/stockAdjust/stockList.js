/**
 * Created by wxl on 2016/10/12.
 * 库存调整-列表
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
			formType:'BF'
		},
		loadFilter:function(data){
			data.createBranchId = data.branchId;
			return data;
		}
	});
	
	//操作员组件初始化
	$('#operateorSelect').operatorSelect({
		loadFilter:function(data){
			data.salesmanId = data.id;
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
    $("#stockFromList").datagrid({
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
            {field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
            	if(row.status  == 0){
            		var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看库存调整详细\',\''+contextPath+'/stock/adjust/edit?id='+row.id+'\')">' + value + '</a>';
                	return strHtml;
            	}else if(row.status == 1){
            		var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看库存调整详细\',\''+contextPath+'/stock/adjust/checkSuccess?id='+row.id+'\')">' + value + '</a>';
                	return strHtml;

            	}
            }},
            {field:'status',title: '审核状态', width: '100px', align: 'left',formatter:function(value,row,index){
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
			{field: 'amount', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
			},
            {field: 'reason', title: '调整原因', width: '200px', align: 'left'},
            {field: 'createUserName', title: '操作人员', width: '130px', align: 'left'},
            {field: 'createTime', title: '操作时间', width: '150px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}
			},
            {field: 'validUserName', title: '审核人员', width: '130px', align: 'left'},
            {field: 'remark', title: '备注', width: '200px', align: 'left',
    		     onLoadSuccess:function(data){
    			gridHandel.setDatagridHeader("center");
    		   }
            }
        ]],
        
    });
    queryForm();
    if(hasCostPrice==false){
        priceGrantUtil.grantCostPrice("stockFromList",["amount","untaxedAmount"])
    }
}

//新增入库单
function addStockForm(){
	toAddTab("新增库存调整单",contextPath + "/stock/adjust/add");
}

//查询入库单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	//2.7精确查询
	fromObjStr.branchName = "";
	fromObjStr.createUserName = "";
	
	$("#stockFromList").datagrid("options").method = "post";
	$("#stockFromList").datagrid('options').url = contextPath + '/stock/adjust/getStockFormList';
	$("#stockFromList").datagrid('load', fromObjStr);
}


/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
//		$("#createBranchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
	},'BF','');
}
/**
 * 操作员
 */
function selectOperator(){
	new publicOperatorService(function(data){
//		$("#salesmanId").val(data.id);
		$("#createUserName").val(data.userName);
	});
}

//打印
/*function printDesign(){
     var dg = $("#gridRequireOrders");
     var row = dg.datagrid("getSelected");
     if(rowIsNull(row)){
           return null;
     }
     //弹出打印页面
     parent.addTabPrint('PASheet' + row.id,row.formNo+'单据打印',contextPath + '/printdesign/design?page=PASheet&controller=/form/purchase&template=-1&sheetNo=' + row.id + '&gridFlag=PAGrid','');
}
*/

/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};