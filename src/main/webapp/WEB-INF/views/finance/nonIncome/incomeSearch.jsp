
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>营业外收入-查询</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/finance/nonIncome/incomeSearch.js?V=${versionNo}"></script>
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
					<div class="ubtns-item" onclick="queryCharge()">查询</div>
					<shiro:hasPermission name="JxcNonIncomeSearch:export">
						<input type="hidden" id="startCount" name="startCount" />
						<input type="hidden" id="endCount" name="endCount" />
						<div class="ubtns-item" onclick="exportData()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">机构:</div>
					<input type="hidden" id="branchCompleCode" name="branchCompleCode" />
					<input type="hidden" id="branchId" name="branchId" />
					<input class="uinp" id="branchName" name="branchName" type="text" 
						readonly="readonly" onclick="selectListBranches()" />
					<div class="uinp-more" onclick="selectListBranches()">...</div>
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">月份:</div>
					<input class="Wdate uw-300 uinp-no-more" name="month" id="month"
						onclick="WdatePicker({dateFmt:'yyyy-MM',maxDate:'%y-%M'})" />
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					 <div class="umar-r10 uw-60 ut-r">收入名称:</div>
	                 <select class='uinp easyui-combobox uinp-no-more' id="costTypeId" name="costTypeId" style="width:204px;"
	                 data-options="valueField:'id',textField:'label',url:'${ctx}/archive/financeCode/getDictListByTypeCode?dictTypeCode=101007'">
	                 </select>
	            </div>
                <div class="ub ub-ac umar-r40">
                     <div class="umar-r10 uw-60 ut-r">单据编号:</div>
                     <input class="uinp" type="text" id="formNo" name="formNo"/>
                </div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">查询类型:</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="queryType" id="status0"
							value="total" checked="checked" /><label for="status0">收入汇总 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="queryType" id="status1"
							value="detail" /><label for="status1">收入明细 </label>
					</div>
				</div>
			</div>

		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="gridNonIncomeSearch"></table>
		</div>

	</div>
</body>
</html>