/**
 * Created by zhaoly on 2017/5/24.
 */

function initShopSetting(cardType){
    initGridShopList(cardType);
    initgridEquipmentList();
}
//选择店铺
function addShop(){
    //初始化机构ID
    var branchId = sessionBranchId;

    publicAgencyService(function(data){
        var param = {
            data:{"branchCode":data.branchCode},
            url:contextPath+"/iccard/setting/get/branch"
        }
        $_jxc.ajax(param,function (result) {
            if(result['code'] == 0){
            	 var nowRows = gridShopHandel.getRows()
                 var argWhere ={branchCode:1};  //验证重复性
                 var newRows = gridShopHandel.checkDatagrid(nowRows,[result.data],argWhere,{});
                $("#"+gridShopName).datagrid("loadData",newRows);

                $.each(newRows,function (index,item) {
                    if(item.branchCode == data.branchCode){
                        $('#'+gridShopName).datagrid('selectRow',index);
                    }
                })
            }
        })

    },'',branchId);
}
var gridShopName = "gridShopList";
var gridEquipment = "gridEquipmentList";
var gridShopHandel = new GridClass();
var gridEquipmentHandel = new GridClass();
function initGridShopList(cardType) {
	$("#settingId").val(cardType);
    gridShopHandel.setGridName(gridShopName);
    $("#"+gridShopName).datagrid({
        align:'center',
        rownumbers:true,    //序号
        showFooter:true,
        singleSelect:true,  //单选  false多选
        // pagination:true,    //分页
        // pageSize:50,
        checkOnSelect:false,
        selectOnCheck:false,
        height:'40%',
        width:'100%',
        url:'setting/branch/list?settingId='+cardType,
        // fit:true,
        columns:[[
        	{field: 'branchId', title: '店铺id', hidden:"true"},
            {field: 'branchCode', title: '店铺编号', width: 100, align: 'left',
                formatter : function(value, row,index) {
                    var str = value;
                    if(row.isFooter){
                        str ='<div class="ub ub-pc">合计</div> '
                    }
                    return str;
                },
            },
            {field: 'branchName', title: '店铺名称', width: 180, align: 'left'},
            {field: 'typeDesc', title: '店铺类型', width: 80, align: 'left'},
            {field: 'ecardRechargeAmount', title: '累计充值金额', width: 150, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field: 'ecardWithdrawalAmount', title: '提取金额', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
            },
            {field: 'ecardUseAmount', title: '已用金额', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field: 'ecardConsumeAmount', title: '消费金额', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field: 'ecardBalance', title: '账户余额', width: 100, align: 'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                    }
                    return '<b>'+parseFloat(value||0).toFixed(4)+'</b>';
                },
            },
            {field: 'enabled', title: '启用',checkbox:true, width: 80, align: 'left',
                formatter : function(value, row,index) {
                	return value;
            }}
        ]],
        onSelect:function(rowIndex,rowData){
            $("#"+gridEquipment).datagrid('loadData', { total: 0, rows: [] });
            selectView(rowData);
        },
        onCheck:function(rowIndex,rowData){
        	rowData.enabled = '1';
        	rowData.checked = true;
        },
        onUncheck:function(rowIndex,rowData){
        	rowData.enabled = '0';
        	rowData.checked = false;
        },
        onCheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.enabled = '1';
        		item.checked = true;
        	})
        },
        onUncheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.enabled = '0';
        		item.checked = false;
        	})
        },
        loadFilter:function(data){
        	//显示现实数据转换 后台不返回 rows 节点结构啦 2.7
        	data = $_jxc.gridLoadFilter(data);
        	
        	if(data.rows && data.rows.length > 0){
        		
        		data.rows.forEach(function(obj,index){
        			obj.checked = obj.enabled == '1'?true:false;
        		})
        	}
        	return data;
        },
        onLoadSuccess : function(data) {
            gridShopHandel.setDatagridHeader("center");
            updateFooter();
        }
    })

    $("#"+gridShopName).parent().find("div .datagrid-header-check").children("input[type=\"checkbox\"]").eq(0).attr("style", "display:none;");
    $("#"+gridShopName).parent().find("div .datagrid-header-check").append("<b>启用</b>")
}
//合计
function updateFooter(){
    var fields = {ecardRechargeAmount:0,ecardWithdrawalAmount:0,ecardUseAmount:0,ecardBalance:0,};
    gridShopHandel.updateFooter(fields,{});
}


function selectView(rowData) {
	$("#branchId").val(rowData.branchId);
    var param = {
        data:{
            "branchId":rowData.branchId,
            "settingId": $("#settingId").val()
        },
    	url:contextPath+"/iccard/setting/get/device"
    }
    $_jxc.ajax(param,function (result) {
        getPostData();
        if(result.list.length > 0 ){
            $("#"+gridEquipment).datagrid("loadData",result);
        }else {
            gridEquipmentHandel.setLoadData([$.extend({},gridDefault)])
        }
    })
}

var postData = [];
var gridDefault = {posRegisteId:"-1",posRegisteText:"不关联"}
function initgridEquipmentList() {
    gridEquipmentHandel.setGridName(gridEquipment);
    $("#"+gridEquipment).datagrid({
        align:'center',
        rownumbers:true,    //序号
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        height:'40%',
        width:'100%',
        fit:true,
        columns:[[
            {field:'cz',title:'操作',width:'60px',align:'center',
                formatter : function(value, row,index) {
                     var   str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
                    return str;
                },
            },

            {field: 'deviceCode', title: '设备代码', width: 180, align: 'left',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return;
                    }
                    return value;
                },
                editor:{
                    type:'textbox',
                    options:{
                        prompt:"最多输入20个字符",
                    }
                }
            },
            {field: 'protectKey', title: '终端保护密钥', width: 250, align: 'left',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return;
                    }
                    if(undefined != value && value.trim().length > 20){
                        value = value.substr(0,50);
                    }
                    return value;
                },
                editor:{
                    type:'textbox',
                    options:{
                        prompt:"最多输入50个字符",
                    }
                }
            },
            {field: 'posRegisteText', title: 'pos',hidden:true,
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return;
                    }
                    return value;
                },
                editor:{
                    type:'textbox',
                    options:{
                       disabled:true
                    }
                }
            },
            {field: 'posRegisteId', title: '关联POS', width: 100, align: 'left',
                formatter:function(value,row){
                    var posRegisteText = row.posRegisteText;
                    return (typeof (posRegisteText) === "undefined"||posRegisteText==="")?"不关联":row.posRegisteText;
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        editable:false,
                        required:true,
                        // mode: "remote",
                        // url:contextPath+ '/iccard/setting/pos/'+$("#branchId").val(),
                        data:postData,
                        onSelect:onSelectPOS
                    }
                }},
        ]],
        onClickCell:function(rowIndex,field,value){
            gridEquipmentHandel.setBeginRow(rowIndex);
            gridEquipmentHandel.setSelectFieldName(field);

            var target = gridEquipmentHandel.getFieldTarget(field);
            if(target){
                gridEquipmentHandel.setFieldFocus(target);
            }else{
                gridEquipmentHandel.setSelectFieldName("deviceCode");
            }
        },
        onLoadSuccess : function(data) {
            gridEquipmentHandel.setDatagridHeader("center");
        }
    })

}

function getPostData() {
    var branchId = $("#branchId").val();
    var param = {
               url:contextPath+ '/iccard/setting/pos/'+branchId
    };
    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
            postData = result.data;
            initgridEquipmentList();
        }else{
            $_jxc.alert(result['message']);
        }
    })
}

//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridEquipmentHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridEquipmentHandel.delRow(index);
}

function onSelectPOS(data) {
    var posRegisteText = gridEquipmentHandel.getFieldData(gridEquipmentHandel.getSelectRowIndex(),"posRegisteText");
    gridEquipmentHandel.setFieldTextValue("posRegisteText",data.text);

}

function saveSetting(){
    var rows = gridShopHandel.getRows();
    if(!rows || rows == null || rows.length<=0){
    	 $_jxc.alert("请先添加店铺！");
         return;
    }
    var url = contextPath+"/iccard/setting/save/shop";
    var settingId = $("#settingId").val();
    var ids=new Array();
	var enableds=new Array();
	for(var  i = 0;i<rows.length;i++){
		ids[i] = rows[i].branchId;
		enableds[i]=rows[i].enabled;
	}

    var param = {
        url:url,
        data:{
            "settingId":settingId,
            "ids":ids,
            "enableds":enableds
        }
    }
    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){
            $_jxc.alert("门店设置保存成功");
            $("#"+gridShopName).datagrid('reload');
        }else{
            $_jxc.alert(result['message']);
        }
    })
}

function saveEquipmentList() {
	  $("#"+gridEquipment).datagrid("endEdit", gridEquipmentHandel.getSelectRowIndex());

    var rows = gridEquipmentHandel.getRows();
    if(!rows || rows == null || rows.length<=0){
    	 $_jxc.alert("请选择一个店铺，添加设备！");
         return;
    }

    var isCheckData = true;
    $.each(rows,function (index,item) {
        if(typeof (item.id) !="undefined"){
            if($_jxc.isStringNull(item.deviceCode)){
                $_jxc.alert("第"+(index+1)+"行，请填写设备代码！");
                isCheckData = false;
                return false;
            }

            if($_jxc.isStringNull(item.protectKey)){
                $_jxc.alert("第"+(index+1)+"行，请填写终端保护密钥！");
                isCheckData = false;
                return false;
            }
        }else {
            if($_jxc.isStringNull(item.deviceCode) && !$_jxc.isStringNull(item.protectKey)){
                $_jxc.alert("第"+(index+1)+"行，请填写设备代码！");
                isCheckData = false;
                return false;
            }

            if(!$_jxc.isStringNull(item.deviceCode) && $_jxc.isStringNull(item.protectKey)){
                $_jxc.alert("第"+(index+1)+"行，请填写终端保护密钥！");
                isCheckData = false;
                return false;
            }
        }

    })
    if(!isCheckData) return;

    var rowsData = gridEquipmentHandel.getRowsWhere({deviceCode:"1"});
    if(rowsData.length <= 0){
        $_jxc.alert("请添加设备信息！");
        return;
    }

    var isRepetition = false;
    var posArr = [];
    $.each(rowsData,function (index,item) {
        if($.inArray(item.posRegisteId, posArr) == -1){
            if(item.posRegisteId != "-1" && item.posRegisteId != ""){
                posArr.push(item.posRegisteId);
            }
        }else{
            isRepetition = true;
        }
    })

    if(isRepetition){
        $_jxc.alert("一台POS不能关联多台设备.")
        return;
    }



    //宋文杰的请求套路，表示不走寻常路
    var branchId = $("#branchId").val();
    var param = {
        url: contextPath+"/iccard/setting/judge/branch",
        data:{"branchId": branchId, "settingId": $("#settingId").val()}
    }
    $_jxc.ajax(param,function (result) {
        if(result['code'] == 0){

            var data = {
                "branchId":branchId,
                "settingId": $("#settingId").val(),
                posList:rowsData
            }

            var param = {
                url:contextPath+"/iccard/setting/save/pos",
                 data: JSON.stringify(data),
                contentType:'application/json',
                // "deviceCode":deviceCode,"protectKey":protectKey,"posRegisteId":posRegisteId
            }
            $_jxc.ajax(param,function (result) {
                if(result['code'] == 0){
                    $_jxc.alert("设备数据保存成功");
                }else{
                    $_jxc.alert(result['message']);
                }
            })

        }else{
            $_jxc.alert("请先保存开通店铺,再保存设备！");
        }
    })
}