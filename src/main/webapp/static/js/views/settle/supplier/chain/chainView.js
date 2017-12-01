/**
 * Created by 
 * 联营账单-已审核
 */

var url;
var gridName = 'supChainView';

$(function(){
	 var id = $("#formId").val();
	 url = contextPath+"/settle/supplierChain/chainFormDetailList?id="+id;
	 initSupChainView();
})

var gridHandel = new GridClass();
function initSupChainView(){
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        method:'post',
    	url:url,
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:"100%",
        width:'100%',
        columns:[[
            {field:'branchName',title:'机构名称',width: '150px',align:'left',
            	formatter:function(value,row){
            		if(row.isFooter){
            			 return '<div class="ub ub-pc">合计</div> ';
            		}
                    return value;
                }	
            },
            {field:'skuCode',title:'货号',width:'120px',align:'left'},
            {field:'skuName',title:'商品名称',width:'100px',align:'left'},
            {field:'barCode',title:'条码',width:'100px',align:'left'},
            {field:'spec',title:'规格',width:'100px',align:'left'},
            {field:'unit',title:'单位',width:'100px',align:'left'},
            {field:'saleCount',title:'销售数量',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.saleCount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'saleAmount',title:'销售金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.saleAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'supplierRate',title:'联营扣率(%)',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(row.isFooter)return '';
            		if(!value)row.supplierRate = 0;
            		return '<b>'+(parseFloat(value||0)).toFixed(2)+'</b>'
            	}
            },
            {field:'divideAmount',title:'分成金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.divideAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'outputTax',title:'销项税率(%)',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(row.isFooter)return '';
            		if(!value)row.outputTax = 0;
            		return '<b>'+(parseFloat(value||0)).toFixed(2)+'</b>'
            	}
            },
            {field:'taxAmount',title:'税额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.taxAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            }
        ]],
        onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
            updateFooter();
        },
    });
}


//合计
function updateFooter(){
    var fields = {saleCount:0,saleAmount:0,divideAmount:0,taxAmount:0};
    var argWhere = {}
    gridHandel.updateFooter(fields,argWhere);
}


//返回列表页面
function back(){
	location.href = contextPath+"/settle/supplierChain/chainList";
}

//新增联营账单
function addChainForm(){
	toAddTab("新增联营账单",contextPath + "/settle/supplierChain/chainAdd");
}
//导出
function exportOrder(){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/settle/supplierChain/exportSheet?page=SupplierChain&sheetNo='+formId;
}