$(function(){
	// initDatagridYueJXC();
	
	// 初始化表格
	initGridByGpeGridColumns();
	
    //机构选择初始化
	$('#branchComponent').branchSelect({
		//ajax参数
		param:{
			scope:1
		},
		//数据过滤
		loadFilter:function(data){
			data.isContainChildren = data.allBranch;
			return data;
		}
	});
	
});

var tabKey = 'byBranch';

function updateWdatePicker(){
	   WdatePicker({
       	dateFmt:'yyyy-MM',
       	maxDate:'%y-%M',
         onpicked:function(dp){
             $("input:radio[name='dateradio']").attr("checked",false);
         }
    })
}

var datagridId = "yueJXCList"

var gridHandel = new GridClass();
var gridHandelDetail = new GridClass();

var gridYueJXCList;

//初始化表格
function initDatagridYueJXC(columns,frozenColumns){
	gridHandel.setGridName(datagridId);
	gridYueJXCList = $("#"+datagridId).datagrid({
		method : 'post',
		align : 'center',
		singleSelect : false,
		rownumbers : true,
		pagination : true,
		fitColumns : false,
		showFooter : true,
		pageSize : 50,
		height : '100%',
		width : '100%',
		columns : columns,
		frozenColumns : frozenColumns
	});
    $("#"+datagridId).datagrid('loadData',[]);
    $("#"+datagridId).datagrid('reloadFooter',[]);
}

//查询
function queryForm(){
	if($("#branchName").val()=="" && $("#skuCodeOrBarCode").val()=="" ){
        $_jxc.alert("请选择机构或输入条码");
        return;
    } 
	$('#startCount').val('');
	$('#endCount').val('');
	var fromObjStr = $('#queryForm').serializeObject();
	$("#"+datagridId).datagrid("options").method = "post";
	$("#"+datagridId).datagrid('options').url = contextPath + '/report/month/finance/list';
	$("#"+datagridId).datagrid('load', fromObjStr);
	
	// 清除url，避免自动查询
	$("#"+datagridId).datagrid('options').url = null;
}


/**
 * 类别选择
 */
function searchCategory(){
	new publicCategoryService(function(data){
		$("#categoryCode").val(data.categoryCode);
		$("#categoryNameCode").val("["+data.categoryCode+"]"+data.categoryName);
	});
}

/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};

var dg;

var printReport = function(){
	var length = gridYueJXCList.datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	var queryParams =  urlEncode($("#queryForm").serializeObject());
	parent.addTabPrint("reportPrint"+new Date().getTime(),"打印",contextPath+"/report/month/print?params="+queryParams);
}


var urlEncode = function(param, key, encode) {
	if (param == null)
		return '';
	var paramStr = '';
	var t = typeof (param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&'
				+ key
				+ '='
				+ ((encode == null || encode) ? encodeURIComponent(param)
						: param);
	} else {
		for ( var i in param) {
			var k = key == null ? i
					: key
							+ (param instanceof Array ? '[' + i + ']'
									: '.' + i);
			paramStr += urlEncode(param[i], k, encode);
		}
	}
	return paramStr;
};

/**
 * 切换tabKey
 */
function changeTabKey(){
	$("#"+datagridId).datagrid('loadData', {
		total : 0,
		rows : []
	});
	$("#"+datagridId).datagrid('reloadFooter',[]);
	
	tabKey = $('input[type="radio"][name="tabKey"]:checked').val();
	initGridByGpeGridColumns();
}


/**
 * GPE获取列
 */
function initGridByGpeGridColumns(){
	publicGpeGridColumns({
		tabKey : tabKey,
		onLoadSuccess:function(columns,frozenColumns){
			initDatagridYueJXC(columns,frozenColumns);
		}
	});
}

/**
 * GPE设置
 */
function toGpeSetting(){
	publicGpeSetting({
		tabKey : tabKey,
		onSettingChange:function(columns,frozenColumns){
			initDatagridYueJXC(columns,frozenColumns);
		}
	});
}

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : datagridId,
		queryParams : $("#queryForm").serializeObject()
	});
}