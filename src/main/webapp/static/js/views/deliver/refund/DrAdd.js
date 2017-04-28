
var targetBranchTypeTemp = "";
var branchId = '';	
var gridDefault = {
	    applyNum:0,
	    largeNum:0,
	    isGift:0,
	}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "saleReturnAddForm";
var pageStatus = "add"
var editRowData = null;
$(function(){
	pageStatus = $('#pageStatus').val();
	
	//新增页面
	if(pageStatus === 'add'){
		//如果是门店
    	if(sessionBranchType>=3){
	        $("#sourceBranchId").val(sessionBranchId);
	        $("#sourceBranchName").val(sessionBranchCodeName).removeAttr('onclick');
	        $('#source-btn').removeAttr('onclick');
	    }
	    $("#targetBranchType").val(sessionBranchType);
	    //$("#createTime").html(new Date().format('yyyy-MM-dd hh:mm')); .
	    
	    //用于新旧数据比较
	    oldData = {
			targetBranchId:$("#targetBranchId").val(), 	// 要活分店id
			sourceBranchId:$("#sourceBranchId").val(), //发货分店id
			remark:$("#remark").val()||'',                  // 备注
			formNo:$("#formNo").val()||'',                 // 单号
	    }
    
    	initDatagridStoreYHOrder();
    	targetBranchTypeTemp = $("#targetBranchType").val();
    }else if(pageStatus === 'edit'){
		//保存后的页面
		var formId = $("#formId").val();
		url = contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+formId+"&deliverType=DR";
		//用于新旧数据比较
		oldData = {
	        targetBranchId:$("#targetBranchId").val(), // 要活分店id
	        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
	        remark:$("#remark").val()||'',                  // 备注
	        formNo:$("#formNo").val()||'',                 // 单号
	    }
		initDatagridStoreYHOrder();
	    $("div").delegate("button","click",function(){
	    	$("p").slideToggle();
	    });
	    
	}
	
})

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

function initDatagridStoreYHOrder(){
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
    	url:url,
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
			            str ='<div class="ub ub-pc">合计</div>'
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
            {field:'barCode',title:'条码',width:'150px',align:'left',
                formatter:function(value,row,index){
                    var str = "";
                    if(row.isFooter){
                        str =''
                    }else{
                        str = value;
                    }
                    return str;
                }
            },
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!row.price){
                    	row.price = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter:function(value,row,index){
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
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["applyNum"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }

                    if(!row.amount){
                    	row.amount = parseFloat(value||0).toFixed(2);
                    }
                    
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
                }
            },
            {field:'inputTax',title:'税率',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
	                options:{
	                    min:0,
	                    disabled:true,
	                    precision:2,
	                }
                }
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    var taxAmountVal = (row.inputTax*(row.amount/(1+parseFloat(row.inputTax)))||0.0000).toFixed(2);
                    row["taxAmount"] = taxAmountVal;
                    return '<b>'+parseFloat(taxAmountVal||0).toFixed(2)+'</b>';
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
        	if(pageStatus==='edit'){
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
    
    if(pageStatus==='add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault),$.extend({},gridDefault)]);
    	 
    	 if(!oldData["grid"]){
         	oldData["grid"] = gridHandel.getRows();
     	 }
    	 //console.log('sdd',JSON.stringify(oldData));
    }
}


//限制转换次数
var n = 0;
var m = 0;
//监听商品箱数
function onChangeLargeNum(newV,oldV){
	//if(!oldV)return;
	if("" == newV){
		m = 2;
		 messager("商品箱数输入有误");
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
        messager("没有配送规格,请审查");
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
    
    var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    var _taxAmountVal = (_tempInputTax*(_tempAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(2);
    gridHandel.setFieldValue('taxAmount',_taxAmountVal);//税额 = 金额/(1+税率)*税率
    
    gridHandel.setFieldValue('applyNum',parseFloat(newRealNum).toFixed(4)); //数量=箱数*商品规格
    
    
    updateFooter();
    
}
//监听商品数量
function onChangeRealNum(newV,oldV) {
	//if(!oldV)return;
	if("" == newV){
		n= 2;
		 messager("商品数量输入有误");
		 gridHandel.setFieldValue('applyNum',oldV);
	     return;
	}
	if(n > 0){
		n = 0;
		return;
	}
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'distributionSpec');
    if(!purchaseSpecValue){
        messager("没有配送规格,请审查");
        return;
    }
    
    m=1;
    
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    var _tempAmount = priceValue*newV;
    gridHandel.setFieldValue('amount',_tempAmount);                         //金额=数量*单价
    var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
    var _taxAmountVal = (_tempInputTax*(_tempAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(2);
    gridHandel.setFieldValue('taxAmount',_taxAmountVal);//税额 = 金额/(1+税率)*税率
    
    var tempNum = parseFloat(newV)/parseFloat(purchaseSpecValue);
    gridHandel.setFieldValue('largeNum',tempNum.toFixed(4));   //箱数=数量/商品规格
    gridHandel.setFieldsData({tmpLargeNum:tempNum}); // 保留除法值   防止toFixed(4) 四舍五入做乘法时比原值大的问题
    
    updateFooter();
}

//监听是否赠品
function onSelectIsGift(data){
    var nowRows = gridHandel.getRowsWhere({skuName:'1'})
    if(nowRows.length <= 0)return;
    var checkObj = {
        skuCode: gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'skuCode'),
        isGift:data.id,
    };
    var arrs = gridHandel.searchDatagridFiled(gridHandel.getSelectRowIndex(),checkObj);
    if(arrs.length==0){
        var targetPrice = gridHandel.getFieldTarget('price');
        //var priceVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
        if(data.id=="1"){
            //$('#'+gridName).datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"] = priceVal;
            $(targetPrice).numberbox('setValue',0);
            gridHandel.setFieldValue('amount',0);//总金额
            gridHandel.setFieldValue('taxAmount',0);//税额
        }else{
            //var oldPrice =  $('#'+gridName).datagrid('getRows')[gridHandel.getSelectRowIndex()]["oldPrice"];
            var oldPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'priceBack');
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
            }
            var priceVal = oldPrice||0;
            var applNum = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'applyNum');
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
        messager(data.id=='1'?'已存在相同赠品':'已存在相同商品');
    }
}
//合计
function updateFooter(){
    var fields = {largeNum:0,applyNum:0,amount:0,isGift:0, };
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
	var sourceBranchId = $("#sourceBranchId").val();
	var targetBranchId = $("#targetBranchId").val();
    //判定发货分店是否存在
    if($("#sourceBranchId").val()==""){
        messager("请先选择发货机构");
        return;
    }
    
    var param = {
    		type:'DA',
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
function setDataValue(data) {
		for(var i in data){
			var rec = data[i];
			rec.remark = "";
			
		}
        var nowRows = gridHandel.getRowsWhere({skuName:'1'});
        var addDefaultData = gridHandel.addDefault(data,gridDefault);
        var keyNames = {
            distributionPrice:'price', //单间采用成本价
            price:'priceBack',
            id:'skuId',
            disabled:'',
            pricingType:''
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1};   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
        console.log('newRows',newRows);
        //$("#"+gridName).datagrid(''{data:newRows});
        gridHandel.setLoadData(newRows);

    gridHandel.setLoadFocus();
    setTimeout(function(){
        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        gridHandel.setSelectFieldName("largeNum");
        gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
    },100)
}

//查询价格、库存
function selectStockAndPrice(data){
	//setDataValue(data);
	var GoodsStockVo = {
            branchId : $("#targetBranchId").val(),
            fieldName : 'id',
			goodsSkuVo : []
		}; 
	$.each(data,function(i,val){
		var temp = {
				id : val.skuId
		};
		GoodsStockVo.goodsSkuVo[i] = temp;
	});
	$.ajax({
    	url : contextPath+"/goods/goodsSelect/queryAlreadyNum",
    	type : "POST",
    	data : {
    		goodsStockVo : JSON.stringify(GoodsStockVo)
    	},
    	success:function(result){
            $.each(data,function(i,val){
                $.each(result.data,function(j,obj){
                    if(val.skuId==obj.skuId){
                        data[i].alreadyNum = obj.alreadyNum;
                    }
                })
            })
    		setDataValue(data);
    	},
    	error:function(result){
    		successTip("请求发送失败或服务器处理失败");
    	}
    });
}

//新增门店要货
function addDeliverDR(){
	//toAddTab("新增门店退货单", contextPath + "/stock/reimburse/add");
	$("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
	var newData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        remark:$("#remark").val()||'',                  // 备注
        formNo:$("#formNo").val()||'',                 // 单号
        grid:gridHandel.getRows(),
    }
    if(!gFunComparisonArray(oldData,newData)){
        $.messager.confirm("提示","单据未保存，是否取消编辑并新增?",function(r){
        	if(r){
        		toAddTab("新增退货单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DR");
        	}
        });
    }else{    	
    	toAddTab("新增退货单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DR");
    }
}

//保存
function saveOrder(){
	
	// 退货分店id
	var targetBranchId = $("#targetBranchId").val();
	// 收货机构id
    var sourceBranchId = $("#sourceBranchId").val();
	if(!targetBranchId || !sourceBranchId){
		successTip("制单机构和收货机构不能为空!");
		return;
	}
	var sourceBranchType = parseInt($("#sourceBranchType").val());
	var targetBranchType = parseInt($("#targetBranchType").val());
	if(sourceBranchType<3){
		successTip("制单机构只能选择店铺类型的机构!");
		return;
	}
	if(targetBranchType!=1 && targetBranchType!=2){
		successTip("收货机构只能选择物流中心或者分公司!");
		return;
	}
	
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
    //生效日期
//    var validityTime = $("#validityTime").val();
    // 备注
    var remark = $("#remark").val();
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());

    var footerRows = $("#"+gridName).datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["applyNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
    }

    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
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
        if(v["applyNum"]<=0){
            messager("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }
        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
        return;
    }
   // var saveData = JSON.stringify(rows);
    var reqObj = {
    	formType:'DR',
    	sourceBranchId:sourceBranchId,
        targetBranchId:targetBranchId,
//        validityTime:validqityTime,
        totalNum:totalNum,
        amount:amount,
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
    		inputTax : data.inputTax,
    		isGift : data.isGift,
    		remark : data.remark,
    		originPlace : data.originPlace,
    		distributionSpec : data.distributionSpec
    	}
    	reqObj.deliverFormListVo[i] = temp;
	});
    console.log('req',JSON.stringify(reqObj))
//    return;
    gFunStartLoading();
    $.ajax({
        url:contextPath+"/form/deliverForm/insertDeliverForm",
        type:"POST",
        contentType:"application/json",
        data:JSON.stringify(reqObj),
        success:function(result){
        	gFunEndLoading();
            if(result['code'] == 0){
                $.messager.alert("操作提示", "操作成功！", "info",function(){
                    location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
                });
            }else{
                var strResult = "";
                if (result.dataList) {
                    $.each(result.dataList,function(i,item){
                        strResult += item.goodsName+" ,库存数量： "+item.number+",";
                    })
                }
                //successTip(result['message'] +","+strResult);
            	new publicErrorDialog({
                    width:380,
                    height:220,
            		"title":"保存失败",
            		"error":result['message']+strResult
            	});
            }
        },
        error:function(result){
        	gFunEndLoading();
            successTip("请求发送失败或服务器处理失败");
        }
    });
}


//修改订单
function updateOrder(){
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
	// 要活分店id
    var targetBranchId = $("#targetBranchId").val();
	//发货分店id
    var sourceBranchId = $("#sourceBranchId").val();
    //生效日期
//    var validityTime = $("#validityTime").val();
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
    }

    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
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
        if(v["largeNum"]<=0){
            messager("第"+(i+1)+"行，箱数必须大于0");
            isCheckResult = false;
            return false;
        }
        if(v["applyNum"]<=0){
            messager("第"+(i+1)+"行，数量必须大于0");
            isCheckResult = false;
            return false;
        }
        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
        return;
    }
    //var saveData = JSON.stringify(rows);
    //var deliverFormListVo = tableArrayFormatter(rows,"deliverFormListVo");
    var reqObj = {
    	sourceBranchId : sourceBranchId,
    	deliverFormId : $("#formId").val(),
        targetBranchId : targetBranchId,
//        validityTime : validityTime,
        totalNum : totalNum,
        amount : amount,
        remark : remark,
        formType : "DR",
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
    		inputTax : data.inputTax,
    		isGift : data.isGift,
    		remark : data.remark,
    		originPlace : data.originPlace,
    		distributionSpec : data.distributionSpec,
    		formId : data.formId
    	}
    	reqObj.deliverFormListVo[i] = temp;
	});
    
    gFunStartLoading();
    $.ajax({
        url:contextPath+"/form/deliverForm/updateDeliverForm",
        type:"POST",
        contentType:"application/json",
        data:JSON.stringify(reqObj),
        success:function(result){
            gFunEndLoading();
            if(result['code'] == 0){
            	
                oldData = {
                    targetBranchId:$("#targetBranchId").val(), // 要活分店id
                    sourceBranchId:$("#sourceBranchId").val(), //发货分店id
                    remark:$("#remark").val(),                  // 备注
                    formNo:$("#formNo").val(),                 // 单号
                }
                oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
            		return $.extend(true,{},obj);//返回对象的深拷贝
            	});
                $.messager.alert("操作提示", "操作成功！", "info",function(){
                	location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + $("#formId").val();
                });
            }else{
                successTip(result['message']);
            }
        },
        error:function(result){
            gFunEndLoading();
            successTip("请求发送失败或服务器处理失败");
        }
    });
}


//删除
function delDeliverForm(){
	var ids = [];
	ids.push($("#formId").val());
	$.messager.confirm('提示','是否要删除单据',function(data){
		if(data){
			$.ajax({
		    	url:contextPath+"/form/deliverForm/deleteDeliverForm",
		    	type:"POST",
		    	contentType:"application/json",
		    	data:JSON.stringify(ids),
		    	success:function(result){
		    		if(result['code'] == 0){
                        toRefreshIframeDataGrid("form/deliverForm/viewsDA","deliverFormList");
		    			toClose();
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
 * 制单机构、退货机构
 */
var branchCode = '';
function selectSourceBranch(){
	var targetBranchType = parseInt($("#targetBranchType").val());
    new publicAgencyService(function(data){
        if($("#sourceBranchId").val()!=data.branchesId){
            $("#sourceBranchId").val(data.branchesId);
            $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
            $("#sourceBranchType").val(data.type);
            gridHandel.setLoadData([$.extend({},gridDefault)]);
            branchCode = data.branchCode;
        }
    },'DD');
}

/**
 * 收货机构
 */
function selectTargetBranch(){
	new publicAgencyService(function(data){
        $("#targetBranchId").val(data.branchesId);
        $("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
        $("#targetBranchType").val(data.type);
	},'DZ',$("#sourceBranchId").val(),'',1);
}

function getSourceBranch(branchesId) {
	$.ajax({
    	url : contextPath+"/form/deliverForm/getSourceBranch",
    	type : "POST",
    	data : {
    		branchesId : branchesId,
    	},
    	success:function(result){
    		if(result['code'] == 0){
    			$("#sourceBranchId").val(result['sourceBranchId']);
                $("#sourceBranchName").val(result['sourceBranchName']);
//                $("#salesman").val(result['salesman']);
//                $("#spanMinAmount").html(result['minAmount']);
//                $("#minAmount").val(result['minAmount']);
    		}else{
    			successTip(result['message']);
    		}
    	},
    	error:function(result){
    		successTip("请求发送失败或服务器处理失败");
    	}
    });
}


//新的导入功能 货号(0)、条码(1)导入
function toImportproduct(type){
	// 要货机构id
	var targetBranchId = $("#targetBranchId").val();
	// 发货机构id
    var sourceBranchId = $("#sourceBranchId").val();
    if(sourceBranchId === '' || sourceBranchId === null){
        messager("请先选择退货机构信息");
        return;
    }
    var param = {
        url : contextPath+"/form/deliverForm/importList",
        tempUrl : contextPath+"/form/deliverForm/exportTempDr",
        type:type,
        targetBranchId : targetBranchId,
        sourceBranchId : sourceBranchId,
        formType : 'DR'
    }
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		selectStockAndPriceImport(data);
    	}
    },param)
}


//查询价格、库存
function selectStockAndPriceImport(data){
	//updateListData(data);
    var GoodsStockVo = {
        branchId : $("#targetBranchId").val(),
        fieldName : 'id',
        goodsSkuVo : []
    };
    $.each(data,function(i,val){
        var temp = {
            id : val.skuId
        };
        GoodsStockVo.goodsSkuVo[i] = temp;
    });
    $.ajax({
        url : contextPath+"/goods/goodsSelect/queryAlreadyNum",
        type : "POST",
        data : {
            goodsStockVo : JSON.stringify(GoodsStockVo)
        },
        success:function(result){
            $.each(data,function(i,val){
                $.each(result.data,function(j,obj){
                    if(val.skuId==obj.skuId){
                        data[i].alreadyNum = obj.alreadyNum;
                    }
                })
            })
            updateListData(data);
        },
        error:function(result){
            successTip("请求发送失败或服务器处理失败");
        }
    });
}

function updateListData(data){
     var keyNames = {
		 distributionPrice:'price',
		 price:'priceBack',
         id:'skuId',
         disabled:'',
         pricingType:'',
         num : 'applyNum'
     };
     
     var rows = gFunUpdateKey(data,keyNames);
     for(var i in rows){
         rows[i].remark = "";
         rows[i].isGift = 0;
         rows[i]["amount"]  = parseFloat(rows[i]["price"]||0)*parseFloat(rows[i]["applyNum"]||0);

         if(parseInt(rows[i]["distributionSpec"])){
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
	location.href = contextPath+"/form/deliverForm/viewsDR";
}


//审核
function check(){
	//验证数据是否修改
    $("#"+gridHandel.getGridName()).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        validityTime:$("#validityTime").val(),      //生效日期
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").val(),                 // 单号
        grid:gridHandel.getRows(),
    }

    if(!gFunComparisonArray(oldData,newData)){
        messager("数据已修改，请先保存再审核");
        return;
    }
    var rows = gridHandel.getRows();
    if(rows.length==0){
        messager("表格不能为空");
        return;
    }
    var msg = "是否审核通过？";
    $.each(rows,function(i,v){
        if(v["applyNum"]<=0){
            msg = "第"+(i+1)+"行，商品数量为0，是否删除并审核?";
            return false;
        }
        v["rowNo"] = i+1;
    });
	$.messager.confirm('提示',msg,function(data){
        if(data){
            checkHandel()
        }
	});
}
function checkHandel(){
        $.ajax({
            url : contextPath+"/form/deliverForm/check",
            type : "POST",
            data : {
                deliverFormId : $("#formId").val(),
                deliverType : 'DR'
            },
            success:function(result){
                if(result['code'] == 0){
                    $.messager.alert("操作提示", "操作成功！", "info",function(){
                        location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
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
