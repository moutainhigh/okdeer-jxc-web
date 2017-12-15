/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单
 */
var radioVal = 0;
$(function(){
    //开始和结束时间
    //toChangeDate(10);
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    //初始化默认条件
    initDataGrid();
    //选择报表类型
    changeType();

    //机构选择初始化 要货机构
    $('#targetBranch').branchSelect({
        onAfterRender:function(data){
            $("#targetBranchId").val(data.branchId);
        }
    });

    //类别选择初始化
    $('#categorySelect').categorySelect({
        onAfterRender:function(data){
            $("#goodsCategoryId").val(data.goodsCategoryId);
            $("#categoryCode").val(data.categoryCode);
            // $("#categoryCode").val(data.categoryCode);
        }
    });

    initBranchSelect();

});


function initBranchSelect() {
    //机构选择初始化 发货机构
    $('#sourceBranch').branchSelect({
        onAfterRender:function(data){
            $("#sourceBranchId").val(data.branchId);
        }
    });
}

//查询
function query() {
    var startDate = $("#txtStartDate").val();
    var endDate = $("#txtEndDate").val();
    if (!(startDate && endDate)) {
        $_jxc.alert('日期不能为空');
        return;
    }

    var fromObjStr = $('#queryForm').serializeObject();
    // 去除编码
    fromObjStr.targetBranchName = fromObjStr.targetBranchName.substring(fromObjStr.targetBranchName.lastIndexOf(']') + 1)
    fromObjStr.sourceBranchName = fromObjStr.sourceBranchName.substring(fromObjStr.sourceBranchName.lastIndexOf(']') + 1)
    fromObjStr.categoryName = fromObjStr.categoryName.substring(fromObjStr.categoryName.lastIndexOf(']') + 1)
    $("#marketWater").datagrid("options").queryParams = fromObjStr;
    // $('#marketWater').datagrid({showFooter:true});
    $("#marketWater").datagrid("options").method = "POST";
    $("#marketWater").datagrid('options').url = contextPath + '/report/direct/outOfStock/reportListPage';
    $("#marketWater").datagrid('load');

}

function changeType(){
    $(".radioItem").change(function(){
        cleardata();
        radioVal = $(this).val();
        checktype(radioVal);

        initDataGrid();
        $("#marketWater").datagrid('loadData', { total: 0, rows: [] });
        $("#" + gridName).datagrid('reloadFooter', []);
        $("#"+gridName).datagrid("options").url = "";
    });
}

//切换radio 4个状态的禁用和启用 以及值的清空
function checktype(value){
    if(value == '0'){
        // $('#sourceBranchName').attr("readonly","readonly");
        // $('#sourceBranchName').addClass('uinp-no-more');
        $('#formNo').removeClass('uinp-no-more');
        $('#formNo').removeAttr("readonly");

        $('#categoryName').removeProp("readonly","readonly");
        $('#categoryName').removeClass('uinp-no-more');
        $('#skuName').removeProp("readonly","readonly");
        $('#skuName').removeClass('uinp-no-more');
        $('#skuCode').removeProp("readonly","readonly");
        $('#skuCode').removeClass('uinp-no-more');
    }
    else if(value == '1'){
        // $("#sourceBranchName").removeAttr("readonly");
        // $('#sourceBranchName').removeClass('uinp-no-more');
        $('#formNo').addClass('uinp-no-more');
        $('#formNo').attr("readonly","readonly");

        $('#categoryName').removeProp("readonly","readonly");
        $('#categoryName').removeClass('uinp-no-more');
        $('#skuName').removeProp("readonly","readonly");
        $('#skuName').removeClass('uinp-no-more');
        $('#skuCode').removeProp("readonly","readonly");
        $('#skuCode').removeClass('uinp-no-more');
    }else if(value == '2'){
        // $("#sourceBranchName").removeAttr("readonly");
        // $('#sourceBranchName').removeClass('uinp-no-more');
        $('#formNo').removeClass('uinp-no-more');
        $('#formNo').removeAttr("readonly");
        $('#categoryName').attr("readonly","readonly");
        $('#categoryName').addClass('uinp-no-more');
        $("#dvCategory").removeProp('onclick')
        $('#skuName').attr("readonly","readonly");
        $('#skuName').addClass('uinp-no-more');
        $('#skuCode').attr("readonly","readonly");
        $('#skuCode').addClass('uinp-no-more');

    }else if(value == '3'){
        // $("#sourceBranchName").removeAttr("readonly");
        // $('#sourceBranchName').removeClass('uinp-no-more');
        $('#formNo').addClass('uinp-no-more');
        $('#formNo').attr("readonly","readonly");
        $('#categoryName').attr("readonly","readonly");
        $('#categoryName').addClass('uinp-no-more');
        $("#dvCategory").removeProp('onclick')
        $('#skuName').attr("readonly","readonly");
        $('#skuName').addClass('uinp-no-more');
        $('#skuCode').attr("readonly","readonly");
        $('#skuCode').addClass('uinp-no-more');

    }


}
//清空所有数据值
function cleardata(){
    $("#sourceBranchId").val('');
    $('#sourceBranchName').val("");
    $('#targetBranchId').val("");
    $('#targetBranchName').val("");
    $('#skuCode').val("");
    $('#skuName').val("");

    $('#formNo').val("");
    $('#categoryCode').val("");
    $('#categoryName').val("");
    $('#goodsCategoryId').val("");

}

var gridHandel = new GridClass();
// 明细表
var gridName = "marketWater";

function getColumnsByType(){
    var val = radioVal;

    if(val == '0'){
        return [[
            {field: 'inFormNo', title: '要货单号', width: '150px', align: 'left',
                formatter:function(value,row,index){
                    if (!value || value === 'sum') {
                        return '<div class="ub ub-pc ufw-b">合计</div> '
                    }
                    var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.inFormId+'")';
                    return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                }
            },
            {field: 'targetBranchName',title:'要货机构',width:'85px',align:'left'},
            {field: 'sourceBranchName',title:'发货机构',width:'85px',align:'left'},
            {field: 'outFormNo', title: '出库单号', width: '150px', align: 'left',
                formatter:function(value,row,index){
                    if(row.outFormId){
                        var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.outFormId+'")';
                        return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                    }
                }
            },
            {field: 'DIFormNo', title: '入库单号', width: '150px', align: 'left',
                formatter:function(value,row,index){
                    if(row.DIFormId){
                        var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.DIFormId+'")';
                        return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                    }
                }
            },
            {field: 'skuCode', title: '货号', width: '65px', align: 'left'},
            {field: 'skuName', title: '商品名称', width: '150px', align: 'left'},
            {field: 'barCode', title: '条码', width: '150px', align: 'left'},
            {field: 'defectNum', title: '缺货数量', width: '85px', align: 'right',
                formatter : function(value, row, index) {
                    if(row.defectNum){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'outRate', title: '缺货率', width: '85px', align: 'right',
                formatter : function(value, row, index) {
                    if(row.outRate||row.outRate==0){
                        return '<b>'+(parseFloat(value||0)*100).toFixed(2)+'%</b>';
                    }
                    return '';
                }

            },
            {field: 'inApplyNum', title: '要货数量', width: '85px', align: 'right',
                formatter : function(value, row, index) {
                    if(row.inApplyNum){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'inAmount', title: '要货金额', width: '85px', align: 'right',
                formatter:function(value,row,index){
                    if(row.inAmount){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'outDealNum', title: '发货数量', width: '85px', align: 'right',
                formatter : function(value, row, index) {
                    if(row.outDealNum){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'outAmount', title: '发货金额', width: '85px', align: 'right',
                formatter:function(value,row,index){
                    if(row.outAmount){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'inReceiveNum', title: '收货数量', width: '85px', align: 'right',
                formatter : function(value, row, index) {
                    if(row.inReceiveNum){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'DIAmount', title: '收货金额', width: '85px', align: 'right',
                formatter:function(value,row,index){
                    if(row.DIAmount){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'spec', title: '规格', width: '65px', align:'center'},
            {field: 'unit', title: '单位', width: '65px', align:'center'},
            {field: 'categoryName', title: '商品类别', width: '85px', align:'center'}
        ]]

    }else if(val == '1'){
        return [
            [
                {field: 'skuCode', title: '货号', width: '65px', align: 'left',
                    formatter:function(value,row,index){
                        if (!value || value === 'sum') {
                            return '<div class="ub ub-pc ufw-b">合计</div> '
                        }
                        return row.skuCode;
                    }

                },
                {field: 'skuName', title: '商品名称', width: '150px', align: 'left'},
                {field: 'barCode', title: '条码', width: '150px', align: 'left'},
                {field: 'spec', title: '规格', width: '65px', align:'center'},
                {field: 'unit', title: '单位', width: '65px', align:'center'},
                {field: 'categoryName', title: '商品类别', width: '85px', align:'center'},
                {field: 'defectNum', title: '缺货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'outRate', title: '缺货率', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.outRate||row.outRate==0){
                            return '<b>'+(parseFloat(value||0)*100).toFixed(2)+'%</b>';
                        }
                        return '';
                    }

                },
                {field: 'inApplyNum', title: '要货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.inApplyNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'inAmount', title: '要货金额', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.inAmount){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'outDealNum', title: '发货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.outDealNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'outAmount', title: '发货金额', width: '85px', align: 'right',
                    formatter:function(value,row,index){
                        if(row.outAmount){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                },
                {field: 'inReceiveNum', title: '收货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.inReceiveNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'DIAmount', title: '收货金额', width: '85px', align: 'right',
                    formatter:function(value,row,index){
                        if(row.DIAmount){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                }
            ]
        ]
    }else if(val == '3'){
        return [
            [
                {
                    field: 'targetBranchName', title: '要货机构', width: '85px', align: 'left',
                    formatter: function (value, row, index) {
                        if (!value || value === 'sum') {
                            return '<div class="ub ub-pc ufw-b">合计</div> '
                        }
                        return row.targetBranchName;
                    }
                },
                {field: 'sourceBranchName',title:'发货机构',width:'85px',align:'left'},
                {field: 'inApplyNum', title: '要货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.inApplyNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'inAmount', title: '要货金额', width: '85px', align: 'right',
                    formatter:function(value,row,index){
                        if(row.inAmount){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                },
                {field: 'defectNum', title: '缺货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'outRate', title: '数量缺货率', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.outRate||row.outRate==0){
                            return '<b>'+(parseFloat(value||0)*100).toFixed(2)+'%</b>';
                        }
                        return '';
                    }

                },
                {field: 'defectAmount', title: '缺货金额', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'outAmountRate', title: '金额缺货率', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.outRate||row.outRate==0){
                            return '<b>'+(parseFloat(value||0)*100).toFixed(2)+'%</b>';
                        }
                        return '';
                    }

                },

            ]
        ]

    }else if(val == '2'){
        return [
            [
                {
                    field: 'targetBranchName', title: '要货机构', width: '85px', align: 'left',
                    formatter: function (value, row, index) {
                        if (!value || value === 'sum') {
                            return '<div class="ub ub-pc ufw-b">合计</div> '
                        }
                        return row.targetBranchName;
                    }
                },
                {field: 'sourceBranchName',title:'发货机构',width:'85px',align:'left'},
                {field: 'inFormNo', title: '要货单号', width: '150px', align: 'left',
                    formatter:function(value,row,index){
                        if (!value) {
                            return '';
                        }
                        var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.inFormId+'")';
                        return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                    }
                },
                {field: 'inApplyNum', title: '要货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.inApplyNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'inAmount', title: '要货金额', width: '85px', align: 'right',
                    formatter:function(value,row,index){
                        if(row.inAmount){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                },
                {field: 'defectNum', title: '缺货数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'outRate', title: '数量缺货率', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.outRate||row.outRate==0){
                            return '<b>'+(parseFloat(value||0)*100).toFixed(2)+'%</b>';
                        }
                        return '';
                    }

                },
                {field: 'defectAmount', title: '缺货金额', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'outAmountRate', title: '金额缺货率', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.outRate||row.outRate==0){
                            return '<b>'+(parseFloat(value||0)*100).toFixed(2)+'%</b>';
                        }
                        return '';
                    }

                },
                {field: 'skuLackRate', title: 'SKU缺货率', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.skuLackRate||row.skuLackRate==0){
                            return '<b>'+(parseFloat(value||0)*100).toFixed(2)+'%</b>';
                        }
                        return '';
                    }

                },
                {field: 'outFormNo', title: '出库单号', width: '150px', align: 'left',
                    formatter:function(value,row,index){
                        if(row.outFormId){
                            var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.outFormId+'")';
                            return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                        }
                    }
                },
                {field: 'outDealNum', title: '出库数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },

                {field: 'outAmount', title: '出库金额', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'DIFormNo', title: '入库单号', width: '150px', align: 'left',
                    formatter:function(value,row,index){
                        if(row.DIFormId){
                            var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.DIFormId+'")';
                            return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                        }
                    }
                },
                {field: 'inReceiveNum', title: '入库数量', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },
                {field: 'DIAmount', title: '入库金额', width: '85px', align: 'right',
                    formatter : function(value, row, index) {
                        if(row.defectNum){
                            return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                        }
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    },
                },

            ]
        ]
    }
}

function initDataGrid() {
    gridHandel.setGridName("marketWater");
    $("#marketWater").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        url:'',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        pageSize : 50,
        // pageList : [20, 50, 100],
        height:'100%',
        width:'100%',
        columns:getColumnsByType(),
        onBeforeLoad:function(data){
            gridHandel.setDatagridHeader("center");
        }
    });

    if(hasDistributionPrice==false){
        priceGrantUtil.grantDistributionPrice(gridName,["inAmount","outAmount","DIAmount"])
    }
}

/**
 * 重置
 */
var resetForm = function(){
    $("#searchForm").form('clear');
};

/**
 * 导出
 */
function exportData(){
    var length = $('#marketWater').datagrid('getData').rows.length;
    if(length == 0){
        $_jxc.alert("无数据可导");
        return;
    }

    var fromObjStr = $('#queryForm').serializeObject();
    fromObjStr.targetBranchName = fromObjStr.targetBranchName.substring(fromObjStr.targetBranchName.lastIndexOf(']')+1);
    fromObjStr.sourceBranchName = fromObjStr.sourceBranchName.substring(fromObjStr.sourceBranchName.lastIndexOf(']')+1);
    fromObjStr.categoryName = fromObjStr.categoryName.substring(fromObjStr.categoryName.lastIndexOf(']')+1);

    $('#targetBranchName').val(fromObjStr.targetBranchName);
    $('#sourceBranchName').val(fromObjStr.sourceBranchName);
    $('#categoryName').val(fromObjStr.categoryName);

    var param = {
        datagridId:gridName,
        formObj:$("#queryForm").serializeObject(),
        url: contextPath + "/report/direct/outOfStock/exportList"
    }
    publicExprotService(param);

}

