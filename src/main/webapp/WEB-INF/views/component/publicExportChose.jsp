<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/component/publicExportChose.js"></script>
	<style>
	.panel-title {
		font-size: 14px;
		font-weight: bold;
		color: #0E2D5F;
		height: 16px;
		line-height: 16px;
	}
	</style>
<div id="exportWin" class="ub ub-ver ub-pc ub-ac uw uh ub-f1">
	<div class="ub ub-ver ub-f1 umar-l20 upad-20">
		<form id="exportDataForm" method="post">
		<div class="ub umar-20">
				<div class="umar-r10 ut-r panel-title">请选择导出选项</div>
		</div>

		<div class="ub umar-20">
		<div class="umar-r10  ut-r">
			<label>
			<input type="radio" name="chose" value="0" checked/>导出当前页
			</label>
		</div>
		</div>

		<div class="ub umar-20">
			<div class="umar-r10  ut-r">
			<label>
					<input type="radio" name="chose" value="1" />全部页面（本次最大可导出条数为20000条）
			</label>
			</div>
		</div>

		<div class="ub umar-20">
			<div class="ub ub-ac">
			<label>
						<input type="radio" name="chose" value="2" />自定义页面（手动填写条数，最大20000条）
			</label>
				<span class="umar-t4">当前搜索结果共<span
							id="totalRows"></span>条</span>
			</div>
		</div>

		<div class="ub umar-20">
				<div class="ub ub-ac">
				<input type="text" id="startRow" name="startRow"
				style="width: 60px;" onkeyup="checkNumber(this);"
				onafterpaste="checkNumber(this);">条&nbsp;-&nbsp; <input
				type="text" id="endRow" name="endRow" style="width: 60px;"
				onkeyup="checkNumber(this);" onafterpaste="checkNumber(this);">条
				</div>
		</div>

		<div class="ub umar-20">
			<div class="ub ub-ac">
			<a href="javascript:void(0)" class="easyui-linkbutton"
			icon="icon-ok" onclick="sureExportExcel();">确认</a> &nbsp;&nbsp; <a
			href="javascript:void(0)" class="easyui-linkbutton"
			icon="icon-cancel" onclick="toCancel()">取消</a>
			</div>
		</div>
			<input type="hidden" id="startCount" name="startCount" />
			<input type="hidden" id="endCount" name="endCount" />
		</form>
	</div>
</div>