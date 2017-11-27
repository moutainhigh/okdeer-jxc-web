/*----------门店利润报表-------------------*/
$(function(){
	//开始和结束时间
    $("#rptDate").val(dateUtil.getPreMonthDate().format("yyyy-MM"));
    
    $('#branchSelect').branchSelect({
    	param:{
    		// 不包括总部、仓库
			branchTypesStr:	$_jxc.branchTypeEnum.BRANCH_COMPANY + ',' + 
							$_jxc.branchTypeEnum.OWN_STORES + ',' + 
							$_jxc.branchTypeEnum.FRANCHISE_STORE_B + ',' + 
							$_jxc.branchTypeEnum.FRANCHISE_STORE_C
		}
    });
    
    initDataStoreExpendDetailReport();
});

var datagridKey = 'gridStoreProfitReport';
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
	 if($("#branchCodeName").val()==""){
	    $_jxc.alert("请选择机构");
	    return;
	 } 
	var fromObjStr = $('#queryForm').serializeObject();
	
	var param = {
        url :contextPath+"/report/storeProfit/getColumns",
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
        	$("#"+datagridKey).datagrid('options').url = contextPath + '/report/storeProfit/getList';
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
	$("#queryForm").attr("action",contextPath+"/report/storeProfit/exportList");
	$("#queryForm").submit();
}

/**
 * 是否加粗
 * @param value
 * @param row
 * @param index
 * @returns
 */
function isBold(value, row, index){
	if(row.isBold === 1){
		return '<b>'+value+'</b>';
	}
	return value;
}


function displayAmount(value){
	if(value == "-"){
		return value;
	}
	return getPriceFmtB(value);
}