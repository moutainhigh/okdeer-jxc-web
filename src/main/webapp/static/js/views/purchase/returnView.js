/**
 * Created by huangj02 on 2016/8/9.
 */
$(function(){
    initDatagridEditOrder();
    
    var refFormNo = $("#refFormNo").html();
    if(refFormNo){
    	var type = refFormNo.substr(0,2);
    	if(type == 'PI'){
    		$("#refFormNoType").html("收货单");
    	}else if(type == 'DI'){
    		$("#refFormNoType").html("直调入库单");
    	}
    }else{
    	$("#refFormNoType").html("无");
    }
    if($("#close").val()){
    	$("#addButton").addClass("unhide");
    	$("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
    }
});
var gridHandel = new GridClass();
function initDatagridEditOrder(){
	var formId = $("#formId").val();

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
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'realNum',title:'数量',width:'80px',align:'right',
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
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },

            {field:'tax',title:'税率',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
                    if(row.isFooter){
                        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    row.taxAmount = (row.tax*(row.amount/(1+parseFloat(row.tax)))||0.00).toFixed(2);
                    return  '<b>'+row.taxAmount+'</b>';
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
        }
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("gridEditOrder",["price","amount","taxAmount"])
    }
}


function returnAdd(){
	toAddTab("新增采购退货单",contextPath + "/form/purchase/returnAdd");
}

//返回列表页面
function back(){
	location.href = contextPath+"/form/purchase/returnList";
}


