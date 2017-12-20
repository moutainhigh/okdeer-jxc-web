<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>供应商机构商品关系表</title>
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script  src="${ctx}/static/js/views/supplierBranchGoods/supplierBranchGoodsList.js?V=${versionNo}"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
<div class="ub  ub-f1 umar-4 upad-4">
	<!--left-->
	<div class="ub ub-ver ubor" style="width:240px;">
	    <div class="ub upad-4">
            <input class="uinp ub ub-f1" id="supplierNameSearch" name="supplierName" style="padding-right:30px!important" value="" maxlength="50"  
            placeholder="供应商编码、名称" />
            <div class="ub ub-pc ub-ac ubgc-while" style="  background-color: #ffffff;width:30px;height: 28px;z-index: 2;position: absolute;top: 6px;right: 5px;">
            <img src="${ctx}/static/images/search.png" width="20" onclick="searchTree()">
        	</div>
        </div>
		<div class="ub upad-4 ub-f1 uscroll">
			<div class="zTreeDemoBackground left">
				<ul id="treeArchives" class="ztree"></ul>
			</div>
		</div>
	</div><!--left end-->
	<div class="ub ub-ver ub-f1 upad-4">
		<div class="ub ub-ac">
			<div class="ubtns">
				<shiro:hasPermission name="JxcSupplierGoods:save">
					<button class="ubtns-item" onclick="saveItemHandel()">保存</button>
			   	</shiro:hasPermission>
			   	
				<shiro:hasPermission name="JxcSupplierGoods:selectGoods">
				<button class="ubtns-item" onclick="selectGoods()">商品选择</button>
			   	</shiro:hasPermission>
				
				<shiro:hasPermission name="JxcSupplierGoods:importProduct">
				<button class="ubtns-item" onclick="toImportproduct(0)">导入货号</button>
			   	</shiro:hasPermission>
			   	
				<shiro:hasPermission name="JxcSupplierGoods:importByBarCode">
                <button class="ubtns-item" onclick="toImportproduct(1)">导入条码</button>
			   	</shiro:hasPermission>
			   	
				<shiro:hasPermission name="JxcSupplierGoods:delete">
				<button class="ubtns-item" onclick="orderDelete()">删除</button>
			   	</shiro:hasPermission>
			   	
				<shiro:hasPermission name="JxcSupplierGoods:export">
				<button class="ubtns-item" onclick="exportData()">导出</button>
			   	</shiro:hasPermission>
			   	
				<button class="ubtns-item" onclick="toClose()">退出</button>
			</div>
		</div>
		<form action="" id="formList" method="post">
			 <div class="ub umar-t8">
			    <div class="ub  ub-ac umar-r40">
			      <!-- 供应商ID -->
                  <input class="uinp" name="supplierId" id="supplierId" value="" type="hidden">
                  <input class="uinp" name="supplierName" id="supplierName" value="" type="hidden">
                  <div class="umar-r10 uw-70 ut-r">机构名称:</div>
                  <input class="uinp ub ub-f1" type="hidden" id="branchId" name="branchId" value="${branchesGrow.branchesId}"/>
                  <input class="uinp ub ub-f1" type="hidden" id="brancheType" name="brancheType" value="${branchesGrow.type}"/>
                  <input class="uinp ub ub-f1" type="text" id="branchName" name="branchName" value="${branchesGrow.branchName}"/>
                  <div class="uinp-more" onclick="selectBranches()" >...</div>
	           </div>
	         </div>
		</form>
		<input type="hidden" id="selectBranchId" name="selectBranchId" />
		<div class="ub umar-t10 ub-f1">
			<table id="gridSupplierArchiveList" ></table>
		</div>
	</div>

</div>
</body>
</html>