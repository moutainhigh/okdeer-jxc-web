/**
 * Created by huangj02 on 2016/8/9.
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

$(function(){
	initView();
	initTreeArchives();
	initDatagridOrders();
	//清楚缓存
	localStorageUtil.clearStorageItem();
    //机构选择初始化 发货机构
    $('#branchTemp').branchSelect();

    initCombotree('statu',dataItems,["NORMAL","STOPSELLING","STOPBUYING"]);

});

var dataItems = [
{"text": "全部","id": "ALL",iconCls:"combotree-p",
    children:[{"text": "正常","id": "NORMAL",iconCls:"combotree-c"},
        {"text": "停售","id": "STOPSELLING",iconCls:"combotree-c"},
        {"text": "停购","id": "STOPBUYING",iconCls:"combotree-c"},
        {"text": "淘汰","id": "OBSOLETE",iconCls:"combotree-c"}]
},


];

function initView(){
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
        $("#startCount").val('');
    	$("#endCount").val('');
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
	$("#"+gridName).datagrid("options").url = contextPath+'/goods/report/getList';
	$("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("load");
}


//初始化表格
var dg;
var gridName = "goodsTab";
function initDatagridOrders(){
	dg=$("#goodsTab").datagrid({
		//title:'普通表单-用键盘操作',
		align:'center',
		method: 'post',
		//url: contextPath+"/goods/report/getList",
		singleSelect:true,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		showFooter:true,
		pageSize:20,
		height:'100%',
		columns:[[  
		          {field:'id',title:'商品id',hidden:true},  
	              {field:'skuCode',title:'货号',width:'120px',align:'left',
	            	 formatter: function(value,row,index){
	            		 var httpUrl=contextPath + "/goods/report/toEdit"; 
	                     return "<a href='#' onclick=\"openDialog('" + httpUrl + "','修改商品档案','" + row.skuId + "','" + row.branchId + "')\" class='ualine'>"+value+"</a>";
	            	 }
	              },
		          {field:'skuName',title:'商品名称'}, 
		          {field:"barCode",title:"条码", width:110},
		          {field:"deputyBarCode",title:"附加条码", width:110},
		          {field:"memoryCode",title:"助记码", width:80},
		          {field:"oneCategoryName",title:"商品一级类别", width:80},
		          {field:"category",title:"商品类别", width:80},
		          {field:"spec",title:"规格", width:80},
		          {field:"brand",title:"品牌", width:80},
		          {field:"unit",title:"库存单位", width:60},
		          {field:"purchaseSpec",title:"进货规格", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }  
		          },
		          {field:"distributionSpec",title:"配送规格", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }  
		          },
		          {field:"vaildity",title:"保质期天数", width:80,align:'right'},
		          {field:"originPlace",title:"产地", width:80},
		          {field:"supplier",title:"主供应商", width:80},
		          {field:"saleWay",title:"经营方式", width:60,hidden:true},
		          {field:"saleWayName",title:"经营方式", width:60,align:'center'},
		          {field:"supplierRate",title:"联营扣率/代销扣率", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"purchasePrice",title:"进货价", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(4);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"salePrice",title:"零售价", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(4);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"distributionPrice",title:"配送价", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(4);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"wholesalePrice",title:"批发价", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return parseFloat(value).toFixed(4);
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"vipPrice",title:"会员价", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(row.vipPrice){
		        			  return parseFloat(row.vipPrice).toFixed(4);
		        		  }
		        		  return null;
		        	  }	
		          },
		          {field:"status",title:"商品状态", width:80,align:'center',
		        	  formatter : function(status){
		        		  if(status){
		        			  return status.value;
		        		  }
		        		  return null;
		        	  }	
		          },
		          {field:"pricingType",title:"计价方式", width:80,align:'center',
		        	  formatter : function(pricingType){
		        		  if(pricingType){
		        			  return pricingType.value;
		        		  }
		        		  return null;
		        	  }

		          },
		          {field:"inputTax",title:"进项税率", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return (100*(parseFloat(value))).toFixed(2)+"%";
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"outputTax",title:"销项税率", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return (100*(parseFloat(value))).toFixed(2)+"%";
		        		  }
		        		  return null;
		        	  }
		          },
		          {field:"profitAmtRate",title:"毛利率", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return (100*(parseFloat(value))).toFixed(2)+"%";
		        		  }
		        		  return null;
		        	  }	
		          },
		          {field:"safetyCoefficient",title:"安全系数", width:80,align:'right',
		        	  formatter : function(value,row,index){
		        		  if(value){
		        			  return ((parseFloat(value))).toFixed(2);
		        		  }
		        		  return null;
		        	  }
		          }
		          ]] ,
		          toolBar : "#tg_tb",
		          /*  onBeforeLoad:function(param){
   			var categoryCodeTree = $("#categoryCodeTree").val();
   			if(categoryCodeTree==null || categoryCodeTree==""){
   				return false;
   			}
   			return true;
   		}, */
		          enableHeaderClickMenu: false,
		          enableHeaderContextMenu: false,
		          enableRowContextMenu: false

	});
    var param = {
        wholesalePrice:["wholesalePrice"],
        purchasePrice:["purchasePrice","inputTax"],
        distributionPrice:["distributionPrice"],
        costPrice:["costPrice","profitAmtRate"],
        vipPrice:["vipPrice"],
        salePrice:["salePrice"],
    }
    priceGrantUtil.grantPrice(gridName,param);
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
	var length = $('#goodsTab').datagrid('getData').rows.length;
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

	//获取左侧缓存查询数据
	var obj = localStorageUtil.getLocalStorageItem("storge");
	$("#categoryCode").val(obj.categoryCode);

	//导出记录上一次查询条件
	$("#queryForm").attr("action",contextPath+"/goods/report/exportList");
	$("#queryForm").submit();
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
	//搜索导出清除左侧条件
	cleanLeftParam();
	$("#startCount").val('');
	$("#endCount").val('');
	
	//将左侧查询条件设置缓存中
	setLocalStorage();
	// 赋值单据类型选择

	var statusList = $("#statu").combotree('getValues');
	if(statusList.indexOf("ALL")>-1){
        $("#statusList").val("");
    }else {
        $("#statusList").val($("#statu").combotree('getValues'));
	}

	//去除左侧选中样式
	$('.zTreeDemoBackground a').removeClass('curSelectedNode');
    var fromObjStr = $('#queryForm').serializeObject();
    fromObjStr.branchName = "";
	$("#goodsTab").datagrid("options").queryParams = fromObjStr;
	$("#goodsTab").datagrid("options").method = "post";
	$("#goodsTab").datagrid("options").url = contextPath+"/goods/report/getList";
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
	parent.addTabPrint("reportPrint"+branchName,"打印",contextPath+"/goods/report/printReport?"+"&categoryCode="+categoryCode+"&skuCode="+skuCode+"&branchName="+branchName+"&barCode="+skuCode
			+"&operater="+operater+"&operaterNum="+operaterNum);
}

//对话框
var dialogTemp;
var dialogHeight = 680;//$(window).height()*(4/5);
var dialogWidth = 950;//$(window).width()*(5/9);
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
	var branchId=$("#branchId").val();
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
	var args = {"supplierNameOrsupplierCode" : supplierNameOrsupplierCode,"branchId" : branchId};
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
