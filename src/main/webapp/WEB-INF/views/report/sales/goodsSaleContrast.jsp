<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>时段销售对比分析</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<script src="${ctx}/static/js/views/report/sales/periodSaleContrast.js?V=${versionNo}"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
     
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<!-- 时段销售对比timeSale 货类cateSale  -->
    		<input type="hidden" name="serviceType" id="serviceType" value="cateSale">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	             	<input type="hidden" id="startCount" name="startCount" />
					<input type="hidden" id="endCount" name="endCount" />
	                <div class="ubtns-item" onclick="exportData()">导出</div>
	              	<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	           	<!-- 引入时间选择控件 -->
	           <div class="ub ub-ac umar-l20">
	              	<input class="Wdate"  readonly="readonly" name="saleTime" id="saleTime" onclick="selectMonth()"  />
	            </div>
            </div>
	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
                <div class="ub  ub-ac" id="branchSelect">
                   <div class="umar-r10 uw-70 ut-r">机构名称:</div>
                   <input class="uinp ub ub-f1" type="hidden" id="branchId" name="branchId">
                   <input class="uinp ub ub-f1" type="text" id="branchName"  name="branchName">
                   <div class="uinp-more">...</div>
                </div>
            </div>
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="saleReportList"></table>
		</div>
    </div>

</body>
</html>