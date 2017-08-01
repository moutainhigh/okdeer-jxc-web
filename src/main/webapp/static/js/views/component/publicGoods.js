/**
 * Created by zhaoly on 2017/3/16.
 */

var PublicGoods = function () {

}

$(function () {

        PublicGoods.prototype = function(){

            var goodsRadioCallBack ;
            //初始化回调函数
            initGoodsRadioCallBack=function(cb){
                goodsRadioCallBack = cb;
                initDatagridGoods();
            }
            initSelectView =function (){
                var arr = [{
                    id: 'categoryCode',
                    text: '类别',
                },{
                    id: 'brandId',
                    text: '品牌'
                },{
                    id: 'supplierId',
                    text: '供应商'
                }];
                for(var i =0 ;i<arr.length;i++){
                    if(arr[i]['id']==goodsClass.selectTypeName){
                        arr[i]['selected']= true;
                    }
                }
                $('#goodsType').combobox({
                    valueField:'id',
                    textField:'text',
                    data: arr,
                    onSelect: function(record){
                        goodsClass.selectTypeName = record.id;
                        initTreeArchives();
                    },
                });
            }
            //初始树
            initTreeArchives = function (){
                var searchSupplierId = $("#searchSupplierId").val();
                var args = {supplierId:searchSupplierId};
                var httpUrl = goodsClass.getTreeUrl(goodsClass.selectTypeName);
                $.post(httpUrl, args,function(data){
                    var setting = {
                        data: {
                            key:{
                                name:'codeText',
                            }
                        },
                        callback: {
                            onClick: zTreeOnClick
                        }
                    };
                    $.fn.zTree.init($("#treeGoodsType"), setting, JSON.parse(data));

                    var treeObj = $.fn.zTree.getZTreeObj("treeGoodsType");
                    var nodes = treeObj.getNodes();
                    if (nodes.length>0) {
                        treeObj.expandNode(nodes[0], true, false, true);
                    }
                });
            }
            /*
             * 树点击事件
             */
            var categoryCode="";
            var supplierId="";
            var brandId="";
            /***
             *
             *
             *
             *
             * **/
            function zTreeOnClick(event, treeId, treeNode) {
                categoryCode=treeNode.code;
                var text =  $("#goodsType").combobox('getText');
                var type = $('#type').val();
                var _searchParam = serializeParam();
                if(text =='类别'){
                    brandId = "";
                    supplierId = "";
                    // 如果为直送收货，类别需求加入供商商条件，其他单据商品选择与供应商无关
                    if(type != 'PM'){
                    	_searchParam.supplierId = "";
                    }
                }else if(text =="品牌"){
                    brandId = treeNode.id;
                    supplierId = "";
                    // 如果为直送收货，品牌需求加入供商商条件，其他单据商品选择与供应商无关
                    if(type != 'PM'){
                    	_searchParam.supplierId = "";
                    }
                }else if(text=="供应商"){
                    brandId = "";
                    supplierId = treeNode.id;
                    _searchParam.supplierId = supplierId;
                }
                _searchParam.categoryCode = categoryCode;
                
                /***
                 * 'categoryCode':categoryCode, 点击树节点的类别值
                 * 'categoryCodes':$('#categoryCodes').val(), 外部传人的业务类别 数组
                 *
                 * **/
                $("#gridGoods").datagrid("options").queryParams = _searchParam;

                $("#gridGoods").datagrid("options").method = "post";
                $("#gridGoods").datagrid("options").url =contextPath + '/goods/goodsSelect/getGoodsList';
                $("#gridGoods").datagrid("load");

            };

            function getFiledsList(type) {
                var arrColumns = [
                    {field:'skuCode',title:'货号',align:'left',width:100,},
                    {field:'barCode',title:'条码',align:'left',width:100,},
                    {field:'skuName',title:'商品名称',align:'left',width:100,},
                    {field:'categoryName',title:'类别',align:'center',width:100},
                ];
                if(type == 'PC'){
                    var tempCol = [
                        {field:'salePrice',title:'零售价',align:'right',width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'vipPrice',title:'会员价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'distributionPrice',title:'配送价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'wholesalePrice',title:'批发价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'purchasePrice',title:'进货价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        }
                    ]
                    arrColumns = arrColumns.concat(tempCol)
                }else if(type == 'PA'){
                    var tempCol = [
                        {field:'purchasePrice',title:'进货价',align:'right',width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'salePrice',title:'零售价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'vipPrice',title:'会员价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'distributionPrice',title:'配送价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'wholesalePrice',title:'批发价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                    ]
                    arrColumns = arrColumns.concat(tempCol)
                }else if(type == 'PR'){
                    var tempCol = [
                        {field:'purchasePrice',title:'进货价',align:'right',width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'salePrice',title:'零售价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'vipPrice',title:'会员价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'distributionPrice',title:'配送价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'wholesalePrice',title:'批发价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                    ]
                    arrColumns = arrColumns.concat(tempCol)
                }else if(type == 'DD'){
                    var tempCol = [
                        {field:'salePrice',title:'零售价',align:'right',width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'costPrice',title:'成本价',align:'right',width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                    ]
                    arrColumns = arrColumns.concat(tempCol)
                }else {
                    var tempCol = [
                        {field:'salePrice',title:'零售价',align:'right',width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'vipPrice',title:'会员价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'distributionPrice',title:'配送价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'wholesalePrice',title:'批发价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                        {field:'purchasePrice',title:'进货价',align:'right',hidden:true,width:100,
                            formatter : function(value, row, index) {
                                var str=(value||0).toFixed(2);
                                return str;
                            }
                        },
                    ]

                    arrColumns = arrColumns.concat(tempCol)
                }
                var tempCol2= [
                    {field:'unit',title:'库存单位',align:'left',width:100,},
                    {field:'spec',title:'规格',align:'left',width:100,},
                    {field:'memoryCode',title:'助记码',align:'left',width:100,}
                ]
                arrColumns = arrColumns.concat(tempCol2);

                return arrColumns;
            }

//初始化表格
            var gridGoodsDg;
            function initDatagridGoods(){
                var type = $('#type').val();
                var arrColumns = getFiledsList(type);
                if(!goodsRadioCallBack){
                    arrColumns.unshift({field:'ck',checkbox:true});
                }
                gridGoodsDg=$("#gridGoods").datagrid({
                    //title:'普通表单-用键盘操作',
                    method:'POST',
                    align:'center',
                    //toolbar: '#tb',     //工具栏 id为tb
                    singleSelect:false,  //单选  false多选
                    rownumbers:true,    //序号
                    pagination:true,    //分页
                    fitColumns:true,    //每列占满
                    //fit:true,            //占满
                    pageSize:50,
                    /*  pageList : [10,500],  */
                    showFooter:true,
                    height:'100%',
                    columns:[arrColumns],
                    onClickRow:goodsClickRow,
                    idField:'skuCode',
                    onLoadSuccess : function() {
                        //gridHandel.setDatagridHeader();
                    }
                });
                var param = {
                        wholesalePrice:["wholesalePrice"],
                        purchasePrice:["purchasePrice"],
                        distributionPrice:["distributionPrice"],
                        costPrice:["costPrice"],
                        vipPrice:["vipPrice"],
                        salePrice:["salePrice"],
                }
                priceGrantUtil.grantPrice("gridGoods",param);
            }
//选择单行
            goodsClickRow = function(rowIndex, rowData){
                if(goodsRadioCallBack){
                    goodsRadioCallBack(rowData);
                }
            }
            publicGoodsGetCheckGoods = function(cb){
                var row =  $("#gridGoods").datagrid("getChecked");
                cb(row);
            }
            var fromParams = {};
            /*
             * 查询
             */
            cx = function (){
                setTimeout(function(){
                    var text =  $("#goodsType").combobox('getText');
                    var searchSupplierId = '';
                    var _searchParam = serializeParam();
                    if(text=='供应商'){
                        searchSupplierId = $("#searchSupplierId").val();
                        _searchParam.supplierId = searchSupplierId;
                    }
                    // $("#gridGoods").datagrid("options").queryParams = {'categoryId':categoryId,'goodsInfo':goodsInfo,'formType':'${type}','sourceBranchId':'${sourceBranchId}','targetBranchId':'${targetBranchId}'};
                    // 梁利 提出左边树与右边的查询无关系
                    var queryParams=_searchParam;
                    
                    if(text!='供应商'){
                    	queryParams.supplierId = "";
                    }
                    
                    //1002回车 弹窗选择后 点击查询无效 2.7 修改
                    if($.trim(queryParams.goodsInfo)){
                       queryParams.skuCodesOrBarCodes = '';
                    }
                    
                    $("#gridGoods").datagrid("options").queryParams = queryParams;
                    $("#gridGoods").datagrid("options").method = "post";
                    $("#gridGoods").datagrid("options").url =contextPath + '/goods/goodsSelect/getGoodsList';
                    $("#gridGoods").datagrid('load');
                    $("#goodsInfo").focus();
                    $("#goodsInfo").select();
                },1000)
            }
            
            serializeParam = function(){
            	var _formObj = $('#hiddenForm').serializeObject();
            	_formObj.goodsInfo = $.trim(_formObj.goodsInfo||'');
            	return _formObj;
            }
             	
            initSearch=function(param){
            	//console.log('param',param);
            	if(param){
            		//根据参数序列化到dom结构中
            		for(key in param){
            			//nameOrCode赋值
            			if(key == 'key'){
            				$('#goodsInfo').val(param.key);
            			}else{
            				var _inpStr = "<input type='hidden' name='"+key+"' value='"+(param[key]||"")+"' />";
            				$('#hiddenForm').append(_inpStr);
            			}
            		}
            	}
            	
                fromParams = param;
                $("#goodsInfo").val(param.key);
                if(!param.key){
                	var _searParam = serializeParam();
                    $("#gridGoods").datagrid("options").method = "post";
                    $("#gridGoods").datagrid("options").queryParams = _searParam;
                    $("#gridGoods").datagrid("options").url =contextPath + '/goods/goodsSelect/getGoodsList';
                    $("#gridGoods").datagrid('load');
                }else{
                    cx();
                }
            }

            return{
                initGoodsRadioCallBack:initGoodsRadioCallBack,
                initSearch:initSearch,
                publicGoodsGetCheckGoods:publicGoodsGetCheckGoods,
                cx:cx,
                initSelectView:initSelectView,
                initTreeArchives:initTreeArchives
            }

        }()

        gFunSetEnterKey(cx)
    }
)

function goodsArchives(){
    var type = $('#type').val();

    if(type=='PA' || type=='PR'|| type=='PM'){
        this.selectTypeName = "supplierId";
    }else{
        this.selectTypeName = "categoryCode";
    }
    //tree的提交参数
    var searchSupplierId = $("#searchSupplierId").val();
    this.treeParam = {
        categoryCode:'',
        supplierId:searchSupplierId,
        brandId:'',
        level:'',
    }
    //树的请求地址
    this.treeUrls = [
        {
            name:'categoryCode',
            url:contextPath+'/common/category/getGoodsCategoryToTree'
        },
        {
            name:'brandId',
            url:contextPath+'/common/brand/getBrandToTree'
        },
        {
            name:'supplierId',
            url:contextPath+'/common/supplier/getSupplierToTree'
        }
    ];
    this.getTreeUrl = function(name){
        var httpUrl = ""
        $.each(this.treeUrls,function(i,v){
            if(v.name==name){
                httpUrl = v.url;
                return false
            }
        });
        return httpUrl;
    }
}

var goodsClass = new goodsArchives();

$(function(){
    initSelectView();
    initTreeArchives();
});





