/**
 * Created by zhaoly on 2017/12/7.
 */
$(function () {

})
var type = "add";

var nodeCode = "" ;
var categoryRecordCallback = null;
function initCategoryRecordDialog(param) {
    debugger;
    type = param.type;
        $.each(param,function (index,item) {
            if(index === "financeType"){
                $('#financeType'+item).prop('checked',true);
            }else if(index === "purPrice" || index === "depreciate" || index === "validity"){
                $("#"+index).numberbox("setValue",item);
            }else{
                    $("#"+index).val(item);
                }
        })

    if(type === "edit"){
        $("#chargeRecordId").val(param.id);
    }

    if(type === "copy"){
        $("#chargeRecordId").val("");
        $("#chargeCode").val("");
    }
}

function initCategoryRecordCallback(cb) {
    categoryRecordCallback = cb;
}

function saveChargeRecord() {
    debugger;
    if($_jxc.isStringNull($("#chargeName").val())){
        $_jxc.alert("名称不能为空");
        return;
    }

    if($_jxc.isStringNull($("#categoryId").val())){
        $_jxc.alert("类别不能为空");
        return;
    }

    if($_jxc.isStringNull($("#brandId").val())){
        $_jxc.alert("品牌不能为空");
        return;
    }

    var addUrl = contextPath+'/settle/charge/charge/addCharge';
    var updateUrl = contextPath+'/settle/charge/charge/updateCharge';

    var formObj = $("#formchargeRecord").serializeObject();

    if(type === "edit"){
        formObj.id = $("#chargeRecordId").val();
    }
    var param = {
        url:type === "add"|| type === "copy"?addUrl:updateUrl,
        data:JSON.stringify(formObj),
        contentType:'application/json',
    }
    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
            $_jxc.alert("保存成功");
            if(categoryRecordCallback){
                categoryRecordCallback({code:"0"});
            }

        }else{
            $_jxc.alert(result['message']);
        }
    },function (e) {

    })
}

//品牌
function getGoodsBrand(){
    new publicBrandService(function(data){
        $("#brandId").val(data.id);
        $("#brandCode").val(data.brandCode);
        $("#brandName").val(data.brandName);
    });
}

/*
* 费用类别选择
* */
var categroyCodeDialogTemp = null;
function openChargeCodeDialog() {
    categroyCodeDialogTemp = $('<div id="categroyCodeDialog"/>').dialog({
        href: contextPath+"/settle/charge/chargeCategory/publicView",
        width: 600,
        height: 600,
        title: "费用类别选择",
        closable: true,
        resizable: true,
        onClose: function () {
            $(categroyCodeDialogTemp).panel('destroy');
            categroyCodeDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            var categoryDialogClass = new ChargeCategoryDialogClass();
            categoryDialogClass.treeChargeCategory();
            categoryDialogClass.gridChargeCategoryList();
            categoryDialogClass.initPubChCategoryCallback(categroyDialogCb)

        }
    })
}

function categroyDialogCb(data) {
    $("#categoryId").val(data.id);
    $("#categoryCode").val(data.categoryCode);
   $("#categoryName").val(data.categoryName);
}

function closeCategroyCodeDialog() {
    $(categroyCodeDialogTemp).panel('destroy');
    categroyCodeDialogTemp = null;
}

//清空表单
function cleanForm(){
    $("#categoryId").val('');
    $("#categoryCode").val('');
    $("#categoryName").val('');
    $("#remark").val('');
}

