var gridName = "operateGrid";
var isdisabled = false;
var url;
var operateStatus = 'add';
var oldData;
var isSingleSelect = false;
$(function(){
	
	$("#addbranchName").val(sessionBranchName);
	$("#addbranchId").val(sessionBranchId);
	
    oldData = {
    		differenceReason:$("#remark").val()||''
    }
	operateStatus = $('#disposeStatus').val();
	var batchId = $('#batchId').val();
	if(operateStatus === '0'){
		url = contextPath +"/stocktaking/diffDispose/stocktakingDifferenceList?id=" + batchId;
		$('#already-examine').css('display','none');
		$('#btnCheck').css('display','block');
	
	}else if(operateStatus === '1'){
		url = contextPath +"/stocktaking/diffDispose/stocktakingDifferenceList?id=" + batchId;
		isdisabled = true;
        isSingleSelect = true;
		$('#already-examine').css('display','block');
		$('#btnCheck').addClass('uinp-no-more');
        $('#btnCheck').prop('disabled','disabled ')
        $('#btnSave').addClass('uinp-no-more');
        $('#btnSave').prop('disabled','disabled ')
        $('#btndelete').addClass('uinp-no-more');
        $('#btndelete').prop('disabled','disabled ')
	}else{
		  $_jxc.alert("数据查询异常");
		  toClose();
	}
	initOperateDataGrid(url);
//	initQueryData(url);
 }
)

var gridHandel = new GridClass();
var dg;
var page; //datagrid分页对象
var loadFlag = false;
var oldParam; //保存旧的分页参数
function initOperateDataGrid(url){
	 gridHandel.setGridName(gridName);
            gridHandel.checkTextLength({
                title:"差异原因",
                maxLength:20,
                enterName:"differenceReason"
            })
	    dg = $("#"+gridName).datagrid({
        method:'get',
    	url:url,
        align:'center',
        singleSelect:isSingleSelect,  // 单选 false多选
        rownumbers:true,    //序号
		pagination:true,    //分页
        pageSize:1000,
        pageList:[500,1000],
        showFooter:true,
        checkOnSelect:false,
        selectOnCheck:false,
//        view:scrollview,
        height:'100%',
        width:'100%',
        columns:[[
			{field:'handle',checkbox:true,hidden:isdisabled,
			    formatter : function(value, row,index) {
			        return value;
			    }
			},
            {field:'skuId',hidden:'true'},
            {field:'skuCode',title:'货号',width: '100px',align:'left',
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            str ='<div class="ub ub-pc">合计</div> '
			        }else{
			            str = value;
			        }
			        return str;
			    }
            },
            {field:'barCode',title:'条码',width:'120px',align:'left'},
            {field:'spec',title:'规格',width:'60px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'snapshootStockNum',title:'系统库存',width:'100px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["snapshootStockNum"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
            {field:'stocktakingNum',title:'盘点数量',width:'100px',align:'right',
                formatter:function(value,row,index){
                    if(!value){
                        row["stocktakingNum"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
            {field:'profitLossNum',title:'盈亏数量',width:'100px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["profitLossNum"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
            {field:'differenceReason',title:'差异原因',width:'250px',align:'left',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return;
                    }
                    if(undefined != value && value.trim().length > 40){
                        value = value.substr(0,40);
                    }
                    return value;
                },
            	editor:{
	                type:'textbox',
	                options:{
	                	disabled:isdisabled,
                        onChange:reasonChange
	                }
            	}},
        	{field:'untaxedSnapshootCostPrice',title:'原库存不含税成本价',width:'120px',align:'right',
        		formatter:function(value,row,index){
        			if(row.isFooter){
        				return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
        			}
        			if(!value){
        				row["untaxedSnapshootCostPrice"] = parseFloat(value||0).toFixed(2);
        			}
        			return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
        		},
        	},
            {field:'snapshootCostPrice',title:'原库存成本价',width:'120px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["snapshootCostPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
			{field:'snapshootSalePrice',title:'零售价',width:'120px',align:'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					if(!value){
						row["snapshootCostPrice"] = parseFloat(value||0).toFixed(2);
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
			{field:'untaxedCostAmount',title:'原库存金额（不含税成本价）',width:'150px',align:'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					if(!value){
						row["untaxedCostAmount"] = parseFloat(value||0).toFixed(2);
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'costAmount',title:'原库存金额（成本价）',width:'150px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["costAmount"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
			{field:'untaxedStocktakingCostAmount',title:'盘点金额（不含税成本价）',width:'150px',align:'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					if(!value){
						row["untaxedStocktakingCostAmount"] = parseFloat(value||0).toFixed(2);
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'stocktakingCostAmount',title:'盘点金额（成本价）',width:'150px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["stocktakingCostAmount"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
			{field:'untaxedProfitLossCostAmount',title:'盈亏金额（不含税成本价）',width:'150px',align:'right',
				formatter:function(value,row,index){
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					if(!value){
						row["untaxedProfitLossCostAmount"] = parseFloat(value||0).toFixed(2);
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'profitLossCostAmount',title:'盈亏金额（成本价）',width:'150px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["profitLossCostAmount"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
            {field:'profitLossSaleAmount',title:'盈亏金额（售价）',width:'150px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["profitLossSaleAmount"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
			},
        ]],
        rowStyler:function(rowIndex,rowData){
            if(operateStatus != '1') return;
            if(rowData.handle === '1'){
                return  'background-color:pink;';
            }
        },
        onCheck:function(rowIndex,rowData){
        	rowData.handle = '1';
        	rowData.checked = true;
        },
        onUncheck:function(rowIndex,rowData){
        	rowData.handle = '0';
        	rowData.checked = false;
        },
        onCheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.handle = '1';
        		item.checked = true;
        	})
        },
        onUncheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.handle = '0';
        		item.checked = false;
        	})
        },
        onClickCell:function(rowIndex,field,value){
            if(operateStatus === '1') return;
            gridHandel.setBeginRow(rowIndex);
//            $("#"+gridName).datagrid('unselectRow',rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("differenceReason");
            }
        }, 
        onBeforeLoad:function(param){
        	$(this).datagrid("endEdit", gridHandel.getSelectRowIndex());
        	console.time('总耗时');
        	if(loadFlag && page){
        		var newData = {
        			differenceReason:$("#remark").val()||'',
        			grid:$.map(gridHandel.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	})
        		}
        		if(!gFunComparisonArray(oldData,newData)){
        			$_jxc.alert('数据已经修改请先保存');
        			$(page).pagination('options').pageNumber = oldParam.page;
        			$(page).pagination('options').pageSize = oldParam.rows;
        			$(page).pagination('refresh');
        			return false;
        		}
        	}
        	
        	oldParam = param;
        },
        loadFilter:function(data){
        	//显示现实数据转换 后台不返回 rows 节点结构啦 2.7
        	data = $_jxc.gridLoadFilter(data);
        	
        	if(data.rows.length > 0){
        		
        		data.rows.forEach(function(obj,index){
        			obj.checked = obj.handle == '1'?true:false;
        		})
        	}
        	return data;
        },
        onLoadSuccess:function(data){
        	loadFlag = true;
        	if(!page){
        		page = $(this).datagrid('getPager');
        	}
        	console.log('数据量',data.rows.length)
        	console.timeEnd('总耗时');
        	
        	if((data.rows).length <= 0)return;
        	
        	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
        		return $.extend(true,{},obj);//返回对象的深拷贝
        	});
            gridHandel.setDatagridHeader("center");
            //updateFooter();
            gFunEndLoading();
        },
    });
    
    if(operateStatus === 'add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
    }

    if(hasCostPrice==false){
        priceGrantUtil.grantCostPrice(gridName,["snapshootCostPrice","costAmount","stocktakingCostAmount","profitLossCostAmount"])
    }
}

//listen page change
function initPage(page){
	if(page){
		$(page).pagination({
			onChangePageSize:function(pageSize){
				delete oldData.grid;
			}
		})
	}
}
function initQueryData(url){
	$_jxc.ajax({
    	url:url,
    	type:"GET"
    },function(result){
        gFunStartLoading();
        if(result && result.length > 0){
            $("#"+gridName).datagrid("loadData",result);
        }else{
            gFunEndLoading();
        }
    });
}

function reasonChange(newVal,oldVal){
    if(undefined != newVal && newVal.trim().length > 40){
        $_jxc.alert('原因最多输入40个字符')
        newVal = newVal.substr(0,40);
    }
    gridHandel.setFieldTextValue('differenceReason',newVal);
}

// 合计
function updateFooter(){
    var fields = {snapshootStockNum:0,stocktakingNum:0,profitLossNum:0,
        snapshootCostPrice:0,costAmount:0,
        stocktakingCostAmount:0,profitLossCostAmount:0,profitLossSaleAmount:0,isGift:0, };
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}

//删除
function deleteDiffDispose(){
	var batchId = $("#batchId").val();
	var ids = [batchId];
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/stocktaking/diffDispose/deleteStocktakingBatch",
		    	data:{
		    		ids : ids
		    	}
		    },function(result){
	    		$_jxc.alert(result['message']);
	    		if(result['code'] == 0){
	    			back();
	    		}
		    });
		}
	});
}
/**
 * 关闭
 */
function back(){
	toClose();
}

/**
 * 打印
 */
function printDiffDispose(){
	var length = $("#"+gridName).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	var fromObjStr = $('#diffForm').serializeObject();
	var param=setParams("diffForm");
	parent.addTabPrint("差异详情","打印",contextPath+"/stocktaking/diffDispose/printDiffDispose?" + param);
}

function setParams(formId){  
	var param="";
	var arr = $('#' + formId).serializeArray();
	if(arr != null){
		for(var i=0;i<arr.length;i++){
			var _val = encodeURIComponent(arr[i].value);
			if(_val){
				param = param + arr[i].name + "="+_val+"&";
			}
		}
	}
	if(param){
		param = param.substring(0,param.length-1);
	}
	return param;
}

function saveDiffDispose(){
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRows();
    // var changeRows =  $("#"+gridName).datagrid("getChanges");
    var newRows = [];
    $.each(rows,function(i,row){
                var param = {
                    id:row.id,
                    handle:row.handle,
                    differenceReason:row.differenceReason
                }
                newRows.push(param);
    });

    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    
    var isCheckResult = true;
    var isChcekPrice = false;
    
    if(isCheckResult){
        if(isChcekPrice){
            $_jxc.confirm('系统提示',"盘点数存在为0，是否确定保存",function(r){
                if (r){
                    saveDataHandel(newRows);
                }
            });
        }else{
            saveDataHandel(newRows);
        }
    }
}

function saveDataHandel(rows){
	gFunStartLoading();
	//批次Id
	var batchId=$("#batchId").val();
	//remark
	var remark=$("#remark").val();
    //机构
    var branchId=$("#branchId").val();
    
    var jsonData = {
    		id:batchId,
			branchId:branchId,
			remark:remark,
			diffDetailList:rows
        };
    $_jxc.ajax({
        url:contextPath+"/stocktaking/diffDispose/saveDiffDispose",
        data:{"data":JSON.stringify(jsonData)}
    },function(result){
//    	gFunEndLoading();
        if(result['code'] == 0){
			$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/stocktaking/diffDispose/stocktakingBatchView?id="+result['batchId'];
			});
        }else{
            $_jxc.alert(result['message']);
        }
    });
}

//审核
function auditDiffDispose(){
	 $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
	var rows = gridHandel.getRows();
	var sumStocktakingNum = 0;
	var footerRow = $('#'+gridName).datagrid('getFooterRows');
	if(footerRow.length > 0){
		sumStocktakingNum = footerRow[0].stocktakingNum||0;
	}
	var newData = {
        differenceReason:$("#remark").val()||'',
        grid : $.map(gridHandel.getRows(), function(obj){
    		return $.extend(true,{},obj);//返回对象的深拷贝
    	})
    }

    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据已修改，请先保存");
        return;
    }

	//批次Id
	var batchId=$("#batchId").val();
    //机构
    var branchId=$("#branchId").val();
    //批次
    var batchNo=$("#batchNo").val();
    
    var jsonData = {
    		id:batchId,
			branchId:branchId,
			batchNo:batchNo,
            sumStocktakingNum:sumStocktakingNum
        };
	$_jxc.confirm('是否审核通过？',function(r){
		if(r){
//			gFunStartLoading();
			$_jxc.ajax({
		    	url : contextPath+"/stocktaking/diffDispose/auditDiffDispose",
		    	data:{"data":JSON.stringify(jsonData)}
		    },function(result){
//	    		gFunEndLoading();
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/stocktaking/diffDispose/stocktakingBatchView?id="+result['batchId'];
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}
/**
 * 导出
 */
function exportData(){
	var length = dg.datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	$("#diffForm").attr("action",contextPath+"/stocktaking/diffDispose/exportDiffDetailList");
	$("#diffForm").submit();
}
