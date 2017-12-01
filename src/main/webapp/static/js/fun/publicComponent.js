/**
 * Created by huangj02 on 2016/8/12.
 * 公共组件接口的封装
 */
//公共组件-弹出框

var top = $(window).height()/3;
var dialogHeight = $(window).height()*(2/3);
var left = $(window).width()/4;


//公共组件-日期选择
//改变日期
function toChangeDate(index,fmt){
	if(typeof fmt === "undefined"){
		fmt = "yyyy-MM-dd"
	}
	
    switch (index){
        case 0: //今天
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrDayPreOrNextDay("prev",1)).format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrDayPreOrNextDay("prev",1)).format("yyyy-MM-dd"));
            break;
        case 2: //本周
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentWeek()[0]).format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd"));
            //$("#txtEndDate").val(dateUtil.getCurrentWeek()[1].format("yyyy-MM-dd hh:mm"));
            break;
        case 3: //上周
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousWeek()[0]).format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousWeek()[1]).format("yyyy-MM-dd"));
            break;
        case 4: //本月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentMonth()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format(fmt));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousMonth()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousMonth()[1]).format(fmt));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentSeason()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format(fmt));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousSeason()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousSeason()[1]).format(fmt));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentYear()[0]).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format(fmt));
            break;
        case 9: //昨天
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrDayPreOrNextDay("prev",30)).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format(fmt));
            break;
        case 10: //往后推一个月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreMonthDate()).format(fmt));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format(fmt));
            break;
        case 11: //明天
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrDayPreOrNextDay("next",1)).format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrDayPreOrNextDay("next",1)).format("yyyy-MM-dd"));
            break;
        default :
            break;
    }
}
//公共组件-日期选择时分秒
//改变日期
function toChangeDatetime(index){
    switch (index){
        case 0: //今天
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrDayPreOrNextDay("prev",1)).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrDayPreOrNextDay("prev",1)).format("yyyy-MM-dd hh:mm"));
            break;
        case 2: //本周
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentWeek()[0]).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            //$("#txtEndDate").val(dateUtil.getCurrentWeek()[1].format("yyyy-MM-dd hh:mm"));
            break;
        case 3: //上周
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousWeek()[0]).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousWeek()[1]).format("yyyy-MM-dd hh:mm"));
            break;
        case 4: //本月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentMonth()[0]).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousMonth()[0]).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousMonth()[1]).format("yyyy-MM-dd hh:mm"));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentSeason()[0]).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreviousSeason()[0]).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getPreviousSeason()[1]).format("yyyy-MM-dd hh:mm"));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrentYear()[0]).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            break;
        case 9: //昨天
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getCurrDayPreOrNextDay("prev",29)).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            break;
        case 10: //往后推一个月
            $("#txtStartDate").val(dateUtil.addStartTime(dateUtil.getPreMonthDate()).format("yyyy-MM-dd hh:mm"));
            $("#txtEndDate").val(dateUtil.addEndTime(dateUtil.getCurrentDate()).format("yyyy-MM-dd hh:mm"));
            break;
        default :
            break;
    }
}

/**
 * 批量导入货号或条码
 * @param params {
        isBtnTemple 是否需要模板下载按钮 默认true
        url:contextPath+"/form/deliverForm/importList",上传地址,
        tempUrl:contextPath+"/form/deliverForm/exportTemp",
        type:type, 0 货号 1 条码导入
        formType:'DD', 单据类型
        targetBranchId:targetBranchId, 要货机构
        sourceBranchId:sourceBranchId, 发货机构
        branchId:branchId  机构ID  
        status:status
 *  }
 *  
  * @param callback
 */
function publicUploadFileService(callback,params){
	
	var dalogTitle = "导入";
	if(params.title){
		dalogTitle = params.title;
	}else{
		dalogTitle = params.type==1?"导入条码":"导入货号"
	}
	
    //公有属性
    var  dalogTemp = $('<div id="uploadFile"/>').dialog({
        href:contextPath + "/common/uploadFile",
        width:480,
        height:320,
        title:dalogTitle,
        closable:true,
        resizable:true,
        onClose:function(){
            $(dalogTemp).panel('destroy');
        },
        modal:true,
        onLoad:function(){
            initUploadFileCallBack(callBackHandel,params)
        },
    });
    function callBackHandel(data){
        callback(data);
    }
}


/***
 *
 * //上传数据模板
 * url
 * formType   出库单Do
 * title
 * **/
function publicUploadTemplateService(callback,params){
    //公有属性
    var  dalogTemp = $('<div id="uploadFile"/>').dialog({
        href:contextPath + "/common/uploadTemplate",
        width:480,
        height:320,
        title:params.title?params.title:"上传自定义模板",
        closable:true,
        resizable:true,
        onClose:function(){
            $(dalogTemp).panel('destroy');
        },
        modal:true,
        onLoad:function(){
            initUploadTemplateCallBack(callBackHandel,params)
        },
    });
    function callBackHandel(data){
        callback(data);
    }
}


/**
 * 新品申请批量导入
 * @param params {url:上传地址}
 * @param callback
 */
function newGoodsApplyUploadFile(callback,params){
	var  dalogTemp = $('<div id="uploadFile"/>').dialog({
		href:contextPath + "/common/uploadFile",
		width:480,
		height:320,
		title:"新品申请导入模板",
				closable:true,
				resizable:true,
				onClose:function(){
					$(dalogTemp).panel('destroy');
				},
				modal:true,
				onLoad:function(){
					initUploadFileCallBack(callBackHandel,params)
				},
	});
	function callBackHandel(data){
		callback(data);
	}
}

/**
 * 公共组件-选择角色
 * 必须要先选机构，才能选角色
 * @param callback 回调函数
 * @param branchId 机构ID
 */
function publicRoleService(callback, branchCompleCode, branchType){
    //公有属性
    var  dalogTemp = $('<div/>').dialog({
        href:contextPath + "/role/common/toRoleList?branchCompleCode="
        	+branchCompleCode+"&branchType="+branchType,
        width:500,
        height:dialogHeight,
        title:"选择角色",
        closable:true,
        resizable:true,
        onClose:function(){
            $(dalogTemp).panel('destroy');
        },
        modal:true,
        onLoad:function(){
        	initRoleCommonView(branchCompleCode, branchType);
        	initRoleCallBack(callBackHandel)
        },
    });
    function callBackHandel(data){
        callback(data);
        $(dalogTemp).panel('destroy');
    }
}


//公共组件-机构选择 component/publicAgency
function publicAgencyService(callback,formType,branchId, branchType,isOpenStock,scope,isNoTree){
	if(!formType){
		formType="";
	}
	if(!branchId){
		branchId="";
	}
	if(!branchType){
		branchType="";
	}
	if(!isOpenStock){
		isOpenStock="";
	}
	if(!scope){
        scope="";
    }
    if(!isNoTree){
        isNoTree="";
    }

	var param = {
        formType:formType,
        branchId:branchId,
        branchType:branchType,
        isOpenStock:isOpenStock,
        scope:scope,
        type:isNoTree
    }
    //公有属性
    var  dalogTemp = $('<div/>').dialog({
    	href:contextPath + "/common/branches/viewComponent",
        width:680,
        height:$(window).height()*(2/3),
        title:"机构选择",
        closable:true,
        resizable:true,
        onClose:function(){
            $(dalogTemp).panel('destroy');
        },
        modal:true,
        onLoad:function(){
            var publicAgency = new publicAgencyClass();
            publicAgency.initAgencyView(param);
            publicAgency.initAgencyCallBack(callBackHandel)
        },
    });
    function callBackHandel(data){
        callback(data);
        $(dalogTemp).panel('destroy');
    }
}


/**
 * 公共组件-选择机构
 * @param callback
 * @param type  不用传递  无用参数
 */
function publicBranchService(callback,type,isOpenStock, formType) {
    //type 不用传递  无用参数
    publicAgencyService(callback,formType,"","",isOpenStock,"","NOTREE");
}

/**********************礼品兑换机构选择 start*******************************/
/**
 * 公共组件-选择机构
 * @param callback
 * @param type  0是单选  1是多选
 */
function publicBranchServiceGift(callback,type) {
    var dalogObj = {
        href: contextPath + "/system/user/publicBranchChoose?type=branch&check="+type,
        width: 680,
        height: dialogHeight,
        title: "选择机构",
        closable: true,
        resizable: true,
        onClose: function () {
            $(dalogTemp).panel('destroy');
        },
        modal: true,
    }
    if(type==1){
        dalogObj["buttons"] = [{
            text:'确定',
            handler:function(){
                publicOperatorGetCheck(callBackHandel);
            }
        },{
            text:'取消',
            handler:function(){
                $(dalogTemp).panel('destroy');
            }
        }];
    }else{
        dalogObj["onLoad"] = function () {
            initBranchCallBack(callBackHandel);
        };
    }
    //公有属性
    var dalogTemp = $('<div/>').dialog(dalogObj);
    function callBackHandel(data){
        callback(data);
        $(dalogTemp).panel('destroy');
    }
}

/**********************礼品兑换机构选择 end*******************************/

//公共组件-选择品牌
function publicBrandService(callback){
    //公有属性
    var  dalogTemp = $('<div/>').dialog({
        href:contextPath + "/common/brand/views",
        width:680,
        height:dialogHeight,
        title:"选择品牌",
        closable:true,
        resizable:true,
        onClose:function(){
            $(dalogTemp).panel('destroy');
        },
        modal:true,
        onLoad:function(){
            initBrandView();
            initBrandCallBack(callBackHandel)
        },
    });
    function callBackHandel(data){
        callback(data);
        $(dalogTemp).panel('destroy');
    }
    //调用方式
    //new publicBrandService(function(data){
    //    console.log(data);
    //});
}

//公共组件-选择商品类别
//param {categoryType,type,amount:限制数量}
var categoryDalog = null;
function publicCategoryService(callback,param){
	if(null != categoryDalog) return;
	
	if(!param || 'undefined' === typeof(param)){
		param = {
				categoryType:'',
				type:0
		}
	}else if('undefined' === typeof(param.categoryType)){
		param.categoryType = "";
	}else if('undefined' === typeof(param.type)){
		param.type = 0;
	}
	
    //公有属性
    var dalogObj = {
		href: contextPath + "/common/category/views",
        width:680,
        height:600,
        title:"选择商品类别",
        closable:true,
        resizable:true,
        onClose:function(){
            $(categoryDalog).panel('destroy');
            categoryDalog = null;
        },
        modal:true,
        };
   
    if(param.type==1){
    	 dalogObj["onLoad"] = function () {
        	 initCategoryView(param);
        };
    	dalogObj["buttons"] = [{
            text:'确定',
            handler:function(){
            	publicCategoryGetCheck(callBackHandel);
            }
        },{
            text:'取消',
            handler:function(){
                $(categoryDalog).panel('destroy');
                categoryDalog = null;
            }
        }];
    }else{
        dalogObj["onLoad"] = function () {
        	 initCategoryView(param);
             initCategoryCallBack(callBackHandel)
        };
    }
    //公有属性
    categoryDalog = $('<div/>').dialog(dalogObj);
    function callBackHandel(data){
    	  callback(data);
          $(categoryDalog).panel('destroy');
          categoryDalog = null;
    }
    
}

var supplierDalog = null;

//公共组件-选择供应商
/**
 * 		param = {
				supplierCodeOrName:'',
				branchId:'',
				saleWayNot:'',
				isDirect:''
		}
 * 
 * **/
function publicSupplierService(callback,newParam) {
	if(null != supplierDalog) return;

    var oldParam = {
        supplierCodeOrName:'',
        branchId:'',
        saleWayNot:'',
        isDirect:''
    }

    var param = $.extend(oldParam,newParam);

    //公有属性
	supplierDalog = $('<div/>').dialog({
        href: contextPath + "/common/supplier/views?saleWayNot="+param.saleWayNot+"&isDirect="+param.isDirect,
        width: 600,
        height: dialogHeight,
        title: "选择供应商",
        closable: true,
        resizable: true,
        onClose: function () {
            $(this).dialog('destroy');
            supplierDalog = null;
        },
        modal: true,
        onLoad: function () {
            initSupplierView(param);
            initSupplierCallBack(callBackHandel)
        },
    });
    function callBackHandel(data){
        callback(data);
        $(supplierDalog).panel('destroy');
        supplierDalog = null;
    }
}

//公共组件-选择操作员
var dalogTemp = null;
function publicOperatorService(callback,param) {
    var dialogHeight = $(window).height()*(2/3);
    if(typeof (param) === "undefined"){
        param = {
            type:0
        }
    }

    //公有属性
    var dialogDiv = {
        href: contextPath + "/common/personDialog",
        width: 680,
        height: dialogHeight,
        title: "选择操作员",
        closable: true,
        resizable: true,
        onClose: function () {
            $(dalogTemp).panel('destroy');
        },
        modal: true,
    }

    dialogDiv["onLoad"] = function () {
        initPersonView(param);
        initPersonCallBack(callBackHandel);
    };

    if(param.type==1){
        dialogDiv["buttons"] = [{
            text:'确定',
            handler:function(){
                publicPersonGetCheck(callBackHandel);
            }
        },{
            text:'取消',
            handler:function(){
                $(dalogTemp).panel('destroy');
            }
        }];
    }

    dalogTemp = $('<div/>').dialog(dialogDiv);

    function callBackHandel(data){
        callback(data);
        $(dalogTemp).panel('destroy');
    }
}

//公共组件-单据选择(采购单)
/*   type PA PI PR
* param {
*   type 单据类型
*   isAllowRefOverdueForm 是否去判断引用过期采购订单
* }
*
* */
function publicPurchaseFormService(param, callback){
    var tempParam = {
        formType:"PA",
        isAllowRefOverdueForm:"",
        isDirectSupplier:""
    }
    param = $.extend(tempParam,param)

  //公有属性
  var  dalogTemp = $('<div/>').dialog({
      href:contextPath + "/form/purchaseSelect/view",
      width:1200,
      height:dialogHeight,
      title:"单据选择",
      closable:true,
      resizable:true,
      onClose:function(){
          $(dalogTemp).panel('destroy');
      },
      modal:true,
      onLoad:function(){
    	  initParam(param);
    	  initFormCallBack(callBackHandel)
      }
  });
  //私有方法
  function callBackHandel(data){
      callback(data);
      $(dalogTemp).panel('destroy');
  }


}


//公共组件-单据选择(调拨单)
/*
* param{
* targetBranchId
* type
* }
*
* */
function publicDeliverFormService(param,callback){
    var targetBranchId = 'undefined'!=typeof(param.targetBranchId)?param.targetBranchId:'';
    var type = 'undefined'!=typeof(param.type)?param.type:'';
//公有属性
var  dalogTemp = $('<div/>').dialog({
    //href:contextPath + "/form/deliverSelect/view?type="+type+"&targetBranchId="+targetBranchId,
	href:contextPath + "/form/deliverSelect/view",
    width:1200,
    height:dialogHeight,
    title:"单据选择",
    closable:true,
    resizable:true,
    onClose:function(){
        $(dalogTemp).panel('destroy');
    },
    modal:true,
    onLoad:function(){
    	initParam(param)
        initDeliverFormCallBack(callBackHandel);
    }
});
//私有方法
function callBackHandel(data){
    callback(data);
    $(dalogTemp).panel('destroy');
}
}

//临时方法
/****
 *     var param = {
    		type:'',  DA, PR ,PA ,PC
    		key:searchKey,
    		isRadio:'',是否单选
    		branchId:branchId,
    		sourceBranchId:'',
    		targetBranchId:'',
    		supplierId:'',机构
    		flag:'0',
    		categoryShows:categoryShows  类别 新增库存盘点单
    }
 * 
 * 
 * *****/

function publicGoodsServiceTem(param,callback){
	var param = setParam(param);
	if(param.key){
	    //后台参数是 skuCodesOrBarCodes
        param.skuCodesOrBarCodes = param.key;
        param.formType = param.type;
		var urlTemp;
		if(param.type=="DA"){
			param.branchId = '';
            urlTemp = contextPath + '/goods/goodsSelect/importSkuCode';
		} else {
            urlTemp = contextPath + '/goods/goodsSelect/importSkuCode';
		}
		$.ajax({
			url:urlTemp,
			type:'POST',
            data:param,
			success:function(data){
				if(data&&data.length==1){
					callback(data);
			}else{
				publicGoodsServiceHandel(param,callback);
			}
		},
		error:function(){
			 $_jxc.alert("数据查询失败");
		}
		})
    }else{
        publicGoodsServiceHandel(param,callback);
    }
}

/*
* 设置前台没有传入的参数
* */
function setParam(newParam) {

    var oldParm = {
        type:'',
        key:'',
        isRadio:0,
        branchId:'',
        sourceBranchId:'',
        targetBranchId:'',
        supplierId:'',
        flag:'0',
        categoryShows:'',
        isManagerStock:''
    }
   var param =  $.extend(oldParm,newParam);

    return param;
}

var good_dalogTemp = null;

function publicGoodsServiceHandel(param,callback){
	//2.7.0 修改： 组合机构选择时 branchId过长 导致400  现在链接参数改为页面初始化动态渲染<input type="hidden">隐藏域（param）
	/*if(!param.branchId){
        url=contextPath + "/goods/goodsSelect/view?type="+param.type+"&sourceBranchId="+param.sourceBranchId+"&targetBranchId="+param.targetBranchId+"&supplierId="+param.supplierId+"&flag="+param.flag;
    }else if(param.categoryCodes || param.isManagerStock){ //商品类别
    	url=contextPath + "/goods/goodsSelect/view?type="+param.type+"&branchId="+param.branchId+"&supplierId="+param.supplierId+"&flag="+param.flag+"&categoryCodes="+param.categoryCodes+"&isManagerStock="+param.isManagerStock;
    }else{
    	url=contextPath + "/goods/goodsSelect/view?type="+param.type+"&branchId="+param.branchId+"&supplierId="+param.supplierId+"&flag="+param.flag;
    }*/
	
	var url=contextPath + "/goods/goodsSelect/view";
    //公有属性
    var dalogObj = {
        href:url,
        width:1200,
        height:dialogHeight,
        title:"商品选择",
        closable:true,
        resizable:true,
        onClose:function(){
        	 $(good_dalogTemp).dialog('destroy');
        	 good_dalogTemp = null;
        },
        modal:true,
    }
    if(param.isRadio&&param.isRadio==1){
        dalogObj["onLoad"] =function(){
        	initForm(param);
            initGoodsRadioCallBack(function(data){
                callback( [data]);
                $(good_dalogTemp).dialog('close');
                good_dalogTemp = null;
            });
            initSearch(param);
        };
    }else{
        dalogObj["onLoad"] =function(){
        	initForm(param);
            initGoodsRadioCallBack();
            initSearch(param);
        };
        dalogObj["buttons"] =[{
            text:'确定',
            handler:function(){
                getCheckGoods();
            }
        },{
            text:'取消',
            handler:function(){
                $(good_dalogTemp).dialog('destroy');
                good_dalogTemp = null;
            }
        }];
    }
    
    if(null != good_dalogTemp) return;
    
     good_dalogTemp = $('<div/>').dialog(dalogObj);
    //私有方法
    function getCheckGoods(){
        publicGoodsGetCheckGoods(function(data){
            if(data.length==0){
                $_jxc.alert("请选择数据");
                return;
            }
            callback(data);
            $(good_dalogTemp).dialog('close');
            good_dalogTemp = null;
        });
    }
}

//费用选择
function publicCostService(param,callback){
	//默认参数属性
	var oldParm = {isRadio:1};
	//只有一条数据时 直接返回
	param =  $.extend(oldParm,param);
	if(param.key){
		param.nameOrCode = param.key;
		$_jxc.ajax({
			url:contextPath+'/common/chargeSelect/getChargeComponentList',
			data:param
		},function(data){
			
			if(data&&data.list&&data.list.length==1){
				callback(data.list);
			}else{
				publicCostServiceHandel(param,callback);
			}
		})
	}else{
		publicCostServiceHandel(param,callback);
	}
	
	
}

function publicCostServiceHandel(param,callback){
	var url = contextPath + "/common/chargeSelect/viewChargeComponent?type="+ param.type||'';
	var dalogParam = {
	    	title:"费用选择",
	        href:url,
	        width:680,
	        height:$(window).height()*(2/3),
	        closable:true,
	        resizable:true,
	        onClose:function(){
	        	 $(dalogObj).dialog('destroy');
	        	 dalogObj = null;
	        },
	        modal:true,
	        onLoad:function(){
	        	initChargeView(param);
	            initChargeCallBack(callBackHandel)
	        }
	        
	    };
		
		if(param.isRadio != 0){
			dalogParam["buttons"] =[{
	            text:'确定',
	            handler:function(){
	                getCheckCost();
	            }
	        },{
	            text:'取消',
	            handler:function(){
	                $(dalogObj).dialog('destroy');
	                dalogObj = null;
	            }
	        }];
	    }
		
		var dalogObj = $('<div/>').dialog(dalogParam);
		
	    function callBackHandel(data){
	        callback(data);
	        $(dalogObj).panel('destroy');
	    }
	    
	    function getCheckCost(){
	        publicCostGetCheckCost(function(data){
	            if(data.length==0){
	                $_jxc.alert("请选择数据");
	                return;
	            }
	            callback(data);
	            $(dalogObj).panel('destroy');
	        });
	    }
}


//公共组件-公共方法
//关闭
function toClose(){
	window.parent.closeTab();
}
function toAddTab(title,url){
	window.parent.addTab(title,url);
}
function refreshDataGrid(datagridName){
    $('#'+datagridName).datagrid('reload');
}
function toRefreshIframeDataGrid(src,datagridName){
    var frame = window.parent.frames[src];
    frame.contentWindow.refreshDataGrid(datagridName);
}

//返回
function toBack(){
	history.go(-1);
}
//刷新当前页面
function gFunRefresh(obj) {
    window.location.reload();
	//$($(obj).closest('form'))[0].reset();
}
function toBackByJS(){
	history.back()
	//history.go(-1);
}
/**
 * 公共库-表格 黄江
 * ***************核心请勿修改*********************
 */
function GridClass(){
    var _this = this;
    var gridName;                        //表格名称
    var rowIndex;                //当前选中的行号
    var selectFieldName;               //当前选中的单元名称
    var nowEditFieldName;               //当前正在编辑的单元名称
    this.getSelectRowIndex = function(){
        return rowIndex||0;
    };
    this.getSelectFieldName = function(){
        return selectFieldName;
    };
    this.setGridName = function(arg){
        gridName = arg;
    };
    this.getGridName = function(){
        return gridName;
    };
    this.setSelectRowIndex = function(arg){
        rowIndex = arg;
    };
    this.setSelectFieldName = function(arg){
        selectFieldName = arg;
    };
    this.setNowEditFieldName = function(arg){
        nowEditFieldName = arg;
    };
    this.getNowEditFieldName = function(){
        return nowEditFieldName;
    };
    this.initKey = function(params){
        $.extend($.fn.datagrid.methods, {
            keyCtr : function (jq) {
                return jq.each(function () {
                    var grid = $(this);
                    grid.datagrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown',
                        function (e) {
                        switch (e.keyCode) {
                            case 37: //左键
                                var field = getLRFiledName('left');
                                var target = _this.getFieldTarget(field);
                                while($(target).prop('readonly') || $(target).prop('disabled'))
                                {
                                	_this.setSelectFieldName(field);
                                    field = getLRFiledName('left');
                                	target = _this.getFieldTarget(field);
                                }
                                
                                if(target){
                                    _this.setFieldFocus(target);
                                    _this.setSelectFieldName(field);
                                }
                                break;
                            case 13: //回车键
                                e.keyCode=9
                                if(getLRFiledName('right')=="isGift"){
                                    _this.setSelectFieldName(field);
                                    var field = getLRFiledName('right');
                                    _this.setSelectFieldName(field);
                                    var target = _this.getFieldTarget(field);
                                    if(target){
                                        _this.setFieldFocus(target);
                                        _this.setSelectFieldName(field);
                                    }
                                }
                                if(params&&selectFieldName==params.enterName){
                                	//防止快速点击时 二次弹框
                                	if($("#"+gridName).closest("body").find('div.window-mask').length > 0)return;
                                    var target = _this.getFieldTarget(selectFieldName);
                                    params.enterCallBack($(target).textbox('getValue'));
                                }else{
                                    var row = _this.getEditRow(gridName,rowIndex);
                                    if(row.length>0&&row[row.length-1].field==selectFieldName){
                                        if(grid.datagrid('getRows').length-rowIndex>1){
                                            var lastIndex = rowIndex+1;
                                            _this.setBeginRow(lastIndex);
                                            _this.setSelectFieldName(params.firstName);
                                            var target = _this.getFieldTarget(selectFieldName);
                                            if(target){
                                                _this.setFieldFocus(target);
                                            }
                                        }else{
                                            params.enterCallBack("add")
                                        }
                                    }else{
                                        var field = getLRFiledName('right');
                                        var target = _this.getFieldTarget(field);
                                        while($(target).prop('readonly') || $(target).prop('disabled'))
                                        {
                                        	//修复如果最后一列是不可读的表单造成的页面卡掉bug20180
                                        	if(row.length>0&&row[row.length-1].field == field){
                                        		if(grid.datagrid('getRows').length-rowIndex>1){
                                                    var lastIndex = rowIndex+1;
                                                    _this.setBeginRow(lastIndex);
                                                    _this.setSelectFieldName(params.firstName);
                                                    var target = _this.getFieldTarget(selectFieldName);
                                                    if(target){
                                                        _this.setFieldFocus(target);
                                                    }
                                                }else{
                                                    params.enterCallBack("add")
                                                }
                                        		break;
                                        	}
                                        	_this.setSelectFieldName(field);
                                            field = getLRFiledName('right');
                                            if(field=="isGift"){
                                                _this.setSelectFieldName(field);
                                                field = getLRFiledName('right');
                                                _this.setSelectFieldName(field);
                                            }
                                            target = _this.getFieldTarget(field);
                                        }
                                        if(target){
                                    		_this.setFieldFocus(target);
                                    		_this.setSelectFieldName(field);
                                        }

                                    }
                                }
                                break;
                            case 39: //右键
                                var field = getLRFiledName('right');
                                var target = _this.getFieldTarget(field);
                                var row = _this.getEditRow(gridName,rowIndex);
                                while($(target).prop('readonly') || $(target).prop('disabled'))
                                {
                                	//修复如果最后一列是不可读的表单造成的页面卡掉bug20180
                                	if(row.length>0&&row[row.length-1].field == field){
                                		if(grid.datagrid('getRows').length-rowIndex>1){
                                            var lastIndex = rowIndex+1;
                                            _this.setBeginRow(lastIndex);
                                            _this.setSelectFieldName(params.firstName);
                                            var target = _this.getFieldTarget(selectFieldName);
                                            if(target){
                                                _this.setFieldFocus(target);
                                            }
                                        }else{
                                            params.enterCallBack("add")
                                        }
                                		break;
                                	}
                                	_this.setSelectFieldName(field);
                                    field = getLRFiledName('right');
                                	target = _this.getFieldTarget(field);
                                }
                                if(target){
                                    _this.setFieldFocus(target);
                                    _this.setSelectFieldName(field);
                                }
                                break;
                            case 38: //上键
                                if(rowIndex>0){
                                    var lastIndex = rowIndex-1;
                                    _this.setBeginRow(lastIndex);
                                    var target = _this.getFieldTarget(selectFieldName);
                                    if(target){
                                        _this.setFieldFocus(target);
                                    }
                                }
                                break;
                            case 40: //下键
                                if(grid.datagrid('getRows').length-rowIndex>1){
                                    var lastIndex = rowIndex+1;
                                    _this.setBeginRow(lastIndex);
                                    var target = _this.getFieldTarget(selectFieldName);
                                    if(target){
                                        _this.setFieldFocus(target);
                                    }
                                }
                                break;
                        }
                    });
                });
            },
        });
        $("#"+gridName).datagrid({}).datagrid("keyCtr");
    }

    this.checkTextLength = function (params) {
        $.extend($.fn.datagrid.methods,{
            textChange:function (jq) {
                return jq.each(function () {
                    $(this).datagrid('getPanel').panel('panel').attr('tabindex', 1).bind("change",function (e) {
                            if(params&&selectFieldName==params.enterName){
                                   var val = e.target.value;
                                   if($_jxc.isStringNull(val)){
                                       if(val.length > params.maxLength){
                                           $_jxc.alert(params.title+"最大只能输入"+params.maxLength+"个字符")
                                           val = val.substr(0,params.maxLength);
                                           _this.setFieldTextValue(params.enterName,val);
                                           params.enterCallBack();
                                       }
                                       if(val.length < params.minLength){
                                           $_jxc.alert(params.title+"最少输入"+params.minLength+"个字符")
                                           // val = val.substr(0,params.maxLength);
                                           // _this.setFieldTextValue(params.enterName,val);
                                           params.enterCallBack();
                                       }
                                   }

                            }

                        })
                    })
            }
        });
        $("#"+gridName).datagrid({}).datagrid("textChange");
    }

    this.checkNumberVal = function (params) {
        $.extend($.fn.datagrid.methods,{
            numberChange:function (jq) {
                return jq.each(function () {
                    $(this).datagrid('getPanel').panel('panel').attr('tabindex', 1).bind("change",function (e) {
                        if(params&&selectFieldName==params.enterName){
                            var val = parseFloat(e.target.value);
                            if(isNaN(val)){
                                $_jxc.alert("数据输入错误，请输入数字")
                                params.enterCallBack();
                            }else{
                                if( val > params.maxValue){
                                    $_jxc.alert(params.title+"最大只能输入"+params.maxValue)
                                    val = val.substr(0,params.maxValue);
                                    _this.setFieldValue(params.enterName,val);
                                    params.enterCallBack();

                                }
                                if(val < params.minValue){
                                    $_jxc.alert(params.title+"最小只能输入"+params.minValue)
                                    val = val.substr(0,params.minValue);
                                    _this.setFieldValue(params.enterName,val);
                                    params.enterCallBack();

                                }
                            }
                        }

                    })
                })
            }
        });
        $("#"+gridName).datagrid({}).datagrid("numberChange");
    }


    /**
     * 获取左右边单元名称
     * @param index    行号
     * @param field    单元名称
     * @param type     left左边 right右边
     * @returns {*}
     */
    function getLRFiledName(type){
        var row = _this.getEditRow(gridName,rowIndex);
        var searchField = selectFieldName;
        for(var i=0;i<row.length;i++){
            if(row[i].field==selectFieldName){
                if(type=='left'&&i>0){
                    searchField = row[i-1].field;
                }
                if(type=='right'&&i<row.length-1){
                    searchField = row[i+1].field;
                }
            }
        }
        return searchField;
    }
    /**
     * 删除多行
     */
	this.delRows = function(){
		var rows = $("#"+gridName).datagrid("getSelections");
		  if (rows.length > 0) {
		      $.messager.confirm("提示", "你确定要删除吗?", function (r) {
		          if (r) {
		          	$.each(rows,function(i,row){
		          		var rowIndex = $("#"+gridName).datagrid("getRowIndex",row);
		          		$("#"+gridName).datagrid("deleteRow",rowIndex);
		          	});
		          }
		      });
		  }
		  else {
		      $.messager.alert("提示", "请选择要删除的行", "error");
		  }
	}
    /**
     * 获取表格非空数据
     */
	this.getRows = function(){
		var rows = $("#"+gridName).datagrid("getRows");
		var rowsData = [];
		$.each(rows,function(i,row){
			if(!$.isEmptyObject(row)){
				rowsData.push(row);
			}
		});
		return rowsData;
	}
    /**
     * 根据条件获取数据
     * @param argWhere 条件
     * @returns {*}
     */
    this.getRowsWhere = function(argWhere){
    	var newRows = [];
    	try{
    		$("#"+gridName).datagrid("endEdit",rowIndex);
    		var rows = _this.getRows();
    		$.each(rows,function(i,row){
    			$.each(argWhere,function(key,val){
    				if(row[key]){
    					newRows.push(row);
    				}
    			})
    		});
    		return newRows;
    	}catch(e){
    		return newRows;
    	}
    }
    /**
     * 表格添加默认值 黄江
     * @param data    数据源
     * @param defultVal 默认值
     * @returns {Array}
     */
    this.addDefault = function(data,defultVal){
        var newRows = [];
        $.each(data,function(i,val){
            newRows.push($.extend(val,defultVal));
        });
        return newRows;
    }
    /**
     * 合并数据-过滤相同的
     * @param arrs 现有数据
     * @param data 新增数据
     * @param argWhere 合并条件
     * @param ifReset  对于重复数据  要替换的属性值的字段
     * @returns 返回合并后数据
     */
    this.checkDatagrid = function(arrs,data,argWhere,isCheck,ifReset){

        var newData = [];
        $.each(data,function(i,val){
            var isRepeat = false;
            $.each(arrs,function(j,val1){
                if(argWhere&&argWhere!={}){
                    $.each(argWhere,function(key,argVal){
                        if(val[key]==val1[key]){
                        	
                        	if(ifReset && $.isArray(ifReset) && ifReset.length > 0){
                        		$.each(ifReset,function(inx,arKey){
                        			if(arKey){
                        				val1[arKey] = val[arKey];
                        			}
                        		})
                        	}
                        	
                            isRepeat = true;
                        }
                    });
                }
                
               if(isCheck&&isCheck!={}){
                   $.each(isCheck,function(checkKey,checkVal){
                       if(val1[checkKey]==checkVal||val[checkKey]!=val1[checkKey]){
                           isRepeat = false;
                       }
                   });
               }

            });
            if(!isRepeat){
                newData.push(val);
            }
        });
        return arrs.concat(newData);
    }
    /**
     * 获取编辑框值
     * @param gridName  表格ID
     * @param rowIndex  行号
     * @param fieldName 单元格名称
     * @returns {*}
     */
    this.getFieldValue = function(rowIndex,fieldName){
        var ed = $('#'+gridName).datagrid('getEditor', {index:rowIndex,field:fieldName});
        if(ed&&ed.target){
        	//2.7.1 bwp扩展
        	if(ed.type == 'datebox'){
        		return $(ed.target).datebox('getValue');
        	}else{
        		return $(ed.target).numberbox('getValue');
        	}
        }
        return "";
    }
    /**
     * 设置numberbox单元格编辑框值
     * @param fieldName 单元格名称
     * @returns {*}
     */
    this.setFieldValue = function(fieldName,val){
        var target = _this.getFieldTarget(fieldName);
        if(target){
            $(target).numberbox('setValue',val);
        }
    }

    /*
    *设置文本框的值
    * */
    this.setFieldTextValue = function(fieldName,val){
        var target = _this.getFieldTarget(fieldName);
        if(target){
            $(target).textbox({'value':val})
            $(target).textbox('setText',val);
        }
    }
    
    this.setFieldSpinnerValue = function(fieldName,val){
        var target = _this.getFieldTarget(fieldName);
        if(target){
            $(target).numberspinner('setValue',val);
        }
    }

    /**
     * 设置单元格非编辑框值 可以修改多个
     * @param fieldName 单元格名称
     * @returns {*}
     */
    this.setFieldsData = function(vals){
        var rows = $('#'+gridName).datagrid('getRows');
        $.each(vals,function(key,val){
            rows[rowIndex][key] = val;
        });
    }
    /**
     * 获取单元格非编辑框值
     * @param rowIndex  行号
     * @param fieldName 单元格名称
     * @returns {*} 返回单元格的值
     */
    this.getFieldData = function(rowIndex,fieldName){
        return $('#'+gridName).datagrid('getRows')[rowIndex][fieldName];
    }
    /**
     * 设置单元格编辑的焦点  黄江
     * @param obj  单元格对象
     */
    this.setFieldFocus = function(obj){
    	if(null == obj) return;
        setTimeout(function(){
            $(obj).textbox('textbox').focus();
            $(obj).textbox('textbox').select();
        },10);
    }
    /**
     * 设置选择商品后焦点放在第二个输入框  黄江
     */
    this.setLoadFocus = function(){
        setTimeout(function(){
            var row = _this.getEditRow(gridName,rowIndex);
            _this.setBeginRow(rowIndex||0);
            if(row.length>=2){
                _this.setSelectFieldName(row[1].field);
                _this.setFieldFocus(_this.getFieldTarget(row[1].field));
            }
        },10);
    }

    /**
     * 获取单元格对象
     * @param fieldName 单元格名称
     * @returns {*} 返回单元格对象
     */
    this.getFieldTarget = function(fieldName){
        var ed  = $('#'+gridName).datagrid('getEditor', {index:rowIndex,field:fieldName});
        if(ed&&ed.target){
            return ed.target;
        }
        return null;
    }
    
    /**
     * 获取编辑行
     * @param gridName  表格ID
     * @param rowIndex  行号
     * @returns 行数据
     */
    this.getEditRow = function(gridName,rowIndex){
       return $('#'+gridName).datagrid('getEditors', rowIndex);
    }
    /**
     * 编辑行
     * @param rowIndex   行号
     */
    this.setBeginRow = function(argRowIndex){
        $('#'+gridName).datagrid('endEdit', rowIndex);                  //结束之前的编辑
        rowIndex = argRowIndex;
        $('#'+gridName).datagrid('selectRow', rowIndex);
        $('#'+gridName).datagrid('beginEdit', rowIndex);
    }
    /**
     * 加载数据
     * @param data
     */
    this.setLoadData = function(data){
        $("#"+gridName).datagrid("loadData",data);
    }
    /**
     * 搜索表格中匹配的相同数据
     * @param index
     * @param obj  匹配对象
     * @returns {Array}
     */
    this.searchDatagridFiled = function(index,obj){
        var rows =  $('#'+gridName).datagrid('getRows');
        var searchData = [];
        $.each(rows,function(i,row){
            if(i!=index){
                var isRepeat = true;
                $.each(obj,function(key,val){
                    if(row[key]!=val){
                        isRepeat = false;
                    }
                });
                if(isRepeat){
                    searchData.push(row);
                }
            }
        });
        return searchData;
    }
    /**
     * 添加一行
     * @param index  当前行号
     * @param defaultVal  默认值
     */
    this.addRow = function(index,defaultVal){
        $("#"+gridName).datagrid("endEdit", rowIndex);
        $("#"+gridName).datagrid("insertRow",{
            index:parseInt(index)+1,
            row:$.extend({},defaultVal)
        });
        setTimeout(function(){
            $("#"+gridName).datagrid("loadData",$("#"+gridName).datagrid("getRows"));
        },10);
    }
    /**
     * 删除当前行
     * @param index     当前行号
     */
    this.delRow = function(index){
        if( $("#"+gridName).datagrid("getRows").length==1){
            return;
        }
        $("#"+gridName).datagrid("endEdit", rowIndex);
        $("#"+gridName).datagrid("deleteRow",index);
        setTimeout(function(){
            $("#"+gridName).datagrid("loadData",$("#"+gridName).datagrid("getRows"));
        },10);
    }
    /**
     * 结束编辑当前行
     * @param index     当前行号
     */
    this.endEditRow = function(){
        $("#"+gridName).datagrid("endEdit", rowIndex);
    }
    //更新合计
    this.updateFooter = function(fields,argWhere){
        var rows = _this.getRows();
        var obj = {};
        var isEdit = false;
        $.each(fields,function(key,val){
            var editVal = _this.getFieldValue(rowIndex,key);
            if(editVal){
                obj[key] = editVal;
            }
        });
        if(obj!={}){
            isEdit = true;
            rows.push($.extend(rows[rowIndex],obj));
        }
        $.each(rows,function(i,row){
            if(row[argWhere['name']]==argWhere['value']||argWhere['value']==""){
                if(isEdit&&i==rowIndex){
                    return true;
                }
                $.each(fields,function(key,val){
                    fields[key] = ((parseFloat(fields[key])||0)+(parseFloat(row[key]?row[key]:0)||0)).toFixed(4);
                });
            }
        })
        $('#'+gridName).datagrid('reloadFooter',[$.extend({"isFooter":true,},fields)]);
        return fields;
    }
    /**
     * 设置表头标题的方向
     * @param str left居左  center居中  right居右
     */
    this.setDatagridHeader = function(str){
        $('.datagrid-header').find('div.datagrid-cell').css('text-align',str||'center');
        $('.datagrid-header').find('div.datagrid-cell').css('font-weight','bold');
    }
    
	this.getColumnOption = function(fieldName){
		var opts = $('#'+gridName).datagrid('getColumnOption',fieldName);
		if(opts){
			return opts;
		}
		return null;
	}
	
	/**
	 * bwp 获取 表格底部统计栏数据
	 */
	this.getFooterRow = function(){
		return $('#'+gridName).datagrid('getFooterRows');
	}
	

}

//公共方法====================================================================
/**
 * 黄江 将数据自动插入到表单中
 * @param obj  键值对
 */
function gFunUnSerialize(obj){
    $.each(obj,function(i,v){
       //console.log($("#"+i).prop("tagName"));
        if($("#"+i).get(0)&&$("#"+i).get(0).tagName=="INPUT"){ //普通的input
            //console.log($("#"+i).attr('type'));
            if($("#"+i).attr('type')=="checkbox"){
                $("#"+i).attr("checked","checked");
            }else{
                $("#"+i).val(v);
            }
        }
        else if($("#"+i).get(0)&&$("#"+i).get(0).tagName=="TEXTAREA"){ //普通的textarea
        	 $("#"+i).html(v);
        }
        else{
            $("#"+i).combobox('select',v);
        }
    })
}
/**
 * 黄江 替换列表数据键的名称
 * @param arrs  数据源
 * @param obj  需要替换名称列表对象
 * @returns {Array} 返回新的数据源
 */
function gFunUpdateKey(arrs,obj){
    var newArrs = [];
    $.each(arrs,function(i,item){
        $.each(obj,function(k,v){
        	if(item[k]||parseInt(item[k])===0||item[k]===""){
            	if(v){
            		item[v] = gFunIsNotNull(item[k])?item[k]:"";
            	}
        	}
        });
        newArrs.push(item);
    });
    return newArrs;
}
/**
 * 格式化数据 黄江
 * @param arrs
 * @param config
 * @returns {*}
 */
function gFunFormatData(arrs,config){
    $.each(arrs,function(i,obj){
        $.each(obj,function(k,val){
            if(config.date){
                $.each(config.date,function(j,dateKey){
                    if(dateKey==k){//格式化日期
                        if(val){
                            obj[dateKey] = new Date(val).format('yyyy-MM-dd');
                        }
                    }
                });
            }
        });
    });
    return arrs;
}
/**
 * 验证数据两个对象数据是否完全相同
 * @param arg1
 * @param arg2
 * @returns {boolean}
 */
function gFunComparisonArray(arg1,arg2){
    var arr1 = JSON.stringify(arg1);
    var arr2 = JSON.stringify(arg2);
    return arr1==arr2;
}
/**
 * 显示loading
 */
function gFunStartLoading(str){
    $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height(),'z-index':'9999'}).appendTo("body");
    $("<div class=\"datagrid-mask-msg\"></div>").html(str?str:"正在加载，请稍候...").appendTo("body").css({display:"block",'z-index':'9999',left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});
}
/**
 * 关闭loading
 */
function gFunEndLoading(){
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}
/**
 * 输入0-9的数字
 * @param obj
 * @returns {XML|void|string|*}
 */
function checkNum(obj){
	 obj.value=obj.value.replace(/[^0-9]/g,'');
	 return obj.value;
}

function gFunIsNotNull(val){
    if(val||parseInt(val)===0||val===""){
        return true
    }
    return false;
}

//输入1-9的数字，第二位及后面的可以有0，比如10
function checkInteger(obj){
	if(obj.value.length == 1){
		obj.value=obj.value.replace(/[^1-9]/g,'');
		
	}else{
		obj.value=obj.value.replace(/\D/g,'');
	}
	return obj.value;
}

//只能输入正整数 1-9的数字   可以输入0
function checkPositiveInteger(obj){
	obj.value = obj.value.replace(/[^\d]/g,"") || 0; //清除"数字"以外的字符
	obj.value = obj.value.replace(/^0/g,"") || 0; //验证第一个字符是不是为0
	return obj.value;
}

//电话号码 020-88888888或者12888888888
function checkPhoneMoblie(obj){
	if(!/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(obj.value) && !/^1\d{10}$/i.test(obj.value)){
		obj.value = '';
    }
	return obj.value;
}

//输入数字，保留两位小数
function checkPrice(obj){
	 obj.value =obj.value.replace(/[^0-9.]/g,'');
	 if(obj.value.indexOf(".")>-1){
		 if(obj.value.split(".").length-1>1){
			  obj.value =obj.value.substring(0, obj.value.length-1);
		  }else{
			  if(obj.value.substr(obj.value.indexOf(".")+1).length > 2){
				obj.value =  obj.value.substring(0, obj.value.length-1);
			  }
		  }	  
	} 
	 return obj.value;
}

//非法字符校验
var voidChar = ['<','>','input','&','"'];
function isValidString(obj){
	var value = $(obj).val();
	if(obj.value!=null && obj.value.trim()!=''){
		   for(var i=0;i<voidChar.length;i++){
			   if(obj.value.indexOf(voidChar[i]) > -1){
				   obj.value = obj.value.replace(voidChar[i],'');
			  }
		   }
		   
	}
  return obj.value;
}

//过滤特殊字符
function stripscript(s)
{
    var pattern = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs+s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}


/**
 * 获取枚举显示名称，enumObj为空则返回空字符串
 * @param enumObj 枚举对象
 * @returns {String} 枚举显示名称
 */
function enumViewName(enumObj){
	var str = "";
	if(enumObj){
		str =  enumObj.name;
    }
	return str;
}

/**
 * 获取枚举值，enumObj为空则返回空字符串
 * @param enumObj 枚举对象
 * @returns {String} 枚举值
 */
function enumViewValue(enumObj){
	var str = "";
	if(enumObj){
		str =  enumObj.value;
    }
	return str;
}


//禁止回车键提交
$(window).keydown(function(event){
    if (event.keyCode  == 13) {
        event.preventDefault();
    }
});
//监听回车键
function gFunSetEnterKey(cb){
    $('.usearch').keydown(function(event){
        if (event.keyCode  == 13) {
            cb();
        }
    });
}
function gFunGetQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}

/*
* 选择活动
* branchId
* */
function publicActivity(callback,param){
	var dalogTemp = $('<div/>').dialog({
	        href: contextPath+"/sale/activitySelect/view",
	        width: 940,
	        height: 620,
	        title: '选择活动',
	        closable: true,
	        resizable: true,
	        onClose: function () {
	            $(dalogTemp).panel('destroy');
	        },
	        modal: true,
	        onLoad: function () {
	        	initActivityGrid(param);
	        	initactivityCallBack(callBackHandel);
	        }
	    })
	    
	    function callBackHandel(data){
	        callback(data);
	        $(dalogTemp).panel('destroy');
	    }
}

/*
 * 三个按钮的提示框 是 1  否 0  取消 2
 * param {title:'',content:''}
*/

function publicConfirmDialog(callback,param){
	var dalogTemp = $('<div/>').dialog({
        href: contextPath+"/goods/goodsSelect/goPublicComfirmDialog",
        width: 'undefined'==typeof(param.width)?'':param.width,
        height: 'undefined'==typeof(param.height)?'':param.height,
        title: 'undefined'==typeof(param.title)?'提示':param.title,
        top:335,
        left:625,
        closable: true,
        resizable: false,
        onClose: function () {
            $(dalogTemp).panel('destroy');
        },
        modal: true,
        onLoad: function () {
        	initConfirmDialog(param);
        	initConfirmDialogCallBack(callBackHandel);
        }
    })
    
    function callBackHandel(data){
        callback(data);
        $(dalogTemp).panel('destroy');
    }
}

//盘点批号选择
var StockDialog = null;
function publicStocktakingDialog(param,callback){
		if(null != StockDialog) return;
		
		StockDialog = $('<div/>').dialog({
        href: contextPath+"/stocktaking/operate/publicStocktaking",
        title: '盘点批号选择',
        top:top,
        left:left,
        width:750,
        height:650,
        closable: true,
        resizable: false,
        onClose: function () {
            $(StockDialog).panel('destroy');
            StockDialog = null;
        },
        modal: true,
        onLoad: function () {
        	initStocktaking(param);
        	initStockCallBack(callBackHandel);
        }
    })
    
    function callBackHandel(data){
        callback(data);
        $(StockDialog).panel('destroy');
        StockDialog = null;
    }
}

/**
 * 判断页面表单数据是否发生变化
 */
function checkUtil(){
	var formId;//表单id
	var oldData = {}; //旧数据
	var newData = {}; //新数据
	
	this.setFormId = function(arg){
		formId = arg;
	}
	
	this.getFormId = function(){
		return formId;
	}
	
	this.getOldData = function(){
		return oldData;
	}
	this.setOldData = function(obj){
		oldData = obj;
	}
	
	this.getNewData = function(){
		return newData;
	}
	this.setNewData = function(obj){
		newData = obj;
	}
	
	this.initOldData = function(){
		oldData = this.serizeFromData(oldData);
	}
	
	this.initNewData = function(){
		newData = this.serizeFromData(newData);
	}
	
	this.assignInput = function(){
		var temObj={};
		$('#'+formId+' input[data-check="true"]').each(function(index,obj){
			temObj[""+$(obj).attr('name')+""]=$(obj).val();
		});
		return temObj;
	}
	
	//自定义序列化表单对象
	this.serizeFromData = function(source){
		var _serizeObj = $("#"+formId).serializeArray();
		if(_serizeObj && _serizeObj.length > 0){
			//表单值
			_serizeObj.forEach(function(obj,inx){
				source[""+obj.name+""] = obj.value||"";
			});
			
			return source;
		}
	}
	
	//是否发送变化
	this.ifChange = function(){
		if(!gFunComparisonArray(oldData,newData)){
			return false;
		}
		return true;
	}
		
}

//错误的弹框 只有关闭
function publicErrorDialog(param){
	var dialogTemp = $('<div/>').dialog({
        href: contextPath+"/component/dialog/error",
		width : 'undefined' == typeof (param.width) ? '' : param.width,
		height : 'undefined' == typeof (param.height) ? '' : param.height,
		title : 'undefined' == typeof (param.title) ? '提示' : param.title,
        top:335,
        left:625,
        closable: true,
        resizable: false,
        buttons:[{
            text:'关闭',
            handler:function(){
                $(dialogTemp).panel('destroy');
            },
        }],
        onClose: function () {
            $(dialogTemp).panel('destroy');
        },
        modal: true,
        onLoad: function () {
        	initErrorDialog(dialogTemp,param);
        }
    });
}

/*----------------jxc component js start  ---------------------------*/

/*-----------------------机构选择 start-------------------------------*/

/**
 * 	var _branchParam = {
		//数据格式化	
		textFomatter:function(data){
			return "["+data.branchCode+"]"+data.branchName;
		},
		//ajax扩展参数
		param:{
			type:'NOTREE',//没有树  默认左侧有树
			selectType:1,//选择模式默认单选    1-->多选
			branchTypesStr:$_jxc.branchTypeEnum.HEAD_QUARTERS+','+$_jxc.branchTypeEnum.BRANCH_COMPANY
		},
		//依赖条件 relyOnId 为空
		relyOnId:'supplierId',
		//依赖条件 异常提示
		relyError:'请选择供应商',
		//选择数据成功回调
		onLoadSuccess:function(data){
			
		},
		//return false 结束逻辑
		onShowBefore:function(obj){
//			console.log('------------进入重写的 onShowBefore -----------',obj);
			return true;
		},
		//失去焦点
		onblur:function(ev){
			
		},
		//keyup事件
		onkeyup:function(ev){
			
		}
	}
 */
/**
 * bwp 07/06/09  机构选择组件
 * @namespace 编辑表单时选择处理情况hidden表单的值 
 * @param obj 表单对象
 * demo:
 * <br/> $('#branchComponent').branchSelect();
 */
$.fn.branchSelect = function(param){
	//元素绑定失败
	if($(this).length == 0){
		console.error('机构选择组件绑定失败');
		return;
	}
	if(typeof param == 'undefined')param = {};
	//默认参数对象
	var _default = {
		/**
		 * 格式化数据 显示数据
		 */
		textFomatter:function(data){
			return "["+data.branchCode+"]"+data.branchName;
		},
		/**
		 * 获取组件信息
		 */
		getComponentDetail:function(nameOrCode){
			var param = $.extend({},this.param);
			if(nameOrCode){
				param.nameOrCode = nameOrCode;
			}
			publicBranchesService(param,this.onLoadSuccess,this.dom);
		}	
	}
	_default = $.extend({},$_jxc.autoCompleteComponent(),_default,param);
	_default.setDom(this);
	_default.initDomEvent();
	$.data(this,'component',_default);
}

/**
 * bwp 07/06/08 
 * 机构选择公用方法 回车或失去焦点后，查询机构
 * <br/>1 精确匹配时 自动补全 【xxxx】+机构名称
 * <br/>2 匹配到多条 弹窗选择  
 * <br/>3 空匹配时  清除输入
 * @param param  参数对象
 * @param callback 回调
 * <br/>demo:
 * <br/>参照：advanceList.jsp advanceList.js
 */
function publicBranchesService(param,callback,cbDom){
	cbDom = cbDom || window;
	//默认参数
	var _defParam = {
		type:null,    //没有树  默认左侧有树   'NOTREE' -->左侧没有树
		view:null, //不指定 走默认公用机构组件  'group'走的是带 机构分组的公用组件
		selectType:null //数据选择模式类型  null/''/0-->单选(默认)   1多选
 	} 
	
	param =  $.extend(_defParam,param);
	
	if(param.nameOrCode){
		
		var _ajaxParam = $.extend({},param);
		
		_ajaxParam.page = 1;
		_ajaxParam.rows = 10;
		
		var _nameOrCode = _ajaxParam.nameOrCode
		//避免用户直接输入完整格式: [编号]名称
		var reg = /\[\d{5}\]/;
		if(reg.test(_nameOrCode)){
			//取出[]里的编号，默认取已第一个[]里的值
			reg = /\[(\d{5})\]/;
			arr = reg.exec(_nameOrCode);
			_ajaxParam.nameOrCode = arr[1];
		}
		
		//业务参数 不传后台
		delete _ajaxParam.type;
		delete _ajaxParam.selectType;
		
		var _url = contextPath+'/common/branches/getComponentList';
		//机构分组
		if(param.view && param.view == 'group'){
			_url = contextPath+'/branch/branchGroupSelect/queryList';
		}
		
		$_jxc.ajax({
			url:_url,
			data:_ajaxParam
		},function(data){
			if(data&&data.list){
				//精确匹配到只有一条数据时立即返回
				if(data.list.length==1){
					//多选 返回数组 07/06
					if(param.selectType == 1){
						callback.call(cbDom,data.list);
					}else{
						//单选返回对象
						callback.call(cbDom,data.list[0]);
					}
				}else if(data.list.length>1){
					//匹配到多条时 弹窗选择
					publicBranchesServiceHandel(param,callback,cbDom);
				}else{
					//没有匹配数据时 返回字符串方便判断
					callback.call(cbDom,'NO');
				}
			}else{
				//没有匹配数据时 返回字符串方便判断
				callback.call(cbDom,'NO');
			}
		})
	}else{
		publicBranchesServiceHandel(param,callback,cbDom);
	}
}

/**
 * 2.7 bwp
 * 获取分组机构 详细
 * @param arg
 * @param cb
 */
function publicGetBranchGroupDetail(arg,cb){
	$_jxc.ajax({
		url:contextPath+'/branch/branchGroup/queryGrouBranchs',
		data:arg
	},function(result){
		cb.call(window,result);
	})
}

function publicBranchesServiceHandel(param,callback,cbDom){

	var _href = contextPath + "/common/branches/viewComponent?formType="+ (param.formType||'') + "&branchId=" +(param.branchId||'')+ "&branchType="+(param.branchType||'') + "&isOpenStock="+(param.isOpenStock||'')+ "&scope="+(param.scope||'');
	//机构分组
	if(param.view && param.view == 'group'){
		_href = contextPath+'/branch/branchGroupSelect/view';
	}

	//公有属性
	var dialogObj = {
		href:_href,
        width:680,
        height:$(window).height()*(2/3),
        title:"机构选择",
        closable:true,
        resizable:true,
        onClose:function(){
        	callback.call(cbDom,'NO');
            $(dalogTemp).panel('destroy');
            dalogTemp = null;
        },
        modal:true,
        onLoad:function(){
            var pubBranch = null;
            if(param.view && param.view == 'group'){
                pubBranch = new publicBranchGroupClass();
            }else{
                 pubBranch = new publicAgencyClass();
            }
            pubBranch.initAgencyView(param);
            pubBranch.initAgencyCallBack(callBackHandel)
        }
	}
	
	//多选
	if(param.selectType == 1){
		dialogObj["buttons"] = [{
            text:'确定',
            handler:function(){
                var pubBranch = null;
                if(param.view && param.view == 'group'){
                    pubBranch = new publicBranchGroupClass();
                }else{
                    pubBranch = new publicAgencyClass();
                }
                pubBranch.publicBranchGetChecks(callBackHandel);
            }
        },{
            text:'取消',
            handler:function(){
                $(dalogTemp).panel('destroy');
            }
        }];
	}
	
	
    var  dalogTemp = $('<div/>').dialog(dialogObj);
    function callBackHandel(data){
        callback.call(cbDom,data);
        $(dalogTemp).panel('destroy');
        dalogTemp = null;
    } 
}

/*-----------------------机构选择 end-------------------------------*/

/*-----------------------供应商选择 start-------------------------------*/

/**
 * 	var _supplierParam = {
		//数据格式化	
		textFomatter:function(data){
			return "["+data.supplierCode+"]"+data.supplierName;
		},
		//ajax扩展参数
		param:{
			
		},
		//依赖条件 relyOnId 为空
		relyOnId:'"branchId"',
		//依赖条件 异常提示
		relyError:'请选择机构',
		//选择数据成功回调
		onLoadSuccess:function(data){
			
		},
		//return false 结束逻辑
		onShowBefore:function(obj){
//			console.log('------------进入重写的 onShowBefore -----------',obj);
			return true;
		},
		//失去焦点
		onblur:function(ev){
			
		},
		//keyup事件
		onkeyup:function(ev){
			
		}
	}
 */
/**
 * bwp 07/06/09  供应商选择组件
 * @namespace 
 * @param obj 表单对象
 * demo:
 * <br/> $('#supplierComponent').supplierSelect();
 */
$.fn.supplierSelect = function(param){
	//元素绑定失败
	if($(this).length == 0){
		console.error('供应商选择组件绑定失败');
		return;
	}
	var _this = this;
	if(typeof param == 'undefined')param = {};
	
	//默认参数对象
	var _default = {
		/**
		 * 格式化数据 显示数据
		 */
		textFomatter:function(data){
			return "["+data.supplierCode+"]"+data.supplierName;
		},
		
		/**
		 * 获取组件信息
		 */
		getComponentDetail:function(nameOrCode){
			var param = $.extend({},this.param);
			if(nameOrCode){
				param.supplierNameOrsupplierCode = nameOrCode;
			}
			publicSuppliersService(param,this.onLoadSuccess,this.dom)
		}	
	}
	
	_default = $.extend({},$_jxc.autoCompleteComponent(),_default,param);
	_default.setDom(this);
	_default.initDomEvent();
	$.data(this,'component',_default);
}

/**
 * bwp 07/06/08 
 * 供应商选择公用方法 回车或失去焦点后，查询供应商
 * <br/>1 精确匹配时 自动补全 【xxxx】+供应商名称
 * <br/>2 匹配到多条 弹窗选择  
 * <br/>3 空匹配时  清除输入
 * @param param  参数对象
 * @param callback 回调
 * <br/>demo:
 * <br/>参照：advanceList.jsp advanceList.js
 */
function publicSuppliersService(param,callback,cbDom){
	cbDom = cbDom || window;
	//默认参数
	var _defParam = {
		supplierNameOrsupplierCode:'',
        branchId:'',
        saleWayNot:'',
        isDirect:'',
        isAllowPurchase:''
 	}
	
	param =  $.extend(_defParam,param);
	
	if(param.supplierNameOrsupplierCode){
		param.page = 1;
		param.rows = 10;
		var _nameOrCode = param.supplierNameOrsupplierCode
		//避免用户直接输入完整格式: [编号]名称
		var reg = /\[\d{6}\]/;
		if(reg.test(_nameOrCode)){
			//取出[]里的编号，默认取已第一个[]里的值
			reg = /\[(\d{6})\]/;
			arr = reg.exec(_nameOrCode);
			param.supplierNameOrsupplierCode = arr[1];
		}
		$_jxc.ajax({
			url:contextPath+'/common/supplier/getComponentList',
			data:param
		},function(data){
			if(data&&data.list){
				//精确匹配到只有一条数据时立即返回
				if(data.list.length==1){
					callback.call(cbDom,data.list[0]);
				}else if(data.list.length>1){
					//匹配到多条时 弹窗选择
					publicSuppliersServiceHandel(param,callback,cbDom);
				}else{
					//没有匹配数据时 返回字符串方便判断
					callback.call(cbDom,'NO');
				}
			}else{
				//没有匹配数据时 返回字符串方便判断
				callback.call(cbDom,'NO');
			}
		})
	}else{
		publicSuppliersServiceHandel(param,callback,cbDom);
	}
}

function publicSuppliersServiceHandel(param,callback,cbDom){
	//公有属性
    var supplierDalog = $('<div/>').dialog({
    	 href: contextPath + "/common/supplier/views?saleWayNot="+param.saleWayNot+"&isDirect="+param.isDirect,
         width: 600,
         height: dialogHeight,
         title: "选择供应商",
         closable: true,
         resizable: true,
         onClose: function(){
        	 callback.call(cbDom,'NO');
             $(this).dialog('destroy');
             supplierDalog = null;
         },
         modal: true,
         onLoad: function () {
             initSupplierView(param);
             initSupplierCallBack(callBackHandel)
         },
    });
    function callBackHandel(data){
        callback.call(cbDom,data);
        $(supplierDalog).panel('destroy');
        supplierDalog = null;
    }
}

/*-----------------------供应商选择 end-------------------------------*/

/*-----------------------操作人选择 start-------------------------------*/

/**
 * 	var _operatorParam = {
		//数据格式化	
		textFomatter:function(data){
			return "["+data.userCode+"]"+data.userName;
		},
		//ajax扩展参数
		param:{
			selectType:1,//选择模式默认单选    1-->多选
		},
		loadFilter:function(data){
			data.createUserId = data.id;
			return data;
			data.forEach(function(obj,inx){
				obj.createUserId = obj.id;
			});
			return data;
		}
		//依赖条件 relyOnId 为空
		relyOnId:'"branchId"',
		//依赖条件 异常提示
		relyError:'请选择机构',
		//选择数据成功回调
		onLoadSuccess:function(data){
			
		},
		//return false 结束逻辑
		onShowBefore:function(obj){
//			console.log('------------进入重写的 onShowBefore -----------',obj);
			return true;
		},
		//失去焦点
		onblur:function(ev){
			
		},
		//keyup事件
		onkeyup:function(ev){
			
		}
	}
 */
/**
 * bwp 07/06/09  操作人选择组件
 * @namespace 
 * @param obj 表单对象
 * demo:
 * <br/> 
 * $('#operatorComponent').operatorSelect({
		loadFilter:function(data){
			data.createUserId = data.id;
			return data;
		}
	});
 */

$.fn.operatorSelect = function(param){
	//元素绑定失败
	if($(this).length == 0){
		console.error('供应商选择组件绑定失败');
		return;
	}
	var _this = this;
	if(typeof param == 'undefined')param = {};
	
	//默认参数对象
	var _default = {
		/**
		 * 格式化数据 显示数据
		 */
		textFomatter:function(data){
			return "["+data.userCode+"]"+data.userName;
		},
		/**
		 * 获取组件信息
		 */
		getComponentDetail:function(nameOrCode){
			var param = $.extend({},this.param);
			if(nameOrCode){
				param.nameOrCode = nameOrCode;
			}
			publicOperatorsService(param,this.onLoadSuccess,this.dom)
		}
			
	}
	
	_default = $.extend({},$_jxc.autoCompleteComponent(),_default,param);
	_default.setDom(this);
	_default.initDomEvent();
	$.data(this,'component',_default);
	
}
/**
 * bwp 07/06/08 
 * 操作人选择公用方法 回车或失去焦点后，查询供应商
 * <br/>1 精确匹配时 自动补全 【xxxx】+供应商名称
 * <br/>2 匹配到多条 弹窗选择  
 * <br/>3 空匹配时  清除输入
 * @param param  参数对象
 * @param callback 回调
 * <br/>demo:
 * <br/>参照：advanceList.jsp advanceList.js
 */
function publicOperatorsService(param,callback,cbDom){
	cbDom = cbDom || window;
	//默认参数
	var _defParam = {
		selectType:0,           //0 单选弹框底部没有【确认】【取消】按钮   1反之
		isOpenStock:null,
		formType:null,
		nameOrCode:null
 	}
	
	param =  $.extend(_defParam,param);
	
	if(param.nameOrCode){
		
		var _ajaxParam = $.extend({},param);
		
		_ajaxParam.page = 1;
		_ajaxParam.rows = 10;
		var _nameOrCode = param.nameOrCode
		//避免用户直接输入完整格式: [xxxxx]名称
		var reg = /\[\S*\]/;
		if(reg.test(_nameOrCode)){
			//取出[]里的编号，默认取已第一个[]里的值
			reg = /\[(\S*)\]/;
			arr = reg.exec(_nameOrCode);
			_ajaxParam.nameOrCode = arr[1];
		}
		//业务参数 不传后台
		delete _ajaxParam.selectType;
		
		$_jxc.ajax({
			url:contextPath+'/system/user/getOperator',
			data:_ajaxParam
		},function(data){
			if(data&&data.list){
				//精确匹配到只有一条数据时立即返回
				if(data.list.length==1){
					callback.call(cbDom,data.list[0]);
				}else if(data.list.length>1){
					//匹配到多条时 弹窗选择
					publicOperatorsServiceHandel(param,callback,cbDom);
				}else{
					//没有匹配数据时 返回字符串方便判断
					callback.call(cbDom,'NO');
				}
			}else{
				//没有匹配数据时 返回字符串方便判断
				callback.call(cbDom,'NO');
			}
		})
	}else{
		publicOperatorsServiceHandel(param,callback,cbDom);
	}
	
}

function publicOperatorsServiceHandel(param,callback,cbDom){

    var dialogDiv = {
        href: contextPath + "/common/personDialog",
        width: 680,
        height: dialogHeight,
        title: "选择操作员",
        closable: true,
        resizable: true,
        onClose: function () {
        	callback.call(cbDom,'NO');
            $(operatordialog).panel('destroy');
            operatordialog = null;
        },
        modal: true,
    }

    dialogDiv["onLoad"] = function () {
        initPersonView(param);
        initPersonCallBack(callBackHandel);
    };
    
    if(param.selectType==1){
        dialogDiv["buttons"] = [{
            text:'确定',
            handler:function(){
                publicPersonGetCheck(callBackHandel);
            }
        },{
            text:'取消',
            handler:function(){
                $(operatordialog).panel('destroy');
            }
        }];
    }

    var operatordialog = $('<div/>').dialog(dialogDiv);

    function callBackHandel(data){
        callback.call(cbDom,data);
        $(operatordialog).panel('destroy');
    }
}

/*-----------------------操作人选择 end-------------------------------*/

/*-----------------------类别选择 start-------------------------------*/

$.fn.categorySelect = function(param){
	//元素绑定失败
	if($(this).length == 0){
		console.error('供应商选择组件绑定失败');
		return;
	}
	var _this = this;
	if(typeof param == 'undefined')param = {};
	
	//默认参数对象
	var _default = {
		/**
		 * 格式化数据 显示数据
		 */
		textFomatter:function(data){
			return "["+data.categoryCode+"]"+data.categoryName;
		},
		/**
		 * 获取组件信息
		 */
		getComponentDetail:function(nameOrCode){
			var param = $.extend({},this.param);
			if(nameOrCode){
				param.categoryNameOrCode = nameOrCode;
			}
			publicCategorysService(param,this.onLoadSuccess,this.dom)
		}
			
	}
	
	_default = $.extend({},$_jxc.autoCompleteComponent(),_default,param);
	_default.setDom(this);
	_default.initDomEvent();
	$.data(this,'component',_default);
	
}


function publicCategorysService(param,callback,cbDom){
	cbDom = cbDom || window;
	//默认参数
	var _defParam = {
		categoryType:'',           //0 单选弹框底部没有【确认】【取消】按钮   1反之
		type:0,
 	}
	param =  $.extend(_defParam,param);
	
	if(param.categoryNameOrCode){
		
		var _ajaxParam = $.extend({},param);
		
		_ajaxParam.page = 1;
		_ajaxParam.rows = 10;
		var _categoryNameOrCode = param.categoryNameOrCode
		//避免用户直接输入完整格式: [xxxxx]名称
		var reg = /\[\S*\]/;
		if(reg.test(_categoryNameOrCode)){
			//取出[]里的编号，默认取已第一个[]里的值
			reg = /\[(\S*)\]/;
			arr = reg.exec(_categoryNameOrCode);
			_ajaxParam.categoryNameOrCode = arr[1];
		}
		//组件参数 不传后台
		delete _ajaxParam.type;
		
		$_jxc.ajax({
			url:contextPath+'/common/category/getComponentList',
			data:_ajaxParam
		},function(data){
			if(data&&data.list){
				//精确匹配到只有一条数据时立即返回
				if(data.list.length==1){
					callback.call(cbDom,data.list[0]);
				}else if(data.list.length>1){
					//匹配到多条时 弹窗选择
					publicCategorysServiceHandel(param,callback,cbDom);
				}else{
					//没有匹配数据时 返回字符串方便判断
					callback.call(cbDom,'NO');
				}
			}else{
				//没有匹配数据时 返回字符串方便判断
				callback.call(cbDom,'NO');
			}
		})
	}else{
		publicCategorysServiceHandel(param,callback,cbDom);
	}
}

function publicCategorysServiceHandel(param,callback,cbDom){
	//公有属性
    var dalogObj = {
		href: contextPath + "/common/category/views",
        width:680,
        height:600,
        title:"选择商品类别",
        closable:true,
        resizable:true,
        onClose:function(){
        	callback.call(cbDom,'NO');
            $(categoryDalog).panel('destroy');
            categoryDalog = null;
        },
        modal:true,
        };
   
    if(param.type==1){
    	 dalogObj["onLoad"] = function () {
        	 initCategoryView(param);
        };
    	dalogObj["buttons"] = [{
            text:'确定',
            handler:function(){
            	publicCategoryGetCheck(callBackHandel);
            }
        },{
            text:'取消',
            handler:function(){
                $(categoryDalog).panel('destroy');
                categoryDalog = null;
            }
        }];
    }else{
        dalogObj["onLoad"] = function () {
        	 initCategoryView(param);
             initCategoryCallBack(callBackHandel);
        };
    }
    //公有属性
    categoryDalog = $('<div/>').dialog(dalogObj);
    function callBackHandel(data){
    	  callback.call(cbDom,data);
          $(categoryDalog).panel('destroy');
          categoryDalog = null;
    }
}

/*-----------------------类别选择 end-------------------------------*/


/*--------------------------上传图片--------------------------------*/
    /*
    * param  {
    *   url
    *
    * }
    *
    * */
 function publicUploadImgService(param,callback) {
   var uploadImgTemp = $('<div id="uploadImg"/>').dialog({
        href: contextPath + "/common/uploadImg",
        width:380,
        height:200,
        title:"图片上传",
        closable:true,
        resizable:true,
        onClose: function(){
            $(this).dialog('destroy');
            uploadImgTemp = null;
        },
        modal: true,
        onLoad: function () {
            initUploadImgParam(param);
            initUploadImgCallBack(callBackHandel)
        },
    });

     function callBackHandel(data){
         callback(data);
         $(uploadImgTemp).panel('destroy');
         uploadImgTemp = null;
     }
 }
/*----------------------------------------------------------------------*/
/*----------------jxc component js end  ---------------------------*/

/*------------------------------赠品--------------------------------------*/
function publicGiftGoodsService(param,callback) {
    var giftGoodsTemp = $('<div id="giftGoods"/>').dialog({
        href: contextPath + "/common/giftGoods",
        width:730,
        height:500,
        title:"赠品信息",
        closable:true,
        resizable:true,
        onClose: function(){
            $(this).dialog('destroy');
            giftGoodsTemp = null;
        },
        modal: true,
        onLoad: function () {
            initGiftGoods(param);
        },
    });
}

/*--------------------------------------------------------------------*/

/*------------------------------设置--------------------------------------*/
/**
 * 打开gpe设置
 */
function publicGpeSetting(data) {
	var settingDiv = {
		href : contextPath + "/component/dialog/gpeSettingDialog",
		width : 600,
		height : 600,
		title : "列设置",
		closable : true,
		resizable : true,
		onClose : function() {
			$(this).dialog('destroy');
			columnSetting = null;
		},
		modal : true,
		onLoad : function() {
			// 参数
			var params = {};
			if(data.tabKey){
				params.tabKey = data.tabKey;
			}
			var gpeSettingClass = new GpeSettingClass();
			gpeSettingClass.initGpeParams(params);
			gpeSettingClass.initGpeDataGrid();
			gpeSettingClass.initGpeDataGridCallback(callback);
		},
	}

	settingDiv["buttons"] = [ {
		text : '保存',
		height: 45,
		handler : function() {
			gpeUserSettingGridSave();
		}
	}, {
		text : '重置',
		height: 45,
		handler : function() {
			gpeUserSettingGridRestore();
		}
	}, {
		text : '取消',
		height: 45,
		handler : function() {
			$(columnSetting).panel('destroy');
			columnSetting = null;
		}
	}, {
		text : '>',
		width : 35,
		height: 45,
		handler : function() {
			if($(this).text()=='>'){
				gpeUserSettingGridExpand();
				$(columnSetting).window('resize',{width:'800px'});
				$(this).html('<span class="l-btn-left" style="margin-top: 0px;"><span class="l-btn-text">&lt;</span></span>');
			}else{
				gepUserSettingGridCollapse();
				$(columnSetting).window('resize',{width:'600px'});
				$(this).html('<span class="l-btn-left" style="margin-top: 0px;"><span class="l-btn-text">&gt;</span></span>');
			}
		}
	} ];

	var columnSetting = $('<div id="columnSetting"/>').dialog(settingDiv);

	function callback(columns,frozenColumns) {
		data.onSettingChange(columns,frozenColumns);
	}
}

/**
 * 获取 grid columns array
 * @param data
 */
function publicGpeGridColumns(data) {
	// 该功能上一级路径
	var path = window.location.pathname;
	path = path.substring(0, path.lastIndexOf('/'));
	
	// 请求路径
	var url = path + '/gpegridcolumns?timestamp=' + new Date().getTime();
	
	// 参数
	var params = {};
	if(data.tabKey){
		params.tabKey = data.tabKey;
	}
	
	// 请求columns
	$_jxc.ajax({
		url : url,
		data: params,
		dataType : 'text'
	}, function(result) {
		// array[0]:正常的列，array[1]:冻结的列
		var array = eval(result);
		data.onLoadSuccess(array[0],array[1]);
	});
}

/**
 * GPE 导出
 * @param data
 */
function publicGpeExport(data){
	// 该功能上一级路径
	var path = window.location.pathname;
	path = path.substring(0, path.lastIndexOf('/'));
	// 导出请求路径
	var url = path + '/export?timestamp=' + new Date().getTime();
	data.url = url;

	// 数据条数
	var total = $("#" + data.datagridId).datagrid('getData').total;
	if (total == 0) {
		$_jxc.alert("无数据可导");
		return;
	}
	
	if(!data.onBeforeExport || data.onBeforeExport()){
		var gpeExportDiv = {
			href : contextPath + "/component/dialog/gpeExportDialog",
			width : 500,
			height : 350,
			title : "导出选项-当前搜索共" + total + "条结果",
			closable : true,
			resizable : true,
			onClose : function() {
				$(this).dialog('destroy');
			},
			modal : true,
			onLoad : function() {
				var gpeExportClass = new GpeExportClass();
				gpeExportClass.initGpeParams(data);
			},
		};
		
		// 按钮
		gpeExportDiv["buttons"] = [ {
			text : '导出',
			height: 45,
			handler : function() {
				var gpeExportClass = new GpeExportClass();
				gpeExportClass.toGpeExportOk();
			}
		},{
			text : '取消',
			height: 45,
			handler : function() {
				$(gpeExportDialog).panel('destroy');
				gpeExportDialog = null;
			}
		}];
		var gpeExportDialog = $('<div id="gpeExportDialog"/>').dialog(gpeExportDiv);
	}
}

/*--------------------------------------------------------------------*/

/*--------------------------导出--------------------------------*/
/*
 * param  {
 *   datagridId:""
 *
 * }
 *
 * */
function publicExprotService(param,callback) {
    var length = $('#'+param.datagridId).datagrid('getData').rows.length;
    if(length == 0){
        $_jxc.alert("无数据可导");
        return;
    }

    var exportChoseTemp = $('<div id="exportChose"/>').dialog({
        href: contextPath + "/common/exportChose",
        width:400,
        height:350,
        title:"导出选项",
        closable:true,
        resizable:true,
        onClose: function(){
            $(this).dialog('destroy');
            exportChoseTemp = null;
        },
        modal: true,
        onLoad: function () {
            initExportChoseParam(param);
            initExportChoseCallBack(callBackHandel)
        },
    });

    function callBackHandel(data){
        callback(data);
        $(exportChoseTemp).panel('destroy');
        exportChoseTemp = null;
    }
}
/*----------------------------------------------------------------------*/

/*--------------------------导出--------------------------------*/
/*
 * param  {
 *   datagridId:""
 *
 * }
 *
 * */
function publicMessageService(param,callback) {

    var msgObj = {
            href: contextPath + "/common/messageDialog",
            width:400,
            height:300,
            title: "提示",
            closable:true,
            resizable:true,
            onClose: function(){
                $(this).dialog('destroy');
                messageDialog = null;
            },
            modal: true,
            onLoad: function () {
                initMessageParam(param);
//                initMessageCallBack(messageCallBack)
            },
        }
    
	msgObj["buttons"] = [{
        text:'确定',
        handler:function(){
        	messageCallBack(1);
        }
    },{
        text:'取消',
        handler:function(){
        	messageCallBack(0);
            $(messageDialog).panel('destroy');
            messageDialog = null;
        }
    }];
    
    var messageDialog = $('<div id="messageDialog"/>').dialog(msgObj);

    function messageCallBack(data){
        callback(data);
        $(messageDialog).panel('destroy');
        messageDialog = null;
    }
}
/*----------------------------------------------------------------------*/


//参数：id  控件id   dataItems 选项列表
function initCombobox(id,dataItems,defValue){  
	var value = "";  
	//加载下拉框复选框  
	$('#'+id).combobox({  
		//url:'${base}/ht/getComboboxData.action?dictionaryCode='+code, //后台获取下拉框数据的url
		//method:'post',  
		data:dataItems,
		value:defValue,
		panelHeight:200,//设置为固定高度，combobox出现竖直滚动条  
		valueField:'code',  
		textField:'name',  
		multiple:true,  
		formatter: function (row) { //formatter方法就是实现了在每个下拉选项前面增加checkbox框的方法  
			var opts = $(this).combobox('options');  
			return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]  
		},  
		onLoadSuccess: function () {  //下拉框数据加载成功调用  
			var opts = $(this).combobox('options');  
			var target = this;  
			var values = $(target).combobox('getValues');//获取选中的值的values  
			$.map(values, function (value) {  
				var el = opts.finder.getEl(target, value);  
				el.find('input.combobox-checkbox')._propAttr('checked', true);   
			})  
		},  
		onSelect: function (row) { //选中一个选项时调用  
			var opts = $(this).combobox('options');
            var target = this;

                var el = opts.finder.getEl(target, row[opts.valueField]);
                el.find('input.combobox-checkbox')._propAttr('checked', true);

            //获取选中的值的values
            $("#"+id).val($(this).combobox('getValues'));
        },
		onUnselect: function (row) {//不选中一个选项时调用  
			var opts = $(this).combobox('options');
            var target = this;

                var el = opts.finder.getEl(target, row[opts.valueField]);
                el.find('input.combobox-checkbox')._propAttr('checked', false);
                el.removeClass("combobox-item-selected");


            //获取选中的值的values
            var comVal = $(this).combobox('getValues');
            $("#"+id).val(comVal);
        }
	});  
}  
/*----------------jxc component js end  ---------------------------*/
function initCombotree(id,dataItems,defValue){
    $('#'+id).combotree({
        cascadeCheck: true,
        // onlyLeafCheck: true,
        checkbox: true,
        data: dataItems,
        width: 200,
        height: 32,
        panelHeight: 300,
        multiple: true,
        onChange :function(){
            $val =  $("#"+id).combotree('getValues');
        },
        onLoadSuccess:function(node,data){
            $("#"+id).combotree('setValue',defValue);

        }
    })
}
