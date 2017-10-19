/**
 * Created by zhanghuan on 2016/08/09.
 */
var dg;
$(function(){
    //开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    //单据状态切换
    changeStatus();
    //初始化列表
    initModifyPriceGrid();
    modifyPriceOrderCx();

    //操作人
    $('#operatorComponent').operatorSelect({
        //数据过滤
        loadFilter:function(data){
            data.createUserId = data.id;
            return data;
        }
    });
    
});

//单据状态切换
function changeStatus(){
	$(".radioItem").change(function(){
		modifyPriceOrderCx();
    });
}
var gridHandel = new GridClass();
function initModifyPriceGrid() {
     dg=$("#modifyPriceGrid").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        url: '',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: true,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
         height:'100%',
         pageSize:20,
        //showFooter:true,
        columns: [[
            {field: 'formNo', title: '单号', width: '135px', align: 'left',
                formatter: function(value,row,index){
                	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看调价单详细\',\''+contextPath+'/goods/priceAdjust/showDetail?formNo='+value+'\')">' + value + '</a>';
                	return strHtml;
                }
            },
            {field: 'status', title: '审核状态', width:'90px', align: 'left',
                formatter: function(value,row,index){
                    if (value==1){
                        return "已审核";
                    } else {
                        return "未审核";
                    }
                }
            },
            {field: 'effectDate', title: '生效日期', width: '120px', align: 'left',
                formatter: function (value, row, index) {
                    if (value != null && value != '') {
                        var date = new Date(value);
                        return date.format("yyyy-MM-dd hh:mm");
                    }
                    return "";
                }
            },
            /*{field: 'branchAreaCode', title: '区域编码', width: '100px', align: 'left'},
            {field: 'branchAreaName', title: '区域名称', width: '90px', align: 'left'},*/
            {field: 'createUserName', title: '制单员', width: '120px', align: 'left'},
            {field: 'createTime', title: '制单时间', width: '120px', align: 'left',
            	formatter: function (value, row, index) {
	                if (value != null && value != '') {
	                    var date = new Date(value);
	                    return date.format("yyyy-MM-dd hh:mm");
	                }
	                return "";
	            }
            },
            {field: 'validUserName', title: '审核人', width: '160px', align: 'left'},
            {field: 'remark', title: '备注', width: '160px', align: 'left'},
            {field: 'createBranchName', title: '制单机构', width: '100px', align: 'left'}
        ]],
         onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
         }
    });
}
//新增
function addModifyDataGrid(){
	toAddTab("新增调价单",contextPath + "/goods/priceAdjust/addFormView");
}

//删单
function delModifyOrderDialog(){
	var row = $('#modifyPriceGrid').datagrid('getSelected');
	var rowIndex = $('#modifyPriceGrid').datagrid('getRowIndex',row);
	if(row!=null&&row.status==1){
		 $_jxc.alert('已经审核的单据不可以删除！');
		return;
	}
    if(datagridUtil.isSelectRows()){
        $_jxc.confirm('单据删除后将无法恢复，确认是否删除？',function(r){
            if (r){
            	//删除单据
//            	gFunStartLoading();
            	$_jxc.ajax({
                    url: contextPath+"/goods/priceAdjust/removeForm",
                    data: {"formNo":row.formNo}
                },function(data){
//                	gFunEndLoading();
                    $('#modifyPriceGrid').datagrid('deleteRow', rowIndex);
                });
            }
        });
    }
}

//datagridId datagrid的Id
var datagridId = "modifyPriceGrid";
//datagrid的常用操作方法
var datagridUtil = {
    isSelectRows:function(){
        if($("#"+datagridId).datagrid("getSelections").length <= 0){
            $_jxc.alert('没有单据可以删除，请选择一笔单据再删除？');
            return false;
        }else{
            return true;
        }
    }
}

//查询
function modifyPriceOrderCx(){
	var isValid = $('#searchForm').form('validate');
	if (!isValid) {
		return isValid;
	}
	var fromObjStr = $('#searchForm').serializeObject();
	dg.datagrid('options').method = "post";
	dg.datagrid('options').url = contextPath+'/goods/priceAdjust/queryByCondition';
	dg.datagrid('load', fromObjStr);
}

/**
 * 导出
 */
/*function exportData(){
	var isValid = $("#searchForm").form('validate');
	if(!isValid){
		return isValid;
	}
	var length = $("#modifyPriceGrid").datagrid('getData').total;
	console.info($("#searchForm").serializeObject());
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	if(length > exportMaxRow){
		$_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#searchForm").attr("action",contextPath+'/goods/priceAdjust/exportList');
	$("#searchForm").submit();	
}*/
/**
 * 机构列表下拉选
 */
function selectBranch (){
	new publicAgencyService(function(data){
		$("#createBranchId").val(data.branchesId);
		$("#createBranchName").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}


/**
 * 重置
 */
var resetForm = function(){
	 $("#searchForm").form('clear');
};