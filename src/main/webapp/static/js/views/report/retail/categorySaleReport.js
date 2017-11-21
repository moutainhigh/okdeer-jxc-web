$(function(){
	//开始和结束时间
	$("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    initDatagridRequire();
    //机构选择初始化
    $('#branchSelect').branchSelect({
        param:{
            formType:'BF'
        }
    })

    //商品类别选择组件
    $('#categoryNameDiv').categorySelect({
        param:{
            categoryType:$('input[name="categoryLevel"]:checked').val()||''
        },
        onShowBefore:function(){
            this.param.categoryType = $('input[name="categoryLevel"]:checked').val()||'';
            return true;
        }
    });
});
var gridHandel = new GridClass();
//初始化表格
function initDatagridRequire(){
	gridHandel.setGridName("categorySale");
   dg = $("#categorySale").datagrid({
        method:'post',
        align:'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
		height:'100%',
		pageSize:50,
		width:'100%',
        columns:[[
            {field:'branchName',title:'机构名称',width:'220px',align:'left',
            	formatter : function(value, row,index) {
                    var str = value;
                    if(!value){
	                    return '<div class="ub ub-pc ufw-b">合计</div> '
	                }
                    return str;
                }
            },
            {field:'cityName',title: '所在城市', width: '80px', align: 'left'},
			{field:'categoryCode', title: '类别编号', width: '80px', align: 'left'},
            {field:'categoryName', title: '类别名称', width: '80px', align: 'left'},
            {field:'saleAmount', title: '销售金额', width: '80px', align: 'right',
            	formatter:function(value,row,index){
            		if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                   
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            	 editor:{
                     type:'numberbox',
                     options:{
                     	disabled:true,
                         min:0,
                         precision:2
                     }
                 }
            },
            {field:'skuNum', title: 'SKU数', width: '80px', align: 'right',
            	formatter:function(value,row,index){
            		if(row.isFooter){
                        return '<b>'+parseInt(value||0)+'</b>';
                    }
                    return '<b>'+parseInt(value||0)+'</b>';
                }
            },
            {field:'skuTotalNum', title: '总销量', width: '80px', align: 'right',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            		}
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	}
            },
            {field:'skuAvgNum', title: '日均销量', width: '80px', align: 'right',
            	formatter:function(value,row,index){
            		if($_jxc.isStringNull(value)){
            			return '';
            		}
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	}
            },
            {field:'saleRate', title: '销售占比', width: '80px', align: 'right'}
      ]],
      onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
			//updateFooter();
		}
    });
}

//合计
/*function updateFooter(){
    var fields = {saleAmount:0};
    sum(fields);
}*/

//查询入库单
function queryForm(){
	if($("#branchName").val()==""){
        $_jxc.alert("请选择店铺名称");
        return;
    } 
	var fromObjStr = $('#queryForm').serializeObject();
    fromObjStr.categoryName = "";
	$("#categorySale").datagrid("options").method = "post";
	$("#categorySale").datagrid('options').url = contextPath + '/categorySale/report/getCategorySaleList';
	$("#categorySale").datagrid('load', fromObjStr);
}

/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchName").val(data.branchName);
	},'BF','');
}
var dg;
/**
 * 导出
 */
function exportData(){
	var length = $('#categorySale').datagrid('getData').total;
	if(length == 0){
		$_jxc.alert("无数据可导");
		return;
	}

    var param = {
        datagridId:"categorySale",
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/categorySale/report/exportList"
    }
    publicExprotService(param);
}


/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
	 $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
	 $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
};