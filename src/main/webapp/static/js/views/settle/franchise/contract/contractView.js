/**
 * 加盟店合同建立-新增编辑
 */
var dataGridId = "taxList";
$(function(){
	initContact()
});
var gridHandel = new GridClass();

var gridDefault = {
	quotaStart:0
}

function initContact(){
    gridHandel.setGridName(dataGridId);
    $("#"+dataGridId).datagrid({
        align:'center',
        method:'get',
        url:contextPath+"/settle/franchiseContract/getRuleList?formId="+$('#formId').val(),
        singleSelect:false,  // 单选 false多选
        rownumbers:true,    // 序号
        showFooter:true,
        height:'400',
        width:'800',
        columns:[[
            {field:'quotaStart',title:'毛利额度起',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	},
            	styler:function(value,row,index){
                	return 'background-color:#f2f2f2;';
                }
            },
            {field:'quotaEnd',title:'毛利额度止',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return $_jxc.isStringNull(value)? '' : '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
            	}
            },
            {field:'targetAllocation',title:'甲方分配（%）',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return $_jxc.isStringNull(value)? '' : '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	}
            },
            {field:'franchiseAllocation',title:'乙方分配（%）',width:'100',align:'right',
            	formatter:function(value,row,index){
            		return $_jxc.isStringNull(value)? '' : '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	},
            	styler:function(value,row,index){
                	return 'background-color:#f2f2f2;';
                }
            },
            {field:'remark',title:'备注',width:'200',align:'left',editor:'textbox'}
        ]],
        onLoadSuccess:function(data){
            gridHandel.setDatagridHeader("center");
        }
    });
}

/**
 * 返回领用单
 */
function back(){
	toClose();
}

