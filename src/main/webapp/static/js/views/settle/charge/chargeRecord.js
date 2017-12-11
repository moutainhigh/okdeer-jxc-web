/**
 * Created by zhaoly on 2017/12/7.
 */

$(function () {
    initTreeChargeRecord();
    initGridChargeRecordList();
})

var gridName = "gridChargeRecordList";
var gridHandel = new GridClass();

function initTreeChargeRecord() {
    var args = {};
    var httpUrl = contextPath+"/settle/charge/chargeCategory/getCategoryToTree";
    $.get(httpUrl, args,function(data){
        var setting = {
            data: {
                key:{
                    name:'codeText',
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };
        $.fn.zTree.init($("#treeChargeRecord"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treeChargeRecord");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
        var childrens = treeObj.getNodes()[0].children;
        treeObj.selectNode(childrens[0]);
        selectNode = childrens[0];
        $("#categoryCode").val(selectNode.code);
        queryChargeRecord();
    });
}



//选择树节点
var selectNode = null;
function zTreeOnClick(event, treeId, treeNode) {
    selectNode = treeNode;
    $("#categoryCode").val(selectNode.code);
    queryChargeRecord();
}


function initGridChargeRecordList() {
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
            {field:'chargeCode',title:'编号',width:100,align:'left',
                formatter: function(value,row,index){
                    return "<a href='#' onclick=\"updateChargeRecord('"+index+"')\" class='ualine'>"+value+"</a>";

                }
            },
            {field:'chargeName',title:'名称',width:200,align:'left'},
            {field:'categoryName',title:'一级类别',width:200,align:'left'},
            {field:'categoryName',title:'二级类别',width:200,align:'left'},
            {field:'categoryName',title:'三级类别',width:200,align:'left'},
            {field:'unit',title:'单位',width:60,align:'left'},
            {field:'spec',title:'规格',width:60,align:'left'},
            {field:'purPrice',title:'单价',width:80,align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'remark',title:'备注',width:200,align:'left'}
        ]],
        onBeforeLoad:function (param) {
            gridHandel.setDatagridHeader("center");
        }
    })
}

function addChargeRecord() {

    var param = {
        type:"add",
        categoryId: "",
        categoryCode:"",
        categoryName:"",
    }

    if(selectNode && selectNode.level == 3){
        param.categoryId = selectNode.id;
            param.categoryCode = selectNode.code;
            param.categoryName = selectNode.codeText;
    }

    openChargeRecordDialog(param);

}

function updateChargeRecord(index) {
    var rows = gridHandel.getRows();
    var param = rows[index] ;
        param.type = "edit";
    // var code = "["+param.categoryCode+"]";
    // param.categoryName = code+param.categoryNam;
    openChargeRecordDialog(param);
}

function copyChargeRecord() {
    var row = $("#"+gridName).datagrid("getSelected");
    if(!row){
        $_jxc.alert("请选择一条数据!");
        return;
    }
    var param = row ;
    param.type = "copy";
    // var code = "["+param.categoryCode+"]";
    // param.categoryName = code+param.categoryNam;
    openChargeRecordDialog(param);
}


var editDialogTemp = null;
function openChargeRecordDialog(param) {
    editDialogTemp = $('<div/>').dialog({
        href: contextPath+"/settle/charge/charge/addView",
        width: 700,
        height: 600,
        title: param.type==="add"?"新增费用档案":"编辑费用档案",
        closable: true,
        resizable: true,
        onClose: function () {
            $(editDialogTemp).panel('destroy');
            editDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            initCategoryRecordDialog(param);
            initCategoryRecordCallback(categroyCodeCb);
        }
    })
}

function categroyCodeCb(data) {
    $(editDialogTemp).panel('destroy');
    editDialogTemp = null;
    if(data.code === "0"){
        queryChargeRecord();
    }
}

function closeChargeRecordDialog() {
    $(editDialogTemp).panel('destroy');
    editDialogTemp = null;
}

/**
 * 搜索
 */
function queryChargeRecord(){
    var formData = $('#formChargeRecordList').serializeObject();
    $("#"+gridName).datagrid("options").queryParams = formData;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/settle/charge/charge/list',
        $("#"+gridName).datagrid('load');
}

