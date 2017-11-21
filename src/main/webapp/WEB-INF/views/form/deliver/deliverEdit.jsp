<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>要货单-编辑</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/deliver/deliver.js?V=${versionNo}2"></script>
    <%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
<input type='hidden' id="deliverStatus" value="edit">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
                <div class="ubtns-item" onclick="addDeliverForm()">新增</div>
                <div class="ubtns-item" onclick="updateOrder()">保存</div>
                <shiro:hasPermission name="JxcDeliverDA:audit">
                <div id="check_deliver" class="ubtns-item" onclick="check(this)">审核</div>
                </shiro:hasPermission>
                <div class="ubtns-item" onclick="selectGoods()">商品选择</div>
                <shiro:hasPermission name="JxcDeliverDA:suggest">
                    <div class="ubtns-item init" id="suggestBtn" data-role='suggest' onclick="suggestSelectGoods()">建议订货商品</div>
                </shiro:hasPermission>
                <div class="ubtns-item" onclick="delDeliverForm()">删除</div>
                <div class="ubtns-item" onclick="printChoose('DA','/form/deliverForm/')">打印</div>
                <div class="ubtns-item"  onclick="exportData('DA','gridRequireOrder')">导出明细</div>
                <div class="ubtns-item" onclick="toImportproduct(0)">导入货号</div>
            	<div class="ubtns-item" onclick="toImportproduct(1)">导入条码</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub umar-t8 uc-black">【单号】:<span>${form.formNo}</span></div>
        <div class="ub uline umar-t8"></div>
        <input type="hidden" id="formId" value="${form.deliverFormId}">
        <input type="hidden" id="formNo" value="${form.formNo}">
        <div class="ub umar-t8">
            <div class="ub ub-ac uw-300">
                <div class="umar-r10 uw-60 ut-r">要货机构:</div>
                <div class="ub">
                    <input class="uinp" name="targetBranchId" id="targetBranchId" type="hidden" value="${form.targetBranchId}">
                    <input type="hidden" id="minAmount" name="minAmount" value="${minAmount}"  />
                    <input type="hidden" id="targetBranchType" name="targetBranchType" value="${targetBranchType}"  />
                    <input type="hidden" id="targetDeliverPriceSpec" name="targetDeliverPriceSpec" value="${targetDeliverPriceSpec}"  />
                    <input type="hidden" id="isMinAmount" name="isMinAmount" value="${isMinAmount}"  />
                    <input class="uinp" id="targetBranchName" name="targetBranchName" type="text" readonly="readonly" value="${form.targetBranchName}" />
                    <div class="uinp-more" >...</div>
                </div>
            </div>
            <div class="ub ub-ac uw-300 umar-l20">
            
                <div class="umar-r10 uw-60 ut-r">业务人员:</div>
                
                <div class="ub">
                    <input class="uinp ub ub-f1" type="text" id="salesman" name="salesman" value="${salesman}" readonly="readonly">
                    <div class="uinp-more"></div>
                </div>
            </div>
            <div class="ub ub-ac umar-l20">
                <div class="umar-r10 uw-60 ut-r">制单人员:</div>
                <div class="utxt">${form.createUserName}</div>
            </div>
            <div class="ub ub-ac umar-l20">
                <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                <div class="utxt" id="createTime"><fmt:formatDate value="${form.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
        </div>
        <div class="ub umar-t8">
            <div class="ub ub-ac uw-300">
                <div class="umar-r10 uw-60 ut-r">发货机构:</div>
                <div class="ub">
                    <input class="uinp" name="sourceBranchId" id="sourceBranchId" type="hidden" value="${form.sourceBranchId}" />
                    <input class="uinp" id="sourceBranchName" name="sourceBranchName" type="text" readonly="readonly" value="${form.sourceBranchName}" onclick="selectSourceBranch()"/>
                    <div class="uinp-more" onclick="selectSourceBranch()">...</div>
                </div>
            </div>
            <div class="ub ub-ac uw-300 umar-l20">
                <div class="umar-r10 uw-60 ut-r">有效期限:</div>
                <input id="validityTime" class="Wdate" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true})" value="<fmt:formatDate value="${form.validityTime}" pattern="yyyy-MM-dd"/>"/>
            </div>
            <div class="ub ub-ac umar-l1">
                <div class="umar-r10 uw-80 ut-r">最后修改人:</div>
                <div class="utxt">${form.updateUserName}</div>
            </div>
            <div class="ub ub-ac umar-l20">
                <div class="umar-r10 uw-60 ut-r">修改时间:</div>
                <div class="utxt"><fmt:formatDate value="${form.updateTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
        </div>
        <div class="ub umar-t8">
        	<div class="ub ub-ac uw-300">
                <div class="umar-r10 uw-60 ut-r">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</div>
                <input class="uinp ub " type="text" id="remark" name="remark"  value="${form.remark}">
            </div>
            <div class="ub ub-ac umar-l20 uw-296">
            <shiro:hasPermission name="JxcDeliverDA:suggest">
                <div class="umar-r10 uw-60 ut-r">数量处理:</div>
                <div class="ub ub-ac umar-r10">
                    <input class="radioItem" type="radio" name="numDeal" id="status_1" value="0"><label for="status_1">设置为建议订货数量 </label>
                </div>
                <div class="ub ub-ac umar-r10">
                    <input class="radioItem" type="radio" name="numDeal" id="status_2" value="1"><label for="status_2">重新归零 </label>
                </div>
           </shiro:hasPermission>
           </div>
	           
           <div class="ub ub-ac umar-l12">
               <div class="umar-r10 uw-70 ut-r">审核人员:</div>
               <div class="utxt">${form.validUserName}</div>
           </div>
           <div class="ub ub-ac umar-l20">
               <div class="umar-r10 uw-60 ut-r">审核时间:</div>
               <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div>
           </div>
               
        </div>
        <from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
                <table id=gridRequireOrder ></table>
        </from>
    </div>

</body>
</html>