<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>机构补货分析</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/purchase/report/purchaseReplenishBranch.js?V=${versionNo}1"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            	<shiro:hasPermission name="JxcBranchReplenish:search">
	                <div class="ubtns-item" onclick="purchaseDetailCx()">查询</div>
	                </shiro:hasPermission>
					<shiro:hasPermission name="JxcBranchReplenish:export">
	                <div class="ubtns-item" onclick="exportDetails()">导出</div>
	                </shiro:hasPermission>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	            
	             <!-- 引入时间选择控件 -->
	           <div class="ub ub-ac">
<!-- 	            	<div class="umar-r10 uw-70 ut-r">日期:</div> -->
	       			<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	           </div>
            </div>
	               
	        <div class="ub uline umar-t8">
	        </div>
          <div class="ub umar-t8">
          	<div class="ub ub-ac uw-300" id="targetBranch">
				<div class="umar-r10 uw-80 ut-r">查询机构:</div>
				<input class="uinp ub ub-f1" type="text" id="branchCodeName" name="branchCodeName" />
				<input type="hidden" id="branchCompleCode" name="branchCompleCode" />
				<input type="hidden" name="branchId" id="branchId" />
				<input type="hidden" name="branchName" id="branchName" />
				<div class="uinp-more">...</div>
			</div>
			
			  <div class="ub ub-ac uw-300">
				<div class="umar-r10 uw-80 ut-r">商品名称:</div>
				<input type="text" name="skuName" id="skuName" class="uinp" />
			  </div>
			  
			  <div class="ub ub-ac uw-300">
				<div class="umar-r10 uw-80 ut-r">类别:</div>
				  <div class="ub">
					  <input type="text" id="categoryCode" name="categoryCode" class="uinp" maxlength="50" />
					  <div class="uinp-more" id="categorySelect" onclick="searchCategory()">...</div>
				  </div>
			  </div>
            </div>
            
             <div class="ub umar-t8">
			  <div class="ub ub-ac uw-300">
				<div class="umar-r10 uw-80 ut-r">货号/条码:</div>
				<input type="text" name="skuCodeOrBarCode" id="skuCodeOrBarCode" class="uinp ub ub-f1" />
			  </div>
               <div class="ub ub-ac uw-300" id="supplierComponent">
				<div class="umar-r10 uw-80 ut-r">供应商:</div>
				   <div class="ub">
					   <input type="hidden" name="supplierId" id="supplierId" class="uinp" />
					   <input type="text" id="supplierName" class="uinp" maxlength="50" />
					   <div class="uinp-more" id="supplierSelect">...</div>
				   </div>
			  </div>
            </div>
            
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="purReportDetail"></table>
		</div>
    </div>
</body>
</html>