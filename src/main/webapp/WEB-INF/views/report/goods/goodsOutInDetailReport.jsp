<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>商品出入库明细查询</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<script src="${ctx}/static/js/views/report/goods/goodsOutInDetailReport.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	             <input type="hidden" id="startCount" name="startCount" />
				<input type="hidden" id="endCount" name="endCount" />
	                <div class="ubtns-item" onclick="toGpeExport()">导出</div>
	                <div class="ubtns-item" onclick="toGpeSetting()">设置</div>
	              	<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	          <!-- 引入时间选择控件 -->
				<%@ include file="/WEB-INF/views/component/dateSelectHour.jsp"%>
            </div>
	           
	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
                <div class="ub  ub-ac" id="regBranch">
                   <div class="umar-r10 uw-80 ut-r">店铺名称:</div>
	                    <input class="uinp ub ub-f1" type="hidden" id="branchId" name="branchId">
						<input class="uinp ub ub-f1" type="hidden" id="branchCompleCode" name="branchCompleCode">
                        <input class="uinp ub ub-f1" type="text" id="branchName" name="branchName" maxlength="50">
                   		<div class="uinp-more">...</div>
                </div>

                <div class="ub  ub-ac">
                <div class="umar-r10 uw-80 ut-r">单据编号:</div>
                <input class="uinp ub ub-f1" type="text" name="formNo" id="formNo">
                </div>

                <div class="ub ub-ac uselectw">
                <div class="umar-r10 uw-80 ut-r">出入库类型:</div>
                <input name="formTypes" id="formTypes" type="hidden">
                <select  name="fType" id="fType" class="easyui-combotree"></select>
                </div>

            </div>
	      <div class="ub umar-t8">

                <div class="ub ub-ac ">
                <div class="umar-r10 uw-80 ut-r">货号/条码:</div>
                <input class="uinp ub ub-f1" type="text" name="skuBarCode" id="skuBarCode">
                </div>

                <div class="ub ub-ac">
                <div class="umar-r10 uw-80 ut-r">商品名称:</div>
                <input class="uinp ub ub-f1" type="text" name="skuName" id="skuName">
                </div>

            </div>

	      <div class="ub umar-t8">

                <div class="ub ub-ac uselectw">
                <div class="umar-r10 uw-80 ut-r">计价方式:</div>
                <!--select-->
                <select class="easyui-combobox uselect" name="pricingType" id="pricingType" data-options="editable:false">
                <option value="" selected="selected">全部</option>
                <option value="0">普通</option>
                <option value="1">计重</option>
                <option value="2">计件</option>
                </select>
                </div>

                <div class="ub ub-ac" id="supplierSelect">
                    <div class="umar-r10 uw-80 ut-r">供应商:</div>
                    <input class="uinp" name="supplierId" id="supplierId" type="hidden">
					<%--<input class="uinp" name="supplierCode" id="supplierCode" type="hidden">--%>
                    <input class="uinp easyui-validatebox" name="supplierName" id="supplierName" type="text" maxlength="50">
                    <div class="uinp-more">...</div>
                </div>
            </div>
       	</form>
           
        <div class="ub ub-f1 umar-t20">
			 <table id="goodsOutInDetail"></table>
		</div>
    </div>

</body>
</html>