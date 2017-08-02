var pageSize = 50;
$(function() {
	//开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
	//初始化默认条件
    initDatagridByFormNo();
	//选择报表类型
	changeType();
	//切换radio 禁启用
	checktype();
	$(document).on('keyup','#arrivalRate',function(){
		var val=parseFloat($(this).val());
	    var str=$(this).val();
		if(val<0||val>1){
			   $(this).val("");	
		}
		else if(str.length>=6){
			
		    var subval=str.substring(0,6);
		    $(this).val(subval);	
		}
	})
});

var flushFlg = false;
function changeType(){
	$(".radioItem").change(function(){
		$("#gridOrders").datagrid("options").url = "";
		checktype()
		var val = $(this).val();
		if (val==0) {
			flushFlg=true;
			initDatagridByFormNo();
			
		} else if (val==1) {
			initDatagridBySupplier();
		} else if (val==2) {
			initDatagridByCategory();
		}else if(val==3){
			initDatagridBySku();
		}
		$("#gridOrders").datagrid('loadData', { total: 0, rows: [] });
    	$('#gridOrders').datagrid({showFooter:false});
	});
}
//切换radio 4个状态的禁用和启用 以及值的清空
function checktype(){
 var len=$('.radioItem').length;
	for(var i=0;i<len;i++){
		var check=$('.radioItem').eq(i).prop('checked');
		var value=$('.radioItem').eq(i).val();
		if(check==true&&value=='0'){
			categoryOff();
			$('.uinp-categoryName').removeAttr('onclick');
			$('#supplierName').removeClass('uinp-no-more');
			$('#supplierName').attr('onclick','selectSupplier()');
			$('.uinp-supplierName').attr('onclick','selectSupplier()');
			$('#formNo').removeClass('uinp-no-more');
			$('#formNo').removeAttr("readonly");
		}
		else if(check==true&&value=='1'){
			categoryOff();
			$('#formNo').addClass('uinp-no-more');
			$('#formNo').attr("readonly","readonly");
			$('#formNo').val("");
			supplierOn();
		}
		else if(check==true&&value=='2'){
			supplierOff();
			$('#formNo').addClass('uinp-no-more');
			$('#formNo').attr("readonly","readonly");
			$('#formNo').val("");
			categoryOn();
		}
		else if(check==true&&value=='3'){
			categoryOn();
			supplierOn();
			$('#formNo').addClass('uinp-no-more');
			$('#formNo').attr("readonly","readonly");
			$('#formNo').val("");
		}
   }	
}

function supplierOff(){
	$('#supplierCode').addClass('uinp-no-more');
	$('.uinp-supplierName').removeAttr('onclick');
	$("#supplierCode").attr("readonly","readonly");
    $("#supplierCode").addClass("uinp-no-more");
	$('#supplierCode').val("");
	$('#supplierId').val("");
}

function supplierOn(){
	$('.uinp-supplierName').attr('onclick','selectSupplier()');	
	$('#supplierCode').removeClass('uinp-no-more');
	$('#supplierCode').removeAttr("readonly");
	$('#supplierCode').val("");
	$('#supplierId').val("");
}

function  categoryOff(){
	$('#categoryName').addClass('uinp-no-more');
	$("#categoryName").attr("readonly","readonly");
	$('#categoryName').val("");
	$('#categoryId').val("");
	$('#categoryCode').val("");
}

function categoryOn(){
	$('.uinp-categoryName').attr('onclick','getGoodsType()');
	$('#categoryName').removeClass('uinp-no-more');
	$('#categoryName').removeAttr("readonly");
	$('#categoryName').val("");
	$('#categoryId').val("");
	$('#categoryCode').val("");
}

var gridHandel = new GridClass();
//初始化表格
var dg;
function initDatagridByFormNo(){
	gridHandel.setGridName("gridOrders");
	dg = $("#gridOrders").datagrid({
        method:'post',
        align:'center',
        url:'',
        pageSize : pageSize,
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        showFooter:true,
		height:'100%',
		width:'100%',
        columns:[[
            {field:'branchCode',title:'机构编号',width:'140px',align:'left'},
            {field:'branchName',title:'机构名称',width:'220px',align:'left'},
            {field:'supplierCode',title:'供应商编号',width:'140px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field: 'formNo', title: '单据编号', width: 140, align: 'left',
            	formatter:function(value,row,index){
            		var hrefStr = '';
            		if(row.id){
        				hrefStr='parent.addTab("详情","'+contextPath+'/form/purchase/orderEdit?report=close&formId='+row.id+'")'
        				return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
            		}else{
            			return "";
            		}
                }
            },
            {field:'arrivalRate',title:'到货率',width:'140px',align:'right',
				formatter : function(value, row, index) {
					if(value!=null){
						return '<b>'+value+'</b>';
					}
					return "";
				},
			},
			{field:'purchaseNum',title:'采购数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'purchaseAmount',title:'采购金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptNum',title:'到货数量',width:'120px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptAmount',title:'到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notQuantity',title:'未到货数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notAmount',title:'未到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			}
        ]],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("gridOrders",["purchaseAmount","receiptAmount","notAmount"])
    }
}

//初始化表格
function initDatagridBySupplier(){
	gridHandel.setGridName("gridOrders");
	dg =  $("#gridOrders").datagrid({
        method:'post',
        align:'center',
        url:'',
        pageSize : pageSize,
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        showFooter:true,
		height:'100%',
		width:'100%',
        columns:[[
            {field:'supplierCode',title:'供应商编号',width:'140px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'arrivalRate',title:'到货率',width:'140px',align:'right',
				formatter : function(value, row, index) {
					if(value!=null){
						return '<b>'+value+'</b>';
					}
					return "";
				},
			},
			{field:'purchaseNum',title:'采购数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'purchaseAmount',title:'采购金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptNum',title:'到货数量',width:'120px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptAmount',title:'到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notQuantity',title:'未到货数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notAmount',title:'未到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			}
        ]],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("gridOrders",["purchaseAmount","receiptAmount","notAmount"])
    }
}

//初始化表格
function initDatagridByCategory(){
	gridHandel.setGridName("gridOrders");
	dg =  $("#gridOrders").datagrid({
        method:'post',
        align:'center',
        url:'',
        pageSize : pageSize,
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        showFooter:true,
		height:'100%',
		width:'100%',
        columns:[[
            {field:'categoryCode',title:'类别编号',width:'140px',align:'left'},
            {field:'categoryName',title:'类别名称',width:'140px',align:'left'},
            {field:'arrivalRate',title:'到货率',width:'140px',align:'right',
				formatter : function(value, row, index) {
					if(value!=null){
						return '<b>'+value+'</b>';
					}
					return "";
				},
			},
			{field:'purchaseNum',title:'采购数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'purchaseAmount',title:'采购金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptNum',title:'到货数量',width:'120px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptAmount',title:'到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notQuantity',title:'未到货数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notAmount',title:'未到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			}
        ]],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("gridOrders",["purchaseAmount","receiptAmount","notAmount"])
    }
}


//初始化表格
function initDatagridBySku(){
	gridHandel.setGridName("gridOrders");
	dg =  $("#gridOrders").datagrid({
        method:'post',
        align:'center',
        url:'',
        pageSize : pageSize,
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        showFooter:true,
		height:'100%',
		width:'100%',
        columns:[[
            {field:'supplierCode',title:'供应商编号',width:'140px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'skuName',title:'商品名称',width:'140px',align:'left'},
            {field:'skuCode',title:'货号',width:'140px',align:'left'},
            {field:'barCode',title:'条码',width:'140px',align:'left'},
            {field:'categoryCode',title:'类别编号',width:'140px',align:'left'},
            {field:'categoryName',title:'类别名称',width:'140px',align:'left'},
            {field:'arrivalRate',title:'到货率',width:'140px',align:'right',
				formatter : function(value, row, index) {
					if(value!=null){
						return '<b>'+value+'</b>';
					}
					return "";
				},
			},
			{field:'purchaseNum',title:'采购数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'purchaseAmount',title:'采购金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptNum',title:'到货数量',width:'120px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'receiptAmount',title:'到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notQuantity',title:'未到货数量',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'notAmount',title:'未到货金额',width:'140px',align:'right',
				formatter : function(value, row, index) {
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			}
        ]],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("gridOrders",["purchaseAmount","receiptAmount","notAmount"])
    }
}

function query(){
	$("#startCount").val('');
	$("#endCount").val('');
	$("#gridOrders").datagrid("options").url = "";
	$("#gridOrders").datagrid({showFooter:true});
	$("#gridOrders").datagrid("options").queryParams = $("#queryForm").serializeObject();
	$("#gridOrders").datagrid("options").method = "post";
	$("#gridOrders").datagrid("options").url = contextPath+'/report/purchase/getList';
	$("#gridOrders").datagrid("load");
}

function selectSupplier(){
	new publicSupplierService(function(data){
//		$("#supplierId").val(data.id);
		$("#supplierCode").val("["+data.supplierCode+"]"+data.supplierName);
	});
}

/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
//		$("#branchCode").val(data.branchCode);
		$("#branchName").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}

//商品分类
function getGoodsType(){
	new publicCategoryService(function(data){
//		$("#categoryId").val(data.goodsCategoryId);
//		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val(data.categoryName);
	});
}

/**
 * 重置
 */
function resetForm(){
	$("#queryForm").form('clear');
	//开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
};

/**
 * 导出
 */
function exportData(){
	var length = $('#gridOrders').datagrid('getData').rows.length;
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

	$("#queryForm").attr("action",contextPath+"/report/purchase/exportList");
	$("#queryForm").submit();
}

