
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>新会员统计报表</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/report/member/newMemberReport.js?V=${versionNo}"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryForm()">查询</div>
					<div class="ubtns-item" onclick="exportData()">导出</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">退出</div>
				</div>

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
			</div>

			<div class="ub umar-t8">
				<div class="ub  ub-ac umar-l20" id="targetBranch">
				<div class="umar-r10 uw-70 ut-r">查询机构:</div>
				<input class="uinp ub ub-f1" type="text" id="branchCodeName" name="branchCodeName" />
				<input type="hidden" id="branchCompleCode" name="branchCompleCode" />
				<div class="uinp-more">...</div>
				</div>
				<div class="ub ub-ac umar-r40" id="cashierSelect">
					<div class="umar-r10 uw-60 ut-r">收银员:</div>
					<input name="cashierId" id="cashierId" type="hidden">
					<input class="uinp" id="cashierName" name="cashierName" type="text" maxlength="50" />
					<div class="uinp-more">...</div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-l20">
					<div class="umar-r10 uw-70 ut-r">查询类型:</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioAudit" type="radio" name="reportType" id="deal0" checked="checked"
							value="0" /><label for="deal0">按店铺统计 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioAudit" type="radio" name="reportType" id="deal2"
							value="1" /><label for="deal2">按收银员统计 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioAudit" type="radio" name="reportType" id="deal3"
							value="2" /><label for="deal3">按日统计</label>
					</div>
				</div>
			</div>
		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="newMemberList"></table>
		</div>

	</div>
</body>
</html>

