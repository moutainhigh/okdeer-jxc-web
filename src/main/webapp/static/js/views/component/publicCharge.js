function initChargeView(param){
	if(param){
	   	$('#nameOrCode').val(param.nameOrCode||'');
	}
    gFunSetEnterKey(chargeSearch);
    initDatagridChargeSelect();
}

var brandCallBack ;
//初始化回调函数
function initChargeCallBack(cb){
    brandCallBack = cb;
}
//搜索
function chargeSearch(){
    $("#chargeSelectList").datagrid("options").queryParams = $("#chargeSelectForm").serializeObject();
    $("#chargeSelectList").datagrid("options").method = "post";
    $("#chargeSelectList").datagrid("load");
}
//选择单行
function brandClickRow(rowIndex, rowData){
    if(brandCallBack){
        brandCallBack(rowData);
    }
}
//初始化表格
function initDatagridChargeSelect(){
    $("#chargeSelectList").datagrid({
        method:'post',
        align:'center',
        url:contextPath+'/common/chargeSelect/getChargeComponentList',
        queryParams:{
        	type:$('#type').val()||'',
        	nameOrCode:$('#nameOrCode').val()||''
        },
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'cz',checkbox:true}, 
            {field:'id',title:'id', align:'left',hidden:true},
            {field:'value',title:'编号',width:80,align:'left'},
            {field:'label',title:'名称',width:100,align:'left'},
        ]],
        onLoadSuccess:function(data){
        	 $('.datagrid-header').find('div.datagrid-cell').css('text-align','center');
        	 $(this).datagrid('resize',{height:$('#zrea').height()+'px'})
        },
//        onClickRow:brandClickRow,
    });
}


function publicCostGetCheckCost(cb){
    var row =  $("#chargeSelectList").datagrid("getChecked");
    cb(row);
}
