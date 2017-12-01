/**
 * Created by zhanghuan on 2016/8/30.
 * 新增加盟店毛利结算
 */

var gridHandel = new GridClass();
var datagirdID = 'profitSettList';

$(function(){
	serviceType = $('#serviceType').val();
	//开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    initProfitSetList();
    queryForm();
    
	 //机构选择初始化
	$('#branchComponent').branchSelect({
		//ajax参数
		param:{
			branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B
		},
		//选择完成之后
		onAfterRender:function(data){
			$('#branchId').val(data.branchId);
		}
	});	
	
	//制单人选择初始化
	$('#operatorComponent').operatorSelect({
		//数据过滤
		loadFilter:function(data){
			data.createUserId = data.id;
			return data;
		}
	});
    	
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



//初始化表格
function initProfitSetList(){
    $("#"+datagirdID).datagrid({
        method:'post',
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,         //占满
        showFooter:true,
		height:'100%',
		width:'100%',
		pageSize:50,
        columns:[[
                {field:'cb',checkbox:true},
                {field: 'formNo', title: '单据编号', width: '140', align: 'left',
                	formatter:function(value,row,index){
                    	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'加盟店毛利结算明细\',\''+ contextPath +'/settle/franchiseProfitSettle/settleEdit?id='+ row.id +'\')">' + value + '</a>';
                		return strHtml;
                    }
                },
                {field: 'auditStatus',title: '审核状态', width: '80', align: 'center',
                	formatter:function(value,row,index){
                		return value == '1'?'已审核':'未审核';
                	}
                },
      			{field: 'franchiseBranchCode', title: '加盟店编号', width: '140', align: 'left'},
    			{field: 'franchiseBranchName', title: '加盟店名称', width: '140', align: 'left'},
    			{field: 'profitAmount', title: '毛利', width: '100', align: 'right',
    				formatter:function(value,row,index){
    					if(row.isFooter){
                            return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
    				}
    			},
    			{field: 'targetProfitAmount', title: '公司应得毛利', width: '100', align: 'right',
    				formatter:function(value,row,index){
    					if(row.isFooter){
                            return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
    				}
    			},
    			{field: 'franchiseProfitAmount', title: '加盟店应得毛利', width: '100', align: 'right',
    				formatter:function(value,row,index){
    					if(row.isFooter){
                            return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
    				}
    			},
    			{field: 'settleTimeStart', title: '结算日期起', width: '120', align: 'center',
    				formatter: function (value, row, index) {
    					if (value) {
    						return new Date(value).format('yyyy-MM-dd');
    					}
    					return "";
    				}
    			},
    			{field: 'settleTimeEnd', title: '结算日期止', width: '120', align: 'center',
    				formatter: function (value, row, index) {
    					if (value) {
    						return new Date(value).format('yyyy-MM-dd');
    					}
    					return "";
    				}
    			},
                {field: 'createUserName', title: '制单人', width: '80', align: 'left'},
                {field: 'createTime', title: '制单时间', width: '120', align: 'center',
    				formatter: function (value, row, index) {
    					if (value) {
    						return new Date(value).format('yyyy-MM-dd hh:mm');
    					}
    					return "";
    				}
    			},
    			{field: 'auditUserName', title: '审核人', width: '130', align: 'left'},
    			{field: 'auditTime', title: '审核时间', width: '120', align: 'center',
    				formatter: function (value, row, index) {
    					if (value) {
    						return new Date(value).format('yyyy-MM-dd hh:mm');
    					}
    					return "";
    				}
    			},
    			{field: 'remark', title: '备注', width: '200', align: 'left'}
            ]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });

}

//新增新增加盟店毛利结算
function addProfitSetForm(){
	toAddTab("新增加盟店毛利结算",contextPath + "/settle/franchiseProfitSettle/settleAdd");
}


//查询新增加盟店毛利结算
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();

	$("#"+datagirdID).datagrid("options").method = "post";
	$("#"+datagirdID).datagrid('options').url = contextPath + '/settle/franchiseProfitSettle/getSettleList';
	$("#"+datagirdID).datagrid('load', fromObjStr);
}

//删除
function delProfitSetForm(){
	var dg = $("#"+datagirdID);
	var row = dg.datagrid("getChecked");
	if(row.length <= 0){
		$_jxc.alert('提示','未选择要删除的单据！');
		return;
	}
	var ids = [];
	for(var i=0; i<row.length; i++){
		ids.push(row[i].id);
	}
	$_jxc.confirm('是否要删除选中数据',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/settle/franchiseProfitSettle/settleDelete",
                data: {"ids":ids}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("删除成功");
	    			dg.datagrid('reload');
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}
	
//打印
function printDesign(){
     var dg = $("#gridRequireOrders");
     var row = dg.datagrid("getSelected");
     if(rowIsNull(row)){
           return null;
     }
     //弹出打印页面
     parent.addTabPrint('PASheet' + row.id,row.formNo+'单据打印',contextPath + '/printdesign/design?page=PASheet&controller=/form/purchase&template=-1&sheetNo=' + row.id + '&gridFlag=PAGrid','');
}

/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};

