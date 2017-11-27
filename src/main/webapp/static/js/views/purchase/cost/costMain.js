/**
 * Created by zhaoly on 2017/9/5.
 */
var gridCostId = "gridCost";
var gridCostHandel = new GridClass();

$(function () {
    initGridCost();
    var id = $("#id").val();
    if(id){
        initQueryData(id);
    }
    
    // 自动加载采购收货的数据信息
    getGridData()
})

function initQueryData(id) {
    $_jxc.ajax({
        url: contextPath + "/purchase/cost/form/detail/list/" + id
    },function(result) {
        if(result['code'] == 0) {
            $("#" + gridCostId).datagrid("loadData", result.data);
        }else {
            $_jxc.alert(result.message)
        }
    });
}

function add() {
    toAddTab("新增采购成本调价",contextPath + "/purchase/cost/form/add");
}

function del() {
    $_jxc.confirm('是否要删除该单据?',function(data){
        if(data){
            $_jxc.ajax({
                url:contextPath+"/purchase/cost/form/del",
                data:{
                    "ids[]":$("#id").val()
                }
            },function(result){
                if(result['code'] == 0){
                    $_jxc.alert("删除成功",function(){
                        toRefreshIframeDataGrid("purchase/cost/form/list","gridCostList");
                        toClose();
                    });
                }else{
                    $_jxc.alert(result['message']);
                }
            });
        }
    })
}


function check() {
    $_jxc.confirm("确认审核通过？",function (res) {
        if(res){
            $_jxc.ajax({
                url:contextPath+'/purchase/cost/form/audit',
                data:{
                    formId : $("#id").val()
                },
            },function(result){
                if(result.code == 0){
                    $_jxc.alert("审核成功",function () {
                        gFunRefresh();
                    });
                }else{
                    $_jxc.alert(result['message']);
                }
            })
        }
    })


}

function over() {
    $_jxc.confirm("确认终止此调整单？",function (res) {
        if(res){
            $_jxc.ajax({
                url:contextPath+'/purchase/cost/form/over',
                data:{
                    formId : $("#id").val(),
                },
            },function(result){
                if(result.code == 0){
                    $_jxc.alert("终止成功",function () {
                        gFunRefresh();
                    });
                }else{
                    $_jxc.alert(result['message']);
                }
            })
        }
    })
}

function initGridCost() {
    gridCostHandel.setGridName(gridCostId);
    $("#"+gridCostId).datagrid({
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:false,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'skuId',title:'skuId',width:'85px',align:'left',hidden:true},
            {field:'skuCode',title:'货号',width:'70px',align:'left',
                formatter : function(value, row,index) {
                    var str = "";
                    if(row.isFooter) {
                        str = '<div class="ub ub-pc">合计</div> ';
                        return str;
                    }else{
                        return value;
                    }
            }},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'国际条码',width:'130px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'60px',align:'left'},
            {field:'bigCategoryName',title:'一级类别',width:'60px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    if(!value){
                        row["largeNum"] = parseFloat(value||0).toFixed(4);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'realNum',title:'数量',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    if(!value){
                        row["realNum"] = parseFloat(value||0).toFixed(4);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'actual',title:'当前库存',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'costPrice',title:'库存成本价',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'price',title:'原进货价',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'amount',title:'原采购金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'newAmount',title:'实际采购金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        max:999999,
                        precision:4,
                        onChange: onChangeNewAmount
                    }
                }
            },
            {field:'totalMoney',title:'调价差额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                        options:{
                            precision:4,
                            disabled:true
                    }
                }
            },
            {field:'salePrice',title:'销售价',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field:'tax',title:'税率',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    row.tax = value?value:0;
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                options:{
                    min:0,
                    precision:4,
                }
            },
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        min:0,
                        precision:4,
                    }
                }
            },
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
        onClickCell:function(rowIndex,field,value){
            gridCostHandel.setBeginRow(rowIndex);
            gridCostHandel.setSelectFieldName(field);
            var target = gridCostHandel.getFieldTarget(field);
            if(target){
                gridCostHandel.setFieldFocus(target);
            }else{
                gridCostHandel.setSelectFieldName("newAmount");
            }
        },
        onLoadSuccess : function() {
            gridCostHandel.setDatagridHeader("center");
            updateFooter();
        }
    })

}

// 自动加载grid数据
function getGridData(){
	
	var refFormId = $("#refFormId").val();
	if(!refFormId){
		return;
	}
	
	$_jxc.ajax({
        url:contextPath+'/form/purchaseSelect/getPurchaseForm?formId='+refFormId,
        type:'get'
    },function(result){
        if(result.code == 0){
        	//根据选择的采购单，带出采购单的信息
            loadReceiptRows(result);
        }else{
            $_jxc.alert(result.message);
        }
    })
	
}

// 合计
function updateFooter(){
    var fields = {amount:0,newAmount:0,totalMoney:0};
    var argWhere = {name:'isGift',value:""}
    gridCostHandel.updateFooter(fields,argWhere);
}
var n = 2;
//监听实际采购金额
function onChangeNewAmount(newV,oldV) {
    if(n < 2 || oldV == ""){
        n = 2;
        return;
    }
    var actual = gridCostHandel.getFieldData(gridCostHandel.getSelectRowIndex(),'actual');
    if(parseFloat(actual) <= 0 ){
        n = 0;
        $_jxc.alert("当前库存等于小于0，不能调价");
        gridCostHandel.setFieldValue('newAmount',oldV);
        return;
    }
    var amount = gridCostHandel.getFieldData(gridCostHandel.getSelectRowIndex(),'amount');
    var totalMoney = Math.abs(parseFloat(newV-amount)).toFixed(4)
    if((parseFloat(totalMoney)/parseFloat(actual)) < 0.0001 ){
        n = 1;
        $_jxc.alert("分摊后金额过小无法调价，可将成本转移到其他商品");
        gridCostHandel.setFieldValue('newAmount',oldV);
        return;
    }

    n = 2;
    gridCostHandel.setFieldValue('totalMoney',parseFloat(newV-amount).toFixed(4));                          //调价差额=实际采购金额-原采购金额
    updateFooter();
}

function selectSupplier(){
    var param = {
        formType:"PI",
        isAllowRefOverdueForm:0
    }
    new publicPurchaseFormService(param,function(data){
        $("#refFormNo").val(data.form.formNo);
        
        //根据选择的采购单，带出采购单的信息
        loadReceiptRows(data);
        
    });
}

// 加载采购收货单数据行
function loadReceiptRows(data){
	var keyNames = {
        realNum:'maxRealNum',
    };

    var newRows = gFunUpdateKey(data.list, keyNames);

    var keylargeNum = {
        largeNum:'maxlargeNum',
    };

    newRows = gFunUpdateKey(newRows, keylargeNum);

    $("#"+gridCostId).datagrid("loadData", newRows);
    
    //供应商
    $("#supplierId").val(data.form.supplierId);
    $("#supplierName").val(data.form.supplierName);
    //经营方式
    $("#saleWay").val(data.form.saleWay);
    $("#saleWayName").val(data.form.saleWayStr);
    //收货机构
    $("#branchId").val(data.form.branchId);
    $("#branchName").val(data.form.branchName);

}


//保存
function saveCost(){

    $("#gridCost").datagrid("endEdit", gridCostHandel.getSelectRowIndex());
    var rows = gridCostHandel.getRowsWhere({skuName:'1'});
    $(gridCostHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }

    // $.each(rows,function(i,v){
    //     v["rowNo"] = i+1;
    //     if(!v["skuName"]){
    //         $_jxc.alert("第"+(i+1)+"行，货号不正确");
    //         isCheckResult = false;
    //         return false;
    //     };
    //
    //     //箱数判断  bug 19886
    //     if(parseFloat(v["largeNum"])<=0){
    //         $_jxc.alert("第"+(i+1)+"行，箱数要大于0");
    //         isCheckResult = false;
    //         isChcekNum = true;
    //         return false;
    //     }
    //     //数量判断 bug 19886
    //     if(parseFloat(v["realNum"])<=0){
    //         $_jxc.alert("第"+(i+1)+"行，数量要大于0");
    //         isCheckResult = false;
    //         isChcekNum = true;
    //         return false;
    //     }
    //
    //     if(hasPurchasePrice==true) {
    //         if(parseFloat(v["price"])<=0&&v["isGift"]==0){
    //             isChcekPrice = true;
    //         }
    //     }
    //
    //     //数量判断
    //     if(parseFloat(v["realNum"])<=0){
    //         isChcekNum = true;
    //     }
    // });
    //
    // //验证备注的长度 20个字符
    // var isValid = $("#gridFrom").form('validate');
    // if (!isValid) {
    //     return;
    // }

    // if(isCheckResult){
    //     if(isChcekPrice && hasPurchasePrice){
    //         $_jxc.confirm("单价存在为0，重新修改",function(r){
    //             if (r){
    //                 return ;
    //             }else{
    //                 saveDataHandel(rows);
    //             }
    //         });
    //     }else{
    //         if(isChcekNum){
    //             $_jxc.confirm('存在数量为0的商品,是否继续保存?',function(data){
    //                 if(data){
    //                     saveDataHandel(rows);
    //                 }
    //             });
    //         }else{
    //             saveDataHandel(rows);
    //         }
    //     }
    // }

    saveDataHandel(rows);
}
function saveDataHandel(rows){
    //供应商
    var supplierId = $("#supplierId").val();
    //收货机构
    var branchId = $("#branchId").val();

    var refFormNo = $("#refFormNo").val();
    //备注
    var remark = $("#remark").val();

    var saleWay = $("#saleWay").val();

    var id = $("#id").val()||'';

    var reqObj = {
        id:id,
        supplierId:supplierId,
        branchId:branchId,
        refFormNo:refFormNo,
        saleWay:saleWay,
        remark:remark,
        purchaseFormDetailPOList:rows
    };

    var req = JSON.stringify(reqObj);

    $_jxc.ajax({
        url:contextPath+"/purchase/cost/form/save",
        contentType:'application/json',
        data:req
    },function(result){
//            gFunEndLoading();
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
                location.href = contextPath +"/purchase/cost/form/edit/" + result.data.id;
            });
        }else{
            new publicErrorDialog({
                "title":"保存失败",
                "error":result['message']
            });
        }
    });
}

/**
 * 导出明细
 */
function exportData(){
    $("#formAdd").attr("action",contextPath+'/purchase/cost/form/export/list');
    $("#formAdd").submit();
}

function printPreview() {
    var rows = $("#"+gridCostId).datagrid('getData');
    if(rows.total >0){
        parent.addTabPrint("reportPrint"+new Date().getTime(),"打印",contextPath+"/purchase/cost/form/detail/print?id="+$("#id").val());
    }else{
        $_jxc.alert('请选择一行数据.')
    }
}
