
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>门店经营数据录入-编辑查看</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/finance/storeBusiness/storeBusinessMain.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<input type='hidden' id="businessStatus" name="businessStatus" value="${businessStatus }">
	<div class="ub ub-ver ub-f1 umar-4 ubor">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcStoreBusiness:add">
					<div class="ubtns-item" onclick="storeBusinessAdd()">新增</div>
				</shiro:hasPermission>
				<c:if test="${ 'edit' eq businessStatus }">
					<shiro:hasPermission name="JxcStoreBusiness:update">
						<div class="ubtns-item" onclick="saveStoreBusiness()">保存</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStoreBusiness:audit">
						<div class="ubtns-item" onclick="businessCheck()">审核</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStoreBusiness:delete">
						<div class="ubtns-item" onclick="businessDelete()">删除</div>
					</shiro:hasPermission>
				</c:if>
				<c:if test="${ 'check' eq businessStatus }">
					<shiro:hasPermission name="JxcStoreBusiness:update">
						<div class="ubtns-item-disabled" >保存</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStoreBusiness:audit">
						<div class="ubtns-item-disabled" >审核</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStoreBusiness:delete">
						<div class="ubtns-item-disabled" >删除</div>
					</shiro:hasPermission>
				</c:if>
				<shiro:hasPermission name="JxcStoreBusiness:exportDetail">
					<div class="ubtns-item" onclick="exportDetail()">导出明细</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>
		</div>
		【单号】:<span>${form.formNo}</span>
	
		<div class="ub uline umar-t8"></div>
		<input type="hidden" id="formId" value="${form.id}">
		<input type="hidden" id="formNo" value="${form.formNo}">
		<input type="hidden" id="saleAmount" value="${form.saleAmount}">
		<input type="hidden" id="costAmount" value="${form.costAmount}">
		<input type="hidden" id="taxAmount" value="${form.taxAmount}">
		<input type="hidden" id="profitAmount" value="${form.profitAmount}">
		<input type="hidden" id="wagesAmount" value="${form.wagesAmount}">
		<input type="hidden" id="lossAmount" value="${form.lossAmount}">
		<input type="hidden" id="utilityAmount" value="${form.utilityAmount}">
		<input type="hidden" id="stationeryAmount" value="${form.stationeryAmount}">
		<input type="hidden" id="callsAmount" value="${form.callsAmount}">
		<input type="hidden" id="maintenanceAmount" value="${form.maintenanceAmount}">
		<input type="hidden" id="incidentalAmount" value="${form.incidentalAmount}">
		<input type="hidden" id="controllableAmount" value="${form.controllableAmount}">
		<input type="hidden" id="rentAmount" value="${form.rentAmount}">
		<input type="hidden" id="managementAmount" value="${form.managementAmount}">
		<input type="hidden" id="depreciationAmount" value="${form.depreciationAmount}">
		<input type="hidden" id="uncontrollableAmount" value="${form.uncontrollableAmount}">

		<div class="already-examine" id="already-examine"><span>已审核</span></div>
		<form id="formAdd">
			<div class="ub ub-ver upad-8">
				<div class="ub umar-t8">
					<div class="ub ub-ac umar-r80">
						<div class="umar-r10 uw-60 ut-r">机构:</div>
						<input name="branchId" id="branchId" type="hidden" value="${form.branchId }">
						<input name="branchCode" id="branchCode" type="hidden" value="${form.branchCode }">
						<input class="uinp" id="branchName" name="branchName" disabled="disabled" type="text" value="${form.branchName}">
					</div>
					<div class="ub ub-ac umar-r80">
						<div class="umar-r10 uw-60 ut-r">月份:</div>
						<input class="Wdate uw-300 uinp-no-more" readOnly="readOnly" type="text"
							name="businessMonth" id="businessMonth"  value=""  disabled="disabled"/>
						<input id="month" type="hidden" value="${form.month}"/>
					</div>
					<div class="ub ub-ac umar-r80">
						<div class="umar-r10 uw-80 ut-r">制单人:</div>
						<div class="utxt">${form.createUserName }</div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">制单时间:</div>
						<div class="utxt" id="createTime"><fmt:formatDate value="${form.createTime}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
					</div>
				</div>
				<div class="ub umar-t8">
					<div class="ub ub-ac uw-624 umar-r80">
					</div>
					<div class="ub ub-ac umar-r80">
						<div class="umar-r10 uw-80 ut-r">最后修改人:</div>
						<div class="utxt">${form.updateUserName }</div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">修改时间:</div>
						<div class="utxt"><fmt:formatDate value="${form.updateTime}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
					</div>
				</div>
				<div class="ub umar-t8">
					<div class="ub ub-ac uw-624 umar-r80">
						<div class="umar-r10 uw-60 ut-r">备注:</div>
						<input class="uinp ub ub-f1" name="remark" id="remark" type="text"
							onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							maxlength="20" <c:if test="${ 'check' eq businessStatus }">readOnly="readOnly"</c:if> value="${form.remark}">
					</div>
					<div class="ub ub-ac umar-r80">
						<div class="umar-r10 uw-80 ut-r">审核人员:</div>
						<div class="utxt">${form.auditUserName }</div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">审核时间:</div>
						<div class="utxt"><fmt:formatDate value="${form.auditTime}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
					</div>
				</div>
		
			</div>
		</form>

		<from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
		<table id="gridStoreBusiness" ></table>
		</from>

	</div>
	


</body>
</html>