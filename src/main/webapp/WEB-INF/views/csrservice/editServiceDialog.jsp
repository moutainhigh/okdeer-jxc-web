
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>

<title>新增编辑服务代码</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/financeCode/editServiceDialog.js?V=${versionNo}3"></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="saveServiceCode()" id="saveBtn">保存</button>
			<button class="ubtns-item" onclick="closeServiceDialog()">关闭</button>
		</div>
	</div>
	<div class="ub uline"></div>
	<form id="financeAdd">
		<input type="hidden" name="dictTypeId" id="dictTypeId" />
		<div class="ub ub-ver upad-4">
			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">编号:</div>
					<input class="uinp  ub ub-f1" type="text" id="value"
						onkeyup="this.value=this.value.replace(/\D/g,'')"
						onafterpaste="this.value=this.value.replace(/\D/g,'')"
						placeholder="编号为4位数字" name="value" maxlength="4" /> <input
						type="hidden" name="id" id="id" />
				</div>
				<i class="ub uc-red">*</i>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">名称:</div>
					<input class="uinp ub ub-f1 easyui-validatebox" type="text"
						id="label" name="label" maxlength="20" />
				</div>
				<i class="ub uc-red">*</i>
			</div>

			<div class="ub upad-4 umar-t10">
			<div class="ub ub-ac">
			<div class="umar-r10 uw-70 ut-r">价格:</div>
			<input class="uinp ub ub-f1 easyui-numberbox" data-options="min:0,precision:2" type="text"
			id="price" name="price"/>
			</div>
			<i class="ub uc-red">*</i>
			</div>

			<div class="ub upad-4 umar-t10">

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">备注:</div>
					<input class="uinp ub ub-f1" type="text" id="remark" name="remark"
						maxlength="20" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">

			<div class="ub ub-ac">
			<div class="umar-r10 uw-70 ut-r"></div>
				<input id="ckbchangePrice" name="ckbchangePrice" type="checkbox"><label for="ckbchangePrice">可以改价</label>
			</div>
			</div>

		</div>
	</form>
</div>

