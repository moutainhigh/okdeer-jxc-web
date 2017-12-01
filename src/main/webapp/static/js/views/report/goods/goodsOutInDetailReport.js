$(function(){
	//开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30)+" 00:00");
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd")+" 23:59");
   /* initDatagridRequire();*/
	 // 初始化表格
	publicGpeGridColumns({
		onLoadSuccess:function(columns,frozenColumns){
			initDatagridRequire(columns,frozenColumns);
		}
	});

    //机构选择初始化 收货机构
    $('#regBranch').branchSelect({
        param:{
            formType:"BF"
        },
        onAfterRender:function(data){
            $("#branchCompleCode").val(data.branchCompleCode);
            //$("#targetBranchName").val("["+data.branchCode+"]"+data.branchName)
        }
    });

    //供应商组件初始化
    $('#supplierSelect').supplierSelect({
        loadFilter:function(data){
            data.supplierId = data.id;
            return data;
        }
    })
    // 初始化
    initCombotree('fType',dataItems,"");
});

var dataItems = [
			{"text": "全部","id": "ALL",iconCls:"combotree-p",
				children:[
                {"text": "采购收货","id": "PI",iconCls:"combotree-c"},
                {"text": "采购退货","id": "PR",iconCls:"combotree-c"},
                {"text": "配送入库","id": "DI",iconCls:"combotree-c"},
                {"text": "配送出库","id": "DO",iconCls:"combotree-c"},
                {"text": "销售","id": "XS",iconCls:"combotree-c"},
                {"text": "销售退货","id": "XT",iconCls:"combotree-c"},
                {"text": "库存调整","id": "IO",iconCls:"combotree-c"},
                {"text": "礼品兑换","id": "LP",iconCls:"combotree-c"},
                {"text": "组合拆分","id": "IX",iconCls:"combotree-c"},
                {"text": "报损单","id": "ID",iconCls:"combotree-c"},
                {"text": "领用单","id": "IU",iconCls:"combotree-c"},
                {"text": "盘点单","id": "PD",iconCls:"combotree-c"},
                {"text": "直送收货","id": "PM",iconCls:"combotree-c"},
                {"text": "成本调价","id": "IP",iconCls:"combotree-c"},
			]},
        ];



var gridHandel = new GridClass();
//初始化表格
function initDatagridRequire(columns,frozenColumns){
	gridHandel.setGridName("goodsOutInDetail");
	dg = $("#goodsOutInDetail").datagrid({
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        pageSize:50,
		height:'100%',
		width:'100%',
		columns : columns,
        frozenColumns : frozenColumns,
        onBeforeLoad:function(param){
        	gridHandel.setDatagridHeader("center");
        }
        
    });
    var param = {
        wholesalePrice:["wholesalePrice"],
        purchasePrice:["purchasePrice","price","priceAmount"],
        distributionPrice:["distributionPrice"],
        costPrice:["costPrice","costAmount","untaxedCostPrice","untaxedCostAmount"],
        vipPrice:["vipPrice"],
        salePrice:["salePrice","saleAmount"],
    }
	priceGrantUtil.grantPrice("goodsOutInDetail",param);

   // queryForm();
}
//查询入库单
function queryForm(){
    $("#startCount").val('');
    $("#endCount").val('');

    // 赋值单据类型选择
    var formTypes = $("#fType").combotree('getValues');
    if(formTypes.indexOf("ALL")>-1){
        $("#formTypes").val("");
    }else {
        $("#formTypes").val($("#fType").combotree('getValues'));
    }

	var fromObjStr = $('#queryForm').serializeObject();
	$("#goodsOutInDetail").datagrid("options").method = "post";
	$("#goodsOutInDetail").datagrid('options').url = contextPath + '/goods/goodsDetail/list';
	$("#goodsOutInDetail").datagrid('load', fromObjStr);
}
var dg;


/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
	 $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	 $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	 $('#formType').combobox('setText','全部');
	 $('#formType').combobox('setValue','');
	 $('#pricingType').combobox('setText','全部');
	 $('#pricingType').combobox('setValue','');
};

function formatter_formNo(value,row,index,formatter){
	var hrefStr='';
	if(row.formType=="库存调整"){
		hrefStr='parent.addTab("详情","'+contextPath+'/stock/adjust/checkSuccess?report=close&id='+row.formId+'")';
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="采购收货"){
		hrefStr='parent.addTab("详情","'+contextPath+'/form/purchase/receiptEdit?report=close&formId='+row.formId+'")';
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="采购退货"){
		hrefStr='parent.addTab("详情","'+contextPath+'/form/purchase/returnEdit?report=close&formId='+row.formId+'")'
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="配送入库"){
		hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.formId+'")';
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="配送出库"){
		hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.formId+'")';  
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="组合拆分"){
		hrefStr='parent.addTab("详情","'+contextPath+'/stock/combineSplit/combineSplitView?id='+row.formId+'")';  
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="销售"){
		return value
	}else if(row.formType=="礼品兑换"){
		return value
	}else if(row.formType=="领用"){
		hrefStr='parent.addTab("详情","'+contextPath+'/stock/lead/edit?id='+row.formId+'")';  
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="报损"){
		hrefStr='parent.addTab("详情","'+contextPath+'/stock/reimburse/edit?id='+row.formId+'")';  
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="盘点"){
		hrefStr='parent.addTab("详情","'+contextPath+'/stocktaking/diffDispose/stocktakingBatchView?id='+row.formId+'")';  
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="直送收货"){
		hrefStr='parent.addTab("详情","'+contextPath+'/directReceipt/edit?formId='+row.formId+'")';  
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else if(row.formType=="成本调价"){
		hrefStr='parent.addTab("详情","'+contextPath+'/cost/costAdjust/edit?id='+row.formId+'")';  
		return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
	}else{
		return value;
	}
}
/**
 * GPE设置
 */
/**
 * GPE设置
 */
function toGpeSetting() {
	publicGpeSetting({
		onSettingChange:function(columns,frozenColumns){
			initDaySumGrid(columns,frozenColumns);
		}
	});
}

/**
 * GPE导出
 */
function toGpeExport() {
	publicGpeExport({
		datagridId : "goodsOutInDetail",
		queryParams : $("#queryForm").serializeObject()
	});
}
