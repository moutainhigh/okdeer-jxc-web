/**
 * Created by zhaoly on 2017/12/7.
 */
$(function () {

})
var type = "add";

var nodeCode = "" ;
var categoryCodeCallback = null;
function initCategoryCodeDialog(param) {
    type = param.type;
    if(param.type === "edit"){
        $("#id").val(param.id);
        $("#categoryCode").val(param.categoryCode);
        $("#categoryCode").addClass("uinp-no-more")
        $("#categoryCode").prop("readOnly","readOnly");
        $("#categoryName").val(param.categoryName);
        $("#remark").val(param.remark);
        $("#ckbSaveLabel").css("display","none");
    }
    $("#categoryTypeId").val(param.categoryTypeId);

}

function initCategoryCodeCallback(cb) {
    categoryCodeCallback = cb;
}

function saveCategroyCode() {
    //校验表单
    if($_jxc.isStringNull($("#categoryCode").val())){
        $_jxc.alert("编号不能为空");
        return;
    }

    if($("#categoryCode").val().trim().length < 4){
        $_jxc.alert("编号为4位数字");
        return;
    }


    if($_jxc.isStringNull($("#categoryName").val())){
        $_jxc.alert("名称不能为空");
        return;
    }

    var addUrl = contextPath+'/settle/charge/chargeCategory/addView';
    var updateUrl = contextPath+'/settle/charge/chargeCategory/updateView';

    var data = {
        dictTypeId:$("#dictTypeId").val(),
        value:$("#categoryCode").val(),
        label:$("#categoryName").val().trim(),
        remark:$("#remark").val(),
    }
    if(type === "edit"){
        data.id = $("#id").val();
    }
    var param = {
        url:type === "add"?addUrl:updateUrl,
        data:data
    }
    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
            $_jxc.alert("保存成功");
            if(type === "add"){
                if($("#ckbSave").is(":checked")){
                    cleanForm();
                }else {
                    closeCategroyDialog();
                }
            }else{
                closeCategroyDialog();
            }
            if(categoryCodeCallback){
                categoryCodeCallback({code:"0"});
            }

        }else{
            $_jxc.alert(result['message']);
        }
    },function (e) {

    })
}
/*
* 费用类别选择
* */
var categroyDialogTemp = null;
function openChargeRecordDialog(param) {
    categroyDialogTemp = $('<div/>').dialog({
        href: contextPath+"/settle/charge/charge/addView",
        width: 400,
        height: 400,
        title: "费用类别选择",
        closable: true,
        resizable: true,
        onClose: function () {
            $(categroyDialogTemp).panel('destroy');
            categroyDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            var categoryDialogClass = new ChargeCategoryDialogClass();
            categoryDialogClass.initPubChCategoryCallback(categroyDialogCb)
        }
    })
}

function categroyDialogCb(data) {
    $("#categoryCode").val(data.categoryCode);
   $("#categoryName").val(data.categoryName);
}

function closeCategroyDialog() {
    $(categroyDialogTemp).panel('destroy');
    categroyDialogTemp = null;
}

//清空表单
function cleanForm(){
    $("#categoryCode").val('');
    $("#categoryName").val('');
    $("#remark").val('');
}

