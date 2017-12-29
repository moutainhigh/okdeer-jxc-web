
        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>要货单列表</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="/static/js/views/deliver/total/deliverList.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
	        <div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	        </div>
			<input type="hiden" id="formId" value="${formId}" />
        <div class="ub uw umar-t8 ub-f1">
            <table id="gridDeliverList"></table>
        </div>

    </div>
</body>
</html>