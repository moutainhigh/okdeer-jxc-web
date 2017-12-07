/**
 * Created by zhaoly on 2017/12/7.
 */

$(function () {
    initTreeChargeCategory();
    initGridChargeCategoryList();
})

var gridName = "gridChargeCategoryList";
var gridHandel = new GridClass();

function initTreeChargeCategory() {
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
                onClick: categoryTreeOnClick
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
        queryChargeCategory();
        // initDictList();
    });
}

//选择树节点
var selectNode = null;
function categoryTreeOnClick(event, treeId, treeNode) {
    selectNode = treeNode;
    $("#categoryCode").val(selectNode.code);
    queryChargeCategory();
}


function initGridChargeCategoryList() {
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        method:'post',
        align:'center',
        // url:contextPath+'/archive/financeCode/getDictList',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        fit:true,
        columns:[[
            {field:'check',checkbox:true},
            {field:'id',hidden:true},
            {field:'categoryCode',title:'编号',width:100,align:'left',
                formatter: function(value,row,index){
                        return "<a href='#' onclick=\"updateCategoryCode('"+row.id+"','"+row.categoryCode+"','"+row.categoryName+"','"+row.remark+"')\" class='ualine'>"+value+"</a>";

                }
            },
            {field:'categoryName',title:'名称',width:200,align:'left'},
            {field:'remark',title:'备注',width:200,align:'left'}
        ]],
        onBeforeLoad:function (param) {
            gridHandel.setDatagridHeader("center");
        }
    })
}

function addCategoryCode() {
        if(null ==selectNode){
            $_jxc.alert("请选择具体的分类!");
            return;
        }

        if(selectNode.level == 3){
            $_jxc.alert("不能再添加子分类!");
            return;
        }
        var param = {
            type:"add",
            categoryId: selectNode.id,
            categoryCode:selectNode.code,
            categoryLevel:selectNode.level,

        }
        openChargeCategoryDialog(param);

}

function updateCategoryCode(id,categoryCode,categoryName,remark) {
    var param = {
        type:"edit",
        id:id,
        categoryCode:categoryCode,
        categoryName:categoryName,
        remark:remark,
        categoryId: selectNode.id,
        categoryLevel:selectNode.level,
    }
    openChargeCategoryDialog(param);
}


var editDialogTemp = null;
function openChargeCategoryDialog(param) {
    editDialogTemp = $('<div/>').dialog({
        href: contextPath+"/settle/charge/chargeCategory/addView",
        width: 400,
        height: 400,
        title: param.type==="add"?"新增费用类别":"编辑费用类别",
        closable: true,
        resizable: true,
        onClose: function () {
            $(editDialogTemp).panel('destroy');
            editDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            initCategoryCodeDialog(param);
            initCategoryCodeCallback(categroyCodeCb);
        }
    })
}

function categroyCodeCb(data) {
    if(data.code === "0"){
        queryChargeCategory();
    }
}
function closeCategoryCodeDialog() {
    $(editDialogTemp).panel('destroy');
    editDialogTemp = null;
}



/**
 * 搜索
 */
function queryChargeCategory(){
    var formData = $('#formCategoryList').serializeObject();
    $("#"+gridName).datagrid("options").queryParams = formData;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/settle/charge/chargeCategory/list',
        $("#"+gridName).datagrid('load');
}

function delCategoryCode() {
    var rows = $("#"+gridName).datagrid("getChecked");
    if(rows.length <= 0){
            $_jxc.alert('请勾选数据！');
            return;
    }

    var ids='';
    $.each(rows,function(i,v){
        ids+=v.id+",";
    });

    $_jxc.confirm('是否要删除选中数据?',function(data){
        if(data) {
            var param = {
                url: contextPath + "/settle/charge/chargeCategory/deleteCategoryCode",
                data: {
                    ids: ids
                }
            }

            $_jxc.ajax(param, function (result) {
                queryChargeCategory();
                if (result['code'] == 0) {
                    $_jxc.alert("删除成功");
                } else {
                    $_jxc.alert(result['message']);

                }
            });
        }

    })
}

/**
 * 导出
 */
function exportData(){
    var param = {
        datagridId:gridName,
        formObj:$("#gridChargeCategoryList").serializeObject(),
        url:contextPath+"/settle/charge/chargeCategory/exportHandel"
    }
    publicExprotService(param);
}
