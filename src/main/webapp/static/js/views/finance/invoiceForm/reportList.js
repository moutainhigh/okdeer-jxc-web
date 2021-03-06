/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
var tabKey = 'default';
$(function() {
	// 开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    
    // 初始化表格
	initGridByGpeGridColumns();
	
    //选择报表类型
	changeTabKey();
	
	$('#branchComponent').branchSelect();
	
	$("#branchName").val(sessionBranchCodeName);
	$("#branchCompleCode").val(sessionBranchCompleCode);

});

var datagridId = "gridInvoiceFormList";

function changeTabKey(){
	$(".radioItem.tabKey").change(function(){
    	var type = $(this).val();

        /*initCashDailyGrid(type);*/
    	$("#"+datagridId).datagrid("options").url = "";
    	$("#"+datagridId).datagrid('loadData', { total: 0, rows: [] });
        tabKey = type;
        
    	// 重新初始表格
		initGridByGpeGridColumns();
    });
}

// 处理单据
function processForm(){
	
}

var gridHandel = new GridClass();
// 按收银汇总

function initCashDailyGrid(columns,frozenColumns) {
	
	// 添加复选框列
	$_jxc.addColumnCheck(columns);

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
        showFooter:false,
        height:'100%',
        widht:'100%',
        columns : columns,
		frozenColumns : frozenColumns,
		onBeforeLoad : function(data) {
			gridHandel.setDatagridHeader("center");
		}
    });
	$("#"+datagridId).datagrid('loadData',[]);
    $("#"+datagridId).datagrid('reloadFooter',[]);
}

//查询
function queryForm(){
	if(!$("#branchCompleCode").val()){
        $_jxc.alert("请选择机构");
        return;
    } 
	$('#startCount').val('');
	$('#endCount').val('');
	var fromObjStr = $('#queryForm').serializeObject();
	$("#"+datagridId).datagrid("options").method = "post";
	$("#"+datagridId).datagrid('options').url = contextPath + '/finance/invoiceFormReport/list';
	$("#"+datagridId).datagrid('load', fromObjStr);
}

function processForm() {

    var rows = $("#"+datagridId).datagrid("getChecked");
	
	if(!rows || rows.length <= 0){
		$_jxc.alert('请至少选择一行数据！');
		return;
	}
	
	var formIds = '';
	$.each(rows, function(i, v) {
		if (i > 0) {
			formIds += ",";
		}
		formIds += v.formId;
	});
	
	var param = {
        url :contextPath+"/finance/invoiceFormReport/processForm",
        type:"POST",
        data:{
            formIds: formIds,
            tabKey: tabKey
        }
    }

    $_jxc.confirm("是否处理选中的发票?",function (data) {
        if(data){
            $_jxc.ajax(param,function (result) {
            	if(result['code'] == 0){
	    			$_jxc.alert("操作成功");
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
            	
            	queryForm();
            })
        }
    })
}

//打印
function printReport(){
	var queryType=$('input:radio[name="queryType"]:checked').val();

	var startTime = $("#txtStartDate").val();
	var endTime = $("#txtEndDate").val();
	var branchNameOrCode= $("#branchNameOrCode").val();
	var cashierId=$("#cashierId").val();
	parent.addTabPrint("reportPrint"+branchNameOrCode,"打印",contextPath+"/finance/invoiceFormReport/print?" +
			"queryType="+queryType+"&startTime="+startTime+"&endTime="+endTime+
			"&branchNameOrCode="+branchNameOrCode+"&cashierId="+cashierId);
}
/**
 * 重置
 */
var resetForm = function(){
	$("#queryForm")[0].reset();
};


/**
 * GPE获取columns
 */
function initGridByGpeGridColumns(){
	// 初始化表格
	publicGpeGridColumns({
		tabKey : tabKey,
		onLoadSuccess:function(columns,frozenColumns){
			initCashDailyGrid(columns,frozenColumns);
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
