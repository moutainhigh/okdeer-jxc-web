/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单-查看
 */
$(function(){
    initDatagridViewRequireOrder();
    if($("#close").val()){
    	$("#addButton").addClass("unhide");
    	$("#toBackByJSButton").attr("onclick","window.parent.closeTab()");
    }
});
$(document).on('click','input[name="numDeal"]',function(){
	return false;
});
var gridHandel = new GridClass();
var gridName= "gridViewRequireOrder";
function initDatagridViewRequireOrder(){
	gridHandel.setGridName("gridViewRequireOrder");
	var formId = $("#formId").val();
    $("#gridViewRequireOrder").datagrid({
    	method:'post',
    	url:contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+formId+"&deliverType=DY",
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
		showFooter:true,
		height:'100%',
        columns:[[
            {field:'skuCode',title:'货号',width:'70px',align:'left'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'130px',align:'left'},
			{field:'unit',title:'单位',width:'60px',align:'left'},
			{field:'spec',title:'规格',width:'90px',align:'left'},
			/*{field:'twoCategoryCode',title:'类别编号',width:'90px',align:'left'},
			{field:'twoCategoryName',title:'类别名称',width:'90px',align:'left'},*/
            {field:'distributionSpec',title:'配送规格',width:'80px',align:'left'},
            {field:'largeNum',title:'箱数',width:'80px',align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'applyNum',title:'数量',width:'80px',align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'price',title:'单价',width:'80px',align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return ;
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'amount',title:'金额',width:'80px',align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'isGift',title:'赠送',width:'80px',align:'left',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    row.isGift = row.isGift?row.isGift:0;
                    return value=='1'?'是':(value=='0'?'否':'请选择');
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        editable:false,
                        required:true,
                        data: [{
                            "id":'1',
                            "text":"是",
                        },{
                            "id":'0',
                            "text":"否",
                        }]
                    }
                }
            },
            {field:'inputTax',title:'税率',width:'80px',align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return ;
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},
            {field:'taxAmount',title:'税额',width:'80px',align:'right',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
					var taxAmountVal = (row.inputTax*(row.amount/(1+parseFloat(row.inputTax)))||0.0000).toFixed(2);
                    return  '<b>'+parseFloat(taxAmountVal||0).toFixed(2)+'</b>';
                }
            },
            {field: 'targetStock', title: '店铺库存', width: '80px', align: 'right',
            	formatter: function (value, row, index) {
            		if (row.isFooter) {
            			return
            		}
            		if (!row.sourceStock) {
            			row.sourceStock = parseFloat(value || 0).toFixed(2);
            		}
            		return '<b>' + parseFloat(value || 0).toFixed(2) + '</b>';
            	}
            },
			/*{field:'sourceStock',title:'目标库存',width:'80px',align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return ;
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
				editor:{
					type:'numberbox',
					options:{
						disabled:true,
						min:0,
						precision:2,
					}
				}
			},
			{field:'alreadyNum',title:'已订数量',width:'80px',align:'right',
				formatter : function(value, row, index) {
					if(row.isFooter){
						return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					}
					return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
				},
			},*/
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
			updateFooter();
		},
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice(gridName,["price","amount","taxAmount"])
    }
}
//合计
function updateFooter(){
	var fields = {largeNum:0,applyNum:0,amount:0,isGift:0, };
	var argWhere = {name:'isGift',value:""}
	gridHandel.updateFooter(fields,argWhere);
}
//终止
function stop(){
	$.messager.confirm('提示','是否终止？',function(data){
		if(data){
			$.ajax({
				url : contextPath+"/form/deliverForm/stopped",
				type : "POST",
				data : {
					deliverFormId : $("#formId").val(),
					deliverType : 'DY'
				},
				success:function(result){
					if(result['code'] == 0){
						$_jxc.alert("操作成功！",function(){
							location.href = contextPath +"/form/deliverForm/deliverEdit?deliverFormId=" + result["formId"];
						});
					}else{
						successTip(result['message']);
					}
				},
				error:function(result){
					successTip("请求发送失败或服务器处理失败");
				}
			});
		}
	});
}

//返回
function back(){
		location.href = contextPath+"/form/deliverForm/viewsDY";
}

//新增要货单
function addDeliverForm(){
	toAddTab("新增直送要货单",contextPath + "/form/deliverForm/addDeliverForm?deliverType=DY");
}