$(function () {
    initGridList();
    initConditionParams();

    //机构选择初始化 收货机构
    $('#targetBranch').branchSelect();

    //操作员组件初始化
    $('#operateorSelect').operatorSelect({
        onAfterRender:function(data){
            branchName = data.branchName;
            $("#createUserId").val(data.id);
            $("#createUserName").val(data.userName);
        }
    });


    //供应商组件初始化
    $('#supplierSelect').supplierSelect({
        loadFilter:function(data){
            data.supplierId = data.id;
            return data;
        }
    })
    
    $("input[type='radio'][name='status']").change(function () {
        query();
    })
    query();
})
//初始化默认条件
function initConditionParams(){
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}


var gridListId = "gridCostList";
var gridHandel = new GridClass();
function  initGridList() {
    gridHandel.setGridName(gridListId);
    $("#"+gridListId).datagrid({
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        pageSize : 50,
        pageList : [20,50,100],//可以设置每页记录条数的列表
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'id',title:'id',width:'85px',align:'left',hidden:true},
            {field:'refId',title:'refId',width:'85px',align:'left',hidden:true},
            {field:'formNo',title:'单号',width:'140px',align:'left',formatter:function(value,row,index){
                var str = value;
                if(value ==="SUM"){
                    str ='<div class="ub ub-pc">合计</div> '
                }else {
                    str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购成本调整单\',\'' + contextPath + '/purchase/cost/form/edit/' + row.id + '\')">' + value + '</a>';
                }
                return str;
            }},
            {field:'status',title:'审核状态',width:'100px',align:'center',formatter:function(value,row,index){
                if(row.formNo==="SUM"){
                    return;
                }
                if(value == '0'){
                    return '待审核';
                }else if(value == '1'){
                    return '已审核';
                }else if(value == '2'){
                    return '已终止';
                }else{
                    return '未知类型：'+ value;
                }
            }},
            {field:'branchName',title:'收货机构',width:'140px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field: 'totalMoney', title: '调价金额', width: '80px', align: 'right',
                formatter:function(value,row,index){
                    // if(row.isFooter){
                    //     return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    // }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }
            },

            {field:'refFormNo',title:'引用单编号',width:'140px',align:'left',formatter:function(value,row,index){
                if(row.formNo==="SUM"){
                    return;
                }
                var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购收货单详细\',\''+contextPath+'/form/purchase/receiptEdit?formId='+row.refId+'\')">' + value + '</a>';
                return strHtml;
            }},
            {field:'createUserName',title:'制单人',width:'130px',align:'left'},
            {field:'createTime',title:'制单时间',width:'150px',align:'center',
                formatter: function (value, row, index) {
                    if (value) {
                        return new Date(value).format('yyyy-MM-dd hh:mm');
                    }
                    return "";
                }},

            {field:'validUserName',title:'审核人',width:'130px',align:'left'},
            {field:'validTime',title:'审核时间',width:'150px',align:'center',
                formatter: function (value, row, index) {
                    if (value) {
                        return new Date(value).format('yyyy-MM-dd hh:mm');
                    }
                    return "";
                }},
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
    })

}

function query(){
    $("#"+gridListId).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridListId).datagrid("options").method = "post";
    $("#"+gridListId).datagrid("options").url = contextPath+'/purchase/cost/form/list';
    $("#"+gridListId).datagrid("load");
}

function add() {
    toAddTab("新增采购成本调价",contextPath + "/purchase/cost/form/add");
}

//删除
function del() {
    var rows = $("#gridCostList").datagrid("getChecked");
    if ($("#gridCostList").datagrid("getChecked").length <= 0) {
        $_jxc.alert('请选中一行进行删除！');
        return null;
    }
    var formIds = [];
    $.each(rows,function(i,v){
        //formIds+=v.id+",";
        formIds.push(v.id);
    });

    $_jxc.confirm('是否要删除选中数据?',function(data){
        if(data){
            $_jxc.ajax({
                url: contextPath + "/purchase/cost/form/del",
                type:"POST",
                data:{
                    ids: formIds
                }
            },function(result){

                if(result['code'] == 0){
                    $_jxc.alert("删除成功",function () {
                        query();
                    });
                }else{
                    $_jxc.alert(result['message']);
                }
                $("#gridOrders").datagrid('reload');
            });
        }
    });
}

function printPreview() {
    var rows = $("#"+gridListId).datagrid('getData');
    if(rows.total >0){
        var queryParams =  urlEncode($("#queryForm").serializeObject());
        parent.addTabPrint("reportPrint"+new Date().getTime(),"打印",contextPath+"/purchase/cost/form/list/print?params="+queryParams);
    }else{
        $_jxc.alert('请选择一行数据.')
    }
}

var urlEncode = function (param, key, encode) {
    if(param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};