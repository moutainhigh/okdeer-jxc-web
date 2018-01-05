<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/system/user/userEdit.js?V=${versionNo}"></script>
<div id="branchEdit" class="easyui-tabs"
	style="width: 100%; height: 100%;">
	<div title="基本信息" data-options="fit:true,border:false"
		style="width: 100%; padding: 10px; display: none;">
		<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
			<div class="ub ub-ac upad-4">
				<div class="ubtns">
					<button class="ubtns-item" onclick="editUser()">保存</button>
					<button class="ubtns-item" onclick="closeDialog()">关闭</button>
				</div>
			</div>
			<div class="ub uline "></div>
			<form id="editUserForm" class="uncenter" method="post">
				<div style="display: inline-block;">
					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">用户编码:</div>
							<input id="userCode" name="userCode" value="${user.userCode }"
								class="uinp uw-250" type="text" maxlength="4"
								readonly="readonly"> <input id="id" name="id"
								type="hidden" value="${user.id }" /> <i class="uc-red">*</i>
						</div>
					</div>
					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">用户名称:</div>
							<input id="userName" name="userName" value="${user.userName }"
								class="uinp uw-250  easyui-validatebox"
								data-options="required:true,validType:'userName'" type="text">
							<i class="uc-red">*</i>
						</div>
					</div>

					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">手机号:</div>
							<input id="mobile" name="mobile" value="${user.mobile }"
								class="uinp uw-250 easyui-validatebox"
								data-options="required:false,validType:'mobile'" type="text">

						</div>
					</div>
					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">所属机构:</div>
							<input class="uinp" type="hidden" id="opBranchId" name="branchId"
								value="${user.branchId }"> <input class="uinp"
								type="hidden" id="opBranchCode" name="branchCode"
								value="${branch.branchCode }"> <input class="uinp"
								type="hidden" id="opBranchType" name="opBranchType"
								value="${branch.type }"> <input class="uinp"
								type="hidden" id="opBranchCompleCode" name="opBranchCompleCode"
								value="${branch.branchCompleCode }">
							<div class="ub ub-ac">
								<input class="uinp uw-250" type="text" id="branchNameCode"
									name="branchNameCode"
									value="[${branch.branchCode }]${branch.branchName }"
									readonly="readonly" onclick="searchBranchInfo();">
								<div class="uinp-more" onclick="searchBranchInfo()">...</div>
							</div>
							<i class="uc-red">*</i>
						</div>
					</div>
					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">所属角色:</div>
							<input class="uinp" type="hidden" id="opRoleId" name="roleId"
								value="${role.id }"> <input class="uinp" type="hidden"
								id="opRoleCode" name="roleCode" value="${role.roleCode }">
							<input type="hidden" id="roleIdOld" name="roleIdOld"
								value="${role.id }"> <input type="hidden"
								id="roleCodeOld" name="roleCodeOld" value="${role.roleCode }">
							<input id="roleBranchType" value="${role.branchType }"
								type="hidden" />
							<div class="ub ub-ac">
								<input class="uinp uw-250" type="text" id="roleCodeOrName"
									name="roleCodeOrName" value="${role.roleName }"
									readonly="readonly" onclick="searchRole();">
								<div class="uinp-more" onclick="searchRole()">...</div>
							</div>
							<i class="uc-red">*</i>
						</div>
					</div>
					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">单品折扣最大比例:</div>
							<input id="maxDiscountRadio" name="maxDiscountRadio"
								class="uinp uw-230 easyui-numberbox easyui-validatebox"
								data-options="required:true,min:1,max:100,precision:0"
								type="text" value="${user.maxDiscountRadio }"> % <i
								class="uc-red">*</i>
						</div>
					</div>
					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">整单折扣最大比例:</div>
							<input id="billMaxDiscountRate" name="billMaxDiscountRate"
								class="uinp uw-230 easyui-numberbox easyui-validatebox"
								data-options="required:true,min:1,max:100,precision:0"
								type="text" value="${user.billMaxDiscountRate }"> % <i
								class="uc-red">*</i>
						</div>
					</div>
					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">备注:</div>
							<textarea id="remark" name="remark" class="uh-40 uw-250"
								maxlength="100">${user.remark }</textarea>
						</div>
					</div>


					<div class="ub umar-t20">

						<div class="ub ub-ac umar-120" id="checkBoxPrice">
							<div class="umar-r10 uw-80 ut-r">价格权限:</div>
							<!-- 如果调价为null默认是全部显示
								sale_price,cost_price,vip_price,purchase_price,wholesale_price,lowest_price,distribution_price
							 -->
							<input type="hidden" name="priceGrantStr" id="priceGrantStr"
								value="${user.priceGrant }" />

							<!-- 默认隐藏零售价、会员价
							<div class="ub ub-ac umar-r10">
								<label><input class="priceItem" type="checkbox"
									name="priceGrants" id="sale_price" value="sale_price"><span>零售价</span></label>
							</div>
							<div class="ub ub-ac umar-r10">
								<label><input class="priceItem" type="checkbox"
									name="priceGrants" id="vip_price" value="vip_price"><span>会员价</span></label>
							</div>
							 -->
							<div class="ub ub-ac umar-r10">
								<label><input class="priceItem" type="checkbox"
									name="priceGrants" id="purchase_price" value="purchase_price"><span>进货价</span></label>
							</div>

							<div class="ub ub-ac umar-r10">
								<label><input class="priceItem" type="checkbox"
									name="priceGrants" id="cost_price" value="cost_price"><span>成本价</span></label>
							</div>

							<div class="ub ub-ac umar-r10">
								<label><input class="priceItem" type="checkbox"
									name="priceGrants" id="distribution_price"
									value="distribution_price"><span>配送价</span></label>
							</div>
							<div class="ub ub-ac umar-r10">
								<label><input class="priceItem" type="checkbox"
									name="priceGrants" id="wholesale_price" value="wholesale_price"><span>批发价</span></label>
							</div>

						</div>

					</div>
				</div>
			</form>

		</div>

	</div>

	<div title="账号密码" data-options="fit:true,border:false"
		style="width: 100%; padding: 10px; display: none;">
		<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
			<div class="ub ub-ac upad-4">
				<div class="ubtns">
					<button class="ubtns-item" onclick="savePassword()">保存</button>
					<button class="ubtns-item" onclick="initPassword()">初始化密码</button>
					<button class="ubtns-item" onclick="closeDialog()">关闭</button>
				</div>
			</div>
			<div class="ub uline "></div>
			<form id="passwordForm" class="uncenter" method="post">
				<div style="display: inline-block;">

					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">账号名:</div>
							<input id="id" name="id" type="hidden" value="${user.id }" /> <input
								id="userCode" name="userCode" value="${user.userCode }"
								class="uinp uw-250 uinp-no-more easyui-textbox easyui-validatebox"
								readOnly="readonly"
								data-options="iconCls:'icon-man',iconWidth:38" type="text">
						</div>
					</div>

					<div class="ub umar-t20">
						<div class="ub ub-ac umar-l20">
							<div class="umar-r10 uw-60 ut-r">密码:</div>
							<input id="userPwd" name="userPwd" type="password"
								class="uh-40 uw-250 easyui-textbox  easyui-validatebox"
								data-options="required:true,validType:'length[8,18]',iconWidth:38,icons:[{iconCls:'icon-open',handler: iconOpenHandler}]">
							<i class="uc-red">*</i>
						</div>
					</div>



				</div>
			</form>

		</div>
	</div>

</div>





