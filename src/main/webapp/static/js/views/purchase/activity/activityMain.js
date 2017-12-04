/**
 * Created by zhaoly on 2017/9/7.
 */
var gridCostId = "gridActivity";
var gridActHandel = new GridClass();
var gridDefault = {newPurPrice: 0};
$(function () {
    //initConditionParams();
    //机构选择初始化 收货机构
    $('#targetBranch').branchSelect({
        //ajax请求参数
        param: {
            scope: 1,
            selectType: 1,  //多选
        },
        //数据过滤
        loadFilter: function (data) {
            data.isContainChildren = data.allBranch;
            return data;
        }
    });

    //供应商组件初始化
    $('#supplierSelect').supplierSelect({
        loadFilter:function(data){
            data.supplierId = data.id;
            return data;
        }
    })

    if($("#pageStatus").val() === "add"){
        // initConditionParams();
    }else if ($("#pageStatus").val() == "copy"){
        $_jxc.ajax({url: contextPath + "/purchase/activity/detail/list/" + $("#copyId").val()}, function (data) {
            //$("#gridAddPosAct").datagrid("loadData",data.detail);
            if (data['code'] == 0) {
                $("#" + gridCostId).datagrid("loadData", data.data);
            } else {
                $_jxc.alert(result.message)
            }
        });
    }else if($("#pageStatus").val() == "0"){
        $_jxc.ajax({url: contextPath + "/purchase/activity/detail/list/" + $("#id").val()}, function (data) {
            //$("#gridAddPosAct").datagrid("loadData",data.detail);
            if (data['code'] == 0) {
                $("#" + gridCostId).datagrid("loadData", data.data);
            } else {
                $_jxc.alert(result.message)
            }
        });
    } else {
        $_jxc.ajax({url: contextPath + "/purchase/activity/detail/list/" + $("#id").val()}, function (data) {
            //$("#gridAddPosAct").datagrid("loadData",data.detail);
            if (data['code'] == 0) {
                $("#" + gridCostId).datagrid("loadData", data.data);
            } else {
                $_jxc.alert(result.message)
            }
        });
        disabledElement();
    }
    initGridActivity();

})
var isdisabled = false;
function disabledElement(){
    isdisabled = true;
    $("#supplierName").prop("disabled",true);
    $("#txtStartDate").prop("disabled",true);
    $("#txtEndDate").prop("disabled",true);
    $("#remark").prop("disabled",true);
    $("#branchName").prop("disabled",true);
}

//初始化默认条件
function initConditionParams(){
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}

function initGridActivity() {
    gridActHandel.setGridName(gridCostId);
    gridActHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridActHandel.addRow(parseInt(gridActHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridActHandel.setBeginRow(gridActHandel.getSelectRowIndex()+1);
                    gridActHandel.setSelectFieldName("skuCode");
                    gridActHandel.setFieldFocus(gridActHandel.getFieldTarget('skuCode'));
                },100)
            }else{
                selectGoods(arg);
            }
        },
    })
    $("#"+gridCostId).datagrid({
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination: true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        pageSize: 50,
        pageList: [20, 50, 100],//可以设置每页记录条数的列表
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'ck',checkbox:true},
            {field:'cz',title:'操作',width:'60px',align:'center',
                formatter : function(value, row,index) {
                    var str = "";
                    if(row.isFooter){
                        str ='<div class="ub ub-pc">合计</div> '
                    }else{
                        str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
                    }
                    return str;
                }
            },
            {field:'skuId',title:'skuId',width:'85px',align:'left',hidden:true},
            {field:'skuCode',title:'货号',width:'70px',align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        disabled:isdisabled,
                    }
                }
            },
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'130px',align:'left'},
            {field: 'categoryName', title: '商品类别', width: '60px', align: 'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'60px',align:'left'},

            {
                field: 'oldPurPrice', title: '原进货价', width: '80px', align: 'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {
                field: 'newPurPrice', title: '活动进货价', width: '80px', align: 'right',
                formatter : function(value, row, index) {

                    if(row.isFooter){
                        return ;
                    }
                    if(typeof(value) === "undefined" || value == null ){
                        row['newPurPrice'] = row['oldPurPrice'];
                        value = row['oldPurPrice'];
                    }

                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                        disabled:isdisabled,
                    }
                },
            },

            {field:'remark',title:'备注',width:'200px',align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        disabled:isdisabled,
                    }
                }
            }
        ]],
        onClickCell:function(rowIndex,field,value){
            gridActHandel.setBeginRow(rowIndex);
            gridActHandel.setSelectFieldName(field);
            var target = gridActHandel.getFieldTarget(field);
            if(target){
                gridActHandel.setFieldFocus(target);
            }else{
                gridActHandel.setSelectFieldName("newAmount");
            }
        },
        onLoadSuccess : function() {
            gridActHandel.setDatagridHeader("center");
            updateFooter();
        }
    })

    gridActHandel.setLoadData([$.extend({}, gridDefault), $.extend({}, gridDefault),
        $.extend({}, gridDefault), $.extend({}, gridDefault), $.extend({}, gridDefault), $.extend({}, gridDefault),
        $.extend({}, gridDefault), $.extend({}, gridDefault), $.extend({}, gridDefault), $.extend({}, gridDefault)]);

}

//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridActHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridActHandel.delRow(index);
}

//合计
function updateFooter(){
    var fields = {amount:0,newAmount:0,totalMoney:0};
    var argWhere = {name:'isGift',value:""}
    gridActHandel.updateFooter(fields,argWhere);
}

function selectGoods(searchKey) {
    var branchId = $("#branchId").val();
    if($_jxc.isStringNull(branchId)){
        $_jxc.alert("请先选择机构");
        return;
    }

    var supplierId = $("#supplierId").val();
    if($_jxc.isStringNull(supplierId)){
        $_jxc.alert("请先选择供应商");
        return;
    }

    var queryParams = {
        type: 'PL',
        key:searchKey,
        isRadio:0,
        branchId: $('#branchId').val(),
        branchName: $('#branchName').val(),
        branchCode: $('#branchCode').val(),
        flag:'0',
        supplierId: $("#supplierId").val()
    };

    new publicGoodsServiceTem(queryParams,function(data){
        if(data.length==0){
            return;
        }
        if(searchKey){
            $("#"+gridCostId).datagrid("deleteRow", gridActHandel.getSelectRowIndex());
            $("#"+gridCostId).datagrid("acceptChanges");
        }

        var nowRows = gridActHandel.getRowsWhere({skuCode:'1'});
        var addDefaultData  = gridActHandel.addDefault(data,gridDefault);

        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1 };   //只要是赠品就可以重复
        var newRows = gridActHandel.checkDatagrid(nowRows,addDefaultData,argWhere,isCheck);
        $.each(newRows,function (index,item) {
            if(typeof(item.purchasePrice) != 'undefined'){
                item.oldPurPrice = item.purchasePrice;
                item.newPurPrice = item.purchasePrice;
            }
        })

        $("#"+gridCostId).datagrid("loadData",newRows);

        setTimeout(function(){
            gridActHandel.setBeginRow(gridActHandel.getSelectRowIndex()||0);
            gridActHandel.setSelectFieldName("price");
            gridActHandel.setFieldFocus(gridActHandel.getFieldTarget('price'));
        },100)
    });

}


function saveForm() {
    gridActHandel.endEditRow();
    if (!validform()) return;

    var formObj = $("#formAdd").serializeObject();
    var param = {
        formObj: JSON.stringify(formObj),
        list: JSON.stringify(gridActHandel.getRows())
    };

    // var param = {
    //     formObj: formObj,
    //     list: gridActHandel.getRows()
    // };

    // var req = JSON.stringify(param);

    $_jxc.ajax({
        url: contextPath + '/purchase/activity/save',
        data: param
    }, function (result) {
        if (result.code == 0) {
            $_jxc.alert("保存成功", function (data) {
                window.location.href = contextPath + '/purchase/activity/edit/' + result.data.id;
            })
        } else {
            $_jxc.alert(result['message']);
        }
    })
}

var flag = false;
function validform() {
    var branchId = $("#branchId").val();
    if (!branchId) {
        $_jxc.alert("活动机构不能为空!");
        return false;
    }

    var supplierId = $("#supplierId").val();
    if (!supplierId) {
        $_jxc.alert("供应商不能为空");
        return false;
    }
    var startDate = $("#txtStartDate").val();
    var endDate = $("#txtEndDate").val();
    if($_jxc.isStringNull(startDate) || $_jxc.isStringNull(endDate)){
        $_jxc.alert("活动日期不完整，请填写完整");
        return false;
    }

    if(dateUtil.compareDate(startDate,endDate)){
        $_jxc.alert("结束时间不能早于开始时间");
        return false;
    }

    var rows =gridActHandel.getRowsWhere({skuCode:1});
    if(rows.length <=0){
        $_jxc.alert("列表数据不能为空");
        return false;
    }
    $.each(rows,function (index,item) {
        if(!$_jxc.isStringNull(item['remark']) && item['remark'].length > 50){
            $_jxc.alert("第"+(index+1)+"行，备注长度大于了50个字符");
            flag = true;
        }
    })

    if(flag) return false;

    return true;
}

//导入
function toImportproduct(type) {
    var branchId = $("#branchId").val();
    if (!branchId) {
        $_jxc.alert("请先选择机构名称");
        return;
    }
    var param = {
        url: contextPath + "/purchase/activity/importList?branchName='" + $("#branchName").val() + "'&supplierId='" + $("#supplierId").val() + "'",
        tempUrl: contextPath + "/purchase/activity/exportTemp",
        type: type,
        branchIds: branchId
    }
    new publicUploadFileService(function (data) {
        //updateListData(data);
        for (var i = 0, length = data.length; i < length; i++) {
            data[i]['oldPurPrice'] = data[i]['purchasePrice'];
        }
        $("#" + gridCostId).datagrid("loadData", data);
    }, param)
}

function check() {
    gridActHandel.endEditRow();
    $_jxc.confirm("确认审核通过？", function (res) {
        if (res) {
            $_jxc.ajax({
                url: contextPath + '/purchase/activity/audit',
                data: {
                    formId: $("#id").val()
                },
            }, function (result) {
                if (result.code == 0) {
                    $_jxc.alert("审核成功", function () {
                        gFunRefresh();
                    });
                } else {
                    $_jxc.alert(result['message']);
                }
            })
        }
    })


}

function over() {
    $_jxc.confirm("确认终止此采购促销单？", function (res) {
        if (res) {
            $_jxc.ajax({
                url: contextPath + '/purchase/activity/over',
                data: {
                    formId: $("#id").val(),
                },
            }, function (result) {
                if (result.code == 0) {
                    $_jxc.alert("终止成功", function () {
                        gFunRefresh();
                    });
                } else {
                    $_jxc.alert(result['message']);
                }
            })
        }
    })
}

function del() {
    $_jxc.confirm('是否要删除该单据?', function (data) {
        if (data) {
            $_jxc.ajax({
                url: contextPath + "/purchase/activity/del",
                data: {
                    "ids[]": $("#id").val()
                }
            }, function (result) {
                if (result['code'] == 0) {
                    $_jxc.alert("删除成功", function () {
                       toClose();
                    });
                } else {
                    $_jxc.alert(result['message']);
                }
            });
        }
    })
}

/**
 * 导出明细
 */
function exportData() {
    $("#formAdd").attr("action", contextPath + '/purchase/activity/export/detail/' + $("#id").val());
    $("#formAdd").submit();
}

function copy(id) {
    window.parent.addTab('复制采购促销活动', contextPath + '/purchase/activity/copy/' + id);
}