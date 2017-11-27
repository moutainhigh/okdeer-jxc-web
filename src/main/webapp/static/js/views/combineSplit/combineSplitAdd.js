var combineSplitEditDg;
var datagridId = "combineSplitEditGrid";
var maxNum = 999999.99;
$(function(){
	$("#createBranchName").val(sessionBranchCodeName);
	$("#createBranchId").val(sessionBranchId);
	$("#createTime").html(new Date().format('yyyy-MM-dd hh:mm'));
    //开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    //初始化列表
    initCombineSplieEditGrid();
    
});

function selectTion(newV,oldV){
	$("#skuIdMain").val("");
	$("#skuCodeMain").val("");
	$("#skuNameMain").val("");
	$("#salePriceMain").val("");
	$("#totalNum").numberbox('clear');
	$("#amountMain").val("");
	$("#"+datagridId).datagrid({data:[]});
}

function changeAmount(newV,oldV){
	if(newV > maxNum){
		newV = maxNum;
		$(this).numberbox('setValue',newV);
	}
	var temp_amout = newV*$("#salePriceMain").val() 
	$("#amountMain").val(parseFloat(temp_amout).toFixed(4));
	specialRows('componentNum',newV);
	updateFooter();
}

var gridHandel = new GridClass();

var gridDefault = {
	componentNum:0,
}

function initCombineSplieEditGrid() {
	gridHandel.setGridName(datagridId);
    gridHandel.initKey({
        firstName:'componentNum',
        enterName:'componentNum',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("componentNum");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('componentNum'));
                },100)
            }
        },
    })
     combineSplitEditDg=$("#"+datagridId).datagrid({
        method: 'post',
        align: 'center',
        url: '',
        singleSelect: true,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        height:'100%',
        pageSize:20,
        showFooter:true,
        columns: [[
			{
				field : 'ck',
				checkbox : true
			},
            {field: 'skuCode', title: '货号', width: '135px', align: 'left',
            	formatter : function(value, row,index) {
                   if(row.isFooter){
                    	return '<div class="ub ub-pc">合计</div> '
                    }else{
                    	return value;
                    }
                }
            },
            {field: 'skuName', title: '商品名称', width:'180px', align: 'left'},
            {field: 'componentNum', title: '数量', width:'100px', align: 'left',
            	formatter:function(value,row,index){
                    if(row.isFooter){
                        return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    if(!value||value==""){
                        row["componentNum"] = parseFloat(value||0).toFixed(4);
                    }
                    return  '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    value:'0',
                    options:{
                        min:0,
                        precision:4,
                        onChange: onChangeRealNum,
                    }
                },
            },
            {field: 'unit', title: '单位', width:'90px', align: 'left'},
            {field: 'salePrice', title: '单价', width:'90px', align: 'left'},
            {field: 'amount', title: '金额', width:'90px', align: 'left'},
            {field: 'remark', title: '备注', width: '250px', align: 'left',
                editor:{
                    type:'textbox',
                    options:{
                        validType:{maxLength:[20]},
                    }
                }
            }
        ]],
        onClickCell : function(rowIndex, field, value) {
			gridHandel.setBeginRow(rowIndex);
			gridHandel.setSelectFieldName(field);
			var target = gridHandel.getFieldTarget(field);
			if(target){
				gridHandel.setFieldFocus(target);
			}else{
				gridHandel.setSelectFieldName("componentNum");
			}
		},
         onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
            updateFooter();
         }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)]);
}

//监听商品数量
function onChangeRealNum(newV,oldV) {
	if("" == newV){
	  $_jxc.alert("商品数量输入有误");
	  gridHandel.setFieldValue('componentNum',oldV);
      return;
	}else if(newV > maxNum){
		newV = maxNum
		gridHandel.setFieldValue('componentNum',newV);
	}
	var _selecIndex = gridHandel.getSelectRowIndex();
	var _tempRows = gridHandel.getRows();
	var _tempData = _tempRows[_selecIndex];
	if(_tempData){
		_tempData.amount = parseFloat(newV*_tempData.salePrice).toFixed(4);
	}
    updateFooter();
}

function updateFooter(){
    var fields = {componentNum:0};
    var argWhere = {}
    gridHandel.updateFooter(fields,argWhere);
}

//选择商品
function selectGoods(searchKey){
	selectGoodsDialog(searchKey);
}

/**
 * 商品选择
 */
function selectGoodsDialog(searchKey) {
	var branchId=null;
	//判定供应商是否存在
    if($("#createBranchId").val()==""){
        $_jxc.alert("请先选择机构");
        return;
    }
    branchId=$("#createBranchId").val();
	gFunGoodsSelect(searchKey,branchId);
}

//商品选择 公共使用
function gFunGoodsSelect(searchKey,branchId){
	var comboxV = $("#formType").combobox('getValue');
	var param = {goodsTypeList:comboxV,branchId:branchId,isRadio:1, formType:'IX',}
    new publicGoodsServiceTem(param,function(data){
		  	if(data.length==0){
	            return;
	        }
		  	if(data.length > 1){
	    		$_jxc.alert('只能选择一个组合商品');
	    		return;
	    	}
		  	var type = data[0].type? data[0].type.name:'';
	    	if(type=='MAKINGCOMBINATION'){
	    		type = 1;
	    	}
	    	if(type=='MAKINGRESOLUTION'){
	    		type = 2;
	    	}
	    	if(comboxV == 1 && type != comboxV){
	    		$_jxc.alert('选择商品不是组合商品');
	    		return;
	    	}
	    	if(comboxV == 2 && type != comboxV){
	    		$_jxc.alert('选择商品不是拆分商品');
	    		return;
	    	}
	    	$("#skuIdMain").val(data[0].skuId);
	    	$("#skuCodeMain").val(data[0].skuCode);
	    	$("#skuNameMain").val(data[0].skuName);
	    	$("#salePriceMain").val(data[0].salePrice);
	    	$("#totalNum").numberbox('setValue',1);
	    	$("#amountMain").val(parseFloat(data[0].salePrice).toFixed(4));
	    	//查询成分商品
	    	selectView($("#skuIdMain").val());
	  });
}

/**
 * 机构列表下拉选
 */
function selectBranch (){
	new publicAgencyService(function(data){
		$("#createBranchId").val(data.branchesId);
		$("#createBranchName").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}
//根据选中skuid查询价格、库存
function selectView(searchskuId){
	$_jxc.ajax({
		url  : contextPath + "/stock/combineSplit/getGoodsComponentDetailList",
		data : {
			"skuId" : searchskuId,
			"branchId" :$("#createBranchId").val()
		}
	},function(result){
		if (result.length > 0) {
			setDataValue(result);
		} else {
			// result.length <0 清空数据
			$("#"+datagridId).datagrid('loadData', {
				total : 0,
				rows : []
			});
		}
	});
}
// 二次查询设置值
function setDataValue(data) {
	if(!data ||  data.length <1 )return;
	data.forEach(function(obj,index){
		if(obj){
			obj.amount = parseFloat(obj.salePrice*obj.componentNum).toFixed(4);
			obj.oldComponentNum = obj.componentNum;
		}
	})
    var nowRows = gridHandel.getRowsWhere({skuName:'1'});
    var addDefaultData  = gridHandel.addDefault(data);
    var keyNames ={};
    var rows = gFunUpdateKey(addDefaultData,keyNames);
   /* var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);*/
    gridHandel.setLoadData(rows);
   
}

//批量设置
function specialRows(id,val){
	var rowIndex = -1;
	var newData = $("#"+datagridId).datagrid("getRows");
	if(id=="componentNum"){
		for(var i = 0;i < newData.length;i++){
			var _tempNum = parseFloat(newData[i].oldComponentNum * val);
			newData[i].componentNum= _tempNum;
			newData[i].amount= parseFloat(_tempNum * newData[i].salePrice).toFixed(4);
			rowIndex = $("#"+datagridId).datagrid('getRowIndex',newData[i]);
			// 更新行数据
			$("#"+datagridId).datagrid('updateRow',{
				index: rowIndex,
				row: newData[i]
			});
			// 刷新行
			$("#"+datagridId).datagrid('refreshRow',rowIndex);
		}
	}
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
    $("#"+datagridId).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        $_jxc.alert("表格不能为空");
        return;
    }
    var isCheckResult = true;
    var isChcekPrice = false;

    //验证备注的长度 20个字符
    var isValid = $("#gridFrom").form('validate');
    if (!isValid) {
        return;
    }

    $.each(rows,function(i,v){
        /*if(parseFloat(v["costPrice"])<=0){
            isChcekPrice = true;
        }*/
    });
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
	// Id
	var id = $("#id").val();
	// 主商品Id
	var skuId = $("#skuIdMain").val();
	// 主商品编号
	var skuCode = $("#skuCodeMain").val();
	// 机构
	var branchId =$("#createBranchId").val();
	// 组合或拆分
	var formType = $("#formType").combobox('getValue');
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
    // 原因
    var reason = $("input[name='reason']").val()  
    
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
        	realNum: data.componentNum,
        	largeNum:0,
    		originalPrice:0,
    		price:data.salePrice,
        	skuDetailType:2,
        	skuId:data.componentSkuId,
        	skuCode:data.skuCode,
        	amount:data.amount,
        	remark:data.remark,
        	salePrice:data.salePrice

        }
        tempRows.push(temp);
    });
    var jsonData = {
    		id:id,
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
        url:contextPath+"/stock/combineSplit/saveCombineSplit",
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
