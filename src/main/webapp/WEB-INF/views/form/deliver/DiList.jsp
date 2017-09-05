<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>配送入库</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script  src="${ctx}/static/js/views/deliver/DiList.js?V=${versionNo}"></script>
    
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            	<shiro:hasPermission name="JxcDeliverDI:search">
						<div class="ubtns-item" onclick="queryForm()">查询</div>
				   	</shiro:hasPermission>
	            	<shiro:hasPermission name="JxcDeliverDI:add">
						<div class="ubtns-item" id="btnAdd" onclick="addDeliverForm()">新增</div>
				   	</shiro:hasPermission>
				   	<shiro:hasPermission name="JxcDeliverDI:delete">
						<div class="ubtns-item" id="refuse" onclick="refuseDeliverForm()">拒收</div>
				   	</shiro:hasPermission>
	            	<shiro:hasPermission name="JxcDeliverDI:delete">
						<div class="ubtns-item" id="btnDel" onclick="delDeliverForm()">删单</div>
				   	</shiro:hasPermission>
	            	<shiro:hasPermission name="JxcDeliverDI:setting">
						<div class="ubtns-item-disabled">设置</div>
				   	</shiro:hasPermission>
				   	<div id="updatePermission" class="none">
						<shiro:hasPermission name="JxcDeliverDI:update" >修改</shiro:hasPermission>
					</div>
	                <div class="ubtns-item" id="set" onclick="gFunRefresh()" >重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	        	<div class="ub ub-ac umar-l20">
	        		<!-- 引入时间选择控件 -->
	            	<%@ include file="/WEB-INF/views/component/dateSelectHour.jsp"%>
	            </div>
			</div>
	        <div class="ub umar-t8">
				<div class="ub ub-ac umar-r10" id="sourceBranch">

				<div class="umar-r10 uw-72 ut-r">发货机构:</div>
				<input type="hidden" id="sourceBranchId" name="sourceBranchId"/>
				<%--<input type="hidden" id="sourceBranchName" name="sourceBranchName"/>--%>
				<input class="uinp ub ub-f1" type="text" id="sourceBranchName" name="sourceBranchName" />
				<div class="uinp-more">...</div>

				</div>

	        	<div class="ub ub-ac uw-300 umar-l30">
	            	<div class="umar-r10 uw-70 ut-r">单据编号:</div>
						<input type="hidden" id="formType" name="formType" value="DO"/>
	                    <input type="hidden" id="deliverType" name="deliverType" value="DI" />
	                    <input class="uinp ub ub-f1" type="text" id="formNo" name="formNo">
	                </div>

		        </div>

				<div class="ub umar-t8">
					<div class="ub ub-ac umar-r10" id="targetBranch">

					<div class="umar-r10 uw-72 ut-r">收货机构:</div>
					<input type="hidden" id="targetBranchId" name="targetBranchId"/>
					<%--<input type="hidden" id="targetBranchType" name="targetBranchType"/>--%>
					<input class="uinp ub ub-f1" type="text" id="targetBranchName" name="targetBranchName" />
					<div class="uinp-more">...</div>

					</div>

					<div class="ub ub-ac uw-300 umar-l30" id="operateorSelect">
					<div class="umar-r10 uw-70 ut-r">制单人员:</div>
					<input class="uinp ub ub-f1" type="hidden"  id="operateUserId" name="operateUserId" />
					<input class="uinp ub ub-f1" type="text"  id="operateUserName" name="operateUserName"/>
					<div class="uinp-more">...</div>
					</div>

				</div>

			<div class="ub umar-t8">
	        	<div class="ub ub-ac uw-624" id="remarkDiv">
	            	<div class="umar-r10 uw-70 ut-r">备注:</div>
					<input class="uinp ub ub-f1" type="text" id="remark" name="remark"/>
				</div>

			</div>
       	</form>
        <%--<div class="ub ub-f1  umar-t8 umar-b8">
			<table id="deliverFormList"></table>
		</div>--%>
		<div class="ub ub-f1  umar-t8 umar-b8">
			<div id="tabs" class="easyui-tabs" data-options="fit:true,border:false,tabWidth:120,tabHeight:25" style="">
				<div title="待处理出库单" id="pending" style="padding: 5px; height: auto;">
					<table id="deliverFormList"></table>
				</div>
				<div title="配送入库单" id="processed" style="height: auto;">
					<table id="processedFormList"></table>
				</div>
			</div>
		</div>
    </div>
</body>
</html>
