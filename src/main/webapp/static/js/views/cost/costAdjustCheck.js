/**
 * Created by wxl on 2016/10/12.
 * 成本调整单-审核
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
		          {field:'skuCode',title:'货号',width:'70px',align:'left'},
		          {field:'skuName',title:'商品名称',width:'200px',align:'left'},
		          {field:'barCode',title:'国际条码',width:'150px',align:'left'},
		          {field:'unit',title:'单位',width:'60px',align:'left'},
		          {field:'spec',title:'规格',width:'90px',align:'left'},
		          {field:'oldCostPrice',title:'旧价',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		          },
		          {field:'costPrice',title:'新价',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		          },
		          {field:'untaxedPrice',title:'不含税旧价',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		          },
		          {field:'untaxedNewPrice',title:'不含税新价',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		          },
		          {field:'actual',title:'当前库存',width:'80px',align:'right',
		        	  formatter:function(value,row){
		        		  if(row.isFooter){
		        			  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		        		  }
		        		  if(!value||value==""||parseFloat(value)==0.0){
		        			  row["actual"] = row["dealNum"];
		        			  value = row["actual"];
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		        	  },
		          },
		          {field:'diffMoney',title:'调价差额',width:'80px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },

		          },
		          {field:'untaxedDiffMoney',title:'不含税调价差额',width:'120px',align:'right',
		        	  formatter:function(value,row,index){
		        		  if(row.isFooter){
		        			  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        		  }
		        		  return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
		        	  },
		        	  
		          },
		          {field: 'adjustReason', title: '调整原因', width: '200px', align: 'left'},
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
        priceGrantUtil.grantCostPrice("gridEditRequireOrder",["oldCostPrice","costPrice","untaxedPrice","untaxedNewPrice"])
    }
}

//合计
function updateFooter(){
	var fields = {actual:0,diffMoney:0,isGift:0,untaxedDiffMoney:0 };
	var argWhere = {name:'isGift',value:0}
	gridHandel.updateFooter(fields,argWhere);
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
    $("#gridEditOrder").datagrid("loadData",newRows);
    setTimeout(function(){
        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        gridHandel.setSelectFieldName("largeNum");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
    },100)
}


//合计
function toFooter(){
	$('#gridEditRequireOrder').datagrid('reloadFooter',[{"isFooter":true,"receivablesAccount":$('#receivablesAccount').val()||0,"collectAccount":$('#collectAccount').val()||0}]);
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

//导出
function exportExcel(){
	var length = $("#gridEditRequireOrder").datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	if(length > exportMaxRow){
		$_jxc.alert('提示',"当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#searchForm").attr("action",contextPath+"/cost/costAdjust/exportGoods");
	$("#searchForm").submit();
	
}

