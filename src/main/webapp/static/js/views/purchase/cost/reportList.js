$(function () {
    initConditionParams();

    //机构选择初始化 收货机构
    $('#targetBranch').branchSelect();

    //供应商组件初始化
    $('#supplierSelect').supplierSelect({
        loadFilter:function(data){
            data.supplierId = data.id;
            return data;
        }
    })

    initGridList();
})
//初始化默认条件
function initConditionParams(){
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}


var gridListId = "gridReportList";
var gridHandel = new GridClass();
function  initGridList() {
    dg=$("#"+gridListId).datagrid({
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        pageSize : 50,
        pageList : [20,50,100],//可以设置每页记录条数的列表
        height:'100%',
        width:'100%',
        columns:[[
            {field:'id',title:'id',width:'85px',align:'left',hidden:true},
            {field:'refId',title:'refId',width:'85px',align:'left',hidden:true},
            {field:'branchName',title:'机构名称',width:'140px',align:'left'},
            {field:'skuCode',title:'货号',width:'70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'130px',align:'left'},
            {field:'realNum',title:'采购数量',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'oldPurAmount',title:'采购金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'newPurAmount',title:'调整后金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'diffMoney',title:'调整金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'costPrice',title:'原成本价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'newCostPrice',title:'新成本价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },

            {field:'actual',title:'调价时库存',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'formNo',title:'调价单编号',width:'140px',align:'left',formatter:function(value,row,index){
                var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购成本调整详细\',\''+contextPath+'/purchase/cost/form/edit/'+row.id+'\')">' + value + '</a>';
                return strHtml;
            }},
            {field:'refFormNo',title:'引用单编号',width:'140px',align:'left',formatter:function(value,row,index){
                var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购收货单详细\',\'' + contextPath + '/form/purchase/receiptEdit?formType=FP&formId=' + row.refId + '\')">' + value + '</a>';
                return strHtml;
            }},

            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'60px',align:'left'},
            {field:'validUserName',title:'审核人',width:'130px',align:'left'},
            {field:'validTimeStr',title:'审核时间',width:'150px',align:'center'},
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
    })

}

function query(){
    $("#startCount").val('');
    $("#endCount").val('');
    $("#"+gridListId).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridListId).datagrid("options").method = "post";
    $("#"+gridListId).datagrid("options").url = contextPath+'/report/purchase/cost/form/list';
    $("#"+gridListId).datagrid("load");
}
var dg;
/**
 * 导出
 */
function exportData(){
    var length = $('#'+gridListId).datagrid('getData').rows.length;
    if(length == 0){
        $_jxc.alert("无数据可导");
        return;
    }
    $('#exportWin').window({
        top:($(window).height()-300) * 0.5,
        left:($(window).width()-500) * 0.5
    });
    $("#exportWin").show();
    $("#totalRows").html($('#'+gridListId).datagrid('getData').total);
    $("#exportWin").window("open");
}
// 调用导出方法
function exportExcel(){
    var startDate = $("#txtStartDate").val();
    var endDate = $("#txtEndDate").val();
    if(!(startDate && endDate)){
        $_jxc.alert('日期不能为空');
        return ;
    }
    var length = $("#"+gridListId).datagrid('getData').total;
    if(length == 0){
        $_jxc.alert("没有数据");
        return;
    }
    $("#queryForm").attr("action",contextPath+'/report/purchase/cost/form/export/list');
    $("#queryForm").submit();
}