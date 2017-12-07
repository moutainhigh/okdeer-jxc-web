
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>开店费用类别</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/settle/charge/chargeCategory.js?V=${versionNo}11"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-f1 umar-4 upad-4">
		<!--left-->
		<div class="ub ub-ver ubor uw-240">
			<div class="ub upad-4 ub-f1 uscroll">
				<div class="zTreeDemoBackground left">
					<ul id="treeChargeCategory" class="ztree"></ul>
				</div>
			</div>
		</div>
		<!--left end-->

		<div class="ub ub-ver ub-f1 upad-4">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryChargeCategory()">查询</div>
					<shiro:hasPermission name="JxcFinanceCode:add">
						<div class="ubtns-item" onclick="addCategoryCode()">新增</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcFinanceCode:delete">
						<div class="ubtns-item" onclick="delCategoryCode()">删除</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcFinanceCode:export">
						<div class="ubtns-item" onclick="exportData()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="toClose()">关闭</div>

				</div>
			</div>
			<form action="" id="formCagegoryList" method="post">
				<div class="ub umar-t4">
					<div class="ub ub-ac umar-r10">
						<div class="umar-r10 ut-r">关键字:</div>
						<input class="uinp uw-400" type="text" name="categoryKeyword"
							id="categoryKeyword" placeholder="输入编号、名称进行查询"> <input
							type="hidden" name="typeCode" id="typeCode" />
					</div>
				</div>
			</form>
			<div class="ub umar-t10 ub-f1">
				<table id="gridChargeCategoryList"></table>
			</div>
		</div>


	</div>

</body>
</html>