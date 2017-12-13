
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>分公司月经营利润表</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/report/analysis/storeBusinessReportList.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
     
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	                <shiro:hasPermission name="StoreBusinessReport:export">
	                	<div class="ubtns-item" onclick="exportData()">导出</div>
	                </shiro:hasPermission>
	                <shiro:hasPermission name="StoreBusinessReport:resect">
	              		<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	              	</shiro:hasPermission>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	           	<!-- 引入时间选择控件 -->
	           <div class="ub ub-ac umar-l20">
	           		<div class="umar-r10 uw-70 ut-r">时间:</div>
	              	<input class="Wdate"  readonly="readonly" name="month" id="month"
					onclick="WdatePicker({ dateFmt:'yyyy-MM', maxDate:'%y-%M',isShowToday: false,});"  />
	            </div>
            </div>
	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
                <div class="ub ub-ac" id="branchSelect">
                   <div class="umar-r10 uw-70 ut-r">机构:</div>
                   <input type="hidden" id="branchCompleCode" name="branchCompleCode">
                   <input class="uinp ub ub-f1" type="text" id="branchCodeName"  name="branchCodeName"
                   		readonly="readonly">
                   <div class="uinp-more">...</div>
                </div>
            </div>
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="gridStoreBusinessReport"></table>
		</div>
    </div>

</body>
</html>