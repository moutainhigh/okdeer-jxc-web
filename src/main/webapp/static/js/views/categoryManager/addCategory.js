
function save() {
	$('#saveCategory').attr("disabled","disabled");
	var isValid = $("#formAdd").form('validate');
	if (!isValid) {
		$('#saveCategory').removeAttr("disabled");
		return;
	}
	
	
	var formObj = $('#formAdd').serializeObject();
	$.ajax({
		url : contextPath + "/common/category/saveCategory",
		type : "POST",
		data : formObj,
		success : function(result) {
			if(result.code == 0){
				alertTip(result.message, initTreeArchives);
				var flag = $("input[type='checkbox']").is(':checked');
				if(flag){
					$('#saveCategory').removeAttr("disabled");
					cleanForm();
				}else{
					closeDialogHandel();
				}
			}else{
				$('#saveCategory').removeAttr("disabled");
				alertTip(result.message);
			}
		},
		error : function(result) {
			successTip("请求发送失败或服务器处理失败");
		}
	});
}

//清空表单
function cleanForm(){
	$("#categoryCode").val('');
	$("#categoryName").val('');
	$("#remark").val('');
}

//关闭属性编辑窗口
function closeDialogHandel(){
    if(addDalogTemp){
        $(addDalogTemp).panel('destroy');
    }
}