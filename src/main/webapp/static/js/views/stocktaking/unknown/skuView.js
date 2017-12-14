/**
 * Created by Jason on 2017/7/15.
 */
/**
 * 库存盘货单
 */
var gridName = "operateGrid";
var isdisabled = false;
var url;
var operateStatus = 'add';
var oldData = {};
var editRowData = null;
$(function(){
        operateStatus = $('#operateStatus').val();
        var formId = $('#formId').val();

        url = contextPath +"/stocktaking/unknown/sku/stocktakingFormDetailList?formId=" + formId;
        isdisabled = true;
        $('#already-examine').css('display','black');
        $('#remark').prop('readOnly','readOnly');
        $('#btnSelgoods').addClass('uinp-no-more');
        $('#btnSelgoods').prop('disabled','disabled ');
        $('#btnSave').addClass('uinp-no-more');
        $('#btnSave').prop('disabled','disabled ');
        $('#btndelete').addClass('uinp-no-more');
        $('#btndelete').prop('disabled','disabled ');
        $('#btnImport').addClass('uinp-no-more');
        $('#btnImport').prop('disabled','disabled ');
        initOperateDataGrid();
    }
)

var gridHandel = new GridClass();
var dg;
//构造grid columns
function getColumns(){
    var defaultCoumns = [
            {field:'ck',checkbox:true},

            {field:'barCode',title:'条码',width: '120px',align:'left',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<div class="ub ub-pc">合计</div> '
                    }
                    return value;
                }
            },
            {field:'stocktakingNum',title:'实际盘点数量',width:'120px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!value){
                        row["stocktakingNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:isdisabled,
                        min:0,
                        precision:4,
                        onChange: onChangeStockNum,
                    }
                }
            }
        ];

    return [defaultCoumns];
}
function initOperateDataGrid(){
    gridHandel.setGridName(gridName);
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("skuCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
                },100)
            }else{
                branchId = $("#sourceBranchId").val();
                selectGoods(arg);
            }
        },
    })
    if(dg){
        $("#"+gridName).datagrid('options').url = '';
    }
    dg = $("#"+gridName).datagrid({
        method:'get',
        url:url,
        align:'center',
        singleSelect:false,  // 单选 false多选
        rownumbers:true,    // 序号
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:getColumns(),
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("skuCode");
            }
        },
        onBeforeEdit:function (rowIndex, rowData) {
            editRowData = $.extend(true,{},rowData);
        },
        onAfterEdit:function(rowIndex, rowData, changes){
            if(typeof(rowData.id) === 'undefined'){
                // $("#"+gridName).datagrid('acceptChanges');
            }else{
                if(editRowData.skuCode != changes.skuCode){
                    rowData.skuCode = editRowData.skuCode;
                    gridHandel.setFieldTextValue('skuCode',editRowData.skuCode);
                }
            }
        },
        onLoadSuccess:function(data){
            if(operateStatus==='0'){
                if(!oldData["grid"]){
                    oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                        return $.extend(true,{},obj);//返回对象的深拷贝
                    });
                }
            }
            gridHandel.setDatagridHeader("center");
            updateFooter();
        },
    });

    if(operateStatus === 'add'){
        gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
            $.extend({},gridDefault),$.extend({},gridDefault)]);
    }
}

//计算金额
function onChangeStockNum(newV,oldV){
    var priceValue = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
    gridHandel.setFieldValue('amount',priceValue*newV);
    updateFooter();
}

// 合计
function updateFooter(){
    var fields = {stocktakingNum:0,amount:0,isGift:0};
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}

// 插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
// 删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}

/**
 * 导出
 */
function exportData(){
    var length = dg.datagrid('getData').total;
    if(length == 0){
        $_jxc.alert("没有数据");
        return;
    }

    $("#operateForm").attr("action",contextPath+"/stocktaking/unknown/sku/exportDetailList");
    $("#operateForm").submit();
}