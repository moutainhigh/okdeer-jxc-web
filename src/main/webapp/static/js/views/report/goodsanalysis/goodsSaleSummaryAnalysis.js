/**
 * 商品销售汇总分析
 */
$(function() {
	// 初始化默认条件
	initConditionParams();

	// 初始化表格
	initGridByGpeGridColumns();
});

var tabKey = 'byGoods';

// 初始化默认条件
function initConditionParams() {
	// 选择报表类型
	changeType();

	// 开始和结束时间
	if (!$("#txtStartDate").val()) {
		// 开始和结束时间
		$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev", 30));
		$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));

		$("#categoryTypeDiv").hide();
		$("#categoryType").combobox("disable");
	} else {
		flushFlg = true;
		$('input:radio[name=searchType]')[0].checked = true;
		$('input:radio[name=searchType]')[0].click();
	}

	// 供应商选择初始化
	$('#supplierComponent').supplierSelect({
		// 数据过滤
		loadFilter : function(data) {
			data.supplierId = data.id;
			return data;
		}
	});

	// 店铺初始化
	$('#branchComple').branchSelect({
		onAfterRender : function(data) {
			$("#branchId").val(data.branchId);
		}
	});

	// 商品类别选择组件
	$('#categoryNameDiv').categorySelect({
		onAfterRender : function(data) {
			$("#goodsCategoryId").val(data.goodsCategoryId);
			$("#categoryCode").val(data.categoryCode);
		}
	});
}

var flushFlg = false;

function changeType() {
	$(".radioItem").on("click", function() {
		flushFlg = true;
		resetCondition();
		tabKey = $(this).val();
		$("#tabKey").val(tabKey);
		
		$("#goodsTotalAnalysi").datagrid("options").url = "";
		if (tabKey == "byGoods") {
			// 按商品汇总
			changeSkuNameStatus(true);
			changeCategoryStatus(true);
			changeSkuCodeOrBarCodeStatus(true);
			changeSupplierStatus(true);
		} else if (tabKey == "byStore") {
			// 初始化列表按店铺汇总
			changeSkuNameStatus(false);
			changeCategoryStatus(false);
			changeSkuCodeOrBarCodeStatus(false);
			changeSupplierStatus(false);
		} else if (tabKey == "byGigCategory") {
			// 初始化列表按类别汇总
			changeSkuNameStatus(false);
			changeCategoryStatus(true);
			changeSkuCodeOrBarCodeStatus(false);
			changeSupplierStatus(false);
		} else if (tabKey == "byStoreGoods") {
			// 按店铺商品汇总
			changeSkuNameStatus(true);
			changeCategoryStatus(true);
			changeSkuCodeOrBarCodeStatus(true);
			changeSupplierStatus(false);
		}
		$("#goodsTotalAnalysi").datagrid('loadData', {
			total : 0,
			rows : []
		});
		$('#goodsTotalAnalysi').datagrid({
			showFooter : false
		});

		// 重新初始表格
		initGridByGpeGridColumns();
	});
}

// 重置条件
function resetCondition() {
	$("#categoryName").val("");
	$("#categoryCode").val("");
	$("#skuName").val("");
	$("#skuCodeOrBarCode").val("");
}

// 切换商品类别显示状态
function changeCategoryStatus(bool){
	if (bool) {
		$("#categoryName").removeClass("uinp-no-more");
		$("#categorySelect").attr("onclick", "searchCategory()");
		$("#categoryName").removeProp("readonly");
	} else {
		$("#categoryName").addClass("uinp-no-more");
		$("#categorySelect").removeAttr("onclick");
		$("#categoryName").prop("readonly", "readonly");
		$("#categoryName").val("");
	}
}

// 切换商品名称显示状态
function changeSkuNameStatus(bool) {
	if (bool) {
		$("#skuName").removeClass("uinp-no-more");
		$("#skuName").removeProp("readonly");
	} else {
		$("#skuName").prop("readonly", "readonly");
		$("#skuName").addClass("uinp-no-more");
		$("#skuName").val("");
	}
}

//切换货号/条码显示状态
function changeSkuCodeOrBarCodeStatus(bool){
	if (bool) {
		$("#skuCodeOrBarCode").removeClass("uinp-no-more");
		$("#skuCodeOrBarCode").removeProp("readonly");
	} else {
		$("#skuCodeOrBarCode").prop("readonly", "readonly");
		$("#skuCodeOrBarCode").addClass("uinp-no-more");
		$("#skuCodeOrBarCode").val("");
	}
}

// 切换供应商显示状态
function changeSupplierStatus(bool){
	if (bool) {
		$("#supplierName").removeClass("uinp-no-more");
		$("#supplierName").removeProp("readonly");
	} else {
		$("#supplierName").prop("readonly", "readonly");
		$("#supplierName").addClass("uinp-no-more");
		$("#supplierName").val('');
	}
}

var gridHandel = new GridClass();
var gridName = "goodsTotalAnalysi";

/**
 * 初始化Grid
 * @param columns
 */
var dg;
function initGoodsSaleSummaryAnalysisGrid(columns,frozenColumns) {
	gridHandel.setGridName("goodsTotalAnalysi");
	dg = $("#goodsTotalAnalysi").datagrid({
		method : 'post',
		align : 'center',
		singleSelect : false,
		rownumbers : true,
		pagination : true,
		fitColumns : false,
		showFooter : false,
		pageSize : 50,
		height : '100%',
		width : '100%',
		columns : columns,
		frozenColumns : frozenColumns,
		onBeforeLoad : function(data) {
			gridHandel.setDatagridHeader("center");
		}
	});
}

/**
 * 查询
 */
function purchaseTotalCx() {
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchName = $("#branchName").val();
	var categoryType = $('input[name="searchType"]:checked ').val();
	if (!(startDate && endDate)) {
		$_jxc.alert('日期不能为空');
		return;
	}
	$("#startCount").val('');
	$("#endCount").val('');
	var formData = $("#queryForm").serializeObject();
	$("#goodsTotalAnalysi").datagrid("options").url = "";
	$('#goodsTotalAnalysi').datagrid({
		showFooter : true
	});
	$("#goodsTotalAnalysi").datagrid("options").queryParams = formData;
	$("#goodsTotalAnalysi").datagrid("options").method = "post";
	$("#goodsTotalAnalysi").datagrid("options").url = contextPath
			+ "/report/goodsTotalAnalysi/list";
	$("#goodsTotalAnalysi").datagrid("load");
}

/**
 * 机构列表下拉选
 */
function searchBranch() {
	new publicAgencyService(function(data) {
		$("#branchId").val(data.branchesId);
		$("#branchCompleCode").val(data.branchCompleCode);
		$("#branchName").val("[" + data.branchCode + "]" + data.branchName);
	}, "", "");
}

/**
 * 商品类别
 */
function searchCategory() {
	var categoryType = $('input[name="searchType"]:checked ').val();
	var param = {
		categoryType : categoryType
	}
	new publicCategoryService(function(data) {
		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val(data.categoryName);
	}, param);
}

/**
 * GPE获取columns
 */
function initGridByGpeGridColumns(){
	// 初始化表格
	publicGpeGridColumns({
		tabKey : tabKey,
		onLoadSuccess:function(columns,frozenColumns){
			initGoodsSaleSummaryAnalysisGrid(columns,frozenColumns);
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
			initGoodsSaleSummaryAnalysisGrid(columns,frozenColumns);
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