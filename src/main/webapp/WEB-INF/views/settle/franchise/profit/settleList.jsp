<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>加盟店毛利结算列表</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script  src="${ctx}/static/js/views/settle/franchise/profit/settleList.js?V=${versionNo}"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            	<!-- 记得加权限 -->
					<div class="ubtns-item" onclick="queryForm()">查询</div>
					<shiro:hasPermission name="JxcFranchiseProfit:add">
						<div class="ubtns-item" onclick="addProfitSetForm()">新增</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcFranchiseProfit:delete">
						<div class="ubtns-item" onclick="delProfitSetForm()">删除</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcFranchiseProfit:setting">
						<div class="ubtns-item-disabled">设置</div>
					</shiro:hasPermission>
	                <div class="ubtns-item" id="set" onclick="gFunRefresh()" >重置</div>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	        	<div class="ub ub-ac umar-l20">
	        	 <!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	            </div>
			</div>
	            <div class="ub umar-t8">
	                <div class="ub ub-ac" id="branchComponent">
	                    <div class="umar-r10 uw-70 ut-r">机构:</div>
	                    <input type="hidden" id="branchId" name="franchiseBranchId"/>
	                    <input class="uinp ub ub-f1" type="text" id="branchName"/>
	                    <div class="uinp-more">...</div>
	                </div>
	                <div class="ub ub-ac umar-l64" id="operatorComponent">
	                    <div class="umar-r10 uw-70 ut-r">制单人:</div>
	                    <input type="hidden" id="createUserId" name="createUserId" />
	                    <input class="uinp ub ub-f1" type="text" id="createUserName" />
	                    <div class="uinp-more">...</div>
	                </div>
	            </div>
	            <div class="ub umar-t8">
	                <div class="ub ub-ac">
	                     <div class="umar-r10 uw-70 ut-r">单据编号:</div>
	                    <input class="uinp" type="text" id="formNo" name="formNo">
	                </div>
	                <div class="ub ub-ac umar-l64">
	                    <div class="umar-r10 uw-70 ut-r">审核状态:</div>
	                    <div class="ub ub-ac umar-r10">
							<label>
								<input type="radio" name="auditStatus" value="0" checked="checked" onclick="queryForm()"/><span>未审核</span>
							</label>
	                    </div>
	                    <div class="ub ub-ac umar-r10">
							<label>
								<input type="radio" name="auditStatus" value="1" onclick="queryForm()"/><span>已审核</span>
							</label>
	                    </div>
	                    <div class="ub ub-ac umar-r10">
							<label>
								<input  type="radio" name="auditStatus" value=""  onclick="queryForm()"/><span>全部</span>
							</label>
	                    </div>
	                </div>
	            </div>
	            <div class="ub umar-t8">
	                <div class="ub ub-ac uw-630">
	                    <div class="umar-r10 uw-70 ut-r">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</div>
	                    <input class="uinp ub ub-f1" type="text" id="remark" name="remark">
	                </div>
	            </div>
	        
       	</form>
        <div class="ub ub-f1  umar-t8 umar-b8">
			<table id="profitSettList"></table>
		</div>
    </div>

</body>
</html>
