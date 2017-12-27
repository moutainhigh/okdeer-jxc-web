<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>用户管理</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/system/user/userList.js?V=${versionNo}"></script>

</head>
<body class="uw ufs-14 uc-black upad-8 box-border">
	<div class="ub uw uh ub-ver ub-f1 ">
		<form id="queryForm">
			<div class="ub ub-ac">
				<div class="ubtns">
					<shiro:hasPermission name="JxcUserManage:search">
						<div class="ubtns-item" onclick="query();">查询</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcUserManage:add">
						<div class="ubtns-item" onclick="toAdd();">新增</div>
					</shiro:hasPermission>
					<div class="ubtns-item" style="width:100px;" onclick="createQrCode();">员工二维码</div>
					<shiro:hasPermission name="JxcUserManage:enabled">
						<div class="ubtns-item" onclick="enable();">启用</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcUserManage:disabled">
						<div class="ubtns-item" onclick="disable();">禁用</div>
					</shiro:hasPermission>
					<div id="updatePermission" class="none">
						<shiro:hasPermission name="JxcUserManage:update">修改</shiro:hasPermission>
					</div>
					<div class="ubtns-item" onclick="toClose()">退出</div>
				</div>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">关键字:</div>
					<input class="uinp" name="keyword" id="userNameOrCode" type="text">
				</div>
				<div class="ub ub-ac uw-300 umar-r40">
					<div class="umar-r10 uw-70 ut-r">机构:</div>
					<input class="uinp ub ub-f1" type="text" id="branchKeyword" name="branchKeyword">
					<div class="uinp-more" onclick="searchBranch()">...</div>
				</div>
				
				<div class="ub ub-ac umar-r40">
					<label class="uncheckbox umar-l40">
						<input type="checkbox" name="showDisabled">
						显示禁用用户
					</label>
				</div>
			</div>
		</form>
		<div class="ub umar-t8 ub-f1">
			<table id="dg"></table>
		</div>

	</div>
</body>
</html>