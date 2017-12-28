/**
 * Created by zhaoly on 2017/5/18.
 */

$(function () {
	
})

function initBranchInfo() {
    initGridBranchCost();
    getBranchInfo();
}

function getBranchInfo(){
	var branchId = $("#branchId").val(); 
    var httpUrl = contextPath+"/archive/branch/getBranchInfoById?branchId="+branchId;
    $.get(httpUrl,{},function (data) {
    	if(data.code != '0'){
    		$_jxc.alert("请求发送失败或服务器处理失败");
    		return;
    	}
    	
    	var rec = data.data;
        $.each(rec.branch,function(key,value){
            //普通的input(过滤branchCompleCode隐藏域赋值)
            if($("#formEdit #"+key).prop("tagName") == "INPUT"){
                if($("#formEdit #"+key).attr('type')=="checkbox"){
                    if(value){ //传到前端checkbox选中的值是true
                        $("#formEdit #"+key).attr("checked","checked");
                    }
                }else{
                        if($("#formEdit #"+key).hasClass('easyui-numberbox')){
                            $("#formEdit #"+key).numberbox('setValue', value);
                        }else{
                            if(key === "status"){
                                if(value == 1){
                                    $("#statusStr").val("运营中");
                                }else {
                                    $("#statusStr").val("已关闭");
                                }
                            }
                            
                            // 加价率，要乘以 100
                            if(key === "markupRate"){
                            	if(value){
                            		value = (parseFloat(value) * 100).toFixed(2);
                            	}
                            }

                            $("#formEdit #"+key).val(value);
                        }
                }
            }
            else if($("#formEdit #"+key).prop("tagName") =="TEXTAREA"){ //普通的textarea
                $("#formEdit #"+key).html(value);
            }
            else if($("#formEdit #"+key).prop("tagName") == "SELECT"){
                if(value != undefined && typeof (value) != "undefined"){
                    if(key=="offlineStatus"){
                        var data = $('#formEdit #offlineStatus').combobox('getData');
                        if (data.length > 0) {
                            $('#formEdit #offlineStatus').combobox('select', value.toString());
                        }
                    }

                    if(key=="deliverPriceSpec"){
                        var data = $('#formEdit #deliverPriceSpec').combobox('getData');
                        if (data.length > 0) {
                            $('#formEdit #deliverPriceSpec').combobox('select', value.toString());
                        }
                    }
                    if(key=="dyPriceSpec"){
                        var data = $('#formEdit #dyPriceSpec').combobox('getData');
                        if (data.length > 0) {
                            $('#formEdit #dyPriceSpec').combobox('select', value.toString());
                        }
                    }
                    if(key=="dcBranchId"){
                        var data = $('#formEdit #dcBranchId').combobox('getData');
                        if (data.length > 0) {
                            $('#formEdit #dcBranchId').combobox('select', value.toString());
                        }
                    }

                    if(key=="selectGoodsSpec"){
                        var data = $('#formEdit #selectGoodsSpec').combobox('getData');
                        if (data.length > 0) {
                            $('#formEdit #selectGoodsSpec').combobox('select', value.toString());
                        }
                    }
                    
                    $("#formEdit #"+key+" option").each(function(i,n){
                        if($(n).val() == value || $(n).val()==value.name){
                            $(n).attr("selected",true);
                        }
                    });
                }

            }
        });

        $("#gridEquipmentCost").datagrid("loadData", rec.deviceCostList.length>0?rec.deviceCostList:[$.extend({},gridDefault)]);
        $("#gridFitmentCost").datagrid("loadData", rec.decorateCostList.length>0?rec.decorateCostList:[$.extend({},gridDefault)]);
        $("#gridAmortizeCost").datagrid("loadData", rec.amortizeCostList.length>0?rec.amortizeCostList:[$.extend({},gridDefault)]);
    });
}



var gridDefault = {
    costAmount:0.00,
}

var gridFitmentCostHandel = new GridClass();
var gridEquipmentCostHandel = new GridClass();
var gridAmortizeCostHandel = new GridClass();

function initGridCostCommon(gridName) {
	
	var gridHandel;
	var costNameTitle = "";
	var changeAmount;

    if(gridName === "gridFitmentCost"){
    	gridHandel = gridFitmentCostHandel;
    	costNameTitle = "长期待摊费用";
    	changeAmount = changeFitmentAmount;

    }else if(gridName === "gridEquipmentCost"){
    	gridHandel = gridEquipmentCostHandel;
    	costNameTitle = "设备折旧费用";
    	changeAmount = changeEquipmentAmount;

    }else if(gridName === "gridAmortizeCost"){
    	gridHandel = gridAmortizeCostHandel;
    	costNameTitle = "累计摊销费用";
    	changeAmount = changeAmortizeAmount;
    }
    
    gridHandel.setGridName(gridName);
	
    $("#"+gridName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        height:'400px',
        width:'99%',
        showFooter:true,
        columns:[[
            {field:'cz',title:'操作',width:'60px',align:'center',
                formatter : function(value, row,index) {
                	if(row.isFooter){
			             return '<div class="ub ub-pc">合计</div> '
			         }
                    var str =  '<a name="add" class="add-line" data-gridName="'+gridName+'" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
                        '&nbsp;&nbsp;<a name="del" class="del-line" data-gridName="'+gridName+'" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';

                    return str;
                },
            },
            {field: 'costName', title: costNameTitle, width: 180, align: 'left',
                editor:{
                    type:'textbox',
                    options:{
                        required:false,
                        validType:{maxLength:[20]},
                    }
                }
            },
            {field: 'costAmount', title: '金额', width: 120, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        required:false,
                        min:0.00,
                        max:999999.99,
                        prompt:"最大金额999999.99",
                        precision:2,
                        onChange:changeAmount
                    }

                },
            },
            {field: 'costAvgYear', title: '均摊年限', width: 80, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '';
                    }
                    return '<b>'+parseInt(value||0)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        required:false,
                        min:0,
                        max:99,
                        precision:0,
                        onChange:changeAvgYear
                    }
                },
            },
            {field: 'startTime', title: '起算时间', width: 150, align: 'center',
            	formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '';
                    }
                    return value;
                },
                editor:{
                    type:'datebox',
                    options:{
                        required:false,
                    	editable:true,
                    	formatter:function(date){
                    		var y = date.getFullYear();
                    		var m = date.getMonth()+1;
                    		var d = date.getDate();
                    		return y+'-'+ (m<10?'0'+m:m) + '-'+ (d<10?'0'+d:d);
                    	}
                    }
                },
            },
            {field: 'remark', title: '备注', width: 180, align: 'left',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[20]},
                    }
                }
            },
        ]],
        loadFilter:function(data){
            //显示现实数据转换 后台不返回 rows 节点结构啦 2.7
        	data = $_jxc.gridLoadFilter(data);
        	
        	data.forEach(function(obj,index){
        		if(obj && obj.startTime){
        			obj.startTime = new Date(obj.startTime).format('yyyy-MM-dd')
        		}
        	});
        	return data;
        },
        onClickCell:function(rowIndex,field,value){
        	gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridFitmentCostHandel.getFieldTarget(field);
            if(target){
            	gridHandel.setFieldFocus(target);
            }else{
            	gridHandel.setSelectFieldName("costName");
            }
        },
        onLoadSuccess : function(data) {
        	gridHandel.setDatagridHeader("center");
        	updateCommonCostFooter(gridHandel);
        }
    })
}

if(gridName === "gridFitmentCost"){
	gridHandel = gridFitmentCostHandel;
	costNameTitle = "长期待摊费用";
}else if(gridName === "gridEquipmentCost"){
	gridHandel = gridEquipmentCostHandel;
	costNameTitle = "设备折旧费用";
}else if(gridName === "gridAmortizeCost"){
	gridHandel = gridAmortizeCostHandel;
	costNameTitle = "累计摊销费用";
}

var avgYear = false;
function changeAvgYear(newV,oldV){
	if(avgYear){
		avgYear = true;
		return ;
	}
	if(parseInt(newV) > 99){
		$_jxc.alert('均摊年限不能大于99');
		$(this).numberbox('setValue',oldV||0);
		return;
	}
	if(parseInt(newV) < 1){
		$_jxc.alert('均摊年限不能小于1');
		$(this).numberbox('setValue',oldV||0);
		return;
	}
}

//累计摊销费用
function changeFitmentAmount(){
	updateCommonCostFooter(gridFitmentCostHandel);
}
function changeEquipmentAmount(){
	updateCommonCostFooter(gridEquipmentCostHandel);
}
function changeAmortizeAmount(){
	updateCommonCostFooter(gridAmortizeCostHandel);
}

//累计摊销费用 合计
function updateCommonCostFooter(handel){
	var fields = {costAmount:0};
    var argWhere = {}
    handel.updateFooter(fields,argWhere);
}

function initGridFitmentCost() {
	initGridCostCommon("gridFitmentCost");
}

function initGridEquipmentCost() {
	initGridCostCommon("gridEquipmentCost");
}


function initGridAmortizeCost() {
	initGridCostCommon("gridAmortizeCost");
}

function initGridBranchCost() {
    initGridFitmentCost();
    initGridEquipmentCost();
    initGridAmortizeCost();
}

//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    var gridName = $(event.target).attr('data-gridName');
    if(gridName === "gridFitmentCost"){
        gridFitmentCostHandel.addRow(index,gridDefault);
    }else if(gridName === "gridEquipmentCost"){
        gridEquipmentCostHandel.addRow(index,gridDefault);
    }else if(gridName === "gridAmortizeCost"){
        gridAmortizeCostHandel.addRow(index,gridDefault);
    }

}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    var gridName = $(event.target).attr('data-gridName');
    // if(index === "0"){
    //     $("#"+gridName).datagrid("endEdit", index);
    //     $("#"+gridName).datagrid("deleteRow",index);
    //     // $("#"+gridName).datagrid("loadData",[gridDefault]);
    //     return;
    // }
    if(gridName === "gridFitmentCost"){
        gridFitmentCostHandel.delRow(index);
    }else if(gridName === "gridEquipmentCost"){
        gridEquipmentCostHandel.delRow(index);
    }else if(gridName === "gridAmortizeCost"){
        gridAmortizeCostHandel.delRow(index);
    }
}

// 设备折旧费用
function saveEquipmentCostList(){
	saveBranchCostCommon("gridEquipmentCost");
}

// 累计摊销费用
function saveAmortizeCostList(){
	saveBranchCostCommon("gridAmortizeCost");
}

// 长期待摊费用
function saveFitmentCostList(){
	saveBranchCostCommon("gridFitmentCost");
}

function saveBranchCostCommon(gridName) {
    var gridHandel;
    if(gridName === "gridFitmentCost"){
    	gridHandel = gridFitmentCostHandel;
    }else if(gridName === "gridEquipmentCost"){
    	gridHandel = gridEquipmentCostHandel;
    }else if(gridName === "gridAmortizeCost"){
    	gridHandel = gridAmortizeCostHandel;
    }
    
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    //验证备注的长度 20个字符
    var isValid = $("#gridFrom"+gridName).form('validate');
    if (!isValid) {
        return;
    }
    var formData = {};
    var isCheckResult = true;
    var costList = gridHandel.getRows();
    $.each(costList,function (index,item) {
        if(typeof (item.id) !="undefined"){
            if($_jxc.isStringNull(item.costName)){
                $_jxc.alert('第'+(index+1)+'行费用名称不能为空')
                isCheckResult = false;
                return false;
            }

            if($_jxc.isStringNull(item.costAmount)){
                $_jxc.alert('第'+(index+1)+'行费用金额不能为空')
                isCheckResult = false;
                return false;
            }

            if(parseFloat(item.costAmount).toFixed(2) <= 0){
                $_jxc.alert('第'+(index+1)+'行费用金额不能为0')
                isCheckResult = false;
                return false;
            }
            
            if($_jxc.isStringNull(item.costAvgYear)){
                $_jxc.alert('第'+(index+1)+'行费用均摊年数不能为空')
                isCheckResult = false;
                return false;
            }
            
            if(parseInt(item.costAvgYear) <= 0){
                $_jxc.alert('第'+(index+1)+'行费用均摊年数金额不能小于0')
                isCheckResult = false;
                return false;
            }
            
            if($_jxc.isStringNull(item.startTime)){
                $_jxc.alert('第'+(index+1)+'行起算时间不能为空')
                isCheckResult = false;
                return false;
            }
            
            if(new Date(item.startTime) == 'Invalid Date'){
            	$_jxc.alert('第'+(index+1)+'行起算时间格式异常')
                isCheckResult = false;
                return false;
            }

        } else{
        	
        	if($_jxc.isStringNull(item.costName)){
                $_jxc.alert('第'+(index+1)+'行费用名称不能为空')
                isCheckResult = false;
                return false;
            }
        	

            if($_jxc.isStringNull(item.costAmount)){
                $_jxc.alert('第'+(index+1)+'行费用金额不能为空')
                isCheckResult = false;
                return false;
            }

            if(parseFloat(item.costAmount).toFixed(2) <= 0){
                $_jxc.alert('第'+(index+1)+'行费用金额不能为0')
                isCheckResult = false;
                return false;
            }
            
            if($_jxc.isStringNull(item.costAvgYear)){
                $_jxc.alert('第'+(index+1)+'行费用均摊年数不能为空')
                isCheckResult = false;
                return false;
            }
            
            if(parseInt(item.costAvgYear) <= 0){
                $_jxc.alert('第'+(index+1)+'行费用均摊年数金额不能小于0')
                isCheckResult = false;
                return false;
            }
            
            if($_jxc.isStringNull(item.startTime)){
                $_jxc.alert('第'+(index+1)+'行起算时间不能为空')
                isCheckResult = false;
                return false;
            }
            
            if(new Date(item.startTime) == 'Invalid Date'){
            	$_jxc.alert('第'+(index+1)+'行起算时间格式异常')
                isCheckResult = false;
                return false;
            }
        }

    })

    if(!isCheckResult) return;
    
    costList = gridHandel.getRowsWhere({costName:1});
    
    if(costList.length <= 0){
    	$_jxc.alert('请添加费用');
        return;
    }
    
    costList = transferDate(costList);
    
    if(gridName === "gridFitmentCost"){
    	formData.decorateCostList = costList;
    }else if(gridName === "gridEquipmentCost"){
    	formData.deviceCostList = costList;
    }else if(gridName === "gridAmortizeCost"){
    	formData.amortizeCostList = costList;
    }
    
    var branchId = $("#branchId").val(); 
    formData.branchId = branchId;

    var dataJson = JSON.stringify(formData);

    $_jxc.ajax({
        url:contextPath+"/archive/branch/updateBranchCost",
        data:dataJson,
        contentType:'application/json',
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("保存成功！");
            getBranchInfo();
        }else{
            $_jxc.alert(result['message']);
        }
    });
}

function transferDate(costList){
	$.each(costList,function (index,item) {
   	 	if(typeof (item.startTime) !="undefined"){
   	 		item.startTime = item.startTime + " 00:00:00";
   	 	}
	});
	return costList;
}

function saveBranch() {
    var formData = $('#formEdit').serializeObject();

    if(formData.costAvgYear <= 0 || formData.costAvgYear > 999999){
        $_jxc.alert("费用均摊年数不能小于0或者大于999999");
        return;
    }


    if(!formData.costAvgYear){
        formData.costAvgYear = null;
    }

    if(!formData.distriPriceType){
        formData.distriPriceType = null;
    }

    $_jxc.ajax({
        url:contextPath+"/archive/branch/updateBranch",
        data:formData
    },function(result){
        if(result['code'] == 0){
            $_jxc.alert("保存成功！");
        }else{
            $_jxc.alert(result['message']);
        }
    });
}