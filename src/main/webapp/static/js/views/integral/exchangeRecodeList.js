
$(function(){
	initDatagrid();
});

//初始化表格
var dg;
function initDatagrid(){
	dg=$("#goodsTab").datagrid({
		//title:'普通表单-用键盘操作',
		align:'center',
		method: 'post',
		//url: contextPath+"/goods/report/getList",
		singleSelect:true,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		showFooter:true,
		pageSize:20,
		height:'100%',
		columns:[[  
		          {field:"id",title:"礼品兑换记录id",hidden:true},  
		          {field:"mobile",title:"会员号",width:200},  
		          {field:"skuCode",title:"商品货号",width:200}, 
		          {field:"skuName",title:"礼品名称",width:200},
		          {field:"barCode",title:"条码",width:200},
		          {field:"branchName",title:"机构名称",width:200},
		          {field:"num",title:"兑换数量",width:200},
		          {field:"integral",title:"消耗积分",width:200},
		          {field: "createTime", title: "兑换时间", width: 150, align: "left",formatter : function(createTime){
		    			if(createTime){
		    				var now = new Date(createTime);
		    				var nowStr = now.format("yyyy-MM-dd hh:mm:ss"); 
		    				return nowStr;
		    			}
		    			return null;
		    		}},
		          ]] ,
		          toolBar:"#tg_tb",
		          enableHeaderClickMenu: false,
		          enableHeaderContextMenu: false,
		          enableRowContextMenu: false

	});
}

/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
	$("#branchName").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}

/**
 * 导出
 */
function exportData(){
	var length = $('#goodsTab').datagrid('getData').rows.length;
	if(length == 0){
		successTip("无数据可导");
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

function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");
	$("#queryForm").form({
		success : function(result){
			var dataObj=eval("("+result+")");
			successTip(dataObj.message);
		}
	});
	
	//导出记录上一次查询条件
	$("#queryForm").attr("action",contextPath+"/integral/giftExchangeRecode/exportList");
	$("#queryForm").submit(); 
}

//查询
function query(){
	$("#startCount").val('');
	$("#endCount").val('');
	var params = $("#queryForm").serializeObject();
	params.branchName = params.branchName.substring(params.branchName.lastIndexOf(']')+1)
	$("#goodsTab").datagrid("options").queryParams = params;
	
	
	$("#goodsTab").datagrid("options").method = "post";
	$("#goodsTab").datagrid("options").url = contextPath+"/integral/giftExchangeRecode/getList";
	$("#goodsTab").datagrid("load");
}

//重置
function resetFrom(){
	$("#queryForm").form('clear');
}
