<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>新增直送收货单</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/purchase/directReceipt/directReceipt.js?V=${versionNo}"></script>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<input type='hidden' id="directStatus" value="add">
	<input type='hidden' id="cascadeGoods" name="cascadeGoods" value="${cascadeGoods}">
	<!-- 允许直送收货单不引用单据收货：0.否，1.是 ${isAllowPmRefPa} -->
	<input type='hidden' id="isAllowPmRefPa" name="isAllowPmRefPa" value="-1">
	<input type="hidden" id="formId"  name="formId" value="">
	<div class="ub ub-ver ub-f1 umar-4  ubor">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcDirectReceipt:add">
					<div class="ubtns-item" onclick="directAdd()">新增</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcDirectReceipt:add">
					<div class="ubtns-item" id="btnSave" onclick="saveDirectForm()">保存</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcDirectReceipt:audit">
					<div class="ubtns-item uinp-no-more event-none pmreBtn">审核</div>
				</shiro:hasPermission>
				<div class="ubtns-item  pmreBtn" onClick="selectGoods()">商品选择</div>
				<shiro:hasPermission name="JxcDirectReceipt:import">
					<div class="ubtns-item  pmreBtn" onClick="importDirectForm(0)">导入货号</div>
					<div class="ubtns-item  pmreBtn" onClick="importDirectForm(1)">导入条码</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcDirectReceipt:delete">
					<div class="ubtns-item uinp-no-more event-none pmreBtn">删单</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcDirectReceipt:print">
					<div class="ubtns-item uinp-no-more event-none pmreBtn">打印</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcDirectReceipt:export">
				<div class="ubtns-item uinp-no-more event-none pmreBtn">导出明细</div>
				</shiro:hasPermission>
				
				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>
		</div>
		<form id="addqueryForm" action="" method="post">
			<div class="ub umar-t8">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-60 ut-r">采购订单:</div>
					<input id="refFormNo" class="uinp" readonly="readonly" type="text" value="${form.formNo}" onclick="selectPurchaseForm()">
					<input type="hidden" id="refFormId"  name="refFormId" value="${form.id}">
					<input type='hidden' id="taxRate" name="taxRate" value="${form.taxRate}">
					<div class="uinp-more" onclick="selectPurchaseForm()">...</div>
				</div>
				<div class="ub ub-ac umar-l80">
					<div class="umar-r10 uw-60 ut-r">付款期限:</div>
					<input id="paymentTime" class="Wdate"  type="text" value="${form.paymentTimeStr}" 
						onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true})" />
				</div>
				<div class="ub ub-ac umar-l80">
					<div class="umar-r10 uw-60 ut-r">制单人员:</div>
					<div class="utxt">${user.userName}</div>
				</div>
				<div class="ub ub-ac">
					<div class="umar-r10 uw-60 ut-r">制单时间:</div>
					<div class="utxt" id="createTime"></div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac" id="branchComponent">
					<div class="umar-r10 uw-60 ut-r">收货机构:</div>
					<input class="uinp" name="branchId" id="branchId" type="hidden" value="${form.branchId}"> 
					<input id="branchName" class="uinp " value="${form.branchName}" readonly="readonly" type="text">
					<div class="uinp-more">...</div>
				</div>
				<div class="ub ub-ac umar-l80">
					<div class="umar-r10 uw-60 ut-r">采购员:</div>
					<input class="uinp" name="salesmanId" id="salesmanId" type="hidden" value="${form.salesmanId }">
					<input class="uinp " id="salesmanName"  name="salesmanName" value="${form.salesmanName }" type="text" readonly="readonly">
				</div>
				<div class="ub ub-ac umar-l60">
					<div class="umar-r10 uw-80 ut-r">最后修改人:</div>
					<div class="utxt"></div>
				</div>
				<div class="ub ub-ac">
					<div class="umar-r10 uw-60 ut-r">修改时间:</div>
					<div class="utxt"></div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac" id="supplierComponent">
					<div class="umar-r10 uw-60 ut-r">供应商:</div>
					<input class="uinp" name="supplierId" id="supplierId" type="hidden" value="${form.supplierId}"> 
					<input class="uinp " id="supplierName" value="${form.supplierName}" type="text" readonly="readonly">
					<div class="uinp-more">...</div>
				</div>
				<div class="ub ub-ac umar-l80">
					<div class="umar-r10 uw-60 ut-r">经营方式:</div>
					<input id="saleWay" class="uinp" type="hidden"> 
					<input id="saleWayName" class="uinp" value="${form.saleWayStr}" readonly="readonly" type="text">
				</div>
				<div class="ub ub-ac umar-l80">
					<div class="umar-r10 uw-60 ut-r">审核人员:</div>
					<div class="utxt"></div>
				</div>
				<div class="ub ub-ac">
					<div class="umar-r10 uw-60 ut-r">审核时间:</div>
					<div class="utxt"></div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r80">
					<div class="umar-r10 uw-60 ut-r">备注:</div>
					<input id="remark" class="uinp" type="text" style="width: 800px">
				</div>
			</div>
		</form>
		<!--datagrid-edit-->
		<from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
		<table id="gridDirectDetail" ></table>
		</from>

	</div>
	<!-- 是否有改价权限 -->
    <shiro:hasPermission name="JxcDirectReceipt:updatePrice">
        <input type="hidden" id="allowUpdatePrice" />
    </shiro:hasPermission>

</body>
</html>