<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>入库单-查看</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/deliver/DiView.js?V=${versionNo}"></script>
	<script src="${ctx}/static/js/views/deliver/deliverExport.js?V=${versionNo}"></script>
	<%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
            	<input type="hidden" id="close" value="${close}"/>
            	<shiro:hasPermission name="JxcDeliverDI:add">
               		<div class="ubtns-item" id="addButton" onclick="addDeliverForm()">新增</div>
               	</shiro:hasPermission>
               	<shiro:hasPermission name="JxcDeliverDI:terminate">
               		<div class="ubtns-item-disabled">终止</div>
               	</shiro:hasPermission>
               	<shiro:hasPermission name="JxcDeliverDI:print">
            		<div class="ubtns-item" onclick="printChoose('DI','/form/deliverForm/')">打印</div>
            	</shiro:hasPermission>
            	<div class="ubtns-item"  onclick="exportData('DI','gridEditRequireOrder')">导出明细</div>
            	<div class="ubtns-item"  onclick="exportData('DI','gridEditRequireOrder','1')">导出货号</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub umar-t8 uc-black">【单号】:${form.formNo}</div>
        <input type="hidden" id="formNo" value="${form.formNo}">
        <input type="hidden" id="type" value="${type}"> 
        <div class="ub uline umar-t8"></div>
        <div class="ub">
               <div class="ub ub-ac uw-300">
               	   <input type="hidden" id="formId" value="${form.deliverFormId}">
                   <div class="umar-r10 uw-70 ut-r">发货机构:</div>
                   <input type="hidden" id="sourceBranchId" name="sourceBranchId" value="${form.sourceBranchId}" readonly="readonly" />
                   <input class="uinp ub ub-f1" type="text" id="sourceBranchName" name="sourceBranchName" value="${form.sourceBranchName}" readonly="readonly" />
                   <div class="uinp-more">...</div>
               </div>
                <div class="ub ub-ac uw-350">
                   <div class="umar-r10 uw-70 ut-r">原单类型:</div>
                   <div class="ub">
                   <c:choose>
	                   	<c:when test='${"DD" eq (form.sourceOrderType) || "DR" eq (form.sourceOrderType) }'> 
	    					<input type="radio" id="typeDO" disabled="disabled"  <c:if test='${"DO" eq (form.sourceOrderType) }'>checked="checked" </c:if>/><label for="typeDO">配送出库单</label>
	                        <input type="radio" id="typeDD" disabled="disabled" <c:if test='${"DD" eq (form.sourceOrderType)  }'>checked="checked" </c:if>/><label for="typeDD">店间配送单</label>
	                        <input type="radio" id="typeDR" disabled="disabled" <c:if test='${"DR" eq (form.sourceOrderType)  }'>checked="checked" </c:if>/><label for="typeDR">退货申请单</label>
	   					</c:when>
	   					<c:otherwise> 
	    					<input type="radio" id="typeDO" disabled="disabled"  <c:if test='${"DO" eq (form.referenceType) }'>checked="checked" </c:if>/><label for="typeDO">配送出库单</label>
	                        <input type="radio" id="typeDD" disabled="disabled" <c:if test='${"DD" eq (form.referenceType)  }'>checked="checked" </c:if>/><label for="typeDD">店间配送单</label>
	                        <input type="radio" id="typeDR" disabled="disabled" <c:if test='${"DR" eq (form.referenceType)  }'>checked="checked" </c:if>/><label for="typeDR">退货申请单</label>
   						</c:otherwise>
                   </c:choose>
                   </div>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-70 ut-r">制单人员:</div>
                   <div class="utxt">${form.createUserName}</div>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                   <div class="utxt" id="createTime"><fmt:formatDate value="${form.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
               </div>
           </div>
           <div class="ub umar-t8">
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-70 ut-r">收货机构:</div>
                   <input type="hidden" id="targetBranchId" name="targetBranchId" />
                   <input class="uinp ub ub-f1" type="text" id="targetBranchName" name="targetBranchName" value="${form.targetBranchName}" readonly="readonly"/>
                   <div class="uinp-more">...</div>
               </div>
               <div class="ub ub-ac uw-350">
                   <div class="umar-r10 uw-70 ut-r">配送单号:</div>
                   <input type="hidden" id="referenceId" name="referenceId" value="${form.referenceId}" />
                      <c:choose>
	                   	<c:when test='${"DD" eq (form.sourceOrderType) || "DR" eq (form.sourceOrderType) }'> 
	                   		<input class="uinp ub ub-f1" type="text" id="referenceNo" name="referenceNo" value="${form.sourceOrderNo}" readonly="readonly"/>
	   					</c:when>
	   					<c:otherwise> 
	    					<input class="uinp ub ub-f1" type="text" id="referenceNo" name="referenceNo" value="${form.referenceNo}" readonly="readonly"/>
   						</c:otherwise>
                   </c:choose>
                   <div class="uinp-more">...</div>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                   <div class="utxt" id="validUserName">${form.validUserName}</div>
               </div>
               <div class="already-examine" id="already-examine"><span>${status}</span></div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                   <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div>
               </div>
           </div>
           <div class="ub umar-t8">
           	   <div class="ub ub-ac uw-600">
                   <div class="umar-r10 uw-70 ut-r">备注:</div>
                   <input class="uinp ub ub-f1" type="text" id="remark" name="remark" value="${form.remark}" readonly="readonly"/>
               </div>
           </div>
           <%--datagrid-edit--%>
           <div class="ub ub-f1 datagrid-edit umar-t8">
               <table id="gridEditRequireOrder" ></table>
           </div>
    </div>
</body>
</html>