/**
 * Created by zhaoly on 2017/5/23.
 */
$(function () {
    
})
var type = "add";

var nodeCode = "" ;
var servciecallback = null;
function initServiceDialogCallback(cb) {
    servciecallback = cb;
}

function initServiceDialog(param) {
    type = param.type;
	if(param.type === "edit"){
		$("#id").val(param.id);
        $("#branchName").val(param.branchName);
        $("#csrserviceType").val(param.csrserviceType);
        $("#csrserviceName").val(param.csrserviceName);
        $("#referencePrice").numberbox('setValue', param.referencePrice);
        $("#isAllowAdjustPrice").combobox('select', param.isAllowAdjustPrice==="true" ? 1 : 0);
        $("#remark").val(param.remark);
        $("#csrserviceCode").val(param.csrserviceCode);
        $("#ckbSaveLabel").css("display","none");
    } else {
        $("#typeId").val(param.typeId);
        $("#branchName").val(param.branchName);
        $("#csrserviceType").val(param.csrserviceType);
    }
    $("#dictTypeId").val(param.dictTypeId);
}

function saveServiceCode() {
    //校验表单
    if ($_jxc.isStringNull($("#csrserviceName").val())) {
        $_jxc.alert("服务名称不能为空");
        return;
    }

    if ($_jxc.isStringNull($("#referencePrice").val())) {
        $_jxc.alert("单价不能为空");
        return;
    }

    if(parseFloat($("#referencePrice").val()).toFixed(2) == 0.00){
        $_jxc.alert("单价不能为0");
        return;
    }

    var addUrl = contextPath + '/service/item/save/csrservice';
    var updateUrl = contextPath + '/service/item/edit/csrservice';

    //var isFixed = null;
	
	// if(nodeCode.startWith("101005")){
	// 	isFixed = $('#isFixed').is(':checked') ? 1 : 0;
	// }
	
	var data = {
        csrserviceName: $("#csrserviceName").val(),
        referencePrice: $("#referencePrice").numberbox('getValue'),
        isAllowAdjustPrice: $("#isAllowAdjustPrice").combobox("getValue"),
        remark:$("#remark").val(),
        typeId: $("#typeId").val()
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
            if (type === "add") {
                if ($("#ckbSave").is(":checked")) {
                    cleanForm();
                } else {
                    closeFinanceDialog();
                }
            } else {
                closeFinanceDialog();
            }
            queryService();
        }else{
            $_jxc.alert(result['message']);
        }
    },function (e) {

    })
}

//清空表单
function cleanForm(){
    $("#csrserviceName").val('');
    $("#referencePrice").numberbox('setValue', '');
    $("#isAllowAdjustPrice").combobox('setValue', '0');
    $("#remark").val('');
}
