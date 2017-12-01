/**
 * Created by huangj02 on 2016/8/9.
 */
function goodsArchives() {
	this.selectTypeName = "categoryCode"
	// tree的提交参数
	this.treeParam = {
		categoryCode : '',
		supplierId : '',
		brandId : '',
		level : '',
	}
	// 获取当前选中的树相关参数
	this.currSelectTreeParam = {
		categoryId : '',
		categoryCode : '',
		categoryName : ''
	}
	// 树的请求地址
	this.treeUrls = [ {
		name : 'categoryCode',
		url : contextPath + '/common/category/getGoodsCategoryToTree'
	}, {
		name : 'brandId',
		url : contextPath + '/common/brand/getBrandToTree'
	}, {
		name : 'supplierId',
		url : contextPath + '/common/supplier/getSupplierToTree'
	} ];
	this.getTreeUrl = function(name) {
		var httpUrl = ""
		$.each(this.treeUrls, function(i, v) {
			if (v.name == name) {
				httpUrl = v.url;
				return false
			}
		});
		return httpUrl
	}
}
var goodsClass = new goodsArchives();

$(function() {
	$('#eliminate_div').addClass('hide');
	$('#selectBranches').addClass('hide');
	
	initView();
	initTreeArchives();
	// 初始化机构ID，机构名称
	$("#branchId").val(sessionBranchId);
	$("#branchName").val(sessionBranchCodeName);
	$("#branchType").val(sessionBranchType);
	initDatagridOrders();

	// 商品过滤单选框
	changeStatus();

	//机构选择初始化 分组
	$('#branchGroupComponent').branchSelect({
		loadFilter:function(data){
			data.branchType = data.type;
			return data;
		}
	});
	
	var a = $('input:radio[name="status"]:checked').val();
	
	// 如果是机构未引入商品，则隐藏 机构名称、机构编码两列
	changeGridColumn(a);
	
});



function initView() {
	$('#goodsType').combobox({
		valueField : 'id',
		textField : 'text',
		data : [ {
			id : 'categoryCode',
			text : '类别',
			selected : true,
		}, {
			id : 'brandId',
			text : '品牌'
		}, {
			id : 'supplierId',
			text : '供应商'
		} ],
		onSelect : function(record) {
			goodsClass.selectTypeName = record.id;
			initTreeArchives();
		},
	});
}

// 初始树
function initTreeArchives() {
	var args = {}
	var httpUrl = goodsClass.getTreeUrl(goodsClass.selectTypeName);
	$.get(httpUrl, args, function(data) {
		var setting = {
			data : {
				key : {
					name : 'codeText',
				}
			},
			callback : {
				onClick : zTreeOnClick
			}
		};
		$.fn.zTree.init($("#treeArchives"), setting, JSON.parse(data));
		var treeObj = $.fn.zTree.getZTreeObj("treeArchives");
		var nodes = treeObj.getNodes();
		if (nodes.length > 0) {
			treeObj.expandNode(nodes[0], true, false, true);
		}
	});
}
// 选择树节点
function zTreeOnClick(event, treeId, treeNode) {
	if (goodsClass.selectTypeName == "categoryCode") {
		// 获取当前选中的”类别“相关参数
		goodsClass.currSelectTreeParam = {
			categoryId : treeNode.id,
			categoryCode : treeNode.code,
			categoryName : treeNode.text
		}
		goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.code;
		// 将选中树参数值传入表单
		$("#categoryCode").val(treeNode.code);
		$("#brandId").val('');
		$("#supplierId").val('');
	} else if (goodsClass.selectTypeName == "brandId") {
		goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.id;

		// 将选中树参数值传入表单
		$("#categoryCode").val('');
		$("#brandId").val(treeNode.id);
		$("#supplierId").val('');
	} else {
		goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.id;
		// 将选中树参数值传入表单
		$("#categoryCode").val('');
		$("#brandId").val('');
		$("#supplierId").val(treeNode.id);
	}
	gridReload("gridOrders", goodsClass.treeParam, goodsClass.selectTypeName);
};

function gridReload(gridName, httpParams, selectTypeName) {
	switch (selectTypeName) {
	case "categoryCode": // 类别
		httpParams.supplierId = "";
		httpParams.brandId = "";
		break;
	case "brandId": // 品牌
		httpParams.categoryCode = "";
		httpParams.supplierId = "";
		break;
	case "supplierId": // 供应商
		httpParams.categoryCode = "";
		httpParams.brandId = "";
		break;
	}
	$("#" + gridName).datagrid("options").url = contextPath
			+ '/branch/goods/listData';
	$("#" + gridName).datagrid("options").queryParams = $("#queryForm")
			.serializeObject();
	$("#" + gridName).datagrid("options").method = "post";
	$("#" + gridName).datagrid("load");
}

function changeStatus() {
	$(".radioItem").change(function() {
		query();

		var a = $(this).val();
		// 导入有用
		$("#status_3").val(a);
		
		// 如果是机构未引入商品，则隐藏 机构名称、机构编码两列
		changeGridColumn(a);
	});
}

// 如果是机构未引入商品，则隐藏 机构名称、机构编码两列
function changeGridColumn(a){

}

var gridHandel = new GridClass();

var gridName = "gridOrders";

// 初始化表格
function initDatagridOrders() {
	gridHandel.setGridName("gridOrders");
	 $("#"+gridName).datagrid({
		// title:'普通表单-用键盘操作',
		method : 'post',
		align : 'center',
		url : '',
		singleSelect : false, // 单选 false多选
		rownumbers : true, // 序号
		pagination : true, // 分页
		fitColumns : true, // 每列占满
		// fit:true, //占满
		showFooter : true,
		pageSize : 20,
		height : '100%',
		columns : [ [ {
			field : 'check',
			checkbox : true
		}, {
			field : 'branchId',
			title : '机构ID',
			width : 0,
			align : 'left',
			hidden : true
		}, {
			field : 'id',
			title : '店铺商品ID',
			width : 0,
			align : 'left',
			hidden : true
		}, {
			field : 'skuId',
			title : '标准商品ID',
			width : 0,
			align : 'left',
			hidden : true
		}, {
			field : 'branchName',
			title : '机构名称',
			width : 150,
			align : 'left'
		}, {
			field : 'branchCode',
			title : '机构编码',
			width : 80,
			align : 'left'
		}, {
			field : 'skuCode',
			title : '货号',
			width : 80,
			align : 'left',
            formatter: function(value,row,index){
            	return value;
                /*var branchName = row.branchName;
                var status = row.status;
                if( status != 0 || undefined == branchName || null == branchName || branchName.indexOf('分公司') < 0){
                    return value;
                }else{
                    return "<a href='#' onclick=\"openPropEditDialog('" + row.id + "')\" class='ualine'>"+value+"</a>";
                }*/
            }
		}, {
			field : 'skuName',
			title : '商品名称',
			width : 170,
			align : 'left'
		}, {
			field : 'barCode',
			title : '条码',
			width : 100,
			align : 'left'
		}, {
			field : 'statusDesc',
			title : '商品状态',
			width : 70,
			align : 'left'
		}, {
			field : 'purchaseSpec',
			title : '进货规格',
			width : 100,
			align : 'right',
			formatter : function(value, row, index) {
				return formatTwoDecimal(value);
			}
		},{
			field : 'distributionSpec',
			title : '配送规格',
			width : 100,
			align : 'right',
			formatter : function(value, row, index) {
				return formatTwoDecimal(value);
			}
		},{
			field : 'fastDeliverStr',
			title : '是否直送商品',
			width : 80,
			align : 'center'
		},{
			field : 'salePrice',
			title : '零售价',
			width : 100,
			align : 'right',
			formatter : function(value, row, index) {
				return formatTwoDecimal(value);
			}
		}, {
			field : 'actual',
			title : '实际库存',
			width : 100,
			align : 'right',
			formatter : function(value, row, index) {
				return formatTwoDecimal(value);
			}
		},{
			field : 'updateUserName',
			title : '操作人',
			width : 100,
			align : 'left'
		},{
			field : 'updateTimeStr',
			title : '操作时间',
			width : 120,
			align : 'left'
		} ] ],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
	});
	

}

// 搜索导出清除左侧条件
function cleanLeftParam() {
	$("#categoryCode").val('');
	$("#brandId").val('');
	$("#supplierId").val('');
}

function query() {
	// 去除左侧选中值
	cleanLeftParam();
	// 去除左侧选中样式
	$('.zTreeDemoBackground a').removeClass('curSelectedNode');
	$("#gridOrders").datagrid("options").queryParams = $("#queryForm")
			.serializeObject();
	$("#gridOrders").datagrid("options").url = contextPath
			+ '/branch/goods/listData';
	$("#gridOrders").datagrid("options").method = "post";
	$("#gridOrders").datagrid("load");
}

/**
 * 多机构引入选择机构
 */
function selectBranches() {
	if (getSkuIds() == ''){
		$_jxc.alert("未选择商品");
		return;
	}
	var branchTypesStr;
	var branchId;
	var formType;
	if ($("#branchType").val() == $_jxc.branchTypeEnum.HEAD_QUARTERS) {
		formType = "DV";
	} else if ($("#branchType").val() == $_jxc.branchTypeEnum.BRANCH_COMPANY) {
		branchId = $("#branchId").val();
		formType = "DF";
	} else {
		branchId = $("#branchId").val();
		formType = "DF";
	}
	var param ={
		selectType : 1,
		//type : 'NOTREE',
		view : 'group',
		branchId : branchId,
		formType:formType
	}
	publicBranchesService(param,function(data){
		if(data == 'NO')return;
		if(data && data.length>0){
			var ids = [];
			var type;
			data.forEach(function(obj,inx){
				type = obj.type;
				ids.push(obj.branchId);
			})
			console.log('data',data);
			console.log('ids',ids);
			if(ids.length == 0) return;
			if(type == -1){
				var param = {
						"groupIds":ids.join(',')
				}
				//拉取分组详细
				publicGetBranchGroupDetail(param,function(result){
					if(result&&result.branchId){
						$_jxc.confirm('是否引入所选机构未引入的商品', function(data) {
							if (data) {
								console.log('branchIdList',result.branchId);
								branchesLeadInto(result.branchId);
							}
						});
					}
				})
			} else{
				$_jxc.confirm('是否引入所选机构未引入的商品', function(data) {
					console.log('ids2',ids);
					if (data) {
						branchesLeadInto(ids.join(','));
					}
				});
			}
		}
	})
}

function branchesLeadInto(branchesId){
	var skuIds = getSkuIds();
	$_jxc.ajax({
		url : contextPath + "/branch/goods/branchesLeadInto",
		type : "POST",
		data : {
			'branchesId' : branchesId,
			'skuIds' : skuIds
		}
	},function(result){
		if (result['code'] == 0) {
			$_jxc.alert(result.data);
		} else {
			$_jxc.alert(result['message']);
		}
		var dg = $("#gridOrders");
		dg.datagrid('reload');
	});
}

function getSkuIds(){
	var dg = $("#gridOrders");
	var rows = dg.datagrid("getSelections");
	if (!rows || rows.length == 0) {
		return '';
	}
	var skuIds = '';
	var branchId = $("#branchId").val();

	for ( var i in rows) {
		var row = rows[i];
		skuIds += row.skuId + ',';
	}
	return skuIds;
}

function enable() {
	var dg = $("#gridOrders");
	var rows = dg.datagrid("getSelections");
	if (!rows || rows.length == 0) {
		$_jxc.alert("未选择商品");
		return;
	}
	var skuIds = '';
	var branchId = $("#branchId").val();

	for ( var i in rows) {
		var row = rows[i];
		skuIds += row.skuId + ',';
	}
	$_jxc.confirm('是否要启用已选择的商品', function(data) {
		if (data) {
			enableAjax(skuIds, branchId, contextPath + "/branch/goods/enable");
		}
	});
}

function enableAjax(skuIds, branchId, url) {
	$_jxc.ajax({
		url : url,
		data : {
			skuIds : skuIds,
			branchId : branchId
		}
	},function(result){
		if (result['code'] == 0) {
			$_jxc.alert("启用成功");
		} else {
			$_jxc.alert(result['message']);
		}
		var dg = $("#gridOrders");
		dg.datagrid('reload');
	});
}

// 批量淘汰商品
function eliminate() {
	var dg = $("#gridOrders");
	var rows = dg.datagrid("getSelections");
	if (!rows || rows.length == 0) {
		$_jxc.alert("未选择商品");
		return;
	}
	var goodsStoreSkuIds = '';
	var branchName = $("#branchName").val();
	for ( var i in rows) {
		var row = rows[i];
		if (row.actual != null && row.actual != 0) {
			$_jxc.alert(branchName + "机构的" + row.skuName + "商品库存不为0,不能进行淘汰操作");
			return;
		}
		goodsStoreSkuIds += row.skuId + ',';
	}
	var branchId = $("#branchId").val();
	$_jxc.confirm('是否要淘汰该商品?', function(data) {
		if (data) {
			$_jxc.ajax({
				url : contextPath + "/branch/goods/eliminateGoodsStoreSku",
				data : {
					goodsStoreSkuIds : goodsStoreSkuIds,
					branchId : branchId
				}
			},function(result){
				
				if (result['code'] == 0) {
					$_jxc.alert("淘汰商品成功");
				} else {
					$_jxc.alert(result['message']);
				}
				dg.datagrid('reload');
			});
		}
	});
}

// 批量恢复商品
function recovery() {
	var dg = $("#gridOrders");
	var rows = dg.datagrid("getSelections");
	if (!rows || rows.length == 0) {
		$_jxc.alert("未选择商品");
		return;
	}
	var params = '';
	for ( var i in rows) {
		var row = rows[i];
		if (row.actual == null) {
			$_jxc.alert(row.branchName + "机构的" + row.skuName + "商品库存不存在,不能进行恢复操作");
			return;
		}
		params += row.id + "," + row.skuId + ',' + row.branchId + "|";
	}
	$_jxc.confirm('是否要恢复该商品?', function(data) {
		if (data) {
			$_jxc.ajax({
				url : contextPath + "/branch/goods/recoveryGoodsStoreSku",
				data : {
					skuObjs : params
				}
			},function(result){
				if (result['code'] == 0) {
					$_jxc.alert("恢复商品成功");
				} else {
					$_jxc.alert(result['message']);
				}
				dg.datagrid('reload');
			});
		}
	});
}

/**
 * 重置
 */
function resetForm() {
	$("#queryForm").form('clear');
	$('#status_0').click();
};

$(document).on('change', '#excelFile', function() {
	var value = $(this).val();
	$('#filename').val(value);
});

// 隐藏显示引入、淘汰、恢复按钮
$(document).on('change', "input[name='status']", function() {
	var check = $(this).prop('checked');
	var value = $(this).val();
	if (value == 0) {
		$('#eliminate_div').removeClass('hide');
		$('#recovery_div').removeClass('hide');
		$('#selectBranches').removeClass('hide');
	} else {
		$('#eliminate_div').addClass('hide');
		$('#recovery_div').addClass('hide');
		$('#selectBranches').addClass('hide');
	}
})

//打开属性编辑窗口
var addDalogTemp;
function openPropEditDialog(goodsBranchPriceId){
    addDalogTemp = $('<div/>').dialog({
        href: contextPath+"/branch/goods/tobranchGoodsPropEdit",
        queryParams:{
            goodsBranchPriceId:goodsBranchPriceId
        },
        width: 1000,
        height: 600,
        title: "分公司商品-属性编辑",
        closable: true,
        resizable: true,
        onClose: function () {
            $(addDalogTemp).panel('destroy');
        },
        modal: true,
        onLoad: function () {
            
        }
    })
}

//关闭属性编辑窗口
function closeDialogHandel(){
    if(addDalogTemp){
        $(addDalogTemp).panel('destroy');
    }
}

//导入
function toImportproduct(type){
    var branchId = $("#branchId").val();
    var status = $("#status_3").val();
    if(!branchId){
        $_jxc.alert("请先选择收货机构");
        return;
    }
    var param = {
        url:contextPath+"/branch/goods/importList",
        tempUrl:contextPath+"/branch/goods/exportTemp",
        type:type,
        status:status,
        branchId:branchId,
    }
    new publicUploadFileService(function(data){
    	$("#gridOrders").datagrid("loadData",data);
    },param)
}


/**
 * 导出
 */
function exportData(){
    var length = $("#"+gridName).datagrid('getData').total;
    if(length == 0){
        $_jxc.alert("无数据可导");
        return;
    }
    var param = {
        datagridId:'gridOrders',
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/branch/goods/exportHandel"
    }
    publicExprotService(param);
}


