
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>开店投资费用报表</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/finance/buildCharge/buildChargeReportList.js?V=${versionNo}"></script>
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
	                <div class="ubtns-item" onclick="exportData()">导出</div>
	              	<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
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
                
                <div class="ub ub-ac">
                   <div class="umar-r10 uw-70 ut-r">类别:</div>
                   <input type="hidden" id="categoryId"  name="categoryId"  />
                   <input type="hidden" id="categoryCode" name="categoryCode"  />
                   <input class="uinp ub ub-f1" type="text" id="categoryName"
						name="categoryName"  onclick="openChargeCodeDialog()" readonly="readonly"/>
                   <div class="uinp-more" onclick="openChargeCodeDialog()">...</div>
                </div>
                
            </div>
            
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="gridBuildChargeReport"></table>
		</div>
    </div>

</body>
</html>