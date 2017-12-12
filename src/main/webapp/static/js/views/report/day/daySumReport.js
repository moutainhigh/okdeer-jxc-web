$(function() {
	// 初始化默认条件
	initConditionParams();

	// 机构选择初始化
	$('#branchSelects').branchSelect({
		param : {
			formType : 'BF'
		}
	});

	// 初始化表格
	publicGpeGridColumns({
		onLoadSuccess:function(columns,frozenColumns){
			initDaySumGrid(columns,frozenColumns);
		}
	});
});

var dg;
var gridHandle = new GridClass();
var gridName = "daySumReport";

// 初始化默认条件
function initConditionParams() {
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev", 30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}

// 初始化表格
function initDaySumGrid(columns,frozenColumns) {
	gridHandle.setGridName(gridName);
	dg = $("#" + "daySumReport").datagrid({
		method : 'post',
		align : 'center',
		singleSelect : false,
		rownumbers : true,
		pagination : true,
		fitColumns : false,
		showFooter : true,
		pageSize : 50,
		height : '100%',
		width : '100%',
		columns : columns,
		frozenColumns : frozenColumns,
		onBeforeLoad : function(param) {
			gridHandle.setDatagridHeader("center");
		},
		onLoadSuccess:function(){
			gridHandle.setDatagridFooter();
		}
	});
}

// 查询
function queryForm() {
	$("#startCount").attr("value", null);
	$("#endCount").attr("value", null);
	var fromObjStr = $("#queryForm").serializeObject();
	fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']') + 1);

	dg.datagrid("options").queryParams = fromObjStr;
	dg.datagrid("options").method = "post";
	dg.datagrid("options").url = contextPath + '/report/day/list';
	dg.datagrid("load");
}

/**
 * 重置
 */
function resetForm() {
	$("#queryForm").form('clear');
};

/**
 * GPE设置
 */
function toGpeSetting() {
	publicGpeSetting({
		onSettingChange:function(columns,frozenColumns){
			initDaySumGrid(columns,frozenColumns);
		}
	});
}

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : gridName,
		queryParams : $("#queryForm").serializeObject()
	});
}