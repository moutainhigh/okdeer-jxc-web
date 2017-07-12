<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html> 
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>友门鹿·零售管理系统</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/index.js"></script>
	<style>
		.msg-ul{width:100%;overflow:hidden;}
		.msg-li{float:left;width:33.333%;margin-bottom:6px;}
	</style>
</head>
<body>

<iframe width="0" height="0" src="${ctx}/sessionKeeper">
</iframe>

<!--mleft-menu-two-->
<div id="left_menu_two"></div>
<!--end left-menu-two-->

<div class="basic-header">
	<div class="logo">
		<a href="javascript:void(0);">
			<img src="${ctx}/static/images/okdeer_logo.png">
			<span style="font-size: 20px;">零售管理系统</span>
		</a>
	</div><!--end logo -->
    
   	 <!--  refresh -->
    <div class="mst" id="mst"> 
    	<i class="reload-png" id="reload-btn" title="刷新消息" onclick="synchronousMessage()"></i> <a onClick="openMsg()" title="点击查看"  id="messageAllCount">消息提醒（<span class="uc-red" id="mtext" style="color: #ff0000 !important;">...</span>）</a>
    </div>
    <div class="header-load" id="head-right">
       <a class="header-load-link"><span class="name">  ${user.userName }, 您好 </span> <i class="iconfont">&#xe606;</i></a>
        <div class="linkdiv">
        	<a href="${ctx}/system/logout">退出</a>
        </div><!--end linkdiv -->
    </div><!--end header-load -->
</div><!--end header -->

<div class="basic-body">
	<div class="left-big-menu">
    	<div class="scroll-y-box" id="leftMenuContent"></div><!--end scroll-y-box -->
    </div><!--end left-big-menu-->
    
    <div class="basic-right">
        <div class="sma-menu-switch" id="collapseIcon">
            <span class="bg">&nbsp;</span>
            <div class="con">
                <i class="iconfont switch-ico-left">&#xe60c;</i>
                <i class="iconfont switch-ico-right">&#xe60d;</i>
            </div><!--end con -->
        </div><!--end big-menu-switch -->
        
        <div class="basic-main">
            <div class="scroll-y-box basic-main-content">
            
				<!--start内容区 -->
            	<div id="component-content" class="easyui-tabs" fit="true" border="false">
                	
                    <%--<div title="首页" data-options="closable:false" >--%>
						<%--<iframe scrolling="auto" frameborder="0"  src="${ctx}/purchase/paymentOrder/index" style="width:100%;height:100%;"></iframe>--%>
                    <%--</div>--%>
                </div>  
				<!--end 内容区 -->
                
                <!--消息提醒 start-->
			<div id="msgDialog" class="easyui-dialog" title="消息提醒" style="width:600px;height:auto;top:25%;display: none;"data-options="modal:true,closed:true">   
			   		<div class="ub uh ub-ver ufs-14 ubgc-bg">
			   		<shiro:hasPermission name="jxcSystemNotice:view">
			   			<div class="ub ub-ver  ubgc-while">
					   			<p class="ub ufs-12 ufw-b upad-8" style="font-size:13px;">公告</p>
					   			<p class="ub uline">
					   			<div class="ub upad-t10 upad-b10 upad-8">
					   				<ul class="msg-ul crbox ufs-14">
					   				
					   					<li class="msg-li"><a class="" href="javascript:openNewTab('未读公告','sys/notice/list?message=0');closeMsg();">未读公告（<em class="uc-red" id="jxcSystemNotice">...</em>）</a></li>
					   				
					   					<li class="msg-li" id="sumThree" style="display: none;">暂无提醒事项！</li>
					   				</ul>
					   			</div>
				   		</div>
			   		</shiro:hasPermission>
			   			<shiro:hasPermission name="JxcStockException:search">
				   			<div class="ub ub-ver ubgc-while">
					   			<p class="ub ufs-14 ufw-b upad-8" style="font-size:13px;">异常库存提醒</p>
					   			<p class="ub uline">
					   			<div class="ub upad-t10 upad-b10 upad-8">
					   				<ul class="msg-ul crbox ufs-14">
					   					<li class="msg-li"><a class="" href="javascript:openNewTab('库存异常查询','stock/exception/list?message=0');closeMsg();">异常库存商品（<em class="uc-red" id="JxcStockException">...</em>）</a></li>
					   					<li class="msg-li" id="sumOne" style="display: none;">暂无提醒事项！</li>
					   				</ul>
					   			</div>
				   			</div><!-- end 异常库存提醒 -->
			   			</shiro:hasPermission>
			   			<shiro:hasPermission name="JxcPurchaseReceipt:search || JxcDeliverDI:search">
				   			<div class="ub ub-ver  ubgc-while">
					   			<p class="ub ufs-12 ufw-b upad-8" style="font-size:13px;">收货提醒</p>
					   			<p class="ub uline">
					   			<div class="ub upad-t10 upad-b10 upad-8">
					   				<ul class="msg-ul crbox ufs-14">
					   				<shiro:hasPermission name="JxcPurchaseReceipt:search">
					   					<li class="msg-li"><a class="" href="javascript:openNewTab('采购收货','form/purchase/receiptList?message=1');closeMsg();">采购收货提醒（<em class="uc-red" id="JxcPurchaseReceipt">...</em>）</a></li>
					   				</shiro:hasPermission>
					   				<shiro:hasPermission name="JxcDeliverDI:search">
					   					<li class="msg-li"><a class="" href="javascript:openNewTab('配送入库','form/deliverForm/viewsDI?message=1');closeMsg();">配送收货提醒（<em class="uc-red" id="JxcDeliverDI">...</em>）</a></li>
					   				</shiro:hasPermission>
					   					<li class="msg-li" id="sumTwo" style="display: none;">暂无提醒事项！</li>
					   				</ul>
					   			</div>
				   			</div><!-- end 收货提醒 -->
			   			</shiro:hasPermission>
			   			<div class="ub ub-ver ubgc-while">
				   			<p class="ub ufs-12 ufw-b upad-8" style="font-size:13px;">未审核单据</p>
				   			<p class="ub uline">
				   			<div class="ub upad-t10 upad-b10 upad-8 uh-190">
				   				<ul class="msg-ul crbox ufs-14">
				   				
				   					<shiro:hasPermission name="JxcPriceAdjust:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('调价单','goods/priceAdjust/view?message=0');closeMsg();">调价单（<em class="uc-red" id="jxcPriceAdjust">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcStockLead:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('领用单','stock/lead/list?message=0');closeMsg();">领用单（<em class="uc-red" id="jxcStockLead">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcBranchPriceAdjust:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('门店调价单','goods/branchPriceAdjust/list?message=0');closeMsg();">门店调价单（<em class="uc-red" id="jxcBranchPriceAdjust">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcCombineSplit:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('组合拆分单','stock/combineSplit/list?message=0');closeMsg();">组合拆分单（<em class="uc-red" id="jxcCombineSplit">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcPurchaseOrder:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('采购订单','form/purchase/orderList?message=0');closeMsg();">采购订单（<em class="uc-red" id="jxcPurchaseOrder">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="activityList:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('活动管理','sale/activity/list?message=0');closeMsg();">活动管理（<em class="uc-red" id="activityList">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcPurchaseReceipt:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('采购收货','form/purchase/receiptList?message=0');closeMsg();">采购收货（<em class="uc-red" id="jxcPurchaseReceipt">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcNewGoodsApply:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('新品审核','goods/newGoodsApply/view?message=0');closeMsg();">新品审核（<em class="uc-red" id="jxcNewGoodsApply">...</em>）</a></li></shiro:hasPermission>
				   					
				   					<shiro:hasPermission name="JxcPurchaseRefund:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('采购退货','form/purchase/returnList?message=0');closeMsg();">采购退货（<em class="uc-red" id="jxcPurchaseRefund">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcDeliverDA:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('要货申请','form/deliverForm/viewsDA?message=0');closeMsg();">要货申请（<em class="uc-red" id="jxcDeliverDA">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcCostAdjust:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('成本调价单','cost/costAdjust/view?message=0');closeMsg();">成本调价单（<em class="uc-red" id="jxcCostAdjust">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcDeliverDR:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('退货申请','form/deliverForm/viewsDR?message=0');closeMsg();">退货申请（<em class="uc-red" id="jxcDeliverDR">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcStockReimburse:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('报损单','stock/reimburse/list?message=0');closeMsg();">报损单（<em class="uc-red" id="jxcStockReimburse">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcDeliverDI:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('配送入库','form/deliverForm/viewsDI?message=0');closeMsg();">配送入库（<em class="uc-red" id="jxcDeliverDI">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcDeliverDO:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('配送出库','form/deliverForm/viewsDO?message=0');closeMsg();">配送出库（<em class="uc-red" id="jxcDeliverDO">...</em>）</a></li></shiro:hasPermission>
				   					
				   					<shiro:hasPermission name="JxcOverdueApply:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('商品调价单','form/overdue/apply/list?message=0');closeMsg();">商品调价单（<em class="uc-red" id="jxcOverdueApply">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcDeliverDD:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('店间配送','form/deliverDDForm/view?message=0');closeMsg();">店间配送（<em class="uc-red" id="jxcDeliverDD">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcStockAdjust:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('库存调整单','stock/adjust/list?message=0');closeMsg();">库存调整单（<em class="uc-red" id="jxcStockAdjust">...</em>）</a></li></shiro:hasPermission>
				   					
				   					<shiro:hasPermission name="JxcSupplierAdvance:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('供应商预付款单','settle/supplierCharge/advanceList?message=0');closeMsg();">供应商预付款单（<em class="uc-red" id="jxcSupplierAdvance">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcSupplierCharge:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('供应商费用单','settle/supplierCharge/chargeList?message=0');closeMsg();">供应商费用单（<em class="uc-red" id="jxcSupplierCharge">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcSupplierChain:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('联营账款单','settle/supplierChain/chainList?message=0');closeMsg();">联营账款单（<em class="uc-red" id="jxcSupplierChain">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcSupplierCheck:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('供应商对账单','settle/supplierCheck/checkList?message=0');closeMsg();">供应商对账单（<em class="uc-red" id="jxcSupplierCheck">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcSupplierSettle:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('供应商结算单','settle/supplierSettle/settleList?message=0');closeMsg();">供应商结算单（<em class="uc-red" id="jxcSupplierSettle">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcSupplierAc:export"><li class="msg-li"><a class="" href="javascript:openNewTab('供应商往来账款','settle/supplierAccountCurrent/accountCurrentList?message=0');closeMsg();">供应商往来账款（<em class="uc-red" id="jxcSupplierAc">...</em>）</a></li></shiro:hasPermission>

									<shiro:hasPermission name="JxcFranchiseAdvance:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('加盟店预收款单','settle/franchiseCharge/advanceList?message=0');closeMsg();">加盟店预收款单（<em class="uc-red" id="jxcFranchiseAdvance">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcFranchiseCharge:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('加盟店费用单','settle/franchiseCharge/chargeList?message=0');closeMsg();">加盟店费用单（<em class="uc-red" id="jxcFranchiseCharge">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcFranchiseSettle:audit"><li class="msg-li"><a class="" href="javascript:openNewTab('加盟店结算单','settle/franchiseSettle/settleList?message=0');closeMsg();">加盟店结算单（<em class="uc-red" id="jxcFranchiseSettle">...</em>）</a></li></shiro:hasPermission>
				   					<shiro:hasPermission name="JxcFranchiseAc:export"><li class="msg-li"><a class="" href="javascript:openNewTab('加盟店往来账款','settle/franchiseAccountCurrent/list?message=0');closeMsg();">加盟店往来账款（<em class="uc-red" id="jxcFranchiseAc">...</em>）</a></li></shiro:hasPermission>

				   					
				   					<li class="msg-li" id="sumOther" style="display: none;">暂无提醒事项！</li>
				   				</ul>
				   			</div>
			   			</div><!-- end 未审核单据 -->
			   		</div>
			</div> <!--消息提醒  end-->

                
            </div><!--end scroll-y-box -->
        </div><!--end basic-main -->
	</div><!--end basic-right --> 
	
	
		   
</div><!--end basic-body -->

<div id="mm" class="easyui-menu" style="width:120px;">
	<div id="mm-tabupdate">刷新</div>
	<!-- <div id="mm-tabrepeat">复制</div> -->
	<div class="menu-sep"></div>
	<div id="mm-tabclose">关闭</div>
	<div id="mm-tabcloseall">全部关闭</div>
	<div id="mm-tabcloseother">关闭其它</div>
	<div class="menu-sep"></div>
	<div id="mm-tabcloseright">关闭右侧</div>
	<div id="mm-tabcloseleft">关闭左侧</div>
	<div class="menu-sep"></div>
	<div id="mm-exit">退出</div>
</div><!--end menu -->

<script type="text/javascript">
	document.onkeydown = function(e) {
	    if (event.ctrlKey && event.altKey && 67 == e.keyCode){
	        alert("当前版本:V2.3.0_A30");
	    }
	}
</script>
</body>
</html>

