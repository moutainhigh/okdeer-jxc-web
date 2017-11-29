<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>便民服务配置</title>
    <%@ include file="/WEB-INF/views/include/header.jsp" %>
    <script src="${ctx}/static/js/views/csrservice/config/config.js?V=${versionNo}"></script>
    <style>
        .table-tree {
            width: 1000px;
            margin-top: 10px;
        }

        .table-tree * {
            box-sizing: border-box !important;
        }

        .bor-left {
            border-left: 1px solid #c9c9c9;
        }

        .bor-right {
            border-right: 1px solid #c9c9c9;
        }

        .bor-top {
            border-top: 1px solid #c9c9c9;
        }

        .bor-bottom {
            border-bottom: 1px solid #c9c9c9;
        }

        .bor-rb {
            border-bottom: 1px solid #c9c9c9;
            border-right: 1px solid #c9c9c9;
        }

        .bor-lt {
            border-left: 1px solid #c9c9c9;
            border-top: 1px solid #c9c9c9;
        }

        .label-item {
            display: inline-block
        }
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
<div class="ub ub-ver  ub-f1 umar-4 upad-4">
    <div class="ub ub-ac">
        <div class="ubtns">
            <div class="ubtns-item" onclick="save()">保存</div>
            <div class="ubtns-item" onclick="toClose()">退出</div>
        </div>
    </div>
    <div class="ub uline umar-t8"></div>

    <div class="ub ub-ver upad-4">
    <div class="ub upad-4">
        <div class="ub ub-ac umar-r40" id="branchComponent">
        <div class="umar-r10 uw-70 ut-r">门店:</div>
        <input class="uinp" type="hidden" id="branchId" name="branchId">
        <input class="uinp" type="text" id="branchName" name="branchName">
        <input type="hidden" id="branchCompleCode" name="branchCompleCode" value="">
        <div class="uinp-more">...</div>
        </div>
    </div>
    </div>

    <div class="ub ub-ver upad-4">
    <div class="ub upad-4">
    <div class="ub ub-f1 ub-ver table-tree">
        <div class="ub ub-ac  uh-30 font-14">
            <span class="ub uh ub-ac ub-pc uw-128 bor-lt bor-rb">服务类型</span>
            <span class="ub uh ub-ac ub-pc uw-128 bor-top bor-rb">服务名称</span>
        </div>
        <!--一级start-->
        <ul class="uw ub ub-ver" id="content">

        </ul><!--一级 end-->
    </div>
    </div>
    </div>
</div>
</body>
</html>