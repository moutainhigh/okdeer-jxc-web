/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
var tabKey = 'total';
$(function() {
	// 开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    
    // 初始化表格
	initGridByGpeGridColumns();
	
    //选择报表类型
	changeTabKey();
	
	// 只允许分公司、店铺
	$('#branchComponent').branchSelect({
		param:{
            branchTypesStr:	$_jxc.branchTypeEnum.BRANCH_COMPANY +
				            ',' + $_jxc.branchTypeEnum.OWN_STORES +
				            ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_C +
				            ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_B
        }
	});
	
	disableFormNoElement(tabKey);
	
});

var datagridId = "gridbuildChargeSearch";

function changeTabKey(){
	$(".radioItem.tabKey").change(function(){
    	var type = $(this).val();

        /*initCashDailyGrid(type);*/
    	$("#"+datagridId).datagrid("options").url = "";
    	$("#"+datagridId).datagrid('loadData', { total: 0, rows: [] });
        tabKey = type;
        
        // 单号 文本框 不可用
        disableFormNoElement(tabKey);
        
    	// 重新初始表格
		initGridByGpeGridColumns();
    });
}

/**
 * 是否可用 单号 文本框
 * @param tabKey
 */
function disableFormNoElement(tabKey){
	if(tabKey == 'detail'){
		$("#formNo").removeProp("disabled");
	}else{
		$("#formNo").prop("disabled", true);
		$("#formNo").val('');
	}
}

function openChargeCodeDialog() {
	
	var param = {
		levels : [1, 2, 3]
	}
	
    new publicChargeCodeService(function (data) {
        $("#categoryCode").val(data.categoryCode);
        $("#categoryName").val(data.categoryName);
    }, param)
}

//查询
function queryForm(){
	if(!$("#branchCompleCode").val()){
        $_jxc.alert("请选择机构");
        return;
    } 
	var fromObjStr = $('#queryForm').serializeObject();
	$("#"+datagridId).datagrid("options").method = "post";
	$("#"+datagridId).datagrid('options').url = contextPath + '/finance/buildChargeSearch/list';
	$("#"+datagridId).datagrid('load', fromObjStr);
}


/**
 * GPE获取columns
 */
function initGridByGpeGridColumns(){
	// 初始化表格
	publicGpeGridColumns({
		tabKey : tabKey,
		onLoadSuccess:function(columns,frozenColumns){
			initBuildChargeSearchGrid(columns,frozenColumns);
		}
	});
}

var gridHandel = new GridClass();

function initBuildChargeSearchGrid(columns,frozenColumns) {
	
	gridHandel.setGridName(datagridId);
	$("#"+datagridId).datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        //url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        pageSize : pageSize,
        showFooter:true,
        height:'100%',
        widht:'100%',
        columns : columns,
		frozenColumns : frozenColumns,
		onBeforeLoad : function(data) {
			gridHandel.setDatagridHeader("center");
		},
		onLoadSuccess:function(){
			gridHandel.setDatagridFooter();
		}
    });
	$("#"+datagridId).datagrid('loadData',[]);
    $("#"+datagridId).datagrid('reloadFooter',[]);
}

/**
 * GPE设置
 */
function toGpeSetting(){
	publicGpeSetting({
		tabKey : tabKey,
		onSettingChange:function(columns,frozenColumns){
			initCashDailyGrid(columns,frozenColumns);
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
