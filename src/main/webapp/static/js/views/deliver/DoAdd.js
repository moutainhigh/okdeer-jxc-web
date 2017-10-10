/**
 * Created by zhanghuan on 2016/8/30.
 * 出库-新增
 */
//过滤price priceBack 标示 
var loadFilterFlag = false;
// 是否赠品是否可选择
var isGiftFlag = false;

var sourceBranchType;
$(function(){
    $("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
    var referenceId = $("#referenceId").val();
    if (referenceId) {	
    	isGiftFlag = true;
    }
    initDatagridAddRequireOrder();
    loadFormByFormNoDA();
    sourceBranchType = $("#sourceBranchType").val();
    
    $(".radioItem").on("change",function(){
    	$("#referenceId").val("");
    	$("#referenceNo").val("");
    	isGiftFlag = false;
    	$("#sourceBranchId").val(oldBid);
		$("#sourceBranchType").val(oldBtype);
		$("#sourceBranchName").val(oldBname);
		$("#targetBranchId").val("");
		$("#targetBranchType").val("");
		$("#targetBranchName").val("");
		
		$("#DAremark").val("");
    	$("#address").html('');
		$("#contacts").html('');
		$("#mobile").html('');
    	$('#gridEditOrder').datagrid('loadData',[]);
    })
});


$(document).on('input','#remark',function(){
	var val=$(this).val();
	var str = val;
	   var str_length = 0;
	   var str_len = 0;
	      str_cut = new String();
	      str_len = str.length;
	      for(var i = 0;i<str_len;i++)
	     {
	        a = str.charAt(i);
	        str_length++;
	        if(escape(a).length > 4)
	        {
	         //中文字符的长度经编码之后大于4
	         str_length++;
	         }
	         str_cut = str_cut.concat(a);
	         if(str_length>200)
	         {
	        	 str_cut.substring(0,i)
	        	 remark.value = str_cut;
	        	 break;
	         }
	    }
	
});




var gridDefault = {
	dealNum:0,
    //largeNum:0,
    isGift:0,
    // giftTxt:"否"
}
var gridHandel = new GridClass();
var gridName = "gridEditOrder";
var editRowData = null;
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
        //method:'get',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        //pagination:true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        data:[$.extend({},gridDefault),$.extend({},gridDefault),
            $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
            $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)],
        columns:[[
            {field:'ck',checkbox:true},
            {field:'cz',title:'操作',width:'50px',align:'center',
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
            {field:'skuName',title:'商品名称',width:'190px',align:'left'},
            {field:'barCode',title:'条码',width:'105px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'distributionSpec',title:'配送规格',width:'65px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return "<b>"+parseFloat(value||0).toFixed(2)+"<b>";
                    }
                    
                    if(!value || value==""){
                        row["largeNum"] = parseFloat(value||0).toFixed(2);
                    }
                    
                    return "<b>"+parseFloat(value||0).toFixed(2)+"<b>";
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeLargeNum,
                    }
                },
            },
            {field:'applyNum',hidden:true},
            {field:'dealNum',title:'数量',width:'80px',align:'right',
            	  formatter:function(value,row,index){
                      if(row.isFooter){
                          return "<b>"+parseFloat(value||0).toFixed(2)+"<b>";
                      }
                      
                      // 箱数是0，则默认为0
                      if(parseFloat(row.largeNum||0)==0){
                      	 return "<b>"+parseFloat(0).toFixed(2)+ "<b>";
                      }
                      
                      if(!value||value==""||parseFloat(value)==0){
                          /*if (parseFloat(row["sourceStock"]||0) <= 0) {
                              value = 0.00;
                          } else */
                          if (!row["applyNum"] || row["applyNum"] == '') {
                    		  value = 0.00;
                    	  } else {
                    		  row["dealNum"] = row["applyNum"];
                              value = row["dealNum"];
                    	  }
                      }
                      return "<b>"+parseFloat(value||0).toFixed(2)+"<b>";
                  },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeRealNum,
                    }
                },
            },
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!row["price"]){
                        row["price"] = 0;
                        value = row["price"];
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        disabled:true,
                        precision:4,
//                        onChange: onChangePrice,
                    }
                },
            },
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return "<b>"+parseFloat(value).toFixed(2)+"<b>";
                    }
                    if(!value){
                    	row["amount"] = 0;
                    }
                    return "<b>"+parseFloat(value||0).toFixed(2)+"<b>";
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        disabled:true,
                        precision:4,
//                        onChange: onChangeAmount,
                    }
                },
            },
            {field:'isGift',title:'赠送',width:'65px',align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    row.isGift = row.isGift?row.isGift:0;
                    return value=='1'?'是':(value=='0'?'否':'请选择');
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        editable:false,
                        required:true,
                        disabled:isGiftFlag,
                        data: [{
                            "id":'1',
                            "text":"是",
                        },{
                            "id":'0',
                            "text":"否",
                        }],
                        onSelect:onSelectIsGift
                    }
                }
            },
            {field:'salePrice',title:'零售价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return "<b>"+parseFloat(value||0).toFixed(2)+"<b>";
                },
            },
            {field:'saleAmount',title:'零售金额',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    var saleAmount = (parseFloat(row.dealNum)*parseFloat(row.salePrice)||0.0000).toFixed(2);
                    row["saleAmount"] = saleAmount;
                    return '<b>'+parseFloat(saleAmount||0).toFixed(2)+'</b>';;
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        min:0,
                        precision:2,
                    }
                },
            },
            {field:'inputTax',title:'税率',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return  "<b>"+parseFloat(value||0).toFixed(2)+ "<b>";
                },
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
            	formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    var taxAmountVal = (row.inputTax*(row.amount/(1+parseFloat(row.inputTax)))||0.0000).toFixed(2);
                    row["taxAmount"] = taxAmountVal;
                    return "<b>"+parseFloat(taxAmountVal||0).toFixed(2)+"<b>";
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        min:0,
                        precision:2,
                    }
                },
            },
            {field:'originPlace',title:'产地',width:'100px',align:'left'},
            {field:'sourceStock',title:'当前库存',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return  "<b>"+parseFloat(value||0).toFixed(2)+ "<b>";
                },
            },
            {field:'defectNum',title:'缺货数',width:'100px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return  "<b>"+parseFloat(value||0).toFixed(2)+ "<b>";
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
        loadFilter:function(data){
        	//显示现实数据转换 后台不返回 rows 节点结构啦 2.7
        	data = $_jxc.gridLoadFilter(data);
        	
        	if(loadFilterFlag && data && data.length > 0 ){
        		loadFilterFlag = false;
        		data.forEach(function(obj,index){
        			//编辑后 可以再次选择商品 新选的 priceBack为空
        			if(!obj.priceBack){
        				
        				if(obj.isGift && obj.isGift != '1'){
        					//非赠品
        					obj.price = obj.distributionPrice;
        				}else if(obj.isGift && obj.isGift == '1'){
        					//赠品
        					obj.amount = 0;
        				}
        				obj.priceBack = obj.distributionPrice;
        			}
        		})
        	}
        	return data;
        },
        onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });


    var param = {
        distributionPrice:["price","amount","taxAmount"],
        salePrice:["salePrice","saleAmount"]
    }
    priceGrantUtil.grantPrice(gridName,param);

}


//限制转换次数
var n = 0;
var m = 0;

//监听商品箱数
function onChangeLargeNum(newV,oldV){
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if("" == newV){
		m=2;
		 $_jxc.alert("商品箱数输入有误");
		 gridHandel.setFieldValue('largeNum',oldV); 
	     return;
	}
	
	if(m === 1){
		m = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        $_jxc.alert("配送规格不能为0");
        return;
    }
    
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    var salePriceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'salePrice');
    var _tempAmount = purchaseSpecValue*priceValue*newV;

    gridHandel.setFieldValue('amount',_tempAmount.toFixed(4));             //金额=箱数*规格*单价
    gridHandel.setFieldValue('saleAmount',(purchaseSpecValue*salePriceValue*newV).toFixed(4));      //零售金额=箱数*规格*零售价
    
    var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    var _taxAmountVal = (_tempInputTax*(_tempAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(2);
    gridHandel.setFieldValue('taxAmount',_taxAmountVal);//税额 = 金额/(1+税率)*税率
    
    
    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'dealNum');
    var realNumVal2 = parseFloat(purchaseSpecValue*newV).toFixed(4);//parseFloat(Math.round(purchaseSpecValue*newV*1000)/1000).toFixed(4);
    if(realNumVal&& oldV){
    	n=1;
        gridHandel.setFieldValue('dealNum',(purchaseSpecValue*newV).toFixed(4));//数量=商品规格*箱数
    }

    updateFooter();
}
//监听商品数量
function onChangeRealNum(newV,oldV) {
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if("" == newV){
		n=2;
		 $_jxc.alert("商品数量输入有误");
		 gridHandel.setFieldValue('dealNum',oldV);
	     return;
	}
	if(n === 1){
		n = 0;
		return;
	}
	
    if(isSelectDeliver){
        var oldDeliverDealNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex()||0,'oldDeliverDealNum');
        if(parseFloat(newV)>parseFloat(oldDeliverDealNum)){
            $_jxc.alert("数量不能大于要货数量("+oldDeliverDealNum+")");
            gridHandel.setFieldValue('dealNum',oldDeliverDealNum);
            return;
        }else{
            var sourceStockVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'sourceStock');
            var defectNum = parseFloat(sourceStockVal||0)-parseFloat(newV||0);
            var defectNumVal = defectNum<0?-defectNum:0;
            gridHandel.setFieldValue('defectNum',defectNumVal);
        }
    }
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }
    if(parseFloat(purchaseSpecValue)==0.0){
        $_jxc.alert("配送规格不能为0");
        return;
    }
    //var sourceStockVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'sourceStock');
    //if(parseFloat(newV)>parseFloat(sourceStockVal)){
    //	$_jxc.alert("输入的数量不能大于库存数："+sourceStockVal);
    //    gridHandel.setFieldValue('dealNum',0.0000);
    //    gridHandel.setSelectFieldName("dealNum");
    //    gridHandel.setFieldFocus(gridHandel.getFieldTarget('dealNum'));
    //    return;
    //}
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    var salePriceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'salePrice');
	var _tempAmount = priceValue*newV;
    gridHandel.setFieldValue('amount',_tempAmount.toFixed(4));             //金额=数量*单价
    gridHandel.setFieldValue('saleAmount',(salePriceValue*newV).toFixed(4));      //零售金额=数量*零售价
    
     var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    var _taxAmountVal = (_tempInputTax*(_tempAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(2);
    gridHandel.setFieldValue('taxAmount',_taxAmountVal);//税额 = 金额/(1+税率)*税率

    var largeNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'largeNum');
    var largeNumVal2 = parseFloat(purchaseSpecValue*newV).toFixed(4);
    if(largeNumVal&& oldV){
    	m=1;
        var largeNumVal = parseFloat(newV/purchaseSpecValue).toFixed(4);
        gridHandel.setFieldValue('largeNum',largeNumVal);   //箱数=数量/商品规格
    }
    /*gridHandel.setFieldValue('largeNum',(newV/purchaseSpecValue).toFixed(4));   //箱数=数量/商品规格*/
    updateFooter();
}
//监听商品单价
function onChangePrice(newV,oldV) {
    var dealNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'dealNum');
    gridHandel.setFieldValue('amount',dealNumVal*newV);                          //金额=数量*单价
    updateFooter();
}
//监听商品金额
function onChangeAmount(newV,oldV) {
    //获取税率
    var taxVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    gridHandel.setFieldValue('taxAmount',(taxVal*(newV/(1+parseFloat(taxVal)))).toFixed(2));
}
//监听是否赠品
function onSelectIsGift(data){
	// 如果引用单据时，是否赠品不可修改
	if(isGiftFlag){
		$(gridHandel.getFieldTarget('isGift')).combobox('readonly', isGiftFlag);
		return;
	}
    
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;

    var checkObj = {
        skuCode: gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'skuCode'),
        isGift:data.id,
    };
    var arrs = gridHandel.searchDatagridFiled(gridHandel.getSelectRowIndex(),checkObj);
    if(arrs.length==0){
        var targetPrice = gridHandel.getFieldTarget('price');
        if(data.id=="1"){
            $(targetPrice).numberbox('setValue',0);
            gridHandel.setFieldsData({price:0});//单价
            gridHandel.setFieldValue('amount',0);//总金额
            gridHandel.setFieldValue('taxAmount',0);//税额
        }else{
            var oldPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'priceBack');
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
                gridHandel.setFieldsData({price:oldPrice});//单价
            }
        	var priceVal = oldPrice||0;
            var applNum = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'dealNum');
            var oldAmount = parseFloat(priceVal)*parseFloat(applNum);//gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'oldAmount');
            var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
            var oldTaxAmount = (_tempInputTax*(oldAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(2);//gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'oldTaxAmount');
            gridHandel.setFieldValue('amount',oldAmount);//总金额
            gridHandel.setFieldValue('taxAmount',oldTaxAmount);//总金额 
        }
        updateFooter();
    }else{
        var targetIsGift = gridHandel.getFieldTarget('isGift');
        $(targetIsGift).combobox('select', data.id=='1'?'0':'1');
        $_jxc.alert(data.id=='1'?'已存在相同赠品':'已存在相同商品');
    }
}
//合计
function updateFooter(){
    var fields = {largeNum:0,dealNum:0,amount:0,isGift:0, };
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}
//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    if($("#referenceId").val()){
        $_jxc.alert("已选要货单号，不允许添加其他商品");
        return;
    }
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
	loadFilterFlag = true;
    //判定收货机构是否存在
	var sourceBranchId = $("#sourceBranchId").val();
	var targetBranchId = $("#targetBranchId").val();
    if(targetBranchId == ""){
        $_jxc.alert("请先选择收货机构");
        return;
    }
    if($("#referenceId").val()){
        $_jxc.alert("已选要货单号，不允许添加其他商品");
        return;
    }
    var param = {
        type:'DO',
        key:searchKey,
        branchId:sourceBranchId,
        sourceBranchId:sourceBranchId,
        targetBranchId:targetBranchId,
        flag:'0',
        supplierId:""
    }
    new publicGoodsServiceTem(param,function(data){
        if(searchKey){
            $("#gridEditOrder").datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#gridEditOrder").datagrid("acceptChanges");
        }
        selectStockAndPrice(sourceBranchId,data);
    });
}

//二次查询设置值
function setDataValue(data) {
	for(var i in data){
    	var rec = data[i];
    	rec.remark = "";
    	rec.price = rec.distributionPrice;
    }
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var addDefaultData  = gridHandel.addDefault(data,gridDefault);
    var keyNames = {
        id:'skuId',
        disabled:'',
        pricingType:'',
        inputTax:'tax'
    };
    var rows = gFunUpdateKey(addDefaultData,keyNames);
    var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
    $("#gridEditOrder").datagrid("loadData",newRows);

    gridHandel.setLoadFocus();
    setTimeout(function(){
        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        gridHandel.setSelectFieldName("largeNum");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
    },100)
}

//查询价格、库存
function selectStockAndPrice(sourceBranchId,data){
	var targetBranchId = $("#targetBranchId").val();
	var GoodsStockVo = {
			branchId : sourceBranchId,
			stockBranchId : targetBranchId,
			type:'DO',
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

//保存校验
function saveOrder(){
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var isCheckResult = true;
    var num=0;
    $.each(rows,function(i,v){
    	
        if(!v["skuCode"]){
            $_jxc.alert("第"+(i+1)+"行，货号不能为空");
            isCheckResult = false;
            return false;
        };
        if(v["largeNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，箱数必须大于0");
            isCheckResult = false;
            return false;
        }
        if(v["dealNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }
        var _realNum = parseFloat(v["largeNum"] * v["distributionSpec"]).toFixed(4);
        var _largeNum = parseFloat(v["dealNum"]/v["distributionSpec"]).toFixed(4);
        if(parseFloat(_realNum).toFixed(4) != parseFloat(v["dealNum"]).toFixed(4)
            && parseFloat(_largeNum ).toFixed(4) != parseFloat(v["largeNum"]).toFixed(4)){
            $_jxc.alert("第"+(i+1)+"行，箱数和数量的数据异常，请调整");
            isCheckResult = false;
            return false;
        }
        if(v["sourceStock"]==0){
        	
        	num++;
        	console.log(num);
        	        	
        }
        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
        return;
    } 
    if(num==rows.length||num==0){
		saveOrderbtn();
	}
	else{
		$_jxc.confirm("表格存在库存为0的记录是否继续？",function(data){
    		if(data){
    			saveOrderbtn();
    		}	
    	});
	}

}
//保存到后台
function saveOrderbtn(){
	  //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
	// 要活分店id
	 var targetBranchId = $("#targetBranchId").val();
	//发货分店id
    var sourceBranchId = $("#sourceBranchId").val();
    //生效日期
    var validityTime = $("#validityTime").val();
    // 备注
    var remark = $("#remark").val();
    // 引用单号id
    var referenceId = $("#referenceId").val();
    // 引用单号
    var referenceNo = $("#referenceNo").val();
 
    //验证表格数据
    $("#gridEditOrder").datagrid("endEdit", gridHandel.getSelectRowIndex());

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    var footerRows = $("#gridEditOrder").datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["dealNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
    }
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    var saveData = JSON.stringify(rows);
    //var deliverFormListVo = tableArrayFormatter(rows,"deliverFormListVo");
    var reqObj = {
    	formType:'DO',
    	io:'1',
    	sourceBranchId:sourceBranchId,
        targetBranchId:targetBranchId,
        validityTime:validityTime,
        totalNum:totalNum,
        amount:amount,
        remark:remark,
        referenceNo:referenceNo,
        referenceId:referenceId,
        oldReferenceNo : '',
        deliverFormListVo : []
    };
    
    $.each(rows,function(i,data){
    	var temp = {
    		skuId : data.skuId,
    		skuCode : data.skuCode,
    		skuName : data.skuName,
    		barCode : data.barCode,
    		spec : data.spec,
    		rowNo : data.rowNo,
    		applyNum : data.applyNum,
    		dealNum : data.dealNum,
    		largeNum : data.largeNum,
    		price : data.price,
    		priceBack : data.priceBack,
    		amount : data.amount,
    		inputTax : data.inputTax,
    		isGift : data.isGift,
    		remark : data.remark,
    		originPlace : data.originPlace,
    		distributionSpec : data.distributionSpec,
    		salePrice : data.salePrice,
    		saleAmount : data.saleAmount,
    		defectNum : data.defectNum
    	}
    	reqObj.deliverFormListVo[i] = temp;
	});
    
    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/insertDeliverForm",
        contentType:"application/json",
        data:JSON.stringify(reqObj)
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
               location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
            });
        }else{
        	var strResult = "";
        	if (result.dataList) {
            	$.each(result.dataList,function(i,item){
            		strResult += item.goodsName+" ,库存数量： "+item.number+",";
            	})
        	}
            $_jxc.alert(result['message']);
        }
    });
}
//审核
function check(){
	var deliverFormId = $("#formId").val();
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/form/deliverForm/check",
		    	data : {
		    		deliverFormId : $("#formId").val(),
		    		deliverType : 'DO'
		    	}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + deliverFormId;
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

/**
 * 收货机构
 */
function selectBranches(){
	// 如果收货机构为空，发货机构为总部或分公司则可以选择机构
    if (sourceBranchType != '0' && sourceBranchType != '1' && sourceBranchType != '2') {
        return;
    }
    if ($("#referenceNo").val() != '') {
        return;
    }
	var tempSourceBranchType = $("#sourceBranchType").val();
	/*if(tempSourceBranchType != '0' && tempSourceBranchType != '1' && tempSourceBranchType != '2'){
        new publicAgencyService(function(data){
            $("#targetBranchId").val(data.branchesId);
            $("#targetBranchName").val(data.branchName);
            $("#targetBranchType").val(data.type);
            $("#address").html(data.address);
            $("#contacts").html(data.contacts);
            $("#mobile").html(data.mobile);
        },'DZ',$("#sourceBranchId").val());
	} else {*/
        new publicAgencyService(function(data){
            $("#targetBranchId").val(data.branchesId);
            //$("#targetBranchName").val(data.branchName);
            $("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
            $("#targetBranchType").val(data.type);
            $("#address").html(data.address);
            $("#contacts").html(data.contacts);
            $("#mobile").html(data.mobile);
            gridHandel.setLoadData([$.extend({},gridDefault)]);
        },'DO','');
    //}
}

/**
 * 发货机构
 */
function selectSourchBranches(){
    if (sourceBranchType != '0' && sourceBranchType != '1'){
        return;
    }
    var targetBranchType = $("#targetBranchType").val();
    // 如果收货机构为空，发货机构为总部或分公司则可以选择机构
    //if (targetBranchType == '' || targetBranchType == null || targetBranchType == '0' || targetBranchType == '1' || targetBranchType == '2') {
        new publicAgencyService(function(data){
            $("#sourceBranchId").val(data.branchesId);
            //$("#sourceBranchName").val(data.branchName);
            $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
            $("#sourceBranchType").val(data.type);
            gridHandel.setLoadData([$.extend({},gridDefault)]);
        },'DO','','',1);
    //} else {
    //    new publicAgencyService(function(data){
    //        if($("#sourceBranchId").val()!=data.branchesId){
    //            $("#sourceBranchId").val(data.branchesId);
    //            $("#sourceBranchName").val(data.branchName);
    //            $("#sourceBranchType").val(data.type);
    //        }
    //    },'DZ',$("#sourceBranchId").val());
    //}
}

/**
 * 单据选择
 */
var isSelectDeliver = false;    //true导入的是要货单号
function selectDeliver(){
	var referenceId = "";
	var refDeliverType = "";
	var orderStatus = $('input[name="order_status"]:checked').val();
    var param = {
    	formType:orderStatus
    }
	new publicDeliverFormService(param,function(data){
        isSelectDeliver = true;
        isGiftFlag = true;
		referenceId = data.id;
		refDeliverType=data.formType;
		$("#referenceId").val(referenceId);
		$("#referenceNo").val(data.formNo);
		$("#refFormType").val(data.formType);
		$("#formId").val(referenceId);
		$("#formNo").val(data.formNo);
		$("#targetBranchId").val(data.targetBranchId);
		$("#targetBranchName").val(data.targetBranchName);
		$("#sourceBranchId").val(data.sourceBranchId);
		$("#sourceBranchName").val(data.sourceBranchName);
        $("#DAremark").val(data.remark);
		loadLists(referenceId,refDeliverType);
		selectTargetBranchData(data.targetBranchId);
		$('.selecBranchBtn').removeAttr('onclick');
	});
}

// 查询要货机构的资料
function selectTargetBranchData(targetBranchId){
	 $_jxc.ajax({
	        url:contextPath+"/common/branches/selectTargetBranchData",
	        data:{
	        	branchesId : targetBranchId
	        }
	    },function(data){
        	$("#address").html(data.address);
    		$("#contacts").html(data.contacts);
    		$("#mobile").html(data.mobile);
	    });
}

function loadLists(referenceId,refDeliverType){
    $_jxc.ajax({
        url:contextPath+"/form/deliverFormList/importDelverList?deliverType=DO&deliverFormId="+referenceId+"&refDeliverType=" + refDeliverType,
    },function(data){
        var rows = data.list;
        for(var i in rows){
            rows[i]["dealNum"] =  rows[i]["applyNum"]?rows[i]["applyNum"]:rows[i]["dealNum"];
            rows[i]["amount"]  = parseFloat(rows[i]["price"]||0)*parseFloat(rows[i]["dealNum"]||0);
            rows[i]["oldDeliverDealNum"] =  rows[i]["dealNum"];
            var defectNum = parseFloat(rows[i]["sourceStock"]||0)-parseFloat(rows[i]["dealNum"]||0);
            rows[i]["defectNum"] = defectNum<0?-defectNum:0;
            rows[i]["price"] = rows[i]["isGift"]==0?rows[i]["price"]:0;
            rows[i]["amount"] = rows[i]["isGift"]==0?rows[i]["amount"]:0;
        }
        $("#gridEditOrder").datagrid("loadData",rows);
        updateFooter();
    });
}

/**
 * 导入
 */
function importHandel(){
	postelsxDeliver('gridEditOrder','/goods/goodsSelect',$("#sourceBranchId").val(),$("#targetBranchId").val(),"DA");
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
        data[i]["dealNum"]=data[i]["dealNum"]||0;
        
        data[i]["amount"]  = parseFloat(data[i]["price"]||0)*parseFloat(data[i]["dealNum"]||0);
        if(parseInt(data[i]["distributionSpec"])){
        	 data[i]["largeNum"]  = (parseFloat(data[i]["dealNum"]||0)/parseFloat(data[i]["distributionSpec"])).toFixed(4);
        }else{
        	 data[i]["largeNum"]  =  0;
        	 data[i]["distributionSpec"] = 0;
        }
    });
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var argWhere ={skuCode:1};  //验证重复性
    var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,{});

    $("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
    $_jxc.alert("导入成功");
}

//新的导入功能 货号(0)、条码(1)导入
function toImportproduct(type){
    // 要货机构id
    var targetBranchId = $("#targetBranchId").val();
    // 发货机构id
    var sourceBranchId = $("#sourceBranchId").val();
	//判定收货机构是否存在
    if(targetBranchId == ""){
        $_jxc.alert("请先选择收货机构");
        return;
    }
    if($("#referenceId").val()){
        $_jxc.alert("已选要货单号，不允许添加其他商品");
        return;
    }
    var param = {
        url:contextPath+"/form/deliverForm/reportList",
        tempUrl:contextPath+"/form/deliverForm/exportReport",
        type:type,
        targetBranchId : targetBranchId,
        sourceBranchId : sourceBranchId,
        formType:'DO'
    }
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		selectStockAndPriceImport(sourceBranchId,data);
    	}
    },param)
}

//查询价格、库存
function selectStockAndPriceImport(sourceBranchId,data){
	loadFilterFlag = true;
	var targetBranchId = $("#targetBranchId").val();
	var GoodsStockVo = {
			branchId : sourceBranchId,
			stockBranchId : targetBranchId,
			type:'DO',
			fieldName : 'id',
			goodsSkuVo : [],
		}; 
	$.each(data,function(i,val){
		var temp = {
				id : val.skuId,
				largeNum : val.largeNum,
				isGift : val.isGift
		};
		GoodsStockVo.goodsSkuVo[i] = temp;
	});
	$_jxc.ajax({
    	url : contextPath+"/goods/goodsSelect/selectStockAndPriceToDo",
    	data : {
    		goodsStockVo : JSON.stringify(GoodsStockVo)
    	}
    },function(result){
    	updateListData(result);
    });
}

function updateListData(data){
     var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
     var addDefaultData = gridHandel.addDefault(data, {});
     var keyNames = {
         id:'skuId',
         disabled:'',
         pricingType:'',
         //num : 'dealNum'
     };
     var rows = gFunUpdateKey(addDefaultData,keyNames);
     
     for(var i in rows){
         rows[i].remark = "";
         if(rows[i]["isGift"] =="1"){
        	 rows[i]["oldPrice"] = rows[i]["price"];
        	 rows[i]["price"] = 0;
         }
         if(parseInt(rows[i]["distributionSpec"])){
        	 rows[i]["dealNum"] = (parseFloat(rows[i]["largeNum"]||0)*parseFloat(rows[i]["distributionSpec"])).toFixed(4);
             rows[i]["amount"] = parseFloat(rows[i]["distributionPrice"]||0)*parseFloat(rows[i]["dealNum"]||0);
         }else{
        	 rows[i]["largeNum"]  =  0;
        	 rows[i]["distributionSpec"] = 0;
             rows[i]["amount"] = 0;
         }
     }
     var argWhere ={skuCode:1};  //验证重复性
     var isCheck ={isGift:1 };   //只要是赠品就可以重复
     var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
     $("#gridEditOrder").datagrid("loadData",newRows);
     //setTimeout(function(){
     //   gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
     //   gridHandel.setSelectFieldName("largeNum");
     //   gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
    //},100)
}

//返回列表页面
function back(){
	location.href = contextPath+"/form/deliverForm/viewsDO";
}

// 从要货单号直接加载配送出库
function loadFormByFormNoDA() {
    var referenceId = $("#referenceId").val();
    if (referenceId) {
        loadLists(referenceId);
        setData();
    }
}

// 设置值
function setData(){
    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/getSourceBranchAndTargetBranchAndFormNo",
        data:{
            referenceId : $("#referenceId").val()
        }
    },function(data){
        if (data.code == '0') {
            $("#referenceId").val(data.data.id);
            $("#referenceNo").val(data.data.formNo);
            $("#targetBranchId").val(data.data.targetBranchId);
            $("#targetBranchName").val(data.data.targetBranchName);
            $("#sourceBranchId").val(data.data.sourceBranchId);
            $("#sourceBranchName").val(data.data.sourceBranchName);
            $("#address").html(data.data.address);
            $("#contacts").html(data.data.contacts);
            $("#mobile").html(data.data.mobile);
            $("#DAremark").val(data.data.remark);
        }
    });
}

function addDeliverForm(){
	toAddTab("新增出库单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DO");
}
// 导出明细
function exportDetail(){
	var refFormType = $("#refFormType").val();
	var refFormNo = $("#referenceNo").val();
	var length = $("#gridEditOrder").datagrid('getData').total;
	if(!refFormType || length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
    window.location.href=contextPath+'/form/deliverFormList/exportList?formNo='+refFormNo+'&type='+refFormType;
}

// 打印
function printDetail(){
	var refFormType = $("#refFormType").val();
	var length = $("#gridEditOrder").datagrid('getData').total;
	if(!refFormType || length == 0){
		$_jxc.alert("暂无打印数据");
		return;
	}
	
	printChoose(refFormType,'/form/deliverForm/');
}
