<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>配送汇总(按单机构查询)</title>
    <%@ include file="/WEB-INF/views/include/header.jsp" %>
    <script
            src="${ctx}/static/js/views/report/deliver/deliverTotalReport.js?V=${versionNo}44"></script>

</head>
<body class="ub uw uh ufs-14 uc-black">
<div class="ub ub-ver ub-f1 umar-4 upad-4">
    <form id="queryForm" action="" method="post">
        <div class="ub ub-ac">
            <div class="ubtns">
                <shiro:hasPermission name="newJxcDLTotalReport:search">
                    <div class="ubtns-item" onclick="query()">查询</div>
                </shiro:hasPermission>
                <shiro:hasPermission name="newJxcDLTotalReport:export">
                    <div class="ubtns-item" onclick="exportData()">导出</div>
                </shiro:hasPermission>
                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
                <div class="ubtns-item" onclick="toClose()">退出</div>
            </div>

            <!-- 引入时间选择控件 -->
            <%@ include file="/WEB-INF/views/component/dateSelect.jsp" %>
        </div>

        <div class="ub umar-t8">

            <div class="ub ub-ac" id="targetBranch">
                <div class="umar-r10 uw-70 ut-r">查询机构:</div>
                <input class="uinp ub ub-f1" type="hidden" id="branchId"
                       name="branchId">
                <input class="uinp ub ub-f1" type="text"
                       id="branchName" name="branchName">
                <div class="uinp-more">...</div>
            </div>


            <%--<div class="ub ub-ac umar-r60">--%>
            <%--<div class="umar-r10 uw-80 ut-r">查询机构:</div>--%>
            <%--<input type="hidden" id="branchId" name="branchId" value="${branchesGrow.branchesId}"/>--%>
            <%--<input class="uinp ub ub-f1" type="text" id="branchName" name="branchName"/>&lt;%&ndash;  value="${branchesGrow.branchName}"  &ndash;%&gt;--%>
            <%--<div class="uinp-more" onclick="selectBranches()" >...</div>--%>
            <%--</div>--%>
            <div class="ub ub-ac">
                <div class="umar-r10 uw-80 ut-r">单据编号:</div>
                <input type="text" name="formNo" id="formNo" class="uinp"
                       readonly="readonly"/>
            </div>
            <div class="ub ub-ac umar-r60">
                <div class="umar-r10 uw-80 ut-r">货号:</div>
                <input type="hidden" name="skuId" id="skuId" class="uinp"/> <input
                    type="text" name="skuCode" id="skuCode" class="uinp"/>
                <!-- <div class="uinp-more" id="cashierIdSelect" onclick="selectGoods()">...</div> -->
            </div>


        </div>
        <div class="ub umar-t8">

            <div class="ub ub-ac">
                <div class="umar-r10 uw-70 ut-r">单据类别:</div>
                <select style="width: 204px;" class="easyui-combobox uselect"
                        name="formType" id="formType" data-options="editable:false">
                    <option value="">全部</option>
                    <option value="DO">配送出库单</option>
                    <option value="DI">配送入库单</option>
                </select>
            </div>
            <div class="ub ub-ac umar-r60" id="categorySelect">
                <div class="umar-r10 uw-80 ut-r">商品类别:</div>
                <input id="goodsCategoryId" name="goodsCategoryId" class="uinp"
                       type="hidden">
                <input id="categoryCode" name="categoryCode" class="uinp"
                       type="hidden" maxlength="50">
                <input
                        id="categoryName" name="categoryName" class="uinp" type="text"
                        maxlength="50">
                <div class="uinp-more new-right" id="categoryButon">...</div>
            </div>


        </div>
        <div class="ub umar-t8">
            <!--input-checkbox-->
            <div class="ub ub-ac">
                <div class="umar-r10 uw-70 ut-r">汇总类型:</div>
                <div class="ub ub-ac umar-r10 ">
                    <input class="ub radioItem" id="goods" type="radio"
                           name="queryType" value="goods" checked="checked"/> <label
                        for="goods">商品汇总</label>
                </div>
                <div class="ub ub-ac umar-r10">
                    <input class="ub radioItem" id="form" type="radio"
                           name="queryType" value="form"/> <label for="form">按单汇总</label>
                </div>
                <div class="ub ub-ac umar-r10">
                    <input class="ub radioItem" id="branch" type="radio"
                           name="queryType" value="branch"/> <label for="branch">往来汇总</label>
                </div>
                <div class="ub ub-ac umar-r10">
                    <input class="ub radioItem" id="category" type="radio"
                           name="queryType" value="category"/> <label for="category">类别汇总</label>
                    <div id="categoryTypeDiv">
                        <select class="easyui-combobox uselect" name="categoryType"
                                id="categoryType" data-options="editable:false">
                            <option value="smallCategory">小类</option>
                            <option value="medCategory">中类</option>
                            <option value="bigCategory">大类</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>
    </form>
    <div class="ub ub-f1 umar-t20">
        <table id="cashDaily"></table>
    </div>
</div>
</body>
</html>