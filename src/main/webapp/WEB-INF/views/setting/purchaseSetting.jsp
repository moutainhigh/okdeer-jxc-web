<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>采购设置</title>
	
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<shiro:hasPermission name="JxcPurchaseSetting:save">
				<div id="btnSave" class="ubtns-item">保存</div>
		   	</shiro:hasPermission>
			<div class="ubtns-item" onclick="toClose()">关闭</div>
		</div>
	</div>
	<div class="ub ub-ver ub-f1 umar-4 ubor upad-10">
		<div class="ub ub-ver umar-t20">
			<form id="settingForm" action="${ctx}/branchSetting/save" method="post">
				<input type="hidden" id="branchId" name="branchId">
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r">选择供应商后自动列出商品：</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label>
						<input type="radio" id="isSupplierCascadeGoodsP0" name="isSupplierCascadeGoodsP" value="1" /><span>启用</span>
						</label>

					</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label>
						<input type="radio" id="isSupplierCascadeGoodsP1" name="isSupplierCascadeGoodsP" value="0" /><span>禁用</span>
						</label>

					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r"></div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input id="isSupplierCascadeGoodsPa" name="isSupplierCascadeGoodsPa" class="ub" type="checkbox" name="checkbox"  />
						<label for="isSupplierCascadeGoodsPa">采购订单</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r"></div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input id="isSupplierCascadeGoodsPi" name="isSupplierCascadeGoodsPi" class="ub" type="checkbox" name="checkbox"  />
						<label for="isSupplierCascadeGoodsPi">采购收货</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r"></div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input id="isSupplierCascadeGoodsPr" name="isSupplierCascadeGoodsPr" class="ub" type="checkbox" name="checkbox"  />
						<label for="isSupplierCascadeGoodsPr">采购退货</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r"></div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input id="isSupplierCascadeGoodsPm" name="isSupplierCascadeGoodsPm" class="ub" type="checkbox" name="checkbox"  />
						<label for="isSupplierCascadeGoodsPm">直送收货</label>
					</div>
				</div>

				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r">采购收货允许引用过期采购订单：</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label><input type="radio" id="isAllowRefOverdueForm0" name="isAllowRefOverdueForm" value="0" /><span>不启用</span></label>
					</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label><input type="radio" id="isAllowRefOverdueForm1" name="isAllowRefOverdueForm" value="1" checked="checked"/><span>启用</span></label>
					</div>
				</div>
				
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r">采购/直送收货取采购订单价格：</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label><input type="radio" id="isAllowPiGetPaPrice0" name="isAllowPiGetPaPrice" value="0" /><span>不启用</span></label>
					</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label><input type="radio" id="isAllowPiGetPaPrice1" name="isAllowPiGetPaPrice" value="1" checked="checked"/><span>启用</span></label>
					</div>
				</div>
			</form>
		</div>
	</div>
</body>

<script type="text/javascript">
	$(function() {
		//初始页面
		$_jxc.ajax({
			url : contextPath + "/branchSetting/getSetting",
			type : "POST"
		},function(result){
			if(result.code == 0){
				init(result.data);
			}else{
				disableSaveBtn();
				$_jxc.alert(result.message);
			}
		});
		
		//保存事件
		$("#btnSave").click(function (){
			save();
		});
		
		//单选框点击事件
		$("#isSupplierCascadeGoodsP0").click(function (){
			changeIsSupplierCascadeGoods();
		});
		$("#isSupplierCascadeGoodsP1").click(function (){
			changeIsSupplierCascadeGoods();
		});
	});
	
	//初始页面
	function init(data){
		//获取值
		var branchId = data.branchId;
		var isSupplierCascadeGoodsP = data.isSupplierCascadeGoodsP;
		var isSupplierCascadeGoodsPa = data.isSupplierCascadeGoodsPa;
		var isSupplierCascadeGoodsPi = data.isSupplierCascadeGoodsPi;
		var isSupplierCascadeGoodsPr = data.isSupplierCascadeGoodsPr;
		var isSupplierCascadeGoodsPm = data.isSupplierCascadeGoodsPm;
		var isAllowRefOverdueForm = data.isAllowRefOverdueForm;
		var isAllowPiGetPaPrice = data.isAllowPiGetPaPrice;
		
		//页面赋值
		$("#branchId").val(branchId);
		//选择供应商后自动列出商品
		if(isSupplierCascadeGoodsP == 1){
			$("#isSupplierCascadeGoodsP0").attr("checked","true");
		}else{
			$("#isSupplierCascadeGoodsP1").attr("checked","true");
		}
		//采购订单
		if(isSupplierCascadeGoodsPa == 1){
			$("#isSupplierCascadeGoodsPa").attr("checked","true");
		}
		//采购收货
		if(isSupplierCascadeGoodsPi == 1){
			$("#isSupplierCascadeGoodsPi").attr("checked","true");
		}
		//采购退货
		if(isSupplierCascadeGoodsPr == 1){
			$("#isSupplierCascadeGoodsPr").attr("checked","true");
		}
		//直送收货
		if(isSupplierCascadeGoodsPm == 1){
			$("#isSupplierCascadeGoodsPm").attr("checked","true");
		}
		
		//采购设置：允许采购收货引用过期采购订单：0否，1是
		if(isAllowRefOverdueForm == 1){
			$("#isAllowRefOverdueForm1").attr("checked","true");
		}else{
			$("#isAllowRefOverdueForm0").attr("checked","true");
		}
		
		//采购设置：允许采购收货取采购订单价格：0.否，1.是
		if(isAllowPiGetPaPrice == 1){
			$("#isAllowPiGetPaPrice1").attr("checked","true");
		}else{
			$("#isAllowPiGetPaPrice0").attr("checked","true");
		}
		
		changeIsSupplierCascadeGoods();
	}
	
	//禁用保存
	function disableSaveBtn(){
		$("#btnSave").removeClass("ubtns-item").addClass("ubtns-item-disabled").unbind("click");
	}
	
	//单选框点击事件
	function changeIsSupplierCascadeGoods(){
		if($("#isSupplierCascadeGoodsP0").is(':checked')){
			//启用
			$("#isSupplierCascadeGoodsPa").removeAttr("disabled");
			$("#isSupplierCascadeGoodsPi").removeAttr("disabled");
			$("#isSupplierCascadeGoodsPr").removeAttr("disabled");
			$("#isSupplierCascadeGoodsPm").removeAttr("disabled");
		}else{
			//禁用
			$("#isSupplierCascadeGoodsPa").attr("checked",false).attr("disabled","true");
			$("#isSupplierCascadeGoodsPi").attr("checked",false).attr("disabled","true");
			$("#isSupplierCascadeGoodsPr").attr("checked",false).attr("disabled","true");
			$("#isSupplierCascadeGoodsPm").attr("checked",false).attr("disabled","true");
		}
	}
	
	//保存
	function save() {
		$("#settingForm").form({
			onSubmit : function() {
				gFunStartLoading('正在保存，请稍后...');
				return true;
			},
			success : function(data) {
				var result = JSON.parse(data);
				gFunEndLoading();
				if (result['code'] == 0) {
					$_jxc.alert("保存成功！",function(){
						location.reload();
					});
				} else {
					$_jxc.alert(result['message']);
				}
			},
			error : function(data) {
				$_jxc.alert("请求发送失败或服务器处理失败");
			}
		});
		$("#settingForm").submit();
		
		$("#settingForm").form('submit');
	}
</script>
</html>