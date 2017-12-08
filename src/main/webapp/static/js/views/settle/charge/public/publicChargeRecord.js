/**
 * Created by zhaoly on 2017/12/7.
 */
$(function () {

})

function ChargeRecordDialogClass() {

}

var chRecordClass = new ChargeRecordDialogClass();

var gridName = "gridChargeRecordDialogList";
var gridHandel = new GridClass();

ChargeRecordDialogClass.prototype.treeChargeCategory = function() {
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
        $("#categoryCode").val(selectNode.code);
        categoryCodeSearch();
    });
}



//选择树节点
var selectNode = null;
ChargeRecordDialogClass.prototype.zTreeOnClick = function (event, treeId, treeNode) {
    selectNode = treeNode;
    $("#categoryCode").val(selectNode.code);
    categoryCodeSearch();
}


ChargeRecordDialogClass.prototype.gridChargeRecordList = function() {
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
            {field:'chargeCode',title:'编号',width:100,align:'left',},
            {field:'chargeName',title:'名称',width:200,align:'left'},
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
        ]],
        // onClickRow:chargeRecordClickRow,
        onBeforeLoad:function (param) {
            gridHandel.setDatagridHeader("center");
        }
    })
}


ChargeRecordDialogClass.prototype.publicChargeRecordGetCheck = function(cb){
    var rows =  $("#"+gridName).datagrid("getChecked");
    if(cb){
        cb(rows);

    }
}


function chargeRecordSearch() {
    var formData = $('#formRecordList').serializeObject();
    $("#"+gridName).datagrid("options").queryParams = formData;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/settle/charge/charge/list',
        $("#"+gridName).datagrid('load');
}