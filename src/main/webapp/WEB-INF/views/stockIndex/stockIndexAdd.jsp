<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>库存存量指标</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <%-- <script  src="${ctx}/static/js/fun/publicComponent.js"></script> --%>
    <script  src="${ctx}/static/js/views/stockIndex/stockIndexAdd.js"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">

   <div class="ub ub-ver ub-f1 umar-4 upad-4">
	<form id="queryForm" action="" method="post">
		<div class="ub ub-ac upad-4">
            <div class="ubtns">
                <div class="ubtns-item" onclick="queryForm()">保存</div>
                <div class="ubtns-item" onclick="selectGoods()">商品选择</div>
                <div class="ubtns-item" onclick="toImportproduct(0)" >导入货号</div>
                <div class="ubtns-item" onclick="toImportproduct(1)" >导入条码</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-70 ut-r">机构名称:</div>
				<input type="hidden" id="createBranchId" name="createBranchId" />
				<input class="uinp ub ub-f1" type="text" id="branchName" name="branchName" maxlength="50"/>
				<div class="uinp-more" onclick="selectBranch();" >...</div>
			</div>
			<div class="ub ub-ac umar-l30 uw-300">
				<div class=" umar-r10 uw-70 ut-r">库存上限:</div>
				<input type="text" id="stockBegin" name="stockBegin" class="uinp"  />
			</div>
			<div class="ub ub-ac umar-l30 uw-300">
				<div class=" umar-r10 uw-70 ut-r">库存下限:</div>
				<input type="text" id="stockEnd" name="stockEnd" class="uinp" />
			</div>
		</div>
    </form>
    
    <div class="ub ub-f1  umar-t16 umar-b8">
    	<!-- addModifyPriceGrid  -->
		<table id="stockIndexAdd"></table>
	</div>
   </div>

</body>
</html>
