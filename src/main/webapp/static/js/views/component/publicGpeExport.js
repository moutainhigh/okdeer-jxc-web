/**
 * GPE 导出
 */

// 全局变量，由于弹窗均使用Div方式，故此处变量命名较长，尽量不与业务发生冲突
var _gpe_export_datagrid_id;
var _gpe_export_params;
var _gpe_export_url;

//定义Class
function GpeExportClass() {
	
}

// 初始化参数
GpeExportClass.prototype.initGpeParams = function(data){
	_gpe_export_datagrid_id = data.datagridId;
	_gpe_export_params = data.queryParams;
	_gpe_export_url = data.url;

    $("#gpeExportDataForm #totalRows").html("<strong>"+$("#"+_gpe_export_datagrid_id).datagrid('getData').total+"</strong>");
}

toGpeExportOk = function(){
    debugger;
	// 是否选择导出项
    var choose = $('#gpeExportDataForm input[name="chose"]:checked').val();
    if(choose == null){
        $_jxc.alert("请选择导出项");
        return;
    }
    
    // 开始行，默认为1
    var stratRow = 1;
    // 结束行，默认为当前页结束行
    var endRow = $("#"+_gpe_export_datagrid_id).datagrid('getData').endRow;
    
    //当前页
    if(choose=="0"){
        stratRow = $("#"+_gpe_export_datagrid_id).datagrid('getData').startRow ;
        endRow = $("#"+_gpe_export_datagrid_id).datagrid('getData').endRow;
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
        endRow = $("#"+_gpe_export_datagrid_id).datagrid('getData').total;
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
        stratRow = parseInt($("#gpeExportDataForm #startRow").val());
        endRow = parseInt($("#gpeExportDataForm #endRow").val());
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
    
    _gpe_export_params.startCount = stratRow - 1;
    _gpe_export_params.endCount = endRow - (stratRow - 1);
    
	// 模拟表单进行提交
	// var form = $("<form>");
    // $("#exportDataForm").attr("style", "display:none");
    $("#gpeExportDataForm").attr("target", "");
    $("#gpeExportDataForm").attr("method", "post");
    $("#gpeExportDataForm").attr("action", _gpe_export_url);
	var input;
	$.each(_gpe_export_params, function(key, value) {
		input = $("<input type='hidden'>");
		input.attr({
			"name" : key
		});
		input.val(value);
		$("#gpeExportDataForm").append(input);
	});

    $("#gpeExportDataForm").submit();
    $("#gpeExportDataForm").remove();
	
	$('#gpeExportDialog').panel('destroy');
}

// 取消导出
function toGpeExportCancel(){
	$('#gpeExportDialog').panel('destroy');
}