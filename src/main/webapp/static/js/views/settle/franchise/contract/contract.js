/**
 * 加盟店合同建立-新增编辑
 */
var dataGridId = "taxList";
var pageStatus = 'add';
var oldData = {}
var url;
$(function(){
    
    
    //新增
    if(!$('#formId').val()){
    	$('#createTime').text(new Date().format('yyyy-MM-dd hh:mm:ss'));
    }else{
    	//编辑
    	pageStatus = 'edit';
    	url = contextPath+"/settle/franchiseContract/getRuleList?formId="+$('#formId').val();
    	oldData = {
			formName:$('#formName').val(),
			validityTimeStart:$('#startTime').val(),
			validityTimeEnd:$('#endTime').val(),
			targetBranchId:$('#targetBranchId').val(),
			franchiseBranchId:$('#franchiseBranchId').val(),
			targetAgentName:$.trim($('#targetAgentName').val())||'',
			targetAgentPhone:$.trim($('#targetAgentPhone').val())||'',
			franchiseAgentName:$.trim($('#franchiseAgentName').val())||'',
			franchiseAgentPhone:$.trim($('#franchiseAgentPhone').val())||'',
			remark:$.trim($('#remark').val())||''
    	}
    }
    
    initContact();
    
    //甲方公司
    $('#companyA').branchSelect({
    	param:{
    		branchTypesStr:$_jxc.branchTypeEnum.BRANCH_COMPANY
    	},
    	onAfterRender:function(data){
    		$('#targetBranchId').val(data.branchId);
    	}
    })
    
    //乙方公司
    $('#companyB').branchSelect({
    	param:{
    		branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B+','+$_jxc.branchTypeEnum.FRANCHISE_STORE_C
    	},
    	onShowBefore:function(){
    		this.param.branchCompleCode = $('#branchCompleCode').val();
    		if(!$('#targetBranchId').val()){
    			$_jxc.alert('请先选择甲方(公司)');
    			return false;
    		}
    		return true;
    	},
    	onAfterRender:function(data){
    		$('#franchiseBranchId').val(data.branchId);
    		$('#franchiseBranchCode').val(data.branchCode);
    	}
    })
    
});
var gridHandel = new GridClass();

var gridDefault = {
	quotaStart:0
}

function initContact(){
    gridHandel.setGridName(dataGridId);
    $("#"+dataGridId).datagrid({
        align:'center',
        method:'get',
        url:url,
        singleSelect:false,  // 单选 false多选
        rownumbers:true,    // 序号
        showFooter:true,
        height:'200',
        width:'800',
        columns:[[
            {field:'cz',title:'操作',width:'60px',align:'center',
                formatter : function(value, row,index) {
                    var str = "";
                    str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
                        '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
                    return str;
                }
                
            },
            {field:'quotaStart',title:'毛利额度起',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	},
            	styler:function(value,row,index){
                	return 'background-color:#f2f2f2;';
                }
            },
            {field:'quotaEnd',title:'毛利额度止',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return value == "" || typeof value == "undefined" || value == null? '' : '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:2,
            			onChange:changeTaxEnd
            		}
            	}
            },
            {field:'targetAllocation',title:'甲方分配（%）',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return value == "" || typeof value == "undefined" || value == null? '' : '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			max:100,
            			prompt:'0.00~100.00',
            			precision:2,
            			onChange:changeTaxA
            		}
            	}
            },
            {field:'franchiseAllocation',title:'乙方分配（%）',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return value == "" || typeof value == "undefined" || value == null? '' : '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			max:100,
            			readonly:true,
            			precision:2,
            		}
            	},
            	styler:function(value,row,index){
                	return 'background-color:#f2f2f2;';
                }
            },
            {field:'remark',title:'备注',width:'200',align:'left',editor:'textbox'}
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("targetAllocation");
            }
        },
        onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
            if(pageStatus == 'edit'){
            	if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                        return $.extend(true,{},obj);//返回对象的深拷贝
                    });
                }
            }
        }
    });
    
    if(pageStatus == 'add'){
    	gridHandel.setLoadData([$.extend({},gridDefault)])
    }
}



// 插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    if(index > 2){
    	$_jxc.alert('最多只能添加4行毛利梯度');
    	return;
    }
    if(!checkTaxData(index))return;
    changeDefaultData(index);
    gridHandel.addRow(index,gridDefault);
}
// 删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}

//检验数据
function checkTaxData(index){
	gridHandel.endEditRow();
	var _quotaEnd = gridHandel.getFieldData(index,'quotaEnd');
	if(_quotaEnd == "" || typeof _quotaEnd == 'undefined'){
		$_jxc.alert('毛利额度止不能为空');
		return false;
	}
	if(parseFloat(_quotaEnd) == 0){
		$_jxc.alert('毛利额度止要大于0');
		return false;
	}
	
	var _targetAllocation = gridHandel.getFieldData(index,'targetAllocation');
	if(_targetAllocation == "" || typeof _targetAllocation == 'undefined'){
		$_jxc.alert('甲方分配百分比不能为空');
		return false;
	}
	return true;
}

//不能编辑小于当前行数的毛利额度止
function checkIfCanEdit(index){
	var _rows = $('#'+dataGridId).datagrid('getRows').length;
	if(index < (_rows-1))return false;
	return true;
}

//改变默认数据
function changeDefaultData(index){
	gridDefault.quotaStart = gridHandel.getFieldData(index,'quotaEnd');
}

//毛利额度止 监听
var chTaxEndFlag = false;
function changeTaxEnd(newV,oldV){
	if(chTaxFlag){
		chTaxFlag = false;
		return;
	}
	
	if(newV == ""){
		$_jxc.alert("毛利额度止不能为空");
		chTaxFlag = true;
		$(this).numberbox('setValue',oldV);
		return 
	}
	var _quotaStart = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'quotaStart');
	if(parseFloat(newV) <= parseFloat(_quotaStart)){
		$_jxc.alert("毛利额度止不能小于等于毛利额度起");
		chTaxFlag = true;
		$(this).numberbox('setValue',oldV);
		return 
	}
	
	//不是最后一行
	if(gridHandel.getSelectRowIndex() < ($('#'+dataGridId).datagrid('getRows').length-1)){
		var _nextQuotaEnd = gridHandel.getFieldData(gridHandel.getSelectRowIndex()+1,'quotaEnd');
		if(_nextQuotaEnd && parseFloat(newV) > parseFloat(_nextQuotaEnd)){
			$_jxc.alert("当前毛利额度止不能大于下一行的毛利额度止");
			chTaxFlag = true;
			$(this).numberbox('setValue',oldV);
			return;
		}
		$('#'+dataGridId).datagrid('updateRow',{
			index:gridHandel.getSelectRowIndex()+1,
			row: {
				quotaStart: newV
			}
		});
	}
}

//甲分配 监听
var chTaxFlag = false;
function changeTaxA(newV,oldV){
	if(chTaxFlag){
		chTaxFlag = false;
		return;
	}
	if(newV == ""){
		$_jxc.alert("甲方分配百分比不能为空");
		chTaxFlag = true;
		$(this).numberbox('setValue',oldV);
		return 
	}
	gridHandel.setFieldValue('franchiseAllocation',parseFloat(100-newV).toFixed(4));
}

// 保存
function saveContract(){
	//合同名称
	var _contactName = $.trim($("#formName").val());
	if(!_contactName){
		$_jxc.alert('合同名称不能为空');
		return;
	}
	//时间起
	var _startTime = $.trim($("#startTime").val());
	if(!_startTime){
		$_jxc.alert('合同有效期起不能为空');
		return;
	}
	//时间止
	var _endTime = $.trim($("#endTime").val());
	if(!_endTime){
		$_jxc.alert('合同有效期止不能为空');
		return;
	}
	//甲方公司
	var _companyA = $.trim($("#targetBranchId").val());
	if(!_companyA){
		$_jxc.alert('甲方(公司)不能为空');
		return;
	}
	//乙方公司
	var _companyB = $.trim($("#franchiseBranchId").val());
	if(!_companyB){
		$_jxc.alert('乙方(签约机构)不能为空');
		return;
	}
	
	var _ruleList = checkTaxListData();
	if(!_ruleList) return;
	
	var param = {
		formName:_contactName,
		validityTimeStart:_startTime,
		validityTimeEnd:_endTime,
		targetBranchId:_companyA,
		franchiseBranchId:_companyB,
		franchiseBranchCode:$('#franchiseBranchCode').val(),
		targetAgentName:$.trim($('#targetAgentName').val())||'',
		targetAgentPhone:$.trim($('#targetAgentPhone').val())||'',
		franchiseAgentName:$.trim($('#franchiseAgentName').val())||'',
		franchiseAgentPhone:$.trim($('#franchiseAgentPhone').val())||'',
		remark:$.trim($('#remark').val())||'',
		ruleList:_ruleList
	}

	console.log('param',param);
	
	var save_url = contextPath+"/settle/franchiseContract/contractSave";
	if($('#formId').val()){
		save_url = contextPath+"/settle/franchiseContract/contractUpdate";
		param.id = $('#formId').val();
		param.formNo = $('#formNo').val();
	}
	
	$_jxc.ajax({
    	url:save_url,
    	data:{"data":JSON.stringify(param)}
    },function(result){
		if(result['code'] == 0){
			$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/settle/franchiseContract/contractEdit?id="+result['formId'];
			});
		}else{
			$_jxc.alert(result['message']);
		}
    });
	
}


function checkTaxListData(){
	gridHandel.endEditRow();
	var _rows = $('#'+dataGridId).datagrid('getRows');
	var errorFlag = true;
	_rows.forEach(function(obj,index){
		if((obj.quotaEnd == '' || typeof obj.quotaEnd == 'undefined') && _rows.length != index + 1){
			$_jxc.alert("毛利梯度第"+(index+1)+"行 毛利额度止不能为空");
			errorFlag = false;
			return errorFlag;
		}
		if(parseFloat(obj.quotaEnd) < parseFloat(obj.quotaStart)){
			$_jxc.alert("毛利梯度第"+(index+1)+"行 毛利额度止不能小于毛利额度起");
			errorFlag = false;
			return errorFlag;
		}
		if(typeof obj.targetAllocation == 'undefined' || obj.targetAllocation == ''){
			$_jxc.alert("毛利梯度第"+(index+1)+"行 甲方分配百分比不能为空");
			errorFlag = false;
			return errorFlag;
		}
		
		//去掉最后一行毛利额度止
		if(index == _rows.length-1){
			obj.quotaEnd = '';
		}
	})
	
	if(!errorFlag)return false;
	
	return _rows;
}


//审核加盟店合同
function checkContract(){
	gridHandel.endEditRow();
	var newData = {
		formName:$('#formName').val(),
		validityTimeStart:$('#startTime').val(),
		validityTimeEnd:$('#endTime').val(),
		targetBranchId:$('#targetBranchId').val(),
		franchiseBranchId:$('#franchiseBranchId').val(),
		targetAgentName:$.trim($('#targetAgentName').val())||'',
		targetAgentPhone:$.trim($('#targetAgentPhone').val())||'',
		franchiseAgentName:$.trim($('#franchiseAgentName').val())||'',
		franchiseAgentPhone:$.trim($('#franchiseAgentPhone').val())||'',
		remark:$.trim($('#remark').val())||'',
		grid:$.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
	}

    if(!gFunComparisonArray(oldData,newData)){
    	$_jxc.alert("数据有修改，请先保存再审核");
        return;
    }
	
	$_jxc.confirm('是否审核通过?',function(r){
		if(r){
			$_jxc.ajax({
		    	url : contextPath+"/settle/franchiseContract/contractAudit",
		    	data:{"formId":$('#formId').val()}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/settle/franchiseContract/contractEdit?id=" + result["formId"];
	    			});
	    		}else{
	            	 $_jxc.alert(result['message'],'审核失败');
	    		}
		    } );
		}
	})
}




/**
 * 返回领用单
 */
function back(){
	toClose();
}

