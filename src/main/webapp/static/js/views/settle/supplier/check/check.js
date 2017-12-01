/**
 * Created by 
 * 供应商对账单-新增 修改
 */


var gridDefault = {
		
	}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "supplierChkAccountAdd";
var pageStatus;
var editRowData = null;
var targetBranchId;
var clickFlag = false;//是否点击供应商 方便判断显示提示


$(function(){
    pageStatus = $('#operateType').val();

 	
	if(pageStatus === 'add'){
		$('#createTime').text(new Date().format('yyyy-MM-dd hh:mm'))
		//非总部 机构默认有值
		  if(sessionBranchType != '0'){
			$('#branchId').val(sessionBranchId);
			$('#branchCode').val(sessionBranchCode);
			$('#targetBranchName').val(sessionBranchCodeName)
		  }
	}else if(pageStatus === 'edit'){
		var formId = $("#formId").val();
		url = contextPath+"/settle/supplierCheck/checkFormDetailList?id="+formId;
		oldData = {
		        remark:$("#remark").val(),                  // 备注
		        payType:$('input[type="hidden"][name="payType"]').val()||'',   //支付方式
		}
	    
	}
	initSupChkAcoAdd();
	
	if(pageStatus === 'add'){
		//机构选择初始化
		$('#branchComponent').branchSelect({
			//ajax请求参数
			param:{
				scope:1
			},
			//选择完成之后
			onAfterRender:function(data){
				$("#phone").val('');
				$("#mobile").val('');
				$('#linkTel').val('');//联系人
				$("#supplierId").val('');
				$("#supplierName").val('');
				
				$('#openAccountBank').val('');
		    	//银行账户
		    	$('#bankAccount').val('');
		    	//办公地址
		    	$('#officeAddress').val('');
		    	//国税登记 
		    	$('#nationalTaxRegNum').val('');
		    	
		        
		        gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
		    	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
		        // 校验机构配置
				checkBranchSpec(data.branchesId);
			},
			//数据过滤
			loadFilter:function(data){
				data.isContainChildren = data.allBranch;
				return data;
			}
		});
		
		//供应商选择初始化
		$('#supplierComponent').supplierSelect({
			//选择之前
			onShowBefore:function(){
				clickFlag = true;
				return true;
			},
			//选择完成之后
			onAfterRender:function(data){
		    	$("#phone").val(data.phone);
				$("#mobile").val(data.mobile);
				$('#linkTel').val((data.mobile?data.mobile:'')+(data.mobile&&data.phone ? '/':'')+(data.phone?data.phone:''));//联系人
				//校验是否存在未审核的对账单
				checkCheckAuditStutas(data.id);
			},
			//依赖条件 relyOnId 为空
			relyOnId:'branchId',
			//依赖条件 异常提示
			relyError:'请选择机构！',
			//数据过滤
			loadFilter:function(data){
				data.supplierId = data.id;
				return data;
			}
		});
	}
})

//combobox 过滤
function loadFilter(data){
	if(pageStatus === 'add'){
		data[0].selected = true;
	}
	return data;
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
var ifEditor = false;
function initSupChkAcoAdd(){
    gridHandel.setGridName(gridName);
    gridHandel.initKey({
        firstName:'discountAmount',
    })
    $("#"+gridName).datagrid({
        method:'post',
    	url:url,
        align:'center',
        singleSelect:false,  //单选  false多选
        checkOnSelect:false,
        rownumbers:true,    //序号
        showFooter:true,
        height:"100%",
        width:'100%',
        columns:[[
            {field:'cb',checkbox:true},
//            {field:'targetFormId',title:'targetFormId',hidden:true},
            {field:'targetFormNo',title:'单号',width: '150px',align:'left',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return  '<div class="ub ub-pc">合计</div> '
                    }
            		var strHtml = '';
            		var targetFormType = row.targetFormType;
            		if(value){
                		if(targetFormType == 'FY'){
                			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商预付单明细\',\''+ contextPath +'/settle/supplierCharge/advanceView?id='+ row.targetFormId +'\')">' + (value||"") + '</a>';
                		}else if(targetFormType == 'FF'){
                			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商费用明细\',\''+ contextPath +'/settle/supplierCharge/chargeView?id='+ row.targetFormId +'\')">' + (value||"") + '</a>';
                		}else if(targetFormType == 'FL'){
                			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商联营账单明细\',\''+ contextPath +'/settle/supplierChain/chainView?id='+ row.targetFormId +'\')">' + (value||"") + '</a>';
                		}else if(targetFormType == 'PI'){
                			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购收货详细\',\''+contextPath+'/form/purchase/receiptEdit?formId='+row.targetFormId+'\')">' + (value||"") + '</a>';
                		}else if(targetFormType == 'PM'){
                			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'直送收货单详细\',\''+contextPath+'/directReceipt/edit?formId='+row.targetFormId+'\')">' + (value||"") + '</a>';
                		}else if(targetFormType == 'PR'){
                			strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购退货详细\',\''+contextPath+'/form/purchase/returnEdit?formId='+row.targetFormId+'\')">' + (value||"") + '</a>';
                		}else if(targetFormType == 'FP'){
                            strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'查看采购成本调整详细\',\''+contextPath+'/purchase/cost/form/edit/'+row.targetFormId+'\')">' + (value||"") + '</a>';
                        }
                	}
            		return strHtml ;
            	}
            },
            {field:'targetFormType',hidden:true},
            {field:'formTypeText',title:'单据类型',width:'120px',align:'center'},
            {field:'branchCode',title:'机构编号',width:'120px',align:'left'},
            {field:'branchName',title:'机构名称',width:'140px',align:'left'},
            {field:'supplierCode',title:'供应商编号',width:'120px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'payableAmount',title:'应付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.payableAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'discountAmount',title:'优惠金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.discountAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			onChange:changeDisAmount
            		}
            	}
            },
            {field:'unpayAmount',title:'未付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.unpayAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>'
            	}
            },
            {field:'remark',title:'备注',width:'180px',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[20]},
                    }
                }
            }
        ]],
        onCheck:function(rowIndex,rowData){
        	rowData.checked = true;
        	updateFooter();
        },
        onUncheck:function(rowIndex,rowData){
        	rowData.checked = false;
        	updateFooter();
        },
        onCheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.checked = true;
        	})
        	updateFooter();
        },
        onUncheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.checked = false;
        	})
        	updateFooter();
        },
        onClickCell:function(rowIndex,field,value){
        	gridHandel.setBeginRow(rowIndex);
        	gridHandel.setSelectFieldName(field);
        	var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("discountAmount");
            }
        },
        loadFilter:function(data){
        	//显示现实数据转换 后台不返回 rows 节点结构啦 2.7
        	data = $_jxc.gridLoadFilter(data);
        	
        	data.forEach(function(obj,index){
        		obj.checked = true;
        		if(pageStatus == 'add'){
        			obj.unpayAmount = obj.payableAmount;
        		}
        	});
        	return data;
        },
        onLoadSuccess:function(data){
        	if(clickFlag && data.rows.length <= 0){
        		clickFlag =  false;
        		$(this).datagrid('reloadFooter',[]);
        		$_jxc.alert('您和此供应商没有账款信息，或您们的往来账款已平衡！');
        	}
        	if(pageStatus==='edit'){
                if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                        return $.extend(true,{},obj);//返回对象的深拷贝
                    });

                }
        	}
            gridHandel.setDatagridHeader("center");
            updateFooter();
        },
    });
    
    if(pageStatus==='add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
    }
}


var disCheckFlag = false;
//修改优惠金额
function changeDisAmount(vewV,oldV){
	if(disCheckFlag){
		disCheckFlag = false;
		return;
	}
	
	var _payableAmount = parseFloat(gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'payableAmount')||0);
	if(_payableAmount >=0  && vewV > _payableAmount && oldV){
		$_jxc.alert('优惠金额不能大于应付金额');
		disCheckFlag = true;
		$(this).numberbox('setValue',oldV);
		return ;
	}
	
	gridHandel.setFieldsData({unpayAmount:_payableAmount - vewV});
	
	updateFooter();
}
//合计
function updateFooter(){
    var fields = {payableAmount:0,discountAmount:0,unpayAmount:0};
    var argWhere = {name:'checked',value:true}
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



//保存
function saveSupChkForm(){
	gridHandel.endEditRow();
	var branchId = $('#branchId').val();
	var supplierId = $('#supplierId').val();
	var operateType = $('#operateType').val();
	if(!validateForm(branchId,supplierId))return;
	
    var _rows = gridHandel.getRowsWhere({targetFormNo:'1'});
    if(_rows.length <= 0){
    	$_jxc.alert("表格不能为空");
    	return;
    }

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }
    
    var _subRows = [];
    var _rowNo = 1;//行号
    $.each(_rows,function(i,data){
    	if(data.checked){
    		data.rowNo = _rowNo;
    		data.checked = data.checked ? 1:0;
    		_subRows.push(data);
    		_rowNo++;
    	}
    })
    
    if(_subRows.length < 1){
    	$_jxc.alert('请选择要对账的单据');
    	return;
    }
    
    var _footerRow = gridHandel.getFooterRow();
    
    var reqObj = $('#checkForm').serializeObject();
    reqObj.operateType = operateType == "add" ? 1 : 0;
    
    //底部合计
    reqObj.payableAmount = _footerRow[0].payableAmount||0;
    reqObj.discountAmount = _footerRow[0].discountAmount||0
    reqObj.unpayAmount = _footerRow[0].unpayAmount||0
    
    reqObj.detailList = _subRows;
    
    $_jxc.ajax({
    	url:contextPath + '/settle/supplierCheck/saveCheckForm',
    	data:{"data":JSON.stringify(reqObj)}
    },function(result){
    	if(result['code'] == 0){
			$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/settle/supplierCheck/checkEdit?id="+result['formId'];
			});
        }else{
            $_jxc.alert(result['message']);
        }
    })
}

//审核
function auditSupChkForm(){
    //验证数据是否修改
    gridHandel.endEditRow();
    var newData = {
        remark:$("#remark").val()||'',                  // 备注
        payType:$('input[type="hidden"][name="payType"]').val()||'',//支付方式
        grid:$.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
    }

    if(!gFunComparisonArray(oldData,newData)){
    	$_jxc.alert("数据有修改，请先保存再审核");
        return;
    }
    var reqObj = {
    	id:$('#formId').val()||'',
    	branchId:$('#branchId').val()||''
    }
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/settle/supplierCheck/auditCheckForm",
		    	data:{"data":JSON.stringify(reqObj)}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/settle/supplierCheck/checkView?id=" + result["formId"];
	    			});
	    		}else{
	            	 $_jxc.alert(result['message'],'审核失败');
	    		}
		    } );
		}
	});
}

//删除
function delSupChkAccount(){
	var ids = [];
	ids.push($("#formId").val());
	$_jxc.confirm('是否要删除单据',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/settle/supplierCheck/deleteCheckForm",
		    	data:{"ids":ids}
		    },function(result){
	    		if(result['code'] == 0){
                    toRefreshIframeDataGrid("settle/supplierCheck/checkList","supperlierChkAccount");
	    			toClose();
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}


//校验机构配置
function checkBranchSpec(branchId){
	$_jxc.ajax({
    	url:contextPath+"/settle/supplierCheck/querySettleCheckMode",
    	data: {branchId:branchId}
    },function(result){
		if(result.checkMode == '0'){
			$_jxc.alert('当前选择机构未开启对账设置，不能创建对账单!');
			$('#openAccountBank').val('');
	    	//银行账户
	    	$('#bankAccount').val('');
	    	//办公地址
	    	$('#officeAddress').val('');
	    	//国税登记
	    	$('#nationalTaxRegNum').val('');
	    	//联系人
	    	$('#linkTel').val('');
	    	$("#supplierName").val('');
			$('#supplierName').addClass('uinp-no-more');
		}else{
			$('#supplierName').removeClass('uinp-no-more');
		}
    });
}
//校验是否存在未审核的对账单
function checkCheckAuditStutas(supplierId){
	var branchId = $('#branchId').val();
	var isContainChildren = $('#isContainChildren').val();
	var branchCompleCode = $('#branchCompleCode').val();
	$_jxc.ajax({
    	url:contextPath+"/settle/supplierCheck/queryCheckStatusNum",
    	data: {branchId:branchId,branchCompleCode:branchCompleCode,isContainChildren:isContainChildren,supplierId:supplierId}
    },function(result){
		
		if(result.unChNum > 0){
			$_jxc.alert('当前选择机构存在未审核的对账单，不能新增对账单!');
			$('#openAccountBank').val('');
	    	//银行账户
	    	$('#bankAccount').val('');
	    	//办公地址
	    	$('#officeAddress').val('');
	    	//国税登记
	    	$('#nationalTaxRegNum').val('');
	    	//联系人
	    	$('#linkTel').val('');
	    	$("#supplierName").val('');
		}else{
			// 设置供应商扩展信息
			setSupplierExtValue(supplierId);
			//初始化列表
			initCheckFormDetail();
		}
    });
}

//设置供应商扩展信息
function setSupplierExtValue(supplierId){
	$_jxc.ajax({
		url : contextPath + "/common/supplier/getSupplierExtById",
		data : {
			supplierId : supplierId
		}
	},function(data){
    	//开户银行
    	$('#openAccountBank').val((data.supplierExt.openAccountBank?data.supplierExt.openAccountBank:''));
    	//银行账户
    	$('#bankAccount').val((data.supplierExt.bankAccount?data.supplierExt.bankAccount:''));
    	//办公地址
    	$('#officeAddress').val((data.supplierExt.officeAddress?data.supplierExt.officeAddress:''));
    	//国税登记
    	$('#nationalTaxRegNum').val((data.supplierExt.nationalTaxRegNum?data.supplierExt.nationalTaxRegNum:''));
	});
}


function validateForm(branchId,supplierId){
    if(!$.trim(branchId)){
    	$_jxc.alert('请选择机构!');
    	return false;
    }
    if(!supplierId){
    	$_jxc.alert('请选择供应商!');
    	return false;
    }
    return true;
}
//初始化列表
function initCheckFormDetail(){
    var branchId = $('#branchId').val();
	var supplierId = $('#supplierId').val();
	var operateType = $('#operateType').val();
	var isContainChildren = $('#isContainChildren').val();
	if(!validateForm(branchId,supplierId))return;
    var paramsObj = {
    	branchId:branchId,
    	isContainChildren:isContainChildren,
		operateType : operateType == 'add' ? 1 : 2,
    	supplierId:supplierId
    }
	$("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").queryParams = paramsObj;
	$("#"+gridName).datagrid('options').url = contextPath + '/settle/supplierCheck/checkFormDetailList';
	$("#"+gridName).datagrid('load');
}

//返回列表页面
function back(){
	location.href = contextPath+"/settle/supplierCheck/checkList";
}

//新增供应商对账单
function addSupChkForm(){
	toAddTab("新增供应商对账单",contextPath + "/settle/supplierCheck/checkAdd");
}

//导出
function exportOrder(){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/settle/supplierCheck/exportSheet?page=SupplierCheck&sheetNo='+formId;
}