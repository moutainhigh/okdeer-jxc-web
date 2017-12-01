/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单
 */
$(function(){
	//开始和结束时间
	/*toChangeDatetime(0);*/
	
	 if(getUrlQueryString('message')=='0'){
		 $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30)+" 00:00");
		 $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd")+" 23:59");
			 initDatagridRequireOrders();
	    }else{
    initDatagridRequireOrders();
    
 // 开始和结束时间
	if(!$("#txtStartDate").val()){
		// 开始和结束时间
		$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30)+" 00:00");
		$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd")+" 23:59");
	    $("#categoryTypeDiv").hide();
		$("#categoryType").combobox("disable");
		
	}else{
		flushFlg = true;
		$('input:radio[name=searchType]')[0].checked = true;
		$('input:radio[name=searchType]')[0].click();
	}
	    }
	 
	//机构组件初始化
	$('#branchSelect').branchSelect({
        onAfterRender:function(data){
            $("#sourceBranchId").val(data.branchId);
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

    //机构选择初始化 收货机构
    $('#targetBranch').branchSelect({
        onAfterRender:function(data){
            $("#targetBranchId").val(data.branchId);
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
//初始化表格
function initDatagridRequireOrders(){
	var updatePermission = $("#updatePermission").html()?$("#updatePermission").html().trim() :'';
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
            		var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'店间配送单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.deliverFormId +'&deliverType=DD\')">' + value + '</a>';
            		return strHtml;
            		//return "<a style='text-decoration: underline;' href='"+ contextPath +"/form/deliverForm/deliverEdit?deliverFormId="+ row.deliverFormId +"'>" + value + "</a>";
            	}else{
            		return value;
            	}
            }},
            {field:'status',title: '审核状态', width: '100px', align: 'center'},
			{field: 'dealStatus', title: '单据状态', width: '60px', align: 'center'},
			{field: 'sourceBranchCode', title: '发货机构编码', width: '200px', align: 'left'},
			{field: 'sourceBranchName', title: '发货机构名称', width: '200px', align: 'left'},
			/*{field: 'salesman', title: '业务人员', width: '130px', align: 'left'},*/
			/*{field: 'amount', title: '单据金额', width: '80px', align: 'right',
				formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
			},*/
            {field: 'targetBranchName', title: '收货机构', width: '200px', align: 'left'},
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
            {field: 'createUserName', title: '制单人员', width: '130px', align: 'left'},
            {field: 'createTime', title: '制单时间', width: '150px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm:ss');
					}
					return "";
				}
			},
			{field: 'validUserName', title: '审核人员', width: '130px', align: 'left'},
			{field: 'remark', title: '备注', width: '200px', align: 'left'}
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
	toAddTab("新增店间配送申请单",contextPath + "/form/deliverDDForm/addView");
}

//查询要货单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
    //2.7精确查询
    fromObjStr.sourceBranchName = "";
    fromObjStr.targetBranchName = "";
    fromObjStr.operateUserName = "";

	$("#deliverFormList").datagrid("options").method = "post";
	$("#deliverFormList").datagrid('options').url = contextPath + '/form/deliverForm/getDeliverForms';
	$("#deliverFormList").datagrid('load', fromObjStr);
}

//删除
function delDeliverForm(){
	var dg = $("#deliverFormList");
	var row = dg.datagrid("getChecked");
	var ids = [];
	if(row.length <= 0){
		$_jxc.alert("请先选择数据！");
		return;
	}
	var checkFlag = false; //审核标示
	for(var i=0; i<row.length; i++){
		ids.push(row[i].deliverFormId);
		if(row[i].status == '审核通过'){
			checkFlag = true;
		}
	}
	if(checkFlag){
		$_jxc.alert("不能删除已审核的单据！");
		return;
	}
	
	if(rowIsNull(row)){
		return null;
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
 * 操作员
 */
function selectOperator(){
	new publicOperatorService(function(data){
//		$("#operateUserId").val(data.id);
		console.log(data.userCode)
		$("#operateUserName").val("["+data.userCode+"]"+data.userName);
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

