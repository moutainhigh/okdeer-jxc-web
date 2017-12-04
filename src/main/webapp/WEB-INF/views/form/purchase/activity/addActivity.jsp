<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>采购促销活动-新增</title>

    <%@ include file="/WEB-INF/views/include/header.jsp" %>
    <script src="${ctx}/static/js/views/purchase/activity/activityMain.js?V=${versionNo}"></script>
    <style>
        .datagrid-header-row .datagrid-cell {
            text-align: center !important;
        }
    </style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
<c:choose>
    <c:when test="${form.id != null}">
        <input type='hidden' id="copyId" name="copyId" value="${form.id}">
        <input type='hidden' id="pageStatus" name="pageStatus" value="copy">
    </c:when>
    <c:otherwise>
        <input type='hidden' id="pageStatus" name="pageStatus" value="add">
    </c:otherwise>
</c:choose>
<div class="ub ub-ver ub-f1 umar-4  ubor">
    <div class="ub ub-ac upad-4">
        <div class="ubtns">
            <shiro:hasPermission name="JxcPurchaseOrder:add">
                <div class="ubtns-item" onclick="saveForm()">保存</div>
            </shiro:hasPermission>
            <shiro:hasPermission name="purchaseActivity:copy">
                <div class="ubtns-item" onclick="copy()">复制</div>
            </shiro:hasPermission>
            <div class="ubtns-item-disabled">审核</div>
            <div class="ubtns-item" onclick="selectGoods()">商品选择</div>
            <div class="ubtns-item importGood" onclick="toImportproduct(0)">导入货号</div>
            <div class="ubtns-item importGood" onclick="toImportproduct(1)">导入条码</div>
            <div class="ubtns-item-disabled">导出</div>
            <div class="ubtns-item" onclick="toClose()">关闭</div>
        </div>
    </div>
    <form id="formAdd">
        <div class="ub ub-ver ">
            <div class="ub umar-t8">
                <div class="ub ub-ac umar-r80" id="targetBranch">
                    <div class="umar-r10 uw-60 ut-r">机构:</div>
                    <input class="uinp" name="branchId" id="branchId" type="hidden" value="${form.branchId}">
                    <input class="uinp" name="branchCode" id="branchCode" type="hidden" value="${form.branchCode}">
                    <input id="branchName" name="branchName" class="uinp uw-600" readonly="readonly" type="text"
                           value="${form.branchName}">
                    <div class="uinp-more">...</div>
                </div>

                <div class="ub ub-ac umar-r80">
                    <div class="umar-r10 uw-60 ut-r">制单人员:</div>
                    <div class="utxt"><%=UserUtil.getCurrentUser().getUserName()%>
                    </div>
                </div>
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                    <div class="utxt" id="createTime"></div>
                </div>
            </div>
            <div class="ub umar-t8">

                <div class="ub ub-ac umar-r36" id="supplierSelect">
                    <div class="umar-r10 uw-60 ut-r">供应商:</div>
                    <input class="uinp" name="supplierId" id="supplierId" type="hidden" value="${form.supplierId}">
                    <input class="uinp" readonly="readonly" id="supplierName" type="text" value="${form.supplierName}"
                           <c:if test="${form.id != null}">disabled</c:if>>
                    <div class="uinp-more">...</div>
                </div>

                <div class="ub ub-ac umar-r80">
                    <div class="umar-r10 uw-60 ut-r">活动日期:</div>
                    <input id="txtStartDate" name="startTime" class="Wdate newWdate"
                           type="text"
                           onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true})"
                           value="<fmt:formatDate value="${form.startTime}" pattern="yyyy-MM-dd" />"/>至
                    <input id="txtEndDate" name="endTime" class="Wdate newWdate"
                           type="text"
                           onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true,minDate:'#F{$dp.$D(\'txtStartDate\')}'})"
                           value="<fmt:formatDate value="${form.endTime}" pattern="yyyy-MM-dd" />"/>
                </div>


                <div class="ub ub-ac umar-r80">
                    <div class="umar-r10 uw-60 ut-r">修改人:</div>
                    <div class="utxt"></div>
                </div>
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-60 ut-r">修改时间:</div>
                    <div class="utxt"></div>
                </div>
            </div>
            <div class="ub umar-t8">
                <div class="ub ub-ac umar-r80">
                    <div class="umar-r10 uw-60 ut-r">备注:</div>
                    <input class="uinp uw-600" name="remark" id="remark" type="text"
                           onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
                           onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
                           oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
                           maxlength="100" value="<c:out value="${form.remark}"/>">
                </div>

                <div class="ub ub-ac umar-r80">
                    <div class="umar-r10 uw-60 ut-r">审核人员:</div>
                    <div class="utxt"></div>
                </div>
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                    <div class="utxt"></div>
                </div>
            </div>
        </div>
    </form>
    <div class="ub uw umar-t8 ub-f1">
        <table id="gridActivity"></table>
    </div>
</div>

</body>
</html>