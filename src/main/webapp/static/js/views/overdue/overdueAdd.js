$(function(){
	//初始化默认条件
    initConditionParams();
    
    initDatagridEditOrder();
});

//初始化默认条件
function initConditionParams(){
	$("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
	
	 //初始化机构ID，机构名称
    if(sessionBranchType!=1){
    	 $("#branchId").val(sessionBranchId);
    	 $("#branchName").val(sessionBranchCodeName);
    }
	
	
	//设置默认供应商信息
	$("#supplierId").val(sessionSupplierId);
    $("#supplierName").val(sessionSupplierCodeName);
    
    //设置默认供应商交货期限
    var diliveCycle = null;
    if(sessionSupplierDiliveCycle){
    	diliveCycle = parseInt(sessionSupplierDiliveCycle);
    }
    var deliverTime = dateUtil.getCurrentDateStr();
    
    //如果供应商送货周期不会空，则交货期限需要加上送货周期
    if(diliveCycle){
    	deliverTime = new Date(new Date().getTime() + 24*60*60*1000*diliveCycle).format('yyyy-MM-dd');
    }
    $("#deliverTime").val(deliverTime);
}

var gridDefault = {
    largeNum:0,
    realNum:0,
    isGift:0,
}
var gridHandel = new GridClass();
var gridName = "overdueEditGrid";
var editRowData = null;
function initDatagridEditOrder(){
    gridHandel.setGridName("overdueEditGrid");
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
    $("#overdueEditGrid").datagrid({
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
        	{field:'rowNo',title:'行号',hidden:true},
        	{field:'id',title:'主键',hidden:true},
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
            {field:'barCode',title:'条码',width:'130px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'applyNum',title:'数量',width:'80px',align:'right',
                formatter : function(value, row, index) {
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
                    value:0,
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeLargeNum,
                    }
                },
            },
            {field:'applyPrice',title:'零售价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    if(!row.applyPrice){
                    	row.applyPrice = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field:'applyAmount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        precision:4,
                    }
                }
            },
            {field: 'productionDate', title: '生产日期', width: 120, align: 'center',
            	formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '';
                    }
                    return value;
                },
                editor:{
                    type:'datebox',
                    options:{
                    	editable:false,
                    	formatter:function(date){
                    		var y = date.getFullYear();
                    		var m = date.getMonth()+1;
                    		var d = date.getDate();
                    		return y+'-'+ (m<10?'0'+m:m) + '-'+ (d<10?'0'+d:d);
                    	},
                    }
                },
            },
            {field: 'expiryDate', title: '到期日期', width: 120, align: 'center',
            	formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '';
                    }
                    return value;
                },
                editor:{
                    type:'datebox',
                    options:{
                    	editable:false,
                    	formatter:function(date){
                    		var y = date.getFullYear();
                    		var m = date.getMonth()+1;
                    		var d = date.getDate();
                    		return y+'-'+ (m<10?'0'+m:m) + '-'+ (d<10?'0'+d:d);
                    	},
                    	onChange:changeEndDate
                    },
                   
                },
            },
            {field: 'distanceDay', title: '距到期天数', width: 70, align: 'right',
            	formatter:function(value,row,index){
            		if($_jxc.isStringNull(value)){
            			return 0;
            		}
            		return '<b>'+parseInt(value||0)+'</b>';
            	},
            	editor:{
                    type:'numberbox',
                    options:{
                    	disabled:true,
                    	min:0
                    }
                }
            },
            {field:'applyDesc',title:'申请说明',width:'200px',align:'left',editor:'textbox'},
            {field:'auditDesc',title:'处理意见',width:'200px',align:'left'}
           
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
}

//到期日期
var endFlag = false;
function changeEndDate(date,oDate){
	if(endFlag){
		endFlag = false;
		return;
	}
	var _productionDate = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'productionDate')
	if(_productionDate && date && new Date(date) <  new Date(_productionDate)){
		$_jxc.alert('到期日期不能小于生产日期')
		endFlag = true;
		$(this).datebox('setValue',oDate);
		return;
	}
	getDistanceDay(date);
}

//计算天数
function getDistanceDay(arg2){
	var _d = new Date(arg2).getTime() - new Date().getTime();
	_d = parseInt(_d / (60*60*1000*24) + 2);//距离天数
//	gridHandel.setFieldsData({distanceDay:_d});
	gridHandel.setFieldValue('distanceDay',_d);
	
}


//限制转换次数
var n = 0;
var m = 0;
//监听数量
function onChangeLargeNum(newV,oldV){
	if("" == newV){
		 $_jxc.alert("商品数量输入有误");
		 gridHandel.setFieldValue('applyNum',oldV); 
	     return;
	}
	
	if(m > 0){
		m = 0;
		return;
	}
	
    if(!gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'skuCode')){
        return;
    }
    
    /*var purchaseSpecValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'spec');
    if(!purchaseSpecValue){
        $_jxc.alert("没有商品规格,请审查");
        //return;
    }*/
    
    n++;
    
    //金额 = 单价 * 数量
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'applyPrice');
    priceValue  = !priceValue ? 0 :parseFloat(priceValue);
    gridHandel.setFieldValue('applyAmount',parseFloat(priceValue*newV).toFixed(4));
    updateFooter();
}

//合计
function updateFooter(){
    var fields = {applyNum:0,applyAmount:0,amount:0,applyPrice:0,};
    var argWhere = {name:'applyAmount',value:""}//
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
    //判定供应商是否存在
	var supplierId = "";
    var branchId = $("#branchId").val();
    if(!branchId){
    	$_jxc.alert("请先选择申请机构");
        return;
    }

    var param = {
        type:'BA',
        key:searchKey,
        isRadio:0,
        sourceBranchId:"",
        targetBranchId:"",
        branchId:branchId,
        supplierId:supplierId,
        flag:'0',
    }
    
    new publicGoodsServiceTem(param,function(data){
    	if(data.length==0){
            return;
        }
    	if(searchKey){
	        $("#overdueEditGrid").datagrid("deleteRow", gridHandel.getSelectRowIndex());
	        $("#overdueEditGrid").datagrid("acceptChanges");
	    }
        for(var i in data){
        	var rec = data[i];
        	rec.remark = "";
        }
        var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
        var addDefaultData  = gridHandel.addDefault(data,gridDefault);
        var keyNames = {
            purchasePrice:'price',
            id:'skuId',
            disabled:'',
            pricingType:'',
            inputTax:'tax' ,
            salePrice:'applyPrice'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1 };   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);

        $("#overdueEditGrid").datagrid("loadData",newRows);

        gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("applyNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('applyNum'));
        },100)
        
    });
}

//保存
function saveItemHandel(){
    
    
    if(!$.trim($('#remark').val())){
    	$_jxc.alert("备注不能为空");
    	return;
    }
   
    $("#overdueEditGrid").datagrid("endEdit", gridHandel.getSelectRowIndex());
    
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var isCheckResult = true;
    var isChcekPrice = false;
    var isChcekNum = false;
    var isApplyDesc =false;
    var isCheckAmount=false;
    $.each(rows,function(i,v){
        v["rowNo"] = i+1;
        if(!v["skuName"]){
            $_jxc.alert("第"+(i+1)+"行，货号不正确");
            isCheckResult = false;
            return false;
        };
        if(!/^\d+(\.\d+)?$/.test(v["applyPrice"]) || parseFloat(v["applyPrice"])<0){
            isChcekPrice = true;
        }
        if(!/^\d+(\.\d+)?$/.test(v["applyAmount"]) || parseFloat(v["applyAmount"])<0){
            isCheckAmount = true;
        }
        //数量判断
        if(!v["applyNum"] || parseFloat(v["applyNum"])<=0){
        	isChcekNum = true;
        }
        if (!$.trim(v["applyDesc"]) ){
        	isApplyDesc = true;
        }
    });
    if(isCheckResult){
    	
       /* if(isChcekPrice){
            $_jxc.confirm("单价存在为0，重新修改",function(r){
                if (r){
                    return ;
                }else{
                	 saveDataHandel(rows);
                }
            });
        }else{*/
        	if(isChcekNum){
       		/* $_jxc.confirm('存在数量为0的商品,是否继续保存?',function(data){
       			if(data){
       				saveDataHandel(rows);
       		    }
       		 });*/
        		$_jxc.alert("存在数量为0的商品,不能保存！");
         	}else if(isApplyDesc){
        		$_jxc.alert("存在商品没有申请说明,不能保存,请填写申请说明！");
        	}else if(isChcekPrice){
        		$_jxc.alert("存在单价为空的商品,不能保存！");
        	}else if(isCheckAmount){
        		$_jxc.alert("金额存在为空，请重新修改！");
        	}
        	else{
         		saveDataHandel(rows);
         	}
        //}
    }
}

function saveDataHandel(rows){
    //商品总数量
    var totalNum = 0;
    //总金额
    var amount=0;
    //供应商
    var createUserName = $("#createUserName").val();
    //收货机构
    var branchId = $("#branchId").val();
    //交货期限
    var formNo = $("#formNo").val();
    //采购员
    var createUserId = $("#createUserId").val();
    //备注
    var remark = $("#remark").val();

    var footerRows = $("#overdueEditGrid").datagrid("getFooterRows");
    if(footerRows){
        totalNum = parseFloat(footerRows[0]["applyNum"]||0.0).toFixed(4);
        amount = parseFloat(footerRows[0]["applyAmount"]||0.0).toFixed(4);
    }

    var reqObj = {
    	createUserName:createUserName,
        branchId:branchId,
        formNo:formNo,
        createUserId:createUserId,
        totalNum:totalNum,
        amount:amount,
        remark:remark,
        detailList:rows
    };
    
    var req = JSON.stringify(reqObj);

    $_jxc.ajax({
        url:contextPath+"/form/overdue/save",
        contentType:'application/json',
        data:req
    },function(result){
        
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
                location.href = contextPath +"/form/overdue/edit/" + result.data.formId;
            });
        }else{
            $_jxc.alert(result['message']);
        }
    });

}


//选择供应商
function selectSupplier(){
    new publicSupplierService(function(data){
        $("#supplierId").val(data.id);
        $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
        $("#deliverTime").val(new Date(new Date().getTime() + 24*60*60*1000*data.diliveCycle).format('yyyy-MM-dd'));
    });
}
function selectOperator(){
    new publicOperatorService(function(data){
        $("#salesmanId").val(data.id);
        $("#operateUserName").val(data.userName);
    });
}

function searchBranch(){
    new publicBranchService(function(data){
        $("#branchId").val(data.branchesId);
        $("#branchName").val("["+data.branchCode+"]"+data.branchName);
        gridHandel.setLoadData([$.extend({},gridDefault)]);
    },0);
}

function toImportproduct(type){
    var branchId = $("#branchId").val();
    if(!branchId){
        $_jxc.alert("请先选择机构");
        return;
    }
    var param = {
        url:contextPath+"/form/overdue/import/list",
        tempUrl:contextPath+"/form/overdue/export/templ",
        type:type,
        branchId:branchId
    };
    new publicUploadFileService(function(data){
    	$.each(data,function(i,val){
        	data[i]["applyDesc"] = "";
            data[i]["applyNum"]=data[i]["applyNum"]||0;
            data[i]["applyPrice"]=data[i]["applyPrice"]||0;
            data[i]["applyAmount"]  = parseFloat(data[i]["applyPrice"]||0)*parseFloat(data[i]["applyNum"]||0);
        });
	    var keyNames = {
	        purchasePrice:'price',
	        id:'skuId',
	        disabled:'',
	        pricingType:'',
	        inputTax:'tax',
	        salePrice:'applyPrice'
	    };
	    var rows = gFunUpdateKey(data,keyNames);

	    var argWhere ={skuCode:1};  //验证重复性
	    var isCheck ={isGift:1 };   //只要是赠品就可以重复
	    var newRows = gridHandel.checkDatagrid(rows,argWhere,isCheck);

	    $("#overdueEditGrid").datagrid("loadData",rows);
        
    },param)
}


function back(){
	location.href = contextPath+"/form/purchase/orderList";
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
        data[i]["largeNum"]  = (parseFloat(data[i]["realNum"]||0)/parseFloat(data[i]["purchaseSpec"])).toFixed(4);
        
        
    });
    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    var argWhere ={skuCode:1};  //验证重复性
    var newRows = gridHandel.checkDatagrid(nowRows,data,argWhere,{});
       
    $("#"+gridHandel.getGridName()).datagrid("loadData",newRows);
    $_jxc.alert("导入成功");
}

