/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function() {
	// 开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	// 初始化列表
    initCashDailyGrid('cashier');

    //选择报表类型
	changeType();

});

function changeType(){
	$(".radioItem").change(function(){
    	var type = $(this).val();

        initCashDailyGrid(type);
        $("#cashDaily").datagrid("options").url = "";
        $("#cashDaily").datagrid('loadData', { total: 0, rows: [] });
        $('#cashDaily').datagrid({showFooter:false});

    	if (type=="cashier") {
			showCashier();
		} else if (type=="branch") {
			hideCashier();
		} else if (type=="date") {
			hideCashier();
		}
    	
    });
}

function showCashier(){
	$("#cashierNameOrCode").removeAttr("disabled");
	$("#cashierIdSelect").show();
}

function hideCashier(){
	$("#cashierId").val('');
	$("#cashierNameOrCode").val('');
	$("#cashierNameOrCode").attr("disabled","disabled");
	$("#cashierNameOrCode").attr("disabled","disabled");
	$("#cashierIdSelect").hide();
}

var gridHandel = new GridClass();
// 按收银汇总

function initCashDailyGrid(queryType) {
	gridHandel.setGridName("cashDaily");
	$("#cashDaily").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        url:'',
        //url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        //showFooter:true,
        pageSize : pageSize,
        showFooter:true,
        height:'100%',
        widht:'100%',
        columns: getCashDailyColumns(queryType),
		onBeforeLoad:function(data){
			gridHandel.setDatagridHeader("center");
//			updateFooter();
		}
    });
}


function getCashDailyColumns(queryType) {
    if (queryType ==="cashier") {
      return [[
          {field: 'branchCode', title: '机构编号', width: 100, align: 'left',rowspan:2,
              formatter:function(value,row,index){
                  if(!value || value == '合计'){
                      return '<div class="ub ub-pc ufw-b">合计</div> '
                  }
                  return row.branchCode;
              },
          },
          {field: 'branchName', title: '机构名称', width: 220, align: 'left',rowspan:2},
          {field: 'cashierCode', title: '收银员编号', width: 100, align: 'left',rowspan:2},
          {field: 'cashier', title: '收银员', width: 100, align: 'left',rowspan:2},
          {field: 'rmb', title: '现金', width: 120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'zer', title: '抹零', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'yhk', title: '银行卡', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field:'oneflag',title:'POS',width: '200px',align:'left',colspan:2},
          {field:'oneflag',title:'友门鹿商城',width:'200px',align:'left',colspan:2},

          {field: 'yqb', title: '云钱包', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'djq', title: '代金券', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'pdf', title: '平台垫付', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'pbt', title: '平台补贴', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'dxr', title: '店小二', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return getTwoDecimalB(parseFloat(value||0.00).toFixed(2));
              },
          },
          {field: 'zzt', title: 'HS深圳通', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'qt', title: '其他', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return getTwoDecimalB(parseFloat(value||0.00).toFixed(2));
              },
          },
          {field: 'total', title: '合计金额', width:120, align: 'right',rowspan:2,
              formatter : function(value, row,index) {
                  return getTwoDecimalB(parseFloat(value||0.00).toFixed(2));
              },
          }
      ],[
          {field: 'posZfb', title: '支付宝', width:100, align: 'right',

              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'posWzf', title: '微支付', width:100, align: 'right',
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'mallZfb', title: '支付宝', width:100, align: 'right',
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          },
          {field: 'mallWzf', title: '微支付', width:100, align: 'right',
              formatter : function(value, row,index) {
                  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
              },
          }
	  ]]
    } else if (queryType ==="branch") {
        return [[
            {field: 'branchCode', title: '机构编号', width:100, align: 'left', rowspan:2,
                formatter:function(value,row,index){
                    if(!value || value == '合计'){
                        return '<div class="ub ub-pc ufw-b">合计</div> '
                    }
                    return row.branchCode;
                },
            },
            {field: 'branchName', title: '机构名称', width:220, align: 'left',rowspan:2},
            {field: 'rmb', title: '现金', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'zer', title: '抹零', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'yhk', title: '银行卡', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'oneflag',title:'POS',width: '200px',align:'left',colspan:2},
            {field:'oneflag',title:'友门鹿商城',width:'200px',align:'left',colspan:2},

            {field: 'yqb', title: '云钱包', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'djq', title: '代金券', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'pdf', title: '平台垫付', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'pbt', title: '平台补贴', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'dxr', title: '店小二', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'zzt', title: 'HS深圳通', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'qt', title: '其他', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return getTwoDecimalB(parseFloat(value||0.00).toFixed(2));
                },
            },
            {field: 'total', title: '合计金额', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            }
        ],[
            {field: 'posZfb', title: '支付宝', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'posWzf', title: '微支付', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'mallZfb', title: '支付宝', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'mallWzf', title: '微支付', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            }
        ]]
    } else  {
        return [[
            {field: 'branchCode', title: '机构编号', width: 100, align: 'left', rowspan:2,
                formatter:function(value,row,index){
                    if(!value || value == '合计'){
                        return '<div class="ub ub-pc ufw-b">合计</div> '
                    }
                    return row.branchCode;
                },
            },
            {field: 'branchName', title: '机构名称', width: 220, align: 'left',rowspan:2},
            {field:'opDate',title:'操作日期',sortable:false,width:150,align: 'left',rowspan:2},
            {field: 'rmb', title: '现金', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'zer', title: '抹零', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'yhk', title: '银行卡', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'oneflag',title:'POS',width: '200px',align:'left',colspan:2},
            {field:'oneflag',title:'友门鹿商城',width:'200px',align:'left',colspan:2},

            {field: 'yqb', title: '云钱包', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'djq', title: '代金券', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'pdf', title: '平台垫付', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'pbt', title: '平台补贴', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'dxr', title: '店小二', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'zzt', title: 'HS深圳通', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'qt', title: '其他', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return getTwoDecimalB(parseFloat(value||0.00).toFixed(2));
                },
            },
            {field: 'total', title: '合计金额', width:120, align: 'right',rowspan:2,
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            }
        ],[
            {field: 'posZfb', title: '支付宝', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'posWzf', title: '微支付', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'mallZfb', title: '支付宝', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'mallWzf', title: '微支付', width:100, align: 'right',
                formatter : function(value, row,index) {
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            }
        ]]
    }
}

/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
		$("#branchCode").val(data.branchCode);
		$("#branchNameOrCode").val("["+data.branchCode+"]"+data.branchName);
	},"","");
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

/**
 * 导出
 */
function exportData(){
    var param = {
        datagridId:"cashDaily",
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/cashDaily/report/exportList"
    }

    publicExprotService(param);
}

//查询
function query(){
	$("#cashDaily").datagrid("options").url =  "";
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}
	
	var cashierNameOrCode = $("#cashierNameOrCode").val();
	if(cashierNameOrCode && cashierNameOrCode.indexOf("[")>=0 && cashierNameOrCode.indexOf("]")>=0){
		formData.cashierNameOrCode = null;
	}
    $('#cashDaily').datagrid({showFooter:true});
	$("#cashDaily").datagrid("options").queryParams = formData;
	$("#cashDaily").datagrid("options").method = "post";
	$("#cashDaily").datagrid("options").url =  contextPath+"/cashDaily/report/getList";
	$("#cashDaily").datagrid("load");
	
}
//合计
function updateFooter(){
    var fields = {rmb:0,zer:0,yhk:0,posZfb:0,posZfb:0,mallZfb:0,mallWzf:0,yqb:0,djq:0,pdf:0,pbt:0,dxr:0,total:0};
    var argWhere = {name:'isGift',value:''}
    gridHandel.updateFooter(fields,argWhere);
}

//打印
function printReport(){
	var queryType=$('input:radio[name="queryType"]:checked').val();

	var startTime = $("#txtStartDate").val();
	var endTime = $("#txtEndDate").val();
	var branchNameOrCode= $("#branchNameOrCode").val();
	var cashierId=$("#cashierId").val();
	parent.addTabPrint("reportPrint"+branchNameOrCode,"打印",contextPath+"/cashDaily/report/printReport?" +
			"queryType="+queryType+"&startTime="+startTime+"&endTime="+endTime+
			"&branchNameOrCode="+branchNameOrCode+"&cashierId="+cashierId);
}
/**
 * 重置
 */
var resetForm = function(){
	$("#queryForm")[0].reset();
};
