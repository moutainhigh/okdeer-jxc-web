/**
 * Created by zhanghuan on 2016/08/09.
 * 档案-商品维护-调价单
 */
// datagridId datagrid的Id
var datagridId = "addModifyPriceGrid";

// 是否保存过添加的单据数据的标志位
var isClickSaveData = false;
// datagrid对象
var addModifyPriceGridDg;

var loginBranchId;

var oldData = {}; //审核数据变化判断

$(function() {
    loginBranchId = $("#loginBranchId").val();

    hidePageElement();

    // 初始化表格
    initAddModifyPriceGridEdit();
    // 初始化复选框
    initCheckbox();

    if($("#close").val()){
        $("#addButton").addClass("unhide");
        $("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
    }

    var formNo = $("#formNo").text();
    if (formNo != null && formNo != '') {
    	oldData = {
    		branchId:$('#branchId').val()||'',
    		effectDate:$('#effectDate').val()||'',
    		remark:$('#remark').val()||'',
    		purchasePrice:$('#purchasePrice').prop('checked'),
    		retailPrice:$('#retailPrice').prop('checked'),
    		memberPrice:$('#memberPrice').prop('checked'),
    		distributionPrice:$('#distributionPrice').prop('checked'),
    		tradePrice:$('#tradePrice').prop('checked')
    	}
        gFunStartLoading();
        initGridData(formNo);
    }
    // 已审核
    var status = $("#status").val();
    if (status == 1) {
        // input禁用,a标签移除事件，增加“已审核”标志
        datagridUtil.readOnlyInput();
    }
    
    initBrancSelect();

});

//初始化机构选择
function initBrancSelect(){
	$('#branchGroup').branchSelect({
    	param:{
    		selectType:1, //数据选择模式类型  null/''/0-->单选(默认)   1多选
    		view:'group', //分组
    	},
    	onAfterRender:function(data){
    		if(data && data.length>0){
    			var ids = [];
    			data.forEach(function(obj,inx){
    				if(obj.type == -1){
    					ids.push(obj.branchId);
    				}
    			})
    			if(ids.length == 0) return;
    			var param = {
    				"groupIds":ids.join(',')
    			}
    			//拉取分组详细
    			publicGetBranchGroupDetail(param,function(result){
    				$('#branchId').val(result&&result.branchId);
    				oldData.branchId = result&&result.branchId;
    				
    				$('#branchShopName').attr('title',result&&result.branchName);
    				$('#branchsFullName').val(result&&result.branchName)
    			})
    		}
     	}
    })
}



function hidePageElement() {
    if(hasPurchasePrice==false){
        $("#purchasePrice").removeProp("checked");
        $("#purchasePrice").prop("disabled","disabled");
    }
    if(hasWholesalePrice==false){
        $("#tradePrice").removeProp("checked");
        $("#tradePrice").prop("disabled","disabled");
    }
    if(hasDistributionPrice==false){
        $("#distributionPrice").removeProp("checked");
        $("#distributionPrice").prop("disabled","disabled");
    }

}

//加载数据
function initGridData(formNo){
    $_jxc.ajax({
        url : contextPath + "/goods/priceAdjust/queryDetailsByformNo",
        data : {
            "formNo" : formNo
        }
    },function(data){
//        gFunEndLoading();
        if (data != null || data != '') {
            //计算原毛利率、新毛利率
            calcSaleRate(data);
            $("#"+datagridId).datagrid("loadData",data);
        }
    });
}

var gridDefault = {
//	oldPurPrice:0.00,
//	oldDcPrice:0.00,
//	oldVipPrice:0.00,
//	oldWsPrice:0.00,
//	oldSalePrice:0.00
    oldSaleRate:"0.00%",
    newSaleRate:"0.00%"
}
var editRowData = null;
var gridHandel = new GridClass();
// 初始化列表
function initAddModifyPriceGridEdit() {
    gridHandel.setGridName(datagridId);
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("skuCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
                },100)
            }else{
                selectGoods(arg);
            }

        },
    });
    addModifyPriceGridDg = $("#" + datagridId).datagrid({
        singleSelect:true,  //单选  false多选
//        checkOnSelect:true,
//        selectOnCheck:true,
        rownumbers:true,    //序号
        pagination:false,    //分页
        fitColumns:true,    //每列占满
        align:'center',       //占满
        showFooter:true,
        width:'100%',
        height:'100%',
        columns : [ [
            {
                field : 'ck',
                checkbox : true
            },
            {
                field : 'formId',
                hidden : true
            },
            {
                field : 'skuId',
                hidden : true
            },
            {
                field : 'cz',
                title : '操作',
                width : '60px',
                align : 'left',
                formatter : function(value, row, index) {
                    var str = '<a name="add" class="add-line" data-index="'
                        + index
                        + '" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;'
                        + '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'
                        + index
                        + '" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
                    return str;
                },
            }, {
                field : 'skuCode',
                title : '货号',
                width : '120px',
                align : 'left',
                editor : 'textbox'
            }, {
                field : 'skuName',
                title : '商品名称',
                width : '200px',
                align : 'left'
            }, {
                field : 'barCode',
                title : '条码',
                width : '130px',
                align : 'left'
            }, {
                field : 'spec',
                title : '规格',
                width : '90px',
                align : 'left'
            }, {
                field : 'unit',
                title : '单位',
                width : '60px',
                align : 'left'
            }, {
                field : 'oldPurPrice',
                title : '原进货价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["oldPurPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            }, // 进价
            {
                field : 'newPurPrice',
                title : '新进货价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["newPurPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor : {
                    type : 'numberbox',
                    options : {
                        min:0,
                        precision:4,
                        onChange:changeNewPurPrice
                    }
                }
            },
            {
                field : 'oldSalePrice',
                title : '原零售价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["oldSalePrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {
                field : 'oldSaleRate',
                title : '原毛利率',
                width : '120px',
                align : 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!value){
                        value = "0.00%";
                    }else{
                        row['oldSaleRate'] = value;
                    }
                    return '<b>'+value+'</b>';
                },
            },

            // 售价
            {
                field : 'newSalePrice',
                title : '新零售价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["newSalePrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor : {
                    type : 'numberbox',
                    options : {
                        min:0,
                        precision:4,
                        onChange:changeNewSalePrice
                    }
                }
            },
            {
                field : 'newSaleRate',
                title : '新毛利率',
                width : '120px',
                align : 'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!value){
                        value = "0.00%";
                    }else{
                        row['newSaleRate'] = value;
                    }
                    return '<b>'+value+'</b>';
                },
                editor : {
                    type : 'textbox',
                    options:{
                        disabled:true,
                    }
                }
            },
            {
                field : 'oldDcPrice',
                title : '原配送价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["oldDcPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            }, // 配送价
            {
                field : 'newDcPrice',
                title : '新配送价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["newDcPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor : {
                    type : 'numberbox',
                    options : {
                        min:0,
                        precision:4,
                    }
                }
            }, {
                field : 'oldWsPrice',
                title : '原批发价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["oldWsPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            }, // 批发价
            {
                field : 'newWsPrice',
                title : '新批发价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return ;
                    }
                    if(!value){
                        row["newWsPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor : {
                    type : 'numberbox',
                    options : {
                        min:0,
                        precision:4,
                    }
                }
            }, {
                field : 'oldVipPrice',
                title : '原会员价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["oldVipPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            }, // 会员价
            {
                field : 'newVipPrice',
                title : '新会员价',
                width : '120px',
                align : 'right',
                formatter : function(value, row, index) {
                    if(!value){
                        row["newVipPrice"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor : {
                    type : 'numberbox',
                    options : {
                        min:0,
                        precision:4,
                    }
                }
            } ] ],
        onClickCell : function(rowIndex, field, value) {
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("skuCode");
            }
        },
        onBeforeEdit:function (rowIndex, rowData) {
            editRowData = $.extend(true,{},rowData);
        },
        onAfterEdit:function(rowIndex, rowData, changes){
            if(typeof(rowData.id) === 'undefined'){
                // $("#"+gridName).datagrid('acceptChanges');
            }else{
                if(editRowData.skuCode != changes.skuCode){
                    rowData.skuCode = editRowData.skuCode;
                    gridHandel.setFieldTextValue('skuCode',editRowData.skuCode);
                }
            }
        },
        onLoadSuccess : function(data) {
            gridHandel.setDatagridHeader("center");
            datagridUtil.isCheckBoxChecked("purchasePrice");// 进价
            datagridUtil.isCheckBoxChecked("retailPrice");// 零售价
            datagridUtil.isCheckBoxChecked("tradePrice");// 批发价
            datagridUtil.isCheckBoxChecked("memberPrice");// 会员价
            datagridUtil.isCheckBoxChecked("distributionPrice");// 配送价
            
            var formNo = $("#formNo").text();
            if (formNo != null && formNo != '') {
            	if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                        return $.extend(true,{},obj);//返回对象的深拷贝
                    });
                }
            }
        }
    });

    var param = {
        wholesalePrice:["oldWsPrice","newWsPrice"],
        purchasePrice:["oldPurPrice","newPurPrice","oldSaleRate","newSaleRate"],
        distributionPrice:["oldeDcPrice","newDcPrice"],
        vipPrice:["oldVipPrice","newVipPrice"],
        salePrice:["oldSalePrice","newSalePrice"],
    }
    priceGrantUtil.grantPrice(datagridId,param);
    gridHandel.setLoadData([$.extend({},gridDefault)]);
}
//新进货价
function changeNewPurPrice(newVal,oldVal) {
    var newSalePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'newSalePrice');
    var newSaleRate = ((newSalePrice-newVal)/newSalePrice*100).toFixed(2)+"%"
    gridHandel.setFieldTextValue('newSaleRate',newSaleRate);
}
//新零售价
function changeNewSalePrice(newVal,oldVal) {
    if(newVal==0 || newVal === '0' || isNaN(parseFloat(newVal))){
        gridHandel.setFieldTextValue('newSaleRate','0.00%');
        return;
    }
    var newPurPrice = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'newPurPrice');
    var newSaleRate = ((newVal-newPurPrice)/parseFloat(newVal)*100).toFixed(2)+"%"
    gridHandel.setFieldTextValue('newSaleRate',newSaleRate);

}
//初始化复选框
function initCheckbox(){
    // 进价
    $("#purchasePrice").on("click", function() {
        datagridUtil.isCheckBoxChecked("purchasePrice");
    });
    // 零售价
    $("#retailPrice").on("click", function() {
        datagridUtil.isCheckBoxChecked("retailPrice");
    });
    // 批发价
    $("#tradePrice").on("click", function() {
        datagridUtil.isCheckBoxChecked("tradePrice");
    });
    // 会员价
    $("#memberPrice").on("click", function() {
        datagridUtil.isCheckBoxChecked("memberPrice");
    });
    // 配送价
    $("#distributionPrice").on("click", function() {
        datagridUtil.isCheckBoxChecked("distributionPrice");
    });

    datagridUtil.isCheckBoxChecked("purchasePrice");// 进价
    datagridUtil.isCheckBoxChecked("retailPrice");// 零售价
    datagridUtil.isCheckBoxChecked("tradePrice");// 批发价
    datagridUtil.isCheckBoxChecked("memberPrice");// 会员价
    datagridUtil.isCheckBoxChecked("distributionPrice");// 配送价
}

// 新增
function addModifyDataGrid() {
    // 如果页面为空，则不需要提示，只有页面都输入值，才校验是否保存过数据
    if (datagridUtil.isSaveData()) {
        if (isClickSaveData) {
            window.location.href = contextPath
                + "/goods/priceAdjust/addFormView";
        } else {
            var d = $("<div />")
                .dialog(
                    {
                        title : '提示',
                        top : 20,
                        width : 350,
                        height : 150,
                        maximizable : false,
                        modal : true,
                        content : "<div class='upad-12 ufs-14'>页面内容有修改,是否保存? 点击是:保存,点击否:不保存,或点击取消不做任何处理...</div>",
                        buttons : [
                            {
                                text : '是',
                                handler : function() {
                                    window.location.href = contextPath
                                        + "/goods/priceAdjust/addFormView";
                                }
                            }, {
                                text : '否',
                                handler : function() {
                                    d.panel('destroy');
                                }
                            }, {
                                text : '取消',
                                handler : function() {
                                    d.panel('destroy');
                                }
                            } ]
                    });
        }
    } else {
        window.location.href = contextPath + "/goods/priceAdjust/addFormView";
    }
}
// 删单
function delModifyOrderDialog() {
    // 是否选择的datagrid的行，选择为true，未选择为false，则提示用户选择
    // 确定删除，调用后台删除方法
    var formNo = $('#formNo').text();
    if (formNo) {
        $_jxc.confirm('单据删除后将无法恢复，确认是否删除？', function(r) {
            if (r) {
                //删除单据
                $_jxc.ajax({
                    url: contextPath+"/goods/priceAdjust/removeForm",
                    data: {"formNo":formNo}
                },function(data){
                   window.location.href = contextPath + "/goods/priceAdjust/addFormView";
                });
            }
        });
    }else{
        $_jxc.alert('没有单据可以删除');
    }
}

// 保存单据
function saveModifyPriceOrder() {
    //gFunStartLoading();
    // 判断用户是否选择区域，选择为true，未选择为false，则提示用户选择
    if (datagridUtil.isSelectArea()) {
        // datagrid是否存在数据，存在为true，不存在为false，则提示用户输入
        if (datagridUtil.isHasDataGrid()) {
            var formData = $('#searchForm').serializeObject();
            var detailList =  getDatagridRows();
            if(detailList.length>1000){
                $_jxc.alert("保存数据不能超过1000条");
                gFunEndLoading();
                return;
            }
            if(detailList.length==0){
                $_jxc.alert("表格不能为空");
                gFunEndLoading();
                return;
            }

            var indexsStr = "";
            var priceStr = "";
            if($('#memberPrice').is(':checked')){
                for(var i=0;i<detailList.length;i++){
                    var item = detailList[i];
                    if(parseFloat(item["newVipPrice"]) <= 0){
                        indexsStr = indexsStr +(i+1)+",";
                    }
	                if(parseFloat(item["newSalePrice"]) < parseFloat(item["newVipPrice"])){
                        priceStr = priceStr +(i+1)+",";
	                }
            	}
            }
            
            var saveUrl = contextPath + "/goods/priceAdjust/saveForm";

            if(indexsStr.length > 0){
                $_jxc.confirm("第"+indexsStr+"行，新会员价小于等于0,是否继续?",function (r) {
                    if (!r)return;

                    if(priceStr.length > 0){
                        $_jxc.confirm("第"+priceStr+"行，会员价大于零售价,是否继续?",function (r) {
                            if (!r)return;
                            saveCommon(formData, detailList, saveUrl);
                        })
                    }else {
                        saveCommon(formData, detailList, saveUrl);
                    }
                });
            }else{

                if(priceStr.length > 0){
                    $_jxc.confirm("第"+priceStr+"行，会员价大于零售价,是否继续?",function (r) {
                        if (!r)return;
                        saveCommon(formData, detailList, saveUrl);
                    })
                }else {
                    saveCommon(formData, detailList, saveUrl);
                }
            }

        }
    }
}

function saveCommon(formData, detailList, url){
	if (datagridUtil.isCheckPrice()) {
        if(datagridUtil.isCheckRemark()){
            var params = {
                goodsPriceForm:formData,
                goodsPriceFormDetailList:detailList,
                branchIds:$("#branchId").val()
            }
            var reqObj = JSON.stringify(params);
            // 调用后台保存方法，成功提示
            $_jxc.ajax({
                url : url,
                data :reqObj,
                contentType : "application/json",
            },function(data){
                if (data.code == 0) {
                    isClickSaveData = true;
                    // 代表点击过保存单据数据
                    $_jxc.alert('单据保存成功！',function() {
                        //保存成功后 跳转页面
                        window.location.href = contextPath+"/goods/priceAdjust/showDetail?formNo="+data.goodsPriceForm.formNo
                    });
                } else {
                    // 失败提示
                    $_jxc.alert(data.message);
                }
            });
        }
    }
}


// 修改调价单
function updateModifyPriceOrder() {
    // 判断用户是否选择区域，选择为true，未选择为false，则提示用户选择
    if (datagridUtil.isSelectArea()) {
        // datagrid是否存在数据，存在为true，不存在为false，则提示用户输入
        var formData = $('#searchForm').serializeObject();
        var detailList =  getDatagridRows();
        if(detailList.length>1000){
            $_jxc.alert("保存数据不能超过1000条");
            return;
        }
        if(detailList.length==0){
            $_jxc.alert("表格不能为空");
            return;
        }

        var indexsStr ="";
        var priceStr = "";
        if($('#memberPrice').is(':checked')){
            for(var i=0;i<detailList.length;i++){
                var item = detailList[i];
                if(parseFloat(item["newVipPrice"]) <= 0){
                    indexsStr = indexsStr +(i+1)+",";
                };

                if(parseFloat(item["newSalePrice"]) < parseFloat(item["newVipPrice"])){
                    priceStr = priceStr +(i+1)+",";
                }
            }
        }
        
        var saveUrl = contextPath + "/goods/priceAdjust/updateForm";

        if(indexsStr.length > 0){
            $_jxc.confirm("第"+indexsStr+"行，新会员价小于等于0,是否继续?",function (r) {
                if (!r)return;

                if(priceStr.length > 0){
                    $_jxc.confirm("第"+priceStr+"行，会员价大于零售价,是否继续?",function (r) {
                        if (!r)return;
                        saveCommon(formData, detailList, saveUrl);
                    })
                }else {
                    saveCommon(formData, detailList, saveUrl);
                }
            })
        }else{
            if(priceStr.length > 0){
                $_jxc.confirm("第"+priceStr+"行，会员价大于零售价,是否继续?",function (r) {
                    if (!r)return;
                    saveCommon(formData, detailList, saveUrl);
                })
            }else {
                saveCommon(formData, detailList, saveUrl);
            }
        }



    }
}

/**
 * 审核
 */
function check() {
    var formNo = $("#formNo").text();
    
    $("#"+datagridId).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
    	branchId:$('#branchId').val()||'',
		effectDate:$('#effectDate').val()||'',
		remark:$('#remark').val()||'',
		purchasePrice:$('#purchasePrice').prop('checked'),
		retailPrice:$('#retailPrice').prop('checked'),
		memberPrice:$('#memberPrice').prop('checked'),
		distributionPrice:$('#distributionPrice').prop('checked'),
		tradePrice:$('#tradePrice').prop('checked'),
        grid:$.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
    }
    if(!gFunComparisonArray(oldData,newData)){
    	$_jxc.alert("数据有修改，请先保存再审核");
        return;
    }
    // 通过审核
    var status = 1;
    var effectDate = $("#effectDate").val();
    checkForm(formNo, status,effectDate);
}
// 审核
function checkForm(formNo, status,effectDate) {
	
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		        url : contextPath + "/goods/priceAdjust/checkForm",
		        data : {
		            formNo : formNo,
		            status : status,
		            effectDate:effectDate
		        }
		    },function(data){
		        if (data.code > 0) {
		            $_jxc.alert(data.message);
		        } else {
		            $_jxc.alert('单据审核成功！',function() {
		                window.location.href = contextPath
		                    + "/goods/priceAdjust/showDetail?formNo=" + formNo;
		            });
		        }

		    });
		}
	});
    
}

// datagrid的常用操作方法
var datagridUtil = {
    /**
     * 如果页面为空，则不需要提示，只有页面都输入值，才校验是否保存过数据
     *
     * @returns {boolean}
     */
    isSaveData : function() {
        if ($.trim($("#areaInput").val())!= ""
            && $.trim($("#branchId").val())!= ""
            && $("#" + datagridId).datagrid("getData").rows.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 备注不能超过125个字
     *
     * @returns {boolean}
     */
    isCheckRemark : function() {
        var remark = $("#remark").val();
        if(remark.length>125){
            $_jxc.alert('备注信息不能超过125个字');
            return false;
        }else{
            return true;
        }
    },
    /**
     * 判断用户是否选择区域，选择为true，未选择为false，则提示用户选择
     *
     * @returns {boolean}
     */
    isSelectArea : function() {
        if ($("#branchId").val().trim() == "") {
            $_jxc.alert('请先选择机构');
            gFunEndLoading();
            return false;
        } else {
            return true;
        }
    },
    /**
     * 判断用户是否选择调价设置
     *
     * @returns {boolean}
     */
    isCheckPrice : function() {
        var isCheckPrice=false;
        $("#checkBoxPrice").find("input[type='checkbox']").each(function(){
            if(this.checked==true){
                isCheckPrice=true;
                return false;
            }else{
                isCheckPrice=false;
            }
        });
        if(!isCheckPrice){
            $_jxc.alert('没有勾选调价设置！');
            gFunEndLoading();
        }
        return isCheckPrice;
    },
    /**
     * 是否选择的datagrid的行，选择为true，未选择为false，则提示用户选择
     *
     * @returns {boolean}
     */
    isSelectRows : function() {
        if ($("#" + datagridId).datagrid("getSelections").length <= 0) {
            $_jxc.alert('没有单据可以删除，请选择一笔单据再删除？');
            return false;
        } else {
            return true;
        }
    },
    /**
     * datagrid是否存在数据，存在为true，不存在为false，则提示用户输入
     *
     * @returns {boolean}
     */
    isHasDataGrid : function() {
        if ($(".datagrid-btable td[field='skuCode']").length <= 0) {
            $_jxc.alert('明细数据不能为空，请输入！');
            gFunEndLoading();
            return false;
        } else {
            var count = 0;
            // 判断列表数据属否为空
            for (var i = 0; i < $(".datagrid-btable td[field='skuCode']").length; i++) {
                if ($(".datagrid-btable td[field='skuCode']").eq(i).text() != ""
                    && $(".datagrid-btable td[field='skuCode']").eq(i)
                        .text() != undefined) {
                    count++;
                }
                if ($(".datagrid-btable td[field='skuCode']").eq(i).find(
                        ".textbox-value").val() != ""
                    && $(".datagrid-btable td[field='skuCode']").eq(i)
                        .find(".textbox-value").val() != undefined) {
                    count++;
                }
            }
            if (count == 0) {
                $_jxc.alert('明细数据不能为空，请输入！');
                gFunEndLoading();
                return false;
            } else {
                return true;
            }
        }
    },
    /**
     * 判断checkbox是否选择，从而显示或者隐藏datagird的Column列
     *
     * @param datagridId
     *            datagrid的Id
     * @param checkboxId
     *            checkbox的id
     */
    isCheckBoxChecked : function(checkboxId) {
        var _this = this;
        var fieldArr = []; // field的数组
        switch (checkboxId) {
            case "purchasePrice": // 进价
                fieldArr = [ "oldPurPrice", "newPurPrice"];
                break;
            case "retailPrice": // 零售价
                fieldArr = [ "oldSalePrice", "newSalePrice"];
                break;
            case "tradePrice": // 批发价
                fieldArr = [ "oldWsPrice", "newWsPrice" ];
                break;
            case "memberPrice": // 会员价
                fieldArr = [ "oldVipPrice", "newVipPrice" ];
                break;
            case "distributionPrice": // 配送价
                fieldArr = [ "oldDcPrice", "newDcPrice" ];
                break;
            default:
                break;
        }

        var newFields = ["oldSaleRate","newSaleRate"];
        if(($("#purchasePrice").is(":checked") || $("#retailPrice").is(":checked")) && (hasPurchasePrice==true)){
            _this.showDataGridColumn(newFields);
        }else{
            _this.hideDataGridColumn(newFields);
        }
            if ($("#" + checkboxId).is(":checked")) {
                _this.showDataGridColumn(fieldArr);
            } else {
                _this.hideDataGridColumn(fieldArr);
            }



    },
    /**
     * 显示列
     *
     * @param datagridId
     *            datagrid的Id
     * @param fieldLen
     *            列的field个数
     */
    showDataGridColumn : function(fieldArr) {
        for (var i = 0; i < fieldArr.length; i++) {
            $("#" + datagridId).datagrid("showColumn", fieldArr[i]);
        }
    },
    /**
     * 隐藏列
     *
     * @param datagridId
     *            datagrid的Id
     * @param fieldLen
     *            列的field个数
     */
    hideDataGridColumn : function(fieldArr) {
        for (var i = 0; i < fieldArr.length; i++) {
            $("#" + datagridId).datagrid("hideColumn", fieldArr[i]);
        }
    },
    /**
     * input禁用,a标签移除事件，增加“已审核”标志
     */
    readOnlyInput : function() {
        $("input").each(function() {
            $(this).attr({
                "readonly" : "readonly",
                "disabled" : "disabled"
            });
        });
        $(".add-line,.del-line").each(function() {
            $(this).removeAttr("onclick");
        });
        $(".ubtn").each(function() {
            $(this).removeAttr("onclick");
        });
        $(".uinp-more").each(function() {
            $(this).removeAttr("onclick");
        });
        $("#saveModifyPriceOrder").removeAttr("onclick");
        $("#check").removeAttr("onclick");
        $("#selectGoodsDialog").removeAttr("onclick");
        $("#delModifyOrderDialog").removeAttr("onclick");
        $("#set").removeAttr("onclick");
        $("#importdetail").removeAttr("onclick");

        $("#" + datagridId).datagrid('removeEditor', 'skuCode');
        $("#" + datagridId).datagrid('removeEditor', 'newPurPrice');
        $("#" + datagridId).datagrid('removeEditor', 'newSalePrice');
        $("#" + datagridId).datagrid('removeEditor', 'newDcPrice');
        $("#" + datagridId).datagrid('removeEditor', 'newWsPrice');
        $("#" + datagridId).datagrid('removeEditor', 'newVipPrice');
        var czArr = [ "cz" ];
        this.hideDataGridColumn(czArr);
        // 增加“已审核”标志
        $("#already-examine").removeClass("uhide");
    },
    /**
     * 所有editor失去焦点,结束之前的编辑
     */
    setEditorBlur : function() {
        var rows = $("#" + datagridId).datagrid("getRows");
        for (var i = 0; i < rows.length; i++) {
            $("#" + datagridId).datagrid("endEdit", i);
        }
    }
}

// 调价公式
function setModifyPriceDialog() {
    // 所有editor失去焦点,结束之前的编辑
    datagridUtil.setEditorBlur();

    // 判断用户是否选择区域，选择为true，未选择为false，则提示用户选择
    if (datagridUtil.isSelectArea()) {
        // datagrid是否存在数据，存在为true，不存在为false，则提示用户输入
        if (datagridUtil.isHasDataGrid()) {
            // 当前panel
            var thisPanel;
            var d = $("<div />").dialog({
                title : '公式应用',
                top : 20,
                width : 600,
                height : 220,
                href : contextPath + '/goods/priceAdjust/modifyPriceDialog',
                maximizable : false,
                modal : true,
                onOpen : function() {
                    thisPanel = $(this);
                },
                onClose : function() {
                    $(this).panel('destroy');
                },
                buttons : [ {
                    text : '确定',
                    handler : function() {
                        // 根据调节选择设置对应价格
                        setModifyPrice(thisPanel);
                    }
                }, {
                    text : '返回',
                    handler : function() {
                        d.panel('destroy');
                    }
                } ]
            });
        }
    }
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
    if($("#branchId").val()==""){
        $_jxc.alert("请先选择机构");
        return;
    }
    branchId=$("#branchId").val();
    gFunGoodsSelect(searchKey,branchId);
}
//商品选择 公共使用
function gFunGoodsSelect(searchKey,branchId){

    var param = {
        type:'PC',
        key:searchKey,
        isRadio:0,
        sourceBranchId:"",
        targetBranchId:"",
        branchId:branchId,
        supplierId:'',
        flag:'0',
    }

    new publicGoodsServiceTem(param, function(data) {
        if(searchKey){
            $("#addModifyPriceGrid").datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#addModifyPriceGrid").datagrid("acceptChanges");
        }
        var nowRows = gridHandel.getRowsWhere({'skuName':true});
        //var addDefaultData  = gridHandel.addDefault(data,gridDefault);
        var argWhere ={skuCode:true};  //验证重复性
        var keyNames = {
            //id : "skuId",
            purchasePrice : 'oldPurPrice',
            distributionPrice : 'oldDcPrice',
            vipPrice : 'oldVipPrice',
            wholesalePrice : 'oldWsPrice',
            salePrice : 'oldSalePrice',
            disabled :""
        };
        var keyNames2 = {
            oldPurPrice : 'newPurPrice',
            oldDcPrice : 'newDcPrice',
            oldVipPrice : 'newVipPrice',
            oldWsPrice : 'newWsPrice',
            oldSalePrice : 'newSalePrice'
        }
        var newData = gFunUpdateKey(data,keyNames);
        newData = gFunUpdateKey(newData,keyNames2);
        var newRows = gridHandel.checkDatagrid(nowRows,newData,argWhere);
        
        //计算原毛利率、新毛利率
        calcSaleRate(newRows);

        $("#"+datagridId).datagrid("loadData",newRows);

        var fieldName = "";
        var fieldNames = {
            "purchasePrice":"newPurPrice",
            "retailPrice":"newSalePrice",
            "distributionPrice":"newDcPrice",
            "tradePrice":"newWsPrice",
            "memberPrice":"newVipPrice",
        }
        $('.priceItem:checked').each(function(i){

            if(0==i){
                fieldName =fieldNames[$(this).attr("id")] ;
            }
        });

        if(fieldName){
            gridHandel.setLoadFocus();
            setTimeout(function(){
                gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
                gridHandel.setSelectFieldName(fieldName);
                gridHandel.setFieldFocus(gridHandel.getFieldTarget(fieldName));
            },100)
        }

    });
}

//计算原毛利率、新毛利率
function calcSaleRate(rows){
    $.each(rows,function (index,item) {
        //兼容老数据 如果原零售价为0
        if(item.oldSalePrice === '0' || item.oldSalePrice == 0 || isNaN(parseFloat(item.oldSalePrice)) || isNaN(parseFloat(item.oldPurPrice)) ){
            item.oldSaleRate = "0.00%";
        }else{
            item.oldSaleRate = ((item.oldSalePrice-item.oldPurPrice)/item.oldSalePrice*100).toFixed(2)+"%";
        }
        if(item.newSalePrice == 0 || item.newSalePrice === '0' || isNaN(parseFloat(item.newSalePrice)) || isNaN(parseFloat(item.newPurPrice))){
            item.newSaleRate = "0.00%"
        }else{
            item.newSaleRate = ((item.newSalePrice-item.newPurPrice)/item.newSalePrice*100).toFixed(2)+"%"
        }

    });
}

//导出
function exportData(){
    var length = $("#addModifyPriceGrid").datagrid('getData').total;
    var status=$("#status").val();
    if(status==0){
        $_jxc.alert("订单未通过审核");
        return;
    }
    if(length == 0){
        $_jxc.alert("没有数据");
        return;
    }
    if(length > exportMaxRow){
        $_jxc.alert("当次导出数据不可超过"+exportMaxRow+"条，现已超过，请重新调整导出范围！");
        return;
    }
    var formNo=$("#formNoInput").val();
    $("#searchForm").attr("action",contextPath+'/goods/priceAdjust/exportList?formNo='+formNo);
    $("#searchForm").submit();
}

//打印
function printDesign(formNo){
    var branchId=$("#branchId").val();
    if(!branchId){
        $_jxc.alert("请先选择机构");
    }else{
        //弹出打印页面
        parent.addTabPrint('CASheet' + formNo,formNo+'单据打印',contextPath + '/printdesign/design?page=CASheet&controller=/goods/priceAdjust&template=-1&sheetNo=' + formNo + '&gridFlag=CAGrid','');
    }
}
//验证表格数据 删除不合格数据
function getDatagridRows(){
    $("#addModifyPriceGrid").datagrid("unselectAll");
    $("#addModifyPriceGrid").datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRows();
    $.each(rows,function(i,val){
        if(!val["skuCode"]||!val["skuName"]){
            rows.splice(i,1);
        }
    });
    return rows;
}


/**
 * 重置
 */
var resetForm = function(){
    $("#searchForm").form('clear');
};

////模板导出
//function exportTemp(){
//	var temple = $("#temple").attr("value");
//	if(temple=="barCodeTemple"){
//		location.href=contextPath+'/goods/priceAdjust/exportTemp?type=barCodeTemple';
//	}else{
//		location.href=contextPath+'/goods/priceAdjust/exportTemp?type=skuCodeTemple';
//	}
//}
/**
 * 导入
 */
function toImportproduct(type){
    //if($("#supplierId").val()==""){
    //    $_jxc.alert("请先选择供应商");
    //    return;
    //}
    var branchId = $("#branchId").val();
    if(!branchId){
        $_jxc.alert("请先选择机构");
        return;
    }
    var param = {
        url:contextPath+"/goods/priceAdjust/importList",
        tempUrl:contextPath+'/goods/priceAdjust/exportTemp',
        type:type,
        tipSign:1,
        branchId:branchId,
    }

    new publicUploadFileService(function(data){
        updateListData(data);
    },param)
}

function updateListData(data){

    var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
    if(data.length>0){

        if(nowRows.length <=0){
            $("#retailPrice").removeProp("checked");
            datagridUtil.isCheckBoxChecked('retailPrice');

            $("#memberPrice").removeProp("checked");
            datagridUtil.isCheckBoxChecked('memberPrice');
        }

        var arrKey =
            {"newPurPrice":"purchasePrice",
                "newSalePrice":"retailPrice",
                "newDcPrice":"distributionPrice",
                "newWsPrice":"tradePrice",
                "newVipPrice":"memberPrice"
            }

        $.each(data,function(index,val){
            $.each(arrKey,function(key,item){
                if(key&&val[key]){
                    $("#"+item).prop("checked","checked");
                    datagridUtil.isCheckBoxChecked(item);
                }
            })
        })
    }


    var addDefaultData  = gridHandel.addDefault(data,gridDefault);
    var keyNames = {
        purchasePrice : 'oldPurPrice',
        salePrice:'oldSalePrice',
        wholesalePrice:'oldWsPrice',
        vipPrice:'oldVipPrice',
        distributionPrice:'oldDcPrice'
    };

    var rows = gFunUpdateKey(addDefaultData,keyNames);
    $.each(rows,function (index,item) {
        if(isNaN(parseFloat(item.newPurPrice))){
            item.newPurPrice = item.oldPurPrice;
        }
        if(isNaN(parseFloat(item.newSalePrice))){
            item.newSalePrice = item.oldSalePrice;
        }
        if(isNaN(parseFloat(item.newDcPrice))){
            item.newDcPrice = item.oldDcPrice;
        }
        if(isNaN(parseFloat(item.newWsPrice))){
            item.newWsPrice = item.oldWsPrice;
        }
        if(isNaN(parseFloat(item.newVipPrice))){
            item.newVipPrice = item.oldVipPrice;
        }
    })


    var argWhere ={skuCode:1};  //验证重复性
    var isCheck ={isGift:1 };   //只要是赠品就可以重复
    var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
    
    //计算原毛利率、新毛利率
    calcSaleRate(newRows);
    
    $("#"+datagridId).datagrid("loadData",newRows);

}

//返回列表页面
function back(){
    toClose();
}