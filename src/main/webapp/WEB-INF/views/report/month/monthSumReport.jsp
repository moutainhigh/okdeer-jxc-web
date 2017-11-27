<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>月进销存报表</title>
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
	<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
	<script src="${ctx}/static/js/views/report/month/monthSumReport.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="queryForm()">查询</div>
	                <div class="ubtns-item" onclick="toGpeExport()">导出</div>
	                <div class="ubtns-item" onclick="toGpeSetting()">设置</div>
	                <input type="hidden" id="startCount" name="startCount" />
					<input type="hidden" id="endCount" name="endCount" />
	                <div class="ubtns-item" id="set" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">关闭</div>
	            </div>
	            <div class="ub ub-ac umar-l20">
					<div class="umar-r10 uw-70 ut-r">分析月份:</div>
			   		<input class="Wdate"  readonly="readonly" name="sumDate" id="txtStartDate" onfocus="updateWdatePicker(0)" value='<c:out value="${startTime }"></c:out>'/>
				</div>
			</div>
			<div class="ub uline umar-t8"></div>
			<div class="ub umar-t8">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">机构名称:</div>
					<input type="hidden" id="createBranchId" name="branchId" value='<c:out value="${branchId }"></c:out>'/>
					<input class="uinp ub ub-f1" type="text" id="branchName" name="branchName" readonly="readonly" maxlength="50" value='<c:out value="${branchName }"></c:out>'/>
					<div class="uinp-more" onclick="selectBranches()" >...</div>
				</div>
				<div class="ub ub-ac umar-l40">
					<div class="umar-r10 uw-70 ut-r">商品类别:</div>
					<input class="uinp ub ub-f1" type="hidden" name="categoryCode" id="categoryCode" />
					<input class="uinp ub ub-f1" type="text" name="categoryNameCode" id="categoryNameCode" readonly="readonly" />
					<div class="uinp-more" onClick="searchCategory()">...</div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-70 ut-r">商品名称:</div>
					<input class="uinp" type="text" name="skuName" id="skuName"/>
				</div>
				<div class="ub ub-ac uw-300 umar-l20">
					<div class="umar-r10 uw-70 ut-r">条码/货号:</div>
					<input class="uinp" type="text" name="skuCodeOrBarCode" id="skuCodeOrBarCode"/>
				</div>
			</div>
	    </form>
	    <div class="ub ub-f1  umar-t8 umar-b8">
			<table id="yueJXCList"></table>
		</div>
	</div>
</body>
</html>