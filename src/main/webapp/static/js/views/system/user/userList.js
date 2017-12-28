/**
 * Created by huangj02 on 2016/8/9.
 */
$(function() {
	initDatagrid();
});

var gridHandel = new GridClass();
// 初始化表格

function initDatagrid() {
	var updatePermission = $("#updatePermission").html().trim();
	$("#dg")
			.datagrid(
					{
						// title:'普通表单-用键盘操作',
						method : 'post',
						align : 'center',
						url : contextPath + '/system/user/json',
						// toolbar: '#tb', //工具栏 id为tb
						singleSelect : true, // 单选 false多选
						rownumbers : true, // 序号
						pagination : true, // 分页
						fitColumns : true, // 每列占满
						fit : true, // 占满
						showFooter : true,
						columns : [ [
								{
									field : 'check',
									checkbox : true
								},
								{
									field : 'userCode',
									title : '帐号名',
									sortable : true,
									width : 100,
									formatter : function(value, row, index) {
										if (updatePermission) {
											return "<a style='text-decoration: underline;' onClick='toEdit(\""
													+ row.id
													+ "\")'>"
													+ value
													+ "</a>"
										} else {
											return value;
										}
									}
								},
								{
									field : 'userName',
									title : '用户名',
									sortable : true,
									width : 100
								},
								{
									field : 'mobile',
									title : '电话',
									sortable : true,
									width : 100
								},
								{
									field : 'branchCode',
									title : '机构编号',
									sortable : true,
									width : 100
								},
								{
									field : 'branchTypeStr',
									title : '机构类型',
									sortable : true,
									width : 100
								},
								{
									field : 'branchName',
									title : '机构名称',
									sortable : true,
									width : 220
								},
								{
									field : 'roleName',
									title : '角色名称',
									sortable : true,
									width : 220
								},
								{
									field : 'statusStr',
									title : '状态 ',
									sortable : true,
									width : 60,
									align : 'center'
								},
								{
									field : 'lastLoginTime',
									title : '最近使用时间',
									sortable : true,
									width : 100,
									formatter : function(value, rowData,
											rowIndex) {
										return formatDate(value);
									}
								} ] ],
						onLoadSuccess : function(data) {
							gridHandel.setDatagridHeader("center");
						}

					});
}

function query() {
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if (branchNameOrCode && branchNameOrCode.indexOf("[") >= 0
			&& branchNameOrCode.indexOf("]") >= 0) {
		formData.branchNameOrCode = null;
	}
	$("#dg").datagrid("options").queryParams = formData;
	$("#dg").datagrid("options").method = "post";
	$("#dg").datagrid("load");
}

/**
 * 机构列表下拉选
 */
function searchBranch() {
	new publicAgencyService(function(data) {
		$("#branchKeyword").val(data.branchName);
		/* $("#branchNameOrCode").val("["+data.branchCode+"]"+data.branchName); */
	}, "", "");
}

function toAdd() {
	openDialog(contextPath + "/system/user/toAddUser", "新增用户", "add");
}

function toEdit(id) {
	openDialog(contextPath + "/system/user/toEditUser?userId=" + id, "编辑用户",
			"edit");
}

var dalogTemp;
// 打开Dialog
function openDialog(argUrl, argTitle, argType) {
	dalogTemp = $('<div/>').dialog({
		href : argUrl,
		width : 800,
		height : 620,
		title : argTitle,
		closable : true,
		resizable : true,
		onClose : function() {
			$(dalogTemp).panel('destroy');
		},
		modal : true,
		onLoad : function() {
			if (argType == 'add') {
				// 默认禁用最大折扣率
				$("#maxDiscountRadio").numberbox({
					readonly : true
				});
			} else {
				// 根据当前用户角色的类型判断是否禁用最大折扣率
				var branchType = $("#roleBranchType").val();
				if (branchType == 3 || branchType == 4 || branchType == 5) {
					$("#maxDiscountRadio").numberbox({
						readonly : false
					});
				} else {
					$("#maxDiscountRadio").numberbox("setValue", 100);
					$("#maxDiscountRadio").numberbox({
						readonly : true
					});
				}
			}
		}
	})
}
function reloadDataGrid() {
	$("#dg").datagrid('reload');
	closeDialog();
}
function closeDialog() {
	if (dalogTemp) {
		$(dalogTemp).panel('destroy');
	}
}

/**
 * 启用状态
 */
function enable() {
	updateStatus(0);
}

/**
 * 禁用状态
 */
function disable() {
	updateStatus(1);
}

function updateStatus(status) {
	var rowData = $("#dg").datagrid("getSelected");

	if (rowIsNull(rowData)) {
		return;
	}

	var rowStatus = rowData.status;
	if (rowStatus == status) {
		var message = status == 0 ? "已经启用!" : "已经禁用!";
		$_jxc.alert(message);
		return;
	}

	var userId = rowData.id

	var uri = status == 0 ? "enableUser" : "disableUser";
	$_jxc.ajax({
		url : contextPath + "/system/user/" + uri,
		data : {
			"userId" : userId
		}
	},function(result){
        if(result['code'] == 0){
			$_jxc.alert("操作成功")
		}else {
            $_jxc.alert(result.message);
            $("#dg").datagrid('reload');
		}
	});
}

function createQrCode() {
    var rowData = $("#dg").datagrid("getSelected");
    if (rowIsNull(rowData)) {
        return;
    }
    var storage=window.localStorage;
    storage.userData = rowData;
    window.open(contextPath + "/system/user/toUserCodeList");
}