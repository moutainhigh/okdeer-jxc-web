<%--
  Created by IntelliJ IDEA.
  User: Jason
  Date: 2017/9/11
  Time: 17:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>采购促销活动-查看编辑</title>

    <%@ include file="/WEB-INF/views/include/header.jsp" %>
    <script src="${ctx}/static/js/views/purchase/activity/activityMain.js?V=${versionNo}"></script>
    <style>
        .datagrid-header-row .datagrid-cell {
            text-align: center !important;
        }
    </style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
<div class="ub ub-ver ub-f1 umar-4  ubor">
    <div class="ub ub-ac upad-4">
        <div class="ubtns">
            <shiro:hasPermission name="JxcPurchaseOrder:add">
                <c:choose>
                    <c:when test="${form.status eq '0'}">
                        <div class="ubtns-item" onclick="saveForm()">保存</div>
                    </c:when>
                </c:choose>
            </shiro:hasPermission>
            <shiro:hasPermission name="purchaseActivity:copy">
                <div class="ubtns-item" onclick="copy('${form.id}')">复制</div>
            </shiro:hasPermission>
            <shiro:hasPermission name="purchaseActivity:audit">
                <c:choose>
                    <c:when test="${form.status eq '0'}">
                        <div class="ubtns-item" onclick="check()">审核</div>
                    </c:when>
                </c:choose>
            </shiro:hasPermission>
            <c:choose>
                <c:when test="${form.status eq '1'}">
                    <div class="ubtns-item" onclick="over()">终止</div>
                </c:when>
            </c:choose>
            <c:choose>
                <c:when test="${form.status eq '0'}">
                    <div class="ubtns-item" onclick="selectGoods()">商品选择</div>
                    <div class="ubtns-item importGood" onclick="toImportproduct(0)">导入货号</div>
                    <div class="ubtns-item importGood" onclick="toImportproduct(1)">导入条码</div>
                    <div class="ubtns-item" onclick="del()">删除</div>
                </c:when>
            </c:choose>
            <div class="ubtns-item" onclick="exportData()">导出</div>
            <div class="ubtns-item" onclick="toClose()">关闭</div>
        </div>
    </div>
    <c:choose>
        <c:when test="${form.status eq '2'}">
            <div class="already-examine" id="already-examine"><span>已终止</span></div>
        </c:when>
        <c:when test="${form.status eq '1'}">
            <div class="already-examine" id="already-examine"><span>已审核</span></div>
        </c:when>
    </c:choose>
    <form id="formAdd" method="post" action="">
        <input type='hidden' id="id" name="id" value="${form.id}">
        <input type='hidden' id="pageStatus" name="pageStatus" value="${form.status}">
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
                    <div class="utxt"><c:out value="${form.createUserName}"/>
                    </div>
                </div>
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                    <div class="utxt" id="createTime"><fmt:formatDate value="${form.createTime}"
                                                                      pattern="yyyy-MM-dd HH:mm:ss"/></div>
                </div>
            </div>
            <div class="ub umar-t8">

                <div class="ub ub-ac umar-r36" id="supplierSelect">
                    <div class="umar-r10 uw-60 ut-r">供应商:</div>
                    <input class="uinp" name="supplierId" id="supplierId" type="hidden" value="${form.supplierId}">
                    <input class="uinp" readonly="readonly" id="supplierName" type="text" value="${form.supplierName}">
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
                    <div class="utxt"><c:out value="${form.updateUserName}"/></div>
                </div>
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-60 ut-r">修改时间:</div>
                    <div class="utxt"><fmt:formatDate value="${form.updateTime}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
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
                    <div class="utxt"><c:out value="${form.validUserName}"/></div>
                </div>
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                    <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
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
