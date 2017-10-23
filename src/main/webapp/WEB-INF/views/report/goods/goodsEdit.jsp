
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/report/goods/goodsEdit.js?V=${versionNo}1"></script>
<style>
.datagrid-header-row .datagrid-cell {
	text-align: center !important;
}

.tab-like {
	outline: none;
	border: 1px solid #95B8E7;
	width: 79px;
	height: 25px;
	line-height: 25px;
	font-size: 12px;
	font-weight: bold;
	border-radius: 5px 5px 0 0;
	color: #0E2D5F;
	background-color: #E0ECFF;
	background: -webkit-linear-gradient(top, #EFF5FF 0, #E0ECFF 100%);
	background: -moz-linear-gradient(top, #EFF5FF 0, #E0ECFF 100%);
	background: -o-linear-gradient(top, #EFF5FF 0, #E0ECFF 100%);
	background: linear-gradient(to bottom, #EFF5FF 0, #E0ECFF 100%);
	background-repeat: repeat-x;
}

.tab-like.active {
	border-bottom: 1px solid #fff;
	background: #fff;
}
</style>

<div class="uh">
	<div id="divTab">
		<div class="ub ub-ac upad-4 umar-l10"
			style="padding-bottom: 1px;">
			<button id="btnbase" class="tab-like" onclick="clickTab(1)">基本信息</button>
			<button id="btnprice" class="tab-like umar-l4" onclick="clickTab(2)">分店价格</button>
			<button id="btnbarCode" class="tab-like umar-l4"
				onclick="clickTab(3)">附加条码</button>
		</div>
	</div>
	<div class="ub uline-tab "></div>
	<div id="tab1">
		<div class="ub ub-ac upad-4">
			<div class="ubtns">
				<shiro:hasPermission name="JxcGoodsQuery:save">
					<button class="ubtns-item" onclick="saveProp()" id="btnSave">保存</button>
				</shiro:hasPermission>
				<button class="ubtns-item" onclick="closeDialog()">关闭</button>
			</div>
		</div>
		<div class="ub uline "></div>
		<form id="formEdit" method="post" style="font-size: 14px;">
			<input id="branchId" name="branchId" type="hidden"> <input
				id="oldSupplierId" name="oldSupplierId" class="uinp" type="hidden">
			<input id="isLinkage" name="isLinkage" type="hidden" value="0">
			<input id="isStore" name="isStore" type="hidden"> <input
				id="branchType" name="branchType" type="hidden"
				value="${branchType}">
			<div class="ub ub-ver upad-4">
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">货号:</div>
						<input id="skuId" name="skuId" type="hidden"> <input
							id="skuCode" name="skuCode" class="uinp uinp-no-more"
							readonly="readonly" type="text">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品名称:</div>
						<div class="ub">
							<input id="skuName" name="skuName" class="uinp uinp-no-more"
								readonly="readonly" data-options="required:true" maxlength="20">
						</div>
						<i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品条码:</div>
						<input id="barCode" name="barCode" class="uinp  uinp-no-more"
							readonly="readonly" data-options="validType:'intNum'">
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">助记码:</div>
						<input id="memoryCode" name="memoryCode" class="uinp uinp-no-more"
							readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品类别:</div>
						<input id="category" name="category" class="uinp uinp-no-more"
							readonly="readonly" type="text" readonly="readonly"
							data-options="required:true"> <i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">品牌:</div>
						<input id="brand" name="brand" class="uinp uinp-no-more"
							type="text" readonly="readonly">
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">进货规格:</div>
						<div class="ub">
							<input id="purchaseSpec" name="purchaseSpec"
								style="width: 204px;"
								class="uinp easyui-numberbox easyui-validatebox"
								data-options="required:true,min:0,precision:2" type="text">
						</div>
						<i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">规格:</div>
						<input id="spec" name="spec" class="uinp uinp-no-more"
							readonly="readonly" type="text">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">库存单位:</div>
						<input id="unit" name="unit" class="uinp uinp-no-more"
							readonly="readonly" type="text">
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">配送规格:</div>
						<div class="ub">
							<input id="distributionSpec" name="distributionSpec"
								style="width: 204px;"
								class="uinp easyui-numberbox easyui-validatebox"
								data-options="required:true,min:0,precision:2" type="text">
						</div>
						<i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品状态:</div>
						<select class="uselect" style="width: 204px;" disabled="disabled"
							name="status" id="status" data-options="readonly:true">
							<c:forEach items="${goodsStatus}" var="goodsStatus">
								<option value="${goodsStatus.name}">${goodsStatus.value}</option>
							</c:forEach>
						</select>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">产地:</div>
						<input id="originPlace" name="originPlace"
							class="uinp uinp-no-more" readonly="readonly" type="text">
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">计价方式:</div>
						<select class="uselect" style="width: 204px;" disabled="disabled"
							name="pricingType" id="pricingType" data-options="readonly:true">
							<c:forEach items="${pricingType}" var="pricingType">
								<option value="${pricingType.name}">${pricingType.value}</option>
							</c:forEach>
						</select>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">质保天数:</div>
						<input id="vaildity" name="vaildity" style="width: 204px;"
							class="uinp uinp-no-more" readonly="readonly" type="text">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">主供应商:</div>
						<div class="ub">
							<input id="supplierId" name="supplierId" class="uinp"
								type="hidden"> <input id="supplier" name="supplierName"
								class="uinp" type="text" readonly="readonly"
								data-options="required:true">
							<div class="uinp-more new-right" onclick="getGoodsPupplier()">...</div>
						</div>
						<i class="uc-red">*</i>
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">经营方式:</div>
						<input id="saleWay" name="saleWay" class="uinp" type="hidden"
							value="" readonly="readonly"> <input id="saleWayName"
							name="saleWayName" class="uinp uinp-no-more" type="text"
							readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">联营/代销扣率:</div>
						<input id="supplierRate" name="supplierRate" style="width: 204px;"
							class="uinp easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:2" type="text"
							onkeyup="checkSupplierRate(this);"
							onafterpaste="checkSupplierRate(this);">%
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品类型:</div>
						<select class="uselect" style="width: 204px;" disabled="disabled"
							name="type" id="type" data-options="readonly:true">
							<c:forEach items="${goodsType}" var="type">
								<option value="${type.name}">${type.value}</option>
							</c:forEach>
						</select>
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">零售价:</div>
						<input id="salePrice" name="salePrice" style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:4,readonly:true" type="text"
							align="right" maxlength="10" onkeyup="checkPrice(this);"
							onafterpaste="checkPrice(this);">
					</div>

					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">最低售价:</div>
						<input id="lowestPrice" name="lowestPrice" style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:4,readonly:true" type="text"
							maxlength="10" onkeyup="checkPrice(this);"
							onafterpaste="checkPrice(this);">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">会员价:</div>
						<input id="vipPrice" name="vipPrice" style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:4,readonly:true" type="text"
							maxlength="10" onkeyup="checkPrice(this);"
							onafterpaste="checkPrice(this);">
					</div>

				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">配送价:</div>
						<input id="distributionPrice" name="distributionPrice"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:4,readonly:true" type="text"
							maxlength="10" onkeyup="checkPrice(this);"
							onafterpaste="checkPrice(this);">
					</div>

					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">进货价:</div>
						<input id="purchasePrice" name="purchasePrice"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:4,readonly:true" type="text"
							maxlength="10" onkeyup="checkPrice(this);"
							onafterpaste="checkPrice(this);">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">批发价:</div>
						<input id="wholesalePrice" name="wholesalePrice"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:4,readonly:true" type="text"
							maxlength="10" onkeyup="checkPrice(this);"
							onafterpaste="checkPrice(this);">
					</div>





				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">毛利值:</div>
						<input id="grossProfit" name="grossProfitPercent"
							style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:2" type="text" readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">毛利率:</div>
						<input id="grossProfitPercent" name="grossProfitPercent"
							style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:2" type="text"
							style="text-align: right" readonly="readonly">
					</div>

					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">进项税率:</div>
						<input id="inputTax" name="inputTax" value='0.00'
							style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:2,validType:['length[0,18]']"
							type="text" maxlength="4" onkeyup="checkPositiveInteger(this);"
							onafterpaste="checkPositiveInteger(this)" readonly="readonly">%
					</div>



				</div>
				<div class="ub upad-4">

					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">销项税率:</div>
						<input id="outputTax" name="outputTax" style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0,precision:2,validType:['length[0,18]']"
							type="text" maxlength="4" onkeyup="checkPositiveInteger(this);"
							onafterpaste="checkPositiveInteger(this)" readonly="readonly">%
					</div>

					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">安全库存系数:</div>
						<input id="safetyCoefficient" name="safetyCoefficient" value='1'
							style="width: 204px;"
							class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							data-options="min:0.1,max:999.9,precision:2,validType:['length[0,18]']"
							type="text" maxlength="4">
					</div>

					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">修改时间:</div>
						<input id="updateTime" name="updateTime" class="uinp uinp-no-more"
							type="text" readonly="readonly">
					</div>

				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">修改人:</div>
						<input id="updateUserName" name="updateUserName"
							class="uinp uinp-no-more" type="text" readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">引入时间:</div>
						<input id="createTime" name="createTime" class="uinp uinp-no-more"
							type="text" readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">引入人:</div>
						<input id="createUserName" name="createUserName"
							class="uinp uinp-no-more" type="text" readonly="readonly">
					</div>
				</div>
				<div class="ub upad-4">
					<div class="umar-r10 uw-60 ut-r">备注:</div>
					<textarea id="remark" name="remark" class="uh-40 umar-r30 ubor"
						maxlength="100" style="width: 800px;"></textarea>
				</div>
				
				<div class="ub upad-4 umar-l32">
					<div class="ub ub-ac umar-r20">
						<label> <input id="isManagerStock" name="isManagerStock"
							type="checkbox" name="checkbox" disabled="disabled" /><span>是否管理库存</span>
						</label>
					</div>
					<div class="ub ub-ac umar-r20">
						<label> <input id="isHighValue" name="isHighValue"
							type="checkbox" name="checkbox" disabled="disabled" /><span>是否高值商品</span>
						</label>
					</div>
					<div class="ub ub-ac umar-r20">
						<label> <input id="isAttention" name="isAttention"
							id="attention" type="checkbox" name="checkbox"
							disabled="disabled" /> <span>是否关注商品</span>
						</label>
					</div>
					<div class="ub ub-ac umar-r20">
						<label> <input id="isFastDeliver" name="fastDeliver"
							type="checkbox" /> <span>是否直送商品</span>
						</label>
					</div>

					<div class="ub ub-ac umar-r20">
						<label> <input id="allowActivity" name="allowActivity"
							type="checkbox" name="checkbox"
							<c:if test="${branchType==3||branchType==4||branchType==5}">
			disabled='disabled'
		</c:if> /><span>是否参与促销</span>
						</label>

					</div>
					<div class="ub ub-ac umar-r20">
						<label> <input id="allowAdjust" name="allowAdjust"
							type="checkbox" name="checkbox"
							<c:if test="${branchType==3||branchType==4||branchType==5}">
			disabled='disabled'
		</c:if> /><span>分店调价</span>
						</label>

					</div>
					<div class="ub ub-ac umar-r20">
						<label> <input id="allowGift" name="allowGift"
									   type="checkbox" name="checkbox" /><span>是否可为赠品</span>
						</label>

					</div>
				</div>
				
				<div class="ub upad-4 umar-l32"  id="weekday">
					<div class="umar-r10 uw-60 ut-r">订货周期:</div>
					<div class="ub ub-ac umar-r40">
						<div class="ub ub-ac umar-l10 ubcheckweek">
	                    	<label><input class="radioItem" type="checkbox" id="weekcheckbox1" name="weekcheckbox" value="1" /><span class="">一</span></label>
	                   	</div>
	                   	<div class="ub ub-ac umar-l10 ubcheckweek">
	                        <label><input class="radioItem " type="checkbox" id="weekcheckbox2" name="weekcheckbox" value="2" /><span class="">二</span></label>
	                   	</div>
	                   	<div class="ub ub-ac umar-l10 ubcheckweek">
	                        <label><input class="radioItem " type="checkbox" id="weekcheckbox3" name="weekcheckbox" value="3" /><span class="">三</span></label>
	                   	</div>
	                    <div class="ub ub-ac umar-l10 ubcheckweek">
	                        <label><input class="radioItem " type="checkbox" id="weekcheckbox4" name="weekcheckbox" value="4" /><span class="">四</span></label>
	                   	</div>
	                    <div class="ub ub-ac umar-l10 ubcheckweek">
	                        <label><input class="radioItem " type="checkbox" id="weekcheckbox5" name="weekcheckbox" value="5" /><span class="">五</span></label>
	                   	</div>
	                    <div class="ub ub-ac umar-l10 ubcheckweek">
	                        <label><input class="radioItem " type="checkbox" id="weekcheckbox6" name="weekcheckbox" value="6" /><span class="">六</span></label>
	                   	</div>
	                    <div class="ub ub-ac umar-l10 ubcheckweek">
	                        <label><input class="radioItem " type="checkbox" id="weekcheckbox7" name="weekcheckbox" value="7" /><span class="">日</span></label>
	                   	</div>
	                   	<input type="hidden" id="deliveryCycle" name="deliveryCycle" value="">
					</div>
				</div>
				
				
			</div>
		</form>
	</div>

	<div id="tab2">
		<div class="ub ub-ver uh uw">
			<div class="ub ub-ac upad-4">
				<div class="ubtns">
					<button class="ubtns-item" onclick="saveSafetyCoefficient()"
						id="saveSafetyCoefficient()">保存</button>
					<button class="ubtns-item" onclick="closeDialog()">关闭</button>
				</div>
				<div class="ub ub-ac ub-pe ub-f1">
					<div class="umar-r10  ut-r">批量设置安全库存系数:</div>
					<input type="text" id="printnum11"
						class="uinp uw-120 easyui-numberbox easyui-validatebox"
						data-options="min:0.1,max:999.9,onChange:changePrint, precision:2,validType:['length[0,18]']
		<c:if test="${branchType==3||branchType==4||branchType==5}">
			,disabled:true
		</c:if>">
				</div>
				<div class="ub uw-160"></div>
			</div>
			<div class="ub uline "></div>
			<div class="ub ub-f1">
				<table id="dgPrice"></table>
			</div>
		</div>
	</div>

	<div id="tab3">
		<div class="ub ub-ver uh uw">
			<div class="ub ub-ac upad-4">
				<div class="ubtns">
					<button class="ubtns-item" onclick="closeDialog()">关闭</button>
				</div>
			</div>
			<div class="ub uline "></div>
			<div class="ub ub-f1">
				<table id="barCodeTable"></table>
			</div>
		</div>
	</div>
</div>


