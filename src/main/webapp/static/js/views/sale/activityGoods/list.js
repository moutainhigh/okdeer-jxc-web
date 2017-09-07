/**
 * Created by wxl on 2016/08/17.
 * 促销方案明细
 */
$(function() {
    // 开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	//选择报表类型
	initActivityCX();

	//促销类型 change 事件
	$("input[name='queryType']").on('change',function(){
		cxType = $(this).val();
		//类别 启用类别选择
		$("#categoryName").prop('disabled',cxType == 'goods'?true:false);
		//类别 禁用货号
		$("#codeKeyWord").prop('disabled',cxType == 'category'?true:false);
		//类别 禁用商品名称
		$("#skuName").prop('disabled',cxType == 'category'?true:false);
		
		$("#"+datagridID).datagrid("options").url =  '';

		if(cxType == "fullGive"){
            onChangeSelect();
		}else{
            priceVal = "4";
            initActivityCX();
		}

        $("#"+datagridID).datagrid("loadData",[]);
	})
	
	$('#branchSelectCom').branchSelect()

});
var priceVal = "4";
function onChangeSelect() {
    priceVal=$("#fullGiveType").combobox('getValue');
    initActivityCX();
    $("#"+datagridID).datagrid("loadData",[]);
}

function columnList(){
    if(priceVal == "1"){
        return [[
            {field: 'branchName', title: '活动店铺', width:120, align: 'left'},
            {field: 'activityTypeStr', title: '活动类型', width:120, align: 'center',},
            {field: 'skuCode', title: '货号', width:100, align: 'left',},
            {field: 'skuName', title: '商品名称', width:150, align: 'left'},
            {field: 'barCode', title: '条码', width:120, align: 'left'},
            {field: 'spec', title: '规格', width:50, align: 'left'},
            {field: 'unit', title: '单位', width:50, align: 'center'},
            {field: 'activityCode', title: '活动编号', width:160, align: 'left',
                formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.activityId+'\')">' + value + '</a>';
                    return strHtml;
                }
            },
            {field: 'activityCode', title: '赠品信息', width:160, align: 'left',
                formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.activityId+'\')">' + 赠品信息 + '</a>';
                    return strHtml;
                }
            },
            {field: 'startTime', title: '开始日期', width:140, align: 'left'},
            {field: 'endTime', title: '结束日期', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            },
            {field: 'startTime', title: '活动时段', width:140, align: 'left'},
            {field: 'fullMoney', title: '买满金额', width:80, align: 'right',
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'fullMoney', title: '买满数量', width:80, align: 'right',
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'createUserName', title: '促销商品是否参与', width:100, align: 'left'},
            {field: 'createUserName', title: '是否倍数送', width:100, align: 'left'},
            {field: 'createUserName', title: '是否会员独享', width:100, align: 'left'},

            {field: 'createUserName', title: '制单人', width:100, align: 'left'},
            {field: 'validUserName', title: '审核人', width:120, align: 'left'},
            {field: 'validTime', title: '审核时间', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            }
        ]];
    }else if(priceVal == "2"){
        return [[
            {field: 'branchName', title: '活动店铺', width:120, align: 'left'},
            {field: 'activityTypeStr', title: '活动类型', width:120, align: 'center'},
            {field: 'goodCategoryCode', title: '类别编码', width:100, align: 'left'},
            {field: 'goodCategoryCode', title: '类别名称', width:100, align: 'left'},
            {field: 'activityCode', title: '活动编号', width:160, align: 'left',
                formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.activityId+'\')">' + value + '</a>';
                    return strHtml;
                }
            },
            {field: 'activityCode', title: '赠品信息', width:160, align: 'left',
                formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.activityId+'\')">' + 赠品信息 + '</a>';
                    return strHtml;
                }
            },
            {field: 'startTime', title: '开始日期', width:140, align: 'left'},
            {field: 'endTime', title: '结束日期', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            },
            {field: 'startTime', title: '活动时段', width:140, align: 'left'},
            {field: 'fullMoney', title: '买满金额', width:80, align: 'right',
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'fullMoney', title: '买满数量', width:80, align: 'right',
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'createUserName', title: '促销商品是否参与', width:100, align: 'left'},
            {field: 'createUserName', title: '是否倍数送', width:100, align: 'left'},
            {field: 'createUserName', title: '是否会员独享', width:100, align: 'left'},

            {field: 'createUserName', title: '制单人', width:100, align: 'left'},
            {field: 'validUserName', title: '审核人', width:120, align: 'left'},
            {field: 'validTime', title: '审核时间', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            }
        ]];
    }else if(priceVal == "3"){
        return [[
            {field: 'branchName', title: '活动店铺', width:120, align: 'left'},
            {field: 'activityTypeStr', title: '活动类型', width:120, align: 'center'},
            {field: 'activityCode', title: '活动编号', width:160, align: 'left',
                formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.activityId+'\')">' + value + '</a>';
                    return strHtml;
                }
            },
            {field: 'activityCode', title: '赠品信息', width:160, align: 'left',
                formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.activityId+'\')">' + 赠品信息 + '</a>';
                    return strHtml;
                }
            },
            {field: 'startTime', title: '开始日期', width:140, align: 'left'},
            {field: 'endTime', title: '结束日期', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            },
            {field: 'startTime', title: '活动时段', width:140, align: 'left'},
            {field: 'fullMoney', title: '买满金额', width:80, align: 'right',
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'fullMoney', title: '买满数量', width:80, align: 'right',
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'createUserName', title: '促销商品是否参与', width:100, align: 'left'},
            {field: 'createUserName', title: '是否倍数送', width:100, align: 'left'},
            {field: 'createUserName', title: '是否会员独享', width:100, align: 'left'},

            {field: 'createUserName', title: '制单人', width:100, align: 'left'},
            {field: 'validUserName', title: '审核人', width:120, align: 'left'},
            {field: 'validTime', title: '审核时间', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            }
        ]];
    }else{
        return [[
            {field: 'branchName', title: '活动店铺', width:120, align: 'left'},
            {field: 'activityTypeStr', title: '活动类型', width:120, align: 'center',hidden:cxType != 'fullReduction'?false:true},
            {field: 'activityScopeStr', title: '满减类型', width:120, align: 'center',hidden:cxType == 'fullReduction'?false:true},
            {field: 'goodCategoryName', title: '商品类别', width:120, align: 'center',hidden:cxType != 'goods'?false:true},
            {field: 'goodCategoryCode', title: '类别编码', width:100, align: 'left',hidden:cxType == 'category'?false:true},
            {field: 'skuCode', title: '货号', width:100, align: 'left',hidden:cxType != 'category'?false:true},
            {field: 'skuName', title: '商品名称', width:150, align: 'left',hidden:cxType != 'category'?false:true},
            {field: 'barCode', title: '条码', width:120, align: 'left',hidden:cxType != 'category'?false:true},
            {field: 'spec', title: '规格', width:50, align: 'left',hidden:cxType == 'goods'?false:true},
            {field: 'unit', title: '单位', width:50, align: 'center',hidden:cxType == 'goods'?false:true},
            {field: 'activityCode', title: '活动编号', width:160, align: 'left',
                formatter:function(value,row,index){
                    var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看促销管理详细\',\''+contextPath+'/sale/activity/edit?activityId='+row.activityId+'\')">' + value + '</a>';
                    return strHtml;
                }
            },
            {field: 'activityDiscount', title: '折扣', width:80, align: 'right',hidden:cxType == 'category'?false:true,
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'salePrice', title: '售价', width:80, align: 'right',hidden:cxType == 'goods'?false:true,
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'fullMoney', title: '买满金额', width:80, align: 'right',hidden:cxType == 'fullReduction'?false:true,
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'yhMoney', title: '优化金额', width:80, align: 'right',hidden:cxType == 'fullReduction'?false:true,
                formatter:function(value,row,index){
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
                }
            },
            {field: 'activityPlan', title: '促销方案', width:80, align: 'right',hidden:cxType == 'goods'?false:true,
                formatter:function(value,row,index){
                    var str = "";
                    if(isNaN(value)){
                        str = '<b>'+value+'</b>';
                    }else{
                        str = '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return str;
                }
            },
            {field: 'startTime', title: '开始时间', width:140, align: 'left'},
            {field: 'endTime', title: '结束时间', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            },

            {field: 'createUserName', title: '制单人', width:100, align: 'left'},
            {field: 'validUserName', title: '审核人', width:120, align: 'left'},
            {field: 'validTime', title: '审核时间', width:140, align: 'left',
                formatter:function(value,row,index){
                    return formatDate(value);
                }
            }
        ]];
	}




}

var datagridID = 'activityCXList';
var gridHandel = new GridClass();

var cxType = 'goods';//促销类型 商品促销    category-类别    fullReduction-满减


/**
 * 初始化表格按  商品
 * @param queryType
 */
function initActivityCX() {
	gridHandel.setGridName("#"+datagridID);
   dg =  $("#"+datagridID).datagrid({
        method: 'post',
        align: 'center',
        //url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: true,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
//        fitColumns:true,    //占满
        showFooter:true,
        pageSize : 50,
        pageList : [20,50,100],//可以设置每页记录条数的列表
        showFooter:true,
        height:'100%',
        columns: columnList(),
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });
  
}



/**
 * 查询
 */
function purchaseTotalCx(){
	$("#startCount").val('');
	$("#endCount").val('');
	var formData = $("#queryForm").serializeObject();
	$("#"+datagridID).datagrid("options").url = "";
	$("#"+datagridID).datagrid({showFooter:true});
	$("#"+datagridID).datagrid("options").queryParams = formData;
	$("#"+datagridID).datagrid("options").method = "post";
	$("#"+datagridID).datagrid("options").url =  contextPath+"/sale/activityDetailReport/reportListPage";
	$("#"+datagridID).datagrid("load");
}

/**
 * 导出
 */
function exportData(){
	var length = $("#"+datagridID).datagrid('getData').total;
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
/**
 * 导出
 */
function exportExcel(){
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchName = $("#branchName").val();
	var branchCompleCode = $("#branchCompleCode").val();
	var categoryType=$('input[name="searchType"]:checked ').val();
	if(!(startDate && endDate)){
		$_jxc.alert('日期不能为空');
		return ;
	}
	
	var length = $("#"+datagridID).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	if(length>10000){
		$_jxc.alert("当次导出数据不可超过1万条，现已超过，请重新调整导出范围！");
		return;
	}
	$("#queryForm").attr("action",contextPath+'/sale/activityDetailReport/exportExcelList');
	$("#queryForm").submit();	
}
/**
 * 商品类别
 */
function searchCategory(){
	if($("#categoryName").prop('disabled'))return;
	new publicCategoryService(function(data){
		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val('['+data.categoryCode+']'+data.categoryName);
	});
}
/**
 * 重置
 */
var resetForm = function(){
	location.href=contextPath+"/report/purchase/total";
	
};