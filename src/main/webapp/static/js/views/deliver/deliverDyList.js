/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单
 */
$(function(){
	//开始和结束时间
	toChangeDatetime(0);
    initDatagridRequireOrders();
    targetBranchId = $("#targetBranchId").val();

    //选择初始化
    $('#operatorComponent').operatorSelect({
        //数据过滤
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



var targetBranchId;
var gridHandel = new GridClass();
//初始化表格
function initDatagridRequireOrders(){
	var updatePermission = $("#updatePermission").html().trim();
    $("#deliverFormList").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        //url:contextPath+'/form/purchase/listData',
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
            {field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
            	if(updatePermission){
            		var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'直送要货单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.deliverFormId +'&deliverType=DY\')">' + value + '</a>';
            		return strHtml;
            	}else{
            		return value;
            	}
            }},
            {field:'status',title: '审核状态', width: '100px', align: 'center'},
			{field: 'dealStatus', title: '单据状态', width: '60px', align: 'center'},
			{field: 'targetBranchName', title: '要货机构', width: '200px', align: 'left'},
//			{field: 'salesman', title: '业务人员', width: '130px', align: 'left'},
			{field: 'untaxedAmount', title: '不含税单据金额', width: '120px', align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
				}
			},
			{field: 'amount', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }
			},
            {field: 'sourceBranchName', title: '发货机构', width: '200px', align: 'left'},
            {field: 'createUserName', title: '制单人员', width: '130px', align: 'left'},
//            {field: 'validityTime', title: '有效期限', width: '120px', align: 'center',
//				formatter: function (value, row, index) {
//					if (value) {
//						return new Date(value).format('yyyy-MM-dd');
//					}
//					return "";
//				}
//			},
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
			},
			{field: 'stopUserName', title: '终止人', width: '130px', align: 'left'},
			{field: 'stopTime', title: '终止时间', width: '120px', align: 'center',
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
    queryForm();

    var param = {
        distributionPrice:["amount","untaxedAmount"],
    }
    priceGrantUtil.grantPrice("deliverFormList",param);
}

//新增要货单
function addDeliverForm(){
	toAddTab("新增直送要货单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DY");
}

//查询要货单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    //fromObjStr.targetBranchName = fromObjStr.targetBranchName.substring(fromObjStr.targetBranchName.lastIndexOf(']')+1)
    fromObjStr.operateUserName = fromObjStr.operateUserName.substring(fromObjStr.operateUserName.lastIndexOf(']')+1)

	$("#deliverFormList").datagrid("options").method = "post";
	$("#deliverFormList").datagrid('options').url = contextPath + '/form/deliverForm/getDeliverForms';
	$("#deliverFormList").datagrid('load', fromObjStr);
}

function clearBranchCode(obj,branchId){
	var branchName = $(obj).val();
	
	//如果修改名称
	if(!branchName || 
			(branchName && branchName.indexOf("[")<0 && branchName.indexOf("]")<0)){
		$("#" + branchId +"").val('');
	}
}

//删除
function delDeliverForm(){
	var dg = $("#deliverFormList");
	var row = dg.datagrid("getChecked");
	if(row.length <= 0){
		$_jxc.alert('未选择要删除的单据！');
		return;
	}
	var ids = [];
	for(var i=0; i<row.length; i++){
		ids.push(row[i].deliverFormId);
	}
	$_jxc.confirm('是否要删除选中数据?',function(data){
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

/**
 * 机构
 */
function selectBranches(){
	new publicAgencyService(function(data){
//		$("#targetBranchId").val(data.branchesId);
		//$("#targetBranchName").val(data.branchName);
		$("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
	},'',targetBranchId);
}
/**
 * 要货机构
 */
var branchCode = '';
function selectTargetBranch(){
	new publicAgencyService(function(data){
        $("#targetBranchId").val(data.branchesId);
        //$("#targetBranchName").val(data.branchName);
        $("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
        branchCode = data.branchCode;
        $("#targetBranchType").val(data.type);
        // 为店铺时
        if (data.type != '1' && data.type != '0') {
        	getSourceBranch(data.branchesId);
        }
        if (data.type == '1') {
//        	$("#salesman").val(data.salesman);
//        	$("#spanMinAmount").html(data.minAmount);
//        	$("#minAmount").val(data.minAmount);
        	$("#sourceBranchId").val('');
            $("#sourceBranchName").val('');
        }
	},'DY','');
}
function getSourceBranch(branchesId) {
	$_jxc.ajax({
    	url : contextPath+"/form/deliverForm/getSourceBranch",
    	type : "POST",
    	data : {
    		branchesId : branchesId,
    	}
    },function(result){
		if(result['code'] == 0){
			$("#sourceBranchId").val(result['sourceBranchId']);
//                $("#sourceBranchName").val(result['sourceBranchName']);
            $("#sourceBranchName").val("["+result['sourceBranchCode']+"]"+result['sourceBranchName']);
//                $("#validityTime").val(new Date(result['validityTime']).format('yyyy-MM-dd'));
//                $("#salesman").val(result['salesman']);
//                $("#spanMinAmount").html(result['minAmount']);
//                $("#minAmount").val(result['minAmount']);
		}else{
			$_jxc.alert(result['message']);
		}
    });
}
/**
 * 发货机构
 */
function selectSourceBranch(){
	var targetBranchType = $("#targetBranchType").val();
	if(targetBranchType != '0'){
        new publicAgencyService(function(data){
            if($("#sourceBranchId").val()!=data.branchesId){
                $("#sourceBranchId").val(data.branchesId);
                //$("#sourceBranchName").val(data.branchName);
                $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
                gridHandel.setLoadData([$.extend({},gridDefault)]);
            }
        },'DZ',$("#targetBranchId").val(),'',1);
	} else {
        new publicAgencyService(function(data){
            if($("#sourceBranchId").val()!=data.branchesId){
                $("#sourceBranchId").val(data.branchesId);
                //$("#sourceBranchName").val(data.branchName);
                $("#sourceBranchName").val("["+data.branchCode+"]"+data.branchName);
                gridHandel.setLoadData([$.extend({},gridDefault)]);
            }
        },'DY',$("#targetBranchId").val(),'',1);
    }
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

