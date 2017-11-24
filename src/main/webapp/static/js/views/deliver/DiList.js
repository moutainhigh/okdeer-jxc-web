/**
 * Created by zhanghuan on 2016/8/30.
 * 配送-出库单
 */
var indexTab = 0;
var tableIdName = 'deliverFormList';
var tempURL = '/form/deliverSelect/getDeliverFormList';
var targetBranchId;
var branchName;
$(function(){
	//开始和结束时间
	toChangeDatetime(0);
	loadTabs();
	toBtnDisable('btnAdd','btnDel');
	initDatagridRequireOrdersDO();
	targetBranchId = $("#targetBranchId").val();
	if(getUrlQueryString('message')=='0'){
		 $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30)+" 00:00");
    	$('#tabs').tabs({'selected':1});
    }else if(getUrlQueryString('message')=='1'){
    	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30)+" 00:00");
    	toBtnDisable('btnAdd','btnDel');
 		setQueryDataDO();
 		delDivAuditStatus();
 		initDatagridRequireOrdersDO();
    }else{
    	toBtnDisable('btnAdd','btnDel');
		setQueryDataDO();
		delDivAuditStatus();
		initDatagridRequireOrdersDO();
    }

    //机构选择初始化 发货机构
    $('#sourceBranch').branchSelect({
        onAfterRender:function(data){
            $("#sourceBranchId").val(data.branchId);
        }

    });

    //机构选择初始化 收货机构
    $('#targetBranch').branchSelect({
        param:{
            branchId:targetBranchId
        },
        onAfterRender:function(data){
            branchName = data.branchName;
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
//加载配送出库单
function initDatagridRequireOrdersDO(){
	var fromObjStr = $('#queryForm').serializeObject();
	var updatePermission = $("#updatePermission").html().trim();
    $("#"+tableIdName).datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
		queryParams:fromObjStr,
		url:contextPath + tempURL,
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
			{field:'check',checkbox:true},
            {field:'formNo',title:'出库单号',width:'140px',align:'left',formatter:function(value,row,index){
            	if(updatePermission){
            		var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'新增入库单\',\''+ contextPath +'/form/deliverForm/addDeliverForm?deliverFormId='+ row.id +'&deliverType=DI\')">' + value + '</a>';
            		return strHtml;
            	}else{
            		return value;
            	}
            }},
            //{field:'status',title: '审核状态', width: '100px', align: 'center'},
			{field: 'targetBranchName', title: '收货机构', width: '200px', align: 'left'},
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
            {field: 'createTime', title: '制单日期', width: '120px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}
			},
            {field: 'validUserName', title: '审核人员', width: '130px', align: 'left'},
            {field: 'remark', title: '备注', width: '200px', align: 'left'}
            //{field: 'updateUserName', title: '操作人员', width: '130px', align: 'left'},
            //{field: 'updateTime', title: '操作时间', width: '120px', align: 'center',
			//	formatter: function (value, row, index) {
			//		if (value) {
			//			return new Date(value).format('yyyy-MM-dd hh:mm');
			//		}
			//		return "";
			//	}
			//}
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

//加载配送入库单
function initDatagridRequireOrdersDI(){
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
		//fit:true,            //占满
		showFooter:true,
		height:'100%',
		width:'100%',
		columns:[[
			{field:'check',checkbox:true},
			{field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
				if(updatePermission){
					var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'入库单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.deliverFormId +'&deliverType=DI\')">' + value + '</a>';
					return strHtml;
				}else{
					return value;
				}
			}},
			{field:'status',title: '审核状态', width: '100px', align: 'center'},
			{field: 'sourceBranchName', title: '发货机构', width: '200px', align: 'left'},
			{field: 'targetBranchName', title: '收货机构', width: '200px', align: 'left'},
			{field: 'amount', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
	//queryForm();
    var param = {
        distributionPrice:["amount"],
    }
    priceGrantUtil.grantPrice(tableIdName,param);
}

//新增入库单
function addDeliverForm(){
	toAddTab("新增入库单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DI");
}

//查询入库单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.targetBranchName = "";
    fromObjStr.sourceBranchName = "";
    fromObjStr.operateUserName = fromObjStr.operateUserName.substring(fromObjStr.operateUserName.lastIndexOf(']')+1)
	//$("#deliverFormList").datagrid("options").method = "post";
	//$("#deliverFormList").datagrid('options').url = contextPath + '/form/deliverForm/getDeliverForms';
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
	    			dg.datagrid('reload');
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
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
				$("#refuse").removeClass('ubtns-item-disabled').addClass('ubtns-item').attr('onclick','refuseDeliverForm()');
				setQueryDataDO();
				delDivAuditStatus();
				initDatagridRequireOrdersDO();
			} else {
				toBtnEnable('btnAdd','btnDel');
				$("#refuse").removeClass('ubtns-item').addClass('ubtns-item-disabled').removeAttr('onclick');
				setQueryDataDI();
				addDivAuditStatus();
				initDatagridRequireOrdersDI();
			}
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

// 设置值
function setQueryDataDO() {
	tempURL = '/form/deliverSelect/getDeliverFormList';
	tableIdName = 'deliverFormList';
}

// 设置值
function setQueryDataDI() {
	tempURL = '/form/deliverForm/getDeliverForms';
	tableIdName = 'processedFormList';
}

var deliverAuditStatus = '0';
// 移除审核状态
function delDivAuditStatus() {
	// 清空div
	// $("#remarkDiv").empty();
	// 移除div
	var auditStatus = document.getElementById("auditStatus");
	if (auditStatus) {
		deliverAuditStatus = $("#auditStatus input[name='deliverAuditStatus']:checked").val();
		auditStatus.parentNode.removeChild(auditStatus);
	}
}

// 移除审核状态
function addDivAuditStatus() {
	// 清空div
	// $("#remarkDiv").empty();
	// 移除div
	$("#remarkDiv").after("<div class='ub ub-ac umar-l40 uw-300' id='auditStatus' style='visibility:visible;'><div class='umar-r10 uw-70 ut-r'>审核状态:</div><div class='ub ub-ac umar-r10'><input class='ub' type='radio' id='deliverAuditStatus0' name='deliverAuditStatus' value='0' checked='checked' onclick='queryForm()'/><span>未审核</span></div><div class='ub ub-ac umar-r10'><input class='ub' type='radio' id='deliverAuditStatus1' name='deliverAuditStatus'  value='1' onclick='queryForm()'/><span>已审核</span></div><div class='ub ub-ac umar-r10'><input class='ub' type='radio' id='deliverAuditStatus2' name='deliverAuditStatus' value='' onclick='queryForm()'/><span>全部</span></div></div>");
	setAuditStatusVal();
}

// 添加被移除之前的审核值
function setAuditStatusVal(){
	if (deliverAuditStatus == '0') {
		$("#deliverAuditStatus0").attr('checked','checked');
	} else if (deliverAuditStatus == '1') {
		$("#deliverAuditStatus1").attr('checked','checked');
	} else {
		$("#deliverAuditStatus2").attr('checked','checked');
	}
}

//拒收
function refuseDeliverForm(){
	var tab = $('#tabs').tabs('getSelected');
	var index = $('#tabs').tabs('getTabIndex',tab);
	var dg = $("#deliverFormList");
	var row = dg.datagrid("getChecked");
	var ids = [];
	for(var i=0; i<row.length; i++){
		ids.push(row[i].id);
	}
	if(rowIsNull(row)){
		return null;
	}
	$_jxc.confirm('是否要拒收此单据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/form/deliverForm/refuseDeliverForm",
		    	contentType:"application/json",
		    	data:JSON.stringify(ids)
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("拒收操作成功");
	    			dg.datagrid('reload');
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}