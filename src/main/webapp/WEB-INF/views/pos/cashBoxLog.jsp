<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>销售流水</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script
	src="${ctx}/static/js/views/pos/cashBoxLog.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell {
	text-align: center !important;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">

	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<shiro:hasPermission name="JxcSaleFlow:search">
						<div class="ubtns-item" onclick="query()">查询</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcSaleFlow:print">
						<div class="ubtns-item" onclick="printReport()">打印</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcSaleFlow:export">
						<div class="ubtns-item" onclick="toGpeExport()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="toGpeSetting()">设置</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">退出</div>
				</div>

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelectHour.jsp"%>
			</div>

			<div class="ub uline umar-t8"></div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40" id="branchSelect">
					<div class="umar-r10 uw-70 ut-r">门店:</div>
					 <input class="uinp" type="hidden" id="branchCompleCode" name="branchCompleCode">
					<input type="hidden" id="branchId" name="branchId" /> <input
						class="uinp ub ub-f1" type="text" id="branchName" maxlength="50" />
					<div class="uinp-more">...</div>
				</div>
				 <div class="ub ub-ac umar-l20">
                    <div class="umar-r10 uw-70 ut-r">收银员:</div>
					<input type="hidden" name="cashierId" id="cashierId" class="uinp" />
					<input type="text" name="cashierNameOrCode" id="cashierNameOrCode" class="uinp" onblur="clearCashierId()" />
					<div class="uinp-more" id="cashierIdSelect" onclick="searchCashierId()">...</div>
                </div>


			</div>

		</form>

		<div class="ub ub-f1 umar-t20">
			<table id="cashBoxLog"></table>
		</div>
	</div>
</body>
</html>