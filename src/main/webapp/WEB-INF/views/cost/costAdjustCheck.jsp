<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>成本调整单-修改</title>
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script  src="${ctx}/static/js/views/cost/costAdjustCheck.js?V=${versionNo}"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
         <div class="ub ub-ac upad-4">
            <div class="ubtns">
            <%--   <shiro:hasPermission name="JxcCostAdjust:save">
                <div class="ubtns-item" onclick="editsaveOrder()">保存</div>
              </shiro:hasPermission> --%>
              <!--   <div class="ubtns-item" onclick="selectGoods()">商品选择</div> -->
                <!-- <div class="ubtns-item" onclick="importproductAll()">导入</div> -->
                <div class="ubtns-item" onclick="exportExcel()">导出</div>
              <!--    <div class="ubtns-item" onclick="costcheck()">审核</div> -->
                <!-- <div class="ubtns-item" onclick="delCostForm()">删单</div> -->
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub umar-t8 uc-black">【单号】:<span >${data.adjustNo}</span></div>
                 <div class="already-examine" id="already-examine"><span>已审核</span></div>
        <div class="ub uline umar-t10"></div>
        <form action="" id="searchForm" method="post">
       		 <input type="hidden" id="adjusId" name="id" value="${data.id}">
        </form>
         <input type="hidden" id="status" name="id" value="${data.status}">
        <input type="hidden" id="adjustNo" value="${data.adjustNo}">
        <div class="ub umar-t10">
                <div class="ub ub-ac uw-280">
	                <div class="umar-r10 uw-70 ut-r">机构名称:</div> 
                    <input type="hidden" name="branchId" id="branchId" value="${data.branchName}" class="uinp" />
					<input type="text" name="branchName" id="branchName" value="${data.branchName }" class="uinp ub ub-f1" readonly="readonly"  />
					<div class="uinp-more" >...</div>
	           </div>
               <div class="ub ub-ac umar-l40">
               <input type="hidden" id="createUserId" value="${data.createUserId}">
                   <div class="umar-r10 uw-70 ut-r">制单人员:</div>
                   <div class="utxt">${data.createUserName }</div>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                   <div class="utxt" ><fmt:formatDate value="${data.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
                    <input type="hidden" id="createTime" value="${data.createTime}">
               </div>
           </div>
           <div class="ub umar-t8">
               <div class="ub ub-ac uselectw umar-l00">
                    <div class="umar-r10 uw-70 ut-r">调整原因:</div>
                       <!--select-->
                        <select class="easyui-combobox uselect" name="adjustReason" id="adjustReason" data-options="editable:false" disabled="disabled">
                        <c:forEach items="${COST_ADJUST_REASON}" var="reason">
                          <option value="${reason.value}"
                        <c:if test="${data.adjustReason==reason.value}">
                            selected="selected"
                         </c:if>
                       >  ${reason.label}</option>
                        </c:forEach>
                        </select>
                </div>
               <div class="ub ub-ac umar-l40">
                   <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                   <div class="utxt" id="validUserName">${data.validUserName}</div>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                   <div class="utxt"><fmt:formatDate value="${data.validTime}"  pattern="yyyy-MM-dd HH:mm"/></div>
               </div>
           </div>
           <div class="ub umar-t8">
               <div class="ub ub-ac " >
                   <div class="umar-r10 uw-70 ut-r">备注:</div>
                   <input class="uinp" type="text" id="remark" name="remark" readonly value="${data.remark}" >
               </div>
               <div class="ub ub-ac umar-l40 uw-300">
                   <div class="umar-r10 uw-70 ut-r">调价设置:</div>
                   <label><input class="priceItem" type="checkbox" name="isUpCostPrice" id="isUpCostPrice" disabled="disabled" <c:if test="${data.isUpCostPrice == 1}"> checked="checked" </c:if> /><span>成本价</span></label>
                   <label><input class="priceItem" type="checkbox" name="isUpUntaxedCostPrice" id="isUpUntaxedCostPrice" disabled="disabled"  <c:if test="${data.isUpUntaxedCostPrice == 1}"> checked="checked" </c:if> /><span>不含税成本价</span></label>
               </div>
           </div>
        
           <!--datagrid-edit-->
           <div class="ub ub-f1 datagrid-edit umar-t8">
               <table id="gridEditRequireOrder" ></table>
           </div>
    </div>

</body>
</html>