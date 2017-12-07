/**
 * Created by zhaoly on 2017/12/7.
 */
$(function () {
    chCateClass.treeChargeCategory();
    chCateClass.gridChargeCategoryList();
})

function ChargeCategoryDialogClass() {

}

var chCateClass = new ChargeCategoryDialogClass();

var gridName = "gridChargeCategoryDialogList";
var gridHandel = new GridClass();

var pubChargeCategoryCallback = null;

ChargeCategoryDialogClass.prototype.initPubChCategoryCallback = function (cb) {
    pubChargeCategoryCallback = cb;
}

ChargeCategoryDialogClass.prototype.treeChargeCategory = function() {
    var args = {};
    var httpUrl = contextPath+"/settle/charge/chargeCategory/getCategoryToTree";
    $.get(httpUrl, args,function(data){
        var setting = {
            data: {
                key:{
                    name:'text',
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                onClick: chCateClass.zTreeOnClick
            }
        };
        $.fn.zTree.init($("#treeChargeCategory"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treeChargeCategory");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
        var childrens = treeObj.getNodes()[0].children;
        treeObj.selectNode(childrens[0]);
        selectNode = childrens[0];
        $("#typeCode").val(selectNode.code);
        // initDictList();
    });
}

function initDictList() {
    var param = {
        url:contextPath+'/settle/charge/chargeCategory/view',
        data:{
            dictKeyword:"",
            typeCode:selectNode.code,
            page:1,
            rows:50,
        }
    }
    $_jxc.ajax(param,function (result) {
        $("#"+gridName).datagrid('loadData',result.list);
    })
}

//选择树节点
var selectNode = null;
ChargeCategoryDialogClass.prototype.zTreeOnClick = function (event, treeId, treeNode) {
    selectNode = treeNode;
    $("#typeCode").val(selectNode.code);
    queryChargeCategory();
}


ChargeCategoryDialogClass.prototype.gridChargeCategoryList = function() {
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        method:'post',
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        fit:true,
        columns:[[
            {field:'id',hidden:true},
            {field:'categoryCode',title:'编号',width:100,align:'left'},
            {field:'categoryName',title:'名称',width:200,align:'left'},
            {field:'remark',title:'备注',width:200,align:'left'}
        ]],
        onClickRow:categoryClickRow,
        onBeforeLoad:function (param) {
            gridHandel.setDatagridHeader("center");
        }
    })
}

function categoryClickRow(rowIndex, rowData) {
    if(pubChargeCategoryCallback){
        pubChargeCategoryCallback(rowData);

    }
}