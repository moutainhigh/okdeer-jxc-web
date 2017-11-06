/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function(){

    //机构选择初始化
    $('#branchComponent').branchSelect();

    //开始和结束时间
	toChangeDatetime(0);
    //初始化列表
    initCashWaterGrid();
});
var gridHandel = new GridClass();
var dg;
function initCashWaterGrid() {
	dg = $("#cashWater").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        pageSize : pageSize,
        height:'100%',
        columns: [[
            {field: 'branchCode', title: '店铺编号', width: 100, align: 'left'},
            {field: 'branchName', title: '店铺名称', width: 220, align: 'left'},
            {field: 'orderNo', title: '单据编号', width: 180, align: 'left'},
            {field: 'saleTime', title: '销售时间', width: 150, align: 'left',formatter : function(saleTime){
    			if(saleTime){
    				var now = new Date(saleTime);
    				var nowStr = now.format("yyyy-MM-dd hh:mm:ss"); 
    				return nowStr;
    			}
    			return null;
    		}},
            {field: 'saleAmount', title: '销售金额', width: 120, align: 'right',formatter : function(saleAmount){
    			if(saleAmount){
    				saleAmount = parseFloat(saleAmount);
    				return saleAmount.toFixed(2);
    			}
    			return '0.00';
    		}},
            {field: 'businessTypeStr', title: '业务类型', width: 150, align: 'center'},
            {field: 'payAmount', title: '付款金额', width: 120, align: 'right',formatter : function(payAmount){
    			if(payAmount){
    				payAmount = parseFloat(payAmount);
    				return payAmount.toFixed(2);
    			}
    			return '0.00';
    		}},
            {field: 'payType', title: '付款方式', width: 100, align: 'center'},
            {field: 'cashier', title: '收银员', width: 100, align: 'left'},
            {field: 'returnOrderNo', title: '退货原单号', width: 135, align: 'left'},
            {field: 'orderTypeStr', title: '订单类型', width: 100, align: 'center' },
            {field: 'ticketNo', title: '小票号', width: 180, align: 'center' },
            {field: 'orderWayStr', title: '销售方式', width: 100, align: 'center' },
            {field: 'remark', title: '备注', width: 150, align: 'left'},
        ]]
    });
    gridHandel.setDatagridHeader("center");
}


//改变日期
function changeDate(index){
    switch (index){
        case 0: //今天
            $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            $("#txtEndDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            break;
        case 2: //本周
            $("#txtStartDate").val(dateUtil.getCurrentWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 3: //上周
            $("#txtStartDate").val(dateUtil.getPreviousWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousWeek()[1].format("yyyy-MM-dd"));
            break;
        case 4: //本月
            $("#txtStartDate").val(dateUtil.getCurrentMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.getPreviousMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousMonth()[1].format("yyyy-MM-dd"));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.getCurrentSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.getPreviousSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousSeason()[1].format("yyyy-MM-dd"));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.getCurrentYear()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        default :
            break;
    }
}


/**
 * 收银员下拉选
 */
function searchCashierId(){
	new publicOperatorService(function(data){
		$("#cashierId").val(data.id);
		$("#cashierNameOrCode").val("["+data.userCode+"]"+data.userName);
	});
}


/**
 * 导出
 */
function exportData(){
	var length = $('#cashWater').datagrid('getData').rows.length;
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

function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");

	$("#queryForm").attr("action",contextPath+"/cashFlow/report/exportList");
	$("#queryForm").submit();
}


//查询
function query(){
	$("#startCount").val('');
	$("#endCount").val('');
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}
	var cashierNameOrCode = $("#cashierNameOrCode").val();
	if(cashierNameOrCode && cashierNameOrCode.indexOf("[")>=0 && cashierNameOrCode.indexOf("]")>=0){
		formData.cashierNameOrCode = null;
	}
	$("#cashWater").datagrid("options").queryParams = formData;
	$("#cashWater").datagrid("options").method = "post";
	$("#cashWater").datagrid("options").url = contextPath+'/cashFlow/report/getList';
	$("#cashWater").datagrid("load");
	
}

//打印
function printReport(){
	$("#startCount").val('');
	$("#endCount").val('');
	var startTime = $("#txtStartDate").val();
	var endTime = $("#txtEndDate").val();
	var branchNameOrCode= $("#branchNameOrCode").val();
	var businessType=$("#businessType").combobox("getValue");
	var orderNo=$("#orderNo").val();
	var status=$("#status").val();
	var payType=$("#payType").combobox("getValue");
	var orderType=$("#orderType").combobox("getValue");
	var cashierId=$("#cashierId").val();
	parent.addTabPrint("reportPrint"+branchNameOrCode,"打印",contextPath+"/cashFlow/report/printReport?" +"&startTime="+startTime
			+"&endTime="+endTime+"&branchNameOrCode="+branchNameOrCode+"&cashierId="+cashierId+"&businessType="+businessType+"&orderNo="
			+orderNo+"&payType="+payType+"&orderType="+orderType+"&status="+status);
}
/**
 * 重置
 */
var resetForm = function(){
	 $("#queryForm").form('clear');
	 $("#branchCode").val('');
};

function clearCashierId() {
	var cashierNameOrCode = $("#cashierNameOrCode").val();

	// 如果修改名称
	if (!cashierNameOrCode || 
			(cashierNameOrCode && cashierNameOrCode.indexOf("[") < 0 && cashierNameOrCode.indexOf("]") < 0)) {
		$("#cashierId").val('');
	}
}