/**
 * Created by zhanghuan on 2016/8/30.
 * 供应商对账单列表
 */
$(function(){
	//开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    initsupChkAccountList();
    branchId = $("#branchId").val();
    if(getUrlQueryString('message')=='0'){
    	queryForm();
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



var branchId;
var gridHandel = new GridClass();
var datagirdID = 'supperlierChkAccount'
//初始化表格
function initsupChkAccountList(){
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
			{field:'check',checkbox:true},
            {field:'formNo',title:'单据编号',width:'130px',align:'left',formatter:function(value,row,index){
            	var strHtml = '';
            	if(row.auditStatus == 1){
            		strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商对账明细\',\''+ contextPath +'/settle/supplierCheck/checkView?id='+ row.id +'\')">' + value + '</a>';
            	}else{
            		strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商对账明细\',\''+ contextPath +'/settle/supplierCheck/checkEdit?id='+ row.id +'\')">' + value + '</a>';
            	}
        		return strHtml;
            }},
            {field:'auditStatus',title: '审核状态', width: '100px', align: 'center',
            	formatter:function(value,row,index){
            		return value == '1'?'已审核':'未审核';
            	}
            },
			{field: 'branchCode', title: '机构编号', width: '100px', align: 'center'},
			{field: 'branchName', title: '机构名称', width: '140px', align: 'left'},
			{field: 'supplierCode', title: '供应商编号', width: '140px', align: 'left'},
			{field: 'supplierName', title: '供应商名称', width: '140px', align: 'left'},
			{field: 'payableAmount', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
			},
            {field: 'createUserName', title: '制单人员', width: '80px', align: 'left'},
            {field: 'createTime', title: '制单时间', width: '100px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd');
					}
					return "";
				}
			},
			{field: 'auditUserName', title: '审核人员', width: '130px', align: 'left'},
			{field: 'remark', title: '备注', width: '200px', align: 'left'}
			
        ]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });

}

//新增供应商对账单
function addSupChkAccount(){
	toAddTab("新增供应商对账单",contextPath + "/settle/supplierCheck/checkAdd");
}

function clearBranchCode(obj,branchId){
	var branchName = $(obj).val();
	//如果修改名称
	if(!branchName || 
			(branchName && branchName.indexOf("[")<0 && branchName.indexOf("]")<0)){
		$("#" + branchId +"").val('');
	}
}
//查询新增供应商对账单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.targetBranchName = fromObjStr.targetBranchName.substring(fromObjStr.targetBranchName.lastIndexOf(']')+1)
    fromObjStr.operateUserName = fromObjStr.operateUserName.substring(fromObjStr.operateUserName.lastIndexOf(']')+1)

	$("#"+datagirdID).datagrid("options").method = "post";
	$("#"+datagirdID).datagrid('options').url = contextPath + '/settle/supplierCheck/getCheckList';
	$("#"+datagirdID).datagrid('load', fromObjStr);
}

//删除
function delSupChkAccount(){
	var dg = $("#"+datagirdID);
	var row = dg.datagrid("getChecked");
	if(row.length <= 0){
		$_jxc.alert('未选择要删除的单据！');
		return;
	}
	var ids = [];
	for(var i=0; i<row.length; i++){
		ids.push(row[i].id);
	}
	$_jxc.confirm('是否要删除选中数据',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/settle/supplierCheck/deleteCheckForm",
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

//选择供应商
function selectSupplier(){
    new publicSupplierService(function(data){
    	$("#supplierId").val(data.id);
        $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);	
    });
}
/**
 * 操作员
 */
function selectOperator(){
	new publicOperatorService(function(data){
		$("#operateUserId").val(data.id);
		$("#operateUserName").val("["+data.userCode+"]"+data.userName);
	});
}
/**
 * 机构
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
	},'',branchId);
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

