$(function(){
	
	var branchType = $("#branchType").val();
	//分公司
	var url = contextPath+'/common/branches/queryComponentList';
	if(branchType!=1){
		//店铺
		url = contextPath+'/common/branches/getComponentList';
	}
	initDatagridBranchCheck(url);
    gFunSetEnterKey(cx);

    $("input[name='offlineStatus']").change(function () {
        $('#gridOperator').datagrid('clearSelections');
        $('#gridOperator').datagrid('clearChecked');
        cx();
    })
})

var branchCallBack ;
var offlineStatus = "1";

//初始化回调函数
function initBranchCallBack(cb){
	branchCallBack = cb;
}

//搜索
function cx(){
    $("#gridOperator").datagrid("options").queryParams = $("#formOperator").serializeObject();
    $("#gridOperator").datagrid("options").method = "post";
    $("#gridOperator").datagrid("load");
}

//选择单行
function branchClickRow(rowIndex, rowData){
    if(branchCallBack){
    	branchCallBack(rowData);
    }
}

//初始化表格 
function initDatagridBranchCheck(url){
	var _formObj = $('#formOperator').serializeObject();
  $("#gridOperator").datagrid({
      method:'post',
      align:'center',
      url:url,
      queryParams:_formObj,
      singleSelect:false,  //单选  false多选
      rownumbers:true,    //序号
      pagination:true,    //分页
      fitColumns:true,    //每列占满
      showFooter:true,
      height:'100%',
      width:'100%',
      idField:'branchCode',
      columns:[[
          {field:'id',checkbox:true},
          {field:'branchCode',title:'编码',width:100,align:'center'},
          {field:'branchName',title:'名称',width:100,align:'center'},
      ]],
  });
}

function publicOperatorGetCheck(cb){
    var row =  $("#gridOperator").datagrid("getChecked");
    cb(row);
}