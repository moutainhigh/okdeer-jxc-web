//采购向导 第一步
window.localStorageUtil = {
   setLocalStorageItem:function(localName,localObj){ //设置存储数据，传入key和value；key是任意的字符串，value是一个object
      localStorage.setItem(localName,JSON.stringify(localObj));
   },
   getLocalStorageItem:function(localName){ //获取存储数据，传入之前设置的key
      var data = JSON.parse(localStorage.getItem(localName));
      return data;
   },
   delLocalStorageItem:function(localName){ //删除存储数据，传入之前设置的key
	   localStorage.removeItem(localName);
   },
   clearStorageItem:function(){ //清空所有存储数据
      localStorage.clear()
   }
}

var formData;
$(function(){

    $("#startTime").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM-dd"));
    $("#endTime").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));

    //类别选择初始化
    $('#categorySelect').categorySelect();

    //供应商选择初始化
    $('#supplierComponent').supplierSelect({
        //数据过滤
        loadFilter:function(data){
            data.supplierId = data.id;
            return data;
        }
    });

    //获取数据对象 第二部返回到这一步 进行数据回显
	formData = $("#formData").val();
	
	if('undefined' != typeof(formData) && "" != formData){
		formData = $.parseJSON(formData);
		
		if($.isEmptyObject(formData)){
			initFormValue();
		}else{
			setFormValue(formData);
		}
	}else{
		initFormValue();
	}	
	
	$('.radioItem').change(function(){
		var _this = $(this);
		$('#guideType').val(_this.val());
		if(_this.val() === "1" || _this.val() === "2"){
			$('#startTime').prop('disabled','disabled');
			$('#startTime').addClass('uinp-no-more');
			$('#endTime').prop('disabled','disabled');
			$('#endTime').addClass('uinp-no-more');
			$('#ignore').prop('disabled','disabled');
		}else{
			$('#startTime').removeProp('disabled');
			$('#startTime').removeClass('uinp-no-more');
			$('#endTime').removeProp('disabled');
			$('#endTime').removeClass('uinp-no-more');
			$('#ignore').removeProp('disabled');
		}
	})
});

//初始化条件信息
function initFormValue(){
	//不能选择总部
	if(sessionBranchType > 0){
		$("#branchId").val(sessionBranchId);
		$("#branchCompleCode").val(sessionBranchCompleCode);
		$("#branchCodeName").val(sessionBranchCodeName);
		$("#branchType").val(sessionBranchType);
	}
	
}

//为页面赋值
function setFormValue(formData){
	$("#branchId").val(formData.branchId);
	$("#branchCompleCode").val(formData.branchCompleCode);
	$("#branchCodeName").val(formData.branchCodeName);
	$("#branchType").val(formData.branchType);
	$("#supplierId").val(formData.supplierId);
	$("#supplierCodeName").val(formData.supplierCodeName);
	$("#categoryCode").val(formData.categoryCode);
	$("#categoryCodeName").val(formData.categoryCodeName);
	if(typeof(formData.deliverStartDate) != 'undefined'){
        $('#startTime').val((formData.deliverStartDate).substr(0,10));
	}

    if(typeof(formData.deliverEndDate) != 'undefined'){
        $('#endTime').val((formData.deliverEndDate).substr(0,10));
    }

	$(':radio[name=guideType]').eq(formData.guideType - 1).prop('checked', true);
	if(formData.guideType === 3 || formData.guideType === 4 || formData.guideType === 5){
        $('#startTime').removeProp('disabled');
        $('#startTime').removeClass('uinp-no-more');
        $('#endTime').removeProp('disabled');
        $('#endTime').removeClass('uinp-no-more');
        $('#ignore').removeProp('disabled');
	}
	if(formData.ignore === 1){
		$('#ignore').prop('checked', true);
	}
	
}

/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchParentId").val(data.parentId);
		$("#branchCode").val(data.branchCode);
		$("#branchCompleCode").val(data.branchCompleCode);
		$("#branchType").val(data.type);
		$("#branchCodeName").val("["+data.branchCode+"]"+data.branchName);
	},'BF','');
}

function selectSupplier(){
	
	var param = null;
	
	var supplierCodeName = $("#supplierCodeName").val(); 
	var supplierId = $("#supplierId").val();
	
	var branchId=$("#branchId").val();
	
	//如果是店铺类型，则取父节点分公司的数据
	if(parseInt($("#branchType").val())>=3){
		branchId = $("#branchParentId").val();
	}
	
	//关键词取编号
	var reg = /\[\d{6}\]/;
	if(reg.test(supplierCodeName)){
		supplierCodeName = "";
	}
	
	if(!supplierId){
		param = {
			supplierCodeOrName : supplierCodeName,
			branchId : branchId
		};
	}else{
		param = {
			branchId : branchId
		};
	}
	
	new publicSupplierService(function(data){
		$("#supplierId").val(data.id);
		$("#supplierCodeName").val("["+data.supplierCode+"]"+data.supplierName);
	},param);
	
}

/**
 * 类别选择
 */
function searchCategory(){
	
	var categoryCodeName = $("#categoryCodeName").val();
	var categoryCode = $("#categoryCode").val();
	
	var param = null;
	
	//如果编码为空，则需要快捷查询类别信息
	if(!categoryCode){
		param = { categoryNameOrCode:categoryCodeName };
	}
	
	new publicCategoryService(function(data){
		$("#categoryCode").val(data.categoryCode);
		$("#categoryCodeName").val("["+data.categoryCode+"]"+data.categoryName);
	}, param);
}

//回车或失去焦点后，查询供应商
function supplierAutoComple(){
	//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
	if(event.keyCode && event.keyCode != 13){
		return;
	}
	var supplierNameOrsupplierCode = $("#supplierCodeName").val();
	var branchId=$("#branchId").val();
	
	//未输入值时，直接返回，无需查询
	if("" == supplierNameOrsupplierCode){
		$("#supplierId").val("");
		return;
	}
	
//	//如果是包含中括号，即已选择过供应商信息的，直接return
//	if(supplierNameOrsupplierCode && supplierNameOrsupplierCode.indexOf("[")>=0 && supplierNameOrsupplierCode.indexOf("]")>=0){
//		return;
//	}
	
	//避免用户直接输入完整格式: [编号]名称
	var reg = /\[\d{6}\]/;
	if(reg.test(supplierNameOrsupplierCode)){
		//取出[]里的编号，默认取已第一个[]里的值
		reg = /\[(\d{6})\]/;
		arr = reg.exec(supplierNameOrsupplierCode);
		supplierNameOrsupplierCode = arr[1];
	}
	//请求数据
	var httpUrl = contextPath + "/common/supplier/getComponentList";
	var args = {"supplierNameOrsupplierCode" : supplierNameOrsupplierCode,"branchId" : branchId};
	$.post(httpUrl, args,function(data){
		if(!data || data.list.length == 0){
			//未查询到数据，设置ID为空
			$("#supplierId").val("");
			$("#supplierCodeName").val("");
			return;
		}

		//如果精确匹配到一条数据
		if(data.list.length == 1){
			var rec = data.list[0];
			var supplierId = rec.id;
			var supplierName = rec.supplierName;
			var supplierCode = rec.supplierCode;
			//完善文本显示
			$("#supplierCodeName").val("["+supplierCode+"]"+supplierName);
			//记录ID值,用于后台查询
			$("#supplierId").val(supplierId);
		}

		//如果有多条数据
		if(data.list.length > 1){
			selectSupplier();
		}
	});
}

//回车或失去焦点后，查询商品类别
function categoryAutoComple(){
	//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
	if(event.keyCode && event.keyCode != 13){
		return;
	}
	
	var categoryCodeName = $("#categoryCodeName").val();
	var categoryCode=$("#categoryCode").val();
	//未输入值时，直接返回，无需查询
	if("" == categoryCodeName){
		$("#categoryCode").val("");
		return;
	}
	//避免用户直接输入完整格式: [编号]名称
	var reg = /\[\d{6}\]/;
	if(reg.test(categoryCodeName)){
		//取出[]里的编号，默认取已第一个[]里的值
		reg = /\[(\d{6})\]/;
		arr = reg.exec(categoryCodeName);
		categoryCodeName = arr[1];
	}
	//请求数据
	var httpUrl = contextPath + '/common/category/getComponentList';
	var args = {"categoryNameOrCode" : categoryCodeName,"categoryCode" : categoryCode};
	$.post(httpUrl, args,function(data){
		if(!data || data.list.length == 0){
			//未查询到数据，设置ID为空
			$("#categoryCode").val("");
			return;
		}
		
		//如果只有一条数据
		if(data.list.length == 1){
			var rec = data.list[0];
			var categoryCode = rec.categoryCode;
			var categoryName = rec.categoryName;
			//完善文本显示
			$("#categoryCodeName").val("["+categoryCode+"]"+categoryName);
			//记录ID值,用于后台查询
			$("#categoryCode").val(categoryCode);
			return;
		}
		
		//如果有多条数据，则弹出层选
		if(data.list.length > 1){
			searchCategory();
		}
	});
}

//下一步
function nextStep (){
	
	$('#btnNext').attr("disabled","disabled");
	var isValid = $("#addForm").form('validate');
	
	if(!isValid){
		$('#btnNext').removeAttr("disabled");
		return;
	}
	
	var branchType = $("#branchType").val();
	var branchId = $("#branchId").val();
	var branchCodeName = $("#branchCodeName").val();
	
	if(!branchId){
        $_jxc.alert("请选择机构信息");
		$('#btnNext').removeAttr("disabled");
		return;
	}
	
	if(branchType==0){
        $_jxc.alert("不能选择总部类型的机构");
		$('#btnNext').removeAttr("disabled");
		return;
	}
	
	if($('#guideType').val() != '1' && $('#guideType').val() != "2"){
		if($('#startTime').val() ==="" || $('#endTime').val() === ""){
			$_jxc.alert("请选择要货日期");
			$('#btnNext').removeAttr("disabled");
			return;
		}
	}
	
	var categoryCodeName = $("#categoryCodeName").val();
	var categoryCode = $("#categoryCode").val();
	if(categoryCodeName && !categoryCode){
        $_jxc.alert("商品类别信息不存在，请重新筛选！");
		$('#btnNext').removeAttr("disabled");
		return;
	}
	
	var supplierCodeName = $("#supplierCodeName").val(); 
	var supplierId = $("#supplierId").val();
	if(supplierCodeName && !supplierId){
        $_jxc.alert("供应商信息不存在，请重新筛选！");
		$('#btnNext').removeAttr("disabled");
		return;
	}
	
	var ignore = 0;
	if($('#ignore').is(':checked')) {
		ignore = 1;
	 }
	
	var param = {
			branchId:branchId,
			branchCompleCode:$("#branchCompleCode").val(),
			branchType:branchType,
			branchCodeName:branchCodeName,
			supplierId:$("#supplierId").val(),
			supplierCodeName:$("#supplierCodeName").val(),
			categoryCode:$("#categoryCode").val(),
			categoryCodeName:$("#categoryCodeName").val(),
			deliverStartDate:$('#startTime').val(),
			deliverEndDate:$('#endTime').val(),
			guideType:$(':radio[name=guideType]:checked').val(),
			ignore:ignore
	}
	
	//提交参数并跳转到第二步
	$.StandardPost(contextPath+"/form/purchaseGuide/toGuideGoodsList", param);
	
}

function clearForm() {
    $("input[type = 'hidden']").val("");
    $("input[type = 'text']").val("");
    $("input[type='radio'][value='1']").prop("checked",true);
}