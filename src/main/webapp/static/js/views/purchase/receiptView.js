/**
 * Created by huangj02 on 2016/8/9.
 */
$(function(){
    initDatagridEditOrder();
    
    var saleWay = $("#saleWay").val();
	if(saleWay == 'A'){
		$("#saleWayName").html("购销");
	}else if(saleWay == 'B'){
		$("#saleWayName").html("代销");
	}else if(saleWay == 'C'){
		$("#saleWayName").html("联营");
	}else if(saleWay == 'D'){
		$("#saleWayName").html("扣率代销");
	}else{
		$("#saleWayName").val(data.saleWay);
	}
	 if($("#close").val()){
		$("#addButton").addClass("unhide");
    	$("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
     }
});
var gridHandel = new GridClass();
function initDatagridEditOrder(){
	var formId = $("#formId").val();
    gridHandel.setGridName("gridEditOrder");
    $("#gridEditOrder").datagrid({
        //title:'普通表单-用键盘操作',
//        method:'get',
    	url:contextPath+"/form/purchase/detailList?formId="+formId,
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        height:'100%',
        //pagination:true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        columns:[[
            //{field:'ck',checkbox:true},
            //{field:'cz',title:'操作',width:100,align:'center',
            //    formatter : function(value, row,index) {
            //        var str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
            //            '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
            //        return str;
            //    },
            //},
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
            {field:'untaxedPrice',title:'不含税单价',width:'80px',align:'right',
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
            {field:'untaxedAmount',title:'不含税金额',width:'80px',align:'right',
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
            {field:'goodsCreateDate',title:'生产日期',width:'150px',align:'center', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                }
                return "";
            }},
            {field:'goodsExpiryDate',title:'有效期',width:'150px',align:'center', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                }
                return "";
            }},
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("gridEditOrder",["price","amount","taxAmount","untaxedPrice","untaxedAmount"])
    }
}
//合计
function updateFooter(){
    var fields = {largeNum:0,realNum:0,amount:0,taxAmount:0,isGift:0,untaxedAmount:0 };
    var argWhere = {name:'isGift',value:""}
    gridHandel.updateFooter(fields,argWhere);
}

function receiptAdd(){
	toAddTab("新增采购收货单",contextPath + "/form/purchase/receiptAdd");
}


//返回列表页面
function back(){
	location.href = contextPath+"/form/purchase/receiptList";
}

function exportDetail(param){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/form/purchase/exportSheet?page=PAForm&sheetNo='+formId;
}

// 成本调价
function toCostAdjust() {
    $_jxc.ajax({
        url: contextPath + "/form/purchase/ref/count",
        data: {
            formNo: $("#formNo").val()
        }
    }, function (data) {
        if (data.code == 0) {
            var formId = $("#formId").val();
            toAddTab("新增采购成本调价", contextPath + "/purchase/cost/form/add?formId=" + formId);
        } else {
            $_jxc.alert("该单据已经调过价");
        }
    });

}