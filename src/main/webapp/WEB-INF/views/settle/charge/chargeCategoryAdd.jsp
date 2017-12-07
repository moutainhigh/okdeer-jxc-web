<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>

<title>建店费用类别</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/settle/charge/editChargeCategory.js?V=${versionNo}3"></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="saveCategroyCode()" id="saveBtn">保存</button>
			<button class="ubtns-item" onclick="closeCategoryCodeDialog()">关闭</button>
		</div>
	</div>
	<div class="ub uline"></div>
	<form id="financeAdd">
		<input type="hidden" name="pCategoryId" id="pCategoryId" />
		<input type="hidden" name="categoryLevel" id="categoryLevel" />
		<div class="ub ub-ver upad-4">
			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">编号:</div>
					<input class="uinp  ub ub-f1" type="text" id="categoryCode" disabled="disabled"
						placeholder="编号为4位数字" name="categoryCode" maxlength="4" /> <input
						type="hidden" name="id" id="id" />
				</div>
				<i class="ub uc-red">*</i>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">名称:</div>
					<input class="uinp ub ub-f1" type="text"
						id="categoryName" name="categoryName" maxlength="20" />
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
					<div class="umar-r10 uw-30 ut-r"></div>
					<div id="cbDiv">
						<label for="ckbSave" id="ckbSaveLabel"><input id="ckbSave"
							type="checkbox" checked="checked">保存后自动更新</label>
					</div>

				</div>
			</div>

		</div>
	</form>
</div>

