<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>收银日报</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/report/cash/cashDailyReport.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            <shiro:hasPermission name="JxcCashDaily:search">
	                <div class="ubtns-item" onclick="query()">查询</div>
	            </shiro:hasPermission>
	            <shiro:hasPermission name="JxcCashDaily:print">
	                <div class="ubtns-item" onclick="printReport()">打印</div>
	            </shiro:hasPermission>
	            <shiro:hasPermission name="JxcCashDaily:export">
	                <div class="ubtns-item" onclick="exportData()">导出</div>
	            </shiro:hasPermission>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	            
	           	<!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
            </div>
	               
	        <div class="ub uline umar-t8"></div>
	        
          <div class="ub umar-t8">
               <div class="ub ub-ac">
                   <div class="umar-r10 uw-70 ut-r">店铺:</div>
                   <input class="uinp" type="hidden" id="branchCode" name="branchCode">
                   <input class="uinp" type="text" id="branchNameOrCode" name="branchNameOrCode" onblur="clearBranchCode()">
                   <div class="uinp-more" onclick="searchBranch()">...</div>
               </div>
               <div class="ub ub-ac umar-r40">
				<div class="umar-r10 uw-60 ut-r">收银员:</div>
				<input type="hidden" name="cashierId" id="cashierId" class="uinp" />
				<input type="text" name="cashierNameOrCode" id="cashierNameOrCode" class="uinp" onblur="clearCashierId()" />
				<div class="uinp-more" id="cashierIdSelect" onclick="searchCashierId()">...</div>
			  </div>
            </div>
            
            <div class="ub umar-t8">
                <!--input-checkbox-->
                <div class="ub ub-ac">
                   <div class="umar-r10 uw-70 ut-r">报表类型:</div>
                    <div class="ub ub-ac umar-r10 ">
                        <input class="radioItem" id="cashDailyAll" type="radio" name="queryType" value="cashier" checked="checked"/>
                        <label for="cashDailyAll">按收银员汇总</label>
                    </div>
                    <div class="ub ub-ac umar-r10">
                        <input class="radioItem" id="cashDailyMd" type="radio" name="queryType" value="branch"  />
                        <label for="cashDailyMd">按门店汇总</label>
                    </div>
                   <div class="ub ub-ac umar-r10">
                        <input class="radioItem" id="cashDailyDate" type="radio" name="queryType" value="date" />
                        <label for="cashDailyDate">按日期汇总</label>
                  </div>
                </div>
            </div>
       	</form>  	
        <div class="ub ub-f1 umar-t20">
			 <table id="cashDaily"></table>
		</div>
    </div>
</body>
</html>