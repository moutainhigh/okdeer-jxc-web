<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>要货单汇总——中间单据选择</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script src="${ctx}/static/js/views/deliver/total/totalDataList.js?V=${versionNo}12"></script>
    
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
    <div class="ub ub-ac">
    <div class="ubtns">
    <div class="ubtns-item" onclick="preStep()">上一步</div>
    <div class="ubtns-item" onclick="createDeliver()">生成要货单</div>
    <div class="ubtns-item" onclick="toClose()">关闭</div>
    </div>
    </div>
    
    <input type="hidden" name="formData" id="formData" value='${formData }' />

    <div class="ub uw umar-t8 ub-f1">
    <table id="gridTotalDataList"></table>
    </div>
    </div>
</body>
</html>