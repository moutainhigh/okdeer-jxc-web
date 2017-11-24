/**
 * Created by wxl on 2016/10/12.
 * 库存调整-编辑
 */
$(function(){
    initDatagridEditRequireOrder();
    $("div").delegate("button","click",function(){
    	$("p").slideToggle();
    });
    oldData = {
       	branchId:$("#branchId").val(), //机构id
    	reason:$('#reason').val(),//原因
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").html(),                 // 单号
    }
    if($("#close").val()){
    	$("#addButton").addClass("unhide");
    	$("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
    }
});
var gridDefault = {
    realNum:0,
    largeNum:0,
    isGift:0,
}
var oldData = {};
var gridHandel = new GridClass();
function initDatagridEditRequireOrder(){
    gridHandel.setGridName("gridEditRequireOrder");
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("skuCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
                },100)
            }else{
                selectGoods(arg);
            }
        },
    })
    var formId = $("#formId").val();
    $("#gridEditRequireOrder").datagrid({
        //title:'普通表单-用键盘操作',
        method:'get',
    	url:contextPath+"/stock/adjust/getStockFormDetailList?id="+formId,
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        //pagination:true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
                  {field:'ck',checkbox:true},
                  {field:'cz',title:'操作',width:'60px',align:'center',
                      formatter : function(value, row,index) {
                          var str = "";
                          if(row.isFooter){
                              str ='<div class="ub ub-pc">合计</div> '
                          }else{
                              str =  '<a name="add" class="add-line" data-index="'+index+'"  style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
                                  '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'"  style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
                          }
                          return str;
                      },
                  },
                  {field:'skuCode',title:'货号',width:'70px',align:'left'},
                  {field:'skuName',title:'商品名称',width:'200px',align:'left'},
                  {field:'barCode',title:'国际条码',width:'150px',align:'left'},
                  {field:'unit',title:'单位',width:'60px',align:'left'},
                  {field:'spec',title:'规格',width:'90px',align:'left'},
                  {field:'untaxedPrice',title:'不含税成本价',width:'80px',align:'right',
                	  formatter:function(value,row,index){
                		  if(row.isFooter){
                			  return
                		  }
                		  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                	  }
                  },
                  {field:'price',title:'成本价',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      }
                  },
                  {field:'salePrice',title:'零售价',hidden:true},
                  {field:'stockNum',title:'当前库存',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          value:'0',
                          options:{
                          	disabled:true,
                              precision:4,
                          }
                  }},
                  {field:'sellable',title:'当前可销售库存',width:'100px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          value:0,
                          options:{
                        	  disabled:true,
                              min:0,
                              precision:4
                          }
                      },
                  },
                  {field:'largeNum',title:'箱数',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          
                          if(!value||value==""){
                              row["largeNum"] = parseFloat(value||0).toFixed(2);
                          }
                          
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      }
                  },
                  {field:'skuId',hidden:'true'},
                  {field:'realNum',title:'数量',width:'80px',align:'right',
                  	formatter:function(value,row){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          if(!value||value==""||parseFloat(value)==0.0){
                          	row["realNum"] = row["dealNum"];
                        	  value = row["realNum"];
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      }
                  },
                 
                  {field:'untaxedAmount',title:'不含税金额',width:'80px',align:'right',
                	  formatter:function(value,row,index){
                		  if(row.isFooter){
                			  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                		  }
                		  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                	  },
                	  editor:{
                		  type:'numberbox',
                		  options:{
                			  disabled:true,
                			  min:0,
                			  precision:2
                		  }
                	  },
                	  
                  },
                  {field:'amount',title:'金额',width:'80px',align:'right',
                      formatter:function(value,row,index){
                          if(row.isFooter){
                              return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
                      editor:{
                          type:'numberbox',
                          options:{
                          	disabled:true,
                              min:0,
                              precision:2
                          }
                      },

                  },
                  {field:'taxRate',title:' 参考税率',width:'80px',align:'right',
                	  formatter:function(value,row,index){
                          if(row.isFooter){
                              return
                          }
                          if(!value){
                          	row["price"] = 0.00;
                          }
                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                	  }                	  
                  },
                  {field:'tax',title:'税额',width:'80px',align:'right',
                	  formatter:function(value,row,index){
                		  if(row.isFooter){
                			  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                		  }
                		  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                	  },
                	  editor:{
                		  type:'numberbox',
                		  options:{
                			  disabled:true,
                			  min:0,
                			  precision:2
                		  }
                	  },
                	  
                  },
                  {field:'reason',title:'调整原因',width:'200px',align:'left'},
                  {field:'remark',title:'备注',width:'200px',align:'left'}
              ]],
        onClickCell:function(rowIndex,field,value){
        	gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("skuCode");
            }
        },
        onLoadSuccess:function(data){
        	if(!oldData["grid"]){
            	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
            		return $.extend(true,{},obj);//返回对象的深拷贝
            	});
            }
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });

    if(hasCostPrice==false){
        priceGrantUtil.grantCostPrice("gridEditRequireOrder",["price","amount","untaxedPrice","untaxedAmount","taxRate","tax"])
    }

}

//删除
function delStockForm(){
	var id = $("#formId").val();
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/stock/adjust/deleteStockAdjust",
		    	data:{
		    		id : id
		    	}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("删除成功！",function(){
	    				//location.href = contextPath +"/stock/adjust/list";
	    				toRefreshIframeDataGrid("stock/adjust/list","stockFromList");
	    				toClose();
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}
//监听箱数
function onChangeRealNum(newV,oldV) {
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        $_jxc.alert("配送规格不能为0");
        return;
    }
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    var untaxedPrice = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'untaxedPrice');
	var selectVal=$("#io").combobox('getValue');
	if(gridHandel.getSelectFieldName()!="realNum"){
		if(selectVal==1){
		   gridHandel.setFieldValue('realNum',parseFloat(newV*purchaseSpecValue*-1).toFixed(4)); //数量=箱数*商品规格
		}
		else{
		   gridHandel.setFieldValue('realNum',parseFloat(newV*purchaseSpecValue).toFixed(4));    //数量=箱数*商品规格
		} 
		var realNumValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
		if(realNumValue<0){
			var amount = parseFloat(priceValue*realNumValue*-1).toFixed(4);
		    gridHandel.setFieldValue('amount',amount);                  //金额=数量*单价
		    var untaxedAmount = parseFloat(untaxedPrice*realNumValue*-1).toFixed(4);
		    gridHandel.setFieldValue('untaxedAmount',untaxedAmount);    //金额=数量*单价
		    gridHandel.setFieldValue('tax',amount - untaxedAmount); 
		}
		else{
			var amount = parseFloat(priceValue*realNumValue).toFixed(4);
		    gridHandel.setFieldValue('amount',amount);
		    var untaxedAmount = parseFloat(untaxedPrice*realNumValue).toFixed(4);
		    gridHandel.setFieldValue('untaxedAmount',untaxedAmount);    //金额=数量*单价
		    gridHandel.setFieldValue('tax',amount - untaxedAmount); 
		}
	}
    updateFooter();
}

//监听数量
function totleChangePrice(newV,oldV) {
	 if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName')){
	        return;
	 }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        $_jxc.alert("配送规格不能为0");
        return;
    }
    var selectVal=$("#io").combobox('getValue');

    var price = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    var untaxedPrice = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'untaxedPrice');
	  if(selectVal==1&&parseFloat(newV)>0){
//		   gridHandel.setFieldValue('realNum',newV*-1); 
		   gridHandel.setFieldValue('largeNum',parseFloat(newV/purchaseSpecValue*-1).toFixed(4));   //箱数=数量/商品规格
	  }
	  else{
		   gridHandel.setFieldValue('largeNum',parseFloat(newV/purchaseSpecValue).toFixed(4));   //箱数=数量/商品规格	  
	   }
	  if(newV<0){
		  var amount = parseFloat(price*newV*-1).toFixed(4);
          gridHandel.setFieldValue('amount',amount);   //金额=数量*单价
          var untaxedAmount = parseFloat(untaxedPrice*newV*-1).toFixed(4);
          gridHandel.setFieldValue('untaxedAmount',untaxedAmount);   //金额=数量*单价
          gridHandel.setFieldValue('tax',amount - untaxedAmount);
      }                       
	  else{
		  var amount = parseFloat(price*newV).toFixed(4);
		  gridHandel.setFieldValue('amount',amount);    
		  var untaxedAmount = parseFloat(untaxedPrice*newV).toFixed(4);
		  gridHandel.setFieldValue('untaxedAmount',untaxedAmount);    
		  gridHandel.setFieldValue('tax',amount - untaxedAmount);
	  }
	  updateFooter();
}


//合计
function updateFooter(){
    var fields = {stockNum:0,sellable:0,largeNum:0,realNum:0,amount:0,isGift:0,untaxedAmount:0,tax:0};
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}
//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}
//选择商品
function selectGoods(searchKey){
	var branchId = $("#branchId").val();
    //判定发货分店是否存在
    if($("#branchId").val()==""){
        $_jxc.alert("请选择机构");
        return;
    }

    var param = {
        type:'',
        key:searchKey,
        isRadio:0,
        sourceBranchId:"",
        targetBranchId:"",
        branchId:branchId,
        supplierId:'',
        flag:'0',
    }
    new publicGoodsServiceTem(param,function(data){
        if(searchKey){
            $("#"+gridHandel.getGridName()).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#"+gridHandel.getGridName()).datagrid("acceptChanges");
        }
        var setdata=setTion(data);
        selectStockAndPrice(branchId,setdata);
      
    });
}

//二次查询设置值
function setDataValue(data) {
	for(var i in data){
    	var rec = data[i];
    	rec.remark = "";
    }
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var addDefaultData  = gridHandel.addDefault(data,gridDefault);
    var keyNames = {
		distributionPrice:'price',
        id:'skuId',
        disabled:'',
        pricingType:'',
        inputTax:'tax',
        sourceStock:'sellable',
        actual:'stockNum'
    };
    var rows = gFunUpdateKey(addDefaultData,keyNames);
    var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
    $("#gridEditRequireOrder").datagrid("loadData",newRows);
    setTimeout(function(){
        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        gridHandel.setSelectFieldName("largeNum");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
    },100)
}
//查询价格、库存
function selectStockAndPrice(branchId,data){
	var GoodsStockVo = {
			branchId : branchId,
			fieldName : 'id',
			goodsSkuVo : [],
		}; 
	$.each(data,function(i,val){
		var temp = {
				id : val.skuId
		};
		GoodsStockVo.goodsSkuVo[i] = temp;
	});
	$_jxc.ajax({
    	url : contextPath+"/goods/goodsSelect/selectStockAndPriceToDo",
    	data : {
    		goodsStockVo : JSON.stringify(GoodsStockVo)
    	}
    },function(result){
   		var setdata=setTion(result);
   		setDataValue(setdata);
    });
}
//库存调整一开始选择
function setTion(datas){
	var selectVal=$("#io").combobox('getValue');
	$.each(datas, function (index, el) {
		var realNum = el.realNum;
        if(isNaN(el.realNum)){
			el["realNum"]=parseFloat("0.00");
		}
	})
	$.each(datas, function (index, el) {
		var realNum = el.realNum;
		var largeNum = el.largeNum;
		if(selectVal==1){
			el["realNum"] = parseFloat(realNum)*-1;
			 el["largeNum"] = parseFloat(largeNum)*-1;
		}
		else{
			if(realNum<0){
				  el["realNum"] = parseFloat(realNum)*-1;
				  el["largeNum"] = parseFloat(largeNum)*-1;
			    }
			else{
				   el["realNum"] = parseFloat(realNum);
				   el["largeNum"] = parseFloat(largeNum);
			  }
		}
		
	})
	return datas;
}
// 库存调整为负数
function selectTion(){
	var rows = $("#gridEditRequireOrder").datagrid('getRows');
	var selectVal=$("#io").combobox('getValue');
	console.log(selectVal);
	$.each(rows, function (index, el) {
		var realNum = el.realNum;
		var largeNum = el.largeNum;
		if(selectVal==1){
			el["realNum"] = parseFloat(realNum)*-1;
			el["largeNum"] = parseFloat(largeNum)*-1;
		}
		else{
			if(realNum<0){
				  el["realNum"] = parseFloat(realNum)*-1;
				  el["largeNum"] = parseFloat(largeNum)*-1;
			    }
			else{
				   el["realNum"] = parseFloat(realNum);
				   el["largeNum"] = parseFloat(largeNum);
			  }
		}
		
	})
	$("#gridEditRequireOrder").datagrid("loadData", rows);
}
//保存
function saveOrder(){
	// 机构id
	var branchId = $("#branchId").val();
    // 备注
    var remark = $("#remark").val();
    // 原因
    var reason = $("input[name='reason']").val()
    // 选择出入库
    var io = $("#io").val();
   

    var selectVal=$("#io").combobox('getValue');
    var rows = gridHandel.getRows();
  
  //判定表格不能为空
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var isCheckResult = true;
    $.each(rows,function(i,v){
        if(!v["skuCode"]){
            $_jxc.alert("第"+(i+1)+"行，货号不能为空");
            isCheckResult = false;
            return false;
        };
        /*if(selectVal==2){
	        if(parseFloat(v["sellable"])+parseFloat(v["realNum"])<0){
	          $_jxc.alert("调整扣减数量不允许超过当前可销售库存数量！");
	          isCheckResult = false;
	          return false;
	        }
        }*/
    });
    if(!isCheckResult){
        return;
    }
    var saveData = JSON.stringify(rows);
    var stockFormDetailList = tableArrayFormatter(rows,"stockFormDetailList");
    var reqObj = $.extend({
    	createBranchId : branchId,
    	id : $("#formId").val(),
        remark : remark,
        reason :reason,
        io :'1'
    }, stockFormDetailList);
    $_jxc.ajax({
        url:contextPath+"/stock/adjust/updateStockForm",
        data:reqObj
    },function(result){
         if(result['code'] == 0){
         	$_jxc.alert("操作成功！");
         }else{
             $_jxc.alert(result['message']);
         }
    });
}

//审核
function check(){
	//验证数据是否修改
    $("#"+gridHandel.getGridName()).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        branchId:$("#branchId").val(), // 机构id
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").val(),                 // 单号
        grid:gridHandel.getRows(),
    }

    var id = $("#formId").val();
   /* if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }*/
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/stock/adjust/check",
		    	data : {
		    		id : id
		    	}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/stock/adjust/checkSuccess?id="+id;
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}


//合计
function toFooter(){
	$('#gridEditRequireOrder').datagrid('reloadFooter',[{"isFooter":true,"receivablesAccount":$('#receivablesAccount').val()||0,"collectAccount":$('#collectAccount').val()||0}]);
}

/**
 * 机构名称
 */
function searchBranch (){
	new publicAgencyService(function(data){
	$("#branchId").val(data.branchesId);
	$("#branchName").val(data.branchName);
	});
}
/**
 * 申请人
 */
function selectOperator(){
	new publicOperatorService(function(data){
		$("#salesmanId").val(data.id);
		$("#salesmanName").val(data.userName);
	});
}

/**
 * 机构名称
 */
function selectBranchesadd(){
	new publicAgencyService(function(data){
		$("#targetBranchId").val(data.branchesId);
		$("#brancheName").val(data.branchName);
	},'DO','');
}


/**
 * 导入
 */
function importHandel(type){
	var branchId = $("#branchId").val();
    if(!branchId){
        $_jxc.alert("请先选择收货机构");
        return;
    }
    var param = {
        url:contextPath+"/stock/adjust/importList",
        branchId:branchId,
        type:type
    }
    new publicUploadFileService(function(data){
        updateListData(data);
    },param)
}

function updateListData(data){
	   /* var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
	    var addDefaultData  = gridHandel.addDefault(data,gridDefault);*/
	    var keyNames = {
	        purchasePrice:'price',
	        id:'skuId',
	        disabled:'',
	        pricingType:'',
	        inputTax:'tax',
	        nowStock:'sellable',
	        actual:'stockNum'
	    };
	    var rows = gFunUpdateKey(data,keyNames);
	    var argWhere ={skuCode:1};  //验证重复性
	    var isCheck ={isGift:1 };   //只要是赠品就可以重复
	    var newRows = gridHandel.checkDatagrid(data,rows,argWhere,isCheck);

	    $("#gridEditRequireOrder").datagrid("loadData",data);
	}

/**
 * 获取导入的数据
 * @param data
 */
function getImportData(data){
    $.each(data,function(i,val){
        data[i]["oldPurPrice"] = data[i]["purchasePrice"];
        data[i]["oldSalePrice"]=data[i]["salePrice"];
        data[i]["oldWsPrice"]=data[i]["wholesalePrice"];
        data[i]["oldVipPrice"]=data[i]["vipPrice"];
        data[i]["oldDcPrice"]=data[i]["distributionPrice"];
        data[i]["price"] = data[i]["oldPurPrice"];
        data[i]["realNum"]=data[i]["realNum"]||0;
      
        data[i]["amount"]  = parseFloat(data[i]["price"]||0)*parseFloat(data[i]["realNum"]||0);
        data[i]["untaxedAmount"]  = parseFloat(data[i]["untaxedPrice"]||0)*parseFloat(data[i]["realNum"]||0);
        data[i]["tax"] =data[i]["amount"] -data[i]["untaxedAmount"] ;
        if(parseInt(data[i]["spec"])){
        	 data[i]["largeNum"]  = (parseFloat(data[i]["realNum"]||0)/parseFloat(data[i]["spec"])).toFixed(4);
        }else{
        	 data[i]["largeNum"]  =  0;
        	 data[i]["spec"] = 0;
        }
        
    });
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var argWhere ={skuCode:1};  //验证重复性
    var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,{});

    $("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
    $_jxc.alert("导入成功");
}
/**
 * 导出
 */
function exportExcel(){
	var length = $("#gridEditRequireOrder").datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	if(length > exportMaxRow){
		$_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}

	$("#searchForm").attr("action",contextPath+"/stock/adjust/exportList");
	$("#searchForm").submit();

}

/**
 * 返回库存调整
 */
function back(){
	toClose();
}