<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>组合拆分单-已审核</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script>
    	var edit = '${stockFormVo.status}';
    </script>
	<script  src="${ctx}/static/js/views/combineSplit/combineSplitView.js?V=${versionNo}1"></script>
	<style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 upad-8  ubor">
        <div class="ub ub-ac">
			<div class="ubtns">
	            <input type="hidden" id="close" value="${close}"/>
	            <c:if test="${stockFormVo.status == 0}">
	            	<div class="ubtns-item"  onclick="saveCombineSplit()">保存</div>
	                <div class="ubtns-item"  onclick="auditCombineSplit()">审核</div>
	                <div class="ubtns-item"  onclick="deleteCombineSplit()">删除</div>
	            </c:if>
                <div class="ubtns-item" id="toBackByJSButton" onclick="toClose()">关闭</div>
	        </div>
		</div>
		<c:if test="${stockFormVo.status != 0}">
		<div class="already-examine" id="already-examine"><span>已审核</span></div>
		</c:if>
 		<input type="hidden" id="id" name="id" value="${stockFormVo.id}">
 		<input type="hidden" name="skuIdMain" id="skuIdMain" value="${stockFormVo.skuId}">
		<input type="hidden" name="skuCodeMain" id="skuCodeMain" value="${stockFormVo.skuCode}">
        <div class="ub uline umar-t8"></div>
        <div class="ub umar-t8">
			<div class="ub ub-ac uw-280">
			 	 <div class="umar-r10 uw-70 ut-r" >机构:</div>
                 <input type="hidden" name="branchId" id="branchId" class="uinp" value="${stockFormVo.branchId }"/>
		 		 <input type="hidden" id="formId" name="formId" value="${stockFormVo.id}">
				 <input type="text" name="branchName" id="branchName"class="uinp ub ub-f1" readonly="readonly" value="${stockFormVo.branchName }" />
			</div>	
            <div class="ub ub-ac uw-280 umar-l20">
                <div class="umar-r10 uw-70 ut-r">方式:</div>
                <input type="hidden" id="formType" name="formType" value="${stockFormVo.formType}" >
                <input class="uinp " type="text" id="formType_text" name="formType_text" value="${stockFormVo.formType==1?'组合':'拆分'}" readonly="readonly">
            </div>
			<div class="ub ub-ac umar-l10">
				 <div class="umar-r10 uw-70 ut-r">制单人员:</div>
                 <div class="utxt" id="validUserName">${stockFormVo.createUserName}</div>
			</div>
			<div class="ub ub-ac umar-l10">
				 <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                 <div class="utxt" id="createTime"><fmt:formatDate value="${stockFormVo.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
			</div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac uw-280">
				<div class="umar-r10 uw-70 ut-r">商品:</div>
				<input class="uinp ub ub-f1 uinp-no-more" readonly="readonly" type="text" id="skuNameMain" name="skuNameMain" value="${stockFormVo.skuName}" />
			</div>
			<div class="ub ub-ac uw-280 umar-l20">
				<div class="umar-r10 uw-70 ut-r">单价:</div><!--${stockFormVo.salePrice||'1.00'}-->
				<input class="uinp ub ub-f1 uinp-no-more ut-r" readonly="readonly" type="text" id="salePriceMain" name="salePriceMain" value="${stockFormVo.salePrice}" />
			</div>
			<div class="ub ub-ac umar-l10">
				 <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                 <div class="utxt" id="validUserName">${stockFormVo.validUserName}</div>
			</div>
			<div class="ub ub-ac umar-l10">
				 <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                 <div class="utxt">${stockFormVo.validTime}</div>
			</div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac uw-280">
				 <div class="umar-r10 uw-70 ut-r" >金额:</div>
                 <input class="uinp ub ub-f1 uinp-no-more ut-r" readonly="readonly"  type="text" id="amountMain" value="${stockFormVo.amount}" name="amountMain">
			</div>	
			<div class="ub ub-ac uw-280 umar-l20">
				 <div class="umar-r10 uw-70 ut-r" >数量:</div>
				 <c:if test="${stockFormVo.status != 0}">
				 	<input class="uinp ub ub-f1 ut-r" readonly="readonly"  type="text" id="totalNum" value="${stockFormVo.totalNum}" name="totalNum">
				 </c:if>
				 <c:if test="${stockFormVo.status == 0}">
				 	<div class="ub ub-f1">
	                    <input class="easyui-numberbox uw" data-options="min:0,precision:2,onChange:changeAmount" value="${stockFormVo.totalNum}" type="text" id="totalNum" name="totalNum">
					</div>
				 </c:if>
			</div>
		</div>
		<div class="ub umar-t8">
			<div class="ub ub-ac uw-580">
				 <div class="umar-r10 uw-70 ut-r" >备注:</div>
				 
                 <input class="uinp ub ub-f1" value="${stockFormVo.remark}" <c:if test="${stockFormVo.status != 0}"> readonly="readonly" </c:if> maxlength="255" type="text" id="remark" name="remark">
			</div>	
		</div>
		
        <%-- <div class="ub umar-t10">
	           <div class="ub umar-t8">
	               <div class="ub ub-ac uw-300 ">
	                   <div class="umar-r10 uw-70 ut-r">商品名称:</div>
	                   <input class="uinp uninput" type="text" id="remark" name="remark" value="${stockFormVo.skuName}" readonly="readonly">
	               </div>
	               <div class="ub ub-ac uw-300 ">
	                   <div class="umar-r10 uw-70 ut-r">单价:</div>
	                   <input class="uinp uninput" type="text" id="remark" name="remark" value="${stockFormVo.salePrice}" readonly="readonly">
	               </div>
	           </div>
               <div class="ub ub-ac umar-l10">
                   <div class="umar-r10 uw-70 ut-r">制单人员:</div>
                   <div class="utxt">${stockFormVo.createUserName}</div>
               </div>
               <div class="ub ub-ac umar-l10">
                   <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                   <div class="utxt" id="createTime"><fmt:formatDate value="${stockFormVo.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
               </div>
         </div>
         <div class="ub umar-t8">
	           <div class="ub umar-t8">
	               <div class="ub ub-ac uw-300 ">
	                   <div class="umar-r10 uw-70 ut-r">金额:</div>
	                   <input class="uinp uninput" type="text" id="amount" name="amount" value="${stockFormVo.amount}" readonly="readonly">
	               </div>
	               <div class="ub ub-ac uw-300 ">
	                   <div class="umar-r10 uw-70 ut-r">数量:</div>
	                   <input class="uinp uninput" type="text" id="totalNum" name="totalNum" value="${stockFormVo.totalNum}" readonly="readonly">
	               </div>
	           </div>
               <div class="ub ub-ac umar-l10">
                   <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                   <div class="utxt" id="validUserName">${stockFormVo.validUserName}</div>
               </div>
               <div class="ub ub-ac umar-l10">
                   <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                   <div class="utxt">${stockFormVo.validTime}</div>
               </div>
           </div>
        <div class="ub umar-t10">
               <div class="ub ub-ac uw-300">
	                <div class="umar-r10 uw-70 ut-r">机构名称:</div>
	                <input type="hidden" name="branchId" id="branchId" class="uinp" value="${stockFormVo.branchId }"/>
			 		<input type="hidden" id="formId" name="formId" value="${stockFormVo.id}">
					<input type="text" name="branchName" id="branchName"class="uinp ub ub-f1" readonly="readonly" value="${stockFormVo.branchName }" />
					<c:if test="${stockFormVo.status == 0}">
					<div class="uinp-more" onclick="searchBranch()">...</div>
					</c:if>
	           </div>
               <div class="ub ub-ac uw-300 ">
                   <div class="umar-r10 uw-70 ut-r">方式:</div>
                   <input type="hidden" id="formType" name="formType" value="${stockFormVo.formType}" >
                   <input class="uinp uninput" type="text" id="formType_text" name="formType_text" value="${stockFormVo.formType==1?'组合':'拆分'}" readonly="readonly">
               </div>
         </div>
         <div class="ub umar-t10">
               <div class="ub ub-ac uw-300 ">
                   <div class="umar-r10 uw-70 ut-r">备注:</div>
                   <input class="uinp uninput" type="text" id="remark" name="remark" value="${stockFormVo.remark}" readonly="readonly">
               </div>
         </div> --%>
           <!--datagrid-edit-->
           <div class="ub ub-f1 datagrid-edit umar-t8">
               <table id="combineSplitView" ></table>
           </div>
    </div>
</body>
</html>