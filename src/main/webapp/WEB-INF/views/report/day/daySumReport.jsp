<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>日进销存报表</title>
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
	<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
	<script src="${ctx}/static/js/views/report/day/daySumReport.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<!-- toolbar -->
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryForm()">查询</div>
					<div class="ubtns-item" onclick="toGpeExport()">导出</div>
					<div class="ubtns-item" onclick="toGpeSetting()">设置</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">退出</div>
				</div>

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
				<input type="hidden" id="startCount" name="startCount" /> 
				<input type="hidden" id="endCount" name="endCount" />
			</div>

			<div class="ub uline umar-t8"></div>

			<!-- condition -->
			<div class="ub umar-t8">
				<%-- <div class="ub ub-ac uw-300 " id="branchComponents">
					<div class="umar-r10 uw-70 ut-r">机构名称:</div>
					<input type="hidden" id="branchId" name="branchId" value="${branchId}" /> 
					<input class="uinp ub ub-f1" type="text" id="branchName" name="branchName" value="${branchName}" />
					<div class="uinp-more">...</div>
				</div> --%>
				<div class="ub ub-ac umar-r40" id="branchSelects">
			        <div class="umar-r10 uw-70 ut-r">机构名称:</div>
			        <input class="uinp" type="hidden" id="branchId" name="branchId">
			        <input class="uinp" type="text" id="branchName" name="branchName" >
			        <input class="uinp" type="hidden" id="branchCompleCode" name="branchCompleCode">
			        <div class="uinp-more">...</div>
			    </div>

				<div class="ub ub-ac  umar-l20">
					<div class="umar-r10 uw-70 ut-r">货号/条码:</div>
					<input class="uinp ub ub-f1" type="text" name="skuCodeOrBarCode" id="skuCodeOrBarCode">
				</div>
			</div>
		</form>

		<div class="ub ub-f1 umar-t20">
			<table id="daySumReport"></table>
		</div>
	</div>

</body>
</html>