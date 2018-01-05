/**
 * Created by huangj02 on 2016/8/11.
 */
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
    initDatagridArchives();
});
function initView(){
    $('#goodsType').combobox({
        valueField:'id',
        textField:'text',
        data: [{
            id: 'categoryCode',
            text: '类别',
            selected:true,
        },{
            id: 'brandId',
            text: '品牌'
        },{
            id: 'supplierId',
            text: '供应商'
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
        goodsClass.treeParam["level"] = treeNode.level;
        
        //将选中树参数值传入表单
        $("#categoryCode1").val(treeNode.code);
        $("#level").val(treeNode.level);
        $("#brandId1").val('');
        $("#supplierId1").val('');
    }else if(goodsClass.selectTypeName=="brandId"){
        goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.id;
        goodsClass.treeParam["level"] = "";
        
        //将选中树参数值传入表单
        $("#brandId1").val(treeNode.id);
        $("#categoryCode1").val('');
        $("#level").val('');
        $("#supplierId1").val('');
    }else{
    	 goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.id;
         goodsClass.treeParam["level"] = "";
         
         //将选中树参数值传入表单
         $("#supplierId1").val(treeNode.id);
         $("#brandId1").val('');
         $("#categoryCode1").val('');
         $("#level").val('');
    }
    //var formParams = $("#formGoodsArchives").serializeObject();
    gridReload("gridArchives",goodsClass.treeParam,goodsClass.selectTypeName);
};

function gridReload(gridName,httpParams,selectTypeName){
	switch (selectTypeName){ 
		case "categoryCode":  //类别
			httpParams.supplierId = "";
			httpParams.brandId = "";
			break;
		case "brandId":  //品牌
			httpParams.categoryCode = "";
			httpParams.supplierId = "";
			break;
		case "supplierId":  //供应商
			httpParams.categoryCode = "";
			httpParams.brandId = "";
			break;
	}
	$("#"+gridName).datagrid("options").url = contextPath+'/common/goods/queryGoodsSku';
	//begin by lijy02 2016.9.13
//	$("#"+gridName).datagrid("options").url = contextPath+'/goods/goodsSelect/getGoodsList';
	//end by lijy02
    $("#"+gridName).datagrid("options").queryParams = $("#formGoodsArchives").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("load");
}
var gridHandel = new GridClass();
//初始化表格

function initDatagridArchives(){
	 $("#gridArchives").datagrid({
        //title:'普通表单-用键盘操作',
        align:'center',
        url:'',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        //fitColumns:true,    //每列占满
        //fit:true,            //占满
        pageSize:20,
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
             {field:'id',hidden:true},
             {field:'skuCode',title:'货号',width:'120px',align:'left',
            	formatter: function(value,row,index){
                    return "<a href='#' onclick=\"openDialog('"+contextPath+"/common/goods/updateGoodsView?id="+row.id+"','修改商品档案','edit','"+row.id+"')\" class='ualine'>"+value+"</a>";
            		//return "<a href="+contextPath+"/common/goods/updateGoodsView?id="+row.id+" class='ualine'>"+value+"</a>";
            	}
             },
             {field:'skuName',title:'商品名称',width:'200px',align:'left'},
             {field:'barCode',title:'条形码',width:'120px',align:'left'},
             {field:'memoryCode',title:'助记码',width:'80px',align:'left'},
             {field:'oneCategoryName',title:'商品一级类别',width:'80px',align:'left'},
             {field:'categoryName',title:'商品类别',width:'80px',align:'left'},
             {field:'spec',title:'规格',width:'90px',align:'left'},
             {field:'brandName',title:'品牌',width:'100px',align:'left'},
             {field:'unit',title:'库存单位',width:'60px',align:'left'},
             {field:'purchaseSpec',title:'采购规格',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return (value||0).toFixed(2);
                 }
             },
             {field:'distributionSpec',title:'配送规格',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return (value||0).toFixed(2);
                 }
             },
             {field:'vaildity',title:'保质期天数',width:'80px',align:'right'},
             {field:'originPlace',title:'产地',width:'200px',align:'left'},
             {field:'supplierName',title:'主供应商',width:'200px',align:'left'},
             {field:'saleWay',title:'经营方式',width:'80px',align:'left',hidden:true},
             {field:'saleWayName',title:'经营方式',width:'100px',align:'center'},
             {field:'supplierRate',title:'联营扣率/代销扣率',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return ((value||0)*100).toFixed(0)+"%";
                 }
             },
             {field:'purchasePrice',title:'进货价',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return (value||0).toFixed(4);
                 }
             },
             {field:'salePrice',title:'零售价',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return (value||0).toFixed(4);
                 }
             },
             {field:'distributionPrice',title:'配送价',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return (value||0).toFixed(4);
                 }
             },
             {field:'wholesalePrice',title:'批发价',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return (value||0).toFixed(4);
                 }
             },
             {field:'vipPrice',title:'会员价',width:'80px',align:'right',
                 formatter:function(value,row,index){
                     return (value||0).toFixed(4);
                 }
             },
             {field:'status',title:'商品状态',width:'80px',align:'center',
                 formatter:function(value,row,index){
                     if(value){
                         return value.value;
                     }
                     return value;
                 }
             },
             {field:'pricingType',title:'计价方式',width:'80px',align:'center',
                formatter:function(value,row,index){
                    if(value){
                        return value.value;
                    }
                    return value;
                }
             },
            {field:'inputTax',title:'进项税率',width:'80px',align:'right',
            	 formatter:function(value,row,index){
                     if(row.inputTax){
                         return (value||0).toFixed(2)*100+"%";
                     }
                     return null;
                 }
            },
            {field:'outputTax',title:'销项税率',width:'80px',align:'right',
            	formatter:function(value,row,index){
                    if(row.outputTax){
                        return (value||0).toFixed(2)*100+"%";
                    }
                    return null;
                }
            },
            {field:'marginTax',title:'毛利率',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.salePrice&&row.purchasePrice){
                        var vprice = (row.salePrice - row.purchasePrice)/row.salePrice *100
                        return (vprice||0).toFixed(2)+"%";
                    }
                    return "1";
                }
            },
            {field:'remark',title:'备注',width:'200px',align:'left',hidden:true},
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }

});

    var param = {
        wholesalePrice:["wholesalePrice"],
        purchasePrice:["purchasePrice"],
        distributionPrice:["distributionPrice"],
        costPrice:["costPrice","marginTax"],
        vipPrice:["vipPrice"],
        salePrice:["salePrice"],
    }
    priceGrantUtil.grantPrice("gridArchives",param);
}



//选择类型
function goodsSelectType(){
    console.log($("#goodsType").val());
    goodsClass.selectTypeName = $("#goodsType").val();
}

//清除左侧菜单参数
function cleanLeftParam(){
	 $("#brandId1").val('');
     $("#categoryCode1").val('');
     $("#level").val('');
     $("#supplierId1").val('');
}

//搜索
function goodsSearch(){
	//去除左侧选中值
	cleanLeftParam();
	//去除左侧选中样式
	$('.zTreeDemoBackground a').removeClass('curSelectedNode');
    var formParams = $("#formGoodsArchives").serializeObject();
    $("#gridArchives").datagrid('options').url=contextPath+'/common/goods/queryGoodsSku';
    gridReload("gridArchives", formParams);
    
}
//新增
function addGoodsView(){
	var param = goodsClass.currSelectTreeParam;
	var categoryCode = param.categoryCode;
	if(categoryCode){
		if(categoryCode.length==6){
			var obj = $.extend({},param);
			if(goodsClass.currSelectTreeParam.categoryId=="0"){
				obj.categoryName="";
			}
			openDialog(contextPath+"/common/goods/addGoodsView","新增商品档案","add",obj);
		}else{
			var obj = $.extend({},param);
				obj.categoryName="";
			openDialog(contextPath+"/common/goods/addGoodsView","新增商品档案","add",obj);
		}
	}else{
		var obj = $.extend({},param);
		if(goodsClass.currSelectTreeParam.categoryId=="0"){
			obj.categoryName="";
		}
		openDialog(contextPath+"/common/goods/addGoodsView","新增商品档案","add",obj);
	}
}
var  dalogTemp;
var dialogHeight = 660;
var dialogWidth = 950;
var dialogLeft = ($(window).width() - dialogWidth) / 2;
//打开Dialog
function openDialog(argUrl,argTitle,argType,params) {
    dalogTemp = $('<div/>').dialog({
        href: argUrl,
         width: dialogWidth,
        height: argType=='add'?dialogHeight:700,
//        left:dialogLeft,
        title: argTitle,
        closable: true,
        resizable: true,
        onClose: function () {
            $(dalogTemp).panel('destroy');
        },
        modal: true,
        onLoad: function () {
            if(argType=='add'){
                initGoodsView(params,"add")
            }else if(argType=="edit"){
                initGoodsEditView(params);
            }else if(argType=="copy"){
                initGoodsView(params,"")
            }

        }
    })
}

function closeDialog(){
    $(dalogTemp).panel('destroy');
}

//复制
function copyGoodsView(){
	if($("#gridArchives").datagrid("getSelections").length <= 0){
        $_jxc.alert('请选中一行进行复制新增商品！');
        return false;
    }else{
    	var selectionRow = $("#gridArchives").datagrid("getSelections");
        selectionRow = JSON.stringify(selectionRow);
        openDialog(contextPath+"/common/goods/addGoodsView","新增商品档案","copy",""+escape(selectionRow)+"");
    	setTimeout(function(){

    		//window.location.href = contextPath+"/common/goods/addGoodsView?data="+escape(selectionRow);
    	},10);
    }
}



//删除
function delGoods(){
	var row = $("#gridArchives").datagrid('getSelected');
	if(rowIsNull(row)) return;
	//判断是否被引用
	$_jxc.confirm('是否确认删除？', function(data){
		if (data){
			$_jxc.ajax({
				url:contextPath+"/common/goods/delGoods",
				data:{"id":row.id}
			},function(data){
				if(data.code == 0){
					$("#gridArchives").datagrid('reload');
					$_jxc.alert("删除成功");
				}else{
					$_jxc.alert(data.message);
				}
			});
		} 
	});
}

/**
 * 导出
 */
function exportData(){
	var length = $('#gridArchives').datagrid('getData').rows.length;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
    var param = {
        datagridId:'gridArchives',
        formObj:$("#formGoodsArchives").serializeObject(),
        url:contextPath+"/common/goods/exportGoods"
    }
    publicExprotService(param);
}

//重置
function resetFrom(){
	$("#searchForm").form('clear');
}
