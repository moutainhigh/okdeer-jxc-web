/**
 * Created by zhaoly on 2017/12/29.
 */
$(function () {
    $('#branchComponent').branchSelect();
    toChangeDate(9);
    statuChange();
    initGridByGpeGridColumns("summaryStatistics");
})

function statuChange() {
    $(".radioItem").change(function () {
        $("#"+datagridId).datagrid('loadData', {
            total : 0,
            rows : []
        });
        $("#"+datagridId).datagrid('reloadFooter',[]);

        initGridByGpeGridColumns($(this).val());
    })
}

/**
 * GPE获取列
 */
function initGridByGpeGridColumns(tabKey){
    publicGpeGridColumns({
        tabKey : tabKey,
        onLoadSuccess:function(columns,frozenColumns){
            initDatagridDiscount(columns,frozenColumns);
        }
    });
}

var datagridId = "gridDiscountList"

var gridHandel = new GridClass();

//初始化表格
function initDatagridDiscount(columns,frozenColumns){
    gridHandel.setGridName(datagridId);
    $("#"+datagridId).datagrid({
        method : 'post',
        align : 'center',
        singleSelect : true,
        rownumbers : true,
        pagination : true,
        fitColumns : false,
        showFooter : true,
        pageSize : 50,
        height : '100%',
        width : '100%',
        columns : columns,
        frozenColumns : frozenColumns,
        onBeforeLoad:function(data){
            gridHandel.setDatagridHeader("center");
        }
    });
    $("#"+datagridId).datagrid('loadData',[]);
    $("#"+datagridId).datagrid('reloadFooter',[]);
}

//查询
function query(){
  var fromObjStr = $('#queryForm').serializeObject();
  $("#"+datagridId).datagrid("options").method = "post";
  $("#"+datagridId).datagrid('options').url = contextPath + '/sale/employeeDiscount/list';
  $("#"+datagridId).datagrid('load', fromObjStr);
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
