/**
 * Created by zhaoly on 2017/6/2.
 */

$(function () {
    initGridLogList();
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
})

var gridName = "gridLogList";
var gridHandel = new GridClass();
var dg;
function initGridLogList() {
    gridHandel.setGridName(gridName);
    dg =  $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        showFooter:true,
        height:'100%',
        width:'100%',
        fitColumns:true,    //每列占满
        columns:[[
            {field:'branchCode',title:'机构编码',width:60,align:'left'},
            {field:'branchName',title:'机构名称',width:120,align:'left'},
            {field:'createUserName',title:'操作员',width:100,align:'left'},
            {field:'operateName',title:'功能名称',width:80,align:'left'},
            {field:'createTimeStr',title:'修改时间',width:100,align:'left'},
            {field:'operateTypeStr',title:'修改类型',width:60,align:'left'},
            {field:'title',title:'修改值',width:140,align:'left'},
            {field:'content',title:'操作描述',width:300,align:'left',
            	formatter:function(value,row,index){
            		return "<p title='"+value+"' style='white-space: pre-line;'>"+value+'</p>'
            	}
            }
        ]]
    })
}


/**
 * 机构名称
 */
function selectListBranches(){
    new publicAgencyService(function(data){
        $("#branchCompleCode").val(data.branchCompleCode);
        $("#branchName").val("["+data.branchCode+"]" + data.branchName);
    },'BF','');
}

function queryLogList() {
    $("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/system/log/getOpLogList';
    $("#"+gridName).datagrid("load");
}

/**
 * 导出
 */
function exportData(){
    var param = {
        datagridId:gridName,
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/system/log/exportHandel"
    }
    publicExprotService(param);

}