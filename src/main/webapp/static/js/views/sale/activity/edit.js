//全局变量
var datagridId = "saleMangeadd";
// var activtype="";
// var activityType="";
var gridDefault = {
    oldSaleRate:"0.00%",
    newSaleRate:"0.00%"
}
var sUrl =  getUrlQueryString('from'); //获取url from='toCopy' 参数 == 促销活动标示

var oldData = {};
var commonOldData = {};
var mmscomOldData = {}; 
var checkUtil = new checkUtil();

var dvVip = '<div id="dvVip" class="ub ub-ac umar-l20"> ' +
    '<div class="ub ub-ac umar-r10"> ' +
    '<input class="ub" type="checkbox" id="memberExclusive"  name="memberExclusive"  value="1" /><label for="memberExclusive">会员独享</label>'+
    '</div> ' +
    '</div>';
var dvVipOne = '<div id="dvVipOne" class="ub ub-ac umar-l20"> ' +
    '<div class="ub ub-ac umar-r10"> ' +
    '<input class="ub" type="checkbox" id="memberExclusiveNum"  name="memberExclusiveNum"  value="1" disabled/><label for="memberExclusiveNum">会员每日独享一次</label>' +
    '</div> ' +
    '</div>';

var dvzhspecial =  ' <div class="ub ub-ac umar-l50" id="dvzhspecial"> ' +
    '<div class="ub ub-ac umar-r10"> ' +
    '<input class="ub" type="checkbox" id="memberExclusive"  name="memberExclusive"  value="1" /><label for="memberExclusive">会员独享</label>'+
    '</div> ' +
    '<div class="ub ub-ac umar-r10"> ' +
    '<input class="ub" type="checkbox" id="memberExclusiveNum"  name="memberExclusiveNum"  value="1" disabled/><label for="memberExclusiveNum">会员每日独享一次</label>' +
    '</div> ' +
    '</div>';

var dvmms = ' <div class="ub ub-ac umar-l30" id="dvmms"> ' +
    '<div class="ub ub-ac umar-r10"> ' +
    '<input class="ub mmradioAct" type="checkbox" id="mmsofactType1"  name="mmsofactType"  value="2" />' +
    '<label for="mmsofactType1">促销商品参与</label> </div>' +
    ' <div class="ub ub-ac umar-r10"> ' +
    '<input class="ub mmradioAct" type="checkbox" id="mmsofactType2" name="mmsofactType" value="1" /><label for="mmsofactType2">倍数送</label> ' +
    '</div> ' +
    '<div class="ub ub-ac umar-r10"> ' +
    '<input class="ub" type="checkbox" id="memberExclusive"  name="memberExclusive"  value="1" /><label for="memberExclusive">会员独享</label>'+
    '</div> ' +
    '<div class="ub ub-ac umar-r10"> ' +
    '<input class="ub" type="checkbox" id="memberExclusiveNum"  name="memberExclusiveNum"  value="1" disabled/><label for="memberExclusiveNum">会员每日独享一次</label>' +
    '</div> ' +
    '</div>';

$(function(){
	checkUtil.setFormId('queryFormEditAct');
	
	//开始和结束时间
    $("#dailyStartTime").val("00:00:00");
    $("#dailyEndTime").val("23:59:59");
    
    //如果是门店，则只能查看当前店铺数据
	if(sessionBranchType >= 3){
		$("#selectBranch").hide();
		$("#branchName").prop('disabled','disabled');
		$("#branchName").unbind("click");
	}

    optionHide();
    //禁止按钮点击事件
    disableGoods('','GoodsType');
	editstart();

	//一周星期获取和初始化
	//weekCheckDay();
	$(document).on('click','#weekday .ubcheckweek',function(){
	//点击取消切换方法执行
	  weekCheckDay();
	});
	
	//机构选择初始化 分组
	$('#branchComponent').branchSelect({
		param:{
			selectType:1,  //多选
			view:'group', //分组
			formType:'DP'
		},
		loadFilter:function(data){
			if(data && data.length >0 ){
				data.forEach(function(obj,index){
					obj.branchIds = obj.branchId;
				})	
			}
			return data;
		},
		onAfterRender:function(data){
			$('#branchName').attr('title',$('#branchName').val());
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
    				$('#branchIds').val(result&&result.branchId);
    				$('#branchName').attr('title',result&&result.branchName);
    				$('#branchsFullName').val(result&&result.branchName);
    			})
    		}
     	}
	});

});

function initCheck(){

	if($("#memberExclusive").is(":checked")){
        $("#memberExclusiveNum").removeProp("disabled");
	}

    $("#memberExclusive").on("click",function () {
        if($("#memberExclusive").is(":checked")){
            $("#memberExclusiveNum").removeProp("disabled");
        }else{
            $("#memberExclusiveNum").removeProp("checked")
            $("#memberExclusiveNum").prop("disabled","disabled");
        }
    })
}

//回车处理逻辑 bug20207 2.6.5
function checkenter(){
	return $('input[type="hidden"][name="activityType"]').val() == '2' && $('input[name="disstatus"]:checked').val() == '2';
}

//特价
function changeSpecNum(newV,oldV){
	if(newV && newV>0){
		specialRows('special',newV);
	}
}

//折扣
function changeDisNum(newV,oldV){
	if(newV && newV>0){
		specialRows('discount',newV);
	}
}

//偶数特价
function changeOddprice(newV,oldV){
	if(newV && newV>0){
		specialRows('batchcount',newV);
	}
}

var activityId;
//编辑请求数据
function  editstart(){
	activityId = $("#activityId").val();
	$_jxc.ajax({
	      url:contextPath+"/sale/activity/get?activityId="+activityId,
	      type:"get",
	      contentType:'application/json'
	  },function(data){
	    	  if(data['code'] == 0){
	    		var listinfo=data['obj'];
	    		 
	    		if(undefined == listinfo){
	    			 $_jxc.alert("服务器返回数据异常.");
	    			return;
	    		}  
	    		     //select 状态切换
	    		   var activtype=listinfo.activityType;
	    		     //radio 状态切换
	    		    activScope=listinfo.activityScope;
	    		    
		    		//活动名称
		    		$('#activityName').val(data.obj.activityName);

		    		//日期转换格式
		    	    var startTimeedit= new Date(listinfo.startTime);
		    	    var endTimeedit=new Date(listinfo.endTime);
		    	    startTimeedit=startTimeedit.format("yyyy-MM-dd"); 
		    	    endTimeedit=endTimeedit.format("yyyy-MM-dd");
		    	    //复制过来的  不赋值
		    		if(sUrl != 'toCopy'){
		    			$('#startTime').val(startTimeedit);
		    			$('#endTime').val(endTimeedit);
		    		}
		    		//时间转换格式
		    		 var dailyStartTimeedit= new Date(listinfo.dailyStartTime);
			    	 var dailyEndTimeedit=new Date(listinfo.dailyEndTime);
		    		 dailyStartTimeedit=listinfo.dailyStartTime.format("HH:mm:ss"); 
		    		 dailyEndTimeedit=listinfo.dailyEndTime.format("HH:mm:ss");
		    		//复制过来的  不赋值
			    	 if(sUrl != 'toCopy'){
			    		 $('#dailyStartTime').val(dailyStartTimeedit);
			    		 $('#dailyEndTime').val(dailyEndTimeedit);
			    		 $('#weeklyActivityDay').val(listinfo.weeklyActivityDay);
			    		 //var strweek=$('#weeklyActivityDay').val();
			    		 //星期字符串处理
			    		 StrweekCheckDay(listinfo.weeklyActivityDay);
			    	 }
			    	 weekCheckDay();
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
		    		 branchName = branchName.substring(0,branchName.length - 1);
		    		//复制过来的  不赋值
			    	 if(sUrl != 'toCopy'){
			    		 var branchsName =data.obj.branchsName;
			    		 var branchsFullName =data.obj.branchsFullName;
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
			    		 
			    		 $('#branchIds').val(branchIds);
			    	 }
			    	 
                    //combobox 下拉赋值和禁止选择
  		    		$("#activityType").combobox('select',activtype);  
  		    		$("#activityType").combobox("disable");
  		    		if(sUrl != 'toCopy'){
  		    			//序列化指定表单  -- 旧数据
  		    			oldData = checkUtil.assignInput();
  		    		}
	  		    	//满减类型赋值
					if(activtype==5){		
                        var param = {
                            activityScopemj:listinfo.activityScope,
                            memberExclusive:listinfo.memberExclusive,
                            memberExclusiveNum:listinfo.memberExclusiveNum
                        }
                        selectOptionMj(param);
						//买满送
					  }else if(activtype==10){

						  var param = {
                              			activityScope :listinfo.activityScope,
										 activityPattern  : listinfo.activityPattern,
										 allowActivity : listinfo.allowActivity,
										 allowMultiple :listinfo.allowMultiple,
										activityId:activityId,
                              			memberExclusive:listinfo.memberExclusive,
                              			memberExclusiveNum:listinfo.memberExclusiveNum
						  }
						  selectOptionmms(param);
					  }
					  //其他类型请求
					  else if(activtype==2){
					  	var param = {
                            activityId:activityId,
                            activityScopedis:listinfo.activityScope,
                            memberExclusive:listinfo.memberExclusive,
                            memberExclusiveNum:listinfo.memberExclusiveNum,
                            maxDiscountAmount:listinfo.maxDiscountAmount
						}
                        selectOptionzk(param);

			    		}else if(activtype==1){
							var param = {
                                activityId:activityId,
								memberExclusive:listinfo.memberExclusive,
								memberExclusiveNum:listinfo.memberExclusiveNum
							}
							selectOptionSpecial(param)
			    		}else if(activtype==3){
							var param = {
                                activityId:activityId,
								memberExclusive:listinfo.memberExclusive,
								memberExclusiveNum:listinfo.memberExclusiveNum
							}
                        	selectOptionOdd(param);
						 }else if(activtype==6){
							var param = {
                                activityId:activityId,
								memberExclusive:listinfo.memberExclusive,
								memberExclusiveNum:listinfo.memberExclusiveNum,
                                maxDiscountNum:listinfo.maxDiscountNum
							}
                        selectOptionGroupSpecial(param);
			    		}

	              }else{
	             
	            	  $_jxc.alert(data['message']);
	          }

        initCheck();
	  });
}

function selectOptionGroupSpecial(param) {
    $(".activityTypeDv").after(dvVip);
    $('.limitCount').removeClass('unhide');
    $('.limitCount').after(dvVipOne);
    $("#memberExclusive").prop('checked',param.memberExclusive == 1?true:false);
    $("#memberExclusiveNum").prop('checked',param.memberExclusiveNum == 1?true:false);
    $("#maxDiscountNum").numberbox("setValue",param.maxDiscountNum);
    //组合特价
    initDatagridCompose();
    initmangeDatagrid(param.activityId);
}

//特价状态选择隐藏
function selectOptionSpecial(param){
    //设置批量特价不显示 除了activtype==1
    $('.special').removeClass('unhide');
    $(".special").after(dvVipOne);
    $(".activityTypeDv").after(dvVip);
    $("#memberExclusive").prop('checked',param.memberExclusive == 1?true:false);
    $("#memberExclusiveNum").prop('checked',param.memberExclusiveNum == 1?true:false);
    initDatagridSpecial();
    initmangeDatagrid(param.activityId);
}

//偶数特价状态选择隐藏
function selectOptionOdd(param){
    $('.oddprice ').removeClass('unhide');
    $(".oddprice").after(dvzhspecial);
    $("#memberExclusive").prop('checked',param.memberExclusive == 1?true:false);
    $("#memberExclusiveNum").prop('checked',param.memberExclusiveNum == 1?true:false);
    initDatagridOddtj();
    initmangeDatagrid(param.activityId);
}

//折扣状态状态radio 赋值
function selectOptionzk(param){
	var radioVal = param.activityScopedis;
	$('.disradio').prop('checked',false);
	$('#disradio'+radioVal).prop('checked',true);
	$('#activityScopedis').val(radioVal);
    $(".topMoney").removeClass("unhide");
    $(".topMoney").after(dvzhspecial);
    $("#memberExclusive").prop('checked',param.memberExclusive == 1?true:false);
    $("#memberExclusiveNum").prop('checked',param.memberExclusiveNum == 1?true:false);
    $("#maxDiscountAmount").numberbox("setValue",param.maxDiscountAmount);//最高优惠
	//类别折扣
	if(radioVal=="1"){
  	  initDatagridsortZk();
  	  //禁止按钮点击事件
  	  disableGoods('SelectGoods','');
        $(".discount").removeClass('unhide');
    }else if(radioVal=="2"){
      //全场折扣
      initDatagridallZk();
      $(".discount").addClass('unhide');
      disableGoods('SelectGoods','GoodsType');
    }
    else{
      //单品折扣	 
  	  initDatagridoneZk();
  	  //禁止按钮点击事件
  	  disableGoods('','GoodsType');
        $(".discount").removeClass('unhide');
    }
    initmangeDatagrid(param.activityId);

}
//满减状态radio 赋值
function selectOptionMj(param){
    var radioVal = param.activityScopemj;
	$('.mjradio').prop('checked',false);
	$('#mjradio'+radioVal).prop('checked',true); 
	$('#activityScopemj').val(radioVal);
    $("#branchComponent").after(dvzhspecial);
    $("#memberExclusive").prop('checked',param.memberExclusive == 1?true:false);
    $("#memberExclusiveNum").prop('checked',param.memberExclusiveNum == 1?true:false);
    // 禁止按钮点击事件
    disableGoods('SelectGoods','GoodsType');

	if(radioVal=="2"){
        $('#consaleadd').removeClass('unhide');
        $('#consalesetmj').addClass('unhide');
        $('#activityScopemj').val('2');
        //禁止按钮点击事件
        disableGoods('SelectGoods','GoodsType');
	  	initDatagridallMj(); 
		initDatagridsortSet();
	}
    else if(radioVal=="1"){
        $("#consaleadd").removeClass('ub uw ub-f1 umar-t20');
        $('#consaleadd').removeClass('unhide');
        $('#consalesetmj').removeClass('unhide');
        $('#activityScopemj').val('1');
        //禁止按钮点击事件
        disableGoods('SelectGoods','');
  	  initDatagridsortMj();
  	  initDatagridsortSet();
    }
    else {
        $("#consaleadd").removeClass('ub uw ub-f1 umar-t20');
        // $("#consaleadd").removeClass('ub-f1');
        $('#consaleadd').removeClass('unhide');
        $('#consalesetmj').removeClass('unhide');
        $('#activityScopemj').val('0');
        //禁止按钮点击事件
        disableGoods('','GoodsType');
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

//数据清空
function cleardata(){
	$("#saleMangeadd").datagrid('loadData',[{}]);
	$("#saleMangeadd").datagrid('options').url = "";
	$("#salesetmj").datagrid('loadData',[{}]);
	$("#salesetmj").datagrid('options').url = "";
}


//状态初始化 隐藏 清空数据 
function optionHide(){
	// $("#consaleadd").addClass('ub-f1');
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
	// $('#saleMangeadd').datagrid('loadData', { total: 0, rows: [] });
	// $("#saleMangeadd").datagrid("options").url ="";
	//$('#salesetmj').datagrid('loadData', { total: 0, rows: [] });
	$('.ubcheckweek').prop('checked',true);
	
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
	//买满条件
    gridHandelT.endEditRow();
    gridHandel.endEditRow();
    
	$("#mmsTab").find("li").removeClass("tabs-selected").eq(type-1).addClass("tabs-selected");
	var tabtext = $("#mmsTab").find("li.tabs-selected .tabs-title").text();
	//类别 - 商品
	if(type == 1){
		$("#area1").removeClass("unhide");
		$("#area2").addClass("unhide");
		if(tabtext == '类别信息'){
			disableGoods('SelectGoods','');
		}
	}else{
		$("#giftip").removeClass('umar-t30').addClass('umar-t50');
		disableGoods('','GoodsType');
		//赠品信息
		$("#area1").addClass("unhide");
		$("#area2").removeClass("unhide");
		if(!hasClickTab){
			hasClickTab = true;
			$("#mmsgradedList").datagrid("load");
		}else{
			var rowst = gridHandelT.getRows();
			var rowsg = gridHandel.getRows();
			gridHandelT.setLoadData(rowst);
			gridHandel.setLoadData(rowsg);
		}
	}
}

//买满送  
function selectOptionmms(param){
	//optionHide();
	disableGoods('','GoodsType');
	$('#consaleadd').addClass('unhide');
	
	$('.mmsTypechoose').removeClass('unhide');
	$('.mmstype').removeClass('unhide');
	
	$('#consolemms').addClass('ub-f1');
	$('#consolemms').removeClass('unhide');
    $(".mmstype").after(dvmms);
	
	//初始化为全场折扣
	$("input[name='mmsstatus'][value='"+param.activityScope+"']").prop('checked',true);
	//初始化 倍数送 促销商品参与
	$("#mmsofactType1").prop('checked',param.allowActivity == 1?true:false);
	$("#mmsofactType2").prop('checked',param.allowMultiple == 1?true:false);
    $("#memberExclusive").prop('checked',param.memberExclusive == 1?true:false);
    $("#memberExclusiveNum").prop('checked',param.memberExclusiveNum == 1?true:false);
	
	gridTitleName = param.activityPattern == 1 ?'买满数量':'买满金额';
	
	//初始化活动条件
	$("#activitymmsType").combobox('setValue',param.activityPattern);
	
	//先移除事件
	//买满送 --- 全场 类别 商品 选择事件 禁用
	$(document).on('click','input[name="mmsstatus"]',function(){
		return false;
	})
	//买满送 --- 倍数送 促销活动 禁用
//	$(document).on('click','input[name="mmsofactType"]',function(){
//		return false;
//	})
	
	choosemmsTab(param.activityScope);
	//类别
	if(param.activityScope == 1){
		$("#tabone").text("类别信息");
		initDatagridmmjComLB(param.activityId);
		disableGoods('SelectGoods','');
	}
	//商品
	if(param.activityScope == 0){
		$("#tabone").text("商品信息");
		initDatagridmmjComLG(param.activityId);
		disableGoods('','GoodsType');
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
	gridHandelT.setGridName("mmsgradedList");
	gridHandelT.initKey({
		firstName:gridTitleName == '买满数量' ? 'limitCount':'limitAmount',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
            	//var giftGoodsList = $("#mmsgoodList").datagrid('getRows');
            	gridHandelT.addRow(parseInt(gridHandelT.getSelectRowIndex())+1,mmsTJDefault);
                setTimeout(function(){
                	gridHandelT.setBeginRow(gridHandelT.getSelectRowIndex()+1);
                	if(gridTitleName == '买满数量'){
                		gridHandelT.setSelectFieldName("limitCount");
                    	gridHandelT.setFieldFocus(gridHandelT.getFieldTarget('limitCount'));
                	}else{
                		gridHandelT.setSelectFieldName("limitAmount");
                    	gridHandelT.setFieldFocus(gridHandelT.getFieldTarget('limitAmount'));
                	}
                },100)
            }
        },
    })
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
					{field:'cz',title:'操作',width:'60px',align:'center',
					    formatter : function(value, row,index) {
					        var str = "";
					            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandelmstd(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
					                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandelmstd(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
					        return str;
					    },
					},
					{field:'limitCount',title:'买满数量',width:'80px',align:'right',hidden:gridTitleName =='买满数量'?false:true,
		                formatter:function(value,row,index){
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:2,
		                        onChange:changeLimitCount
		                    }
		                },
		            }, 
		            {field:'limitAmount',title:'买满金额',width:'80px',align:'right',hidden:gridTitleName =='买满金额'?false:true,
		                formatter:function(value,row,index){
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:2,
		                        onChange:changeLimitAmount
		                    }
		                },
		            }
          ]],
       onCheck:function(rowIndex, rowData){
    	   if(rowData && rowData.giftPoList && rowData.giftPoList.length > 0){
           	gridHandel.setLoadData(rowData.giftPoList);
	      	}else{
	      		gridHandel.setLoadData([$.extend({},gridDefaultG)])
	      	}
       },
       onEndEdit:function(rowIndex, rowData){
    	    var _this = this;
    	    gridHandel.endEditRow();
    	    rowData.giftPoList = gridHandel.getRowsWhere({skuName:'1'});
       },
       onBeginEdit:function(rowIndex, rowData){
            if(rowData && rowData.giftPoList && rowData.giftPoList.length > 0){
            	gridHandel.setLoadData(rowData.giftPoList);
	      	}else{
	      		gridHandel.setLoadData([$.extend({},gridDefaultG)])
	      	}
        }, 
  		onClickCell : function(rowIndex, field, value) {
  			gridHandelT.setBeginRow(rowIndex);
  			gridHandelT.setSelectFieldName(field);
			var target = gridHandelT.getFieldTarget(field);
			if(target){
				gridHandelT.setFieldFocus(target);
			}else{
				var temS = gridTitleName =='买满金额'?'limitAmount':'limitCount';
				gridHandelT.setSelectFieldName(temS);
			}
		},
        onLoadSuccess:function(data){
        	var _this = this;
     	   if(data.list && data.list.length > 0){
     		  gridHandel.setLoadData(data.list[0].giftPoList);
     		  
     		  if(!oldData["mmsgrid"]){
                	oldData["mmsgrid"] = $.map(gridHandelT.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	});
               }
     	   }
     	      
     	   $(_this).datagrid('resize',{width:'100%',height:'300px'})
     	   
    	  gridHandelT.setDatagridHeader("center");
	  }
    });
 }

//买满数量
function changeLimitCount(newV,oldV){
	var _this = this;
	if(parseFloat(newV||0) > 9999.99){
		$_jxc.alert('买满数量不得大于9999.99',function(){
			$(_this).numberbox('setValue',(oldV||0));
		});
	}
}

//买满金额
function changeLimitAmount(newV,oldV){
	var _this = this;
	if(parseFloat(newV||0) > 9999.99){
		$_jxc.alert('买满金额不得大于9999.99',function(){
			$(_this).numberbox('setValue',(oldV||0));
		});
	}
}

//初始化表格-买满送 礼品默认数据
var gridDefaultG = {
	limitCount:0,	
	limitAmount:0,
}

//初始化表格-买满送 赠品 商品
function initDatagridmmsGOOD(){
	gridHandel.setGridName("mmsgoodList");
    gridHandel.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
            	if(checkenter())return;
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefaultG);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("skuCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
                },100)
            }else{
               selectGoodsG(arg);
            }
        },
    })
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
                    {field:'cz',title:'操作',width:'60px',align:'center',
					    formatter : function(value, row,index) {
					        var str = "";
					            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
					                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
					        return str;
					    },
					},
					{field:'skuCode',title:'货号',width:'80',align:'left',editor:'textbox'},
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
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:2,
		                        onChange:changeGiftNum
		                    }
		                },
		            }, 
					{field:'giftAmount',title:'增加金额',width:'80px',align:'right',
		            	formatter:function(value,row,index){
		            		if(!value){
		            			row['giftAmount'] = 0;
		            		}
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:2,
		                        onChange:changeGiftPrice
		                    }
		                },
		            } 
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
      method:'post',
      queryParams:{
    	  activityId : activityId
      },
      url:contextPath+"/sale/activity/getDetailFullGive",
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
      fitColumns:false,    // 每列占满
      fit:true, //占满
//      pagination:true,
//      pageSize:50,
		height:'50%',
		width:'100%',
		columns:[[
					{field:'cz',title:'操作',width:'60px',align:'center',
					    formatter : function(value, row,index) {
					        var str = "";
					        if(row.isFooter){
					            str ='<div class="ub ub-pc">合计</div> '
					        }else{
					            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandelmmscomB(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
					                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandelmmscomB(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
					        }
					        return str;
					    },
					},
					{field:'goodsCategoryCode',title:'类别编码',width:'140',align:'left'},
					{field:'categoryName',title:'类别名称',width:'140',align:'left'},
					
      ]],
      onLoadSuccess:function(data){
    	  if(data.rows && data.rows.length >0){
    		  if(!mmscomOldData["mmscomgrid"]){
    			  mmscomOldData["mmscomgrid"] = $.map(gridHandelB.getRows(), function(obj){
    					return $.extend(true,{},obj);//返回对象的深拷贝
    				});
    		   }
    	  }
    	  gridHandelB.setDatagridHeader("center");
      }
  });
}

var gridHandelG = new GridClass();

//初始化表格-买满送 主设置 -商品
function initDatagridmmjComLG(activityId){
	gridHandelG.setGridName("mmscommonList");
	gridHandelG.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
            	gridHandelG.addRow(parseInt(gridHandelG.getSelectRowIndex())+1,gridDefaultG);
                setTimeout(function(){
                	gridHandelG.setBeginRow(gridHandelG.getSelectRowIndex()+1);
                    gridHandelG.setSelectFieldName("skuCode");
                    gridHandelG.setFieldFocus(gridHandelG.getFieldTarget('skuCode'));
                },100)
            }else{
            	selectGoodsComG(arg);
            }
        },
    })
    
    $("#mmscommonList").datagrid({
    	method:'post',
		queryParams:{
    	  activityId : activityId
		},
		align:'center',
		url:contextPath+"/sale/activity/getDetailFullGive",
		// toolbar: '#tb', //工具栏 id为tb
		singleSelect:true,  // 单选 false多选
		rownumbers:true,    // 序号
		fitColumns:true,    // 每列占满
		fit:true, //占满
		height:'50%',
//		pagination:true,
//		pageSize:50,
		width:'100%',
		columns:[[
                  {field:'cz',title:'操作',width:'60px',align:'center',
					    formatter : function(value, row,index) {
					        var str = "";
					            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandelmmscomG(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
					                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandelmmscomG(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
					        return str;
					    },
					},
					{field:'skuCode',title:'货号',width:'80',align:'left',editor:'textbox'},
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
        onBeforeEdit:function (rowIndex, rowData) {
            editRowData = $.extend(true,{},rowData);
        },
        onAfterEdit:function(rowIndex, rowData, changes){
            if(typeof(rowData.id) === 'undefined'){
               // $("#"+gridName).datagrid('acceptChanges');
            }else{
                if(editRowData.skuCode != changes.skuCode){
                    rowData.skuCode = editRowData.skuCode;
                    gridHandelG.setFieldTextValue('skuCode',editRowData.skuCode);
                }
            }
        },
		onClickCell : function(rowIndex, field, value) {
			gridHandelG.setBeginRow(rowIndex);
			gridHandelG.setSelectFieldName(field);
			var target = gridHandelG.getFieldTarget(field);
			if(target){
				gridHandelG.setFieldFocus(target);
			}else{
				gridHandelG.setSelectFieldName("skuCode");
			}
		},
		onLoadSuccess:function(data){
	    	if(data.rows && data.rows.length >0){
	  		  if(!mmscomOldData["mmscomgrid"]){
	  			  mmscomOldData["mmscomgrid"] = $.map(gridHandelG.getRows(), function(obj){
	  					return $.extend(true,{},obj);//返回对象的深拷贝
	  				});
	  		   }
	    	}
	    	gridHandelG.setDatagridHeader("center");
	   }
  });
}

//赠品数量
function changeGiftNum(newV,oldV){
	var _this = this;
	if(parseFloat(newV||0) > 9999.99){
		$_jxc.alert('赠品数量不得大于9999.99',function(){
			$(_this).numberbox('setValue',(oldV||0));
		});
	}
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
	//gridHandel
}

//重置 礼品信息
function resetGiftGoods(){
	var mmsTJObj = $("#mmsgradedList").datagrid('getRows')[gridHandelT.getSelectRowIndex()];
	delete mmsTJObj.giftPoList;
	gridHandel.setLoadData([$.extend({},gridDefaultG)]);
}


//状态初始化 禁止点击
function disableGoods(idone,idtow){
	if(idone=="SelectGoods"&&idtow==""){
	 $('#SelectGoods').addClass("uinp-no-more")
	 $('#SelectGoods').removeAttr('onclick');
	 $('#GoodsType').removeClass("uinp-no-more")
	 $('#GoodsType').attr('onclick','getGoodsType()');
	}
	else if(idone==""&&idtow=="GoodsType"){
	 $('#GoodsType').addClass("uinp-no-more")
	 $('#GoodsType').removeAttr('onclick');
	 $('#SelectGoods').removeClass("uinp-no-more")
     $('#SelectGoods').attr('onclick','selectGoods()');
	}
	else if(idone=="SelectGoods"&&idtow=="GoodsType"){
	 $('#SelectGoods').addClass("uinp-no-more")
	 $('#SelectGoods').removeAttr('onclick');
	 $('#GoodsType').addClass("uinp-no-more")
	 $('#GoodsType').removeAttr('onclick');
	}
	else if(idtow==""&&idone==""){
	 $('#SelectGoods').removeClass("uinp-no-more")
     $('#SelectGoods').attr('onclick','selectGoods()');
	 $('#GoodsType').removeClass("uinp-no-more")
	 $('#GoodsType').attr('onclick','getGoodsType()');
	}
}

var gridHandel = new GridClass();
//公用表格请求公用方法
function initmangeDatagrid(activityId){
	 $("#saleMangeadd").datagrid("options").method = "get";
     $("#saleMangeadd").datagrid("options").url =contextPath+"/sale/activity/getDetail?activityId="+activityId;
     $("#saleMangeadd").datagrid("load");
}
//满减请求方法 saleMangeadd
function initmjOneDatagrid(activityId){
	$("#saleMangeadd").datagrid("options").method = "get";
    $("#saleMangeadd").datagrid("options").url =contextPath+"/sale/activity/getDetailFullCut?activityId="+activityId;
    $("#saleMangeadd").datagrid("load");
}
//满减请求方法 salesetmj
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
var editRowData = null;
//初始化表格-特价
function initDatagridSpecial(){
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
    datagridObj = $("#saleMangeadd").datagrid({
		align:'center',
		//toolbar: '#tb',     //工具栏 id为tb
		singleSelect:true,  //单选  false多选
		rownumbers:true,    //序号
//		pagination:true,    //分页
		fitColumns:true,    //每列占满
		//fit:true,            //占满
//		showFooter:true,
		height:'100%',
//		pageSize:50,
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
					{field:'skuCode',title:'货号',width:'85px',align:'left',editor:'textbox'},
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
		            },
					{field: 'purchasePrice', title: '进货价', width: 100, align: 'right',
						formatter : function(value, row, index) {
							if(row.isFooter){
								return;
							}
							return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
						},
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
		                        min:0,
		                        precision:2,
								onChange:changSaleAmount,
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
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                    }
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
      onLoadSuccess:function(data){
			if(data.list && data.list.length > 0){
                $.each(data.list,function (index,item) {
                    //进货价或者成本可能为undefine 不计算毛利率
                    if(item.price === '0' || item.price == 0 || isNaN(parseFloat(item.price)) || isNaN(parseFloat(item.purchasePrice))){
                        item.oldSaleRate = "0.00%";
                        item.newSaleRate = "0.00%";
                    }else {
                        item.oldSaleRate = ((item.price - item.purchasePrice) / item.price * 100).toFixed(2) + "%";
                        if(item.saleAmount === 0 || item.saleAmount == '0' || isNaN(parseFloat(item.saleAmount))){
                            item.newSaleRate = "0.00%";
                        }else{
                            item.newSaleRate = ((item.saleAmount-item.purchasePrice)/item.saleAmount*100).toFixed(2)+"%"
                        }

                    }
                })
                gridHandel.setLoadData(data.list);
                
                //新老数据做比较
                if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	});
                }
            }

		gridHandel.setDatagridHeader("center");
				
	  }
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
    }
    //gridHandel.setLoadData([$.extend({},gridDefault)]) 
}

//特价  新毛利率
function  changSaleAmount(newVal,oldVal) {
    if(isNaN(parseFloat(newVal))) return;
	var purchasePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchasePrice');
    var newSaleRate = "0.00%";
    if(newVal === "" || parseFloat(newVal)==0 || isNaN(parseFloat(newVal))){
        newSaleRate = "0.00%";
    }else {
    	newSaleRate = ((parseFloat(newVal)-purchasePrice)/parseFloat(newVal)*100).toFixed(2)+"%"
	}
    gridHandel.setFieldTextValue('newSaleRate',newSaleRate);
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
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:2,
		                    }
		                },
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
			if(data.rows && data.rows.length > 0){
				//新老数据做比较
                if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	});
                }
			}	
      }
    });
 }

//初始化表格-类别折扣
function initDatagridsortZk(){
	gridHandel.setGridName("saleMangeadd");
    gridHandel.initKey({
        firstName:'categoryCode',
        enterName:'categoryCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
            	if(checkenter())return;
                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
                    gridHandel.setSelectFieldName("categoryCode");
                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('categoryCode'));
                },100)
            }else{
               selectGoods(arg);
            }
        },
    })
    $("#saleMangeadd").datagrid({
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
//        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
//        showFooter:true,
		height:'100%',
//		pageSize:50,
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
		                        min:0,
		                        precision:2,
		                    }
		                },
		            }, 
          ]],
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
      onLoadSuccess:function(data){
    	  
			gridHandel.setDatagridHeader("center");
			if(data.rows && data.rows.length > 0){
				//新老数据做比较
                if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	});
                }
			}	
		 }
    });
    //gridHandel.setLoadData([$.extend({},gridDefault)])
 }

//初始化表格-单品折扣
function initDatagridoneZk(){
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
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
//        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
//        showFooter:true,
		height:'100%',
//		pageSize:50,
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
			{field:'skuCode',title:'货号',width:'85px',align:'left',editor:'textbox'},
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
            {field: 'purchasePrice', title: '进货价', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:2,
                        disabled:true,
                    }
                },
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
			            min:0,
			            precision:2,
						onChange:changeDiscount
			        }
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
          ]],
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
      onLoadSuccess:function(data){
    	  gridHandel.setDatagridHeader("center");
          if(data.list && data.list.length > 0) {
              $.each(data.list, function (index, item) {
                  //进货价或者成本可能为undefine 不计算毛利率
				  if(item.price === '0' || item.price == 0 || isNaN(parseFloat(item.price)) || isNaN(parseFloat(item.purchasePrice))){
                      item.oldSaleRate = "0.00%";
                      item.newSaleRate = "0.00%";
				  }else {
                      var discountPrice = ((item.price * item.discount) / 10).toFixed(2);
                      item.oldSaleRate = ((item.price - item.purchasePrice) / item.price * 100).toFixed(2) + "%";
                      if(discountPrice === 0 || discountPrice == '0'){
                          item.newSaleRate = "0.00%";
					  }else{
                          item.newSaleRate = ((discountPrice-item.purchasePrice)/discountPrice*100).toFixed(2)+"%";
					  }

				  }

              })
              gridHandel.setLoadData(data.list);
              
              if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	});
               }
                 
  		}
      }
    });

    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
    }
    
   }

   //单品折扣 计算新毛利率
   function changeDiscount(newVal,oldVal) {
       if(isNaN(parseFloat(newVal))) return;
		var salePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
		var purchasePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchasePrice');
       var newSaleRate = "0.00%";
       if(newVal === "" || isNaN(parseFloat(newVal)) || parseFloat(newVal) == 0){
           newSaleRate = "0.00%";
       }else {
           var discountPrice = ((salePrice*parseFloat(newVal))/10).toFixed(2);
           newSaleRate = ((discountPrice-purchasePrice)/discountPrice*100).toFixed(2)+"%";
	   }
        gridHandel.setFieldTextValue('newSaleRate',newSaleRate);
   }

//初始化表格-偶数特价
function initDatagridOddtj(){
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
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
//        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
//        showFooter:true,
		height:'100%',
//		pageSize:50,
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
			{field:'skuCode',title:'货号',width:'85px',align:'left',editor:'textbox'},
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
//			
//			        }
//			    },
			},
            {field: 'purchasePrice', title: '进货价', width: '100px', align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:2,
                        disabled:true,
                    }
                },
            },
			{field: 'saleAmount', title: '偶数特价', width: '100px', align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			        	return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			        }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:2,
						onChange:changeSaleAmount
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
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:4,
                    }
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
          ]],
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
      onLoadSuccess:function(data){
          if(data.list && data.list.length > 0) {
              $.each(data.list, function (index, item) {
                  //进货价或者成本可能为undefine 不计算毛利率
                  if(item.price === '0' || item.price == 0 || isNaN(parseFloat(item.price)) || isNaN(parseFloat(item.purchasePrice))){
                      item.oldSaleRate = "0.00%";
                      item.newSaleRate = "0.00%";
                  }else {
                      item.oldSaleRate = ((item.price - item.purchasePrice) / item.price * 100).toFixed(2) + "%";
                      item.newSaleRate = (((item.price+item.saleAmount)-(2*item.purchasePrice))/(item.price+item.saleAmount)*100).toFixed(2)+"%"
                  }

              })
              gridHandel.setLoadData(data.list);

              if(!oldData["grid"]){
                  oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                      return $.extend(true,{},obj);//返回对象的深拷贝
                  });
              }
          }
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
    }
    gridHandel.setLoadData([$.extend({},gridDefault)])
}
//改变偶数特价 计算新毛利率
function changeSaleAmount(newVal,oldVal) {
    if(isNaN(parseFloat(newVal))) return;
    var priceNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
	var purchasePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchasePrice');
    var newSaleRate = "0.00%";
    if(newVal === ""  || isNaN(parseFloat(newVal))){
        newSaleRate = "0.00%";
    }else {
        newSaleRate =  (((priceNumVal+parseFloat(newVal))-(2*purchasePrice))/(priceNumVal+parseFloat(newVal))*100).toFixed(2)+"%";
	}
    gridHandel.setFieldTextValue('newSaleRate',newSaleRate);
}


//初始化表格-换购
function initDatagridRedemption(){
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
      //toolbar: '#tb',     //工具栏 id为tb
      singleSelect:true,  //单选  false多选
      rownumbers:true,    //序号
//      pagination:true,    //分页
      fitColumns:true,    //每列占满
      //fit:true,            //占满
//      showFooter:true,
		height:'100%',
//		pageSize:50,
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
			{field:'skuCode',title:'货号',width:'85px',align:'left',editor:'textbox'},
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
			},
			{field: 'saleAmount', title: '换购价', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			        	return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			        }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:2,
			        }
			    },
			},
        ]],
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
    onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
				
		 }
  });
  gridHandel.setLoadData([$.extend({},gridDefault)])
}

//初始化表格-全场满减
function initDatagridallMj(){
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
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
//        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
//        showFooter:true,
		height:'100%',
//		pageSize:50,
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
					{field:'limitAmount',title:'买满金额',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                        return
		                    }
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:2,
		           
		                    }
		                },
		            }, 
					{field:'discountPrice',title:'优惠额',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                        return
		                    }
		                    return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:2,
		           
		                    }
		                },
		            }, 
          ]],
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
      onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
			if(data.rows && data.rows.length > 0){
				if(!oldData["grid"]){
					oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
						return $.extend(true,{},obj);//返回对象的深拷贝
					});
				}
			}
		 }
    });
    //gridHandel.setLoadData([$.extend({},gridDefault)])
}

//初始化表格-类别满减
function initDatagridsortMj(){
	gridHandel.setGridName("saleMangeadd");
    $("#saleMangeadd").datagrid({
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
//        pagination:true,    //分页
        fitColumns:true,    //每列占满
//        fit:true,            //占满
//        showFooter:true,
		height:'300px',
//		pageSize:50,
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
					{field:'goodsCategoryCode',title:'类别编码',width:'200px',align:'left'},
					{field:'categoryName',title:'商品类别',width:'200px',align:'left'},
          ]],
           onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
			if(data.rows && data.rows.length > 0){
			  if(!commonOldData["mjlbgrid"]){
				  commonOldData["mjlbgrid"] = $.map(gridHandel.getRows(), function(obj){
                		return $.extend(true,{},obj);//返回对象的深拷贝
                	});
               }
			}
		 }
    });
    //gridHandel.setLoadData([$.extend({},gridDefault)])
}

//初始化表格-类别满减设置
var gridHandelMj = new GridClass();
function initDatagridsortSet(){
	gridHandelMj.setGridName("salesetmj");
    $("#salesetmj").datagrid({
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
//        pagination:true,    //分页
        fitColumns:true,    //每列占满
       fit:true,            //占满
//        showFooter:true,
		height:'500px',
//		pageSize:50,
		width:'100%',
        columns:[[
					{field:'cz',title:'操作',width:'60px',align:'center',
					    formatter : function(value, row,index) {
					        var str = "";
					        if(row.isFooter){
					            str ='<div class="ub ub-pc">合计</div> '
					        }else{
					            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandelmj(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
					                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandelmj(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
					        }
					        return str;
					    },
					},
					{field: 'limitAmount', title: '买满金额', width: 100, align: 'right',
					    formatter : function(value, row, index) {
					        if(row.isFooter){
					            return;
					        }
					        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					    },
					    editor:{
					        type:'numberbox',
					        options:{
					            min:0,
					            precision:2,
					        }
					    },
					},
					{field: 'discountPrice', title: '优惠额', width: 100, align: 'right',
					    formatter : function(value, row, index) {
					        if(row.isFooter){
					            return;
					        }
					        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
					    },
					    editor:{
					        type:'numberbox',
					        options:{
					            min:0,
					            precision:2,
					        }
					    },
					}
          ]],
          onLoadSuccess:function(data){
        	 //$(this).datagrid('resize',{width:'100%',height:'300px'})
        	 gridHandelMj.setDatagridHeader("center");
        	 //addrowsdt();
        	 if(data.rows && data.rows.length > 0){
   			  if(!oldData["mjgrid"]){
                   	oldData["mjgrid"] = $.map(gridHandelMj.getRows(), function(obj){
                   		return $.extend(true,{},obj);//返回对象的深拷贝
                   	});
                  }
   			}
		 },
		 onClickCell:function(rowIndex,field,value){
			 gridHandelMj.setBeginRow(rowIndex);
			 gridHandelMj.setSelectFieldName(field);
	            var target = gridHandelMj.getFieldTarget(field);
	            if(target){
	            	gridHandelMj.setFieldFocus(target);
	            }else{
	            	gridHandelMj.setSelectFieldName("limitAmount");
	            }
	        },
    });
    //gridHandelMj.setLoadData([$.extend({},gridDefault)])
}

//初始化表格-商品满减
function initDatagridshopMj(){
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
      //toolbar: '#tb',     //工具栏 id为tb
      singleSelect:true,  //单选  false多选
      rownumbers:true,    //序号
//      pagination:true,    //分页
      fitColumns:true,    //每列占满
//      fit:true,            //占满
//      showFooter:true,
		height:'300px',
//		pageSize:50,
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
			{field:'skuCode',title:'货号',width:'85px',align:'left',editor:'textbox'},
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
        onLoadSuccess:function(data){
        	if(data.rows && data.rows.length > 0){
  			  if(!commonOldData["mjlbgrid"]){
  				  commonOldData["mjlbgrid"] = $.map(gridHandel.getRows(), function(obj){
                  		return $.extend(true,{},obj);//返回对象的深拷贝
                  	});
                 }
  			}
			gridHandel.setDatagridHeader("center");
		 }
  });

}


//初始化表格-组合特价
function initDatagridCompose(){
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
      //toolbar: '#tb',     //工具栏 id为tb
      singleSelect:true,  //单选  false多选
      rownumbers:true,    //序号
//      pagination:true,    //分页
      fitColumns:true,    //每列占满
      //fit:true,            //占满
//      showFooter:true,
		height:'100%',
//		pageSize:50,
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
			{field:'skuCode',title:'货号',width:'85px',align:'left',editor:'textbox'},
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
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:2,
			        }
			    },
			},
			{field: 'saleAmount', title: '组合特价', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:2,
			        }
			    },
			},
			{field: 'groupNum', title: '组号', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			            return;
			        }
			        return '<b>'+parseFloat(value||0).toFixed(0)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:0,
			        }
			    },
			},
        ]],
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
       onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
			if(data.rows && data.rows.length > 0){
				if(!oldData["grid"]){
					oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
						return $.extend(true,{},obj);//返回对象的深拷贝
					});
				}
			}	
	   }
  });
}


//查询入库单
function queryForm(){
	if($("#branchName").val()==""){
        $_jxc.alert("请选择店铺名称");
        return;
    } 
	var fromObjStr = $('#queryFormEditAct').serializeObject();
	$("#saleMangeadd").datagrid("options").method = "post";
	$("#saleMangeadd").datagrid('options').url = contextPath + '/categorySale/report/getCategorySaleList';
	$("#saleMangeadd").datagrid('load', fromObjStr);
}
//批量设置
function specialRows(id,val){
	// 获取选中行的Index的值
	var rowIndex = -1;
	var newData = $("#"+datagridId).datagrid("getRows");
	if(id=="special"){
		for(var i = 0;i < newData.length;i++){
            var item = newData[i];
            item.saleAmount= parseFloat(val);
            if(isNaN(parseFloat(val)) || parseFloat(val) == 0){
                item.newSaleRate = "0.00%";
			}else{
                item.newSaleRate = ((item.saleAmount-item.purchasePrice)/item.saleAmount*100).toFixed(2)+"%";
			}

			rowIndex = $("#"+datagridId).datagrid('getRowIndex',item);
			//更新行数据
			$("#"+datagridId).datagrid('updateRow',{
				index: rowIndex,
				row: item
			});
			//刷新行
			$("#"+datagridId).datagrid('refreshRow',rowIndex);
		}
	}
	else if(id=="discount"){
		for(var i = 0;i < newData.length;i++){
            var item = newData[i];
            item.discount= parseFloat(val);
            var discountPrice = ((item.salePrice*item.discount)/10).toFixed(2);
            if(discountPrice == 0 || isNaN(discountPrice)){
                item.newSaleRate = "0.00%";
			}else{
                item.newSaleRate = ((discountPrice-item.purchasePrice)/discountPrice*100).toFixed(2)+"%"
			}

			rowIndex = $("#"+datagridId).datagrid('getRowIndex',item);
			//更新行数据
			$("#"+datagridId).datagrid('updateRow',{
				index: rowIndex,
				row: item
			});
			//刷新行
			$("#"+datagridId).datagrid('refreshRow',rowIndex);
		}
	}
	else if(id=="batchcount"){
		for(var i = 0;i < newData.length;i++){
            var item = newData[i];
            item.saleAmount= parseFloat(val);
            if(isNaN(parseFloat(val))){
                item.newSaleRate = "0.00%";
			}else{
                item.newSaleRate =  (((item.price+item.saleAmount)-(2*item.purchasePrice))/(item.price+item.saleAmount)*100).toFixed(2)+"%";
			}

			rowIndex = $("#"+datagridId).datagrid('getRowIndex',item);
			//更新行数据
			$("#"+datagridId).datagrid('updateRow',{
				index: rowIndex,
				row: item
			});
			//刷新行
			$("#"+datagridId).datagrid('refreshRow',rowIndex);
		}
	}
	
}
//插入动态行
function addrowsdt(){
	//活动类型
	var activityType=$("#activityType").combobox('getValue');
	if(activityType=="5"){
		var rows=$('#saleMangeadd').datagrid('getRows');
	    for(var i = 1; i < rows.length; i++){
	    	$('#salesetmj').datagrid('appendRow',[{cz:'',limitAmount:'1',discountPrice:''}]);  
		  	
	     }
	   
	}
}
//选择商品插入动态行
function selectAddRows(data){
	var row=data.rows;
	if(row.length==0){
		return
	}
	//活动类型
	var activityType=$("#activityType").combobox('getValue');
	if(activityType=="5"){
	    for(var i = 0; i < row.length; i++){
	    	$('#salesetmj').datagrid('appendRow',[{cz:'',limitAmount:'1',discountPrice:''}]);  
		  	
	     }
	}
}
//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}

//满送梯度插入一行
function addLineHandelmstd(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandelT.addRow(index,mmsTJDefault);
}

//满送 主设置 商品  插入一行
function addLineHandelmmscomG(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandelG.addRow(index,gridDefaultG);
}

//满送 主设置 类别  插入一行
function addLineHandelmmscomB(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandelB.addRow(index,{});
}


//减速设置插入一行
function addLineHandelmj(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandelMj.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}
//减速设置插入一行
function delLineHandelmj(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandelMj.delRow(index);
}

//满送 买满条件设置 删除一行
function delLineHandelmstd(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandelT.delRow(index);
}

//满送 主设置商品  删除一行
function delLineHandelmmscomG(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandelG.delRow(index);
}

//满送 主设置商品  删除一行
function delLineHandelmmscomB(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandelB.delRow(index);
}

//商品选择 买满送 主商品 选择
function selectGoodsComG(searchKey){
	
	var param = {
			type:'PX',
			key:searchKey,
			isRadio:'',
			sourceBranchId:'',
			targetBranchId:'',
			branchId:$("#branchIds").val(),
			supplierId:'',
			flag:''
	}
	
	//借用一下type值，用来活动商品选择时，过滤不参加促销的商品
    new publicGoodsServiceTem(param,function(data){
    	if(searchKey){
            $("#mmscommonList").datagrid("deleteRow", gridHandelG.getSelectRowIndex());
            $("#mmscommonList").datagrid("acceptChanges");
        }
        var nowRows = gridHandelG.getRowsWhere({skuName:'1'});
        var addDefaultData  = gridHandelG.addDefault(data,[{}]);
        var keyNames = {
        		skuId:'goodsSkuId',
        		salePrice:'price'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  // 验证重复性
        var isCheck ={isGift:1};   // 只要是赠品就可以重复
        var newRows = gridHandelG.checkDatagrid(nowRows,rows,argWhere,isCheck);
        $("#mmscommonList").datagrid("loadData",newRows);
    })
}

//商品选择 买满送 礼品
function selectGoodsG(searchKey){
	var gradRows = $("#mmsgradedList").datagrid('getChecked');
	if(gradRows.length <= 0){
		$_jxc.alert('请先选择买满条件');
		return;
	}
	
	var param = {
			type:'PX',
			key:searchKey,
			isRadio:'',
			sourceBranchId:'',
			targetBranchId:'',
			branchId:$("#branchIds").val(),
			supplierId:'',
			flag:''
	}
	
	//借用一下type值，用来活动商品选择时，过滤不参加促销的商品
    new publicGoodsServiceTem(param,function(data){
    	if(searchKey){
            $("#mmsgoodList").datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#mmsgoodList").datagrid("acceptChanges");
        }
        var nowRows = gridHandel.getRowsWhere({skuName:'1'});
        var addDefaultData  = gridHandel.addDefault(data,gridDefaultG);
        var keyNames = {
        		skuId:'goodsSkuId',
        		salePrice:'price'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  // 验证重复性
        var isCheck ={isGift:1};   // 只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
        gradRows[0].giftPoList = newRows;
        $("#mmsgoodList").datagrid("loadData",newRows);
    })
}


//选择商品
function selectGoods(searchKey){
	if(typeof(searchKey)=="undefined"){ 
		searchKey = "";
	}
	
	var activityT=$("#activityType").combobox('getValue');
	//买满送调用  赠品 selectGoodsG方法
	if(activityT == '10'){
		//全场 类别 商品下 区分 主商品 和 赠品 商品选择要区分
		//是否显示了 tab
		var isHasTab = $("#mmsTab").hasClass('unhide');
		var tabtext = $("#mmsTab").find("li.tabs-selected .tabs-title").text();
		if(!isHasTab && tabtext == '商品信息'){
			selectGoodsComG(searchKey)
		}else{
			//赠品 商品 选择
			selectGoodsG(searchKey);
		}
		return;
	}
	
	var param = {
			type:'PX',
			key:searchKey,
			isRadio:'',
			sourceBranchId:'',
			targetBranchId:'',
			branchId:$("#branchIds").val(),
			supplierId:'',
			flag:'0'
	}
	
    new publicGoodsServiceTem(param,function(data){
        if(searchKey){
            $("#saleMangeadd").datagrid("deleteRow", gridHandel.getSelectRowIndex());
            $("#saleMangeadd").datagrid("acceptChanges");
        }
        var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
        var addDefaultData  = gridHandel.addDefault(data,gridDefault);
        var keyNames = {
        	skuId:'goodsSkuId',
			salePrice:'price'
        };

        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  //验证重复性
        var isCheck ={isGift:1 };   //只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
        //选择商品的时候计算老毛利率
        //计算老毛利率
        var activityType=$("#activityType").combobox('getValue');
        if(activityType==="1" || (activityType==="2" && $('#activityScopedis').val()==="0")
            || activityType==="3"){
            getOldSaleRate(newRows);
        }


        $("#saleMangeadd").datagrid("loadData",newRows);

    });
}

//保存
function saveActivity(){

  //活动类型
  var activityType=$("#activityType").combobox('getValue');
  // 打折活动类型
  var activityScopedis=$("#activityScopedis").val();
  // 满减活动类型
  var activityScopemj=$("#activityScopemj").val();

  	if(!$("#startTime").val() || !$("#endTime").val()){
		$_jxc.alert("<活动时间>不能为空");
		return;
	}
	
	if(!$("#dailyStartTime").val() || !$("#dailyStartTime").val()){
		$_jxc.alert("<活动时段>不能为空");
		return;
	}
	  
    if(!$("#activityName").val()){
	    $_jxc.alert("<活动名称>不能为空");
	    return;
	}
	
	
	if(!$("#branchName").val().trim()){
		$_jxc.alert("<活动分店>不能为空");
		return;
	}
	
	if(!$("#weeklyActivityDay").val().trim()){
	  $_jxc.alert("<活动日>不能为空");
	  return;
	}	
  
  var isCheckResult = true;
  // 活动类型特价验证
  if(activityType=="1"){
      //保存结束编辑
      $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
      var rows= gridHandel.getRows();
      if(rows.length==0){
          $_jxc.alert("表格不能为空");
          return;
      }

	  for(var i=0;i<rows.length;i++){
		  var v = rows[i];
		  if(!v["skuCode"]){
	          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      if(!v["saleAmount"] || v["saleAmount"]=='0.00'){
	          $_jxc.alert("第"+(i+1)+"行，促销价不能为空或0");
	          isCheckResult = false;
	          return false;
	      };
	      
	      if(parseFloat(v["price"]) <= parseFloat(v["saleAmount"])){
	          $_jxc.alert("第"+(i+1)+"行，促销价要小于原价");
	          isCheckResult = false;
	          return false;
	      };
	      
	      
	  }
	  saveDataHandel(rows);
  }
  
  // 活动类型折扣验证
  else if(activityType=="2"){
      //保存结束编辑
      $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
      var rows= gridHandel.getRows();
      if(rows.length==0){
          $_jxc.alert("表格不能为空");
          return;
      }


	// 活动类型单品折扣验证
	  if(activityScopedis=="0"){
		  for(var i=0;i<rows.length;i++){
			  var v = rows[i];
		      if(!v["skuCode"]){
		          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
		          isCheckResult = false;
		          return false;
		      };
		      if(!v["discount"] || v["discount"]=='0.00'){
		          $_jxc.alert("第"+(i+1)+"行，折扣不能为空");
		          isCheckResult = false;
		          return false;
		      };
		      if(parseFloat(v["discount"])>=10 || parseFloat(v["discount"]<=0)){
		          $_jxc.alert("第"+(i+1)+"行，折扣值在0~10之间");
		          isCheckResult = false;
		          return false;
		      };
		  }
		  saveDataHandel(rows);
	  }else if(activityScopedis=="2"){
		//全场折扣
		  for(var i=0;i<rows.length;i++){
			  var v = rows[i];
			  if(!v["discount"] || v["discount"]=='0.00'){
		          $_jxc.alert("第"+(i+1)+"行，折扣不能为空或0");
		          isCheckResult = false;
		          return false;
		      };
		  }
		  saveDataHandel(rows);
	  }
	// 活动类型类别折扣验证
	  else{
		  for(var i=0;i<rows.length;i++){
			  var v = rows[i];
		      if(!v["categoryName"]){
		          $_jxc.alert("第"+(i+1)+"行，商品类别不能为空");
		          isCheckResult = false;
		          return false;
		      };
		      if(!v["discount"] || v["discount"]=='0.00'){
		          $_jxc.alert("第"+(i+1)+"行，折扣不能为空或0");
		          isCheckResult = false;
		          return false;
		      };
		      if(parseFloat(v["discount"])>=10 || parseFloat(v["discount"]<=0)){
		          $_jxc.alert("第"+(i+1)+"行，折扣值在0~10之间");
		          isCheckResult = false;
		          return false;
		      };
		     
		  }
		  saveDataHandel(rows);
	  }
	  
  }
// 活动类型偶数特价验证
  else if(activityType=="3"){
      //保存结束编辑
      $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
      var rows= gridHandel.getRows();
      if(rows.length==0){
          $_jxc.alert("表格不能为空");
          return;
      }

	  for(var i=0;i<rows.length;i++){
		  var v = rows[i];
	      if(!v["skuCode"]){
	          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      if(v["saleAmount"] === "" || undefined == v["saleAmount"]){
	          $_jxc.alert("第"+(i+1)+"行，偶数特价不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      
	      if(parseFloat(v["price"]) <= parseFloat(v["saleAmount"])){
	          $_jxc.alert("第"+(i+1)+"行，偶数特价要小于原价");
	          isCheckResult = false;
	          return false;
	      };
	     
	  }
	  saveDataHandel(rows);
  }
// 活动类型换购价验证
  else if(activityType=="4"){
      //保存结束编辑
      $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
      var rows= gridHandel.getRows();
      if(rows.length==0){
          $_jxc.alert("表格不能为空");
          return;
      }

	  for(var i=0;i<rows.length;i++){
		  var v = rows[i];
	      if(!v["skuCode"]){
	          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      if(v["saleAmount"] === "" || undefined === v["saleAmount"]){
	          $_jxc.alert("第"+(i+1)+"行，换购价不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      
	      if(parseFloat(v["price"]) <= parseFloat(v["saleAmount"])){
	          $_jxc.alert("第"+(i+1)+"行，换购价要小于原价");
	          isCheckResult = false;
	          return false;
	      };
	     
	  }
	  saveDataHandel(rows);
  }
// 活动满减验证
  else if(activityType=="5"){
      $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
      var rows= gridHandel.getRows();
      if(rows.length==0){
          $_jxc.alert("表格不能为空");
          return;
      }
	  $("#salesetmj").datagrid("endEdit", gridHandelMj.getSelectRowIndex());
	  var setrows=$('#salesetmj').datagrid('getRows');
		  if(activityScopemj=="0"){  
			  if(setrows.length==0){
			      $_jxc.alert("满减设置表格不能为空");
			      return;
			  }
			  for(var i=0;i<rows.length;i++){
				  var v = rows[i];
			      if(!v["skuCode"]){
			          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
			          isCheckResult = false;
			          return false;
			      };
			  }
			  for(var i=0;i<setrows.length;i++){
				  var v = setrows[i];
				  if(!v["limitAmount"] || v["limitAmount"]=='0.00'){
			          $_jxc.alert("第"+(i+1)+"行，买满金额不能为空或0");
			          isCheckResult = false;
			          return false;
			      };
			      if(!v["discountPrice"] || v["discountPrice"]=='0.00'){
			          $_jxc.alert("第"+(i+1)+"行，优惠额不能为空或0");
			          isCheckResult = false;
			          return false;
			      };
			      
			      if(parseFloat(v["limitAmount"]) < parseFloat(v["discountPrice"])){
			    	  $_jxc.alert("第"+(i+1)+"行，买满金额不能小于优惠额");
			          isCheckResult = false;
			          return false;
			      }
			  }
			  saveDataHandel(rows,setrows);
		 }
		  else if(activityScopemj=="1"){
			  if(setrows.length==0){
			      $_jxc.alert("满减设置表格不能为空");
			      return;
			  }
			  for(var i=0;i<rows.length;i++){
				  var v = rows[i];
			      if(!v["categoryName"]){
			          $_jxc.alert("第"+(i+1)+"行，商品类别不能为空");
			          isCheckResult = false;
			          return false;
			      };
			  }
			  for(var i=0;i<setrows.length;i++){
				  var v = setrows[i];
				  if(!v["limitAmount"] || v["limitAmount"]=='0.00'){
			          $_jxc.alert("第"+(i+1)+"行，买满金额不能为空或0");
			          isCheckResult = false;
			          return false;
			      };
			      if(!v["discountPrice"] || v["discountPrice"]=='0.00'){
			          $_jxc.alert("第"+(i+1)+"行，优惠额不能为空或0");
			          isCheckResult = false;
			          return false;
			      };
			      
			      if(parseFloat(v["limitAmount"]||0) < parseFloat(v["discountPrice"]||0)){
			    	  $_jxc.alert("第"+(i+1)+"行，买满金额不能小于优惠额");
			          isCheckResult = false;
			          return false;
			      }
			  }
			  saveDataHandel(rows,setrows); 
		 }
		  else if(activityScopemj=="2"){
			  for(var i=0;i<rows.length;i++){
				  var v = rows[i];
			      if(!v["limitAmount"] || v["limitAmount"]=='0.00'){
			          $_jxc.alert("第"+(i+1)+"行，买满金额不能为空");
			          isCheckResult = false;
			          return false;
			      };
			      if(!v["discountPrice"] || v["discountPrice"]=='0.00'){
			          $_jxc.alert("第"+(i+1)+"行，优惠额不能为空或0");
			          isCheckResult = false;
			          return false;
			      };
			      
			      if(parseFloat(v["limitAmount"]||0) < parseFloat(v["discountPrice"]||0)){
			    	  $_jxc.alert("第"+(i+1)+"行，买满金额不能小于优惠额");
			          isCheckResult = false;
			          return false;
			      }
			  }
			  saveDataHandel(rows);
		  }
  }
  //组合特价
  else if(activityType=="6"){
      //保存结束编辑
      $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
      var rows= gridHandel.getRows();
      if(rows.length==0){
          $_jxc.alert("表格不能为空");
          return;
      }
	 
	  var flag = false;//判断是否有不同的组号
	  
	  for(var i=0;i<rows.length;i++){
		  var v = rows[i];
	      if(!v["skuCode"]){
	          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      if(!v["limitCount"] || v["limitCount"]=='0.00'){
	          $_jxc.alert("第"+(i+1)+"行，组合数量不能为空或0");
	          isCheckResult = false;
	          return false;
	      };
	      
	      if(!v["saleAmount"] || v["saleAmount"]=='0.00'){
	          $_jxc.alert("第"+(i+1)+"行，组合特价不能为空或0");
	          isCheckResult = false;
	          return false;
	      };
	      
	      if(parseFloat(v["price"]) <= parseFloat(v["saleAmount"])){
	          $_jxc.alert("第"+(i+1)+"行，换购价要小于原价");
	          isCheckResult = false;
	          return false;
	      };
	      
	      if(!v["groupNum"] || parseInt(v["groupNum"]) <= 0 || parseInt(v["groupNum"]) > 3){
	          $_jxc.alert("第"+(i+1)+"行，组号只能是1,2,3");
	          isCheckResult = false;
	          return false;
	      };
	      
	      //取列表第一个商品的组号跟其他商品组号比较，有不同的组号就可以
	      var item = rows[0]
	      
	      if(v["groupNum"] != item["groupNum"]){
	    	  flag = true;
	    	  continue;
	      }
	      
	  }
	  
	  if(!flag){
		  $_jxc.alert("组号不能全部相同");
          isCheckResult = false;
          return false;
	  }
	  
	  saveDataHandel(rows);
  //买满送	 
  }else if(activityType=="10"){
	  //全场(2)  类别(1)  商品(0) 
	  var mmstype = $("input[name='mmsstatus']:checked").val();
	  var setRows = [{goodsSkuId:"000000"}];
	  if(mmstype == '1'){
		  var lbRows = gridHandelB.getRowsWhere({categoryName:'1'});
		  if(lbRows.length <= 0){
			  $_jxc.alert('请选择类别！',function(){});
			  return;
		  }
		  setRows = lbRows;
	  }
	  if(mmstype == '0'){
		  var spRows = gridHandelG.getRowsWhere({skuName:'1'});
		  if(spRows.length <= 0){
			  $_jxc.alert('请选择商品！',function(){});
			  return; 
		  }
		  setRows = spRows;
	  }
	  
	  //买满条件
	  gridHandelT.endEditRow();
	  gridHandel.endEditRow();
	  
	  var temTJObj = $('#mmsgradedList').datagrid('getChecked');
	  var temTjList = gridHandelT.getRows();
	  if(temTJObj.length < 1 && temTjList.length == 1){
		temTjList[0].giftPoList = gridHandel.getRowsWhere({skuName:'1'});
	  }
	  
	  //买满条件 梯度检查
	  var tjRows = gridHandelT.getRows();
	  
	  if(tjRows.length <= 0){
		  $_jxc.alert('请设置买满条件！',function(){});
		  return;
	  }
	  for(var i = 0; i<tjRows.length ; i++){
		  var mmsTJObj = tjRows[i];
		  if(gridTitleName == '买满金额' && parseFloat(mmsTJObj.limitAmount||0)<= 0){
			$_jxc.alert('第'+(i+1)+'行，买满金额不能小于等于0',function(){});
			return false;
		  }
		  if(gridTitleName == '买满数量' && parseFloat(mmsTJObj.limitCount||0)<= 0){
			$_jxc.alert('第'+(i+1)+'行，买满数量不能小于等于0',function(){});
			return false;
		  }
		  
		  if(!(mmsTJObj.giftPoList && mmsTJObj.giftPoList.length >0)){
			  $_jxc.alert('买满条件第'+(i+1)+'行，未选择赠品！',function(){});
			  return false;
		  }else{
			  var gifts = mmsTJObj.giftPoList;
			  for(var x = 0; x < gifts.length ; x++){
				  var gifObj = gifts[x];
				  
				  if(gifObj && gifObj.giftNum <= 0){
					  $_jxc.alert('买满条件第'+(i+1)+'行，存在赠品数量小于等于0',function(){});
					  return;
				  }
			  }
		  }
	  }
//	  return;
	  saveDataHandel(tjRows,setRows);
  }
  else{
      $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
      var rows= gridHandel.getRows();
      if(rows.length==0){
          $_jxc.alert("表格不能为空");
          return;
      }
	  saveDataHandel(rows);
  }
}



function saveDataHandel(rows,setrows){
  // 活动分店机构id
  var branchIds = $("#branchIds").val();
  // 活动名称
  var activityName = $("#activityName").val();
  //活动类型
  var activityType=$("#activityType").combobox('getValue');
  // 打折活动类型
  var activityScopedis=$("#activityScopedis").val();
  // 满减活动类型
  var activityScopemj=$("#activityScopemj").val();
  // 开始日期
  var startTime=$("#startTime").val();
  // 结束日期
  var endTime=$("#endTime").val();
  endTime = endTime +" 23:59:59";
  // 开始时间
  var dailyStartTime=Date.parse("1970-1-1 "+$("#dailyStartTime").val());
  // 结束时间
  var dailyEndTime=Date.parse("1970-1-1 "+$("#dailyEndTime").val());
  // 星期值获取
  var weeklyActivityDay=$('#weeklyActivityDay').val();
  // 活动分店机构id
  var branchsName = $("#branchName").val();
  var branchsFullName = $("#branchsFullName").val();

  // 活动状态为特价--偶数特价--换购
  if(activityType=="1"||activityType=="3"||activityType=="4"){
	  var reqObj = {
	          branchIds:branchIds,
	          branchsName:branchsName,
	          branchsFullName:branchsFullName,
	          activityName:activityName,
	          activityType:activityType,
	          startTime:startTime,
	          endTime:endTime,
	          dailyStartTime:dailyStartTime,
	          dailyEndTime:dailyEndTime,
	          weeklyActivityDay:weeklyActivityDay,
	          activityScope:0,
	          memberExclusive:$("#memberExclusive").is(":checked")?1:0,
          memberExclusiveNum: $("#memberExclusiveNum").is(":checked") ? 1 : 0,

          detailList: []
	  };
	  $.each(rows,function(i,data){
	      var temp = {
	    	  goodsSkuId: data.goodsSkuId,
	    	  saleAmount:data.saleAmount,
	    	  price:data.price,
              discountNum: data.discountNum
	      }
	      reqObj.detailList[i] = temp;
	  });
  }
  else if(activityType=="6"){
	  var reqObj = {
	          branchIds:branchIds,
	          branchsName:branchsName,
	          branchsFullName:branchsFullName,
	          activityName:activityName,
	          activityType:activityType,
	          startTime:startTime,
	          endTime:endTime,
	          dailyStartTime:dailyStartTime,
	          dailyEndTime:dailyEndTime,
	          weeklyActivityDay:weeklyActivityDay,
	          activityScope:0,
	          memberExclusive:$("#memberExclusive").is(":checked")?1:0,
          memberExclusiveNum: $("#memberExclusiveNum").is(":checked") ? 1 : 0,
          maxDiscountNum: $("#maxDiscountNum").numberbox("getValue"),
          detailList: []
	  };
	  $.each(rows,function(i,data){
	      var temp = {
	    	  goodsSkuId: data.goodsSkuId,
	    	  limitCount: data.limitCount,
	    	  saleAmount:data.saleAmount,
	    	  groupNum:data.groupNum,
	    	  price:data.price,
	      }
	      reqObj.detailList[i] = temp;
	  });
	  
  }
  // 活动状态为折扣
  else if(activityType=="2"){
	// 活动状态为折扣--拼接数据
	  var reqObj = {
	          branchIds:branchIds,
	          branchsName:branchsName,
	          branchsFullName:branchsFullName,
	          activityName:activityName,
	          activityType:activityType,
	          startTime:startTime,
	          endTime:endTime,
	          dailyStartTime:dailyStartTime,
	          dailyEndTime:dailyEndTime,
	          weeklyActivityDay:weeklyActivityDay,
	          activityScope:activityScopedis,
	          memberExclusive:$("#memberExclusive").is(":checked")?1:0,
          memberExclusiveNum: $("#memberExclusiveNum").is(":checked") ? 1 : 0,
          maxDiscountAmount: $("#maxDiscountAmount").numberbox("getValue"),
          detailList: []
	  };
	  // 活动状态为折扣--单品折扣
	   if(activityScopedis=="0"){
		   $.each(rows,function(i,data){
			      var temp = {
			    	  goodsSkuId: data.goodsSkuId,
			    	  discount:data.discount,
			    	  price:data.price
			      }
			      reqObj.detailList[i] = temp;
			  });
	   }else if(activityScopedis=="2"){
		   //全场折扣
		   $.each(rows,function(i,data){
			      var temp = {
			    	  discount:data.discount,
			      }
			      reqObj.detailList[i] = temp;
			  });
	   }
	  // 活动状态为折扣--类别折扣
	   else{
		   $.each(rows,function(i,data){
			      var temp = {
			    		goodsCategoryId:data.goodsCategoryId,
			    		goodsCategoryCode:data.goodsCategoryCode,
			    	    discount:data.discount,
			      }
			      reqObj.detailList[i] = temp;
			  });
	   }
	 
  }
  // 活动状态为满折
  else if(activityType=="5"){
	// 活动状态为满减--拼接数据
	  var reqObj = {
	          branchIds:branchIds,
	          branchsName:branchsName,
	          branchsFullName:branchsFullName,
	          activityName:activityName,
	          activityType:activityType,
	          startTime:startTime,
	          endTime:endTime,
	          dailyStartTime:dailyStartTime,
	          dailyEndTime:dailyEndTime,
	          weeklyActivityDay:weeklyActivityDay,
	          activityScope:activityScopemj,
	          memberExclusive:$("#memberExclusive").is(":checked")?1:0,
          memberExclusiveNum: $("#memberExclusiveNum").is(":checked") ? 1 : 0,
          detailList: []
	  };
	// 活动状态为满减 -商品
	  if(activityScopemj=="0"){
		  $.each(rows,function(i,data){
		      var goods = {
		    	  goodsSkuId: data.goodsSkuId,
		    	  price:data.price
		      }
		      $.each(setrows,function(i,data){
			      var fullCutData = {
			    	  limitAmount:data.limitAmount,
			          discountPrice:data.discountPrice,
			      }
			      var goodsFull = null;
			      var goodsFull = $.extend(goodsFull,goods,fullCutData);
			      
			      reqObj.detailList.push(goodsFull);
			      
			  });
		      
		  });
	  }
	//活动状态为满减 -商品
	  else if(activityScopemj=="1"){
		  $.each(rows,function(i,data){
		      var goods = {
		    	  goodsCategoryId:data.goodsCategoryId,
				  goodsCategoryCode:data.goodsCategoryCode,
		      }
		      $.each(setrows,function(i,data){
			      var fullCutData = {
			    	  limitAmount:data.limitAmount,
			          discountPrice:data.discountPrice,
			      }
			      var goodsFull = null;
			      var goodsFull = $.extend(goodsFull,goods,fullCutData);
			      
			      reqObj.detailList.push(goodsFull);
			      
			  });  
		  });
	  } 
//满减全场类型
	  else if(activityScopemj=="2"){
		  $.each(rows,function(i,data){
		      var temp = {
		    		  limitAmount:data.limitAmount,
			          discountPrice:data.discountPrice,
		      }
		      reqObj.detailList[i] = temp;
		  });
	  }
  }else if(activityType=="10"){
	  
	  var temRows = $.map(rows, function(obj){
					  		return $.extend(true,{},obj);//返回对象的深拷贝
					  	});
	  
	  temRows.forEach(function(obj,index){
		  var tempgifts = [];//rows;
		  if(obj.giftPoList && obj.giftPoList.length >0){
			  obj.giftPoList.forEach(function(obx,indej){
				  var temgood = {
						  skuId :  obx.skuId,
						  skuCode :  obx.skuCode,
						  skuName :  obx.skuName,
						  giftNum :  obx.giftNum,
						  giftAmount :  obx.giftAmount,
				  }
				  tempgifts.push(temgood);
			  })
			  obj.goodsGiftList = tempgifts;
			  delete obj.giftPoList;
		  }
	  })
	  
	  //全场(2)  类别(1)  商品(0) 
	  var actScope = $("input[name='mmsstatus']:checked").val()||'';
	  
	  var reqObj = {
	          branchIds:branchIds,
	          branchsName:branchsName,
	          branchsFullName:branchsFullName,
	          activityName:activityName,
	          activityType:activityType,
	          startTime:startTime,
	          endTime:endTime,
	          dailyStartTime:dailyStartTime,
	          dailyEndTime:dailyEndTime,
	          weeklyActivityDay:weeklyActivityDay,
	          activityScope:actScope,
	          activityPattern:$('#activitymmsType').combobox('getValue')||'',
	          allowActivity:$("#mmsofactType1").is(":checked")?1:0,
	          allowMultiple:$("#mmsofactType2").is(":checked")?1:0,
	    	  memberExclusive:$("#memberExclusive").is(":checked")?1:0,
          memberExclusiveNum: $("#memberExclusiveNum").is(":checked") ? 1 : 0,
          detailList: setrows, //活动范围数据集合
	          gradientList:temRows //梯度集合
	  };
	  	  
  }
  
  reqObj['id'] = $("#activityId").val();
  var req = JSON.stringify(reqObj);
  var temUrl = contextPath+"/sale/activity/update";
  //复制功能
  if(sUrl == 'toCopy'){
	  delete reqObj.id;
	  temUrl = contextPath+"/sale/activity/save";
  }

  $_jxc.ajax({
      url:temUrl,
      contentType:'application/json',
      data:req
  },function(result){
	  if(result['code'] == 0){
          $_jxc.alert("操作成功！",function(){
        	  var actId = $("#activityId").val();
        	  if(sUrl == 'toCopy'){
        		  actId = result["activityId"];
        	  }
        	  
        	  location.href = contextPath +"/sale/activity/edit?activityId="+actId;
          });
      }else{
          $_jxc.alert(result['message']);
      }
  });
}

//审核
function check(){
	var activityId = $("#activityId").val();
	if(sUrl == 'toCopy'){
		$_jxc.alert('请先保存数据');
		return;
	}
	//活动类型
	var actType = $('#activityType').combobox('getValue');
	//满减类型
	var mjScopeV = $("input[name='mjstatus']:checked").val(); 
	//买满送类型
	var mmsScopeV = $('input[name="mmsstatus"]:checked').val();
	
	gridHandel.endEditRow();
	var newData = {};
	newData = checkUtil.assignInput();
	//特价 偶数特价 换购 组合特价  折扣  满减全场
	//actType == '1' || actType == '3' || actType == '4' || actType == '6' || actType == '2' || (actType == '5'&& mjScopeV=='2') 
	if(actType != '10' ){
		//满减类别  满减商品	
		if(actType == '5' && (mjScopeV=='1'||mjScopeV=='0') ){
			gridHandelMj.endEditRow();
			newData.mjgrid = gridHandelMj.getRows();
			var temNewData = {
				mjlbgrid:gridHandel.getRows()
			};
			if(!gFunComparisonArray(commonOldData,temNewData)){
				$_jxc.alert("数据已修改，请先保存再审核");
				return false;
			}
		}else{
			newData.grid = gridHandel.getRows();
		}
	}else{
		//买满送 
		gridHandelT.endEditRow();
		
		var mmscomNewData={};
		//类别满送 
		if(mmsScopeV == '1'){
			mmscomNewData.mmscomgrid = gridHandelB.getRows();
		}
		//商品满送
		if(mmsScopeV == '0'){
			mmscomNewData.mmscomgrid = gridHandelG.getRows();
		}
		
		if(!gFunComparisonArray(mmscomOldData,mmscomNewData)){
			$_jxc.alert("数据已修改，请先保存再审核");
			return false;
		}
		
		var temTJObj = $('#mmsgradedList').datagrid('getChecked');
	    if(temTJObj.length <= 1){
			var temTjList = gridHandelT.getRows();   
			temTjList[0].giftPoList = gridHandel.getRowsWhere({skuName:'1'});
	    }
		newData.mmsgrid = gridHandelT.getRows();
		
	}
	
	if(!gFunComparisonArray(oldData,newData)){
		$_jxc.alert("数据已修改，请先保存再审核");
		return false;
	}
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/sale/activity/check",
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

/**
 * 星期选择赋值
 */
function weekCheckDay(){
  var len=$('#weekday .ubcheckweek').length;
  var str="";
  for(var i=0;i<len;i++){
	 var elemt=$('#weekday .ubcheckweek').eq(i).find('.radioItem');
	 var check= elemt.prop("checked");
	  if(check){
		str+=elemt.val()
	   }
    }
  $('#weeklyActivityDay').val(str);
}

/**
 * 星期拆分字符串赋值checkbox  
 */
function StrweekCheckDay(weekstr){
	$(".ubcheckweek .radioItem").prop("checked",false);
	var arrWeek = weekstr.split("");
	$.each(arrWeek,function(i,val){
		$("#weekcheckbox"+val).prop("checked",true);
	})
	
}

//类别选择
function getGoodsType(){
	var param = {
			categoryType:"",
			type:1
	}
	new publicCategoryService(function(data){
		var nowRows = gridHandel.getRows();
		
        var addDefaultData  = gridHandel.addDefault(data,[{}]);
    	var keyNames = {
    			categoryCode:'goodsCategoryCode'
        };
    	//var ifReset = ['discount'];
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={goodsCategoryCode:1};  // 验证重复性
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere);
        $('#'+datagridId).datagrid("loadData",newRows);
		
	},param);
}
//返回列表页面
function back(){
	toClose();
}

//复制活动
function copyActivity(){
	var activityId = $("#activityId").val();
	if(activityId){
		toAddTab("复制促销活动",contextPath + "/sale/activity/toCopy?from=toCopy&activityId="+activityId);
	}
}

//新的导入功能 货号(0)、条码(1)导入
function toImportproduct(type){
	// 要货机构id
	var branchIds = $("#branchIds").val();
	// 发货机构id
    if(!branchIds){
        $_jxc.alert("请先活动分店");
        return;
    }
    
    var activityType=$("#activityType").combobox('getValue');
    
    //只支持特价、折扣、偶数特价类型的活动
    if(activityType!=='1' && activityType!=='2' && activityType!=='3'){
    	 $_jxc.alert("只支持特价、折扣、偶数特价类型的活动");
         return;
    }
    
    var param = {
        url : contextPath+"/sale/activity/importList",
        tempUrl : contextPath+"/sale/activity/exportTemp?type="+type+"&activityType="+activityType,
        type:type,
        branchIds : branchIds,
        activityType : activityType
    }
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		updateListData(data);
    		//$("#"+datagridId).datagrid("loadData",data);
    	}
    },param)
}


function updateListData(data){
	var keyNames = {
    		skuId:'goodsSkuId',
    		salePrice:'price'
    };
     var rows = gFunUpdateKey(data,keyNames);
     var argWhere ={skuCode:1};  //验证重复性
     var isCheck ={isGift:1 };   //只要是赠品就可以重复
     var newRows = gridHandel.checkDatagrid(data,rows,argWhere,isCheck);
    //计算老毛利率
    var activityType=$("#activityType").combobox('getValue');
    if(activityType==="1" || (activityType==="2" && $('#activityScopedis').val()==="0")
        || activityType==="3"){
        getOldSaleRate(newRows);
    }
     
    $("#saleMangeadd").datagrid("loadData",newRows);
 
}

//计算商品老毛利率 公式一样
function getOldSaleRate(newRows) {
    $.each(newRows,function (index,item) {
        //兼容老数据 如果原零售价为0
        if(item.price === '0' || item.price == 0 || isNaN(parseFloat(item.price)) ){
            item.oldSaleRate = "0.00%";
        }else{
            item.oldSaleRate = ((item.price-item.purchasePrice)/(item.price)*100).toFixed(2)+"%";
        }

    })
}


//刷新datagrid
function refreshTable(){
	var activityType=$("#activityType").combobox('getValue');
	if(activityType != '10'){
		gridHandel.setLoadData([{}]);
		gridHandelMj.setLoadData([{}]);
	}else{
		$('#mmsgradedList').datagrid('loadData',[{}]);
		$('#mmsgoodList').datagrid('loadData',[{}]);
		if($('input[name="mmsstatus"]:checked').val() == '0'){
			gridHandelG.setLoadData([$.extend({},gridDefaultG)])
			setTimeout(function(){
				$('#mmscommonList').datagrid('getPanel').panel('resize',{
					width: '100%',
					height: '100%'
				});
			},1000)
		}
		if($('input[name="mmsstatus"]:checked').val() == '1'){
			gridHandelB.setLoadData([$.extend({},gridDefault)])
			setTimeout(function(){
				$('#mmscommonList').datagrid('getPanel').panel('resize',{
					width: '100%',
					height: '100%'
				});
			},1000)
		}
	}
}