
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>直送配送缺货率分析报表</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/report/direct/outOfStock.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="query()">查询</div>
					<div class="ubtns-item" onclick="exportData()">导出</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
			</div>

			<div class="ub uline umar-t8"></div>

			<div class="ub umar-t8">
				<div class="ub  ub-ac umar-l20" id="targetBranch">
					<div class="umar-r10 uw-70 ut-r">要货机构:</div>
					<input class="uinp ub ub-f1" type="hidden" id="targetBranchId"
						name="targetBranchId"> <input class="uinp ub ub-f1"
						type="text" id="targetBranchName" name="targetBranchName">
					<div class="uinp-more">...</div>
				</div>

				<div class="ub  ub-ac">
					<div class="ub ub-ac umar-l20" id="categorySelect">
						<div class="umar-r10 uw-70 ut-r">商品类别:</div>
						<input id="goodsCategoryId" name="goodsCategoryId" class="uinp"
							type="hidden"> <input id="categoryCode"
							name="categoryCode" class="uinp" type="hidden"> <input
							id="categoryName" name="categoryName" class="uinp" type="text"
							data-options="required:true">
						<div class="uinp-more" id="dvCategory">...</div>
					</div>
				</div>


			</div>

			<div class="ub umar-t8">
				<div class="ub  ub-ac umar-l20" id="sourceBranch">
					<div class="umar-r10 uw-70 ut-r">发货机构:</div>
					<input class="uinp ub ub-f1" type="hidden" id="sourceBranchId"
						name="sourceBranchId"> <input class="uinp ub ub-f1"
						type="text" id="sourceBranchName" name="sourceBranchName">
					<div class="uinp-more">...</div>
				</div>

				<div class="ub ub-ac umar-l20">
					<div class="umar-r10 uw-70 ut-r">商品名称:</div>
					<input class="uinp ub ub-f1" type="text" name="skuName"
						id="skuName">
				</div>

			</div>

			<div class="ub umar-t8">

				<div class="ub  ub-ac umar-l20">
					<div class="umar-r10 uw-70 ut-r">单据编号:</div>
					<input class="uinp" type="text" name="formNo" id="formNo">
				</div>

				<div class="ub ub-ac umar-l20">
					<div class="umar-r10 uw-70 ut-r">货号/条码:</div>
					<input class="uinp ub ub-f1" type="text" name="skuCode"
						id="skuCode">
				</div>

				<div class="ub ub-ac umar-l20">
					<div class="umar-r10 uw-70 ut-r">查询类型:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="type" id="deal0"
							value="0" checked="checked" /><label for="deal0">商品明细 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="type" id="deal2"
							value="1" /><label for="deal2">商品汇总</label>
					</div>

					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="type" id="deal3"
							value="2" /><label for="deal3">单据汇总</label>
					</div>

					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="type" id="deal4"
							value="3" /><label for="deal4">店铺汇总</label>
					</div>

				</div>

			</div>

		</form>
		<div class="ub uw umar-t8 ub-f1">
			<table id="marketWater"></table>
		</div>

	</div>
</body>
</html>