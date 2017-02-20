$(function(){
    initDatagridRequire();
});

function hiddenFiled(type){
	var saleFileds = ['costAmount','beginCostAmount','endCostAmount','avgCostAmount','costRotationRate','costRotationDay'];
	var costFileds = ['originalSaleAmount','beginSaleAmount','endSaleAmount','avgSaleAmount','saleRotationRate','saleRotationDay'];
	if(type == 0){
		saleFileds.forEach(function(obj,index){
			$("#rotationReport").datagrid('showColumn',obj);
		});
		costFileds.forEach(function(obj,index){
			$("#rotationReport").datagrid('hideColumn',obj);
		});
	}else{
		saleFileds.forEach(function(obj,index){
			$("#rotationReport").datagrid('hideColumn',obj);
		});
		costFileds.forEach(function(obj,index){
			$("#rotationReport").datagrid('showColumn',obj);
		});
	}
}

/**
 * 机构名称
 */
function selectBranches() {
	new publicAgencyService(function(data) {
		$("#branchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
	}, 'BF', '');
}
/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
};

/**
 * 查询置
 */
function queryForm(){
	if($("#branchName").val()==""){
        messager("请选择机构");
        return;
    } 
	if($("#startTime").val()==""){
		messager("请选择开始时间");
		return;
	} 
	if($("#endTime").val()==""){
		messager("请选择结束时间");
		return;
	} 
	$("#startCount").attr("value",null);
	$("#endCount").attr("value",null);
	var fromObjStr = $('#queryForm').serializeObject();
	$("#rotationReport").datagrid("options").method = "post";
	$("#rotationReport").datagrid('options').url = contextPath + '/report/rotation/getRotaRateReportList';
	$("#rotationReport").datagrid('load', fromObjStr);
}

var gridHandel = new GridClass();
//初始化表格
function initDatagridRequire() {
	gridHandel.setGridName("rotationReport");
	dg = $("#rotationReport").datagrid({
		method : 'post',
		align : 'center',
		singleSelect : false, //单选  false多选
		rownumbers : true, //序号
		pagination : true, //分页
		fitColumns : true, //每列占满
		showFooter : true,
		height : '100%',
		pageSize : 50,
		width : '100%',
		columns : [ [ {
			field : 'branchCode',
			title : '机构编号',
			width : '90px',
			align : 'left'
		}, {
			field : 'branchName',
			title : '机构名称',
			width : '90px',
			align : 'left'
		},{
			field : 'skuCode',
			title : '货号',
			width : '90px',
			align : 'left'
		}, {
			field : 'skuName',
			title : '商品名称',
			width : '90px',
			align : 'left'
		}, {
			field : 'rotationDay',
			title : '期间天数',
			width : '90px',
			align : 'left'
		}, {
			field : 'saleNum',
			title : '销售数量',
			width : '90px',
			align : 'left'
		}, {
			field : 'saleAmount',
			title : '期间销售金额',
			width : '90px',
			align : 'left'
		}, {
//			--------------------------------------------------		
			field : 'costAmount',
			title : '期间销售成本金额',
			width : '90px',
			hidden: true,
			align : 'left'
		}, {
			field : 'beginCostAmount',
			title : '期初库存金额',
			width : '90px',
			hidden: true,
			align : 'left'
		}, {
			field : 'endCostAmount',
			title : '期末库存金额',
			width : '90px',
			hidden: true,
			align : 'left'
		}, {
			field : 'avgCostAmount',
			title : '期间平均库存金额',
			width : '90px',
			hidden: true,
			align : 'left'
		}, {
			field : 'costRotationRate',
			title : '库存周转率',
			width : '90px',
			hidden: true,
			align : 'left'
		}, {
			field : 'costRotationDay',
			title : '库存周转天数',
			width : '90px',
			hidden: true,
			align : 'left'
		}, {
//	--------------------------------------------------		
			field : 'originalSaleAmount',
			title : '期间原价销售金额',
			width : '90px',
			align : 'left'
		}, {
			field : 'beginSaleAmount',
			title : '期初销售金额',
			width : '90px',
			align : 'left'
		}, {
			field : 'endSaleAmount',
			title : '期末销售金额',
			width : '90px',
			align : 'left'
		}, {
			field : 'avgSaleAmount',
			title : '期间平均销售金额',
			width : '90px',
			align : 'left'
		}, {
			field : 'saleRotationRate',
			title : '库存周转率',
			width : '90px',
			align : 'left'
		}, {
			field : 'saleRotationDay',
			title : '库存周转天数',
			width : '90px',
			align : 'left'
		}, ] ],
		onLoadSuccess : function(data) {
			gridHandel.setDatagridHeader("center");
		}
	});
}

var dg;
/**
 * 导出
 */
function exportData(){
	var length = $('#rotationReport').datagrid('getData').total;
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


/**
 * 商品选择
 */
function selectGoods(searchKey) {
	var branchId=null;
	//判定供应商是否存在
    if($("#branchId").val()==""){
        successTip("请先选择机构");
        return;
    }
    branchId=$("#branchId").val();
	gFunGoodsSelect(searchKey,branchId);
}
//商品选择 公共使用
function gFunGoodsSelect(searchKey,branchId){
	new publicGoodsService("PA",function(data){
    	if(data.length==0){
            return;
        }
    	$("#skuId").val(data[0].skuId);
    	$("#skuName").val(data[0].skuName);
        
    },searchKey,0,"","",branchId,"","0");
}


/**
 * 导出
 */
function exportExcel(){
	var length = $("#rotationReport").datagrid('getData').total;
	if(length == 0){
		$.messager.alert('提示',"没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	console.log(fromObjStr);
	$("#queryForm").form({
		success : function(data){
			if(data==null){
				$.messager.alert('提示',"导出数据成功！");
			}else{
				$.messager.alert('提示',JSON.parse(data).message);
			}
		}
	});
	$("#queryForm").attr("action",contextPath+"/report/rotation/exportRotaRateReportList?"+fromObjStr);
	$("#queryForm").submit();
}
/**
 * 打印
 */
function printReport(){
	var length = $("#rotationReport").datagrid('getData').total;
	if(length == 0){
		$.messager.alert('提示',"没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	console.log(fromObjStr);
	var param=setParams("queryForm");
	console.log(param);
	parent.addTabPrint("库存周转率","打印",contextPath+"/report/rotation/printRotaRateReport?" + param);
}

function setParams(formId){  
	var param="";
	var arr = $('#' + formId).serializeArray();
	if(arr != null){
		for(var i=0;i<arr.length;i++){
			var _val = encodeURIComponent(arr[i].value);
			if(_val){
				param = param + arr[i].name + "="+_val+"&";
			}
		}
	}
	if(param){
		param = param.substring(0,param.length-1);
	}
	return param;
}