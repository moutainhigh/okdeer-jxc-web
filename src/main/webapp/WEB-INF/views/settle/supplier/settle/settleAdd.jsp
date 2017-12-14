<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>供应商结算</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script  src="${ctx}/static/js/views/settle/supplier/settle/settle.js?V=2.6.0"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
    <script>
        var _comboV = '';
    </script>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<input type='hidden' id="operateType" value="add">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
            	<shiro:hasPermission name="JxcSupplierChain:add">
            	<div class="ubtns-item" onclick="addSupAcoSetForm()">新增</div>
            	</shiro:hasPermission>
                <div class="ubtns-item" onclick="saveSupAcoSet()">保存</div>
                <div class="ubtns-item-disabled">审核</div>
                <div class="ubtns-item-disabled">删除</div>
                <div class="ubtns-item-disabled">导出明细</div>
                <div class="ubtns-item-disabled">打印</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub uline umar-t8"></div>
        <form id = "settleForm">
        <input type="hidden" id="checkMode" name="checkMode" >
        <div class="ub umar-t8">
            <div class="ub ub-ac uw-288 umar-l20" id="branchComponent">
                <div class="umar-r10 uw-70 ut-r">机构:</div>
                <div class="ub ub-f1">
                    <input type="hidden" id="branchId" name="branchId"/>
                    <input type="hidden" id="branchCode" name="branchCode"/>
                    <input type="hidden" id="isContainChildren" name="isContainChildren"/>
                    <input type="hidden" id="branchCompleCode" name="branchCompleCode"/>
                    <input class="uinp ub ub-f1" type="text" id="targetBranchName" readonly="readonly"/>
                    <div class="uinp-more">...</div>
                </div>
                 <i class="ub ub-ac uc-red">*</i>
            </div>
            
            <div class="ub ub-ac uw-290 umar-l20" id="supplierComponent">
				<div class="umar-r12 uw-70 ut-r">供应商:</div>
                <div class="ub ub-f1">
                	<input class="uinp" name="supplierId" id="supplierId"type="hidden">
					<input class="uinp ub ub-f1" readonly="readonly" id="supplierName" type="text">
					<div class="uinp-more">...</div>
                </div>
                <i class="ub ub-ac uc-red">*</i>
            </div>
            
            <div class="ub ub-ac umar-l30">
                <div class="umar-r10 uw-70 ut-r">制单人:</div>
                <div class="utxt"><%=UserUtil.getCurrentUser().getUserName() %></div>
            </div>
            <div class="ub ub-ac umar-l50">
                <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                <div class="utxt" id="createTime"></div>
            </div>
         </div>
         <div class="ub umar-t8">
             <div class="ub ub-ac uw-280 umar-l20">
                 <div class="umar-r10 uw-70 ut-r">开户银行:</div>
                 <input class="uinp ub ub-f1 uinp-no-more" type="text" id="openAccountBank" readonly='readonly'  name="openAccountBank">
             </div>
             <div class="ub ub-ac uw-284 umar-l28">
             	   <div class="umar-r12 uw-70 ut-r">银行账号:</div>
                 <input class="uinp ub ub-f1 uinp-no-more " type="text" id="bankAccount" readonly='readonly'  name="bankAccount">
             </div>
             <div class="ub ub-ac umar-l28">
                 <div class="umar-r10 uw-80 ut-r">最后修改人:</div>
                 <div class="utxt"></div>
             </div>
             <div class="ub ub-ac umar-l50">
                 <div class="umar-r10 uw-60 ut-r">修改时间:</div>
                 <div class="utxt"></div>
             </div>
         </div>
         <div class="ub umar-t8">
             <div class="ub ub-ac uw-280 umar-l20">
                 <div class="umar-r10 uw-70 ut-r">办公地址:</div>
                 <input class="uinp ub ub-f1 uinp-no-more" type="text" id="officeAddress" readonly='readonly'  name="officeAddress">
             </div>
             <div class="ub ub-ac uw-304 umar-l8">
             	 <div class="umar-r10 uw-92 ut-r">国税登记号:</div>
                 <input class="uinp ub ub-f1 uinp-no-more " type="text" id="nationalTaxRegNum" readonly='readonly'  name="nationalTaxRegNum">
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
	         <div class="ub ub-ac uw-280 umar-l20">
	             <div class="umar-r10 uw-70 ut-r">联系方式:</div>
                 <input type="hidden" id="phone" name="phone">
                 <input type="hidden" id="mobile" name="mobile">
	             <input class="uinp ub ub-f1 uinp-no-more" type="text" id="tel" readonly='readonly'  name="tel">
	         </div>
	         <div class="ub ub-ac uw-290 umar-l28">
             	 <div class="umar-r12 uw-70 ut-r">支付方式:</div>
                 <select class='uinp easyui-combobox' style="width:204px;" id="payType" name="payType" data-options="valueField:'id',textField:'label',loadFilter:loadFilter,url:'${ctx}/archive/financeCode/getDictListByTypeCode?dictTypeCode=101003',editable:false" >
                 </select>
             </div>
             <div class="ub ub-ac uw-300 umar-l12">
             	 <div class="umar-r10 uw-90 ut-r">优惠金额汇总:</div>
             	 <input class="uinp ub ub-f1 uinp-no-more" type="text" value="0.0000" id="discountAmount" readonly='readonly'  name="discountAmount">
             </div>
         </div>
         
         <div class="ub umar-t8">
	         <div class="ub ub-ac uw-300 ">
	             <div class="umar-r10 uw-90 ut-r">应付金额汇总:</div>
	             <input class="uinp ub ub-f1 uinp-no-more" type="text" value="0.0000" id="payableAmount" readonly='readonly'  name="payableAmount">
	         </div>
	         <div class="ub ub-ac uw-300 umar-l10">
	             <div class="umar-r10 uw-90 ut-r">已付金额汇总:</div>
	             <input class="uinp ub ub-f1 uinp-no-more" type="text" value="0.0000" id="payedAmount" readonly='readonly'  name="payedAmount">
	         </div>
             <div class="ub ub-ac uw-300 umar-l20">
             	 <div class="umar-r10 uw-90 ut-r">未付金额汇总:</div>
             	 <input class="uinp ub ub-f1 uinp-no-more" type="text" value="0.0000" id="unpayAmount" readonly='readonly'  name="unpayAmount">
             </div>
             <div class="ub ub-ac uw-300 umar-l24">
             	 <div class="umar-r10 uw-90 ut-r">实付金额汇总:</div>
             	 <input class="uinp easyui-numberbox" data-options="precision:4,onChange:changeActMountFrom,filter:filterData" type="text" value="0.0000" id="actualAmount"  name="actualAmount">
             </div>
         </div>
         
         <div class="ub umar-t8">
             <div class="ub ub-ac umar-l20 uw-600 " style="width:908px;" >
                 <div class="umar-r10 uw-70 ut-r">备注:</div>
                 <input class="uinp ub ub-f1" type="text" id="remark" maxlength="20"  name="remark">
             </div>               
         </div>
         </form>
           <%--datagrid-edit--%>

    <from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
    <table id="supplierChkAccountAdd" ></table>
    </from>

    </div>

</body>
</html>
