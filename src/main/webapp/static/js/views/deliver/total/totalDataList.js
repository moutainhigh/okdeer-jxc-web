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
        url:contextPath+'/form/deliverTotal/getTempDataList',
        queryParams:{
        	formNos:formData.formNoList
        },
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:false,    //分页
        fitColumns:true,    //每列占满
        //fit:true,         //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
                var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'单据明细\',\''+ contextPath +'/form/deliverTotal/toTotalForm?formNo='+ row.formNo +'\')"> 单据详情 </a>';
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

function toAddTab(title,url){
    window.parent.addTab(title,url);
}

//上一步
function preStep() {
	//返回到上一步
	$.StandardPost(contextPath+"/form/deliverTotal/toTotalForm", formData);
}

function createDeliver() {
    var rows = $("#"+gridName).datagrid("getSelected");
    if(rows.length <= 0){
        $_jxc.alert("请勾选列表数据");
        return;
    }

    $_jxc.ajax({
        url:contextPath+"/form/deliverForm/updateDeliverForm",
        contentType:"application/json",
        data:JSON.stringify(rows),
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("生成成功！");
        }else{
            $_jxc.alert(result['message']);
        }
    })

}