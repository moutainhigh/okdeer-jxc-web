/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function(){

    //机构选择初始化
    $('#branchComponent').branchSelect();

    //开始和结束时间
	toChangeDatetime(0);
	// 初始化表格
	publicGpeGridColumns({
		onLoadSuccess:function(columns,frozenColumns){
			initCashWaterGrid(columns,frozenColumns);
		}
	});
});
var gridHandel = new GridClass();
function initCashWaterGrid(columns,frozenColumns) {
	$("#cashWater").datagrid({
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


//改变日期
function changeDate(index){
    switch (index){
        case 0: //今天
            $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            $("#txtEndDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            break;
        case 2: //本周
            $("#txtStartDate").val(dateUtil.getCurrentWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 3: //上周
            $("#txtStartDate").val(dateUtil.getPreviousWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousWeek()[1].format("yyyy-MM-dd"));
            break;
        case 4: //本月
            $("#txtStartDate").val(dateUtil.getCurrentMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.getPreviousMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousMonth()[1].format("yyyy-MM-dd"));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.getCurrentSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.getPreviousSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousSeason()[1].format("yyyy-MM-dd"));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.getCurrentYear()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        default :
            break;
    }
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
			initCashWaterGrid(columns,frozenColumns);
		}
	});
}

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : "cashWater",
		queryParams : $("#queryForm").serializeObject()
	});
}
//查询
function query(){
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}
	var cashierNameOrCode = $("#cashierNameOrCode").val();
	if(cashierNameOrCode && cashierNameOrCode.indexOf("[")>=0 && cashierNameOrCode.indexOf("]")>=0){
		formData.cashierNameOrCode = null;
	}
	$("#cashWater").datagrid("options").queryParams = formData;
	$("#cashWater").datagrid("options").method = "post";
	$("#cashWater").datagrid("options").url = contextPath+'/cashFlow/report/list';
	$("#cashWater").datagrid("load");
	
}

//打印
function printReport(){
	var startTime = $("#txtStartDate").val();
	var endTime = $("#txtEndDate").val();
	var branchNameOrCode= $("#branchNameOrCode").val();
	var businessType=$("#businessType").combobox("getValue");
	var orderNo=$("#orderNo").val();
	var status=$("#status").val();
	var payType=$("#payType").combobox("getValue");
	var orderType=$("#orderType").combobox("getValue");
	var cashierId=$("#cashierId").val();
	parent.addTabPrint("reportPrint"+branchNameOrCode,"打印",contextPath+"/cashFlow/report/printReport?" +"&startTime="+startTime
			+"&endTime="+endTime+"&branchNameOrCode="+branchNameOrCode+"&cashierId="+cashierId+"&businessType="+businessType+"&orderNo="
			+orderNo+"&payType="+payType+"&orderType="+orderType+"&status="+status);
}
/**
 * 重置
 */
var resetForm = function(){
	 $("#queryForm").form('clear');
	 $("#branchCode").val('');
};

function clearCashierId() {
	var cashierNameOrCode = $("#cashierNameOrCode").val();

	// 如果修改名称
	if (!cashierNameOrCode || 
			(cashierNameOrCode && cashierNameOrCode.indexOf("[") < 0 && cashierNameOrCode.indexOf("]") < 0)) {
		$("#cashierId").val('');
	}
}