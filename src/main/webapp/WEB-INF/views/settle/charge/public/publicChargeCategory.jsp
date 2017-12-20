<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>

<title>费用类别选择</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script
	src="${ctx}/static/js/views/settle/charge/public/publicChargeCategory.js?V=${versionNo}11"></script>
<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
<div class="ub ub-f1 umar-4 upad-4">
	<!--left-->
	<div class="ub ub-ver ubor uw-200">
		<div class="ub upad-4 ub-f1 uscroll">
			<div class="zTreeDemoBackground left">
				<ul id="treeChargeCategory" class="ztree"></ul>
			</div>
		</div>
	</div>
	<!--left end-->
	<div class="ub ub-ver ub-f1 upad-4">
		<div class="ub umar-t4">
			<form id="formCategoryList" action="">

				<div class="ub ub-ac umar-r10">
					<div class="umar-r10 ut-r">关键字:</div>
					<input class="uinp uw-380" type="text" name="categoryCodeName"
						id="categoryCodeName" placeholder="输入编号、名称进行查询"> <input
						type="hidden" name="categoryCode" id="categoryCode" />
					<input type="button" class="ubtn  umar-r10" value="查询"
					onclick="categoryCodeSearch()">
				</div>

			</form>
		</div>
		<div class="ub umar-t10 ub-f1">
			<table id="gridChargeCategoryDialogList"></table>
		</div>
	</div>

</div>
</div>
