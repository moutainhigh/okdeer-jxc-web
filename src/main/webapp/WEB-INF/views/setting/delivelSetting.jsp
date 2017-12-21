<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>配送设置</title>

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
	<div class="ub ub-ver ub-f1 umar-4 upad-10">
		<div class="ub ub-ver">
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
					<div class="ub uw-220 ut-r ">要货单审核后按类别排序:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowDaAuditSort0" name="isAllowDaAuditSort" value="0" />
						<label for="isAllowDaAuditSort0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowDaAuditSort1" name="isAllowDaAuditSort" value="1" />
						<label for="isAllowDaAuditSort1">启用</label>
					</div>
				</div>
				<!-- <div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r">加盟店要货配送取价值:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="storesPriceSpec0" name="storesPriceSpec" value="0" />
						<label for="storesPriceSpec0">发货机构配送价</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="storesPriceSpec1" name="storesPriceSpec" value="1" checked="checked" />
						<label for="storesPriceSpec1">要货机构配送价</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="storesPriceSpec2" name="storesPriceSpec" value="2" />
						<label for="storesPriceSpec2">要货机构成本价</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="storesPriceSpec3" name="storesPriceSpec" value="3"/>
						<label for="storesPriceSpec3">发货机构成本价</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r">自营店要货价格取值:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="priceSpec0" name="priceSpec" value="0" />
						<label for="priceSpec0">要货机构成本价</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="priceSpec1" name="priceSpec" value="1" />
						<label for="priceSpec1">发货机构配送价</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="priceSpec2" name="priceSpec" value="2" />
						<label for="priceSpec2">发货机构成本价</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">自营店可要仓库所有对外供应商品:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="selectGoodsSpec0" name="selectGoodsSpec" value="0" />
						<label for="selectGoodsSpec0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="selectGoodsSpec1" name="selectGoodsSpec" value="1" />
						<label for="selectGoodsSpec1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">加盟店可要仓库所有对外供应商品:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="storeSelectGoodsSpec0" name="storeSelectGoodsSpec" value="0" />
						<label for="storeSelectGoodsSpec0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="storeSelectGoodsSpec1" name="storeSelectGoodsSpec" value="1" />
						<label for="storeSelectGoodsSpec1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r">直送要货单价格取值:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="dyPriceSpec0" name="dyPriceSpec" value="0" />
						<label for="dyPriceSpec0">要货机构配送价</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="dyPriceSpec1" name="dyPriceSpec" value="1" />
						<label for="dyPriceSpec1">发货机构配送价</label>
					</div>
				</div> -->
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">允许直送收货单不引用单据收货:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowPmRefPa0" name="isAllowPmRefPa" value="0" />
						<label for="isAllowPmRefPa0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowPmRefPa1" name="isAllowPmRefPa" value="1" />
						<label for="isAllowPmRefPa1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">允许直送收货生成采购订单:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowPmGenerPa0" name="isAllowPmGenerPa" value="0" />
						<label for="isAllowPmGenerPa0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowPmGenerPa1" name="isAllowPmGenerPa" value="1" />
						<label for="isAllowPmGenerPa1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">门店报损单允许负库存出库:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStockIdOut0" name="isAllowMinusStockIdOut" value="0" />
						<label for="isAllowMinusStockIdOut0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStockIdOut1" name="isAllowMinusStockIdOut" value="1" />
						<label for="isAllowMinusStockIdOut1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">门店退货申请单允许负库存出库:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStockDrOut0" name="isAllowMinusStockDrOut" value="0" />
						<label for="isAllowMinusStockDrOut0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStockDrOut1" name="isAllowMinusStockDrOut" value="1" />
						<label for="isAllowMinusStockDrOut1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">门店店间配送单允许负库存出库:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStockDdOut0" name="isAllowMinusStockDdOut" value="0" />
						<label for="isAllowMinusStockDdOut0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isAllowMinusStockDdOut1" name="isAllowMinusStockDdOut" value="1" />
						<label for="isAllowMinusStockDdOut1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">要货单起订金额控制:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isMinAmount0" name="isMinAmount" value="0" />
						<label for="isMinAmount0">不控制</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r "></div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isMinAmount1" name="isMinAmount" value="1" />
						<label for="isMinAmount1">按门店起订金额控制</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r "></div>
					<div class="ub ub-ac umar-r10">
						<input class="ub" type="radio" id="isMinAmount2" name="isMinAmount" value="2" />
						<label for="isMinAmount2">按仓库起订金额控制</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<input type="text" class="easyui-numberbox " name="minAmount" id="minAmount" value="0" readonly="readonly" data-options="min:0,precision:2,">
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r ">出库单导出模板设置:</div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="template" id="dosheetTemplate1" value="1" />
						<label for="dosheetTemplate1">模板一</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<a href="javascript:void(0)" class="easyui-linkbutton" onclick = "exportTemp('1')">下载后预览</a>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r "></div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="template" id="dosheetTemplate2" value="2" />
						<label for="dosheetTemplate2">模板二</label>
					</div>
					<div class="ub ub-ac umar-r10">
						<a href="javascript:void(0)" class="easyui-linkbutton" onclick = "exportTemp('2')">下载后预览</a>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-220 ut-r "></div>
					<div class="ub ub-ac umar-r10">
						<input class="ub radioItem" type="radio" name="template" id="dosheetTemplate3" value="3"/>
						<label for="dosheetTemplate3">自定义模板</label>
					</div>
					<div id="dvTemp" class="ub ub-ac umar-r10 unhide">
						
						<a href="javascript:void(0)" class="easyui-linkbutton" onclick = "uploadFile()">
						<label id="lbTxt"></label>
						
						</a>
					</div>
				</div>

				<div class="ub ub-ac upad-16">
					<div class="ub uw-220 ut-r ">允许配送出库单生成要货单:</div>
					<div class="ub ub-ac umar-r10">
					<input class="ub radioItem" type="radio" name="isAllowDoGenerDa" id="isAllowDoGenerDa0" value="0"/>
					<label for="isAllowDoGenerDa0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
					<input class="ub radioItem" type="radio" name="isAllowDoGenerDa" id="isAllowDoGenerDa1" value="1"/>
					<label for="isAllowDoGenerDa1">启用</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16">
					<div class="ub uw-220 ut-r ">允许引用门店退货申请入库时</br>自动生成门店配送出库单:</div>
					<div class="ub ub-ac umar-r10">
					<input class="ub radioItem" type="radio" name="isAllowDrGenerDo" id="isAllowDrGenerDo0" value="0"/>
					<label for="isAllowDrGenerDo0">不启用</label>
					</div>
					<div class="ub ub-ac umar-r10">
					<input class="ub radioItem" type="radio" name="isAllowDrGenerDo" id="isAllowDrGenerDo1" value="1"/>
					<label for="isAllowDrGenerDo1">启用</label>
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
		
		
		$(":radio[name='template']").on('change',function(){
			if($(this).val() === "3"){
				$("#lbTxt").html("请上传自定义模板")
				$("#dvTemp").removeClass("unhide");
				$("#dosheetTemplate").val("");
			}else{
				$("#dvTemp").addClass("unhide");
				$("#dosheetTemplate").val($(this).val());
			}
		})
		
		$("input[name='isMinAmount']").on('change',function(){
			if($(this).val() != "2"){
				$('#minAmount').numberbox('setValue',0);
				$('#minAmount').numberbox('readonly',true);
			}else{
				$('#minAmount').numberbox('readonly',false);
			}
		})
	});
	
	//初始页面
	function init(data){
		var branchId = data.branchId;
		/* var priceSpec = data.priceSpec;
		var dyPriceSpec = data.dyPriceSpec;
		var selectGoodsSpec = data.selectGoodsSpec;
		var storesPriceSpec= data.storesPriceSpec;
		var storeSelectGoodsSpec= data.storeSelectGoodsSpec; */
		var isMinAmount = data.isMinAmount;
		var minAmount = data.minAmount || 0;
		var validityDay= data.validityDay;
		var dosheetTemplate= data.dosheetTemplate;
		var isAllowPmRefPa= data.isAllowPmRefPa;
		var isAllowPmGenerPa= data.isAllowPmGenerPa;
		var isAllowDoGenerDa= data.isAllowDoGenerDa;
		var isAllowDaAuditSort= data.isAllowDaAuditSort;
		//<!-- 门店报损单允许负库存出库 0-不启用 1-启用 -->
		var isAllowMinusStockIdOut= data.isAllowMinusStockIdOut;
		//<!-- 门店引用退货申请单出库允许负库存出库 0-不启用 1-启用 -->
		var isAllowMinusStockDrOut= data.isAllowMinusStockDrOut;
		//<!-- 门店引用店间配送单出库允许负库存出库 0-不启用 1-启用 -->
		var isAllowMinusStockDdOut= data.isAllowMinusStockDdOut;
		//<!-- 允许入库引用门店退货申请时自动生成配送出库单 0-不启用 1-启用 -->
		var isAllowDrGenerDo= data.isAllowDrGenerDo;
		
		//页面赋值
		$("#branchId").val(branchId);
		$("#validityDay").numberbox("setValue",validityDay);
		
		/* if (priceSpec === null || priceSpec === '0' || priceSpec === '') {
			$("#priceSpec0").attr("checked", "true");
		} else if (priceSpec === '1') {
			$("#priceSpec1").attr("checked", "true");
		} else {
			$("#priceSpec2").attr("checked", "true");
		}

		if (storesPriceSpec === null || storesPriceSpec === '1' || storesPriceSpec === '') {
			$("#storesPriceSpec1").attr("checked", "true");
		} else if (storesPriceSpec === '0') {
			$("#storesPriceSpec0").attr("checked", "true");
		}else if (storesPriceSpec === '2') {
            $("#storesPriceSpec2").attr("checked", "true");
        }else if (storesPriceSpec === '3') {
            $("#storesPriceSpec3").attr("checked", "true");
        }

		if (dyPriceSpec === null || dyPriceSpec === '0' || dyPriceSpec === '') {
			$("#dyPriceSpec0").attr("checked", "true");
		} else {
			$("#dyPriceSpec1").attr("checked", "true");
		} 
		if (selectGoodsSpec === null || selectGoodsSpec === '0' || selectGoodsSpec === '') {
			$("#selectGoodsSpec0").attr("checked", "true");
		} else {
			$("#selectGoodsSpec1").attr("checked", "true");
		}


		if (storeSelectGoodsSpec === null || storeSelectGoodsSpec === '0' || storeSelectGoodsSpec === '') {
			$("#storeSelectGoodsSpec0").attr("checked", "true");
		} else {
			$("#storeSelectGoodsSpec1").attr("checked", "true");
		} */
		
		if (isAllowPmRefPa === null || isAllowPmRefPa === 0 || isAllowPmRefPa === '') {
			$("#isAllowPmRefPa0").attr("checked", "true");
		} else {
			$("#isAllowPmRefPa1").attr("checked", "true");
		}
		
		if (isAllowPmGenerPa === null || isAllowPmGenerPa === 0 || isAllowPmGenerPa === '') {
			$("#isAllowPmGenerPa0").attr("checked", "true");
		} else {
			$("#isAllowPmGenerPa1").attr("checked", "true");
		}

		if (isMinAmount === null || isMinAmount === 1 || isMinAmount === '') {
			$("#isMinAmount1").attr("checked", "true");
		}else if(isMinAmount == '2'){
			$("#isMinAmount2").attr("checked", "true");
			$('#minAmount').numberbox('setValue',minAmount);
			$('#minAmount').numberbox('readonly',false);
		}else {
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
			
		if (isAllowDoGenerDa === null || isAllowDoGenerDa === 0 || isAllowDoGenerDa === '') {
			$("#isAllowDoGenerDa0").attr("checked", "true");
		} else {
			$("#isAllowDoGenerDa1").attr("checked", "true");
		}
		
		if (isAllowDaAuditSort === null || isAllowDaAuditSort === 0 || isAllowDaAuditSort === '') {
			$("#isAllowDaAuditSort0").attr("checked", "true");
		} else {
			$("#isAllowDaAuditSort1").attr("checked", "true");
		}
	    //<!-- 门店报损单允许负库存出库 0-不启用 1-启用 -->
		if (isAllowMinusStockIdOut === null || isAllowMinusStockIdOut === 0 || isAllowMinusStockIdOut === '') {
			$("#isAllowMinusStockIdOut0").attr("checked", "true");
		} else {
			$("#isAllowMinusStockIdOut1").attr("checked", "true");
		}
        //<!-- 门店引用退货申请单出库允许负库存出库 0-不启用 1-启用 -->
		if (isAllowMinusStockDrOut === null || isAllowMinusStockDrOut === 0 || isAllowMinusStockDrOut === '') {
			$("#isAllowMinusStockDrOut0").attr("checked", "true");
		} else {
			$("#isAllowMinusStockDrOut1").attr("checked", "true");
		}
        //<!-- 门店引用店间配送单出库允许负库存出库 0-不启用 1-启用 -->
		if (isAllowMinusStockDdOut === null || isAllowMinusStockDdOut === 0 || isAllowMinusStockDdOut === '') {
			$("#isAllowMinusStockDdOut0").attr("checked", "true");
		} else {
			$("#isAllowMinusStockDdOut1").attr("checked", "true");
		}
        //<!-- 允许入库引用门店退货申请时自动生成配送出库单 0-不启用 1-启用 -->
		if (isAllowDrGenerDo === null || isAllowDrGenerDo === 0 || isAllowDrGenerDo === '') {
			$("#isAllowDrGenerDo0").attr("checked", "true");
		} else {
			$("#isAllowDrGenerDo1").attr("checked", "true");
		}

	}
	
	//禁用保存
	function disableSaveBtn(){
		$("#btnSave").removeClass("ubtns-item").addClass("ubtns-item-disabled").unbind("click");
	}

	//保存
	function save() {
		
		if($('#dosheetTemplate').val() === ""){
			$_jxc.alert("自定义模板未上传.");
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
		
		$("#settingForm").form('submit');
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