/**
 * Created by zhaoly on 2017/12/29.
 */
$(function () {
    $('#branchComponent').branchSelect();
    toChangeDate(9);
    statuChange();
    initGridByGpeGridColumns("total");
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
        frozenColumns : frozenColumns
    });
    $("#"+datagridId).datagrid('loadData',[]);
    $("#"+datagridId).datagrid('reloadFooter',[]);
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
