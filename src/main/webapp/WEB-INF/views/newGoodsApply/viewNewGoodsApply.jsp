<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>

<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<script src="${ctx}/static/js/views/newGoodsApply/viewNewGoodsApply.js?V=${versionNo}"></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
			<div class="ubtns">
		    <shiro:hasPermission name="JxcNewGoodsApply:append">
				<button class="ubtns-item" onclick="goodsAddView()">新增</button>
			</shiro:hasPermission>
			<shiro:hasPermission name="JxcNewGoodsApply:append">
				<button class="ubtns-item" onclick="copyAddGoodsView()">复制新增</button>
			</shiro:hasPermission>
				<button class="ubtns-item" onclick="closeDialog()">关闭</button>
			</div>
	</div>
	<div class="ub uline "></div>
		<form id="formGoodsArchivesAdd" method="post"  style="font-size: 14px;">
			<div class="ub ub-ver ub-ac upad-4">
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">货号:</div>
						<input id="id" name="id" type="hidden"> <input
							id="skuCode" name="skuCode" class="uinp uinp-no-more" readonly="readonly"
							type="text">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品名称:</div>
						<div class="ub">
							<input id="skuName" name="skuName" class="uinp uinp-no-more"
								   data-options="required:true" maxlength="20">
						</div>
						<i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品条码:</div>
					    <input id="barCode" name="barCode" class="uinp  uinp-no-more" data-options="validType:'intNum'">
						<!-- <i class="uc-red">*</i> -->
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">助记码:</div>
						<input id="memoryCode" name="memoryCode" class="uinp uinp-no-more">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品类别:</div>
						<div class="ub">
							<input id="categoryId" name="categoryId" class="uinp" type="hidden"> 
							<input id="categoryCode" name="categoryCode" class="uinp" type="hidden">
						    <input id="categoryName" name="categoryName" class="uinp uinp-no-more" type="text"
								readonly="readonly" data-options="required:true">
						</div>
						<i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">品牌:</div>
						<input id="brandId" name="brandId" class="uinp" type="hidden">
						<input id="brandCode" name="brandCode" class="uinp" type="hidden">
						<div class="ub">
					    <input id="brandName" name="brandName" class="uinp uinp-no-more" type="text" readonly="readonly">
						</div>
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">进货规格:</div>
						<div class="ub">
							<input id="purchaseSpec" name="purchaseSpec" style="width: 204px;"
								   class="uinp uinp-no-more"
								   data-options="min:0,precision:2" type="text"
								   data-options="required:true">
						</div>
						<i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">规格:</div>
						<input id="spec" name="spec" class="uinp uinp-no-more" type="text" >
                        <!-- <i class="uc-red">*</i> -->
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">库存单位:</div>
						<select class="uselect easyui-combobox" name="unit" style="width: 204px;" id="unit" data-options="readonly:true">
							<option value="箱">箱</option>
							<option value="套">套</option>
							<option value="包">包</option>
							<option value="个">个</option>
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
							<input id="distributionSpec" name="distributionSpec" style="width: 204px;"
								   class="uinp uinp-no-more"
								   data-options="min:0,precision:2" type="text"
								   data-options="required:true">
						</div>

						<i class="uc-red">*</i>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品状态:</div>
						<select class="uselect easyui-combobox" style="width: 204px;" name="status" id="status" data-options="readonly:true">
							<c:forEach items="${goodsStatus}" var="goodsStatus">
								<option value="${goodsStatus.name}">${goodsStatus.value}</option>
							</c:forEach>
						</select>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">产地:</div>
						<input id="originPlace" name="originPlace" class="uinp uinp-no-more" type="text">
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">计价方式:</div>
						<c:if test="${goodpPicingType!=0 }">
							<select class="uselect easyui-combobox" style="width: 204px;" name="pricingType" id="pricingType" data-options="readonly:true">
								<c:forEach items="${pricingType}" var="pricingType">
									<c:if test="${pricingType.ordinal == goodpPicingType}">
										<option value="${pricingType.name}">${pricingType.value}</option>
									</c:if>
								</c:forEach>
							</select>
						</c:if>
						<c:if test="${goodpPicingType==0 }">
							<select class="uselect  easyui-combobox" style="width: 204px;" name="pricingType" id="pricingType" data-options="readonly:true">
								<c:forEach items="${pricingType}" var="pricingType">
									<c:if test="${pricingType.ordinal == 0}">
										<option value="${pricingType.name}">${pricingType.value}</option>
									</c:if>
								</c:forEach>
							</select>
						</c:if>
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">质保天数:</div>
						<input id="vaildity" name="vaildity" style="width: 204px;"
							   class="uinp uinp-no-more"
							   data-options="min:0,precision:0" type="text"
							   onkeyup="checkInteger(this)" onafterpaste="checkInteger(this)">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">主供应商:</div>
						<div class="ub">
							<input id="supplierId" name="supplierId" class="uinp" type="hidden"> 
							<input id="supplierName" name="supplierName" class="uinp uinp-no-more"
							 type="text" readonly="readonly" data-options="required:true">
						</div>
						<i class="uc-red">*</i>
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">经营方式:</div>
						<input id="saleWayName" name="saleWayName" class="uinp uinp-no-more"
							   type="text" readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">联营/代销扣率:</div>
						<input id="supplierRate" name="supplierRate" style="width: 204px;"
							   class="uinp easyui-numberbox easyui-validatebox uinp-no-more"
							   data-options="min:0,precision:2,readonly:true" type="text"
							   onkeyup="checkSupplierRate(this);"
							   onafterpaste="checkSupplierRate(this);">%
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">商品类型:</div>
						<select class="uselect easyui-combobox" style="width: 204px;" name="type" id="type" data-options="readonly:true">
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
						<div class="umar-r10 uw-60 ut-r">进货价:</div>
						<input id="purchasePrice" name="purchasePrice" style="width: 204px;"
							   class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:4,readonly:true" type="text"
							   maxlength="10" onkeyup="checkPrice(this);"
							   onafterpaste="checkPrice(this);">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">批发价:</div>
						<input id="wholesalePrice" name="wholesalePrice" style="width: 204px;"
							   class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:4,readonly:true" type="text"
							   maxlength="10" onkeyup="checkPrice(this);"
							   onafterpaste="checkPrice(this);">
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">配送价:</div>
						<input id="distributionPrice" name="distributionPrice" style="width: 204px;"
							   class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:4,readonly:true" type="text"
							   maxlength="10" onkeyup="checkPrice(this);"
							   onafterpaste="checkPrice(this);">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">最低售价:</div>
						<input id="lowestPrice" name="lowestPrice" style="width: 204px;"
							   class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:4,readonly:true" type="text" maxlength="10"
							   onkeyup="checkPrice(this);" onafterpaste="checkPrice(this);">
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
						<div class="umar-r10 uw-60 ut-r">毛利值:</div>
						<input id="grossProfit" name="grossProfitPercent" style="width: 204px;"
							   class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:2" type="text" readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">毛利率:</div>
						<input id="grossProfitPercent" name="grossProfitPercent" style="width: 204px;"
							   class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:2" type="text"
							   style="text-align: right" readonly="readonly">
					</div>
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">销项税率:</div>
						<input id="outputTax" name="outputTax" style="width: 204px;"
							   class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:2,validType:['length[0,18]'],readonly:true" type="text" maxlength="4"
							   onkeyup="checkPositiveInteger(this);"
							   onafterpaste="checkPositiveInteger(this)">%
					</div>
				</div>
				<div class="ub upad-4">
					<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-60 ut-r">进项税率:</div>
						<input id="inputTax" name="inputTax" value='0.00' style="width: 204px;"
							    class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
							   data-options="min:0,precision:2,validType:['length[0,18]'],readonly:true" type="text" maxlength="4"
							   onkeyup="checkPositiveInteger(this);"
							   onafterpaste="checkPositiveInteger(this)">%
					</div>
	                <div class="ub ub-ac uw-300">
	                    <div class="umar-r10 uw-60 ut-r">申请机构:</div>
	                    <input id="branchName" name="branchName" class="uinp uinp-no-more" type="text" readonly="readonly">
	                </div>
	                <div class="ub ub-ac uw-300">
	                    <div class="umar-r10 uw-60 ut-r">申请时间:</div>
	                    <input id="createTime" name="createTime" class="uinp uinp-no-more" type="text" readonly="readonly">
	                </div>
				</div>
            </div>
				<div class="ub upad-4">
					<div class="umar-r10 uw-60 ut-r">备注:</div>
					<textarea id="remark" name="remark" class="uh-40 umar-r30 ubor uinp-no-more" readonly="readonly" maxlength="100" style="width: 800px;"
					placeholder="计件秤重商品对类别有特殊说明、商品为组合商品有成份关系的，请在备注中填写。"></textarea>
				</div>
				<div class="ub umar-l32" style="position: absolute;left: 0px;">
					<div class="ub ub-ac umar-r40">
						<input id="managerStock" name="managerStock" 
							class="ub" type="checkbox" name="checkbox" disabled/><span>是否管理库存</span>
					</div>
					<div class="ub ub-ac umar-r40">
						<input id="highValue" name="highValue" class="ub"
							type="checkbox" name="checkbox" disabled/><span>是否高值商品</span>
					</div>
					<div class="ub ub-ac umar-r40">
						<input id="attention" name="attention" class="ub"
							type="checkbox" name="checkbox" disabled/><span>是否关注商品</span>
					</div>
					<div class="ub ub-ac umar-r40">
						<input id="fastDeliver" name="fastDeliver" 
						class="ub" type="checkbox" name="checkbox" disabled/><span>是否直送商品</span>
					</div>
					<div class="ub ub-ac umar-r40">
						<label>
							<input id="allowGift" name="allowGift" type="checkbox" name="checkbox" /><span>是否可为赠品</span>
						</label>
					</div>
				</div>

			</div>
		</form>

	</div>
