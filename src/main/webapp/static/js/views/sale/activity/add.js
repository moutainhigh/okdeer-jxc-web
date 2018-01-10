var datagridId = "saleMangeadd";
var gridDefault = {
    oldSaleRate:"0.00%",
    newSaleRate:"0.00%"
}

/**
 *
 <option value="1">特价</option>
 <option value="2">折扣</option>
 <option value="3">偶数特价</option>
 <option value="11">N元N件</option>
 <option value="12">特价打包</option>
 <!-- <option value="4">换购</option>  -->
 <option value="5">满减</option>
 <option value="6">组合特价</option>
 <option value="10">买满送</option>
 *
 * */

$(function(){
	// 开始和结束时间
    $("#dailyStartTime").val("00:00:00");
    $("#dailyEndTime").val("23:59:59");
    //如果是门店，则只能查看当前店铺数据
	if(sessionBranchType >= 3){
		$("#branchName").val(sessionBranchCodeName);
	    $("#branchIds").val(sessionBranchId);
		$("#selectBranchMore").hide();
		$("#branchName").prop('disabled','disabled');
		$("#branchName").unbind("click");
	}

    // selectOptionSpecial();

    changeType(gVarLastActivityType);
	//一周星期获取和初始化
	  weekCheckDay();
	$(document).on('click','#weekday .ubcheckweek',function(){
	//点击取消切换方法执行
	  weekCheckDay();
	})
	
	//机构选择初始化 分组
	initBranchGroup();
});



function initBranchGroup(){
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
}

//回车处理逻辑  bug20207 2.6.5
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

// select 选择切换
var gVarLastActivityType = "1";
var gVarAutoSelect = false;
function onChangeSelect(){
    if(gVarAutoSelect){
	    gVarAutoSelect = false;
	    return;
    }
    var priceVal=$("#activityType").combobox('getValue');

	$("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
	var rows = [];
	var setrows = [];
	//1特价 3偶数特价 4换购  6 组合特价
	if(gVarLastActivityType == '1' || gVarLastActivityType == '3' || gVarLastActivityType == '4'
		|| gVarLastActivityType == '6' || gVarLastActivityType == '11' || gVarLastActivityType == '12' ){
		rows = gridHandel.getRowsWhere({skuName:'1'});
	}
	//折扣
	if(gVarLastActivityType == '2'){
		var _thisV	= $("#activityScopedis").val();
		//全场折扣
		if(_thisV == '2'){
			rows= gridHandel.getRows();
			if(parseFloat(rows[0].discount) == 0) rows = [];
		}
		//类别折扣
		if(_thisV == '1'){
			rows= gridHandel.getRowsWhere({categoryName:'1'});
		}
		//单品折扣
		if(_thisV == '0'){
			rows= gridHandel.getRowsWhere({skuName:'1'});
		}
	}
	//满减
	if(gVarLastActivityType == '5'){
		var _tempScomj = $("#activityScopemj").val();
		$("#salesetmj").datagrid("endEdit", gridHandelMj.getSelectRowIndex());
		setrows=$('#salesetmj').datagrid('getRows');
		//全场满减
		if(_tempScomj == '2'){
			setrows = [];
			rows= $("#saleMangeadd").datagrid('getRows');
			if(rows.length == 1 && !rows[0].discountPrice && !rows[0].limitAmount)rows = [];
		}
		//类别满减
		if(_tempScomj == '1'){
			rows = gridHandel.getRowsWhere({categoryName:'1'});;
			if(setrows.length == 1 && !setrows[0].discountPrice && !setrows[0].limitAmount)setrows = [];
		}
		//商品满减
		if(_tempScomj == '0'){
			rows = gridHandel.getRowsWhere({skuName:'1'});
			if(setrows.length == 1 && !setrows[0].discountPrice && !setrows[0].limitAmount)setrows = [];
		}
	}
	//买满送
	if(gVarLastActivityType == '10'){
		gridHandelT.endEditRow();
		var curV = $("#activityScopemms").val();
		//买满条件grid
		var rowstj = [];
		//赠品grid
		var rowsgif = [];
		//类别商品grid
		var rowsother = [];
		rowstj = gridHandelT.getRows();
		rowsgif = gridHandel.getRowsWhere({skuName:'1'});
		if(rowstj.length ==1 && rowstj[0].limitAmount == 0 && rowstj[0].limitCount == 0)rowstj = [];
		//类别满送 
		if(curV== '1'){
			gridHandelB.endEditRow();
			rowsother = gridHandelB.getRowsWhere({categoryName:'1'});
		}
		//商品满送
		if(curV== '0'){
			gridHandelG.endEditRow();
			rowsother = gridHandelG.getRowsWhere({skuName:'1'});
		}
		if(rowstj.length == 0 && rowsgif.length == 0 && rowsother.length == 0){
			rows= [];
		}else{
			rows= [{}];
		}
	}

	if(rows.length==0 && setrows.length ==0){
		changeType(priceVal);
	}else{
		$_jxc.confirm("更换活动类型将清空当前列表信息，是否更换？",function(b){
			if(b) {
                changeType(priceVal);
			}else{
                gVarAutoSelect = true;
                $("#activityType").combobox('select',gVarLastActivityType);
			}

		});
	}
}
var gridHandel = new GridClass();
var changeType = function(priceVal){
    // gridHandel = new GridClass();
    gVarLastActivityType = priceVal;
    switch(priceVal)
    {
        case "1":
        	//特价
            selectOptionSpecial();
            break;
        case "2":
        	//折扣
            selectOptionzk();
            break;
        case "3":
        	//偶数特价
            selectOptionOdd();
            break;
        case "4":
        	//换购
            optionHide();
            $("#consaleadd").removeClass("unhide");
            initDatagridRedemption();
            disableGoods('','GoodsType');
            break;
        case "5":
        	//满减
            selectOptionMj();
            break;
        case "6":
            //组合特价
          	selectOptionGroupSpecial();
            break;
        case "10":
        	//买满送
            selectOptionmms();
            break;
        case "11":
            //N元N件
            selectOptionN2N();
            break;
        case "12":
            //特价打包
            selectOptionSpecialPackage();
            break;
    }

};

var cheFlag = false;
//选择买满金额 买满数量
function onChangemmsSelect(newV,oldV){
	var _this = $(this);
	if(cheFlag){
		cheFlag = false;
		return;
	}
	var curVa = $("#activityScopemms").val();
	gridHandelT.endEditRow();
	gridHandel.endEditRow();
	//买满条件grid
	var rowstj = [];
	//赠品grid
	var rowsgif = [];
	rowstj = gridHandelT.getRows();
	rowsgif = gridHandel.getRowsWhere({skuName:'1'});
	if(rowstj.length ==1 && rowstj[0].limitAmount == 0 && rowstj[0].limitCount == 0)rowstj = [];
	
	if(rowstj.length ==0 && rowsgif.length ==0){
		gridTitleName = newV == '0' ? '买满金额':'买满数量';
		initDatagridmmsTJ();
	}else{
		$_jxc.confirm("更换活动类型将清空当前列表信息，是否更换？",function(b){
			if(b){
				gridTitleName = newV == '0' ? '买满金额':'买满数量';
				initDatagridmmsTJ();
				initDatagridmmsGOOD();
			}else{
				cheFlag = true;
				$(_this).combobox('setValue',oldV);
			}
		})
	}
	
}

// 特价状态选择隐藏
function selectOptionSpecial(){
    // 禁止按钮点击事件
    disableGoods('','GoodsType');
	optionHide();
	$("#consaleadd").removeClass('unhide');
	$('.special').removeClass('unhide');
	$('.importGood').removeClass('unhide');


	initDatagridSpecial();
}
// 折扣状态选择隐藏
function selectOptionzk(){
    optionHide();
    $("#consaleadd").removeClass("unhide");

    initDatagridallZk();
    //disableGoods('','GoodsType');
    disableGoods('SelectGoods','');
    //初始化 全场折扣
    $('#allZk').prop('checked',true);
    $('#activityScopedis').val('2');
    disableGoods('SelectGoods','GoodsType');
    $(".topMoney").removeClass("unhide");
    // $('.discount').removeClass('unhide');
    $('.discountTypechoose').removeClass('unhide');
    $(document).off('mousedown','.discountTypechoose .disradioLabel');
    $(document).on('mousedown','.discountTypechoose .disradioLabel',function(){
        var _this = $(this).find('input[type="radio"]');
        var thisValue = $("#activityScopedis").val();
        $(".discount").removeClass('unhide');
        $(".importGood").addClass('unhide');
        var changeDisType = function(){
            $('#activityScopedis').val(_this.val());
            _this.prop("checked",true);
            if(_this.val()==="1"){
                initDatagridsortZk();
                // 禁止按钮点击事件
                disableGoods('SelectGoods','');
            }else if(_this.val()==="0"){
                initDatagridoneZk();
                $(".importGood").removeClass('unhide');
                // 禁止按钮点击事件
                disableGoods('','GoodsType');
            }else if(_this.val()==="2"){
                //全场折扣
                initDatagridallZk();
                $(".discount").addClass('unhide');
                // 禁止按钮点击事件
                disableGoods('SelectGoods','GoodsType');
            }
        }
        // 保存结束编辑
        $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
        var rows = [];
        //全场折扣
        if(thisValue == '2'){
            rows= gridHandel.getRows();
            if(parseFloat(rows[0].discount) == 0) rows = [];
        }
        //类别折扣
        if(thisValue == '1'){
            rows= gridHandel.getRowsWhere({categoryName:'1'});
        }
        //单品折扣
        if(thisValue == '0'){
            rows= gridHandel.getRowsWhere({skuName:'1'});
        }


        if(rows.length==0){
            changeDisType();
        }else{
            $_jxc.confirm("更换活动类型将清空当前列表信息，是否更换？",function(b){
                if(!b){
                    return;
                }else{
                    changeDisType();
                }
            });
        }
    })
}

// 偶数特价状态选择隐藏
function selectOptionOdd(){
    disableGoods('','GoodsType');
    optionHide();
    $("#consaleadd").removeClass('unhide');
    $(".importGood").removeClass('unhide');
    initDatagridOddtj();
    $('.oddprice ').removeClass('unhide');
}

// 满减状态选择隐藏
function selectOptionMj(){
    optionHide();
    //初始化
    $('#consalesetmj').addClass('unhide');
    $("#consaleadd").removeClass('unhide');
    $('.mjTypechoose').removeClass('unhide');
    // 禁止按钮点击事件
    disableGoods('SelectGoods','GoodsType');
    //初始化为 全场满减
    $('#allMj').prop("checked",true);
    $('#activityScopemj').val('2');
    initDatagridallMj();
    initDatagridsortSet();

    $(document).off('mousedown','.mjTypechoose .mjradioLabel')
    $(document).on('mousedown','.mjTypechoose .mjradioLabel',function(){

        var _this = $(this).find('input[type="radio"]');
        var _tempScomjV = $('#activityScopemj').val();
        var changeDisType =  function(){
            $('#activityScopemj').val(_this.val());
            _this.prop("checked",true);
            //全场
            if(_this.val()=="2"){
                $("#consaleadd").addClass('ub-f1');
                $('#consaleadd').removeClass('unhide');
                $('#consalesetmj').addClass('unhide');
                $('#consaleMJadd').addClass('unhide');
                $("#consaleMJadd").removeClass('ub-f1');
//				$('#allMj').prop("checked",true);

                $('#activityScopemj').val('2');
                //禁止按钮点击事件
                disableGoods('SelectGoods','GoodsType');
                initDatagridallMj();
            }
            //类别
            else if(_this.val()=="1"){
                // $("#consaleadd").addClass('ub-f1');
                $('#consaleadd').removeClass('unhide');
                // $("#consalesetmj").addClass('ub-f1');
                $('#consalesetmj').removeClass('unhide');
                $('#consaleMJadd').addClass('unhide');
                $("#consaleMJadd").removeClass('ub-f1');
//				$('#sortMj').prop("checked",true);

                $('#activityScopemj').val('1');
                //禁止按钮点击事件
                disableGoods('SelectGoods','');
                initDatagridsortMj();
                initDatagridsortSet();
            }
            //商品
            else {
                $('#consaleadd').removeClass('ub-f1');
                $('#consaleadd').addClass('unhide');
                $('#consaleMJadd').removeClass('unhide');
                $("#consaleMJadd").addClass('ub-f1');

                $('#consalesetmj').removeClass('unhide');

                $('#activityScopemj').val('0');
                //禁止按钮点击事件
                disableGoods('','GoodsType');
                initDatagridshopMj();
                initDatagridsortSet();
            }

        }

        var rows= [];
        $("#salesetmj").datagrid("endEdit", gridHandelMj.getSelectRowIndex());
        var setrows=$('#salesetmj').datagrid('getRows');

        //全场满减
        if(_tempScomjV == '2'){
            // 保存结束编辑
            $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
            setrows = [];
            rows= $("#saleMangeadd").datagrid('getRows');
            if(rows.length == 1 && !rows[0].discountPrice && !rows[0].limitAmount)rows = [];
        }

        //类别满减
        if(_tempScomjV == '1'){
            // 保存结束编辑
            $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
            rows = gridHandel.getRowsWhere({categoryName:'1'});;
            if(setrows.length == 1 && !setrows[0].discountPrice && !setrows[0].limitAmount)setrows = [];
        }

        //商品满减
        if(_tempScomjV == '0'){
            // 保存结束编辑
            $("#saleMangeMJadd").datagrid("endEdit", gridHandelGoodsMj.getSelectRowIndex());
            rows= gridHandelGoodsMj.getRowsWhere({skuName:'1'});
            if(setrows.length == 1 && !setrows[0].discountPrice && !setrows[0].limitAmount)setrows = [];
        }

        if((rows.length==0) && (setrows.length == 0)){
            changeDisType();
        }else{
            $_jxc.confirm("更换满减类型将清空当前列表信息，是否更换？",function(b){
                if(!b){
                    return;
                }else{
                    changeDisType();
                }
            });
        }

    })
}

//买满送
function selectOptionmms(){
	optionHide();
	disableGoods('','GoodsType');
	$('#consaleadd').addClass('unhide');
	
	$('.mmsTypechoose').removeClass('unhide');
	$('.mmstype').removeClass('unhide');
    $('#dvOnlyVip').addClass('unhide');
	$('#consolemms').addClass('ub-f1');
	$('#consolemms').removeClass('unhide');
	$('#dvmms').removeClass('unhide');
	
	//先移除事件
	$(document).off('mousedown','.mmsTypechoose .mmradioLabel');
	//买满送 --- 全场 类别 商品 选择事件
	$(document).on('mousedown','.mmsTypechoose .mmradioLabel',function(){
		var _this = $(this).find('input[type="radio"]');
		var curVal = $("#activityScopemms").val();
		
		var changeDismsType =  function(){
			//重置 买满送 内部tab标示 
			hasClickTab = false;
			
			$(_this).prop('checked',true);
			
			var mmsstatusV = $(_this).val();
			$("#activityScopemms").val(mmsstatusV);
			//全场满送
			if(_this.val()=="2"){
				choosemmsTab(mmsstatusV);
				if(gridHandelT){
					$('#mmsgradedList').datagrid('resize',{width:'100%',height:'300px'})
				}
				if(gridHandel){
					$('#mmsgoodList').datagrid('resize',{width:'100%',height:'300px'})
				}
				disableGoods('','GoodsType');
				$("#giftip").removeClass('umar-t40').addClass('umar-t20');
			}
			//类别满送
			else if(_this.val()=="1"){
				//1类别
				choosemmsTab(mmsstatusV);
				$("#tabone").text("类别信息");
				disableGoods('SelectGoods','');
				initDatagridmmjComLB();
			}
			//商品送
			else {
				choosemmsTab(mmsstatusV);
				$("#tabone").text("商品信息");
				disableGoods('','GoodsType');
				initDatagridmmjComLG();

			}

		}
		
		gridHandelT.endEditRow();
		gridHandel.endEditRow();
		//买满条件grid
		var rowstj = [];
		//赠品grid
		var rowsgif = [];
		//类别商品grid
		var rowsother = [];
		rowstj = gridHandelT.getRows();
		rowsgif = gridHandel.getRowsWhere({skuName:'1'});
		if(rowstj.length ==1 && rowstj[0].limitAmount == 0 && rowstj[0].limitCount == 0)rowstj = [];
		//类别满送 
		if(curVal== '1'){
			gridHandelB.endEditRow();
			rowsother = gridHandelB.getRowsWhere({categoryName:'1'});
		}
		//商品满送
		if(curVal== '0'){
			gridHandelG.endEditRow();
			rowsother = gridHandelG.getRowsWhere({skuName:'1'});
		}
		if(rowstj.length == 0 && rowsgif.length == 0 && rowsother.length == 0){
			changeDismsType();
		}else{
			$_jxc.confirm("更换活动类型将清空当前列表信息，是否更换？",function(b){
				if(b){
					gridHandelT.setLoadData([$.extend({},mmsTJDefault)]);
					gridHandel.setLoadData([$.extend({},gridDefaultG)]);
					
					hasClickTab = false;
					changeDismsType();
				}
			})
		}
		
	})
	
	//初始化买满送 梯度datagrid
	initDatagridmmsTJ();
	//买满送 礼品列表
	initDatagridmmsGOOD();
	
	if(gridHandelB){
		gridHandelB.setLoadData([$.extend({},gridDefault)])
	}
	if(gridHandelG){
		gridHandelG.setLoadData([$.extend({},gridDefaultG)])
	}
	
}

//组合特价
function selectOptionGroupSpecial(){
    optionHide();
    $("#consaleadd").removeClass("unhide");
    initDatagridCompose();
    disableGoods('','GoodsType');
    $('.limitCount').removeClass('unhide');
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

//N元N件
function selectOptionN2N() {
    optionHide();
    $('#dvn2nCount').removeClass('unhide');
    $('#dvn2nSaleAmount').removeClass('unhide');
    $('.n2nTypechoose').removeClass('unhide');
    $("#consaleadd").removeClass("unhide");
    $(".importGood").addClass('unhide');//不能进行商品选择
    disableGoods('SelectGoods','');
    initDatagridsortN2N();
    $('#sortN2N').prop('checked',true);
    $('#activityScopen2n').val('1');
    $(document).off('mousedown','.n2nTypechoose .n2nradioLabel');
    $(document).on('mousedown','.n2nTypechoose .n2nradioLabel',function () {
        var _this = $(this).find('input[type="radio"]');
        var thisValue = $("#activityScopen2n").val();

        var changeN2NType = function(){
            $('#activityScopen2n').val(_this.val());
            _this.prop("checked",true);
            if(_this.val()==="1"){
                $(".importGood").addClass('unhide');
                initDatagridsortN2N();
                // 禁止按钮点击事件
                disableGoods('SelectGoods','');
            }else if(_this.val()==="0"){
                $(".importGood").removeClass('unhide');
                initDatagridGoodsN2N();
                // 禁止按钮点击事件
                disableGoods('','GoodsType');
            }
        }

        $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
        var rows = [];
        //类别折扣
        if(thisValue == '1'){
            rows= gridHandel.getRowsWhere({categoryName:'1'});
        }
        //单品折扣
        if(thisValue == '0'){
            rows= gridHandel.getRowsWhere({skuName:'1'});
        }


        if(rows.length==0){
            changeN2NType();
        }else{
            $_jxc.confirm("更换活动类型将清空当前列表信息，是否更换？",function(b){
                if(!b){
                    return;
                }else{
                    changeN2NType();
                }
            });
        }

    });

}

//特价打包
function selectOptionSpecialPackage () {
	optionHide();
    $("#consaleadd").removeClass("unhide");
    $(".importGood").removeClass('unhide');
	$('#dvn2nSaleAmount2').removeClass('unhide');
    // 禁止按钮点击事件
    disableGoods('','GoodsType');
    initDatagridGoodsSpecialPackage();
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
		$("#giftip").removeClass('umar-t20').addClass('umar-t40');
		disableGoods('','GoodsType');
		//赠品信息
		$("#area1").addClass("unhide");
		$("#area2").removeClass("unhide");
		var rowst = gridHandelT.getRows();
		var rowsg = gridHandel.getRows();
		gridHandelT.setLoadData(rowst);
		gridHandel.setLoadData(rowsg);
	}
}

var gridHandelB = new GridClass();
//初始化表格-买满送 主设置 -类别
function initDatagridmmjComLB(){
	gridHandelB.setGridName("mmscommonList");
    $("#mmscommonList").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        fit:true, //占满
        showFooter:true,
		height:'50%',
		pageSize:50,
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
					{field:'categoryCode',title:'类别编码',width:'140',align:'left'},
					{field:'categoryName',title:'类别名称',width:'140',align:'left'},
					
        ]],
        onLoadSuccess:function(data){
    	  gridHandelB.setDatagridHeader("center");
        }
    });
    gridHandelB.setLoadData([$.extend({},gridDefault)])
 }

var gridHandelG = new GridClass();

// 初始化表格-买满送 礼品默认数据
var gridDefaultG = {
	limitCount:0,	
	limitAmount:0,
}
//初始化表格-买满送 主设置 -商品
function initDatagridmmjComLG(){
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
      align:'center',
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
      fitColumns:true,    // 每列占满
      fit:true, //占满
		height:'50%',
		pageSize:50,
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
					{field:'skuName',title:'商品名称',width:'100',align:'left'},
					{field:'barCode', title: '条码', width:80, align: 'left'},
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
    	gridHandelG.setDatagridHeader("center");
	  }
  });
	gridHandelG.setLoadData([$.extend({},gridDefaultG)])
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
function initDatagridmmsTJ(){
	gridHandelT.setGridName("mmsgradedList");
	gridHandelT.initKey({
		firstName:gridTitleName == '买满数量' ? 'limitCount':'limitAmount',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
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
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        fit:true, //占满
//        showFooter:true,
		height:'50%',
		pageSize:50,
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
		            }, 
          ]],
       onCheck:function(rowIndex,rowData){
    	    if(rowData && rowData.goodsGiftList && rowData.goodsGiftList.length > 0){
	       		gridHandel.setLoadData(rowData.goodsGiftList);
	     	}else{
	     		gridHandel.setLoadData([$.extend({},gridDefaultG)])
	     	}
       },
       onEndEdit:function(rowIndex, rowData){
    	    var _this = this;
    	    gridHandel.endEditRow();
    	    rowData.goodsGiftList = gridHandel.getRowsWhere({skuName:'1'});
	        
       },
       onBeginEdit:function(rowIndex, rowData){
            if(rowData && rowData.goodsGiftList && rowData.goodsGiftList.length > 0){
            		gridHandel.setLoadData(rowData.goodsGiftList);
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
    	   
    	   $(this).datagrid('resize',{width:'100%',height:'300px'})
    	   gridHandelT.setDatagridHeader("center");
	  }
    });
	gridHandelT.setLoadData([$.extend({},mmsTJDefault)]);
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
					{field:'skuName',title:'商品名称',width:'100',align:'left'},
					{field:'barCode', title: '条码', width:80, align: 'left'},
					{field:'unit', title: '单位', width:70, align: 'left'},
		            {field:'spec', title: '规格', width:70, align: 'left'},
		            {field:'price',title:'零售价',width:'80px',align:'right',
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
    	   $(this).datagrid('resize',{width:'100%',height:'300px'})
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    gridHandel.setLoadData([$.extend({},gridDefaultG)])
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
	var tempPrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'price');
	if(parseFloat(newV||0) > parseFloat(tempPrice||0)){
		$_jxc.alert('新增金额不得大于零售价',function(){
			$(_this).numberbox('setValue',(oldV||0));
		});
	}
}

//买满送 参数保存
var mmsParams={
		actList:[],//活动列表
};

//赠品信息 重置
function resetGiftGoods(){
	var mmsTJObj = $("#mmsgradedList").datagrid('getRows')[gridHandelT.getSelectRowIndex()];
	delete mmsTJObj.goodsGiftList;
	gridHandel.setLoadData([$.extend({},gridDefaultG)]);
}

//状态初始化 隐藏 清空数据 
function optionHide(){
	$("#consaleadd").addClass('ub-f1');
	$('.special').addClass('unhide');
	$('.discount').addClass('unhide');
    $('#dvn2nCount').addClass('unhide');
    $('#dvn2nSaleAmount').addClass('unhide');
	$('.oddprice ').addClass('unhide');
	$('.discountTypechoose').addClass('unhide');
	$('.mjTypechoose').addClass('unhide');
	$('#consalesetmj').addClass('unhide');
	$(".importGood").addClass('unhide');
    $(".topMoney").addClass('unhide');
    //买满送
    $('#consolemms').addClass('unhide');
    $('.mmstype').addClass('unhide');
    $('.mmsTypechoose').addClass('unhide');
    $('.limitCount').addClass('unhide');
    $('#dvOnlyVip').removeClass('unhide');
	$('.n2nTypechoose').addClass('unhide');
    $('#dvmms').addClass('unhide');
    $('#dvn2nSaleAmount2').addClass('unhide');
    //满减
    $('#consaleMJadd').addClass('unhide');
    $("#consaleMJadd").removeClass('ub-f1');

	initmmsDom();	
	
}

//初始化买满送 dom结构
function initmmsDom(){
	//初始化为全场折扣
	$("input[name='mmsstatus']").eq(0).prop('checked',true); 
	//初始化 倍数送 促销商品参与
	$("input[name='mmsofactType']").prop('checked',false);
	//初始化活动条件
	// $("#activitymmsType").combobox('setValue',0)
	
	choosemmsTab(2);
}

// 状态初始化 禁止点击
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


var editRowData = null;
// 初始化表格-特价
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
                            if(!value){
                                row["saleAmount"] = parseFloat(value||0).toFixed(2);
                            }

		                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
		                },
		                editor:{
		                    type:'numberbox',
		                    options:{
		                        min:0,
		                        precision:4,
								onChange:saleAmountOnChange,
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

	  }
    });

    gridHandel.setDatagridHeader("center");
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
    }
    gridHandel.setLoadData([$.extend({},gridDefault)])
}

// 初始化表格-类别折扣
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
				gridHandel.setSelectFieldName("skuCode");
			}
		},
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
					{field:'categoryCode',title:'活动类型',width:'200px',align:'left',
						formatter:function(value,row,index){
							return "全场折扣";
						}
					},
					{field:'discount',title:'折扣',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                	if(!value){
		                		row.discount = 0;
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
		 }
    });
    gridHandel.setLoadData([{discount:0}]);
 }

// 初始化表格-单品折扣
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
            {field: 'purchasePrice', title: '进货价', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
				
		 }
    });
    if(hasPurchasePrice==false){
        priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
    }
    gridHandel.setLoadData([$.extend({},gridDefault)])
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

// 初始化表格-偶数特价
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
            {field: 'purchasePrice', title: '进货价', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return;
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
			{field: 'saleAmount', title: '偶数特价', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			        	  return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			        }

                    if(!value){
                        row["saleAmount"] = parseFloat(value||0).toFixed(2);
                    }

			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:4,
						onChange:saleAmountOnChange,
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
			gridHandel.setDatagridHeader("center");
				
		 }
    });
    if(hasPurchasePrice==false){
		priceGrantUtil.grantPurchasePrice("saleMangeadd",["purchasePrice","oldSaleRate","newSaleRate"])
	}
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
			{field: 'saleAmount', title: '换购价', width: 100, align: 'right',
			    formatter : function(value, row, index) {
			        if(row.isFooter){
			        	 return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			        }
                    if(!value){
                        row["saleAmount"] = parseFloat(value||0).toFixed(2);
                    }
			        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:4,
						onChange:saleAmountOnChange,
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

// 初始化表格-全场满减

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
					{field:'limitAmount',title:'买满金额',width:'80px',align:'right',
		                formatter:function(value,row,index){
		                    if(row.isFooter){
		                    	 return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
		                    	 return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
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
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'300px',
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
// 初始化表格-类别满减设置
var gridHandelMj = new GridClass();
function initDatagridsortSet(){
	gridHandelMj.setGridName("salesetmj");
    $("#salesetmj").datagrid({
        align:'center',
        // toolbar: '#tb', //工具栏 id为tb
        singleSelect:true,  // 单选 false多选
        rownumbers:true,    // 序号
        fitColumns:true,    // 每列占满
        // fit:true, //占满
        showFooter:true,
		height:'500px',
		pageSize:50,
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
					{field: 'discountPrice', title: '优惠额', width: 100, align: 'right',
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

var gridHandelGoodsMj = new GridClass();
// 初始化表格-商品满减
function initDatagridshopMj(){
    gridHandelGoodsMj.setGridName("saleMangeMJadd");
    gridHandelGoodsMj.initKey({
        firstName:'skuCode',
        enterName:'skuCode',
        enterCallBack:function(arg){
            if(arg&&arg=="add"){
                if(checkenter())return;
                gridHandelGoodsMj.addRow(parseInt(gridHandelGoodsMj.getSelectRowIndex())+1,gridDefault);
                setTimeout(function(){
                    gridHandelGoodsMj.setBeginRow(gridHandelGoodsMj.getSelectRowIndex()+1);
                    gridHandelGoodsMj.setSelectFieldName("skuCode");
                    gridHandelGoodsMj.setFieldFocus(gridHandelGoodsMj.getFieldTarget('skuCode'));
                },500)
            }else{
                selectGoodsMJ(arg);
            }
        },
    })
  $("#saleMangeMJadd").datagrid({
      align:'center',
      // toolbar: '#tb', //工具栏 id为tb
      singleSelect:true,  // 单选 false多选
      rownumbers:true,    // 序号
      fitColumns:true,    // 每列占满
      // fit:true, //占满
      showFooter:true,
		height:'300px',
		pageSize:50,
		width:'100%',
      columns:[[
			{field:'cz',title:'操作',width:'60px',align:'center',
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            str ='<div class="ub ub-pc">合计</div> '
			        }else{
			            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandelGoodsmj(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
			                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandelGoodsMJ(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
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
			 {field:'price',title:'单价',width:'80px',align:'right',
			    formatter:function(value,row,index){
			        if(row.isFooter){
			        	 return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			        }
			        return  '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
			    }
			},
        ]], 
		onClickCell : function(rowIndex, field, value) {
            gridHandelGoodsMj.setBeginRow(rowIndex);
            gridHandelGoodsMj.setSelectFieldName(field);
			var target = gridHandelGoodsMj.getFieldTarget(field);
			if(target){
                gridHandelGoodsMj.setFieldFocus(target);
			}else{
                gridHandelGoodsMj.setSelectFieldName("skuCode");
			}
		},
      onBeforeLoad:function () {
          gridHandelGoodsMj.setDatagridHeader("center");
      },
  });
    gridHandelGoodsMj.setLoadData([$.extend({},gridDefault)])

}

// 初始化表格-组合特价
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
			        return '<b>'+parseInt(value||0)+'</b>';
			    },
			    editor:{
			        type:'numberbox',
			        options:{
			            min:0,
			            precision:0,
			        }
			    },
            }
          /*,{
              field: 'discountNum', title: '整单商品限量', width: 150, align: 'right',
              formatter : function(value, row, index) {
                  if(row.isFooter){
                      return;
                  }
                  if(!value){
                      row["limitAmount"] = parseFloat(value||0).toFixed(2);
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
          },*/
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
			gridHandel.setDatagridHeader("center");
				
		 }
  });
  gridHandel.setLoadData([$.extend({},gridDefault)])
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
            {
                field: 'limitCount', title: '数量', width: 100, align: 'right',
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
			var item = newData[i];
            item.saleAmount= parseFloat(val);
            //计算新毛利率
            if(isNaN(parseFloat(val)) || parseFloat(val) == 0){
                item.newSaleRate = "0.00%";
            }else{
                item.newSaleRate = ((item.saleAmount-item.purchasePrice)/item.saleAmount*100).toFixed(2)+"%";
            }
		}
		$("#"+datagridId).datagrid({data:newData})
	}
	else if(id=="discount"){
		for(var i = 0;i < newData.length;i++){
			var item = newData[i];
            item.discount= parseFloat(val);
            var discountPrice = (item.salePrice*(item.discount/10)).toFixed(2);
            if(discountPrice == 0 || isNaN(discountPrice)){
                item.newSaleRate = "0.00%";
            }else{
                item.newSaleRate = ((discountPrice-item.purchasePrice)/discountPrice*100).toFixed(2)+"%"
            }
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
		}
	}
	$("#"+datagridId).datagrid({data:newData})
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

// 满减设置插入一行
function addLineHandelmj(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandelMj.addRow(index,gridDefault);
}

// 商品满减设置插入一行
function addLineHandelGoodsmj(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandelGoodsMj.addRow(index,gridDefault);
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


//商品满减删除一行
function delLineHandelGoodsMJ(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandelGoodsMj.delRow(index);
}


//商品选择 买满送 主商品 选择
function selectGoodsComG(searchKey){
    if(!$.trim($("#branchName").val())){ //是否选择活动机构的校验
        $_jxc.alert("请先选择活动分店！");
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
        gradRows[0].goodsGiftList = newRows;
        $("#mmsgoodList").datagrid("loadData",newRows);
    })
}
// 选择商品
function selectGoods(searchKey){

    if(!$.trim($("#branchName").val())){ //是否选择活动机构的校验
        $_jxc.alert("请先选择活动分店！");
        return;
    }
	
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
	}else if(activityT == '5'){
        selectGoodsMJ(searchKey);
	}
	
	var param = {
			type:'PX',
			key:searchKey,
			isRadio:'',
			sourceBranchId:'',
			targetBranchId:'',
			branchId:$("#branchIds").val(),
			supplierId:'',
        flag: '',
        activityType: activityT == 11 || activityT == 12 ? activityT : ''
	}

	//借用一下type值，用来活动商品选择时，过滤不参加促销的商品
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
        var argWhere ={skuCode:1};  // 验证重复性
        var isCheck ={isGift:1 };   // 只要是赠品就可以重复
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
        //选择商品的时候计算老毛利率
        //计算老毛利率
        var activityType=$("#activityType").combobox('getValue');
        if(activityType==="1" || (activityType==="2" && $('#activityScopedis').val()==="0")
            || activityType==="3"){
            getOldSaleRate(newRows);
        }
        
        $("#saleMangeadd").datagrid("loadData",newRows);

        // gridHandel.setLoadFocus();
        // setTimeout(function(){
        //     gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
        //     gridHandel.setSelectFieldName("skuCode");
        //     gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
        // },500)
    });
}

// 选择商品
function selectGoodsMJ(searchKey){

    if(!$.trim($("#branchName").val())){ //是否选择活动机构的校验
        $_jxc.alert("请先选择活动分店！");
        return;
    }

    if(typeof(searchKey)=="undefined"){
        searchKey = "";
    }

    var param = {
        type:'PX',
        key:searchKey,
        isRadio:'',
        sourceBranchId:'',
        targetBranchId:'',
        branchId:$("#branchIds").val(),
        supplierId:'',
        flag: '',
        activityType: ""
    }

    //借用一下type值，用来活动商品选择时，过滤不参加促销的商品
    new publicGoodsServiceTem(param,function(data){
        if(searchKey){
            $("#saleMangeMJadd").datagrid("deleteRow", gridHandelGoodsMj.getSelectRowIndex());
            $("#saleMangeMJadd").datagrid("acceptChanges");
        }
        var nowRows = gridHandelGoodsMj.getRowsWhere({skuCode:'1'});
        var addDefaultData  = gridHandelGoodsMj.addDefault(data,gridDefault);
        var keyNames = {
            skuId:'goodsSkuId',
            salePrice:'price'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={skuCode:1};  // 验证重复性
        var isCheck ={isGift:1 };   // 只要是赠品就可以重复
        var newRows = gridHandelGoodsMj.checkDatagrid(nowRows,rows,argWhere,isCheck);

        $("#saleMangeMJadd").datagrid("loadData",newRows);

        // gridHandelGoodsMj.setLoadFocus();
        // setTimeout(function(){
        //     gridHandelGoodsMj.setBeginRow(gridHandelGoodsMj.getSelectRowIndex()||0);
        //     gridHandelGoodsMj.setSelectFieldName("skuCode");
        //     gridHandelGoodsMj.setFieldFocus(gridHandelGoodsMj.getFieldTarget('skuCode'));
        // },500)
    });
}

// 保存
function saveActivity(){
  // 保存结束编辑
  $("#saleMangeadd").datagrid("endEdit", gridHandel.getSelectRowIndex());
  
  // 活动类型
  var activityType=$("#activityType").combobox('getValue');
  // 打折活动类型
  var activityScopedis=$("#activityScopedis").val();
  // 满减活动类型
  var activityScopemj=$("#activityScopemj").val();
  //验证货号不能为空
  var check = {skuCode:'1'};
  
  if(activityScopedis == 1 || activityScopemj == 1){
	  var check ={goodsCategoryCode:'1'}
  }
  if(activityType == 5 && activityScopemj == 2){
	  check = {limitAmount:'1'}
  }
  if(activityType == 2 && activityScopedis == 1){
	  check = {categoryName:'1'}
  }
  // 获取非空的数据
  var rows= gridHandel.getRows();// $('#saleMangeadd').datagrid('getRows');
  if(rows.length==0){
	  $_jxc.alert("表格不能为空");
	  return;
  }
  // 重新加载数据，去除空数据
  $("#saleMangeadd").datagrid("loadData",rows);
  
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
	  if($("#discount").val()>10 || $("#discount").val()<0){
		  $_jxc.alert("批量折扣值在0~10之间");
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
	  else if(activityScopedis=="2"){
		  //全场折扣
		  for(var i=0;i<rows.length;i++){
			  var v = rows[i];
			  if(!v["discount"] || v["discount"]=='0.00'){
		          $_jxc.alert("第"+(i+1)+"行，折扣不能为空或0");
		          isCheckResult = false;
		          return false;
		      }
			  if(parseFloat(v["discount"]) >= 10 || parseFloat(v["discount"]) <=0){
		    	  $_jxc.alert("第"+(i+1)+"行，批量折扣值在0~10之间");
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
		      if(parseFloat(v["discount"])>=10 || parseFloat(v["discount"])<=0){
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
	  for(var i=0;i<rows.length;i++){
		  var v = rows[i];
	      if(!v["skuCode"]){
	          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      if(!v["saleAmount"]){
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
	  for(var i=0;i<rows.length;i++){
		  var v = rows[i];
	      if(!v["skuCode"]){
	          $_jxc.alert("第"+(i+1)+"行，货号不能为空");
	          isCheckResult = false;
	          return false;
	      };
	      if(!v["saleAmount"]){
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
	  $("#salesetmj").datagrid("endEdit", gridHandelMj.getSelectRowIndex());
	  var setrows=$('#salesetmj').datagrid('getRows');
		  if(activityScopemj=="0"){
              $("#saleMangeMJadd").datagrid("endEdit", gridHandelGoodsMj.getSelectRowIndex());
		  	var goodRows = gridHandelGoodsMj.getRowsWhere({skuName:"1"})
              if(goodRows.length==0){
                  $_jxc.alert("满减商品不能为空");
                  return;
              }
			  if(setrows.length==0){
			      $_jxc.alert("满减设置表格不能为空");
			      return;
			  }
			  for(var i=0;i<goodRows.length;i++){
				  var v = goodRows[i];
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
			  saveDataHandel(goodRows,setrows);
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
			  saveDataHandel(rows);
		  }
		  
  }
  //组合特价
  else if(activityType=="6"){
	 
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
	          $_jxc.alert("第"+(i+1)+"行，组合特价要小于原价");
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
  }

  else if(activityType=="10"){
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
	  
//	  var temTJObj = $('#mmsgradedList').datagrid('getChecked');
//	  if(temTJObj.length <= 1){
//		  var temTjList = gridHandelT.getRows();
//		  temTjList[0].goodsGiftList = gridHandel.getRowsWhere({skuName:'1'});
//	  }
	  
	  //买满条件 梯度检查
	  var tjRows = gridHandelT.getRows();
	  if(tjRows.length <= 0){
		  $_jxc.alert('请设置买满条件！',function(){});
		  return false;
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
		  
		  if(!(mmsTJObj.goodsGiftList && mmsTJObj.goodsGiftList.length >0)){
			  $_jxc.alert('买满条件第'+(i+1)+'行，未选择赠品！',function(){});
			  return  false;
		  }else{
			  var gifts = mmsTJObj.goodsGiftList;
			  for(var x = 0; x < gifts.length ; x++){
				  var gifObj = gifts[x];
				  if(gifObj && gifObj.giftNum <= 0){
					  $_jxc.alert('买满条件第'+(i+1)+'行，存在赠品数量小于等于0',function(){});
					  return false;
				  }
			  }
		  }
	  }
	  //return;
	  saveDataHandel(tjRows,setRows);
  }

  else if(activityType=="11"){
	  var n2zCount = $("#dvn2nCount #n2nCount").numberbox("getValue").trim();
	  var n2nSaleAmount = $("#dvn2nSaleAmount #n2nSaleAmount").numberbox("getValue").trim();
      if(!n2zCount){
          $_jxc.alert("<任选数量>不能为空");
          return;
      }

      if(parseFloat(n2zCount) <= 0){
          $_jxc.alert("<任选数量>不能为0");
          return;
      }

      if(!n2nSaleAmount){
          $_jxc.alert("<销售金额>不能为空");
          return;
      }

      if(parseFloat(n2nSaleAmount).toFixed(2) <= 0.00){
          $_jxc.alert("<销售金额>不能为0");
          return;
      }

      //  类别(1)  商品(0)
      var n2nType = $("input[name='n2nstatus']:checked").val();
      if(n2nType === "0"){
          for(var i=0;i<rows.length;i++){
              var v = rows[i];
              if(!v["skuCode"]){
                  $_jxc.alert("第"+(i+1)+"行，货号不能为空");
                  isCheckResult = false;
                  return false;
              }
          }
          saveDataHandel(rows);
	  }else if(n2nType === "1"){
          for(var i=0;i<rows.length;i++){
              var v = rows[i];
              if(!v["categoryCode"]){
                  $_jxc.alert("第"+(i+1)+"行，类别编号不能为空");
                  isCheckResult = false;
                  return false;
              }
          }

          saveDataHandel(rows);
	  }
  }

  else if(activityType=="12"){

      var n2nSaleAmount = $("#dvn2nSaleAmount2 #saleAmount").numberbox("getValue").trim();
      if(!n2nSaleAmount){
          $_jxc.alert("<销售金额>不能为空");
          return;
      }

      if(parseFloat(n2nSaleAmount).toFixed(2) <= 0.00){
          $_jxc.alert("<销售金额>不能为0");
          return;
      }

      for(var i=0;i<rows.length;i++){
          var v = rows[i];
          if(!v["skuCode"]){
              $_jxc.alert("第"+(i+1)+"行，货号不能为空");
              return false;
          }
          if (!v["limitCount"]) {
              $_jxc.alert("第"+(i+1)+"行，数量不能为空");
              return false;
          }
      }
      saveDataHandel(rows);
  }
  else{
	  saveDataHandel(rows);
  }

}

function saveDataHandel(rows,setrows){
  // 活动分店机构id
  var branchIds = $("#branchIds").val();
  // 活动名称
  var activityName = $("#activityName").val();
  // 活动类型
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

  //会员独享
    var vipType = $('#memberExclusive').combobox('getValue');
 
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
          memberExclusive: vipType,
          detailList: []
	  };
	  $.each(rows,function(i,data){
	      var temp = {
	    	  goodsSkuId: data.goodsSkuId,
	    	  saleAmount:data.saleAmount,
              groupNum:data.groupNum,
              price: data.price,
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
          memberExclusive: vipType,
          maxDiscountNum: $("#maxDiscountNum").numberbox("getValue"),
          detailList: []
	  };
	  $.each(rows,function(i,data){
	      var temp = {
	    	  goodsSkuId: data.goodsSkuId,
	    	  limitCount: data.limitCount,
	    	  saleAmount:data.saleAmount,
	    	  groupNum:data.groupNum,
	    	  price:data.price
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
          memberExclusive: vipType,
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
          memberExclusive: vipType,
	          detailList : []
	  };
	// 活动状态为满减 -商品
	  if(activityScopemj=="0"){
		  $.each(rows,function(i,data){
			  var goodsSkuId = data.goodsSkuId;
		      var price = data.price;
		      
		      $.each(setrows,function(j,data1){
			      var fullCutData = {
			    	  limitAmount:data1.limitAmount,
			          discountPrice:data1.discountPrice,
			      }
			      var goodsFullCut = $.extend({
					  goodsSkuId:goodsSkuId,
					  price:price
			      },fullCutData);
			      
			      reqObj.detailList.push(goodsFullCut);
			      
			  });
		      
		  });
		  
	  }
	//活动状态为满减 -类别
	  else if(activityScopemj=="1"){
		  $.each(rows,function(i,data){
		      var _goodsCategoryId = data.goodsCategoryId;
		      var _goodsCategoryCode = data.goodsCategoryCode;
		      
		      $.each(setrows,function(i,data){
			      var fullCutData = {
			    	  limitAmount:data.limitAmount,
			          discountPrice:data.discountPrice,
//			          price:data.price
			      }
			      var goodsFullCut = $.extend({
			    	  goodsCategoryId:_goodsCategoryId,
			    	  goodsCategoryCode:_goodsCategoryCode
			      },fullCutData);
			      
			      reqObj.detailList.push(goodsFullCut);
			      
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
		      reqObj.detailList[i] = temp
		  });
	  }
  //买满送
  }else if(activityType=="10"){
	  rows.forEach(function(obj,index){
		  var tempgifts = [];//rows;
		  if(obj.goodsGiftList && obj.goodsGiftList.length >0){
			  obj.goodsGiftList.forEach(function(obx,indej){
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
          activityPattern: $('#activityPattern').combobox('getValue') || '',
	          allowActivity:$("#mmsofactType1").is(":checked")?1:0,
	          allowMultiple:$("#mmsofactType2").is(":checked")?1:0,
          detailList: setrows, //活动范围数据集合
	          gradientList:rows //梯度集合
	  };
	  
  }else if(activityType=="11"){
      //类别(1)  商品(0)
      var actScope = $("input[name='n2nstatus']:checked").val() || '';

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
          memberExclusive: vipType,
          activityScope: actScope,
          maxDiscountNum: $("#n2nCount").numberbox("getValue"),
          maxDiscountAmount: $("#n2nSaleAmount").numberbox("getValue"),
          detailList: rows
      };
  }else if(activityType=="12"){
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
          memberExclusive: vipType,
          maxDiscountAmount: $("#saleAmount").numberbox("getValue"),
          detailList: rows
      };
  }
  var req = JSON.stringify(reqObj);

  $_jxc.ajax({
      url:contextPath+"/sale/activity/save",
      contentType:'application/json',
      data:req
  },function(result){
//	  gFunEndLoading();
      if(result['code'] == 0){
          $_jxc.alert("操作成功！",function(){
        		  location.href = contextPath +"/sale/activity/edit?activityId="+result["activityId"]; 
          });
      }else{
          $_jxc.alert(result['message']);
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

//类别选择  ---> 买满送
function getGoodsTypeG(){
	var param = {
			categoryType:"",
			type:1
	}
	new publicCategoryService(function(data){
		var nowRows = gridHandelB.getRowsWhere({categoryCode:'1'});
		
        var addDefaultData  = gridHandelB.addDefault(data,[{}]);
    	var keyNames = {
    			categoryCode:'goodsCategoryCode'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={categoryCode:1};  // 验证重复性
        var newRows = gridHandelB.checkDatagrid(nowRows,rows,argWhere);
        gridHandelB.setLoadData(newRows)
	},param);
}

// 类别选择
function getGoodsType(){
	var activityT=$("#activityType").combobox('getValue');
	//买满送调用 selectGoodsG方法
	if(activityT == '10'){
		getGoodsTypeG();
		return;
	}
	
	var param = {
			categoryType:"",
			type:1
	}
	new publicCategoryService(function(data){
		var nowRows = gridHandel.getRowsWhere({categoryCode:'1'});
		
        var addDefaultData  = gridHandel.addDefault(data,[{}]);
    	var keyNames = {
    			categoryCode:'goodsCategoryCode'
        };
        var rows = gFunUpdateKey(addDefaultData,keyNames);
        var argWhere ={categoryCode:1};  // 验证重复性
        var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere);
        $('#'+datagridId).datagrid("loadData",newRows);
		
	},param);
}

// 返回列表页面
function back(){
	location.href = contextPath +"/sale/activity/list";
}


/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
	 $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	 $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
};

//折扣价处理
function saleAmountOnChange(newVal,oldV){

	if(isNaN(parseFloat(newVal))) return;

	var priceNumVal = gridHandel.getFieldValue(gridHandel.getSelectRowIndex(),'price');
	if(parseFloat(priceNumVal) < parseFloat(newVal)) {
		$_jxc.alert("促销价格大于商品原价");
		gridHandel.setFieldValue('saleAmount','');
		return;
	}
//	if(parseFloat(newV)==0){
//		$_jxc.alert("促销价格为0");
//		return;
//	}
	//计算新毛利率
    var type = $("#activityType").combobox('getValue');
    var purchasePrice = gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'purchasePrice');
    var newSaleRate = '0.00%';
    if(newVal === ""  || isNaN(parseFloat(newVal))){
        newSaleRate = "0.00%";
        gridHandel.setFieldTextValue('newSaleRate',newSaleRate);
        return;
	}
	if(type==='1'){
    	if(parseFloat(newVal) == 0){
            newSaleRate = "0.00%";
		}else{
            newSaleRate = ((parseFloat(newVal)-purchasePrice)/parseFloat(newVal)*100).toFixed(2)+"%";
		}
	}else if(type==='3'){
         newSaleRate = (((priceNumVal+parseFloat(newVal))-(2*purchasePrice))/(priceNumVal+parseFloat(newVal))*100).toFixed(2)+"%";
	}
    gridHandel.setFieldTextValue('newSaleRate',newSaleRate);

	gridHandel.setFieldValue('saleAmount',parseFloat(newVal));
}

//新的导入功能 货号(0)、条码(1)导入
function toImportproduct(type){
	// 要货机构id
	var branchIds = $("#branchIds").val();
	// 发货机构id
    if(!branchIds){
        $_jxc.alert("请先选择活动分店");
        return;
    }
    
    var activityType=$("#activityType").combobox('getValue');
    var isgoodsN2N = $("#goodsN2N").is(":checked");
    
    //只支持特价、折扣、偶数特价类型的活动
    if(activityType!=='1' && activityType!=='2' && activityType!=='3'&& activityType!=='12'&& (activityType!=='11' && isgoodsN2N == false)){
    	 $_jxc.alert("只支持特价、偶数特价，特价打包和N元N件商品类型的活动");
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
		hasClickTab = false;
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