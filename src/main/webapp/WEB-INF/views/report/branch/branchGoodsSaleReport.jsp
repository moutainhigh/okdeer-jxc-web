<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>分公司商品查询分析</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<script src="${ctx}/static/js/views/report/branch/branchGoodsSaleReport.js?V=${versionNo}"></script>
</head>
<body class="uw  ufs-14 upad-8 uc-black box-border">
    <div class="ub uh ub-f1 ">
           <!--left start-->
		    <div class="ub ub-ver ubor">
		        <div class="upad-4">
		            <select id="goodsType" class="easyui-combobox uselect" data-options="editable:false"></select>
		        </div>
		        <div class="ubor-b "></div>
		        <div class="ub upad-4 ub-f1 uscroll">
		            <div class="zTreeDemoBackground left">
		                <ul id="treeArchives" class="ztree"></ul>
		            </div>
		        </div>
		    </div>
		   <!--left end-->

     <div class="ub ub-ver ub-f1 upad-8">
        <form id="exportForm" method="post">
        </form>
		<form id="queryForm" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="query()">查询</div>
					<!-- <div class="ubtns-item" onclick="printReport()">打印</div> -->
					<div class="ubtns-item" onclick="exportData()">导出</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
					<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
				</div>
				<div class="ub ub-ac umar-l20">
					<!-- 引入时间选择控件 -->
					<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r20">
				     <!-- 隐藏类别 -->
					<input type="hidden" name="startCount" id="startCount" class="uinp" />
					<input type="hidden" name="endCount" id="endCount" class="uinp" />
					<input type="hidden" name="categoryCode" id="categoryCode" class="uinp" />
					<div class="umar-r10 uw-60 ut-r">机构名称:</div>
					<input type="text" name="branchName" id="branchName" class="uinp" value="${branchesGrow.type == 0 ? '' : branchesGrow.branchName}" maxlength="50"/>
					<input type="hidden" name="branchId" id="branchId" value="${branchesGrow.branchesId}">
					<div class="uinp-more" onclick="searchBranch()">...</div>
				</div>
				<div class="ub ub-ac umar-r20">
					<div class="umar-r10 uw-60 ut-r">货号:</div>
					<input type="text" name="skuCode" id="skuCode" class="uinp" placeholder="输入货号、条码" maxlength="20"/>
				</div>
				<div class="ub ub-ac umar-r20">
					<div class="umar-r10 uw-60 ut-r">商品类型:</div>
					<select name="type" id="type" class="uselect" style="width: 204px;">
						<option value="">全部</option>
						<c:forEach items="${goodsType}" var="type">
							<option value="${type.name}">${type.value}</option>
						</c:forEach>
					</select>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r20">
					<div class="umar-r10 uw-60 ut-r">商品名称:</div>
					<input type="text" name="skuName" id="skuName" class="uinp" maxlength="50"/>
				</div>
				<div class="ub ub-ac umar-r20">
					<div class="umar-r10 uw-60 ut-r">供应商:</div>
					<input type="text" name="supplierName" id="supplierName" class="uinp" maxlength="50" onblur="supplierAutoComple()" onkeyup="supplierAutoComple()"/>
					<input type="hidden" name="supplierId" id="supplierId" class="uinp" maxlength="50"/>
					<div class="uinp-more" onclick="searchSupplier()">...</div>
				</div>
				<div class="ub ub-ac umar-r20">
					<div class="umar-r10 uw-60 ut-r">计价方式:</div>
					<select name="pricingType" id="pricingType" class="uselect" style="width: 204px !important;">
					<option value="">全部</option>
					<c:forEach items="${pricingType}" var="pricingType">
						<option value="${pricingType.name}">${pricingType.value}</option>
					</c:forEach>
					</select>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r20">
					<div class="umar-r10 uw-60 ut-r">商品类别:</div>
				    <input type="hidden" name="categoryCodes" id="categoryCodes"/>
                    <input type="text" name="categoryName" id="categoryName" readonly="readonly" onclick="searchCategory()" class="uinp" maxlength="50" />
                    <div class="uinp-more" id="categorySelect" onclick="searchCategory()">...</div>
				</div>
                <div class="ub ub-ac umar-r20">
                    <div class="umar-r10 uw-60 ut-r">配送方式:</div>
                    <select name="fastDeliver" id="fastDeliver" class="uselect" style="width: 204px;">
                        <option value="">全部</option>
                        <option value="0">常规</option>
                        <option value="1">直送</option>
                    </select>
                </div>
				<div class="ub ub-ac umar-r20">
					<div class="umar-r10 uw-60 ut-r">品牌:</div>
					<input type="text" name="brandName" id="brandName" class="uinp" maxlength="50" onblur="brandAutoComple()" onkeyup="brandAutoComple()" />
					<input type="hidden" name="brandId" id="brandId" class="uinp" maxlength="50" />
					<div class="uinp-more" onclick="searchBind()">...</div>
				</div>
			</div>
		</form>
		 <div class="ub ">&nbsp;</div>
		 <div class="ub ub-f1">
		 	<table id="goodsTab"></table>
		 </div>
	 </div>
	</div>
</body>
</html>