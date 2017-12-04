/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function(){
    //开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
  
    //初始化列表
    initDateGrid();
});

var gridHandel = new GridClass();
var dg;
function initDateGrid() {
	dg = $("#tabList").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        pageSize : pageSize,
        height:'100%',
        columns: [[
            {field: 'branchCode', title: '店铺编号', width:100, align: 'left'},
            {field: 'branchName', title: '店铺名称', width: 150, align: 'left',},
            {field: 'orderNo', title: '订单号', width: 150, align: 'left'},
            {field: 'skuCode', title: '货号', width: 100, align: 'left'},
            {field: 'skuName', title: '商品名称', width: 150, align: 'left'},
            {field: 'barCode', title: '条码', width: 100, align: 'left'},
			{field: 'oneCategoryName', title: '商品大类', width: 80, align: 'left'},
            {field: 'categoryName', title: '商品小类', width: 80, align: 'left'},
            {field: 'spec', title: '规格', width: 80, align: 'left'},
            {field: 'unit', title: '单位', width: 80, align: 'left'},
            {field: 'saleNum', title: '数量', width: 80, align: 'right',formatter : function(value){
            	if(value){
            		value = parseFloat(value);
            		return '<b>'+value.toFixed(2)+'</b>';
            	}
            	return "<b>0.00</b>";
            }},
            {field: 'originalPrice', title: '原价', width: 80, align: 'right',
            	formatter : function(value) {
            		if(value!=null){
            			return '<b>'+parseFloat(value||0.00).toFixed(2)+'</b>';
            		}
				},
            },
            {field: 'salePrice', title: '销售价', width: 80, align: 'right',
            	formatter : function(value) {
            		if(value!=null){
            			return '<b>'+parseFloat(value||0.00).toFixed(2)+'</b>';
            		}
				},
            },
            {field: 'saleAmount', title: '销售金额', width: 80, align: 'right',formatter : function(value){
            	if(value){
            		value = parseFloat(value);
            		return '<b>'+value.toFixed(2)+'</b>';
            	}
            	return "<b>0.00</b>";
            }},
            {field: 'discountAmount', title: '让利金额', width: 80, align: 'right',formatter : function(value){
    			if(value){
    				value = parseFloat(value);
    				return '<b>'+value.toFixed(2)+'</b>';
    			}
    			return "<b>0.00</b>";
    		}},
    		{field: 'activityTypeName', title: '活动类型', width: 100, align: 'left'},
			{field: 'userName', title: '收银员', width: 100, align: 'left'},
			{field: 'completeTime', title: '操作时间', width: 120, align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}},
    		{field: 'activityCode', title: '活动编号', width: 150, align: 'left'},
    		{field: 'activityName', title: '活动名称', width: 150, align: 'left'},
    		{field: 'ticketNo', title: '小票号', width: 160, align: 'left'}
        ]]
    });
    gridHandel.setDatagridHeader("center");
}

//查询
function query(){
	$("#startCount").val('');
	$("#endCount").val('');
	getCheckBoxValue();
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}
	$("#tabList").datagrid("options").queryParams = formData;
	$("#tabList").datagrid("options").method = "post";
	$("#tabList").datagrid("options").url = contextPath+"/activity/goods/getList";
	$("#tabList").datagrid("load");
}

//获取复选框选中值
function getCheckBoxValue(){
	//选择所有name="activityType"的对象，返回数组   
   var obj = document.getElementsByName("activityType1"); 
   var val='';//如果这样定义var s;变量s中会默认被赋个null值
   for(var i=0;i<obj.length;i++){
       if(i>0){
    	  if(obj[i].checked) //取到对象数组后，我们来循环检测它是不是被选中
    	  val+=obj[i].value+',';   //如果选中，将value添加到变量s中    
       } 
   }
	$("#activityType").val(val);
}

//全选或全不选
function selectedAll() {  
	/* teleCheckbox为复选框的name属性值 */ 
    var allsel = document.getElementsByName("activityType1");
    var isState = allsel[0].checked;
    console.log(isState);
    for ( var i = 0; i < allsel.length; i++) { 
    	allsel[i].checked = isState;
    }  
}  
function selectedTypeItem(){
	var allsel = document.getElementsByName("activityType1");
	var val =0;
	for ( var i = 0; i < allsel.length; i++) {
		if(i>0){
			val = allsel[i].checked?val+1:val;
		}
    }
	if(val==allsel.length-1){
		allsel[0].checked = true;
	}else{
		allsel[0].checked = false;
	}
}


//改变日期
function changeDate(index){
    switch (index){
        case 0: //今天
            $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            $("#txtEndDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            break;
        case 2: //本周
            $("#txtStartDate").val(dateUtil.getCurrentWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 3: //上周
            $("#txtStartDate").val(dateUtil.getPreviousWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousWeek()[1].format("yyyy-MM-dd"));
            break;
        case 4: //本月
            $("#txtStartDate").val(dateUtil.getCurrentMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.getPreviousMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousMonth()[1].format("yyyy-MM-dd"));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.getCurrentSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.getPreviousSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousSeason()[1].format("yyyy-MM-dd"));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.getCurrentYear()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        default :
            break;
    }
}

/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
		$("#branchNameOrCode").val(data.branchName);
	},"","");
}


/**
 * 导出
 */
function exportData(){
	var length = $('#tabList').datagrid('getData').rows.length;
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

function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");
	getCheckBoxValue();
	$("#queryForm").attr("action",contextPath+"/activity/goods/exportList");
	$("#queryForm").submit();
}


/**
 * 重置
 */
var resetForm = function(){
	 $("#queryForm").form('clear');
	 $("#branchCode").val('');
};
