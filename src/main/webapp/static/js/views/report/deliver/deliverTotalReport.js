/**
 * Created by wxl on 2016/08/17.、
 * 配送汇总
 */
$(function() {
	//选择报表类型
	changeType();

	// 初始化列表
    initCashDailyGrid('goods');
	var s = $("#txtStartDate").val();
	if(!$("#txtStartDate").val()){
		// 开始和结束时间
		$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
		$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
		$('#categoryTypeDiv').hide();
		
	}else{
		$("input[name='queryType'][value=goods]").attr("checked",true); 
		$("input[name='queryType'][value=goods]").click();
	}

    //机构选择初始化 发货机构
    $('#sourceBranch').branchSelect({
        onAfterRender:function(data){
            $("#sourceBranchId").val(data.branchId);
        }

    });

    //机构选择初始化 要/收货机构
    $('#targetBranch').branchSelect({
        onAfterRender:function(data){
            $("#targetBranchId").val(data.branchId);
        }
    });

    //类别选择初始化
    $('#categorySelect').categorySelect({
        onAfterRender:function(data){
            $("#goodsCategoryId").val(data.goodsCategoryId);
            $("#categoryCode").val(data.categoryCode);
        }
    });

    setReadOnly("goods");

});
function changeType(){
	$(".radioItem").change(function(){
		var type_val = $(this).val();
        setReadOnly(type_val);
		$("#cashDaily").datagrid("options").url = "";
        initCashDailyGrid(type_val);
		if (type_val=="goods") {
			// 初始化列表按收银员汇总
			showCashier();
		} else if (type_val=="form") {
			hideCashier();
		} else if (type_val=="category") {
			// 初始化列表按日期汇总
			hideCashier();
		}else if(type_val=="branch"){
		}
		$("#cashDaily").datagrid('loadData', { total: 0, rows: [] });
    	$('#cashDaily').datagrid({showFooter:false});

	});
}

function  setReadOnly(type){
	
	$('#tarBranLabel').text('要货机构:');
	
    if (type=="goods") {
        // 初始化列表按收银员汇总

        $("#categoryName").removeAttr("readonly");
        $("#categoryName").removeClass("uinp-no-more");
        $('#categoryTypeDiv').hide();
        $("#skuCode").removeAttr("readonly");
        $("#skuCode").removeClass("uinp-no-more");
        $("#categoryType").attr("disabled","disabled");
        $("#formNo").attr("readonly","readonly");
        $("#formNo").addClass("uinp-no-more");
        $("#formNo").val("");

        $("#sourceBranchName").attr("readonly","readonly");
        $("#sourceBranchName").addClass("uinp-no-more");
        $("#sourceBranchName").val("");
        $("#sourceBranchId").val("");
        //2.6.7 bug20470
        $('#tarBranLabel').text('查询机构:');

    } else if (type=="form") {
        // 初始化列表按门店汇总
        $("#categoryName").attr("readonly","readonly");
        $("#categoryName").addClass("uinp-no-more");
        $('#categoryTypeDiv').hide();
        $("#skuCode").attr("readonly","readonly");
        $("#skuCode").addClass("uinp-no-more");
        $("#skuCode").val("");
        $("#categoryCode").val("");
        $("#categoryName").val("");

        $("#formNo").removeAttr("readonly");
        $("#formNo").removeClass("uinp-no-more");

        $("#sourceBranchName").removeAttr("readonly","readonly");
        $("#sourceBranchName").removeClass("uinp-no-more");
        $("#sourceBranchName").val("");
        $("#sourceBranchId").val("");

    } else if (type=="category") {
        $("#categoryName").removeAttr("readonly");
        $("#categoryName").removeClass("uinp-no-more");
        $('#categoryTypeDiv').show();
        $("#skuCode").attr("readonly","readonly");
        $("#skuCode").addClass("uinp-no-more");
        $("#skuCode").val("");
        $("#formNo").attr("readonly","readonly");
        $("#formNo").val("");
        $("#formNo").addClass("uinp-no-more");
        $("#categoryType").attr("disabled","disabled");

        $("#sourceBranchName").removeAttr("readonly","readonly");
        $("#sourceBranchName").removeClass("uinp-no-more");
        $("#sourceBranchName").val("");
        $("#sourceBranchId").val("");

    }else if(type=="branch"){
        $("#categoryName").attr("readonly","readonly");
        $("#categoryName").val("");
        $("#categoryName").addClass("uinp-no-more");
        $('#categoryTypeDiv').hide();
        $("#skuCode").attr("readonly","readonly");
        $("#skuCode").addClass("uinp-no-more");
        $("#skuCode").val("");
        $("#formNo").attr("readonly","readonly");
        $("#formNo").val("");
        $("#formNo").addClass("uinp-no-more");

        //2.6.7 bug20470
        $("#sourceBranchName").attr("readonly","readonly");
        $("#sourceBranchName").addClass("uinp-no-more");
        $("#sourceBranchName").val("");
        $("#sourceBranchId").val("");
        $('#tarBranLabel').text('查询机构:');

    }
}

function showCashier(){
	$("#cashierNameOrCode").removeAttr("disabled");
	$("#cashierIdSelect").show();
}

function hideCashier(){
	$("#cashierNameOrCode").val('');
	$("#cashierNameOrCode").attr("disabled","disabled");
	$("#cashierNameOrCode").attr("disabled","disabled");
	$("#cashierIdSelect").hide();
}

var gridHandel = new GridClass();
var gridName = "cashDaily";

function initCashDailyGrid(type) {
    gridHandel.setGridName("cashDaily");
    $("#cashDaily").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        //url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        pageSize : 50,
        height:'100%',
        width:'100%',
        columns:getColumnsfield(type),
        onBeforeLoad:function () {
            gridHandel.setDatagridHeader("center");
        }
	})
    if(hasDistributionPrice==false){
        priceGrantUtil.grantDistributionPrice(gridName,["receiveAmount","dealAmount","sumAmount","amount"])
    }
}

function getColumnsfield(type_val) {
    if (type_val=="goods") {//按商品汇总
        return [[

            {field: 'skuCode', title: '货号', width:'55px', align: 'left',
                formatter : function(value, row,index) {
                    var str = value;
                    if(row.isFooter){
                        str ='<div class="ub ub-pc ufw-b">合计</div> '
                    }
                    return str;
                }
            },
            {field: 'skuName', title: '商品名称', width:'185px', align: 'left'},
            {field: 'barCode', title: '条码', width:'100px', align: 'left'},
            {field: 'receiveLargeNum', title: '调入箱数', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'receiveNum', title: '调入数量', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'receiveAmount', title: '调入金额', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'dealLargeNum', title: '调出箱数', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'dealNum', title: '调出数量', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'dealAmount', title: '调出金额', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },

            {field: 'sumNum', title: '数量小计', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'sumAmount', title: '金额小计', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'categoryCode', title: '类别编号', width:'56px', align: 'left'},
            {field: 'categoryName', title: '类别', width:'65px', align: 'left'},
            {field: 'spec', title: '规格', width:'45px', align: 'left'},
            {field: 'unit', title: '单位', width:'45px', align: 'left'}
        ]]
    } else if (type_val=="form") {
        return [[
            {field: 'formNo', title: '单据编号', width:'130px', align: 'left',
                formatter:function(value,row,index){
                    if(row.formId){
                        var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.formId+'")';
                        return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                    }else{
                        return '<div class="ub  ufw-b">合计</div>';
                    }
                }
            },
            {field: 'sourceBranchCode', title: '发货机构编码', width:'80px', align: 'left'},
            {field: 'sourceBranchName', title: '发货机构', width:'86px', align: 'left'},
            {field: 'targetBranchCode', title: '要货机构编码', width:'80px', align: 'left'},
            {field: 'targetBranchName', title: '要货机构', width:'80px', align: 'left'},
            {field: 'referenceNo', title: '引用单号', width:'135px', align: 'left',
                formatter:function(value,row,index){
                    if(row.formId){
                        var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.referenceId+'")';
                        return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
                    }else{
                        return '';
                    }
                }
            },
            {field: 'statusName', title: '单据状态', width:'60px', align: 'center' },
            {field: 'status', title: '状态', width:120, align: 'right',hidden:true},

            {field: 'num', title: '数量', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'amount', title: '金额', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'validTime', title: '审核日期', width:'115px', align: 'left',
                formatter : function(value, rowData, rowIndex) {
                    return formatDate(value,'yyyy-MM-dd');
                }
            },
            {field: 'remark', title: '备注', width:'100px', align: 'left'}
        ]]
    } else if (type_val=="category") {
        // 初始化列表按日期汇总
        return [[
            {field: 'categoryCode', title: '类别编号', width:'56px', align: 'left'},
            {field: 'categoryName', title: '类别', width:'65px', align: 'left'},
            {field: 'receiveNum', title: '调入数量', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'receiveAmount', title: '调入金额', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'dealNum', title: '调出数量', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'dealAmount', title: '调出金额', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },

            {field: 'sumNum', title: '数量小计', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'sumAmount', title: '金额小计', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            }
        ]]
    }else if(type_val=="branch"){
        return [[
            {field: 'branchCode', title: '往来机构编码', width:'80px', align: 'left'},
            {field: 'branchName', title: '往来机构名称', width:'220px', align: 'left'},
            {field: 'receiveNum', title: '调入数量', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'receiveAmount', title: '调入金额', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'dealNum', title: '调出数量', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'dealAmount', title: '调出金额', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },

            {field: 'sumNum', title: '数量小计', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field: 'sumAmount', title: '金额小计', width:'80px', align: 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            }
        ]]
    }
}

/**
 * 收银员下拉选
 */
function searchCashierId(){
	new publicOperatorService(function(data){
		$("#cashierId").val(data.id);
		$("#cashierNameOrCode").val("["+data.userCode+"]"+data.userName);
	});

}

function clearBranchCode(){
	var branchNameOrCode = $("#branchNameOrCode").val();

	//如果修改名称
	if(!branchNameOrCode || 
			(branchNameOrCode && branchNameOrCode.indexOf("[")<0 && branchNameOrCode.indexOf("]")<0)){
		$("#branchCode").val('');
	}
}

function clearCashierId() {
	var cashierNameOrCode = $("#cashierNameOrCode").val();

	// 如果修改名称
	if (!cashierNameOrCode || 
			(cashierNameOrCode && cashierNameOrCode.indexOf("[") < 0 && cashierNameOrCode.indexOf("]") < 0)) {
		$("#cashierId").val('');
	}
}

var dg;
/**
 * 导出
 */
function exportData(){
    var formData = $("#queryForm").serializeObject();
    // 去除编码
    formData.targetBranchName = "";
    formData.sourceBranchName = "";
    formData.categoryCode = formData.categoryCode.substring(formData.categoryCode.lastIndexOf(']')+1);
    $('#categoryCode').val(formData.categoryCode);

    var param = {
        datagridId:gridName,
        formObj:$("#queryForm").serializeObject(),
        url: contextPath + "/report/deliverTotalReport/exportDeliverExcel"
    }
    publicExprotService(param);

}


//查询
function query(){
	var formData = $("#queryForm").serializeObject();
	
	var queryType = $("input[name='queryType']:checked").val();
	if(queryType == 'goods' || queryType == 'branch'){
        var branchId = $("#targetBranchId").val() || $("#branchId").val();
		if(!$.trim(branchId)){
			$_jxc.alert("请选择查询机构");
			return;
		}
	}
	// 去除编码
    // formData.branchName = formData.branchName.substring(formData.branchName.lastIndexOf(']')+1)
    formData.categoryCode = formData.categoryCode.substring(formData.categoryCode.lastIndexOf(']')+1)
    
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}

	var cashierNameOrCode = $("#cashierNameOrCode").val();
	if(cashierNameOrCode && cashierNameOrCode.indexOf("[")>=0 && cashierNameOrCode.indexOf("]")>=0){
		formData.cashierNameOrCode = null;
	}
	$("#cashDaily").datagrid("options").url = '';
	$('#cashDaily').datagrid({showFooter:true});
	$("#cashDaily").datagrid("options").queryParams = formData;
	$("#cashDaily").datagrid("options").method = "post";
	$("#cashDaily").datagrid("options").url =  contextPath+"/report/deliverTotalReport/reportListPage";
	$("#cashDaily").datagrid("load");

}
//合计
function updateFooter(){
	var fields = {isFooter:1,receiveLargeNum:0,receiveNum:0,receiveAmount:0,dealLargeNum:0,dealNum:0,dealAmount:0,sumNum:0,sumAmount:0,num:0,amount:0};
	var argWhere = {name:'isGift',value:''}
	gridHandel.updateFooter(fields,argWhere);
}

var branchId;

/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
//		$("#branchId").val(data.branchesId);
		//$("#branchName").val(data.branchName);
        $("#branchName").val("["+data.branchCode+"]"+data.branchName);
	},'BF','');
}


//打印
function printReport(){
	var queryType = $("input[name='queryType']").val();
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchId= $("#branchId").val();
	var cashierId=$("#cashierId").val();
	parent.addTabPrint("reportPrint"+branchId,"打印",contextPath+"/cashDaily/report/printReport?" +
			"queryType="+queryType+"&startDate="+startDate+"&endDate="+endDate+
			"&branchId="+branchId+"&cashierId="+cashierId);
	//window.open(contextPath+"/cashDaily/report/printReport");
}
/**
 * 重置
 */
var resetForm = function(){
	$("#queryForm").form('clear');
	$("#formType").combobox("setText","全部");
	$("#categoryType").combobox("setText","小类");
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	$('input:radio[name=queryType]')[0].checked = true;
	$("input[name='categoryType'][value=smallCategory]").click();
};
