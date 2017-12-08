<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>

<title>新增开店费用档案</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/settle/charge/editChargeRecord.js?V=${versionNo}3"></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="saveChargeRecord()" id="saveBtn">保存</button>
			<button class="ubtns-item" onclick="closeCategroyDialog()">关闭</button>
		</div>
	</div>
	<div class="ub uline"></div>
	<input type="hidden" id="chargeRecordId" name="chargeRecordId">
	<form id="formchargeRecord">

		<div class="ub ub-ver upad-4">
			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">编号:</div>
					<input class="uinp ub ub-f1 uinp-no-more" type="text" id="chargeCode" disabled="disabled"
						name="chargeCode"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">名称:</div>
					<input class="uinp ub ub-f1" type="text" id="chargeName"
						name="chargeName"
						maxlength="50" />
				</div>

			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">类别:</div>
					<input class="uinp ub ub-f1" type="hidden"  id="categoryId"
					name="categoryId"
					maxlength="50" />
					<input class="uinp ub ub-f1" type="hidden"  id="categoryCode"
						name="categoryCode"
						maxlength="50" />
					<input class="uinp ub ub-f1" type="text" id="categoryName"
					name="categoryName"  onclick="openChargeCodeDialog()" readonly="readonly"
					maxlength="50" />
				<div class="uinp-more" onclick="openChargeCodeDialog()">...</div>
				</div>


			<div class="ub ub-ac uw-300">
			<div class="umar-r10 uw-70 ut-r">品牌:</div>
			<input id="brandId" name="brandId" class="uinp" type="hidden" value="">
			<input id="brandCode" name="brandCode" class="uinp" type="hidden" value="">
			<div class="ub">

			<input id="brandName" name="brandName" class="uinp" type="text" onclick="getGoodsBrand()" readonly="readonly">
			<div class="uinp-more" onclick="getGoodsBrand()">...</div>
			</div>
			</div>


			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">单位:</div>
					<input class="uinp ub ub-f1" type="text" id="unit"
						name="unit"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">规格:</div>
					<input class="uinp ub ub-f1" type="text" id="spec"
						name="spec"
						maxlength="50" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">产地:</div>
					<input class="uinp ub ub-f1" type="text" id="originPlace"
						name="originPlace"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">采购价:</div>
					<input class="uinp easyui-numberbox" data-options="min:0,precision:2" type="text" id="purPrice"
						name="purPrice"
						maxlength="50" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">拆旧期限:</div>
					<input class="uinp easyui-numberbox" type="text"  data-options="min:0,precision:0" id="depreciate"
						name="depreciate" />
				<div class="uinp-more" >月</div>
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">保修期限:</div>
					<input class="uinp easyui-numberbox" data-options="min:0,precision:0" type="text" id="validity"
						name="validity" />
					<div class="uinp-more" >天</div>
				</div>
			</div>

			<div class="ub upad-4 umar-t10">

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">财务分类:</div>
					<div class="ub ub-ac umar-r10">
					<label class="mjradioLabel"><input class="radioItem mjradio" type="radio" id="financeType2" name="financeType"  value="2" checked="checked" /><span>固定资产与设备</span></label>
					</div>
					<div class="ub ub-ac umar-r10">
					<label class="mjradioLabel"><input class="radioItem mjradio" type="radio" id="financeType1" name="financeType" value="1" /><span>长期待摊费用</span></label>
					</div>
					<div class="ub ub-ac umar-r10">
					<label class="mjradioLabel"><input class="radioItem mjradio" type="radio" id="financeType3" name="financeType" value="3" /><span>累计待摊费用</span></label>
					</div>
				</div>
			</div>

			<div class="ub upad-4 umar-t10">

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">备注:</div>
					<input class="uinp ub ub-f1" type="text" id="remark"
						name="remark"
						maxlength="50" />
				</div>
			</div>
		</div>
	</form>
</div>

