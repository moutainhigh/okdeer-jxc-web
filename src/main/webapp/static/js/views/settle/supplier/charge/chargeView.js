/**
 * Created by 
 * 供应商预付款-新增 修改
 */

//默认数据
var gridDefault = {
		amount:0,
		io:-1
}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "supChargeListView";


$(function(){
	var formId = $("#formId").val();
	url = contextPath+"/settle/supplierCharge/chargeFormDetailList?formId="+formId;
	initChageListView();
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
function initChageListView(){
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        method:'get',
    	url:url,
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:"100%",
        width:'100%',
        columns:[[
            {field:'id',hidden:'true'},
            {field:'value',title:'编号',width: '100px',align:'left',
            	formatter:function(value,row){
            		if(row.isFooter){
            			 return '<div class="ub ub-pc">合计</div> ';
            		}
                    return value;
                }	
            },
            {field:'label',title:'名称',width:'200px',align:'left'},
            {field:'io',title:'收支方式',width:'80px',align:'center',
            	formatter:function(value,row){
            		if(row.isFooter){
            			return "";
            		}
                    return value=='-1'?'支出':(value=='1'?'收入':'请选择');
                },
            },
            {field:'amount',title:'费用金额',width:'100px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!row.amount){
                    	row.amount = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'remark',title:'备注',width:'250px',align:'left'}
        ]],
        onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
            updateFooter()
        },
    });
    
}
//合计
function updateFooter(){
    var fields = {amount:0};
    var argWhere = {}
    gridHandel.updateFooter(fields,argWhere);
}

//导出
function exportOrder(){
	
}

//返回列表页面
function back(){
	location.href = contextPath+"/settle/supplierCharge/chargeList";
}

//新增供应商预付款
function addSupAdvMonForm(){
	toAddTab("新增供应商预付款",contextPath + "/settle/supplierCharge/chargeAdd");
}
//导出
function exportOrder(){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/settle/supplierCharge/exportSheet?page=SupplierCharge&sheetNo='+formId;
}