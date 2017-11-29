/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function () {

    //机构选择初始化
    $('#branchComponent').branchSelect();

    //开始和结束时间
    toChangeDatetime(0);
    //初始化列表
    initCashWaterGrid();
});
var gridHandel = new GridClass();

function initCashWaterGrid() {
    $("#cashWater").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        showFooter: true,
        pageSize: pageSize,
        height: '100%',
        columns: [[
            {field: 'branchCode', title: '机构编号', width: 100, align: 'left'},
            {field: 'branchName', title: '机构名称', width: 220, align: 'left'},
            {field: 'orderNo', title: '单据编号', width: 180, align: 'left'},
            {
                field: 'saleTime', title: '销售时间', width: 150, align: 'left', formatter: function (saleTime) {
                if (saleTime) {
                    var now = new Date(saleTime);
                    var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
                    return nowStr;
                }
                return null;
            }
            },
            {
                field: 'saleAmount', title: '销售金额', width: 120, align: 'right', formatter: function (saleAmount) {
                if (saleAmount) {
                    saleAmount = parseFloat(saleAmount);
                    return saleAmount.toFixed(4);
                }
                return '0.00';
            }
            },
            {
                field: 'payAmount', title: '付款金额', width: 120, align: 'right', formatter: function (payAmount) {
                if (payAmount) {
                    payAmount = parseFloat(payAmount);
                    return payAmount.toFixed(4);
                }
                return '0.00';
            }
            },
            {field: 'payType', title: '付款方式', width: 100, align: 'center'},
            {field: 'cashier', title: '收银员', width: 100, align: 'left'},
            {field: 'remark', title: '备注', width: 150, align: 'left'},
        ]]
    });
    gridHandel.setDatagridHeader("center");
}


//改变日期
function changeDate(index) {
    switch (index) {
        case 0: //今天
            $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev", 1));
            $("#txtEndDate").val(dateUtil.getCurrDayPreOrNextDay("prev", 1));
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
function searchCashierId() {
    new publicOperatorService(function (data) {
        $("#cashierId").val(data.id);
        $("#cashierNameOrCode").val("[" + data.userCode + "]" + data.userName);
    });
}


/**
 * 导出
 */
function exportData() {
    var param = {
        datagridId: "cashWater",
        formObj: $("#queryForm").serializeObject(),
        url: contextPath + "/service/cash/flow/export/list"
    }

    publicExprotService(param);
}

//查询
function query() {
    var formData = $("#queryForm").serializeObject();
    var branchNameOrCode = $("#branchNameOrCode").val();
    if (branchNameOrCode && branchNameOrCode.indexOf("[") >= 0 && branchNameOrCode.indexOf("]") >= 0) {
        formData.branchNameOrCode = null;
    }
    var cashierNameOrCode = $("#cashierNameOrCode").val();
    if (cashierNameOrCode && cashierNameOrCode.indexOf("[") >= 0 && cashierNameOrCode.indexOf("]") >= 0) {
        formData.cashierNameOrCode = null;
    }
    $("#cashWater").datagrid("options").queryParams = formData;
    $("#cashWater").datagrid("options").method = "post";
    $("#cashWater").datagrid("options").url = contextPath + '/service/cash/flow/list';
    $("#cashWater").datagrid("load");

}

/**
 * 重置
 */
var resetForm = function () {
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