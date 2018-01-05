/**
 * Created by zhaoly on 2017/12/29.
 */
$(function () {
    initGridDeliverList();
    // var formId =$("#formId").val();
})

var gridHandle = new GridClass();
function initGridDeliverList() {
    gridHandle.setGridName("gridDeliverList");
    $("#gridDeliverList").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        url:contextPath+'/form/deliverTotal/getTempDataItemList',
        queryParams:{
        	formNo:$("#formNo").val()
        },
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:false,    //分页
        fitColumns:true,    //每列占满
        //fit:true,         //占满
        showFooter:false,
        height:'100%',
        width:'100%',
        columns:[[
            {field: 'targetBranchName', title: '要货机构', width: '200px', align: 'left'},
            {field: 'sourceBranchName', title: '发货机构', width: '200px', align: 'left'},
            {field:'skuCode',title:'货号',width: '70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'150px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!value){
                        row["largeNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'applyNum',title:'数量',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!value){
                        row["applyNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'purchaseSpec',title:'进货规格',width:'90px',align:'left'},
            {field:'isGift',title:'是否赠品',width:'80px',align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    row.isGift = row.isGift?row.isGift:0;
                    return value=='1'?'是': (value=='0'?'否':'请选择');
                },
            },
            {field:'price',title:'参考单价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!row.price){
                        row.price = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'amount',title:'参考金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }

                    if(!row.amount){
                        row.amount = parseFloat(value||0).toFixed(4);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field: 'remark', title: '备注', width: '200px', align: 'left'},
        ]],
        onBeforeLoad:function(data){
            gridHandle.setDatagridHeader("center");
        }
    });
}
