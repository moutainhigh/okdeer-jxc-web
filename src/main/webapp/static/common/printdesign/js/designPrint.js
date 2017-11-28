(function ($) {
    $.fn.createPages = function(options,jsonReplace) {
        debugger;
    	//明细列头
        function createThead(jqPage, columns) {
            if (isPreview) jqPage = jqPage.find(".work");
            var thead = $("<thead></thead>");
            var hTr = $("<tr></tr>").appendTo(thead);
            var totalWidth = 0;
            for (var i = 0; i < columns.length; i++) {
                var col = columns[i];
                totalWidth += col.width;
                if (totalWidth > jqPage.innerWidth()) {
                	break;	
                }
                printColumns.push(col);
                var th = $("<th></th>").appendTo(hTr);
                th.attr("field", col.field);
                th.html(col.title);
                th.css("width", col.width + "px");
                if (col.halign && col.halign != "") {
                    th.css("text-align", col.halign);
                }
            }
            return thead;
        }

        function createPage(jqPageTemp) {

            var jq = jqPageTemp.clone();
            if (!isPreview) {
                jq = jq.find(".work");
                jq.empty();
            } else {
                jq.find(".work").empty();
            }
            // var height = $(window).height()*(5/6);
            jq.css({ top: "0px", left: "0px"});
            currentPage = jq;
            currentPageNo += 1;
            if(jsonReplace.isViewStatus && jsonReplace.isViewStatus == "1"){
                insertStatus(jq);
            }

            return jq;
        }

        function createPrint(headMode, footMode, jqPageTemp, jqHead, jqFoot, jqThead, columns, rs) {
            var jqPrint = $(that);
            var printFoot = footMode != "notPrint";

            
            //处理首页
            var page = createPage(jqPageTemp).appendTo(jqPrint);
            if (!insertHead(page, jqHead)) {
            	return null;	
            }
            if (!insertDetail(page, jqThead)) {
            	return null;	
            }

            var hasFoot = false;
            if (printFoot && footMode == "perPage") {
            	hasFoot = true;	
            }

            //处理明细行及表尾
            if (headMode == "perPage") {
                var i = 0;
                while (i < rows.length) {
                    var row = rows[i];
                    if (!insertRow(page, hasFoot, jqFoot, columns, row)) {
                        if (!page.find("tbody tr").length) {
                        	return null;
                        }
                        if (hasFoot){
                        	insertFoot(page, jqFoot);
                        }
                        createPageBreak().appendTo(jqPrint);
                        page = createPage(jqPageTemp).appendTo(jqPrint);
                        if (!insertHead(page, jqHead)) {
                        	return null;	
                        }
                        if (!insertDetail(page, jqThead)){
                        	return null;
                        }
                        continue;
                    }
                    i++;
                }

                if (printFoot) {
                    if (!insertFoot(page, jqFoot)) {
                        createPageBreak().appendTo(jqPrint);
                        page = createPage(jqPageTemp).appendTo(jqPrint);
                        insertFoot(page, jqFoot);
                    }

                    var f = page.find(".foot");
                    if (footMode == "lastPageByBottom") {
                        f.css({ position: "absolute", bottom: "0px" });
                    }
                }

                newPageEvent();
            }
            else {
                var i = 0;
                while (i < rows.length) {
                    var row = rows[i];
                    if (!insertRow(page, hasFoot, jqFoot, columns, row)) {
                        if (!page.find("tbody tr").length) return null;
                        if (hasFoot) insertFoot(page, jqFoot);
                        createPageBreak().appendTo(jqPrint);
                        page = createPage(jqPageTemp).appendTo(jqPrint);                       
                        if (!insertDetail(page, jqThead)) return null;
                        continue;
                    }
                    i++;
                }

                if (printFoot) {
                    if (!insertFoot(page, jqFoot)) {
                        createPageBreak().appendTo(jqPrint);
                        page = createPage(jqPageTemp).appendTo(jqPrint);                       
                        insertFoot(page, jqFoot);
                    }

                    var f = page.find(".foot");

                    if (footMode == "lastPageByBottom") {
                        f.css({ position: "absolute", bottom: "0px" });
                    }

                    newPageEvent();
                }
            }

            return jqPrint;
        }

        function insertHead(jqPage, jqHead) {
            if (isPreview) {
            	jqPage = jqPage.find(".work");	
            }
            var h = jqHead.clone().appendTo(jqPage);
            if (h.outerHeight(true) > getPrintPageSizeWithMargin(jqPage).height) {
                h.remove();
                return false;
            }
            return true;
        }

        function insertDetail(jqPage, jqThead) {

            function insertTable(jqThead) {
                var tbl = $("<table border='1'></table>");
                tbl.css("line-height", rowHeight + "px");
                tbl.css("border-collapse", "collapse");
                //tbl.css("width", jqPage.innerWidth() + "px");
                tbl.css("table-layout", "fixed ");
                tbl.css("font-size", detailSetting.fontSize);
                jqThead.clone().appendTo(tbl);
                $("<tbody></tbody>").appendTo(tbl);
                tbl.appendTo(d);
            }

            if (isPreview) jqPage = jqPage.find(".work");
            
            var d = $("<div class='detail' style='position:relative;'></div>").appendTo(jqPage);
            insertTable(jqThead);
            if (d.position().top + d.outerHeight(true) > getPrintPageSizeWithMargin(jqPage).height) {
                d.remove();
                return false;
            }
            return true;
        }

        function insertStatus(jqPage){
            if (isPreview) jqPage = jqPage.find(".work");
            var already_examine = $("<div  id='already-examine'><span>已审核</span></div>")
            already_examine.css("color", "#e23d3d");
            already_examine.css("font-size", "20px");
            already_examine.css("font-weight", "bold ");
            already_examine.css("line-height", "20px");
            already_examine.css("border", "2px solid #e23d3d");
            already_examine.css("box-shadow", "2px 2px 10px rgba(255, 0, 0, 0.3)");
            already_examine.css("padding", "6px 2px ");
            already_examine.css("position", "absolute");
            already_examine.css("left", "60%");
            already_examine.css("top", "20px");
            already_examine.css("transform", "rotate(-20deg)");
            already_examine.css("-ms-transform", "rotate(-20deg)");
            already_examine.css("-moz-transform", "rotate(-20deg)");
            already_examine.css("-o-transform", "rotate(-20deg)");
            already_examine.css("webkit-transform", "rotate(-20deg)");
            already_examine.appendTo(jqPage);

            return true;
        }

        //插入行
        function insertRow(jqPage, hasFoot, jqFoot, columns, row) {
            function createTr(columns, row) {
                var tr = $("<tr></tr>");
                var fmt = undefined;
                var val = undefined;
                for (var i = 0; i < columns.length; i++) {
                    var col = columns[i];
                    var field = col.field;
                    var td = $("<td></td>");
                    td.css("overflow", "hidden");
                    td.css("white-space", "nowrap");
                    td.css("text-overflow", "ellipsis");
                    if (col.align && col.align != "") {
                        td.css("text-align", col.align);
                    }
                    val = row[field];
                    if (fieldFormatters && col.formatter != "") {
                        fmt = fieldFormatters[col.formatter]
                        if (fmt) {
                            val = fmt(row[field], row);
                        }                        
                    }
                    if(col.title=="箱数"||col.title=="数量"||col.title=="金额"||col.title=="税率"||col.title=="税额"||col.title=="单价"){
                    	val = parseFloat(val||0).toFixed(2);  
                    }
                    if(col.title=="成本价" && (i < row.length - 1 || val != null)){
                    	// 最后一条记录为空，认为是空的合计数据，不做格式化
                    	val = parseFloat(val||0).toFixed(2);                    	
                    }
                    if(col.title=="进价"){
                    	var page = $.helper.getUrlVar('page');
                    	var fixed = 2;
                    	if(page==='PASheet'||page==='PISheet'||page==='PRSheet'||page==='PMSheet'){
                    		fixed = 4;
                    	}
                    	val = parseFloat(val||0).toFixed(fixed);
                    }
                    td.html(val);
                    td.appendTo(tr);
                }
                return tr;
            }
                       
            if (isPreview) {
            	jqPage = jqPage.find(".work");	
            }
            var tbody = jqPage.find("tbody");
            var tr = createTr(columns, row).appendTo(tbody);
            
            var d = jqPage.find(".detail");
            var h = d.position().top + d.outerHeight(true);
            if (hasFoot) h += jqFoot.outerHeight(true);
            if (h > getPrintPageSizeWithMargin(jqPage).height) {
                tr.remove();
                return false;
            }
            return true;
        }

        function insertFoot(jqPage, jqFoot) {
            if (isPreview) jqPage = jqPage.find(".work");
            var f = jqFoot.clone().appendTo(jqPage);
            if (f.position().top + f.outerHeight(true) > getPrintPageSizeWithMargin(jqPage).height) {
                f.remove();
                return false;
            }
            return true;
        }

        function createPageBreak() {
            newPageEvent();
            var pBreak = $("<div></div>");
            pBreak.addClass(pageBreak);
            return pBreak;
        }

        function getPrintPageSizeWithMargin(jqPage) {           
            var h = jqPage.height();
            var w = jqPage.width();
            // var h = $(window).height()*(5/6);
            return { height: h, width: w };
        }

        function getColumns(designColumns, grantColumns) {
        	return designColumns;
        	//TODO 权限处理，本期字段不做权限控制，预留
            /*var cols = [];
            for (var i = 0; i < designColumns.length; i++) {
                var dCol = designColumns[i];
                if (dCol.hidden) {
                	continue;	
                }
                for (var j = 0; j < grantColumns.length; j++) {
                    var gCol = grantColumns[j];
                    if (gCol.field == dCol.field) {
                        cols.push(dCol);
                        break;
                    }
                }
            }*/
            return cols;
        }

        //触发新增页事件
        function newPageEvent() {
            if (onNewPage && $.isFunction(onNewPage)) {
                onNewPage.call(currentPage[0], currentPageNo);
            }
        }
        
        options = options || {}; //sheetSetting, jqPage, rowHeight, pageBreak, headReplace, columns, rows, footReplace

        if (!options.jqPage) {
        	return;	
        }        

        var that = this;
        var rowHeight = options.rowHeight || 21;
        var pageBreak = "pageBreak";
        var designColumns = options.designColumns || []; //模板设计明细列信息（包含权限控制的列）
        var grantColumns = options.grantColumns || [];  //只包含当前用户有权限的明细列信息
        var columns = undefined;  //模板设计列和权限控制列的整合
        var fieldFormatters = options.fieldFormatters;
        var rows = options.rows || [];
        var jqPage = options.jqPage.clone();
       
        var isPreview = options.isPreview;
        if (isPreview == undefined) isPreview = false;
        var onNewPage = options.onNewPage;
        var printColumns = [];
        var currentPage = undefined; //当前页
        var currentPageNo = 0; //当前页码

        //处理占位
        /*if (options.holderHandler && $.isFunction(options.holderHandler)) {
            var strTemp = jqPage.html();
            strTemp = options.holderHandler(strTemp);
            jqPage.html(strTemp);
        }*/
        var strTemp = jqPage.html();
        $.each(jsonReplace,function(key,value) {
        	strTemp = strTemp.replace(new RegExp(key,'g'), value);
        });
        jqPage.html(strTemp);
        
        //处理明细列
        columns = getColumns(designColumns, grantColumns);
        var printSetting = options.printSetting || {};
        var sheetSetting = printSetting.sheetSetting || { head: "perPage", foot: "perPage" };
        var paperSetting = printSetting.paperSetting || {
            paper: {
                id: "A4",
                name: "A4",
                isSYS: true,
                size: { width: 210, height: 297 },
                margin: { left: 10, top: 10, right: 10, bottom: 10 },
                unit: "mm"
            }
        };
        var detailSetting = printSetting.detailSetting || { fontSize: "10pt" };

        var head = sheetSetting.head;        
        var foot = sheetSetting.foot;

        var jqHead = jqPage.find(".head"); //单据头
        var jqFoot = jqPage.find(".foot"); //单据尾      
        var jqThead = createThead(jqPage, columns); //明细列头        

        var jqRet = createPrint(head, foot, jqPage, jqHead, jqFoot, jqThead, printColumns, rows);               
        
        return jqRet;
    }

    //进行打印
    $.sheetDesignPrint = function (options,jsonReplace) {
        if (options.isDemo && !options.printDemoUse ){
            $.helper.infoAlert("演示版状态下,不支持打印功能！");
            return;
        }
        
        var printSetting = options.printSetting || {};
        var paperSetting = printSetting.paperSetting || {
            paper: {
                id: "A4",
                name: "A4",
                isSYS: true,
                size: { width: 210, height: 297 }
            },
            margin: { left: 10, top: 10, right: 10, bottom: 10 },
            unit: "mm"
        };
        
        var size = undefined;
        var layout = paperSetting.layout;
        var paper = paperSetting.paper;
        var margin = paperSetting.margin;
        var marginLeft = 'margin-left:';
        var marginRight = 'margin-right:';
        var marginTop = 'margin-top:';
        var marginBottom = 'margin-bottom:';
        
        if (paper.isSYS) {
            size = paper.id;
        } else {
            var w = paper.size.width;
            var h = paper.size.height;
            if (paperSetting.unit == "mm") {
                w = paper.size.width / 25.4;
                h = paper.size.height / 25.4;
                // h = $(window).height()*(5/6);
            }
            size = w + "in " + h + "in";
        }

        var m_left = margin.left;
        var m_right = margin.right;
        var m_top = margin.top;
        var m_bottom = margin.bottom;

        if (paperSetting.unit == "mm") {
            m_left = m_left / 25.4;
            m_right = m_right / 25.4;
            m_top = m_top / 25.4;
            m_bottom = m_bottom / 25.4;
        }

        marginLeft = marginLeft + m_left + "in";
        marginRight = marginRight + m_right + "in";
        marginTop = marginTop + m_top + "in";
        marginBottom = marginBottom + m_bottom + "in";
        
        var jqRet = $("<div style='position:relative;top:-100000px;left:-100000px;'></div>").appendTo("body");
        jqRet.createPages(options,jsonReplace);

        var printOpts = {
            css: "<style> @page{ size: " + size + " " + layout + ";" + marginLeft + ";" + marginRight + ";" + marginTop + ";" + marginBottom + ";" + "}</style>"
        };
       
        var t = jqRet.clone();
        
        t.css({ top: "", left: "" });
        t.jqprint(printOpts);
        jqRet.remove();

        if (options.onPrint && $.isFunction(options.onPrint)) {
            options.onPrint();
        }
    }    
})(jQuery);