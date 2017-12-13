/**
 * Created by wxl on 2016/08/17.
 */
var datagridId = "pricePrint";

var options_nomal = [
                     {value:'16',text:'二维码促销价签(58*28.5mm 3*9)'},
                     {value:'14',text:'新促销价签(58*28.5mm 3*9)'},
                     {value:'6',text:'标准促销价签(72*32.5mm 4*6)'},
					{value:'8',text:'标准促销价签(72*32.5mm 4*6)无底'},
					{value:'11',text:'标准促销价签(72*32.5mm 4*6 无底色)'},
					 {value:'4',text:'促销（85*40mm无底 1*7）'},
					{value:'18',text:'二维码促销价签无底(60*32mm 3*9)'},
					{value:'20',text:'二维码促销价签无底(60*30mm 3*9)'},
    {value: '22', text: '二维码促销价签无底(合肥60*30mm 3*9)'},
    {value: '24', text: '二维码促销价签无底(50*28mm 4*9)'}
					];
var options_promotion = [
                         
					{value:'15',text:'二维码价签(58*28.5mm 3*9)'},
                         {value:'13',text:'新标准价签(58*28.5mm 3*9)'},
                         {value:'5',text:'标准价签(72*32.5mm 4*6)'},
                         {value:'7',text:'标准价签(72*32.5mm 4*6)无底'},
                         {value:'1',text:'正常（55*25mm有底 3*10）'},
                         {value:'2',text:'正常（85*40mm有底 2*7）'},
     					{value:'3',text:'正常（85*40mm无底 1*7）'},
                         {value:'17',text:'二维码价签无底(60*32mm 3*9)'},
                         {value:'19',text:'二维码价签无底(60*30mm 3*9)'},
                         {value:'21',text:'二维码价签无底(合肥60*30mm 3*9)'},
						 {value: '25', text: '二维码价签无底(55*30mm 3*9)'},
						 {value: '23', text: '二维码价签无底2(55*30mm 3*9)'}
     					];

$(function(){
	//初始化类型选择
	initjiaqType();
	//初始化列表
	initPricePrintGrid();
	$('#printnum').on('input',function(){
		printRows($(this).val());

	});
    $('#discount').on('input', function () {
        discountRows($(this).val());

    });

});

function changeNum() {
    var val = $("#printnum").numberbox("getValue");
    printRows(val);
}

//监听打印数
function changePrintNum(vewV,oldV){
	if(vewV && vewV > 0){
		printRows(vewV);
	}
}

//监听折扣
function changeDiscount(newV,oldV){
	if(vewV){
		discountRows(vewV)
	}
}
var isdisabled = false;
function initjiaqType(){
	$(document).on('mousedown','.jiaqType .radioItemLable',function(){
		var _this = $(this).children('.radioItem');
		var changeType = function(){
			_this.prop("checked",true);
			$('#priceType').val(_this.val());
			if(_this.val() === '1'){
				$('.activity').removeClass('unhide');
				$('.discount').removeClass('unhide');
                // gridHandel.setLoadData([]);
				appendOptions(options_nomal);

				$('#pricePrint').datagrid('showColumn','activityTime');
				$('#pricePrint').datagrid('showColumn','promotionPrice');
			}else{
				$("#selectGoods").attr("onclick","chooseproduct()");
				$("#importsukcode").attr("onclick","toImportproduct(0)");
				$("#importbarcode").attr("onclick","toImportproduct(1)");
				
				$("#selectGoods").removeClass("uinp-no-more");
				$("#importsukcode").removeClass("uinp-no-more");
				$("#importbarcode").removeClass("uinp-no-more");
                isdisabled = false;

				//隐藏活动 清除数据
				$('.activity').addClass('unhide');
				$('#actionId').val('');
				$('#actionName').val('');
				//隐藏统一促销价 恢复原状
				$('.discount').addClass('unhide');	
				 $('#discount').removeAttr('readonly','readonly');
				 $('#discount').val('');
				 $('#discount').removeClass('uinp-no-more');
				// gridHandel.setLoadData([]);
				appendOptions(options_promotion);
				$('#pricePrint').datagrid('hideColumn','activityTime');
				$('#pricePrint').datagrid('hideColumn','promotionPrice');
			}
			
		}
		changeType();
        /*initPricePrintGrid();*/
        // $("#"+datagridId).datagrid("loadData", [$.extend({},gridDefault)]);
	})
}

function appendOptions(options){
	$("#optionseletc option").remove();
    $.each(options,function(i,option){
    	var option = option;
    	$("#optionseletc").append("<option value='"+option.value+"'>"+option.text+"</option>"); 
    });
}

//获取当前时间并且格式化
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}


var gridHandel_pricePrint = new GridClass();
var gridDefault = {

}
function initPricePrintGrid() {
    gridHandel_pricePrint.setGridName("pricePrint");
    gridHandel_pricePrint.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                gridHandel_pricePrint.addRow(parseInt(gridHandel_pricePrint.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel_pricePrint.setBeginRow(gridHandel_pricePrint.getSelectRowIndex()+1);
                    gridHandel_pricePrint.setSelectFieldName("skuCode");
                    gridHandel_pricePrint.setFieldFocus(gridHandel_pricePrint.getFieldTarget('skuCode'));
                },100)
            }else{
                chooseproduct(arg);
            }
        },
    })
	$("#"+datagridId).datagrid({
		//title:'普通表单-用键盘操作',
		method: 'get',
		align: 'center',
		singleSelect: true,  //单选  false多选
		rownumbers: true,    //序号
		width:'100%',
		height:'100%',
		columns: [[
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

		           {field: 'skuCode', title: '货号', width: 200, align: 'center',
						editor:{
								type:'textbox',
									options:{
                                        disabled:isdisabled
								}
							},
				   },
		           {field: 'skuName', title: '商品名称', width: 200, align: 'center',},
		           {field: 'barCode', title: '条码', width: 150, align: 'center'},
		           {field: 'spec', title: '规格', width: 150, align: 'center'},
		           {field: 'unit', title: '单位', width: 100, align: 'center'},
		           {field: 'originPlace', title: '产地', width: 100, align: 'center'},
		           {field: 'salePrice', title: '销售价', width: 80, align: 'center'
		        	   ,editor:{
		        		   type:'numberbox',
		        		   options:{
		        			   min:0,
		        			   precision:2,
		        			   onChange: onChangeSalePrice,
		        		   }
		        	   },
		        	   formatter:function(value,row,index){
		        		   return  getTwoDecimalB(value);
		        	   },
		           },
		           {field: 'promotionPrice', title: '促销价', width: 100, align: 'center',hidden:true,
		        	   editor:{
		        		   type:'numberbox',
		        		   options:{
		        			   min:0,
		        			   precision:2,
		        			   onChange: onChangePromotionPrice,
		        		   }
		        	   },
		        	   formatter:function(value,row,index){
		        		   return  getTwoDecimalB(value);
		        	   },

		           },

		           {field: 'printCount', title: '打印数', width: 80, align: 'center',
		        	   formatter:function(value,row,index){
		        		   if(!value){
		                    	row["printCount"] =1;
		                    }
		        		   return row["printCount"];
		        	   },
		        	   editor:{
		        		   type:'numberbox',
		        		   precision:200,
		        		   options:{
		        			   min:1,
		        		   }
		        	   },
		        	  
		           },
		           
		           {field: 'activityTime', title: '活动时间', width: 180, align: 'center',hidden:true,
		        	   formatter:function(value,row,index){
		        		   if(!value){
		                    	return;
		                    }
		        		   return row["activityTime"];
		        	   },
		        	   editor:{
		        		   type:'datebox',
		        		   precision:200,
		        	   },
		        	  
		           },
		           
		           ]],
		           onClickCell:function(rowIndex,field,value){
		        	   gridHandel_pricePrint.setBeginRow(rowIndex);
		        	   gridHandel_pricePrint.setSelectFieldName(field);
		           },
	});
   gridHandel_pricePrint.setLoadData([$.extend({},gridDefault)]);
}

//插入一行
function addLineHandel(event){
	if($("#actionId").val()){
		$_jxc.alert("活动促销价签不能添加商品");
		return;
	}
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel_pricePrint.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel_pricePrint.delRow(index);
}

function onChangeSalePrice(newV,oldV){
    if(!gridHandel_pricePrint.getFieldData(gridHandel_pricePrint.getSelectRowIndex(),'skuName')){
        return;
    }
    
	var promotionPrice = gridHandel_pricePrint.getFieldValue(gridHandel_pricePrint.getSelectRowIndex(),'promotionPrice');

	if($('#priceType').val() === '1' && parseFloat(promotionPrice) > parseFloat(newV)){
		  $_jxc.alert("销售价不能小于促销价");
		  gridHandel_pricePrint.setFieldValue('salePrice',oldV);
	        return;
	}
}


function onChangePromotionPrice(newV,oldV){
	
    if(!gridHandel_pricePrint.getFieldData(gridHandel_pricePrint.getSelectRowIndex(),'skuName')){
        return;
    }
	
	var salePriceVal = gridHandel_pricePrint.getFieldValue(gridHandel_pricePrint.getSelectRowIndex(),'salePrice');
	if($('#priceType').val() === '1' && parseFloat(newV) > parseFloat(salePriceVal)){
		  $_jxc.alert("促销价不能大于销售价");
		  gridHandel_pricePrint.setFieldValue('promotionPrice',oldV);
	        return;
	}
}

//导入
function toImportproduct(type){
    var param = {
        url:contextPath+"/print/importList",
        tempUrl:contextPath+"/print/exportTemp",
        type:type,
        
    }
    new publicUploadFileService(function(data){
        updateListData(data);
        
    },param)
}
function updateListData(data){
	    var keyNames = {
	        id:'skuId',
	        salePrice:'promotionPrice'
	    };
	    var rows = gFunUpdateKey(data,keyNames);
	    var argWhere ={skuCode:1};  //验证重复性
	    var isCheck ={isGift:1 };   //只要是赠品就可以重复
	    var newRows = gridHandel_pricePrint.checkDatagrid(data,rows,argWhere,isCheck);
         
	    $("#pricePrint").datagrid("loadData",data);
	}


//打印数设置 表格列数同步
function printRows(printNum){
	// 获取选中行的Index的值
	var rowIndex = -1;
	var newData = $("#"+datagridId).datagrid("getRows");
	for(var i = 0;i < newData.length;i++){
		newData[i].printCount= printNum;
		rowIndex = $("#"+datagridId).datagrid('getRowIndex',newData[i]);
		//更新行数据
		$("#"+datagridId).datagrid('updateRow',{
			index: rowIndex,
			row: newData[i]
		});
		//刷新行
		/*$("#"+datagridId).datagrid('refreshRow',rowIndex);*/
	}
	$("#"+datagridId).datagrid("loadData", newData);
	
}
//打折 表格列数同步
function discountRows(discountNum){
	// 获取选中行的Index的值
	var rowIndex = -1;
	var newData = $("#"+datagridId).datagrid("getRows");

	for(var i = 0;i < newData.length;i++){

		if(""==discountNum || 10 == discountNum || 0 == discountNum){
			newData[i].promotionPrice= newData[i].salePrice;
		}else{
			newData[i].promotionPrice= discountNum*newData[i].salePrice/10;
		}
	}
    $("#"+datagridId).datagrid("loadData", newData);
	// $("#"+datagridId).datagrid({data:newData})
}

//打印的数据
function printtable(){
	if(!window.localStorage)
	{
		return false;
	}
	else{
		$('#'+datagridId).datagrid('endEdit', gridHandel_pricePrint.getSelectRowIndex());                  //结束之前的编辑
		var storage=window.localStorage;
		var printdata= $("#"+datagridId).datagrid('getRows');
		console.log(printdata);
		var tabledata=JSON.stringify(printdata);
		var printNo=$("#optionseletc").find("option:selected").val();
		var data=tabledata.substring(tabledata.indexOf('['),tabledata.lastIndexOf(']')+1)
		var branchId=$("#branchId").val();
		// 为空判断data.length的长度
		if(data.length>=3){
			storage.prdata=data;
			storage.branchId=branchId;
			storage.printNo=printNo;
			window.open(contextPath + "/print/printGoodsView"); 
		}
		else {
			$_jxc.alert("打印数据不能为空！");
			return;
		}

	}
}

//商品选择  方法
function chooseproduct(searchKey){
    var param = {
        type:'PC',
        key: searchKey,
        isRadio:0,
        sourceBranchId:"",
        targetBranchId:"",
        branchId:$("#branchId").val(),
        supplierId:'',
        flag:'0',
        statuses : '0,1,2'//包括正常、停售、停购的商品
    }
    new publicGoodsServiceTem(param,function(data){
        if(searchKey){
            $("#pricePrint").datagrid("deleteRow", gridHandel_pricePrint.getSelectRowIndex());
            $("#pricePrint").datagrid("acceptChanges");
        }

		// var obj = {
		//
		// }
		// gFunUpdateKey(data, obj);
		$("#pricePrint").datagrid("unselectAll");
		
		$.each(data,function(i,row){
			row["promotionPrice"] = row["salePrice"] ;
			row["printCount"] = row["printCount"]||1 ;

		})

        var rows = gridHandel_pricePrint.getRowsWhere({skuName:'1'});
		$.each(rows,function(i,rowItem){
			$.each(data,function(j,dataItem){
				if(rowItem.skuCode==dataItem.skuCode){
					rowItem.printCount = parseInt(rowItem.printCount)+1;
					data.splice(j,1);
					return false;
				}
			})
		});
		var newRows = rows.concat(data)// $.extend(rows,data);

		$("#pricePrint").datagrid("loadData", newRows);

        // gridHandel_pricePrint.setLoadFocus();
        // setTimeout(function(){
        //     gridHandel_pricePrint.setBeginRow(gridHandel_pricePrint.getSelectRowIndex()||0);
        //     gridHandel_pricePrint.setSelectFieldName("promotionPrice");
        //     gridHandel_pricePrint.setFieldFocus(gridHandel_pricePrint.getFieldTarget('promotionPrice'));
        // },500)
	});

}


/**
 * 机构店铺名称
 */
function searchBranch(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
		$("#actionId").val("");
		$("#actionName").val("");
		gridHandel_pricePrint.setLoadData([]);
        gridHandel_pricePrint.setLoadData([$.extend({}, gridDefault)]);
	},'BF','');
}

var dalogTemp

function selectActivity(){
  new publicActivity(function(data){
	  var data = data;
	  disableBtn();
	  $("#actionId").val(data.id);
		$("#actionName").val(data.activityCode);
	  getActivityGoods(data);
  },{branchId:$("#branchId").val()});
	
}

function getActivityGoods(data){
	if(data){
		$_jxc.ajax({
	    	url:contextPath+"/sale/activitySelect/getDetail?activityId="+data.id,
	    	type:"GET"
	    },function(result){
    		if(result['code'] == 0){
    			isdisabled = true;
//    			initPricePrintGrid();
    			var tempData = result.data;
    			var startDate = tempData.startTime + " " +tempData.dailyStartTime;
    			var endDate = tempData.endTime + " " +tempData.dailyEndTime;
    			result.data.datetime = startDate+"--"+endDate;
    			 $("#pricePrint").datagrid("loadData",result.data);
    		}else{
    			$_jxc.alert(result['message']);
    		}
	    });
       
	}
}

function disableBtn(){
	 $('#selectGoods').addClass("uinp-no-more")
	 $('#selectGoods').removeAttr('onclick');
	 $('#importsukcode').addClass("uinp-no-more")
	 $('#importsukcode').removeAttr('onclick');
	 $('#importbarcode').addClass("uinp-no-more")
	 $('#importbarcode').removeAttr('onclick');

	 $('#discount').attr('readonly','readonly');
	$('#discount').val('');
	 $('#discount').addClass('uinp-no-more');
//	 var e = $("#pricePrint").datagrid('getColumnOption', 'activityTime');
//
//     e.editor = {disabled:true};
}



function onChangeSelect(){
    var priceMark=$("#optionseletc").val(); 
}
