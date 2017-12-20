
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>建店费用查询报表</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/finance/buildCharge/buildChargeSearch.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryForm()">查询</div>
					<shiro:hasPermission name="JxcbuildChargeSearch:export">
						<div class="ubtns-item" onclick="toGpeExport()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>
				
				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
				
			</div>
			
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40" id="branchComponent">
					<div class="umar-r10 uw-60 ut-r">机构:</div>
					<input type="hidden" id="branchCompleCode" name="branchCompleCode" />
					<input class="uinp" id="branchCodeName" name="branchCodeName" type="text"  />
					<div class="uinp-more" >...</div>
				</div>
				<div class="ub ub-ac">
                   <div class="umar-r10 ut-r">类别:</div>
                   <input type="hidden" id="categoryCode" name="categoryCode"  />
                   <input class="uinp ub ub-f1" type="text" id="categoryName"
						name="categoryName"  onclick="openChargeCodeDialog()" readonly="readonly"/>
                   <div class="uinp-more" onclick="openChargeCodeDialog()">...</div>
                </div>
			</div>
			<div class="ub umar-t8"><div class="ub ub-ac umar-r40">
				<div class="ub ub-ac umar-r40">
                     <div class="umar-r10 uw-60 ut-r">单号:</div>
                     <input class="uinp" type="text" id="formNo" name="formNo"/>
                </div>
				<div class="umar-r10 ut-r">名称:</div>
	                 <input class="uinp" type="text" id="chargeName" name="chargeName"/>
	            </div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">查询类型:</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem tabKey" type="radio" name="tabKey" id="status0"
							value="total" checked="checked" /><label for="status0">费用汇总 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem tabKey" type="radio" name="tabKey" id="status1"
							value="detail" /><label for="status1">费用明细 </label>
					</div>
				</div>
			</div>

		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="gridbuildChargeSearch"></table>
		</div>

	</div>
</body>
</html>