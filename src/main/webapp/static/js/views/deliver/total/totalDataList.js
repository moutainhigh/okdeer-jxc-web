
var formData;
$(function () {
	
	formData = $("#formData").val();
	formData = $.parseJSON(formData);
    formData.startTime = formData.startTime.substr(0, 10);
    formData.endTime = formData.endTime.substr(0, 10);
	
    initGridTotalList();
});


var gridTotalDataHandle = new GridClass();
var gridName = "gridTotalDataList";
function initGridTotalList () {
    gridTotalDataHandle.setGridName(gridName);
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
                var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'要货单明细\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.deliverFormId +'&deliverType=DA\')"> 单据详情 </a>';
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
            gridTotalDataHandle.setDatagridHeader("center");
        }
    });
}


//上一步
function preStep() {
	//返回到上一步
	$.StandardPost(contextPath+"/form/deliverTotal/toTotalForm", formData);
}

function createDeliver() {
    
}