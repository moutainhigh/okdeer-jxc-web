<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>便民服务收银流水</title>
    <%@ include file="/WEB-INF/views/include/header.jsp" %>
    <script src="${ctx}/static/js/views/csrservice/cash/flow.js?V=${versionNo}"></script>
    <style>
        .datagrid-header-row .datagrid-cell {
            text-align: center !important;
        }
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">

<div class="ub ub-ver ub-f1 umar-4 upad-4">
    <form id="queryForm" action="" method="post">
        <div class="ub ub-ac">
            <div class="ubtns">
                <div class="ubtns-item" onclick="query()">查询</div>
                <div class="ubtns-item" onclick="exportData()">导出</div>
                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
                <div class="ubtns-item" onclick="toClose()">退出</div>
            </div>

            <!-- 引入时间选择控件 -->
            <%@ include file="/WEB-INF/views/component/dataSelectHour.jsp" %>
        </div>

        <div class="ub uline umar-t8"></div>

        <div class="ub umar-t8">
            <div class="ub ub-ac" id="branchComponent">
                <div class="umar-r10 uw-70 ut-r">机构名称:</div>
                <input type="hidden" id="branchId" name="branchId"/>
                <input class="uinp ub ub-f1" type="hidden" id="branchCode" name="branchCode">
                <input class="uinp ub ub-f1" type="text" id="branchNameOrCode" name="branchNameOrCode">
                <div class="uinp-more">...</div>
            </div>
            <div class="ub ub-ac">
                <div class="umar-r10 uw-70 ut-r">单据编号:</div>
                <input class="uinp" type="text" name="orderNo" id="orderNo">
            </div>
            <div class="ub ub-ac uselectw  umar-l20">
                <div class="umar-r10 uw-70 ut-r">服务类型:</div>
                <!--select-->
                <select class="easyui-combobox uselect" name="csrserviceId" id="csrserviceId"
                        data-options="editable:false">
                    <option value="" selected="selected">全部</option>
                    <c:forEach var="item" items="${data}" varStatus="status">
                        <option value="${item.id}">${item.typeName}</option>
                    </c:forEach>
                </select>
            </div>
        </div>
        <div class="ub umar-t8">

            <div class="ub ub-ac">
                <div class="umar-r10 uw-70 ut-r">付款方式:</div>
                <!--select-->
                <select class="easyui-combobox uselect uw-300" name="payType" id="payType"
                        data-options="editable:false">
                    <option value="" selected="selected">全部</option>
                    <option value="RMB">现金</option>
                    <option value="WZF">微信</option>
                    <option value="ZFB">支付宝</option>
                </select>
            </div>

            <div class="ub ub-ac">
                <div class="umar-r10 uw-70 ut-r">收银员:</div>
                <input type="hidden" name="cashierId" id="cashierId" class="uinp"/>
                <input type="text" name="cashierNameOrCode" id="cashierNameOrCode" class="uinp"
                       onblur="clearCashierId()"/>
                <div class="uinp-more" id="cashierIdSelect" onclick="searchCashierId()">...</div>
            </div>

        </div>
    </form>

    <div class="ub ub-f1 umar-t20">
        <table id="cashWater"></table>
    </div>
</div>

</body>

</html>