/**
 * Created by zhanghuan on 2016/8/30.
 * 配送-出库单
 */
var indexTab = 0;
var tableIdName = 'deliverFormList';
var tempURL = '/form/deliverSelect/getDeliverFormList';
var sourceBranchId;
var branchName;
$(function(){
	//开始和结束时间
	toChangeDatetime(0);
	sourceBranchId = $("#sourceBranchId").val();
	loadTabs();
	toBtnDisable('btnAdd','btnDel');
	setQueryDataDA();
    $("#checkDiv").removeClass("uhide");
    setDivTime();

	if(getUrlQueryString('message')=='0'){
		$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30)+" 00:00");
		$('#tabs').tabs({'selected':1});
        initDatagridRequireOrdersDO();
    }else{
        initDatagridRequireOrdersDA();
	}


    //机构选择初始化 发货机构
    $('#sourceBranch').branchSelect({
    	param:{
            branchId:sourceBranchId
		},
        onAfterRender:function(data){
			$("#sourceBranchId").val(data.branchId);
		}

	});

    //机构选择初始化 收货机构
    $('#targetBranch').branchSelect({
        onAfterRender:function(data){
            $("#targetBranchId").val(data.branchId);
            //$("#targetBranchName").val("["+data.branchCode+"]"+data.branchName)
        }
	});

    //操作员组件初始化
    $('#operateorSelect').operatorSelect({
        loadFilter:function(data){
            data.operateUserId = data.id;
            data.operateUserName = data.name;
            return data;
        }
    });

});


$(document).on('input','#remark',function(){
	var val=$(this).val();
	var str = val;
	   var str_length = 0;
	   var str_len = 0;
	      str_cut = new String();
	      str_len = str.length;
	      for(var i = 0;i<str_len;i++)
	     {
	        a = str.charAt(i);
	        str_length++;
	        if(escape(a).length > 4)
	        {
	         //中文字符的长度经编码之后大于4
	         str_length++;
	         }
	         str_cut = str_cut.concat(a);
	         if(str_length>200)
	         {
	        	 str_cut.substring(0,i)
	        	 remark.value = str_cut;
	        	 break;
	         }
	    }
});

var gridHandel = new GridClass();
// 加载要货申请单
function initDatagridRequireOrdersDA(){
	var fromObjStr = $('#queryForm').serializeObject();
	var updatePermission = $("#updatePermission").html().trim();
	$("#"+tableIdName).datagrid({
		//title:'普通表单-用键盘操作',
		method:'post',
		align:'center',
		queryParams:fromObjStr,
		url:contextPath + tempURL,
		//toolbar: '#tb',     //工具栏 id为tb
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		fitColumns:true,    //每列占满
		//fit:true,         //占满
		showFooter:true,
		height:'100%',
		width:'100%',
		columns:[[
			{field:'check',checkbox:true},
			{field:'formNo',title:'要货单号',width:'140px',align:'left',formatter:function(value,row,index){
				if(updatePermission){
					var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'新增出库单\',\''+ contextPath +'/form/deliverForm/addDeliverForm?deliverFormId='+ row.id +'&refDeliverType='+ row.formType +'&deliverType=DO\')">' + value + '</a>';
					return strHtml;
				}else{
					return value;
				}
			}},
			{field: 'targetBranchName', title: '要货机构', width: '200px', align: 'left'},
			{field: 'sourceBranchName', title: '发货机构', width: '200px', align: 'left'},
			{field: 'amount', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
				}
			},
			{field: 'salesman', title: '业务人员', width: '130px', align: 'left'},
			{field: 'createUserName', title: '制单人员', width: '130px', align: 'left'},
			{field: 'validUserName', title: '审核人员', width: '130px', align: 'left'},
			{field: 'remark', title: '备注', width: '200px', align: 'left'}
		]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
	});
    var param = {
        distributionPrice:["amount"],
    }
    priceGrantUtil.grantPrice(tableIdName,param);
}
// 加载配送出库单
function initDatagridRequireOrdersDO(){
	var updatePermission = $("#updatePermission").html().trim();
	var fromObjStr = $('#queryForm').serializeObject();
	$("#"+tableIdName).datagrid({
		//title:'普通表单-用键盘操作',
		method:'post',
		align:'center',
		queryParams:fromObjStr,
		url:contextPath + tempURL,
		//toolbar: '#tb',     //工具栏 id为tb
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		fitColumns:true,    //每列占满
		//fit:true,            //占满
		showFooter:true,
		height:'100%',
		width:'100%',
		columns:[[
			{field:'check',checkbox:true},
			{field:'formNo',title:'发货单号',width:'140px',align:'left',formatter:function(value,row,index){
				if(updatePermission){
					var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'出库单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.deliverFormId +'&formType=DO\')">' + value + '</a>';
					return strHtml;
				}else{
					return value;
				}
			}},
			{field:'status',title: '审核状态', width: '100px', align: 'center'},
			{field: 'dealStatusDO', title: '单据状态', width: '100px', align: 'center'},
			{field: 'sourceBranchName', title: '发货机构', width: '200px', align: 'left'},
			{field: 'targetBranchName', title: '收货机构', width: '200px', align: 'left'},
			{field:'referenceNo',title:'引用单号',width:'140px',align:'left',formatter:function(value,row,index){
				if(updatePermission){
					var strHtml = "";
					if(value.startWith("DR")){
						strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'退货单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.referenceId +'&deliverType=DR\')">' + value + '</a>';
					}else if(value.startWith("DA")){
						var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'要货单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.referenceId +'&deliverType=DA\')">' + value + '</a>';
					}else if(value.startWith("DY")){
						var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'直送要货单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.referenceId +'&deliverType=DY\')">' + value + '</a>';
					}
					return strHtml;
				}else{
					return value;
				}
			}},
			{field: 'amount', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
					}
					return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
				}
			},
			{field: 'createUserName', title: '制单人员', width: '130px', align: 'left'},
			{field: 'createTime', title: '制单日期', width: '120px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}
			},
			{field: 'validUserName', title: '审核人员', width: '130px', align: 'left'},
			{field: 'remark', title: '备注', width: '200px', align: 'left'},
			{field: 'updateUserName', title: '操作人员', width: '130px', align: 'left'},
			{field: 'updateTime', title: '操作时间', width: '120px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}
			}
		]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
	});

    var param = {
        distributionPrice:["amount"],
    }
    priceGrantUtil.grantPrice(tableIdName,param);
}

//新增出库单
function addDeliverForm(){
	toAddTab("新增出库单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DO");
}

//查询要货单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.targetBranchName = "";
    fromObjStr.sourceBranchName = "";
    fromObjStr.operateUserName = fromObjStr.operateUserName.substring(fromObjStr.operateUserName.lastIndexOf(']')+1)
	$("#" + tableIdName).datagrid('load',fromObjStr);
}

//删除
function delDeliverForm(){
	var tab = $('#tabs').tabs('getSelected');
	var index = $('#tabs').tabs('getTabIndex',tab);
	var dg = $("#deliverFormList");
	if(index == 1){
		dg = $("#processedFormList")
	}
	var row = dg.datagrid("getChecked");
	var ids = [];
	for(var i=0; i<row.length; i++){
		ids.push(row[i].deliverFormId);
	}
	if (ids.length == 0) {
		$_jxc.alert("请选择行数据！");
		return;
	}
	if(rowIsNull(row)){
		return null;
	}
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/deliverForm/deleteDeliverForm",
		    	contentType:"application/json",
		    	data:JSON.stringify(ids)
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("删除成功");
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
	    		dg.datagrid('reload');
		    });
		}
	});
}

/**
 * 禁用按钮
 * @param id
 */
function toBtnDisable(addId,delId){
	// $("#"+addId).removeClass('ubtns-item').addClass('ubtns-item-disabled').removeAttr('onclick');
	$("#"+delId).removeClass('ubtns-item').addClass('ubtns-item-disabled').removeAttr('onclick');
}
/**
 * 开启按钮
 * @param id
 */
function toBtnEnable(addId,delId){
	$("#"+addId).removeClass('ubtns-item-disabled').addClass('ubtns-item').attr('onclick','addDeliverForm()');
	$("#"+delId).removeClass('ubtns-item-disabled').addClass('ubtns-item').attr('onclick','delDeliverForm()');
}
//打印
function printDesign(){
     var dg = $("#gridRequireOrders");
     var row = dg.datagrid("getSelected");
     if(rowIsNull(row)){
           return null;
     }
     //弹出打印页面
     parent.addTabPrint('PASheet' + row.id,row.formNo+'单据打印',contextPath + '/printdesign/design?page=PASheet&controller=/form/purchase&template=-1&sheetNo=' + row.id + '&gridFlag=PAGrid','');
}

/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};

// 加载选项卡
function loadTabs(){
	$('#tabs').tabs({
		border:false,
		onSelect:function(title){
			// 获取选项卡下标
			indexTab = $('#tabs').tabs('getTabIndex',$('#tabs').tabs('getSelected'));
			if (indexTab === 0) {
				toBtnDisable('btnAdd','btnDel');
				setQueryDataDA();

                $("#auditStatus").addClass("uhide");
                $("#orderStatus").addClass("uhide");
                $("#checkDiv").removeClass("uhide");

                initDatagridRequireOrdersDA();
			} else {
				toBtnEnable('btnAdd','btnDel');
				setQueryDataDO();
				// delDivTime();
                $("#auditStatus").removeClass("uhide");
                $("#orderStatus").removeClass("uhide");
                $("#checkDiv").addClass("uhide");
                initDatagridRequireOrdersDO();
			}
		}
	});
}
// 设置值 待处理要货单查询的是发货机构的
function setQueryDataDA() {
	tempURL = '/form/deliverSelect/getDeliverFormList';
	tableIdName = 'deliverFormList';
}

// 设置值
function setQueryDataDO() {
	tempURL = '/form/deliverForm/getDeliverForms';
	tableIdName = 'processedFormList';

}



var deliverAuditStatus = '0';
var checkboxTime = 'checked';
var popupSearchDateTime = dateUtil.getCurrentDateTime().format("yyyy-MM-dd hh:mm");

// 添加被移除之前的时间值
function setDivTime(){
	if (checkboxTime == 'checked') {
		$("#checkboxTime").attr('checked','checked');
	} else {
		$("#checkboxTime").attr('checked',false);
	}
	$("#popupSearchDateTime").val(popupSearchDateTime);
}