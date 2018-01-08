var dolg=$('#regadd');
function setDolgObj(obj){
	dolg = obj;
}
/**
 * 新增pos 关闭
 */
function toClose(){
	$(dolg).panel('destroy');
}

/**
 * 店铺名称
 */
function searchBranch(){
	new publicAgencyService(function(data){
		$("#registerAddForm #regBranchId").val(data.branchesId);
		$("#registerAddForm #branchName").val(data.branchName);
	},'DP','');
}

/**
 * posNo验证
 */

function toSearchBranchHandel(){
	setTimeout(function(){
		$("#branchName").blur();
		searchBranch();
	}, 10)

}
/**
 * 新增pos 保存
 */
function toSaveAddData(){
	//校验表单
	var isValid = $("#registerAddForm").form('validate');
	if(!isValid){
		return;
	}
	
	var regBranchId=$("#registerAddForm #regBranchId").val();
	if(!regBranchId){
		$_jxc.alert("请先选择店铺名称");
		return;
	}
    var posNo=$('#posNo').val();
	if(!posNo){
		$_jxc.alert("请输入POS机编号");
		return;	
	}
	if(posNo.length<2){
		$_jxc.alert("请输入正确的POS机编号");
		return;	
	}
	$_jxc.ajax({
    	url:contextPath+"/pos/register/addRegister",
    	data:{
    		"branchId" : regBranchId,
    		"posNo":posNo
    	}
    },function(result){
		
		if(result['code'] == 0){
			$_jxc.alert("保存成功！");
			$(dolg).panel('destroy');
			$('#registerList').datagrid("reload");
		}else{
			$_jxc.alert(result['message']);
		}
    });
}
