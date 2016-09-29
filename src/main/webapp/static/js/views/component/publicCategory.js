/**
 * Created by huangj02 on 2016/8/8.
 * 公共组件-请选择商品类别
 */
function initCategoryView(){
    gFunSetEnterKey(categorySearch);
    initTreeCategory(); //初始树
    initDatagridCategory(); //初始化表格
}

var categoryCallBack ;
//初始化回调函数
function initCategoryCallBack(cb){
    categoryCallBack = cb;
}

//选择单行
function categoryClickRow(rowIndex, rowData){
    if(categoryCallBack){
        categoryCallBack(rowData);
    }
}
//初始树
function initTreeCategory(){
	var args = { }
	$.post(contextPath + "/common/category/getGoodsCategoryToTree", args,function(data){
	    var setting = {
	        data: {
	            key:{
	            	tId:'id',
	                name:'codeText'
	            }
	        },
	        callback: {
	    		onClick: zTreeOnClick
	    	}

	    };
	    $.fn.zTree.init($("#treeCategory"), setting, JSON.parse(data));
	    var treeObj = $.fn.zTree.getZTreeObj("treeCategory");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
	});
}

/*
 * 树点击事件
 */
var categoryCode=null;
function zTreeOnClick(event, treeId, treeNode) {
	categoryCode=treeNode.code;
    $("#gridCategory").datagrid("options").queryParams = {categoryCode:categoryCode};
    $("#gridCategory").datagrid("options").method = "post";
    $("#gridCategory").datagrid("options").url =contextPath+'/common/category/getComponentList',
    $("#gridCategory").datagrid("load");
};
//搜索
function categorySearch(){
	var categoryNameOrCode=$("#categoryNameOrCode").val();
	$("#gridCategory").datagrid("options").queryParams = {categoryCode:categoryCode,categoryNameOrCode:categoryNameOrCode};
	$("#gridCategory").datagrid("options").method = "post";
	$("#gridCategory").datagrid("options").url =contextPath+'/common/category/getComponentList',
	$("#gridCategory").datagrid('load');
}
//初始化表格
function initDatagridCategory(){
    $("#gridCategory").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        url:contextPath + "/common/category/getComponentList",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'categoryCode',title:'类别编码',width:100,align:'left'},
            {field:'categoryName',title:'名称',width:100,align:'left'},
        ]],
        onLoadSuccess : function() {
        	 $('.datagrid-header').find('div.datagrid-cell').css('text-align','center');
        },
        onClickRow:categoryClickRow,
    });
}