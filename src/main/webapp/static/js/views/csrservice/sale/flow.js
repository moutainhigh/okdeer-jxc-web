/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function () {

    //机构选择初始化
    $('#branchComponent').branchSelect();

    //开始和结束时间
    toChangeDatetime(9);
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
            {field: 'ecardNo', title: '交易号(卡号)', width: 180, align: 'left'},
            {
                field: 'time', title: '时间', width: 150, align: 'left', formatter: function (saleTime) {
                if (saleTime) {
                    var now = new Date(saleTime);
                    var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
                    return nowStr;
                }
                return null;
            }
            },
            {field: 'csrserviceCode', title: '服务编号', width: 180, align: 'left'},
            {field: 'csrserviceName', title: '服务名称', width: 180, align: 'left'},
            {
                field: 'originalPrice', title: '原价', width: 120, align: 'right', formatter: function (saleAmount) {
                if (saleAmount) {
                    saleAmount = parseFloat(saleAmount);
                    return '<b>' + saleAmount.toFixed(4) + '</b>';
                }
                return '0.00';
            }
            },
            {
                field: 'totalAmount', title: '原价金额', width: 120, align: 'right', formatter: function (saleAmount) {
                if (saleAmount) {
                    saleAmount = parseFloat(saleAmount);
                    return '<b>' + saleAmount.toFixed(4) + '</b>';
                }
                return '0.00';
            }
            },
            {
                field: 'salePrice', title: '销售价', width: 120, align: 'right', formatter: function (saleAmount) {
                if (saleAmount) {
                    saleAmount = parseFloat(saleAmount);
                    return '<b>' + saleAmount.toFixed(4) + '</b>';
                }
                return '0.00';
            }
            },
            {
                field: 'saleAmount', title: '销售金额', width: 120, align: 'right', formatter: function (saleAmount) {
                if (saleAmount) {
                    saleAmount = parseFloat(saleAmount);
                    return '<b>' + saleAmount.toFixed(4) + '</b>';
                }
                return '0.00';
            }
            },
            {field: 'saleNum', title: '数量', width: 150, align: 'right',
                formatter: function (saleNum) {
                    if (saleNum) {
                        saleNum = parseFloat(saleNum);
                        return '<b>' + saleNum.toFixed(4) + '</b>';
                    }
                    return '0.0000';
                }
            },
            {field: 'saleType', title: '业务类型', width: 100, align: 'center'},
            {field: 'operatorName', title: '收银员', width: 100, align: 'left'},
            {field: 'ticketNo', title: '小票号', width: 180, align: 'center'},
            {field: 'remark', title: '备注', width: 150, align: 'left'},
        ]]
    });
    gridHandel.setDatagridHeader("center");
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
        url: contextPath + "/service/sale/flow/export/list"
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
    $("#cashWater").datagrid("options").url = contextPath + '/service/sale/flow/list';
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