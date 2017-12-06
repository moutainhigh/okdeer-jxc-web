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
                beforeRename: beforeRename,
                // onRemove: onRemove,
                onRename: onRename

            }
        };
        if (data == "") {
            return;
        }
        $.fn.zTree.init($("#treeBranchList"), setting, data.datas);
        var treeObj = $.fn.zTree.getZTreeObj("treeBranchList");
        treeObj.setting.edit.removeTitle = "删除";
        treeObj.setting.edit.renameTitle = "编辑";
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
        + "' title='新增' onfocus='this.blur();'></span>";
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

var oldName = "";
function beforeRename(treeId, treeNode, newName) {
    var treeNode = treeNode;
    var zTree = $.fn.zTree.getZTreeObj("treeBranchList");
    oldName = treeNode.text;
    if($_jxc.isStringNull(newName)){
        setTimeout(function() {
            zTree.cancelEditName();
            $_jxc.alert("服务类型不能为空");
        }, 0);
        return false;
    }
    return true;
}

function onRename(e,treeId,treeNode,isCancel) {
    if(isCancel)return;
    var parentNode = treeNode.getParentNode();
    var param = {
        typeName: treeNode.text,
    };
    $_jxc.ajax({
        url: contextPath + '/service/item/update/' + parentNode.id + '/' + treeNode.id,
        data:param,
    },function(result){
        if(result.code == 0){
            $_jxc.alert('修改成功');
        }else{
            var zTree = $.fn.zTree.getZTreeObj("treeBranchList");
            treeNode.text = oldName;
            zTree.updateNode(treeNode);
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
                field: 'csrserviceCode', title: '编号', width: 80, align: 'left',
                formatter: function (value, row, index) {
                    if (value) {
                        return "<a href='#' onclick=\"editHandel('" + row.id + "','" + row.csrserviceCode + "','" + row.referencePrice + "','" + row.remark + "','" + row.csrserviceName + "','" + row.isAllowAdjustPrice + "')\" class='ualine'>" + value + "</a>";
                    } else {
                        return value;
                    }
                }
            },
            {field: 'csrserviceName', title: '名称', width: 180, align: 'left'},
            {
                field: 'referencePrice', title: '单价', width: 80, align: 'right',
                formatter: function (value, row, index) {
                    if (row.isFooter) {
                        return '<b>' + parseFloat(value || 0).toFixed(2) + '</b>';
                    }
                    return '<b>' + parseFloat(value || 0).toFixed(2) + '</b>';
                }
            },
            {
                field: 'isAllowAdjustPrice', title: '是否可以改价', width: 120, align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) {
                        return '否';
                    } else {
                        return '是';
                    }
                }
            },
            {field: 'remark', title: '备注', width: 180, align: 'left'},
        ]],
        onBeforeLoad: function () {
            gridHandel.setDatagridHeader("center");
        }
    });
}

var dialogHeight = 550;//$(window).height()*(4/5);
var dialogWidth = 450;//$(window).width()*(5/9);
var dialogLeft = $(window).width() * (1 / 5);
var editDialogTemp

function openEditServiceDailog(param) {
    editDialogTemp = $('<div/>').dialog({
        href: contextPath + "/service/item/editService",
        //queryParams: param,
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
function editHandel(id, csrserviceCode, referencePrice, remark, csrserviceName, isAllowAdjustPrice) {
    var param = {
        type:"edit",
        id:id,
        csrserviceCode: csrserviceCode,
        referencePrice: referencePrice,
        remark:remark,
        csrserviceName: csrserviceName,
        isAllowAdjustPrice: isAllowAdjustPrice,
        branchName: selectNode.getParentNode().text,
        csrserviceType: selectNode.text
    }
    openEditServiceDailog(param);
}

function addServiceItem() {
    if (selectNode == null) {
        $_jxc.alert('请先选中节点，再新增.');
        return;
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
            branchName: selectNode.getParentNode().text,
            csrserviceType: selectNode.text,
            typeId: selectNode.id
        };
        openEditServiceDailog(param);
    }
}


function delServiceItem() {
    var rows = $("#" + gridName).datagrid("getChecked");
    if (rows.length <= 0) {
        $_jxc.alert('请勾选数据！');
        return;
    }
    var ids = '';
    $.each(rows, function (i, v) {
        ids += v.id + ",";
    });

    $_jxc.confirm('是否要删除选中数据?', function (data) {
        if (data) {
            var param = {
                url: contextPath + "/service/item/del/csrservice",
                data: {
                    ids: ids
                }
            };
            $_jxc.ajax(param, function (result) {
                queryService();
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
function exportData() {
    var length = $("#" + gridName).datagrid('getData').rows.length;
    if (length == 0) {
        $_jxc.alert("无数据可导");
        return;
    }
    var param = {
        datagridId: gridName,
        formObj: $("#formList").serializeObject(),
        url: contextPath + "/service/item/export"
    }
    publicExprotService(param);
}

function closeFinanceDialog() {
    $(editDialogTemp).panel('destroy');
    editDialogTemp = null;
}