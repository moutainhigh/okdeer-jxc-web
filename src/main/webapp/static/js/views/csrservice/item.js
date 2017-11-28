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
        $_jxc.ajax({url: contextPath + '/service/item/add/' + treeNode.id + "/" + treeNode.id}, function (data) {
            zTree.addNodes(treeNode, {id: data.id, pId: treeNode.id, text: data.name});
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

    $_jxc.confirm("确认删除服务类型--" + treeNode.text + " 吗？", function (res) {
        if(res){
            onRemove(treeId, treeNode);
        }
    });

    return false;

}

function onRemove(treeId, treeNode) {
    var treeId = treeId;
    var treeNode = treeNode;
    var parentNode = treeNode.getParentNode();
    // showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    var param = {};
    $_jxc.ajax({
        url: contextPath + '/service/item/del/' + treeNode.id,
        data: param
    },function(result){
        if(result.code == 0){
            $.fn.zTree.getZTreeObj("treeBranchList").removeNode(treeNode);
            $_jxc.alert('删除成功!');
        }else{
            $_jxc.alert(result['message']);
        }
    })
}

function onRename(e, treeId, treeNode, isCancel) {
    var treeNode = treeNode;
    if($_jxc.isStringNull(treeNode.text)){
        $_jxc.alert("服务类型不能为空");
        return;
    }
    var param = {
        typeName: treeNode.text
    };

    var parentNode = treeNode.getParentNode();

    $_jxc.ajax({
        url: contextPath + '/service/item/update/' + parentNode.id + '/' + treeNode.id,
        data:param,
    },function(result){
        if(result.code == 0){
            $_jxc.alert('修改成功');
        }else{
            $_jxc.alert(result['message']);
        }
    })
}

//选择树节点
var selectNode = null;
function zTreeOnClick(event, treeId, treeNode) {
    selectNode = treeNode;
    $("#typeId").val(treeNode.id);
    queryService();
}

function initDatagridBranchList() {
    gridHandel.setGridName(gridName);
    $("#" + gridName).datagrid({
        method: 'post',
        align: 'center',
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
                        return "<a href='#' onclick=\"editHandel('"+row.id+"','"+row.value+"','"+row.label+"','"+row.remark+"','"+row.price+"')\" class='ualine'>" + value + "</a>";
                    } else {
                        return value;
                    }
                }
            },
            {field: 'serviceName', title: '名称', width: 180, align: 'left'},
            {field: 'price', title: '单价', width: 80, align: 'right'},
            {field: 'isChangePrice', title: '是否可以改价', width: 120, align: 'center'},
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

function openEditServiceDailog(param) {
    editDialogTemp = $('<div/>').dialog({
        href: contextPath + "/service/item/editService",
        // queryParams: {
        //     branchId: branchId
        // },
        width: dialogWidth, //bug19840
        height: dialogHeight,
//        left:dialogLeft,
        title: "服务项目",
        closable: true,
        resizable: true,
        onClose: function () {
            $(editDialogTemp).panel('destroy');
            editDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            initServiceDialog(param);
            initServiceDialogCallback(serviceDialogCb);
        }
    })
}

function serviceDialogCb(res) {
    if(res.code === "1"){
        closeServiceDialog();
        queryService();
    }
}

function closeServiceDialog() {
    $(editDialogTemp).panel('destroy');
    editDialogTemp = null;
}

/**
 * 搜索
 */
function queryService() {
    var formData = $('#formList').serializeObject();
    $("#" + gridName).datagrid("options").queryParams = formData;
    $("#" + gridName).datagrid("options").method = "post";
    $("#" + gridName).datagrid("options").url = contextPath + '/service/item/list';
    $("#" + gridName).datagrid('load');
}

/**
 * 修改
 */
function editHandel(id,value,label,remark,price) {
    var param = {
        type:"edit",
        id:id,
        value:value,
        label:label,
        remark:remark,
        price:price,
        nodeCode:selectNode.branchesId
    }
    openEditServiceDailog(param);
}

function addServiceItem() {
    if (selectNode == null) {
        $_jxc.alert('请先选中服务项目，再新增!');
    }
    if(selectNode.level == 0){
        var zTree = $.fn.zTree.getZTreeObj("treeBranchList");
        $_jxc.ajax({url: contextPath + '/service/item/add/' + selectNode.id + "/" + selectNode.id}, function (data) {
            zTree.addNodes(selectNode, {id: data.id, pId: selectNode.id, text: data.name});
            return false;
        });
    }else if(selectNode.level == 1){
        var param = {
            type:"add",
            branchId:selectNode.branchesId
        }
        openEditServiceDailog(param);
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
