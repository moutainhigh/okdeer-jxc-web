<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>到货率分析</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
	<script src="${ctx}/static/js/views/report/purchase/arrivalRateList.js?V=${versionNo}4"></script>
    
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
    	<form id="queryForm" action="" method="post">
	        <div class="ub ub-ac">
	            <div class="ubtns"> 
	            <shiro:hasPermission name="JxcPurArrivalRate:search">
					<div class="ubtns-item" onclick="query()">查询</div>
				</shiro:hasPermission>
	            <shiro:hasPermission name="JxcPurArrivalRate:export">
	                <div class="ubtns-item" onclick="exportData()">导出</div>
				</shiro:hasPermission>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	            <!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	        </div>
	
	        <div class="ub umar-t8">
	             <div class="ub  ub-ac umar-r40" id="branchTemp">
                   <div class="umar-r10 uw-70 ut-r">机构名称:</div>
                        <input type="hidden" name="startCount" id="startCount" value="">
						<input type="hidden" name="endCount" id="endCount" value="">
	                    <input class="uinp ub ub-f1" type="hidden" id="branchCode" name="branchCode">
                        <input class="uinp ub ub-f1" type="text" id="branchName" name="branchName" maxlength="50" maxlength="50">
                   <div class="uinp-more uinp-branchNameOrCode">...</div>
                </div>
	            <div class="ub ub-ac umar-r40" id="supplierComponent">
	                <div class="umar-r10 uw-60 ut-r">供应商:</div>
	                <input class="uinp" name="supplierId" id="supplierId" type="hidden">
	                <input class="uinp" id="supplierCode" name="supplierCode" type="hidden" maxlength="50">
					<input class="uinp" id="supplierName" name="supplierName" type="text">
	                <div class="uinp-more uinp-supplierName">...</div>
	            </div>
	             <div class="ub ub-ac umar-r40" id="categorySelectTemp">
                    <div class="umar-r10 uw-60 ut-r">类别:</div>
                    <input id="categoryId" name="categoryId" class="uinp" type="hidden">
                    <input id="categoryCode" name="categoryCode" class="uinp" type="hidden">
                    <input id="categoryName" name="categoryName" class="uinp" type="text" maxlength="50">
                    <div class="uinp-more">...</div>
                </div>
	        </div>
	        <div class="ub umar-t8">
	            <div class="ub ub-ac umar-r40">
	                <div class="umar-r10 uw-70 ut-r">单据编号:</div>
	                <input class="uinp" name="formNo" id="formNo" type="text" maxlength="20">
	            </div>
	            <div class="ub ub-ac umar-r40">
	                <div class="umar-r10 uw-60 ut-r">到货率≤:</div>
					<input class="uinp uw-206 easyui-numberbox" name="arrivalRate" id="arrivalRate" data-options="min:0.00,max:1.00,precision:2"  value="">
	                <%--<input class="uinp deal" name="arrivalRate" id="arrivalRate"  type="number">--%>
	            </div>
	        </div>
	        <div class="ub umar-t8">
	            <div class="ub ub-ac">
	                <div class="umar-r10 uw-70 ut-r">查询类型:</div>
	                <div class="ub ub-ac umar-r10">
	                    <input class="radioItem" type="radio" name="type" id="deal0" value="0" checked="checked"/><label for="deal0">按单 </label>
	                </div>
	                <div class="ub ub-ac umar-r10">
	                    <input class="radioItem" type="radio" name="type" id="deal2" value="1"/><label for="deal2">供应商 </label>
	                </div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="type" id="deal3" value="2" /><label for="deal3">类别</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="type" id="deal4" value="3" /><label for="deal4">商品</label>
					</div>
	            </div>
	        </div>
        </form>
        <div class="ub uw umar-t8 ub-f1">
            <table id="gridOrders"></table>
        </div>

    </div>
</body>
</html>