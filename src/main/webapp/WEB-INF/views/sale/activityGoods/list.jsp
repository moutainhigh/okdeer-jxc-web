<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>促销活动明细查询</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
<script src="${ctx}/static/js/views/sale/activityGoods/list.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">
<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	                <div class="ubtns-item" onclick="purchaseTotalCx()">查询</div>
	                <input type="hidden" id="startCount" name="startCount" />
					<input type="hidden" id="endCount" name="endCount" />
	                <div class="ubtns-item" onclick="exportData()">导出</div>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	             <!-- 引入时间选择控件 -->
	           <div class="ub ub-ac">
	       			<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
	           </div>
            </div>
	        <div class="ub uline umar-t8"></div>
	        <div class="ub umar-t8">
			    <div class="ub ub-ac umar-l4" id="branchSelectCom">
			        <div class="umar-r10 ut-r">机构:</div>
			        <input class="uinp" type="hidden" id="branchId" name="branchId">
			        <input class="uinp" type="hidden" id="branchCompleCode" name="branchCompleCode">
			        <input class="uinp" type="text" id="branchName" name="branchName" readonly="readonly" >
			        <div class="uinp-more" id="branchSelect" >...</div>
			    </div>
			    <div class="ub ub-ac umar-l30">
			        <div class="umar-r10 uw-80 ut-r">活动编码:</div>
			        <input type="text" name="activityCode" id="activityCode" class="uinp" />
			    </div>
			    
			    <div id="categoryNameDiv" class="ub ub-ac">
			        <div class="umar-r10 uw-84 ut-r">类别:</div>
			        <input type="hidden" name="categoryCode" id="categoryCode" class="uinp" />
			        <!-- readonly="readonly" -->
			        <input type="text" name="categoryName" id="categoryName" class="uinp" disabled="disabled"  maxlength="50" onclick="searchCategory()" />
			        <div class="uinp-more" id="categorySelect" onclick="searchCategory()">...</div>
			    </div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-l4">
			        <div class="umar-r10 ut-r">货号:</div>
			        <input type="text" name="codeKeyWord" id="codeKeyWord" class="uinp" placeholder="输入货号、条码查询" />
			    </div>
			    <div class="ub ub-ac umar-l30 ">
			        <div class="umar-r10 uw-80 ut-r">商品名称:</div>
			        <input type="text" name="skuName" id="skuName" class="uinp" />
			    </div>
			    <div class="ub ub-ac umar-l4 ">
			        <div class="umar-r10 uw-80 ut-r">活动状态:</div>
				    <select class="uselect easyui-combobox umar-l30" name="activityStatus" id="activityStatus" data-options="editable:false" >
						  <option value="1">进行中</option>
						  <!-- <option value="1">已审核</option> -->
						  <option value="2">已结束</option>
						  <option value="">全部</option>
					</select>
			    </div>
			    <div class="ub ub-ac umar-l30 uh">
					<div class="umar-r10 uw-60 ut-r">促销类型:</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="queryType" id="cx_status_1" value="goods" checked="checked"><label for="cx_status_1">商品促销 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="queryType" id="cx_status_2" value="category"><label for="cx_status_2">类别促销 </label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="radioItem" type="radio" name="queryType" id="cx_status_3" value="fullReduction"><label for="cx_status_3">满减促销</label>
					</div>
					<div class="ub ub-ac umar-r10 uh-28">
						<input class="radioItem" type="radio" name="queryType" id="cx_status_4" value="fullGive"><label for="cx_status_4">买满送</label>
						<select class="uselect easyui-combobox" style="width:120px;" name="fullGiveScope" id="fullGiveType" data-options="editable:false,onChange:onChangeSelect">
							<option value="0">商品买满送</option>
							<option value="1">类别买满送</option>
							<option value="2">全场买满送</option>
						</select>
					</div>
				</div>
			</div>
       	</form>
        <div class="ub ub-f1 umar-t20">
			 <table id="activityCXList"></table>
		</div>
    </div>
</body>
</html>