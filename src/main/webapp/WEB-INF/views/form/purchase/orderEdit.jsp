<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>采购订单-修改</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/purchase/orderEdit.js?V=${versionNo}"></script>

<script src="${ctx}/static/js/views/purchase/purchaseExport.js?V=${versionNo}"></script>
<%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4  ubor">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcPurchaseOrder:add">
					<div class="ubtns-item" onclick="orderAdd()">新增</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="saveItemHandel()">保存</div>

				<shiro:hasPermission name="JxcPurchaseOrder:audit">
					<div class="ubtns-item" onclick="check()">审核</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="selectGoods()">商品选择</div>
				<shiro:hasPermission name="JxcPurchaseOrder:delete">
					<div class="ubtns-item" onclick="orderDelete()">删单</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="toImportproduct(0)">导入货号</div>
				<div class="ubtns-item" onclick="toImportproduct(1)">导入条码</div>
				<shiro:hasPermission name="JxcPurchaseOrder:print">
					<div class="ubtns-item"
						onclick="printChoose('PA','/form/purchase/')">打印</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="exportDetail();">导出明细</div>
				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>
		</div>
		<div class="ub umar-t8 uc-black">
		<input type='hidden' id="cascadeGoods" name="cascadeGoods" value="${cascadeGoods}">
			【单号】:<span>${form.formNo}</span>
		</div>
		<div class="ub uline umar-t8"></div>
		<input type='hidden' id="taxRate" name="taxRate" value="${form.taxRate}">
		<input type="hidden" id="formId" value="${form.id}"> <input
			type="hidden" id="formNo" value="${form.formNo}">
		<div class="ub umar-t8">
			<div class="ub ub-ac umar-r80">
				<div class="umar-r10 uw-60 ut-r">供应商:</div>
				<input id="supplierId" class="uinp" value="${form.supplierId}"
					type="hidden"> <input id="supplierName" class="uinp"
					value="[${form.supplierCode}]${form.supplierName}" type="text"
					readonly="readonly" onclick="selectSupplier()">
				<div class="uinp-more" onclick="selectSupplier()">...</div>
			</div>
			<div class="ub ub-ac umar-r80">
				<div class="umar-r10 uw-60 ut-r">交货期限:</div>
				<input id="deliverTime" class="Wdate" type="text"
					onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true})"
					value="<fmt:formatDate value="${form.deliverTime}" pattern="yyyy-MM-dd"/>" />
			</div>
			<div class="ub ub-ac umar-r80">
				<div class="umar-r10 uw-60 ut-r">制单人员:</div>
				<div class="utxt">${form.updateUserName}</div>
			</div>
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">制单时间:</div>
				<div class="utxt" id="createDate">
					<fmt:formatDate value="${form.createTime}"
						pattern="yyyy-MM-dd HH:mm" />
				</div>
			</div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac umar-r80">
				<div class="umar-r10 uw-60 ut-r">收货机构:</div>
				<input class="uinp" name="branchType" id="branchType" value="${form.branchType}" type="hidden">	
				<input class="uinp" name="branchId" id="branchId" type="hidden"
					value="${form.branchId}"> <input class="uinp"
					id="branchName" type="text" readonly="readonly"
					value="[${form.branchCode}]${form.branchName}"
					onclick="selectBranch()">
				<div class="uinp-more" onclick="selectBranch()">...</div>
			</div>
			<div class="ub ub-ac umar-r80">
				<div class="umar-r10 uw-60 ut-r">采购员:</div>
				<input class="uinp" name="salesmanId" id="salesmanId" type="hidden"
					value="${form.salesmanId}"> <input class="uinp"
					id="operateUserName" type="text" readonly="readonly"
					onclick="selectOperator()" value="${form.salesmanName}">
				<div class="uinp-more" onclick="selectOperator()">...</div>
			</div>
			<div class="ub ub-ac umar-r80">
				<div class="umar-r10 uw-60 ut-r">审核人员:</div>
				<div class="utxt"></div>
			</div>
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">审核时间:</div>
				<div class="utxt"></div>
			</div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac uw-610" style="width: 624px;">
				<div class="umar-r10 uw-60 ut-r">备注:</div>
				<input class="uinp ub ub-f1" name="remark" id="remark" type="text"
					maxlength="100" value="${form.remark}">
			</div>
		</div>

		<from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
		<table id="gridEditOrder" ></table>
		</from>

	</div>

	<!-- 是否有改价权限 -->
	<shiro:hasPermission name="JxcPurchaseOrder:updatePrice">
		<input type="hidden" id="allowUpdatePrice" />
	</shiro:hasPermission>

</body>
</html>