<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>机构信息</title>

    <%@ include file="/WEB-INF/views/include/header.jsp" %>
    <c:set var="ctx" value="${pageContext.request.contextPath}"/>
    <script src="${ctx}/static/js/views/csrservice/item.js?V=${versionNo}"></script>
    <style type="text/css">
    .ztree li span.button.add {margin-left:2px; margin-right: -1px; background-position:-144px 0; vertical-align:top; *vertical-align:middle}
    </style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
<div class="ub ub-f1 umar-4 upad-4">
    <!--left-->
    <div class="ub ub-ver ubor uw-240">
        <div class="ubor-b "></div>
        <div class="ub upad-4 ub-f1 uscroll ">
            <div class="zTreeDemoBackground left">
                <ul id="treeBranchList" class="ztree"></ul>
            </div>
        </div>
    </div>
    <!--left end-->

    <div class="ub ub-ver ub-f1 umar-l4">
        <div class="ub ub-ac">
            <div class="ubtns">
                <div class="ubtns-item" onclick="query()">查询</div>
                <shiro:hasPermission name="jxc_service_item:append">
                    <div class="ubtns-item" onclick="addServiceItem()">新增</div>
                </shiro:hasPermission>
                <shiro:hasPermission name="jxc_service_item:delete">
                    <div class="ubtns-item" onclick="delServiceItem()">删除</div>
                </shiro:hasPermission>
                <shiro:hasPermission name="jxc_service_item:export">
                    <div class="ubtns-item" onclick="exportData()">导出</div>
                </shiro:hasPermission>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <form action="" id="formList" method="post">
            <input type="hidden" id="branchCompleCode" name="branchCompleCode">
            <div class="ub umar-t12">
                <div class="ub ub-ac umar-r10">
                    <div class="umar-r10 uw-80 ut-r">关键字:</div>
                    <input class="uinp" type="text" name="branchKeyword" id="branchKeyword"
                           placeholder="输入编号、名称、备注进行查询">
                </div>
            </div>

        </form>
        <div class="ub umar-t10 ub-f1">
            <table id="gridServiceList"></table>
        </div>
    </div>


</div>
</body>
</html>