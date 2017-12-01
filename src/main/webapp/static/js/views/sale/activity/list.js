$(function(){
    // 开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    
    $(".radioItem").change(function () {
    	var auditStatus = $(this).val(); //选中的值
    	if(auditStatus === "1"){    		
    		$("#isExpired").combobox("readonly", false);
    	}else{
    		$("#isExpired").combobox("setValue", "");
    		$("#isExpired").combobox("readonly", true);
    	}
    })
    
    initDatagridRequire();
});
var gridHandel = new GridClass();
var grid = new GridClass();
//初始化表格
function initDatagridRequire(){
	gridHandel.setGridName("saleMange");
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("skuCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
                },100)
            }else{
               selectGoods(arg);
            }
        },
    })
    $("#saleMange").datagrid({
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
		height:'100%',
		pageSize:50,
		width:'100%',
        columns:[[
            {field:'activityCode',title:'活动编号',width:'220px',align:'left',
               formatter : function(value, row,index) {
                 var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.id+'\')">' + value + '</a>';
                 return strHtml;
              },
            },
            {field:'id',title:'货号',width:'85px',align:'left',hidden:true},
			{field:'activityName', title: '活动名称', width: '200px', align: 'left'},
			{field:'activityType',title:'活动类型',width:'150px',align:'left',formatter:function(value,row,index){
            	if(value == '1'){
            		return '特价';
            	}else if(value == '2'){
            		return '折扣';
            	}else if(value == '3'){
            		return '偶数特价';
            	}else if(value == '4'){
            		return '换购';
            	}else if(value == '5'){
            		return '满减';
            	}else if(value == '6'){
            		return '组合特价';
            	}else if(value == '10'){
            		return '买满送';
                } else if (value == '11') {
                    return 'N元N件';
                } else if (value == '12') {
                    return '特价打包';
                } else {
            		return '未知类型：'+ value;
            	}
            }},
			{field:'startTime',title:'开始日期',width:'150px',align:'left', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd');
                }
                return "";
            }},
	        {field:'endTime',title:'结束日期',width:'150px',align:'left', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd');
                }
                return "";
            }},
	        /*{field:'dailyStartTime',title:'活动时段',width:'80px',align:'left'},
	        {field:'dailyEndTime',title:'活动时段',width:'80px',align:'left'},*/
			{field:'dailyStartTime',title:'活动时段',width:'150px',align:'left', formatter: function (value, row, index) {
				//
				if (row) {
					return row.dailyStartTime+"-"+row.dailyEndTime;
				}
				return "";
			}},
	        {field:'activityStatus',title:'活动状态',width:'80px',align:'left',formatter:function(value,row,index){
            	if(value == '0'){
            		return '未审核';
            	}else if(value == '1'){
            		return '已审核';
            	}else if(value == '2'){
            		return '已终止';
            	}else{
            		return '未知类型：'+ value;
            	}
            }},
	        {field:'updateUserName',title:'制单人',width:'80px',align:'left'},
	        {field:'validUserName',title:'审核人',width:'80px',align:'left'},
	        {field:'validTime',title:'审核日期',width:'150px',align:'left', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                }
                return "";
            }},
            

      ]],
      onLoadSuccess:function(data){
		gridHandel.setDatagridHeader("center");

	 }
    });
	queryForm();
}

//查询入库单
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	$("#saleMange").datagrid("options").method = "post";
	$("#saleMange").datagrid('options').url = contextPath +'/sale/activity/listData';
	$("#saleMange").datagrid('load', fromObjStr);
}


/**
 * 活动店铺名称
 */
function searchBranch(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
	},'DP','');
}

//pos新增
function addActivity(){
	toAddTab("新增促销活动",contextPath + "/sale/activity/add");
}

//复制活动
function copyActivity(){
	var selectedObj = $("#saleMange").datagrid("getSelected");
	if(selectedObj){
		toAddTab("复制促销活动",contextPath + "/sale/activity/toCopy?from=toCopy&activityId="+selectedObj.id);
	}else{
		$_jxc.alert('请选择一个活动记录');
	}
}

//删除
function delActivity(){
	var dg = $("#saleMange");
	var row = dg.datagrid("getSelected");
	if(!row || (row && row.length <= 0)){
		$_jxc.alert('请选择一个活动记录');
		return;
	}
	console.log(row.id);
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/sale/activity/delete",
		    	data:{
		    		activityId : row.id
		    	}
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
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
	 $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	 $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
};

// 终止
function stop(){
	var activityId = $("#activityId").val();
	$_jxc.confirm('是否终止此活动？',function(data){
		if(data){
			$_jxc.ajax({
				url : contextPath+"/sale/activity/stop",
				type : "POST",
				data : {
					activityId:$("#activityId").val(),
				}
			},function(result){
				if(result['code'] == 0){
					$_jxc.alert("操作成功！",function(){
						location.href = contextPath +"/sale/activity/edit?activityId="+activityId;
					});
				}else{
					$_jxc.alert(result['message']);
				}
			});
		}
	});
}