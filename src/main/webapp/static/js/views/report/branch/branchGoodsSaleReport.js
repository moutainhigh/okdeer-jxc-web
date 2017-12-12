/**
 * Created by huangj02 on 2016/8/9.
 * 分公司商品查询分析
 */

//html5 localStorage 存值永久有效
window.localStorageUtil = {
   setLocalStorageItem:function(localName,localObj){ //设置存储数据，传入key和value；key是任意的字符串，value是一个object
      localStorage.setItem(localName,JSON.stringify(localObj));
   },
   getLocalStorageItem:function(localName){ //获取存储数据，传入之前设置的key
      var data = JSON.parse(localStorage.getItem(localName));
      return data;
   },
   delLocalStorageItem:function(localName){ //删除存储数据，传入之前设置的key
	   localStorage.removeItem(localName);
   },
   clearStorageItem:function(){ //清空所有存储数据
      localStorage.clear()
   }
}

function goodsArchives(){
    this.selectTypeName = "categoryCode"
    //tree的提交参数
    this.treeParam = {
        categoryCode:'',
        supplierId:'',
        brandId:'',
        level:'',
    }
    //获取当前选中的树相关参数
    this.currSelectTreeParam = {
		categoryId:'',
		categoryCode:'',
		categoryName:''
    }
    //树的请求地址
    this.treeUrls = [
        {
            name:'categoryCode',
            url:contextPath+'/common/category/getGoodsCategoryToTree'
        },
        {
            name:'brandId',
            url:contextPath+'/common/brand/getBrandToTree'
        },
        {
            name:'supplierId',
            url:contextPath+'/common/supplier/getSupplierToTree'
        }
   ];
    this.getTreeUrl = function(name){
        var httpUrl = ""
        $.each(this.treeUrls,function(i,v){
            if(v.name==name){
                httpUrl = v.url;
                return false
            }
        });
        return httpUrl
    }
}
var goodsClass = new goodsArchives();

var branchIds;

$(function(){
	initView();
	initTreeArchives();
	initDatagridOrders();
	//清楚缓存
	localStorageUtil.clearStorageItem();
	branchIds = $("#branchIds").val();
	//开始和结束时间
	//toChangeDate(10);
	var startTime = dateUtil.addStartTime(dateUtil.getCurrDayPreOrNextDay("prev",30)).format("yyyy-MM-dd");
    var endTime = dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd");
	$("#txtStartDate").val(startTime);
    $("#txtEndDate").val(endTime);

});

function initView(){
    $('#branchComponent').branchSelect({
        param:{
            selectType:1, //多选receiveBranchIds
            formType:'DV'
        },
        loadFilter:function(data){
            data.forEach(function(obj,index){
                obj.branchIds = obj.branchesId;
            })
            return data;
        }
    });
    
    $('#goodsType').combobox({
        valueField:'id',
        textField:'text',
        data: [{
            id: 'categoryCode',
            text: '类别',
            selected:true,
        }],
        onSelect: function(record){
            goodsClass.selectTypeName = record.id;
            initTreeArchives();
        },
    });
}

//初始树
function initTreeArchives(){
    var args = { }
    var httpUrl = goodsClass.getTreeUrl(goodsClass.selectTypeName);
    $.get(httpUrl, args,function(data){
        var setting = {
            data: {
                key:{
                    name:'codeText',
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };
        $.fn.zTree.init($("#treeArchives"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treeArchives");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
    });
}
//选择树节点
function zTreeOnClick(event, treeId, treeNode) {
    if(goodsClass.selectTypeName=="categoryCode"){
    	//获取当前选中的”类别“相关参数
    	goodsClass.currSelectTreeParam = {
    		categoryId:treeNode.id,
    		categoryCode:treeNode.code,
    		categoryName:treeNode.text
        }
        goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.code;
        //将选中树参数值传入表单
        $("#categoryCode").val(treeNode.code);
        $("#brandId").val('');
        $("#supplierId").val('');
    }
    gridReload("goodsTab",goodsClass.treeParam,goodsClass.selectTypeName);
};

function gridReload(gridName,httpParams,selectTypeName){
	switch (selectTypeName){ 
		case "categoryCode":  //类别
			httpParams.supplierId = "";
			httpParams.brandId = "";
			break;
	}
	//将左侧查询条件设置缓存中
	setLocalStorage();
	
	var formData = $("#queryForm").serializeObject();

	formData.startTime = formData.startTime + " 00:00";
	formData.endTime = formData.endTime + " 00:00";
	
	$("#"+gridName).datagrid("options").url = contextPath+'/report/branchGoodsSaleReport/getList';
	$("#"+gridName).datagrid("options").queryParams = formData;
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("load");
}


//初始化表格
var dg;
var datagridId = 'goodsTab';
function initDatagridOrders(){
	dg=$("#goodsTab").datagrid({
		//title:'普通表单-用键盘操作',
		align:'center',
		method: 'post',
		//url: contextPath+"/report/branchGoodsSaleReport/getList",
		singleSelect:true,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		showFooter:true,
		pageSize:20,
		height:'100%',
		columns:[[  
		          {field:'id',title:'商品id',hidden:true},  
	              {field:'skuCode',title:'货号',width:'120px',align:'left'},
		          {field:'skuName',title:'商品名称'}, 
		          {field:"barCode",title:"条码",/*sortable:true,tooltip:true,*/width:100},
		          /*{field:"barCodes",title:"附条码",sortable:true,tooltip:true,width:80},*/
		          {field:"spec",title:"规格",/*sortable:true,tooltip:true,*/width:80},
		          {field:"unit",title:"单位",/*sortable:true,tooltip:true,*/width:80},
		          {field:"purchaseSpec",title:"进货规格",/*sortable:true,tooltip:true,*/width:80,align:'left',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"distributionSpec",title:"配送规格",/*sortable:true,tooltip:true,*/width:80,align:'left',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }  
		          },
		          {field:"purchasePrice",title:"进货价",/*sortable:true,tooltip:true,*/width:80,align:'right',
		        	  formatter : function(value,row,index){
							if (row.skuId == null) {
								return;
							}
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return "0.00";
		        	  }
		          },
				{field:"distributionPrice",title:"配送价",/*sortable:true,tooltip:true,*/width:80,align:'right',
					formatter : function(value,row,index){
						if (row.skuId == null) {
							return;
						}
						if(value){
							return parseFloat(value).toFixed(2);
						}
						return "0.00";
					}
				},
		        {field:"salePrice",title:"零售价",/*sortable:true,tooltip:true,*/width:80,align:'right',
		        	  formatter : function(value,row,index){
						  if (row.skuId == null) {
							  return;
						  }
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return "0.00";
		        	  }
		          },
				{field:"verageStoreSales",title:"平均单店销售量",/*sortable:true,tooltip:true,*/width:100,align:'right',
					formatter : function(value,row,index){
						if (row.skuId == null) {
							return;
						}
						if(value){
							return parseFloat(value).toFixed(2);
						}
						return "0.00";
					}
				},
			{field:"shelfRatio",title:"上架率",/*sortable:true,tooltip:true,*/width:80,align:'right',
				formatter : function(value,row,index){
					if (row.skuId == null) {
						return;
					}
					if(value){
						return value;
					}
					return "0.00%";
				}
			},
			{field:"turnoverRatio",title:"动销率",/*sortable:true,tooltip:true,*/width:80,align:'right',
				formatter : function(value,row,index){
					if (row.skuId == null) {
						return;
					}
					if(value){
						return value;
					}
					return "0.00%";
				}
			},
			{field:"sellingRatio",title:"畅销率",/*sortable:true,tooltip:true,*/width:80,align:'right',
				formatter : function(value,row,index){
					if (row.skuId == null) {
						return;
					}
					if(value){
						return value;
					}
					return "0.00%";
				}},
			{field:"sumSaleNum",title:"销售量",/*sortable:true,tooltip:true,*/width:80,align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return parseFloat(value||0).toFixed(2);
					}
					return parseFloat(value||0).toFixed(2);
				}
			},
			{field:"sumSaleAmount",title:"销售额",/*sortable:true,tooltip:true,*/width:80,align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return parseFloat(value||0).toFixed(2);
					}
					return parseFloat(value||0).toFixed(2);
				}},
			{field:"supplierName",title:"供应商名称",/*sortable:true,tooltip:true,*/width:80,align:'left'},
			{field:"supplierCode",title:"供应商代号",/*sortable:true,tooltip:true,*/width:80,align:'left'},
			{field:"oneCategoryName",title:"大类",/*sortable:true,tooltip:true,*/width:80,align:'left'},
			{field:"twoCategoryName",title:"中类",/*sortable:true,tooltip:true,*/width:80,align:'left'},
			{field:"threeCategoryName",title:"小类",/*sortable:true,tooltip:true,*/width:80,align:'left'},
			{field:"vaildity",title:"保质期",/*sortable:true,tooltip:true,*/width:80,align:'left'},
			{field:"fastDeliver",title:"配送方式 ",/*sortable:true,tooltip:true,*/width:80,align:'left',
				formatter : function(value,row,index){
					if (row.skuId == null) {
						return;
					}
					if(value == 0){
						return "常规";
					} else {
						return "直送";
					}
				}
			},
			{field:"brandName",title:"品牌",/*sortable:true,tooltip:true,*/width:80,align:'left'},
			{field:"createDataTime",title:"建档时间",/*sortable:true,tooltip:true,*/width:120,align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd hh:mm');
					}
					return "";
				}
			},
			{field:"remark",title:"备注",/*sortable:true,tooltip:true,*/width:80,align:'left'}
		     ]] ,
		toolBar : "#tg_tb",
        enableHeaderClickMenu: false,
        enableHeaderContextMenu: false,
        enableRowContextMenu: false

	});
	
	var param = {
			costPrice:["purchasePrice"],
			distributionPrice:['distributionPrice']
	}
		
	priceGrantUtil.grantPrice(datagridId,param);
}

/**
 * 供应商选择
 */
function searchSupplier(){
	new publicSupplierService(function(data){
		$("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
		$("#supplierId").val(data.id);
	});
}

/**
 * 品牌选择
 */
function searchBind(){
	new publicBrandService(function(data){
		$("#brandName").val("["+data.brandCode+"]"+data.brandName);
		$("#brandId").val(data.id);
	});
}

/**
 * 商品类别
 */
function searchCategory(){
	new publicCategoryService(function(data){
		$("#categoryCodes").val(data.categoryCode);
		$("#categoryName").val("["+data.categoryCode+"]"+data.categoryName);
		
	});
}

/**
 * 商品货号
 */
function selectSkuCode(){
    var param = {
        type:'',
        key:'',
        isRadio:1,
        sourceBranchId:"",
        targetBranchId:"",
        branchId:'',
        supplierId:'',
        flag:'0',
    }

	new publicGoodsServiceTem(param,function(data){
		$("#skuCode").val(data[0].skuCode);
	});

}
/**
 * 导出
 */
function exportData(){
	//获取左侧缓存查询数据
	var obj = localStorageUtil.getLocalStorageItem("storge");
	$("#categoryCode").val(obj.categoryCode);
	
	var formData = $("#queryForm").serializeObject();
	
	formData.startTime = formData.startTime + " 00:00";
	formData.endTime = formData.endTime + " 00:00";
	
    var param = {
        datagridId:"goodsTab",
        formObj:formData,
        url:contextPath+"/report/branchGoodsSaleReport/exportList"
    }
    publicExprotService(param);
}

//搜索导出清除左侧条件
function cleanLeftParam(){
	$("#categoryCode").val('');
}

//将左侧查询条件设置缓存中
function setLocalStorage(){
	var categoryCode = $("#categoryCode").val();
	var obj={"categoryCode":categoryCode}
	localStorageUtil.setLocalStorageItem("storge",obj);
}

//查询
function query(){

	if($("#branchName").val() == null || $("#branchName").val() == ''){
		$_jxc.alert("请选择机构");
		return;
	}
	if($("#branchIds").val() == null || $("#branchIds").val() == ''){
		$_jxc.alert("请选择机构");
		return;
	}

	if ($("#branchIds").val() == '0') {
		$_jxc.alert("请选择分公司机构");
		return;
	}

	//搜索导出清除左侧条件
	cleanLeftParam();
	
	//将左侧查询条件设置缓存中
	setLocalStorage();
	
	var formData = $("#queryForm").serializeObject();

	formData.startTime = formData.startTime + " 00:00";
	formData.endTime = formData.endTime + " 00:00";
	
	//去除左侧选中样式
	$('.zTreeDemoBackground a').removeClass('curSelectedNode');
	$("#goodsTab").datagrid("options").queryParams = formData;
	$("#goodsTab").datagrid("options").method = "post";
	$("#goodsTab").datagrid("options").url = contextPath+"/report/branchGoodsSaleReport/getList";
	$("#goodsTab").datagrid("load");

}
//重置
function resetFrom(){
	$("#queryForm").form('clear');
}
//打印
function printReport(){
	var supplierId=$("#supplierId").val();
	var categoryCode=$("#categoryCode").val();
	/*var brandId=$("#brandId").val();*/
	var branchName=$("#branchName").val();
	var skuCode=$("#skuCode").val();
	/*var barCode=$("#barCode").val();*/
	var operater=$("#operater").val();
	var operaterNum=$("#operaterNum").val();
	/*var memoryCode=$("#memoryCode").val();*/
	parent.addTabPrint("reportPrint"+branchName,"打印",contextPath+"/report/branchGoodsSaleReport/printReport?"+"&categoryCode="+categoryCode+"&skuCode="+skuCode+"&branchName="+branchName+"&barCode="+skuCode
			+"&operater="+operater+"&operaterNum="+operaterNum);
}

//对话框
var dialogTemp;
var dialogHeight = $(window).height()*(4/5);
var dialogWidth = $(window).width()*(5/9);
//打开对话框
function openDialog(argUrl, argTitle, skuId,branchId) {
	dialogTemp = $('<div/>').dialog({
		href : argUrl,
		width : dialogWidth,
		height : dialogHeight,
		title : argTitle,
		closable : true,
		resizable : true,
		onClose : function() {
			$(dialogTemp).panel('destroy');
		},
		modal : true,
		onLoad : function() {
			initGoodsInfo(skuId,branchId);
		}
	})
}
//关闭对话框
function closeDialog() {
	$(dialogTemp).panel('destroy');
}


//回车或失去焦点后，查询品牌
function brandAutoComple(){
	//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
	if(event.keyCode && event.keyCode != 13){
		return;
	}
	var brandCodeOrName = $("#brandName").val();
	//未输入值时，直接返回，无需查询
	if("" == brandCodeOrName){
		$("#brandId").val("");
		return;
	}
	//避免用户直接输入完整格式: [编号]名称
	var reg = /\[\d{4}\]/;
	if(reg.test(brandCodeOrName)){
		//取出[]里的编号，默认取已第一个[]里的值
		reg = /\[(\d{4})\]/;
		arr = reg.exec(brandCodeOrName);
		brandCodeOrName = arr[1];
	}
	//请求数据
	var httpUrl = contextPath + "/common/brand/getComponentList";
	var args = {"brandCodeOrName" : brandCodeOrName};
	$.post(httpUrl, args,function(data){
		if(null != data && data.list.length == 1){
			var brandId = data.list[0].id;
			var brandName = data.list[0].brandName;
			var brandCode = data.list[0].brandCode;
			//完善文本显示
			$("#brandName").val("["+brandCode+"]"+brandName);
			//记录ID值,用于后台查询
			$("#brandId").val(brandId);
		} else {
			//未查询到数据或多条数据，设置无效ID
			$("#brandId").val("ABCDEFG");
		}
	});
}

//回车或失去焦点后，查询供应商
function supplierAutoComple(){
	//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
	if(event.keyCode && event.keyCode != 13){
		return;
	}
	var supplierNameOrsupplierCode = $("#supplierName").val();
	var branchIds=$("#branchIds").val();
	//未输入值时，直接返回，无需查询
	if("" == supplierNameOrsupplierCode){
		$("#supplierId").val("");
		return;
	}
	//避免用户直接输入完整格式: [编号]名称
	var reg = /\[\d{6}\]/;
	if(reg.test(supplierNameOrsupplierCode)){
		//取出[]里的编号，默认取已第一个[]里的值
		reg = /\[(\d{6})\]/;
		arr = reg.exec(supplierNameOrsupplierCode);
		supplierNameOrsupplierCode = arr[1];
	}
	//请求数据
	var httpUrl = contextPath + "/common/supplier/getComponentList";
	var args = {"supplierNameOrsupplierCode" : supplierNameOrsupplierCode,"branchId" : branchIds};
	$.post(httpUrl, args,function(data){
		if(null != data && data.list.length == 1){
			var supplierId = data.list[0].id;
			var supplierName = data.list[0].supplierName;
			var supplierCode = data.list[0].supplierCode;
			//完善文本显示
			$("#supplierName").val("["+supplierCode+"]"+supplierName);
			//记录ID值,用于后台查询
			$("#supplierId").val(supplierId);
		} else {
			//未查询到数据或多条数据，设置无效ID
			$("#supplierId").val("ABCDEFG");
		}
	});
}
