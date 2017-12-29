<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>员工考勤查询</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/report/employee/attendanceList.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
    	<form id="queryForm">
	        <div class="ub ub-ac">
	            <div class="ubtns">
					<div class="ubtns-item" onclick="queryForm()">查询</div>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="exportData()">导出</div>
			<shiro:hasPermission name="JxcPurchaseOrder:print">
				<div class="ubtns-item ubtns-item-disabled">打印</div>
			</shiro:hasPermission>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	            <!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	        </div>
	
	        <div class="ub umar-t8">
				<div class="ub  ub-ac uw-390" id="branchComponent">
				<div class="umar-r10 uw-70 ut-r">门店:</div>
				<input class="uinp ub ub-f1" type="hidden" id="storeId" name="storeId" value="">
				<input class="uinp ub ub-f1" type="text" id="branchName" readonly="readonly" value="" name="branchName">
				<div class="uinp-more" id="selectBranchMore">...</div>
				<i class="ub ub-ac uc-red">*</i>
				</div>

				<div class="ub ub-ac umar-r40" id="cashierSelect">
				<div class="umar-r10 uw-60 ut-r">收银员:</div>
				<input name="userId" id="userId" type="hidden">
				<input class="uinp" id="userName" name="userName" type="text" maxlength="50" />
				<div class="uinp-more">...</div>
				</div>
	        </div>
        </form>
        <div class="ub uw umar-t8 ub-f1">
            <table id="gridAttendanceList"></table>
        </div>

    </div>
</body>
</html>