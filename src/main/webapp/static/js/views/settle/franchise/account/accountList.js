

$(function(){
	//开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	initfraAcountList();
	
	//机构选择初始化
	$('#branchComponent').branchSelect({
		param:{
			branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B
		}
	});

    if(getUrlQueryString('message')=='0'){
        queryForm();
    }
})

var datagirdID = 'fraAccountList';

function getAccountColumns(){
	var accountType = $('input[type="radio"][name="type"]:checked').val();
	var defaultColumns = [];
	defaultColumns =defaultColumns.concat([
             		{field: 'branchCode', title: '加盟店编号', width: '100px', align: 'left'},
           			{field: 'branchName', title: '加盟店', width: '120px', align: 'left'}])
	//3 未收账款汇总
	if(accountType != '3' && accountType != '7'){
		defaultColumns = defaultColumns.concat([
				    {field: 'targetFormNo',title:'单号',width:'150px',align:'left',formatter:function(value,row,index){
	            		var str = "";
	            		if(value){
	            			if(value.indexOf('DI') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'入库单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.targetFormId +'&deliverType=DI\')">' + (value||"") + '</a>';
	            			}else if(value.indexOf('DO') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'出库单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.targetFormId +'&formType=DO\')">' + (value||"") + '</a>';
	            			}else if(value.indexOf('PI') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购收货详细\',\''+contextPath+'/form/purchase/receiptEdit?formId='+row.targetFormId+'\')">' + (value||"") + '</a>';
	            			}else if(value.indexOf('PM') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'直送收货单详细\',\''+contextPath+'/directReceipt/edit?formId='+row.targetFormId+'\')">' + (value||"") + '</a>';
	            			}else if(value.indexOf('PR') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购退货详细\',\''+contextPath+'/form/purchase/returnEdit?formId='+row.targetFormId+'\')">' + (value||"") + '</a>';
	            			}else if(value.indexOf('FI') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'加盟店预收款明细\',\''+ contextPath +'/settle/franchiseCharge/advanceView?id='+ row.targetFormId +'\')">' + (value||"") + '</a>';
	            			}else if(value.indexOf('FO') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'加盟店费用明细\',\''+ contextPath +'/settle/franchiseCharge/chargeView?id='+ row.targetFormId +'\')">' + (value||"") + '</a>';
	            			}else if(value.indexOf('FG') == 0){
	            				str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'加盟店毛利结算详情\',\''+ contextPath +'/settle/franchiseProfitSettle/settleEdit?id='+ row.targetFormId +'\')">' + (value||"") + '</a>';
	            			}
	            		}
	            		return str;
				    }},
				    {field: 'targetFormType',title: '单据类型', width: '100px', align: 'center'}])
	}
	
	//5 已付账款明细  6预收账款明细
	if(accountType != '5' && accountType != '6' && accountType != '7'){
		defaultColumns = defaultColumns.concat([
		           {field: 'payableAmount', title: '应收金额', width: '80px', align: 'right',
						formatter: function (value, row, index) {
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
						}
					},
					{field: 'payedAmount', title: '已收金额', width: '80px', align: 'right',
						formatter: function (value, row, index) {
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
						}
					},
					{field: 'unpayAmount', title: '未收金额', width: '80px', align: 'right',
						formatter: function (value, row, index) {
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
						}
					}])
	}
	
	//5 已付账款明细
	if(accountType == '5'){
		defaultColumns = defaultColumns.concat([
                    {field: 'payableAmount', title: '收款金额', width: '80px', align: 'right',
						formatter: function (value, row, index) {
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
						}
					}]);
	}
	
	//预收账款明细
	if(accountType == '6'){
		defaultColumns = defaultColumns.concat([
                    {field: 'payableAmount', title: '已付金额', width: '80px', align: 'right',
						formatter: function (value, row, index) {
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
						}
					},
					{field: 'payedAmount', title: '已用金额', width: '80px', align: 'right',
						formatter: function (value, row, index) {
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
						}
					},
					{field: 'unpayAmount', title: '未用金额', width: '80px', align: 'right',
						formatter: function (value, row, index) {
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
						}
					}]);
	}
	
	//3 未收账款汇总
	if(accountType != '3' && accountType != '7'){
		defaultColumns = defaultColumns.concat([
				{field: 'auditUserName', title: '审核人', width: '120px', align: 'left'},
				{field: 'auditTime', title: '审核时间', width: '120px', align: 'left',
					formatter: function (value, row, index) {
						if(!value){
							return '';
						}
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}	
				}
				])
	}	
	
	//到期账款 历史往来账款
	if(accountType == '2' ){
		defaultColumns = defaultColumns.concat([
				{field: 'payTime', title: '结算日期', width: '120px', align: 'left',
					formatter: function (value, row, index) {
						if(!value){
							return '';
						}
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
				}])
	}	
	
	if(accountType == '1' || accountType == '2' || accountType == '4'){
		defaultColumns = defaultColumns.concat([
				{field: 'remark', title: '备注', width: '200px', align: 'left'}]);
	}
	//加盟店毛利明细
	if(accountType == '7') {
		defaultColumns = defaultColumns.concat([
                {field: 'targetFormNo', title: '单号', width: '150px', align: 'left',
                	formatter:function(value,row,index){
	            		var str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'加盟店毛利结算详情\',\''+ contextPath +'/settle/franchiseProfitSettle/settleEdit?id='+ row.targetFormId +'\')">' + (value||"") + '</a>';
	            		return str;
                	}
				},
				{field: 'settleTimeStart', title: '结算日期起', width: '100px', align: 'left',
					formatter: function (value, row, index) {
						if(!value){
							return '';
						}
						return new Date(value).format('yyyy-MM-dd');
					}
				},
				{field: 'settleTimeEnd', title: '结算日期止', width: '100px', align: 'left',
					formatter: function (value, row, index) {
						if(!value){
							return '';
						}
						return new Date(value).format('yyyy-MM-dd');
					}
				},
				{field: 'saleCount', title: '销售数量', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				},
				{field: 'saleAmount', title: '销售金额', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				},
				{field: 'costAmount', title: '成本金额', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				},
				{field: 'profitAmount', title: '毛利金额', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				},
				{field: 'targetProfitAmount', title: '公司所得毛利', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				},
				{field: 'franchiseProfitAmount', title: '加盟店所得毛利', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				},
				{field: 'otherAmount', title: '其他收款金额', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				},
				{field: 'totalAmount', title: '本次收款金额', width: '100px', align: 'right',
					formatter: function (value, row, index) {
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
					}
				}]);
	}
	console.log(defaultColumns,defaultColumns.length);
	return [defaultColumns];
}

var dg;
var gridHandel = new GridClass();
//初始化表格
function initfraAcountList(){
	if(dg){
		$("#"+datagirdID).datagrid('options').url = '';
	}
    dg = $("#"+datagirdID).datagrid({
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,         //占满
        showFooter:true,
		height:'100%',
		width:'100%',
		pageSize:50,
//		pageList:[[10,20,30,40,50]]
        columns:getAccountColumns(),
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });
    $("#"+datagirdID).datagrid('loadData',[]);
    $("#"+datagirdID).datagrid('reloadFooter',[]);
    
}

function queryForm(){
	$("#startCount").val('');
	$("#endCount").val('');
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)
	$("#"+datagirdID).datagrid("options").method = "post";
	$("#"+datagirdID).datagrid('options').url = contextPath + '/settle/franchiseAccountCurrent/getAccountList';
	$("#"+datagirdID).datagrid('load',fromObjStr);
}

/**
 * 导出表单
 */
function exportAccountList(){
	var length = $('#fraAccountList').datagrid('getData').rows.length;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	$('#exportWin').window({
		top:($(window).height()-300) * 0.5,   
	    left:($(window).width()-500) * 0.5
	});
	$("#exportWin").show();
	$("#totalRows").html(dg.datagrid('getData').total);
	$("#exportWin").window("open");
}

//调用导出方法
function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");

	$("#queryForm").attr("action",contextPath+"/settle/franchiseAccountCurrent/exportList");
	$("#queryForm").submit(); 
}