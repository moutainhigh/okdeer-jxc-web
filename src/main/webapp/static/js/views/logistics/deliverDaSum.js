/**
 * Created by zhaoly on 2017/5/18.
 */

var gridName = "deliverDaSumList";
var gridHandel = new GridClass();
var gVarBranchId = "";
var gVarBranchCompleCode = "";
$(function(){
	//开始和结束时间
	/*toChangeDatetime(30);*/
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    initDataDeliverDaSumList();
    //机构组件初始化
    $('#branchSelect').branchSelect({
        loadFilter:function(data){
            return data;
        }
    });
});
 


var dg;
function initDataDeliverDaSumList() {
    gridHandel.setGridName(gridName);
    dg = $("#"+gridName).datagrid({
        method:'post',
        align:'center',
       // url:contextPath+'/logisticsBranch/getBranchList',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        showFooter:true,
        pageList : [20,50,100],//可以设置每页记录条数的列表
        pageSize:50,
        fit:true,
        columns:[[
            {field:'branchCode',title:'配送点代号',width:120,align:'left'},
            {field:'skuCode',title:'商品代号',width:120,align:'left'},
            {field:'barCode',title:'国际条码',wi0dth:150,align:'left'},
            {field:'ydNum',title:'预定数量',width:100,align:'right'},
            {field:'giftNum',title:'赠品数量',width:100,align:'right'},
            {field:'salePrice',title:'商品零售价',width:110,align:'right'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
    });
}

/**
 * 搜索
 */
function queryBranch(){
	//搜索需要将左侧查询条件清除
	$("#startCount").val('');
	$("#endCount").val('');
    var formData = $('#formList').serializeObject();
    $("#"+gridName).datagrid("options").queryParams = formData;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url =contextPath+'/logistics/deliverDaSum/list',
    $("#"+gridName).datagrid('load');
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
// 调用导出方法
function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");

	$("#formList").attr("action",contextPath+"/logistics/deliverDaSum/exportList");
	$("#formList").submit();
}

/**
 * 发货机构
 */
function selectSourceBranch(){
        new publicAgencyService(function(data){
            if($("#sourceBranchId").val()!=data.branchesId){
                $("#sourceBranchId").val(data.branchesId);
                //$("#sourceBranchName").val(data.branchName);
                $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
                /*gridHandel.setLoadData([$.extend({},gridDefault)]);*/
            }
        },'DZ',$("#targetBranchId").val(),'',1);
}
function clearBranchCode(obj,branchId){
	var branchName = $(obj).val();
	
	//如果修改名称
	if(!branchName || 
			(branchName && branchName.indexOf("[")<0 && branchName.indexOf("]")<0)){
		$("#" + branchId +"").val('');
	}
}