/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function(){

    //机构选择初始化
    $('#branchComponent').branchSelect();

    //开始和结束时间
	/*toChangeDatetime(0);*/
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	// 初始化表格
	publicGpeGridColumns({
		onLoadSuccess:function(columns,frozenColumns){
			initicCardChargeGrid(columns,frozenColumns);
		}
	});
});
var gridHandel = new GridClass();
function initicCardChargeGrid(columns,frozenColumns) {
	$("#icCardCharge").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        //url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        fitColumns:false,    //占满
        showFooter:true,
        pageSize : pageSize,
        height:'100%',
        columns : columns,
        frozenColumns : frozenColumns,
        onBeforeLoad:function(param){
        	gridHandel.setDatagridHeader("center");
        }
    });
    
}




/**
 * 收银员下拉选
 */
function searchCashierId(){
	new publicOperatorService(function(data){
		$("#cashierId").val(data.id);
		$("#cashierNameOrCode").val("["+data.userCode+"]"+data.userName);
	});
}


/**
 * GPE设置
 */
function toGpeSetting() {
	publicGpeSetting({
		onSettingChange:function(columns,frozenColumns){
			initicCardChargeGrid(columns,frozenColumns);
		}
	});
}

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : "icCardCharge",
		queryParams : $("#queryForm").serializeObject()
	});
}
//查询
function query(){
	var formData = $("#queryForm").serializeObject();
	$("#icCardCharge").datagrid("options").queryParams = formData;
	$("#icCardCharge").datagrid("options").method = "post";
	$("#icCardCharge").datagrid("options").url = contextPath+'/iccard/chargeDetail/list';
	$("#icCardCharge").datagrid("load");
	
}

//打印
/**
 * 重置
 */
var resetForm = function(){
	 $("#queryForm").form('clear');
	 $("#branchCode").val('');
};
