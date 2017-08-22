
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>月盈亏平衡点</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/report/analysis/bepDayAnalysisList.js?V=${versionNo}"></script>
<style>
.datagrid-header .datagrid-cell {
	text-align: center !important;
	font-weight: bold;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="queryDayAnalysis()">查询</div>
					<shiro:hasPermission name="JxcBepDayAnalysis:export">
						<div class="ubtns-item" onclick="exportData()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>

			<div class="ub umar-l20">
		<!-- 	<input class="Wdate uw-300 uinp-no-more" name="startTime" id="startTime"
			onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" />
			<input class="Wdate uw-300 uinp-no-more" name="endTime" id="endTime"
			onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" /> -->
			   <!-- 引入时间选择控件 -->
	           <div class="ub ub-ac">
	            	<div class="umar-r10 uw-80 ut-r">日期:</div>
	       			<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	           </div>
			</div>

			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">机构名称:</div>
					<input name="branchId" id="branchId" type="hidden">
					<input name="branchCompleCode" id="branchCompleCode" type="hidden">
					<input class="uinp" id="branchCodeName" name="branchCodeName" type="text"
						 onclick="selectListBranches()" readonly="readonly" maxlength="50">
					<div class="uinp-more" onclick="selectListBranches()">...</div>
					
					<input type="hidden" id="startCount" name="startCount" >
					<input type="hidden" id="endCount" name="endCount" >
				</div>

				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">费用类型:</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="costType" id="status_no"
							value="0" checked="checked" /><label for="status_no">含折旧费用
						</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="costType"
							id="status_yes" value="1" /><label for="status_yes">不含折旧费用
						</label>
					</div>
				</div>

				<div class="ub ub-ac umar-r20">
				<div class="umar-r10 uw-600 ut-r uc-red ">说明：日盈亏平衡点计算公式 = 其他成本(设备折旧费用+累计摊销费用+长期待摊费用) / 毛利率</div>
				</div>

			</div>

		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="gridDayAnalysis"></table>
		</div>

	</div>
</body>
</html>