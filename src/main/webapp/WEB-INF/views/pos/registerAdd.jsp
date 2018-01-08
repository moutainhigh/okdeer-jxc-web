<!--pos新增-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<script src="${ctx}/static/js/views/pos/registerAdd.js?V=${versionNo}"></script>
<div class="ub ub-ver ub-pc ub-ac uw uh ub-f1" >
	  <form id="registerAddForm" >
	   <div class="ub ub-ver uw uh ub-f1">
            <!-- 新增弹框 -->
            <div class="ub umar-t8">
	             <div class="ub ub-ac umar-t20">
                 <div class="umar-r10 uw-80 ut-r">店铺:</div>
	             <input class="uinp ub ub-f1" type="hidden" id="regBranchId">
                 <input class="uinp ub ub-f1 easyui-validatebox" data-options="required:true"  type="text" id="branchName"  autocomplete="off" placeholder="请选择" onclick="toSearchBranchHandel()" name="branchName">
                 <div class="uinp-more" onclick="searchBranch()">...</div>
                </div>
             </div>
            <div class="ub umar-t8">
	             <div class="ub ub-ac umar-t20">
	              <div class="umar-r10 uw-80 ut-r">POS机编号:</div>
<!-- 
	             <input class="uinp deal easyui-validatebox" data-options="required:true" 
	             
	              onkeyup="value=value.replace(/[^0-9.]/g,'')" 

	             onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
	             type="number" maxlength="2"  oninput="if(value.length>2)value=value.slice(0,2)"  id="posNo" name="posNo" > -->
	             <input id="posNo" class="uinp deal easyui-validatebox" data-options="required:true" name="posNo"  type="text" onkeyup="var v=this.value||'';v=v.replace(/[^\d]/g,'');this.value=v.substr(0,2);"
	             onchange="var v=this.value||'';v=v.replace(/[^\d]/g,'');this.value=v.substr(0,2);">
                </div>
             </div>
            <div class="uabtns umar-t20">
                <div class="uabtn umar-r30 umar-l50" onclick="toSaveAddData()">保存</div>
                <div class="uabtn" onclick="toClose()" >关闭</div>
            </div>
        </div>
	  </form>
       
</div>