<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>员工折扣消费查询</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/report/employee/discount.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
    	<form id="queryForm">
	        <div class="ub ub-ac">
	            <div class="ubtns">
					<div class="ubtns-item" onclick="query()">查询</div>
			<div class="ubtns-item" onclick="exportData()">导出</div>
	            <shiro:hasPermission name="JxcPurchaseOrder:print">
	                <div class="ubtns-item-disabled" onclick="printPreview()">打印</div>
	            </shiro:hasPermission>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	            
	            <!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	        </div>
	
	        <div class="ub umar-t8">

				<div class="ub  ub-ac uw-390" id="branchComponent">
				<div class="umar-r10 uw-70 ut-r">机构:</div>
				<input class="uinp ub ub-f1" type="hidden" id="branchIds" name="branchIds" value="">
				<input class="uinp ub ub-f1" type="text" id="branchName" readonly="readonly" value="" name="branchName">
				<div class="uinp-more">...</div>
				</div>


	            <div class="ub ub-ac umar-r40">
	                <div class="umar-r10 uw-60 ut-r">单据编号:</div>
	                <input class="uinp" name="formNo" id="formNo" type="text">
	            </div>

	        </div>
	        <div class="ub umar-t8">

				<div class="ub ub-ac umar-r40">
				<div class="umar-r10 uw-60 ut-r">员工编号:</div>
				<input class="uinp" name="formNo" id="formNo" type="text">
				</div>


	            <div class="ub ub-ac umar-l20">
	                <div class="umar-r10 uw-60 ut-r">汇总类型:</div>
	                <div class="ub ub-ac umar-r10">
	                    <input class="radioItem" type="radio" name="dealStatus" id="deal0" value="summaryStatistics" checked="checked"/><label for="deal0">汇总统计 </label>
	                </div>
	                <div class="ub ub-ac umar-r10">
	                    <input class="radioItem" type="radio" name="dealStatus" id="deal2" value="orderStatistics"/><label for="deal2">订单统计 </label>
	                </div>
	            </div>
	        </div>
        </form>
        <div class="ub uw umar-t8 ub-f1">
            <table id="gridDiscountList"></table>
        </div>

    </div>
</body>
</html>