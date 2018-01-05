
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>进项税额认证-新增</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/finance/inputTaxAuth/inputTaxAuthMain.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
.Wdate{
	width:324px;
}
</style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<input type='hidden' id="chargeStatus" value="add">
	<div class="ub ub-ver ub-f1 umar-4  ubor">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcInputTaxAuth:add">
					<div class="ubtns-item" onclick="storeChargeAdd()">新增</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="saveStoreCharge()">保存</div>
				<shiro:hasPermission name="JxcInputTaxAuth:export">
					<div class="ubtns-item uinp-no-more" >导出明细</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcInputTaxAuth:audit">
					<div class="ubtns-item uinp-no-more">审核</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcInputTaxAuth:auditBack">
					<div class="ubtns-item uinp-no-more">反审</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="selectCharge()">费用选择</div>
				<div class="ubtns-item" onclick="toImportStoreCharge()">费用导入</div>
				<shiro:hasPermission name="JxcInputTaxAuth:delete">
					<div class="ubtns-item uinp-no-more">删除</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>
		</div>
		<div class="ub umar-t8 uc-black">
			【单号】:<span></span>
		</div>
		<div class="ub uline umar-t8"></div>
		<form id="formAdd">
			<div class="ub ub-ver upad-8">
				<div class="ub umar-t8">
					<div class="ub ub-ac uw-400 umar-r80" id="targetBranch">
						<div class="umar-r10 uw-60 ut-r">机构名称:</div>
						<input name="branchId" id="branchId" type="hidden">
						<input name="branchCode" id="branchCode" type="hidden">

						<input class="uinp ub ub-f1" id="branchName" name="branchName" type="text"
							readonly="readonly">
						<div class="uinp-more" >...</div>
					</div>

					<div class="ub ub-ac umar-r80">
						<div class="umar-r10 uw-60 ut-r">制单人员:</div>
						<div class="utxt">${user.userName}</div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">制单时间:</div>
						<div class="utxt" id="createTime"></div>
					</div>
				</div>

				<div class="ub umar-t8">
					<div class="ub ub-ac  umar-r80">
						<div class="umar-r10 uw-60 ut-r">月份:</div>
						<input class="Wdate uw-300 uinp-no-more"
							name="chargeMonth" id="chargeMonth"
							onclick="WdatePicker({dateFmt:'yyyy-MM',maxDate:'%y-%M'})" />
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
					<div class="ub ub-ac uw-400 umar-r80">
						<div class="umar-r10 uw-60 ut-r">备注:</div>
						<input class="uinp ub ub-f1" name="remark" id="remark" type="text"
							onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
							maxlength="20" value="">
					</div>

					<div class="ub ub-ac umar-r80">
						<div class="umar-r10 uw-60 ut-r">反审人员:</div>
						<div class="utxt"></div>
					</div>
					<div class="ub ub-ac">
						<div class="umar-r10 uw-60 ut-r">反审时间:</div>
						<div class="utxt"></div>
					</div>
				</div>

			</div>
		</form>

		<form id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
		<table id="gridInputTaxAuth" ></table>
		</form>

	</div>

</body>
</html>