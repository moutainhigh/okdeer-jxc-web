/**
 * Created by zhaoly on 2017/5/25.
 */

var businessStatus = "add";
var isdisabled = false;
var formId = "";
var selbranchType = sessionBranchType;
var gridDefault;
var oldData = {};
$(function () {
    businessStatus = $('#businessStatus').val();
    
    formId = $("#formId").val();
    gridDefault = {
		saleAmount : $("#saleAmount").val(),
		costAmount : $("#costAmount").val(),
		taxAmount : $("#taxAmount").val(),
		profitAmount : $("#profitAmount").val(),
		wagesAmount : $("#wagesAmount").val(),
		lossAmount : $("#lossAmount").val(),
		utilityAmount : $("#utilityAmount").val(),
		stationeryAmount : $("#stationeryAmount").val(),
		callsAmount : $("#callsAmount").val(),
		maintenanceAmount : $("#maintenanceAmount").val(),
		incidentalAmount : $("#incidentalAmount").val(),
		controllableAmount : $("#controllableAmount").val(),
		rentAmount : $("#rentAmount").val(),
		managementAmount : $("#managementAmount").val(),
		depreciationAmount : $("#depreciationAmount").val(),
		uncontrollableAmount : $("#uncontrollableAmount").val(),
	};
    if(businessStatus === "add"){
        $("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
    	if(selbranchType>=3){
    		$("#branchName").val(sessionBranchCodeName);
	        $("#branchId").val(sessionBranchId);
    	}
        $("#businessMonth").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM"));
    }else if(businessStatus === "edit"){
        oldData = {
            remark:$("#remark").val()                  // 备注
        }
        $('#already-examine').css('display','none');
        var month = $("#month").val().substr(0,4)+"-"+$("#month").val().substr(4,5)
        $("#businessMonth").val(month);
    }else if(businessStatus === "check"){
        $('#already-examine').css('display','block');
        isdisabled = true;
        var month = $("#month").val().substr(0,4)+"-"+$("#month").val().substr(4,5)
        $("#businessMonth").val(month);
    }
    initGridStoreBusiness();
})

var gridName = "gridStoreBusiness";
var gridHandel = new GridClass();
var editRowData = null;

function initGridStoreBusiness() {
    gridHandel.setGridName(gridName);

    $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        showFooter:false,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'saleAmount',title:'销售额',width:120,align:'right',
                formatter:function(value,row,index){
                    if(!value){
                        row["saleAmount"] = parseFloat(value||0).toFixed(4);
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
                        onChange: onChangeAmount,
                    }
                },
            },
            {field:'costAmount',title:'销售成本',width:120,align:'right',
                formatter:function(value,row,index){
                    if(!value){
                        row["costAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'taxAmount',title:'税项',width:120,align:'right',
                formatter:function(value,row,index){
                    if(!value){
                        row["taxAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'profitAmount',title:'毛利',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["profitAmount"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0.0000,
            			max:999999.9999,
            			precision:4,
            			disabled:true,
            		}
            	},
            },
            {field:'rentAmount',title:'租金',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["rentAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'managementAmount',title:'管理费',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["managementAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'depreciationAmount',title:'固定资产折旧',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["depreciationAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'uncontrollableAmount',title:'不可控费用总数',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["uncontrollableAmount"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0.0000,
            			max:999999.9999,
            			precision:4,
            			disabled:true,
            		}
            	},
            },
            {field:'wagesAmount',title:'人工',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["wagesAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'lossAmount',title:'损耗',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["lossAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'utilityAmount',title:'水电费',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["utilityAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'stationeryAmount',title:'文具',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["stationeryAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'callsAmount',title:'话费',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["callsAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'maintenanceAmount',title:'维修费',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["maintenanceAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'incidentalAmount',title:'杂费',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["incidentalAmount"] = parseFloat(value||0).toFixed(4);
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
            			onChange: onChangeAmount,
            		}
            	},
            },
            {field:'controllableAmount',title:'可控费用总数',width:120,align:'right',
            	formatter:function(value,row,index){
                    if(!value){
                        row["controllableAmount"] = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0.0000,
            			max:999999.9999,
            			precision:4,
            			disabled:true,
            		}
            	},
            }
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("saleAmount");
            }
        },
        onLoadSuccess : function(data) {
            if(businessStatus === "edit" && !oldData["grid"]){
                oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                    return $.extend(true,{},obj);//返回对象的深拷贝
                });
            }
            gridHandel.setDatagridHeader("center");
        }
    })

    // 添加一行表格数据
    gridHandel.setLoadData([$.extend({},gridDefault)]);
}

function onChangeAmount(newVal,oldVal) {
	var saleAmount = parseFloat(gridHandel.getFieldValue(0,'saleAmount')||0);
	var costAmount = parseFloat(gridHandel.getFieldValue(0,'costAmount')||0);
	var taxAmount = parseFloat(gridHandel.getFieldValue(0,'taxAmount')||0);
	var wagesAmount = parseFloat(gridHandel.getFieldValue(0,'wagesAmount')||0);
	var lossAmount = parseFloat(gridHandel.getFieldValue(0,'lossAmount')||0);
	var utilityAmount = parseFloat(gridHandel.getFieldValue(0,'utilityAmount')||0);
	var stationeryAmount = parseFloat(gridHandel.getFieldValue(0,'stationeryAmount')||0);
	var callsAmount = parseFloat(gridHandel.getFieldValue(0,'callsAmount')||0);
	var maintenanceAmount = parseFloat(gridHandel.getFieldValue(0,'maintenanceAmount')||0);
	var incidentalAmount = parseFloat(gridHandel.getFieldValue(0,'incidentalAmount')||0);
	var rentAmount = parseFloat(gridHandel.getFieldValue(0,'rentAmount')||0);
	var managementAmount = parseFloat(gridHandel.getFieldValue(0,'managementAmount')||0);
	var depreciationAmount = parseFloat(gridHandel.getFieldValue(0,'depreciationAmount')||0);
	
	gridHandel.setFieldValue('profitAmount', saleAmount - costAmount);
	gridHandel.setFieldValue('uncontrollableAmount' , rentAmount + managementAmount + depreciationAmount);
	gridHandel.setFieldValue('controllableAmount' , wagesAmount + lossAmount + utilityAmount + stationeryAmount + callsAmount
						+ maintenanceAmount + incidentalAmount);
}

function storeBusinessAdd() {
    toAddTab("新增门店经营数据",contextPath + "/finance/storeBusiness/toAdd");
}

/**
 * 机构名称
 */
function selectListBranches(){
    new publicAgencyService(function(data){
        $("#branchId").val(data.branchesId);
        $("#branchCode").val(data.branchCode);
        selbranchType = data.type;
        $("#branchName").val("["+data.branchCode+"]" + data.branchName);
    },'DD','');
}


function saveStoreBusiness() {
    $("#"+gridName).datagrid("endEdit", 0);

    //机构
    var branchId = $("#branchId").val();
    var branchCode = $("#branchCode").val();
    if(!branchId){
        $_jxc.alert("机构不能为空!");
        return;
    }

    if(selbranchType<3 && businessStatus === "add"){
    	$_jxc.alert("机构只能选择店铺类型！");
    	return;
    }
    
	var reqObj = gridHandel.getRows()[0];
	reqObj.branchId = branchId;
	reqObj.branchCode = branchCode;
	reqObj.month = $("#businessMonth").val().replace("-", "");
	reqObj.remark = $("#remark").val();

    var url = "";
    if(businessStatus === "add"){
        url = contextPath + "/finance/storeBusiness/addStoreBusiness";
    }else if(businessStatus === "edit"){
        url = contextPath + "/finance/storeBusiness/updateStoreBusiness";
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
                location.href = contextPath + "/finance/storeBusiness/toEdit?formId=" + result.data.formId;
            });
        }else{
            $_jxc.alert(result['message'])
        }
    })
    
}

function businessDelete() {
    var param = {
        url:contextPath+"/finance/storeBusiness/deleteStoreBusiness",
        data: {"ids":[formId]}
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

function  businessCheck() {
    var newData = {
        remark:$("#remark").val(),                  // 备注
        grid:gridHandel.getRows(),
    }

    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }

    var param = {
        url :contextPath+"/finance/storeBusiness/auditStoreBusiness",
        data:{
            formId:formId,
        }
    }

    $_jxc.confirm("是否审核通过?",function (data) {
        if(data){
            $_jxc.ajax(param,function (result) {
                if(result['code'] == 0){
                    $_jxc.alert("操作成功！",function(){
                        location.href = contextPath +"/finance/storeBusiness/toEdit?formId=" + formId;
                    });
                }else{
                    $_jxc.alert(result['message']);
                }
            })
        }
    })
}

function exportDetail(){
	var length = $("#" + gridName).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert('提示',"列表数据为空");
		return;
	}
	
	if(length > exportMaxRow){
		$_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
		return;
	}
	location.href = contextPath +"/finance/storeBusiness/exportDetail?formId=" + formId;
}

