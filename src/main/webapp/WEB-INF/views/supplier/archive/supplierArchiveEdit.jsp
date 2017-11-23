<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/supplier/archive/supplierArchiveEdit.js?V=${versionNo}"></script>
<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="updateSupplier()">保存</button>
			<button class="ubtns-item" onclick="closeDialogHandel()">关闭</button>
		</div>
	</div>
	<div class="ub uline"></div>
	<form id="formEdit" method="post">
		<div class="ub ub-ver upad-4">
			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">供应商编号:</div>
					<input id="id" name="id" type="hidden" value="${supplier.id }">
					<input id="supplierCode" name="supplierCode" class="uinp uw-200"
						type="text" readonly="readonly" value="${supplier.supplierCode }">
				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">供应商名称:</div>
					<input id="supplierName" name="supplierName" class="uinp"
						maxlength="50" value="${supplier.supplierName }">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">所属机构:</div>
					<input id="branchCodeName" name="branchCodeName"
						class="uinp uw-200" type="text" readonly="readonly"
						value="[${branch.branchCode }]${branch.branchName }">
					<input id="branchId" name="branchId" type="hidden"
						value="${supplier.branchId }">

				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">经营方式:</div>
					<select class="uselect easyui-combobox" name="saleWay" id="saleWay"
						style="width: 204px;"
						data-options="onChange:onChangeSaleWay,editable:false,disabled:true">
						<c:forEach var="i" items="${saleWayEnums }">
							<option value="${i.name }"
								<c:if test="${supplier.saleWay eq  i.name}">selected="selected"</c:if>>${i.value }
							</option>
						</c:forEach>
					</select>

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">所在区域:</div>
					<select class="uselect easyui-combobox easyui-validatebox"
						style="width: 204px;" name="supplierAreaId" id="supplierAreaId"
						data-options="editable:false">
						<c:forEach var="i" items="${areaList }">
							<option value="${i.areaId }" code="${i.areaCode }"
								<c:if test="${supplier.supplierAreaId eq  i.areaId}">selected="selected"</c:if>>${i.areaName }
							</option>
						</c:forEach>
					</select> <input id="supplierAreaCode" name="supplierAreaCode" type="hidden"
						value="${supplier.supplierAreaCode }">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">办公地址:</div>
					<input id="officeAddress" name="officeAddress" class="uinp uw-200"
						type="text" value="${supplier.officeAddress }" maxlength="50">

				</div>


			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">营业执照号:</div>
					<input id="businessLicenseNum" name="businessLicenseNum"
						class="uinp uw-200" type="text"
						value="${supplier.businessLicenseNum }" maxlength="50">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">组织机构代码:</div>
					<input id="organizationCode" name="organizationCode"
						value="${supplier.organizationCode }"
						class="uinp easyui-validatebox" maxlength="50">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">国税登记号:</div>
					<input id="nationalTaxRegNum" name="nationalTaxRegNum"
						value="${supplier.nationalTaxRegNum }"
						class="uinp easyui-validatebox" maxlength="50">

				</div>

			</div>

			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">地税登记号:</div>
					<input id="localTaxRegNum" name="localTaxRegNum"
						value="${supplier.localTaxRegNum }" class="uinp uw-200"
						type="text" maxlength="50">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">纳税人识别号:</div>
					<input id="taxIdentificationNum" name="taxIdentificationNum"
						value="${supplier.taxIdentificationNum }"
						class="uinp easyui-validatebox" maxlength="50">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">税票类型:</div>
					<select class="uselect easyui-combobox" name="stampsType"
						style="width: 204px;" id="stampsType"
						data-options="editable:false">
						<option value="1">增值税普通发票17%</option>
						<option value="2">增值税普通发票13%</option>
						<option value="3">增值税普通发票3%</option>
						<option value="4">增值税普通发票0%</option>
						<option value="5">增值税专用发票17%</option>
						<option value="6">增值税专用发票13%</option>
						<option value="7">增值税专用发票3%</option>
						<option value="8">通用机打发票</option>
						<option value="9">收据</option>
						<option value="10">其他</option>
					</select> <input id="stampsTypeVal" name="stampsTypeVal" type="hidden"
						value="${supplier.stampsType }">

				</div>
			</div>

			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">银行账户名称:</div>
					<input id="bankAccountName" name="bankAccountName"
						value="${supplier.bankAccountName }"
						class="uinp easyui-validatebox" maxlength="50">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">开户银行:</div>
					<input id="openAccountBank" name="openAccountBank"
						value="${supplier.openAccountBank }" class="uinp uw-200"
						type="text">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">银行账号:</div>
					<input id="bankAccount" name="bankAccount"
						value="${supplier.bankAccount }" class="uinp easyui-validatebox"
						maxlength="50">

				</div>

			</div>

			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">联系人:</div>
					<input id="contcat" name="contcat" value="${supplier.contcat }"
						class="uinp uw-200" type="text">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">电话号码:</div>
					<input id="phone" name="phone" value="${supplier.phone }"
						class="uinp easyui-validatebox" data-options="validType:'phone'"
						maxlength="20">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">手机号码:</div>
					<input id="mobile" name="mobile" value="${supplier.mobile }"
						class="uinp uw-200  easyui-validatebox"
						data-options="validType:'mobile'" type="text">

				</div>

			</div>

			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">E-mail地址:</div>
					<input id="email" name="email" value="${supplier.email }"
						class="uinp easyui-validatebox" maxlength="50">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">合同时间:</div>
					<input class="Wdate uinp uw-200" style="width: 201px;"
						readonly="readonly" name="contractDate" id="contractDate"
						onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"
						value="<fmt:formatDate value="${supplier.contractDate}" pattern="yyyy-MM-dd"/>" />
				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">采购人员:</div>
					<input id="purchaseStaffName" name="purchaseStaffName"
						value="${supplier.purchaseStaffName }"
						class="uinp easyui-validatebox" maxlength="20">
				</div>


			</div>

			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">送货周期:</div>
					<input id="diliveCycle" name="diliveCycle"
						value="${supplier.diliveCycle }" class="uinp easyui-validatebox"
						data-options="validType:'intNum'" maxlength="3">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">送货时间:</div>
					<select class="uselect easyui-combobox" style="width: 204px;"
						name="deliverTime" id="deliverTime" data-options="editable:false">
						<option value="上午">上午</option>
						<option value="下午">下午</option>
						<option value="晚上">晚上</option>
						<option value="凌晨">凌晨</option>
					</select> <input id="deliverTimeVal" name="deliverTimeVal" type="hidden"
						value="${supplier.deliverTime }">
				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">起订限制:</div>
					<select name="orderNumType uselect"
						style="width: 60px; height: 32px;">
						<option value="0">金额</option>
						<option value="1">数量</option>
					</select> <input id="orderNumLimit" style="width: 135px;"
						name="orderNumLimit" value="${supplier.orderNumLimit }"
						class="uinp easyui-validatebox"
						data-options="validType:'intOrFloat'" maxlength="20">
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">结算方式:</div>
					<select class="uselect easyui-combobox" name="balanceWay"
						style="width: 204px;" id="balanceWay"
						data-options="editable:false">
						<c:forEach var="i" items="${balanceWayEnums }">
							<option value="${i.value }"
								<c:if test="${supplier.balanceWay eq  i.value}">selected="selected"</c:if>>${i.name }</option>
						</c:forEach>
					</select>

				</div>

				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">结算周期:</div>
					<input id="balanceCycle" name="balanceCycle"
						value="${supplier.balanceCycle }"
						data-options="validType:'intNum'"
						class="uinp uw-200 easyui-validatebox" type="text" maxlength="3">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">月结账日期:</div>
					<input id="balanceDate" name="balanceDate"
						value="${supplier.balanceDate }" data-options="validType:'intNum'"
						class="uinp uw-200 easyui-validatebox" type="text" maxlength="3">

				</div>
			</div>

			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">冻结账款:</div>
					<select class="uselect easyui-combobox" style="width: 204px;"
						name="freezeAccount" id="freezeAccount" data-options="editable:false">
						<option value="0">正常</option>
						<option value="1">冻结</option>
					</select> 
					<input id="freezeAccountVal" name="freezeAccountVal" type="hidden" value="${supplier.freezeAccount }">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">冻结业务:</div>
					<select class="uselect easyui-combobox" style="width: 204px;"
						name="freezeBusiness" id="freezeBusiness" data-options="editable:false">
						<option value="0">正常</option>
						<option value="1">冻结</option>
					</select> 
					<input id="freezeBusinessVal" name="freezeBusinessVal" type="hidden" value="${supplier.freezeBusiness }">

				</div>
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">SKU数:</div>
					<input id="skuNum" name="skuNum" value="${supplier.skuNum }"
						class="uinp uw-200 easyui-validatebox"
						data-options="validType:'intNum'" type="text" maxlength="10">
				</div>
			</div>

			<div class="ub upad-4">
				<div class="ub ub-ac uw-320">
					<div class="umar-r10 uw-80 ut-r">品牌:</div>
					<input id="brandName" name="brandName"
						value="${supplier.brandName }" class="uinp" type="text">
				</div>
                <div class="ub ub-ac uw-320">
                    <div class="umar-r10 uw-80 ut-r">采购税率:</div>
<!--                     <input id="inputTaxRate" name="inputTaxRate" -->
<%--                         value="${supplier.inputTaxRate}" class="uinp" type="text"> --%>
                    <input id="inputTaxRate" name="inputTaxRate" value="${supplier.inputTaxRate*100}" style="width: 195px;"
                        class="uinp uinp-no-more easyui-numberbox easyui-validatebox"
                        data-options="min:0,precision:2,min:0.00,max:999999.99" type="text"
                        align="right" maxlength="10" onkeyup="checkPrice(this);"
                        onafterpaste="checkPrice(this);">%
                </div>

				<div class="ub ub-ac" id="minAmountDiv">
					<div class="umar-r10 uw-80 ut-r">保底金额:</div>
					<input id="minAmount" name="minAmount"
						value="${supplier.minAmount }"
						class="uinp uw-200 easyui-numberbox easyui-validatebox"
						data-options="validType:'intOrFloat',min:0.00,precision:2,max:999999.99">
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac ub-f1 umar-r36">
					<div class="umar-r10 uw-80 ut-r">备注:</div>
					<input id="remark" name="remark" class="uinp ub ub-f1" type="text"
						value="${supplier.remark }">
				</div>
			</div>
			<div class="ub upad-4">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-80"></div>
					<label><input id="isDirect" name="isDirect" type="checkbox"
						<c:if test="${supplier.isDirect}">checked="checked"</c:if>>直送供应商</label>
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-80"></div>
					<label><input id="isAllowPurchase" name="isAllowPurchase" type="checkbox"
						<c:if test="${supplier.isAllowPurchase eq 1}">checked="checked"</c:if>>门店订货</label>
				</div>


			</div>

		</div>
	</form>
</div>