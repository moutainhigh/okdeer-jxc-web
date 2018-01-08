<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>调价订单-新增</title>

    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <script src="${ctx}/static/js/views/overdue/overdueAdd.js?V=${versionNo}1"></script>
 <style type="text/css">
    	.uw-60 {
		    width: 76px;
		}
    </style>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
<div class="ub ub-ver ub-f1 umar-4  ubor">
    <div class="ub ub-ac upad-4">
        <div class="ubtns">
        <shiro:hasPermission name="JxcPurchaseOrder:add">
            <div class="ubtns-item" onclick="saveItemHandel()">保存</div>
        </shiro:hasPermission>
            <div class="ubtns-item" onclick="selectGoods()">商品选择</div>
            <div class="ubtns-item" onclick="toImportproduct(0)">导入货号</div>
            <div class="ubtns-item" onclick="toImportproduct(1)">导入条码</div>
            <div class="ubtns-item-disabled" onclick="javaScript:;">导出</div>
            <div class="ubtns-item" onclick="toClose()">关闭</div>
        </div>
    </div>
    <form id="formAdd">
        <div class="ub ub-ver ">
        	<div class="ub umar-t8 uc-black">【单号】:<span ><c:out value="${formNo}"></c:out></span></div>
	        <div class="ub uline umar-t8"></div>
	        <input type="hidden" id="formNo" value='<c:out value="${formNo}"></c:out>'>
	        <input type="hidden" id="createUserId" value='<%=UserUtil.getCurrentUser().getId() %>'>
	        <input type="hidden" id="createUserName" value='<%=UserUtil.getCurrentUser().getUserName() %>'>
	        <div class="ub umar-t8">
	           <div class="ub ub-ac">
	                <div class="umar-r10 uw-60 ut-r">申请机构:</div>
	                <input class="uinp" name="branchId" id="branchId" type="hidden" value=''>
	                <input class="uinp" id="branchName" name="branchName" type="text" maxlength="50" value="" >
	                <div class="uinp-more" onclick="searchBranch()" style="position: inherit;margin-left: -20px;">...</div>
	            </div>
	            <i class="ub ub-ac uc-red">*</i>
	            <div class="ub uw-400"></div>
	            <div class="ub ub-ac umar-l12">
	                <div class="umar-r10 uw-60 ut-r">制单人员:</div>
	                <div class="utxt"><%=UserUtil.getCurrentUser().getUserName() %></div>
	            </div>
	            <div class="ub ub-ac umar-l80">
	                <div class="umar-r10 uw-60 ut-r">制单时间:</div>
	                <div class="utxt" id="createTime"></div>
	            </div>
	        </div>
        <div class="ub umar-t8">
               <div class="ub ub-ac uw-610 umar-r80" style="width: 624px;">
	           </div>
	           <div class="ub ub-ac umar-r80">
                <div class="umar-r10 uw-60 ut-r">最后修改人:</div>
                <div class="utxt"><c:out value="${form.updateUserName}"></c:out></div>
            </div>
            <div class="ub ub-ac">
                <div class="umar-r10 uw-60 ut-r">修改时间:</div>
                <div class="utxt" ><fmt:formatDate value="${form.updateTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
        </div>
         <div class="ub umar-t8">
               <div class="ub ub-ac uw-610 umar-r80" style="width: 624px;">
	                    <div class="umar-r10 uw-60 ut-r">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</div>
	                    <input class="uinp ub ub-f1 easyui-validatebox" name="remark" id="remark" type="text"
                            maxlength="100" value="${form.remark}" >
	           			<i class="uc-red">*</i>	
	           </div>
	           <div class="ub ub-ac umar-r80">
                <div class="umar-r10 uw-60 ut-r">审核人员:</div>
                <div class="utxt"><c:out value="${form.validUserName}"></c:out></div>
            </div>
            <div class="ub ub-ac">
                <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div>
            </div>
        </div>
        </div>
    </form>
    <div class="ub uw umar-t8 ub-f1">
        <table id="overdueEditGrid" ></table>
    </div>

</div>

</body>
</html>