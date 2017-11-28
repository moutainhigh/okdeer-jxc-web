<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>收货单-修改</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script
	src="${ctx}/static/js/views/purchase/receiptEdit.js?V=${versionNo}"></script>
<script
	src="${ctx}/static/js/views/purchase/purchaseExport.js?V=${versionNo}"></script>

<%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4  ubor">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcPurchaseReceipt:add">
					<div class="ubtns-item" onclick="receiptAdd()">新增</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="saveItemHandel()">保存</div>

				<shiro:hasPermission name="JxcPurchaseReceipt:audit">
					<div class="ubtns-item" onclick="check()">审核</div>
				</shiro:hasPermission>
				<!--<div class="ubtns-item" onclick="selectGoods()">商品选择</div>-->
				<shiro:hasPermission name="JxcPurchaseReceipt:delete">
					<div class="ubtns-item" onclick="orderDelete()">删单</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcPurchaseReceipt:print">
					<div class="ubtns-item"
						onclick="printChoose('PI','/form/purchase/')">打印</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="exportDetail()">导出明细</div>
				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>
		</div>
		<div class="ub umar-t8 uc-black">
			【单号】:<span>${form.formNo}</span>
		</div>
		<div class="ub uline umar-t8"></div>
		<input type="hidden" id="refFormId" name="refFormId"
			value="${form.id}"> <input type="hidden" id="formId"
			value="${form.id}"> <input type="hidden" id="formNo"
			value="${form.formNo}">
		<div class="ub umar-t8">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">采购订单:</div>
				<input type='hidden' id="taxRate" name="taxRate" value="${form.taxRate}">
				<input id="refFormNo" class="uinp" type="text"
					value="${form.refFormNo}" readonly="readonly">
				<!-- 				<div class="uinp-more" onclick="selectPurchaseForm()">...</div> -->
			</div>
			<i class="ub ub-ac uc-red">*</i>
			<div class="ub ub-ac umar-l80">
				<div class="umar-r10 uw-60 ut-r">付款期限:</div>
				<input id="paymentTime" class="Wdate" type="text"
					onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true})"
					value="<fmt:formatDate value="${form.paymentTime}" pattern="yyyy-MM-dd"/>" />
			</div>

			<div class="ub ub-ac umar-l80">
				<div class="umar-r10 uw-60 ut-r">单据金额:</div>
				<input class="uinp uw-88" id="amount" type="text"
					readonly="readonly"
					value="<fmt:formatNumber value="${form.amount}" pattern="0.00#"/>">
			</div>

		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">收货机构:</div>
				<input class="uinp" name="branchId" id="branchId" type="hidden"
					value="${form.branchId}"> <input class="uinp"
					id="branchName" type="text" readonly="readonly"
					value="[${form.branchCode}]${form.branchName}">
				<!--<div class="uinp-more" onclick="selectBranch()">...</div>-->
			</div>
			<div class="ub ub-ac umar-l88">
				<div class="umar-r10 uw-60 ut-r">采购员:</div>
				<input class="uinp" name="salesmanId" id="salesmanId" type="hidden"
					value="${form.salesmanId}"> <input class="uinp"
					id="operateUserName" type="text" readonly="readonly"
					value="${form.salesmanName}">
				<!--<div class="uinp-more" onclick="selectOperator()">...</div>-->
			</div>

			<div class="ub ub-ac umar-l80">
				<div class="umar-r10 uw-60 ut-r">制单人员:</div>
				<div class="utxt">${form.updateUserName}</div>
			</div>
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">制单时间:</div>
				<div class="utxt">
					<fmt:formatDate value="${form.updateTime}"
						pattern="yyyy-MM-dd HH:mm" />
				</div>
			</div>


		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">供应商:</div>
				<input id="supplierId" class="uinp" value="${form.supplierId}"
					type="hidden"> <input id="supplierName" class="uinp"
					value="[${form.supplierCode}]${form.supplierName}" type="text"
					readonly="readonly">
				<!--<div class="uinp-more" onclick="selectSupplier()">...</div>-->
			</div>
			<div class="ub ub-ac umar-l88">
				<div class="umar-r10 uw-60 ut-r">经营方式:</div>
				<input id="saleWay" class="uinp" type="hidden"
					value="${form.saleWay}"> <input id="saleWayName"
					class="uinp" type="text" readonly="readonly">
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
				<input id="remark" class="uinp" type="text" value="${form.remark}"
					style="width: 800px">
			</div>
		</div>
		<div class="ub ub-f1 datagrid-edit umar-t8">
			<table id="gridEditOrder"></table>
		</div>
	</div>

	<!-- 是否有改价权限 -->
	<shiro:hasPermission name="JxcPurchaseReceipt:updatePrice">
		<input type="hidden" id="allowUpdatePrice" />
	</shiro:hasPermission>
</body>
</html>