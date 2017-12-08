/**
 * Created by zhaoly on 2017/5/25.
 */

$(function () {
    
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    
    $(".radioItem").change(function () {
        queryStoreCharge();
    });
    
    initGridBranchCostList();
    
    $('#branchComponent').branchSelect();
    
    $('#createUserComponent').operatorSelect({
    	onAfterRender : function(data) {
			$("#operateUserId").val(data.id);
			$("#operateUserName").val(data.userName);
		}
    });

    $('#supplierComponent').supplierSelect({
    	param:{  queryType:'ALL'},
        onAfterRender:function(data){
            $("#supplierId").val(data.id);
        }
    })
    
})

var gridName = "gridBuldChargeList";
var gridHandel = new GridClass();

function initGridBranchCostList() {
	var updatePermission = $("#updatePermission").html().trim();
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        showFooter:false,
        height:'100%',
        width:'100%',
        fitColumns:true,    //每列占满
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单号',width:100,align:'left',
                formatter: function(value,row,index){
                    if (updatePermission) {
                    	return "<a href='#' onclick=\"editHandel('"+row.id+"')\" class='ualine'>"+value+"</a>";
                	}else{
                		return value;
                	}
                }
            },
            {field:'auditStatusStr',title:'审核状态',width:80,align:'center'},
            {field:'branchCode',title:'机构编码',width:80,align:'left'},
            {field:'branchName',title:'机构名称',width:180,align:'left'},
            {field:'sumAmount',title:'单据金额',width:80,align:'right',
                formatter : function(value, row, index) {
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'supplierCode',title:'供应商编码',width:60,align:'left'},
            {field:'supplierName',title:'供应商名称',width:80,align:'left'},
            {field:'createUserName',title:'制单人',width:120,align:'left'},
            {field:'createTimeStr',title:'制单时间',width:120,align:'left'},
            {field:'auditUserName',title:'审核人',width:120,align:'left'},
            {field:'remark',title:'备注',width:200,align:'left'},
        ]]
    })
    queryStoreCharge();
}

function queryStoreCharge() {
	var formData = $('#queryForm').serializeObject();
    $("#"+gridName).datagrid("options").queryParams = formData;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/finance/buildCharge/getBuildChargeList';
    $("#"+gridName).datagrid("load");
}

function storeChargeAdd() {
    toAddTab("新增建店费用",contextPath + "/finance/buildCharge/toAdd");
}

function editHandel(formId) {
    toAddTab("建店费用详情",contextPath + "/finance/buildCharge/toEdit?formId="+formId);
}

function delChargeOrder() {
    var rows = $("#"+gridName).datagrid("getChecked");
    if(rows.length <= 0){
        $_jxc.alert('请勾选数据！');
        return;
    }

    var ids='';
    $.each(rows,function(i,v){
        ids+=v.id+",";
    });

    $_jxc.confirm('是否要删除选中数据?',function(data){
        if(data) {
            var param = {
                url: contextPath + "/finance/buildCharge/todel",
                data: {
                    ids: ids
                }
            }

            $_jxc.ajax(param, function (result) {
                queryStoreCharge();
                if (result['code'] == 0) {
                    $_jxc.alert("删除成功");
                } else {
                    $_jxc.alert(result['message']);

                }
            });
        }

    })
}