<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>退货单-修改</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/purchase/returnEdit.js?V=${versionNo}6"></script>
<script src="${ctx}/static/js/views/purchase/purchaseExport.js?V=${versionNo}"></script>
<%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1  ubor">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcPurchaseRefund:add">
					<div class="ubtns-item" onclick="receiptAdd()">新增</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="saveItemHandel()">保存</div>

				<shiro:hasPermission name="JxcPurchaseRefund:audit">
					<div class="ubtns-item" onclick="check()">审核</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="selectGoods()">商品选择</div>
				<div class="ubtns-item" onclick="toImportproduct(0)">导入货号</div>
				<div class="ubtns-item" onclick="toImportproduct(1)">导入条码</div>
				<shiro:hasPermission name="JxcPurchaseRefund:delete">
					<div class="ubtns-item" onclick="orderDelete()">删除</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcPurchaseRefund:print">
					<div class="ubtns-item"
						onclick="printChoose('PR','/form/purchase/')">打印</div>
				</shiro:hasPermission>
				<%--<shiro:hasPermission name="JxcPurchaseOrder:terminate">--%>
					<%--<div class="ubtns-item" onclick="stop()">终止</div>--%>
				<%--</shiro:hasPermission>--%>
				<div class="ubtns-item" onclick="exportData('PR');">导出明细</div>
				<div class="ubtns-item uinp-no-more">导出货号</div>
				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>
		</div>
		<div class="ub umar-t8 uc-black">
		<input type='hidden' id="cascadeGoods" name="cascadeGoods" value="${cascadeGoods}">
			【单号】:<span>${form.formNo}</span>
		</div>
		<div class="ub uline umar-t8"></div>
		<input type="hidden" id="formJson" value="${form}">
		<input type="hidden" id="formId" value="${form.id}"> <input
			type="hidden" id="formNo" value="${form.formNo}">
		<div class="ub umar-t8">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">供应商:</div>
				<input id="saleWay" name="saleWay" class="uinp ub ub-f1" type="hidden" value="${form.saleWay}">
				<input id="supplierId" class="uinp" value="${form.supplierId}"
					type="hidden"> <input id="supplierName" class="uinp"
					value="[${form.supplierCode}]${form.supplierName}" type="text"
					readonly="readonly" >
<!-- 				<div class="uinp-more" onclick="selectSupplier()">...</div> -->
			</div>
			<i class="ub ub-ac uc-red">*</i>
			<div class="ub ub-ac umar-l80">
				<div class="umar-r10 uw-60 ut-r">付款期限:</div>
				<input id="paymentTime" class="Wdate" type="text"
					onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true})"
					value="<fmt:formatDate value="${form.paymentTime}" pattern="yyyy-MM-dd"/>" />
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
				<div class="umar-r10 uw-60 ut-r">退货机构:</div>
				<input class="uinp" name="branchId" id="branchId" type="hidden"
					value="${form.branchId}"> <input class="uinp"
					id="branchName" type="text" readonly="readonly"
					value="[${form.branchCode}]${form.branchName}"
					>
				<input name="branchType" id="branchType" type="hidden">
<!-- 				<div class="uinp-more" onclick="selectBranch()">...</div> -->
			</div>
			<i class="ub ub-ac uc-red">*</i>
			<div class="ub ub-ac umar-l80">
				<div class="umar-r10 uw-60 ut-r">采购员:</div>
				<input class="uinp" name="salesmanId" id="salesmanId" type="hidden"
					value="${form.salesmanId}"> <input class="uinp"
					id="operateUserName" type="text" readonly="readonly"
					onclick="selectOperator()" value="${form.salesmanName}">
				<div class="uinp-more" onclick="selectOperator()">...</div>
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
			<div class="ub ub-ac">
				<div class="umar-r10 uw-60 ut-r">原单类型:</div>
				<div class="ub uw-200">
					<div class="ub ub-ac umar-r10">
						<label>
						<input  type="radio" name="refFormNoType" value="PI"
						checked="checked" /><span>收货单 </span>
						</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<label>
						<input type="radio" name="refFormNoType" value="DI" /><span>直调入库单
						</span>
						</label>

					</div>
				</div>

			</div>
			<div class="ub ub-ac umar-l88">
				<div class="umar-r10 uw-60 ut-r">原单号:</div>
				<input id="refFormNo" class="uinp" type="text" readonly="readonly"
					value="${form.refFormNo}"> <input
					type="hidden" id="oldRefFormNo" name="oldRefFormNo"
					value="${form.refFormNo}" />
<!-- 				<div class="uinp-more" onclick="selectForm()">...</div> -->
			</div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac umar-r80">
				<div class="umar-r10 uw-60 ut-r">备注:</div>
				<input id="remark" class="uinp" type="text" value="${form.remark}"
					style="width: 800px">
			</div>
		</div>

		<from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
		<table id="gridEditOrder" ></table>
		</from>

	</div>



	<!-- 是否有改价权限 -->
	<shiro:hasPermission name="JxcPurchaseRefund:updatePrice">
		<input type="hidden" id="allowUpdatePrice" />
	</shiro:hasPermission>
</body>
</html>