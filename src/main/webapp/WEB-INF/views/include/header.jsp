<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:set var="user" value="${sessionScope.session_user}"/>
<c:if test="${empty user }">
	<c:redirect url="${ctx}/system/logout" />
</c:if>
<c:set var="sessionSupplier" value="${sessionScope.session_default_supplier}"/>
<c:set var="priceGrantStr" value="${user.priceGrant}"/>
<c:set var="now" value="<%=new java.util.Date()%>" />
<!-- title图标 -->
<link rel="shortcut icon" href="${ctx}/static/images/okdeer_favicon.ico" type="image/x-icon"/>

<!--easyui-->
 <link rel="stylesheet" href="${ctx}/static/libs/easyui/css/default/easyui.css">
<link rel="stylesheet" href="${ctx}/static/libs/easyui/css/icon.css">
<%--<link rel="stylesheet" href="${ctx}/static/libs/metro-blue/easyui.css" type="text/css" /> --%>
<!--ztree-->
<link rel="stylesheet" href="${ctx}/static/libs/zTree/css/zTreeStyle.css">
<!--app css-->
<link rel="stylesheet" href="${ctx}/static/css/icon.css" type="text/css">
<link rel="stylesheet" href="${ctx}/static/css/style.css" type="text/css">
<link rel="stylesheet" href="${ctx}/static/css/component.css" type="text/css">
<link rel="stylesheet" href="${ctx}/static/css/base.css" type="text/css">
<link rel="stylesheet" href="${ctx}/static/css/app.css" type="text/css">

<!--jquery-->
<script src="${ctx}/static/libs/jquery/js/jquery-1.11.1.min.js"></script>
<!--easyui-->
<script  src="${ctx}/static/libs/easyui/js/jquery.easyui.min.js"></script>
<script  src="${ctx}/static/libs/easyui/js/easyui-lang-zh_CN.js"></script>

<!--datepicker-->
<script  src="${ctx}/static/libs/datepicker/WdatePicker.js"></script>

<!--ztree-->
<script src="${ctx}/static/libs/zTree/js/jquery.ztree.core.min.js"></script>
<script src="${ctx}/static/js/fun/baseEasyui.js"></script>
<!-- 公共服务 -->
<script src="${ctx}/static/js/fun/publicComponent.js"></script>


<script>

window.addEventListener('message',function(e){
			window.onbeforeunload = null;
            window.location.replace('${ctx}');
        },false);
var contextPath = '${ctx}';

var priceGrantStr = '${priceGrantStr}';
var sessionUserId = '${user.id}';
var sessionUserCode = '${user.userCode}';
var sessionBranchId = '${user.branchId}';
var sessionBranchCode = '${user.branchCode}';
var sessionBranchName = '${user.branchName}';
var sessionBranchType = '${user.branchType}';
var sessionBranchCompleCode = '${user.branchCompleCode}';
var sessionBranchCodeName = '';
if(sessionBranchCode && sessionBranchName){
	sessionBranchCodeName = "["+sessionBranchCode+"]"+sessionBranchName;
}

//设置默认供应商信息
var sessionSupplierId = '${sessionSupplier.id}';
var sessionSupplierCode = '${sessionSupplier.supplierCode}';
var sessionSupplierName = '${sessionSupplier.supplierName}';
var sessionSupplierCodeName = '';
if(sessionSupplierCode && sessionSupplierName){
	sessionSupplierCodeName = "["+sessionSupplierCode+"]"+sessionSupplierName;
}
var sessionSupplierDiliveCycle = '${sessionSupplier.diliveCycle}';
</script>
<script src="${ctx}/static/js/fun/priceGrant.js"></script>
<!-- 导入 -->
<%-- <script  src="${ctx}/static/js/views/retail/importdetails.js"></script> --%>
<!--excel common 导入 -->
<script src="${ctx}/static/libs/xlsx/excel.js"></script>
<script  src="${ctx}/static/libs/xlsx/upfile.js"></script>
<script src="${ctx}/static/js/views/retail/priceprint.js"></script>