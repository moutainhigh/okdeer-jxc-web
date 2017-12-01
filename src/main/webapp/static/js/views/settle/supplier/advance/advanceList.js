/**
 * Created by zhanghuan on 2016/8/30.
 * 新增供应商预付款
 */

$(function(){

	//机构选择初始化
	$('#branchComponent').branchSelect();
	
	//供应商选择初始化
	$('#supplierComponent').supplierSelect({
		//数据过滤
		loadFilter:function(data){
			data.supplierId = data.id;
			return data;
		}
	});
	
	//供应商选择初始化
	$('#operatorComponent').operatorSelect({
		//数据过滤
		loadFilter:function(data){
			data.createUserId = data.id;
			return data;
		}
	});
	
	//开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    initsupAdvMonList();
    branchId = $("#branchId").val();
//    if(getUrlQueryString('message')=='0'){
//    	queryForm();
//    }
    //默认执行查询
    queryForm();
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



var targetBranchId;
var gridHandel = new GridClass();
var datagirdID = 'supplierAdvMoneyList'
//初始化表格
function initsupAdvMonList(){
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
			{field: 'check',checkbox:true},
            {field: 'formNo',title:'单据编号',width:'130px',align:'left',formatter:function(value,row,index){
            	var strHtml = '';
            	if(row.auditStatus == 1){
            		strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商预付款明细\',\''+ contextPath +'/settle/supplierCharge/advanceView?id='+ row.id +'\')">' + value + '</a>';
            	}else{
            		strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商预付款明细\',\''+ contextPath +'/settle/supplierCharge/advanceEdit?id='+ row.id +'\')">' + value + '</a>';
            	}
        		return strHtml;
            }},
            {field: 'auditStatus',title: '审核状态', width: '80px', align: 'center',
            	formatter:function(value,row,index){
            		return value == '1'?'已审核':'未审核';
            	}
            },
			{field: 'branchCode', title: '机构编号', width: '100px', align: 'left'},
			{field: 'branchName', title: '机构名称', width: '140px', align: 'left'},
			{field: 'supplierCode', title: '供应商编号', width: '140px', align: 'left'},
			{field: 'supplierName', title: '供应商名称', width: '140px', align: 'left'},
			{field: 'sumAmount', title: '单据金额', width: '100px', align: 'right',
				formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }
			},
            {field: 'createUserName', title: '制单人', width: '120px', align: 'left'},
            {field: 'createTime', title: '制单时间', width: '120px', align: 'left',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}
			},
			{field: 'auditUserName', title: '审核人', width: '120px', align: 'left'},
			{field: 'remark', title: '备注', width: '200px', align: 'left'}
			
        ]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });

}

//新增新增供应商预付款
function addSupAdvMonForm(){
	toAddTab("新增供应商预付款",contextPath + "/settle/supplierCharge/advanceAdd");
}


//查询新增供应商预付款
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)
    fromObjStr.createUserName = fromObjStr.createUserName.substring(fromObjStr.createUserName.lastIndexOf(']')+1)
    fromObjStr.supplierName = fromObjStr.supplierName.substring(fromObjStr.supplierName.lastIndexOf(']')+1)

	$("#"+datagirdID).datagrid("options").method = "post";
	$("#"+datagirdID).datagrid('options').url = contextPath + '/settle/supplierCharge/getChargeList';
	$("#"+datagirdID).datagrid('load',fromObjStr);
}

//删除
function delSupAdvMonForm(){
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
	$_jxc.confirm('是否要删除选中数据?',function(data){
		if(data){
        	$_jxc.ajax({
                url: contextPath+"/settle/supplierCharge/deleteChargeForm",
                data: {"ids":ids}
            },function(result){
            	if(result['code'] == 0){
            		$_jxc.alert("删除成功");
            		queryForm();
            	}else{
            		$_jxc.alert(result['message']);
            	}
            });
		}
	});
}


/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};

