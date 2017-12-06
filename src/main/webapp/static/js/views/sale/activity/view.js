//全局变量
var datagridId = "saleMangeadd";

$(function(){
	optionHide();
	// 开始和结束时间
	$("#startTime").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM-dd"));
    $("#endTime").val("2016-11-18");
    $("#dailyStartTime").val("00:00:00");
    $("#dailyEndTime").val("23:59:59");

	editstart();
    
  // 一周星期获取和初始化
	  weekCheckDay();
	
});

var activityId;
// 编辑请求数据
function  editstart(){
	activityId = $("#activityId").val();
	$_jxc.ajax({
	      url:contextPath+"/sale/activity/get?activityId="+activityId,
	      type:"get",
	      contentType:'application/json'
	  },function(data){
	    	  if(data['code'] == 0){
	    		  if(data['obj']['activityStatus'] == "2"){
	    			  $("#already-examine").html("<span>已终止</span>");
	    		  }
	    		  
	    		  var listinfo=data['obj'];
	    		  var activtype=listinfo.activityType;
	    		  // 活动名称
	    		  console.log(data.obj.activityName);
	    		  $('#activityName').val(data.obj.activityName);
	    		  // 日期转换格式
		    	  var startTimeedit= new Date(listinfo.startTime);
		    	  var endTimeedit=new Date(listinfo.endTime);
		    	  startTimeedit=startTimeedit.format("yyyy-MM-dd"); 
		    	  endTimeedit=endTimeedit.format("yyyy-MM-dd");
		    		$('#startTime').val(startTimeedit);
		    		$('#endTime').val(endTimeedit);
		    		// 时间转换格式
		    		 var dailyStartTimeedit= new Date(listinfo.dailyStartTime);
			    	 var dailyEndTimeedit=new Date(listinfo.dailyEndTime);
		    		 dailyStartTimeedit=listinfo.dailyStartTime.format("HH:mm:ss"); 
		    		 dailyEndTimeedit=listinfo.dailyEndTime.format("HH:mm:ss");
		    		 $('#dailyStartTime').val(dailyStartTimeedit);
		    		 $('#dailyEndTime').val(dailyEndTimeedit);
		    		 $('#weeklyActivityDay').val(listinfo.weeklyActivityDay);
		    		var strweek=$('#weeklyActivityDay').val();
		    		// 星期字符串处理
		    		StrweekCheckDay(strweek);
		    		//组合结构显示和id
		    		var branchIds="";
		    		var branchName="";
		    		$.each(data.branch,function(i,v){
		    			if(!v.branchName&&!v.branchCode){
		    				return;
		    			}
		    			branchName+="["+v.branchCode+"]"+v.branchName+",";
		    			branchIds = v.branchId+"," + branchIds;
		    		 });
		    		 branchIds = branchIds.substring(0,branchIds.length - 1);
		    		 bradenchName = branchName.substring(0,branchName.length - 1);
		    		 /*$('#branchName').val(branchName);
		    		 $('#branchIds').val(branchIds);*/
		    		 var branchsName =listinfo.branchsName;
		    		 var branchsFullName =listinfo.branchsFullName;
		    		 if(branchsName){
		    			 $('#branchName').val(branchsName);
		    		 }else{
		    			 $('#branchName').val(branchName);
		    		 }
		    		 if(branchsFullName){
		    			 $('#branchName').attr('title',branchsFullName);
		    			 $('#branchsFullName').val(branchsFullName);
		    		 }else{
		    			 $('#branchName').attr('title',$('#branchName').val());
		    		 }
		    		 
		    		 
                    // combobox 下拉赋值和禁止选择
  		    		$("#activityType").combobox('select',activtype);  
  		    		// $("#activityType").combobox("disable");
                  //combobox 会员独享
                  //combobox 会员独享 买满送不显示
                  $("#memberExclusive").combobox('select', data.obj.memberExclusive);
                  // $("#memberExclusive").combobox('disabled');
  		    	    // checkbox 禁止所有选中状态
  		    		checkboxDisabled();
		    		// 满减类型赋值
					if(activtype==5){
                        var param = {
                            activityScopemj:listinfo.activityScope,
                        }
                        selectOptionMj(param);
					  }
					  else if(activtype==10){       //买满送
                        var param = {
                            activityScope :listinfo.activityScope,
                            activityPattern  : listinfo.activityPattern,
                            allowActivity : listinfo.allowActivity,
                            allowMultiple :listinfo.allowMultiple,
                            activityId:activityId,
                        }
                        selectOptionmms(param);
					  }else if(activtype==1){
                        var param = {
                            activityId:activityId,
                        }
                        selectOptionSpecial(param)
                    }
						// 其他类型请求
                    else if(activtype==2){
                        var param = {
                            activityId:activityId,
                            activityScopedis:listinfo.activityScope,
                            maxDiscountAmount:listinfo.maxDiscountAmount
                        }
                        selectOptionzk(param);
                    }else if(activtype==3){
                        var param = {
                            activityId:activityId,
                        }
                        selectOptionOdd(param);
                    }else if(activtype==6){
                        var param = {
                            activityId:activityId,
                            maxDiscountNum:listinfo.maxDiscountNum
                        }
                        selectOptionGroupSpecial(param);
                    }else if(activtype==11){
                        var param = {
                            activityId:activityId,
                            activityScopeN2N: data.obj.activityScope,
                            maxDiscountNum:data.obj.maxDiscountNum,
                            maxDiscountAmount:data.obj.maxDiscountAmount
                        }
                        selectOptionN2N(param);
                    }else if(activtype==12){
                        var param = {
                            activityId:activityId,
                            maxDiscountAmount:data.obj.maxDiscountAmount
                        }
                        selectOptionSpecialPackage(param);
                    }

	              }else{
	             
	            	  $_jxc.alert(data['message']);
	          }
	  });
}

function selectOptionGroupSpecial(param) {
    $('.limitCount').removeClass('unhide');
    $("#maxDiscountNum").numberbox("setValue",param.maxDiscountNum);
    //组合特价
    initDatagridCompose();
    initmangeDatagrid(param.activityId);
}


// 特价状态选择隐藏
function selectOptionSpecial(param){
    //设置批量特价不显示 除了activtype==1
    $('.special').removeClass('unhide');
    initDatagridSpecial();
    initmangeDatagrid(param.activityId);
}

// 偶数特价状态选择隐藏
function selectOptionOdd(param){
    $('.oddprice ').removeClass('unhide');
    initDatagridOddtj();
    initmangeDatagrid(param.activityId);
}

// 折扣状态状态radio 赋值
function selectOptionzk(param){
    var radioVal = param.activityScopedis;
    $('.disradio').prop('checked',false);
    $('#disradio'+radioVal).prop('checked',true);
    $('#activityScopedis').val(radioVal);
    $(".topMoney").removeClass("unhide");
    $("#maxDiscountAmount").numberbox("setValue",param.maxDiscountAmount);//最高优惠
    //类别折扣
    if(radioVal=="1"){
        initDatagridsortZk();
        $(".discount").removeClass('unhide');
    }else if(radioVal=="2"){
        //全场折扣
        initDatagridallZk();
        $(".discount").addClass('unhide');
    }
    else{
        //单品折扣
        initDatagridoneZk();
        $(".discount").removeClass('unhide');
    }
    initmangeDatagrid(param.activityId);

}

// 满减状态radio 赋值
function selectOptionMj(param){
    var radioVal = param.activityScopemj;
    $('.mjradio').prop('checked',false);
    $('#mjradio'+radioVal).prop('checked',true);
    $('#activityScopemj').val(radioVal);


    if(radioVal=="2"){
        $("#consaleadd").addClass('ub-f1');
        $('#consaleadd').removeClass('unhide');
        $('#consalesetmj').addClass('unhide');
        initDatagridallMj();
        initDatagridsortSet();
    }
    else if(radioVal=="1"){
        $("#consaleadd").removeClass('ub uw ub-f1 umar-t20');
        $("#consaleadd").removeClass('ub-f1');
        $("#consalesetmj").removeClass('unhide');
        initDatagridsortMj();
        initDatagridsortSet();
    }
    else {
        $("#consaleadd").removeClass('ub uw ub-f1 umar-t20');
        $("#consaleadd").removeClass('ub-f1');
        $("#consalesetmj").removeClass('unhide');
        initDatagridshopMj();
        initDatagridsortSet();
    }
    if(radioVal == 0 || radioVal == 1){
        initmjOneDatagrid(activityId);
        initmjTowDatagrid(activityId);
    }else if(radioVal == 2){
        initmjFullDatagrid(activityId);
    }
}

//N元N件
function selectOptionN2N(param){
    $('#dvn2nCount').removeClass('unhide');
    $('#dvn2nSaleAmount').removeClass('unhide');
    $("#n2nSaleAmount").numberbox('setValue', param.maxDiscountAmount);
    $("#n2nCount").numberbox('setValue', param.maxDiscountNum);
    //初始化
    // $("input[name='n2nstatus'][value='"+param.activityScopeN2N+"']").prop('checked',true);
    var radioVal = param.activityScopeN2N;
    if(radioVal == 1){
        initDatagridsortN2N();
    }else if(radioVal == 0){
        initDatagridGoodsN2N();
    }
    initmangeDatagrid(param.activityId);
}

//N元N件类别
function initDatagridsortN2N() {
    gridHandel.setGridName("saleMangeadd");
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
        height:'100%',
        pageSize:50,
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
                },
            },
            {field:'categoryCode',title:'类别编码',width:'200px',align:'left'},
            {field:'categoryName',title:'商品类别',width:'200px',align:'left'},
        ]],
        onBeforeLoad:function(){
            gridHandel.setDatagridHeader("center");
        }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)])
}

//N元N件商品
function initDatagridGoodsN2N() {
    gridHandel.setGridName("saleMangeadd");
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                if(checkenter())return;
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
    })
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
        height:'100%',
        pageSize:50,
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
                },
            },
            {field:'skuCode',title:'货号',width:'70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'150px',align:'left'},
            {field:'categoryName',title:'商品类别',width:'200px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field: 'purchasePrice', title: '进货价', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field:'price',title:'零售价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
        ]],
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
        onBeforeLoad:function () {
            gridHandel.setDatagridHeader("center");
        },
        onLoadSuccess:function(data){

        }
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
    }
    gridHandel.setLoadData([$.extend({},gridDefault)])
}

function selectOptionSpecialPackage(param){
    $("#dvn2nSaleAmount2").removeClass("unhide");
    $("#dvn2nSaleAmount2 #saleAmount").numberbox('setValue', param.maxDiscountAmount);
    initDatagridGoodsSpecialPackage();
    initmangeDatagrid(param.activityId);
}

//特价打包 datagrid
function  initDatagridGoodsSpecialPackage() {
    gridHandel.setGridName("saleMangeadd");
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                if(checkenter())return;
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
    })
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
        height:'100%',
        pageSize:50,
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
                },
            },
            {field:'skuCode',title:'货号',width:'70px',align:'left',editor:'textbox'},
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},
            {field:'barCode',title:'条码',width:'150px',align:'left'},
            {field:'categoryName',title:'商品类别',width:'200px',align:'left'},
            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field: 'purchasePrice', title: '进货价', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'limitCount', title: '数量', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:1,
                        precision:0,
                    }
                },
            },
            {field:'price',title:'零售价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
        ]],
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
        onBeforeLoad:function () {
            gridHandel.setDatagridHeader("center");
        },
        onLoadSuccess:function(data){

        }
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
    }
    gridHandel.setLoadData([$.extend({},gridDefault)])
}



// checkbox 禁止 状态
function checkboxDisabled(){
	$(".ubcheckweek").prop('disabled',true);
}

// 状态初始化 隐藏 清空数据
function optionHide(){
	$("#consaleadd").addClass('ub-f1');
	$('.special').addClass('unhide');
	$('.discount').addClass('unhide');
	$('.oddprice ').addClass('unhide');
	$('.discountTypechoose').addClass('unhide');
	$('.mjTypechoose').addClass('unhide');
	$('#consalesetmj').addClass('unhide');	
	$('#activityName').val("");
	$('#startTime').val("");
	$('#endTime').val("");
	$('#dailyStartTime').val("00:00:00");
	$('#dailyEndTime').val("23:59:59");
	$('#branchName').val("");
	$('.ubcheckweek').prop('checked',true);
    $('#dvOnlyVip').removeClass('unhide');
	
	initmmsDom();
}

//初始化买满送 dom结构
function initmmsDom(){
	//买满送
	$('#consolemms').addClass('unhide');
	$(".mmstype").addClass('unhide');
	$('.mmsTypechoose').addClass('unhide');
	
	//初始化为全场折扣
	$("input[name='mmsstatus']").eq(0).prop('checked',true); 
	//初始化 倍数送 促销商品参与
	$("input[name='mmsofactType']").prop('checked',false);
	//初始化活动条件
	$("#activitymmsType").combobox('setValue',0)
	
	choosemmsTab(2);
}

//买满送 tab标签内容控制
function choosemmsTab(type){
	$("#mmsTab").find("li").removeClass("tabs-selected").eq(0).addClass("tabs-selected");
	if(type == '2'){
		//全场时  标签页隐藏
		$("#mmsTab").addClass('unhide');
		//隐藏第一个div datagrid 
		$("#area1").addClass("unhide");
		//显示 第二个 div datagrid 
		$("#area2").removeClass("unhide");
	}else{
		//否则   标签页显示
		$("#mmsTab").removeClass('unhide');
		//隐藏第一个div datagrid 
		$("#area1").removeClass("unhide");
		//显示 第二个 div datagrid 
		$("#area2").addClass("unhide");
	}
	
}

var hasClickTab = false;
//点击买满送tab 控制页面内容显示
function clickmmsTab(type){
	$("#mmsTab").find("li").removeClass("tabs-selected").eq(type-1).addClass("tabs-selected");
	var tabtext = $("#mmsTab").find("li.tabs-selected .tabs-title").text();
	//类别 - 商品
	if(type == 1){
		$("#area1").removeClass("unhide");
		$("#area2").addClass("unhide");
	}else{
		$("#giftip").removeClass('umar-t30').addClass('umar-t56');
		//赠品信息
		$("#area1").addClass("unhide");
		$("#area2").removeClass("unhide");
		if(!hasClickTab){
			hasClickTab = true;
			$("#mmsgradedList").datagrid("load");
		}
	}
}

//买满送  
function selectOptionmms(param){
	//optionHide();
	$('#consaleadd').addClass('unhide');
	
	$('.mmsTypechoose').removeClass('unhide');
	$('.mmstype').removeClass('unhide');
    $('#dvOnlyVip').addClass('unhide');
	$('#consolemms').addClass('ub-f1');
	$('#consolemms').removeClass('unhide');
    //初始化为全场折扣
    $("input[name='mmsstatus'][value='"+param.activityScope+"']").prop('checked',true);
    //初始化 倍数送 促销商品参与
    $("#mmsofactType1").prop('checked',param.allowActivity == 1?true:false);
    $("#mmsofactType2").prop('checked',param.allowMultiple == 1?true:false);

    gridTitleName = param.activityPattern == 1 ?'买满数量':'买满金额';

    //初始化活动条件
    $("#activitymmsType").combobox('setValue',param.activityPattern);
	
	//先移除事件
	//买满送 --- 全场 类别 商品 选择事件 禁用
	$(document).on('click','input[name="mmsstatus"]',function(){
		return false;
	})
	//买满送 --- 倍数送 促销活动 禁用
	$(document).on('click','input[name="mmsofactType"]',function(){
		return false;
	})
    choosemmsTab(param.activityScope);
	//类别
	if(param.activityScope == 1){
		$("#tabone").text("类别信息");
		initDatagridmmjComLB(activityId);
	}
	//商品
	if(param.activityScope == 0){
		$("#tabone").text("商品信息");
		initDatagridmmjComLG(activityId);
	}
	//初始化买满送 梯度datagrid
	initDatagridmmsTJ(param.activityId);
	//买满送 礼品列表
	initDatagridmmsGOOD(param.activityId);
	
}

var gridHandelT = new GridClass();
var gridTitleName = "买满金额"; //买满送梯度标题设置

//买满条件默认数据
var mmsTJDefault={
	 limitCount:0,
	 limitAmount:0,
}
var temGflag = false;
//初始化表格-买满送条件  梯度
function initDatagridmmsTJ(activityId){
    $("#mmsgradedList").datagrid({
        align:'center',
        method:'post',
        queryParams:{
        	activityId:activityId
        },
        url:contextPath+"/sale/activity/getGradientForFullGive",
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        fit:true, //占满
//        showFooter:true,
		height:'50%',
//		pagination:true,
//		pageSize:50,
		width:'100%',
        columns:[[
					{field:'limitCount',title:'买满数量',width:'80px',align:'right',hidden:gridTitleName =='买满数量'?false:true,
		                formatter:function(value,row,index){
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                }
		            }, 
		            {field:'limitAmount',title:'买满金额',width:'80px',align:'right',hidden:gridTitleName =='买满金额'?false:true,
		                formatter:function(value,row,index){
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                }
		            }, 
          ]],
        onClickRow : function(rowIndex, rowData) {
            if(rowData && rowData.giftPoList){
            	if(rowData.giftPoList.length > 0){
            		gridHandel.setLoadData(rowData.giftPoList)
            	}
	      	}else{
	      		gridHandel.setLoadData([$.extend({},gridDefaultG)])
	      	}
		},
        onLoadSuccess:function(data){
           var _this = this;
     	   if(data.list && data.list.length > 0){
     		  gridHandel.setLoadData(data.list[0].giftPoList);
     	   }
     	   $(_this).datagrid('resize',{width:'100%',height:'300px'})
     	   
    	  gridHandelT.setDatagridHeader("center");
	  }
    });
 }

//初始化表格-买满送 礼品默认数据
var gridDefaultG = {
	limitCount:0,	
	limitAmount:0,
}

//初始化表格-买满送 赠品 商品
function initDatagridmmsGOOD(){
	gridHandel.setGridName("mmsgoodList");
    $("#mmsgoodList").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        fit:true, //占满
        showFooter:true,
		height:'100%',
//		pageSize:50,
//		pagination:true,
		width:'100%',
        columns:[[
					{field:'skuCode',title:'货号',width:'80',align:'left'},
					{field:'skuName',title:'商品名称',width:'180',align:'left'},
					{field:'barCode', title: '条码', width:180, align: 'left'},
					{field:'unit', title: '单位', width:70, align: 'left'},
		            {field:'spec', title: '规格', width:70, align: 'left'},
		            {field:'salePrice',title:'零售价',width:'80px',align:'right',
		            	formatter:function(value,row,index){
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		            }, 
					{field:'giftNum',title:'数量',width:'100px',align:'right',
		            	formatter:function(value,row,index){
		            		if(!value){
		            			row['giftNum'] = 0;
		            		}
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                }
		            }, 
					{field:'giftAmount',title:'增加金额',width:'80px',align:'right',
		            	formatter:function(value,row,index){
		            		if(!value){
		            			row['giftAmount'] = 0;
		            		}
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                }
		            } 
          ]],
      onLoadSuccess:function(data){
    	  var _this = this;
    	   $(_this).datagrid('resize',{width:'100%',height:'300px'})
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefaultG)])
 }

var gridHandelB = new GridClass();
//初始化表格-买满送 主设置 -类别
function initDatagridmmjComLB(activityId){
	gridHandelB.setGridName("mmscommonList");
  $("#mmscommonList").datagrid({
      align:'center',
      url:contextPath+"/sale/activity/getDetailFullGive?activityId="+activityId,
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
      //fitColumns:false,    // 每列占满
      fit:true, //占满
//      pagination:true,
		height:'50%',
//		pageSize:50,
		width:'100%',
		columns:[[
				{field:'goodsCategoryCode',title:'类别编码',width:'140',align:'left'},
				{field:'categoryName',title:'类别名称',width:'140',align:'left'},
					
      ]],
      onLoadSuccess:function(data){
    	  $(this).datagrid('resize',{width:'100%'});
    	  gridHandelB.setDatagridHeader("center");
      }
  });
}

var gridHandelG = new GridClass();

//初始化表格-买满送 主设置 -商品
function initDatagridmmjComLG(activityId){
	gridHandelG.setGridName("mmscommonList");
    $("#mmscommonList").datagrid({
      align:'center',
      url:contextPath+"/sale/activity/getDetailFullGive?activityId="+activityId,
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
      //fitColumns:false,    // 每列占满
      fit:true, //占满
		height:'50%',
//		pagination:true,
//		pageSize:50,
		width:'100%',
		columns:[[
				  {field:'skuCode',title:'货号',width:'80',align:'left'},
				  {field:'skuName',title:'商品名称',width:'180',align:'left'},
				  {field:'barCode', title: '条码', width:180, align: 'left'},
				  {field:'unit', title: '单位', width:70, align: 'left'},
		          {field:'spec', title: '规格', width:70, align: 'left'},
		          {field:'price',title:'零售价',width:'80px',align:'right',
		            	formatter:function(value,row,index){
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		            }
        ]],
	    onLoadSuccess:function(data){
	    	$(this).datagrid('resize',{width:'100%'});
	    	gridHandelG.setDatagridHeader("center");
	  }
  });
}

//买满送 金额改变监听
function changeGiftPrice(newV,oldV){
	var _this = this;
	var tempPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'salePrice');
	if(parseFloat(newV||0) > parseFloat(tempPrice||0)){
		$_jxc.alert('新增金额不得大于零售价',function(){
			$(_this).numberbox('setValue',(oldV||0));
		});
	}
}


var gridHandel = new GridClass();
// 公用表格请求公用方法
function initmangeDatagrid(activityId){
	 $("#saleMangeadd").datagrid("options").method = "get";
     $("#saleMangeadd").datagrid("options").url =contextPath+"/sale/activity/getDetail?activityId="+activityId;
     $("#saleMangeadd").datagrid("load");
}
// 满减请求方法 saleMangeadd
function initmjOneDatagrid(activityId){
	$("#saleMangeadd").datagrid("options").method = "get";
    $("#saleMangeadd").datagrid("options").url =contextPath+"/sale/activity/getDetailFullCut?activityId="+activityId;
    $("#saleMangeadd").datagrid("load");
}
// 满减请求方法 salesetmj
function initmjTowDatagrid(activityId){
	$("#salesetmj").datagrid("options").method = "get";
    $("#salesetmj").datagrid("options").url =contextPath+"/sale/activity/getLimitAmountFullCut?activityId="+activityId;
    $("#salesetmj").datagrid("load");
}

//满减请求方法 saleMangeadd
function initmjFullDatagrid(activityId){
	$("#saleMangeadd").datagrid("options").method = "get";
    $("#saleMangeadd").datagrid("options").url =contextPath+"/sale/activity/getLimitAmountFullCut?activityId="+activityId;
    $("#saleMangeadd").datagrid("load");
}


var datagridObj;
// 初始化表格-特价
function initDatagridSpecial(){
	gridHandel.setGridName("saleMangeadd");
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
    })
    datagridObj = $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
//        pagination:true,    // 分页
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'100%',
//		pageSize:50,
		width:'100%',
        columns:[[
					// {field:'ck',checkbox:true},
					{field:'skuCode',title:'货号',width:'85px',align:'left'},
					{field:'skuName',title:'商品名称',width:'200px',align:'left'},
					{field:'barCode',title:'条码',width:'150px',align:'left'},
					{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
					{field:'unit',title:'单位',width:'60px',align:'left'},
					{field:'spec',title:'规格',width:'90px',align:'left'},
					{field:'price',title:'单价',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                        return
		                    }
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
//		                editor:{
//		                    type:'numberbox',
//		                    options:{
//		                        disabled:true,
//		                        min:0,
//		                        precision:2,
//		           
//		                    }
//		                },
		            },
		            {field: 'saleAmount', title: '促销价', width: 100, align: 'right',
		                formatter : function(value, row, index) {
		                    if(row.isFooter){
		                        return;
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
		                },
		            },
            {
                field: 'discountNum', title: '整单商品限量', width: 150, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    if(!value){
                        row["discountNum"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
        ]],
      onLoadSuccess:function(data){
		gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)]) 
}

//初始化表格-全场折扣
function initDatagridallZk(){
	gridHandel.setGridName("saleMangeadd");
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'100%',
		pageSize:50,
		width:'100%',
        columns:[[
					{field:'actType',title:'活动类型',width:'200px',align:'left',
						formatter:function(value,row,index){
							return "全场折扣";
						}
					},
					{field:'discount',title:'折扣',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                    	return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                    }
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                }
		            }, 
          ]],
  		onClickCell : function(rowIndex, field, value) {
			gridHandel.setBeginRow(rowIndex);
			gridHandel.setSelectFieldName(field);
			var target = gridHandel.getFieldTarget(field);
			if(target){
				gridHandel.setFieldFocus(target);
			}else{
				gridHandel.setSelectFieldName("discount");
			}
		},
      onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
    });
 }

// 初始化表格-类别折扣
function initDatagridsortZk(){
	gridHandel.setGridName("saleMangeadd");
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
    })
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
//        pagination:true,    // 分页
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'100%',
//		pageSize:50,
		width:'100%',
        columns:[[
					// {field:'ck',checkbox:true},
					{field:'goodsCategoryCode',title:'类别编码',width:'200px',align:'left'},
					{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
					 {field:'discount',title:'折扣',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                        return
		                    }
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                    	disabled:true,
		                        min:0,
		                        precision:2,
		           
		                    }
		                },
		            }, 
          ]],
      onLoadSuccess:function(data){
    	  
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)])
 }

// 初始化表格-单品折扣
function initDatagridoneZk(){
	gridHandel.setGridName("saleMangeadd");
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
    })
   $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
//        pagination:true,    // 分页
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'100%',
//		pageSize:50,
		width:'100%',
        columns:[[
			// {field:'ck',checkbox:true},
			{field:'skuCode',title:'货号',width:'85px',align:'left'},
			{field:'skuName',title:'商品名称',width:'200px',align:'left'},
			{field:'barCode',title:'条码',width:'150px',align:'left'},
			{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
			{field:'unit',title:'单位',width:'60px',align:'left'},
			{field:'spec',title:'规格',width:'90px',align:'left'},
			 {field:'price',title:'单价',width:'80px',align:'right',
			    formatter:function(value,row,index){
			        if(row.isFooter){
			            return
			        }
			        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
//			    editor:{
//			        type:'numberbox',
//			        options:{
//			            disabled:true,
//			            min:0,
//			            precision:2,
//			        }
//			    },
			},
			{field: 'discount', title: '折扣', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
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
			    },
			},
          ]],
      onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)])
   }

// 初始化表格-偶数特价
function initDatagridOddtj(){
	gridHandel.setGridName("saleMangeadd");
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
    })
  
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
//        pagination:true,    // 分页
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'100%',
//		pageSize:50,
		width:'100%',
        columns:[[
			// {field:'ck',checkbox:true},
			{field:'skuCode',title:'货号',width:'85px',align:'left'},
			{field:'skuName',title:'商品名称',width:'200px',align:'left'},
			{field:'barCode',title:'条码',width:'150px',align:'left'},
			{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
			{field:'unit',title:'单位',width:'60px',align:'left'},
			{field:'spec',title:'规格',width:'90px',align:'left'},
			 {field:'price',title:'单价',width:'80px',align:'right',
			    formatter:function(value,row,index){
			        if(row.isFooter){
			            return
			        }
			        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
			{field: 'saleAmount', title: '偶数特价', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
            {
                field: 'discountNum', title: '整单商品限量', width: 150, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    if(!value){
                        row["discountNum"] = parseFloat(value||0).toFixed(2);
                    }

                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
          ]],
      onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)])
}


// 初始化表格-换购
function initDatagridRedemption(){
  gridHandel.setGridName("saleMangeadd");
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
  })

  $("#saleMangeadd").datagrid({
      align:'center',
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
//      pagination:true,    // 分页
      fitColumns:true,    // 每列占满
      // fit:true, //占满
      showFooter:true,
		height:'100%',
//		pageSize:50,
		width:'100%',
      columns:[[
			// {field:'ck',checkbox:true},
			{field:'skuCode',title:'货号',width:'85px',align:'left'},
			{field:'skuName',title:'商品名称',width:'200px',align:'left'},
			{field:'barCode',title:'条码',width:'150px',align:'left'},
			{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
			{field:'unit',title:'单位',width:'60px',align:'left'},
			{field:'spec',title:'规格',width:'90px',align:'left'},
			 {field:'price',title:'单价',width:'80px',align:'right',
			    formatter:function(value,row,index){
			        if(row.isFooter){
			            return
			        }
			        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
			{field: 'saleAmount', title: '换购价', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
        ]],
    onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
  });
  gridHandel.setLoadData([$.extend({},gridDefault)])
}

// 初始化表格-全场满减
function initDatagridallMj(){
	gridHandel.setGridName("saleMangeadd");
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
    })
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
//        pagination:true,    // 分页
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'100%',
//		pageSize:50,
		width:'100%',
        columns:[[
					// {field:'ck',checkbox:true},
					{field:'limitAmount',title:'买满金额',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                        return
		                    }
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                }
		            }, 
					{field:'discountPrice',title:'优惠额',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                        return
		                    }
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                }
		            }, 
          ]],
      onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)])
}

// 初始化表格-类别满减
function initDatagridsortMj(){
	gridHandel.setGridName("saleMangeadd");
    $("#saleMangeadd").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
//        pagination:true,    // 分页
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'300px',
//		pageSize:50,
		width:'100%',
        columns:[[
					// {field:'ck',checkbox:true},
            		{field:'goodsCategoryCode',title:'类别编码',width:'200px',align:'left'},
					{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
          ]],
           onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefault)])
}
// 初始化表格-类别满减设置
var gridHandelMj = new GridClass();
function initDatagridsortSet(){
	gridHandelMj.setGridName("salesetmj");
    $("#salesetmj").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
//        pagination:true,    // 分页
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'500px',
//		pageSize:50,
		width:'100%',
        columns:[[
					// {field:'ck',checkbox:true},
					{field: 'limitAmount', title: '买满金额', width: '100px', align: 'right',
					    formatter : function(value, row, index) {
					        if(row.isFooter){
					            return;
					        }
					        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					    }
					},
					{field: 'discountPrice', title: '优惠额', width: '100px', align: 'right',
					    formatter : function(value, row, index) {
					        if(row.isFooter){
					            return;
					        }
					        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					    }
					},
          ]],
         
          onLoadSuccess:function(data){
        	 gridHandelMj.setDatagridHeader("center");
        	 // addrowsdt();
		 },
		 onClickCell:function(rowIndex,field,value){
			 gridHandelMj.setBeginRow(rowIndex);
			 gridHandelMj.setSelectFieldName(field);
	            var target = gridHandelMj.getFieldTarget(field);
	            if(target){
	            	gridHandelMj.setFieldFocus(target);
	            }else{
	            	gridHandelMj.setSelectFieldName("skuCode");
	            }
	        },
    });
    gridHandelMj.setLoadData([$.extend({},gridDefault)])
}


// 初始化表格-商品满减
function initDatagridshopMj(){
	gridHandel.setGridName("saleMangeadd");
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
	  })
  $("#saleMangeadd").datagrid({
      align:'center',
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
//      pagination:true,    // 分页
      fitColumns:true,    // 每列占满
      // fit:true, //占满
      showFooter:true,
		height:'300px',
//		pageSize:50,
		width:'100%',
      columns:[[
			// {field:'ck',checkbox:true},
			{field:'skuCode',title:'货号',width:'85px',align:'left'},
			{field:'skuName',title:'商品名称',width:'200px',align:'left'},
			{field:'barCode',title:'条码',width:'150px',align:'left'},
			{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
			{field:'unit',title:'单位',width:'60px',align:'left'},
			{field:'spec',title:'规格',width:'90px',align:'left'},
			 {field:'price',title:'单价',width:'80px',align:'right',
			    formatter:function(value,row,index){
			        if(row.isFooter){
			            return
			        }
			        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
        ]], 
       
        onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
			// selectAddRows(data);
		 }
  });
  gridHandel.setLoadData([$.extend({},gridDefault)])

}

// 初始化表格-组合特价
function initDatagridCompose(){
  gridHandel.setGridName("saleMangeadd");
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
  })
  $("#saleMangeadd").datagrid({
      align:'center',
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
//      pagination:true,    // 分页
      fitColumns:true,    // 每列占满
      // fit:true, //占满
      showFooter:true,
		height:'100%',
//		pageSize:50,
		width:'100%',
      columns:[[
			// {field:'ck',checkbox:true},
			{field:'skuCode',title:'货号',width:'85px',align:'left'},
			{field:'skuName',title:'商品名称',width:'200px',align:'left'},
			{field:'barCode',title:'条码',width:'150px',align:'left'},
			{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
			{field:'unit',title:'单位',width:'60px',align:'left'},
			{field:'spec',title:'规格',width:'90px',align:'left'},
			{field:'price',title:'单价',width:'80px',align:'right',
			    formatter:function(value,row,index){
			        if(row.isFooter){
			            return
			        }
			        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
			{field: 'limitCount', title: '组合数量', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
			{field: 'saleAmount', title: '组合特价', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
			{field: 'groupNum', title: '组号', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        return '<b>'+parseFloat(value||0).toFixed(0)+'</b>';
			    }
			},
        ]],
       onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
  });
  gridHandel.setLoadData([$.extend({},gridDefault)])
}


// 查询入库单
function queryForm(){
	if($("#branchName").val()==""){
        $_jxc.alert("请选择店铺名称");
        return;
    } 
	var fromObjStr = $('#queryForm').serializeObject();
	$("#saleMangeadd").datagrid("options").method = "post";
	$("#saleMangeadd").datagrid('options').url = contextPath + '/categorySale/report/getCategorySaleList';
	$("#saleMangeadd").datagrid('load', fromObjStr);
}
// 批量设置
function specialRows(id,val){
	// 获取选中行的Index的值
	var rowIndex = -1;
	var newData = $("#"+datagridId).datagrid("getRows");
	if(id=="special"){
		for(var i = 0;i < newData.length;i++){
			newData[i].saleAmount= val;
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
	else if(id=="discount"){
		for(var i = 0;i < newData.length;i++){
			newData[i].discount= val;
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
	else if(id=="batchcount"){
		for(var i = 0;i < newData.length;i++){
			newData[i].saleAmount= val;
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
// 插入动态行
function addrowsdt(){
	// 活动类型
	var activityType=$("#activityType").combobox('getValue');
	if(activityType=="5"){
		var rows=$('#saleMangeadd').datagrid('getRows');
	    for(var i = 1; i < rows.length; i++){
	    	$('#salesetmj').datagrid('appendRow',[{cz:'',limitAmount:'1',discountPrice:''}]);  
		  	
	     }
	   
	}
}
// 选择商品插入动态行
function selectAddRows(data){
	var row=data.rows;
	if(row.length==0){
		return
	}
	// 活动类型
	var activityType=$("#activityType").combobox('getValue');
	if(activityType=="5"){
	    for(var i = 0; i < row.length; i++){
	    	$('#salesetmj').datagrid('appendRow',[{cz:'',limitAmount:'1',discountPrice:''}]);  
		  	
	     }
	}
}
// 插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
// 减速设置插入一行
function addLineHandelmj(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandelMj.addRow(index,gridDefault);
}
// 删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}
// 减速设置插入一行
function delLineHandelmj(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandelMj.delRow(index);
}


/**
 * 星期选择赋值
 */
function weekCheckDay(){
  var len=$('#weekday .ubcheckweek').length;
  var str="";
  for(var i=0;i<len;i++){
	 var elemt=$('#weekday .ubcheckweek').eq(i).find('.ub');
	 var check= elemt.prop("checked");
	  if(check){
		str+=elemt.val()
	   }
    }
  console.log(str)
  $('#weeklyActivityDay').val(str);
}

/**
 * 星期拆分字符串赋值checkbox
 */
function StrweekCheckDay(weekstr){
	$(".ubcheckweek .ub").prop("checked",false);
	var arrWeek = weekstr.split("");
	$.each(arrWeek,function(i,val){
		$("#weekcheckbox"+val+".ub").prop("checked",true);
	})
	
}

// 返回列表页面
function back(){
	location.href = contextPath +"/sale/activity/list";
}

// 终止
function stop(){
	var activityId = $("#activityId").val();
	$_jxc.confirm('是否终止此活动？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/sale/activity/stop",
		    	data : {
		    		activityId:$("#activityId").val(),
		    	}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/sale/activity/edit?activityId="+activityId;
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//新增
function addActivity(){
	toAddTab("新增促销活动",contextPath + "/sale/activity/add");
}

//复制活动
function copyActivity(){
	var activityId = $("#activityId").val();
	if(activityId){
		toAddTab("复制促销活动",contextPath + "/sale/activity/toCopy?from=toCopy&activityId="+activityId);
	}
}



