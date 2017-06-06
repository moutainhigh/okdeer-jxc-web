<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>加盟店结算</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script  src="${ctx}/static/js/views/settle/franchise/settle/settleView.js?V=2.6.0"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<input type='hidden' id="pageStatus" value="edit">
	<input type='hidden' id="formId" value="${settle.id}">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
				<shiro:hasPermission name="JxcFranchiseSettle:add">
            		<div class="ubtns-item" onclick="addSupAcoSetForm()">新增</div>
            	</shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseSettle:add">
               		<div class="ubtns-item-disabled">保存</div>
               	</shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseSettle:audit">
                	<div class="ubtns-item-disabled">审核</div>
                </shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseSettle:delete">
                	<div class="ubtns-item-disabled">删除</div>
                </shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseSettle:export">
                	<div class="ubtns-item" onclick="exportOrder()">导出明细</div>
                </shiro:hasPermission>
				<shiro:hasPermission name="JxcFranchiseSettle:print">
                	<div class="ubtns-item-disabled">打印</div>
                </shiro:hasPermission>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub umar-t8 uc-black">【单号】:<span>${settle.formNo}</span></div>
        <div class="already-examine" id="already-examine"><span>已审核</span></div>
        <div class="ub uline umar-t8"></div>
        <div class="ub umar-t8">
            <div class="ub ub-ac uw-288 umar-l20">
                <div class="umar-r10 uw-70 ut-r">加盟店:</div>
                <div class="ub ub-f1">
                    <input type="hidden" id="franchiseBranchId" name="franchiseBranchId" value="${settle.franchiseBranchId}"/>
                    <input class="uinp ub ub-f1" type="text" id="franchiseBranchName" readonly="readonly" value="${settle.branchName}"/>
                </div>
                 <i class="ub ub-ac uc-red">*</i>
            </div>
            
            <div class="ub ub-ac uw-290 umar-l20">
				 <div class="umar-r12 uw-70 ut-r">付款方式:</div>
                 <select class='uinp easyui-combobox' id="payType" name="payType" data-options="valueField:'id',textField:'label',value:'${settle.payType}', url:'${ctx}/archive/financeCode/getDictListByTypeCode?dictTypeCode=101003', editable:false"
                 	 style="width:204px;" readonly="readonly" >
                 </select>
                 <i class="ub ub-ac uc-red">*</i>
            </div>
            
            <div class="ub ub-ac umar-l30">
                <div class="umar-r10 uw-70 ut-r">制单人:</div>
                <div class="utxt">${settle.createUserName}</div>
            </div>
            <div class="ub ub-ac umar-l50">
                <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                <div class="utxt" id="createTime"><fmt:formatDate value="${settle.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
         </div>
         <div class="ub umar-t8">
             <div class="ub ub-ac uw-304 umar-l6">
                 <div class="umar-r10 uw-90 ut-r">应收金额汇总:</div>
	             <input class="uinp ub ub-f1 uinp-no-more" type="text" id="payableAmount" readonly='readonly'
	             	 name="payableAmount" value="${settle.payableAmount}">
             </div>
             <div class="ub ub-ac uw-300 umar-l8">
             	 <div class="umar-r10 uw-90 ut-r">已收金额汇总:</div>
	             <input class="uinp ub ub-f1 uinp-no-more" type="text" id="payedAmount" readonly='readonly' 
	             	name="payedAmount" value="${settle.payedAmount}">
             </div>
             <div class="ub ub-ac umar-l28">
                 <div class="umar-r10 uw-80 ut-r">最后修改人:</div>
                 <div class="utxt">${settle.updateUserName}</div>
             </div>
             <div class="ub ub-ac umar-l50">
                 <div class="umar-r10 uw-60 ut-r">修改时间:</div>
                 <div class="utxt"><fmt:formatDate value="${settle.updateTime}" pattern="yyyy-MM-dd HH:mm"/></div>
             </div>
         </div>
         <div class="ub umar-t8">
             <div class="ub ub-ac uw-304 umar-l6">
                 <div class="umar-r10 uw-90 ut-r">未收金额汇总:</div>
             	 <input class="uinp ub ub-f1 uinp-no-more" type="text" id="unpayAmount" readonly='readonly' 
             	 	name="unpayAmount" value="${settle.unpayAmount}">
             </div>
             <div class="ub ub-ac uw-300 umar-l8">
             	 <div class="umar-r10 uw-90 ut-r">实收金额汇总:</div>
             	 <input class="uinp ub ub-f1 uinp-no-more" type="text"  id="actualAmount" readonly='readonly' 
             	 	name="actualAmount" value="${settle.actualAmount}">
             </div>
             <div class="ub ub-ac umar-l40">
                 <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                 <div class="utxt">${settle.auditUserName}</div>
             </div>
             <div class="ub ub-ac umar-l50">
                 <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                 <div class="utxt"><fmt:formatDate value="${settle.auditTime}" pattern="yyyy-MM-dd HH:mm"/></div>
             </div>
         </div>
         <div class="ub umar-t8">
             <div class="ub ub-ac umar-l20 uw-600 " style="width:593px;" >
                 <div class="umar-r10 uw-70 ut-r">备注:</div>
                 <input class="uinp ub ub-f1" type="text" id="remark" maxlength="20" value="${settle.remark}" name="remark" readonly='readonly' >
             </div>               
         </div>
           <%--datagrid-edit--%>
           <div class="ub ub-f1 datagrid-edit umar-t8">
            <table id="franchiseAccountAdd" ></table>
        </div>
    </div>

</body>
</html>
