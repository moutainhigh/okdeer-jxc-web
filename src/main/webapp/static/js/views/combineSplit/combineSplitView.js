/**
 * Created by wxl on 2016/10/12.
 * 库存调整-编辑
 */
var splicViewGID = 'combineSplitView';
var editNumFlag = 1;
var maxNum = 999999.99;
var oldData;
$(function(){
    initDatacombineSplitView();
    oldData = {
       	totalNum:$("#totalNum").val()    // 数量
    }
    if($("#close").val()){
    	$("#addButton").addClass("unhide");
    	$("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
    }
});

function changeAmount(newV,oldV){
	if(newV > maxNum){
		newV = maxNum;
		$(this).numberbox('setValue',newV);
	}
	var temp_amout = newV*$("#salePriceMain").val() 
	$("#amountMain").val(parseFloat(temp_amout).toFixed(4));
	specialRows('realNum',newV);
	updateFooter();
}

//批量设置
function specialRows(id,val){
	var rowIndex = -1;
	var newData = $("#"+splicViewGID).datagrid("getRows");
	if(id=="realNum"){
		for(var i = 0;i < newData.length;i++){
			var _tempNum = parseFloat(newData[i].oldRealNum * val);
			newData[i].realNum= _tempNum;
			newData[i].amount= parseFloat(_tempNum * newData[i].salePrice).toFixed(4);
			rowIndex = $("#"+splicViewGID).datagrid('getRowIndex',newData[i]);
			// 更新行数据
			$("#"+splicViewGID).datagrid('updateRow',{
				index: rowIndex,
				row: newData[i]
			});
			// 刷新行
			$("#"+splicViewGID).datagrid('refreshRow',rowIndex);
		}
	}
}

function getFiledsList(){
	if(edit == '0'){
		return [[
                 {field:'ck',checkbox:true},
                 {field:'skuId',hidden:'true'},
                 {field:'skuCode',title:'货号',width:'70px',align:'left',
                     formatter : function(value, row,index) {
                         var str = "";
                         if(row.isFooter){
                             str ='<div class="ub ub-pc">合计</div> '
                         }else{
                             str = value;
                         }
                         return str;
                     }},
                 {field:'skuName',title:'商品名称',width:'200px',align:'left'},
                 {field:'unit',title:'单位',width:'60px',align:'left'},
                 {field:'realNum',title:'数量',width:'80px',align:'right',
                 	 formatter:function(value,row){
                         if(row.isFooter){
                             return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                         }
                         if(!value||value==""){
                       	   value = "0.00";
                         }
                         return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                     },
                     editor:{
                   	  type:'numberbox',
                     	  options:{
                     		  min:0,
                     		  precision:4,
                     		  onChange:onChangeRealNum
                     	  }
                   }
                 },
                 {field:'salePrice',title:'单价',width:'80px',align:'right',
                     formatter:function(value,row,index){
                         if(row.isFooter){
                             return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                         }
                         if(!value||value==""){
                             row["salePrice"] = parseFloat(value||0).toFixed(4);
                         }
                         return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                     },
                 },
                 {field:'amount',title:'金额',width:'80px',align:'right',
                     formatter:function(value,row,index){
                         if(row.isFooter){
                             return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                         }
                         if(!value||value==""){
                             row["amount"] = parseFloat(value||0).toFixed(4);
                         }
                         return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                     },
                 },
                 {field:'remark',title:'备注',width:'400px',align:'left',
                	 editor:{
                		 type:'textbox'
                	 }
                 }
             ]]
	}else{
		return [[
                 {field:'ck',checkbox:true},
                 {field:'skuId',hidden:'true'},
                 {field:'skuCode',title:'货号',width:'70px',align:'left',
                     formatter : function(value, row,index) {
                         var str = "";
                         if(row.isFooter){
                             str ='<div class="ub ub-pc">合计</div> '
                         }else{
                             str = value;
                         }
                         return str;
                     }},
                 {field:'skuName',title:'商品名称',width:'200px',align:'left'},
                 {field:'unit',title:'单位',width:'60px',align:'left'},
                 {field:'realNum',title:'数量',width:'80px',align:'right',
                     formatter:function(value,row,index){
                         if(row.isFooter){
                             return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                         }
                         if(!value||value==""){
                             row["realNum"] = parseFloat(value||0).toFixed(4);
                         }
                         return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                     },
                 },
                 {field:'salePrice',title:'单价',width:'80px',align:'right',
                     formatter:function(value,row,index){
                         if(row.isFooter){
                             return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                         }
                         if(!value||value==""){
                             row["salePrice"] = parseFloat(value||0).toFixed(4);
                         }
                         return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                     },
                 },
                 {field:'amount',title:'金额',width:'80px',align:'right',
                     formatter:function(value,row,index){
                         if(row.isFooter){
                             return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                         }
                         if(!value||value==""){
                             row["amount"] = parseFloat(value||0).toFixed(4);
                         }
                         return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                     },
                 },
                 {field:'remark',title:'备注',width:'200px',align:'left'}
             ]]
	}
}


var gridDefault = {
    realNum:0,
    largeNum:0,
    isGift:0,
}
var oldData = {};
var gridHandel = new GridClass();
function initDatacombineSplitView(){
    gridHandel.setGridName(splicViewGID);
    gridHandel.initKey({
        firstName:'realNum',
        enterName:'realNum',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("realNum");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('realNum'));
                },100)
            }
        },
    })
    var formId = $("#formId").val();
    $("#"+splicViewGID).datagrid({
        method:'get',
    	url:contextPath+"/stock/combineSplit/getCombineSplitDetailList?id="+formId,
        align:'center',
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:getFiledsList(),
        onClickCell:function(rowIndex,field,value){
        	gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("realNum");
            }
        },
        onLoadSuccess:function(data){
        	if(data && data.rows && data.rows.length > 0){
        		data.rows.forEach(function(obj,index){
        			obj.oldRealNum = obj.stockNum;
        		})
        	};
        	if(!oldData["grid"]){
            	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
            		return $.extend(true,{},obj);//返回对象的深拷贝
            	});
            }
            gridHandel.setDatagridHeader("center");
            updateFooter();
        }
    });

}

function updateFooter(){
    var fields = {realNum:0};
    var argWhere = {}
    gridHandel.updateFooter(fields,argWhere);
}

//监听商品数量
function onChangeRealNum(newV,oldV) {
	if("" == newV){
	  $_jxc.alert("商品数量输入有误");
	  gridHandel.setFieldValue('realNum',oldV);
      return;
	}else if(newV > maxNum){
		newV = maxNum
		gridHandel.setFieldValue('realNum',newV);
	}
	var _selecIndex = gridHandel.getSelectRowIndex();
	var _tempRows = gridHandel.getRows();
	var _tempData = _tempRows[_selecIndex];
	if(_tempData){
		_tempData.amount = parseFloat(newV*_tempData.salePrice).toFixed(4);
	}
    updateFooter();
}

//删除
function deleteCombineSplit(){
	var id = $("#formId").val();
	var ids = [id];
	$_jxc.confirm('是否要删除此条数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/stock/combineSplit/deleteCombineSplit",
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


//保存
function saveCombineSplit(){
	var mainNum = $("#totalNum").numberbox('getValue');
	if(!mainNum || !$.trim(mainNum)){
		$_jxc.alert("请输入主商品数量");
		return;
	}
	if(parseFloat(mainNum)==0){
		$_jxc.alert("主商品数量不能为0");
		return;
	}
	$("#"+splicViewGID).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var isCheckResult = true;
    var isChcekPrice = false;

    if(isCheckResult){
        if(isChcekPrice){
            $_jxc.confirm("新单价存在为0，是否确定保存?",function(r){
                if (r){
                    saveDataHandel(rows);
                }
            });
        }else{
            saveDataHandel(rows);
        }
    }
}

function saveDataHandel(rows){
	var id = $("#id").val();
	// 主商品Id
	var skuId = $("#skuIdMain").val();
	// 主商品编号
	var skuCode = $("#skuCodeMain").val();
	// 机构
	var branchId =$("#branchId").val();
	// 组合或拆分
	var formType = $("#formType").val();
    //商品名称
    var skuName = $("#skuNameMain").val();
    //数量
    var totalNum = $("#totalNum").val();
    //单价
    var salePrice=$("#salePriceMain").val();
    //金额
    var amount=$("#amountMain").val();
    // 备注
    var remark = $("#remark").val();
    
    var tempRows = [];
    //创建一个主商品，当组合拆分单的明细一项，并设置调整单商品明细类型为1主商品
    var masterStock = {
    		realNum: totalNum,
    		largeNum:0,
    		originalPrice:0,
    		price:salePrice,
    		skuDetailType:1,
    		skuId:skuId,
    		skuCode:skuCode,
    		amount:amount,
    		remark:remark,
    		salePrice:salePrice
    };
    tempRows.push(masterStock);
    // 成分商品
    $.each(rows,function(i,data){
        var temp = {
        	realNum: data.realNum,
        	largeNum:0,
    		originalPrice:0,
    		price:data.salePrice,
        	skuDetailType:2,
        	skuId:data.skuId,
        	skuCode:data.skuCode,
        	amount:data.amount,
        	remark:data.remark,
        	salePrice:data.salePrice

        }
        tempRows.push(temp);
    });
    var jsonData = {
    		id:id,
    		io:1,
    		skuId:skuId,
    		skuCode:skuCode,
    		createBranchId:branchId,
    		formType:formType,
        	skuName:skuName,
        	totalNum:totalNum,
        	salePrice:salePrice,
        	amount:amount,
            remark:remark,
            stockFormDetailList:tempRows
        };
    
    $_jxc.ajax({
        url:contextPath+"/stock/combineSplit/updateCombineSplit",
        data:{"data":JSON.stringify(jsonData)}
    },function(result){
        if(result['code'] == 0){
			$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/stock/combineSplit/combineSplitView?id="+id;
			});
        }else{
            $_jxc.alert(result['message']);
        }
    });
}

//审核
function auditCombineSplit(){
	//验证数据是否修改
    $("#"+gridHandel.getGridName()).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var id = $("#formId").val();
    var newData = {
    	totalNum:$("#totalNum").val(), //  数量
        grid:gridHandel.getRows(),
    }
    
    if(!gFunComparisonArray(oldData,newData)){
        $_jxc.alert("数据已修改，请先保存再审核");
        return;
    }
    
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/stock/combineSplit/auditCombineSplit",
		    	data : {
		    		id : id
		    	}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/stock/combineSplit/combineSplitView?id="+id;
	    			});
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}


//合计
function toFooter(){
	$('#combineSplitView').datagrid('reloadFooter',[{"isFooter":true,"receivablesAccount":$('#receivablesAccount').val()||0,"collectAccount":$('#collectAccount').val()||0}]);
}

/**
 * 返回库存调整
 */
function back(){
	toClose();
}