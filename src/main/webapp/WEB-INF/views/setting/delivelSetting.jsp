<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>有效天数设置页面</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<shiro:hasPermission name="JxcDeliverSet:save">
				<div class="ubtns-item" onclick="save()">保存</div>
			</shiro:hasPermission>
			<div class="ubtns-item" onclick="toClose()">关闭</div>
		</div>
	</div>
	<div class="ub ub-ver ub-f1 umar-4 ubor upad-10">
		<div class="ub ub-ver umar-t20">
			<form id="settingForm" action="${ctx}/branchSetting/save" method="post">
				<input type="hidden" id="branchId" name="branchId">
				<input type="hidden" id="dosheetTemplate" name="dosheetTemplate">
				<div class="ub ub-ac upad-16 ">
					<div class="umar-r10 uw-60 ut-r">有效天数:</div>
					<div class="ub ub-ac umar-r10">
						<input type="text" class="easyui-numberbox " name="validityDay" id="validityDay" data-options="min:0,precision:0">
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r">自营店要货价格取值:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="priceSpec0" name="priceSpec" value="0" />
						<span>要货机构成本价</span>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="priceSpec1" name="priceSpec" value="1" />
						<span>发货机构配送价</span>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="priceSpec2" name="priceSpec" value="2" />
						<span>发货机构成本价</span>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">自营店可要仓库所有对外供应商品:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="selectGoodsSpec0" name="selectGoodsSpec" value="0" />
						<span>不启用</span>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="selectGoodsSpec1" name="selectGoodsSpec" value="1" />
						<span>启用</span>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">要货单起订金额控:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isMinAmount0" name="isMinAmount" value="0" />
						<span>不启用</span>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isMinAmount1" name="isMinAmount" value="1" />
						<span>启用</span>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">出库单导出模板设置:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="template" id="dosheetTemplate1" value="1" />
						<span>模板一</span>
					</div>
					<div class="ub ub-ac umar-r10">
						<a href="javascript:void(0)" class="easyui-linkbutton" onclick = "exportTemp('1')">下载后预览</a>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r "></div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="template" id="dosheetTemplate2" value="2" />
						<span>模板二</span>
					</div>
					<div class="ub ub-ac umar-r10">
						<a href="javascript:void(0)" class="easyui-linkbutton" onclick = "exportTemp('2')">下载后预览</a>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r "></div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="template" id="dosheetTemplate3" value="3"/>
						<label>自定义模板</label>
					</div>
					<div id="dvTemp" class="ub ub-ac umar-r10 unhide">
						
						<a href="javascript:void(0)" class="easyui-linkbutton" onclick = "uploadFile()">
						<label id="lbTxt"></label>
						
						</a>
					</div>
				</div>
			</form>
		</div>
	</div>

</body>
<script type="text/javascript">
	$(function() {
		$("#lbTxt").html("请上传自定义模板")
		//初始页面
		$.ajax({
			url : contextPath + "/branchSetting/getSetting",
			type : "POST",
			success : function(result) {
				if(result.code == 0){
					init(result.data);
				}else{
					disableSaveBtn();
					successTip(result.message);
				}
			},
			error : function(result) {
				disableSaveBtn();
				successTip("请求发送失败或服务器处理失败");
			}
		});
		
		
		$(".radioItem").on('change',function(){
			if($(this).val() === "3"){
				$("#lbTxt").html("请上传自定义模板")
				$("#dvTemp").removeClass("unhide");
				$("#dosheetTemplate").val("");
			}else{
				$("#dvTemp").addClass("unhide");
				$("#dosheetTemplate").val($(this).val());
			}
		})
	});
	
	//初始页面
	function init(data){
		var branchId = data.branchId;
		var priceSpec = data.priceSpec;
		var selectGoodsSpec = data.selectGoodsSpec;
		var isMinAmount = data.isMinAmount;
		var validityDay= data.validityDay;
		var dosheetTemplate= data.dosheetTemplate;
		//页面赋值
		$("#branchId").val(branchId);
		$("#validityDay").numberbox("setValue",validityDay);
		if (priceSpec === null || priceSpec === '0' || priceSpec === '') {
			$("#priceSpec0").attr("checked", "true");
		} else if (priceSpec === '1') {
			$("#priceSpec1").attr("checked", "true");
		} else {
			$("#priceSpec2").attr("checked", "true");
		}
		if (selectGoodsSpec === null || selectGoodsSpec === '0' || selectGoodsSpec === '') {
			$("#selectGoodsSpec0").attr("checked", "true");
		} else {
			$("#selectGoodsSpec1").attr("checked", "true");
		}
		if (isMinAmount === null || isMinAmount === 1 || isMinAmount === '') {
			$("#isMinAmount1").attr("checked", "true");
		} else {
			$("#isMinAmount0").attr("checked", "true");
		}
		if (dosheetTemplate === '1') {
			$("#dosheetTemplate1").attr("checked", "true");
		} else if (dosheetTemplate === '2') {
			$("#dosheetTemplate2").attr("checked", "true");
		} else {
			$("#lbTxt").html("上传新模板")
			$("#dosheetTemplate3").attr("checked", "true");
		}
			$("#dosheetTemplate").val(dosheetTemplate);
	}
	
	//禁用保存
	function disableSaveBtn(){
		$("#btnSave").removeClass("ubtns-item").addClass("ubtns-item-disabled").unbind("click");
	}

	//保存
	function save() {
		
		if($('#dosheetTemplate').val() === ""){
			messager("自定义模板未上传.");
			return;
		}
		
		$("#settingForm").form({
			onSubmit : function() {
				gFunStartLoading('正在保存，请稍后...');
				return true;
			},
			success : function(data) {
				var result = JSON.parse(data);
				gFunEndLoading();
				if (result['code'] == 0) {
					messager("保存成功！");
				} else {
					successTip(result['message']);
				}
			},
			error : function(data) {
				successTip("请求发送失败或服务器处理失败");
			}
		});
		
		$("#settingForm").submit();
	}
	
	// 下载模板
	function exportTemp(type) {
		location.href = contextPath + "/branchSetting/exportTemp?type=" + type;
	}
	
	// 上传模板
	function uploadFile() {
		var param = {
				url:contextPath + "/fileUpload/templateUpload",
				formType:"DO"
		}
		new publicUploadTemplateService(function(data) {
			$("#dosheetTemplate").val(data);
			$("#lbTxt").html("上传新模板")
		},param)
	}
</script>
</html>