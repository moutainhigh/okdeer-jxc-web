/**
 * Created by zhaoly on 2017/5/22.
 */
$(function () {
    initGridCardAccount();
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
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				}},
            {field: 'ecardWithdrawalAmount', title: '提取金额', width: 100, align: 'right',
					formatter:function(value,row,index){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}},
            {field: 'ecardUseAmount', title: '已用金额', width: 100, align: 'right',
						formatter:function(value,row,index){
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
						}},
            {field: 'ecardConsumeAmount', title: '消费金额', width: 100, align: 'right',
                formatter:function(value,row,index){
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }},
            {field: 'ecardBalance', title: '余额', width: 100, align: 'right',
							formatter:function(value,row,index){
								return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
							}}
        ]]
    })
}

function query() {
	$("#startCount").val("");
	$("#endCount").val("");
    $("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
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
	dg = $('#gridCardAccount');
	var length = $('#gridCardAccount').datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	$('#exportWin').window({
		top:($(window).height()-300) * 0.5,   
	    left:($(window).width()-500) * 0.5
	});
	$("#exportWin").show();
	$("#totalRows").html($('#gridCardAccount').datagrid('getData').total);
	$("#exportWin").window("open");
}

/**
 * 导出
 */
function exportExcel(){
	var length = $('#gridCardAccount').datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	var fromObjStr = urlEncode($('#queryForm').serializeObject());
	$("#queryForm").form({
		success : function(data){
			if(data==null){
				$_jxc.alert("导出数据成功！");
			}else{
				$_jxc.alert(JSON.parse(data).message);
			}
		}
	});
	$("#queryForm").attr("action",contextPath + '/iccard/account/management/exports?params='+fromObjStr);
	
	$("#queryForm").submit();
}

var urlEncode = function (param, key, encode) {
	  if(param==null) return '';
	  var paramStr = '';
	  var t = typeof (param);
	  if (t == 'string' || t == 'number' || t == 'boolean') {
	    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
	  } else {
	    for (var i in param) {
	      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
	      paramStr += urlEncode(param[i], k, encode);
	    }
	  }
	  return paramStr;
	};
	
/**
 * 机构名称
 */
function selectListBranches(){
    new publicAgencyService(function(data){
        $("#branchId").val(data.branchesId);
        $("#branchName").val(data.branchName);
        $("#branchCompleCode").val(data.branchCompleCode);
        $("#oldBranchName").val(data.branchName);
    },'BF','');
}