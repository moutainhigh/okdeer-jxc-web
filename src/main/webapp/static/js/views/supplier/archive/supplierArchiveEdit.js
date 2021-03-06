/**
 * Created by huangj02 on 2016/10/12.
 */
$(function(){
	setTimeout(function(){
		$('#freezeAccount').combobox('setValue',$('#freezeAccountVal').val()||0);
		$('#freezeBusiness').combobox('setValue',$('#freezeBusinessVal').val()||0);
	},500)
});

function onChangeSaleWay() {
    var saleWay = 	$('#saleWay').combobox("getValue");
    if(saleWay != "C"){
        $("#minAmountDiv").addClass("unhide");
    }else {
        $("#minAmountDiv").removeClass("unhide");
	}
    $("#minAmount").numberbox("setValue",0.00);
}

function updateSupplier() {
	$("#saleWay").combobox({disabled:false});
	var formObj = $('#formEdit').serializeObject();
	var isValid = $("#formEdit").form('validate');
	if (!isValid) {
		return;
	}

    if($('#supplierName').val().trim()===""){
        $_jxc.alert("请输入供应商名称");
        return;
    }

    var saleWay = 	$('#formEdit #saleWay').combobox("getValue");
    if(saleWay === "C"){


        if(parseFloat(formObj.minAmount).toFixed(2) <= 0.00 || parseFloat(formObj.minAmount).toFixed(2) > 999999.99){
            $_jxc.alert("保底金额在0到999999.99之间");
            return;
        }
    }
    
    var isAllowPurchase = 0;
	if($('#isAllowPurchase').is(':checked')) {
		isAllowPurchase = 1;
	}
	formObj.isAllowPurchase = isAllowPurchase;

	$_jxc.ajax({
		url : contextPath + "/supplier/updateSupplier",
		data : formObj
	},function(result){
		if(result){
            $_jxc.alert(result.message);
            closeDialogHandel();
            reloadListHandel();
		}
	});
}