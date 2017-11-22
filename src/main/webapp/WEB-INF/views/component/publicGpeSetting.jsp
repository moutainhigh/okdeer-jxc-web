<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/component/publicGpeSetting.js"></script>
<script src="${ctx}/static/libs/easyui/js/datagrid-dnd-gpe.js"></script>
<div class="ub ub-ver ub-pc ub-ac uw uh ub-f1">
	<div class="ub uw uh ub-f1">
		<div class="ub ub-ver uw uh ub-f1">
			<div class="ub uw uh ub-f1">
				<table id="gpeUserSettingGrid"></table>
			</div>
		</div>
	</div>
</div>