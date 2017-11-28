	<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
		<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
		<c:set var="ctx" value="${pageContext.request.contextPath}"/>

		<!DOCTYPE html>
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>打印预览</title>
		<link rel="stylesheet" href="${ctx}/static/common/printdesign/css/easyui.css" />
		<style>
		#btnPrint{
		display: inline-block;
		width: 70px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		background-color: #f2f2f2;
		border: 1px solid #ccc;
		border-radius: 4px;
		}

		#divPrint {
		margin-top: 10px;
		border: 1px solid #ccc;
		background: gray;
		<%--border:1px solid #ccc;--%>
		}

		.already-examine {
		border: 2px solid #e23d3d;
		box-shadow: 2px 2px 10px rgba(255, 0, 0, 0.3);
		color: #e23d3d;
		font-size: 20px;
		font-weight: bold;
		padding: 6px 2px;
		position: absolute;
		left: 60%;
		top: 100px;
		text-align: center;
		line-height: 20px;
		word-break: break-all;
		z-index: 1;
		border-radius: 5px;
		-webkit-transform: rotate(-20deg);
		}
		</style>
		</head>
		<body>
		<iframe id="${sheetNo}" scrolling="auto" frameborder="0" src="${ctx}/printdesign/design?page=${page}&amp;controller=${controllerUrl}&amp;template=${template}&amp;sheetNo=${sheetNo}&amp;gridFlag=PAGrid" style="width:0;height:0;"></iframe>
		<div>
		<input id="btnPrint" class='noPrint' type='button' value='打印' />
		<!-- <input id="btnExport" class='noPrint' type='button' value='导出' /> -->
		</div>
		<div>
		<%--<div class="already-examine" id="already-examine"><span>已审核</span></div>--%>
		<div id="divPrint">

		</div>
		</div>
		<script type="text/javascript">
		var rootPath="${ctx}";
		</script>

		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/jquery.min.js"></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/jquery.easyui.min.js"></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/json2.js"></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/loader.js"></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/global.js?time="+ $.now()></script>
		<link rel="stylesheet" href="${ctx}/static/common/printdesign/css/preview.css?ver=" />
		<link rel="stylesheet" href="${ctx}/static/common/printdesign/css/mediaPrint.css?ver=" >
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/easyui-lang-zh_CN.js"></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/jquery-migrate-1.1.0.js"></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/helper.js?ver="></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/jqprint.js?ver="></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/designPrint.js?ver=6"></script>

		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/control.js?ver="></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/designData.js?ver="></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/defaultData.js?ver="></script>
		<script type="text/javascript" src="${ctx}/static/common/printdesign/js/design.js?ver="></script>



		<script type="text/javascript">
		var viewName = "publicPrintPreView"
		//获取预览页签
		function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //关闭参数值
		}
		var form = getUrlParam("form");
		//打印预览
		function initPrintView(){
		//加载完成，需要执行的代码
		var ifra = form=="list"?window.frames["${sheetNo}"]:window.parent['${tabId}'];
		ifra.contentWindow.refreshPreviewOptions();
		var options = ifra.contentWindow.document;
		initHandel(options);
		}
		//直接打印
		function initHandelPrintView(){
		var ifra =window.frames["${sheetNo}"];
		ifra.contentWindow.refreshPreviewOptions();
		var options = ifra.contentWindow.document;
		initHandelprint(options);
		}

		if(form!="list"&&form!="print"){
		var options = window.parent['${tabId}'];
		initHandel(options);
		}

		function initHandel(argoptions){
		var options = argoptions;
		//设置明细列
		options.rows=${jsonDetail};

		//创建打印页
		options.isPreview = true;

		//创建预览页面
		$("#divPrint").createPages(options,${jsonReplace});

		//打印按钮点击事件
		$("#btnPrint").click(function () {
		options.isPreview = false;
		$.sheetDesignPrint(options,${jsonReplace});
		});

		/* $("#btnExport").click(function () {
		window.location.href='${ctx}${controllerUrl}'+'exportSheet?page=${page}&sheetNo=${sheetNo}';
		}); */
		}

		function initHandelprint(argoptions){
		var options = argoptions;
		//设置明细列
		options.rows=${jsonDetail};

		//创建打印页
		// options.isPreview = true;

		//创建预览页面
		// $("#divPrint").createPages(options,${jsonReplace});

		//打印按钮点击事件
		//$("#btnPrint").click(function () {
		options.isPreview = false;
		$.sheetDesignPrint(options,${jsonReplace});
		setTimeout(function(){
		window.parent.closeTab();
		},1000)

		//});
		}
		</script>
		</body>
		</html>
