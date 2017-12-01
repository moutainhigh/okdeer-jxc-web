/**
 * Created by 
 * 加盟店费用-新增 修改
 */

//默认数据
var gridDefault = {
		amount:0,
		io:1
}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "franchiseChargeListAdd";
var pageStatus;
var branchId;
//最大值最小值校验
var maxNumber = 999999.99;
var minNumber = -999999.99;

$(function(){
    pageStatus = $('#operateType').val();
	if(pageStatus === 'add'){
		  $("#payMoneyTime").val(new Date().format('yyyy-MM-dd')); 
		  $('#createTime').text(new Date().format('yyyy-MM-dd hh:mm'));
		// 机构默认有值
		  if(sessionBranchType == '4' || sessionBranchType == '5'){
			$('#branchId').val(sessionBranchId);
			$('#branchCode').val(sessionBranchCode);
			$('#targetBranchName').val(sessionBranchCodeName)
		  }
	}else {
		var formId = $("#formId").val();
		url = contextPath+"/settle/franchiseCharge/getDetailList?formId="+formId;
		oldData = {
		    remark:$("#remark").val(),                  // 备注
		    payTime:$('#payMoneyTime').val()
		}
	}
	initSupAdvMonAdd();
	
	if(pageStatus === 'add'){
		//机构选择初始化
		$('#branchComponent').branchSelect({
			//ajax请求参数
			param:{
				branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B
			},
			onAfterRender:function(){
				gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
				                        $.extend({},gridDefault),$.extend({},gridDefault)]);
			},
			loadFilter:function(data){
				data.franchiseBranchId = data.branchesId;
				return data;
			}
		});
	}
})

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
function initSupAdvMonAdd(){
    gridHandel.setGridName(gridName);
    gridHandel.initKey({
        firstName:'value',
        enterName:'value',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("io");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('io'));
                },100)
            }else{
            	selectCharge(arg);
            }
        },
    })

    $("#"+gridName).datagrid({
        method:'get',
    	url:url,
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:"100%",
        width:'100%',
        columns:[[
			{field:'cz',title:'操作',width:'60px',align:'center',
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            str ='<div class="ub ub-pc">合计</div> '
			        }else{
			            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
			                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
			        }
			        return str;
			    }
			},
            {field:'id',hidden:'true'},
            {field:'value',title:'编号',width: '100px',align:'left',editor:'textbox'},
            {field:'label',title:'名称',width:'200px',align:'left'},
            {field:'io',title:'收支方式',width:'80px',align:'center',
            	formatter:function(value,row){
            		if(row.isFooter){
            			return "";
            		}
                    return value=='-1'?'支出':(value=='1'?'收入':'请选择');
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        editable:false,
                        panelHeight:80,
                        data: [{
                        	"id":'1',
                            "text":"收入",
                        },{
                        	"id":'-1',
                        	"text":"支出",
                        }],
                        onSelect:onSelect
                    }
                }
            },
            {field:'amount',title:'费用金额',width:'100px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!row.amount){
                    	row.amount = parseFloat(value||0).toFixed(4);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        precision:4,
                        onChange: onChangeAmount,
                    }
                }
            },
            {field:'remark',title:'备注',width:'250px',align:'left',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[20]},
                    }
                }
            }
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("value");
            }
        },
        
        onLoadSuccess:function(data){
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
    
    if(pageStatus=='add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
    }
}

var editFlag = 'numberbox';

//选择收支方式
function onSelect(data){
	editFlag = 'select';
	var _io = parseFloat(data.id);
	var _amount = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'amount');
	gridHandel.setFieldsData({io:_io});
	gridHandel.setFieldValue('amount',(parseFloat(_amount)*-1).toFixed(4));
	
}

var editErrorFlag = false;
//编辑金额
function onChangeAmount(vewV,oldV){
	var _io = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'io');
	//-1 支出 1收入
	if((_io == -1 && parseFloat(vewV) > 0) || (_io == 1 && parseFloat(vewV) < 0) ){
		gridHandel.setFieldValue('amount',parseFloat(vewV*-1).toFixed(4));  
		return;
	}
	
	if(editErrorFlag){
		editErrorFlag = false;
		return;
	}
	
	if(vewV > maxNumber){
		$_jxc.alert('最大费用金额不得大于 '+maxNumber);
		editErrorFlag = true;
		$(this).numberbox('setValue',parseFloat(oldV) < 0 ? 0 : parseFloat(oldV));
	}
	
	if(vewV < minNumber){
		$_jxc.alert('最小费用金额不得小于 '+minNumber);
		editErrorFlag = true;
		$(this).numberbox('setValue',parseFloat(oldV) > 0 ? 0 : parseFloat(oldV));
	}
	
	updateFooter()
}
//合计
function updateFooter(){
    var fields = {amount:0};
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

function validateForm(branchId,payTime){
    if(!$.trim(branchId)){
    	$_jxc.alert('加盟店信息不能为空');
    	return false;
    }
    if(!payTime){
    	$_jxc.alert('付款日期信息不能为空');
    	return false;
    }
    return true;
}

//保存
function saveFraChargeOrder(){
	$("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
	var branchId = $('#branchId').val();
	var payTime = $('#payMoneyTime').val();
	if(!validateForm(branchId,payTime))return;
    var rows = gridHandel.getRowsWhere({label:'1'});
    if(rows.length==0){
    	$_jxc.alert("表格不能为空");
        return;
    }
    
    var valiaFlag = true;
    var _rows = [];
    $.each(rows,function(i,data){
    	if(parseFloat(data.amount) == 0){
    		$_jxc.alert('第 '+(i+1)+' 行费用金额不能为零');
    		valiaFlag = false;
    		return false;
    	}
    	_rows.push({
    		payType:data.id,
    		io:data.io,
    		rowNo:i+1,
    		amount:data.amount,
    		remark:data.remark
    	})
    })
    if(!valiaFlag){
    	return false;
    }

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }
  
    var footRow = gridHandel.getFooterRow();
    if(footRow.length >0 && footRow[0].amount ==0 ){
    	$_jxc.alert("合计该单据不能为零，请修改。");
    	return;
    }
    
    var reqObj = {
    	id:$('#formId').val()||'',
    	franchiseBranchId:$('#branchId').val()||'',
    	branchCode:$('#branchCode').val()||'',
    	payTime:payTime||'',
    	formType:'FI',
    	remark:$('#remark').val()||'',
    	sumAmount:footRow[0].amount,
    	detailList:_rows
    }
    var url = $("#operateType").val() == 'add' ? contextPath+"/settle/franchiseCharge/chargeSave" : contextPath+"/settle/franchiseCharge/chargeUpdate";
    $_jxc.ajax({
        url:url,
        data:{"data":JSON.stringify(reqObj)}
    },function(result){
        if(result['code'] == 0){
			$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/settle/franchiseCharge/chargeEdit?id="+result['formId'];
			});
        }else{
        	$_jxc.alert(result['message']);
        }
    });
	
}

//审核
function auditFraChargeForm(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
    	remark:$("#remark").val(),                  // 备注
 		payTime:$('#payMoneyTime').val(),
        grid:$.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
    }

    if(!gFunComparisonArray(oldData,newData)){
    	$_jxc.alert("数据有修改，请先保存再审核");
        return;
    }
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/settle/franchiseCharge/chargeAudit",
		    	data:{"formId":$('#formId').val()||''}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/settle/franchiseCharge/chargeView?id=" + result["formId"];
	    			});
	    		}else{
	            	 $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//删除
function delFraChargeForm(){
	var ids = [];
	ids.push($("#formId").val());
	$_jxc.confirm('是否要删除单据',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/settle/franchiseCharge/chargeDelete",
		    	data:{"ids":ids},
		    },function(result){
	    		if(result['code'] == 0){
                    toRefreshIframeDataGrid("settle/franchiseCharge/chargeList","franchiseAdvMoneyList");
	    			toClose();
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//选择费用
function selectCharge(searchKey){
	var branchId = $('#branchId').val();
	var payTime = $('#payMoneyTime').val();
	if(!validateForm(branchId,payTime))return;
	
	var param = {
		key:searchKey,
		type:'101002'
	};
	publicCostService(param,function(data){
		var nowRows = gridHandel.getRowsWhere({label:'1'});
		var addDefaultData = gridHandel.addDefault(data,gridDefault);
		var keyNames = {};
		var rows = gFunUpdateKey(addDefaultData,keyNames);
		var newRows = gridHandel.checkDatagrid(nowRows,rows,{},{});
		$("#"+gridName).datagrid("loadData",newRows);
		setTimeout(function(){
	        gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
	        gridHandel.setSelectFieldName("io");
	        gridHandel.setFieldFocus(gridHandel.getFieldTarget('io'));
	    },100)
	});
}

//导出
function exportOrder(){
	var formId = $("#formId").val();
	window.location.href = contextPath + '/settle/franchiseCharge/exportSheet?page=FranchiseCharge&sheetNo='+formId;
}

//返回列表页面
function back(){
	location.href = contextPath+"/settle/franchiseCharge/chargeList";
}

//新增加盟店费用
function addFraChargeForm(){
	toAddTab("新增加盟店费用",contextPath + "/settle/franchiseCharge/chargeAdd");
}
