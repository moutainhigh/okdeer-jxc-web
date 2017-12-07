/**
 * Created by zhaoly on 2017/5/25.
 */

var chargeStatus = "add";
var url = "";
var isdisabled = false;
var formId = "";
var selbranchType = sessionBranchType;
var oldData = {};

$(function () {

    $('#branchComponent').branchSelect({
        param:{
            branchTypesStr:$_jxc.branchTypeEnum.OWN_STORES +
            ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_C +
            ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_B
        }
    });

    $('#branchComponent').branchSelect();

    $('#cashierSelect').operatorSelect({
        onAfterRender:function(data){
            $("#cashierId").val(data.id);
            $("#cashierName").val(data.userName);
        }
    });

    chargeStatus = $('#chargeStatus').val();
    
    formId = $("#formId").val();
    
    if(chargeStatus === "add"){
        $("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
    	if(selbranchType>=3){
    		$("#branchName").val(sessionBranchCodeName);
	        $("#branchId").val(sessionBranchId);
    	}
        $("#chargeMonth").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM-dd"));
    }else if(chargeStatus === "edit"){
        oldData = {
            remark:$("#remark").val()                  // 备注
        }

        $('#already-examine').css('display','none');
        url = contextPath + "/finance/buildCharge/getDetailList";
        var month = $("#month").val().substr(0,4)+"-"+$("#month").val().substr(4,5)
        $("#chargeMonth").val(month);
    }else if(chargeStatus === "check"){
        $('#already-examine').css('display','block');
        isdisabled = true;
        url = contextPath + "/finance/buildCharge/getDetailList";
        var month = $("#month").val().substr(0,4)+"-"+$("#month").val().substr(4,5)
        $("#chargeMonth").val(month);
    }
    initGridStoreCharge();

})

var gridName = "gridBuldCharge";
var gridHandel = new GridClass();
var gridDefault = {
    amount:0
}
var editRowData = null;

function initGridStoreCharge() {
    gridHandel.setGridName(gridName);
    gridHandel.initKey({
        firstName:'chargeCode',
        enterName:'chargeCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("chargeCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('chargeCode'));
                },100)
            }else{
                selectChargeRecord(arg);
            }
        },
    })


    $("#"+gridName).datagrid({
        align:'center',
        url:url,
        queryParams:{
        	formId : formId
        },
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'cz',title:'操作',width:'60px',align:'center',hidden:isdisabled,
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
            // {field:'costTypeId',hidden:'true'},
            {field:'chargeCode',title:'费用编码',width:120,align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        disabled:isdisabled,
                    }
                },
            },
            {field:'chargeName',title:'名称',width:180,align:'left'},
            {field:'unit',title:'单位',width:180,align:'left'},
            {field:'sepc',title:'规格',width:180,align:'left'},

            {field:'num',title:'数量',width:120,align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!value){
                        row["num"] = 0.00;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:isdisabled,
                        min:0,
                        precision:4,
                        onchange:changeChargeNum()
                    }
                },
            },
            {field:'price',title:'采购价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!value){
                        row["price"] = 0.00;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        disabled:true,
                        min:0,
                        precision:4
                    }
                },
            },

            {field:'amount',title:'金额',width:120,align:'right',
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
                        disabled:isdisabled,
                    }
                },
            },

            {field:'validity',title:'保修期限/天',width:120,align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    if(!value){
                        row["validity"] = 0.00;
                    }
                    return '<b>'+parseFloat(value||0)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        precision:0,
                        disabled:isdisabled,
                    }
                },
            },
            {field:'remark',title:'备注',width:250,align:'left', editor:'textbox'
            },
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("chargeCode");
            }
        },
        onBeforeEdit:function (rowIndex, rowData) {
            editRowData = $.extend(true,{},rowData);
        },
        onAfterEdit:function(rowIndex, rowData, changes){
            if(typeof(rowData.id) === 'undefined'){
                // $("#"+gridName).datagrid('acceptChanges');
            }else{
                if(editRowData.costTypeCode != changes.costTypeCode){
                    rowData.costTypeCode = editRowData.costTypeCode;
                    gridHandel.setFieldTextValue('chargeCode',editRowData.costTypeCode);
                }
            }
        },
        onLoadSuccess : function(data) {

            if(chargeStatus === "edit" && !oldData["grid"]){
                oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                    return $.extend(true,{},obj);//返回对象的深拷贝
                });
            }
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    })

    if(chargeStatus === "add"){
        gridHandel.setLoadData([$.extend({},gridDefault)]);
    }
}

//合计
function updateFooter(){
    var fields = {amount:0};
    var argWhere = {name:'isGift',value:""}//
    gridHandel.updateFooter(fields,argWhere);
}
//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}

function changeChargeNum(newVal,oldVal) {


}


function storeChargeAdd() {
    toAddTab("新增建店费用",contextPath + "/finance/buildCharge/toAdd");
}


function saveStoreCharge() {
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());

    //收货机构
    var branchId = $("#branchId").val();
    var branchCode = $("#branchCode").val();
    if(!branchId){
        $_jxc.alert("机构不能为空!");
        return;
    }

    if(selbranchType<3 && chargeStatus === "add"){
    	$_jxc.alert("机构只能选择店铺类型！");
    	return;
    }

    var chargeMonth = $("#chargeMonth").val();
    if(!chargeMonth){
        $_jxc.alert("月份不能为空!");
        return;
    }
    
    var rows = gridHandel.getRowsWhere({costTypeLabel:1});
    if(rows.length==0){
        $_jxc.alert("表格数据不完整或者为空");
        return;
    }
    
    var isCheckResult = true;
    var detailList = [];
    $.each(rows,function(i,v){
        if(!v["costTypeCode"]){
            $_jxc.alert("第"+(i+1)+"行，支出代码不能为空");
            isCheckResult = false;
            return false;
        };
        if(v["amount"]<=0){
            $_jxc.alert("第"+(i+1)+"行，金额必须大于0");
            isCheckResult = false;
            return false;
        }
        var detailItem = {};
        detailItem.costTypeId = v.costTypeId;
        detailItem.amount = v.amount;
        detailItem.remark = v.remark;
        detailList[i] = detailItem;
    });
    
    if(!isCheckResult){
        return;
    }

    var totalchargeAmount = 0;
    //费用月份
    var chargeMonth = $("#chargeMonth").val().replace("-", "");
    //备注
    var remark = $("#remark").val();

    var footerRows = $("#"+gridName).datagrid("getFooterRows");
    if(footerRows){
        totalchargeAmount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
    }

    var reqObj = {
        branchId:branchId,
        branchCode:branchCode,
        month:chargeMonth,
        remark:remark,
        sumAmount:totalchargeAmount,
        detailList:detailList
    };

    var url = "";
    if(chargeStatus === "add"){
        url = contextPath + "/finance/buildCharge/addBuildCharge";
    }else if(chargeStatus === "edit"){
        url = contextPath + "/finance/buildCharge/updateBuildCharge";
        reqObj.formNo = $("#formNo").val();
        reqObj.id = $("#formId").val();
    }

    var param = {
        url:url,
        data:JSON.stringify(reqObj),
        contentType:'application/json',
    }

    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
            $_jxc.alert("保存成功！",function(){
                location.href = contextPath + "/finance/buildCharge/toEdit?formId=" + result.data.formId;
            });
        }else{
            $_jxc.alert(result['message'])
        }
    })
    
}

function selectChargeRecord(searchKey) {
    var param = {
        key:searchKey,
    };
    publicCostService(param,function(data){
        if(data.length==0){
            return;
        }
        if(searchKey){
            $("#"+gridName).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#"+gridName).datagrid("acceptChanges");
        }

        var nowRows = gridHandel.getRowsWhere({costTypeCode:'1'});
        var addDefaultData = gridHandel.addDefault(data,gridDefault);
        var keyNames = {
        	id:"costTypeId",
            value:"costTypeCode",
            label:"costTypeLabel"
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={costTypeCode:1};  //验证重复性
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,{});
        $("#"+gridName).datagrid("loadData",newRows);
        gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("amount");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('amount'));
        },100)
    });
}

var chargeRecordTemp = null;
function publicChargeRecord(param) {

}

function closeChargeRecordDialog(){
    chargeRecordTemp = null;
    $(chargeRecordTemp).destroy();
}

function chargeDelete() {
    var param = {
        url:contextPath+"/finance/buildCharge/deleteBuildCharge",
        data:{
            formId:formId
        }
    }

    $_jxc.confirm('是否要删除此条数据?',function(data){
        if(data){
            $_jxc.ajax(param,function (result) {
                if(result['code'] == 0){
                    $_jxc.alert("删除成功！",function(){
                        toClose();
                    });

                }else{
                    $_jxc.alert(result['message']);
                }
            })

        }
    });
}

function  chargeCheck() {

    var newData = {
        remark:$("#remark").val(),                  // 备注
        grid:gridHandel.getRows(),
    }

    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }

    var param = {
        url :contextPath+"/finance/buildCharge/checkBuildCharge",
        data:{
            formId:formId,
        }
    }

    $_jxc.confirm("是否审核通过？",function (data) {
        if(data){
            $_jxc.ajax(param,function (result) {
                if(result['code'] == 0){
                    $_jxc.alert("操作成功！",function(){
                        location.href = contextPath +"/finance/buildCharge/toEdit?formId=" + formId;
                    });
                }else{
                    $_jxc.alert(result['message']);
                }
            })
        }
    })

}

function exportList(){
	var length = $("#" + gridName).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert('提示',"列表数据为空");
		return;
	}
	
	if(length > exportMaxRow){
		$_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}
	location.href = contextPath +"/finance/buildCharge/exportList?formId=" + formId;
}


//新的导入功能 
function toImportStoreCharge(){
	
    var param = {
        url : contextPath+"/finance/buildCharge/importList",
        tempUrl : contextPath+"/finance/buildCharge/exportTemp",
        title : "支出导入",
        type : -1
    }
    
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		setChargeList(data);
    	}
    },param);
}
