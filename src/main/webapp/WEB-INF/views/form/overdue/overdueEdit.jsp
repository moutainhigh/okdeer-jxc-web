<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>调价订单-修改</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/overdue/overdueEdit.js?V=${versionNo}"></script>
    
    <%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
    <style type="text/css">
    	.uw-60 {
		    width: 76px;
		}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
           <%--  <shiro:hasPermission name="JxcOverdueApply:add"> --%>
	            <div class="ubtns-item" onclick="orderAdd()">新增</div>
	      <%--   </shiro:hasPermission> --%>
	      <c:choose>
	      	<c:when test="${form.status == 3}">
	      		<div class="ubtns-item" onclick="saveItemHandel()" >保存</div>
	      	</c:when>
	      	<c:otherwise>
	      		<div class="ubtns-item-disabled">保存</div>
	      	</c:otherwise>
	      </c:choose>
            <shiro:hasPermission name="JxcOverdueApply:delete">
                <div class="ubtns-item" onclick="orderDelete()">删单</div>
             </shiro:hasPermission>
             <shiro:hasPermission name="JxcOverdueApply:delete">
               <c:choose>
		      	<c:when test="${form.status == 3}">
		      		<div class="ubtns-item" onclick="commit()" >提交</div>
		      	</c:when>
		      	<c:otherwise>
		      		<div class="ubtns-item-disabled">提交</div>
		      	</c:otherwise>
		      </c:choose>
             </shiro:hasPermission>
            <shiro:hasPermission name="JxcOverdueApply:audit">
		      		<div class="ubtns-item" onclick="check()" >审核</div>
            </shiro:hasPermission>
            <shiro:lacksPermission name="JxcOverdueApply:audit">
            		<div class="ubtns-item-disabled" >审核</div>
            </shiro:lacksPermission>
             <c:choose>
		      	<c:when test="${form.status == 0 || form.status == 1}">
		      		<div class="ubtns-item-disabled">商品选择</div>
		      		<div class="ubtns-item-disabled">导入货号</div>
                	<div class="ubtns-item-disabled">导入条码</div>
		      	</c:when>
		      	<c:otherwise>
		      		<div class="ubtns-item" onclick="selectGoods()" >商品选择</div>
		      		<div class="ubtns-item" onclick="toImportproduct(0)">导入货号</div>
                	<div class="ubtns-item" onclick="toImportproduct(1)">导入条码</div>
		      	</c:otherwise>
		      </c:choose>
                <div class="ubtns-item" onclick="exportDetail();">导出</div>
            <shiro:hasPermission name="JxcPurchaseOrder:print">
                <div class="ubtns-item" onclick="printReport()">打印</div>
            </shiro:hasPermission>
               <div class="ubtns-item" onclick="javaScript:;">设置</div>
               <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
       
        <div class="ub umar-t8 uc-black">【单号】:<span ><c:out value="${form.formNo}"></c:out></span></div>
        <div class="ub uline umar-t8"></div>
        <input type="hidden" id="formId" value='<c:out value="${form.id}"></c:out>'>
         <input type="hidden" id="formNo" value='<c:out value="${form.formNo}"></c:out>'> 
        <div class="ub umar-t8">
           <div class="ub ub-ac umar-r40" style="width: 664px;">
	                <div class="umar-r10 uw-60 ut-r">申请机构:</div>
	                <input class="uinp" name="branchId" id="branchId" type="hidden" value='<c:out value="${form.branchId}"></c:out>'>
	                <input class="uinp" id="branchName" name="branchName" type="text" maxlength="50" <c:if test="${form.status != 3}">readonly="readonly"</c:if> value="[${form.branchCode}]${form.branchName} " >
	                <c:if test="${form.status == 3}">
		                <div class="uinp-more" onclick="searchBranch()" style="position: inherit;margin-left: -20px;">...</div>
	                </c:if>
	            </div>
	           
            <div class="ub ub-ac umar-r80">
                <div class="umar-r10 uw-60 ut-r">制单人员:</div>
                <div class="utxt"><c:out value="${form.createUserName}"></c:out></div>
            </div>
            <div class="ub ub-ac">
                <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                <div class="utxt" id="createDate"><fmt:formatDate value="${form.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
        </div>
        <div class="ub umar-t8">
               <div class="ub ub-ac uw-610 umar-r80" style="width: 624px;">
	           </div>
	           <div class="ub ub-ac umar-r80">
                <div class="umar-r10 uw-60 ut-r">最后修改人:</div>
                <div class="utxt"><c:out value="${form.updateUserName}"></c:out></div>
            </div>
            <div class="ub ub-ac">
                <div class="umar-r10 uw-60 ut-r">修改时间:</div>
                <div class="utxt"><fmt:formatDate value="${form.updateTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
        </div>
         <div class="ub umar-t8">
               <div class="ub ub-ac uw-610 umar-r80" style="width: 624px;">
	                    <div class="umar-r10 uw-60 ut-r">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</div>
	                    <c:if test="${form.status == 3}">
		                    <input class="uinp ub ub-f1 easyui-validatebox" data-options="required:true" name="remark" id="remark" type="text"
                            maxlength="100" value="${form.remark}">
	                    </c:if>
	                    <c:if test="${form.status != 3}">
	                    	<input class="uinp ub ub-f1" readonly="readonly"  value="${form.remark}" />
	                    </c:if>
	                    <i class="uc-red">*</i>
	           </div>
	           <div class="ub ub-ac umar-r80">
                <div class="umar-r10 uw-60 ut-r">审核人员:</div>
                <div class="utxt"><c:out value="${form.validUserName}"></c:out></div>
            </div>
            <div class="ub ub-ac">
                <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
        </div>
        <div class="ub ub-f1 datagrid-edit umar-t8">
            <table id="gridEditOrder" ></table>
        </div>
        
    </div>
<input id="hiddenStatus" type="hidden" name="hiddenStatus" value='<c:out value="${form.status}"></c:out>'>
<shiro:lacksPermission name="JxcOverdueApply:audit">
	<input id="hiddenEdit" type="hidden" name="hiddenEdit" value="0">
</shiro:lacksPermission>
<shiro:hasPermission name="JxcOverdueApply:audit">
	<input id="hiddenEdit" type="hidden" name="hiddenEdit" value="1">
</shiro:hasPermission>
</body>
</html>