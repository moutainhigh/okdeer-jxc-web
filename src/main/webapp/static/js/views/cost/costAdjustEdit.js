/**
 * Created by wxl on 2016/10/12.
 * 成本调整单-编辑
 */
$(function(){
	initDatagridEditRequireOrder();
	$("div").delegate("button","click",function(){
		$("p").slideToggle();
	});
	oldData = {
			branchId:$("#branchId").val(), // 机构id
			remark:$("#remark").val(),      // 备注
			adjustNo:$("#adjustNo").val(),   // 单号
			id:$("#adjusId").val(),          // id          
	}
	
	 var type = gFunGetQueryString("type");
	if(type=="add"){
		costcheck(type);
	}
});
var gridDefault = {
		//receiveNum:0,
		//largeNum:0,
		// isGift:0,
}
var editRowData = null;
var gridName = "gridEditRequireOrder";
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
	var dataId= $("#adjusId").val();
	$("#gridEditRequireOrder").datagrid({
		//title:'普通表单-用键盘操作',
		method:'post',
		url:contextPath+"/cost/costAdjust/queryCostFormDetailList?id="+dataId,
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
		        			  str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
		        			  '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
		        		  }
		        		  return str;
		        	  },
		          },
		          {field:'skuCode',title:'货号',width:'70px',align:'left',editor:'textbox'},
		          {field:'skuName',title:'商品名称',width:'200px',align:'left'},
		          {field:'barCode',title:'国际条码',width:'150px',align:'left'},
		          {field:'unit',title:'单位',width:'60px',align:'left'},
		          {field:'spec',title:'规格',width:'90px',align:'left'},
		          {field:'oldCostPrice',title:'旧价',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return
		        		  }
						  if(!value){
							  row["oldCostPrice"] = 0.0000;
						  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		        	  editor:{
		        		  type:'numberbox',
		        		  options:{
		        			  disabled:true,
		        			  min:0,
		        			  precision:4,

		        		  }
		        	  },
		          },
		          {field:'costPrice',title:'新价',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		        	  editor:{
		        		  type:'numberbox',
		        		  options:{
		        			  //disabled:true,
		        			  min:0,
		        			  precision:4,
		        			  onChange: onChangeCostPrice,

		        		  }
		        	  },
		          },
		            {field:'untaxedPrice',title:'不含税旧价',width:'80px',align:'right',
		            	formatter:function(value,row,index){
		            		if(row.isFooter){
		            			return
		            		}
		            		if(!value){
		            			row["untaxedPrice"] = 0.0000;
		            		}
		            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		            	},
		            	editor:{
		            		type:'numberbox',
		            		options:{
		            			disabled:true,
		            			min:0,
		            			precision:4,
		            			
		            		}
		            	},
		            },
		            {field:'untaxedNewPrice',title:'不含税新价',width:'80px',align:'right',
		            	formatter:function(value,row,index){
		            		if(row.isFooter){
		            			return
		            		}
		            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		            	},
		            	editor:{
		            		type:'numberbox',
		            		options:{
		            			//disabled:true,
		            			min:0,
		            			precision:4,
		            			onChange: onChangeNewCostPrice,
		            			
		            		}
		            	},
		            },
		          {field:'actual',title:'当前库存',width:'80px',align:'right',
		        	  formatter:function(value,row){
		        		  if(row.isFooter){
		        			  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		        		  }
		        		  if(!value||value==""||parseFloat(value)==0.0){
		        			  row["actual"] = row["dealNum"]||0.00;
		        			  value = row["actual"];
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		        	  },
		        	  editor:{
		        		  type:'numberbox',
		        		  value:'0',
		        		  options:{
		        			  disabled:true,
		        			  precision:2,

		        		  }
		        	  },
		          },
		          {field:'diffMoney',title:'调价差额',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		        	  editor:{
		        		  type:'numberbox',
		        		  options:{
		        			  disabled:true,
		        			  precision:4,
		        		  }
		        	  },

		          },
	            {field:'untaxedDiffMoney',title:'不含税调价差额',width:'120px',align:'right',
	            	formatter:function(value,row,index){
	            		if(row.isFooter){
	            			return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
	            		}
	            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
	            	},
	            	editor:{
	            		type:'numberbox',
	            		options:{
	            			disabled:true,
	            			precision:4,
	            		}
	            	},
	            	
	            },
		          {field: 'adjustReason', title: '调整原因', width: '200px', align: 'left',
                      editor:{
                          type:'textbox',
                          options:{
                              validType:{maxLength:[20]},
                          }
                      }
				  },
		          {field:'remark',title:'备注',width:'200px',align:'left',
                      editor:{
                          type:'textbox',
                          options:{
                              validType:{maxLength:[20]},
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
		        		  gridHandel.setSelectFieldName("skuCode");
		        	  }
		          },
					onBeforeEdit:function (rowIndex, rowData) {
						editRowData = $.extend(true,{},rowData);
					},
					onAfterEdit:function(rowIndex, rowData, changes){
						if(typeof(rowData.id) === 'undefined'){
							// $("#"+gridName).datagrid('acceptChanges');
						}else{
							if(editRowData.skuCode != changes.skuCode){
								rowData.skuCode = editRowData.skuCode;
								gridHandel.setFieldTextValue('skuCode',editRowData.skuCode);
							}
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
        priceGrantUtil.grantCostPrice(gridName,["oldCostPrice","costPrice","untaxedPrice","untaxedNewPrice"])
    }

}

//监听新价
function onChangeCostPrice(newV,oldV) {
	//获取差额
	var actual = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'actual')||0;
	var oldCostPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'oldCostPrice')||0;
	var CostPrice = newV;
	gridHandel.setFieldValue('diffMoney',(parseFloat(actual)*(parseFloat(newV)-parseFloat(oldCostPrice)).toFixed(4)));
	updateFooter();
}
function onChangeNewCostPrice(newV,oldV) {
	//获取差额
	var actual = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'actual')||0;
	var untaxedPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'untaxedPrice')||0;
	gridHandel.setFieldValue('untaxedDiffMoney',(parseFloat(actual)*(parseFloat(newV)-parseFloat(untaxedPrice)).toFixed(4)));
	updateFooter();
}
//合计
function updateFooter(){
	var fields = {actual:0,diffMoney:0,isGift:0,untaxedDiffMoney:0};
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
	if(branchId==""){
		$_jxc.alert("请先选择机构名称");
		return;
	}

    var param = {
        type:'',
        key:searchKey,
        isRadio:'',
        branchId:branchId,
        sourceBranchId:'',
        targetBranchId:'',
        supplierId:'',
        flag:'0',
    }
    new publicGoodsServiceTem(param,function(data){
        if(searchKey){
            $("#gridEditRequireOrder").datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#gridEditRequireOrder").datagrid("acceptChanges");
        }
        selectStockAndPrice(branchId,data);
  
    });
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
    	setDataValue(result);
    });
}
//二次查询设置值
function setDataValue(data) {
	for(var i in data){
    	var rec = data[i];
    	rec.remark = "";
    	rec.untaxedPrice = rec.untaxedCostPrice;
    	rec.untaxedNewPrice = rec.untaxedCostPrice;
    }
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var addDefaultData  = gridHandel.addDefault(data,gridDefault);
    var keyNames = {
		distributionPrice:'price',
        id:'skuId',
        disabled:'',
        io:'',
        inputTax:'tax',
        costPrice:'oldCostPrice'
    };
    var rows = gFunUpdateKey(addDefaultData,keyNames);
    var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
    $("#gridEditRequireOrder").datagrid("loadData",newRows);
    setTimeout(function(){
        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        gridHandel.setSelectFieldName("costPrice");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('costPrice'));
    },100)
}

function editsaveOrder(){
   
  //验证表格数据
	$("#"+gridHandel.getGridName()).datagrid("endEdit", gridHandel.getSelectRowIndex());
	var rows = gridHandel.getRows();
	if(rows.length==0){
		$_jxc.alert("表格不能为空");
		return;
	}
	if(rows.length>1000){
		$_jxc.alert("保存数据不能超过1000条");
		return;
	}
    var isCheckResult = true;
    var isChcekPrice = false;
    $.each(rows,function(i,v){
        /*if(!v["skuCode"]){
            $_jxc.alert("第"+(i+1)+"行，货号不能为空");
            isCheckResult = false;
            return false;
        };
        if(!v["skuName"]){
            $_jxc.alert("第"+(i+1)+"行，名称不能为空");
            isCheckResult = false;
            return false;
        };*/
        if(parseFloat(v["costPrice"])<=0){
            isChcekPrice = true;
        }
    });

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    if(isCheckResult){
        if(isChcekPrice){
            $_jxc.confirm("新单价存在为0，是否确定保存?",function(r){
                if (r){
                    saveDataHandel(rows);
                }
            });
        }else{
            saveDataHandel(rows);
        }
    }
}

function saveDataHandel(rows){
	//调价差价
	var totalMoney=0;
    //调价差价
    var untaxedAmount=0;
	var dataId= $("#adjusId").val();
	// 机构id
	var branchId = $("#branchId").val();
	//reason 原因 
	var adjustReason=$("#adjustReason").combobox('getValue');   
	console.log(adjustReason);
	// 备注
	var remark = $("#remark").val();
	//单号
	var adjustNo= $("#adjustNo").val();
	//单号
	
	var createTime=$("#createTime").val();
	var d = new Date(createTime);
	createTime = new Date(createTime).format("yyyy-MM-dd hh:mm:ss");
	//单号
	var createUserId= $("#createUserId").val();
	
	var status= $("#status").val();
	var footerRows = $("#"+gridHandel.getGridName()).datagrid("getFooterRows");
	if(footerRows){
		totalMoney = parseFloat(footerRows[0]["diffMoney"]||0.0).toFixed(4);
		untaxedAmount = parseFloat(footerRows[0]["untaxedDiffMoney"]||0.0).toFixed(4);
	}


	var saveData = JSON.stringify(rows);
	var jsonData = {
			stockCostFormDetailList:[],
			stockCostForm:{
				adjustNo:adjustNo,
				branchId:branchId,
				adjustReason:adjustReason,
				totalMoney:totalMoney,
				untaxedAmount:untaxedAmount,
				remark:remark,
				id:dataId, 
				createTime:createTime,
				createUserId:createUserId,
				status:status
			}
	};
	$.each(rows,function(i,data){
		var temp = {
				actual: data.actual,
				costPrice:data.costPrice,
				oldCostPrice:data.oldCostPrice,
				diffMoney:data.diffMoney,
				untaxedPrice:data.untaxedPrice,
	            untaxedNewPrice:data.untaxedNewPrice,
	            untaxedDiffMoney:data.untaxedDiffMoney,
				remark : data.remark,
				skuCode : data.skuCode,
				skuId:data.skuId,
				adjustReason:data.adjustReason
		}
		jsonData.stockCostFormDetailList[i] = temp;
	});
	$_jxc.ajax({
		url:contextPath+"/cost/costAdjust/updateCostForm",
		data:{"jsonData":JSON.stringify(jsonData)}
	},function(result){
		if(result['code'] == 0){
			oldData = {
					branchId:$("#branchId").val(), // 机构id
					remark:$("#remark").val(),                  // 备注
			}
			oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
				return $.extend(true,{},obj);//返回对象的深拷贝
			});
			$_jxc.alert("操作成功！",function(){
				costcheck("add");
			});
			//location.reload()
		}else{
            $_jxc.alert(result['message']);
		}
	});
}

//导入
function toImportproduct(type){
    var branchId = $("#branchId").val();
    if(!branchId){
        $_jxc.alert("请先选择机构名称");
        return;
    }
    var param = {
        url:contextPath+"/cost/costAdjust/importList",
        tempUrl:contextPath+"/cost/costAdjust/exportTemp",
        type:type,
        tipSign:1,
        branchId:branchId,
    }
    new publicUploadFileService(function(data){
        updateListData(data);
        
    },param)
}
function updateListData(data){
	    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
	    var keyNames = {
	        id:'skuId',
	        costPrice:"oldCostPrice",
	        newCostPrice:"costPrice"
	    };
	    var rows = gFunUpdateKey(data,keyNames);
	    var argWhere ={skuCode:1};  //验证重复性
	    var isCheck ={isGift:1 };   //只要是赠品就可以重复
	    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);

	    $("#gridEditRequireOrder").datagrid("loadData",newRows);
	}
//审核
function costcheck(type){
	var checkBtn = $("#checkBtn");
	
	//没有审核权限，则不能进行审核操作
	if(checkBtn.length < 1 ){
		return;
	}
	
	
	var dataId= $("#adjusId").val();
	if(!type){
		//验证数据是否修改
		$("#"+gridHandel.getGridName()).datagrid("endEdit", gridHandel.getSelectRowIndex());
		var newData = {
				branchId:$("#branchId").val(), // 机构id
				remark:$("#remark").val(),      // 备注
				adjustNo:$("#adjustNo").val(),   // 单号
				id:$("#adjusId").val(),          // 单号
				grid:gridHandel.getRows(),
		}

		if(!gFunComparisonArray(oldData,newData)){
			$_jxc.alert("数据已修改，请先保存再审核");
			return;
		}
	}
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
				url : contextPath+"/cost/costAdjust/check",
				data:{"id":dataId}
			},function(result){
				
				if(result['code'] == 0){
					$_jxc.alert('操作成功！',function(){
						 location.href = contextPath +"/cost/costAdjust/edit?id="+gFunGetQueryString("id");
					})
				}else{
                    $_jxc.alert(result['message']);
				}
			});
		}
	});
}

//删除
function delCostForm(){
	var dataId= $("#adjusId").val();
	$_jxc.confirm('是否要删除此条数据？',function(data){
		if(data){
			$_jxc.ajax({
				url:contextPath+"/cost/costAdjust/deleteCostForm",
				data:{"id":dataId}
			},function(result){
				
				if(result['code'] == 0){
                    $_jxc.alert("删除成功");
					back();
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

function loadLists(referenceId){
	$("#gridEditRequireOrder").datagrid("options").method = "post";
	$("#gridEditRequireOrder").datagrid('options').url = contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+referenceId;
	$("#gridEditRequireOrder").datagrid('load');
}

/**
 * 返回库存调整
 */
function back(){
	toClose();
}
/**
 * 导入
 */
function importHandel(){
	postelsxDeliver('gridEditRequireOrder','/goods/goodsSelect',$("#sourceBranchId").val(),$("#targetBranchId").val(),"DA");
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
		data[i]["receiveNum"]=data[i]["receiveNum"]||0;

		data[i]["amount"]  = parseFloat(data[i]["price"]||0)*parseFloat(data[i]["receiveNum"]||0);
		if(parseInt(data[i]["distributionSpec"])){
			data[i]["largeNum"]  = (parseFloat(data[i]["receiveNum"]||0)/parseFloat(data[i]["distributionSpec"])).toFixed(4);
		}else{
			data[i]["largeNum"]  =  0;
			data[i]["distributionSpec"] = 0;
		}

	});
	var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
	var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
	var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,isCheck);

	$("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
	$_jxc.alert("导入成功");
}
//导出
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

	$("#searchForm").attr("action",contextPath+"/cost/costAdjust/exportGoods");
	$("#searchForm").submit();
	
}

