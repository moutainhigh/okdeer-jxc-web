/**
 * Created by zhaoly on 2017/5/25.
 */

var storeStatus = "total";
$(function () {
    initGridChargeSearchList();
    $("#month").val(dateUtil.getPreMonthDate().format("yyyy-MM"));
    changeStoreStatus();

    $("#costTypeId").combobox({disabled:true});
	$("#formNo").prop("disabled",true);
})

function changeStoreStatus() {
    $(".radioItem").change(function () {
        storeStatus = $(this).val();
        if(storeStatus == 'total'){
            $("#costTypeId").combobox({disabled:true});
            $("#costTypeId").combobox('clear');
        	$("#formNo").prop("disabled",true);
        	$("#formNo").val('');
        }else if(storeStatus == 'detail'){
            $("#costTypeId").combobox({disabled:false});
        	$("#formNo").removeProp("disabled");
        }
        $("#"+gridName).datagrid("loadData",[]);
        $('#'+gridName).datagrid('reloadFooter',[]);
        $("#"+gridName).datagrid("options").url = "";
        initGridChargeSearchList();
    });
}

var gridName = "gridStoreChargeSearch";
var gridHandel = new GridClass();

var url = contextPath+'/finance/storeChargeSearch/reportListPage';
function initGridChargeSearchList() {
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        showFooter:true,
        height:'100%',
        width:'100%',
        singleSelect:true,
        columns:getGridcolumns()
    })
}

function getGridcolumns(){
    if(storeStatus == "total"){
        return [[
            {field:'branchCode',title:'机构编码',width:80,align:'left',
                formatter:function(value,row,index){
                    if(typeof(value) === "undefined" ){
                        return '<b>合计</b>';
                    }
                    return value;
                },
            },
            {field:'branchName',title:'机构名称',width:180,align:'left'},
            {field:'parentName',title:'所属分公司',width:180,align:'left'},
            {field:'month',title:'月份',width:110,align:'left',
                formatter : function(value, row, index) {
                    if(typeof(value) === "undefined" ){
                        return;
                    }

                    return value;
                },
            },
            {field:'amount',title:'金额',width:110,align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
        ]]
    }else{
        return [[
            {field:'formNo',title:'单号',width:180,align:'left',
                formatter:function(value,row,index){
                    if(typeof(value) === "undefined" ){
                        return '<b>合计</b>';
                    }
                	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'门店费用详情\',\'' + contextPath + '/finance/storeCharge/toEdit?formId=' + row.id + '\');">' + value + '</a>';
                	return strHtml;
                },
            },
            {field:'branchCode',title:'机构编码',width:80,align:'left'},
            {field:'branchName',title:'机构名称',width:180,align:'left'},
            {field:'parentName',title:'所属分公司',width:180,align:'left'},
            {field:'month',title:'月份',width:110,align:'left',
                formatter : function(value, row, index) {
                	if(typeof(value) === "undefined" ){
                        return;
                    }
                    return value;
                },
            },
            {field:'costTypeName',title:'费用项目',width:180,align:'left'},
            {field:'amount',title:'金额',width:110,align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'remark',title:'备注',width:180,align:'left'},
        ]]
    }
}

/**
 * 机构名称
 */
function selectListBranches(){
	new publicAgencyService(function(data){
        $("#branchId").val(data.branchesId);
        $("#branchCompleCode").val(data.branchCompleCode);
        $("#branchName").val("["+data.branchCode+"]" + data.branchName);
    },'BF','');
}

function queryCharge() {
	$("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridName).datagrid("options").method = "POST";
    $("#"+gridName).datagrid("options").url = contextPath+'/finance/storeChargeSearch/reportListPage';
    $("#"+gridName).datagrid("load");
}

function exportData(){
    var length = $("#"+gridName).datagrid('getData').rows.length;
    if(length == 0){
        $_jxc.alert("无数据可导");
        return;
    }
    var param = {
        datagridId:gridName,
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/finance/storeChargeSearch/exportExcelList"
    }
    publicExprotService(param);
}