
//初始化表格
$(function(){
    initDgTakeStockDiffSearch();
    // $("#diffSearchList").datagrid('options').url = "";
    $('#diffSearchList').datagrid('loadData',[]);

    initPageData();

    $(".radioItem").on("change",function(){
    	$("#diffSearchList").datagrid('options').url = "";
        $('#rotationType').val($(this).val());
    	initDgTakeStockDiffSearch();
        $('#diffSearchList').datagrid('loadData',[]);
    	// 更新页脚行并载入新数据
    	$('#diffSearchList').datagrid('reloadFooter',[]);
    	// 页面控制
    	pageChange();
    	
    })
});

function  initPageData() {
    $("#branchName").val(sessionBranchName);
    $("#branchId").val(sessionBranchId);
    $("#branchCompleCode").val(sessionBranchCompleCode);
    $("#oldBranchName").val(sessionBranchName);
    $('#batchId').val('');
    $('#batchNo').val('');
    //开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    $("input[name=rotation]:eq(0)").prop('checked','checked')
    $('#rotationType').val('1');
    pageChange();
}

//页面元素控制
function pageChange(){
	var rotaType = $('#rotationType').val();
	if(rotaType === '1'){

		$('#skuId').val("");
    	$('#skuName').val("");
    	$('#skuName').prop('disabled','disabled');
    	
		$('#divgood').prop('hidden',true);
		$('#divEqualZero').css('display','none');

        $('#equalZero').removeProp('checked');

    	$('#categoryId').val('');
		$('#categoryName').val('');
		$('#categoryCode').val('');
		$('#categoryName').prop('disabled','disabled');
    	$('#categoryDiv').prop('hidden',true);
		
	}else{
		$('#skuId').val("");
    	$('#skuName').val("");
		$('#skuName').removeProp('disabled');

		$('#divgood').prop('hidden',false);
		$('#divEqualZero').css('display','block');
		
		$('#categoryId').val('');
		$('#categoryName').val('');
		$('#categoryCode').val('');
		$('#categoryName').removeProp('disabled');
		$('#categoryDiv').prop('hidden',false);
	}
}


var dg;
function initDgTakeStockDiffSearch(){
	dg = $("#diffSearchList").datagrid({
		method:'post',
		align:'center',
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
        pageSize:50,
		showFooter:true,
		height:'100%',
		columns:getFiledsList(),
		onLoadSuccess : function(data) {

		}
	});
    if(hasCostPrice==false){
        priceGrantUtil.grantCostPrice("diffSearchList",["snapshootCostPrice","costAmountHandle","profitLossCostAmount","untaxedSnapshootCostPrice","untaxedCostAmountHandle","untaxedProfitLossCostAmount"])
    }
}
function getFiledsList(){
	if($('#rotationType').val() === '1'){
		return [ [
		          {field:'check',checkbox:true},
		          {field: 'branchCode', title: '机构编号', width: 100, align: 'left'},
		          {field: 'branchName', title: '机构名称', width: 180, align: 'left'},
		          {field: 'batchNo', title: '盘点批号', width: 150, align: 'left'},
		          {field: 'snapshootStockNum', title: '系统库存', width: 140, align: 'right',
                      formatter : function(value, row, index) {
                          if(row.isFooter){
                              return;
                          }

                          if(!row.snapshootStockNum){
                              row.snapshootStockNum = parseFloat(value||0).toFixed(2);
                          }

                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
				  },
		          {field: 'stocktakingNum', title: '盘点数量', width: 100, align: 'right',
                      formatter : function(value, row, index) {
                          if(row.isFooter){
                              return;
                          }

                          if(!row.stocktakingNum){
                              row.stocktakingNum = parseFloat(value||0).toFixed(2);
                          }

                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
				  },
		          {field: 'profitLossNum', title: '盈亏数量', width: 100, align: 'right',
                      formatter : function(value, row, index) {
                          if(row.isFooter){
                              return;
                          }

                          if(!row.profitLossNum){
                              row.profitLossNum = parseFloat(value||0).toFixed(2);
                          }

                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
				  },
				  {field: 'untaxedProfitLossCostAmount', title: '盈亏金额（不含税成本价）', width: 140, align: 'right',
					  formatter : function(value, row, index) {
						  if(row.isFooter){
							  return;
						  }
						  
						  if(!row.untaxedProfitLossCostAmount){
							  row.untaxedProfitLossCostAmount = parseFloat(value||0).toFixed(2);
						  }
						  
						  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					  },
				  },
		          {field: 'profitLossCostAmount', title: '盈亏金额（成本价）', width: 140, align: 'right',
                      formatter : function(value, row, index) {
                          if(row.isFooter){
                              return;
                          }

                          if(!row.profitLossCostAmount){
                              row.profitLossCostAmount = parseFloat(value||0).toFixed(2);
                          }

                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
				  },
		          {field: 'profitLossSaleAmount', title: '盈亏金额（售价）', width: 140, align: 'right',
                      formatter : function(value, row, index) {
                          if(row.isFooter){
                              return;
                          }

                          if(!row.profitLossSaleAmount){
                              row.profitLossSaleAmount = parseFloat(value||0).toFixed(2);
                          }

                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
				  },
		          {field: 'stocktakingNumHandle', title: '实际处理数量', width: 160, align: 'right',
                      formatter : function(value, row, index) {
                          if(row.isFooter){
                              return;
                          }

                          if(!row.stocktakingNumHandle){
                              row.stocktakingNumHandle = parseFloat(value||0).toFixed(2);
                          }

                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
				  },
				  {field: 'untaxedCostAmountHandle', title: '实际处理金额（不含税成本价）', width: 200, align: 'right',
					  formatter : function(value, row, index) {
						  if(row.isFooter){
							  return;
						  }
						  
						  if(!row.untaxedCostAmountHandle){
							  row.untaxedCostAmountHandle = parseFloat(value||0).toFixed(2);
						  }
						  
						  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					  },
				  },
		          {field: 'costAmountHandle', title: '实际处理金额（成本价）', width: 200, align: 'right',
                      formatter : function(value, row, index) {
                          if(row.isFooter){
                              return;
                          }

                          if(!row.costAmountHandle){
                              row.costAmountHandle = parseFloat(value||0).toFixed(2);
                          }

                          return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                      },
				  }
		          ] ]
	}else if($('#rotationType').val() === '2'){
		return [ [
		          {field:'check',checkbox:true},
		          {field: 'branchCode', title: '机构编号', width: 100, align: 'left'},
		          {field: 'branchName', title: '机构名称', width: 180, align: 'left'},
		          {field: 'batchNo', title: '盘点批号', width: 180, align: 'left'},
		          {field: 'validUserName', title: '审核人', width: 180, align: 'left'},
		          {field: 'skuCode', title: '货号', width: 80, align: 'left'},
		          {field:'barCode',title:'条码',width:'120px',align:'left'},
		          {field:'spec',title:'规格',width:'60px',align:'left'},
		          {field:'unit',title:'单位',width:'60px',align:'left'},
		          {field: 'skuName', title: '商品名称', width: 180, align: 'left'},

					{field: 'snapshootStockNum', title: '系统库存', width: 100, align: 'right',
						formatter : function(value, row, index) {
							if(row.isFooter){
								return;
							}

							if(!row.snapshootStockNum){
								row.snapshootStockNum = parseFloat(value||0).toFixed(2);
							}

							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
						},
					},
					{field: 'stocktakingNum', title: '盘点数量', width: 100, align: 'right',
						formatter : function(value, row, index) {
							if(row.isFooter){
								return;
							}

							if(!row.stocktakingNum){
								row.stocktakingNum = parseFloat(value||0).toFixed(2);
							}

							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
						},
					},
					{field: 'profitLossNum', title: '盈亏数量', width: 100, align: 'right',
						formatter : function(value, row, index) {
							if(row.isFooter){
								return;
							}

							if(!row.profitLossNum){
								row.profitLossNum = parseFloat(value||0).toFixed(2);
							}

							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
						},
					},

		          {field: 'handle', title: '是否处理', width: 80, align: 'left'},
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
					{field: 'untaxedProfitLossCostAmount', title: '盈亏金额（不含税成本价）', width: 140, align: 'right',
						formatter : function(value, row, index) {
							if(row.isFooter){
								return;
							}
							
							if(!row.untaxedProfitLossCostAmount){
								row.untaxedProfitLossCostAmount = parseFloat(value||0).toFixed(2);
							}
							
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
						},
					},
				{field: 'profitLossCostAmount', title: '盈亏金额（成本价）', width: 140, align: 'right',
					formatter : function(value, row, index) {
						if(row.isFooter){
							return;
						}

						if(!row.profitLossCostAmount){
							row.profitLossCostAmount = parseFloat(value||0).toFixed(2);
						}

						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					},
				},
				{field: 'profitLossSaleAmount', title: '盈亏金额（售价）', width: 140, align: 'right',
					formatter : function(value, row, index) {
						if(row.isFooter){
							return;
						}

						if(!row.profitLossSaleAmount){
							row.profitLossSaleAmount = parseFloat(value||0).toFixed(2);
						}

						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					},
				},

		          {field: 'differenceReason', title: '差异原因', width: 140, align: 'left'},
		          {field: 'categoryCode', title: '类别编码', width: 120, align: 'left'},
		          {field: 'categoryName', title: '类别名称', width: 140, align: 'left'}
		          ] ]
	}else if($('#rotationType').val() === '3'){
		return [ [
        {field:'check',checkbox:true},
        {field: 'branchCode', title: '机构编号', width: 100, align: 'left'},
        {field: 'branchName', title: '机构名称', width: 180, align: 'left'},
        {field: 'batchNo', title: '盘点批号', width: 150, align: 'left'},
        {field: 'categoryCode', title: '类别编码', width: 100, align: 'left'},
        {field: 'categoryName', title: '类别名称', width: 100, align: 'left'},
        {field: 'snapshootStockNum', title: '系统库存', width: 140, align: 'right',
            formatter : function(value, row, index) {
                if(row.isFooter){
                    return;
                }

                if(!row.snapshootStockNum){
                    row.snapshootStockNum = parseFloat(value||0).toFixed(2);
                }

                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            },
		  },
        {field: 'stocktakingNum', title: '盘点数量', width: 100, align: 'right',
            formatter : function(value, row, index) {
                if(row.isFooter){
                    return;
                }

                if(!row.stocktakingNum){
                    row.stocktakingNum = parseFloat(value||0).toFixed(2);
                }

                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            },
		  },
        {field: 'profitLossNum', title: '盈亏数量', width: 100, align: 'right',
            formatter : function(value, row, index) {
                if(row.isFooter){
                    return;
                }

                if(!row.profitLossNum){
                    row.profitLossNum = parseFloat(value||0).toFixed(2);
                }

                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            },
		  },
        {field: 'profitLossSaleAmount', title: '盈亏金额（售价）', width: 140, align: 'right',
            formatter : function(value, row, index) {
                if(row.isFooter){
                    return;
                }

                if(!row.profitLossSaleAmount){
                    row.profitLossSaleAmount = parseFloat(value||0).toFixed(2);
                }

                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            },
		  },
        {field: 'stocktakingNumHandle', title: '实际处理数量', width: 160, align: 'right',
            formatter : function(value, row, index) {
                if(row.isFooter){
                    return;
                }

                if(!row.stocktakingNumHandle){
                    row.stocktakingNumHandle = parseFloat(value||0).toFixed(2);
                }

                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            },
		  },
		  {field: 'untaxedCostAmountHandle', title: '实际处理金额（不含税成本价）', width: 200, align: 'right',
			  formatter : function(value, row, index) {
				  if(row.isFooter){
					  return;
				  }
				  
				  if(!row.untaxedCostAmountHandle){
					  row.untaxedCostAmountHandle = parseFloat(value||0).toFixed(2);
				  }
				  
				  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			  },
		  },
        {field: 'costAmountHandle', title: '实际处理金额（成本价）', width: 200, align: 'right',
            formatter : function(value, row, index) {
                if(row.isFooter){
                    return;
                }

                if(!row.costAmountHandle){
                    row.costAmountHandle = parseFloat(value||0).toFixed(2);
                }

                return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            },
		  },
		  {field: 'periodSaleAmount', title: '盘点周期销售金额', width: 200, align: 'right',
			  formatter : function(value, row, index) {
				  if(row.isFooter){
					  return;
				  }
				  
				  if(!row.costAmountHandle){
					  row.costAmountHandle = parseFloat(value||0).toFixed(2);
				  }
				  
				  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			  },
		  },
		  {field: 'lossRateNum', title: '盘点损耗占比', width: 200, align: 'right',
			  formatter : function(value, row, index) {
				  if(row.isFooter){
					  return;
				  }
				  
				  if(!row.costAmountHandle){
					  row.costAmountHandle = parseFloat(value||0).toFixed(2);
				  }
				  return '<b>'+parseFloat(value||0).toFixed(2)+'%</b>';
			  },
		  }
        ] ]
	}
}

//查询
function queryForm(){
	$("#startCount").val('');
	$("#endCount").val('');
	var oldBranchName = $("#oldBranchName").val();
	var branchName = $("#branchName").val();
	var oldbatchNo = $('#oldbatchNo').val();
	var oldskuName = $('#oldskuName').val();
	if(oldBranchName && oldBranchName != branchName){
		$("#branchId").val('');
		$("#branchCompleCode").val('');
	}
	
	if(oldbatchNo && oldbatchNo != batchNo){
		$("#batchId").val('');
	}
	
	if(oldskuName && oldskuName != skuName){
		$("#skuId").val('');
	}
	var batchNo = $("#batchNo").val();
	var batchId = $("#batchId").val();
	if(batchNo==""){
		$_jxc.alert("请先选择盘点批号");
        return;
	}
	if(batchId==""){
		$_jxc.alert("请先选择盘点批号");
		return;
	}
	var oldCategoryName = $("#oldCategoryName").val();
	var categoryName = $("#categoryName").val();	
	if(oldCategoryName && oldCategoryName != categoryName){
		$("#categoryId").val('');
		$("#categoryCode").val('');
	}
	
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)

	$("#diffSearchList").datagrid("options").method = "post";
	$("#diffSearchList").datagrid('options').url = contextPath + '/stocktaking/diffSearch/getDiffSearchList';
	$("#diffSearchList").datagrid('load', fromObjStr);
}

/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchCompleCode").val(data.branchCompleCode);
		$("#branchName").val(data.branchName);
		$("#oldBranchName").val(data.branchName);
	},'BF','');
}

function searchTakeStock(){
	$("#startCount").val('');
	$("#endCount").val('');
	var branchId = $('#branchId').val();
	var branchCompleCode = $("#branchCompleCode").val();
	var param = {
			status:1,
			branchCompleCode:branchCompleCode
	}
	new publicStocktakingDialog(param,function(data){
//		$("#branchId").val(data.branchId);
//		$("#branchName").val(data.branchName);
		$("#batchId").val(data.id);
		$("#batchNo").val(data.batchNo);
		$("#scope").val(data.scope==1 ? "类别盘点" : "全场盘点");
//		$("#categoryShows").val(data.categoryShowsStr);
	})
}

//选择商品
function selectGoods(){
	var branchId = $("#branchId").val();
	var sourceBranchId = branchId;
	var targetBranchId = branchId;
    if(branchId == ""){
        $_jxc.alert("请先选择机构");
        return;
    }
    
    var param = {
    		type:'',
    		key:"",
    		isRadio:'1',
    		branchId:branchId,
    		sourceBranchId:'',
    		targetBranchId:'',
    		supplierId:'',
    		flag:'0'
    }
    	
    new publicGoodsServiceTem(param,function(data){
    	$('#skuId').val(data[0].skuId);
    	$('#skuName').val(data[0].skuName);
    });
}

/**
 * 类别选择
 */
function searchCategory(){
	new publicCategoryService(function(data){
		$("#categoryId").val(data.categoryId);
		$("#categoryCode").val(data.categoryCode);
		$("#categoryName").val(data.categoryName);
		$("#oldCategoryName").val(data.categoryName);
	});
}
/**
 * 导出
 */
function exportDiffSearchData(){
	$("#startCount").val('');
	$("#endCount").val('');
	var length = $('#diffSearchList').datagrid('getData').total;
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
	var length = $("#diffSearchList").datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}

	$("#queryForm").attr("action",contextPath+"/stocktaking/diffSearch/exportDiffSearchList");
	$("#queryForm").submit();
}

/**
 * 打印
 */
function printDiffSearchList(){
	$("#startCount").val('');
	$("#endCount").val('');
	var length = $("#diffSearchList").datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	var param=setParams("queryForm");
	parent.addTabPrint("异常查询","打印",contextPath+"/stocktaking/diffSearch/printDiffSearchList?" + param);
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
