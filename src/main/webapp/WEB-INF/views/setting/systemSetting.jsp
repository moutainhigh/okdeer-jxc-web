<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>系统设置</title>
	
	<%@ include file="/WEB-INF/views/include/header.jsp"%>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<shiro:hasPermission name="JxcSystemSetting:save">
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
					<div class="ub uw-200 ut-r">后台单据允许负库存出库:</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label>
							<input type="radio" id="isAllowMinusStock1" name="isAllowMinusStock" value="1" /><span>启用</span>
						</label>
					</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label>
							<input type="radio" id="isAllowMinusStock0" name="isAllowMinusStock" value="0" /><span>不启用</span>
						</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-200 ut-r">系统月结日:</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label>
							<input  type="radio" id="isNaturalMonth0" name="isNaturalMonth" /><span>自然月</span>
						</label>
					</div>
				</div>
				<div class="ub ub-ac upad-16">
					<div class="ub uw-200 ut-r"></div>
					<div class="ub uw-110 ub-ac umar-r10">
						<label>
							<input type="radio" id="isNaturalMonth1" name="isNaturalMonth" value="0" /><span>指定日期</span>
						</label>
					</div>
					<div class="ub uw-110 ub-ac umar-r10">
						<input id="monthReportDay" name="monthReportDay" style="width:100px" class="easyui-numberbox easyui-validatebox" data-options="min:0,precision:0,max:28" type="text">
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-200 ut-r">订货安全系数设置:</div>
					<div class="ub ub-f1 ub-ver">
						<div class="ub ub-ac">
							<label class="satetyLabel" onClick="changeType(0)"><input  type="radio" id="isAllowMinusStock1" name="safetyCoefficientType" value="0" />取商品档案安全系数</label>
						</div>
					</div>
				</div>
				<div class="ub ub-ac umar-16">
					<div class="ub uw-200 ut-r"></div>
					<div class="ub ub-f1 ub-ver">
						<div class="ub ub-ac">
							<label class="satetyLabel" onClick="changeType(1)"><input  type="radio" id="isAllowMinusStock0" name="safetyCoefficientType" value="1" />取供应商送货周期，转换关系：1天0.5倍，2天1倍，3－4天1.5倍， 5天以上2倍</label>
						</div>
					</div>
				</div>
				<div class="ub ub-ac umar-16">
					<div class="ub uw-200 ut-r"></div>
					<div class="ub ub-f1 ub-ver">
						<div class="ub ub-ac" >
							<label class="satetyLabel" onClick="changeType(2)"><input  type="radio" id="isAllowMinusStock0" name="safetyCoefficientType" value="2" /></label>
							仓库平均送货周期 <input class="uinp uw-30 easyui-numberbox" type="text"  data-options="min:0,disabled:true" name="safetyCoefficientValue" id="safetyCoefficientValue" >天，转换关系：1天0.5倍，2天1倍，3－4天1.5倍， 5天以上2倍
						</div>
						<div class="ub  ub-ac upad-t16">每日销量 *（订货周期 + 送货周期） + 每日销量 * 安全库存系数－（实际库存 + 未送达订货）</div>
					</div>
				</div>
				<div class="ub ub-ac upad-16 ">
					<div class="ub uw-200 ut-r">建议订货数量公式:</div>
					<div class="ub ub-f1 ub-ver">
						<div class="ub ub-ac">
							<label class="satetyLabel" ><input  type="radio" id="isAllowMinusStock1" name="deliverSuggestType" value="0" />建议订货数量 = 存量指标上限 - 当前库存 【取配送规格整数倍】</label>
						</div>
					</div>
				</div>
				<div class="ub ub-ac umar-16">
					<div class="ub uw-200 ut-r"></div>
					<div class="ub ub-f1 ub-ver">
						<div class="ub ub-ac">
							<label class="satetyLabel" ><input  type="radio" id="isAllowMinusStock0" name="deliverSuggestType" value="1" />建议订货数量 = 每日销量 *（订货周期+送货周期） + 每日销量 * 安全库存系数－（实际库存+未送达订货） 【取配送规格整数倍】</label>
						</div>
					</div>
				</div>
                <div class="ub ub-ac umar-16">
                    <div class="ub uw-200 ut-l">供应商结算先对账后结算模式（开启前审核所有结算单）:</div>
                    <div class="ub uw-110 ub-ac umar-r10">
                        <label>
                            <input type="radio" id="supplierSettleCheckMode1" name="supplierSettleCheckMode" value="1" /><span>启用</span>
                        </label>
                    </div>
                    <div class="ub uw-110 ub-ac umar-r10">
                        <label>
                            <input type="radio" id="supplierSettleCheckMode0" name="supplierSettleCheckMode" value="0" /><span>不启用</span>
                        </label>
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
		
		//切换是否为自然月
		$("#isNaturalMonth0").click(function (){
			changeIsNaturalMonth();
		});
		$("#isNaturalMonth1").click(function (){
			changeIsNaturalMonth();
		});
		
	});
	
	//changeType 
	function changeType(v){
		if(v == '2'){
			$('#safetyCoefficientValue').numberbox('enable');
		}else{
			$('#safetyCoefficientValue').numberbox('disable');
		}
	}
	
	//初始页面
	function init(data){
		//获取值
		var branchId = data.branchId;
		var isAllowMinusStock = data.isAllowMinusStock;
		var supplierSettleCheckMode = data.supplierSettleCheckMode;
		var monthReportDay = data.monthReportDay;
		
		//页面赋值
		$("#branchId").val(branchId);
		//后台单据允许负库存出库
		if(isAllowMinusStock == 0){
			$("#isAllowMinusStock0").attr("checked",true);
		}else{
			$("#isAllowMinusStock1").attr("checked",true);
		}
		if(supplierSettleCheckMode == 0){
			$("#supplierSettleCheckMode0").attr("checked",true);
		}else{
			$("#supplierSettleCheckMode1").attr("checked",true);
		}
		//月结日（0-28），0为自然月
		if(monthReportDay==0){
			$("#isNaturalMonth0").attr("checked",true);
		}else{
			$("#isNaturalMonth1").attr("checked",true);
			$("#monthReportDay").numberbox("setValue",monthReportDay);
		}
		
		var safetyCoefficientType = data.safetyCoefficientType;
		
		//安全系数类型 默认为商品档案
		if(!safetyCoefficientType){
			safetyCoefficientType = 0;
		}
		
		// 初始化安全系数类型单选按钮值
		$(":radio[name='safetyCoefficientType']").eq(safetyCoefficientType).prop('checked',true); 
		
		// 如果是设置值类型
		if(safetyCoefficientType === 2){
			var safetyCoefficientValue = data.safetyCoefficientValue;
			$('#safetyCoefficientValue').numberbox('setValue', safetyCoefficientValue);
		}
		
		
		var deliverSuggestType = data.deliverSuggestType;
		
		// 初始化建议订货数量公式
		$(":radio[name='deliverSuggestType']").eq(deliverSuggestType).prop('checked',true); 
		
		//切换是否为自然月
		changeIsNaturalMonth();
	}
	
	//禁用保存
	function disableSaveBtn(){
		$("#btnSave").removeClass("ubtns-item").addClass("ubtns-item-disabled").unbind("click");
	}
	
	//切换是否为自然月
	function changeIsNaturalMonth(){
		if($("#isNaturalMonth0").is(':checked')){
			//自然月
			$("#monthReportDay").numberbox("setValue","0");
			$("#monthReportDay").numberbox("readonly");
		}else{
			//指定日期
			$("#monthReportDay").numberbox("readonly", false);
		}
	}
	
	//保存
	function save() {
		$("#settingForm").form({
			onSubmit : function() {
				console.log($('#safetyCoefficientValue').numberbox('getValue'));
			    
				if($("input[name='isNaturalMonth']:checked").val() == '0' &&  !$("#monthReportDay").numberbox('getValue')  ){
					$_jxc.alert('请设置指定日期');
					return false;
				}
				if($("input[name='safetyCoefficientType']:checked").val() == '2' &&  !$("#safetyCoefficientValue").numberbox('getValue')  ){
					$_jxc.alert('请设置订货安全系数');
					return false;
				}
				//return false;
				gFunStartLoading('正在保存，请稍后...');
				return true;
			},
			success : function(data) {
				var result = JSON.parse(data);
				gFunEndLoading();
				if (result['code'] == 0) {
					$_jxc.alert("保存成功！");
				} else {
					$_jxc.alert(result['message']);
				}
			},
			error : function(data) {
				$_jxc.alert("请求发送失败或服务器处理失败");
			}
		});
		$("#settingForm").submit();
	}
</script>
</html>