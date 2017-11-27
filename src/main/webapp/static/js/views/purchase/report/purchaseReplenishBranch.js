/**
 * Created by wxl on 2016/08/17.
 * 采购明细查询
 */
$(function() {
	// 开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	initPurReportDetailGrid();
	
	//供应商选择初始化
	$('#supplierComponent').supplierSelect({
		param:{
			saleWayNot:"purchase"
		},
		//数据过滤
		loadFilter:function(data){
			data.supplierId = data.id;
			return data;
		}
	});
	
	//机构选择初始化
    $('#targetBranch').branchSelect({
    	param:{
    		// 只允许分公司
			branchTypesStr: $_jxc.branchTypeEnum.BRANCH_COMPANY
		}
    });
	
});
var gridHandel = new GridClass();
/**
 * 单据类型
 * @param newV
 * @param oldV
 */
function onChangeFormType(newV,oldV){
	$("#formType").combobox("setValue",newV);
}

var gridHandel = new GridClass();
/**
 * 初始化表格
 * @param queryType
 */
var dg;
var gridName= "purReportDetail";
function initPurReportDetailGrid(queryType) {
	gridHandel.setGridName("purReportDetail");
    dg= $("#purReportDetail").datagrid({
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
        showFooter:true,
        height:'100%',
        columns: [[
			{field: 'skuCode', title: '货号', width:85, align: 'left',
            	formatter : function(value, row,index) {
                    var str = value;
                    if($_jxc.isStringNull(str)){
                        str ='<div class="ub ub-pc ufw-b">合计</div> '
                    }
                    return str;
                }
            },
            {field: 'skuName', title: '商品名称', width:185, align: 'left'},
            {field: 'barCode', title: '条码', width:130, align: 'left'},
            {field: 'spec', title: '规格', width:45, align: 'left'},
            {field: 'unit', title: '单位', width:45, align: 'left'},
			{field: 'costPrice', title: '成本价', width:80, align: 'right',
				formatter:function(value,row,index){
					if($_jxc.isStringNull(value)){
						return '';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				}
			},
			{field: 'stockNum', title: '库存数量', width:120, align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				}
			},
			{field: 'stockAmount', title: '库存金额', width:120, align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				}
			},
			{field: 'saleNum', title: '销售数量', width:120, align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				}
			},
			{field: 'suggestNum', title: '建议进货数量', width:80, align: 'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				}
			},
            {field: 'purchaseSpec', title: '进货规格', width:55, align: 'left'},
            {field: 'distributionSpec', title: '配送规格', width:55, align: 'left'},
			{field: 'supplierName', title: '供应商名称', width: 155, align: 'left'},
            {field: 'categoryName', title: '类别名称', width:95, align: 'left'}
        ]],
        onBeforeLoad:function () {
            gridHandel.setDatagridHeader("center");
        },
		onLoadSuccess:function(data){
		}
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(gridName,["costPrice","stockAmount"])
    }
}

/**
 * 查询
 */
function purchaseDetailCx(){
	//机构日期不能为空
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	if(!(startDate && endDate)){
		$_jxc.alert('日期不能为空');
		return ;
	}
	var formData = $("#queryForm").serializeObject();
	
	$("#purReportDetail").datagrid("options").queryParams = formData;
	$("#purReportDetail").datagrid("options").method = "post";
	$("#purReportDetail").datagrid("options").url =  contextPath+"/purchase/report/replenishAnaly/reportList";
	$("#purReportDetail").datagrid("load");
}


/**
 * 导出
 */
function exportDetails(){
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	if(!(startDate && endDate)){
		$_jxc.alert('日期不能为空');
		return ;
	}

    var param = {
        datagridId:"purReportDetail",
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/purchase/report/replenishAnaly/exportList"
    }
    publicExprotService(param);
}


/**
 * 商品类别 直接传的类别中文名称查的
 */
function searchCategory(){
	new publicCategoryService(function(data){
		$("#categoryCode").val(data.categoryName);
	});
}
/**
 * 重置
 */
var resetForm = function(){
	location.href=contextPath+"/report/purchase/getDgStockAnalysisList";
};