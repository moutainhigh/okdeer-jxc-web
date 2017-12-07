/**
 * Created by zhaoly on 2017/12/07.
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
	$("#pCategoryId").val(param.categoryId);
    $("#categoryLevel").val(param.categoryLevel);

}

function initCategoryCodeCallback(cb) {
    categoryCodeCallback = cb;
}

function saveCategroyCode() {
    if($_jxc.isStringNull($("#categoryName").val())){
        $_jxc.alert("名称不能为空");
        return;
    }

	var addUrl = contextPath+'/settle/charge/chargeCategory/addCategory';
	var updateUrl = contextPath+'/settle/charge/chargeCategory/updateCategory';
	
	var data = {
        parentId:$("#pCategoryId").val(),
        categoryCode:$("#categoryCode").val(),
        categoryName:$("#categoryName").val().trim(),
        categoryLevel:$("#categoryLevel").val(),
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
                    closeCategoryCodeDialog();
                }
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


//清空表单
function cleanForm(){
    $("#categoryCode").val('');
    $("#categoryName").val('');
    $("#remark").val('');
}

