
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>系统日志</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>

<script src="${ctx}/static/js/views/system/log/systemLogList.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
<%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryLogList()">查询</div>
					<shiro:hasPermission name="JxcSystemLog:export">
						<div class="ubtns-item" onclick="exportData()">导出</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcSystemLog:print">
						<div class="ubtns-item  uinp-no-more">打印</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">机构名称:</div>
					<input type="hidden" name="branchCompleCode" id="branchCompleCode">
					<input type="text" id="branchName" class="uinp" name="branchName" readonly="readonly" onclick="selectListBranches()">
					<div class="uinp-more" onclick="selectListBranches()">...</div>
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">操作员:</div>
					<input class="uinp" id="opUserKeyword" name="opUserKeyword" type="text" maxlength="50">
				</div>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">功能名称:</div>
					<input class="uinp" id="operateName" name="operateName" type="text" maxlength="50">
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">修改值:</div>
					<input class="uinp" id="operateTitle" name="operateTitle" type="text" maxlength="50">
				</div>
			</div>

		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="gridLogList"></table>
		</div>

	</div>
</body>
</html>