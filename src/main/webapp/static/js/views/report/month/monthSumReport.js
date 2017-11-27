$(function() {
	// 初始化表格
	publicGpeGridColumns({
		onLoadSuccess : function(columns, frozenColumns) {
			initDatagridYueJXC(columns, frozenColumns);
		}
	});
	branchId = $("#branchId").val();
});

function updateWdatePicker() {
	WdatePicker({
		dateFmt : 'yyyy-MM',
		maxDate : '%y-%M',
		onpicked : function(dp) {
			$("input:radio[name='dateradio']").attr("checked", false);
		}
	})
}

var datagridId = "yueJXCList"
var gridHandel = new GridClass();
var gridYueJXCList;

// 初始化表格
function initDatagridYueJXC(columns, frozenColumns) {
	gridYueJXCList = $("#" + datagridId).datagrid({
		method : 'post',
		align : 'center',
		singleSelect : false, // 单选 false多选
		rownumbers : true, // 序号
		pagination : true, // 分页
		showFooter : true,
		fitColumns : false, // 每列占满
		height : '100%',
		width : '100%',
		pageSize : 50,
		columns : columns,
		frozenColumns : frozenColumns,
		onLoadSuccess : function(data) {
			if ($("#createBranchId").val() && data.total <= 0){
				$_jxc.alert("该机构可能未月结,请先月结!");				
			}
		}
	});
}

// 查询
function queryForm() {
	// 清除分页信息
	$("#startCount").val("");
	$("#endCount").val("");
	if ($("#branchName").val() == "" && $("#skuCodeOrBarCode").val() == "") {
		$_jxc.alert("请选择机构或输入条码");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	$("#" + datagridId).datagrid("options").method = "post";
	$("#" + datagridId).datagrid('options').url = contextPath
			+ '/report/month/list';
	$("#" + datagridId).datagrid('load', fromObjStr);
}

/**
 * 机构名称
 */
function selectBranches() {
	new publicAgencyService(function(data) {
		$("#createBranchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
	}, '', sessionBranchId);
}

/**
 * 类别选择
 */
function searchCategory() {
	new publicCategoryService(function(data) {
		$("#categoryCode").val(data.categoryCode);
		$("#categoryNameCode").val(
				"[" + data.categoryCode + "]" + data.categoryName);
	});
}

/**
 * 重置
 */
var resetForm = function() {
	$("#queryForm").form('clear');
};

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : datagridId,
		queryParams : $("#queryForm").serializeObject()
	});
}

/**
 * GPE设置
 */
function toGpeSetting() {
	publicGpeSetting({
		onSettingChange : function(columns, frozenColumns) {
			initDatagridYueJXC(columns, frozenColumns);
		}
	});
}