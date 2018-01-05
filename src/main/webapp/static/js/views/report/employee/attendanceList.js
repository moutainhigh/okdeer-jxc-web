/**
 * Created by zhaoly on 2017/12/28.
 */
$(function () {
    //开始和结束时间
    toChangeDate(9);
    $('#branchComponent').branchSelect({
        onAfterRender:function(data){
            $("#storeId").val(data.branchId);
        }
    });

    $('#cashierSelect').operatorSelect({
        onAfterRender:function(data){
            $("#userId").val(data.id);
            $("#userName").val(data.userName);
        }
    });

    // 初始化表格
    publicGpeGridColumns({
        onLoadSuccess:function(columns,frozenColumns){
            initAttendanceGrid(columns,frozenColumns);
        }
    });

})

var gridAttHandel = new GridClass();
var gridName = "gridAttendanceList";
function initAttendanceGrid(columns,frozenColumns) {
    gridAttHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        pageSize : 50,
        height:'100%',
        width:'100%',
        columns : columns,
        frozenColumns : frozenColumns,
        onBeforeLoad:function(data){
            gridAttHandel.setDatagridHeader("center");
        }
    });
}

//查询
function queryForm(){
    var fromObjStr = $('#queryForm').serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid('options').url = contextPath + '/store/attendance/list';
    $("#"+gridName).datagrid('load', fromObjStr);
}

//导出文件
//使用此公共组件 记得页面不需要导入 exportChose.jsp  不需要 startCount endCount隐藏表单
function exportData(){
    publicGpeExport({
        datagridId : gridName,
        queryParams : $("#queryForm").serializeObject()
    });
}