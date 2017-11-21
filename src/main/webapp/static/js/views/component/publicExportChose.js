/**
 * Created by zhaoly on 2017/9/14.
 */
$(function(){

});

var exprotGridId = "";
function initExportChoseParam(param) {
    exprotGridId = param.datagridId;
    url = param.url;
    $("#exportDataForm #totalRows").html("<strong>"+$("#"+exprotGridId).datagrid('getData').total+"</strong>");
    createForm(param.formObj)
}

var exportChoseCallBack = null;
function initExportChoseCallBack(cb) {
    exportChoseCallBack = cb;
}

function createForm(formObj){
        if(formObj){
            //根据参数序列化到dom结构中
            for(key in formObj){
                    var _inpStr = "<input type='hidden' name='"+key+"' id='"+key+"' value='"+(formObj[key]||"")+"' />";
                    $('#exportDataForm').append(_inpStr);
            }
        }
}

function sureExportExcel(){
    var choose = $('input[name="chose"]:checked').val();
    if(choose == null){
        $_jxc.alert("请选择导出项");
        return;
    }

    var stratRow = 1;
    var endRow = $("#"+exprotGridId).datagrid('getData').endRow;
    //当前页
    if(choose=="0"){
        stratRow = $("#"+exprotGridId).datagrid('getData').startRow ;
        endRow = $("#"+exprotGridId).datagrid('getData').endRow;
        if(typeof(stratRow)=="undefined"){
            stratRow = 1;
        }
        if(typeof(endRow)=="undefined"){
            endRow = 20000;
        }
    }
    //全部页面
    if(choose=="1"){
        stratRow = 1;
        endRow = $("#"+exprotGridId).datagrid('getData').total;
        if(typeof(endRow)=="undefined"){
            endRow = 20000;
        }
        if (endRow > 20000) {
            $_jxc.alert("最大导出20000条");
            return;
        }
    }
    //手动填写范围
    if(choose=="2"){
        stratRow = parseInt($("#startRow").val());
        endRow = parseInt($("#endRow").val());
        if ((endRow - stratRow + 1) > 20000) {
            $_jxc.alert("最大导出20000条");
            return;
        }
        if(!stratRow || !endRow ){
            $_jxc.alert("请填写正确页面范围");
            return;
        }else if(parseInt(endRow) < parseInt(stratRow)){
            $_jxc.alert("请输入正确的页面范围");
            return;
        }
    }
    if (stratRow === null || stratRow === 0) {
        stratRow = 1;
    }

    // 调用导出
    var data = {
        startCount :stratRow - 1,
        endCount:endRow - (stratRow - 1)
    }
    // exportChoseCallBack(data);

    $("#startCount").val(data.startCount);
    $("#endCount").val(data.endCount);
    $("#exportDataForm").attr("action",url);
    $("#exportDataForm").submit();
    $("#exportDataForm").remove();
    $('#exportChose').panel('destroy');


}
function checkNumber(obj){
    if(obj.value.length == 1){
        obj.value=obj.value.replace(/[^1-9]/g,'');
    }else{
        obj.value=obj.value.replace(/\D/g,'');
    }
    return obj.value;
}

/**
 * 取消
 */
function toCancel(){
    $('#exportChose').panel('destroy');
}