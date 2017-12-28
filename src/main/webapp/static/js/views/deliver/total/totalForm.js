$(function () {
    $('#targetBranchComponent').branchSelect({
        param: {
            selectType: 1,  //多选
            // branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B+','+$_jxc.branchTypeEnum.FRANCHISE_STORE_C,
            type:'NOTREE',
        },
        onAfterRender:function(data){
        }
    });

    $('#sourceBranchComponent').branchSelect({
        onAfterRender:function(data){
        }
    });

    $("#startTime").val(dateUtil.getCurrDayPreOrNextDay("prev",1).format("yyyy-MM-dd"));
    $("#endTime").val(dateUtil.getCurrDayPreOrNextDay("prev",1).format("yyyy-MM-dd"));

    initGridTotalList();

})

var gridTotalHandle = new GridClass();
var gridName = "gridTotalList";
function initGridTotalList () {
    gridTotalHandle.setGridName(gridName);
    $("#"+gridName).datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        //url:contextPath+'/form/purchase/listData',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,         //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'要货单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.deliverFormId +'&deliverType=DA\')">' + value + '</a>';
                    return strHtml;
            }},
            {field: 'dealStatus', title: '单据状态', width: '60px', align: 'center'},
            {field: 'targetBranchName', title: '要货机构', width: '200px', align: 'left'},
            {field: 'salesman', title: '业务人员', width: '130px', align: 'left'},
            {field: 'amount', title: '单据金额', width: '80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }
            },
            {field: 'sourceBranchName', title: '发货机构', width: '200px', align: 'left'},
            {field: 'createUserName', title: '制单人员', width: '130px', align: 'left'},
            {field: 'validityTime', title: '有效期限', width: '120px', align: 'center',
                formatter: function (value, row, index) {
                    if (value) {
                        return new Date(value).format('yyyy-MM-dd');
                    }
                    return "";
                }
            },
            {field: 'validUserName', title: '审核人员', width: '130px', align: 'left'},

            {field: 'updateUserName', title: '操作人员', width: '130px', align: 'left'},
            {field: 'updateTime', title: '操作时间', width: '120px', align: 'center',
                formatter: function (value, row, index) {
                    if (value) {
                        return new Date(value).format('yyyy-MM-dd hh:mm');
                    }
                    return "";
                }
            },
            {field: 'remark', title: '备注', width: '200px', align: 'left'},
        ]],
        onBeforeLoad:function(data){
            gridTotalHandle.setDatagridHeader("center");
        }
    });
}

function toAddTab(title,url){
    window.parent.addTab(title,url);
}

//查询
function queryForm(){
    var targetBranchId = $("#targetBranchId").val();
    var sourceBranchId = $("#sourceBranchId").val();
    if(!targetBranchId){
        $_jxc.alert("请选择要货机构");
        return;
    }
    if(!sourceBranchId){
        $_jxc.alert("请选择发货机构");
        return;
    }

    var fromObjStr = $('#queryForm').serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid('options').url = contextPath + '/store/attendance/list';
    $("#"+gridName).datagrid('load', fromObjStr);
}

function nextStep() {
    var targetBranchId = $("#targetBranchId").val();
    var sourceBranchId = $("#sourceBranchId").val();
    var rows = $("#"+gridName).datagrid("getSelected");
    if(rows.length <= 0){
        $_jxc.alert("请勾选列表数据");
        return;
    }

    var reqObj = {
        targetBranchId :targetBranchId,
        targetBranchName:$("#targetBranchName").val(),
        sourceBranchId :sourceBranchId,
        sourceBranchName:$("#sourceBranchName").val(),
        deliverStartDate:$('#startTime').val(),
        deliverEndDate:$('#endTime').val(),
        deliverFormListVo:rows,
    }

    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/updateDeliverForm",
        contentType:"application/json",
        data:JSON.stringify(reqObj),
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("提交成功！");
        }else{
            $_jxc.alert(result['message']);
        }
    })

}