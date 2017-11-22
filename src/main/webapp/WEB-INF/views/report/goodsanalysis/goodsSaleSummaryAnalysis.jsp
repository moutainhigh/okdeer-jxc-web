<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>商品销售汇总分析</title>
	
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
	<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
	
	<script src="${ctx}/static/js/views/report/goodsanalysis/goodsSaleSummaryAnalysis.js?V=${versionNo}8"></script>
	
	<style>
		.datagrid-header-row .datagrid-cell{text-align: center!important;}
	</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<input type="hidden" id="tabKey" name="tabKey" value = "byGoods">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="purchaseTotalCx()">查询</div>
	                <div class="ubtns-item" onclick="toGpeExport()">导出</div>
	                <div class="ubtns-item" onclick="toGpeSetting()">设置</div>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	             <!-- 引入时间选择控件 -->
	           <div class="ub ub-ac">
	            	<div class="umar-r10 uw-80 ut-r">日期:</div>
	       			<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	                <input type="hidden" id="startCount" name="startCount" />
					<input type="hidden" id="endCount" name="endCount" />
	           </div>
            </div>
	        <div class="ub uline umar-t8">
	        </div>
	        <div class="ub umar-t8">
			    <div class="ub ub-ac" id="branchComple">
			        <div class="umar-r10 uw-84 ut-r">店铺名称:</div>
			        <input class="uinp" type="hidden" id="branchId" name="branchId">
			        <input class="uinp" type="hidden" id="branchCompleCode" name="branchCompleCode">
			        <input class="uinp" type="text" id="branchName" name="branchName">
			        <div class="uinp-more">...</div>
			    </div>
			    
			    <div id="categoryNameDiv" class="ub ub-ac">
			        <div class="umar-r10 uw-84 ut-r">商品类别:</div>
					<input type="hidden" name="goodsCategoryId" id="goodsCategoryId"  />
			        <input type="hidden" name="categoryCode" id="categoryCode"  />
			        <input type="text" name="categoryName" id="categoryName" class="uinp " maxlength="50" />
			        <div class="uinp-more" id="categorySelect">...</div>
			    </div>

				<div class="ub ub-ac" id="supplierComponent">
				<div class="umar-r10 uw-70 ut-r">供应商:</div>
				<input class="uinp" name="supplierId" id="supplierId" type="hidden">
				<input class="uinp" name="supplierName" id="supplierName" type="text">
				<div class="uinp-more">...</div>
				</div>

			</div>
			<div class="ub umar-t8">
			    <div class="ub ub-ac umar-l4">
			        <div class="umar-r10 uw-80 ut-r">商品名称:</div>
			        <input type="text" name="skuName" id="skuName" class="uinp" />
			    </div>
			    <div class="ub ub-ac">
			        <div class="umar-r10 uw-84 ut-r">货号/条码:</div>
			        <input type="text" name="skuCodeOrBarCode" id="skuCodeOrBarCode" class="uinp" />
			    </div>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-80 ut-r">查询类型:</div>
					<div class="ub ub-ac umar-r10 ">
						<label>
							<input class="radioItem" id="goodsTotal" type="radio" name="searchType" value="byGoods" checked="checked" />
							商品汇总
						</label>
					</div>
					<div class="ub ub-ac  uh-36">
						<label class="umar-r10">
							<input class=" radioItem" id="categoryTotal" type="radio" name="searchType" value="byGigCategory" />
							大类汇总
						</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<label>
							<input class="radioItem" type="radio" name="searchType" value="byStore" />
							店铺汇总
						</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<label>
							<input class="radioItem" type="radio" name="searchType" value="byStoreGoods" />
							店铺商品汇总
						</label>
					</div>
				</div>
			</div>
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="goodsTotalAnalysi"></table>
		</div>
    </div>
</body>
</html>