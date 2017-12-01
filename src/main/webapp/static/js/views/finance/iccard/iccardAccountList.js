/**
 * Created by zhaoly on 2017/5/22.
 */
$(function () {
    initGridCardAccount();
    
  //机构选择初始化
	$('#branchComponent').branchSelect({
		param:{
			formType:'BF'
		}
	});
	
})

var gridName = "gridCardAccount";

var gridHandel = new GridClass();

function initGridCardAccount() {
    gridHandel.setGridName(gridName);
    $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        showFooter:true,
        singleSelect:true,
        height:'100%',
        width:'100%',
        columns:[[
        	{field: 'branchId', title: '店铺id', hidden:"true"},
            {field: 'branchCode', title: '店铺编号', width: 100, align: 'left',formatter : function(value, row,index) {
		        var str = value;
		        if(value =="SUM"){
		            str ='<div class="ub ub-pc">合计</div> ';
		        }
		        return str;
		    }},
            {field: 'branchName', title: '店铺名称', width: 180, align: 'left'},
            {field: 'typeDesc', title: '店铺类型', width: 80, align: 'left'},
            {field: 'ecardRechargeAmount', title: '累计充值金额', width: 150, align: 'right',
				formatter:function(value,row,index){
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
				}},
            {field: 'ecardWithdrawalAmount', title: '提取金额', width: 100, align: 'right',
					formatter:function(value,row,index){
						return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
					}},
            {field: 'ecardUseAmount', title: '已用金额', width: 100, align: 'right',
						formatter:function(value,row,index){
							return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
						}},
            {field: 'ecardConsumeAmount', title: '消费金额', width: 100, align: 'right',
                formatter:function(value,row,index){
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }},
            {field: 'ecardBalance', title: '余额', width: 100, align: 'right',
							formatter:function(value,row,index){
								return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
							}}
        ]]
    })
}

function query() {
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)
    
    $("#"+gridName).datagrid("options").queryParams = fromObjStr;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/iccard/account/management/list';
    $("#"+gridName).datagrid("reload");
}

var rechargeDialog = null;
function recharge() {
    var row =  $("#"+gridName).datagrid("getSelected");
    if(!row || row == null){
        $_jxc.alert("请选择一条数据");
        return;
    }

    rechargeDialog = $('<div/>').dialog({
        href: contextPath+"/iccard/account/management/iccardRecharge",
        width:500,
        height:500,
        title: "一卡通账户充值",
        closable: true,
        resizable: true,
        onClose: function () {
            $(rechargeDialog).panel('destroy');
            rechargeDialog = null;
        },
        modal: true,
        onLoad: function () {
            initCardRecharge(row);

        }
    })
}

function closeRechargeDialog() {
    $(rechargeDialog).panel('destroy');
    rechargeDialog = null;
}

var extractedDialog = null;
function extracted() {

    var row =  $("#"+gridName).datagrid("getSelected");
    if(!row || row == null){
        $_jxc.alert("请选择一条数据");
        return;
    }

    extractedDialog = $('<div/>').dialog({
        href: contextPath+"/iccard/account/management/iccardExtracted",
        width:500,
        height:500,
        title: "一卡通账户余额提取",
        closable: true,
        resizable: true,
        onClose: function () {
            $(extractedDialog).panel('destroy');
            extractedDialog = null;
        },
        modal: true,
        onLoad: function () {
            initCardExtracted(row);
        }
    })
}

function closeExtractedDialog() {
    $(extractedDialog).panel('destroy');
    extractedDialog = null;
}

var dg;
/**
 * 导出
 */
function exportData(){
	var length = $('#'+gridName).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}

    var param = {
        datagridId:gridName,
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/iccard/account/management/exports"
    }
    publicExprotService(param);
}
	