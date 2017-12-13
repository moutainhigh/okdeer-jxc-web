/**
 * Created by zhaoly on 2017/5/25.
 */

$(function () {
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));

    initGridBranchCostList();

    $(".radioItem").change(function () {
        queryStoreBusiness();
    })
})

var gridName = "gridStoreBusinessList";
var gridHandel = new GridClass();

function initGridBranchCostList() {
	var updatePermission = $("#updatePermission").html().trim();
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        showFooter:true,
        height:'100%',
        width:'100%',
        fitColumns:true,    //每列占满
        columns:[[
            {field:'formNo',title:'单据编号',width:120,align:'left',
                formatter: function(value,row,index){
                    if (updatePermission) {
                    	return "<a href='#' onclick=\"editHandel('"+row.id+"')\" class='ualine'>"+value+"</a>";
                	}else{
                		return value;
                	}
                }
            },
            {field:'auditStatusStr',title:'审核状态',width:80,align:'left'},
            {field:'branchCode',title:'机构编码',width:120,align:'left'},
            {field:'branchName',title:'机构名称',width:180,align:'left'},
            {field:'month',title:'月份',width:80,align:'right',
            	formatter : function(value, row, index) {
            		var month = value+"";
            		return month.substr(0,4)+"-"+month.substr(4,5);
            	},
            },
            {field:'createUserName',title:'制单人',width:120,align:'left'},
            {field:'createTime',title:'制单时间',width:120,align:'left',
            	formatter : function(value, rowData, rowIndex) {
            		return formatDate(value);
            	}
            },
            {field:'auditUserName',title:'审核人',width:120,align:'left'},
            {field:'remark',title:'备注',width:200,align:'left'},
        ]]
    })
    queryStoreBusiness();
}

/**
 * 机构名称
 */
function selectListBranches(){
    new publicAgencyService(function(data){
        $("#branchId").val(data.branchId);
        $("#branchName").val("["+data.branchCode+"]" + data.branchName);
    },'BF','');
}

/**
 * 操作员列表下拉选
 */
function selectOperator(){
    new publicOperatorService(function(data){
        //data.Id
        $("#createUserId").val(data.id);
        $("#createUserName").val("["+data.userCode+"]"+data.userName);
    });
}

function queryStoreBusiness() {
    $("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/finance/storeBusiness/getStoreBusinessList';
    $("#"+gridName).datagrid("load");
}

function storeBusinessAdd() {
    toAddTab("新增门店经营数据",contextPath + "/finance/storeBusiness/toAdd");
}

function editHandel(formId) {
    toAddTab("门店经营数据",contextPath + "/finance/storeBusiness/toEdit?formId="+formId);
}

function storeBusinessDelete() {
	var dg = $("#"+gridName);
	var row = dg.datagrid("getChecked");
	if(row.length <= 0){
		$_jxc.alert('未选择要删除的数据！');
		return;
	}
	var ids = [];
	for(var i=0; i<row.length; i++){
		ids.push(row[i].id);
	}
	$_jxc.confirm('是否要删除选中数据',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/finance/storeBusiness/deleteStoreBusiness",
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

