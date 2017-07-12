
var maxNUMBER = 999999.99;

$(function(){
	//开始和结束时间
    $("#planTime").val(dateUtil.getCurrentDate().format("yyyy-MM"));
    initStorePlanList();
    //机构选择初始化
    $('#branchSelect').branchSelect({
    	onAfterRender:function(data){
    		//修改机构重设表格数据
    		gridHandel.setLoadData(getInitDate())
    	}
    });
});

function getInitDate(){
	var source_data = [];
	var _dataV = $('#planTime').val();
	var _year = _dataV.split('-')[0];
	for(var i = 1;i <= 12; i++){
		source_data.push({
				month:_year+'-'+(i<10?'0'+i:i),
				monthAmount:0,
				dateAmount:0,
				cost_monthCount:0,
				on_datePrice:0,
				up_dataPrice:0,
				cost_data:0
			});
	}
	return source_data;
}

var gridHandel = new GridClass();

var datagridId = 'storePlanList';
//初始化表格 没有成本价权限
function initStorePlanList(){
	gridHandel.setGridName(datagridId);
	
	gridHandel.initKey({
		firstName:'on_datePrice',
	});
	
    dg = $("#"+datagridId).datagrid({
        method:'post',
        align:'right',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        data:getInitDate(),
        showFooter:true,
		height:'100%',
		pageSize:50,
		width:'100%',
        columns:[[
            {field:'month',title:'月份',align:'left',width: 120,
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<p class="ub ub-ac ub-pe uc-red">年目标销售合计:</p>';
            		}
            		return value;
            	}
            },
            {field:'monthAmount',title:'月目标销额合计',align:'right',width: 120,
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<b class="ub ub-ac " id="yearCount">1000</b>';
            		}
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field:'dateAmount',title:'日均目标销售合计',align:'right',width: 120,
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<p class="ub ub-ac ub-pe uc-red">线上目标销售合计:</p>';
            		}
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field:'cost_monthCount',title:'月目标成本合计',align:'right',width: 120,
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<b class="ub ub-ac " id="onCount">1000</b>';
            		}
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            },
            {field:'on_datePrice',title:'线上日均销售金额',align:'right',width: 120,
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<p class="ub ub-ac ub-pe uc-red">线下目标销售合计:</p>';
            		}
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                	type:'numberbox',
                	options:{
                		min:0,
                		precision:4,
                		onChange:changeOnDatePrice
                	}
                }
            },
            {field:'up_dataPrice',title:'线下日均目标销售金额',align:'right',width: 120,
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<b class="ub ub-ac " id="upCount">1000</b>';
            		}
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                	type:'numberbox',
                	options:{
                		min:0,
                		precision:4,
                		onChange:changeUpDatePrice
                	}
                }
            },
            {field:'cost_data',title:'日均目标成本金额',align:'right',width: 120,
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '';
            		}
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                	type:'numberbox',
                	options:{
                		min:0,
                		precision:4,
                		onChange:changeDatePrice
                	}
                }
            }
        ]],
        onClickCell:function(rowIndex,field,value){
        	if(!checkBranch())return;
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("on_datePrice");
            }
        },
        onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }       
    });
}

//监听线上日均销售金额
var editErrorOD = false;
function changeOnDatePrice(newV,oldV){
	if(editErrorOD){
		editErrorOD = false;
		return;
	}
	
	if(newV > maxNUMBER){
		$_jxc.alert('金额不得大于 '+maxNUMBER);
		editErrorOD = true;
		$(this).numberbox('setValue',oldV);
		return;
	}
	
	calculateMoney();
	updateFooter();
}

//监听线下日均销售金额
var editErrorUD = false;
function changeUpDatePrice(newV,oldV){
	if(editErrorUD){
		editErrorUD = false;
		return;
	}
	if(newV > maxNUMBER){
		$_jxc.alert('金额不得大于 '+maxNUMBER);
		editErrorUD = true;
		$(this).numberbox('setValue',oldV)
	}
	
	calculateMoney();
	updateFooter();
}

//监听线上日均销售金额
var editError = false;
function changeDatePrice(newV,oldV){
	if(editError){
		editError = false;
		return;
	}
	if(newV > maxNUMBER){
		$_jxc.alert('金额不得大于 '+maxNUMBER);
		editError = true;
		$(this).numberbox('setValue',oldV)
	}
	
	//设值 月目标成本合计
	var _month = gridHandel.getSelectRowIndex()+1;
	gridHandel.setFieldsData({cost_monthCount:getNumberByMonth(_month,newV)});
}

//计算相关价格
function calculateMoney(){
	//线上
	var _onPriceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'on_datePrice');
	//线下
	var _upPriceValue = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'up_dataPrice');
	
	var _temPrice = parseFloat(_onPriceValue)+parseFloat(_upPriceValue);

	//设值 日均目标销售合计
	gridHandel.setFieldsData({dateAmount:_temPrice});
	  
	//设值 月目标销售合计
	var _month = gridHandel.getSelectRowIndex()+1;
	gridHandel.setFieldsData({monthAmount:getNumberByMonth(_month,_temPrice)});
}

//根据月份计算
function getNumberByMonth(month,number){
	var _dataV = $('#planTime').val();
	var _year = _dataV.split('-')[0];//年
	if(month == 2){
		//平年 28天月
		if(0 == _year%4 && (_year%100 !=0 || _year%400 == 0)){
			return parseFloat(number)*29;
		}else{
			return parseFloat(number)*28;
		}
		
	}
	//31天月
	if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12 ){
		return parseFloat(number)*31;
	}
	//30天月
	if(month == 4 || month == 6 || month == 9 || month == 11){
		return parseFloat(number)*30;
	}
}

//检验机构
function checkBranch(){
	if(!$.trim($("#branchName").val())){
	    $_jxc.alert("请选择机构");
	    return false;
	 } 
	 return true;
}

//合计
function updateFooter(){
    gridHandel.updateFooter({},{});
    
    //年目标销售合计
    var _yearCount = 0;
    //线上目标销售合计
    var _onCount = 0;
    //线下目标销售合计
    var _upCount = 0;
    
    var _rows = gridHandel.getRows();
    _rows.forEach(function(obj,index){
    	if(obj){
    		_yearCount += parseFloat(obj.monthAmount||0);
    		_onCount   += getNumberByMonth(index+1,parseFloat(obj.on_datePrice||0));
    		_upCount   += getNumberByMonth(index+1,parseFloat(obj.up_dataPrice||0));
    	}
    });
    		
    $('#yearCount').text(_yearCount.toFixed(2));
    $('#onCount').text(_onCount.toFixed(2));
    $('#upCount').text(_upCount.toFixed(2));
}


//保存 门店计划
function savePlan(){
	if(!checkBranch())return;
	gridHandel.endEditRow();
	var _rows = gridHandel.getRows();
	var _errorFlag = false;
	_rows.forEach(function(obj,index){
		if(obj){
			if(parseFloat(obj.on_datePrice||0) > 0 || parseFloat(obj.up_dataPrice||0) > 0 || parseFloat(obj.cost_data||0) > 0 ){
				_errorFlag = true;
			}
		}
	});
	if(!_errorFlag){
		$_jxc.alert('计划不能为空');
		return ;
	}
	
	console.log('_rows',_rows)
	
}

//查询入库单
function queryForm(){
	 if($("#branchName").val()==""){
	    $_jxc.alert("请选择店铺名称");
	    return;
	 } 
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
	fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)
	$("#"+datagridId).datagrid("options").method = "post";
	$("#"+datagridId).datagrid('options').url = contextPath + '/storeDaySale/report/getStoreDaySaleList';
	$("#"+datagridId).datagrid('load', fromObjStr);
}


//新增门店计划
function addPlan(){
	toAddTab("新增门店计划",contextPath + "/target/storePlan/toAdd");
}

/**
 * 导出
 */
function exportData(){
	var length = $('#storeDaySale').datagrid('getData').total;
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
	var length = $("#"+datagridId).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	
	$("#queryForm").form({
		success : function(data){
			if(data==null){
				$_jxc.alert("导出数据成功！");
			}else{
				$_jxc.alert(JSON.parse(data).message);
			}
		}
	});
	$("#queryForm").attr("action",contextPath+"/storeDaySale/report/exportList?"+fromObjStr);
	$("#queryForm").submit();
}

/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
	 $("#saleTime").val(dateUtil.getCurrentDate().format("yyyy-MM"));
};