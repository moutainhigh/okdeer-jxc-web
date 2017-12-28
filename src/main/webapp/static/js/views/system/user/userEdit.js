$(function(){
    initCheck();
    
    initpriceGrantCheck();
});


/**
 * 机构列表下拉选
 */
function searchBranchInfo (){
	new publicAgencyService(function(data){
		$("#editUserForm #opBranchCompleCode").val(data.branchCompleCode);
		$("#editUserForm #opBranchId").val(data.branchesId);
		$("#editUserForm #opBranchType").val(data.type);
		$("#editUserForm #branchNameCode").val("["+data.branchCode+"]"+data.branchName);

        if(data.type > 3){
            $("#purchase_price").prop("disabled","disabled");
            $("#purchase_price").removeProp("checked");
        }else {
            $("#purchase_price").removeProp("disabled","disabled");
            // $("#purchase_price").prop("checked","checked");
		}

        $("#editUserForm #opRoleId").val("");
        $("#editUserForm #opRoleCode").val("");
        $("#editUserForm #roleCodeOrName").val("");
        $("#maxDiscountRadio").numberbox("setValue",100);
        $("#maxDiscountRadio").numberbox({readonly: true});
        $("#billMaxDiscountRate").numberbox("setValue",100);
        $("#billMaxDiscountRate").numberbox({readonly: true});
	},"","");
}

/**
 * 角色列表下拉选
 */
function searchRole (){
	var opBranchCompleCode = $("#editUserForm #opBranchCompleCode").val();
	if(!opBranchCompleCode){
        $_jxc.alert("请先选择机构！");
		return;
	}
	var opBranchType = $("#editUserForm #opBranchType").val();
	new publicRoleService(function(data){
		$("#editUserForm #opRoleId").val(data.id);
		$("#editUserForm #opRoleCode").val(data.roleCode);
		$("#editUserForm #roleCodeOrName").val(data.roleName);
		
		//只有门店角色可以编辑最大折扣率
		var branchType = data.branchType;
		if(branchType==3||branchType==4||branchType==5){
			$("#maxDiscountRadio").numberbox({readonly: false});
			$("#billMaxDiscountRate").numberbox({readonly: false});
		}else{
			$("#maxDiscountRadio").numberbox("setValue",100);
			$("#maxDiscountRadio").numberbox({readonly: true});
			$("#billMaxDiscountRate").numberbox("setValue",100);
			$("#billMaxDiscountRate").numberbox({readonly: true});
		}
	}, opBranchCompleCode, opBranchType);
}

/**
 * 编辑用户
 */
function editUser(){	
	var reqObj = $('#editUserForm').serializeObject();
	var isValid = $("#editUserForm").form('validate');
	if (!isValid) {
		return;
	}

	var priceGrantArray = new Array();
	$(':checkbox[name="priceGrants"]:checked').each(function(){    
		priceGrantArray.push($(this).val());    
	});  
	
	var priceGrantStr = priceGrantArray.join(",");
	reqObj.priceGrantStr = priceGrantStr;

	var param = {
        url : contextPath + "/system/user/updateUser",
		data:reqObj
	};
    $_jxc.ajax(param,function(result){
        if(result['code'] == 0){
            $_jxc.alert("操作成功");
            reloadDataGrid();
        }else {
            $_jxc.alert(result.message);
        }
	});

}

function savePassword() {
    var reqObj = $('#passwordForm').serializeObject();
    var isValid = $("#passwordForm").form('validate');
    var userPwd = $("#userPwd").val();
    if(!$.trim(userPwd)){
    	$_jxc.alert("密码不能为空");
    	return;
    }

    var regex = /^[A-Za-z0-9]{8,18}$/;
    if(/^\d+$/.test(userPwd)){
        $_jxc.alert("请输入密码长度为8-18位，字母+数字，不能是纯数字");
        return ;
    }

    if(!regex.test(userPwd)){
        $_jxc.alert("请输入密码长度为8-18位，字母+数字，不能是纯数字");
        return ;
    }

    var param = {
        url : contextPath + "/system/user/updatePwd",
		data :{
			userId:$("#passwordForm #id").val(),
			password:$("#passwordForm #userPwd").val()
		}
	}
    $_jxc.ajax(param,function(result){
        if(result['code'] == 0){
            $("#userPwd").textbox({"type":"password"})
            $_jxc.alert("操作成功");
        }else {
            $_jxc.alert(result.message);
        }

    })
}

function initPassword() {
    $_jxc.confirm('是否进行密码初始化',function(data){
    	if(data){
    		var param = {
    				url:contextPath+"/system/user/initPwd",
    				data:{
    					userId:$("#passwordForm #id").val()
    				}
    		}
    		
    		$_jxc.ajax(param,function (result) {
    			if(result['code'] == 0){
    				$_jxc.alert("密码初始化成功,初始化密码为：123456");
    			}else {
    				$_jxc.alert(result.message);
    			}
    			
    		})
    	}
	})
}

function initCheck() {

    // 进价
    $("#purchase_price").on("click", function() {
        if($("#purchase_price").is(":checked")){
            $("#cost_price").prop("checked","checked")
		}else {
            $("#cost_price").removeProp("checked")
		}

    });
    // 成本价
    $("#cost_price").on("click", function() {
        if($("#cost_price").is(":checked") && parseInt($("#editUserForm #opBranchType").val()) <= 3){
            $("#purchase_price").prop("checked","checked")
        }else {
            $("#purchase_price").removeProp("checked")
        }
    });
}

function initpriceGrantCheck(){
	var priceGrantStr = $("#priceGrantStr").val();
	if(!priceGrantStr){
		return;
	}
	
	var priceGrantArray = priceGrantStr.split(",");
	for(var i in priceGrantArray){
		if($("#"+priceGrantArray[i])){
			$("#"+priceGrantArray[i]).prop("checked", true);
		}
	}

    if(parseInt($("#editUserForm #opBranchType").val()) > 3){
        $("#editUserForm #purchase_price").prop("disabled","disabled");
        $("#editUserForm #purchase_price").removeProp("checked");
    }
}

function iconOpenHandler(e){
    var targe = e.data.target;
    if(targe.type === "text"){
        targe.type = 'password';
        $("#userPwd").textbox({"type":"password"})
	}else{
        targe.type = 'text';
        $("#userPwd").textbox({"type":"text"})
	}

    $(e.data.target).textbox("setValue",targe.value);
}
