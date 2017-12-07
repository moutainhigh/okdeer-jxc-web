

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>

<title>新增开店费用档案</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="/static/js/views/purchase/orderAdd.js?V="></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="save()" id="saveBtn">保存</button>
			<button class="ubtns-item" onclick="closeDialog()">关闭</button>
		</div>
	</div>
	<div class="ub uline"></div>
	<form id="financeAdd">
		<div class="ub ub-ver upad-4">
			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">编号:</div>
					<input class="uinp ub ub-f1" type="text" id="financeCode"
						name="financeCode" value="${financeFormVo.financeCode}"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">名称:</div>
					<input class="uinp ub ub-f1" type="text" id="financeName"
						name="financeName" value="${financeFormVo.financeName}"
						maxlength="50" />
				</div>

			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">类别:</div>
					<input class="uinp ub ub-f1" type="text" id="financeCode"
						name="financeCode" value="${financeFormVo.financeCode}"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">品牌:</div>
					<input class="uinp ub ub-f1" type="text" id="financeName"
						name="financeName" value="${financeFormVo.financeName}"
						maxlength="50" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">单位:</div>
					<input class="uinp ub ub-f1" type="text" id="financeCode"
						name="financeCode" value="${financeFormVo.financeCode}"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">规格:</div>
					<input class="uinp ub ub-f1" type="text" id="financeName"
						name="financeName" value="${financeFormVo.financeName}"
						maxlength="50" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">产地:</div>
					<input class="uinp ub ub-f1" type="text" id="financeCode"
						name="financeCode" value="${financeFormVo.financeCode}"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">采购价:</div>
					<input class="uinp ub ub-f1" type="text" id="financeName"
						name="financeName" value="${financeFormVo.financeName}"
						maxlength="50" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">拆旧期限:</div>
					<input class="uinp ub ub-f1" type="text" id="financeCode"
						name="financeCode" value="${financeFormVo.financeCode}"
						maxlength="50" />
				</div>

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">保修期限:</div>
					<input class="uinp ub ub-f1" type="text" id="financeName"
						name="financeName" value="${financeFormVo.financeName}"
						maxlength="50" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">财务分类:</div>
					<input class="uinp ub ub-f1" type="text" id="description"
						name="description" value="${financeFormVo.description}"
						maxlength="50" />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">

				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">备注:</div>
					<input class="uinp ub ub-f1" type="text" id="description"
						name="description" value="${financeFormVo.description}"
						maxlength="50" />
				</div>
			</div>
		</div>
	</form>
</div>

