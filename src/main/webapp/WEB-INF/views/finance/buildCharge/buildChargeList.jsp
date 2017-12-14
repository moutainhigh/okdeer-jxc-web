<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>建店费用单-列表</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/finance/buildCharge/buildChargeList.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryStoreCharge()">查询</div>
					<shiro:hasPermission name="JxcBuildCharge:add">
						<div class="ubtns-item" onclick="storeChargeAdd()">新增</div>
					</shiro:hasPermission>
					<%-- <shiro:hasPermission name="JxcBuildCharge:delete">
						<div class="ubtns-item" onclick="delChargeOrder()">删除</div>
					</shiro:hasPermission> --%>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>

					<div id="updatePermission" class="none">
						<shiro:hasPermission name="JxcBuildCharge:update">修改</shiro:hasPermission>
					</div>
				</div>

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40" id="branchComponent">
					<div class="umar-r10 uw-60 ut-r">机构名称:</div>
					<input name="branchCompleCode" id="branchCompleCode" type="hidden">
					<input class="uinp" id="branchName" name="branchName" type="text">
					<div class="uinp-more">...</div>
				</div>

				<div class="ub ub-ac umar-r80" id="supplierComponent">
					<div class="umar-r10 uw-60 ut-r">供应商:</div>
					<input class="uinp" name="supplierId" id="supplierId" type="hidden">
					<input class="uinp" id="supplierName" type="text">
					<div class="uinp-more">...</div>
				</div>

			</div>

			<div class="ub umar-t8">

				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">单据编号:</div>
					<input class="uinp" name="formNo" id="formNo" type="text">
				</div>

				<div class="ub ub-ac umar-r40" id="createUserComponent">
					<div class="umar-r10 uw-60 ut-r">操作员:</div>
					<input type="hidden" name="operateUserId" id="operateUserId">
					<input class="uinp" id="operateUserName" name="operateUserName" type="text" />
					<div class="uinp-more">...</div>
				</div>

			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac uw-584 umar-r40">
					<div class="umar-r10 uw-60 ut-r">备注:</div>
					<input class="uinp ub ub-f1" name="remark" id="remark" type="text"
						onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
						onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
						oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
						maxlength="20">
				</div>

				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">审核状态:</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="auditStatus"
							id="status_no" value="0" checked="checked" /><label
							for="status_no">未审核 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="auditStatus"
							id="status_yes" value="1" /><label for="status_yes">已审核
						</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="auditStatus"
							id="status_all" value="" /><label for="status_all">全部</label>
					</div>
				</div>

			</div>

		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="gridBuldChargeList"></table>
		</div>

	</div>
</body>
</html>