<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>单品ABC销售量分析</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/goods/goodsSaleNumReport.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            <shiro:hasPermission name="goodsSaleNumReport:search">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	            </shiro:hasPermission>
	            <shiro:hasPermission name="goodsSaleNumReport:export">
	                <div class="ubtns-item" onclick="exportData()">导出</div>
	            </shiro:hasPermission>
	              	<div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	            
	           	<!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
            </div>

	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
                	<!-- <div class="ub ub-ac uw-300 ">
	                    <div class="umar-r10 uw-70 ut-r">机构名称:</div>
	                    <input type="hidden" id="branchId" name="branchId" />
	                    <input class="uinp ub ub-f1" type="text" id="branchName" name="branchName" onclick="selectBranches()" readonly="readonly" />
	                    <div class="uinp-more" onclick="selectBranches()" >...</div>
	                </div> -->
		            <div class="ub ub-ac umar-r50" id="branchSelects">
				        <div class="umar-r10 uw-70 ut-r">机构名称:</div>
				        <input class="uinp" type="hidden" id="branchId" name="branchId">
				        <input class="uinp" type="text" id="branchName" name="branchName" >
				        <input class="uinp" type="hidden" id="branchCompleCode" name="branchCompleCode">
				        <div class="uinp-more">...</div>
				    </div>
	                   <div class="ub ub-ac umar-l40 uw-300">
	                    <div class="umar-r10 uw-70 ut-r">ABC等级:</div>
	                    <div class="ub ub-ac umar-r10">
							<label>
							<input type="radio" name="grade"  value="0" checked="checked"/><span>全部</span>
							</label>

	                    </div>
	                    <div class="ub ub-ac umar-r10">
							<label>
							<input type="radio" name="grade" value="1" /><span>A(0~75%)</span>
							</label>

	                    </div>
	                    <div class="ub ub-ac umar-r10">
							<label>
							<input  type="radio" name="grade" value="2"  /><span>B(75%~95%)</span>
							</label>

	                    </div>
	                    <div class="ub ub-ac umar-r10">
							<label>
							<input type="radio" name="grade" value="3"  /><span>C(95%~100%)</span>
							</label>

	                    </div>
	                </div>
            </div>
	
       	</form>
           
      
      <div class="ub ub-f1 umar-t20">
			 <table id="goodsSaleNumReport"></table>
		</div>
    </div>

</body>
</html>