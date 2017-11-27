/**
 * Created by wxl on 2016/08/17.
 * 商品毛利率报表
 */
$(function() {
    //开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	
	//选择报表类型
	 // 初始化表格
	publicGpeGridColumns({
		onLoadSuccess:function(columns,frozenColumns){
			initGoodsTotalAnalysiGrid(columns,frozenColumns);
		}
	});
	
	$('#branchSelects').branchSelect();

	//商品类别选择组件
	$('#categoryNameDiv').categorySelect({
        onAfterRender:function(data){
            $("#goodsCategoryId").val(data.goodsCategoryId);
            $("#categoryCode").val(data.categoryCode);
            // $("#categoryCode").val(data.categoryCode);
        }
    });
	
});

var gridHandel = new GridClass();

var gridName = "goodsStoreSaleList";
/**
 * 初始化表格按  商品
 * @param queryType
 */
function initGoodsTotalAnalysiGrid(columns,frozenColumns) {
	gridHandel.setGridName(gridName);
   dg =  $("#"+gridName).datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        showFooter:true,
        pageSize : 50,
        pageList : [20,50,100],//可以设置每页记录条数的列表
        showFooter:true,
        height:'100%',
        columns : columns,
        frozenColumns : frozenColumns,
		onLoadSuccess:function(param){
			gridHandel.setDatagridHeader("center");
			//updateFooter();
		}
    });
   
   //价格权限 2.7
   var param = {
   		costPrice:['stockAmout','costAmount','idAmount']	
   }
   priceGrantUtil.grantPrice(gridName,param);
}


/**
 * 查询
 */
function query(){
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchName = $("#branchName").val();
	if(!(startDate && endDate)){
		$_jxc.alert('日期不能为空');
		return ;
	}
	$("#startCount").attr("value",null);
	$("#endCount").attr("value",null);
	var formData = $("#queryForm").serializeObject();
	$("#"+gridName).datagrid("options").queryParams = formData;
	$("#"+gridName).datagrid("options").method = "post";
	$("#"+gridName).datagrid("options").url =  contextPath+"/report/store/sell/list";
	$("#"+gridName).datagrid("load");
}
var dg;
/**
 * 导出
 */
function exportData(){
	var length = $('#'+gridName).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	$('#exportWin').window({
		top:($(window).height()-300) * 0.5,   
	    left:($(window).width()-500) * 0.5
	});
	$("#exportWin").show();
	$("#totalRows").html(dg.datagrid('getData').total);
	$("#exportWin").window("open");
}
/**
 * 导出
 */
function exportExcel(){
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchName = $("#branchName").val();
	if(!(startDate && endDate)){
		$_jxc.alert('日期不能为空');
		return ;
	}
	var length = $("#"+gridName).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	$("#queryForm").attr("action",contextPath+'/report/store/sell/export/list');
	$("#queryForm").submit();	
}

/**
 * 重置
 */
var resetForm = function(){
	location.href=contextPath+"/report/store/sell";
};

var printReport = function(){
    var length = $('#'+gridName).datagrid('getData').total;
    if(length == 0){
        $_jxc.alert("没有数据");
        return;
    }
    var queryParams =  urlEncode($("#queryForm").serializeObject());
    parent.addTabPrint("reportPrint"+new Date().getTime(),"打印",contextPath+"/report/store/sell/print?params="+queryParams);
}

var urlEncode = function (param, key, encode) {
    if(param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};
/**
 * GPE设置
 */
function toGpeSetting() {
	publicGpeSetting({
		onSettingChange:function(columns,frozenColumns){
			initGoodsTotalAnalysiGrid(columns,frozenColumns);
		}
	});
}

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : gridName,
		queryParams : $("#queryForm").serializeObject()
	});
}