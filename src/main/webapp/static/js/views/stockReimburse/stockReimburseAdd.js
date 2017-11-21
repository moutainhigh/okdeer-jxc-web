/**
 * 报损单-新增
 */
var dataGridId = "stockReimburseAddForm";
var oldData = {};
$(function(){
	$("#branchName").val(sessionBranchCodeName);
	$("#branchId").val(sessionBranchId);
	$("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
	oldData = {
       	branchId:$("#branchId").val(), //机构id
        remark:$("#remark").val()                  // 备注
    }
    initDatagridStockReimburse();
});
var gridDefault = {
    realNum:0,
    largeNum:0,
    isGift:0,
}
var clickLargeNumChangeFg = false; // 防止 行点击触发 numberbox chang事件 引起反算关系 造成bug
var clickRealNumChangeFg = false; // 防止 行点击触发 numberbox chang事件 引起反算关系 造成bug
var gridHandel = new GridClass();
var editRowData = null;
function initDatagridStockReimburse(){
    gridHandel.setGridName("stockReimburseAddForm");
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
    $("#"+dataGridId).datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:false,  // 单选 false多选
        rownumbers:true,    // 序号
        // pagination:true, //分页
        // fitColumns:true, //占满
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
            {field:'purchaseSpec',title:'进货规格',width:'90px',align:'left',hidden:true},
            {field:'price',title:'成本价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!value){
                    	row["price"] = 0.0000;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                    	disabled:true,
                        min:0,
                        precision:4
                    }
                },
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
	            },
            },
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    
                    if(!value||value==""){
                        row['largeNum'] = "0.0000";
                        value = "0.00";
                    }
                    
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    value:'0',
                    options:{
                        precision:4,
                        min:0,
                        max:999999.99,
                        onChange: onChangeRealNum,
                    }
                },
            },
            {field:'realNum',title:'数量',width:'80px',align:'right',
            	formatter:function(value,row){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value||value==""||parseFloat(value)==0.0){
                        row['realNum'] = "0.0000";
                        value = "0.00";
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    value:'0',
                    options:{
                        precision:4,
                        min:0,
                        max:999999.99,
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
                        precision:4
                    }
                },
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
        	clickLargeNumChangeFg = true;
        	clickRealNumChangeFg = true;
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
            	oldData["grid"] = gridHandel.getRows();
        	}
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }

    });
    if(hasCostPrice==false){
        priceGrantUtil.grantCostPrice(dataGridId,["price","amount"])
    }

    gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
}

// 限制转换次数
var n = 0;
var m = 0;
// 监听箱数
function onChangeRealNum(newV,oldV) {
	if(m === 1){
		m = 0;
		return;
	}
	
	if( parseFloat(newV)<0 ){
		gridHandel.setFieldValue('largeNum',parseFloat(newV*-1).toFixed(4));
		return;
	}
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
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
    
    var _temNewNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'tmpLargeNum');
    var temp_new = newV;
    if(Math.abs(temp_new) > 0 && !oldV){
    	newV = _temNewNum;
    };
    
    var _tempNewRealNum = parseFloat(purchaseSpecValue*newV);
    var newRealNum = parseFloat(_tempNewRealNum).toFixed(4);
    
    if(parseFloat(newV)>0){
        gridHandel.setNowEditFieldName("largeNum");
    }
    
    n = 1;
    gridHandel.setFieldValue('amount',parseFloat(priceValue*_tempNewRealNum).toFixed(4));//金额=数量*单价
    gridHandel.setFieldValue('realNum',parseFloat(newRealNum).toFixed(4)); //数量=箱数*商品规格
    
    updateFooter();
}

// 监听数量
function totleChangePrice(newV,oldV) {
	var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
	if(n === 1){
		var _tempLargeNum = parseFloat(newV)/parseFloat(purchaseSpecValue);
		gridHandel.setFieldsData({tmpLargeNum:_tempLargeNum}); // 保留除法值   防止toFixed(4) 四舍五入做乘法时比原值大的问题
		n = 0;
		return;
	}
	
	if(parseFloat(newV)< 0){
		gridHandel.setFieldValue('realNum',parseFloat(newV*-1).toFixed(4));
		return;
	}
	
	if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
	        return;
	}
	 
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        $_jxc.alert("配送规格不能为0");
        return;
    }
    
    var price = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    gridHandel.setFieldValue('amount',parseFloat(price*newV).toFixed(4)); //金额=数量*单价 出库负数 入库正数
    
    if(parseFloat(newV)>0){
        gridHandel.setNowEditFieldName("realNum");
    }
    
    m = 1;
	var _tempLargeNum = parseFloat(newV)/parseFloat(purchaseSpecValue);
	gridHandel.setFieldsData({tmpLargeNum:_tempLargeNum}); // 保留除法值   防止toFixed(4) 四舍五入做乘法时比原值大的问题
	gridHandel.setFieldValue('largeNum',_tempLargeNum.toFixed(4));   //箱数=数量/商品规格
	
	updateFooter(); 
}

// 合计
function updateFooter(){
    var fields = {stockNum:0,largeNum:0,realNum:0,amount:0};
    var argWhere = {}
    gridHandel.updateFooter(fields,argWhere);
}
// 插入一行
function addLineHandel(event){
    event.stopPropagation(event);

    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
// 删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}

// 选择商品
function selectGoods(searchKey){
	var branchId = $("#branchId").val();
    // 判定发货分店是否存在
    if($("#branchId").val()==""){
        $_jxc.alert("请选择机构");
        return;
    }

    var param = {
        type:'',
        statusList:'0,1,2',
        key:searchKey,
        isRadio:0,
        sourceBranchId:"",
        targetBranchId:"",
        branchId:branchId,
        supplierId:'',
        isManagerStock:1,
        flag:'0',
    }
    new publicGoodsServiceTem(param,function(data){
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
      
    });

}
// 查询价格、库存
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
// 二次查询设置值
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
        actual:'stockNum',
        largeNum:'tmpLargeNum',
    };
    var rows = gFunUpdateKey(addDefaultData,keyNames);
    var argWhere ={skuCode:1};  // 验证重复性
    var isCheck ={isGift:1 };   // 只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
    $("#"+dataGridId).datagrid("loadData",newRows);
    setTimeout(function(){
        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        gridHandel.setSelectFieldName("largeNum");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
    },100)
}
// 报损单一开始选择
function setTion(datas){
	$.each(datas, function (index, el) {
		var realNum = el.realNum;
        if(isNaN(el.realNum)){
			el["realNum"]=parseFloat("0.00");
		}
	})
	$.each(datas, function (index, el) {
		var realNum = el.realNum;
		var largeNum = el.largeNum;
		el["realNum"] = parseFloat(realNum);
		el["largeNum"] = parseFloat(largeNum);
	})
	return datas;
}

//新增报损单
function addStockReimburse() {
	$("#"+dataGridId).datagrid("endEdit", gridHandel.getSelectRowIndex());
	var newData = {
		branchId:$("#branchId").val(), //机构id
	    remark:$("#remark").val(),                  // 备注
        grid:gridHandel.getRows(),
    }
    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.confirm("单据未保存，是否取消编辑并新增?",function(r){
        	if(r){
        		toAddTab("新增报损单", contextPath + "/stock/reimburse/add");
        	}
        });
    }else{    	
    	toAddTab("新增报损单", contextPath + "/stock/reimburse/add");
    }
}

// 保存
function saveStockReimburse(){
    // 商品总数量
    var totalNum = 0;
    // 总金额
    var amount=0;
	// 分店id
	 var branchId = $("#branchId").val();
    // 备注
    var remark = $("#remark").val();
    // 验证表格数据
    $("#"+dataGridId).datagrid("endEdit", gridHandel.getSelectRowIndex());

    var footerRows = $("#"+dataGridId).datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["realNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
    }
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
  // 判定表格不能为空
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
   var isCheckResult = true;
   $.each(rows,function(i,v){
	   v["rowNo"] = i+1;
    	if($_jxc.isStringNull(v["skuCode"])){
             $_jxc.alert("第"+(i+1)+"行，货号不能为空");
             isCheckResult = false;
             return false;
        };
      
        /*if(parseFloat(v["stockNum"])-parseFloat(v["realNum"])<0){
        	$_jxc.alert("报损数量不允许超过当前库存数量！");
        	isCheckResult = false;
          	return false;
        }*/

       if($_jxc.isStringNull(v["largeNum"])){
           $_jxc.alert("第"+(i+1)+"行，箱数不能为空");
           isCheckResult = false;
           return false;
       }

       if($_jxc.isStringNull(v["realNum"])){
           $_jxc.alert("第"+(i+1)+"行，数量不能为空");
           isCheckResult = false;
           return false;
       }

        if(v["largeNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，箱数必须大于0");
            isCheckResult = false;
            return false;
        }
        if(v["realNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }
   });
    
    if(!isCheckResult){
        return;
    }

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    var reqObj = {
    		io:'1',
        	createBranchId:branchId,
            remark:remark,
            stockFormDetailList:rows
        };
    var req = JSON.stringify(reqObj);
    $_jxc.ajax({
        url:contextPath+"/stock/reimburse/save",
        data:req,
        contentType:"application/json"
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
            	location.href = contextPath +"/stock/reimburse/edit?id=" + result["formId"];
            });
        }else{
           $_jxc.alert(result['message']);
        }
    });
}

/**
 * 返回报损单
 */
function back(){
	toClose();
}

/**
 * 机构名称
 */
function searchBranch(){
	new publicAgencyService(function(data){
		var newData = {
			branchId:$("#branchId").val(), //机构id
		    remark:$("#remark").val(),                  // 备注
	        grid:gridHandel.getRows(),
	    }
	    if(!gFunComparisonArray(oldData,newData)){
	    	$_jxc.confirm('修改报损机构后会清空明细，需要重新录入，是否要修改？',function(r){
			    if (r){
			    	$("#branchId").val(data.branchesId);
					$("#branchName").val("["+data.branchCode+"]"+data.branchName);
					gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
					                        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
					                        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
			    }
			});
	    }else{
	    	$("#branchId").val(data.branchesId);
			$("#branchName").val("["+data.branchCode+"]"+data.branchName);
			gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
			                        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
			                        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
	    }
	});
}

/**
 * 导入
 */
function importHandel(type){
	    var branchId = $("#branchId").val();
	    // 判定发货分店是否存在
		// JIANGSHAO
	    if($("#branchId").val()==""){
	        $_jxc.alert("请选择机构");
	        return;
	    }
	    
	    var param = {
	        url:contextPath+"/stock/reimburse/importList",
	        tempUrl:contextPath+"/stock/reimburse/exportTemp",
	        branchId:branchId,
	        type:type
	    }
	    new publicUploadFileService(function(data){
	        updateListData(data);
	    },param)
}

function updateListData(data){
   /*
	 * var nowRows = gridHandel.getRowsWhere({skuCode:'1'}); var addDefaultData =
	 * gridHandel.addDefault(data,gridDefault);
	 */
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
    var argWhere ={skuCode:1};  // 验证重复性
    var isCheck ={isGift:1 };   // 只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(data,rows,argWhere,isCheck);
    // 导入箱数计算
    $.each(data, function (index, el) {	
    		if(parseFloat(el["realNum"])){
			   el["realNum"]=el["realNum"];
   			   el["largeNum"] =parseFloat(el["realNum"])/parseFloat(el["purchaseSpec"]);
   			   el["amount"] =parseFloat(el["realNum"])*parseFloat(el["price"]);
    		 }
    	   if(parseFloat(el["largeNum"])){
			   el["largeNum"]=el["largeNum"];
  			   el["realNum"] =parseFloat(el["largeNum"])*parseFloat(el["purchaseSpec"]);
  			   el["amount"] =parseFloat(el["largeNum"])*parseFloat(el["price"])*parseFloat(el["purchaseSpec"]);
    	}
	  })
    $("#"+dataGridId).datagrid("loadData",data);
}

/**
 * 获取导入的数据
 * 
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
    var argWhere ={skuCode:1};  // 验证重复性
    var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,{});

    $("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
    $_jxc.alert("导入成功");
}

/**
 * 导出
 */
function exportData(){
	var length = $("#"+dataGridId).datagrid('getData').rows.length;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	$('#exportWin').window({
		top:($(window).height()-300) * 0.5,   
	    left:($(window).width()-500) * 0.5
	});
	$("#exportWin").show();
	$("#totalRows").html(dg.datagrid('getData').total);
	$("#exportWin").window("open");
}

/**
 * 导出
 */
function exportExcel(){
	var length = $("#"+dataGridId).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	if(length > exportMaxRow){
		$_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#queryForm").attr("action",contextPath+"/stock/reimburse/exportList");
	$("#queryForm").submit(); 

}
