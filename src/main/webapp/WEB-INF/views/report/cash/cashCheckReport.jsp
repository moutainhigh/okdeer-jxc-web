<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>收银对账</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/report/cash/cashCheckReport.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
 <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            <shiro:hasPermission name="JxcCashCheck:search">
	                <div class="ubtns-item" onclick="query()">查询</div>
	             </shiro:hasPermission>
	             <shiro:hasPermission name="JxcCashCheck:print">
                	<div class="ubtns-item" onclick="printReport()">打印</div>
                 </shiro:hasPermission>
                 <shiro:hasPermission name="JxcCashCheck:export">   
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
                <div class="ub ub-ac" id="branchComponent">
                    <div class="umar-r10 uw-70 ut-r">店铺:</div>
						<input type="hidden" id="branchId" name="branchId"/>
						<input class="uinp ub ub-f1" type="hidden" id="branchCode" name="branchCode">
						<input class="uinp ub ub-f1" type="text" id="branchNameOrCode" name="branchNameOrCode">
						<div class="uinp-more">...</div>
                </div>
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">收银员:</div>
	                <input type="hidden" name="cashierId" id="cashierId" class="uinp" />
					<input type="text" name="cashierNameOrCode" id="cashierNameOrCode" class="uinp" onblur="clearCashierId()" />
					<div class="uinp-more" onclick="searchCashierId()">...</div>
                </div>
               
                 <div class="ub ub-ac uw-300 umar-l20">
                    <div class="umar-r10 uw-70 ut-r">付款方式:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect" name="payType" id="payType" data-options="editable:false">
				            <option value="" selected="selected">全部</option>
				            <option value="RMB">现金</option>
				            <option value="ZER">抹零</option>
				            <option value="YHK">银行卡</option>
				            <option value="ZFB">支付宝</option>
				            <option value="WZF">微支付</option>
				            <option value="YQB">云钱包</option>
				            <option value="DJQ">代金券</option>
				            <option value="YFQ">运费代金券</option>
				            <option value="PDF">平台垫付</option>
				            <option value="PBT">平台补贴</option>
				            <option value="DXR">店小二</option>
				            <option value="ZZT">HS深圳通</option>
				            <option value="QT">其他</option>
				        </select>
                </div>  
            </div>
       	</form>
        <div class="ub ub-f1 umar-t20">
			<table id="cashReconcile"></table>
		</div>
    </div>
</body>
</html>