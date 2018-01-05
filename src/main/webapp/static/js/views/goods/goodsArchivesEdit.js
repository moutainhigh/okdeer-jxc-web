/**
 * Created by huangj02 on 2016/8/11.
 * 编辑商品
 */
var updateSku;
var dgPrice = null;
function initGoodsEditView(id){
	 $('#tab2').css('display','none');
    $('#btnbase').addClass('active');
	//获取编辑商品的数据
	getGoodsArchivesDetail(id);

	//根据商品名称获取助记码
	$("#skuName").on("blur",function(){
		getMemoryCode();
	});

	//第一次进入页面，商品自动生成货号
	getSkuCodeVal();

	//计价方式
	$('#pricingType').on("change",function(){
		//商品自动生成货号
		getSkuCodeVal();
	});

	//生成毛利值，毛利率
	$('#salePrice').on("input",function(){
		setGrossProfit();
	});
	$('#purchasePrice').on("input",function(){
		setGrossProfit();
	})

    //商品类型
    $('#type').change(function(){
        typeChange();
    });
    hidePageElement();
    
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


function typeChange(){
    var pricingType = 	$('#type').val();
    //计件方式为“普通”，需要商品类别生成货号，其他不需要，直接生成货号，并且货号全部都是只可读
    if(pricingType == ""){
        return false;
    }else{
        //为捆绑商品 自动转换 联营商品时不管理库存
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

function goodsTypeChange() {
	var type = $("#goodsSaleType").val();
    if(type == "LOTTERY"){
    	disabledLotteryElem();
    }else {
        $("#allowGift").removeProp("disabled")
        $("#allowActivity").removeProp("disabled")
        $("#fastDeliver").removeProp("disabled")
        $("#weekday").find("input[type='checkbox']").removeProp("disabled");
        
        $("#allowActivity").prop("checked","checked");
    	$("#weekday").find("input[type='checkbox']").prop("checked","checked");
    }
}


function disabledLotteryElem(){
	$("#allowGift").removeProp("checked");
	$("#allowActivity").removeProp("checked");
	$("#fastDeliver").removeProp("checked");
	$("#weekday").find("input[type='checkbox']").removeProp("checked");
	
    $("#allowGift").prop("disabled","disabled");
    $("#allowActivity").prop("disabled","disabled");
    $("#fastDeliver").prop("disabled","disabled");
	$("#weekday").find("input[type='checkbox']").prop("disabled","disabled");
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
	var pricingType = $('#pricingType option:selected').val();
	var categoryCode = $("#categoryCode").val();
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
//		if(pricingType == "ordinary"){
//			if(categoryCode == ""){
//				$("#skuCode").val("");
//				$("#barCode").removeAttr("readonly");
//				return false;
//			}else{
////				getSkuCode(pricingType,categoryCode);
//			}
//		}else{ //“其他”计件方式
////			getSkuCode(pricingType,categoryCode);
//		}

	}
}

/**
 * 商品自动生成货号
 * pricingType:计价方式
 * categoryCode:商品类别
 */
function getSkuCode(pricingType,categoryCode){
	var reqObj = {"pricingType":pricingType,"categoryCode":categoryCode};
	$_jxc.ajax({
		url:contextPath+"/common/goods/getSkuCode",
		data:reqObj
	},function(result){
		console.log("货号==",result);
		$("#skuCode").val(result); //货号

		//计价/计重商品自动生成条码
		getBarCodeVal(pricingType, result);
	});
}


//计价/计重商品自动生成条码
function getBarCodeVal(pricingType, skuCode){
	//var pricingType = $('#pricingType option:selected').val(); //计价方式
	//var skuCode = $("#skuCode").val(); //商品货号
	//计件方式为“普通”，手动输入条码，不自动生成条码
	if(pricingType == "" || skuCode == "" || pricingType == "ordinary"){
		$("#barCode").removeAttr("readonly");
		return false;
	}else{
		getBarCode(pricingType,skuCode);
	}
}

/**
 * 计价/计重商品自动生成条码
 * pricingType:计价方式
 * skuCode:商品货号
 */
function getBarCode(pricingType,skuCode){
	var reqObj = {"pricingType":pricingType,"SkuCode":skuCode};
	$_jxc.ajax({
		url:contextPath+"/common/goods/getBarCode",
		data:reqObj
	},function(result){
		console.log("条码==",result);
		$("#barCode").val(result).attr("readonly","readonly");  //条码
	});
}


//监听方法
//商品分类
function getGoodsType(){
	var param = {
			categoryType:'addArchives'
	}
	new publicCategoryService(function(data){
		//console.log("商品分类==",data);
		$("#categoryId").val(data.goodsCategoryId);
		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val(data.categoryName);

		//商品自动生成货号
		getSkuCodeVal();
	},param);
}

//品牌
function getGoodsBrand(){
	new publicBrandService(function(data){
		//console.log("品牌==",data);
		$("#brandId").val(data.id);
		$("#brandCode").val(data.brandCode);
		$("#brandName").val(data.brandName);
	});
}

//供应商公共组件
function getGoodsPupplier(){
	new publicSupplierService(function(data){
		
		console.info("供应商==",data);
		$("#supplierId").val(data.id);
		$("#supplierName").val(data.supplierName);
		$("#saleWayName").val(data.saleWayName);
		//经营方式
		$("#saleWay").val(data.saleWay);
        var pricingType = 	$('#type').val();
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
	if(salePrice != "" && purchasePrice != ""){
		var grossProfit = salePrice - purchasePrice;
		$("#grossProfit").textbox("setValue",grossProfit.toFixed(2));
		setGrossProfitPercent();
	}
}

//毛利率 =（零售价-进货价）/零售价
function setGrossProfitPercent(){
	var salePrice = parseFloat($("#salePrice").val().trim());
	var purchasePrice = parseFloat($("#purchasePrice").val().trim());
	var grossProfitPercent = (salePrice - purchasePrice) / salePrice;
	$("#grossProfitPercent").numberbox("setValue",(grossProfitPercent*100).toFixed(2));
}

//获取商品信息
function getGoodsArchivesDetail(id){
	var args = {}
	var httpUrl = contextPath+"/common/goods/getGoodsSkuById?id="+id;
	$.get(httpUrl, args,function(data){
		updateSku = data["_data"];
		
		$.each(data["_data"],function(key,value){
			
			//普通的input
			if($("#"+key).prop("tagName") == "INPUT"){
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
							$("#"+key).val(value);
						}

					}
				}
			}
			else if($("#"+key).prop("tagName") =="TEXTAREA"){ //普通的textarea
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
					}
				}

			}
		});
		$("#saleWay").val(updateSku.saleWay);
		if(updateSku.saleWay=='A'){
			$('#supplierRate').numberbox('disable');
		}else{
			$('#supplierRate').numberbox('enable');
		}

        var pricingType = 	$('#type').val();
        if(updateSku.saleWay=='C' || pricingType == "BIND"|| pricingType == "AUTOMATICTRANSFER"){
            $("#managerStock").removeAttr("checked");
            $("#managerStock").prop("disabled","disabled");
        }

		if(updateSku.updateTime){
			var date = new Date(updateSku.updateTime);    
			$("#createTimeUpdate").val(date.format("yyyy-MM-dd hh:mm:ss"));
		}
		var createTime = new Date(updateSku.createTime);    
		$("#createTime").val(createTime.format("yyyy-MM-dd hh:mm:ss"));
		setGrossProfit();
		
		// 初始化订货周期
		strweekCheckDay(updateSku.deliveryCycle);
		
		// 商品类型
		$("#goodsSaleType").val(updateSku.type.name);
		
	    if(updateSku.type.name == "LOTTERY"){
	    	disabledLotteryElem();
	    }
		
	});
	

}

/**
 * 订货周期 星期拆分字符串赋值checkbox  
 */
function strweekCheckDay(weekstr){
	$(".ubcheckweek .radioItem").prop("checked", false);
	var arrWeek = weekstr.split("");
	$.each(arrWeek,function(i,val){
		$("#weekcheckbox"+val).prop("checked", true);
	})
	
}

//判断普通商品条码是否重复
function checkBarCodeByOrdinary(){
	var result = false;
	var reqObj = {"barCode":$("#barCode").val(), "id":$("#id").val()};

	$_jxc.ajax({
		url:contextPath+"/common/goods/checkBarCodeByOrdinary",
		asyn:false,
		data:reqObj
	},function(result){
		if(result.code == 0){ //条码不重复
			result = true;
		}
	});
	return result;
}

//商品保存
function saveGoodsArchives(){
	$('#updateGoodsArchives').attr("disabled","disabled");
	//校验表单
	var isValid = $("#formGoodsArchivesAdd").form('validate');
	
	if(!isValid){
		$('#updateGoodsArchives').removeAttr("disabled");
		return;
	}

    if($('#skuName').val().trim()===""){
        $('#updateGoodsArchives').removeAttr("disabled");
        $_jxc.alert("请输入商品名称");
        return;
    }
	
	if($("#purchaseSpec").val()=== '0.00'){
		$('#updateGoodsArchives').removeAttr("disabled");
		$_jxc.alert("进货规格不能为0!");
		return;
	}
	
	if($("#distributionSpec").val()=== '0.00'){
		$('#updateGoodsArchives').removeAttr("disabled");
		$_jxc.alert("配送规格不能为0");
		return;
	}
	
	if(parseFloat($("#vipPrice").val()) > parseFloat($("#salePrice").val())){
		$('#updateGoodsArchives').removeAttr("disabled");
		$_jxc.alert("会员价不能大于零售价");
		return;
	}

	//校验商品条码是否重复
	var pricingType = $('#pricingType option:selected').val();
	var barCode = $("#barCode").val();
	if(pricingType == "ORDINARY"){// 普通商品需要校验条码是否重复
		var reqObj = reqObj = {"barCode":barCode, "id":$("#id").val()};
		
		//订货周期一周星期值
		weekCheckDay();

		$_jxc.ajax({
			url:contextPath+"/common/goods/checkBarCodeByOrdinary",
			data:reqObj,
			async:false
		},function(result){
			if(result.code == 0){
				submitForm();
			}else{
				$('#updateGoodsArchives').removeAttr("disabled");
				$_jxc.alert(result.message);
			}
		});

	}else{
		submitForm();
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


//提交表单
function submitForm(){
	var url = contextPath+'/common/goods/updateGoods';
	$('#formGoodsArchivesAdd').form("submit",{
		url:url,
		success:function(data){
			if(JSON.parse(data).code == 0){
				$_jxc.alert("保存成功");
				goodsSearch();
				closeDialog();
			}else{
				$('#updateGoodsArchives').removeAttr("disabled");
				$_jxc.alert(JSON.parse(data).message);
			}
		}
	});
}
function onChangeUnit(newV,oldV){
	$("#unit").combobox("setValue",newV);
}


//复制商品
function copyArchives(type){
	var barCode = $("#barCode").val();
	getSkuCodeVal();
	if($("#pricingType").val()=="ordinary"){
		$("#barCode").val(barCode);
	}
	saveGoodsArchives(type);
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
//新增
function goodsAddView(){
	closeDialog();
	openDialog(contextPath+"/common/goods/addGoodsView","新增商品档案","add","");
}

//复制新增
function copyAddGoodsView(){
	var selectionRow = ''+JSON.stringify(updateSku)+'';
	closeDialog();
	openDialog(contextPath+"/common/goods/addGoodsView","新增商品档案","copy",""+escape(selectionRow)+"");

//	setTimeout(function(){
//	var data = ''+JSON.stringify(updateSku)+'';
//	var newUrl = contextPath+"/common/goods/addGoodsView?data="+escape(data);
//	window.location.href = newUrl;
//	},10);
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
	gridHandel.initKey({
		firstName:'barCode',
		enterName:'barCode',
	})
	 
	 dgPrice = $("#dgPrice").datagrid({
	        method:'post',
	    	url:contextPath+"/goods/goodsBarcode/querySkuBarCodeBySkuId?skuId="+$("#id").val(),
	        align:'center',
	        singleSelect:false,  //单选  false多选
	        rownumbers:true,    //序号
	        showFooter:true,
	        fit: true,  
	        fitColumns:true,    //每列占满
	        height:'100%',
	        width:'100%',
	        //pagination:true,
	        columns:[[
                {field:'check',checkbox:true},
                {field:'id',title:'id',hidden:true},
	            {field:'skuId',title:'skuId',hidden:true},
	            {field:'barCode',title:'商品条码',width: '120px',align:'left',
					formatter:function(value,row,index){
						if(row.isFooter){
							return;
						}
						if(!value){
							return 0;
						}
						var bar = {
							value:value
						}
						return checkNum(bar)
					},
					editor:{
						type:'numberbox',
						options:{
							min:0,
							precision:0,
							onChange:changeBarCode
						}
					}
				},
	            {field:'updateUserName',title:'修改人',width: '120px',align:'left'},
	            {field:'updateTime',title:'修改时间',width: '150px',align:'center',
	            	formatter: function (value, row, index) {
						if (value) {
							return new Date(value).format('yyyy-MM-dd hh:mm:ss');
						}
						return "";
					}
	            },
	        ]],
		/* onClickCell:function(rowIndex,field,value){
			 gridHandel.setBeginRow(rowIndex);
			 gridHandel.setSelectFieldName(field);
			 var target = gridHandel.getFieldTarget(field);
			 if(target){
				 gridHandel.setFieldFocus(target);
			 }else{
				 gridHandel.setSelectFieldName("goodsbarCode");
			 }
		 },*/
		 onLoadSuccess : function() {
		 },
	 });
}

function changeBarCode (newVal,oldVal){
	var barCode
	if(newVal.trim() != ""){
		barCode = checkNum({value:newVal})
		if(barCode==""){
			$_jxc.alert("请输入数字,最多只能是16位数字")
			return;
		}else{
			checkRepeat(newVal,oldVal);
		}
	}else{
		//gridHandel.setFieldTextValue('barCode',oldVal);
		$_jxc.alert("请输入条码,最多只能是16位数字")
		return;
	}
}


function checkRepeat(newVal){
	var newRows = $.map(gridHandel.getRows(), function(obj){
		return $.extend(true,{},obj);//返回对象的深拷贝
	});
	newRows.splice(gridHandel.getSelectRowIndex(),1);

	var flag = true;
	$.each(newRows,function(index,item){
		if(newVal.substr(0,20) != item.barCode){
			flag = true;
		}else{
			flag = false;
		}
	})

	if(flag){
		gridHandel.setFieldValue('barCode',newVal.substr(0,20));
	}else {
		$_jxc.alert("条码"+newVal.substr(0,20)+"重复");
		return;
	}
}

function inserRow(){
	var barCode
	if($("#newBarCode").val().trim() != ""){
		barCode = checkNum({value:$("#newBarCode").val()})
		if(barCode==""){
			$_jxc.alert("请输入数字,最多只能是20位数字")
			return;
		}
	}else{
		$_jxc.alert("请输入条码,最多只能是20位数字")
		return;
	}

	var newRow = {
			skuId:$("#id").val(),
			skuCode:$("#skuCode").val(),
			barCode:barCode.substr(0,20),
			updateUserName:sessionUserName,
			updateTime:new Date()
	};
	
	var rows = $('#dgPrice').datagrid('getRows');
	var flag = true;
	$.each(rows,function(index,item){
		if(barCode != item.barCode){
			flag = true;
		}else{
			flag = false;
		}
	})

	if(flag){
		rows.push(newRow);
		$('#dgPrice').datagrid('loadData',rows);
	}else{
		$_jxc.alert("条码不能重复");
		return;
	}
}



function removeRow() {
	var data = $("#dgPrice").datagrid("getChecked");
	for(var i = 0;i < data.length;i++){
		 var rowIndex = $('#dgPrice').datagrid('getRowIndex', data[i]);
         $('#dgPrice').datagrid('deleteRow', rowIndex);  
	 }
}

function saveBarCode(){

	$("#dgPrice").datagrid("endEdit", gridHandel.getSelectRowIndex());
	var map = {}; // Map map = new HashMap();

	 var data = $("#dgPrice").datagrid("getRows");
	 var newData = [];
	 var skuId= $("#id").val();
	 var skuCode= $("#skuCode").val();
	 for(var i = 0;i < data.length;i++){
		 if(data[i].barCode in map){
			 $_jxc.alert("条码"+data[i].barCode+"重复");
			 return;
		 }
		 map[data[i].barCode] = data[i].barCode;
		 var temp = {
				 	id:data[i].id,
		    		skuId : skuId,
		    		barCode : data[i].barCode,
		    		skuCode : skuCode
		    	}
			newData[i] = temp;
	 }
	 var reqObj = {
			 skuId : skuId,
			 barCodelist:newData
	 };
	 $_jxc.ajax({
	        url:contextPath+"/goods/goodsBarcode/saveSkuBarCode",
	        contentType:"application/json",
	        data:JSON.stringify(reqObj)
	    },function(result){
            if(result['code'] == 0){
                $_jxc.alert("操作成功！");
            }else{
                $_jxc.alert(result['message']);
            }
	    });
}

