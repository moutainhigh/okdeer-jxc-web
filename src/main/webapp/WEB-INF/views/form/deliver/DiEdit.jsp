<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>入库单-编辑</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/deliver/DiEdit.js?V=${versionNo}"></script>
	
	<script src="${ctx}/static/js/views/deliver/deliverExport.js?V=${versionNo}"></script>
	<%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
            	<shiro:hasPermission name="JxcDeliverDI:add">
					<div class="ubtns-item" onclick="addDeliverForm()">新增</div>
				</shiro:hasPermission>
				<shiro:hasPermission name="JxcDeliverDI:add">
                	<div class="ubtns-item" onclick="saveOrder()">保存</div>
                </shiro:hasPermission>
                <shiro:hasPermission name="JxcDeliverDI:audit">
                	<div class="ubtns-item" onclick="check()">审核</div>
                </shiro:hasPermission>
                <div class="ubtns-item-disabled">商品选择</div>
                <shiro:hasPermission name="JxcDeliverDI:delete">
					<div class="ubtns-item" onclick="delDeliverForm()">删单</div>
			   	</shiro:hasPermission>
                <shiro:hasPermission name="JxcDeliverDI:print">
                    <div class="ubtns-item" onclick="printChoose('DI','/form/deliverForm/')">打印</div>
                </shiro:hasPermission>
                <div class="ubtns-item"  onclick="exportData('DI','gridEditRequireOrder')">导出明细</div>
                <!--onclick="importproductAll()"  -->
                <div class="ubtns-item-disabled" >导入明细</div>
                <!-- onclick="importproduct()"  -->
                <div class="ubtns-item-disabled" >导入货号</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub umar-t8 uc-black">【单号】:<span>${form.formNo}</span></div>
            <input type="hidden" id="formNo" value="${form.formNo}">
        <div class="ub uline umar-t8"></div>
        <div class="ub">
               <div class="ub ub-ac uw-300">
               	   <input type="hidden" id="formId" value="${form.deliverFormId}">
                   <div class="umar-r10 uw-70 ut-r">发货机构:</div>
                   <div class="ub">
                       <input type="hidden" id="sourceBranchId" name="sourceBranchId" value="${form.sourceBranchId}"  />
                       <input class="uinp ub ub-f1" type="text" id="sourceBranchName" name="sourceBranchName" value="${form.sourceBranchName}" />
                       <div class="uinp-more"></div>
                   </div>

               </div>
               <div class="ub ub-ac uw-350">
                   <div class="umar-r10 uw-70 ut-r">原单类型:</div>
                   <div class="ub">
                       <input type="radio" id="typeDO" disabled="disabled"  <c:if test='${"DO" eq (form.referenceType) }'>checked="checked" </c:if>/><label for="typeDO">配送出库单</label>
                       <input type="radio" id="typeDD" disabled="disabled" <c:if test='${"DD" eq (form.referenceType)  }'>checked="checked" </c:if>/><label for="typeDD">店间配送单</label>
                       <input type="radio" id="typeDR" disabled="disabled" <c:if test='${"DR" eq (form.referenceType)  }'>checked="checked" </c:if>/><label for="typeDR">退货申请单</label>
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
                   <div class="ub">
                       <input type="hidden" id="targetBranchId" name="targetBranchId" value="${form.targetBranchId}"/>
                       <input class="uinp ub ub-f1" type="text" id="targetBranchName" name="targetBranchName" value="${form.targetBranchName}" readonly="readonly"/>
                       <div class="uinp-more"></div>
                   </div>

               </div>
                <div class="ub ub-ac uw-350">
                   <div class="umar-r10 uw-70 ut-r">配送单号:</div>
                   <div class="ub">
                       <input type="hidden" id="referenceId" name="referenceId" value="${form.referenceId}" />
                       <input class="uinp ub ub-f1" type="text" id="referenceNo" name="referenceNo" onclick="selectDeliver()" value="${form.referenceNo}" readonly="readonly"/>
                       <input type="hidden" id="oldReferenceNo" name="oldReferenceNo" value="${form.referenceNo}" />
                       <div class="uinp-more" onclick="selectDeliver()">...</div>
                   </div>
					<i class="uc-red">*</i>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                   <div class="utxt" id="validUserName">${form.validUserName}</div>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                   <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div>
               </div>
           </div>
           <div class="ub umar-t8">
           	 
               <div class="ub ub-ac uw-582">
                   <div class="umar-r10 uw-70 ut-r">备注:</div>
                   <input class="uinp ub ub-f1" type="text" id="remark" name="remark" value="${form.remark}">
               </div>
               
           </div>
           <!--datagrid-edit-->
            <from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
               <table id="gridEditRequireOrder" ></table>
            </from>
    </div>

</body>
</html>