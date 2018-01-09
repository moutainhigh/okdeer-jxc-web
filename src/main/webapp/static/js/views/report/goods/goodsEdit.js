/**
 * Created by zhangqin on 2017/2/17
 * 编辑商品
 */
var updateGoods;
var isStore;
var flag = ($("#branchType").val()==1);
var dgPrice = null;
function initGoodsInfo(skuId,branchId){
	 $('#btnbase').addClass('active')
	if(flag===true){
		 $('#tab2').css('display','none');
		$('#tab3').css('display','none');
	}else{
        $('#btnprice').css('display','none');
        $('#tab1').css('display','block');
        $('#tab2').css('display','none');
        $('#tab3').css('display','none');
	}
	
	var args = {}
	var httpUrl = contextPath+"/goods/report/getGoodsInfo?skuId="+skuId+"&branchId="+branchId;
	$.get(httpUrl, args,function(data){
		updateGoods = data["_data"];
		$.each(data["_data"],function(key,value){
			var element = "#formEdit #"+key;
			//普通的input
			if($(element).prop("tagName") == "INPUT"){
				if($(element).attr('type')=="checkbox"){
					if(1 == value){ //传到前端checkbox选中的值是true
						$(element).attr("checked","checked");
					}
				}else{
					//进项税、销项税、联营扣率要乘以100
					if($(element).attr("id") == "outputTax" || $(element).attr("id") == "inputTax" || $(element).attr("id") == "supplierRate"){
						if(value){
							$(element).numberbox("setValue",parseFloat((value*100).toFixed(2)));
						}else{
							$(element).numberbox("setValue",0.00);
						}
					}else{
						if($(element).hasClass('easyui-numberbox')){
							$(element).numberbox('setValue', value);
						}else{
							$(element).val(value);
						}
					}
				}
			}
			else if($(element).prop("tagName") =="TEXTAREA"){ //普通的textarea
				$(element).html(value);
			}
			else if($(element).prop("tagName") == "SELECT"){
				if(value){
					$(element+" option").each(function(i,n){
						if($(n).val() == value || $(n).val()==value.name){
							$(n).attr("selected",true);
						}
					});
					if(key=="unit"){
						$(element).combobox("setValue",value);
					}
				}
			}
		});
		
		//门店禁止编辑配送规格、采购规格、订货周期
		isStore=data['isStore'];
		if(isStore){
		    //easyui 1.5.2 diable 方法会使表单form验证失败造成 无法提交表单 
            $('#formEdit #purchaseSpec').numberbox('readonly');
            $('#formEdit #distributionSpec').numberbox('readonly');

			$("#formEdit #isFastDeliver").attr("disabled","disabled");
			$("#formEdit #allowActivity").attr("disabled","disabled");
			$("#formEdit #allowAdjust").attr("disabled","disabled");
			
			$("#formEdit #weekday").find(".radioItem").each(function() { 
				$(this).attr("disabled", "disabled"); 
			});
		}
		
		
		if(updateGoods.saleWay=='A' || updateGoods.saleWay=='B'){
            $('#formEdit #supplierRate').numberbox('readonly');
		}else{
            $('#formEdit #supplierRate').numberbox('readonly',false);
		}
		if(updateGoods.updateTime){
			var date = new Date(updateGoods.updateTime);    
			$("#updateTime").val(date.format("yyyy-MM-dd hh:mm:ss"));
		}
		var createTime = new Date(updateGoods.createTime);    
		$("#createTime").val(createTime.format("yyyy-MM-dd hh:mm:ss"));
		setGrossProfit();
		
		// 初始化订货周期
		strweekCheckDay(updateGoods.deliveryCycle);

        if(updateGoods.type.name == "LOTTERY"){
            disabledLotteryElem();
        }

    });
    hidePageElement();
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

function hidePageElement() {
    if(hasPurchasePrice==false){
        $("#formEdit #purchasePrice").parent().addClass("uhide");
        $("#formEdit #inputTax").parent().addClass("uhide");

    }
    if(hasWholesalePrice==false){
        $("#formEdit #wholesalePrice").parent().addClass("uhide");
    }

    if(hasDistributionPrice==false){
        $("#formEdit #distributionPrice").parent().addClass("uhide");
    }

    if(hasCostPrice==false){
        $("#formEdit #grossProfit").parent().addClass("uhide");
        $("#formEdit #grossProfitPercent").parent().addClass("uhide");
    }




}

//毛利值 = 零售价-进货价
function setGrossProfit(){
	var salePrice = parseFloat($("#salePrice").val().trim() || 0);
	var purchasePrice = parseFloat($("#purchasePrice").val().trim() || 0);
	if(salePrice != "" && purchasePrice != ""){
		var grossProfit = salePrice - purchasePrice;
		$("#grossProfit").val(grossProfit);
		$("#grossProfit").textbox("setValue",grossProfit.toFixed(2));
		setGrossProfitPercent();
	}
}

//毛利率 =（零售价-进货价）/零售价
function setGrossProfitPercent(){
	var salePrice = parseFloat($("#salePrice").val().trim());
	var purchasePrice = parseFloat($("#purchasePrice").val().trim());
	var grossProfitPercent = (salePrice - purchasePrice) / salePrice *100;
	$("#grossProfitPercent").val(grossProfitPercent.toFixed(2)+"%");
	$("#grossProfitPercent").textbox("setValue",grossProfitPercent.toFixed(2)+"%");
}

//供应商公共组件
function getGoodsPupplier(){
	new publicSupplierService(function(data){
		$("#formEdit #supplierId").val(data.id);
		$("#formEdit #supplier").val(data.supplierName);
		$("#formEdit #saleWayName").val(data.saleWayName);
        //经营方式
        $("#formEdit #saleWay").val(data.saleWay);
        var pricingType = 	$('#type').val();
		//经营方式
		if(data.saleWay=='A'||data.saleWay=='B'){
            $("#supplierRate").textbox("setValue","");
            $('#supplierRate').numberbox('disable');
            if(pricingType == "BIND"|| pricingType == "AUTOMATICTRANSFER"){
                $("#isManagerStock").removeProp("checked");
            }else{
                $("#isManagerStock").prop("checked","checked");
            }
		}else{
            $('#supplierRate').numberbox('enable');
			$("#supplierRate").textbox("setValue","0.00");
            if(data.saleWay=='C' || pricingType == "BIND"|| pricingType == "AUTOMATICTRANSFER"){
                $("#isManagerStock").removeProp("checked");
            }else{
                $("#isManagerStock").prop("checked","checked");
            }

        }
	});
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

//保存
function saveProp() {
	$('#btnSave').attr("disabled","disabled");
	var isValid = $("#formEdit").form('validate');
	
	if (!isValid) {
		$('#btnSave').removeAttr("disabled");
		return;
	}
	
	if($('#purchaseSpec').val()=="0.00"){
		$('#btnSave').removeAttr("disabled");
		$_jxc.alert("进货规格不能为0!");
		return;
	}
	if($('#distributionSpec').val()=="0.00"){
		$('#btnSave').removeAttr("disabled");
		$_jxc.alert("配送规格不能为0!");
		return;
	}
	
	if($("#supplierId").val() != updateGoods.supplierId && !isStore){
		var param = {
			title:'提示',
			content:"是否同时更新门店该商品的主供应商？</br>是：更新分司及其门店原主供应商相同的该商品。</br>否：只更新分司主档供应商。</br>取消：不保存。"
		};
		new publicConfirmDialog(function(data){
			//是，更新联动下属机构
			if(data.code === 1){
				$("#isLinkage").val(1);
				submitForm();
			}
			//否，仅更新自己
			else if(data.code === 0){
				$("#isLinkage").val(0);
				submitForm();
			}else{
				//取消 重新激活保存按钮
				$('#btnSave').removeAttr("disabled");
			}
		},param);
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


function submitForm(){
	//订货周期——周星期值
	weekCheckDay();
	
	var formObj = $('#formEdit').serializeObject();
	$_jxc.ajax({
		url : contextPath + "/branch/goods/branchGoodsPropSave",
		data : formObj
	},function(result){
		$('#btnSave').removeAttr("disabled");
		if(result){
			$_jxc.alert("保存成功");
		}else{
			//$('#btnSave').removeAttr("disabled");
			$_jxc.alert("保存失败");
		}
	});
}

 function clickTab(code){
	 
	 if(code === 1){
		 $('#btnbase').addClass('active');
		 $('#btnprice').removeClass('active');
		 $('#btnbarCode').removeClass('active');
		 $('#tab1').css('display','block');
		 $('#tab2').css('display','none');
		 $('#tab3').css('display','none');
		 
	 }else if(code === 2){
		 $('#btnbase').removeClass('active');
		 $('#btnprice').addClass('active');
		 $('#btnbarCode').removeClass('active');
		 $('#tab1').css('display','none');
		 $('#tab2').css({'display':'block','height':'90%'});
		 $('#tab3').css('display','none');
		 
		 	if(dgPrice != null)return;
			//初始化表格
			initDatagridEditRequireOrder();

	 }else{
		$('#btnbase').removeClass('active');
		 $('#btnprice').removeClass('active');
		 $('#btnbarCode').addClass('active');
		 $('#tab1').css('display','none');
		 $('#tab2').css('display','none');
		 $('#tab3').css({'display':'block','height':'90%'});
		 initDatagridEdit();
	 }
 }
 
 function changePrint(newV,oldV){
	 if(newV && newV >= 0.1 && newV <= 999.90){
		 printRows(newV);
	 }
 }
 
 var gridHandel = new GridClass();
 var gridPriceName = "dgPrice";
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

     var param = {
         wholesalePrice:["wholesalePrice"],
         purchasePrice:["purchasePrice"],
         distributionPrice:["distributionPrice"],
         costPrice:["costPrice"],
         vipPrice:["vipPrice"],
         salePrice:["salePrice"],
     }

     priceGrantUtil.grantPrice(gridPriceName,param);
 }
 
 function onChangeCoefficient(newV,oldV){
     if(newV > 999.90 || newV < 0.10){
    	 $_jxc.alert("安全系数在0.10到999.90之间");
    	 gridHandel.setFieldSpinnerValue('safetyCoefficient',0.10);
    	 return;
    }
	 gridHandel.setFieldSpinnerValue('safetyCoefficient',newV);
 }
 
//安全系数
 function printRows(printNum){
 	// 获取选中行的Index的值
 	var rowIndex = -1;
 	var newData = $("#dgPrice").datagrid("getRows");
 	for(var i = 0;i < newData.length;i++){
 		newData[i].safetyCoefficient= printNum;
 	}
 	$("#dgPrice").datagrid('options').url = '';
 	$("#dgPrice").datagrid({data:newData})
 }
 function saveSafetyCoefficient(){
	 
	 var data = $("#dgPrice").datagrid("getRows");
	 var newData = [];
	 for(var i = 0;i < data.length;i++){
		 var temp = {
		    		id : data[i].id,
		    		safetyCoefficient : data[i].safetyCoefficient
		    	}
			newData[i] = temp;
	 }
	 
	 $_jxc.ajax({
	        url:contextPath+"/goods/report/saveBranchsafetyCoefficient",
	        contentType:"application/json",
	        data:JSON.stringify(newData)
	    },function(result){
            if(result['code'] == 0){
                $_jxc.alert("操作成功！");
            }else{
                $_jxc.alert(result['message'] +","+strResult);
            }
	    });
 }
 
 
function initDatagridEdit(){
	 barCodeTable = $("#barCodeTable").datagrid({
 	        method:'post',
 	    	url:contextPath+"/goods/goodsBarcode/querySkuBarCodeBySkuId?skuId="+$("#skuId").val(),
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
                /* {field:'check',checkbox:true},*/
 	            {field:'skuId',title:'skuId',hidden:true},
 	            {field:'barCode',title:'商品条码',width: '120px',align:'left',
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
