/**
 * Created by zhaoly on 2017/5/23.
 */
$(function () {
    
})
var type = "add";

var nodeCode = "" ;
function initFinanceDialog(param) {
    type = param.type;
    
    $("#dictTypeId").val(param.dictTypeId);
    
    if(type === "edit"){
    	
        $("#value").addClass("uinp-no-more")
        $("#value").prop("readOnly","readOnly");
        $("#ckbSaveLabel").css("display","none");
        
        var params = {
            url:contextPath+"/archive/financeCode/getDictById",
            data:{
            	dictId:param.id
            }
        }

        $_jxc.ajax(params,function (result) {
            if(result['code'] == 0){
            	initFinanceData(result.data);
            }else{
                $_jxc.alert(result['message'])
            }
        })
        
	}
    
    // 机构运营费用打开是否固定的选项
    nodeCode = param.nodeCode;
    if(nodeCode.startWith("101005")){
        $("#dvFixed").removeClass("uhide");
    	$("#isFixedLabel").removeClass("uhide");
    }else if(nodeCode.startWith("101004")){
        $("#dvRefund").removeClass("uhide");
        $("#dvPost").removeClass("uhide");
        $("#dvFixed").addClass("uhide");
    }
}

function initFinanceData(data){
	$("#id").val(data.id);
    $("#value").val(data.value);
    $("#label").val(data.label);
    $("#remark").val(data.remark);
    
    if(nodeCode.startWith("101004")){
    	$("#refundType").combobox("setValue",data.refundType);
    	if(data.isClientDisplay == 1){
    		$('#isClientDisplay').prop('checked', true);
    	}else{
    		$('#isClientDisplay').removeProp('checked');
    	}
        if(data.isSystemDefault == 1){
        	$('#isSystemDefault').prop('checked', true);
        }else{
        	$('#isSystemDefault').removeProp('checked');
        }
    }else if(nodeCode.startWith("101005")){
    	if(data.isFixed == 1){
    		$('#isFixed').prop('checked', true);
    	}else{
    		$('#isFixed').prop('checked');
    	}
    }
}

function saveFinanceCode() {
    //校验表单
    if($_jxc.isStringNull($("#value").val())){
        $_jxc.alert("编号不能为空");
        return;
    }

    if(nodeCode.startWith("101004")){
    	if($("#value").val().trim().length < 3){
    		$_jxc.alert("编号为3位大写字母");
    		return;
    	}
    }else{
    	if($("#value").val().trim().length < 4){
    		$_jxc.alert("编号为4位数字");
    		return;
    	}
    }


    if($_jxc.isStringNull($("#label").val())){
        $_jxc.alert("名称不能为空");
        return;
    }

	var addUrl = contextPath+'/archive/financeCode/addFinanceCode'; 
	var updateUrl = contextPath+'/archive/financeCode/updateFinanceCode';
	
	var isFixed = null;
	var refundType = null;
	var isClientDisplay = null;
	var isSystemDefault = null;
	
	if(nodeCode.startWith("101004")){
		refundType = $("#refundType").val();
		isClientDisplay = $('#isClientDisplay').is(':checked') ? 1 : 0;
		isSystemDefault = $('#isSystemDefault').is(':checked') ? 1 : 0;
	}
	
	if(nodeCode.startWith("101005")){
		isFixed = $('#isFixed').is(':checked') ? 1 : 0;
	}
	
	var data = {
        dictTypeId:$("#dictTypeId").val(),
        value:$("#value").val(),
        label:$("#label").val().trim(),
        remark:$("#remark").val(),
        isFixed:isFixed,
        refundType:refundType,
        isClientDisplay:isClientDisplay,
        isSystemDefault:isSystemDefault
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
            queryFinanceCode();
            $_jxc.alert("保存成功");
            if(type === "add"){
                if($("#ckbSave").is(":checked")){
                    cleanForm();
                }else {
                    closeFinanceDialog();
                }
            }else{
                closeFinanceDialog();
            }


        }else{
            $_jxc.alert(result['message']);
        }
    },function (e) {

    })
}

//清空表单
function cleanForm(){
    $("#value").val('');
    $("#label").val('');
    $("#remark").val('');
}

