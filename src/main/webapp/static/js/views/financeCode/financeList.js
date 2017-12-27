/**
 * Created by zhaoly on 2017/5/19.
 */

$(function () {
    initTreeFinance();
    initGridFinanceList();
})

var gridName = "gridfinanceList";
var gridHandel = new GridClass();

function initTreeFinance() {
    var args = {};
    var httpUrl = contextPath+"/archive/financeCode/getFinanceCodeToTree";
    $.get(httpUrl, args,function(data){
        var setting = {
            data: {
                key:{
                    name:'text',
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };
        $.fn.zTree.init($("#treefinances"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treefinances");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
        var childrens = treeObj.getNodes()[0].children;
        treeObj.selectNode(childrens[0]);
        selectNode = childrens[0];
        $("#typeCode").val(selectNode.code);
        initDictList();
    });
}

function initDictList() {
    var param = {
        url:contextPath+'/archive/financeCode/getDictList',
        data:{
            dictKeyword:"",
            typeCode:selectNode.code,
            page:1,
            rows:50,
        }
    }
    $_jxc.ajax(param,function (result) {
        $("#"+gridName).datagrid('loadData',result.list);
    })
}

//选择树节点
var selectNode = null;
function zTreeOnClick(event, treeId, treeNode) {
    selectNode = treeNode;
    $("#typeCode").val(selectNode.code);
    queryFinanceCode();
}


function initGridFinanceList() {
	var updatePermission = $.trim($("#updatePermission").html()||'');
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        method:'post',
        align:'center',
        // url:contextPath+'/archive/financeCode/getDictList',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        fit:true,
        columns:[[
            {field:'check',checkbox:true},
            {field:'id',hidden:true},
            {field:'value',title:'编号',width:100,align:'left',
                formatter: function(value,row,index){
                    if (updatePermission) {
                    	return "<a href='#' onclick=\"updateFinanceCode('"+row.id+"')\" class='ualine'>"+value+"</a>";
                	}else{
                		return value;
                	}
                }
            },
            {field:'label',title:'名称',width:200,align:'left'},
            {field:'remark',title:'备注',width:200,align:'left'}
        ]]
    })
}

function addFinanceCode() {
	var _code = selectNode.code;
	//机构运营费用 101005 2.7
	if(_code == '101005'){
		opendOperationDialog();
	}else{
		//原始逻辑
		if(null ==selectNode || selectNode.isParent){
			$_jxc.alert("请选择具体的分类!");
			return;
		}
		var param = {
				type:"add",
				dictTypeId: selectNode.id,
				nodeCode:selectNode.code
		}
		openFinanceDialog(param);
	}
}

/**---------------------------------2.7机构运营费用   start------------------------**/
//机构运营费用弹窗
var brDialog;
function opendOperationDialog(){
	brDialog = $_jxc.dialog({
		target:'#operatorDialog',
		title: '机构运营费用新增', 
		width:500,
		height:300,
		onBeforeOpen:function(){
			$('#operatorDialog-area').removeClass('none');
		},
		onClose:function(){
			$('#operatorDialog-area').addClass('none');
	    }
	})
}


//机构运营费用弹窗 --> 关闭
function closeOperationDialog(){
	$(brDialog).dialog('close');
	$('#costForm')[0].reset();
}

//保存机构运营费用
function saveCost(){
//	var _typeName = $.trim($('#typeName').val())||'';
//	if(!_typeName){
//		$_jxc.alert('运营费用名称不能为空');
//		return;
//	}
//	var treeObj = $.fn.zTree.getZTreeObj("treefinances");
//	var newNode = {text:_typeName};
//	newNode = treeObj.addNodes(selectNode, newNode);
	
    if($_jxc.isStringNull($("#typeName").val())){
        $_jxc.alert("名称不能为空");
        return;
    }
    
    var type = 'add';
    
	var addUrl = contextPath+'/archive/financeCode/addDictType'; 
	var updateUrl = contextPath+'/archive/financeCode/updateDictType';
	var data = {
        parentId: selectNode.id,
        typeName:$("#typeName").val().trim()
    }
    if(type === "edit"){
        data.id = $("#id").val();
    }
	var param = {
		url:type === "add"?addUrl:updateUrl,
		data:data
	}
	$_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
            //queryFinanceCode();
        	initTreeFinance();
            $_jxc.alert("保存成功");
            closeOperationDialog();
        }else{
            $_jxc.alert(result['message']);
        }
    },function (e) {

    });
	
}

//删除 机构运营费用 子节点
function delCostItem(){
	var param = {
        url: contextPath + "/archive/financeCode/deleteDictType",
        data: {
            id: selectNode.id
        }
    }

    $_jxc.ajax(param, function (result) {
    	initTreeFinance();
        if (result['code'] == 0) {
            $_jxc.alert("删除成功");
        } else {
            $_jxc.alert(result['message']);

        }
    });
	
//	var param = {
//		url:'xxx',
//		data:'',
//	}
//	$_jxc.ajax(param,function(result){
//		
//	})
}

/**---------------------------------2.7机构运营费用   end------------------------**/


function updateFinanceCode(id) {
	
    var param = {
        type:"edit",
        id:id,
        dictTypeId: selectNode.id,
        nodeCode:selectNode.code
    }
    openFinanceDialog(param);
}

var editDialogTemp = null;
function openFinanceDialog(param) {
    editDialogTemp = $('<div/>').dialog({
        href: contextPath+"/archive/financeCode/toAdd?dictTypeCode="+param.nodeCode,
        width: 400,
        height: 400,
        title: "财务代码新增",
        closable: true,
        resizable: true,
        onClose: function () {
            $(editDialogTemp).panel('destroy');
            editDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            initFinanceDialog(param);
        }
    })
}

function closeFinanceDialog() {
    $(editDialogTemp).panel('destroy');
    editDialogTemp = null;
}

/**
 * 搜索
 */
function queryFinanceCode(){
	//搜索需要将左侧查询条件清除
    var formData = $('#formFinanceList').serializeObject();
    formData.typeCode = selectNode.code;
    $("#"+gridName).datagrid("options").queryParams = formData;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/archive/financeCode/getDictList',
    $("#"+gridName).datagrid('load');
}


function delFinanceCode() {
	var rows = $("#"+gridName).datagrid("getChecked");
	if(rows.length <= 0){
		var _parenNode =  selectNode.getParentNode();
		//机构运营费用 code: "101005"
		if(_parenNode.code == '101005'){
			var _text = selectNode.text;
			$_jxc.confirm('确认删除【'+_text+'】节点数据?',function(r){
				if(r){
					delCostItem();
				}
			})
			return;
		}else{
			$_jxc.alert('请勾选数据！');
			return;
		}
	}

    var ids='';
    $.each(rows,function(i,v){
    	ids+=v.id+",";
    });

        $_jxc.confirm('是否要删除选中数据?',function(data){
            if(data) {
                var param = {
                    url: contextPath + "/archive/financeCode/deleteFinanceCode",
                    data: {
                        ids: ids
                    }
                }

                $_jxc.ajax(param, function (result) {
                    queryFinanceCode();
                    if (result['code'] == 0) {
                        $_jxc.alert("删除成功");
                    } else {
                        $_jxc.alert(result['message']);

                    }
                });
            }

    })
}

/**
 * 导出
 */
function exportData(){
	var length = $("#"+gridName).datagrid('getData').rows.length;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
    var param = {
        datagridId:gridName,
        formObj:$("#formFinanceList").serializeObject(),
        url:contextPath+"/archive/financeCode/exportHandel"
    }
    publicExprotService(param);
}