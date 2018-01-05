/**
 * Created by zhaoly on 2017/5/26.
 */

var costTitle = '开店成本(均摊含折旧)';
$(function () {
    initGridMonthAnalysis();
    $("#txtStartDate").val(dateUtil.getPreMonthDate().format("yyyy-MM"));
    $("#txtEndDate").val(dateUtil.getPreMonthDate().format("yyyy-MM"));
    changeStatus();
})

//单据状态切换
function changeStatus(){
    $(".radioItem.costType").change(function(){
        if($(this).val() === "0"){
            costTitle = '开店成本(均摊含折旧)';
        }else{
            costTitle = '开店成本(均摊不含折旧)';
        }
        $("#"+gridName).datagrid('loadData', { total: 0, rows: [] });
        $("#"+gridName).datagrid("options").url = "";
        initGridMonthAnalysis();
        $('#'+gridName).datagrid('reloadFooter',[]);
        //queryMonthAnalysis();
    });
}

var gridName = "gridMonthAnalysis";
var gridHandel = new GridClass();
var dg = null;
function initGridMonthAnalysis() {
    gridHandel.setGridName(gridName);
    dg = $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        pagination:true,    //分页
        pageSize:50,
        showFooter:true,
        singleSelect:true,
        height:'100%',
        width:'100%',
        fitColumns:true,    //每列占满
        columns:[[
            {field:'branchCode',title:'机构编码',width:"80px",align:'left'},
            {field:'branchName',title:'机构名称',width:"150px",align:'left'},
            {field:'parentName',title:'所属分公司',width:"150px",align:'left'},
            {field:'monthStr',title:'月份',width:"80px",align:'left'},
            {field:'bepMonth',title:'月盈亏平衡点',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if((parseFloat(value) != 0) &&(value == null || typeof value == 'undefined' || value == '') ){
                        return '';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'profitLossAmount',title:'盈亏金额',width:"100px",align:'right',
            	formatter : function(value, row, index) {
            		if((parseFloat(value) != 0) &&(value == null || typeof value == 'undefined' || value == '') ){
            			return '';
            		}
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	},
            },
            {field:'bepDay',title:'日盈亏平衡点',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if((parseFloat(value) != 0) &&(value == null || typeof value == 'undefined' || value == '') ){
                        return '';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'totalAmount',title:'商品销售金额',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'costAmount',title:'商品销售成本',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'grossProfitRateStr',title:'毛利率(%)',width:"80px",align:'right',
                formatter : function(value, row, index) {
                    if((parseFloat(value) != 0) &&(value == null || typeof value == 'undefined' || value == '') ){
                        return '';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'monthCost',title:'每月成本小计',width:"80px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'fixedTotalAmount',title:'开店总成本',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'fixedAvgAmount',title:costTitle,width:"150px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'monthChargeAmount',title:'每月经营成本',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            
            {field:'materielAmount',title:'物料领用金额',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'faultyAmount',title:'报损金额',width:"100px",align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'standard',title:'是否达标',width:"80px",align:'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
    });
}

/**
 * 机构名称
 */
function selectListBranches(){
    new publicAgencyService(function(data){
        $("#branchId").val(data.branchesId);
        $("#branchCompleCode").val(data.branchCompleCode);
        $("#branchCodeName").val("["+data.branchCode+"]" + data.branchName);
    },'BF','');
}


function queryMonthAnalysis() {
	//搜索需要将左侧查询条件清除
	$("#startCount").val('');
	$("#endCount").val('');
    $("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").url = contextPath+'/report/bepMonthAnalysis/getList';
    $("#"+gridName).datagrid("load");
}


/**
 * 导出
 */
function exportData(){
	var length = $("#"+gridName).datagrid('getData').rows.length;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	$('#exportWin').window({
		top:($(window).height()-300) * 0.5,   
	    left:($(window).width()-500) * 0.5
	});
	$("#exportWin").show();
	$("#totalRows").html(dg.datagrid('getData').total);
	$("#exportWin").window("open");
}

// 调用导出方法
function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");

	$("#queryForm").attr("action",contextPath+"/report/bepMonthAnalysis/exportExcelList");
	$("#queryForm").submit();
}

function toChangeDate(index,fmt){
	if(typeof fmt === "undefined"){
		fmt = "yyyy-MM-dd"
	}
	
    switch (index){
        case 4: //本月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentMonth()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format(fmt));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousMonth()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousMonth()[1]).format(fmt));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentSeason()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousMonth()[1]).format(fmt));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousSeason()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousSeason()[1]).format(fmt));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentYear()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousMonth()[1]).format(fmt));
            break;

        default :
            break;
    }
}
