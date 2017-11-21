/**
 * Created by wxl on 2016/11/21.
 * pos登记-列表
 */
$(function(){
    initDatagridPosOrders();
});
var gridHandel = new GridClass();
//初始化表格
function initDatagridPosOrders(){
    $("#registerList").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
		height:'100%',
		width:'100%',
		singleSelect: true,
        columns:[[
            {field: 'id', title: ' ID', width: '100px', align: 'left',hidden:true},
            {field: 'branchCode', title: ' 机构编码', width: '150px', align: 'left'},
            {field: 'branchName', title: '机构名称', width: '150px', align: 'left'},
            {field: 'posNo', title: 'POS机编号', width: '150px', align: 'left'},
			{field: 'createUserCode', title: '用户编码', width: '150px', align: 'left'},
			{field: 'createUserName', title: '姓名', width: '150px', align: 'left'},
			{field: 'loginTime', title: '登录时间', width: '150px', align: 'left',
				 formatter: function(value,row,index){
						if (value) {
							return new Date(value).format('yyyy-MM-dd hh:mm:ss');
						}
						return "";
                 }
			},
			
			{field: 'exitTime', title: '交班时间', width: '150px', align: 'left'
			,
			 formatter: function(value,row,index){
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm:ss');
					}
					return "";
          }
			},
			{field: 'operate', title: '操作', width: '100px', align: 'center',
				 formatter: function(value,row,index){
                     if (row.isFinish==1){
                    	   return '<span onClick="getShift(\''+row.id+'\')" style="color:#4395ff">详情</span>';
                     }
                     else {
                         return '<span onClick="shiftChange(\''+row.id+'\')" style="color:#4395ff">交班</span>';;
                     }
                 }
			},
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
        
    });
    queryForm();
}

//新增dalog

function shiftChange(id){
	var dg = $("#registerList");
	$_jxc.confirm('是否交班?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/pos/shiftHistory/shiftExchange",
		    	type:"POST",
		    	data:{
		    		id: id
		    	}
		    },function(result){
	    		
	    		if(result['code'] == 0){
	    			$_jxc.alert("交班成功");
	    			dg.datagrid('reload');
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
			
		}
		
	})
	
}
function getShift(id){
	var  dalogTemp = $('<div id="#regadd"/>').dialog({
		    href:contextPath + "/pos/shiftHistory/shiftDetail?id="+id,
		    width:400,
		    height:500,
		    title:"班次详情",
		    closable:true,
		    resizable:true,
		    onClose:function(){
		        $(dalogTemp).panel('destroy');
		    },
		    modal:true,
		    onLoad:function(){

		    },
		});
	}

//查询pos
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	$("#registerList").datagrid("options").method = "post";
	$("#registerList").datagrid('options').url = contextPath + '/pos/shiftHistory/queryList';
	$("#registerList").datagrid('load', fromObjStr);
}
/**
 * 店铺名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#regBranchId").val(data.branchesId);
		$("#branchInfo").val(data.branchName);
	},'DP','');
}


