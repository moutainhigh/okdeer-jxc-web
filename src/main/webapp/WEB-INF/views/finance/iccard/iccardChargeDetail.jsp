<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>一卡通充值提现查询</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/finance/iccard/iccardChargeDetail.js?V=${versionNo}"></script>
<style>
.datagrid-header-row .datagrid-cell{text-align: center!important;}
</style>
</head>
<body class="ub uw uh ufs-14 uc-black">

    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            <shiro:hasPermission name="JxcCashFlow:search">
	                <div class="ubtns-item" onclick="query()">查询</div>
	            </shiro:hasPermission>
	            <shiro:hasPermission name="JxcCashFlow:print">
	                <div class="ubtns-item" onclick="printReport()">打印</div>
	            </shiro:hasPermission>
	            <shiro:hasPermission name="JxcCashFlow:export">
	                <div class="ubtns-item" onclick="toGpeExport()">导出</div>
	            </shiro:hasPermission>
	            	<!-- <div class="ubtns-item" onclick="toGpeSetting()">设置</div> -->
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	            
	           	<!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
            </div>
	  
	        <div class="ub uline umar-t8"></div>
	        
	          <div class="ub umar-t8">
                <div class="ub ub-ac" id="branchComponent">
                   <div class="umar-r10 uw-70 ut-r">店铺:</div>
	                    <input class="uinp" type="hidden" id="branchCompleCode" name="branchCompleCode">
                        <input class="uinp ub ub-f1" type="text" id="branchNameOrCode" name="branchNameOrCode">
                   <div class="uinp-more">...</div>
                </div>
                <div class="ub ub-ac uselectw  umar-l20">
                   <div class="umar-r10 uw-70 ut-r">店铺类型:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect" name="branchType" id="branchType" data-options="editable:false">
				            <option value="" selected="selected">全部</option>
				            <option value="3">直营店</option>
				            <option value="4">加盟店</option>
				        </select>
                </div>  
            </div>
	        <div class="ub umar-t8">
                <div class="ub ub-ac uselectw">
                   <div class="umar-r10 uw-70 ut-r">业务类型:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect" name="io" id="businessType" data-options="editable:false">
				            <option value="" selected="selected">全部</option>
				             <option value="0">充值</option>
				            <option value="1">提取</option>
				        </select>
                </div> 
                <div class="ub ub-ac uselectw umar-l20">
                    <div class="umar-r10 uw-70 ut-r">付款方式:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect uw-300" name="payType" id="payType" data-options="editable:false">
				            <option value="" selected="selected">全部</option>
				            <option value="YHZZ">银行转账</option>
				            <option value="WXZZ">微信转账</option>
				            <option value="ZFBZZ">支付宝转账</option>
				            <option value="XJZZ">现金</option>
				            <option value="QTZZ">其他</option>
				        </select>
                </div>  
            </div>
       	</form>
       	
        <div class="ub ub-f1 umar-t20">
			 <table id="icCardCharge"></table>
		</div>
    </div>

</body>

</html>