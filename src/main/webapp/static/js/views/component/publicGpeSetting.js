/**
 * Gpe自定义设置 Created by zhangqin on 2017/10/31
 */

// 实现字符串占位format
String.prototype.format = function() {
	if (arguments.length == 0)
		return this;
	for (var s = this, i = 0; i < arguments.length; i++) {
		s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
	}
	return s;
};

// 全局变量，由于弹窗均使用Div方式，故此处变量命名较长，尽量不与业务发生冲突
var _gpe_setting_params;
var _gpe_setting_callback;
var _gpe_setting_get_url;
var _gpe_setting_save_url;
var _gpe_setting_restore_url;
var _gpe_setting_grid_class;
var _gpe_setting_datagrid_id;
var _gpe_setting_datagrid;
var _gpe_setting_setting;

// 定义Class
function GpeSettingClass() {
	var path = getBasePath();
	_gpe_setting_get_url = path + '/gpesetting';
	_gpe_setting_save_url = path + '/gpesave';
	_gpe_setting_restore_url = path + '/gperestore';
	_gpe_setting_datagrid_id = "gpeUserSettingGrid"
	_gpe_setting_grid_class = new GridClass();
	_gpe_setting_grid_class.setGridName(_gpe_setting_datagrid_id);
}

// 初始化参数
GpeSettingClass.prototype.initGpeParams = function(params) {
	_gpe_setting_params = params || {};
}

// 初始化表格
GpeSettingClass.prototype.initGpeDataGrid = function() {
	$_jxc.ajax({
		url : _gpe_setting_get_url,
		data : _gpe_setting_params
	}, function(result) {
		initDataGrid(result);
	});
}

// 初始化回调
GpeSettingClass.prototype.initGpeDataGridCallback = function(callback) {
	_gpe_setting_callback = callback;
}

function initDataGrid(result) {
	_gpe_setting_setting = result;
	_gpe_setting_datagrid = $("#gpeUserSettingGrid").datagrid({
		method : 'post',
		align : 'center',
		singleSelect : true,
		rownumbers : true,
		pagination : false,
		fitColumns : false,
		showFooter : true,
		checkOnSelect : false,
		selectOnCheck : false,
		pageSize : 50,
		height : 520,
		width : '100%',
		data : result.fields,
		columns : [[
				{
					field : 'title',
					title : '显示文本',
					width : 300,
					editor : {
						type : 'textbox',
						options : {
							validType : {
								maxLength : [ 20 ]
							},
						}
					},
					styler : function(value, row, index) {
						return "background:url({0}/static/images/gpeline.png) no-repeat bottom left; background-size:{1}px 3px;"
								.format(contextPath, row.gwidth);
					}
				},
				{
					field : 'gwidth',
					title : '宽度',
					width : 60,
					formatter : function(value, row, index) {
						return value;
					},
					editor : {
						type : 'numberbox',
						options : {
							min : 0,
							max :300,
							precision : 0
						},
						onChange:function(){
							alert(1);
						}
					},
				},
				{
					field : 'gshow',
					title : '显示',
					width : 50,
					align : 'center',
					formatter : function(value, row, index) {
						var disabled = row.must ? 'disabled'
								: '';
						var checked = value ? 'checked' : '';
						return "<input type='checkbox' class='uw-16 uh-16' {0} {1}>"
								.format(disabled, checked);
					}
				},
				{
					field : 'pshow',
					title : '打印',
					width : 50,
					align : 'center',
					formatter : function(value, row, index) {
						var disabled = row.must ? 'disabled'
								: '';
						var checked = value ? 'checked' : '';
						return "<input type='checkbox' class='uw-16 uh-16' {0} {1}>"
								.format(disabled, checked);
					}
				},
				{
					field : 'eshow',
					title : '导出',
					width : 50,
					align : 'center',
					formatter : function(value, row, index) {
						var disabled = row.must ? 'disabled'
								: '';
						var checked = value ? 'checked' : '';
						return "<input type='checkbox' class='uw-16 uh-16' {0} {1}>"
								.format(disabled, checked);
					}
				},
				{
					field : 'must',
					title : '必须',
					width : 50,
					hidden : true,
					align : 'center',
					formatter : function(value, row, index) {
						var checked = value ? 'checked' : '';
						return "<input type='checkbox' class='uw-16 uh-16' disabled {0}>"
								.format(checked);
					}
				},
				{
					field : 'frozen',
					title : '冻结',
					hidden : true,
					width : 50,
					align : 'center',
					formatter : function(value, row, index) {
						var checked = value ? 'checked' : '';
						return "<input type='checkbox' class='uw-16 uh-16' {0}>"
								.format(checked);
					}
				}, {
					field : 'ctitle',
					title : '合并标题',
					width : 100,
					hidden : true,
					editor : {
						type : 'textbox',
						options : {
							validType : {
								maxLength : [ 20 ]
							},
						}
					}
				}, 
		]],
		onBeforeLoad : function() {
			_gpe_setting_grid_class.setDatagridHeader("center");
		},
		onLoadSuccess :function (data){
			$("#" + _gpe_setting_datagrid_id).datagrid('enableDnd');
		},
		onClickCell : function(index, field, value) {
			if (field == 'gshow' || field == 'pshow'
					|| field == 'eshow' || field == 'frozen') {
				onClickCheckBox(index, field, value);
			}
		}
	});
}



// 获取该功能路径
function getBasePath() {
	var path = window.location.pathname;
	return path.substring(0, path.lastIndexOf('/'));
}

// 复选框点击事件
function onClickCheckBox(index, field, value) {
	// 当前点击行
	var row = _gpe_setting_datagrid.datagrid("getRows")[index];
	var flag = false;
	// 判断点击的为哪一个复选框
	if (field == 'gshow') {
		// 是否显示
		row.gshow = value ? false : true;
        flag = row.gshow;
	} else if (field == 'pshow') {
		// 是否打印
		row.pshow = value ? false : true;
        flag = row.pshow;
	} else if (field == 'eshow') {
		// 是否导出
		row.eshow = value ? false : true;
        flag = row.eshow;
	} else if (field == 'frozen') {
		// 是否冻结
		row.frozen = value ? false : true;
        flag = row.frozen;
		// 冻结或取消冻结
		if (row.frozen) {
			// 冻结
			frozenRow(index);
		} else {
			// 取消冻结
			unfrozenRow(index);
		}
	}
    $("#gpeUserSettingGrid").datagrid("getPanel").
    find(".datagrid-btable").find("tr[datagrid-row-index="+index+"]").find("td[field="+field+"]").find("input[type='checkbox']").prop("checked",flag)
}

// 冻结
function frozenRow(sourceIndex) {
	// 所有行对象
	var rows = _gpe_setting_datagrid.datagrid('getRows');

	// 冻结的行
	var sourceRow = rows[sourceIndex];

	// 找到最后一个未冻结的行索引
	var newIndex = -1;
	$(rows).each(function(index, row) {
		if (row.frozen === false) {
			newIndex = index;
			return false;
		}
	});

	// 新索引最大只会和原索引相等，不会比原索引大
	if (newIndex < sourceIndex) {
		// 先删除，再新增
		_gpe_setting_datagrid.datagrid('deleteRow', sourceIndex).datagrid('insertRow', {
			index : newIndex,
			row : sourceRow
		});
		// 新增行启用拖拽
		_gpe_setting_datagrid.datagrid('enableDnd', newIndex);
	}
}

// 取消冻结
function unfrozenRow(sourceIndex) {
	// 所有行对象
	var rows = _gpe_setting_datagrid.datagrid('getRows');

	// 取消冻结的行
	var sourceRow = rows[sourceIndex];

	// 找到最后一个不包含自身行的未冻结的行索引
	var newIndex = -1;
	$(rows).each(function(index, row) {
		if (row.frozen === false && index != sourceIndex) {
			newIndex = index;
			return false;
		}
	});

	// 索新引一定会比原索引的下一行索引大
	if (newIndex > sourceIndex + 1) {
		// 新增行
		_gpe_setting_datagrid.datagrid('insertRow', {
			index : newIndex,
			row : sourceRow
		});
		// 新增行启用拖拽
		_gpe_setting_datagrid.datagrid('enableDnd', newIndex);
		// 删除行
		_gpe_setting_datagrid.datagrid('deleteRow', sourceIndex);
	}
}

// 回调
function gpeUserSettingGridCallback() {
	var url = getBasePath() + '/gpegridcolumns?tt=' + new Date().getTime();
	$_jxc.ajax({
		url : url,
		data : _gpe_setting_params,
		dataType : 'text'
	}, function(result) {
		// array[0]:正常的列，array[1]:冻结的列
		var array = eval(result);
		_gpe_setting_callback(array[0], array[1]);
	});
}

//保存
function gpeUserSettingGridSave() {
	// 结束编辑
	var rowIndex = _gpe_setting_datagrid.datagrid('getRowIndex', _gpe_setting_datagrid.datagrid('getSelected'));
	_gpe_setting_datagrid.datagrid("endEdit", rowIndex);

	// 获取最新行数据
	var rows = $("#gpeUserSettingGrid").datagrid("getRows");

	var frozenRow = [];
	var unFrozenRow = [];
	// 重新排序
	$(rows).each(function(index, element) {
		element.orders = index + 1;
		element['title'] = element['title'].trim();
        element['ctitle'] = element['ctitle'].trim();
		//得到冻结行的数据和非冻结行的数据
		if(element.frozen && element['ctitle'].length > 0){
            frozenRow.push(element);
		}else if(element.frozen == false && element['ctitle'].length > 0){
            unFrozenRow.push(element);
		}
	});

	var isAllow = true;
    $(frozenRow).each(function (i,f_item) {
		$(unFrozenRow).each(function (j,unf_itme) {
			if(f_item.ctitle === unf_itme.ctitle){
                isAllow = false;
                return false;
			}
        })
    })

	if(isAllow == false){
    	$_jxc.alert("冻结列和非冻结列不能有相同的合并标题。")
		return;
	}

	// 更新setting对象
	_gpe_setting_setting.fields = rows;
	_gpe_setting_params.setting = JSON.stringify(_gpe_setting_setting);

	// 提交保存
	$_jxc.ajax({
		url : _gpe_setting_save_url,
		data : _gpe_setting_params
	}, function(result) {
		if (result.code == 0) {
			$_jxc.alert("保存成功", function() {
				$("#columnSetting").dialog('destroy');
				gpeUserSettingGridCallback();
			});
		} else {
			$_jxc.alert("保存失败");
		}
	});
}

// 重置
function gpeUserSettingGridRestore() {
	// 提交重置
	$_jxc.ajax({
		url : _gpe_setting_restore_url,
		data : _gpe_setting_params
	}, function(result) {
		if (result.code == 0) {
			$_jxc.alert("重置成功", function() {
				gpeUserSettingGridCallback();
				$("#columnSetting").dialog('destroy');
			});
		} else {
			$_jxc.alert("重置失败");
		}
	});
}

// 取消
function gpeUserSettingGridCancel() {
	$('#gpeUserSettingGrid').panel('destroy');
}

// 展开
function gpeUserSettingGridExpand() {
	$('#gpeUserSettingGrid').datagrid('showColumn', 'must');
	$('#gpeUserSettingGrid').datagrid('showColumn', 'frozen');
	$('#gpeUserSettingGrid').datagrid('showColumn', 'ctitle');
}

// 折叠
function gepUserSettingGridCollapse() {
	$('#gpeUserSettingGrid').datagrid('hideColumn', 'must');
	$('#gpeUserSettingGrid').datagrid('hideColumn', 'frozen');
	$('#gpeUserSettingGrid').datagrid('hideColumn', 'ctitle');
}