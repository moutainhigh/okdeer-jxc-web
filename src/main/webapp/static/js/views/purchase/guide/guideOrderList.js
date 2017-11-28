//采购向导 第三步
var gridHandel = new GridClass();
$(function(){
	initdgOrderList();
})


function initdgOrderList(){
	gridHandel.setGridName("dgGuideOrderList");
	var guideNo = $("#guideNo").val();
	if(!guideNo){
		$_jxc.alert("数据异常！");
		return;
	}
	
	$("#dgGuideOrderList").datagrid({
        method:'post',
        align:'center',
        url:contextPath+'/form/purchaseGuide/getOrderList',
        queryParams:{
        	guideNo:guideNo
        },
//        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        //pagination:true,    //分页
        //pageSize:10,
        //fitColumns:true,    //每列占满
        fit:true,            //占满
        showFooter:true,
        columns:[[
			{field:'ck',checkbox:true},
        	{field:'formNo',title:'订单单号',width:180,align:'left',
				formatter:function(value,row,index){
	            	if(updatePermission){
	            		var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购详细\',\''+contextPath+'/form/purchase/orderEdit?formId='+row.formId+'\')">' + value + '</a>';
	            		return strHtml;
	            	}else{
	            		return value;
	            	}
	            }
        	},
            {field:'statusStr',title:'状态',width:80,align:'left'},
            {field:'supplierName',title:'供应商',width:150,align:'left'},
            {field:'branchName',title:'收货机构',width:150,align:'center'},
            {field:'untaxedAmount',title:'不含税单据金额',width:120,align:'left'},
            {field:'amount',title:'单据金额',width:120,align:'left'},
            {field:'createTime',title:'制单时间',width:150,align:'left',
            	formatter : function(value, rowData, rowIndex) {
            		return formatDate(value);
            	}
            },
            {field:'remark',title:'备注',width:120,align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[20]},
                    }
                }
			}
        ]],

        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
            
        }
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("dgGuideOrderList",["amount","untaxedAmount"])
    }
}

function chekData(){
	var rows =$("#dgGuideOrderList").datagrid("getChecked");
	if(rows.length==0){
		$_jxc.alert("请选择行数据！");
		return null;
	}
	var formIds='';
    $.each(rows,function(i,v){
    	formIds+=v.formId+",";
    });

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }
    
    $_jxc.confirm('确认审核所有所选数据？',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/purchase/batchCheck",
		    	type:"POST",
		    	data:{
		    		formIds:formIds,
		    		status : 1
		    	}
		    },function(result){
	    		$_jxc.alert(result.message, function(){
	    			$("#dgGuideOrderList").datagrid('reload');	
	    		});
		    });
		}
	});
    
}


function delData(){
	var rows =$("#dgGuideOrderList").datagrid("getChecked");
	if(rows.length==0){
		$_jxc.alert("请选择行数据！");
		return null;
	}
	var formIds='';
    $.each(rows,function(i,v){
    	formIds+=v.formId+",";
    });
	
	$_jxc.confirm('是否要删除选中数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/purchase/delete",
		    	data:{
		    		formIds:formIds
		    	}
		    },function(result){
	    		$_jxc.alert(result.message,function(){
	    			$("#dgGuideOrderList").datagrid('reload');
	    		});
		    });
		}
	});
}

function finish(){
	window.location = contextPath+'/form/purchaseGuide/toGuideForm';
}
