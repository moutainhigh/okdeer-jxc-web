/**
 * Created by huangj02 on 2016/8/8.
 * 公共组件-供应商
 */
var saleWayNot="";
var branchId="";
var isDirect = "";
var isAllowPurchase = "";
var supplierSelectType="";

function initSupplierView(param){
	
	console.log('param',param)
	
	var supplierCodeOrName = param.supplierCodeOrName;
	
	if(supplierCodeOrName){
		$("#supplierNameOrsupplierCode").val(supplierCodeOrName);
	}else{
		supplierCodeOrName = "";
	}
	
	branchId = param.branchId;
	if(!branchId){
		branchId=$("#branchId").val();
	}

	
    gFunSetEnterKey(supplierSearch);
    saleWayNot=$("#saleWayNot").val();
    isDirect = $("#isDirect").val();
    
    isAllowPurchase = param.isAllowPurchase ||"";

    supplierSelectType = param.supplierSelectType||"";
    var pubSupTree = new publicSupplierTree();
    pubSupTree.initTreeSupplier(); //初始树

    var param = $.extend({
        saleWayNot:saleWayNot,
        isDirect:isDirect,
        branchId:branchId,
        supplierCodeOrName:supplierCodeOrName
    },param);
    initDatagridSupplier(param); //初始化表格
}
var supplierCallBack ;
//初始化回调函数
function initSupplierCallBack(cb){
    supplierCallBack = cb;
}

//选择单行
function supplierClickRow(rowIndex, rowData){
    if(supplierCallBack){
        supplierCallBack(rowData);
    }
}

function publicSupplierTree() {
    
}


//初始树
publicSupplierTree.prototype.initTreeSupplier = function(){
    var pubSupTree = new publicSupplierTree();
	var args = { }
    $.get(contextPath + "/common/supplierArea/getSupplierAreaToTree", args,function(data){
        var setting = {
            data: {
                key:{
                	tId:'id',
                	name:'codeText'
                }
            },
	        callback: {
	    		onClick: pubSupTree.zTreeOnClick
	    	}
        };
        $.fn.zTree.init($("#treeSupplier"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treeSupplier");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
    });
}

/*
 * 树点击事件
 */
var supplierAreaCode=null;
publicSupplierTree.prototype.zTreeOnClick = function(event, treeId, treeNode) {
	supplierAreaCode=treeNode.code;
	var supplierNameOrsupplierCode=$("#supplierNameOrsupplierCode").val();
   $("#gridSupplier").datagrid("options").queryParams = {
	   	supplierAreaCode:supplierAreaCode,
	   	saleWayNot:saleWayNot,
	   	isDirect:isDirect,
	   	isAllowPurchase:isAllowPurchase,
    	branchId:branchId,
    	supplierNameOrsupplierCode:supplierNameOrsupplierCode,
       supplierSelectType:supplierSelectType
   };
   $("#gridSupplier").datagrid("options").method = "post";
   $("#gridSupplier").datagrid("options").url =contextPath + "/common/supplier/getComponentList",
   $("#gridSupplier").datagrid("load");
};

//初始化表格
function initDatagridSupplier(param){
    var param = $.extend({
        isAllowPurchase:isAllowPurchase,
        supplierSelectType:supplierSelectType
    },param);
    $("#gridSupplier").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        url:contextPath + "/common/supplier/getComponentList",
        queryParams:param,
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
            {field:'supplierCode',title:'供应商编号',width:100,align:'left'},
            {field:'supplierName',title:'供应商名称',width:100,align:'left'},
        ]],
        onLoadSuccess : function() {
        	 $('.datagrid-header').find('div.datagrid-cell').css('text-align','center');
        },
        onClickRow:supplierClickRow,
    });
}
//搜索
function supplierSearch(){
	var supplierNameOrsupplierCode=$("#supplierNameOrsupplierCode").val();
	$("#gridSupplier").datagrid("options").queryParams = {
		supplierAreaCode:supplierAreaCode,
	   	saleWayNot:saleWayNot,
	   	isDirect:isDirect,
	   	isAllowPurchase:isAllowPurchase,
		branchId:branchId,
    	supplierNameOrsupplierCode:supplierNameOrsupplierCode,
        supplierSelectType:supplierSelectType
	};
	$("#gridSupplier").datagrid("options").method = "post";
	$("#gridSupplier").datagrid("options").url =contextPath+"/common/supplier/getComponentList",
	$("#gridSupplier").datagrid('load');
}