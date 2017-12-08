
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>建店费用单-编辑查看</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/finance/buildCharge/buildChargeMain.js?V=${versionNo}2"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<input type='hidden' id="chargeStatus" name="chargeStatus"
		value="${chargeStatus }">
	<div class="ub ub-ver ub-f1 umar-4 ubor">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcBuildCharge:add">
					<div class="ubtns-item" onclick="storeChargeAdd()">新增</div>
				</shiro:hasPermission>
				<c:if test="${ 'edit' eq chargeStatus }">
					<div class="ubtns-item" onclick="saveStoreCharge()">保存</div>
					<div class="ubtns-item" onclick="exportList()">导出明细</div>
					<shiro:hasPermission name="JxcBuildCharge:audit">
						<div class="ubtns-item" onclick="chargeCheck()">审核</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="selectChargeRecord()">费用选择</div>
					<div class="ubtns-item" onclick="toImportStoreCharge()">费用导入</div>
					<shiro:hasPermission name="JxcBuildCharge:delete">
						<div class="ubtns-item" onclick="chargeDelete()">删除</div>
					</shiro:hasPermission>
				</c:if>
				<c:if test="${ 'check' eq chargeStatus }">
					<div class="ubtns-item-disabled">保存</div>
					<div class="ubtns-item" onclick="exportList()">导出明细</div>
					<shiro:hasPermission name="JxcBuildCharge:audit">
						<div class="ubtns-item-disabled">审核</div>
					</shiro:hasPermission>
					<div class="ubtns-item-disabled">费用选择</div>
					<div class="ubtns-item-disabled">费用导入</div>
					<shiro:hasPermission name="JxcBuildCharge:delete">
						<div class="ubtns-item-disabled">删除</div>
					</shiro:hasPermission>
				</c:if>

				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>
		</div>
		【单号】:<span>${form.formNo}</span>
		
		<div class="ub uline umar-t8"></div>
		<input type="hidden" id="formId" value="${form.id}">
		<input type="hidden" id="formNo" value="${form.formNo}">

		<div class="already-examine" id="already-examine">
			<span>已审核</span>
		</div>
		<form id="formAdd">
			<div class="ub ub-ver upad-8">
				<div class="ub umar-t8">
					<div class="ub ub-ac umar-r40" id="supplierComponent">
						<div class="umar-r10 uw-60 ut-r">供应商:</div>
						<input name="supplierId" id="supplierId" type="hidden" value="${form.supplierId }">
						<input type="text" class="uinp" readonly="readonly" id="supplierCodeName" 
							name="supplierCodeName" value="[${form.supplierCode }]${form.supplierName }">
						<div class="uinp-more">...</div>
						<i class="ub ub-ac uc-red">*</i>
					</div>


					<div class="ub ub-ac umar-r40">
						<div class="umar-r10 uw-60 ut-r">验收时间:</div>
						<input class="Wdate uw-300 uinp-no-more" name="purTime" id="purTime" value="${form.purTimeStr }"
							onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" />
					</div>
					<div class="ub ub-ac umar-r40">
						<div class="umar-r10 uw-80 ut-r">制单人员:</div>
						<div class="utxt">${form.createUserName }</div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">制单时间:</div>
						<div class="utxt" id="createTime">${form.createTimeStr }</div>
					</div>
				</div>


				<div class="ub umar-t8">
					<div class="ub  ub-ac umar-r40" id="branchComponent">
						<div class="umar-r10 uw-60 ut-r">机构:</div>
						<input type="hidden" id="branchId" name="branchId" value="${form.branchId }">
						<input class="uinp ub ub-f1" type="text" id="branchCodeName" readonly="readonly" 
							name="branchCodeName" value="[${form.branchCode }]${form.branchName }" />
						<div class="uinp-more" id="selectBranchMore">...</div>
						<i class="ub ub-ac uc-red">*</i>
					</div>


					<div class="ub ub-ac umar-r40" id="cashierSelect">
						<div class="umar-r10 uw-60 ut-r">负责人:</div>
						<input name="purUserId" id="purUserId" type="hidden" value="${form.purUserId }"> 
						<input class="uinp" id="purUserName" name="purUserName" type="text" 
							readonly="readonly" value="${form.purUserName }" />
						<div class="uinp-more">...</div>
					</div>

					<div class="ub ub-ac umar-r40">
						<div class="umar-r10 uw-80 ut-r">最后修改人:</div>
						<div class="utxt">${form.updateUserName }</div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">修改时间:</div>
						<div class="utxt" id="updateTime">${form.updateTimeStr }</div>
					</div>
				</div>


				<div class="ub umar-t8">
					<div class="ub ub-ac uw-590 umar-r40">
						<div class="umar-r10 uw-60 ut-r">备注:</div>
						<input class="uinp ub ub-f1" name="remark" id="remark" type="text"
							onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							maxlength="20" value="${form.remark }">
					</div>

					<div class="ub ub-ac umar-r40">
						<div class="umar-r10 uw-80 ut-r">审核人员:</div>
						<div class="utxt">${form.auditUserName }</div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">审核时间:</div>
						<div class="utxt">${form.auditTimeStr }</div>
					</div>
				</div>

			</div>
		</form>

		<form id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
		<table id="gridBuldCharge"></table>
		</form>

	</div>



</body>
</html>