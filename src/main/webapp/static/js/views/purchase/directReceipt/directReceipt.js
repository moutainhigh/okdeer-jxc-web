/**
 * 
 * 全部js代码
 * 编辑和审核公用页面
 * 
 */
//过滤price priceBack 标示 
var loadFilterFlag = false;

var directStatus = 'add';

var gridName = "gridDirectDetail";

var oldData = {};
var isdisabled = false;
var url;
var isEdit = true;
var isAllowPmRefPa = '-1'; //是否可以不引用单据
//供应商采购采购税率
var taxRate=0;
//是否赠品是否可选择
var isGiftFlag = false;
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
	//当前页面状态 新增 修改 审核
	directStatus = $('#directStatus').val();
	//修改页面的单据id
	var formId = $('#formId').val();
	if(directStatus === 'add'){
		$("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
		if($('#refFormNo').val()){
			loadFilterFlag = true;
			formId = $('#refFormId').val();
			url = contextPath +"/directReceipt/getDetailList?formId=" + formId;
			isAllowPmRefPa = 0;
			checkIsAllowPmRefPa(0);
			$('#branchName').addClass('uinp-no-more');
			$('#supplierName').addClass('uinp-no-more');
		}
		oldData = {
			    branchName:$('#branchName').val(),
                supplierId:$("#suppliferId").val(),
                saleWay:$("#saleWay").val(),
                paymentTime:$("#paymentTime").val(),
                remark:$("#remark").val(),
        }
		//允许直送收货单不引用单据收货参数 
//		isAllowPmRefPa = $('#isAllowPmRefPa').val();
//		checkIsAllowPmRefPa(isAllowPmRefPa);
		
		//机构选择组件初始化
		selectBranch();
		
		//供应商选择组件初始化
		selectSupplier();
		
		// 付款期限默认为当前日期
		$("#paymentTime").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
		
	}else if(directStatus === '0'){
		oldData = {
	            branchName:$('#branchName').val(),
                supplierId:$("#supplierId").val(),
                saleWay:$("#saleWay").val(),
                paymentTime:$("#paymentTime").val(),
                remark:$("#remark").val(),
        }
		url = contextPath +"/directReceipt/getDetailList?formId=" + formId;
		$('#already-examine').css('display','none');
		
		//引用单据做的单
		if($.trim($('#refFormNo').val())){
			$('#branchName').addClass('uinp-no-more');
			$('#supplierName').addClass('uinp-no-more');
			isAllowPmRefPa = 0;
			checkIsAllowPmRefPa(0);
		}
		
		//机构选择组件初始化
		selectBranch();
		
		//供应商选择组件初始化
		selectSupplier();
		
		//获取机构设置信息
		if(!$('#refFormNo').val() && $('#branchId').val()){
			getBranchSetting(function () {
                
            });
		}
		
	}else if(directStatus === '1'){
		url = contextPath +"/directReceipt/getDetailList?formId=" + formId;
		isdisabled = true;
		isGiftFlag = true;
		//已审核 不给编辑
		isEdit = true;
		$('#already-examine').css('display','black');
        $('#btnSave').addClass("uinp-no-more");
        $('#btnSave').prop('disabled','disabled ');
	}
	initDirectDataGrid();
	
});

//判断器
function checkaddhandel(type){
	var fa = true;
	if(type == 1){
		if($.trim($('#refFormNo').val())){
			fa = false ;
		}
	}else{
		if($.trim($('#refFormNo').val()) || (isAllowPmRefPa != '-1' && isAllowPmRefPa != '1') ){
			fa = false ;
		}
	}
	
	return fa; 
}

//允许直送收货单不引用单据收货参数  页面该控制
function checkIsAllowPmRefPa(arg){
	//允许不引用单据b 1可以不引用
	if(arg == '1'){
		$('.pmreBtn').removeClass('uinp-no-more event-none');
	}else{
		$('.pmreBtn').addClass('uinp-no-more event-none');
	}
}

var gridDefault = {
    realNum:0,
    isGift:0,
}
var editRowData = null;
var gridHandel = new GridClass();
function initDirectDataGrid(){
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
	            	if(!checkaddhandel()){
	            		$_jxc.alert('不允许添加其他商品');
	            		return;
	            	}
	                selectGoods(arg);
	            }
	        },
	    })
	    	    
	  $("#"+gridName).datagrid({
       method:'post',
   	   url:url,
       align:'center',
       singleSelect:true,  // 单选 false多选
       rownumbers:true,    // 序号
       showFooter:true,
       height:'100%',
       width:'100%',
          columns:[[
			{field:'cz',title:'操作',width:'60px',align:'center',hidden:isdisabled,
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            
			        }else{
			            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
			                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
			        }
			        return str;
			    }
			},

           {field:'skuId',hidden:'true'},
          
           {field:'skuCode',title:'货号',width: '70px',align:'left',
           	formatter:function(value,row,index){
           		if(row.isFooter){
           			return '<div class="ub ub-pc">合计</div> '
           		}
           		return value;
           	},
           	editor:{
	                type:'textbox',
	                options:{
	                	disabled:isdisabled,
	                }
           	}
           },
           {field:'skuName',title:'商品名称',width:'200px',align:'left'},
           {field:'barCode',title:'条码',width:'200px',align:'left'},
           {field:'unit',title:'单位',width:'60px',align:'left'},
           {field:'spec',title:'规格',width:'90px',align:'left'},
           {field:'purchaseSpec',title:'进货规格',width:'120px',align:'left'},
           {field:'largeNum',title:'箱数',width:'80px',align:'right',
               formatter : function(value, row, index) {
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
                       disabled:isdisabled,
                   }
               },
           },
           {field:'realNum',title:'数量',width:'100px',align:'right',
               formatter:function(value,row,index){
                   if(row.isFooter){
                       return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                   }
                   if(!value){
                       row["realNum"] = parseFloat(value||0).toFixed(4);
                   }
                   return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
               },
               editor:{
                   type:'numberbox',
                   options:{
                   	disabled:isdisabled,
                       min:0,
                       precision:4,
                       onChange: onChangeRealNum,
                   }
               }
           },
           {field:'untaxedPrice',title:'不含税单价',width:'100px',align:'right',
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
           {field:'price',title:'单价',width:'100px',align:'right',
               formatter:function(value,row,index){
                   if(row.isFooter){
                       return
                   }
                   if(!value){
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
                       onChange:onChangePrice
                   }
               }
           },
           {field:'untaxedAmount',title:'不含税金额',width:'100px',align:'right',
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
           {field:'amount',title:'金额',width:'100px',align:'right',
               formatter : function(value, row, index) {
                   if(row.isFooter){
                       return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                   }

                   if(!value){
                   	row.amount = parseFloat(value||0).toFixed(4);
                   }
                   
                   return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
               },
               editor:{
                   type:'numberbox',
                   options:{
                	   disabled:true,
                       min:0,
                       precision:4
                   }
               }
           },
           {field:'isGift',title:'是否赠品',width:'80px',align:'center',
               formatter:function(value,row){
                   if(row.isFooter){
                       return;
                   }
                   return value=='1'?'是':(value=='0'?'否':'请选择');
               },
               editor:{
                   type:'combobox',
                   options:{
                       disabled:isGiftFlag,
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
           {field:'goodsCreateDate',title:'生产日期',width:'120px',align:'center',
               formatter : function(value, row,index) {
                   if(row.isFooter){
                       return;
                   }
                   if(!value){
                	   row.goodsCreateDate = row.createTime;
                	   value = row.createTime;
                   }
                   return value?new Date(value).format('yyyy-MM-dd'):""
               },
               editor:{
                   type:'datebox',
                   options:{
                       disabled:isdisabled,
                   }
               },
           },
           {field:'tax',title:'税率',width:'80px',align:'right',
               formatter : function(value, row, index) {
                   if(row.isFooter){
                       return;
                   }
                   if(!row.tax){
                       row.tax = parseFloat(value||0).toFixed(4);
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
           {field:'taxAmount',title:'税额',width:'80px',align:'right',
               formatter : function(value, row, index) {
                   if(row.isFooter){
                       return;
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
           {field:'remark',title:'备注',width:'200px',align:'left',
               editor:{
                   type:'textbox',
                   options:{
                       disabled:isdisabled,
                       validType:{maxLength:[20]},
                   }
               },
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
       	
    	if(Array.isArray(data) && data.length < 1)return data;
      	if(data.rows && data.rows.length < 1)return data;
       	if(loadFilterFlag){
       		loadFilterFlag = false;
       		data = datagridLoadFilter(data);
       	}
       	if($.trim($('#refFormNo').val())){
       		data = datagridLoadFilter(data,'refForm');
       	}
       	return data;
       },
       onLoadSuccess:function(data){
           if(data.rows.length>0){
               var config = {
                   date:['goodsCreateDate']
               }
               gFunFormatData(data.rows,config);
           }
    	   if(!oldData["grid"]){
		       	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
		    		return $.extend(true,{},obj);//返回对象的深拷贝
		    	});
			}
           gridHandel.setDatagridHeader("center");
           updateFooter();
       },
   });
	
   if(!$.trim($('#refFormNo').val()) && directStatus === 'add'){
   	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
   	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
   }
   
   if(hasPurchasePrice==false){
       priceGrantUtil.grantPurchasePrice(gridName,["price","amount","taxAmount","untaxedPrice","untaxedAmount"])
   }
   
}

//过滤数据
function datagridLoadFilter(data,type){
	if(Array.isArray(data)){
		data.forEach(function(obj,index){
			//编辑后 可以再次选择商品 新选的 priceBack为空
			if(!obj.priceBack){
   				if(obj.isGift != '1'){
   					//非赠品
   					obj.price = obj.purchasePrice;
   				}else if(obj.isGift == '1'){
   					//赠品
   					obj.amount = 0;
   				}
   				obj.priceBack = obj.purchasePrice;
   			}
			if(type == 'refForm'){
				//引用单据
   				//原箱数
   				obj.maxlargeNum = obj.largeNum;
   				//原数量
   				obj.maxRealNum = obj.realNum;
			}
   		})
	}else{
		data.rows.forEach(function(obj,index){
			//编辑后 可以再次选择商品 新选的 priceBack为空
			if(!obj.priceBack){
   				if(obj.isGift != '1'){
   					//非赠品
   					obj.price = obj.purchasePrice;
   				}else if(obj.isGift == '1'){
   					//赠品
   					obj.amount = 0;
   				}
   				obj.priceBack = obj.purchasePrice;
   			}
			if(type == 'refForm'){
				//引用单据
				//原箱数
				obj.maxlargeNum = obj.largeNum;
				//原数量
				obj.maxRealNum = obj.realNum;
			}
		})
	}
	return data;
}


//限制转换次数
var n = 0;
var m = 0;

var i = 0;
var j = 0;

//监听箱数
function onChangeLargeNum(newV,oldV) {
    if("" == newV){
        m = 2;
        $_jxc.alert("商品箱数输入有误");
        gridHandel.setFieldValue('largeNum',oldV);
        return;
    }

    if(m > 0 || i > 0){
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

    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    var amount = parseFloat(purchaseSpecValue*priceValue*newV).toFixed(4);
    gridHandel.setFieldValue('amount',amount); //金额=箱数*单价*规格
    var realNum = parseFloat(newV*purchaseSpecValue).toFixed(4);

    var largeNumVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'largeNum');
    if(largeNumVal&&oldV){
        n=1;
        gridHandel.setFieldValue('realNum',realNum);
    }
    calcUntaxedPriceAndAmount(priceValue,realNum,amount);// 计算不含税单价，金额    

    updateFooter();
}

//监听商品数量
function onChangeRealNum(newV,oldV) {
    if("" == newV){
        n= 2;
        $_jxc.alert("商品数量输入有误");
        gridHandel.setFieldValue('realNum',oldV);
        return;
    }

    if(n > 0 || j > 0){
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
        $_jxc.alert("输入商品数量不能大于采购数量"+maxRealNum);
        gridHandel.setFieldValue('realNum',oldV);
        return;
    }
    
    
    var priceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
    var amount = parseFloat(priceValue*newV).toFixed(4);
    gridHandel.setFieldValue('amount',amount);                         //金额=数量*单价
    calcUntaxedPriceAndAmount(priceValue,newV,amount);// 计算不含税单价，金额
    var largeNumVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'largeNum');

    if(largeNumVal&&oldV){
        m=1;
        var largeNumVal = parseFloat(newV/purchaseSpecValue).toFixed(4);
        gridHandel.setFieldValue('largeNum',largeNumVal);   //箱数=数量/商品规格
    }

    updateFooter();
}

//监听商品单价
function onChangePrice(newV,oldV) {
    var realNumVal = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'realNum');
    
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
            $(targetPrice).numberbox('disable');
            gridHandel.setFieldValue('amount',0);//总金额
            gridHandel.setFieldValue('taxAmount',0);//总税额
        }else{
        	if(isEdit == false){
        		$(targetPrice).numberbox('enable');
        	}
            var oldPrice =  $('#'+gridName).datagrid('getRows')[gridHandel.getSelectRowIndex()]["priceBack"];
            if(oldPrice){
                $(targetPrice).numberbox('setValue',oldPrice);
            }
            var priceVal = oldPrice||0;
            var applNum = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'realNum')||0;
            var oldAmount = parseFloat(priceVal)*parseFloat(applNum);
            //var _tempInputTax = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'inputTax');
            //var oldTaxAmount = (_tempInputTax*(oldAmount/(1+parseFloat(_tempInputTax)))||0.0000).toFixed(4);
            gridHandel.setFieldValue('amount',oldAmount);//总金额
            //gridHandel.setFieldValue('taxAmount',oldTaxAmount);//总税额
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
    var fields = {largeNum:0,realNum:0,amount:0,taxAmount:0,isGift:0,untaxedAmount:0};
    var argWhere = {name:'isGift',value:""}
    gridHandel.updateFooter(fields,argWhere);
}
//插入一行
function addLineHandel(event){
	if(!checkaddhandel()){
		$_jxc.alert('不允许添加其他商品');
		return;
	}
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


//新增直送收货单
function addDirect(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        branchName:$('#branchName').val(),
        supplierId:$("#supplierId").val(),
        saleWay:$("#saleWay").val(),
        remark:$("#remark").val(),                  // 备注
        grid: $.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
    }

    if(directStatus === "add"){
        if(!gFunComparisonArray(oldData,newData)){
            $_jxc.alert("数据有修改，请先保存再新增");
            return;
        }
    }

	toAddTab("新增直送收货单",contextPath + "/directReceipt/add");
}

//新增保存
function saveDirectForm(){

    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }

    if(!$.trim($('#paymentTime').val()||"")){
    	$_jxc.alert('付款期限不能为空');
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
        if(parseFloat(v["price"])<=0&&v["isGift"]==0){
            isChcekPrice = true;
        }
        //数量判断
        if(parseFloat(v["realNum"])<=0){
        	isChcekNum = true;
        }
    });
    if(isCheckResult){
        if(isChcekPrice){
            $_jxc.confirm("单价存在为0，重新修改",function(r){
                if (r){
                    return ;
                }else{
                    saveDataHandel(rows, "/directReceipt/save");
                }
            });
        }else{
        	if(isChcekNum){
          		 $_jxc.confirm('存在数量为0的商品,是否继续保存?',function(data){
          			if(data){
          				saveDataHandel(rows, "/directReceipt/save");
          		    }
          		 });
        	}else{
        		saveDataHandel(rows, "/directReceipt/save");
        	}
        }
    }

}

function saveDataHandel(rows, url){
    //gFunStartLoading();
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
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
    //总金额
    var untaxedAmount=0;
    var footerRows = $("#"+gridName).datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["realNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
        untaxedAmount = parseFloat(footerRows[0]["untaxedAmount"]||0.0).toFixed(4);
    }

    var id = $("#formId").val();
    var reqObj = {
    	id:id,
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
        untaxedAmount:untaxedAmount,
        taxRate:taxRate,
        detailList:rows
    };
    
    var req = JSON.stringify(reqObj);

    $_jxc.ajax({
        url:contextPath + url,
        contentType:'application/json',
        data:req
    },function(result){
        
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
                location.href = contextPath +"/directReceipt/edit?formId=" + result["formId"];
            });
        }else{
            $_jxc.alert(result['message']);
        }
    });
}

//查看 保存修改
function updateDirectForm() {
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    
    if(!$.trim($('#paymentTime').val()||"")){
    	$_jxc.alert('付款期限不能为空');
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
        if(parseFloat(v["price"])<=0&&v["isGift"]==0){
            isChcekPrice = true;
        }
        //数量判断
        if(parseFloat(v["realNum"])<=0){
        	isChcekNum = true;
        }
    });
    if(isCheckResult){
        if(isChcekPrice){
            $_jxc.confirm("单价存在为0，重新修改?",function(r){
                if (r){
                    return ;
                }else{
                    saveDataHandel(rows, "/directReceipt/update");
                }
            });
        }else{
        	if(isChcekNum){
         		 $_jxc.confirm('存在数量为0的商品,是否继续保存?',function(data){
         			if(data){
         	            saveDataHandel(rows, "/directReceipt/update");
         		    }
         		 });
	       	}else{
	            saveDataHandel(rows, "/directReceipt/update");
	       	}
        }
    }
    
}

function checkDirectForm(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRows();
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    if(!$.trim($('#paymentTime').val()||"")){
    	$_jxc.alert('付款期限不能为空');
    	return;
    }
    
    var newData = {
        branchName:$('#branchName').val(),
        supplierId:$("#supplierId").val(),
        saleWay:$("#saleWay").val(),
        paymentTime:$("#paymentTime").val(),
        remark:$("#remark").val(),                  // 备注
        grid: $.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
    }
    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据有修改，请先保存再审核");
        return;
    }

    var num=0;
    $.each(rows,function(i,v){
        if(parseFloat(v["realNum"])<=0){
        	num++;
        }
    });
    if(num==rows.length){
   	 	$_jxc.alert("采购商品数量全部为0");
		return;
	}else if(parseFloat(num)>0){
		$_jxc.confirm("审核会清除单据中数量为0的商品记录，是否确定审核?",function(data){
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

function checkOrder(){
    var id = $("#formId").val();
    $_jxc.ajax({
        url:contextPath+"/directReceipt/check",
    	data:{
    		formId:id,
    		status:1
    	}
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
                location.href = contextPath +"/directReceipt/edit?formId=" + id;
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

//选择供应商
function selectSupplier(){
	
	$('#supplierComponent').supplierSelect({
		param:{
				saleWayNot:'purchase',
				isDirect:1
		},
		//选择完成之后
		onAfterRender:function(data){
			$("#saleWay").val(data.saleWay);
			taxRate=data.inputTaxRate;
            $("#saleWayName").val(data.saleWayName);
			gridHandel.setLoadData([$.extend({},gridDefault)]);
			// 是否自动加载商品
            if($("#cascadeGoods").val() == 'true'){
                queryGoodsList();
            }
		},
		//过滤
		loadFilter:function(data){
			data.supplierId = data.id;
			return data;
		},
		//选择之前
		onShowBefore:function(component){
			if(!checkaddhandel(1)){
				return;
			}
			var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
			if(nowRows.length > 0){
				$_jxc.confirm('修改供应商后会清空明细，是否要修改？',function(r){
					if(r){
						component.getComponentDetail();
					}
				})
			}else{
				return true;
			}
		}
	})
}

//直接查询商品
function queryGoodsList() {
   var queryParams = {
            formType:'PM',
            key:"",
            isRadio:'',
            'supplierId':$("#supplierId").val(),
            'branchId': $('#branchId').val(),
            sourceBranchId:'',
            targetBranchId:'',
            flag:'0',
            pageSize:1,
            page:1,
            rows:10000
        };
    var url =  contextPath + '/goods/goodsSelect/getGoodsList';
    $_jxc.ajax({
        url:url,
        data:queryParams
    },function(data){
        if(data && data.list.length > 0){
            var addDefaultData  = gridHandel.addDefault(data.list,gridDefault);
            var keyNames = {
            	purchasePrice:'price'
            };
            for(var i in data.list){
            	var rec = data.list[i];
            	// 供应商采购税率
            	rec.tax = taxRate;
            	rec.untaxedPrice = parseFloat(rec.purchasePrice/(1+taxRate)).toFixed(4);
            }
            var rows = gFunUpdateKey(addDefaultData,keyNames);
            $("#"+gridName).datagrid("loadData",rows);
        }else {
            gridHandel.setLoadData([$.extend({},gridDefault)]);
        }
    })
}

//收货机构
function selectBranch(){
	
	$('#branchComponent').branchSelect({
		param:{
			branchTypesStr:$_jxc.branchTypeEnum.BRANCH_COMPANY + ',' 
							+ $_jxc.branchTypeEnum.LOGISTICS + ','
							+ $_jxc.branchTypeEnum.OWN_STORES + ','
							+ $_jxc.branchTypeEnum.FRANCHISE_STORE_B + ','
							+ $_jxc.branchTypeEnum.FRANCHISE_STORE_C + ','
		},
		//选择之后
		onAfterRender:function(data){
			
			$('#supplierId').val('');
			$('#supplierName').val('');
			$('#saleWayName').val('');
			
			//获取机构设置
			getBranchSetting(function () {
                // 是否自动加载商品
                if($("#cascadeGoods").val() == 'true' && $("#supplierId").val() != ""){
                    queryGoodsList();
                }
            })
			
			gridHandel.setLoadData([$.extend({},gridDefault)]);
		},
		//显示之前 判断
		onShowBefore:function(component){
			if(!checkaddhandel(1)){
				return;
			}	
			var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
			if(nowRows.length > 0){
				$_jxc.confirm('修改机构后会清空明细，是否要修改？',function(r){
					if(r){
						component.getComponentDetail();
					}
				})
			}else{
				return true;
			}
		}
	})
}

//获取机构设置
function getBranchSetting(callback){
	$_jxc.ajax({
		url : contextPath + "/branchSetting/getBranchSettingByBranchId",
		type: "POST",
		data:{"branchId":$('#branchId').val()||''}
	},function(result){
		if(result.code == 0){
			$('#cascadeGoods').val(result.data&&result.data.isSupplierCascadeGoodsPm);
			$('#isAllowPmRefPa').val(result.data&&result.data.isAllowPmRefPa);
			isAllowPmRefPa = result.data&&result.data.isAllowPmRefPa;
			//允许直送收货单不引用单据收货参数 
			checkIsAllowPmRefPa(result.data&&result.data.isAllowPmRefPa);
            callback();

		}else{
			isAllowPmRefPa = 0;
			//允许直送收货单不引用单据收货参数 
			checkIsAllowPmRefPa(0);
		}
	});
}

//选择商品
function selectGoods(searchKey){
	loadFilterFlag = true;
	var branchId = $("#branchId").val();
	var sourceBranchId = branchId;
	var targetBranchId = branchId;
	var supplierId = $("#supplierId").val();
	if(!branchId || !$.trim(branchId)){
		$_jxc.alert("请选择机构");
		return;
	}
	if(!supplierId || !$.trim(supplierId)){
		$_jxc.alert("请选择供应商");
		return;
	}

    //控制弹框
	if(typeof(searchKey)=="undefined"){ 
		searchKey = "";
	}
    
    var param = {
    		type:'PM',
    		key:searchKey,
    		isRadio:'',
    		branchId:branchId,
    		sourceBranchId:'',
    		targetBranchId:'',
    		supplierId:supplierId,
    		flag:'0',
    }
    new publicGoodsServiceTem(param,function(data){
    	if(searchKey){
	        $("#"+gridName).datagrid("deleteRow", gridHandel.getSelectRowIndex());
	        $("#"+gridName).datagrid("acceptChanges");
	    }
    	
		 var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
		 var addDefaultData  = gridHandel.addDefault(data,gridDefault);
		 var keyNames = {
         };
         for(var i in data){
         	var rec = data[i];
         	// 供应商采购税率
         	rec.tax = taxRate;
         	rec.untaxedPrice = parseFloat(rec.purchasePrice/(1+taxRate)).toFixed(4);
         }
         var rows = gFunUpdateKey(addDefaultData,keyNames);
         var argWhere ={skuCode:1};  // 验证重复性
         var isCheck ={isGift:1 };   // 只要是赠品就可以重复
         var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
         $("#"+gridName).datagrid("loadData",newRows);

        gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("stocktakingNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('stocktakingNum'));
        },100)
    	
    });
}

/**
 * 导入商品
 * @param type 0货号  1条码
 */
function importDirectForm(type){
	loadFilterFlag = true;
    var branchId = $("#branchId").val();
    // 判定机构是否存在
    if($("#branchId").val()==""){
        $_jxc.alert("请选择机构");
        return;
    }
    // 判定供应商是否存在
    if($("#supplierId").val()==""){
    	$_jxc.alert("请选择供应商");
    	return;
    }
    
    var param = {
        url:contextPath+"/directReceipt/importList",
        tempUrl:contextPath+"/directReceipt/exportTemp",
        branchId:branchId,
        type:type
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
        data[i]["taxAmount"] = data[i]["amount"]-data[i]["untaxedAmount"];
    });

    var keyNames = {
    	taxRate:'tax'
    };
    var rows = gFunUpdateKey(data,keyNames);

    var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid([],rows,argWhere,isCheck);
    $("#"+gridName).datagrid("loadData",newRows);

}

//删除直送收货单 批量
function directDelete(){
	
    var formIds = [$('#formId').val()||''];
	
	$_jxc.confirm('是否要删除此单据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/directReceipt/delete",
		    	data:{
		    		formIds:formIds
		    	}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("删除成功",function(){
	    				toRefreshIframeDataGrid("directReceipt/list","gridDirectList");
	    				toClose();
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}


function selectPurchaseForm(){
	var param = {
        formType:"PA",
        isDirectSupplier:1
    }
	new publicPurchaseFormService(param,function(data){
		isGiftFlag = true;
		loadFilterFlag = true;
		$("#refFormNo").val(data.form.formNo);
		$("#refFormId").val(data.form.id);
		//根据选择的采购单，带出采购单的信息
		
        var newRows = gFunUpdateKey(data.list,{});
        
        $("#"+gridName).datagrid("loadData",newRows);
        //供应商
        $("#supplierId").val(data.form.supplierId);
        taxRate = data.form.taxRate;
        $("#supplierName").val(data.form.supplierName);
        //经营方式
        $("#saleWay").val(data.form.saleWay);
        $("#saleWayName").val(data.form.saleWayName);
        //收货机构
        $("#branchId").val(data.form.branchId);
        $("#branchName").val(data.form.branchName);
		
        //采购员
        $("#salesmanId").val(data.form.salesmanId);
        $("#salesmanName").val(data.form.salesmanName);
		$("#refFormId").val(data.form.id);
		
		//2.7
		$('#supplierName').addClass('uinp-no-more');
		$('#branchName').addClass('uinp-no-more');
		isAllowPmRefPa = 0;
		checkIsAllowPmRefPa(0);
		
		$_jxc.ajax({
			url : contextPath + "/common/supplier/getById",
			data : {
				id : data.form.supplierId
			}
		},function(data){
			$("#saleWay").val(data.supplier.saleWay);
			$("#saleWayName").val(data.supplier.saleWayName);
		});
        
        
	});
}

/**
 * 导出表单
 */
function exportDirectForm(){
	var length = $("#"+gridName).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	if(length > exportMaxRow){
		$_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#addqueryForm").attr("action",contextPath+"/directReceipt/exportList?formId="+$("#formId").val());
	$("#addqueryForm").submit(); 
}

//新增直送收货单
function directAdd(){
	toAddTab("新增直送收货单",contextPath + "/directReceipt/add");
}