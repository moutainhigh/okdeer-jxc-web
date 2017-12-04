<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>组合拆分单-新增</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <%-- <script  src="${ctx}/static/js/fun/publicComponent.js"></script> --%>
    <script  src="${ctx}/static/js/views/combineSplit/combineSplitAdd.js?V=${versionNo}1"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 upad-8">
		<form action=""  id="searchForm" method="post">
			<input type="hidden" name="skuIdMain" id="skuIdMain">
			<input type="hidden" name="skuCodeMain" id="skuCodeMain">
			<div class="ub ub-ac">
				<div class="ubtns">
	                <div class="ubtns-item" onclick="saveCombineSplit();">保存</div>
					<div class="ubtns-item" onclick="selectGoods();">商品选择</div>
		            <div class="ubtns-item" onclick="window.parent.closeTab()">关闭</div>
	            </div>
			</div>
			<div class="ub uline umar-t8"></div>
			<div class="ub umar-t12">
				<div class="ub ub-ac uw-280">
					 <div class="umar-r10 uw-70 ut-r" >机构:</div>
                     <input name="id" type="hidden" id="id" value="${formId}" >
                     <input name="createBranchId" type="hidden" id="createBranchId" >
                     <input class="uinp ub ub-f1" readonly="readonly"  type="text" id="createBranchName">
                     <div class="uinp-more" onclick="selectBranch();">...</div>
				</div>	
               <div class="ub ub-ac uw-280 umar-l20">
                    <div class="umar-r10 uw-70 ut-r">方式:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect" name="formType" id="formType" data-options="editable:false,onChange:selectTion" >
								<option value="1" >组合</option> 
								<option value="2" >拆分</option>
				        </select>
                </div>
				<div class="ub ub-ac uw-140 umar-l40">
					 <div class="umar-r10 ut-r" >制单人员:</div>
					 <div class="utxt"><%=UserUtil.getCurrentUser().getUserName() %></div>
				</div>
				<div class="ub ub-ac uw-180 umar-l20">
					 <div class="umar-r10 ut-r" >制单日期:</div>
					 <div class="utxt" id="createTime"></div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac uw-280">
					 <div class="umar-r10 uw-70 ut-r" >商品:</div>
                     <input class="uinp ub ub-f1 uinp-no-more" readonly="readonly" type="text" id="skuNameMain" name="skuNameMain">
				</div>	
				<div class="ub ub-ac uw-280 umar-l20">
					 <div class="umar-r10 uw-70 ut-r" >零售价:</div>
                     <input class="uinp ub ub-f1 uinp-no-more ut-r"  readonly="readonly"  type="text" id="salePriceMain" name="salePriceMain">
				</div> 
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac uw-280">
					 <div class="umar-r10 uw-70 ut-r" >金额:</div>
                     <input class="uinp ub ub-f1 uinp-no-more ut-r" readonly="readonly"  type="text" id="amountMain" name="amountMain">
				</div>	
				<div class="ub ub-ac uw-280 umar-l20">
					 <div class="umar-r10 uw-70 ut-r" >数量:</div>
					 <div class="ub ub-f1">
	                     <input class="easyui-numberbox uw" data-options="value:0,min:0,precision:2,onChange:changeAmount" type="text" id="totalNum" name="totalNum">
					 </div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac uw-580">
					 <div class="umar-r10 uw-70 ut-r" >备注:</div>
                     <input class="uinp ub ub-f1"  type="text" id="remark" name="remark" maxlength="255" >
				</div>	
			</div>
		</form>

	<from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
	<table id="combineSplitEditGrid" ></table>
	</from>

	</div>
</body>
</html>
