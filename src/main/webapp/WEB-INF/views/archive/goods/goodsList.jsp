<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>进销存-商品档案</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>

    <script  src="${ctx}/static/js/views/goods/goodsArchives.js?V=${versionNo}2"></script>
</head>

<body class="ub uw uh ufs-14 uc-black">
<div class="ub  ub-f1 umar-4 upad-4">
    <!--left-->
    <div class="ub ub-ver ubor">
        <div class="upad-4">
            <select id="goodsType" class="easyui-combobox uselect"></select>
        </div>
        <div class="ubor-b "></div>
        <div class="ub upad-4 ub-f1 uscroll">
            <div class="zTreeDemoBackground left">
                <ul id="treeArchives" class="ztree"></ul>
            </div>
        </div>
    </div><!--left end-->
    <div class="ub ub-ver ub-f1 upad-4">
        <div class="ub ub-ac">
            <div class="ubtns">
            	<shiro:hasPermission name="JxcGoodsArchive:add">
					<button class="ubtns-item" onclick="addGoodsView()">新增</button>
			   	</shiro:hasPermission>
			   	<shiro:hasPermission name="JxcGoodsArchive:copy">
					<button class="ubtns-item" onclick="copyGoodsView()">复制</button>
			   	</shiro:hasPermission>
			   <%-- 	<shiro:hasPermission name="JxcGoodsArchive:delete">
					<button class="ubtns-item" onclick="delGoods()">删除</button>
			   	</shiro:hasPermission> --%>
			   	<shiro:hasPermission name="JxcGoodsArchive:export">
					<button class="ubtns-item" onclick="exportData()">导出</button>
			   	</shiro:hasPermission>
			   	
            </div>
        </div>
        <form action="" id="formGoodsArchives" method="post">
            <div class="ub umar-t4">
                <div class="ub ub-ac umar-r10">
                    <div class="umar-r10  ut-r">关键字:</div>
                    <input type="hidden" name="categoryCode1" id="categoryCode1" value="">
                    <input type="hidden" name="level" id="level" value="">
                    <input type="hidden" name="brandId1" id="brandId1" value="">
                    <input type="hidden" name="supplierId1" id="supplierId1" value="">
                    <input class="uinp uw-400" type="text" name="goodsInfo" maxlength="50" id="goodsInfo" placeholder="输入货号、条码、商品名称进行查询">
                </div>
                <input type="button" class="ubtn  umar-r10" value="查询" onclick="goodsSearch()">
                <div class="ub ub-ac umar-r10">
                    <label>  <input  type="checkbox" name="outGoods" /><span>淘汰商品</span></label>
                </div>
            </div>
        </form>

        <div class="ub umar-t10 ub-f1">
            <table id="gridArchives" ></table>
        </div>
        
        <div id="coldialog">
         <table id="gridColumn" style="width: 100%;"></table>
        </div>
    </div>
</div>
</body>
</html>