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

    chargeStatus = $('#chargeStatus').val();
    
    formId = $("#formId").val();
    
    if(chargeStatus === "add"){
        $("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
        $("#purTime").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
        $("#purUserName").val(sessionUserName);
        $("#purUserId").val(sessionUserId);
        
        $('#branchComponent').branchSelect({
            param:{
                branchTypesStr:$_jxc.branchTypeEnum.OWN_STORES +
                ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_C +
                ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_B
            },
            onAfterRender:function (data) {
                selbranchType = data.type;
            }
        });

        $('#cashierSelect').operatorSelect({
            onAfterRender:function(data){
                $("#purUserId").val(data.id);
                $("#purUserName").val(data.userName);
            }
        });
        
        $('#supplierComponent').supplierSelect({
            onAfterRender:function(data){
                $("#supplierId").val(data.id);
            }
        });
        
    }else if(chargeStatus === "edit"){
        disablePageElement();
        oldData = {
            remark:$("#remark").val()                  // 备注
        }

        $('#already-examine').css('display','none');
        url = contextPath + "/finance/buildCharge/getDetailList";
    }else if(chargeStatus === "check"){
        disablePageElement();
        $('#already-examine').css('display','block');
        isdisabled = true;
        url = contextPath + "/finance/buildCharge/getDetailList";
    }
    initGridStoreCharge();

})

function disablePageElement() {
    $("#supplierName").addClass("uinp-no-more")
    $("#supplierName").prop("disabled","disabled");
    $("#purTime").addClass("uinp-no-more")
    $("#purTime").prop("disabled","disabled");
    $("#branchCodeName").addClass("uinp-no-more")
    $("#branchCodeName").prop("disabled","disabled");
    $("#purUserName").addClass("uinp-no-more")
    $("#purUserName").prop("disabled","disabled");
}

var gridRecordName = "gridBuldCharge";
var gridRecordHandel = new GridClass();
var gridDefault = {
    amount:0
}
var editRowData = null;

function initGridStoreCharge() {
    gridRecordHandel.setGridName(gridRecordName);
    gridRecordHandel.initKey({
        firstName:'chargeCode',
        enterName:'chargeCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridRecordHandel.addRow(parseInt(gridRecordHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridRecordHandel.setBeginRow(gridRecordHandel.getSelectRowIndex()+1);
                    gridRecordHandel.setSelectFieldName("chargeCode");
                    gridHandel.setFieldFocus(gridRecordHandel.getFieldTarget('chargeCode'));
                },100)
            }else{
                selectChargeRecord(arg);
            }
        },
    })


    $("#"+gridRecordName).datagrid({
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
            {field:'chargeId',hidden:'true'},
            {field:'chargeCode',title:'费用编码',width:80,align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        disabled:isdisabled,
                    }
                },
            },
            {field:'chargeName',title:'名称',width:180,align:'left'},
            {field:'unit',title:'单位',width:60,align:'left'},
            {field:'spec',title:'规格',width:80,align:'left'},
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
                        onChange:changeChargeNum
                    }
                },
            },
            {field:'price',title:'采购价',width:120, align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!value){
                        row["price"] = 0.0000;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                }
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
                        disabled:true,
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
            gridRecordHandel.setBeginRow(rowIndex);
            gridRecordHandel.setSelectFieldName(field);
            var target = gridRecordHandel.getFieldTarget(field);
            if(target){
                gridRecordHandel.setFieldFocus(target);
            }else{
                gridRecordHandel.setSelectFieldName("chargeCode");
            }
        },
        onBeforeEdit:function (rowIndex, rowData) {
            editRowData = $.extend(true,{},rowData);
        },
        onAfterEdit:function(rowIndex, rowData, changes){
            if(typeof(rowData.id) === 'undefined'){
                // $("#"+gridRecordName).datagrid('acceptChanges');
            }else{
                if(editRowData.costTypeCode != changes.costTypeCode){
                    rowData.costTypeCode = editRowData.costTypeCode;
                    gridRecordHandel.setFieldTextValue('chargeCode',editRowData.costTypeCode);
                }
            }
        },
        onLoadSuccess : function(data) {

            if(chargeStatus === "edit" && !oldData["grid"]){
                oldData["grid"] = $.map(gridRecordHandel.getRows(), function(obj){
                    return $.extend(true,{},obj);//返回对象的深拷贝
                });
            }
            gridRecordHandel.setDatagridHeader("center");
            updateFooter();
        }
    })

    if(chargeStatus === "add"){
        gridRecordHandel.setLoadData([$.extend({},gridDefault)]);
    }
}

//合计
function updateFooter(){
    var fields = {amount:0};
    var argWhere = {name:'isGift',value:0}
    gridRecordHandel.updateFooter(fields,argWhere);
}
//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridRecordHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridRecordHandel.delRow(index);
}

function changeChargeNum(newVal,oldVal) {
    var price = gridRecordHandel.getFieldData(gridRecordHandel.getSelectRowIndex(),"price");
    var amount = (newVal*price).toFixed(4);
    gridRecordHandel.setFieldValue("amount",amount);
    updateFooter();
}


function storeChargeAdd() {
    toAddTab("新增建店费用",contextPath + "/finance/buildCharge/toAdd");
}


function saveStoreCharge() {
    $("#"+gridRecordName).datagrid("endEdit", gridRecordHandel.getSelectRowIndex());

    //收货机构
    var branchId = $("#branchId").val();
    var branchCode = $("#branchCode").val();
    if(!branchId){
        $_jxc.alert("机构不能为空!");
        return;
    }
    
    // 供应商
    var supplierId = $("#supplierId").val();
    if(!supplierId){
    	$_jxc.alert("供应商不能为空!");
    	return;
    }
    
    // 负责人
    var purUserId = $("#purUserId").val();
    if(!purUserId){
    	$_jxc.alert("负责人不能为空!");
    	return;
    }
    
    // 验收时间
    var purTime = $("#purTime").val();
    if(!purTime){
    	$_jxc.alert("验收时间不能为空!");
    	return;
    }

    if(selbranchType<3 && chargeStatus === "add"){
    	$_jxc.alert("机构只能选择店铺类型！");
    	return;
    }

    var rows = gridRecordHandel.getRowsWhere({chargeName:1});
    if(rows.length==0){
        $_jxc.alert("表格数据不完整或者为空");
        return;
    }
    
    var isCheckResult = true;
    var detailList = [];
    $.each(rows,function(i,v){
        if(!v["num"]){
            $_jxc.alert("第"+(i+1)+"行，数量不能为空");
            isCheckResult = false;
            return false;
        };
        if(v["amount"]<=0){
            $_jxc.alert("第"+(i+1)+"行，金额必须大于0");
            isCheckResult = false;
            return false;
        }
        var detailItem = {};
        detailItem.chargeId = v.chargeId;
        detailItem.chargeCode = v.chargeCode;
        detailItem.price = v.price;
        detailItem.num = v.num;
        detailItem.amount = v.amount;
        detailItem.validity = v.validity;
        detailItem.remark = v.remark;
        detailList[i] = detailItem;
    });
    
    if(!isCheckResult){
        return;
    }

    var totalchargeAmount = 0;
    
    //备注
    var remark = $("#remark").val();

    var footerRows = $("#"+gridRecordName).datagrid("getFooterRows");
    if(footerRows){
        totalchargeAmount = parseFloat(footerRows[0]["amount"]||0.0).toFixed(4);
    }

    var reqObj = {
        branchId:branchId,
        branchCode:branchCode,
        supplierId:supplierId,
        purUserId:purUserId,
        purTime:purTime,
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
   new publicChargeRecordService(param,function (data) {
       if(searchKey){
           $("#"+gridRecordName).datagrid("deleteRow", gridRecordHandel.getSelectRowIndex());
           $("#"+gridRecordName).datagrid("acceptChanges");
       }
       var nowRows = gridRecordHandel.getRowsWhere({chargeName:'1'});
       var keyNames = {
           purPrice:'price',
           id:'chargeId'
       };
       var updateRows = gFunUpdateKey(data,keyNames);
       var argWhere ={chargeCode:1};  // 验证重复性
       var newRows = gridRecordHandel.checkDatagrid(nowRows,updateRows,argWhere);
       $("#"+gridRecordName).datagrid("loadData",newRows);
    })
}

function setData(searchKey,data) {

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
        grid:gridRecordHandel.getRows(),
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
	var length = $("#" + gridRecordName).datagrid('getData').total;
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
        title : "费用导入",
        type : -1
    }
    
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		setChargeList(data);
    	}
    },param);
}
