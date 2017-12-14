/**
 * Created by zhaoly on 2017/5/26.
 */
var tabKey = 'depreciation';
var  costTitle = '开店成本(均摊含折旧)';
$(function () {
   /* initGridDayAnalysis();*/
	 // 初始化表格
	initGridByGpeGridColumns();
    toChangeDate(1);
    changeStatus();
})

//单据状态切换
function changeStatus(){
    $(".radioItem.costType").change(function(){
        if($(this).val() === "0"){
            costTitle = '开店成本(均摊含折旧)';
            type="depreciation";
        }else{
            costTitle = '开店成本(均摊不含折旧)';
            type="unDepreciation";
        }
        $("#"+gridName).datagrid('loadData', { total: 0, rows: [] }); 
        $("#"+gridName).datagrid("options").url = "";
    	
        tabKey=type;
        initGridByGpeGridColumns();
        $('#'+gridName).datagrid('reloadFooter',[]);
        //queryDayAnalysis();
       
    });
}

var gridName = "gridDayAnalysis";
var gridHandel = new GridClass();
var dg = null;
function initGridDayAnalysis(columns,frozenColumns) {
    gridHandel.setGridName(gridName);
    dg = $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        showFooter:true,
        singleSelect:true,
        height:'100%',
        width:'100%',
        fitColumns:true,    //每列占满
        columns : columns,
		frozenColumns : frozenColumns,
		onBeforeLoad : function(data) {
			gridHandel.setDatagridHeader("center");
		}
    })

}

/**
 * 机构名称
 */
function selectListBranches(){
	new publicAgencyService(function(data){
        $("#branchId").val(data.branchesId);
        $("#branchCompleCode").val(data.branchCompleCode);
        $("#branchCodeName").val("["+data.branchCode+"]" + data.branchName);
    },'BF','');
}


function queryDayAnalysis() {
	//搜索需要将左侧查询条件清除
	$("#startCount").val('');
	$("#endCount").val('');
    $("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    var startTime =  $("#txtStartDate").val();
    var endTime = $("#txtEndDate").val();
    if(DateDiff(startTime,endTime) > 60){
        $_jxc.alert("日盈亏平衡点报表查询天数不能超过60");
        return;
    }

    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/report/bepDayAnalysis/list';
    $("#"+gridName).datagrid("load");
}

function  DateDiff(sDate1,  sDate2){
    var  aDate,  oDate1,  oDate2,  iDays
    aDate  =  sDate1.split("-")
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2002格式
    aDate  =  sDate2.split("-")
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
    return  iDays
}

/**
 * 导出
 */
function exportData(){
	var length = $("#"+gridName).datagrid('getData').rows.length;
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
 * GPE获取columns
 */
function initGridByGpeGridColumns(){
	// 初始化表格
	publicGpeGridColumns({
		tabKey : tabKey,
		onLoadSuccess:function(columns,frozenColumns){
			initGridDayAnalysis(columns,frozenColumns);
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
			initGridDayAnalysis(columns,frozenColumns);
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