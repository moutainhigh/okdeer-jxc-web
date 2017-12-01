/**
 * Created by zhaoly on 2017/5/25.
 */

var chargeStatus = "add";
var url = "";
var isdisabled = false;
var formId = "";
var selbranchType = sessionBranchType;

$(function () {
    chargeStatus = $('#chargeStatus').val();
    
    formId = $("#formId").val();
    
    if(chargeStatus === "add"){
        $("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
    	if(selbranchType>=3){
    		$("#branchName").val(sessionBranchCodeName);
	        $("#branchId").val(sessionBranchId);
    	}
        $("#chargeMonth").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM"));
        
        initBranchSelect();
        
    }else if(chargeStatus === "edit"){
        $('#already-examine').css('display','none');
        url = contextPath + "/finance/financeCharge/getDetailList";
        var month = $("#month").val().substr(0,4)+"-"+$("#month").val().substr(4,5)
        $("#chargeMonth").val(month);
        
    }else if(chargeStatus === "check"){
        $('#already-examine').css('display','block');
        isdisabled = true;
        url = contextPath + "/finance/financeCharge/getDetailList";
        var month = $("#month").val().substr(0,4)+"-"+$("#month").val().substr(4,5)
        $("#chargeMonth").val(month);
    }
    initGridStoreCharge();
})

//初始化机构选择
function initBranchSelect(){
	$('#branchComponent').branchSelect({
		param:{
			branchTypesStr:$_jxc.branchTypeEnum.OWN_STORES + 
							',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_C +
							',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_B
		}
	})
}

var gridName = "gridStoreCharge";
var gridHandel = new GridClass();
var gridDefault = {
    amount:0
}
var editRowData = null;

function initGridStoreCharge() {
    gridHandel.setGridName(gridName);
    gridHandel.initKey({
        firstName:'costTypeCode',
        enterName:'costTypeCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("costTypeCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('costTypeCode'));
                },100)
            }else{
                selectCharge(arg);
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
            {field:'costTypeCode',title:'费用代码',width:120,align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        disabled:isdisabled,
                    }
                },
            },
            {field:'costTypeLabel',title:'费用名称',width:180,align:'left'},
            {field:'amount',title:'费用金额',width:120,align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0.0000,
                        max:999999.9999,
                        precision:4,
                        disabled:isdisabled,
                        prompt:"最大值999999.99",
                        onChange: onChangeAmount,
                    }
                },
            },
            {field:'remark',title:'备注',width:250,align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[20]},
                    }
                }
            },
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("costTypeCode");
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
                    gridHandel.setFieldTextValue('costTypeCode',editRowData.costTypeCode);
                }
            }
        },
        onLoadSuccess : function(data) {
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    })

    if(chargeStatus === "add"){
        gridHandel.setLoadData([$.extend({},gridDefault)]);
    }
}

function onChangeAmount(newVal,oldVal) {
    // if(parseInt(newVal) > 999999.99){
    //     $_jxc.alert('费用金额最大值为999999.99')
    // }
    updateFooter();
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


function storeChargeAdd() {
    toAddTab("新增门店固定费用",contextPath + "/finance/financeCharge/toAdd");
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
    
    if(!$.trim($('#chargeMonth').val())){
        $_jxc.alert("月份不能为空!");
        return;
    }
    
    var rows = gridHandel.getRowsWhere({costTypeLabel:1});
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    
    var isCheckResult = true;
    var detailList = [];
    $.each(rows,function(i,v){
        if(!v["costTypeCode"]){
            $_jxc.alert("第"+(i+1)+"行，费用代码不能为空");
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

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
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
        url = contextPath + "/finance/financeCharge/addFinanceCharge";
    }else if(chargeStatus === "edit"){
        url = contextPath + "/finance/financeCharge/updateFinanceCharge";
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
                location.href = contextPath + "/finance/financeCharge/toEdit?formId=" + result.data.formId;
            });
        }else{
            $_jxc.alert(result['message'])
        }
    })
    
}

function selectCharge(searchKey) {
    var param = {
        key:searchKey,
        type:'101006'
    };
    publicCostService(param,function(data){
        if(data.length==0){
            return;
        }
        if(searchKey){
            $("#"+gridName).datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#"+gridName).datagrid("acceptChanges");
        }

        var nowRows = gridHandel.getRowsWhere({costTypeLabel:'1'});
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

function chargeDelete() {
    var param = {
        url:contextPath+"/finance/financeCharge/deleteFinanceCharge",
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
    var param = {
        url :contextPath+"/finance/financeCharge/checkFinanceCharge",
        data:{
            formId:formId,
        }
    }

    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
            $_jxc.alert("操作成功！",function(){
                location.href = contextPath +"/finance/financeCharge/toEdit?formId=" + formId;
            });
        }else{
            $_jxc.alert(result['message']);
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
	location.href = contextPath +"/finance/financeCharge/exportList?formId=" + formId;
}


//新的导入功能 
function toImportStoreCharge(){
	
    var param = {
        url : contextPath+"/finance/financeCharge/importList",
        tempUrl : contextPath+"/finance/financeCharge/exportTemp",
        title : "费用导入",
        type : -1
    }
    
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		setChargeList(data);
    	}
    },param);
}


function setChargeList(data){
	
	console.log(data);
	
	$("#"+gridName).datagrid("loadData",data);
	  
//	$.each(result.data,function(j,obj){
//        if(val.skuId==obj.skuId){
//            data[i].alreadyNum = obj.alreadyNum;
//        }
//    })
}