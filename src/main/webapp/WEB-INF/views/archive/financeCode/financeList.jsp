<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>财务代码</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<script src="${ctx}/static/js/views/financeCode/financeList.js?V=${versionNo}"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-f1 umar-4 upad-4">
		<!--left-->
		<div class="ub ub-ver ubor uw-240" >
			<div class="ub upad-4 ub-f1 uscroll">
				<div class="zTreeDemoBackground left">
					<ul id="treefinances" class="ztree"></ul>
				</div>
			</div>
		</div>
		<!--left end-->

		<div class="ub ub-ver ub-f1 upad-4">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryFinanceCode()">查询</div>
					<shiro:hasPermission name="JxcFinanceCode:add">
						<div class="ubtns-item" onclick="addFinanceCode()">新增</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcFinanceCode:delete">
						<div class="ubtns-item" onclick="delFinanceCode()">删除</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcFinanceCode:export">
						<div class="ubtns-item" onclick="exportData()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
					
					<div id="updatePermission" class="none">
						<shiro:hasPermission name="JxcFinanceCode:update">修改</shiro:hasPermission>
					</div>
				</div>
			</div>
			<form action="" id="formFinanceList" method="post">
				<div class="ub umar-t4">
					<div class="ub ub-ac umar-r10">
						<div class="umar-r10 ut-r">关键字:</div>
						<input class="uinp uw-400" type="text" name="dictKeyword"
							id="dictKeyword" placeholder="输入编号、名称进行查询">
							
						<input type="hidden" name="typeCode" id="typeCode" />
					</div>
				</div>
			</form>
			<div class="ub umar-t10 ub-f1">
				<table id="gridfinanceList"></table>
			</div>
		</div>


	</div>
	
	<!-- 机构运营费用  start -->
	<div id="operatorDialog" >
    	<div class="uw uh ufs-14 uc-black none" id="operatorDialog-area">
	    	<div class="ub ub-ver uw upad-4 box-border " >
	    		<div class="ub uw ">
	    			<div class="ubtns">
						<div class="ubtns-item" onclick="saveCost()">保存</div>
		                <div class="ubtns-item" onclick="closeOperationDialog()">关闭</div>
		            </div>
	    		</div>
	    		<div class="ub uline umar-t8"></div>
	    		<!-- 后台记得修改name值  并记得修改 js 逻辑-->
	    		<form class="ub ub-f1 ub-ver ub-ac umar-t8" id="costForm">
		            <div class="ub ub-ac  umar-t20" style="margin-left:-16px;">
		                <div class="umar-r10 uw-90 ut-r">类型:</div>
		                <div class="utxt">机构运营费用</div>
		            </div>
		            <div class="ub ub-ac  umar-t20" style="margin-left:-16px;">
		                <div class="umar-r10 uw-90 ut-r">名称:</div>
		                <input class="uinp ub ub-f1" name="typeName" id="typeName" type="text" > 
		            </div>
	    		</form>			
	    	</div>
    	</div>
    </div>
    <!-- 机构运营费用  end -->
    
</body>
</html>