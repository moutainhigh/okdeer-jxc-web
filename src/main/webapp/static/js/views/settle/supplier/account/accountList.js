$(function(){
	//开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	initAcountList();
	
	//机构选择初始化
	// $('#branchComponent').branchSelect();
    //机构选择初始化
	$('#branchComponent').branchSelect({
		//ajax参数
		param:{
			scope:1
		},
		//数据过滤
		loadFilter:function(data){
			data.isContainChildren = data.allBranch;
			return data;
		}
	});
	//供应商选择初始化
	$('#supplierComponent').supplierSelect({
		//数据过滤
		loadFilter:function(data){
			data.supplierId = data.id;
			return data;
		}
	});
    if(getUrlQueryString('message')=='0'){
        queryForm();
    }
})

var datagirdID = 'supAccountList';

function getAccountColumns(){
	var accountType = $('input[name="radioType"]:checked').val();
	
	var defaultColumns = [{field: 'check',checkbox:true}];
	defaultColumns =defaultColumns.concat([
  			{field: 'branchCodeFull', title: '机构编号', width: '80px', align: 'left'},
			{field: 'branchNameFull', title: '机构名称', width: '120px', align: 'left'},
			{field: 'supplierCode', title: '供应商编号', width: '80px', align: 'left'},
			{field: 'supplierName', title: '供应商名称', width: '120px', align: 'left'}]);
	if(accountType == 6){
		defaultColumns =defaultColumns.concat([
           {field: 'settleformNo',title:'结算单号',width:'150px',align:'left',
        	   formatter:function(value,row,index){
        		   strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商预付款明细\',\''+ contextPath +'/settle/supplierSettle/settleViewByNo?formNo='+ row.settleformNo +'\')">' + value + '</a>';
        		   return strHtml;
        	   }
           }]);
	}
	//到期账款 未付款账款明细
	if(accountType != 3 && accountType != 5){
		defaultColumns = defaultColumns.concat([
            {field: 'targetformNo',title:'单号',width:'150px',align:'left',formatter:function(value,row,index){
            	var strHtml = value;
            	if(value){
            		if(value.indexOf('FY') == 0){
            			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商预付单明细\',\''+ contextPath +'/settle/supplierCharge/advanceView?id='+ row.targetformId +'\')">' + (value||"") + '</a>';
            		}else if(value.indexOf('FF') == 0){
            			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商费用明细\',\''+ contextPath +'/settle/supplierCharge/chargeView?id='+ row.targetformId +'\')">' + (value||"") + '</a>';
            		}else if(value.indexOf('FL') == 0){
            			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商联营账单明细\',\''+ contextPath +'/settle/supplierChain/chainView?id='+ row.targetformId +'\')">' + (value||"") + '</a>';
            		}else if(value.indexOf('PI') == 0){
            			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购收货详细\',\''+contextPath+'/form/purchase/receiptEdit?formId='+row.targetformId+'\')">' + (value||"") + '</a>';
            		}else if(value.indexOf('PM') == 0){
            			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'直送收货单详细\',\''+contextPath+'/directReceipt/edit?formId='+row.targetformId+'\')">' + (value||"") + '</a>';
            		}else if(value.indexOf('PR') == 0){
            			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购退货详细\',\''+contextPath+'/form/purchase/returnEdit?formId='+row.targetformId+'\')">' + (value||"") + '</a>';
            		}else if(value.indexOf('FP') == 0){
                        strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购成本调整详细\',\''+contextPath+'/purchase/cost/form/edit/'+row.targetformId+'\')">' + (value||"") + '</a>';
                    }
            	}
        		return strHtml;
            }},
            {field: 'formTypeText',title: '单据类型', width: '120px', align: 'center'},
            ]);
	}
	//未付款账款汇总
	if(accountType == 3){
		defaultColumns = defaultColumns.concat([
			{field: 'advanceAmount', title: '预付金额', width: '80px', align: 'right',
				formatter: function (value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
				}
			}])
	}
	if(accountType == 7){
		defaultColumns = defaultColumns.concat([
            {field: 'payableAmount', title: '预付金额', width: '80px', align: 'right',
            	formatter: function (value, row, index) {
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            }])
	}
	//预付账款明细
	if(accountType == 7){
		defaultColumns = defaultColumns.concat([
            {field: 'payedAmount', title: '已用金额', width: '80px', align: 'right',
				formatter: function (value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
				}
			},
            {field: 'unpayAmount', title: '未用金额', width: '120px', align: 'right',
				formatter: function (value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
				}
			},
			{field: 'payTime', title: '付款日期', width: '120px', align: 'left',
				formatter: function (value, row, index) {
					if(!value){
						return '';
					}
					return new Date(value).format('yyyy-MM-dd');
				}
			}
            ]);
	}
	//到期账款 历史往来账款 未付款账款汇总
	if(accountType == 1 || accountType == 2 || accountType == 4 ){
		defaultColumns = defaultColumns.concat([
			{field: 'payTime', title: '应付款日期', width: '120px', align: 'left',
				formatter: function (value, row, index) {
						if(!value){
							return '';
						}
						return new Date(value).format('yyyy-MM-dd');
				}
			}]);
	}
	//到期账款 历史往来账款 未付款账款汇总
	if(accountType <= 4 ){
		defaultColumns = defaultColumns.concat([
            {field: 'payableAmount', title: '应付金额', width: '80px', align: 'right',
            	formatter: function (value, row, index) {
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            }]);
	}
	//到期账款 历史往来账款 未付款账款汇总
	if(accountType != 7 ){
		defaultColumns = defaultColumns.concat([
			{field: 'payedAmount', title: accountType == 6 ? '实付金额':'已付金额', width: '80px', align: 'right',
				formatter: function (value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
				}
			},
			{field: 'discountAmount', title: '优惠金额', width: '80px', align: 'right',
				formatter: function (value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
				}
			}]);
	}
	//到期账款 历史往来账款 未付款账款汇总
	if(accountType <= 4 ){
		defaultColumns = defaultColumns.concat([
			{field: 'unpayAmount', title: '未付金额', width: '80px', align: 'right',
				formatter: function (value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
				}
			}]);
	}
	//未付款账款汇总
	if(accountType == 3){
		defaultColumns = defaultColumns.concat([
			{field: 'surplusAmount', title: '实际结余金额', width: '80px', align: 'right',
				formatter: function (value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
				}
			}]);
	}
	//到期账款 历史往来账款
	if(accountType == 1 || accountType == 2 || accountType == 6  ){
		defaultColumns = defaultColumns.concat([
			{field: 'auditUserName', title: '审核人', width: '120px', align: 'left'},
			{field: 'auditTime', title: '审核时间', width: '120px', align: 'left',
				formatter: function (value, row, index) {
					if(!value){
						return '';
					}
					return new Date(value).format('yyyy-MM-dd hh:mm');
				}
			}])
	}	
	//到期账款 历史往来账款
	if(accountType <= 2  || accountType == 6 ){
		defaultColumns = defaultColumns.concat([
			{field: 'actualPayTime', title: '实际付款时间', width: '120px', align: 'left',
				formatter: function (value, row, index) {
					if(!value){
						return '';
					}
					return new Date(value).format('yyyy-MM-dd hh:mm');
				}
			}])
	}	
	if(accountType == '1' || accountType == '2' || accountType == '4' || accountType == '7'){
		defaultColumns = defaultColumns.concat([
			{field: 'remark', title: '备注', width: '200px', align: 'left'}]);
	}
	return [defaultColumns];
}

var datagridObj;
var gridHandel = new GridClass();
//初始化表格
function initAcountList(){
    gridHandel.setGridName(datagirdID);
	if(datagridObj){
		$("#"+datagirdID).datagrid('options').url = '';
	}
	datagridObj = $("#"+datagirdID).datagrid({
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
        columns:getAccountColumns(),
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });
	
	$("#"+datagirdID).datagrid('loadData',[]);
    $("#"+datagirdID).datagrid('reloadFooter',[]);
}

function queryForm(){
	$("#startCount").val("");
	$("#endCount").val("");
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)
    fromObjStr.supplierName = fromObjStr.supplierName.substring(fromObjStr.supplierName.lastIndexOf(']')+1)

	$("#"+datagirdID).datagrid("options").method = "post";
	$("#"+datagirdID).datagrid('options').url = contextPath + '/settle/supplierAccountCurrent/getAccountCurrentList';
	$("#"+datagirdID).datagrid('load',fromObjStr);
}

var dg;
/**
 * 导出表单
 */
function exportData(){
	$("#startCount").val('');
	$("#endCount").val('');
	dg = $("#"+datagirdID);
	var length = $("#"+datagirdID).datagrid('getData').total;
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

/**
 * 导出
 */
function exportExcel(){
	var length = $("#"+datagirdID).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}

	$("#queryForm").attr("action",contextPath + '/settle/supplierAccountCurrent/exportAccountCurrentList');
	
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