/**
 * Created by zhaoly on 2017/12/7.
 */
$(function () {

})

function ChargeCategoryDialogClass() {

}

var chCateClass = new ChargeCategoryDialogClass();

ChargeCategoryDialogClass.prototype.gridName = "gridChargeCategoryDialogList";
ChargeCategoryDialogClass.prototype.gridHandel = new GridClass();

var pubChargeCategoryCallback = null;

ChargeCategoryDialogClass.prototype.initPubChargeCategory = function(param){
	initForm(param);
	chCateClass.treeChargeCategory();
	gridChargeCategoryList();
}

function initForm(param){
	if(param){
		//根据参数序列化到dom结构中
		for(key in param){
			if(key === "categoryCodeName"){
				$("#formCategoryList #categoryCodeName").val(param[key]);
			}else{
				var _inpStr = "<input type='hidden' name='"+key+"' id='"+key+"' value='"+(param[key]||"")+"' />";
				$('#formCategoryList').append(_inpStr);
			}

			
		}
	}
}

ChargeCategoryDialogClass.prototype.initPubChCategoryCallback = function (cb) {
    pubChargeCategoryCallback = cb;
}

ChargeCategoryDialogClass.prototype.treeChargeCategory = function() {
    var args = {};
    var httpUrl = contextPath+"/settle/charge/chargeCategory/getCategoryToTree";
    $.get(httpUrl, args,function(data){
        var setting = {
            data: {
                key:{
                    name:'codeText',
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                onClick: chCateClass.zTreeOnClick
            }
        };
        $.fn.zTree.init($("#treeChargeCategory"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treeChargeCategory");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
        var childrens = treeObj.getNodes()[0].children;
        treeObj.selectNode(childrens[0]);
        selectNode = childrens[0];
        $("#formCategoryList #categoryCode").val(selectNode.code);
        categoryCodeSearch();
    });
}


//选择树节点
var selectNode = null;
ChargeCategoryDialogClass.prototype.zTreeOnClick = function (event, treeId, treeNode) {
    selectNode = treeNode;
    $("#formCategoryList #categoryCode").val(selectNode.code);
    categoryCodeSearch();
}


function gridChargeCategoryList() {
    chCateClass.gridHandel.setGridName(chCateClass.gridName);
    $("#"+chCateClass.gridName).datagrid({
        method:'post',
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        fit:true,
        columns:[[
            {field:'id',hidden:true},
            {field:'categoryCode',title:'编号',width:100,align:'left'},
            {field:'categoryName',title:'名称',width:150,align:'left'},
            {field:'remark',title:'备注',width:200,align:'left'}
        ]],
        onClickRow:categoryClickRow,
        onBeforeLoad:function (param) {
            chCateClass.gridHandel.setDatagridHeader("center");
        }
    })
}

function categoryClickRow(rowIndex, rowData) {
    if(pubChargeCategoryCallback){
        pubChargeCategoryCallback(rowData);
    }
}

function categoryCodeSearch() {
    var formData = $('#formCategoryList').serializeObject();
    $("#"+chCateClass.gridName).datagrid("options").queryParams = formData;
    $("#"+chCateClass.gridName).datagrid("options").method = "post";
    $("#"+chCateClass.gridName).datagrid("options").url = contextPath+'/settle/charge/chargeCategory/list',
        $("#"+chCateClass.gridName).datagrid('load');
}