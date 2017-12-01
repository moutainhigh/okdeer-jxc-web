/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单-编辑
 */
var branchId = '';
$(function(){
    initDatagridEditRequireOrder();
    $("div").delegate("button","click",function(){
    	$("p").slideToggle();
    });
    oldData = {
        targetBranchId:$("#targetBranchId").val(), // 要活分店id
        sourceBranchId:$("#sourceBranchId").val(), //发货分店id
        validityTime:$("#validityTime").val(),      //生效日期
        remark:$("#remark").val(),                  // 备注
        formNo:$("#formNo").val(),                 // 单号
    }
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
   /* applyNum:0,
    largeNum:0,*/
    isGift:0,
}
var oldData = {};
var gridHandel = new GridClass();
var gridName = "gridEditRequireOrder";
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
            	branchId = $("#sourceBranchId").val();
                selectGoods(arg);
            }
        },
    })
	var formId = $("#formId").val();
    $("#gridEditRequireOrder").datagrid({
        method:'post',
    	url:contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+formId+"&deliverType=DA",
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
			{field:'ck',checkbox:true},
            {field:'rowNo',hidden:'true'},
            {field:'skuCode',title:'货号',width: '70px',align:'left'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'150px',align:'left',
               /* formatter:function(value,row,index){
                    var str = "";
                    if(row.isFooter){
                        str ='<div class="ub ub-pc" style="color:red;">起订金额：'+ $("#minAmount").val() +'</div> '
                    }else{
                        str = value;
                    }
                    return str;
                }*/
            },
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            /*{field:'twoCategoryCode',title:'类别编号',width:'90px',align:'left'},
            {field:'twoCategoryName',title:'类别名称',width:'90px',align:'left'},*/
            {field:'distributionSpec',title:'配送规格',width:'90px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!value){
                        row["largeNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
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
            	}
            
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
                }
            
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
                }
            },
            {field:'isGift',title:'赠送',width:'80px',hidden:true,align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    row.isGift = row.isGift?row.isGift:0;
                    return value=='1'?'是':(value=='0'?'否':'请选择');
                }
            },
            {field:'inputTax',title:'税率',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                options:{
                    min:0,
                    disabled:true,
                    precision:2,
                }
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!row.taxAmount){
                    	row.taxAmount = parseFloat(value||0).toFixed(4);
                    }
                    
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }
            },
            {field: 'targetStock', title: '店铺库存', width: '80px', hidden:true,align: 'right',
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
            {field:'sourceStock',title:'目标库存',width:'80px',hidden:true,align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    
                    if(!row.sourceStock){
                        row.sourceStock = parseFloat(value||0).toFixed(2);
                    }
                    
                    if(parseFloat(row.applyNum)+parseFloat(row.alreadyNum) > parseFloat(row.sourceStock)){
                     	 return '<span style="color:red;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
  	           		}else{
  	           			return '<span style="color:black;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
  	           		}
                    
                }
            },
            {field:'alreadyNum',title:'已订数量',width:'80px',hidden:true,align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    if(!row.alreadyNum){
                        row.alreadyNum = parseFloat(value||0).toFixed(2);
                    }
                    
                    if(parseFloat(row.applyNum)+parseFloat(row.alreadyNum) > parseFloat(row.sourceStock)){
                      	 return '<span style="color:red;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
   	           		}else{
   	           			return '<span style="color:black;"><b>'+parseFloat(value||0).toFixed(2)+'</b></span>';
   	           		}

                }
            },
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

            //updateRowsStyle();
            updateFooter();
        },
    });

    var param = {
        distributionPrice:["price","amount","taxAmount","untaxedPrice","untaxedAmount"],
    }
    priceGrantUtil.grantPrice(gridName,param);
}

//限制转换次数
var n = 0;
var m = 0;
//合计
function updateFooter(){
    var fields = {largeNum:0,applyNum:0,amount:0,isGift:0,untaxedAmount:0,taxAmount:0};
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}

//选择商品
function selectGoods(searchKey){
	var sourceBranchId = $("#sourceBranchId").val();
	var targetBranchId = $("#targetBranchId").val();
	//判定发货分店是否存在
    if($("#sourceBranchId").val()==""){
        $_jxc.alert("请先选择发货机构");
        return;
    }

    var param = {
        type:'DD',
        key:searchKey,
        isRadio:'',
        branchId:sourceBranchId,
        sourceBranchId:sourceBranchId,
        targetBranchId:targetBranchId,
        supplierId:'',
        flag:'0',
    }
    new publicGoodsServiceTem(param,function(data){
        if(searchKey){
            $("#"+gridHandel.getGridName()).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#"+gridHandel.getGridName()).datagrid("acceptChanges");
        }
        setDataValue(data);
        
        gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("largeNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('largeNum'));
        },100)
        
    });

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
            distributionPrice:'price',
            id:'skuId',
            disabled:'',
            pricingType:''
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1};   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
        $("#gridEditRequireOrder").datagrid("loadData",newRows);

        oldData["grid"] = $.map(rows, function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        });
}


//保存
function saveOrder(){
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
        v["rowNo"] = i+1;
    });
    if(!isCheckResult){
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
        remark : remark,
        formType : $("#formType").val(),
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
    
//    gFunStartLoading();
    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/updateDeliverForm",
        contentType:"application/json",
        data:JSON.stringify(reqObj)
    },function(result){
//        gFunEndLoading();
        if(result['code'] == 0){
        	$_jxc.alert("操作成功！");
            oldData = {
                targetBranchId:$("#targetBranchId").val(), // 要活分店id
                sourceBranchId:$("#sourceBranchId").val(), //发货分店id
                validityTime:$("#validityTime").val(),      //生效日期
                remark:$("#remark").val(),                  // 备注
                formNo:$("#formNo").val(),                 // 单号
            }
            oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
        		return $.extend(true,{},obj);//返回对象的深拷贝
        	});
        }else{
            $_jxc.alert(result['message']);
        }
    });
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
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
//            gFunStartLoading();
			$_jxc.ajax({
		    	url : contextPath+"/form/deliverForm/check",
		    	data : {
		    		deliverFormId : $("#formId").val(),
		    		deliverType : 'DD'
		    	}
		    },function(result){
//                gFunEndLoading();
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
	    			});
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}


//审核
function toEnd(){
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
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }
	$_jxc.confirm('是否终止该订单？',function(data){
		if(data){
//            gFunStartLoading();
			$_jxc.ajax({
		    	url : contextPath+"/form/deliverDDForm/toEnd",
		    	data : {
		    		deliverFormId : $("#formId").val(),
		    		deliverType : 'DD',
	    			formType:'DD'
		    	}
		    },function(result){
//                gFunEndLoading();
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + $("#formId").val();
	    			});
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//合计
function toFooter(){
	$('#gridEditRequireOrder').datagrid('reloadFooter',[{"isFooter":true,"receivablesAccount":$('#receivablesAccount').val()||0,"collectAccount":$('#collectAccount').val()||0}]);
}

/**
 * 要货机构
 */
function selectTargetBranch(){
	new publicAgencyService(function(data){
        $("#targetBranchId").val(data.branchesId);
        $("#targetBranchName").val(data.branchName);
        // 为店铺时
        if (data.type != '1' && data.type != '0') {
        	getSourceBranch(data.branchesId);
        }
        if (data.type == '1') {
        	$("#salesman").val(data.salesman);
        	$("#spanMinAmount").html(data.minAmount);
        	$("#sourceBranchId").val('');
            $("#sourceBranchName").val('');
        }
	},'DD',"","3");
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
		}else{
            $_jxc.alert(result['message']);
		}
    });
}

/**
 * 发货分店
 */
function selectSourceBranch(){
	new publicAgencyService(function(data){
        if($("#sourceBranchId").val()!=data.branchesId){
            $("#sourceBranchId").val(data.branchesId);
            $("#sourceBranchName").val(data.branchName);
            gridHandel.setLoadData([$.extend({},gridDefault)]);
        }
	},'DD',"","3");
}
//返回列表页面
function back(){
	location.href = contextPath+"/form/deliverForm/viewsDA";
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
        url:contextPath+"/form/deliverForm/importList",
        tempUrl:contextPath+"/form/deliverForm/exportTemp",
        type:type,
        targetBranchId:targetBranchId,
        sourceBranchId:sourceBranchId
    }
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		selectStockAndPriceImport(data);
    	}
    },param)
}

//查询价格、库存
function selectStockAndPriceImport(data){
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
                    }
                })
            })
            updateListData(data);
	    });
}

function updateListData(data){
     var keyNames = {
		 distributionPrice:'price',
         id:'skuId',
         disabled:'',
         pricingType:'',
         taxRate:'inputTax',
         num : 'applyNum'
     };
     var rows = gFunUpdateKey(data,keyNames);
     for(var i in rows){
         rows[i].remark = "";
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
     $("#gridEditRequireOrder").datagrid("loadData",newRows);
   
}

//新增要货单
function addDeliverForm(){
	
    var newData = {
            targetBranchId:$("#targetBranchId").val(), // 要活分店id
            sourceBranchId:$("#sourceBranchId").val(), //发货分店id
            validityTime:$("#validityTime").val(),      //生效日期
            remark:$("#remark").val(),                  // 备注
            formNo:$("#formNo").val(),                 // 单号
            grid:gridHandel.getRows(),
        }
	
    if(!gFunComparisonArray(oldData,newData)){
    	//单据已经变更，是否保存
    	var param = {
    			title:'是否保存',
    			content:'单据已经变更，是否保存?'
    	}
    	new publicConfirmDialog(function(data){
    		if(data.code === 1){
    			saveOrder();
    			location.href = contextPath +"/form/deliverDDForm/addView";
//    			toAddTab("新增店间配送申请单",contextPath + "/form/deliverDDForm/addView");
    		}else if(data.code === 0){
    			location.href = contextPath +"/form/deliverDDForm/addView";
//    			toAddTab("新增店间配送申请单",contextPath + "/form/deliverDDForm/addView");
    		}
    	},param);
    }else{
    	toAddTab("新增店间配送申请单",contextPath + "/form/deliverDDForm/addView");
    }
	
	
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
                    toRefreshIframeDataGrid("form/deliverDDForm/view","deliverFormList");
	    			toClose();
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}
