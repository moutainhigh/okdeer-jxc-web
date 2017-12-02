/**
 * Created by huangj02 on 2016/8/9.
 */
var isEdit = true;
//过滤price priceBack 标示 
var loadFilterFlag = false;
//是否赠品是否可选择
var isGiftFlag = false;
//供应商采购采购税率
var taxRate=0;
$(function(){
	taxRate=parseFloat($('#taxRate').val())||0;
    var referenceId = $("#refFormNo").val();
    if (referenceId) {	
    	isGiftFlag = true;
    }
    //是否允许改价
    var allowUpdatePrice = $('#allowUpdatePrice').val();
    if('undefined' != typeof(allowUpdatePrice)){
    	isEdit = false;
    }
    initDatagridEditOrder();
    
    var refFormNo = $("#refFormNo").val();
    if(refFormNo){
    	var type = refFormNo.substr(0,2);
    	if(type == 'DI'){
    		$(':radio[name=refFormNoType][value=PI]').attr("checked",false);
    		$(':radio[name=refFormNoType][value=DI]').attr("checked",true);
    	}
    }
    
});
var gridDefault = {
    largeNum:0,
    realNum:0,
    isGift:0,
}
var editRowData = null;
var gridName= "gridEditOrder";
var gridHandel = new GridClass();
function initDatagridEditOrder(){
    gridHandel.setGridName(gridName);
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
//	var formId = $("#formId").val();
    $("#"+gridName).datagrid({
//    	url:contextPath+"/form/purchase/detailList?formId="+formId,
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        width:'100%',
        pageSize:10000,
        view:scrollview,
        columns:[[
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
            {field:'barCode',title:'国际条码',width:'130px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'purchaseSpec',title:'进货规格',width:'90px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    value:0,
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeLargeNum,
                    }
                },
            },
            {field:'receiveNum',hidden:true},
            {field:'realNum',title:'数量',width:'80px',align:'right',
            	formatter:function(value,row){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!value||value==""||value== "0.00"){
                    	row["realNum"] = row["receiveNum"]||0;
                  	  value = row["realNum"];
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    value:'0',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeRealNum,
                    }
                },
            },
            {field:'maxlargeNum',title:'原箱数',width:'80px',align:'right',hidden:true,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'maxRealNum',title:'原数据',width:'80px',align:'right',hidden:true,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
             },
            {field:'priceBack',title:'priceBack',hidden:true},
            {field:'untaxedPrice',title:'不含税单价',width:'80px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return;
            		}
            		if(!row.untaxedPrice){
            			row.untaxedPrice = parseFloat(value||0).toFixed(4);
            		}
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			disabled:true
            		}
            	},
            },
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:isEdit,
                        onChange: onChangePrice,
                    }
                },
            },
            {field:'untaxedAmount',title:'不含税金额',width:'80px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            		}
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			disabled:true
            		}
            	},
            	
            },
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
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
            {field:'isGift',title:'是否赠品',width:'80px',align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    return value=='1'?'是':(value=='0'?'否':'请选择');
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        editable:false,
                        disabled:isGiftFlag,
                        required:true,
                        data: [{
                            "id":'1',
                            "text":"是",
                        },{
                            "id":'0',
                            "text":"否",
                        }],
                        onSelect:onSelectIsGift
                    }
                }},

            {field:'salePrice',title:'销售价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },

            {field:'tax',title:'税率',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    row.tax = value?value:0;
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                options:{
                    min:0,
                    precision:4,
                }
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
                    if(row.isFooter){
                        return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
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
            {field:'goodsCreateDate',title:'生产日期',width:'120px',align:'center',
                formatter : function(value, row,index) {
                    if(row.isFooter){
                        return;
                    }
                    return value?new Date(value).format('yyyy-MM-dd'):"";
                },
                editor:{
                    type:'datebox',
                },
            },
            {field:'goodsExpiryDate',title:'有效期',width:'120px',align:'center',
                formatter : function(value, row,index) {
                    if(row.isFooter){
                        return;
                    }
                    return value?new Date(value).format('yyyy-MM-dd'):"";
                },
                editor:{
                    type:'datebox',
                },
            },
            {field:'remark',title:'备注',width:'200px',align:'left',editor:'textbox'
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
        					obj.price = obj.purchasePrice;
        				}else if(obj.isGift && obj.isGift == '1'){
        					//赠品
        					obj.amount = 0;
        				}
        				obj.priceBack = obj.purchasePrice;
        			}
        		})
        	}
        	return data;
        },
        onLoadSuccess:function(data){
            if((data.rows).length <= 0)return;
            gFunEndLoading();
            if(data.rows.length>0){
                var config = {
                    date:['goodsCreateDate','goodsExpiryDate']
                }
                gFunFormatData(data.rows,config);
            }
            updateFooter();
        }
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(gridName,["price","amount","taxAmount","untaxedPrice","untaxedAmount"])
    }
    getGridData();
}

function getGridData(){
	
	 var formId = $("#formId").val();
	
	$_jxc.ajax({
   	   url:contextPath+"/form/purchase/detailList?formId="+formId,
       async : false
   },function(data){
//           gFunStartLoading();
       	//根据选择的采购单，带出采购单的信息
   	 /*  var keyrealNum = {
   	        realNum:'maxRealNum',
   	    };
   	    
   	    var keylargeNum = {
   	    		largeNum:'maxlargeNum',
       	    };
   	    
   	    var newRows = [];
   	    if(data && data.list.length > 0){
   	     if($("#refFormNo").val()){
   	    	newRows = gFunUpdateKey(data.list,keyrealNum);
   	        newRows = gFunUpdateKey(newRows,keylargeNum);
   	    }else{
   	    	newRows = data.list;
   	    }
   	    	
   	        $("#"+gridName).datagrid("loadData",newRows);
   	    }*/
	   $("#"+gridName).datagrid("loadData",data.list);
   });
}

//限制转换次数
var n = 0;
var m = 0;

var i = 0;
var j = 0;
//监听商品箱数
function onChangeLargeNum(newV,oldV){
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if(m === 1 || i===1){
		m = 0;
		i = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有商品规格,请审查");
        return;
    }
    
    var maxlargeNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'maxlargeNum');
    if(maxlargeNum&&(parseFloat(newV)>parseFloat(maxlargeNum))){
    	i = 1;
        $_jxc.alert("输入商品箱数不能大于原箱数"+maxlargeNum);
        gridHandel.setFieldValue('largeNum',oldV);
        return;
    }

    n = 1;
    //金额 = 规格 * 单价 * 箱数
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    var amount = parseFloat(purchaseSpecValue*priceValue*newV).toFixed(4);
    gridHandel.setFieldValue('amount',amount);
    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
    var realNumVal2 = parseFloat(purchaseSpecValue*newV).toFixed(4);//parseFloat(Math.round(purchaseSpecValue*newV*1000)/1000).toFixed(4);
    if(realNumVal&&Math.abs(realNumVal2-realNumVal)>0.0001){
        gridHandel.setFieldValue('realNum',(purchaseSpecValue*newV).toFixed(4));//数量=商品规格*箱数
    }
    calcUntaxedPriceAndAmount(priceValue,realNumVal2,amount);// 计算不含税单价，金额   

    updateFooter();
}
//监听商品数量
function onChangeRealNum(newV,oldV) {
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if(n === 1 || j === 1){
		n = 0;
		j = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有商品规格,请审查");
        return;
    }
    var maxRealNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'maxRealNum');
    if(maxRealNum&&(parseFloat(newV)>parseFloat(maxRealNum))){
    	j = 1;
        $_jxc.alert("输入商品数量不能大于收货数量"+maxRealNum);
        gridHandel.setFieldValue('realNum',maxRealNum);
        return;
    }
    
    m = 1;
    
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    var amount = parseFloat(priceValue*newV).toFixed(4);
    gridHandel.setFieldValue('amount',amount);                         //金额=数量*单价
    calcUntaxedPriceAndAmount(priceValue,newV,amount);// 计算不含税单价，金额
    var largeNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'largeNum');
    var largeNumVal2 = parseFloat(purchaseSpecValue*newV).toFixed(4);
    if(largeNumVal&&Math.abs(largeNumVal2-largeNumVal)>0.0001){
        var largeNumVal = parseFloat(newV/purchaseSpecValue).toFixed(4);
        gridHandel.setFieldValue('largeNum',largeNumVal);   //箱数=数量/商品规格
    }
    /*gridHandel.setFieldValue('largeNum',(newV/purchaseSpecValue).toFixed(4));   //箱数=数量/商品规格*/
    updateFooter();
}
//监听商品单价
function onChangePrice(newV,oldV) {
    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
    
    //否 赠品 在修改价格的同时 同步priceBack;2.7
    var _initIsGift = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'isGift');
    if((!_tempGift && _initIsGift == '0') || (_tempGift && _tempGift.id == '0')){
    	gridHandel.setFieldsData({priceBack:parseFloat(newV)});
    }
    var amount = parseFloat(realNumVal*newV).toFixed(4);
    gridHandel.setFieldValue('amount',amount);                          //金额=数量*单价
    calcUntaxedPriceAndAmount(newV,realNumVal,amount);// 计算不含税单价，金额
    updateFooter();
}
//监听商品金额
function onChangeAmount(newV,oldV) {
    //获取税率
    var taxVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'tax');
    gridHandel.setFieldValue('taxAmount',(taxVal*(newV/(1+parseFloat(taxVal)))).toFixed(2));
}

//用于判断价格的变化 以便修改piceBack 2.7
var _tempGift;

//监听是否赠品
function onSelectIsGift(data){
	// 如果引用单据时，是否赠品不可修改
	if(isGiftFlag){
		$(gridHandel.getFieldTarget('isGift')).combobox('readonly', isGiftFlag);
		return;
	}

	_tempGift = data;
	
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;

    var checkObj = {
        skuCode: gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'skuCode'),
        isGift:data.id,
    };
    var arrs = gridHandel.searchDatagridFiled(gridHandel.getSelectRowIndex(),checkObj);
    if(arrs.length==0){
        var targetPrice = gridHandel.getFieldTarget('price');
        var untaxedPrice = gridHandel.getFieldTarget('untaxedPrice');
        if(data.id=="1"){
        	gridHandel.setFieldValue('untaxedAmount',0);//不含税金额
            $(untaxedPrice).numberbox('setValue',0);
        	$(targetPrice).numberbox('setValue',0);
            gridHandel.setFieldValue('amount',0);//总金额
            gridHandel.setFieldValue('taxAmount',0);//税额
            $(targetPrice).numberbox('disable');
        }else{
        	if(isEdit == false){
        		$(targetPrice).numberbox('enable');
        	}
            
        	var oldPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'priceBack');
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
            }
        	var priceVal = oldPrice||0;
            var applNum = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
            var oldAmount = parseFloat(priceVal)*parseFloat(applNum);//gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'oldAmount');
            //var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
            //var oldTaxAmount = (_tempInputTax*(oldAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(4);//gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'oldTaxAmount');
            gridHandel.setFieldValue('amount',oldAmount);//总金额
            //gridHandel.setFieldValue('taxAmount',oldTaxAmount);//总金额 
            calcUntaxedPriceAndAmount(priceVal,applNum,oldAmount);// 计算不含税单价，金额
        }
        updateFooter();
    }else{
        var targetIsGift = gridHandel.getFieldTarget('isGift');
        $(targetIsGift).combobox('select', data.id=='1'?'0':'1');
        $_jxc.alert(data.id=='1'?'已存在相同赠品':'已存在相同商品');
    }
}

//计算不含税单价，金额
function calcUntaxedPriceAndAmount(price,realNum,amount){
	var untaxedPrice = parseFloat(price/(1+taxRate)).toFixed(4);// 不含税单价=单价/（1+税率）
	gridHandel.setFieldValue('untaxedPrice',untaxedPrice);
	var untaxedAmount = parseFloat(untaxedPrice*realNum).toFixed(4);
	gridHandel.setFieldValue('untaxedAmount',untaxedAmount);
	gridHandel.setFieldValue('taxAmount',parseFloat(amount-untaxedAmount).toFixed(4));//=金额-不含税金额
}
//合计
function updateFooter(){
    var fields = {largeNum:0,realNum:0,amount:0,taxAmount:0,isGift:0,untaxedAmount:0 };
    var argWhere = {name:'isGift',value:""}
    gridHandel.updateFooter(fields,argWhere);
}
//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    if($("#refFormNo").val()){
        $_jxc.alert("已选采购单号，不允许添加其他商品");
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
	 //判定供应商是否存在
    var supplierId = $("#supplierId").val();
    if(supplierId==""){
        $_jxc.alert("请先选择供应商");
        return;
    }
    
    var branchId = $("#branchId").val();
    if(!branchId){
    	$_jxc.alert("请先选择收货机构");
    	return;
    }
    if($("#refFormNo").val()){
        $_jxc.alert("已选采购单号，不允许添加其他商品");
        return;
    }
    var queryParams = {
        type:'PR',
        key:searchKey,
        isRadio:0,
        'supplierId':$("#supplierId").val(),
        'branchId': $('#branchId').val(),
        sourceBranchId:'',
        targetBranchId:'',
        flag:'0',
    };

    new publicGoodsServiceTem(queryParams,function(data){
        if(data.length==0){
            return;
        }
        if(searchKey){
            $('#'+gridName).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $('#'+gridName).datagrid("acceptChanges");
        }
        for(var i in data){
        	var rec = data[i];
        	rec.remark = "";
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

        $('#'+gridName).datagrid("loadData",newRows);

        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("largeNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
        },100)
    });
}


//保存
function saveItemHandel(){
	var isValid = $("#formAdd").form('validate');
    if(!isValid){
    	$_jxc.alert("请先填写数据!");
        return;
    }
    
    var branchId = $("#branchId").val();
    if(branchId==='0'){
    	$_jxc.alert("退货机构不能选择总部!");
    	return;
    }

    $('#'+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var isCheckResult = true;
    var isChcekPrice = false;
    var isChcekNum = false;
    $.each(rows,function(i,v){
        v["rowNo"] = i+1;
        if(!v["skuName"]){
            $_jxc.alert("第"+(i+1)+"行，货号不正确");
            isCheckResult = false;
            return false;
        };

        var _realNum = parseFloat(v["largeNum"] * v["purchaseSpec"]).toFixed(4);
        var _largeNum = parseFloat(v["realNum"]/v["purchaseSpec"]).toFixed(4);
        if(parseFloat(_realNum).toFixed(4) != parseFloat(v["realNum"]).toFixed(4)
            && parseFloat(_largeNum ).toFixed(4) != parseFloat(v["largeNum"]).toFixed(4)){
            $_jxc.alert("第"+(i+1)+"行，箱数和数量的数据异常，请调整");
            isCheckResult = false;
            return false;
        }

        if(!$_jxc.isStringNull(v['remark']) && v['remark'].length > 20){
            $_jxc.alert("第"+(i+1)+"行，备注不能大于20个字符");
            isCheckResult = false;
            return false;
        }

        if(hasPurchasePrice==true){
            if((!v["price"] || parseFloat(v["price"])<=0)&&v["isGift"]==0){
                isChcekPrice = true;
            }
        }

        //数量判断
        if(parseFloat(v["realNum"])<=0){
        	isChcekNum = true;
        }
    });

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    if(isCheckResult){
        if(isChcekPrice){
            $_jxc.confirm("单价存在为0，重新修改",function(r){
                if (r){
                    return ;
                }else{
                	 saveDataHandel();
                }
            });
        }else{
        	if(isChcekNum){
       		 $_jxc.confirm('存在数量为0的商品,是否继续保存?',function(data){
       			if(data){
       				saveDataHandel();
       		    }
       		 });
         	}else{
         		saveDataHandel();
         	}
        }
    }

}
function saveDataHandel(){
    gFunStartLoading();

    var req = getFromData();
    var id = $("#formId").val();
    $_jxc.ajax({
        url:contextPath+"/form/purchase/updateReturn",
        contentType:'application/json',
        data:req
    },function(result){
//        gFunEndLoading();
        if(result['code'] == 0){
            $_jxc.alert( "操作成功！",function(){
                location.href = contextPath +"/form/purchase/returnEdit?formId=" + id;
            });
        }else{
            $_jxc.alert(result['message']);
        }
    });
}

function getFromData() {
    //供应商
    var supplierId = $("#supplierId").val();
    //收货机构
    var branchId = $("#branchId").val();
    //付款期限
    var paymentTime = $("#paymentTime").val();
    //采购员
    var salesmanId = $("#salesmanId").val();
    //引用单号
    var refFormNo = $("#refFormNo").val();
    //备注
    var remark = $("#remark").val();
    // 旧单号
    var oldRefFormNo = $("#oldRefFormNo").val();
    //计算获取商品总数量和总金额
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
    //总金额
    var untaxedAmount=0;
    var rows = gridHandel.getRowsWhere({skuName:'1'});

    //验证表格数据
    var footerRows = $('#'+gridName).datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["realNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
        untaxedAmount = parseFloat(footerRows[0]["untaxedAmount"]||0.0).toFixed(4);
    }

    var id = $("#formId").val();

    var reqObj = {
        supplierId:supplierId,
        branchId:branchId,
        paymentTime:paymentTime,
        salesmanId:salesmanId,
        refFormNo:refFormNo,
        remark:remark,
        totalNum:totalNum,
        amount:amount,
        untaxedAmount:untaxedAmount,
        taxRate:taxRate,
        id:id,
        oldRefFormNo:oldRefFormNo,
        detailList:rows
    };

    var req = JSON.stringify(reqObj);
    return req;
}

//直接查询商品
function queryGoodsList() {
//    gFunStartLoading();
    var queryParams = {
        formType:'PR',
        key:"",
        isRadio:'',
        'supplierId':$("#supplierId").val(),
        'branchId': $('#branchId').val(),
        sourceBranchId:'',
        targetBranchId:'',
        flag:'0',
        page:1,
        rows:10000
    };
    var url =  contextPath + '/goods/goodsSelect/getGoodsList';
    $_jxc.ajax({
        url:url,
        data:queryParams
    },function(data){
//        gFunEndLoading();
        if(data && data.list.length > 0){
            var addDefaultData  = gridHandel.addDefault(data.list,gridDefault);
            var keyNames = {
                purchasePrice:'price',
                id:'skuId',
                disabled:'',
                pricingType:'',
                inputTax:'tax'
            };
            var rows = gFunUpdateKey(addDefaultData,keyNames);
            $("#"+gridName).datagrid("loadData",rows);
        }else {
//            gFunEndLoading();
            gridHandel.setLoadData([$.extend({},gridDefault)]);
        }
    })
}

function selectSupplier(){
	var param = {
		saleWayNot:"purchase",
		isAllowPurchase:1
	}
	new publicSuppliersService(param, function(data){
		if('NO' == data)return;
        var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
        if( $("#supplierId").val() != "" && data.id != $("#supplierId").val() && nowRows.length > 0){
            $_jxc.confirm('修改供应商后会清空明细，是否要修改？',function(r){
                if(r){
                    $("#supplierId").val(data.id);
                    taxRate=data.inputTaxRate;
                    $("#saleWay").val(data.saleWay);
                    $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
                    // 是否自动加载商品
                    if($("#cascadeGoods").val() == 'true'){
                        queryGoodsList();
                    }
                }
            })
        }else if($("#supplierId").val() != "" && data.id != $("#supplierId").val() && nowRows.length == 0){
            $("#supplierId").val(data.id);
            taxRate=data.inputTaxRate;
            $("#saleWay").val(data.saleWay);
            $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
            // 是否自动加载商品
            if($("#cascadeGoods").val() == 'true'){
                queryGoodsList();
            }
        }
	});
}
function selectOperator(){
	new publicOperatorService(function(data){
		$("#salesmanId").val(data.id);
		$("#operateUserName").val(data.userName);
	});
}
function selectBranch(){
	new publicBranchService(function(data){
        var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
        if(data.branchesId != $("#branchId").val() && nowRows.length > 0){

            $_jxc.confirm('修改机构后会清空明细，是否要修改？',function(r){
                if(r){
                    $("#branchId").val(data.branchesId);
                    $("#branchType").val(data.type);
                    $("#branchName").val("["+data.branchCode+"]"+data.branchName);
                    // 是否自动加载商品
                    if($("#cascadeGoods").val() == 'true'  && $("#supplierId").val() != ""){
                        queryGoodsList();
                    }
                }
            })

        }else  if(data.branchesId != $("#branchId").val() && nowRows.length == 0){
            $("#branchId").val(data.branchesId);
            $("#branchType").val(data.type);
            $("#branchName").val("["+data.branchCode+"]"+data.branchName);
            // 是否自动加载商品
            if($("#cascadeGoods").val() == 'true'  && $("#supplierId").val() != ""){
                queryGoodsList();
            }
        }
	},0);
}

function selectForm(){
	//引用单据类型
	var refFormNoType = $(':radio[name=refFormNoType]:checked').val();
	if(refFormNoType == 'PI'){
        var param = {
        	formType:"PI",
            isAllowRefOverdueForm:0
        }
		new publicPurchaseFormService(param,function(data){
			isGiftFlag = true;
			$("#refFormNo").val(data.formNo);
            //根据选择的收货单，带出收货单的信息
            var keyNames = {
                realNum:'maxRealNum',
            };
            var newRows = gFunUpdateKey(data.list,keyNames);
            $('#'+gridName).datagrid("loadData",newRows);
            //供应商
            $("#supplierId").val(data.form.supplierId);
            $("#supplierName").val(data.form.supplierName);
            //收货机构
            $("#branchId").val(data.form.branchId);
            $("#branchName").val(data.form.branchName);
            //采购员
            $("#salesmanId").val(data.form.salesmanId);
            $("#operateUserName").val(data.form.salesmanName);
		});
	}else if(refFormNoType == 'DI'){
        var param = {
        	formType:'DI',
            targetBranchId:$('#branchId').val()
        }
		new publicDeliverFormService(param,function(data){
			isGiftFlag = true;
			var referenceId = "";
			referenceId = data.id;
			$("#refFormNo").val(data.formNo);
			$("#branchId").val(data.targetBranchId);
			$("#branchName").val(data.targetBranchName);
			loadLists(referenceId);
		});
	}
}

function loadLists(referenceId){
    $('#'+gridName).datagrid("options").method = "post";
    $('#'+gridName).datagrid('options').url = contextPath+"/form/deliverFormList/getDeliverFormLists?deliverFormId="+referenceId + "&deliverType=DI";
    $('#'+gridName).datagrid('load');
}


function check(){
    $('#'+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRows();
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var isCheckResult = true;
    var num=0;
    $.each(rows,function(i,v){
        v["rowNo"] = i+1;
        if(!v["skuCode"]){
            $_jxc.alert("第"+(i+1)+"行，货号不能为空");
            isCheckResult = false;
            return false;
        };
        if(parseFloat(v["realNum"])<=0){
        	num++;
        }
        
    });
    if(!isCheckResult){
        return
    }
    
    if(num==rows.length){
   	 $_jxc.alert("采购商品数量全部为0");
		return
	}else if(parseFloat(num)>0){
		$_jxc.confirm("审核会清除单据中数量为0的商品记录，是否确定审核？",function(data){
	   		if(data){
	   		    checkOrder();
	   		}	
	   	});
	}else{
		 $_jxc.confirm('是否审核通过？',function(data){
			 if(data){
				 checkOrder();
			 }
		 });
	}
}

//审核
function checkOrder(){
	var id = $("#formId").val();
		$_jxc.ajax({
	    	url:contextPath+"/form/purchase/check",
	    	data:{
	    		formId:id,
	    		status:1
	    	}
	    },function(result){
    		
    		if(result['code'] == 0){
    			$_jxc.alert("操作成功！",function(){
    				location.href = contextPath +"/form/purchase/returnEdit?formId=" + id;
    			});
    		}else{
    			$_jxc.alert(result['message']);
    		}
	    });
}

function stop(){
	var id = $("#formId").val();
	$_jxc.confirm('是否终止此单据？',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/purchase/stop",
		    	data:{
		    		formId:id
		    	}
		    },function(result){
	    		
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/form/purchase/returnEdit?formId=" + id;
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

function orderDelete(){
	var id = $("#formId").val();
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/purchase/delete",
		    	data:{
		    		formIds:id
		    	}
		    },function(result){
	    		
	    		if(result['code'] == 0){	
	    			$_jxc.alert("操作成功！",function(){
                        toRefreshIframeDataGrid("form/purchase/returnList","gridOrders");
                        toClose();
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//打印
function printDesign(){
	var id = $("#formId").val();
	var formNo = $("#formNo").val();
     //弹出打印页面
     parent.addTabPrint('PRSheet' + id,formNo+'单据打印',contextPath + '/printdesign/design?page=PRSheet&controller=/form/purchase&template=-1&sheetNo=' + id + '&gridFlag=PRGrid','');
}




function toImportproduct(type){
	loadFilterFlag = true;
    var branchId = $("#branchId").val();
    if(!branchId){
        $_jxc.alert("请先选择收货机构");
        return;
    }
    var param = {
        url:contextPath+"/form/purchase/importList",
        tempUrl:contextPath+"/form/purchase/exportTemp",
        type:type,
        branchId:branchId,
    }
    new publicUploadFileService(function(data){
        updateListData(data);
        
    },param)
}

function updateListData(data){
        $.each(data,function(i,val){
        	data[i]["remark"] = "";
            data[i]["realNum"]=data[i]["realNum"]||0;
            data[i]["largeNum"]  = (parseFloat(data[i]["realNum"]||0)/parseFloat(data[i]["purchaseSpec"])).toFixed(4);
            data[i]["amount"]  = parseFloat(data[i]["purchasePrice"]||0)*parseFloat(data[i]["realNum"]||0);
            var untaxedPrice = parseFloat((data[i]["purchasePrice"]||0)/(1+taxRate)).toFixed(4)
            data[i]["untaxedAmount"]  = untaxedPrice*parseFloat(data[i]["realNum"]||0);
            data[i]["taxRate"] = taxRate;
            data[i]["untaxedPrice"] = untaxedPrice;
        });
	    var keyNames = {
	        id:'skuId',
	        disabled:'',
	        pricingType:'',
	        taxRate:'tax'
	    };
	    var rows = gFunUpdateKey(data,keyNames);
	    var argWhere ={skuCode:1};  //验证重复性
	    var isCheck ={isGift:1 };   //只要是赠品就可以重复
	    var newRows = gridHandel.checkDatagrid(rows,argWhere,isCheck);
        $('#'+gridName).datagrid("loadData",rows);
	}

//模板导出
function exportTemp(){
	var type = $("#temple").attr("value");
	//导入货号
	if(type==0){
		location.href=contextPath+'/form/purchase/exportTemp?type='+type;
	//导入条码
	}else if(type==1){
		location.href=contextPath+'/form/purchase/exportTemp?type='+type;
	}
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
        data[i]["largeNum"]  = (parseFloat(data[i]["realNum"]||0)/data[i]["purchaseSpec"]).toFixed(4);
        
        
    });
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var argWhere ={skuCode:1};  //验证重复性
    var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,{});

    $("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
    $_jxc.alert("导入成功");
}

function receiptAdd(){
	toAddTab("新增采购退货订单",contextPath + "/form/purchase/returnAdd");
}

//返回列表页面
function back(){
	location.href = contextPath+"/form/purchase/returnList";
}