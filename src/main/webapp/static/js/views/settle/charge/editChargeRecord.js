/**
 * Created by zhaoly on 2017/12/7.
 */
$(function () {

})
var type = "add";

var categoryRecordCallback = null;
function initCategoryRecordDialog(param) {
    type = param.type;
        $.each(param,function (index,item) {
            if(index === "financeType"){
                $('#formChargeRecord #financeType'+item).prop('checked',true);
            }else if(index === "purPrice" || index === "depreciate" || index === "validity"){
                $("#formChargeRecord #"+index).numberbox("setValue",item);
            }else{
                    $("#formChargeRecord #"+index).val(item);
                }
        })

    if(type === "edit"){
        $("#formChargeRecord #chargeRecordId").val(param.id);
    }

    if(type === "copy"){
        $("#formChargeRecord #chargeRecordId").val("");
        $("#formChargeRecord #chargeCode").val("");
    }
}

function initCategoryRecordCallback(cb) {
    categoryRecordCallback = cb;
}

function saveChargeRecord() {
    if($_jxc.isStringNull($("#formChargeRecord #chargeName").val())){
        $_jxc.alert("名称不能为空");
        return;
    }

    if($_jxc.isStringNull($("#formChargeRecord #categoryId").val())){
        $_jxc.alert("类别不能为空");
        return;
    }

    var addUrl = contextPath+'/settle/charge/charge/addCharge';
    var updateUrl = contextPath+'/settle/charge/charge/updateCharge';

    var formObj = $("#formChargeRecord").serializeObject();

    if(type === "edit"){
        formObj.id = $("#formChargeRecord #chargeRecordId").val();
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

    new publicChargeCodeService(function (data) {
        $("#formChargeRecord #categoryId").val(data.id);
        $("#formChargeRecord #categoryCode").val(data.categoryCode);
        // var code = "["+data.categoryCode+"]"
        $("#formChargeRecord #categoryName").val(data.categoryName);
    })
}


