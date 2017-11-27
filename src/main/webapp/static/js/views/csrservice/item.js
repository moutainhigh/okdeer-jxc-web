/**
 * Created by zhaoly on 2017/5/18.
 */

var gridName = "gridServiceList";
var gridHandel = new GridClass();
$(function () {
    initTreeArchives();
    initDatagridBranchList();

    $(document).on('click', '.radioItem', function () {
        searchHandel();
    })
});

/**
 * 初始树
 */
function initTreeArchives() {
    var args = {};
    var httpUrl = contextPath + "/service/item/tree";
    $.get(httpUrl, args, function (data) {
        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                selectedMulti: false
            },
            edit: {
                enable: true,
                // editNameSelectAll: true,
                showRemoveBtn: showRemoveBtn,
                showRenameBtn: showRenameBtn
            },
            data: {
                key: {
                    name: 'text',
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                onClick: zTreeOnClick,
                beforeRemove: beforeRemove,
                // onRemove: onRemove,
                onRename: onRename

            }
        };
        if (data == "") {
            return;
        }
        $.fn.zTree.init($("#treeBranchList"), setting, data.datas);
        var treeObj = $.fn.zTree.getZTreeObj("treeBranchList");
        var nodes = treeObj.getNodes();
        if (nodes.length > 0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
    });
}

var newCount = 1;
function addHoverDom(treeId, treeNode) {
    if(treeNode.level == 1){
        return;
    }
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("treeBranchList");
        $_jxc.ajax({url: contextPath + '/service/item/add'}, function (data) {
            zTree.addNodes(treeNode, {id: data.id, pId: treeNode.id, text: data.id + "子节点" + (newCount++)});
            return false;
        });
    });
}


function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};

function showRemoveBtn(treeId, treeNode) {
    if(treeNode.level == 0){
        return;
    }
    return true;
}
function showRenameBtn(treeId, treeNode) {
    if(treeNode.level == 0){
        return;
    }
    return true;
}

function beforeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeBranchList");
    zTree.selectNode(treeNode);

    $_jxc.confirm("确认删除服务类型--" + treeNode.name + " 吗？",function (res) {
        if(res){
            onRemove(treeId, treeNode);
        }
    });

    return false;

}

function onRemove(treeId, treeNode) {
    var treeId = treeId;
    var treeNode = treeNode;
    // showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    var param = {
        id:treeNode.id
    }
    $_jxc.ajax({
        url:contextPath+'/pos/group/key/goods/top/list',
        data:param,
    },function(result){
        if(result.code == 0){

        }else{
            $_jxc.alert(result['message']);
        }
    })
}

function onRename(e, treeId, treeNode, isCancel) {
    var e = e;
    var treeId = treeId;
    var treeNode = treeNode;
    if($_jxc.isStringNull(treeNode.text)){
        $_jxc.alert("服务类型不能为空");
        return;
    }
    var param = {
        id:treeNode.id,
        text:treeNode.text
    }

    $_jxc.ajax({
        url:contextPath+'/pos/group/key/goods/top/list',
        data:param,
    },function(result){
        if(result.code == 0){

        }else{
            $_jxc.alert(result['message']);
        }
    })
}

//选择树节点
var selectNode = null;
function zTreeOnClick(event, treeId, treeNode) {
    selectNode = treeNode;
    $("#branchCompleCode").val(treeNode.code);
    queryBranch();
}

function initDatagridBranchList() {
    gridHandel.setGridName(gridName);
    $("#" + gridName).datagrid({
        method: 'post',
        align: 'center',
        url: contextPath + '/archive/branch/getBranchList',
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        pageSize: 50,
        fit: true,
        columns: [[
            {field:'ck',checkbox:true},
            {
                field: 'serviceCode', title: '编号', width: 80, align: 'left',
                formatter: function (value, row, index) {
                    if (value) {
                        return "<a href='#' onclick=\"editHandel('" + row.serviceCode + "')\" class='ualine'>" + value + "</a>";
                    } else {
                        return value;
                    }
                }
            },
            {field: 'serviceName', title: '名称', width: 180, align: 'left'},
            {field: 'price', title: '单价', width: 80, align: 'right'},
            {field: 'remark', title: '备注', width: 180, align: 'left'},
        ]],
        onBeforeLoad: function () {
            gridHandel.setDatagridHeader("center");
        }
    });
}

var dialogHeight = 550;//$(window).height()*(4/5);
var dialogWidth = 1000;//$(window).width()*(5/9);
var dialogLeft = $(window).width() * (1 / 5);
var editDialogTemp

function openEditServiceDailog(branchId) {
    editDialogTemp = $('<div/>').dialog({
        href: contextPath + "/archive/branch/toEdit",
        queryParams: {
            branchId: branchId
        },
        width: dialogWidth, //bug19840
        height: dialogHeight,
//        left:dialogLeft,
        title: "修改机构信息",
        closable: true,
        resizable: true,
        onClose: function () {
            $(editDialogTemp).panel('destroy');
            editDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            initBranchInfo();
        }
    })
}

function closeDialogHandel() {
    $(editDialogTemp).panel('destroy');
    editDialogTemp = null;
}

/**
 * 搜索
 */
function queryBranch() {
    var formData = $('#formList').serializeObject();
    $("#" + gridName).datagrid("options").queryParams = formData;
    $("#" + gridName).datagrid("options").method = "post";
    $("#" + gridName).datagrid("options").url = contextPath + '/archive/branch/getBranchList';
        $("#" + gridName).datagrid('load');
}

/**
 * 修改
 */
function editHandel(seviceCode) {
    var param = {

    }
    openEditServiceDailog(param);
}

function addServiceItem() {
    if(selectNode.level == 0){
        var zTree = $.fn.zTree.getZTreeObj("treeBranchList");
        zTree.addNodes(selectNode, {id:(100 + newCount), pId:selectNode.id, text:"子节点" + (newCount++)});
    }else if(selectNode.level == 1){
        openEditServiceDailog(row.branchesId);
    }
}

/**
 * 导出
 */
function exportData() {
    var param = {
        datagridId: gridName,
        formObj: $("#formList").serializeObject(),
        url: contextPath + "/archive/branch/exportHandel"
    }
    publicExprotService(param);
}
