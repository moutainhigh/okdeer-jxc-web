<%--
  Created by IntelliJ IDEA.
  User: Jason
  Date: 2017/8/16
  Time: 18:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Pos快捷设置</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/sale/group/keyList.js?V=${versionNo}34"></script>
<style>
.datagrid-header-row .datagrid-cell {
	text-align: center !important;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<div class="ub ub-ac">
			<div class="ubtns">
				<shiro:hasPermission name="posGroupKey:save">
					<div class="ubtns-item" onclick="saveform()">保存</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="posGroupKey:copyBranch">
					<div class="ubtns-item" style="width: 120px;" onclick="copyfrom()">从其他机构复制</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="posGroupKey:addGroup">
					<div class="ubtns-item" onclick="addgroup()">新增分组</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="posGroupKey:delete">
					<div class="ubtns-item" onclick="delgroup()">删除</div>
				</shiro:hasPermission>
				<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
				<div class="ubtns-item" onclick="toClose()">关闭</div>
			</div>

		</div>
		<form id="groupform">
		<div class="ub umar-t8 umar-b8">
			<div class="ub ub-ac" id="branchTemp">
				<div class="umar-r10 uw-70 ut-r">机 构:</div>
				<input class="uinp ub ub-f1" type="hidden" id="branchId"
					name="branchId"> <input class="uinp ub ub-f1" type="text"
					id="branchName" name="branchName">
				<div class="uinp-more">...</div>
			</div>
		</div>
		</form>
		<div class="ub umar-t8">
			<table id="keygrid"></table>
		</div>

		<div id="dvbtn" class="ub umar-t8 umar-b8">
			<div class="ub  ub-ac">
				<div class="umar-r10 uw-70 ut-r">商品信息:</div>
				<div class="ubtns">
					<div class="ubtns-item" onclick="savegoods()">保存</div>
					<div id="btnHot" class="event-none ubtns-item-disabled"
						onclick="hotgoods()">热销商品</div>
					<div class="ubtns-item" onclick="selectGoods()">商品选择</div>
				</div>
			</div>
		</div>

		<div id="goodsgridForm" class="ub">
			<table id="goodsgrid"></table>
		</div>

	</div>

</body>
</html>
