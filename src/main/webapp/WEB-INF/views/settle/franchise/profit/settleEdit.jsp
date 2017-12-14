<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>加盟店毛利结算</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script  src="${ctx}/static/js/views/settle/franchise/profit/settle.js?V=${versionNo}"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<input type='hidden' id="pageStatus" value="edit">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
				<shiro:hasPermission name="JxcFranchiseProfit:add">
	           		<div class="ubtns-item" onclick="addProfitSetForm()">新增</div>
	              	<div class="ubtns-item" onclick="saveProSet()">保存</div>
              	</shiro:hasPermission>
              	<div class="ubtns-item" onclick="calAmount()">计算账款</div>
				<shiro:hasPermission name="JxcFranchiseProfit:add">
               		<div class="ubtns-item" onclick="auditProfitSettle()">审核</div>
               	</shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseProfit:delete">
               		<div class="ubtns-item" onclick="deleteProfitSettle()">删除</div>
               	</shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseProfit:export">
               		<div class="ubtns-item" onclick="exportProfitSettle()">导出明细</div>
               	</shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseProfit:print">
               		<div class="ubtns-item-disabled">打印</div>
               	</shiro:hasPermission>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub umar-t8 uc-black">【单号】:<span>${settleVo.formNo}</span></div>
        <div class="ub uline umar-t8"></div>
        <input type="hidden" id="oldTime">
        <form id="profitSettleForm">
		<input type="hidden" name="id" id="formId" value="${settleVo.id}">
		<input type="hidden" name="formNo" id="formNo" value="${settleVo.formNo}">
        <div class="ub umar-t8">
            <div class="ub ub-ac uw-296 umar-l20" id="branchComponent">
                <div class="umar-r10 uw-70 ut-r">加盟店:</div>
                <div class="ub ub-f1">
                    <input type="hidden" id="branchId" name="franchiseBranchId" value="${settleVo.franchiseBranchId}"/>
                    <input type="hidden" id="branchCode" name="franchiseBranchCode" value="${settleVo.franchiseBranchCode}"/>
                    <input class="uinp ub ub-f1" type="text" id="franchiseBranchName" readonly="readonly" value="${settleVo.franchiseBranchName}"/>
                    <div class="uinp-more">...</div>
                </div>
                 <i class="ub ub-ac uc-red">*</i>
            </div>
            
            <div class="ub ub-ac uw-300 umar-l24" style="margin-left:22px;">
                 <div class="umar-r10 uw-90 ut-r">联系人:</div>
	             <input class="uinp ub ub-f1 uinp-no-more" type="text" id="contractName" readonly='readonly' name="contacts" value="${settleVo.contacts}">
             </div>
            
            <div class="ub ub-ac umar-l40">
                <div class="umar-r10 uw-70 ut-r">制单人:</div>
                <div class="utxt">${settleVo.createUserName}</div>
            </div>
            <div class="ub ub-ac umar-l50">
                <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                <div class="utxt" id="createTime"><fmt:formatDate value="${settleVo.createTime}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
            </div>
         </div>
         <div class="ub umar-t8">
         		<div class="ub ub-ac uw-316 umar-l6">
           			<div class="umar-r10 uw-90 ut-r">计算时间:</div>
           			<input id="beginDate" name="settleTimeStart" class="Wdate ub ub-f1" type="text" value="<fmt:formatDate value="${settleVo.settleTimeStart}" pattern="yyyy-MM-dd"/>" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true,maxDate:'#F{$dp.$D(\'endDate\')||dateUtil.getCurrDayPreOrNextDay(\'prev\',1)}' })" />
           				&nbsp;至&nbsp;
           			<input id="endDate" name="settleTimeEnd" class="Wdate ub ub-f1" type="text" value="<fmt:formatDate value="${settleVo.settleTimeEnd}" pattern="yyyy-MM-dd"/>" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true,minDate:'#F{$dp.$D(\'beginDate\');}',maxDate:'%y-%M-{%d-1}'})" />
           			<i class="ub ub-ac uc-red">*</i>
           		</div>
           		<div class="ub ub-ac uw-316 umar-l12">
           			<div class="umar-r10 uw-100 ut-r">付款日期:</div>
	                <div class="ub ub-f1">
	                   <input id="payMoneyTime" name = "payTime" class="Wdate ub ub-f1" type="text" value="<fmt:formatDate value="${settleVo.payTime}" pattern="yyyy-MM-dd"/>" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',readOnly:true})" pattern="yyyy-MM-dd"/>
	                </div>
	                <i class="ub ub-ac uc-red">*</i>
           		</div>
	             <div class="ub ub-ac umar-l24">
			         <div class="umar-r10 uw-80 ut-r">最后修改人:</div>
			         <div class="utxt">${settleVo.updateUserName}</div>
			     </div>
			     <div class="ub ub-ac umar-l50">
			         <div class="umar-r10 uw-60 ut-r">修改时间:</div>
			         <div class="utxt"><fmt:formatDate value="${settleVo.updateTime}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
			     </div>
         </div>
         <div class="ub umar-t8">
         	 <div class="ub ub-ac uw-290 umar-l20">
				 <div class="umar-r12 uw-70 ut-r">付款方式:</div>
                 <select class='uinp easyui-combobox' id="payType" name="payType" data-options="valueField:'id',value:'${settleVo.payType}',textField:'label',url:'${ctx}/archive/financeCode/getDictListByTypeCode?dictTypeCode=101003',editable:false" style="width:208px;">
                 </select>
                 <i class="ub ub-ac uc-red">*</i>
            </div>
            <div class="ub ub-ac uw-300 umar-l28">
                 <div class="umar-r10 uw-90 ut-r">毛利:</div>
	             <input class="easyui-numberbox uw-200 editInput"  data-value="${settleVo.profitAmount}" data-options="precision:4" id="profit" readonly='readonly'  name="profitAmount">
             </div>
             <div class="ub ub-ac umar-l40">
                 <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                 <div class="utxt"></div>
             </div>
             <div class="ub ub-ac umar-l50">
                 <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                 <div class="utxt"></div>
             </div>
         </div>
         <div class="ub umar-t8">
             <div class="ub ub-ac uw-310 umar-l6">
                 <div class="umar-r10 uw-90 ut-r">公司应得毛利:</div>
	             <input class="easyui-numberbox uw-204 editInput"  data-value="${settleVo.targetProfitAmount}" data-options="precision:4" type="text"  id="profitOfCompany" readonly='readonly'  name="targetProfitAmount">
             </div>
             <div class="ub ub-ac uw-320 umar-l8">
             	 <div class="umar-r10 uw-110 ut-r">加盟店应得毛利:</div>
	             <input class="easyui-numberbox uw-200 editInput"  data-value="${settleVo.franchiseProfitAmount}" data-options="precision:4" type="text"  id="profitSupper" readonly='readonly'  name="franchiseProfitAmount">
             </div>
             <div class="ub ub-ac uw-304 umar-l20">
                 <div class="umar-r10 uw-90 ut-r">本次收款金额:</div>
             	 <input class="easyui-numberbox uw-200 editInput"  data-value="${settleVo.totalAmount}" data-options="precision:4" type="text"  id="amount" readonly='readonly'  name="totalAmount">
             </div>
             <div class="ub ub-ac uw-300 umar-l16">
             	 <div class="umar-r10 uw-90 ut-r">其他收款金额:</div>
             	 <input class="uinp easyui-numberbox editInput" data-options="max:999999.9999,min:-999999.9999,precision:4,onChange:calulateMoney"  data-value="${settleVo.otherAmount}" type="text"  id="otherAmount"  name="otherAmount">
             </div>
         </div>
         <div class="ub umar-t8">
             <div class="ub ub-ac umar-l20 uw-600 " style="width:618px;" >
                 <div class="umar-r10 uw-70 ut-r">备注:</div>
                 <input class="uinp ub ub-f1" type="text" value="${settleVo.remark}" id="remark" maxlength="50"  name="remark">
             </div>               
         </div>
		 </form>
           <%--datagrid-edit--%>
         <div id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
         	<table id="proFitAdd" ></table>
         </div>
    </div>
</body>
</html>
