
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>机构信息</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="/static/js/views/branchManager/branchList.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<!--left-->
		<div class="ub ub-ver ubor">
			<div class="ubor-b "></div>
			<div class="ub upad-4 ub-f1 uscroll" style="min-width: 240px">
				<div class="zTreeDemoBackground left">
					<ul id="treeBranchList" class="ztree"></ul>
				</div>
			</div>
		</div>
		<!--left end-->

		<div class="ub ub-ver ub-f1 upad-4">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="query()">导出</div>
					<div class="ubtns-item" onclick="toClose()">退出</div>
				</div>
			</div>
			<form action="" id="formList" method="post">
				<div class="ub umar-t4">
					<div class="ub ub-ac umar-r10">
						<div class="umar-r10 ut-r">关键字:</div>
						<input class="uinp uw-400" type="text" name="codeOrName"
							id="codeOrName" placeholder="输入编号、名称进行查询">
					</div>
					<input type="button" class="ubtn umar-r10" value="查询"
						onclick="searchHandel()">

					<div class="ub ub-ac umar-r20">
						<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="type" id="status_no"
						value="0" checked="checked" /><label for="status_no">直营店
						</label>
						</div>
						<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="type"
						id="status_yes" value="1" /><label for="status_yes">加盟店 </label>
						</div>

						<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="type"
						id="status_all" value="" /><label for="status_all">全部</label>
						</div>
					</div>
				</div>
			</form>
			<div class="ub umar-t10 ub-f1">
				<table id="gridBranchList"></table>
			</div>
		</div>


	</div>
</body>
</html>