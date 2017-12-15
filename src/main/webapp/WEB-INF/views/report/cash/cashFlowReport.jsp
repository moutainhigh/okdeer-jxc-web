<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>收银流水</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/report/cash/cashFlowReport.js?V=${versionNo}"></script>
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
	            	<div class="ubtns-item" onclick="toGpeSetting()">设置</div>
	                <div class="ubtns-item" onclick="gFunRefresh()">重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	            
	           	<!-- 引入时间选择控件 -->
	            <%@ include file="/WEB-INF/views/component/dateSelectHour.jsp"%>
            </div>
	  
	        <div class="ub uline umar-t8"></div>
	        
	          <div class="ub umar-t8">
                <div class="ub ub-ac" id="branchComponent">
                   <div class="umar-r10 uw-70 ut-r">店铺:</div>
						<input type="hidden" id="branchId" name="branchId"/>
	                    <input class="uinp ub ub-f1" type="hidden" id="branchCode" name="branchCode">
	                    <input class="uinp" type="hidden" id="branchCompleCode" name="branchCompleCode">
                        <input class="uinp ub ub-f1" type="text" id="branchNameOrCode" name="branchNameOrCode">
                   <div class="uinp-more">...</div>
                </div>
                <div class="ub ub-ac uselectw  umar-l20">
                   <div class="umar-r10 uw-70 ut-r">业务类型:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect" name="businessType" id="businessType" data-options="editable:false">
				            <option value="" selected="selected">全部</option>
				            <option value="A">销售</option>
				            <option value="B">退货</option>
				            <option value="D">充值</option>
				            <option value="E">售卡</option>
				        </select>
                </div>  
            </div>
	        <div class="ub umar-t8">
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">单号:</div>
                    <input class="uinp" type="text" name="orderNo" id="orderNo">
                </div>
                <div class="ub ub-ac uselectw umar-l20">
                    <div class="umar-r10 uw-70 ut-r">付款方式:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect uw-300" name="payType" id="payType" data-options="editable:false">
				            <option value="" selected="selected">全部</option>
				            <option value="RMB">现金</option>
				            <option value="ZER">抹零</option>
				            <option value="YHK">银行卡</option>
				            <option value="ZFB">支付宝</option>
				            <option value="WZF">微支付</option>
				            <option value="YQB">云钱包</option>
				            <option value="DJQ">代金券</option>
				            <option value="OFFDJQ">线下代金券</option>
				            <option value="YFQ">运费代金券</option>
				            <option value="PDF">平台垫付</option>
				            <option value="PBT">平台补贴</option>
				            <option value="DXR">店小二</option>
				            <option value="ZZT">HS深圳通</option>
				            <option value="CZK">储值卡</option>
				            <option value="YKT">一卡通</option>
				            <option value="LGJ">鹿管家</option>
				            <option value="QT">其他</option>
				        </select>
                </div>  
            </div>
            
             <div class="ub umar-t8">
                <div class="ub ub-ac uselectw">
                    <div class="umar-r10 uw-70  ut-r">订单类型:</div>
                       <!--select-->
				        <select class="easyui-combobox uselect " name="orderType" id="orderType" data-options="editable:false">
				            <option value="" selected="selected">全部</option>
				            <option value="0">APP</option>
				            <option value="1">微信</option>
				            <option value="2">POS订单</option>
				            <option value="3">扫码购</option>
							<option value="4">会员自助</option>
							<option value="5">小程序</option>
				        </select>
                </div>
                <div class="ub ub-ac umar-l20">
                    <div class="umar-r10 uw-70 ut-r">收银员:</div>
					<input type="hidden" name="cashierId" id="cashierId" class="uinp" />
					<input type="text" name="cashierNameOrCode" id="cashierNameOrCode" class="uinp" onblur="clearCashierId()" />
					<div class="uinp-more" id="cashierIdSelect" onclick="searchCashierId()">...</div>
                </div>
                <div class="ub ub-ac uselectw umar-l20">
                    <div class="umar-r10 uw-70 ut-r">订单状态:</div>
                        <select class="easyui-combobox uselect" name="status" id="status" data-options="editable:false">
                            <option value="1" selected="selected">已完成</option>
                            <option value="2">支付中/待支付</option>
                        </select>
                </div>
            </div>
       	</form>
       	
        <div class="ub ub-f1 umar-t20">
			 <table id="cashWater"></table>
		</div>
    </div>

</body>

</html>