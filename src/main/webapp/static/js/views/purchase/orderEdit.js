/**
 * Created by huangj02 on 2016/8/9.
 */
var isEdit = true;
//过滤price priceBack 标示 
var loadFilterFlag = false;

$(function(){
    //是否允许改价
    var allowUpdatePrice = $('#allowUpdatePrice').val();
    if('undefined' != typeof(allowUpdatePrice)){
    	isEdit = false;
    }
    
    initDatagridEditOrder();
    initQueryData();
    $("div").delegate("button","click",function(){
    	$("p").slideToggle();
    });
    
});
var gridDefault = {
    largeNum:0,
    realNum:0,
    isGift:0,
}
var gridName = "gridEditOrder";
var gridHandel = new GridClass();
var editRowData = null;
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
        //title:'普通表单-用键盘操作',
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        pageSize:10000,
        height:'100%',
        width:'100%',
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
            {field:'skuCode',title:'货号',width: '70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'国际条码',width:'130px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'purchaseSpec',title:'进货规格',width:'90px',align:'left'},
            {field:'daySaleNum',title:'周销售量',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field:'monthSaleNum',title:'月销售量',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    
                    if(!value){
                        row["largeNum"] = parseFloat(value||0).toFixed(2);
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
                    
                    if(!value){
                        row["realNum"] = parseFloat(value||0).toFixed(2);
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
            {field:'priceBack',title:'priceBack',hidden:true},
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    if(!row.price){
                    	row.price = parseFloat(value||0).toFixed(4);
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
                //editor:{
                //    type:'numberbox',
                //    options:{
                //        min:0,
                //        precision:4,
                //    }
                //},
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
                formatter:function(value,row){
                    if(row.isFooter){
                        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    row.taxAmount = (row.tax*(row.amount/(1+parseFloat(row.tax)))||0.00).toFixed(2);
                    return  '<b>'+row.taxAmount+'</b>';
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
            {field:'actual',title:'库存',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!row.sourceStock){
                        row.sourceStock = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
        				if(parseFloat(obj.isGift) === 0){
        					//非赠品
        					obj.price = obj.purchasePrice;
        				}else if(parseFloat(obj.isGift) === 1){
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
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(gridName,["price","amount","taxAmount"])
    }

}

function initQueryData(){
    var formId = $("#formId").val();
    $_jxc.ajax({
        url:contextPath+"/form/purchase/detailList?formId="+formId
    },function(result){
        if(result && result.rows.length > 0){
            selectStockAndPrice(result.rows);
        }
    });
}

//查询周销售量 和 月销量
function selectStockAndPrice(data){

    var GoodsStockVo = {
        branchId : "",
        fieldName : 'id',
        stockBranchId : $("#branchId").val(),
        goodsSkuVo : []
    };
    $.each(data,function(i,val){
        var temp = {
            id : val.skuId
        };
        GoodsStockVo.goodsSkuVo[i] = temp;
    });
    $_jxc.ajax({
        url : contextPath+"/goods/goodsSelect/queryAlreadyNum",
        data : {
            goodsStockVo : JSON.stringify(GoodsStockVo)
        }
    },function(result){
        $.each(data,function(i,val){
            $.each(result.data,function(j,obj){
                if(val.skuId==obj.skuId){
                    data[i].alreadyNum = obj.alreadyNum;
                    data[i].daySaleNum = obj.daySaleNum;
                    data[i].monthSaleNum = obj.monthSaleNum;
                }
            })
        })
        $("#"+gridName).datagrid("loadData",data);
    });
}



//限制转换次数
var n = 0;
var m = 0;
//监听商品箱数
function onChangeLargeNum(newV,oldV){
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if("" == newV){
		 $_jxc.alert("商品箱数输入有误");
		  gridHandel.setFieldValue('largeNum',oldV); 
	     return;
	}
	
	if(m > 0){
		m = 0;
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
    
    n++;
    var _temNewNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'tmpLargeNum');
    var temp_new = _temNewNum;
    if(Math.abs(temp_new) > 0 && !oldV){
    	newV = _temNewNum;
    };
    
    var _tempNewRealNum = parseFloat(purchaseSpecValue*newV);
    var newRealNum = parseFloat(_tempNewRealNum).toFixed(4);
    
    //金额 = 规格 * 单价 * 箱数
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    gridHandel.setFieldValue('amount',parseFloat(purchaseSpecValue*priceValue*newV).toFixed(4));
    
    gridHandel.setFieldValue('realNum',newRealNum);//数量=商品规格*箱数
    
//    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
//    var realNumVal2 = parseFloat(purchaseSpecValue*newV).toFixed(4);
//    if(Math.abs(realNumVal2-realNumVal)>0.0001){
//        gridHandel.setFieldValue('realNum',(purchaseSpecValue*newV).toFixed(4));//数量=商品规格*箱数
//    }

    updateFooter();
}
//监听商品数量
function onChangeRealNum(newV,oldV) {
    var _skuName = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuName');
    if(!_skuName)return;
	if("" == newV){
		 $_jxc.alert("商品数量输入有误");
		 gridHandel.setFieldValue('realNum',oldV);
	     return;
	}
	
	if(n > 0){
		n = 0;
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
    
	m++;
    
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');

    gridHandel.setFieldValue('amount',priceValue*newV);                         //金额=数量*单价

    var tempNum = parseFloat(newV)/parseFloat(purchaseSpecValue);
    gridHandel.setFieldValue('largeNum',tempNum.toFixed(4));   //箱数=数量/商品规格
    gridHandel.setFieldsData({tmpLargeNum:tempNum}); // 保留除法值   防止toFixed(4) 四舍五入做乘法时比原值大的问题
    
//    var largeNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'largeNum');
//    var largeNumVal2 = parseFloat(purchaseSpecValue*newV).toFixed(4);
//    if(Math.abs(largeNumVal2-largeNumVal)>0.0001){
//        var largeNumVal = parseFloat(newV/purchaseSpecValue).toFixed(4);
//        gridHandel.setFieldValue('largeNum',largeNumVal);   //箱数=数量/商品规格
//    }
    /*var largeNumVal = parseFloat(newV/purchaseSpecValue);
    gridHandel.setFieldValue('largeNum',largeNumVal);   //箱数=数量/商品规格*/
    
    updateFooter();
}
//监听商品单价
function onChangePrice(newV,oldV) {
    var realNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum');
    
    //否 赠品 在修改价格的同时 同步priceBack;2.7
    var _initIsGift = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'isGift');
    if( (!_tempGift && _initIsGift == '0') || (_tempGift && _tempGift.id == '0')){
    	gridHandel.setFieldsData({priceBack:parseFloat(newV)});
    }
    
    gridHandel.setFieldValue('amount',realNumVal*newV);                          //金额=数量*单价
    updateFooter();
}
//监听商品金额
function onChangeAmount(newV,oldV) {
    //获取税率
    var taxVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'tax');
    var taxAmountVal= (taxVal*(newV/(1+taxVal))||0.0000).toFixed(4)
    gridHandel.setFieldValue('taxAmount',taxAmountVal);
}

//用于判断价格的变化 以便修改piceBack 2.7
var _tempGift;

//监听是否赠品
function onSelectIsGift(data){
	
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
            $(targetPrice).numberbox('setValue',0);
            gridHandel.setFieldValue('amount',0);  
            $(targetPrice).numberbox('disable');
        }else{
            if(isEdit == false){
        		$(targetPrice).numberbox('enable');
        	}
            var oldPrice =  $('#gridEditOrder').datagrid('getRows')[gridHandel.getSelectRowIndex()]["priceBack"];
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
            }
            var priceVal = oldPrice||0;
            var applNum = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum')||0;
            var oldAmount = parseFloat(priceVal)*parseFloat(applNum);
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
    var fields = {largeNum:0,realNum:0,amount:0,taxAmount:0,isGift:0, };
    var argWhere = {name:'isGift',value:""}
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

    var queryParams = {
        type:'PA',
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
            id:'skuId',
            disabled:'',
            pricingType:'',
            largeNum:'tmpLargeNum',
            inputTax:'tax'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1 };   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
        $("#gridEditOrder").datagrid("loadData",newRows);
        //gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("largeNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
        },100)
        
    });
}

//保存
function saveItemHandel(){

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
        };
        
        //箱数判断  bug 19886
        if(parseFloat(v["largeNum"])<=0){
        	$_jxc.alert("第"+(i+1)+"行，箱数要大于0");
            isCheckResult = false;
            isChcekNum = true;
            return false;
        }
        //数量判断 bug 19886
        if(parseFloat(v["realNum"])<=0){
        	$_jxc.alert("第"+(i+1)+"行，数量要大于0");
            isCheckResult = false;
            isChcekNum = true;
            return false;
        }
        
        if(hasPurchasePrice==true) {
            if(parseFloat(v["price"])<=0&&v["isGift"]==0){
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
        if(isChcekPrice && hasPurchasePrice){
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
//    gFunStartLoading();
    //供应商
    var supplierId = $("#supplierId").val();
    //收货机构
    var branchId = $("#branchId").val();
    //交货期限
    var deliverTime = $("#deliverTime").val();
    //采购员
    var salesmanId = $("#salesmanId").val();
    var id = $("#formId").val();
    //备注
    var remark = $("#remark").val();

    //计算获取商品总数量和总金额
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
        id:id,
        supplierId:supplierId,
        branchId:branchId,
        deliverTime:deliverTime,
        salesmanId:salesmanId,
        totalNum:totalNum,
        amount:amount,
        remark:remark,
        detailList:rows
    };
    
    var req = JSON.stringify(reqObj);

    $_jxc.ajax({
        url:contextPath+"/form/purchase/updateOrder",
        contentType:'application/json',
        data:req
    },function(result){
//            gFunEndLoading();
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
            	location.href = contextPath +"/form/purchase/orderEdit?formId=" + id;
            });
        }else{
        	new publicErrorDialog({
        		"title":"保存失败",
        		"error":result['message']
        	});
        }
    });
}
function check(){
    $("#gridEditOrder").datagrid("endEdit", gridHandel.getSelectRowIndex());
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
		$_jxc.confirm("是否清除单据中数量为0的商品记录?",function(data){
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

//审核采购单
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
                 location.href = contextPath +"/form/purchase/orderEdit?formId=" + id;
             });
         }else{
         	new publicErrorDialog({
        		"title":"审核失败",
        		"error":result['message']
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
                        toRefreshIframeDataGrid("form/purchase/orderList","gridOrders");
                        toClose();
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//直接查询商品
function queryGoodsList() {
    var queryParams = {
        formType:'PA',
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
//        gFunStartLoading();
        if(data && data.rows.length > 0){
            var addDefaultData  = gridHandel.addDefault(data.rows,gridDefault);
            var keyNames = {
                purchasePrice:'price',
                id:'skuId',
                disabled:'',
                pricingType:'',
                largeNum:'tmpLargeNum',
                inputTax:'tax'
            };
            var rows = gFunUpdateKey(addDefaultData,keyNames);
            $("#"+gridName).datagrid("loadData",rows);
        }else {
            gFunEndLoading();
            gridHandel.setLoadData([$.extend({},gridDefault)]);
        }
    })
}

//选择供应商
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
                    $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
                    gridHandel.setLoadData([$.extend({},gridDefault)]);
                    // 是否自动加载商品
                    if($("#cascadeGoods").val() == 'true'){
                        queryGoodsList();
                    }
                }
            })
        }else if($("#supplierId").val() != "" && data.id != $("#supplierId").val() && nowRows.length == 0){
            $("#supplierId").val(data.id);
            $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
            gridHandel.setLoadData([$.extend({},gridDefault)]);
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
        if( $("#branchId").val() != "" && data.branchesId != $("#branchId").val() && nowRows.length > 0){

            $_jxc.confirm('修改机构后会清空明细，是否要修改？',function(r){
                if(r){
                    $("#branchId").val(data.branchesId);
                    $("#branchName").val("["+data.branchCode+"]"+data.branchName);
                    gridHandel.setLoadData([$.extend({},gridDefault)]);
                    // 是否自动加载商品
                    if($("#cascadeGoods").val() == 'true'){
                        queryGoodsList();
                    }
                }
            })

        }else  if( $("#branchId").val() != "" && data.branchesId != $("#branchId").val() && nowRows.length == 0){
            $("#branchId").val(data.branchesId);
            $("#branchName").val("["+data.branchCode+"]"+data.branchName);
            gridHandel.setLoadData([$.extend({},gridDefault)]);
            // 是否自动加载商品
            if($("#cascadeGoods").val() == 'true'){
                queryGoodsList();
            }
        }
	},0);
}

//打印
function printDesign(){
	var id = $("#formId").val();
	var formNo = $("#formNo").val();
     //弹出打印页面
     parent.addTabPrint('PASheet' + id,formNo+'单据打印',contextPath + '/printdesign/design?page=PASheet&controller=/form/purchase&template=-1&sheetNo=' + id + '&gridFlag=PAGrid','');
}


function back(){
	location.href = contextPath+"/form/purchase/orderList";
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
        
        if(data instanceof Array && data.length > 0){
        	data = selectStockAndPrice(data);
            updateListData(data);
    	}
        
    },param)
}

function updateListData(data){
	   // var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
	    //var addDefaultData  = gridHandel.addDefault(data,gridDefault);
        $.each(data,function(i,val){
        	data[i]["remark"] = "";
            data[i]["realNum"]=data[i]["realNum"]||0;
            data[i]["largeNum"]  = (parseFloat(data[i]["realNum"]||0)/parseFloat(data[i]["purchaseSpec"])).toFixed(4);
            data[i]["amount"]  = parseFloat(data[i]["purchasePrice"]||0)*parseFloat(data[i]["realNum"]||0);
        });
	    var keyNames = {
	        id:'skuId',
	        disabled:'',
	        pricingType:'',
	        largeNum:'tmpLargeNum',
	        inputTax:'tax'
	    };
	    var rows = gFunUpdateKey(data,keyNames);

	    var argWhere ={skuCode:1};  //验证重复性
	    var isCheck ={isGift:1 };   //只要是赠品就可以重复
	    var newRows = gridHandel.checkDatagrid(rows,argWhere,isCheck);

	    $("#gridEditOrder").datagrid("loadData",rows);
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

function orderAdd(){
	toAddTab("新增采购订单",contextPath + "/form/purchase/orderAdd");
}


function exportDetail(){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/form/purchase/exportSheet?page=PASheet&sheetNo='+formId;
}