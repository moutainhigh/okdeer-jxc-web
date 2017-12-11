
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>物流销售单商品汇总导出</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/logistics/deliverDaSum.js?V=${versionNo}"></script>
	<style>
	.datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
	</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-f1 umar-4 upad-4">
		<div class="ub ub-ver ub-f1 umar-l4">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryBranch()">查询</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<shiro:hasPermission name="JxcBranchLogistics:export">
						<div class="ubtns-item" onclick="exportData()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>
				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
			</div>
			
			<form action="" id="formList" method="post">
				
				<input type="hidden" name="startCount" id="startCount" class="uinp" />
				<input type="hidden" name="endCount" id="endCount" class="uinp" />
				
				<div class="ub umar-t12">
					<!-- <div class="ub ub-ac umar-r10">
						<div class="umar-r10 uw-80 ut-r">机构:</div>
						<input class="uinp" type="text" name="branchKeyword" id="branchKeyword"
							placeholder="输入编号、名称进行查询">
					</div> -->
					<div class="ub  ub-ac" id="branchSelect">
	                   <div class="umar-r10 uw-70 ut-r">要货机构:</div>
	                   <input class="uinp ub ub-f1" type="hidden" id="branchId" name="branchId">
	                   <input class="uinp ub ub-f1" type="hidden" id="branchCompleCode" name="branchCompleCode">
	                   <input class="uinp ub ub-f1" type="text" id="branchName"  name="branchName">
	                   <div class="uinp-more">...</div>
	                </div>
					 <div class="ub ub-ac">
	                    <div class="umar-r10 uw-70 ut-r">发货机构:</div>
	                    <input type="hidden" id="sourceBranchId" name="sourceBranchId"/>
	                    <input class="uinp ub ub-f1" type="text"  id="sourceBranchName" name="sourceBranchName" onblur="clearBranchCode(this,'sourceBranchId')"/>
	                    <div class="uinp-more" onclick="selectSourceBranch()" >...</div>
	                </div>

					<div class="ub ub-ac umar-r10">
						<div class="umar-r10 uw-80 ut-r">代号/条码:</div>
						<input class="uinp" type="text" name="barCode" id="barCode">
					</div>
				</div>
				
			</form>
			<div class="ub umar-t10 ub-f1">
				<table id="deliverDaSumList"></table>
			</div>
		</div>


	</div>
</body>
</html>