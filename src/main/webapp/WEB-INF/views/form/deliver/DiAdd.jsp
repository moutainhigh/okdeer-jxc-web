<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>入库单-新增</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/deliver/DiAdd.js?V=${versionNo}"></script>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
                <shiro:hasPermission name="JxcDeliverDI:add">
                	<div class="ubtns-item" onclick="saveOrder()">保存</div>
                </shiro:hasPermission>
                <div class="ubtns-item-disabled">商品选择</div>
                <div class="ubtns-item-disabled">导入货号</div>
                <div class="ubtns-item-disabled">导入条码</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
           <div class="ub">
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-70 ut-r">收货机构:</div>
                   <div class="ub">
                       <input type="hidden" id="targetBranchId" name="targetBranchId" value="${user.branchId}"  />
                       <input class="uinp ub ub-f1" type="text" id="targetBranchName" name="targetBranchName" value="${user.branchName}" readonly="readonly" />
                       <div class="uinp-more"></div>
                   </div>

               </div>
				<div class="ub ub-ac uw-350">
                   <div class="umar-r10 uw-70 ut-r">原单类型:</div>
                   <div class="ub">
                       <input type="radio" name="refFormType" id="typeDO" disabled="disabled"/><label for="typeDO">配送出库单</label>
                       <input type="radio" name="refFormType" id="typeDD" disabled="disabled"/><label for="typeDD">店间配送单</label>
                       <input type="radio" name="refFormType" id="typeDR" disabled="disabled"/><label for="typeDR">退货申请单</label>
                   </div>
               </div>
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-70 ut-r">制单人员:</div>
                   <div class="utxt"><%=UserUtil.getCurrentUser().getUserName() %></div>
               </div>
               <div class="ub ub-ac umar-l20">
                   <div class="umar-r10 uw-60 ut-r">制单时间:</div>
                   <div class="utxt" id="createTime"></div>
               </div>
           </div>
           <div class="ub umar-t8">
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-70 ut-r">发货机构:</div>
                   <div class="ub">
                       <input type="hidden" id="sourceBranchId" name="sourceBranchId" />
                       <input class="uinp ub ub-f1" type="text" id="sourceBranchName" name="sourceBranchName" readonly="readonly" />
                       <div class="uinp-more"></div>
                   </div>

               </div>
                <div class="ub ub-ac uw-350">
                   <div class="umar-r10 uw-70 ut-r">配送单号:</div>
                   <div class="ub">
                       <input type="hidden" id="referenceId" name="referenceId" value="${referenceId}"/>
                       <input class="uinp ub ub-f1" type="text" id="referenceNo" name="referenceNo" onclick="selectDeliver()" readonly="readonly"/>
                       <div class="uinp-more" onclick="selectDeliver()">...</div>
                   </div> 
                   <i class="uc-red">*</i>
                 </div>  
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                   <div class="utxt"></div>
               </div>
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-80 ut-r">审核时间:</div>
                   <div class="utxt"></div>
               </div>
           </div>
           <div class="ub umar-t8">
              <div class="ub ub-ac uw-582">
                   <div class="umar-r10 uw-70 ut-r">备注:</div>
                   <input class="uinp ub ub-f1" type="text" id="remark" name="remark">
               </div>
           </div>
           <!--datagrid-edit-->
        <from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
                   <table id="gridEditOrder" ></table>
        </from>
    </div>

</body>
</html>