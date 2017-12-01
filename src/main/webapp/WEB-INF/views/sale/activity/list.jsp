<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>促销管理</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/sale/activity/list.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
					<div class="ubtns-item" onclick="addActivity()">新增</div>
					<div class="ubtns-item" onclick="copyActivity()">复制</div>
					<div class="ubtns-item" onclick="delActivity()">删除</div>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
				<!-- 引入时间选择控件 -->
				<div class="ub ub-ac">
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
				</div>

            </div>
	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
	               <div class="ub  ub-ac">
	                   <div class="umar-r10 uw-80 ut-r">活动店铺:</div>
		                    <input class="uinp ub ub-f1" type="hidden" id="branchId" name="branchId">
	                        <input class="uinp ub ub-f1" type="text" id="branchName" readonly="readonly" name="branchName" onclick="searchBranch()">
	                   <div class="uinp-more" onclick="searchBranch()">...</div>
	                </div>
	                 <div class="ub ub-ac">
	                    <div class="umar-r10 uw-80 ut-r">活动编号:</div>
	                    <input class="uinp ub ub-f1" type="text" name="activityCode" id="activityCode">
	                 </div>
            </div>
	        <div class="ub umar-t8">
	            <div class="ub ub-ac">
                    <div class="umar-r10 uw-80 ut-r">活动名称:</div>
                    <input class="uinp" type="text" name="activityName" id="activityName">
                </div>
                 <div class="ub ub-ac">
                    <div class="umar-r10 uw-80 ut-r">活动类型:</div>
                    <select class="easyui-combobox" style="width: 204px;" name="activityType" data-options="editable:false" >
					  <option value="">全部</option>
					  <option value="1">特价</option>
					  <option value="2">折扣</option>
					  <option value="3">偶数特价</option>
					  <option value="11">N元N件</option>
					  <option value="12">特价打包</option>
					  <!-- <option value="4">换购</option> -->
					  <option value="5">满减</option>
					  <option value="6">组合特价</option>
					  <option value="10">买满送</option>
					</select>
                </div>
<!-- 				<div class="ub ub-ac ">
					<div class="umar-r10 uw-80 ut-r">商品名称:</div>
					<input class="uinp" type="text" name="skuName" id="skuName">
				</div> -->
	        </div>
	        <div class="ub umar-t8">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-80 ut-r">会员独享:</div>
					<select class="easyui-combobox" style="width: 204px;" name="memberExclusive" data-options="editable:false">
						<option value="">全部</option>
						<option value="0">不独享</option>
						<option value="1">会员独享</option>
					</select>
				</div>
				<div class="ub ub-ac">
					<div class="umar-r10 uw-80 ut-r">是否过期:</div>
					<select class="easyui-combobox" style="width: 204px;" id="isExpired" name="isExpired" data-options="editable:false,readonly:true">
						<option value="">全部</option>
						<option value="0">未过期</option>
						<option value="1">已过期</option>
					</select>
				</div>
				<div class="ub ub-ac umar-r10 uw-300">
                   <div class="umar-r10 uw-80 ut-r">活动状态:</div>
                   <div class="ub ub-ac umar-r10">
                       <label><input class="radioItem" type="radio" name="activityStatus" value="" onclick="queryForm()"/>全部</label>
                   </div>
                   <div class="ub ub-ac umar-r10">
                       <label><input class="radioItem" type="radio" name="activityStatus" value="0" onclick="queryForm()" checked="checked" />未审核</label>
                   </div>
                   <div class="ub ub-ac umar-r10">
                       <label><input class="radioItem" type="radio" name="activityStatus" value="1" onclick="queryForm()" />已审核</label>
                   </div>
               	   <div class="ub ub-ac umar-r10">
                       <label><input class="radioItem" type="radio" name="activityStatus" value="2" onclick="queryForm()"  />已终止</label>
                   </div>
                </div>
	        </div>
       	</form>
           
      
      <div class="ub ub-f1 umar-t20">
			 <table id="saleMange"></table>
		</div>
    </div>

</body>
</html>