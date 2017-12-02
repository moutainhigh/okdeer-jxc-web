<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>销售流水</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script
	src="${ctx}/static/js/views/report/cash/saleFlowReport.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell {
	text-align: center !important;
}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">

	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<shiro:hasPermission name="JxcSaleFlow:search">
						<div class="ubtns-item" onclick="query()">查询</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcSaleFlow:print">
						<div class="ubtns-item" onclick="printReport()">打印</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcSaleFlow:export">
						<div class="ubtns-item" onclick="toGpeExport()">导出</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="toGpeSetting()">设置</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
					<div class="ubtns-item" onclick="toClose()">退出</div>
				</div>

				<!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelectHour.jsp"%>
			</div>

			<div class="ub uline umar-t8"></div>
			<div class="ub umar-t8">
				  <div class="ub ub-ac" id="branchComponent">
                   <div class="umar-r10 uw-70 ut-r">店铺:</div>
						<input type="hidden" id="branchId" name="branchId"/>
	                    <input class="uinp ub ub-f1" type="hidden" id="branchCode" name="branchCode">
                        <input class="uinp ub ub-f1" type="text" id="branchNameOrCode" name="branchNameOrCode">
                   <div class="uinp-more">...</div>
                </div>
				<div class="ub ub-ac  umar-l20">
					<div class="umar-r10 uw-70 ut-r">商品名称:</div>
					<input class="uinp ub ub-f1" type="text" name="skuName"
						id="skuName">
				</div>

				<div class="ub uselectw ub-ac umar-l20">
					<div class="umar-r10  uw-70 ut-r">经营方式:</div>
					<select class="easyui-combobox uselect" name="saleWay"
						id="saleWay" data-options="editable:false">
						<option value="" selected="selected">全部</option>
						<option value="A">购销</option>
						<option value="B">代销</option>
						<option value="C">联营</option>
						<option value="D">扣率代销</option>
					</select>
				</div>


			</div>

			<div class="ub umar-t8">
				<div class="ub  ub-ac">
					<div class="umar-r10 uw-70 ut-r">单号:</div>
					<input class="uinp" type="text" name="orderNo" id="orderNo">
				</div>
				<div class="ub ub-ac  umar-l20">
					<div class="umar-r10 uw-70 ut-r">货号/条码:</div>
					<input class="uinp ub ub-f1" type="text" name="skuCode"
						id="skuCode">
				</div>

				<div class="ub uselectw ub-ac umar-l20">
					<div class="umar-r10  uw-70 ut-r">商品类型:</div>
					<select class="easyui-combobox uselect" name="goodsType"
						id="goodsType" data-options="editable:false">
						<option value="" selected="selected">全部</option>
						<option value="0">普遍商品</option>
						<option value="1">制单组合</option>
						<option value="2">制单拆分</option>
						<option value="3">捆绑商品</option>
						<option value="4">自动转货</option>
					</select>
				</div>

			</div>

			<div class="ub umar-t8">
				<div class="ub uselectw ub-ac">
					<div class="umar-r10  uw-70 ut-r">业务类型:</div>
					<select class="easyui-combobox uselect" name="businessType"
						id="businessType" data-options="editable:false">
						<option value="" selected="selected">全部</option>
						<option value="A">销售</option>
						<option value="B">退货</option>
					</select>
				</div>
				<div class="ub ub-ac  uselectw umar-l20">
					<div class="umar-r10 uw-70 ut-r">订单类型:</div>
					<!--select-->
					<select class="easyui-combobox   uselect" name="orderType"
						id="orderType" data-options="editable:false">
						<option value="" selected="selected">全部</option>
						<option value="0">APP</option>
						<option value="1">微信</option>
						<option value="2">POS</option>
						<option value="3">扫码购</option>
						<option value="4">会员自助</option>
						<option value="5">小程序</option>
					</select>
				</div>
                <div class="ub ub-ac uselectw umar-l20">
                    <div class="umar-r10 uw-70 ut-r">订单状态:</div>
                        <select class="easyui-combobox uselect" name="status" id="status" data-options="editable:false">
                            <option value="1" selected="selected">已完成</option>
                            <option value="2">支付中/待支付</option>
                        </select>
                </div>
			</div>
		</form>

		<div class="ub ub-f1 umar-t20">
			<table id="marketWater"></table>
		</div>
	</div>
</body>
</html>