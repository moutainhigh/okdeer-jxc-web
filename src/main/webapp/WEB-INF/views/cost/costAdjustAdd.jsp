<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>成本调整单-新增</title>
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script  src="${ctx}/static/js/views/cost/costAdjustAdd.js?V=${versionNo}"></script>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
    <form id="addqueryForm" action="" method="post">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
             <shiro:hasPermission name="JxcCostAdjust:add">
                <div class="ubtns-item" onclick="addsaveOrder()">保存</div>
             </shiro:hasPermission>
                <div class="ubtns-item" onclick="selectGoods()">商品选择</div>
                <div class="ubtns-item" id="importdetail" onclick="toImportproduct(0)">导入货号</div>
          		<div class="ubtns-item" id="importdetail" onclick="toImportproduct(1)">导入条码</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
           <div class="ub umar-t10">
               <div class="ub ub-ac uw-280">
	                <div class="umar-r10 uw-70 ut-r">机构名称:</div> 
                    <input type="hidden" name="branchId" id="branchId" class="uinp" />
					<input type="text" name="branchName" id="branchName"class="uinp ub ub-f1" readonly="readonly"  />
					<div class="uinp-more" onclick="searchBranch()">...</div>
	           </div>
               <div class="ub ub-ac umar-l40 uw-300 ">
                   <div class="umar-r10 uw-70 ut-r">制单人员:</div>
                   <div class="utxt"><%=UserUtil.getCurrentUser().getUserName() %></div>
               </div>
               <div class="ub ub-ac umar-l10">
                   <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                   <div class="utxt" id="createTime"></div>
               </div>
           </div>
           <div class="ub umar-t8">
                <div class="ub ub-ac uselectw umar-l00">
                    <div class="umar-r10 uw-70 ut-r">调整原因:</div>
                       <!--select-->
                        <select class="easyui-combobox uselect" name="adjustReason" id="adjustReason" data-options="editable:false">
                                <!-- <option value="1">全部</option> 
                                <option value="2">[01]其他</option> 
                                <option value="3">[02]领用</option> 
                                <option value="4">[03]报损</option> 
                                <option value="5">[04]丢失</option> 
                                <option value="6">[05]赠送</option>
                                <option value="7">[06]借用</option>
                                <option value="8">[07]退赠品</option> -->
                            <c:forEach items="${COST_ADJUST_REASON}" var="reason">
                            <option value="${reason.value}">${reason.label}</option>
                        </c:forEach>
                                
                        </select>
                </div>
               <div class="ub ub-ac umar-l40 uw-300">
                   <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                   <div class="utxt"></div>
               </div>
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-70 ut-r">审核时间:</div>
                   <div class="utxt"></div>
               </div>
           </div>
           <div class="ub umar-t8">
               <div class="ub ub-ac" >
                   <div class="umar-r10 uw-70 ut-r">备注:</div>
                   <input class="uinp" type="text" id="remark" name="remark">
               </div>
               <div class="ub ub-ac umar-l40 uw-300" id="ckboxPric">
                   <div class="umar-r10 uw-70 ut-r">调价设置:</div>
                   <label><input class="priceItem" type="checkbox" name="isUpCostPrice" id="isUpCostPrice" checked="checked"/><span>成本价</span></label>
                   <label><input class="priceItem" type="checkbox" name="isUpUntaxedCostPrice" id="isUpUntaxedCostPrice" checked="checked"/><span>不含税成本价</span></label>
               </div>
           </div>
          	</form>
           <!--datagrid-edit-->
        <from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
                   <table id="gridEditOrder" ></table>
        </from>
    </div>
</body>
</html>