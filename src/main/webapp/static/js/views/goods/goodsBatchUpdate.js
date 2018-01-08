/**
 * added by zhangqin on 2017/4/17
 * 商品批量修改
 */
//网格对象
var gridHandel = new GridClass();

$(function(){
	//绑定元素的事件
	bindElementEvent();
	//初始元素的状态
	changeElementStatus();
	//初始化查询表单
	initQueryForm();
	//初始化网格
	initGrid();
});

//绑定元素的事件
function bindElementEvent(){
	$("#managerStockChecked,#allowActivityChecked,#fastDeliverChecked,#highValueChecked,#attentionChecked,#supplierRateChecked,#allowGiftChecked").click(function (){
		changeElementStatus(this);
	});
	$("#allowAdjustChecked,#safetyCoefficientChecked,#supplierChecked,#categoryChecked,#brandChecked,#safetyCoefficientCascadeChecked,#supplierCascadeChecked").click(function (){
		changeElementStatus(this);
	});
	$("#purchaseChecked,#distributionChecked").click(function (){
		changeElementStatus(this);
	});
}

//初始化查询表单
function initQueryForm(){
	//默认机构
	$_jxc.ajax({
		url : contextPath + "/common/getCurrentBranch"
	},function(result){
		if(result.code == 0){
			$("#branchId").val(result.data.branchesId);
			$("#branchName").val("["+result.data.branchCode+"]"+result.data.branchName);
			changeBranchType(result.data.type);
		}else{
			$_jxc.alert("请求发送失败或服务器处理失败");
		}
	});
}

//初始化网格
function initGrid(){
	gridHandel.setGridName("goodsGrid");
	$("#goodsGrid").datagrid({
		method : 'post',
		align : 'center',
		singleSelect : false, // 单选 false多选
		rownumbers : true, // 序号
		pagination : true, // 分页
		pageSize : 50,
		fitColumns : true, // 每列占满
		showFooter : true,
		height:'100%',
		width:'100%',
		columns : [ [
			{
				field : 'check',
				checkbox : true
			}, {
				field : 'skuCode',
				title : '货号',
				width : '80px',
				align : 'left'
			}, {
				field : 'skuName',
				title : '名称',
				width : '140px',
				align : 'left'
			}, {
				field : 'barCode',
				title : '条码',
				width : '120px',
				align : 'left'
			}, {
				field : 'unit',
				title : '单位',
				width : '80px',
				align : 'left'
			}, {
				field : 'spec',
				title : '规格',
				width : '80px',
				align : 'left'
			},{
				field : "salePrice",
				title : "零售价",
				sortable : true,
				tooltip : true,
				width : 80,
				align : 'right',
				formatter : function(value, row, index) {
					if (value) {
						return parseFloat(value).toFixed(4);
					}
					return null;
				}
			}, {
				field : 'category',
				title : '类别',
				width : '80px',
				align : 'left'
			}, {
				field : "brand",
				title : "品牌",
				sortable : true,
				tooltip : true,
				width : 80
			}, {
				field : "supplier",
				title : "主供应商",
				sortable : true,
				tooltip : true,
				width : 140
			}, {
				field : 'safetyCoefficient',
				title : '安全库存系数',
				width : '80px',
				align : 'left'
			}, {
				field : 'isManagerStock',
				title : '管理库存',
				width : '80px',
				align : 'left',
				formatter : function(value, row, index) {
					if (value == 1) {
						return "是";
					} else {
						return "否";
					}
				}
			}, {
				field : 'allowActivity',
				title : '参与促销',
				width : '80px',
				align : 'left',
				formatter : function(value, row, index) {
					if (value == true) {
						return "是";
					} else {
						return "否";
					}
				}
			}, {
				field : 'allowAdjust',
				title : '分店调价',
				width : '80px',
				align : 'left',
				formatter : function(value, row, index) {
					if (value == true) {
						return "是";
					} else {
						return "否";
					}
				}
			}, {
				field : 'isFastDeliver',
				title : '直送商品',
				width : '80px',
				align : 'left',
				formatter : function(value, row, index) {
					if (value == 1) {
						return "是";
					} else {
						return "否";
					}
				}
			} 
		] ],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
    });
}

// 选择机构
function chooseBranch (formId){
	new publicAgencyService(function(data){
		$("#" + formId + " #branchId").val(data.branchesId);
		$("#" + formId + " #branchName").val("["+data.branchCode+"]"+data.branchName);
		changeBranchType(data.type);
		
		//清空表格
		$("#goodsGrid").datagrid("loadData", { total: 0, rows: [] });
	},"","");
}

//回车或失去焦点后，查询品牌
function branchAutoComple(){
	//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
	if(event.keyCode && event.keyCode != 13){
		return;
	}
	var keyword = $("#queryForm #branchName").val();
	//未输入值时，直接返回，无需查询
	if("" == keyword){
		$("#queryForm #branchId").val("");
		return;
	}
	//避免用户直接输入完整格式: [编号]名称
	var reg = /\[\d{5}\]/;
	if(reg.test(keyword)){
		//取出[]里的编号，默认取已第一个[]里的值
		reg = /\[(\d{5})\]/;
		arr = reg.exec(keyword);
		keyword = arr[1];
	}
	//请求数据
	var httpUrl = contextPath + "/common/getBranchListByKeyword";
	var args = {"keyword" : keyword};
	$.post(httpUrl, args,function(result){
		var data = result.data;
		if(null != data && data.length == 1){
			var branchId = data[0].branchesId;
			var branchName = data[0].branchName;
			var branchCode = data[0].branchCode;
			//完善文本显示
			$("#queryForm #branchName").val("["+branchCode+"]"+branchName);
			//记录ID值,用于后台查询
			$("#queryForm #branchId").val(branchId);
		} else {
			//未查询到数据或多条数据，设置无效ID
			$("#queryForm #branchId").val("-1");
		}
	});
}

//选择商品类别（查询表单）
function chooseGoodsCategoryForQueryForm(){
	new publicCategoryService(function(data){
		$("#queryForm #categoryCode").val(data.categoryCode);
		$("#queryForm #categoryName").val("["+data.categoryCode+"]"+data.categoryName);
	},null);
}

//回车或失去焦点后，查询供应商
function categoryAutoComple(){
	//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
	if(event.keyCode && event.keyCode != 13){
		return;
	}
	var categoryNameOrCode = $("#queryForm #categoryName").val();
	//未输入值时，直接返回，无需查询
	if("" == categoryNameOrCode){
		$("#queryForm #categoryCode").val("");
		return;
	}
	//避免用户直接输入完整格式: [编号]名称
	var reg = /\[\d+\]/;
	if(reg.test(categoryNameOrCode)){
		//取出[]里的编号，默认取已第一个[]里的值
		reg = /\[(\d+)\]/;
		arr = reg.exec(categoryNameOrCode);
		categoryNameOrCode = arr[1];
		return;
	}
	//请求数据
	var httpUrl = contextPath + "/common/category/getComponentList";
	var args = {"categoryNameOrCode" : categoryNameOrCode};
	$.post(httpUrl, args,function(data){
		if(null != data && data.list.length == 1){
			var categoryName = data.list[0].categoryName;
			var categoryCode = data.list[0].categoryCode;
			//完善文本显示
			$("#queryForm #categoryName").val("["+categoryCode+"]"+categoryName);
			//记录ID值,用于后台查询
			$("#queryForm #categoryCode").val(categoryCode);
		} else {
			//未查询到数据或多条数据，设置无效ID
			$("#queryForm #categoryCode").val("-1");
		}
	});
}

//选择商品类别（提交表单）
function chooseGoodsCategoryForUpdateForm(){
	var param = {
		categoryType:'goodsTotal'
	};
	new publicCategoryService(function(data){
		$("#batchUpdateForm #categoryId").val(data.goodsCategoryId);
		$("#batchUpdateForm #categoryCode").val(data.categoryCode);
		$("#batchUpdateForm #categoryName").val("["+data.categoryCode+"]"+data.categoryName);
	},param);
}

//选择商品品牌
function chooseGoodsBrand(formId){
	new publicBrandService(function(data){
		$("#" + formId + " #brandId").val(data.id);
		$("#" + formId + " #brandName").val("["+data.brandCode+"]"+data.brandName);
	});
}

//选择供应商
function chooseSupplier(formId){
	new publicSupplierService(function(data){
		$("#" + formId + " #supplierId").val(data.id);
		$("#" + formId + " #supplierName").val(data.supplierName);
		$("#" + formId + " #saleWay").val(data.saleWay)
		
		//级联联营扣率
		changeSupplierRateElement();
	});
}

//回车或失去焦点后，查询供应商
function supplierAutoComple(){
	//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
	if(event.keyCode && event.keyCode != 13){
		return;
	}
	var supplierNameOrsupplierCode = $("#queryForm #supplierName").val();
	var branchId=$("#branchId").val();
	//未输入值时，直接返回，无需查询
	if("" == supplierNameOrsupplierCode){
		$("#queryForm #supplierId").val("");
		return;
	}
	//避免用户直接输入完整格式: [编号]名称
	var reg = /\[\d{6}\]/;
	if(reg.test(supplierNameOrsupplierCode)){
		//取出[]里的编号，默认取已第一个[]里的值
		reg = /\[(\d{6})\]/;
		arr = reg.exec(supplierNameOrsupplierCode);
		supplierNameOrsupplierCode = arr[1];
	}
	//请求数据
	var httpUrl = contextPath + "/common/supplier/getComponentList";
	var args = {"supplierNameOrsupplierCode" : supplierNameOrsupplierCode,"branchId" : branchId};
	$.post(httpUrl, args,function(data){
		if(null != data && data.list.length == 1){
			var supplierId = data.list[0].id;
			var supplierName = data.list[0].supplierName;
			var supplierCode = data.list[0].supplierCode;
			//完善文本显示
			$("#queryForm #supplierName").val("["+supplierCode+"]"+supplierName);
			//记录ID值,用于后台查询
			$("#queryForm #supplierId").val(supplierId);
		} else {
			//未查询到数据或多条数据，设置无效ID
			$("#queryForm #supplierId").val("-1");
		}
	});
}

//禁用表单所有元素
function diabledAll(){
	$("#batchUpdateForm input:radio").attr("disabled",true);
	$("#batchUpdateForm input:checkbox").attr("disabled",true).removeAttr("checked");
	
	//隐藏打开弹窗的...
	$("#openSupplierMore").prop('hidden',true);
	$("#openCategoryMore").prop('hidden',true);
	$("#openBrandMore").prop('hidden',true);
	
	//禁用安全库存系数
	$("#safetyCoefficient").numberbox("readonly", true);
	//禁用联营扣率
	$("#supplierRate").numberbox("readonly", true);
}

//处理页面元素禁用与启用状态
function changeElementStatus(input){
	//input为空时，禁用页面元素
	if(undefined == input){
		diabledAll();
		return;
	}
	
	//是否管理库存
	if(input.id == "managerStockChecked"){
		if($("#managerStockChecked").is(':checked')){
			$("#managerStockChecked").val(true);
			$("input[name='managerStock']").removeAttr("disabled");
		}else{
			$("#managerStockChecked").val(false);
			$("input[name='managerStock']").attr("disabled",true);
		}
	}

	//是否参与促销
	if(input.id == "allowActivityChecked"){
		if($("#allowActivityChecked").is(':checked')){
			$("#allowActivityChecked").val(true);
			$("input[name='allowActivity']").removeAttr("disabled");
		}else{
			$("#allowActivityChecked").val(false);
			$("input[name='allowActivity']").attr("disabled",true);
		}
	}

	//是否直送商品
	if(input.id == "fastDeliverChecked"){
		if($("#fastDeliverChecked").is(':checked')){
			$("#fastDeliverChecked").val(true);
			$("input[name='fastDeliver']").removeAttr("disabled");
		}else{
			$("#fastDeliverChecked").val(false);
			$("input[name='fastDeliver']").attr("disabled",true);
		}
	}

	//是否高值商品
	if(input.id == "highValueChecked"){
		if($("#highValueChecked").is(':checked')){
			$("#highValueChecked").val(true);
			$("input[name='highValue']").removeAttr("disabled");
		}else{
			$("#highValueChecked").val(false);
			$("input[name='highValue']").attr("disabled",true);
		}
	}

	//是否关注商品
	if(input.id == "attentionChecked"){
		if($("#attentionChecked").is(':checked')){
			$("#attentionChecked").val(true);
			$("input[name='attention']").removeAttr("disabled");
		}else{
			$("#attentionChecked").val(false);
			$("input[name='attention']").attr("disabled",true);
		}
	}

	//分店调价
	if(input.id == "allowAdjustChecked"){
		if($("#allowAdjustChecked").is(':checked')){
			$("#allowAdjustChecked").val(true);
			$("input[name='allowAdjust']").removeAttr("disabled");
		}else{
			$("#allowAdjustChecked").val(false);
			$("input[name='allowAdjust']").attr("disabled",true);
		}
	}

    //是否关注商品
    if(input.id == "allowGiftChecked"){
        if($("#allowGiftChecked").is(':checked')){
            $("#allowGiftChecked").val(true);
            $("input[name='allowGift']").removeAttr("disabled");
        }else{
            $("#allowGiftChecked").val(false);
            $("input[name='allowGift']").attr("disabled",true);
        }
    }

	//安全库存系数
	if(input.id == "safetyCoefficientChecked"){
		if($("#safetyCoefficientChecked").is(':checked')){
			$("#safetyCoefficientChecked").val(true);
			$("#safetyCoefficient").numberbox("readonly",false);
			$("input[name='safetyCoefficientCascadeChecked']").removeAttr("disabled").prop("checked","checked");
		}else{
			$("#safetyCoefficientChecked").val(false);
			$("#safetyCoefficient").numberbox("readonly", true);
			$("input[name='safetyCoefficientCascadeChecked']").attr("disabled",true).removeAttr("checked");
		}
	}
	
	if($("#safetyCoefficientCascadeChecked").is(':checked')){
		$("#safetyCoefficientCascadeChecked").val(true);
	}else{
		$("#safetyCoefficientCascadeChecked").val(false);
	}
	
	//修改主供应商
	if(input.id == "supplierChecked"){
		if($("#supplierChecked").is(':checked')){
			$("#supplierChecked").val(true);
			$("input[name='supplierCascadeChecked']").removeAttr("disabled").prop("checked","checked");
			$("#openSupplierMore").prop('hidden',false);
		}else{
			$("#supplierChecked").val(false);
			$("input[name='supplierCascadeChecked']").attr("disabled",true).removeAttr("checked");
			$("#openSupplierMore").prop('hidden',true);
		}
		
		//级联联营扣率
		changeSupplierRateElement();
	}
	
	//修改联营扣率
	if(input.id == "supplierRateChecked"){
		if($("#supplierRateChecked").is(':checked')){
			$("#supplierRateChecked").val(true);
		}else{
			$("#supplierRateChecked").val(false);
		}
		
		//级联联营扣率
		changeSupplierRateElement();
	}

	if($("#supplierCascadeChecked").is(':checked')){
		$("#supplierCascadeChecked").val(true);
		//级联联营扣率
		changeSupplierRateElement();
	}else{
		$("#supplierCascadeChecked").val(false);
		//级联联营扣率
		changeSupplierRateElement();
	}
	
	//修改商品类别
	if(input.id == "categoryChecked"){
		if($("#categoryChecked").is(':checked')){
			$("#categoryChecked").val(true);
			$("#openCategoryMore").prop('hidden',false);
		}else{
			$("#categoryChecked").val(false);
			$("#openCategoryMore").prop('hidden',true);
		}
	}

	//修改商品品牌
	if(input.id == "brandChecked"){
		if($("#brandChecked").is(':checked')){
			$("#brandChecked").val(true);
			$("#openBrandMore").prop('hidden',false);
		}else{
			$("#brandChecked").val(false);
			$("#openBrandMore").prop('hidden',true);
		}
	}
	
	//修改进货规格
	if(input.id == "purchaseChecked"){
		if($("#purchaseChecked").is(':checked')){
			$("#purchaseChecked").val(true);
			$("#purchaseSpec").numberbox("readonly",false);
		}else{
			$("#purchaseChecked").val(false);
			$("#purchaseSpec").numberbox("readonly",true);
		}
	}
	
	//修改配送规格
	if(input.id == "distributionChecked"){
		if($("#distributionChecked").is(':checked')){
			$("#distributionChecked").val(true);
			$("#distributionSpec").numberbox("readonly",false);
		}else{
			$("#distributionChecked").val(false);
			$("#distributionSpec").numberbox("readonly",true);
		}
	}
}

function changeSupplierRateElement(){
	//是否勾选修改供应商
	var supplierChecked = $("#supplierChecked").is(':checked');
	//是否勾选同时修改门店供应商
	var supplierCascadeChecked = $("#supplierCascadeChecked").is(':checked');
	//是否勾选修改联营扣率
	var supplierRateChecked = $("#supplierRateChecked").is(':checked');
	//供应商类型
	var saleWay = $("#saleWay").val();
	
	//勾选了修改供应商，且供应商类型为联营或扣率代销时，才可以勾选修改联营扣率
	if(supplierChecked && (saleWay == 'C' || saleWay == 'D')){
		$("#supplierRateChecked").removeAttr("disabled");
	}else{
		$("#supplierRateChecked").attr("disabled",true).removeAttr("checked");
	}
	
	//勾选了修改供应商，且勾选了修改联营扣率，且供应商类型为联营或扣率代销时，联营扣率才可修改
	if(supplierChecked && supplierRateChecked && (saleWay == 'C' || saleWay == 'D')){
		$("#supplierRate").numberbox("readonly",false);
		//是否同时修改联营扣率跟随是否同时更新门店主供应商
		if(supplierCascadeChecked){
			$("input[name='supplierRateCascadeChecked']").prop("checked","checked");
		}else{
			$("input[name='supplierRateCascadeChecked']").removeAttr("checked");
		}
	}else{
		$("#supplierRate").numberbox("readonly",true);
		$("input[name='supplierRateCascadeChecked']").removeAttr("checked");
	}
}

//切换机构类型
function changeBranchType(branchType){
	//先禁用所有
	diabledAll();
	
	//再根据机构类别放开相应项目
	switch (branchType){
		//总部仅可修改：是否管理库存、是否高值商品、是否关注商品、修改商品类别、修改商品品牌、进货规格、配送规格
		case 0:
			$("#managerStockChecked,#highValueChecked,#attentionChecked,#categoryChecked,#brandChecked,#purchaseChecked,#distributionChecked,#allowGiftChecked").removeAttr("disabled");
			break;
		//分公司仅可修改：是否参与促销、是否直送商品、分店调价、安全库存系数、修改主供应商(物流中心暂当分公司处理)、进货规格、配送规格
		case 1:
			$("#allowActivityChecked,#fastDeliverChecked,#allowAdjustChecked,#safetyCoefficientChecked,#supplierChecked,#purchaseChecked,#distributionChecked,#allowGiftChecked").removeAttr("disabled");
			break;
		case 2:
		//门店仅可修改：安全库存系数、修改主供应商
		case 3:
		case 4:
		case 5:
		default:
			$("#safetyCoefficientChecked,#supplierChecked,#allowGiftChecked").removeAttr("disabled");
			break;
	}
}

//查询
function query(){
	var formData = $("#queryForm").serializeObject();
	formData.goodsTypeNonList = 5; // 不包括奖券类型
	
	$("#goodsGrid").datagrid("options").queryParams = formData;
	$("#goodsGrid").datagrid("options").method = "post";
	$("#goodsGrid").datagrid("options").url = contextPath+"/goods/report/getList";
	$("#goodsGrid").datagrid("load");
}

//导入
function importExcel(type){
	var branchId = $("#branchId").val();
	if(!branchId){
		$_jxc.alert("请先选择机构");
		return;
	}
	var param = {
		url:contextPath + "/goods/batchUpdate/import",
		tempUrl:contextPath+"/goods/batchUpdate/importTemplate",
		type:type,
		branchId:branchId
	};
	new publicUploadFileService(function(data){
		var keyNames = {
			
		};
		var rows = gFunUpdateKey(data,keyNames);
		//var argWhere ={skuCode:1};  //验证重复性
		//var isCheck ={isGift:1 };   //只要是赠品就可以重复
		//var newRows = gridHandel.checkDatagrid(rows,argWhere,isCheck);

		$("#goodsGrid").datagrid("loadData",rows);
	},param)
}

//保存
function save(){
	//表单序列化
	var reqObj = $("#batchUpdateForm").serializeObject();
	
	//机构ID
	var branchId = $("#branchId").val();
	reqObj.branchId = branchId;
	
	//选中的商品
	var rows = $("#goodsGrid").datagrid("getSelections");
	if (!rows || rows.length == 0) {
		$_jxc.alert("未选择商品");
		return;
	}
	var skuIds = [];
	for (var i in rows) {
		skuIds[i]=rows[i].skuId;
	}
	reqObj.skuIds = skuIds;
	
	//解析Json
	var req = JSON.stringify(reqObj);
	
	//请求提交
	$_jxc.ajax({
		url : contextPath + "/goods/batchUpdate/save",
		contentType : 'application/json',
		data : req
	},function(result){
		if (result['code'] == 0) {
			$_jxc.alert("操作成功！",function() {
				
			});
		} else {
			$_jxc.alert(result['message']);
		}
	});
}