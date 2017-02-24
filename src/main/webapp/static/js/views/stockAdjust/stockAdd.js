/**
 * Created by wxl on 2016/10/12.
 * 库存调整-新增
 */
$(function(){
	$("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
    initDatagridAddRequireOrder();
});
var gridDefault = {
    realNum:0,
    largeNum:0,
    isGift:0,
}
var gridHandel = new GridClass();
function initDatagridAddRequireOrder(){
    gridHandel.setGridName("gridEditOrder");
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
    $("#gridEditOrder").datagrid({
        //title:'普通表单-用键盘操作',
//        method:'get',
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
            {field:'price',title:'成本价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!value){
                    	row["price"] = 0.00;
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
            },
 },
            {field:'sellable',title:'当前可销售库存',width:'100px',align:'right',
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
                },
                editor:{
                    type:'numberbox',
                    value:'0',
                    options:{
                        precision:4,
                        onChange: onChangeRealNum,
                    }
                },
            },
            {field:'dealNum',title:'发货数量',width:'80px',align:'right',hidden:true},
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
                },
                editor:{
                    type:'numberbox',
                    value:'0',
                    options:{
                        precision:4,
                        onChange: totleChangePrice,
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
            {field:'reason',title:'调整原因',width:'200px',align:'left',editor:'textbox'},
            {field:'remark',title:'备注',width:'200px',align:'left',editor:'textbox'}
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
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }

    });

    gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
}

//限制转换次数
var n = 0;
var m = 0;
//监听箱数
function onChangeRealNum(newV,oldV) {
	if(m === 1){
		m = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }

    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        messager("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        messager("配送规格不能为0");
        return;
    }
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
	var selectVal=$("#io").combobox('getValue');
    var newRealNum = parseFloat(purchaseSpecValue*newV).toFixed(4);
    if(parseFloat(newV)>0){
        gridHandel.setNowEditFieldName("largeNum");
    }
    if(selectVal==1){
    	n = 1;
        if(parseFloat(newV)>0){
//            gridHandel.setFieldValue('largeNum',parseFloat(newV*-1).toFixed(4));
            gridHandel.setFieldValue('realNum',parseFloat(newRealNum*-1).toFixed(4)); //数量=箱数*商品规格
        }
        else{
//            gridHandel.setFieldValue('largeNum',parseFloat(newV).toFixed(4));
            gridHandel.setFieldValue('realNum',parseFloat(newRealNum).toFixed(4));    //数量=箱数*商品规格
        }
    }
    else{
    	n = 1;
        if(parseFloat(newV)<0){
//            gridHandel.setFieldValue('largeNum',parseFloat(newV*-1).toFixed(4));
            gridHandel.setFieldValue('realNum',parseFloat(newRealNum*-1).toFixed(4));    //数量=箱数*商品规格
        }
        else{
//            gridHandel.setFieldValue('largeNum',parseFloat(newV).toFixed(4));
            gridHandel.setFieldValue('realNum',parseFloat(newRealNum).toFixed(4));    //数量=箱数*商品规格
        }
    }
    var realNumValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
    if(parseFloat(realNumValue)<0){
        gridHandel.setFieldValue('amount',parseFloat(priceValue*realNumValue*-1).toFixed(4));                  //金额=数量*单价
    }
    else{
        gridHandel.setFieldValue('amount',parseFloat(priceValue*realNumValue).toFixed(4));
    }
    updateFooter();
}

//监听数量
function totleChangePrice(newV,oldV) {
	if(n === 1){
		n = 0;
		return;
	}
	
	 if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
	        return;
	 }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        messager("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        messager("配送规格不能为0");
        return;
    }
    var selectVal=$("#io").combobox('getValue');

    var price = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');

    if(parseFloat(newV)>0){
        gridHandel.setNowEditFieldName("realNum");
    }
    
	  if(selectVal==1){
		  m = 1;
		  if(parseFloat(newV)>0){
//		      gridHandel.setFieldValue('realNum',parseFloat(newV*-1).toFixed(4)); 
		      gridHandel.setFieldValue('largeNum',parseFloat(newV/purchaseSpecValue*-1).toFixed(4));   //箱数=数量/商品规格
		    }
		  else{
//			  gridHandel.setFieldValue('realNum',parseFloat(newV).toFixed(4)); 
			  gridHandel.setFieldValue('largeNum',parseFloat(newV/purchaseSpecValue).toFixed(4));   //箱数=数量/商品规格
			    
		   }
		  }
	  else{
		  m = 1;
		  if(parseFloat(newV)<0){
//			  gridHandel.setFieldValue('realNum',parseFloat(newV*-1).toFixed(4)); 
		      gridHandel.setFieldValue('largeNum',parseFloat(newV/purchaseSpecValue*-1).toFixed(4));   //箱数=数量/商品规格
		   }
		  else{
//			  gridHandel.setFieldValue('realNum',parseFloat(newV).toFixed(4)); 
		      gridHandel.setFieldValue('largeNum',parseFloat(newV/purchaseSpecValue).toFixed(4));   //箱数=数量/商品规格
		   
		   }
		  }
	  if(parseFloat(newV)<0){
             gridHandel.setFieldValue('amount',parseFloat(price*newV*-1).toFixed(4));   //金额=数量*单价
        }                       
	  else{
		     gridHandel.setFieldValue('amount',parseFloat(price*newV).toFixed(4));    
	  }
	  updateFooter();
}

//监听是否赠品
function onSelectIsGift(data){
    var checkObj = {
        skuCode: gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'skuCode'),
        isGift:data.id,
    };
    var arrs = gridHandel.searchDatagridFiled(gridHandel.getSelectRowIndex(),checkObj);
    if(arrs.length==0){
        var targetPrice = gridHandel.getFieldTarget('price');
        if(data.id=="1"){
            var priceVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
            $('#gridEditOrder').datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"] = priceVal;
            $(targetPrice).numberbox('setValue',0);
            $(targetPrice).numberbox('disable');
        }else{
            $(targetPrice).numberbox('enable');
            var oldPrice =  $('#gridEditOrder').datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"];
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
            }
        }
        updateFooter();
    }else{
        var targetIsGift = gridHandel.getFieldTarget('isGift');
        $(targetIsGift).combobox('select', data.id=='1'?'0':'1');
        messager(data.id=='1'?'已存在相同赠品':'已存在相同商品');
    }
}
//合计
function updateFooter(){
    var fields = {stockNum:0,sellable:0,largeNum:0,realNum:0,amount:0,isGift:0, };
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
	var selectVal=$("#io").combobox('getValue');
    //判定发货分店是否存在
    if($("#branchId").val()==""){
        messager("请选择机构");
        return;
    } 
    
    //判定请选择出/入库
    if(selectVal==''){
    	messager("请选择出/入库");
        return;
    }
    new publicGoodsService("",function(data){
 
        if(searchKey){
            $("#"+gridHandel.getGridName()).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#"+gridHandel.getGridName()).datagrid("acceptChanges");
        }
        var setdata=setTion(data);
        selectStockAndPrice(branchId,setdata);
       
        gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("largeNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
        },100)
      
    },searchKey,"","","",branchId,'',"0");

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
	$.ajax({
    	url : contextPath+"/goods/goodsSelect/selectStockAndPriceToDo",
    	type : "POST",
    	data : {
    		goodsStockVo : JSON.stringify(GoodsStockVo)
    	},
    	success:function(result){
    		 var setdata=setTion(result);
    		setDataValue(setdata);
    	},
    	error:function(result){
    		successTip("请求发送失败或服务器处理失败");
    	}
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
		costPrice:'price',
        id:'skuId',
        disabled:'',
        io:'',
        inputTax:'tax',
        sourceStock:'sellable',
        actual:'stockNum'
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
	
	var rows = $('#gridEditOrder').datagrid('getRows');
	var selectVal=$("#io").combobox('getValue');
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
	$("#gridEditOrder").datagrid("loadData", rows);
}

//保存
function saveOrder(){
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
	// 要活分店id
	 var branchId = $("#branchId").val();
    // 备注
    var remark = $("#remark").val();
    // 原因
    var reason = $("input[name='reason']").val()  
    // 选择出入库
    var io = $("input[name='io']").val();
    //验证表格数据
    $("#gridEditOrder").datagrid("endEdit", gridHandel.getSelectRowIndex());

    var footerRows = $("#gridEditOrder").datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["realNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
    }
    var selectVal=$("#io").combobox('getValue');
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    //判定请选择出/入库
    if(selectVal==''){
    	messager("请选择出/入库");
        return;
    }
  //判定表格不能为空
    if(rows.length==0){
        messager("表格不能为空");
        return;
    }
   var isCheckResult = true;
    $.each(rows,function(i,v){
    	 if(!v["skuCode"]){
             messager("第"+(i+1)+"行，货号不能为空");
             isCheckResult = false;
             return false;
         };
      
        if(selectVal==1){
	        if(parseFloat(v["sellable"])+parseFloat(v["realNum"])<0){
	          messager("调整扣减数量不允许超过当前可销售库存数量！");
	          isCheckResult = false;
	          return false;
	        }
        }
    });
    
    
    $.each(rows,function(i,v){
   	 if(!v["realNum"]){
            messager("第"+(i+1)+"行，数量不能为空");
            isCheckResult = false;
            return false;
        };
     
   });
    
    if(!isCheckResult){
        return;
    }
   // var saveData = JSON.stringify(rows);
   // var stockFormDetailList = tableArrayFormatter(rows,"stockFormDetailList");
   /* var reqObj = $.extend({
    	io:io,
    	createBranchId:branchId,
        reason:reason,
        remark:remark,
    }, stockFormDetailList);
    */
    var reqObj = {
    		io:io,
        	createBranchId:branchId,
            reason:reason,
            remark:remark,
            stockFormDetailList:rows
        };
    var req = JSON.stringify(reqObj);
    $.ajax({
        url:contextPath+"/stock/adjust/addStockForm",
        type:"POST",
        data:req,
        contentType:"application/json",
        success:function(result){
            if(result['code'] == 0){
                $.messager.alert("操作提示", "操作成功！", "info",function(){
                	location.href = contextPath +"/stock/adjust/edit?id=" + result["formId"];
                });
            }else{
               successTip(result['message']);
            }
        },
        error:function(result){
            successTip("请求发送失败或服务器处理失败");
        }
    });
}

//审核
function check(){
	var deliverFormId = $("#formId").val();
	$.messager.confirm('提示','是否审核通过？',function(data){
		if(data){
			$.ajax({
		    	url : contextPath+"/form/deliverForm/check",
		    	type : "POST",
		    	data : {
		    		deliverFormId : $("#formId").val(),
		    		stockType : 'DI'
		    	},
		    	success:function(result){
		    		if(result['code'] == 0){
		    			$.messager.alert("操作提示", "操作成功！", "info",function(){
		    				contextPath +"/stock/adjust/list";
		    			});
		    		}else{
		    			successTip(result['message']);
		    		}
		    	},
		    	error:function(result){
		    		successTip("请求发送失败或服务器处理失败");
		    	}
		    });
		}
	});
}
/**
 * 返回库存调整
 */
function back(){
	toClose();
}

/**
 * 机构名称
 */

function searchBranch (){
	new publicAgencyService(function(data){
	$("#branchId").val(data.branchesId);
	$("#branchName").val("["+data.branchCode+"]"+data.branchName);
	});
}


/**
 * 导入
 */
function importHandel(type){
	    var branchId = $("#branchId").val();
		var selectVal=$("#io").combobox('getValue');
	    //判定发货分店是否存在  
		//JIANGSHAO
	    if($("#branchId").val()==""){   
	        messager("请选择机构");
	        return;
	    } 
	    
	    //判定请选择出/入库
	    if(selectVal==''){
	    	messager("请选择出/入库");
	        return;
	    }
	    
	    var param = {
	        url:contextPath+"/stock/adjust/importList",
	        tempUrl:contextPath+"/stock/adjust/exportTemp",
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
        costPrice:'price',
        id:'skuId',
        disabled:'',
        io:'',
        inputTax:'tax',
        nowStock:'sellable',
        actual:'stockNum'
    };
    var rows = gFunUpdateKey(data,keyNames);
    var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(data,rows,argWhere,isCheck);
    var selectVal=$("#io").combobox('getValue');
    //导入箱数计算
    $.each(data, function (index, el) {	
    	if(selectVal==1){
    		if(parseFloat(el["realNum"])){
    			if(parseFloat(el["realNum"])>0){
    			  el["realNum"]=el["realNum"]*-1;
    			  el["largeNum"] =parseFloat(el["realNum"])/parseFloat(el["purchaseSpec"]);
    			  el["amount"] =parseFloat(el["realNum"])*parseFloat(el["price"]);
    			  
    			}
    			else{
    			  el["realNum"]=el["realNum"];
       			  el["largeNum"] =parseFloat(el["realNum"])/parseFloat(el["purchaseSpec"]);
       			  el["amount"] =parseFloat(el["realNum"])*parseFloat(el["price"]);
    			}
    		 }
    	   if(parseFloat(el["largeNum"])){
    		   if(parseFloat(el["largeNum"])>0){
    			   el["largeNum"]=el["largeNum"]*-1;
        		   el["realNum"] =parseFloat(el["largeNum"])*parseFloat(el["purchaseSpec"]);
        		   el["amount"] =parseFloat(el["largeNum"])*parseFloat(el["price"])*parseFloat(el["purchaseSpec"]);
    		   }
    		   else{
    			   el["largeNum"]=el["largeNum"];
      			   el["realNum"] =parseFloat(el["largeNum"])*parseFloat(el["purchaseSpec"]);
      			  el["amount"] =parseFloat(el["largeNum"])*parseFloat(el["price"])*parseFloat(el["purchaseSpec"]);
    		   }
    	}
    	}
    	else{
    		if(parseFloat(el["realNum"])){
    			if(parseFloat(el["realNum"])<0){
    			  el["realNum"]=el["realNum"]*-1;
      			  el["largeNum"] =parseFloat(el["realNum"])/parseFloat(el["purchaseSpec"]);
      			  el["amount"] =parseFloat(el["realNum"])*parseFloat(el["price"]);
    			}
    			else{
    			  el["realNum"]=el["realNum"];
    			  el["largeNum"] =parseFloat(el["realNum"])/parseFloat(el["purchaseSpec"]);
    			  el["amount"] =parseFloat(el["realNum"])*parseFloat(el["price"]);
    			 }
    		}
    		if(parseFloat(el["largeNum"])){
    			if(parseFloat(el["largeNum"])<0){
    			  el["largeNum"]=el["largeNum"]*-1;
    	          el["realNum"] =parseFloat(el["largeNum"])*parseFloat(el["purchaseSpec"]);
    	          el["amount"] =parseFloat(el["largeNum"])*parseFloat(el["price"])*parseFloat(el["purchaseSpec"]);
       		   
    			}
    			else{
    			 el["largeNum"]=el["largeNum"];
    			 el["realNum"] =parseFloat(el["largeNum"])*parseFloat(el["purchaseSpec"]);
    			 el["amount"] =parseFloat(el["largeNum"])*parseFloat(el["price"])*parseFloat(el["purchaseSpec"]);
    			}
    		} 
	
    	}
	  })
    $("#gridEditOrder").datagrid("loadData",data);
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
        if(parseInt(data[i]["purchaseSpec"])){
        	 data[i]["largeNum"]  = (parseFloat(data[i]["realNum"]||0)/parseFloat(data[i]["purchaseSpec"])).toFixed(4);
        }else{
        	 data[i]["largeNum"]  =  0;
        	 data[i]["purchaseSpec"] = 0;
        }
        
    });
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var argWhere ={skuCode:1};  //验证重复性
    var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,{});

    $("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
    messager("导入成功");
}

/**
 * 导出
 */
function exportExcel(){
	$("#queryForm").form({
		success : function(data){
			if(data.code > 0){
				$.messager.alert('提示',data.message);
			}
		}
	});

	var isValid = $("#queryForm").form('validate');
	if(!isValid){
		return;
	}

	var length = $("#goodsTab").datagrid('getData').total;
	if(length == 0){
		$.messager.alert('提示',"无数据可导");
		return;
	}
	if(length>10000){
		$.messager.alert('提示',"当次导出数据不可超过1万条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#queryForm").attr("action",contextPath+"/goods/report/exportList");
	$("#queryForm").submit(); 

}
