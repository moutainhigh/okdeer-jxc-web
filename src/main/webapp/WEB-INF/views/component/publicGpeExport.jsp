<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/component/publicGpeExport.js"></script>
<style>
	<%--#gpeExportDiv{--%>
		<%--font-size:16px;--%>
	<%--}--%>
	
</style>
<div id="gpeExportDiv" class="ub ub-ver ub-pc ub-ac uw uh ub-f1">
	<div class="ub ub-ver ub-f1 umar-l20 upad-20">
		<form id="gpeExportDataForm" method="post">
			<div class="ub umar-20">
			<div class="umar-r10 ut-r panel-title">请选择导出选项</div>
			</div>
			<div class="ub umar-20">
				<div class="umar-r10 ut-r">
					<label><input type="radio" name="chose" value="0" checked/>&nbsp;导出当前页</label>
				</div>
			</div>
	
			<div class="ub umar-20">
				<div class="umar-r10  ut-r">
					<label><input type="radio" name="chose" value="1" />&nbsp;全部页面（本次最大可导出条数为20000条）</label>
				</div>
			</div>
	
			<div class="ub umar-l20 umar-r20 umar-t20 umar-b10">
				<div class="ub ub-ac">
					<label><input type="radio" name="chose" value="2" />&nbsp;自定义页面（手动填写条数，最大20000条）</label>
					<span class="umar-t4">当前搜索结果共<span
					id="totalRows"></span>条</span>
				</div>
			</div>
	
			<div class="ub umar-l40">
				<div class="ub ub-ac">
					<input type="text" id="startRow" name="startRow" style="width: 80px; height:24px;" class="uinp uw-200" onkeyup="checkNumber(this);" onafterpaste="checkNumber(this);">
					条&nbsp;-&nbsp;
					<input type="text" id="endRow" name="endRow" style="width: 80px; height:24px;" class="uinp uw-200" onkeyup="checkNumber(this);" onafterpaste="checkNumber(this);">
					条
				</div>
			</div>

			<div class="ub umar-20">
			<div class="ub ub-ac">
			<a href="javascript:void(0)" class="easyui-linkbutton"
			icon="icon-ok" onclick="toGpeExportOk();">确认</a> &nbsp;&nbsp; <a
			href="javascript:void(0)" class="easyui-linkbutton"
			icon="icon-cancel" onclick="toGpeExportCancel()">取消</a>
			</div>
			</div>
	
			<%--<input type="hidden" id="startCount" name="startCount" />--%>
			<%--<input type="hidden" id="endCount" name="endCount" />--%>
		</form>
	</div>
</div>