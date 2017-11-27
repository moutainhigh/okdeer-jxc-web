var dg;
$(function(){
    //开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    //单据状态切换
    changeStatus();
    //初始化列表
    initcombineSplitList();
});
//单据状态切换
function changeStatus(){
	$(".radioItem").change(function(){
		queryForm();
    });
}
var gridHandel = new GridClass();
function initcombineSplitList() {
     dg=$("#combineSplitList").datagrid({
		method : 'post',
		align : 'center',
		url : '',
		singleSelect : false, // 单选 false多选
		rownumbers : true, // 序号
		pagination : true, // 分页
		selectOnCheck:false,
		checkOnSelect:false,
		height : '100%',
		pageSize : 10,
        columns: [[
                {field:'id', title: 'id', hidden:true},
       			{field:'check',checkbox:true},
                {field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
//                	if(row.status  == 0){
//                		var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'组合拆分单详情\',\''+contextPath+'/stock/combineSplit/combineSplitEdit?id='+row.id+'\')">' + value + '</a>';
//                    	return strHtml;
//                	}else if(row.status == 1){
//
//                	}
                	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'组合拆分单详情\',\''+contextPath+'/stock/combineSplit/combineSplitView?id='+row.id+'\')">' + value + '</a>';
                	return strHtml;
                }},
                {field:'status',title: '审核状态', width: '100px', align: 'center',formatter:function(value,row,index){
                	if(value == '0'){
                		return '待审核';
                	}else if(value == '1'){
                		return '审核通过';
                	}else if(value == '2'){
                		return '审核失败';
                	}else{
                		return '未知类型：'+ value;
                	}
                }},
                {field: 'formType', title: '类型', width: '200px', align: 'center',formatter:function(value,row,index){
                	if(value == '1'){
                		return '组合';
                	}else if(value == '2'){
                		return '拆分';
                	}else{
                		return '未知类型：'+ value;
                	}
                }},
    			//{field: 'branchCode', title: '机构编号', width: '200px', align: 'left'},
    			{field: 'branchName', title: '机构名称', width: '220px', align: 'left'},
    			{field: 'amount', title: '单据金额', width: '80px', align: 'right',
    				formatter:function(value,row,index){
                        if(row.isFooter){
                            return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
    			},
                {field: 'createUserName', title: '操作员', width: '130px', align: 'left'},
                {field: 'createTime', title: '操作时间', width: '150px', align: 'left',
    				formatter: function (value, row, index) {
    					if (value) {
    						return new Date(value).format('yyyy-MM-dd hh:mm');
    					}
    					return "";
    				}
    			},
                {field: 'validUserName', title: '审核人', width: '130px', align: 'left'},
                {field: 'remark', title: '备注', width: '200px', align: 'left'}
        ]],
         onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
         }
    });
    queryForm();
}

//新增
function addCombineSplit(){
	toAddTab("新增组合拆分单",contextPath + "/stock/combineSplit/add");
}

//删单
function deleteCombineSplit(){
	var rows = $('#combineSplitList').datagrid('getChecked');
	
	if(rows.length <= 0){
        $_jxc.alert('没有单据可以删除，请选择一笔单据再删除？');
		return;
	}
	var tempIds = [];
	var flag = true;
	var shLength = 0;
	rows.forEach(function(data,index){
		var status = data.status;
    	if(status == 0){
    		tempIds.push(data.id);
	   		flag = false;
    	}
    	
	})
    
    if(flag){
    	$_jxc.alert('已经审核的单据不可以删除！');
    	return;
    }
	
    if(tempIds.length > 0){
        $_jxc.confirm('单据删除后将无法恢复，确认是否删除？',function(r){
            if (r){
            	//删除单据
            	$_jxc.ajax({
                    url: contextPath+"/stock/combineSplit/deleteCombineSplit",
                    data: {"ids":tempIds}
                },function(data){
                	if(data.code == 0){
                        $_jxc.alert(data['message']);
                		queryForm();
                	}
                });
            }
        });
    }
}


//查询
function queryForm(){
	var isValid = $('#searchForm').form('validate');
	if (!isValid) {
		return isValid;
	}
	var oldBranchName = $("#oldBranchName").val();
	var createBranchName = $("#createBranchName").val();
	var oldCreateUserName = $("#oldCreateUserName").val();
	var createUserName = $("#createUserName").val();
	if(oldBranchName && oldBranchName != createBranchName){
		$("#branchId").val('');
	}
	if(oldCreateUserName && oldCreateUserName != createUserName){
		$("#createUserId").val('');
	}
	var fromObjStr = $('#searchForm').serializeObject();
	dg.datagrid('options').method = "post";
	dg.datagrid('options').url = contextPath+'/stock/combineSplit/getCombineSplitList';
	dg.datagrid('load', fromObjStr);
}

/**
 * 机构列表下拉选
 */
function selectBranch (){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#createBranchName").val("["+data.branchCode+"]"+data.branchName);
		$("#oldBranchName").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}
/**
 * 操作员列表下拉选
 */
function selectOperator(){
	new publicOperatorService(function(data){
		//data.Id
		$("#createUserId").val(data.id);
		$("#createUserName").val("["+data.userCode+"]"+data.userName);
		$("#oldCreateUserName").val("["+data.userCode+"]"+data.userName);
	});
}

/**
 * 重置
 */
var resetForm = function(){
	 $("#searchForm").form('clear');
};