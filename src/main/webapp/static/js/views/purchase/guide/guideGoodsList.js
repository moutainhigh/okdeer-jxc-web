//采购向导 第二部

var gridHandel = new GridClass();
var isType_one = true;
var isType_two = false;
var isType_three = false;

var formData;
$(function(){
	
	formData = $("#formData").val();
	formData = $.parseJSON(formData);
    formData.deliverStartDate = formData.deliverStartDate.substr(0, 10);
    formData.deliverEndDate = formData.deliverEndDate.substr(0, 10);
	
	
	var guideType = formData.guideType;
	
	if(guideType === 1){
		isType_one = false;
		isType_two = true;
		isType_three = true;
	}else if(guideType === 2){
		isType_one = true;
		isType_two = false;
		isType_three = true;
	}else{
		isType_one = true;
		isType_two = true;
		isType_three = false;
	}
	
	initPurchaseGuideGoodsListDg();
});

//初始化表格
function initPurchaseGuideGoodsListDg(){
	 gridHandel.setGridName("dgGuideGoodsList");

	$("#dgGuideGoodsList").datagrid({
        method:'post',
        align:'center',
        url:contextPath+'/form/purchaseGuide/getGoodsList',
        queryParams:formData,

        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        //pagination:true,    //分页
        //pageSize:10,
        //fitColumns:true,    //每列占满
        fit:true,            //占满
        showFooter:true,
        columns:[[
			{field:'cz',title:'操作',width:'60px',align:'center',
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            str ='<div class="ub ub-pc">合计</div> '
			        }else{
			            str = 
			                '<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
			        }
			        return str;
			    },
			},
        	{field:'supplierName',title:'供应商',width:180,align:'left'},
            {field:'branchName',title:'收货机构',width:180,align:'left'},
            {field:'skuCode',title:'货号',width:70,align:'left'},
            {field:'skuName',title:'商品名称',width:180,align:'center'},
            {field:'barCode',title:'条码',width:120,align:'left'},
            {field:'skuUnit',title:'单位',width:60,align:'left'},
            {field:'skuSpec',title:'规格',width:60,align:'left'},
            {field:'purchaseSpec',title:'进货规格',width:60,align:'left'},
            {field:'untaxedPrice',title:'不含税进价',width:100,align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return;
            		}
            		
            		if(!value){
            			row["untaxedPrice"] = parseFloat(value||0).toFixed(4);
            		}
            		
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			disabled:true,
            		}
            	},
            },
            {field:'purchasePrice',title:'进价',width:100,align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["purchasePrice"] = parseFloat(value||0).toFixed(4);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            
            {field:'upperLimit',title:'库存上限',width:100,align:'right',hidden:isType_one,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["upperLimit"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            {field:'lowerLimit',title:'库存下限',width:100,align:'right',hidden:isType_one,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["lowerLimit"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            
            {field:'diliveCycle',title:'订货周期',width:100,align:'right',hidden:isType_two,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["safetyCoefficient"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            {field:'safetyCoefficient',title:'安全系数',width:100,align:'right',hidden:isType_two,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["safetyCoefficient"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            
            {field:'totalNum',title:'要货数量',width:100,align:'right',hidden:isType_three,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["totalNum"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            
            {field:'purchaseNum',title:'订货数量',width:100,align:'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        
                    if(!value){
                        row["purchaseNum"] = parseFloat(value||0).toFixed(2);
                    }
			        
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:4,
			            onChange:actualStockChange
			        }
			    },
            },
            {field:'untaxedAmount',title:'不含税金额',width:100,align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return;
            		}
            		
            		if(!value){
            			row["untaxedAmount"] = parseFloat(value||0).toFixed(4);
            		}
            		
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			disabled:true,
            		}
            	},
            },
            {field:'totalAmount',title:'金额',width:100,align:'right',
            	formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        
                    if(!value){
                        row["totalAmount"] = parseFloat(value||0).toFixed(4);
                    }
			        
			        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:4,
			            disabled:true,
			        }
			    },
            },
            {field:'inputTax',title:'税率',width:100,align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return;
            		}
            		
            		if(!value){
            			row["inputTax"] = parseFloat(value||0).toFixed(4);
            		}
            		
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			disabled:true,
            		}
            	},
            },
            {field:'taxAmount',title:'税额',width:100,align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return;
            		}
            		
            		if(!value){
            			row["taxAmount"] = parseFloat(value||0).toFixed(4);
            		}
            		
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			disabled:true,
            		}
            	},
            },
            
            {field:'lastWeekAvgSales',title:'上周日销量',width:100,align:'right',hidden:isType_two,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["lastWeekAvgSales"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            {field:'previousWeekAvgSales',title:'前周日销量',width:100,align:'right',hidden:isType_two,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["previousWeekAvgSales"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                    }
                },
			},
            
            {field:'actualStock',title:'库存',width:100,align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }

                    if(!value){
                        row["actualStock"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        precision:4,
                        disabled:true,
                    }
                },
			},
            {field:'remark',title:'备注',width:150,align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[100]},
                    }
                }
            }
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("purchaseNum");
            }
        },
        onLoadSuccess : function() {
        	if(gridHandel.getRows().length <= 0){
        		$('.devMsg').html('该向导没有可参考的数据。请回到上一步重新选择条件。');
        	}
        	
            gridHandel.setDatagridHeader("center");
            
        }
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("dgGuideGoodsList",["purchasePrice","totalAmount","untaxedAmount","untaxedPrice","taxRate","taxAmount"])
    }
}

function actualStockChange(newVal, oldVal) {
	var purchasePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(), 'purchasePrice');
	var untaxedPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(), 'untaxedPrice');
	var totalAmount = parseFloat(purchasePrice * newVal).toFixed(4);
	var untaxedAmount = parseFloat(untaxedPrice * newVal).toFixed(4);
	gridHandel.setFieldValue('totalAmount', totalAmount);
	gridHandel.setFieldValue('untaxedAmount', untaxedAmount);
	gridHandel.setFieldValue('taxAmount', totalAmount - untaxedAmount);
}

//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}

//上一步
function lastStep(){
	//返回到上一步
	$.StandardPost(contextPath+"/form/purchaseGuide/toGuideForm", formData);

}

//下一步
function nextStep (){
    gridHandel.endEditRow(gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRows();
	 var gridRows = [];
	 var indexs=[] ;
	 $.each(rows,function(i,data){
		 var param = {
					branchId:data.branchId,
					supplierId:data.supplierId,
					skuId:data.skuId,
					skuCode:data.skuCode,
					purchaseNum:data.purchaseNum,
					purchasePrice:data.purchasePrice,
					purchaseSpec:data.purchaseSpec,
					salePrice:data.salePrice,
					totalAmount:data.totalAmount,
					untaxedPrice:data.untaxedPrice,
					untaxedAmount:data.untaxedAmount,
					inputTax:data.inputTax,
					remark:data.remark,
					deliverId:data.deliverId
		 }

		 if(parseFloat(data.purchaseNum) === 0){
             indexs.push((i+1));
		 }else{
             gridRows.push(param);
		 }
	 });
	 
	 if(gridRows.length==0){
		 $_jxc.alert("商品数据为空!");
		 return;
	 }

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

	 if(indexs.length > 0){

         $_jxc.confirm("<p>第" +JSON.stringify(indexs) +"行共"+indexs.length+"行数据订货数量为0,</p>" +
             "<div class='uc umar-l40 umar-b20'>是否移除并继续生产订单？</div>",function(r){
             if (r){
                 saveDataHandel(gridRows);
             }else{
                 $('#saveBtn').removeAttr("disabled");
                 return;
             }
         });
	 }else{
         saveDataHandel(gridRows);
	 }
	 

}

function saveDataHandel(gridRows) {
    $_jxc.ajax({
        url:contextPath+"/form/purchaseGuide/generFormList",
        contentType:"application/json",
        data:JSON.stringify(gridRows)
    },function(result){
        if(result.code == 0){
            var guideNo = result.data;
            //提交参数并跳转到第三步
            location.href = contextPath+"/form/purchaseGuide/toGuideOrderList?guideNo="+guideNo;
            //$.StandardPost(contextPath+"/form/purchaseGuide/guideOrderList", {guideNo:guideNo});
        }else{
            $_jxc.alert(result.message);
        }
    });
}

