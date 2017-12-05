/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function(){
    //开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
  
    //初始化列表
    initDataGrid();
});
var gridHandel = new GridClass();

function initDataGrid() {
	var updatePermission = $("#updatePermission").html().trim();
	$("#dataList").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        pageSize : pageSize,
        height:'100%',
        fit:true,
        columns: [[
            {field:'check',checkbox:true},
            {field:'id',hidden:true},
            {field:'brandCode',title:'品牌编号',width:250,align:'left',
                formatter: function(value,row,index){
                    if(updatePermission){
                    	return "<a href='#' onclick=\"editHandel('"+row.id+"')\" class='ualine'>"+value+"</a>";
                	}else{
                		return value;
                	}
                }
            },
            {field: 'brandName', title: '品牌名称', width: 250, align: 'left',},
            {field: 'remark', title: '备注', width: 400, align: 'left'}
        ]]
    });
    gridHandel.setDatagridHeader("center");
    query();
}


/**
 * 导出
 */
function exportData(){
	var length = $('#dataList').datagrid('getData').rows.length;
	if(length == 0){
        $_jxc.alert("无数据可导");
		return;
	}
    var param = {
        datagridId:"dataList",
        formObj:$("#queryForm").serializeObject(),
        url:contextPath+"/common/brand/exportList"
    }
    publicExprotService(param);
}

//查询
function query(){
	var formData = $("#queryForm").serializeObject();
	$("#dataList").datagrid("options").queryParams = formData;
	$("#dataList").datagrid("options").method = "post";
	$("#dataList").datagrid("options").url = contextPath+"/common/brand/queryBrandList";
	$("#dataList").datagrid("load");
}

//新增
var addDalogTemp;
function add(){
    addDalogTemp = $('<div/>').dialog({
        href: contextPath+"/common/brand/goAdd",
        queryParams:{},
        width: 400,
        height: 250,
        title: "品牌新增",
        closable: true,
        resizable: true,
        onClose: function () {
            $(addDalogTemp).panel('destroy');
        },
        modal: true,
        onLoad: function () {
        }
    })
}

//修改
var editDalogTemp;
function editHandel(id){
    editDalogTemp = $('<div/>').dialog({
        href: contextPath+"/common/brand/goEdit",
        queryParams:{
        	id:id
        },
        width: 400,
        height: 300,
        title: "品牌修改",
        closable: true,
        resizable: true,
        onClose: function () {
            $(editDalogTemp).panel('destroy');
        },
        modal: true,
        onLoad: function () {
        }
    })
}


//重置
function resetForm(){
	 $("#brandCodeOrName").val('');
};

//删除
function deleteBrand(){
	var rows =$("#dataList").datagrid("getChecked");
	if($("#dataList").datagrid("getChecked").length <= 0){
		 $_jxc.alert('请选中一行进行删除！');
		return null;
	}
	 var ids='';
	    $.each(rows,function(i,v){
	    	ids+=v.id+",";
	    });
	
	$_jxc.confirm('是否要删除选中数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/common/brand/deleteBrand",
		    	data:{
		    		ids:ids
		    	}
		    },function(result){
	    		
	    		if(result['code'] == 0){
                    $_jxc.alert("删除成功");
	    		}else{
                    $_jxc.alert(result['message']);
	    		}
	    		$("#dataList").datagrid('reload');
		    });
		}
	});
}


