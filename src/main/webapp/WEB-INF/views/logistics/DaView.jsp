<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>物流销售单明细</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/logistics/DaView.js?V=${versionNo}"></script>
    <%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
            	<input type="hidden" id="close" value="${close}"/>
				<shiro:hasPermission name="JxcDeliverDaLogistic:exportDetail">
					<div class="ubtns-item" onclick="exportListData()">导出明细</div>
				</shiro:hasPermission>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
        <div class="ub umar-t8 uc-black">【单号】:${form.formNo}</div>
        <div class="ub uline umar-t8"></div>
        <input type="hidden" id="formId" value="${form.deliverFormId}">
        <input type="hidden" id="formNo" value="${form.formNo}">
        <input type="hidden" id="type" value="${type}">
         <div class="already-examine" id="already-examine"><span>${status}</span></div>
        <div class="ub umar-t8">
        	<div class="ub  ub-ver">
        		<div class="ub umar-b12">
	        		<div class="ub ub-ac uw-300">
		                <div class="umar-r10 uw-60 ut-r">要货机构:</div>
		                <div class="ub">
		                    <input class="uinp" name="targetBranchId" id="targetBranchId" type="hidden" value="${form.targetBranchId}">
		                    <input class="uinp" id="targetBranchName" name="targetBranchName" type="text" readonly="readonly" value="${form.targetBranchName}" />
		                    <div class="uinp-more"></div>
		                </div>
		            </div>
		            <div class="ub ub-ac uw-300 umar-l20">
		                <div class="umar-r10 uw-60 ut-r">业务人员:</div>
		                <div class="ub">
		                    <input class="uinp ub ub-f1" type="text" id="salesman" name="salesman" value="${salesman}" readonly="readonly">
		                    <div class="uinp-more"></div>
		                </div>
		            </div>
        		</div>
        		<div class="ub umar-b12">
        			<div class="ub ub-ac uw-300 ">
		                <div class="umar-r10 uw-60 ut-r">发货机构:</div>
		                <div class="ub">
		                    <input class="uinp" name="sourceBranchId" id="sourceBranchId" type="hidden" value="${form.sourceBranchId}">
		                    <input class="uinp" id="sourceBranchName" name="sourceBranchName" type="text" readonly="readonly" onclick="selectBranchSend()" value="${form.sourceBranchName}">
		                    <div class="uinp-more" onclick="selectBranchSend()">...</div>
		                </div>
		            </div>
		            <div class="ub ub-ac uw-300 umar-l20">
		                <div class="umar-r10 uw-60 ut-r">有效期限:</div>
		                <input id="validityTime" class="Wdate" type="text" value="<fmt:formatDate value="${form.validityTime}" pattern="yyyy-MM-dd"/>" readonly="readonly"/>
		            </div>
        		</div>
        		<div class="ub">
        			<div class="ub ub-ac uw-592">
		                <div class="umar-r10 uw-60 ut-r">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</div>
		                <input class="uinp ub ub-f1 " type="text" id="remark" name="remark" value="${form.remark}" readonly="readonly" />
		            </div>
        		</div>
        		
        	</div>
        	<div class="ub ub-f1 ub-ver">
        		<div class="ub">
        			<div class="ub ub-ac umar-l20">
		                <div class="umar-r10 uw-60 ut-r">制单人员:</div>
		                <div class="utxt">${form.createUserName}</div>
		            </div>
		            <div class="ub ub-ac umar-l20">
		                <div class="umar-r10 uw-60 ut-r">制单时间:</div>
		                <div class="utxt" id="createTime"><fmt:formatDate value="${form.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
		            </div>
        		</div>
        		<div class="ub">
        			<div class="ub ub-ac umar-l1">
		                <div class="umar-r10 uw-80 ut-r">最后修改人:</div>
		                <div class="utxt">${form.updateUserName}</div>
		            </div>
		            <div class="ub ub-ac umar-l20">
		                <div class="umar-r10 uw-60 ut-r">修改时间:</div>
		                <div class="utxt"><fmt:formatDate value="${form.updateTime}" pattern="yyyy-MM-dd HH:mm"/></div>
		            </div>
        		</div>
        		<div class="ub">
	        		<div class="ub ub-ac umar-l12">
		               <div class="umar-r10 uw-70 ut-r">审核人员:</div>
		               <div class="utxt">${form.validUserName}</div>
		           </div>
		           <div class="ub ub-ac umar-l12">
		               <div class="umar-r10 uw-70 ut-r">审核时间:</div>
		               <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div>
		           </div>
        		</div>
        		<div class="ub">
	        		<div class="ub ub-ac umar-l12">
		               <div class="umar-r10 uw-70 ut-r">终止人员:</div>
		               <div class="utxt">${form.stopUserId=='-1' ?'系统终止':form.stopUserName}</div>
		           </div>
		           <div class="ub ub-ac umar-l12">
		               <div class="umar-r10 uw-70 ut-r">终止时间:</div>
		               <div class="utxt"><fmt:formatDate value="${form.stopTime}" pattern="yyyy-MM-dd HH:mm"/></div>
		           </div>
        		</div>
        		
        	</div>
        </div>
<!--         <div class="ub umar-t8"> -->
<!--             <div class="ub ub-ac uw-300"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">要货机构:</div> -->
<!--                 <div class="ub"> -->
<%--                     <input class="uinp" name="targetBranchId" id="targetBranchId" type="hidden" value="${form.targetBranchId}"> --%>
<%--                     <input class="uinp" id="targetBranchName" name="targetBranchName" type="text" readonly="readonly" value="${form.targetBranchName}" /> --%>
<!--                     <div class="uinp-more"></div> -->
<!--                 </div> -->
<!--             </div> -->
<!--             <div class="ub ub-ac uw-300 umar-l20"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">业务人员:</div> -->
<!--                 <div class="ub"> -->
<%--                     <input class="uinp ub ub-f1" type="text" id="salesman" name="salesman" value="${salesman}" readonly="readonly"> --%>
<!--                     <div class="uinp-more"></div> -->
<!--                 </div> -->
<!--             </div> -->
<!--             <div class="ub ub-ac umar-l20"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">制单人员:</div> -->
<%--                 <div class="utxt">${form.createUserName}</div> --%>
<!--             </div> -->
<!--             <div class="ub ub-ac umar-l20"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">制单时间:</div> -->
<%--                 <div class="utxt" id="createTime"><fmt:formatDate value="${form.createTime}" pattern="yyyy-MM-dd HH:mm"/></div> --%>
<!--             </div> -->
<!--         </div> -->
<!--         <div class="ub umar-t8"> -->

<!--             <div class="ub ub-ac uw-300 "> -->
<!--                 <div class="umar-r10 uw-60 ut-r">发货机构:</div> -->
<!--                 <div class="ub"> -->
<%--                     <input class="uinp" name="sourceBranchId" id="sourceBranchId" type="hidden" value="${form.sourceBranchId}"> --%>
<%--                     <input class="uinp" id="sourceBranchName" name="sourceBranchName" type="text" readonly="readonly" onclick="selectBranchSend()" value="${form.sourceBranchName}"> --%>
<!--                     <div class="uinp-more" onclick="selectBranchSend()">...</div> -->
<!--                 </div> -->
<!--             </div> -->
<!--             <div class="ub ub-ac uw-300 umar-l20"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">有效期限:</div> -->
<%--                 <input id="validityTime" class="Wdate" type="text" value="<fmt:formatDate value="${form.validityTime}" pattern="yyyy-MM-dd"/>" readonly="readonly"/> --%>
<!--             </div> -->
<!--             <div class="ub ub-ac umar-l1"> -->
<!--                 <div class="umar-r10 uw-80 ut-r">最后修改人:</div> -->
<!--                 <div class="utxt"></div> -->
<!--             </div> -->
           
<!--             <div class="ub ub-ac umar-l20"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">修改时间:</div> -->
<!--                 <div class="utxt"></div> -->
<!--             </div> -->
            
<!--         </div> -->
<!--         <div class="ub umar-t8"> -->
<!--         	<div class="ub ub-ac uw-300"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</div> -->
<%--                 <input class="uinp ub " type="text" id="remark" name="remark" value="${form.remark}" readonly="readonly" /> --%>
<!--             </div> -->
<!--             <div class="ub ub-ac umar-l20"> -->
<!--                 <div class="umar-r10 uw-60 ut-r">数量处理:</div> -->
<!--                 <div class="ub ub-ac umar-r10"> -->
<!--                     <input class="radioItem" type="radio" name="numDeal" id="status_1" value="0"><label for="status_1">设置为建议订货数量 </label> -->
<!--                 </div> -->
<!--                 <div class="ub ub-ac umar-r10"> -->
<!--                     <input class="radioItem" type="radio" name="numDeal" id="status_2" value="1"><label for="status_2">重新归零 </label> -->
<!--                 </div> -->
<!--            </div> -->
	           
<!--            <div class="ub ub-ac umar-l12"> -->
<!--                <div class="umar-r10 uw-70 ut-r">审核人员:</div> -->
<%--                <div class="utxt">${form.validUserName}</div> --%>
<!--            </div> -->
<!--            <div class="ub ub-ac umar-l20"> -->
<!--                <div class="umar-r10 uw-88 ut-r">审核时间:</div> -->
<%--                <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div> --%>
<!--            </div> -->
           
<!--         </div> -->
        <div class="ub ub-f1 datagrid-edit umar-t8">
            <table id="gridViewRequireOrder" ></table>
        </div>
    </div>
	
</body>
</html>