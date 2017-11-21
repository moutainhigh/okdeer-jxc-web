/**
 * Created by huangj02 on 2016/8/11.
 * 新增商品
 */
var selectionRow = "";
function initGoodsView(data,flag){
	//添加页面根据列表页面选中的类别进行商品分类赋值
	if(flag == "add"){
		//商品分类
		var categoryCode = data.categoryCode;
		if(categoryCode && categoryCode.length == 6){
			$("#categoryId").val(data.categoryId);
			$("#categoryCode").val(data.categoryCode);
			$("#categoryName").val(data.categoryName);
		}
		//商品自动生成货号
//		getSkuCodeVal();
	}else{
		//获取列表复制的值
		getSelectionRow(data);
	}

	//根据商品名称获取助记码
	$("#skuName").on("blur",function(){
		getMemoryCode();
	});

	//第一次进入页面，商品自动生成货号
//	getSkuCodeVal();
	//计价方式
	$('#pricingType').on("onchange",function(){
		//商品自动生成货号
		getSkuCodeVal();
	});

	
	//商品类型
	$('#type').on("type",function(){
		//商品自动生成货号
		getSkuCodeVal();
	});
	
	//生成毛利值，毛利率
	$('#salePrice').textbox({
		onChange:function(newValue,oldValue){
			setGrossProfit();
		}
	});
	$('#purchasePrice').textbox({
		onChange:function(newValue,oldValue){
			setGrossProfit();
		}
	});
	$('#lowestPrice').textbox({
		onChange:function(newValue,oldValue){
			minMaxSalePrice();
		}
	});
}
//获取列表复制的值
function getSelectionRow(data){
	selectionRow = data;//getQueryString("data") == "" ? "" : getQueryString("data");
	if(selectionRow != ""){
		selectionRow = JSON.parse(unescape(selectionRow));
		setInputValByObj();
		$("#skuCode").val(null);
		$("#barCode").val(null);
	}
}

//根据复制的值，给input框赋值

var categoryCode="";
function setInputValByObj(){
	if(selectionRow!=null){
		
		$.each(selectionRow[0]||selectionRow,function(key,value){
			//普通的input
			
			if(key=="braCode"||key=="skuCode"){
				
			}else if($("#"+key).prop("tagName") == "INPUT"){
				//进项税、销项税、联营扣率要乘以100
//				if($("#"+key).attr("id") == "outputTax" || $("#"+key).attr("id") == "inputTax" || $("#"+key).attr("id") == "supplierRate"){
//				$("#"+key).val(value*100);
//				}else{
//				$("#"+key).val(value);
//				}
				if($("#"+key).attr('type')=="checkbox"){
					if(value){ //传到前端checkbox选中的值是true
						$("#"+key).attr("checked","checked");
					}
				}else{
					//进项税、销项税、联营扣率要乘以100
					if($("#"+key).attr("id") == "outputTax" || $("#"+key).attr("id") == "inputTax" || $("#"+key).attr("id") == "supplierRate"){
						if(value){
							$("#"+key).textbox("setValue",parseFloat((value*100).toFixed(2)));
						}else{
							$("#"+key).textbox("setValue",0.00);
						}
					}else{
						if($("#"+key).hasClass('easyui-numberbox')){
							$("#"+key).numberbox('setValue', value);
						}else{
							if(key == "categoryCode"){
								categoryCode = value;
							}
							$("#"+key).val(value);
							//不在三级类别商品特殊处理
							if(categoryCode){
								if(categoryCode.length!=6){
									$("#categoryId").val('');
									$("#categoryCode").val('');
									$("#categoryName").val('');
								}
							}
						}

					}
				}

			}else if($("#"+key).prop("tagName") =="TEXTAREA"){ //普通的textarea
				$("#"+key).html(value);
			}
			else if($("#"+key).prop("tagName") == "SELECT"){
				if(value){
					$("#"+key+" option").each(function(i,n){
						if($(n).val() == value || $(n).val()==value.name){
							$(n).attr("selected",true);
						}
					});
					if(key=="unit"){
						$("#"+key).combobox("setValue",value);
					}else{
						$("#"+key).combobox("setValue",value.name);
						
					}
				}
				
				
			}
		});
	}
	$("#skuCode").val(null);
	$("#barCode").val($("#skuCode").val()); //货号
	if(selectionRow.saleWay=='A'){
		$('#supplierRate').numberbox('disable');
	}else{
		$('#supplierRate').numberbox('enable');
	}
	$("#createDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd hh:mm:ss"));
	//生成毛利值，毛利率
	setGrossProfit();
	
}

//输入小数点，小数点无位数限制
function floatNunber(obj){
	if(obj.value == obj.value2)return;
	if(obj.value.search(/^\d*(?:\.\d*)?$/) == -1){
		obj.value = (obj.value2) ? obj.value2 : '';
	}	
	else{
		obj.value2 = obj.value;
	}
}

//输入小数点，小数点2位数限制
function floatNumberLimit(obj){
	if(obj.value == obj.value2)return;
	if(obj.value.search(/^\d{0,9}(?:\.\d{0,2})?$/) == -1){
		obj.value = (obj.value2) ? obj.value2 : '';
	}	
	else{
		obj.value2 = obj.value;
	}
}



//根据商品名称获取助记码
function getMemoryCode(){
	var reqObj = {"skuName":$("#skuName").val()};
	$_jxc.ajax({
		url:contextPath+"/common/goods/getMemoryCode",
		data:reqObj,
		dataType:'text'
	},function(result){
		$("#memoryCode").val(result); //助记码
	});
}


//商品自动生成货号
function getSkuCodeVal(){
	var pricingType = 	$('#pricingType').combobox("getValue");
	//计件方式为“普通”，需要商品类别生成货号，其他不需要，直接生成货号，并且货号全部都是只可读
	if(pricingType == ""){
		return false;
	}else{
		//计件方式为“普通”
		if(pricingType == "ORDINARY"){
			$("#barCode").removeAttr("readonly");
		}else{ //“其他”计件方式
			$("#barCode").attr("readonly","readonly");
			$("#barCode").val($("#skuCode").val()); //货号
		}
	}
}

//监听方法
//商品分类
function getGoodsType(){
	var param = {
			categoryType:'addArchives'
	}
	new publicCategoryService(function(data){
		$("#categoryId").val(data.goodsCategoryId);
		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val(data.categoryName);
		//商品自动生成货号
//		getSkuCodeVal();
	},param);
}

//品牌
function getGoodsBrand(){
	new publicBrandService(function(data){
		$("#brandId").val(data.id);
		$("#brandCode").val(data.brandCode);
		$("#brandName").val(data.brandName);
	});
}

//供应商公共组件
function getGoodsPupplier(){
	new publicSupplierService(function(data){
		$("#supplierId").val(data.id);
		$("#supplierName").val(data.supplierName);
		$("#saleWayName1").val(data.saleWayName);

		//经营方式
		$("#saleWay").val(data.saleWay);
        //商品类型
        var pricingType = 	$('#type').combobox("getValue");
		if(data.saleWay=='A'){
			$("#supplierRate").textbox("setValue","");
			$('#supplierRate').numberbox('disable');
            if(pricingType == "BIND"|| pricingType == "AUTOMATICTRANSFER"){
                $("#managerStock").removeAttr("checked");
                $("#managerStock").prop("disabled","disabled");
            }else{
                $("#managerStock").prop("checked","checked");
                $("#managerStock").removeProp("disabled");
            }
		}else{
            if(data.saleWay=='C' || pricingType == "BIND"|| pricingType == "AUTOMATICTRANSFER"){
                $("#managerStock").removeAttr("checked");
                $("#managerStock").prop("disabled","disabled");
            }else{
                $("#managerStock").prop("checked","checked");
                $("#managerStock").removeProp("disabled");
            }

            $('#supplierRate').numberbox('enable');
		}
	});
}

//毛利值 = 零售价-进货价
function setGrossProfit(){
	var salePrice = parseFloat($("#salePrice").val().trim() || 0);
	var purchasePrice = parseFloat($("#purchasePrice").val().trim() || 0);
	var lowestPrice = parseFloat($("#lowestPrice").val().trim() || 0);
	if(salePrice<lowestPrice){
		salePrice=lowestPrice;
		$("#salePrice").textbox("setValue",salePrice);
	}
	if(salePrice != "" && purchasePrice != ""){
		var grossProfit = salePrice - purchasePrice;
		$("#grossProfit").textbox("setValue",grossProfit.toFixed(2));
		setGrossProfitPercent();
	}
}

//最低售价不能大于零售价
function minMaxSalePrice(){
	var salePrice = parseFloat($("#salePrice").val().trim() || 0);
	var lowestPrice = parseFloat($("#lowestPrice").val().trim() || 0);
	if(lowestPrice>salePrice){
		lowestPrice=salePrice;
		$("#lowestPrice").textbox("setValue",salePrice);
	}
}

function setGrossProfitPercent(){
	var salePrice = parseFloat($("#salePrice").val().trim());
	var purchasePrice = parseFloat($("#purchasePrice").val().trim());
	var grossProfitPercent = (salePrice - purchasePrice) / salePrice;
	$("#marginTax").numberbox("setValue",(grossProfitPercent*100).toFixed(2));
}

//商品保存
function saveGoodsArchives(){
	$('#saveGoodsArchives').attr("disabled","disabled");
	var isValid = $("#formGoodsArchivesAdd").form('validate');
	
	if(!isValid){
		$('#saveGoodsArchives').removeAttr("disabled");
		$_jxc.alert("请完善商品必填信息");
		return;
	}

    if($('#skuName').val().trim()===""){
        $('#saveGoodsArchives').removeAttr("disabled");
        $_jxc.alert("请输入商品名称");
        return;
    }
	
    if($('#categoryCode').val().trim()===""){
    	$('#saveGoodsArchives').removeAttr("disabled");
    	$_jxc.alert("请选择商品类别");
    	return;
    }
    
	var salePriceV = $("#salePrice").numberbox("getValue");
    var vipPrice = $("#vipPrice").numberbox("getValue");
    if(!salePriceV || parseFloat(salePriceV) < 0){
    	$('#saveGoodsArchives').removeAttr("disabled");
		$_jxc.alert("零售价不能为空!");
		return;
	}
    /*if(parseFloat(vipPrice || 0) <= 0){
        $('#saveGoodsArchives').removeAttr("disabled");
        $_jxc.alert("会员价必须大于0!");
        return;
    }*/
	
	if($('#purchaseSpec').val()=="0.00"){
		$('#saveGoodsArchives').removeAttr("disabled");
		$_jxc.alert("进货规格不能为0!");
		return;
	}
	
	if($("#distributionSpec").val()=== '0.00'){
		$('#saveGoodsArchives').removeAttr("disabled");
		$_jxc.alert("配送规格不能为0");
		return;
	}
	
	if(parseFloat($("#vipPrice").val()) > parseFloat($("#salePrice").val())){
		$('#saveGoodsArchives').removeAttr("disabled");
		$_jxc.alert("会员价不能大于零售价");
		return;
	}
	
	//校验商品条码是否重复
	var pricingType = $('#pricingType option:selected').val();
	var barCode = $("#barCode").val();
	var skuName = $("#skuName").val();
	// 普通商品需要校验条码是否重复
	var reqObj = {"barCode":barCode, "skuName":skuName,"id":$("#id").val()};
	$_jxc.ajax({
		url:contextPath+"/goods/operateNewGoodsApply/checkBarCodeByOrdinary",
		data:reqObj,
		async:false
	},function(result){
		if(result.code == 0){
			submitFormValidate(salePriceV);
		}else{
			$('#saveGoodsArchives').removeAttr("disabled");
			$_jxc.alert(result.message,"提示");
		}
	});
}

function submitFormValidate(salePriceV) {
	if (parseFloat(salePriceV) == 0) {
		$_jxc.confirm('商品零售价为0，是否继续保存？',
				function(data) {
					if (data) {
						submitForm();
					}else{
						$('#saveGoodsArchives').removeAttr("disabled");
					}
				});
	} else {
		submitForm();
	}
}

//提交表单
function submitForm(){
	$('#formGoodsArchivesAdd').form("submit",{
		url:contextPath+'/goods/operateNewGoodsApply/addGoods',
		success:function(data){
			if(JSON.parse(data).code == 0){
				closeDialog();
				openDialog(contextPath+"/goods/operateNewGoodsApply/updateGoodsView?id="+JSON.parse(data).id,"修改新品申请","edit",JSON.parse(data).id);
                $_jxc.alert("保存成功");
				$("#gridArchives").datagrid('reload');
			}else{
				$('#saveGoodsArchives').removeAttr("disabled");
                $_jxc.alert(JSON.parse(data).message);
			}
		}
	});
}
function onChangeUnit(newV,oldV){
	$("#unit").combobox("setValue",newV);
}
//输入数字，保留两位小数
function checkSupplierRate(obj){
	obj.value =obj.value.replace(/[^0-9.]/g,'');
	if(obj.value.indexOf(".")>-1){
		if(obj.value.split(".").length-1>1){
			obj.value =obj.value.substring(0, obj.value.length-1);
		}else{
			if(obj.value.substr(obj.value.indexOf(".")+1).length > 2){
				obj.value =  obj.value.substring(0, obj.value.length-1);
			}
		}	  
	} 

	if(obj.value >= 100){
		obj.value =  obj.value.substring(0, obj.value.length-1);
	}
	return obj.value;
}
//重置
function pricingTypeChange(){
	getSkuCodeVal();
}
function typeChange(){
	var pricingType = 	$('#type').combobox("getValue");
	//计件方式为“普通”，需要商品类别生成货号，其他不需要，直接生成货号，并且货号全部都是只可读
	if(pricingType == ""){
		return false;
	}else{
		//计件方式为“普通”
		if(pricingType == "BIND"||pricingType == "AUTOMATICTRANSFER"){
			$("#managerStock").removeAttr("checked");
			$("#managerStock").prop("disabled","disabled");
		}else{
            if( $("#saleWay").val() == "C"){
                $("#managerStock").removeAttr("checked");
                $("#managerStock").prop("disabled","disabled");
            }else{
                $("#managerStock").prop("checked","checked");
                $("#managerStock").removeProp("disabled");
            }
		}
	}
}
