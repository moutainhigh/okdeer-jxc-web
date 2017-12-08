/*----------开店投资费用报表-------------------*/
$(function(){
    
    $('#branchSelect').branchSelect();
    
    $("#branchCodeName").val(sessionBranchCodeName);
    $("#branchCompleCode").val(sessionBranchCompleCode);
    
    initDataGridReport();
});

var datagridKey = 'gridBuildChargeReport';
var gridHandel = new GridClass();
var inited = false;
var queryColumns = [];

//初始化表格
function initDataGridReport(){
	gridHandel.setGridName(datagridKey);
	
	dg = $("#"+datagridKey).datagrid({
        align:'right',
        singleSelect:true,  //单选  false多选
        rownumbers:false,    //序号
        pagination:false,    //分页
        showFooter:true,
		height:'100%',
		width:'100%',
		url:"",
		columns:queryColumns,
        onLoadSuccess:function(data){
        	if(data.rows.length < 1) {
        		$(this).datagrid('reloadFooter',[])
        		return;
        	}
        	gridHandel.setDatagridHeader("center");
        	//updateFooter();
        	
        	mergeRows(data);
        }       
    });
	inited = true;
   // queryForm();
	
}

var threeLevelCgName = 'threeLevelCgName';

function mergeRows(data){
	
	var merges = getMergesData(data.rows);
	for(var i=0; i<merges.length; i++){
		$("#"+datagridKey).datagrid('mergeCells',{
			index: merges[i].index,
			field: threeLevelCgName,
			rowspan: merges[i].rowspan,
		});
	}
}

//合并表格操作
function getMergesData(sc_data){
    var ne_data = []; //目标数组
    var no_Num = 0;  //游标
    var _currentObj; //当前统计小项 用于小小项合计
    if(sc_data.length > 0){
        sc_data.forEach(function(obj,ind){
            operateInData(obj);
        })
    }
    function operateInData(arg){
        var ne_item = {};
        if(ne_data.length <= 0){
            //跨行
            ne_item = {
                index:0,
                threeLevelCgName:arg.threeLevelCgName,
                rowspan:1
            };
            ne_data.push(ne_item);
            _currentObj = ne_item;
            return ;
        }

        //统计项
        
        var _flag = false; //标识符
        ne_data.forEach(function(obc,inc){
            if(obc.threeLevelCgName === arg.threeLevelCgName){
                _flag = true;
                obc.rowspan++; //跨行累计
                no_Num++;      //游标累计
            }
        });

        if(!_flag){
            //下一个统计项
            var nne_item = {
                index:++no_Num,
                threeLevelCgName:arg.threeLevelCgName,
                rowspan:1
            };
            _currentObj = nne_item;
            ne_data.push(nne_item);
        }
    }
    return ne_data;
}

function queryForm(){
	 if($("#branchName").val()==""){
	    $_jxc.alert("请选择店铺名称");
	    return;
	 } 
	var fromObjStr = $('#queryForm').serializeObject();
	
	var param = {
        url :contextPath+"/report/buildChargeInvest/getColumns",
        data:fromObjStr
    }

    $_jxc.ajax(param,function (result) {
        if(result.code == 0){
        	if(!result.data){
        		return;
        	}
        	
        	var flg = result.flg;
        	if(flg === true){
        		$_jxc.alert("店铺数据较多，只展示20个店铺数据，如需查看所有请导出excel查看。");
        	}
        	
        	queryColumns = eval("(" + result.data + ")");
        	
        	initDataGridReport();
        	
        	$("#"+datagridKey).datagrid("options").method = "post";
        	$("#"+datagridKey).datagrid('options').url = contextPath + '/report/buildChargeInvest/getList';
        	$("#"+datagridKey).datagrid('load', fromObjStr);
        }else{
        	queryColumns = [];
        	initDataGridReport();
        	$("#"+datagridKey).datagrid('loadData', []);
            $_jxc.alert("店铺数据为空!");
        }
    });
	
}

function exportData(){
	if(inited == false){
		$_jxc.alert("请先查询数据");
		return;
	}
		
	var length = $("#"+datagridKey).datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}
	$("#queryForm").attr("action",contextPath+"/report/buildChargeInvest/exportList");
	$("#queryForm").submit();
}

var categroyCodeDialogTemp = null;
function openChargeCodeDialog() {
    categroyCodeDialogTemp = $('<div id="categroyCodeDialog"/>').dialog({
        href: contextPath+"/settle/charge/chargeCategory/publicView",
        width: 840,
        height: 600,
        title: "费用类别选择",
        closable: true,
        resizable: true,
        onClose: function () {
            $(categroyCodeDialogTemp).panel('destroy');
            categroyCodeDialogTemp = null;
        },
        modal: true,
        onLoad: function () {
            var categoryDialogClass = new ChargeCategoryDialogClass();
            categoryDialogClass.treeChargeCategory();
            categoryDialogClass.gridChargeCategoryList();
            categoryDialogClass.initPubChCategoryCallback(categroyDialogCb)

        }
    })
}

function categroyDialogCb(data) {
    $("#categoryId").val(data.id);
    $("#categoryCode").val(data.categoryCode);
    $("#categoryName").val(data.categoryName);
}

function closeCategroyCodeDialog() {
    $(categroyCodeDialogTemp).panel('destroy');
    categroyCodeDialogTemp = null;
}

/**
 * 是否合计
 * @param value
 * @param row
 * @param index
 * @returns
 */
function isFooter(value, row, index){
	if(value === '合计'){
		return '<b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+value+'</b>';
	}
	return value;
}
