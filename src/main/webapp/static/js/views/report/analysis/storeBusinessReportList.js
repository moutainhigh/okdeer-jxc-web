/*----------门店利润报表-------------------*/
$(function(){
	//开始和结束时间
    $("#month").val(dateUtil.getPreMonthDate().format("yyyy-MM"));
    
	 //机构选择初始化，只查询总部和分公司
	$('#branchSelect').branchSelect({
		//ajax参数
		param:{
			branchTypesStr:$_jxc.branchTypeEnum.HEAD_QUARTERS + ',' + $_jxc.branchTypeEnum.BRANCH_COMPANY
		}
	});	
    
    initDataStoreExpendDetailReport();
});

var datagridKey = 'gridStoreBusinessReport';
var gridHandel = new GridClass();
var inited = false;
var queryColumns = [];

//初始化表格
function initDataStoreExpendDetailReport(){
	gridHandel.setGridName(datagridKey);
	
	dg = $("#"+datagridKey).datagrid({
        align:'right',
        singleSelect:true,  //单选  false多选
        rownumbers:false,    //序号
        pagination:false,    //分页
        showFooter:false,
		height:'100%',
		width:'100%',
		url:"",
		columns:queryColumns,
        onLoadSuccess:function(data){
        	if(data.rows.length < 1) {
        		$(this).datagrid('reloadFooter',[])
        		return;
        	}
        	gridHandel.setDatagridHeader("center");
        	//updateFooter();
        }       
    });
	inited = true;
   // queryForm();
	
}

function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	
	var param = {
        url :contextPath+"/report/storeBusiness/getColumns",
        data:fromObjStr
    }

    $_jxc.ajax(param,function (result) {
        if(result.code == 0){
        	if(!result.data){
        		return;
        	}
        	
        	var flg = result.flg;
        	if(flg === true){
        		$_jxc.alert("店铺数据较多，只展示20个店铺数据，如需查看所有请导出excel查看。");
        	}
        	
        	queryColumns = eval("(" + result.data + ")");
        	
        	initDataStoreExpendDetailReport();
        	
        	$("#"+datagridKey).datagrid("options").method = "post";
        	$("#"+datagridKey).datagrid('options').url = contextPath + '/report/storeBusiness/getList';
        	$("#"+datagridKey).datagrid('load', fromObjStr);
        }else{
        	queryColumns = [];
        	initDataStoreExpendDetailReport();
        	$("#"+datagridKey).datagrid('loadData', []);
            $_jxc.alert("店铺数据为空!");
        }
    });
	
}

function exportData(){
	if(inited == false){
		$_jxc.alert("请先查询数据");
		return;
	}
		
	var length = $("#"+datagridKey).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	$("#queryForm").attr("action",contextPath+"/report/storeBusiness/exportList");
	$("#queryForm").submit();
}
