
var targetBranchTypeTemp = "";
var branchId = '';	
//过滤price priceBack 标示 
var loadFilterFlag = false;

var gridDefault = {
	    applyNum:0,
	    largeNum:0,
	    isGift:0,
	}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "gridRequireOrder";
var deliverStatus = "add";
var editRowData = null;

$(function(){
    deliverStatus = $('#deliverStatus').val();
	if(deliverStatus === 'add'){
        $("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
        //用于新旧数据比较
        oldData = {
            targetBranchId:$("#targetBranchId").val(), // 要活分店id
            sourceBranchId:$("#sourceBranchId").val(), //发货分店id
            remark:$("#remark").val()||'',                  // 备注
            formNo:$("#formNo").val()||'',                 // 单号
        }
        initDatagridRequireOrder();
        targetBranchTypeTemp = $("#targetBranchType").val();
	}else if(deliverStatus === 'edit'){
		oldData = {
	        targetBranchId:$("#targetBranchId").val(), // 要活分店id
	        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
	        remark:$("#remark").val(),                  // 备注
	        formNo:$("#formNo").val(),                 // 单号
	    }
        var formId = $("#formId").val();
        url = contextPath+"/form/deliverFormList/getDeliverFormListsById";
        $_jxc.ajax({
                type:"POST",
                url:url,
                data:{
                    deliverFormId : formId,
                    deliverType : 'DY'
                }
            },function(result){
                selectStockAndPrice(result.list);
            })
		initDatagridRequireOrder();
	    $("div").delegate("button","click",function(){
	    	$("p").slideToggle();
	    });
	    
	}
})

$(document).on('click','input[name="numDeal"]',function(){
	specialRows($(this).val());
});

//批量设置
function specialRows(val){
	// 获取选中行的Index的值
	var rowIndex = -1;
	var newData = $("#"+gridName).datagrid("getRows");
	for(var i = 0;i < newData.length;i++){
		var item = newData[i];
		//数量 重新归零
        if(val == '1'){ 
        	item.applyNum = 0;
        	item.largeNum = 0;
        	item.amount = 0;
        	item.untaxedAmount = 0;
        	item.taxAmount = 0;
        }
        //建议订货数量 只对建议数量大于o的商品设置
        if(val == '0' && parseFloat(item.suggestNum) > 0){ 
        	item.applyNum = item.suggestNum;
        	item.tmpLargeNum = parseFloat(item.applyNum)/parseFloat(item.distributionSpec);
        	item.largeNum = (item.tmpLargeNum).toFixed(4); 
        	item.amount = (parseFloat(item.applyNum)*parseFloat(item.price)).toFixed(4); //金额： 数量*价格
        	item.untaxedAmount = parseFloat(item.applyNum*item.untaxedPrice).toFixed(4); //金额： 数量*价格
        	item.taxAmount = parseFloat(item.amount - item.untaxedAmount).toFixed(4);
        }
	}
	gridHandel.setLoadData(newData);
}

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

var gridHandel = new GridClass();
function initDatagridRequireOrder(){
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
            	branchId = $("#sourceBranchId").val();
                selectGoods(arg);
            }
        },
    })

    $("#"+gridName).datagrid({
        method:'post',
    	//url:url,
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
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
			    }
			},
            {field:'rowNo',hidden:'true'},
            {field:'skuCode',title:'货号',width: '70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'130px',align:'left',
                formatter:function(value,row,index){
                    var str = "";
                    if(row.isFooter){
                        //str ='<div id="spanMinAmount" class="ub ub-pc" style="color:red;">起订金额：'+ $("#minAmount").val() +'</div> '
                    }else{
                        str = value;
                    }
                    return str;
                }
            },
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            /*{field:'twoCategoryCode',title:'类别编号',width:'90px',align:'left'},
            {field:'twoCategoryName',title:'类别名称',width:'90px',align:'left'},*/
            {field:'distributionSpec',title:'配送规格',width:'80px',align:'left'},

            {field: 'daySaleNum', title: '周销售量', width: '80px', align: 'right',
                formatter: function (value, row, index) {
                    if (row.isFooter) {
                        return
                    }
                    if (!row.daySaleNum) {
                        row.daySaleNum = parseFloat(value || 0).toFixed(2);
                    }
                    return '<b>' + parseFloat(value || 0).toFixed(2) + '</b>';
                }
            },
            {field: 'monthSaleNum', title: '月销售量', width: '80px', align: 'right',
                formatter: function (value, row, index) {
                    if (row.isFooter) {
                        return
                    }
                    if (!row.daySaleNum) {
                        row.daySaleNum = parseFloat(value || 0).toFixed(2);
                    }
                    return '<b>' + parseFloat(value || 0).toFixed(2) + '</b>';
                }
            },

            {field:'suggestNum',title:'建议订货数量',width:'80px',align:'right',hidden:!$('#suggestBtn').attr('data-role')?true:false,
            	formatter:function(value,row,index){
            		if(!value){
            			row['suggestNum'] = 0;
            		}
            		//return value||0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	}
            },
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!value){
                        row["largeNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeLargeNum,
                    }
                }
            },
            {field:'applyNum',title:'数量',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!value){
                        row["applyNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeRealNum,
                    }
                }
            },
            {field:'untaxedPrice',title:'不含税单价',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return
            		}
            		if(!row.untaxedPrice){
            			row.untaxedPrice = parseFloat(value||0).toFixed(4);
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
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!row.price){
                    	row.price = parseFloat(value||0).toFixed(4);
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
            {field:'untaxedAmount',title:'不含税金额',width:'100px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            		}
            		
            		if(!row.untaxedAmount){
            			row.untaxedAmount = parseFloat(value||0).toFixed(4);
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
            	}
            },
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!row.amount){
                    	row.amount = parseFloat(value||0).toFixed(4);
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
                }
            },
            {field:'isGift',title:'赠送',width:'80px',align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    row.isGift = row.isGift?row.isGift:0;
                    return value=='1'?'是': (value=='0'?'否':'请选择');
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        editable:false,
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
            {field:'inputTax',title:'税率',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
	                options:{
	                    min:0,
	                    disabled:true,
	                    precision:4,
	                }
                }
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
            		}
            		return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
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
            {field: 'targetStock', title: '店铺库存', width: '80px', align: 'right',
            	formatter: function (value, row, index) {
            		if (row.isFooter) {
            			return
            		}
            		if (!row.sourceStock) {
            			row.sourceStock = parseFloat(value || 0).toFixed(2);
            		}
            		return '<b>' + parseFloat(value || 0).toFixed(2) + '</b>';
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
        loadFilter:function(data){
        	//显示现实数据转换 后台不返回 rows 节点结构啦 2.7
        	data = $_jxc.gridLoadFilter(data);
        	
        	if(loadFilterFlag && data && data.length > 0 ){
        		loadFilterFlag = false;
        		data.forEach(function(obj,index){
        			//编辑后 可以再次选择商品 新选的 priceBack为空
        			if(!obj.priceBack){
        				obj.price = obj.distributionPrice;
        				obj.priceBack = obj.distributionPrice;
        				obj.untaxedPrice = obj.untaxedPrice;
        				obj.untaxedPriceBack = obj.untaxedPrice;
        			}
        		})
        	}
        	return data;
        },
        onLoadSuccess:function(data){
        	if(deliverStatus==='edit'){
                if(!oldData["grid"]){
                    oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                        return $.extend(true,{},obj);//返回对象的深拷贝
                    });
                 }
        	}
            gridHandel.setDatagridHeader("center");
            updateFooter();
        },
    });
    
    if(deliverStatus==='add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
    	 if(!oldData["grid"]){
          	oldData["grid"] = gridHandel.getRows();
      	 }
    }

    var param = {
        distributionPrice:["price","amount","taxAmount","untaxedAmount","untaxedPrice"],
    }
    priceGrantUtil.grantPrice(gridName,param);

}

//限制转换次数
var n = 0;
var m = 0;
//监听商品箱数
function onChangeLargeNum(newV,oldV){
	//if(!oldV)return;
	if("" == newV){
		m = 2;
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
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }

    var _temNewNum = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'tmpLargeNum');
    var temp_new = newV;
    if(Math.abs(temp_new) > 0 && !oldV){
    	newV = _temNewNum;
    };
    
    var _tempNewRealNum = parseFloat(purchaseSpecValue*newV);
    var newRealNum = parseFloat(_tempNewRealNum).toFixed(4);
    
    n = 1;
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    var _tempAmount = parseFloat(priceValue*_tempNewRealNum).toFixed(4);
    gridHandel.setFieldValue('amount',_tempAmount);//金额=数量*单价
    
    //var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    //var _taxAmountVal = (_tempInputTax*(_tempAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(4);
    //gridHandel.setFieldValue('taxAmount',_taxAmountVal);//税额 = 金额/(1+税率)*税率
    var untaxedPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'untaxedPrice');
    calcUntaxedPriceAndAmount(newRealNum,_tempAmount,untaxedPrice);// 计算不含税单价，金额  
    gridHandel.setFieldValue('applyNum',newRealNum); //数量=箱数*商品规格
    
    
    updateFooter();
    
}
//监听商品数量
function onChangeRealNum(newV,oldV) {
	//if(!oldV)return;
	if("" == newV){
		 n= 2;
		 $_jxc.alert("商品数量输入有误");
		 gridHandel.setFieldValue('applyNum',oldV);
	     return;
	}
	
	var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
	
	if(n > 0){
		
		var _tempLargeNum = parseFloat(newV)/parseFloat(purchaseSpecValue);
		gridHandel.setFieldsData({tmpLargeNum:_tempLargeNum}); // 保留除法值   防止toFixed(4) 四舍五入做乘法时比原值大的问题
		
		n = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    
    if(!purchaseSpecValue){
        $_jxc.alert("没有配送规格,请审查");
        return;
    }
    var tempNum = parseFloat(newV).toFixed(4)/parseFloat(purchaseSpecValue).toFixed(4);
    if(parseInt(tempNum) != tempNum){
        $_jxc.alert("输入的数量必须是商品规格("+purchaseSpecValue+")的整数倍");
        //bug 20079 要货申请选择商品规格大于1的商品，先输入数量为1，然后再输入箱数为1后，不会自动计算数量  
        errroPur = true;
        
        var _largeNum = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'largeNum');
        if(_largeNum != '0'){
        	errroPurL = true;
        	gridHandel.setFieldValue('largeNum',0.0000);
        }
        gridHandel.setFieldValue('applyNum',0.0000);
        gridHandel.setSelectFieldName("applyNum");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('applyNum'));        return;
    }
    m=1;
    
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    var _tempAmount = parseFloat(priceValue*newV).toFixed(4);
    gridHandel.setFieldValue('amount',_tempAmount);   
    //金额=数量*单价
    //var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    // var _taxAmountVal = (_tempInputTax*(_tempAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(4);
    //gridHandel.setFieldValue('taxAmount',_taxAmountVal);//税额 = 金额/(1+税率)*税率
    var untaxedPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'untaxedPrice');
    calcUntaxedPriceAndAmount(newV,_tempAmount,untaxedPrice);// 计算不含税单价，金额  
    
    var tempNum = parseFloat(newV)/parseFloat(purchaseSpecValue);
    gridHandel.setFieldValue('largeNum',tempNum.toFixed(4));   //箱数=数量/商品规格
    gridHandel.setFieldsData({tmpLargeNum:tempNum}); // 保留除法值   防止toFixed(4) 四舍五入做乘法时比原值大的问题

    updateFooter();
}

//监听是否赠品
function onSelectIsGift(data){
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
            $(targetPrice).numberbox('setValue',0);
            gridHandel.setFieldsData({price:0});//单价
            gridHandel.setFieldValue('amount',0);//总金额
            gridHandel.setFieldValue('taxAmount',0);//税额
            $(untaxedPrice).numberbox('setValue',0);;//不含税单价
            gridHandel.setFieldsData({untaxedPrice:0});//单价
            gridHandel.setFieldValue('untaxedAmount',0);//不含税额
        }else{
        	var oldPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'priceBack');
        	var oldUntaxedPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'untaxedPriceBack');
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
                gridHandel.setFieldsData({price:oldPrice});//单价
                $(untaxedPrice).numberbox('setValue',oldUntaxedPrice);
                gridHandel.setFieldsData({untaxedPrice:oldUntaxedPrice});//单价
            }
        	var priceVal = oldPrice||0;
            var applNum = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'applyNum');
            var oldAmount = parseFloat(priceVal*applNum).toFixed(4);//gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'oldAmount');
            //var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
            //var oldTaxAmount = (_tempInputTax*(oldAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(4);//gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'oldTaxAmount');
            gridHandel.setFieldValue('amount',oldAmount);//总金额
            //gridHandel.setFieldValue('taxAmount',oldTaxAmount);//总金额
            calcUntaxedPriceAndAmount(applNum,oldAmount,oldUntaxedPrice);// 计算不含税单价，金额   
        }
        updateFooter();
    }else{
        var targetIsGift = gridHandel.getFieldTarget('isGift');
        $(targetIsGift).combobox('select', data.id=='1'?'0':'1');
        $_jxc.alert(data.id=='1'?'已存在相同赠品':'已存在相同商品');
    }
}

//计算不含税单价，金额
function calcUntaxedPriceAndAmount(realNum,amount,untaxedPrice){
	var untaxedAmount = parseFloat(untaxedPrice*realNum).toFixed(4);
	gridHandel.setFieldValue('untaxedAmount',untaxedAmount);
	gridHandel.setFieldValue('taxAmount',parseFloat(amount-untaxedAmount).toFixed(4));//=金额-不含税金额
}
//合计
function updateFooter(){
    var fields = {largeNum:0,applyNum:0,amount:0,isGift:0,untaxedAmount:0,taxAmount:0 };
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
	loadFilterFlag = true;
	var sourceBranchId = $("#sourceBranchId").val();
	var targetBranchId = $("#targetBranchId").val();
    //判定发货分店是否存在
    if($("#sourceBranchId").val()==""){
        $_jxc.alert("请先选择发货机构");
        return;
    }
    
    var param = {
    		type:'DY',
    		key:searchKey,
    		isRadio:'',
    		sourceBranchId:sourceBranchId,
    		targetBranchId:targetBranchId,
    		branchId:branchId,
    		supplierId:'',
    		flag:'0',
    }

    new publicGoodsServiceTem(param,function(data){
    	if(searchKey){
            $('#'+gridName).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $('#'+gridName).datagrid("acceptChanges");
	    }
    	selectStockAndPrice(data);
    });
    branchId = '';
}

//二次查询设置值
function setDataValue(data,fromClick) {
		if(deliverStatus === 'add'){
			for(var i in data){
				var rec = data[i];
				rec.remark = "";
				rec.amount = 0;
				//rec.untaxedAmount = 0;
				//rec.taxAmount = 0;
			}
		}
        var nowRows = gridHandel.getRowsWhere({skuName:'1'});
        var addDefaultData = data;
        if(deliverStatus === 'add'){
            addDefaultData = gridHandel.addDefault(data,gridDefault);
        }
        var keyNames = {
            id:'skuId',
            disabled:'',
            pricingType:'',
            taxRate:'inputTax',
            largeNum:'tmpLargeNum',
        };
        
        /*if(deliverStatus === 'add'){
        	keyNames.distributionPrice = 'price';
        	keyNames.price = 'priceBack';
        }*/
        
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        //建议订货数量 没有此业务 请删除该逻辑
        var ifReset= [];
        if(fromClick == 'suggestSelectGoods'){ //点击建议订货数量
        	ifReset = ['suggestNum'];  //对于重复数据  要更新的字段
        }
        var isCheck ={isGift:1};   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck,ifReset);
        
        //$("#"+gridName).datagrid({data:newRows});
        gridHandel.setLoadData(newRows);
        if(deliverStatus === 'add') {
            gridHandel.setLoadFocus();
            setTimeout(function () {
                gridHandel.setBeginRow(gridHandel.getSelectRowIndex() || 0);
                gridHandel.setSelectFieldName("largeNum");
                gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
            }, 100)
        }
}

//查询价格、库存
function selectStockAndPrice(data,fromClick){
	//setDataValue(data);
	var GoodsStockVo = {
			branchId : $("#sourceBranchId").val(),
            fieldName : 'id',
            stockBranchId : $("#targetBranchId").val(),
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
    	type : "POST",
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
		setDataValue(data,fromClick);
    });
}

//保存
function saveOrder(){
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
    var untaxedAmount = 0;
	// 要活分店id
	var targetBranchId = $("#targetBranchId").val();
	//发货分店id
    var sourceBranchId = $("#sourceBranchId").val();
    //生效日期
    var validityTime = $("#validityTime").val();
    // 备注
    var remark = $("#remark").val();
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());

    var footerRows = $("#"+gridName).datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["applyNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
        untaxedAmount = parseFloat(footerRows[0]["untaxedAmount"]||0.0).toFixed(4);
    }

    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
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
        if(v["largeNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，箱数必须大于0");
            isCheckResult = false;
            return false;
        }
        if(v["applyNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }

        var _realNum = parseFloat(v["largeNum"] * v["distributionSpec"]).toFixed(4);
        var _largeNum = parseFloat(v["applyNum"]/v["distributionSpec"]).toFixed(4);
        if(parseFloat(_realNum).toFixed(4) != parseFloat(v["applyNum"]).toFixed(4)
            && parseFloat(_largeNum ).toFixed(4) != parseFloat(v["largeNum"]).toFixed(4)){
            $_jxc.alert("第"+(i+1)+"行，箱数和数量的数据异常，请调整");
            isCheckResult = false;
            return false;
        }

        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
        return;
    }

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    var saveData = JSON.stringify(rows);
    var reqObj = {
    	formType:'DY',
    	sourceBranchId:sourceBranchId,
        targetBranchId:targetBranchId,
        validityTime:validityTime,
        totalNum:totalNum,
        amount:amount,
        untaxedAmount:untaxedAmount,
        remark:remark,
        branchCode:branchCode,
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
    		largeNum : data.largeNum,
    		price : data.price,
    		priceBack : data.priceBack,
    		amount : data.amount,
    		untaxedPrice : data.untaxedPrice,
    		untaxedPriceBack : data.untaxedPriceBack,
    		untaxedAmount : data.untaxedAmount,
    		inputTax : data.inputTax,
    		isGift : data.isGift,
    		remark : data.remark,
    		originPlace : data.originPlace,
    		distributionSpec : data.distributionSpec
    	}
    	reqObj.deliverFormListVo[i] = temp;
	});
//    gFunStartLoading();
    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/insertDeliverForm",
        contentType:"application/json",
        data:JSON.stringify(reqObj)
    },function(result){
//       	 gFunEndLoading();
           if(result['code'] == 0){
               $_jxc.alert("操作成功！",function(){
                   location.href = contextPath +"/form/deliverForm/deliverEdit?deliverType=DY&deliverFormId=" + result["formId"];
               });
           }else{
               var strResult = "";
               if (result.dataList) {
                   $.each(result.dataList,function(i,item){
                       strResult += item.goodsName+" ,库存数量： "+item.number+",";
                   })
               }
               //$_jxc.alert(result['message'] +","+strResult);
           	new publicErrorDialog({
                   width:380,
                   height:220,
           		"title":"保存失败",
           		"error":result['message']+strResult
           	});
           }
    });
}


//修改订单
function updateOrder(){
	var deliverFormId= $("#formId").val();
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
    //总金额
    var untaxedAmount=0;
	// 要活分店id
    var targetBranchId = $("#targetBranchId").val();
	//发货分店id
    var sourceBranchId = $("#sourceBranchId").val();
    //生效日期
    var validityTime = $("#validityTime").val();
    // 备注
    var remark = $("#remark").val();
    // 单号
    var formNo = $("#formNo").val();
    //验证表格数据
    $("#"+gridHandel.getGridName()).datagrid("endEdit", gridHandel.getSelectRowIndex());

    var footerRows = $("#"+gridHandel.getGridName()).datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["applyNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
        untaxedAmount = parseFloat(footerRows[0]["untaxedAmount"]||0.0).toFixed(4);
    }

    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
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
        if(v["largeNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，箱数必须大于0");
            isCheckResult = false;
            return false;
        }
        if(v["applyNum"]<=0){
            $_jxc.alert("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }
        var _realNum = parseFloat(v["largeNum"] * v["distributionSpec"]).toFixed(4);
        var _largeNum = parseFloat(v["applyNum"]/v["distributionSpec"]).toFixed(4);
        if(parseFloat(_realNum).toFixed(4) != parseFloat(v["applyNum"]).toFixed(4)
            && parseFloat(_largeNum ).toFixed(4) != parseFloat(v["largeNum"]).toFixed(4)){
            $_jxc.alert("第"+(i+1)+"行，箱数和数量的数据异常，请调整");
            isCheckResult = false;
            return false;
        }
        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
        return;
    }

    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    var saveData = JSON.stringify(rows);
    //var deliverFormListVo = tableArrayFormatter(rows,"deliverFormListVo");
    var reqObj = {
    	sourceBranchId : sourceBranchId,
    	deliverFormId : $("#formId").val(),
        targetBranchId : targetBranchId,
        validityTime : validityTime,
        totalNum : totalNum,
        amount : amount,
        untaxedAmount : untaxedAmount,
        remark : remark,
        formType : "DY",
        formNo : formNo,
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
    		largeNum : data.largeNum,
    		price : data.price,
    		priceBack : data.priceBack,
    		amount : data.amount,
    		untaxedPrice : data.untaxedPrice,
			untaxedAmount : data.untaxedAmount,
			untaxedPriceBack : data.untaxedPriceBack,
    		inputTax : data.inputTax,
    		isGift : data.isGift,
    		remark : data.remark,
    		originPlace : data.originPlace,
    		distributionSpec : data.distributionSpec,
    		formId : data.formId
    	}
    	reqObj.deliverFormListVo[i] = temp;
	});
    
//    gFunStartLoading();
    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/updateDeliverForm",
        contentType:"application/json",
        data:JSON.stringify(reqObj)
    },function(result){
//        gFunEndLoading();
        if(result['code'] == 0){
        	$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/form/deliverForm/deliverEdit?deliverType=DY&deliverFormId="+deliverFormId;
			});
        }else{
            $_jxc.alert(result['message']);
        }
    });
}

function suggestSelectGoods(){
	loadFilterFlag = true;
	// 要货机构
	var targetBranchId = $("#targetBranchId").val();
	// 发货机构
	var sourceBranchId = $("#sourceBranchId").val();

    //判定发货分店是否存在
    if(sourceBranchId==""){
        $_jxc.alert("请先选择发货机构");
        return;
    }
    
    if(targetBranchId==""){
    	$_jxc.alert("请先选择要货机构");
    	return;
    }
    
    var targetBranchType = $("#targetBranchType").val();
    if(targetBranchType==='0'){
        $_jxc.alert("要货机构不能选择总部");
        return;
    }
    		
    var jsonData = {
    		isFastDeliver:1,//直送商品
    		formType:'DY',//直送商品
    		sourceBranchId:sourceBranchId,
    		targetBranchId:targetBranchId
        };
	$_jxc.ajax({
    	url : contextPath+"/form/deliverFormList/getDeliverSuggestNumItemList",
    	data : jsonData
    },function(result){
   		 
   		 if(result.length > 0){
   			 selectStockAndPrice(result,'suggestSelectGoods');
   		 }else{
   			 $_jxc.alert('暂无建议订货商品',function(){});
   		 }
    });
}
//审核
function check(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        validityTime:$("#validityTime").val(),      //生效日期
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").val(),                 // 单号
        grid: $.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
    }

    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据有修改，请先保存再审核");
        return;
    }
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
//            gFunStartLoading();
			$_jxc.ajax({
		    	url : contextPath+"/form/deliverForm/check",
		    	data : {
		    		deliverFormId : $("#formId").val(),
		    		deliverType : 'DY'
		    	}
		    },function(result){
//                gFunEndLoading();
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
	    			});
	    		}else{
	            	new publicErrorDialog({
                        width:380,
                        height:220,
	            		"title":"审核失败",
	            		"error":result['message']
	            	});
	    		}
		    });
		}
	});
}

//删除
function delDeliverForm(){
	var ids = [];
	ids.push($("#formId").val());
	$_jxc.confirm('是否要删除单据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/deliverForm/deleteDeliverForm",
		    	contentType:"application/json",
		    	data:JSON.stringify(ids)
		    },function(result){
	    		if(result['code'] == 0){
                    toRefreshIframeDataGrid("form/deliverForm/viewsDY","deliverFormList");
	    			toClose();
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

/**
 * 要货机构
 */
var branchCode = '';
function selectTargetBranch(){
	var targetBranchType = $("#targetBranchType").val();
	if(targetBranchTypeTemp != '0' && targetBranchTypeTemp != '1'){
		return;
	}
	new publicAgencyService(function(data){
		 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
        $("#targetBranchId").val(data.branchesId);
        //$("#targetBranchName").val(data.branchName);
        $("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
        branchCode = data.branchCode;
        $("#targetBranchType").val(data.type);
        // 为店铺时
        if (data.type != '1' && data.type != '0') {
        	getSourceBranch(data.branchesId);
        }
        if (data.type == '1') {
        	$("#salesman").val(data.salesman);
        	$("#spanMinAmount").html(data.minAmount);
        	$("#minAmount").val(data.minAmount);
        	$("#sourceBranchId").val('');
            $("#sourceBranchName").val('');
        }
	},'DY','');
}

function getSourceBranch(branchesId) {
	$_jxc.ajax({
    	url : contextPath+"/form/deliverForm/getSourceBranch",
    	data : {
    		branchesId : branchesId,
    	}
    },function(result){
		if(result['code'] == 0){
			$("#sourceBranchId").val(result['sourceBranchId']);
            $("#sourceBranchName").val(result['sourceBranchName']);
            $("#validityTime").val(new Date(result['validityTime']).format('yyyy-MM-dd'));
            $("#salesman").val(result['salesman']);
            $("#spanMinAmount").html(result['minAmount']);
            $("#minAmount").val(result['minAmount']);
		}else{
			$_jxc.alert(result['message']);
		}
    });
}

/**
 * 发货机构
 */
function selectSourceBranch(){
	var targetBranchType = $("#targetBranchType").val();
	if(targetBranchType != '0'){
        new publicAgencyService(function(data){
            if($("#sourceBranchId").val()!=data.branchesId){
                $("#sourceBranchId").val(data.branchesId);
                //$("#sourceBranchName").val(data.branchName);
                $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
                gridHandel.setLoadData([$.extend({},gridDefault)]);
            }
        },'DZ',$("#targetBranchId").val(),'',1);
	} else {
        new publicAgencyService(function(data){
            if($("#sourceBranchId").val()!=data.branchesId){
                $("#sourceBranchId").val(data.branchesId);
                //$("#sourceBranchName").val(data.branchName);
                $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
                gridHandel.setLoadData([$.extend({},gridDefault)]);
            }
        },'DY',$("#targetBranchId").val(),'',1);
    }
}

//新的导入功能 货号(0)、条码(1)导入
function toImportproduct(type){
	// 要货机构id
	var targetBranchId = $("#targetBranchId").val();
	// 发货机构id
    var sourceBranchId = $("#sourceBranchId").val();
    if(sourceBranchId === '' || sourceBranchId === null){
        $_jxc.alert("请先选择发货机构");
        return;
    }
    var param = {
        url : contextPath+"/form/deliverForm/importList",
        tempUrl : contextPath+"/form/deliverForm/exportDyTemp",
        type:type,
        targetBranchId : targetBranchId,
        sourceBranchId : sourceBranchId,
        formType : 'DY'
    }
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		selectStockAndPriceImport(data);
    	}
    },param)
}

//查询价格、库存
function selectStockAndPriceImport(data){
	loadFilterFlag = true;
	//updateListData(data);
    var GoodsStockVo = {
        branchId : $("#sourceBranchId").val(),
        fieldName : 'id',
        stockBranchId : $("#targetBranchId").val(),
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
        type : "POST",
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
        updateListData(data);
    });
}

function updateListData(data){
     var keyNames = {
         id:'skuId',
         disabled:'',
         pricingType:'',
         taxRate:'inputTax',
         num : 'applyNum'
     };
     var rows = gFunUpdateKey(data,keyNames);
     for(var i in rows){
         rows[i].remark = "";
         rows[i].isGift = 0;
    	 var applyNum = parseFloat(rows[i]["applyNum"]||0).toFixed(4);
		 var price = parseFloat(rows[i]["distributionPrice"]||0).toFixed(4);
		 var untaxedPrice = parseFloat(rows[i]["untaxedPrice"]||0).toFixed(4);
         rows[i]["amount"] = parseFloat(price*applyNum).toFixed(4);
         rows[i]["untaxedAmount"]  = parseFloat(untaxedPrice*applyNum).toFixed(4);
         rows[i]["taxAmount"] = rows[i]["amount"]-rows[i]["untaxedAmount"];
         if(parseInt(rows[i]["distributionSpec"])){
        	 // 要货申请数量必须为箱数整数倍
        	 rows[i]["applyNum"]  = (parseFloat(rows[i]["largeNum"]||0)*parseFloat(rows[i]["distributionSpec"])).toFixed(4);
         }else{
        	 rows[i]["largeNum"]  =  0;
        	 rows[i]["distributionSpec"] = 0;
         }
     }
     var argWhere ={skuCode:1};  //验证重复性
     var isCheck ={isGift:1 };   //只要是赠品就可以重复
     var newRows = gridHandel.checkDatagrid(data,rows,argWhere,isCheck);
     $("#"+gridName).datagrid("loadData",newRows);
 
}
//返回列表页面
function back(){
	location.href = contextPath+"/form/deliverForm/viewsDA";
}

//新增要货单
function addDeliverForm(){
	$("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
	var newData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        remark:$("#remark").val()||'',                  // 备注
        formNo:$("#formNo").val()||'',                 // 单号
        grid:gridHandel.getRows(),
    }
	if(!gFunComparisonArray(oldData,newData)){
        $_jxc.confirm("单据未保存，是否取消编辑并新增?",function(r){
        	if(r){
        		toAddTab("新增直送要货单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DY");
        	}
        });
    }else{    	
    	toAddTab("新增直送要货单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DY");
    }
	
}