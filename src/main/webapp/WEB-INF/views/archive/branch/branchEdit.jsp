<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/branchManager/editBranch.js?V=${versionNo}"></script>
<div id="branchEdit" class="easyui-tabs" style="width: 100%; height: 100%;">
	<div title="基本信息" data-options="fit:true,border:false"
		style="width: 100%; padding: 10px; display: none;">
		<div class="ub ub-ver ub-f1 uw uh ufs-14 uc-black">
			<div class="ub ub-ac upad-4">
				<div class="ubtns">
					<button class="ubtns-item" onclick="saveBranch()">保存</button>
					<button class="ubtns-item" onclick="closeDialogHandel()">关闭</button>
				</div>
			</div>
			<div class="ub uline"></div>
			<form id="formEdit" method="post">
				<div class="ub ub-ver upad-4">
					<div class="ub upad-4 umar-l20">
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-80 ut-r">机构编号:</div>
							<input id="branchId" name="branchId" type="hidden" value="${branchId }">
							<input id="branchesId" name="branchesId" type="hidden">
							<input id="branchCode" name="branchCode"
								class="uinp uinp-no-more uw-200" type="text" readonly="readonly">
						</div>
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-80 ut-r">机构名称:</div>
							<input id="branchName" name="branchName"
								class="uinp uinp-no-more" maxlength="50" readonly="readonly">

						</div>
						<div class="ub ub-ac">
							<div class="umar-r10 uw-80 ut-r">机构类型:</div>
							<input id="branchTypeStr" name="branchTypeStr" type="text"
							class="uinp uinp-no-more"
							readonly="readonly">
							<input id="type" name="type" type="hidden">
						</div>
					</div>

					<div class="ub upad-4 umar-l20">
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-80 ut-r">联系人:</div>
							<input id="contacts" name="contacts"
								class="uinp uinp-no-more uw-200" type="text" readonly="readonly">

						</div>
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-80 ut-r">手机:</div>
							<input id="mobile" name="mobile"
								class="uinp uinp-no-more uw-200"
								readonly="readonly" type="text">
						</div>

						<div class="ub ub-ac">
							<div class="umar-r10 uw-80 ut-r">邮箱:</div>
							<input id="email" name="email"
								class="uinp uinp-no-more" readonly="readonly">

						</div>
					</div>

					<div class="ub upad-4 umar-l20">
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-80 ut-r">所属区域:</div>
							<input id="branchAreaName" name="branchAreaName" type="text"
								class="uinp uinp-no-more" maxlength="50"
								readonly="readonly">

						</div>

						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-80 ut-r">详细地址:</div>
							<input id="address" name="address" type="text"
								class="uinp uinp-no-more" readonly="readonly">

						</div>

						<div class="ub ub-ac">
						<div class="umar-r10 uw-80 ut-r">参考分店:</div>
						<input id="refBranchName" name="refBranchName" type="text"
						class="uinp uinp-no-more" maxlength="50"
						readonly="readonly">

						</div>

					</div>

					<div class="ub upad-4 umar-l20">
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-80 ut-r">所属机构:</div>
							<input id="parentBranchName" name="parentBranchName" type="text"
								class="uinp uinp-no-more" maxlength="50"
								readonly="readonly">

						</div>

						<div class="ub ub-ac uw-300">
							<div class="umar-r10 uw-80 ut-r">配送价格:</div>
							<select class="uselect easyui-combobox" style="width: 204px;"
							data-options="editable:false" name="deliverPriceSpec" id="deliverPriceSpec">
							<c:forEach var="i" items="${deliverPriceSpecList }">
								<option value="${i.code }" >${i.label }</option>
							</c:forEach>
							</select>


							<%--<input id="distriPriceTypeStr" name="distriPriceTypeStr" type="text"--%>
							<%--class="uinp uinp-no-more" maxlength="50"--%>
							<%--readonly="readonly">--%>
							<%--<input id="distriPriceType" name="distriPriceType" type="hidden">--%>

						</div>


						<div class="ub ub-ac">
						<div class="umar-r10 uw-100 ut-r">直送要货价格:</div>
						<select class="uselect easyui-combobox" style="width: 204px;"
						data-options="editable:false" name="dyPriceSpec" id="dyPriceSpec">
						<c:forEach var="i" items="${dyPriceSpecList }">
							<option value="${i.code }" >${i.label }</option>
						</c:forEach>
						</select>

						</div>

					</div>

					<div class="ub upad-4 umar-l20">

						<div class="ub ub-ac uw-300">
						<div class="umar-r10 uw-80 ut-r">配送中心:</div>
						<select class="uselect easyui-combobox" style="width: 204px;"
						data-options="editable:false" name="dcBranchId" id="dcBranchId">
						<c:forEach var="i" items="${dcBranchList }">
							<option value="${i.branchId }" >${i.branchName }</option>
						</c:forEach>
						</select>

						</div>


						<div class="ub ub-ac uw-340">
						<div class="umar-r10 uw-100 ut-r">要货商品范围:</div>
						<select class="uselect easyui-combobox" style="width: 204px;"
						data-options="editable:false" name="selectGoodsSpec" id="selectGoodsSpec">
						<c:forEach var="i" items="${selectGoodsSpecList }">
							<option value="${i.key }" >${i.value }</option>
						</c:forEach>
						</select>

						</div>


						<div class="ub ub-ac">
						<div class="umar-r10 uw-80 ut-r">加价率(%):</div>
						<input id="markupRate" name="markupRate" type="text"
						class="uinp uinp-no-more" maxlength="50"
						readonly="readonly">
						</div>

					</div>

					<div class="ub upad-4">
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-100 ut-r">线上运营状态:</div>
							<input id="statusStr" name="statusStr" type="text"
							class="uinp uinp-no-more" maxlength="50"
							readonly="readonly">
							<input id="status" name="status" type="hidden">
						</div>

						<div class="ub ub-ac uw-320">
						<div class="umar-r10 uw-100 ut-r">最低进货金额:</div>
						<input id="minAmount" name="minAmount" type="text"
						class="uinp uinp-no-more" maxlength="50"
						readonly="readonly">

						</div>


						<div class="ub ub-ac">
							<div class="umar-r10 uw-100 ut-r">店铺面积(m<sup>2</sup>):</div>
							<input id="areaSize" name="areaSize" type="text" value=""
								class="uinp easyui-numberbox" data-options="min:0,precision:2">
						</div>


					</div>

					<div class="ub upad-4">

						<div class="ub ub-ac uw-340">
							<div class="umar-r10 uw-100 ut-r">线下运营状态:</div>
							<select class="uselect easyui-combobox" style="width: 204px;"
								data-options="editable:false" name="offlineStatus" id="offlineStatus">
								<c:forEach var="i" items="${offlineStatusList }">
									<option value="${i.code }" >${i.label }</option>
				               	</c:forEach>
							</select>
						</div>

						<div class="ub ub-ac">
							<div class="umar-r10 uw-80 ut-r">授信额度:</div>
							<input id="creditLimit" name="creditLimit" type="text" value=""
								class="uinp uw-200 easyui-numberbox" data-options="min:0,precision:2">
						</div>
						
						<div class="ub ub-ac uw-320">
							<div class="umar-r10 uw-110 ut-r">修改人:</div>
							<input id="updateUserName" name="updateUserName" type="text"
								class="uinp uinp-no-more" maxlength="50"
								readonly="readonly">
						</div>


					</div>

					<div class="ub upad-4 umar-l20">

						<div class="ub ub-ac">
							<div class="umar-r10 uw-80 ut-r">修改时间:</div>
							<input id="updateTimeStr" name="updateTimeStr" type="text"
								class="uinp uinp-no-more" maxlength="50"
								readonly="readonly">
						</div>
						
						<div class="ub ub-ac">
							<div class="umar-r10 uw-108 ut-r">建档人:</div>
							<input id="createUserName" name="createUserName" type="text"
								class="uinp uinp-no-more uw-200" maxlength="50"
								readonly="readonly">
						</div>

						<div class="ub ub-ac">
							<div class="umar-r10 uw-108 ut-r">建档时间:</div>
							<input id="createTimeStr" name="createTimeStr" type="text"
								class="uinp uinp-no-more" maxlength="50"
								readonly="readonly">
						</div>
					</div>

					<div class="ub upad-4 umar-l20">
						<div class="ub ub-ac ub-f1 umar-r36">
							<div class="umar-r10 uw-80 ut-r">备注:</div>
							<textarea id="remark" name="remark" class="uh-80 ubor uw-800"
								maxlength="100"></textarea>
						</div>
					</div>

				</div>
			</form>
		</div>


	</div>

	<div title="设备折旧费用" class="upad-8" data-options="fit:true,border:false" style="width: 100%; display: none;">
		<div class="ub ub-ac upad-8">
			<div class="ubtns">
				<button class="ubtns-item" onclick="saveEquipmentCostList()">保存</button>
				<button class="ubtns-item" onclick="closeDialogHandel()">关闭</button>
			</div>
		</div>
		<div class="ub uline"></div>
	<form id="gridFromgridEquipmentCost" class="ub ub-ver ub-f1 umar-t8">
	<table id="gridEquipmentCost" class="umar-t10 upad-8"></table>
	</form>

	</div>
	
	<div title="累计摊销费用" class="upad-8" data-options="fit:true,border:false" style="width: 100%; display: none;">
		<div class="ub ub-ac upad-8">
			<div class="ubtns">
				<button class="ubtns-item" onclick="saveAmortizeCostList()">保存</button>
				<button class="ubtns-item" onclick="closeDialogHandel()">关闭</button>
			</div>
		</div>
		<div class="ub uline"></div>
	<form id="gridFromgridAmortizeCost" class="ub ub-ver ub-f1 umar-t8">
	<table id="gridAmortizeCost" class="umar-t10 upad-8"></table>
	</form>

	</div>
	
	<div title="长期待摊费用" class="upad-8" data-options="fit:true,border:false" style="width: 100%; display: none;">
		<div class="ub ub-ac upad-8">
			<div class="ubtns">
				<button class="ubtns-item" onclick="saveFitmentCostList()">保存</button>
				<button class="ubtns-item" onclick="closeDialogHandel()">关闭</button>
			</div>
		</div>
		<div class="ub uline"></div>
	<form id="gridFromgridFitmentCost" class="ub ub-ver ub-f1 umar-t8">
	<table id="gridFitmentCost" class="umar-t10 upad-8"></table>
	</form>

	</div>

</div>