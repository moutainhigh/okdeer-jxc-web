
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>费用档案</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/settle/charge/chargeRecord.js?V=${versionNo}11"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-f1 umar-4 upad-4">
		<!--left-->
		<div class="ub ub-ver ubor uw-240">
			<div class="ub upad-4 ub-f1 uscroll">
				<div class="zTreeDemoBackground left">
					<ul id="treeChargeRecord" class="ztree"></ul>
				</div>
			</div>
		</div>
		<!--left end-->

		<div class="ub ub-ver ub-f1 upad-4">
			<div class="ub ub-ac">
				<div class="ubtns">
					<shiro:hasPermission name="bdCharge:append">
						<div class="ubtns-item" onclick="addChargeRecord()">新增</div>
					</shiro:hasPermission>
					<%--<shiro:hasPermission name="JxcFinanceCode:delete">--%>
						<%--<div class="ubtns-item" onclick="delChargeRecord()">删除</div>--%>
					<%--</shiro:hasPermission>--%>
					<shiro:hasPermission name="bdCharge:append">
						<div class="ubtns-item" onclick="copyChargeRecord()">复制</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="toClose()">关闭</div>

				</div>
			</div>
			<form action="" id="formChargeRecordList" method="post">
				<div class="ub umar-t4">
					<div class="ub ub-ac umar-r10">
						<div class="umar-r10 ut-r">关键字:</div>
						<input class="uinp uw-400" type="text" name="chargeCodeName"
							id="chargeCodeName" placeholder="输入编号、名称进行查询"> <input
							type="hidden" name="categoryCode" id="categoryCode" />
					</div>
                        <input type="button" class="ubtn  umar-r10" value="查询" onclick="queryChargeRecord()">
				</div>
			</form>
			<div class="ub umar-t10 ub-f1">
				<table id="gridChargeRecordList"></table>
			</div>
		</div>


	</div>

</body>
</html>