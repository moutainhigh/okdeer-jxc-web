$(function(){
    //开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	initDgTakeStockApply();
});
//初始化表格
function initDgTakeStockApply(){
	stockList = $("#applyList").datagrid({
		method:'post',
		align:'center',
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		fitColumns:true,    //每列占满
		height:'100%',
		width:'100%',
		columns:[[
			{field:'check',checkbox:true},
			{field: 'batchNo', title: '盘点批号', width: 100, align: 'left'},
			{field: 'createTime', title: '申请时间', width: 100, align: 'left'},
			{field: 'branchName', title: '机构', width: 180, align: 'left'},
			{field: 'createUserName', title: '操作员', width: 100, align: 'left'},
			{field: 'scope', title: '盘点范围', width: 100, align: 'left',formatter:function(value,row,index){
            	if(value == '0'){
            		return '全场盘点';
            	}else if(value == '1'){
            		return '类别盘点';
            	}else{
            		return '未知类型：'+ value;
            	}
            }},
			{field: 'categoryShowsStr', title: '类别', width: 120, align: 'left'},

			{field: 'remark', title: '备注', width: 180, align: 'left'},
		]],

	});
	queryForm();
}
//查询
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	console.log(fromObjStr)
	$("#applyList").datagrid("options").method = "post";
	$("#applyList").datagrid('options').url = contextPath + '/stocktaking/apply/getApplyList';
	$("#applyList").datagrid('load', fromObjStr);
}
/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};

/**
 * 机构名称
 */
function selectListBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
		$("#branchCompleCode").val(data.branchCompleCode);
	},'BF','');
}

function selectCategory(){
	
}

//新增
var addDalogTemp;
function toAdd(){
	var top = $(window).height()/4;
	var left = $(window).width()/4;
    addDalogTemp = $('<div/>').dialog({
        href: contextPath+"/stocktaking/apply/add",
        queryParams:{},
        top:top,
        left:left,
        height: 350,
        width: 700,
        title: "申请盘点批号",
        closable: true,
        resizable: true,
        onClose: function () {
            $(addDalogTemp).panel('destroy');
        },
        modal: true,
        onLoad: function () {
        	initAddData();
        	initCallback(applyCallback);
        }
    })
}

function applyCallback(){
	 $(addDalogTemp).panel('destroy');
}
