<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>促销销售查询</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<script src="${ctx}/static/js/views/report/activity/activityGoodsList.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            <shiro:hasPermission name="JxcActivityGoods:search">
	                <div class="ubtns-item" onclick="query()">查询</div>
	            </shiro:hasPermission>
	            <shiro:hasPermission name="JxcActivityGoods:export">
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
                <div class="ub  ub-ac">
                   <div class="umar-r10 uw-70 ut-r">店铺:</div>
                        <input type="hidden" name="startCount" id="startCount" value="">
                        <input type="hidden" name="endCount" id="endCount" value="">
                        <input type="hidden" name="activityType" id="activityType" value="">
                        <input class="uinp ub ub-f1" type="text" id="branchNameOrCode" name="branchNameOrCode" maxlength="50">
                   <div class="uinp-more" onclick="searchBranch()">...</div>
                </div>
                <div class="ub ub-ac  umar-l20">
                    <div class="umar-r10 uw-70 ut-r">订单号:</div>
                    <input class="uinp ub ub-f1" type="text" name="orderNo" id="orderNo"  maxlength="32">
                </div>  
                <div class="ub  ub-ac">
                    <div class="umar-r10 uw-70 ut-r">货号:</div>
                    <input class="uinp" type="text" name="skuCode" id="skuCode"  maxlength="50">
                </div>
                <div class="ub ub-ac  umar-l20">
                    <div class="umar-r10 uw-70 ut-r">活动名称:</div>
                    <input class="uinp ub ub-f1" type="text" name="activityName" id="activityName" maxlength="50">
                </div>  
            </div>
	        <div class="ub umar-t8">
	           <div class="ub ub-ac">
                  <div class="umar-r10 uw-70 ut-r">活动类型:</div>
	              <label><input type="checkbox" class="checkboxCtrl" name="activityType1" group="activityType1" onclick="selectedAll()">全部</label>
	              <label><input type="checkbox" value="1" name="activityType1" onclick="selectedTypeItem()">特价</label>
	              <label><input type="checkbox" value="2" name="activityType1" onclick="selectedTypeItem()">折扣</label>
	              <label><input type="checkbox" value="3" name="activityType1" onclick="selectedTypeItem()">偶数特价</label>
	              <!-- <label><input type="checkbox" value="4" name="activityType1" onclick="selectedTypeItem()">换购</label> -->
	              <label><input type="checkbox" value="5" name="activityType1" onclick="selectedTypeItem()">满减</label>
	              <label><input type="checkbox" value="6" name="activityType1" onclick="selectedTypeItem()">组合特价</label>
	              <label><input type="checkbox" value="8" name="activityType1" onclick="selectedTypeItem()">手工折扣</label>
	              <label><input type="checkbox" value="9" name="activityType1" onclick="selectedTypeItem()">手工议价</label>
	              <label><input type="checkbox" value="10" name="activityType1" onclick="selectedTypeItem()">买满送</label>
	              <label><input type="checkbox" value="13" name="activityType1" onclick="selectedTypeItem()">手工赠送</label>
                </div>
           </div>
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="tabList"></table>
		</div>
    </div>
</body>
</html>