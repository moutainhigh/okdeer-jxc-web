/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function(){
    //开始和结束时间
	toChangeDatetime(0);

    //初始化列表
    initMarketWaterGrid();
});
var gridHandel = new GridClass();
function initMarketWaterGrid() {
	$("#marketWater").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        pageSize : pageSize,
        height:'100%',
        columns: [[
            {field: 'branchCode', title: '店铺编号', width:100, align: 'left'},
            {field: 'branchName', title: '店铺', width: 200, align: 'left',},
            {field: 'orderNo', title: '单据编号', width: 200, align: 'left'},
            {field: 'time', title: '时间', width: 150, align: 'left',formatter : function(time){
    			if(time){
    				var now = new Date(time);
    				var nowStr = now.format("yyyy-MM-dd hh:mm:ss"); 
    				return nowStr;
    			}
    			return null;
    		}},
            
            {field: 'skuCode', title: '货号', width: 100, align: 'left'},
            {field: 'skuName', title: '商品名称', width: 200, align: 'left'},
            {field: 'barCode', title: '条码', width: 100, align: 'left'},
            {field: 'spec', title: '规格', width: 80, align: 'center'},
            {field: 'unit', title: '单位', width: 80, align: 'center'},
            {field: 'goodsTypeStr', title: '商品类型', width: 150, align: 'center'},
            {field: 'saleWayStr', title: '经营方式', width: 150, align: 'center'},
            {field: 'businessTypeStr', title: '业务类型', width: 150, align: 'center'},
            {field: 'num', title: '数量', width: 120, align: 'right',formatter : function(value,row,index){
                return formatTwoDecimal(value) ;
    		}},
            {field: 'salePrice', title: '销售价', width: 80, align: 'right',formatter : function(value,row,index){
                return formatTwoDecimal(value) ;
    		}},
            {field: 'saleAmount', title: '销售金额', width: 120, align: 'right',formatter : function(value,row,index){
                return formatTwoDecimal(value) ;
    		}},
            {field: 'originalPrice', title: '原价', width: 80, align: 'right',formatter : function(value,row,index){
                return formatTwoDecimal(value) ;
    		}},
            {field: 'totalAmount', title: '原价金额', width: 120, align: 'right',formatter : function(value,row,index){
                return formatTwoDecimal(value) ;
    		}},
            {field: 'categoryCode', title: '类别编码', width: 100, align: 'left'},
            {field: 'categoryName', title: '类别名称', width: 150, align: 'left'},
            {field: 'cashier', title: '收银员', width: 100, align: 'left'},
            {field: 'discount', title: '折扣', width: 100, align: 'right'},
            {field: 'orderTypeStr', title: '订单类型', width: 100, align: 'center' },
            {field: 'ticketNo', title: '小票号', width: 180, align: 'center' },
            {field: 'orderWayStr', title: '销售方式', width: 100, align: 'center' },
            {field: 'remark', title: '备注', width: 150, align: 'left'}
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
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
		$("#branchCode").val(data.branchCode);
		$("#branchNameOrCode").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}


/**
 * 导出
 */
function exportData(){
    var param = {
        datagridId:"marketWater",
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/saleFlow/report/exportList"
    }
    publicExprotService(param);
}

//查询
function query(){
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}
	$("#marketWater").datagrid("options").queryParams = formData;
	$("#marketWater").datagrid("options").method = "post";
	$("#marketWater").datagrid("options").url = contextPath+"/saleFlow/report/getList";
	$("#marketWater").datagrid("load");
}

//合计
function updateFooter(){
    var fields = {num:0,saleAmount:0,amount:0,discount:0};
    var argWhere = {name:'isGift',value:''}
    gridHandel.updateFooter(fields,argWhere);
}
//打印
function printReport(){
	//var queryType = $("input[name='queryType']").val();
	var startTime = $("#txtStartDate").val();
	var endTime = $("#txtEndDate").val();
	var branchNameOrCode= $("#branchNameOrCode").val();
	var orderNo=$("#orderNo").val();
	var skuName=$("#skuName").val();
	var skuCode=$("#skuCode").val();
	var status=$("#status").val();
	var businessType=$("#businessType").combobox("getValue");//业务类型
	var orderType=$("#orderType").combobox("getValue");
	//var cashierId=$("#cashierId").val();//收银员
	//var payType=$("#payType").combobox("getValue");
	//var orderType=$("#orderType").combobox("getValue");
	parent.addTabPrint("reportPrint"+branchNameOrCode,"打印",contextPath+"/saleFlow/report/printReport?" +"&startTime="+startTime
			+"&endTime="+endTime+"&branchNameOrCode="+branchNameOrCode+"&orderNo="+orderNo+"&skuName="+skuName
			+"&skuCode="+skuCode+"&businessType="+businessType+"&orderType="+orderType+"&status="+status);
}
/**
 * 重置
 */
var resetForm = function(){
	 $("#queryForm").form('clear');
	 $("#branchCode").val('');
};

function clearBranchCode(){
	var branchNameOrCode = $("#branchNameOrCode").val();
	
	//如果修改名称
	if(!branchNameOrCode || 
			(branchNameOrCode && branchNameOrCode.indexOf("[")<0 && branchNameOrCode.indexOf("]")<0)){
		$("#branchCode").val('');
	}
}