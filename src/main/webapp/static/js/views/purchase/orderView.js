/**
 * Created by huangj02 on 2016/8/9.
 */
$(function(){
    initQueryData();
    initDatagridEditOrder();
    if($("#close").val()){
    	$("#addButton").addClass("unhide");
    	$("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
    }
});




function initQueryData(){
    var formId = $("#formId").val();
    $_jxc.ajax({
        url:contextPath+"/form/purchase/detailList?formId="+formId
    },function(result){
        if(result && result.list.length > 0){
            selectStockAndPrice(result.list);
        }
    });
}

//查询周销售量 和 月销量
function selectStockAndPrice(data){
    var GoodsStockVo = {
		
		branchId : $("#branchId").val(),
        fieldName : 'id',
        branchType :  $("#branchType").val(),
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

var gridHandel = new GridClass();
var gridName= "gridEditOrder";
function initDatagridEditOrder(){

    gridHandel.setGridName("gridEditOrder");
    $("#gridEditOrder").datagrid({
    	// url:contextPath+"/form/purchase/detailList?formId="+formId,
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        columns:[[
            {field:'skuCode',title:'货号',width:'70px',align:'left',
                formatter : function(value, row,index) {
                    var str = value;
                    if(row.isFooter){
                        str ='<div class="ub ub-pc">合计</div> '
                    }
                    return str;
                },
            },
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
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'realNum',title:'数量',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'untaxedPrice',title:'不含税单价',width:'100px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return ;
            		}
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            },
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'untaxedAmount',title:'不含税金额',width:'100px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            		}
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            },
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'isGift',title:'是否赠品',width:'80px',align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    return value=='1'?'是':(value=='0'?'否':'请选择');
                },
            },

            {field:'salePrice',title:'销售价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },

            {field:'tax',title:'税率',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
                    if(row.isFooter){
                        return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
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
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });
    if(hasCostPrice==false){
        priceGrantUtil.grantCostPrice(gridName,["price","amount","taxAmount","untaxedPrice","untaxedAmount"])
    }
}
//合计
function updateFooter(){
    var fields = {largeNum:0,realNum:0,amount:0,taxAmount:0,isGift:0,untaxedAmount:0 };
    var argWhere = {name:'isGift',value:""}
    gridHandel.updateFooter(fields,argWhere);
}

function back(){
	location.href = contextPath+"/form/purchase/orderList";
}

function orderAdd(){
	toAddTab("新增采购订单",contextPath + "/form/purchase/orderAdd");
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
	    				location.href = contextPath +"/form/purchase/orderEdit?formId=" + id;
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

function exportDetail(){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/form/purchase/exportSheet?page=PASheet&sheetNo='+formId;
}
