/**
 * Created by zhaoly on 2017/9/12.
 */
/**
 * 领用查询
 */
$(function() {
    initdefaultElement();
    initDatagridStock();
    // 单据状态切换
    changeStatus();

    //机构选择初始化
	$('#branchSelect').branchSelect({
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
    

    //操作员组件初始化
    $('#categorySelect').categorySelect({
        loadFilter:function(data){
            return data;
        },
        //选择完成之后
        onAfterRender:function(data){
            $("#categoryCode").val(data.categoryCode);
        }
    });
});

function initdefaultElement() {
    // 开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev", 30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
   /* $("#skuName").prop("disabled",true);
    $("#skuCode").prop("disabled",true);
    $("#categoryType").combobox({disabled:true});*/
    $("#categoryType").combobox({disabled:true});
}

// 单据状态切换
var reportType = "1";
function changeStatus() {
    $(".radioItem").change(function() {
        reportType = $('input[type="radio"][name="reportType"]:checked').val();
        if(reportType == "1"){
            $("#formNo").prop("disabled",false);
            $("#skuName").prop("disabled",false);
            $("#skuCode").prop("disabled",false);
            $("#categoryType").combobox({disabled:true});

        }else if(reportType == "2"){
            $("#formNo").prop("disabled",true);
            $("#formNo").val("");
            $("#skuName").prop("disabled",false);
            $("#skuCode").prop("disabled",false);
            $("#categoryType").combobox({disabled:true});

        }
        else if(reportType == '3'){
            $("#formNo").prop("disabled",true);
            $("#formNo").val("");
            $("#skuName").prop("disabled",true);
            $("#skuName").val("");
            $("#skuCode").prop("disabled",true);
            $("#skuCode").val("");
            $("#categoryType").combobox({disabled:false});
        }
        initDatagridStock();
    });
}

var gridHandel = new GridClass();
var datagridID = "stockAdjustReport";
var dg = null;
//初始化表格
function initDatagridStock(){
	var defaultColumns;

	switch (reportType) {
		case '1':
			defaultColumns = eval("(" + JSON.parse($("#columnsArr").val()).columns1 + ")");
			break;
		case '2':
			defaultColumns = eval("(" + JSON.parse($("#columnsArr").val()).columns2 + ")");
			break;
		case '3':
			defaultColumns = eval("(" + JSON.parse($("#columnsArr").val()).columns3 + ")");
			break;
		case '4':
			defaultColumns = eval("(" + JSON.parse($("#columnsArr").val()).columns4 + ")");
			break;
		default:
			return;
	}

	if(dg){
		$("#"+datagridID).datagrid('options').url = '';
	}
    gridHandel.setGridName(datagridID);
    dg = $("#"+datagridID).datagrid({
		method:'post',
		align:'center',
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		showFooter:true,
		fitColumns:false,    //每列占满
		height:'100%',
		width:'100%',
		pageSize:50,
		columns:[defaultColumns], 
		onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
		}
	});
    $("#"+datagridID).datagrid('loadData',[]);
    $("#"+datagridID).datagrid('reloadFooter',[]);
}

function onChangeSelect() {
    reportType =  $("#categoryType").combobox("getValue");
    initDatagridStock();
}

function getColumns(){
    var accountType = $('input[type="radio"][name="type"]:checked').val();
    var categoryType = $('#categoryType').val();
    var defaultColumns = [];

    if(accountType == '1'){
        defaultColumns =defaultColumns.concat([
            {field: 'branchName', title: '机构名称', width: '120px', align: 'left'},
            {field: 'formNo',title:'单号',width:'150px',align:'left'},
            {field: 'validTime', title: '领用时间', width: '150px', align: 'left',
                formatter: function (value, row, index) {
                    if(!value){
                        return '';
                    }
                    return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                }
            }
        ])
    }

    if(accountType == '1' || accountType == '2'){
        defaultColumns =defaultColumns.concat([
            {field: 'skuCode',title:'货号',width:'150px',align:'left'},
            {field: 'skuName',title:'商品名称',width:'150px',align:'left'},
            {field: 'barCode',title:'条码',width:'150px',align:'left'},
            {field: 'unit',title:'单位',width:'80px',align:'left'},
            {field: 'spec',title:'规格',width:'80px',align:'left'},
        ])
    }

    defaultColumns =defaultColumns.concat([{field: 'firstCategory',title:'一级分类',width:'150px',align:'left'}]);

    if(accountType == '1' || accountType == '2' || (accountType == '3' && categoryType == '2')){
        defaultColumns =defaultColumns.concat([{field: 'secondCategory',title:'二级分类',width:'150px',align:'left'}]);
    }

    defaultColumns =defaultColumns.concat([{field: 'realNum', title: '领用数量', width: '80px', align: 'right',
        formatter: function (value, row, index) {
            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
        }
    }]);

    if(accountType == '1' || accountType == '2'){
        defaultColumns =defaultColumns.concat([{field: 'price', title: '成本价', width: '80px', align: 'right',
            formatter: function (value, row, index) {
                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            }
        }]);
    }

    defaultColumns =defaultColumns.concat([{field: 'amount', title: '领用金额', width: '80px', align: 'right',
        formatter: function (value, row, index) {
            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
        }
    }]);

    if(accountType == '1' || accountType == '2'){
        defaultColumns =defaultColumns.concat([{field: 'salePrice', title: '零售价', width: '80px', align: 'right',
            formatter: function (value, row, index) {
                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            }
        }]);
    }

    defaultColumns =defaultColumns.concat([{field: 'saleAmount', title: '零售金额', width: '80px', align: 'right',
        formatter: function (value, row, index) {
            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
        }
    }]);

    console.log(defaultColumns,defaultColumns.length);
    return [defaultColumns];
}

// 查询
function queryForm() {
	 $("#startCount").val("");
	 $("#endCount").val("");
    var fromObjStr = $('#queryForm').serializeObject();
    //2.7精确查询
    fromObjStr.branchName = "";
    fromObjStr.createUserName = "";

    $("#"+datagridID).datagrid("options").method = "post";
    $("#"+datagridID).datagrid('options').url = contextPath + '/report/stock/stockAdjustReport/list';
    $("#"+datagridID).datagrid('load', fromObjStr);
}

/**
 * 导出表单
 */
function exportLeadSearchList(){
    var length = $('#'+datagridID).datagrid('getData').rows.length;
    if(length == 0){
        $_jxc.alert("无数据可导");
        return;
    }
    $('#exportWin').window({
        top:($(window).height()-300) * 0.5,
        left:($(window).width()-500) * 0.5
    });
    $("#exportWin").show();
    $("#totalRows").html($('#'+datagridID).datagrid('getData').total);
    $("#exportWin").window("open");
}

//调用导出方法
/*function exportExcel(){
    $("#exportWin").hide();
    $("#exportWin").window("close");

    $("#queryForm").attr("action",contextPath+"/report/stock/stockAdjustReport/exportList");
    $("#queryForm").submit();
}*/
function exportExcel(){
	var length = dg.datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	
	$("#queryForm").form({
		success : function(data){
			if(data==null){
				$_jxc.alert("导出数据成功！");
			}else{
				$_jxc.alert(JSON.parse(data).message);
			}
		}
	});
	$("#queryForm").attr("action",contextPath+"/report/stock/stockAdjustReport/export");
	
	$("#queryForm").submit();
}


/**
 * 重置
 */
var resetForm = function() {
    $("#queryForm").form('clear');
};