<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>门店计划</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<script src="${ctx}/static/js/views/report/target/storePlan/storePlanList.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	                <div class="ubtns-item" onclick="addPlan()">新增计划</div>
	              	<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	           	<!-- 引入时间选择控件 -->
	           <div class="umar-l30  ut-r">月份:</div>
	           <div class="ub ub-ac umar-l20 umar-r20 ">
	              	<input class="Wdate"  readonly="readonly" name="startTime" id="startTime" onfocus="WdatePicker({maxDate:'#F{$dp.$D(\'endTime\');}',dateFmt:'yyyy-MM',readOnly:true})" onclick="selectMonth()"  />
	           </div>至
	           <div class="ub ub-ac umar-l20">
	              	<input class="Wdate"  readonly="readonly" name="endTime" id="endTime" onfocus="WdatePicker({minDate:'#F{$dp.$D(\'startTime\');}',dateFmt:'yyyy-MM',readOnly:true})" onclick="selectMonth()"  />
	           </div>
            </div>
	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
                <div class="ub ub-ac" id="branchSelect">
                   <div class="umar-r10 uw-80 ut-r">机构:</div>
                   <input type="hidden" id="branchId" name="branchId">
                   <input class="uinp " style="width:262px;" type="text" id="branchName"  name="branchName">
                   <div class="uinp-more">...</div>
                </div>
                <div class="ub  ub-ac" style="margin-left:160px;">
                	<input type="checkbox" name="zeroData" id="zeroData"  class="" >
                    <label for="zeroData">显示计划为0的数据</label>
                </div>
            </div>
            <div class="ub umar-t8">
                <div class="ub  ub-ac">
                   <div class="umar-r10 uw-80 ut-r">月目标销额:</div>
                   <select class="uinp  easyui-combobox uw-110"  name="monthAmountType" data-options="editable:false,panelHeight:120,">
                   	   <option value="3"> &lt; </option>
                   	   <option value="1"> &gt; </option>
                   	   <option value="2"> &lt;= </option>
                   	   <option value="4"> &gt;= </option>
                   	   <option value="0"> = </option>
                   </select>
                   <input class="uinp easyui-numberbox uw-152" name="monthAmount" type="text" >
                </div>
                <div class="ub  ub-ac umar-l70">
                   <div class="umar-r10 uw-80 ut-r">总完成率:</div>
                   <select class="uinp easyui-combobox uw-110" name="countAmountType" data-options="editable:false,panelHeight:120,">
                   	   <option value="3"> &lt; </option>
                   	   <option value="1"> &gt; </option>
                   	   <option value="2"> &lt;= </option>
                   	   <option value="4"> &gt;= </option>
                   	   <option value="0"> = </option>
                   </select>
                   <input class="uinp easyui-numberbox uw-152" name="countAmount" type="text" >%
                </div>
            </div>
            <div class="ub umar-t8">
                <div class="ub ub-ac ">
                   <div class="umar-r10 uw-80 ut-r">其他销额:</div>
                   <select class="uinp easyui-combobox uw-110" name="target" data-options="editable:false,panelHeight:120,">
                   	   <option value="1"> 线下目标销额 </option>
                   	   <option value="2"> 线上目标销额 </option>
                   </select>
                   <select class="uinp easyui-combobox uw-50" name="otherAmountType" data-options="editable:false,panelHeight:120,">
                   	   <option value="3"> &lt; </option>
                   	   <option value="1"> &gt; </option>
                   	   <option value="2"> &lt;= </option>
                   	   <option value="4"> &gt;= </option>
                   	   <option value="0"> = </option>
                   </select>
                   <input class="uinp easyui-numberbox uw-100"  name="otherAmount" type="text" >
                </div>
                <div class="ub  ub-ac umar-l70">
                   <div class="umar-r10 uw-80 ut-r">其他完成率:</div>
                    <select class="uinp easyui-combobox uw-110"  name="targetRate" data-options="editable:false,panelHeight:120,">
                   	   <option value="1"> 线下完成率 </option>
                   	   <option value="2"> 线上完成率 </option>
                   </select>
                   <select class="uinp easyui-combobox uw-50" name="otherAmountType" data-options="editable:false,panelHeight:120,">
                   	   <option value="3"> &lt; </option>
                   	   <option value="1"> &gt; </option>
                   	   <option value="2"> &lt;= </option>
                   	   <option value="4"> &gt;= </option>
                   	   <option value="0"> = </option>
                   </select>
                   <input class="uinp easyui-numberbox uw-100" name="otherAmount" type="text" >%
                </div>
            </div>
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="storePlanList"></table>
		</div>
    </div>

</body>
</html>