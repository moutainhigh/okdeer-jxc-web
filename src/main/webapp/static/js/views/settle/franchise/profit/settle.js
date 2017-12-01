/**
 * Created by 
 * 加盟店毛利结算-新增 修改
 */


var gridDefault = {
	    costPrice:0
	}
//列表数据查询url
var url = "";
var gridName = "proFitAdd";
var oldData = {};
var pageStatus;
var clickCaculateFlag = false;//用于逻辑判断

$(function(){
    pageStatus = $('#pageStatus').val();
	if(pageStatus === 'add'){
		  $("#payMoneyTime").val(new Date().format('yyyy-MM-dd')); 
		  $('#createTime').text(new Date().format('yyyy-MM-dd hh:mm'));
	}else if(pageStatus === 'edit'){
		
		initMoneyInput();
		
		var formId = $("#formId").val();
		url = contextPath+"/settle/franchiseProfitSettle/getDetailList?formId="+formId;
		//时间起
		var _startTime = $.trim($("#beginDate").val());
		//时间止
		var _endTime = $.trim($("#endDate").val());
		//保存时用于比较
		$('#oldTime').val(_startTime+''+_endTime);
		oldData = {
	        remark:$("#remark").val(),// 备注
	        time:_startTime+''+_endTime,
	        payMoneyTime:$('#payMoneyTime').val()||'',
	        otherAmount:$('input[type="hidden"][name="otherAmount"]').val(),
	        payType:$('input[type="hidden"][name="payType"]').val()||'',   //支付方式
		}
	}
	
	initSupChkAcoAdd();
	
	if(pageStatus === 'add'){
		//机构选择初始化
		$('#branchComponent').branchSelect({
			//ajax请求参数
			param:{
				branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B
			},
			//选择完成之后
			onAfterRender:function(data){
				$('#endDate').val('');
				$('#profit').val('0.00');
				$('#profitOfCompany').val('0.00');
				$('#profitSupper').val('0.00');
				$('#amount').val('0.00');
				$('#otherAmount').val('0.00');
				gridHandel.setLoadData([]);
				// 判断是否存在未审核的毛利结算单
			    $_jxc.ajax({
			        url:contextPath+"/settle/franchiseProfitSettle/checkAuditCount",
			        data:{"franchiseBranchId":data.branchId},
			    },function(result){
			        if(result['code'] == 0){
			        	$('#branchId').val(data.branchId);
			        	$('#branchCode').val(data.branchCode);
			        	$('#contractName').val(data.contacts);
						$('#beginDate').val(result['settleTimeStart']);
						// 判断该加盟店是否建立合同
						$_jxc.ajax({
					        url:contextPath+"/settle/franchiseContract/checkExistContract",
					        data:{"franchiseBranchId":data.branchId},
					    },function(result){
					    	if(result['code'] != 0){
					    		$_jxc.alert(result['message']);
					    	}
					    });
			        }else{
			        	$('#franchiseBranchName').val('');
			        	$('#contractName').val('');
						$('#beginDate').val('');
			            $_jxc.alert(result['message']);
			        }
			    });
			    
			}
		});
	}
	
})

//处理页面数据四舍五入
function initMoneyInput(){
	$('.editInput').each(function(index,elt){
		if(elt){
			$(elt).numberbox('setValue',$_jxc.roundx($(elt).data('value'),2));
		}
	})
}

//计算金额 本次收款金额
function calulateMoney(newV,oldV){
	if(newV == ''){
		$(this).numberbox('setValue',0);
	}
	$('#amount').numberbox('setValue',parseFloat($('#profitOfCompany').numberbox('getValue'))+parseFloat(newV||0));
}

$(document).on('input','#remark',function(){
	var val=$(this).val();
	var str = val;
	   var str_length = 0;
	   var str_len = 0;
	      str_cut = new String();
	      str_len = str.length;
	      for(var i = 0;i<str_len;i++)
	     {
	        a = str.charAt(i);
	        str_length++;
	        if(escape(a).length > 4)
	        {
	         //中文字符的长度经编码之后大于4
	         str_length++;
	         }
	         str_cut = str_cut.concat(a);
	         if(str_length>200)
	         {
	        	 str_cut.substring(0,i)
	        	 remark.value = str_cut;
	        	 break;
	         }
	    }
	
});

var gridHandel = new GridClass();
function initSupChkAcoAdd(){
    gridHandel.setGridName(gridName);
    gridHandel.initKey({
        firstName:'actualAmount'
    })

    $("#"+gridName).datagrid({
        method:'get',
    	url:url,
        align:'center',
        singleSelect:false,  //单选  false多选
        checkOnSelect:false,
        rownumbers:true,    //序号
        showFooter:true,
        height:"100%",
        width:'100%',
        columns:[[
            {field:'skuId',hidden:true},
            {field:'branchCode',title:'加盟店编号',width:'120',align:'left',
            	formatter:function(value,row){
            		if(row.isFooter){
            			 return '<div class="ub ub-pc">合计</div> ';
            		}
                    return value;
                }
            },
            {field:'branchName',title:'加盟店名称',width:'140',align:'left'},
            {field:'skuCode',title:'货号',width:'140',align:'left'},
            {field:'skuName',title:'商品名称',width:'140',align:'left'},
            {field:'barCode',title:'条码',width:'140',align:'left'},
            {field:'spec',title:'规格',width:'60',align:'left'},
            {field:'unit',title:'单位',width:'60',align:'left'},
            {field:'saleCount',title:'销售数量',width:'100',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.saleCount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'saleAmount',title:'销售金额',width:'100',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.saleAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'costAmount',title:'成本金额',width:'100',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.costAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'profitAmount',title:'毛利',width:'100',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.profitAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            }
        ]],
        onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
            updateFooter();
            if(clickCaculateFlag && data.rows.length < 1){
        		$_jxc.alert('当前时段无购销商品销售数据，请重新选择日期。');
        		clickCaculateFlag = false;
        	}
        }
    });
    
    if(pageStatus==='add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
    }
}



//合计
function updateFooter(){
    var fields = {saleCount:0,saleAmount:0,costAmount:0,profitAmount:0};
    var argWhere = {}
    gridHandel.updateFooter(fields,argWhere);
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

//计算账款
function calAmount(){
	//加盟店id
	var _branchId = $.trim($("#branchId").val());
	if(!_branchId){
		$_jxc.alert('加盟店不能为空');
		return;
	}
	//时间起
	var _startTime = $.trim($("#beginDate").val());
	if(!_startTime){
		$_jxc.alert('计算开始时间不能为空');
		return;
	}
	//时间止
	var _endTime = $.trim($("#endDate").val());
	if(!_endTime){
		$_jxc.alert('计算结束时间不能为空');
		return;
	}
	
	var paramsObj = {
			"id":$('#formId').val(),
			"franchiseBranchId":_branchId,
			"settleTimeStart":_startTime,
			"settleTimeEnd":_endTime
	};
	$_jxc.ajax({
		url : contextPath+"/settle/franchiseProfitSettle/calAmount",
		data: paramsObj
	},function(result){
		if(result['code'] == 0){
			
			clickCaculateFlag = true;
    		//保存时用于比较
    		$('#oldTime').val(_startTime+''+_endTime);
			$("#profit").numberbox('setValue',$_jxc.roundx(parseFloat(result['profitAmount']),2));
			//profitOfCompany
			$("#profitOfCompany").numberbox('setValue',$_jxc.roundx(parseFloat(result['targetProfitAmount']),2));
			$("#profitSupper").numberbox('setValue',$_jxc.roundx(parseFloat(result['franchiseProfitAmount']),2));
			$("#amount").numberbox('setValue',$_jxc.roundx(parseFloat($("#profitOfCompany").val()||0) + parseFloat($("#otherAmount").val()||0),2));
			
    		$("#"+gridName).datagrid("options").method = "post";
    		$("#"+gridName).datagrid("options").queryParams = paramsObj;
    		$("#"+gridName).datagrid('options').url = contextPath + '/settle/franchiseProfitSettle/getFormList';
    		$("#"+gridName).datagrid('load');
		}else{
			$_jxc.alert(result['message'],'计算账款失败');
		}
	});

}

//保存
function saveProSet(){
    var url = $("#pageStatus").val() == 'add' ? contextPath+"/settle/franchiseProfitSettle/settleSave" : contextPath+"/settle/franchiseProfitSettle/settleUpdate";
	
    var branchId = $('#branchId').val();
	var beginDate = $.trim($('#beginDate').val());
	var endDate = $.trim($('#endDate').val());
	var payMoneyTime = $('#payMoneyTime').val();
	var payType = $('input[type="hidden"][name="payType"]').val();
	
    if(!$.trim(branchId)){
    	$_jxc.alert('加盟店信息不能为空!');
    	return false;
    }
    
    if(!beginDate){
    	$_jxc.alert('计算开始时间信息不能为空');
    	return false;
    }
    if(!endDate){
    	$_jxc.alert('计算结束时间信息不能为空');
    	return false;
    }
    
    if(!payType){
    	$_jxc.alert('付款方式不能为空!');
    	return false;
    }
    
    if(!payMoneyTime){
    	$_jxc.alert('付款日期信息不能为空');
    	return false;
    }
	
    var _rows = $('#'+gridName).datagrid('getRows');
    if(_rows.length <= 0){
    	$_jxc.alert("表格不能为空");
    	return;
    }
    
    if((beginDate+''+endDate) != $('#oldTime').val()){
    	$_jxc.alert('时间已经发生变化，请重新选择计算账款');
    	return;
    }
    _rows.forEach(function(obj,index){
    	obj.rowNo = (index+1);
    });
    var reqObj = $('#profitSettleForm').serializeObject();
    reqObj.detailList = _rows;
    
    $_jxc.ajax({
        url:url,
        data:{"data":JSON.stringify(reqObj)},
    },function(result){
        if(result['code'] == 0){
			$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/settle/franchiseProfitSettle/settleEdit?id="+result['formId'];
			});
        }else{
            $_jxc.alert(result['message']);
        }
    });
	
}

//审核
function auditProfitSettle(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    
    var newData = {
        remark:$("#remark").val(),// 备注
        time:$.trim($("#beginDate").val())+''+$.trim($("#endDate").val()),
        payMoneyTime:$('#payMoneyTime').val()||'',
        otherAmount:$('input[type="hidden"][name="otherAmount"]').val(),
        payType:$('input[type="hidden"][name="payType"]').val()||''   //支付方式
    }

    if(!gFunComparisonArray(oldData,newData)){
    	$_jxc.alert("数据有修改，请先保存再审核");
        return;
    }
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/settle/franchiseProfitSettle/settleAudit",
		    	data:{"formId":$('#formId').val()||''}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/settle/franchiseProfitSettle/settleEdit?id=" + result["formId"];
	    			});
	    		}else{
	            	 $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//删除
function deleteProfitSettle(){
	var ids = [];
	ids.push($("#formId").val());
	$_jxc.confirm('是否要删除单据',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/settle/franchiseProfitSettle/settleDelete",
		    	dataType: "json",
		    	data:{"ids":ids}
		    },function(result){
	    		if(result['code'] == 0){
                    toRefreshIframeDataGrid("settle/franchiseProfitSettle/settleList","profitSettList");
	    			toClose();
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}


//导出
function exportProfitSettle(){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/settle/franchiseProfitSettle/exportSheet?page=FranchiseProfitSettle&sheetNo='+formId;
}

//返回列表页面
function back(){
	location.href = contextPath+"/settle/franchiseProfitSettle/settleList";
}

//新增加盟店毛利结算
function addProfitSetForm(){
	toAddTab("新增加盟店毛利结算",contextPath + "/settle/franchiseProfitSettle/settleAdd");
}
