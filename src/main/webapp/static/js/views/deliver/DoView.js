/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单-编辑
 */
$(function(){
    initDatagridEditRequireOrder();
    $("div").delegate("button","click",function(){
    	$("p").slideToggle();
    });
    if($("#close").val()){
    	$("#addButton").addClass("unhide");
    	$("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
    }
    selectTargetBranchData($("#targetBranchId").val());
});
var gridHandel = new GridClass();
var gridName = "gridEditRequireOrder";
function initDatagridEditRequireOrder(){
    gridHandel.setGridName("gridEditRequireOrder");
	var formId = $("#formId").val();
    $("#gridEditRequireOrder").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
    	url:contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+formId+"&deliverType=DO",
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        //pagination:true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        height:'100%',
        columns:[[
			{field:'ck',checkbox:true},
			{field:'cz',title:'操作',width:'50px',align:'center',
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            str ='<div class="ub ub-pc">合计</div> '
			        }else{
			            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
			                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
			        }
			        return str;
			    },
			},
            {field:'skuCode',title:'货号',width:'70px',align:'left'},
            {field:'skuName',title:'商品名称',width:'190px',align:'left'},
            {field:'barCode',title:'条码',width:'105px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'distributionSpec',title:'配送规格',width:'90px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                    }
                    return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                },
            },
            {field:'dealNum',title:'数量',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                    }
                    return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                },
            },
            {field:'untaxedPrice',title:'不含税单价',width:'100px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return ;
            		}
            		return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
            	},
            },
            {field:'price',title:'单价',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                },
            },
            {field:'untaxedAmount',title:'不含税金额',width:'100px',align:'right',
            	formatter : function(value, row, index) {
            		if(row.isFooter){
            			return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
            		}
            		return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
            	},
            },
            {field:'amount',title:'金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                    }
                    return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                },
            },
            {field:'isGift',title:'赠送',width:'65px',align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    row.isGift = row.isGift?row.isGift:0;
                    return value=='1'?'是':(value=='0'?'否':'请选择');
                }
            },
            {field:'inputTax',title:'税率',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                },
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
            		if(row.isFooter){
            			return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
            		}
            		return "<b>"+parseFloat(value||0).toFixed(4)+ "<b>";
                },
            },
            {field:'sourceStock',title:'当前库存',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return  "<b>"+parseFloat(value||0).toFixed(2)+ "<b>";
                },
            	editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        min:0,
                        precision:2,
                    }
                }
            },
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });

    var param = {
        distributionPrice:["price","amount","taxAmount","untaxedPrice","untaxedAmount"],
        salePrice:["salePrice","saleAmount"]
    }
    priceGrantUtil.grantPrice(gridName,param);

}
//合计
function updateFooter(){
    var fields = {largeNum:0,dealNum:0,amount:0,isGift:0,untaxedAmount:0};
    var argWhere = {name:'isGift',value:""}
    gridHandel.updateFooter(fields,argWhere);
}

//新增出库单
function addDeliverForm(){
	toAddTab("新增出库单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DO");
}


//返回列表页面
function back(){
	location.href = contextPath+"/form/deliverForm/viewsDO";
}

function exportDetail(param){
	var formId = $("#formId").val();
	var sourceBranchId = $("#sourceBranchId").val();
    if (param == 0) {
        window.location.href = contextPath + '/form/deliverForm/exportSheet?page=DOSheet&sheetNo='+formId+'&branchId='+sourceBranchId;
    } else {
        window.location.href = contextPath + '/form/deliverForm/exportSheet?page=DOList&sheetNo='+formId+'&branchId='+sourceBranchId;
    }

}

// 查询要货机构的资料
function selectTargetBranchData(targetBranchId){
    $_jxc.ajax({
        url:contextPath+"/common/branches/selectTargetBranchData",
        data:{
            branchesId : targetBranchId
        }
    },function(data){
        $("#address").html(data.address);
        $("#contacts").html(data.contacts);
        $("#mobile").html(data.mobile);
    });
}