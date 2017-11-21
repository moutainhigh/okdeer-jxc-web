<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<script src="${ctx}/static/js/views/component/publicBranchGroup.js"></script>	

<div class="ub ub-ver ub-pc ub-ac uw uh ub-f1" >
     <div class="ub uw uh ub-f1">
         <div class="ub ub-ver  uw uh ub-f1">
             <form action="" id="formBranchGroup">
                 <div class="ub ub-ac upad-10 ">
                     <div class="ub ub-ac uw" id="domInner">
                        <div class="umar-r10">关键字:</div>
                        <input name="nameOrCode" id="nameOrCode" class="usearch uinp ub ub-f1" type="text" />
                        <div class="ubtn umar-l20 umar-r10"  onclick="agencySearch()">查询</div>
                        <div class="ub ub-ac ">
                           <!--   <input class="ub" type="checkbox" name="hideAgency" checked="checked"/><span>不显示仓库</span> -->
                        </div>
                     </div>
                 </div>

                <div class="ub ub-ac upad-10 ">

                <div class="ub ub-ac">
    <div class="umar-r10">机构状态:</div>
                <label class="ub ub-ac umar-r40">
                <input type="radio" class="ub ub-ac" name="offlineStatus" value="1" checked="checked"> <span>运营中</span>
                </label>
                <label class="ub ub-ac umar-r40">
                <input type="radio" class="ub ub-ac" name="offlineStatus" value="0"> <span>已关闭</span>
                </label >
                <label class="ub ub-ac umar-r40">
                <input type="radio" class="ub ub-ac" name="offlineStatus" value=""> <span>所有</span>
                </label>
                </div>
                </div>

                 <div class="ub ub-ac upad-10 ">

                 	<div class="ub ub-ac">
                    <div class="umar-r10">机构类型:</div>
                 		<label class="ub ub-ac umar-r40">
                 			<input type="radio" class="ub ub-ac" name="groupType" value="0" checked="checked"> <span>所有</span>
                 		</label>
                 		<label class="ub ub-ac umar-r40">
                 			<input type="radio" class="ub ub-ac" name="groupType" value="1"  > <span>机构组合</span>
                 		</label >
                 		<label class="ub ub-ac umar-r40">
                 			<input type="radio" class="ub ub-ac" name="groupType" value="2"> <span>直营店</span>
                 		</label>
                 		<label class="ub ub-ac umar-r40">
                 			<input type="radio" class="ub ub-ac" name="groupType" value="3"> <span>加盟店</span>
                 		</label>
                 		<label class="ub ub-ac umar-r40">
                 			<input type="radio" class="ub ub-ac" name="groupType" value="4"> <span>合作店</span>
                 		</label>
                 	</div>
                 </div>
             </form>
             <div class="ub uw uh ub-f1">
                 <table id="gridBranchGroupList" style="width: 100%;"></table>
             </div>
         </div>
     </div>
  
</div>

