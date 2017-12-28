/**
 * Created by huangj02 on 2016/8/11.
 * 新增商品
 */
var selectionRow = "";
function initGoodsView(data,flag){
	
	 $('#tab2').css('display','none');
	//添加页面根据列表页面选中的类别进行商品分类赋值
	if(flag == "add"){
		
		$('#checkDate').css("display", "none");  
		$('#checkUserName').css("display", "none");  
		$('#applyDiv').css("display", "none");  
		
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
	
	//2.7 20392  默认是联营  是否管理库存默认不勾选
	if( $("#saleWay").val() == "C"){
        $("#managerStock").removeAttr("checked");
        $("#managerStock").prop("disabled","disabled");
	}else{
        $("#managerStock").prop("checked","checked");
        $("#managerStock").removeProp("disabled");
	}
	
    // hidePageElement();
	
	// 根据商品类型判断是否管理库存
	isEnableManagerStock();
}

function hidePageElement() {
    if(hasPurchasePrice==false){
        $("#formGoodsArchivesAdd #purchasePrice").parent().addClass("uhide");
        $("#formGoodsArchivesAdd #inputTax").parent().addClass("uhide");
    }
    if(hasWholesalePrice==false){
        $("#formGoodsArchivesAdd #wholesalePrice").parent().addClass("uhide");
    }

    if(hasDistributionPrice==false){
        $("#formGoodsArchivesAdd #distributionPrice").parent().addClass("uhide");
    }

    if(hasCostPrice==false){
        $("#formGoodsArchivesAdd #grossProfit").parent().addClass("uhide");
        $("#formGoodsArchivesAdd #grossProfitPercent").parent().addClass("uhide");
    }
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
	if(selectionRow){
		
		selectionRow = selectionRow[0]||selectionRow;
		
		$.each(selectionRow,function(key,value){
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
		
		// 订货周期
		strweekCheckDay(selectionRow.deliveryCycle);
		if(selectionRow.saleWay=='A'){
			$('#supplierRate').numberbox('disable');
		}else{
			$('#supplierRate').numberbox('enable');
		}
		
	}
	$("#skuCode").val(null);
	$("#barCode").val($("#skuCode").val()); //货号
	
//	$("#skuCode").val("").removeAttr("readonly");
	$("#createDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd hh:mm:ss"));
	//生成毛利值，毛利率
	setGrossProfit();
}

/**
 * 星期拆分字符串赋值checkbox  
 */
function strweekCheckDay(weekstr){
	$(".ubcheckweek .radioItem").prop("checked", false);
	var arrWeek = weekstr.split("");
	$.each(arrWeek,function(i,val){
		$("#weekcheckbox"+val).prop("checked", true);
	})
	
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
		//
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

/**
 * 商品自动生成货号
 * pricingType:计价方式
 * categoryCode:商品类别
 */
function getSkuCode(pricingType,categoryCode){
//	var reqObj = {"pricingType":pricingType,"categoryCode":categoryCode};
//	$.ajax({
//		url:contextPath+"/common/goods/getSkuCode",
//		type:"POST",
//		data:reqObj,
//		success:function(result){
//			console.log("货号==",result);
//			$("#skuCode").val(result); //货号
//			//计价/计重商品自动生成条码
//			getBarCodeVal(pricingType, result);
//		},
//		error:function(result){
//			
//		}
//	});
}


//计价/计重商品自动生成条码
function getBarCodeVal(pricingType, skuCode){
	//var pricingType = $('#pricingType option:selected').val(); //计价方式
	//var skuCode = $("#skuCode").val(); //商品货号
	//计件方式为“普通”，手动输入条码，不自动生成条码
//	if(pricingType == "" || skuCode == "" || pricingType == "ORDINARY"){
//		$("#barCode").removeAttr("readonly");
//		return false;
//	}else{
//		getBarCode(pricingType,skuCode);
//	}
}

/**
 * 计价/计重商品自动生成条码
 * pricingType:计价方式
 * skuCode:商品货号
 */
function getBarCode(pricingType,skuCode){
//	var reqObj = {"pricingType":pricingType,"SkuCode":skuCode};
//	$.ajax({
//		url:contextPath+"/common/goods/getBarCode",
//		type:"POST",
//		data:reqObj,
//		success:function(result){
//			console.log("条码==",result);
//			//黄江 2016年9月14日11:53:47 待定
//			//$("#barCode").val(result).attr("readonly","readonly");  //条码
//		},
//		error:function(result){
//			
//		}
//	});
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
		$("#saleWayName").val(data.saleWayName);

		//经营方式
		$("#saleWay").val(data.saleWay);
		//商品类型
		if(data.saleWay=='A'){
			$("#supplierRate").textbox("setValue","");
			$('#supplierRate').numberbox('disable');
			
			// 商品类型为 捆绑商品、自动转货 默认不管理库存
			isEnableManagerStock();
		}else {
			
			if(data.saleWay=='C'){
				isEnableManagerStock
			} else {
            	enableManagerStock();
			}

            $('#supplierRate').numberbox('enable');
		}
	});
}

/**
 * 商品类型为 捆绑商品、自动转货 默认不管理库存
 */
function isEnableManagerStock(){
	var pricingType = 	$('#type').combobox("getValue");
	
	if(pricingType == "BIND"|| pricingType == "AUTOMATICTRANSFER"){
    	disableManagerStock();
    }else{
    	enableManagerStock();
    }
}

/**
 * 禁用 是否管理库存
 */
function disableManagerStock(){
	$("#managerStock").removeAttr("checked");
    $("#managerStock").prop("disabled","disabled");
}

/**
 * 启用 是否管理库存
 */
function enableManagerStock(){
	 $("#managerStock").prop("checked","checked");
     $("#managerStock").removeProp("disabled");
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
	$("#grossProfitPercent").numberbox("setValue",(grossProfitPercent*100).toFixed(2));
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
    
    var salePriceV = $("#salePrice").numberbox("getValue");
    if(!salePriceV || parseFloat(salePriceV) < 0){
    	$('#saveGoodsArchives').removeAttr("disabled");
    	$_jxc.alert("零售价不能为空!");
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
	if(pricingType == "ORDINARY"){// 普通商品需要校验条码是否重复
		var reqObj = reqObj = {"barCode":barCode, "id":$("#id").val()};
		$_jxc.ajax({
			url:contextPath+"/common/goods/checkBarCodeByOrdinary",
			data:reqObj,
			async:false
		},function(result){
			if(result.code == 0){
				submitFormValidate(salePriceV);
			}else{
				$('#saveGoodsArchives').removeAttr("disabled");
                $_jxc.alert(result.message);
			}
		});
	}else{
		submitFormValidate(salePriceV);
	}
}

/**
 * 订货周期 星期选择赋值
 */
function weekCheckDay(){
  var len=$('#weekday .ubcheckweek').length;
  var str="";
  for(var i=0;i<len;i++){
	 var elemt=$('#weekday .ubcheckweek').eq(i).find('.radioItem');
	 var check= elemt.prop("checked");
	  if(check){
		str+=elemt.val()
	   }
    }
  $('#deliveryCycle').val(str);
}

function submitFormValidate(salePriceV) {
	//订货周期一周星期值
	weekCheckDay();
	
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
		url:contextPath+'/common/goods/addGoods',
		success:function(data){
			if(JSON.parse(data).code == 0){
				closeDialog();
				openDialog(contextPath+"/common/goods/updateGoodsView?id="+JSON.parse(data).id,"修改商品档案","edit",JSON.parse(data).id);
				$_jxc.alert("保存成功");
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
		//为捆绑商品 自动转换 联营商品时不管理库存
		if(pricingType == "BIND"||pricingType == "AUTOMATICTRANSFER"){
			$("#managerStock").removeAttr("checked");
			$("#managerStock").prop("disabled","disabled");
		}
		else{
            if(pricingType == "LOTTERY"){
                $("#allowGift").prop("disabled","disabled");
                $("#allowActivity").prop("disabled","disabled");
                $("#fastDeliver").prop("disabled","disabled");
                $("#weekday").find("input[type='checkbox']").prop("disabled","disabled");
            }else {
                $("#allowGift").removeProp("disabled");
                $("#allowActivity").removeProp("disabled");
                $("#fastDeliver").removeProp("disabled");
                $("#weekday").find("input[type='checkbox']").removeProp("disabled");
			}


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

function clickTab(code){
	 if(code === 1){
		 $('#btnbase').addClass('active');
		 $('#btnprice').removeClass('active');
		 $('#tab1').css('display','block');
		 $('#tab2').css('display','none');
		 
	 }else{
		 $('#btnbase').removeClass('active');
		 $('#btnprice').addClass('active');
		 $('#tab1').css('display','none');
		 $('#tab2').css({'display':'block','height':'90%'});
		 if(dgPrice != null)return;
			//初始化表格
			initDatagridEditRequireOrder();
	 }
}
var gridHandel = new GridClass();
function initDatagridEditRequireOrder(){
	 gridHandel.setGridName("dgPrice");
	 
	 dgPrice = $("#dgPrice").datagrid({
	        method:'post',
	    	url:contextPath+"/goods/report/querySkuBranchBySkuId?skuId="+$("#skuId").val(),
	        align:'center',
	        singleSelect:true,  //单选  false多选
	        rownumbers:true,    //序号
	        showFooter:true,
	        fit: true,  
	        fitColumns:true,    //每列占满
	        height:'100%',
	        width:'100%',
	        //pagination:true,
	        columns:[[			
	            {field:'branchType',title:'机构类型',width: '120px'},
               {field:'skuId',hidden:true,title:'skuId'},
	            {field:'skuId',hidden:true,title:'skuId'},
	            {field:'branchCode',title:'店铺编号',width: '70px',align:'left'},
	            {field:'branchName',title:'店铺名称',width:'80px',align:'left'},
	           
	            {field:'purchasePrice',title:'进货价',width:'80px',align:'right',
	                formatter:function(value,row,index){
	                    if(row.isFooter){
	                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                    }

	                    if(!value){
	                        row["purchasePrice"] = parseFloat(value||0).toFixed(2);
	                    }
	                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                },
	            },
	            {field:'salePrice',title:'零售价',width:'80px',align:'right',
	                formatter:function(value,row,index){
	                    if(row.isFooter){
	                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                    }
	                    if(!value){
	                        row["salePrice"] = parseFloat(value||0).toFixed(2);
	                    }
	                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                },
	            },
	            {field:'distributionPrice',title:'配送价',width:'80px',align:'right',
	                formatter:function(value,row,index){
	                    if(row.isFooter){
	                        return
	                    }
	                    if(!row.price){
	                    	row.price = parseFloat(value||0).toFixed(2);
	                    }
	                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                },
	            
	            },
	            {field:'wholesalePrice',title:'批发价',width:'80px',align:'right',
	                formatter : function(value, row, index) {

	                    
	                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                },
	            },
	            {field:'vipPrice',title:'会员价',width:'80px',align:'right',
	                formatter : function(value, row, index) {
	                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                },
	                
	            },
	            {field:'status',title:'商品状态',hidden:true,width:'80px',align:'right',
		               /* formatter : function(value, row, index) {
		                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },*/
		            },
	            {field:'statusDesc',title:'商品状态',width:'80px',align:'right',
	               /* formatter : function(value, row, index) {
	                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
	                },*/
	            },
	            
	           
	            {field: 'safetyCoefficient', title: '安全系数', width: '120px', align: 'left',
	                formatter: function (value, row, index) { 	
	                   return '<b>' + parseFloat(value || 0.10).toFixed(2) + '</b>';
	                },
	            editor:{  
                   type:'numberspinner',  
                   options: {  
                       increment:0.1,
                       precision:2,
                       min:0.10,  
                       max:999.90,  
                       editable:true,
                       onChange: onChangeCoefficient,
                   }  
               }  
	            }
	        ]],
	        onLoadSuccess : function() {
	          	
	          },
	        onClickCell:function(rowIndex,field,value){
	            gridHandel.setBeginRow(rowIndex);
	            gridHandel.setSelectFieldName(field);
	            var target = gridHandel.getFieldTarget(field);
	            if(target){
	                gridHandel.setFieldFocus(target);
	            }else{
	                gridHandel.setSelectFieldName("safetyCoefficient");
	            }
	        }

	    });
}


