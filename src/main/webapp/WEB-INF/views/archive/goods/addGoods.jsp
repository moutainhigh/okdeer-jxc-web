<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/goods/goodsArchivesAdd.js?V=${versionNo}"></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="saveGoodsArchives()"
				id="saveGoodsArchives">保存</button>
			<button class="ubtns-item" onclick="closeDialog()">关闭</button>

			<!-- <button class="ubtns-item" onclick="settingCol()">设置</button> -->
		</div>
	</div>
	<div class="ub uline "></div>

	<form id="formGoodsArchivesAdd" style="font-size: 14px;" method="post">
		<div class="ub ub-ver ub-ac upad-4">
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">货号:</div>
					<input id="skuCode" name="skuCode"
						class="uinp uinp-no-more uw-200 " readonly="readonly" type="text"
						value="${data.skuCode}">
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">商品名称:</div>
					<div class="ub">
						<input id="skuName" name="skuName" class="uinp  uw-200"
							autofocus="autofocus" maxlength="20">
					</div>
					<i class="uc-red">*</i>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">商品条码:</div>
					<input id="barCode" name="barCode" class="uinp  uw-200"
						data-options="validType:'intNum'">
					<!--  <i class="ub uc-red">*</i> -->
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">助记码:</div>
					<input id="memoryCode" name="memoryCode" class="uinp uw-200">
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">商品类别:</div>
					<input id="categoryId" name="categoryId" class="uinp" type="hidden">
					<input id="categoryCode" name="categoryCode" class="uinp"
						type="hidden">
					<div class="ub">
						<input id="categoryName" name="categoryName" class="uinp  uw-200"
							type="text" readonly="readonly">
						<div class="uinp-more " onclick="getGoodsType()">...</div>
					</div>
					<i class="uc-red">*</i>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">品牌:</div>
					<input id="brandId" name="brandId" class="uinp" type="hidden"
						value="${goodsBrand.id}"> <input id="brandCode"
						name="brandCode" class="uinp" type="hidden">
					<div class="ub">
						<input id="brandName" name="brandName" class="uinp" type="text"
							readonly="readonly" value="${goodsBrand.brandName}">
						<div class="uinp-more" onclick="getGoodsBrand()">...</div>
					</div>
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">进货规格:</div>
					<div class="ub">
						<input id="purchaseSpec" name="purchaseSpec"
							class="uinp   easyui-numberbox easyui-validatebox "
							style="width: 204px;"
							data-options="min:0.01,precision:2,required:true" type="text"
							value="1" onkeyup="checkInteger(this)"
							onafterpaste="checkInteger(this)">
					</div>
					<i class="uc-red">*</i>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">规格:</div>
					<input id="spec" name="spec" class="uinp easyui-validatebox"
						type="text">
					<!-- <i class="uc-red">*</i> -->
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">库存单位:</div>
					<select class="uselect easyui-combobox easyui-validatebox"
						style="width: 204px;" name="unit" id="unit"
						data-options="onChange:onChangeUnit,validType:'length[0,10]'">
						<option value="箱">箱</option>
						<option value="套">套</option>
						<option value="包">包</option>
						<option value="个" selected="selected">个</option>
						<option value="瓶">瓶</option>
						<option value="千克">千克</option>
						<option value="克">克</option>
					</select>
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">配送规格:</div>
					<div class="ub">
						<input id="distributionSpec" name="distributionSpec" value='1'
							class="uinp easyui-numberbox easyui-validatebox "
							style="width: 204px;" data-options="min:0.01,precision:2"
							type="text" data-options="required:true">
					</div>
					<i class="uc-red">*</i>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">商品状态:</div>
					<select class="uselect easyui-combobox" style="width: 204px;"
						name="status" id="status"
						data-options="editable:false,onChange:typeChange">
						<c:forEach items="${goodsStatus}" var="goodsStatus">
							<option value="${goodsStatus.name}">${goodsStatus.value}</option>
						</c:forEach>
					</select>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">产地:</div>
					<input id="originPlace" name="originPlace" class="uinp" type="text">
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">计价方式:</div>
					<select class="uselect easyui-combobox" style="width: 204px;"
						name="pricingType" id="pricingType"
						data-options="editable:false,onChange:pricingTypeChange">
						<c:forEach items="${pricingType}" var="pricingType">
							<option value="${pricingType.name}">${pricingType.value}</option>
						</c:forEach>
					</select>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">质保天数:</div>
					<input id="vaildity" name="vaildity"
						class="uinp easyui-numberbox easyui-validatebox"
						style="width: 204px;" data-options="min:0,precision:0" type="text"
						onkeyup="checkInteger(this)" onafterpaste="checkInteger(this)">
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">主供应商:</div>
					<input id="supplierId" name="supplierId" class="uinp" type="hidden"
						value="${supplier.id}">
					<div class="ub">
						<input id="supplierName" name="supplierName"
							class="uinp  easyui-validatebox" value="${supplier.supplierName}"
							type="text" readonly="readonly" data-options="required:true">
						<div class="uinp-more " onclick="getGoodsPupplier()">...</div>
					</div>
					<i class="uc-red">*</i>
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">经营方式:</div>
					<input id="saleWay" name="saleWay" class="uinp" type="hidden"
						value="${supplier.saleWay}" readonly="readonly"> <input
						id="saleWayName" name="saleWayName" class="uinp uinp-no-more"
						type="text" value="${supplier.saleWayName}" readonly="readonly">
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">联营/代销扣率:</div>
					<input id="supplierRate" name="supplierRate" value=""
						class="uinp easyui-numberbox easyui-validatebox"
						style="width: 204px;" data-options="min:0,precision:2" type="text"
						onkeyup="checkSupplierRate(this);"
						onafterpaste="checkSupplierRate(this);">%
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">商品类型:</div>
					<select class="uselect easyui-combobox input-form"
						style="width: 204px;" name="type" id="type"
						data-options="editable:false,onChange:typeChange">
						<c:forEach items="${goodsType}" var="type">
							<option value="${type.name}">${type.value}</option>
						</c:forEach>
					</select>
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">零售价:</div>
					<input id="salePrice" name="salePrice" value="0"
						class="uinp easyui-numberbox easyui-validatebox"
						style="width: 204px;" data-options="min:0,precision:4" type="text"
						maxlength="10" onkeyup="checkPrice(this);"
						onafterpaste="checkPrice(this);">
				</div>


				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">最低售价:</div>
					<input id="lowestPrice" name="lowestPrice" value="0"
						class="uinp easyui-numberbox easyui-validatebox"
						style="width: 204px;" data-options="min:0,precision:4" type="text"
						maxlength="10" onkeyup="checkPrice(this);"
						onafterpaste="checkPrice(this);">
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">会员价:</div>
					<input id="vipPrice" name="vipPrice" value="0"
						class="uinp easyui-numberbox easyui-validatebox"
						style="width: 204px;" data-options="min:0,precision:4" type="text"
						maxlength="10" onkeyup="checkPrice(this);"
						onafterpaste="checkPrice(this);">
				</div>


			</div>
			<div class="ub upad-4">

				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">进货价:</div>
					<input id="purchasePrice" name="purchasePrice" value="0"
						class="uinp easyui-numberbox easyui-validatebox"
						data-options="min:0,precision:4" type="text" maxlength="10"
						onkeyup="checkPrice(this);" onafterpaste="checkPrice(this);">
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">批发价:</div>
					<input id="wholesalePrice" name="wholesalePrice" value="0"
						class="uinp easyui-numberbox easyui-validatebox"
						data-options="min:0,precision:4" type="text" maxlength="10"
						onkeyup="checkPrice(this);" onafterpaste="checkPrice(this);">
				</div>


				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">配送价:</div>
					<input id="distributionPrice" name="distributionPrice" value="0"
						class="uinp easyui-numberbox easyui-validatebox"
						data-options="min:0,precision:4" type="text" maxlength="10"
						onkeyup="checkPrice(this);" onafterpaste="checkPrice(this);">
				</div>

			</div>
			<div class="ub upad-4">


				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">毛利值:</div>
					<input id="grossProfit" name="" value="0"
						class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
						style="width: 204px;" data-options="min:0,precision:2" type="text"
						readonly="readonly">
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">毛利率:</div>
					<input id="grossProfitPercent" name="" value="0"
						class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
						style="width: 204px;" data-options="min:0,precision:2" type="text"
						readonly="readonly">
				</div>


				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">进项税率:</div>
					<input id="inputTax" name="inputTax" value='0.00'
						class="uinp easyui-numberbox easyui-validatebox"
						style="width: 204px;"
						data-options="min:0,precision:2,validType:['length[0,18]']"
						type="text" maxlength="4" onkeyup="checkPositiveInteger(this);"
						onafterpaste="checkPositiveInteger(this)">%
				</div>


			</div>
			<div class="ub upad-4">

				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">销项税率:</div>
					<!--  <input id="outputTax" name="outputTax" value="0" class="uinp easyui-numberbox easyui-validatebox" data-options="min:0,precision:2" type="text"  maxlength="4" onkeyup="checkPositiveInteger(this);" onafterpaste="checkPositiveInteger(this)">% -->
					<input id="outputTax" name="outputTax"
						class="uinp easyui-numberbox easyui-validatebox"
						style="width: 204px;"
						data-options="min:0,precision:2,validType:['length[0,18]']"
						type="text" maxlength="4" onkeyup="checkPositiveInteger(this);"
						onafterpaste="checkPositiveInteger(this)">%
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">安全库存系数:</div>
					<input id="safetyCoefficient" name="safetyCoefficient" value='1'
						style="width: 204px;"
						class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
						data-options="min:0.1,max:999.9,precision:2,validType:['length[0,18]']"
						type="text" maxlength="4">
				</div>

				<div id="createUserName" class="ub ub-ac uw-300 ">
					<div class="umar-r10 uw-60 ut-r">建档人:</div>
					<input id="createUserName" name="createUserName"
						class="uinp uinp-no-more" type="text" readonly="readonly">
				</div>


				<!--                 <div id="checkDate" class="ub ub-ac uw-300 ">
                    <div class="umar-r10 uw-60 ut-r">审核时间:</div>
                    <input id="checkDate" name="checkDate"   class="uinp uinp-no-more" type="text" readonly="readonly">
                </div>
                <div id="checkUserName" class="ub ub-ac uw-300 ">
                    <div class="umar-r10 uw-60 ut-r">审核人:</div>
                    <input id="checkUserName" name="checkUserName"   class="uinp uinp-no-more" type="text" readonly="readonly" >
                </div> -->
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-60 ut-r">创建时间:</div>
					<input id="createDate" name="createDate" class="uinp uinp-no-more"
						type="text" readonly="readonly">
				</div>
				<div class="ub ub-ac uw-300 "></div>
				<div class="ub ub-ac uw-300 "></div>
			</div>
			<!--             <div id="applyDiv" class="ub upad-4 ">
             <div class="ub ub-ac uw-300">
                    <div class="umar-r10 uw-60 ut-r">申请时间:</div>
                    <input id="applyDate" name="applyDate"   class="uinp uinp-no-more" type="text" readonly="readonly">
                </div>
                <div class="ub ub-ac uw-300">
                    <div class="umar-r10 uw-60 ut-r">申请机构:</div>
                    <input id="applyUserName" name="applyUserName"   class="uinp uinp-no-more" type="text" readonly="readonly" >
                </div>
            </div> -->

			<div class="ub upad-4">
				<div class="umar-r10 uw-60 ut-r">备注:</div>
				<textarea id="remark" name="remark" class="uh-40 umar-r30 ubor"
					style="width: 800px;" maxlength="100" type="text"></textarea>
			</div>
			
			<div class="ub upad-4 umar-l32">
				<div class="ub ub-ac umar-r20">
					<label> <input id="managerStock" name="managerStock"
						type="checkbox" name="checkbox" checked="checked"
						readonly="readonly" /><span>是否管理库存</span>
					</label>
				</div>
				<div class="ub ub-ac umar-r20">
					<label> <input id="highValue" name="highValue"
						type="checkbox" name="checkbox" /><span>是否高值商品</span>
					</label>
				</div>
				<div class="ub ub-ac umar-r20">
					<label> <input id="attention" name="attention"
						type="checkbox" name="checkbox" /><span>是否关注商品</span>
					</label>
				</div>
				<div class="ub ub-ac umar-r20">
					<label> <input id="fastDeliver" name="fastDeliver"
						type="checkbox" name="checkbox" /><span>是否直送商品</span>
					</label>
				</div>
				<div class="ub ub-ac umar-r20">
					<label> <input id="allowActivity" name="allowActivity"
						type="checkbox" name="checkbox" checked="checked" /><span>是否参与促销</span>
					</label>
				</div>
				<div class="ub ub-ac umar-r20">
					<label> <input id="allowAdjust" name="allowAdjust"
						type="checkbox" name="checkbox" /><span>分店调价</span>
					</label>
				</div>
				<div class="ub ub-ac umar-r20">
					<label> <input id="allowGift" name="allowGift"
								   type="checkbox" name="checkbox" /><span>是否可为赠品</span>
					</label>

				</div>
			</div>
			
			<div class="ub upad-4 uw-570 umar-r200" id="weekday">
				<div class="umar-r10 uw-60 ut-r">订货周期:</div>
				<div class="ub ub-ac umar-r40">
					<div class="ub ub-ac umar-l10 ubcheckweek">
                    	<label><input class="radioItem" type="checkbox" id="weekcheckbox1" name="weekcheckbox" value="1" checked="checked" /><span class="">一</span></label>
                   	</div>
                   	<div class="ub ub-ac umar-l10 ubcheckweek">
                        <label><input class="radioItem " type="checkbox" id="weekcheckbox2" name="weekcheckbox" value="2" checked="checked" /><span class="">二</span></label>
                   	</div>
                   	<div class="ub ub-ac umar-l10 ubcheckweek">
                        <label><input class="radioItem " type="checkbox" id="weekcheckbox3" name="weekcheckbox" value="3" checked="checked" /><span class="">三</span></label>
                   	</div>
                    <div class="ub ub-ac umar-l10 ubcheckweek">
                        <label><input class="radioItem " type="checkbox" id="weekcheckbox4" name="weekcheckbox" value="4" checked="checked" /><span class="">四</span></label>
                   	</div>
                    <div class="ub ub-ac umar-l10 ubcheckweek">
                        <label><input class="radioItem " type="checkbox" id="weekcheckbox5" name="weekcheckbox" value="5" checked="checked" /><span class="">五</span></label>
                   	</div>
                    <div class="ub ub-ac umar-l10 ubcheckweek">
                        <label><input class="radioItem " type="checkbox" id="weekcheckbox6" name="weekcheckbox" value="6" checked="checked" /><span class="">六</span></label>
                   	</div>
                    <div class="ub ub-ac umar-l10 ubcheckweek">
                        <label><input class="radioItem " type="checkbox" id="weekcheckbox7" name="weekcheckbox" value="7" checked="checked" /><span class="">日</span></label>
                   	</div>
                   	<input type="hidden" id="deliveryCycle" name="deliveryCycle" value="">
				</div>
			</div>

		</div>
	</form>

</div>
