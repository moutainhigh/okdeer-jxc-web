/**
 * Created by zhaoly on 2017/5/22.
 */

$(function () {
    initGridCardSetting();
})

var gridName = "gridCardSetting";
var gridHandel = new GridClass();
function initGridCardSetting() {
    gridHandel.setGridName(gridName);

    $("#"+gridName).datagrid({
        align:'center',
        url: 'setting/type/list',
        rownumbers:true,    //序号
        showFooter:true,
        singleSelect:true,  //单选  false多选
        checkOnSelect:false,
        selectOnCheck:false,
        height:500,
        width:600,
        columns:[[
        	{field: 'id', title: '一卡通Id', hidden:"true"},
            {field: 'ecardType', title: '一卡通类型', width: 180, align: 'left',
                formatter : function(value, row,index) {
                    var str =  '<a name="edit" onclick="editCard('+index+')" ' +
                        ' class="ualine">'+value+'</a>';

                    return str;
                },
            },
            // {field:'check',checkbox:true},
            {field: 'enabled', title: '启用', checkbox:true,width: "60px", align: 'left',
                formatter : function(value, row,index) {
                    // if(value == 1){
                    //     return '<input type="checkbox" class="ck" checked/>';
                    // }else{
                    //     return '<input type="checkbox" class="ck" />';
                    // }
                    return value;

            },
            },
            {field: 'cz', title: '操作', width: 180, align: 'left',
                formatter : function(value, row,index) {
                    var str =  '<a name="add" onclick="openShopSettingLis(\''+row.id+'\')" ' +
                        ' class="ualine">'+'开通店铺列表'+'</a>';

                    return str;
                },
            },
        ]],
        onCheck:function(rowIndex,rowData){
        	rowData.enabled = '1';
        	rowData.checked = true;
        },
        onUncheck:function(rowIndex,rowData){
        	rowData.enabled = '0';
        	rowData.checked = false;
        },
        onCheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.enabled = '1';
        		item.checked = true;
        	})
        },
        onUncheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.enabled = '0';
        		item.checked = false;
        	})
        },
        loadFilter:function(data){
        	//显示现实数据转换 后台不返回 rows 节点结构啦 2.7
        	data = $_jxc.gridLoadFilter(data);
        	
        	if(data.rows.length > 0){
        		
        		data.rows.forEach(function(obj,index){
        			obj.checked = obj.enabled == '1'?true:false;
        		})
        	}
        	return data;
        },
    })
    $("#"+gridName).parent().find("div .datagrid-header-check").children("input[type=\"checkbox\"]").eq(0).attr("style", "display:none;");
    $("#"+gridName).parent().find("div .datagrid-header-check").append("<b>启用</b>")
}

function saveCardSetting() {
	var selRows = $('#'+gridName).datagrid('getRows');

    var reqObj = $('#saveForm').serializeObject();
    var data = {
        enabled:reqObj.enabled,
        minAmount:reqObj.minAmount,
        selRows:JSON.stringify(selRows)
    }
	var param = {
	    url:"setting/save",
        data:data
    }

    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
          $_jxc.alert("保存成功");
        }else{
            gFunRefresh();
            $_jxc.alert(result['message'])
        }
    },function (error) {
        gFunRefresh();
    })

}

var cardDialog = null;
function addCard() {
    cardDialog = $('<div/>').dialog({
        href: contextPath+"/iccard/setting/addIcCardType",
        width:500,
        height:500,
        title: "一卡通设置",
        closable: true,
        resizable: true,
        onClose: function () {
            $(cardDialog).panel('destroy');
            cardDialog = null;
        },
        modal: true,
        onLoad: function () {

        }
    })
}

function editCard(index) {
   $('#'+gridName).datagrid('selectRow',index);
    var item =  $("#"+gridName).datagrid('getSelected');
    cardDialog = $('<div/>').dialog({
        href: contextPath+"/iccard/setting/editIcCardType",
        width:500,
        height:500,
        title: "一卡通设置",
        closable: true,
        resizable: true,
        onClose: function () {
            $(cardDialog).panel('destroy');
            cardDialog = null;
        },
        modal: true,
        onLoad: function () {
            initCardTypeData(item);
        }
    })
}


function closeCardDialog() {
    $(cardDialog).panel('destroy');
    cardDialog = null;
}

function delCard() {
    var row = $("#"+gridName).datagrid("getSelected");
    if(!row || row == null){
        $_jxc.alert("请选择一条数据");
        return;
    }

    $_jxc.confirm('是否要删除选中数据',function(data){
        if(data){
            $_jxc.ajax({
                url:contextPath+"/iccard/setting/type/delete/"+row.id,
                type:"POST"
            },function(result){
                if(result['code'] == 0){
                    $_jxc.alert("删除成功");
                }else{
                    $_jxc.alert(result['message']);
                }
                $("#"+gridName).datagrid('reload');
            });
        }
    });
}

var shopSettingDialog = null;
var dialogHeight = $(window).height()*(4/5);
var dialogWidth = $(window).width()*(5/9);
var dialogLeft = $(window).width()*(1/5);
function openShopSettingLis(cardType) {
    shopSettingDialog = $('<div/>').dialog({
        href: contextPath+"/iccard/setting/icCardShopSetting",
        width: dialogWidth,
        height: dialogHeight,
        left:dialogLeft,
        title: "开通店铺列表",
        closable: true,
        resizable: true,
        onClose: function () {
            $(shopSettingDialog).panel('destroy');
            shopSettingDialog = null;
        },
        modal: true,
        onLoad: function () {

            initShopSetting(cardType);
        }
    })
}

function closeShopSettingDialog() {
    $(shopSettingDialog).panel('destroy');
    shopSettingDialog = null;
}