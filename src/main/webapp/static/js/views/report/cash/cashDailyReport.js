/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
var tabKey = 'bepDayAnalysis';
$(function() {
	// 开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    // 初始化表格
	initGridByGpeGridColumns();
    //选择报表类型
	changeType();

});

function changeType(){
	$(".radioItem").change(function(){
    	var type = $(this).val();

        /*initCashDailyGrid(type);*/
        $("#cashDaily").datagrid("options").url = "";
        $("#cashDaily").datagrid('loadData', { total: 0, rows: [] });
        $('#cashDaily').datagrid({showFooter:false});
        tabKey=type;
        $("#tabKey").val(tabKey);
    	/*if (type=="cashier") {
			showCashier();
		} else if (type=="branch") {
			hideCashier();
		} else if (type=="date") {
			hideCashier();
		}*/
    	// 重新初始表格
		initGridByGpeGridColumns();
		tabKey = $('input[type="radio"][name="tabKey"]:checked').val();
    });
}

function showCashier(){
	$("#cashierNameOrCode").removeAttr("disabled");
	$("#cashierIdSelect").show();
}

function hideCashier(){
	$("#cashierId").val('');
	$("#cashierNameOrCode").val('');
	$("#cashierNameOrCode").attr("disabled","disabled");
	$("#cashierNameOrCode").attr("disabled","disabled");
	$("#cashierIdSelect").hide();
}

var gridHandel = new GridClass();
// 按收银汇总

function initCashDailyGrid(columns,frozenColumns) {
	gridHandel.setGridName("cashDaily");
	$("#cashDaily").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        //url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        //showFooter:true,
        pageSize : pageSize,
        showFooter:true,
        height:'100%',
        widht:'100%',
        columns : columns,
		frozenColumns : frozenColumns,
		onBeforeLoad : function(data) {
			gridHandel.setDatagridHeader("center");
		}
    });
}


/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
		$("#branchCode").val(data.branchCode);
		$("#branchNameOrCode").val("["+data.branchCode+"]"+data.branchName);
	},"","");
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

function clearBranchCode(){
	var branchNameOrCode = $("#branchNameOrCode").val();
	
	//如果修改名称
	if(!branchNameOrCode || 
			(branchNameOrCode && branchNameOrCode.indexOf("[")<0 && branchNameOrCode.indexOf("]")<0)){
		$("#branchCode").val('');
	}
}

function clearCashierId() {
	var cashierNameOrCode = $("#cashierNameOrCode").val();

	// 如果修改名称
	if (!cashierNameOrCode || 
			(cashierNameOrCode && cashierNameOrCode.indexOf("[") < 0 && cashierNameOrCode.indexOf("]") < 0)) {
		$("#cashierId").val('');
	}
}

/**
 * 导出
 */
function exportData(){
    var param = {
        datagridId:"cashDaily",
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/cashDaily/report/exportList"
    }

    publicExprotService(param);
}

//查询
function query(){
	$("#cashDaily").datagrid("options").url =  "";
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}
	
	var cashierNameOrCode = $("#cashierNameOrCode").val();
	if(cashierNameOrCode && cashierNameOrCode.indexOf("[")>=0 && cashierNameOrCode.indexOf("]")>=0){
		formData.cashierNameOrCode = null;
	}
    $('#cashDaily').datagrid({showFooter:true});
	$("#cashDaily").datagrid("options").queryParams = formData;
	$("#cashDaily").datagrid("options").method = "post";
	$("#cashDaily").datagrid("options").url =  contextPath+"/cashDaily/report/list";
	$("#cashDaily").datagrid("load");
	
}
//合计
function updateFooter(){
    var fields = {rmb:0,zer:0,yhk:0,posZfb:0,posZfb:0,mallZfb:0,mallWzf:0,yqb:0,djq:0,pdf:0,pbt:0,dxr:0,total:0};
    var argWhere = {name:'isGift',value:''}
    gridHandel.updateFooter(fields,argWhere);
}

//打印
function printReport(){
	var queryType=$('input:radio[name="queryType"]:checked').val();

	var startTime = $("#txtStartDate").val();
	var endTime = $("#txtEndDate").val();
	var branchNameOrCode= $("#branchNameOrCode").val();
	var cashierId=$("#cashierId").val();
	parent.addTabPrint("reportPrint"+branchNameOrCode,"打印",contextPath+"/cashDaily/report/printReport?" +
			"queryType="+queryType+"&startTime="+startTime+"&endTime="+endTime+
			"&branchNameOrCode="+branchNameOrCode+"&cashierId="+cashierId);
}
/**
 * 重置
 */
var resetForm = function(){
	$("#queryForm")[0].reset();
};



/**
 * GPE获取columns
 */
function initGridByGpeGridColumns(){
	// 初始化表格
	publicGpeGridColumns({
		tabKey : tabKey,
		onLoadSuccess:function(columns,frozenColumns){
			initCashDailyGrid(columns,frozenColumns);
		}
	});
}

/**
 * GPE设置
 */
function toGpeSetting(){
	publicGpeSetting({
		tabKey : tabKey,
		onSettingChange:function(columns,frozenColumns){
			initCashDailyGrid(columns,frozenColumns);
		}
	});
}

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : "cashDaily",
		queryParams : $("#queryForm").serializeObject()
	});
}
