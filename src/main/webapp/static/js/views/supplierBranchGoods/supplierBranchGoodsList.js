/**
 * Created by huangj02 on 2016/10/12.
 */

var gridHandel = new GridClass();

$(function(){
    initTreeArchivess('');
    initDatagridsupplierList();
});

//左侧树条件搜索
function searchTree(){
	var codeOrName = $("#supplierNameSearch").val();
	initTreeArchivess(codeOrName)
}

/**
 * 初始树
 */
function initTreeArchivess(codeOrName){
    var args = {codeOrName:codeOrName};
    var httpUrl = contextPath+"/supplierBranchGoods/getBranchSupplierToTree";
    $.post(httpUrl,args,function(data){
        var setting = {
            data: {
                key:{
                    name:'codeText',
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0,
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
            treeObj.expandNode(nodes[0], true, true, true);
        }
    });
}

//选择树节点
function zTreeOnClick(event, treeId, treeNode) {
    if(treeNode.type=="branch"){//选择机构
    	$("#supplierId").val('');
    	$("#supplierName").val('');
    	$_jxc.alert('你选择的是机构，请选择供应商!');
    }else if(treeNode.type=="supplier"){//供应商
    	if(treeNode.id){
	    	sourceBranchId = $("#branchId").val();
    		if(sourceBranchId){
    			$("#supplierId").val(treeNode.id);
    			$("#supplierName").val(treeNode.text);
    			searchHandel();
    		}
    	}
    }
}

var gridHandel = new GridClass();
var gridName = "gridSupplierArchiveList";
var editRowData = null;
var dg;
function initDatagridsupplierList(){
    gridHandel.setGridName("gridSupplierArchiveList");
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("skuCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
                },100)
            }else{
              var rows=gridHandel.getRows();
              var num=0;
              var num1=0;
              $.each(rows,function(i,v){
            	  if(v["skuCode"]==arg&&i!=gridHandel.getSelectRowIndex()){
            		  num++;
            	  }
            	  if(v["barCode"]==arg&&i!=gridHandel.getSelectRowIndex()){
            		  num1++;
            	  }
              })
              if(num>0){
            	  $_jxc.alert("输入货号重复，请重新输入!");
              }
              if(num1>0){
            	  $_jxc.alert("输入条码重复，请重新输入!");
              }
              else{
            	  selectGoods(arg);  
              }
            }
        },
    })
    
   dg = $("#gridSupplierArchiveList").datagrid({
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
            {field:'ck',checkbox:true},
            {field:'cz',title:'操作',width:'60px',align:'center',
                formatter : function(value, row,index) {
                    var str = '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
                    '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
                    return str;
                },
            },
            {field:'skuId',title:'ID',width: '0px;',align:'left',hidden:true},
            {field:'skuCode',title:'货号',width: '100px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'140px',align:'left'},
            {field:'categoryName',title:'商品类别',width:'140px',align:'left'},
            {field:'spec',title:'规格',width:'80px',align:'left'},
            {field:'unit',title:'单位',width:'80px',align:'left'},
            {field:'purchasePrice',title:'最新进价',width:'80px',align:'right',
            	 formatter:function(value,row,index){
                     return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                 },
            },
            {field:'purchasePrice',title:'最低历史进价',width:'80px',align:'right',
            	
            	 formatter:function(value,row,index){
                     return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                 },
            },
            {field:'purchasePrice',title:'最高历史进价',width:'80px',align:'right',
            	 formatter:function(value,row,index){
                     return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                 },
            }
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("skuCode");
            }
        },
       onBeforeEdit:function (rowIndex, rowData) {
           editRowData = $.extend(true,{},rowData);
       },
       onAfterEdit:function(rowIndex, rowData, changes){
           if(typeof(rowData.id) === 'undefined'){
               // $("#"+gridName).datagrid('acceptChanges');
           }else{
               if(editRowData.skuCode != changes.skuCode){
                   rowData.skuCode = editRowData.skuCode;
                   gridHandel.setFieldTextValue('skuCode',editRowData.skuCode);
               }
           }
       },
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)]);
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(gridName,["purchasePrice"])
    }
}

/**
 * 搜索
 */
function searchHandel(){
    var fromObjStr = $('#formList').serializeObject();
	$("#gridSupplierArchiveList").datagrid("options").method = "post";
    $("#gridSupplierArchiveList").datagrid("options").url =contextPath+'/supplierBranchGoods/findSupplierBranchGoods',
    $("#gridSupplierArchiveList").datagrid('load', fromObjStr);
}

//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}


//选择商品
function selectGoods(key){
	var branchId = $("#branchId").val();
	var param = {
        key:key,
        isRadio:0,
        branchId:branchId
    }

    new publicGoodsServiceTem(param,function (data) {
        if(data.length==0){
            return;
        }
        for(var i in data){
            var rec = data[i];
            rec.remark = "";
        }
        var nowRows = gridHandel.getRowsWhere({skuName:'1'});
        var addDefaultData  = gridHandel.addDefault(data,gridDefault);
        var keyNames = {
            purchasePrice:'price',
            id:'skuId',
            disabled:'',
            pricingType:'',
            inputTax:'tax'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1 };   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);

        $("#gridSupplierArchiveList").datagrid("loadData",newRows);
        gridHandel.setLoadFocus();
    })
}


/**
 * 查询机构
 */
function selectBranches(){
	new publicAgencyService(function(data){
        if($("#branchId").val()!=data.branchesId){
            $("#branchId").val(data.branchesId);
//            $("#branchName").val(data.branchName);
            $("#branchName").val("["+data.branchCode+"]"+data.branchName);
           //选择机构查询
           var supplierId = $("#supplierId").val();
           if(supplierId){
        	   searchHandel();
           }else{
        	   $('#gridSupplierArchiveList').datagrid('loadData', {total: 0,rows: []}); 
           }
        }
	},'','');
}

function importShow(type){
	$('#excelFile').val("");
	$('#filename').val("");
	$('.uatk').show();
	$("#uploadFormType").val(type);
	if(type==0){
		$("#temple").text("货号模板下载");
	}else{
		$("#temple").text("条码模板下载");
	}
}

//模板导出
function exportTemp(){
	var type = $("#temple").val();
	if(type==0){
		location.href=contextPath+'/form/purchase/exportTemp?type=2';
	}else if(type==1){
		location.href=contextPath+'/form/purchase/exportTemp?type=3';
	}
}

$(document).on('change','#excelFile', function(){
	var value=$(this).val();
	$('#filename').val(value);
});

/**
 * 导出
 */
function exportData(){
	var supplierId = $("#supplierId").val();
	if(!supplierId){
		$_jxc.alert("请选择供应商");
		return;
	}

    var param = {
        datagridId:"gridSupplierArchiveList",
        formObj:$("#formList").serializeObject(),
        url:contextPath+"/supplierBranchGoods/exportList"
    }
    publicExprotService(param);
}


//保存
function saveItemHandel(){
    $("#gridSupplierArchiveList").datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var supplierId = $("#supplierId").val();
    if(!supplierId){
    	$_jxc.alert("供应商不能为空");
        return;
    }
    var branchId = $("#branchId").val();
    if(!branchId){
    	$_jxc.alert("机构不能为空");
    	return;
    }
    
    var isCheckResult = true;
    var isChcekPrice = false;
    
    var skuIds=[];
    $.each(rows,function(i,v){
        v["rowNo"] = i+1;
        if(!v["skuId"]){
            $_jxc.alert("第"+(i+1)+"行,商品不正确");
            isCheckResult = false;
            return false;
        };
        skuIds.push(v["skuId"]);
    });
    if(isCheckResult){
       saveDataHandel(skuIds);
    }
}

//保存
function saveDataHandel(skuIds){
    //供应商
    var supplierId = $("#supplierId").val();
    if(!supplierId){
    	$_jxc.alert("供应商不能为空");
        return;
    }
    //收货机构
    var branchId = $("#branchId").val();
    if(!branchId){
    	$_jxc.alert("机构不能为空");
    	return;
    }
    
    var reqObj = {
    	branchId:branchId,
        supplierId:supplierId,
        skuIds:skuIds
    };
    var req = JSON.stringify(reqObj);
    $_jxc.ajax({
        url:contextPath+"/supplierBranchGoods/saveSupplierBranchGoods",
        contentType:'application/json',
        data:req
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("操作成功!");
            dg.datagrid('reload');
        }else{
            $_jxc.alert(result['message']);
        }
    });
}

function orderDelete(){
	//供应商
    var supplierId = $("#supplierId").val();
    if(!supplierId){
    	$_jxc.alert("供应商不能为空");
        return;
    }
    //收货机构
    var branchId = $("#branchId").val();
    if(!branchId){
    	$_jxc.alert("机构不能为空");
    	return;
    }
	var rows =$("#gridSupplierArchiveList").datagrid("getChecked");
	if($("#gridSupplierArchiveList").datagrid("getChecked").length <= 0){
		 $_jxc.alert('请选中一行进行删除！');
		return null;
	}
	 var skuIds=[];
	    $.each(rows,function(i,v){
	        skuIds.push(v.skuId);
	    });
	$_jxc.confirm('是否要删除选中数据?',function(data){
		if(data){
		    var supplierId = $("#supplierId").val();
		    var branchId = $("#branchId").val();
		    var reqObj = {
		    	branchId:branchId,
		        supplierId:supplierId,
		        skuIds:skuIds
		    };
		    var req = JSON.stringify(reqObj);
		    $_jxc.ajax({
		        url:contextPath+"/supplierBranchGoods/delete",
		        contentType:'application/json',
		        data:req
		    },function(result){
	            if(result['code'] == 0){
	                $_jxc.alert("操作成功!");
	                $("#gridSupplierArchiveList").datagrid('reload');
	            }else{
	                $_jxc.alert(result['message']);
	            }
		    });
		}
	});
}

//新的导入功能 货号(0)、条码(1)导入
function toImportproduct(type){
	//供应商
    var supplierId = $("#supplierId").val();
    if(!supplierId){
    	$_jxc.alert("供应商不能为空");
        return;
    }
    //收货机构
    var branchId = $("#branchId").val();
    if(!branchId){
    	$_jxc.alert("机构不能为空");
    	return;
    }
	
    var param = {
        url:contextPath+"/supplierBranchGoods/importListEnable",//导入后台url
        tempUrl:contextPath+"/supplierBranchGoods/exportTemp",//下载模板
        type:type
    }
    new publicUploadFileService(function(data){
        updateListData(data);
    },param)
}

function updateListData(data){
	    var keyNames = {
	        purchasePrice:'price'
	    };
	   
	    var newRows = gFunUpdateKey(data,keyNames);
	    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
	    var argWhere ={skuCode:1};  //验证重复性
	    var allRows = gridHandel.checkDatagrid(nowRows,newRows,argWhere,{});
	    $("#gridSupplierArchiveList").datagrid("loadData",allRows);
	}

