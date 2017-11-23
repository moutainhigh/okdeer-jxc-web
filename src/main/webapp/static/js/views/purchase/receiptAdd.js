/**
 * Created by huangj02 on 2016/8/9.
 */
var isEdit = true;
//是否赠品是否可选择
var isGiftFlag = false;
$(function(){
    var referenceId = $("#refFormId").val();
    if (referenceId) {	
    	isGiftFlag = true;
    }
	//初始化默认条件
    initConditionParams();
    
    //是否允许改价
    var allowUpdatePrice = $('#allowUpdatePrice').val();
    if('undefined' != typeof(allowUpdatePrice)){
    	isEdit = false;
    }
    
    initDatagridEditOrder();
    
    var supplierId = $("#supplierId").val();
    if(supplierId){
    	//设置经营方式
    	setSupplierValue(supplierId);
    }
});

//初始化默认条件
function initConditionParams(){
	$("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
	$("#paymentTime").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}

//设置经营方式
function setSupplierValue(supplierId){
	$_jxc.ajax({
		url : contextPath + "/common/supplier/getById",
		data : {
			id : supplierId
		}
	},function(data){
		$("#saleWay").val(data.supplier.saleWay);
		$("#saleWayName").val(data.supplier.saleWayName);
		
		console.log(data);
	});
}

var gridDefault = {
    largeNum:0,
    realNum:0,
    isGift:0,
}
var editRowData = null;
var gridName = "gridEditOrder";
var gridHandel = new GridClass();
function initDatagridEditOrder(){
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
//    	method:'post',
//        url:contextPath+"/form/purchase/detailList?formId="+formId,
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        width:'100%',
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
            {field:'skuCode',title:'货号',width: '70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'国际条码',width:'130px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'purchaseSpec',title:'进货规格',width:'90px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
            {field:'realNum',title:'数量',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'maxRealNum',title:'原数据',width:'80px',align:'right',hidden:true,
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
            
            
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:true,
                        onChange: onChangeAmount,
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
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                    }
                },
            },

            {field:'tax',title:'税率',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    row.tax = value?value:0;
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                options:{
                    min:0,
                    precision:4,
                }
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
            {field:'bigCategory',title:'一级类别',width:'120px',align:'left',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return;
            		}
            		var str = "";
            		if(row.bigCategoryCode && row.bigCategoryName){
            			str = "["+row.bigCategoryCode + "]" + row.bigCategoryName;
            		}
            		return str;
            	},
            },
            {field:'goodsCreateDate',title:'生产日期',width:'120px',align:'center',
                formatter : function(value, row,index) {
                    if(row.isFooter){
                        return;
                    }
                    return value;
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
                    return value;
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
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });
    gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
        $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
		
    getGridData();
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(gridName,["price","amount","taxAmount"])
    }
}

function getGridData(){
	
	 var formId = $("#formId").val();
	
	$_jxc.ajax({
        url : contextPath+"/form/purchase/getDetailListById?formId="+formId,
        async : false
    },function(data){
    	//根据选择的采购单，带出采购单的信息
	    var keyrealNum = {
	        realNum:'maxRealNum',
	    };
	    
	    var keylargeNum = {
	    		largeNum:'maxlargeNum',
    	    };
	    
	    if(data && data.list.length > 0){
            $.each(data.list,function (index,item) {
                item.largeNum = parseFloat(item.realNum/item.purchaseSpec).toFixed(4);
                // item.amount = parseFloat(item.realNum*item.price).toFixed(4);
            })
	        var newRows = gFunUpdateKey(data.list,keyrealNum);
	        var newRows = gFunUpdateKey(newRows,keylargeNum);
	        $("#gridEditOrder").datagrid("loadData",newRows);
	    }
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
	
    var maxlargeNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'maxlargeNum');
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有商品规格,请审查");
        return;
    }
    

    if(maxlargeNum&&(parseFloat(newV)>parseFloat(maxlargeNum))){
    	i = 1;
        $_jxc.alert("输入商品箱数不能大于原箱数"+maxlargeNum);
        gridHandel.setFieldValue('largeNum',oldV);
        return;
    }
    
    n = 1;

    //金额 = 规格 * 单价 * 箱数
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    gridHandel.setFieldValue('amount',parseFloat(purchaseSpecValue*priceValue*newV).toFixed(4));
    
    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
    var realNumVal2 = parseFloat(purchaseSpecValue*newV).toFixed(4);//parseFloat(Math.round(purchaseSpecValue*newV*1000)/1000).toFixed(4);
    if(realNumVal&&Math.abs(realNumVal2-realNumVal)>0.0001){
        gridHandel.setFieldValue('realNum',(purchaseSpecValue*newV).toFixed(4));//数量=商品规格*箱数
    }

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
	
	var maxRealNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'maxRealNum');
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchaseSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有商品规格,请审查");
        return;
    }
    
  
    if(maxRealNum&&(parseFloat(newV)>parseFloat(maxRealNum))){
    	j = 1;
        $_jxc.alert("输入商品数量不能大于采购数量"+maxRealNum);
        gridHandel.setFieldValue('realNum',oldV);
        return;
    }
    
	m = 1;
	
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    gridHandel.setFieldValue('amount',priceValue*newV);                         //金额=数量*单价

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
    if( (!_tempGift && _initIsGift == '0') || (_tempGift && _tempGift.id == '0')){
    	gridHandel.setFieldsData({oldPrice:parseFloat(newV)});
    }
    
    gridHandel.setFieldValue('amount',realNumVal*newV);                          //金额=数量*单价
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
        if(data.id=="1"){
            var priceVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
            $('#gridEditOrder').datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"] = priceVal;
            $(targetPrice).numberbox('setValue',0);
            $(targetPrice).numberbox('disable');
        }else{
            if(isEdit == false){
        		$(targetPrice).numberbox('enable');
        	}
            var oldPrice =  $('#gridEditOrder').datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"];
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
            }
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
    var fields = {largeNum:0,realNum:0,amount:0,taxAmount:0,isGift:0, };
    var argWhere = {name:'isGift',value:""}
    gridHandel.updateFooter(fields,argWhere);
    getAmount();
}

function getAmount(){
	var list = gridHandel.getFooterRow();
	//console.log('list',list);
	//修改箱数时，同步修改表头单据金额
    $("#amount").val(parseFloat(list[0].amount||0).toFixed(2));
}

//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    if($("#refFormId").val()){
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
    //判定供应商是否存在
    if($("#supplierId").val()==""){
        $_jxc.alert("请先选择供应商");
        return;
    }
  	if($("#refFormId").val()){
  		$_jxc.alert("已选采购单号，不允许添加其他商品");
  		return;
	}
    var queryParams = {
        type:'PI',
        key:searchKey,
        isRadio:0,
        'supplierId':$("#supplierId").val(),
        'branchId': "",
        sourceBranchId:'',
        targetBranchId:'',
        flag:'0',
    };

    new publicGoodsServiceTem(queryParams,function(data){
        if(data.length==0){
            return;
        }
        if(searchKey){
            $("#gridEditOrder").datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#gridEditOrder").datagrid("acceptChanges");
        }
        for(var i in data){
        	var rec = data[i];
        	rec.remark = "";
        }
        var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
        var addDefaultData  = gridHandel.addDefault(data,gridDefault);
        var keyNames = {
            purchasePrice:'price',
            price:'priceBack',
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
    });
}



//保存
function saveItemHandel(){
    var isValid = $("#formAdd").form('validate');
    if(!isValid){
        return;
    }

    $("#gridEditOrder").datagrid("endEdit", gridHandel.getSelectRowIndex());
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
        }
        if(hasPurchasePrice==true) {
            if (parseFloat(v["price"]) <= 0 && v["isGift"] == 0) {
                isChcekPrice = true;
            }
        }
        /** BUG 22017 购模块的单据标准化，保存的时候 允许保存数量为0的商品  ，审核的时候会踢出数量为0的记录。
        //箱数判断  bug 19886
        if(parseFloat(v["largeNum"])<=0){
        	$_jxc.alert("第"+(i+1)+"行，箱数要大于0");
            isCheckResult = false;
            return false;
        }
        //数量判断 bug 19886
        if(parseFloat(v["realNum"])<=0){
        	$_jxc.alert("第"+(i+1)+"行，数量要大于0");
            isCheckResult = false;
            return false;
        }**/

        var _realNum = parseFloat(v["largeNum"] * v["purchaseSpec"]).toFixed(4);
        var _largeNum = parseFloat(v["realNum"]/v["purchaseSpec"]).toFixed(4);
        if(parseFloat(_realNum ).toFixed(4) != parseFloat(v["realNum"]).toFixed(4)
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
        //数量判断
        if(parseFloat(v["realNum"])<=0){
        	isChcekNum = true;
        }
    });


    if (!isValid) {
        return;
    }

    if(isCheckResult){
        if(isChcekPrice){
            $_jxc.confirm("单价存在为0，重新修改",function(r){
                if (r){
                    return ;
                }else{
                    saveDataHandel(rows);
                }
            });
        }else{
        	if(isChcekNum){
         		 $_jxc.confirm('存在数量为0的商品,是否继续保存?',function(data){
         			if(data){
         				saveDataHandel(rows);
         		    }
         		 });
           }else{
        	   saveDataHandel(rows);
           }
        }
    }


}
function saveDataHandel(rows){
    //供应商
    var supplierId = $("#supplierId").val();
    //经营方式
    var saleWay = $("#saleWay").val();

    //收货机构
    var branchId = $("#branchId").val();
    //付款期限
    var paymentTime = $("#paymentTime").val();
    //采购员
    var salesmanId = $("#salesmanId").val();
    //引用单号
    var refFormNo = $("#refFormNo").val();
    //引用单号
    var refFormId = $("#refFormId").val();
    //备注
    var remark = $("#remark").val();

    //TODO 计算获取商品总数量和总金额
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;

    var footerRows = $("#gridEditOrder").datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["realNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
    }

    var reqObj = {
        supplierId:supplierId,
        branchId:branchId,
        paymentTime:paymentTime,
        salesmanId:salesmanId,
        saleWay:saleWay,
        refFormNo:refFormNo,
        refFormId:refFormId,
        remark:remark,
        totalNum:totalNum,
        amount:amount,
        detailList:rows
    };
    
    var req = JSON.stringify(reqObj);

    $_jxc.ajax({
        url:contextPath+"/form/purchase/saveReceipt",
        contentType:'application/json',
        data:req
    },function(result){
        
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
                location.href = contextPath +"/form/purchase/receiptEdit?formId=" + result["formId"];
            });
        }else{
            $_jxc.alert(result['message']);
        }
    });
}
function selectSupplier(){
	new publicSupplierService(function(data){
		console.log(data);
		$("#supplierId").val(data.id);
		$("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
		
		$("#saleWay").val(data.saleWay);
		if(data.saleWay == 'A'){
			$("#saleWayName").val("购销");
		}else if(data.saleWay == 'B'){
			$("#saleWayName").val("代销");
		}else if(data.saleWay == 'C'){
			$("#saleWayName").val("联营");
		}else if(data.saleWay == 'D'){
			$("#saleWayName").val("扣率代销");
		}else{
			$("#saleWayName").val(data.saleWay);
		}
		
	});
}
function selectOperator(){
	new publicOperatorService(function(data){
		$("#salesmanId").val(data.id);
		$("#operateUserName").val(data.userName);
	});
}


function selectPurchaseForm(){
    var param = {
        formType:"PA",
        isAllowRefOverdueForm:0
    }
	new publicPurchaseFormService(param,function(data){
		isGiftFlag = true;
		$("#refFormNo").val(data.form.formNo);

        //防止规格改变，重新计算箱数和金额 bug21406
        $.each(data.list,function (index,item) {
            item.largeNum = parseFloat(item.realNum/item.purchaseSpec).toFixed(4);
            // item.amount = parseFloat(item.realNum*item.price).toFixed(4);
        })

		//根据选择的采购单，带出采购单的信息
        var keyNames = {
            realNum:'maxRealNum',
        };
        var newRows = gFunUpdateKey(data.list,keyNames);
        
	    var keylargeNum = {
	    		largeNum:'maxlargeNum',
    	    };
        var newRows = gFunUpdateKey(newRows,keylargeNum);
        
        $("#gridEditOrder").datagrid("loadData",newRows);
        //供应商
        $("#supplierId").val(data.form.supplierId);
        $("#supplierName").val(data.form.supplierName);
        //经营方式
        $("#saleWay").val(data.form.saleWay);
        $("#saleWayName").val(data.form.saleWayName);
        //收货机构
        $("#branchId").val(data.form.branchId);
        $("#branchName").val(data.form.branchName);
        //采购员
        $("#salesmanId").val(data.form.salesmanId);
        $("#operateUserName").val(data.form.salesmanName);
		$("#refFormId").val(data.form.id);
		$_jxc.ajax({
			url : contextPath + "/common/supplier/getById",
			data : {
				id : data.form.supplierId
			}
		},function(data){
			$("#saleWay").val(data.supplier.saleWay);
			$("#saleWayName").val(data.supplier.saleWayName);
			
			console.log(data);
		});
        
        
	});
}
//返回列表页面
function back(){
	location.href = contextPath+"/form/purchase/receiptList";
}
