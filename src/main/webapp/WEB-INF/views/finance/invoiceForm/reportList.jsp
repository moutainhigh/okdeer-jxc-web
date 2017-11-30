<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>用户发票处理</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/finance/invoiceForm/reportList.js?V=${versionNo}1"></script>
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
					<div class="ubtns-item" onclick="queryForm()">查询</div>
					<div class="ubtns-item" onclick="processForm()">处理</div>
					<div class="ubtns-item" onclick="printReport()">打印</div>
					<div class="ubtns-item" onclick="toGpeExport()">导出</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>
				
				<input type="hidden" id="startCount" name="startCount" />
				<input type="hidden" id="endCount" name="endCount" />

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac uw-300" id="branchComponent">
					<div class="umar-r10 uw-70 ut-r">机构名称:</div>
					<input name="branchCompleCode" id="branchCompleCode" type="hidden">
					<input class="uinp ub ub-f1" id="branchName" name="branchName" type="text"  >

					<div class="uinp-more" >...</div>
				</div>

				<div class="ub ub-ac uw-300 umar-l20" >
				<div class="umar-r10 uw-70 ut-r">电子邮箱:</div>
				<input class="uinp ub ub-f1" id="userEmail" name="userEmail" type="email"  >
				</div>

				<div class="ub ub-ac uw-300 umar-l20" >
				<div class="umar-r10 uw-70 ut-r">联系人:</div>
				<input class="uinp ub ub-f1" id="userName" name="userName" type="text"  >
				</div>

			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-70 ut-r">报表类型:</div>
					<div class="ub ub-ac umar-r10">
						<label>
						<input class="radioItem tabKey" type="radio" name="tabKey" onclick="changeTabKey()" value="default" checked="checked" /><span>开票申请统计</span>
						</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<label>
						<input class="radioItem tabKey" type="radio" name="tabKey" onclick="changeTabKey()" value="refund" /><span>已开票退货统计</span>
						</label>
					</div>
				</div>

				<div class="ub ub-ac  uw-300  umar-l20">
				<div class="umar-r10 uw-70 ut-r">抬头类型:</div>
					<select class="easyui-combobox uselectws" style="width:220px;" name="titleType" id="titleType" data-options="editable:false">
					<option value="1">全部</option>
					<option value="2">企业抬头</option>
					<option value="8">个人/非企业单位抬头</option>
					</select>
				</div>

				<div class="ub ub-ac uw-300 umar-l20">
					<div class="umar-r10 uw-70 ut-r">处理状态:</div>
					<div class="ub ub-ac umar-r10">
					<label>
					<input class="radioItem tabKey" type="radio" name="tabKey"  value="0" checked="checked" /><span>全部</span>
					</label>
					</div>
					<div class="ub ub-ac umar-r10">
					<label>
					<input class="radioItem tabKey" type="radio" name="tabKey"  value="1" /><span>未处理</span>
					</label>
					</div>
					<div class="ub ub-ac umar-r10">
					<label>
					<input class="radioItem tabKey" type="radio" name="tabKey"  value="2" /><span>已处理</span>
					</label>
					</div>
					</div>

			</div>

			<div class="ub umar-t8">
			<div class="ub ub-ac uw-620">
			<div class="umar-r10 uw-70 ut-r">备注:</div>
			<input class="uinp ub ub-f1" name="remark" id="remark" type="text" maxlength="100">
			</div>
			</div>

		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="gridInvoiceFormList"></table>
		</div>

	</div>
</body>
</html>