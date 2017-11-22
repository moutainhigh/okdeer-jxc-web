/**
 * easyui datagrid 拖拽插件
 * datagrid-dnd.js与datagrid.defaults.editors存在兼容性问题
 * 该插件仿照datagrid-dnd.js编写并修改了onBeforeDrag事件。
 * @param $
 */
(function($){
	$.extend($.fn.datagrid.defaults, {
		onBeforeDrag: function(row){},	// return false to deny drag
		onStartDrag: function(row){},
		onStopDrag: function(row){},
		onDragEnter: function(targetRow, sourceRow){},	// return false to deny drop
		onDragOver: function(targetRow, sourceRow){},	// return false to deny drop
		onDragLeave: function(targetRow, sourceRow){},
		onBeforeDrop: function(targetRow, sourceRow, point){},
		onDrop: function(targetRow, sourceRow, point){},	// point:'append','top','bottom'
	});
	
	$.extend($.fn.datagrid.methods, {
		enableDnd: function(jq, index){
			return jq.each(function(){
				var target = this;
				var state = $.data(this, 'datagrid');
				state.disabledRows = [];
				var dg = $(this);
				var opts = state.options;
				if (index != undefined){
					var trs = opts.finder.getTr(this, index);
				} else {
					var trs = opts.finder.getTr(this, 0, 'allbody');
				}
				trs.draggable({
					disabled: false,
					revert: true,
					cursor: 'pointer',
					proxy: function(source) {
						var index = $(source).attr('datagrid-row-index');
						var tr1 = opts.finder.getTr(target, index, 'body', 1);
						var tr2 = opts.finder.getTr(target, index, 'body', 2);
						var p = $('<div style="z-index:9999999999999"></div>').appendTo('body');
						tr2.clone().removeAttr('id').removeClass('droppable').appendTo(p);
						tr1.clone().removeAttr('id').removeClass('droppable').find('td').insertBefore(p.find('td:first'));
						$('<td><span class="tree-dnd-icon tree-dnd-no" style="position:static">&nbsp;</span></td>').insertBefore(p.find('td:first'));
						p.find('td').css('vertical-align','middle');
						p.hide();
						return p;
					},
					deltaX: 15,
					deltaY: 15,
					onBeforeDrag:function(e){
						// 获取点击的行
						var trs =  opts.finder.getTr(target, $(this).attr('datagrid-row-index'));
						// 是否显示行号
						var rownumbers = dg.datagrid("options").rownumbers;
						// 显示行号时，内容trs存在2条记录，第2条为数据。不显示行号时值存在1条记录。
						var trIndex = rownumbers ? 1 : 0;
						// 数据行对象
						var tr = trs[trIndex];
						
						// 事件触发行X
						var trX = trs.offset().left;
						// 显示行号时，trX向左偏移35px
						if(rownumbers){
							trX = trX + 35;
						}
						// 行索引
						var rowIndex = tr.rowIndex;
						// 行宽度
						var trw = $(tr).width();
						
						// 所有列
						var tds = $(tr).find('td');
						// 前面所有列的宽度
						var frontTotalWidth = 0;
						var lastSelectField = '';
						$.each(tds,function(tdIndex,td){
							var startX = e.data.startX;
							var tdw = $(td).width()+1;
							var field = $(td).attr('field');
							// 事件触发行+前面所有列的宽度 < 事件触发点 < 事件触发行+前面所有列的宽度+当前列的宽度
							if (field && startX > trX + frontTotalWidth && startX < (trX + frontTotalWidth + tdw)) {
								// 结束编辑
								var rows = dg.datagrid("getRows");
								// 当前行有多少个editor,等于0表示首次编辑
								var editorCount = dg.datagrid('getEditors',rowIndex).length;
								if(editorCount == 0){
									// 选中行
									dg.datagrid('selectRow', rowIndex);
									// 开始编辑行
									dg.datagrid('beginEdit', rowIndex);
								}
								// 其他列结束编辑
								$.each(rows,function(i,item){
									if(rowIndex != i){
										dg.datagrid('endEdit',i);
									}
								});
								
								// 获取editor对象
								var editor = dg.datagrid('getEditor', {"index" : rowIndex, "field" : field});
								if(editor && editor.target){
									// 编辑器获取焦点及选中文本
							        setTimeout(function(){
							        	$(editor.target).textbox('textbox').focus();
							        	$(editor.target).textbox('textbox').select();
									    // 回车结束编辑
							        	if(editorCount == 0){
							        		$('.datagrid-editable .textbox,.datagrid-editable .datagrid-editable-input,.datagrid-editable .textbox-text').bind('keyup', function(e1){
										        var code = e1.keyCode || e1.which;
										        if (code == 13) {
										        	// 结束编辑
										        	dg.datagrid('acceptChanges');
										        }
										    });
							        	}
							        },10);
								}
								return false;
							}
							if(field){
								frontTotalWidth += tdw;
							}
						});
						
						if (opts.onBeforeDrag.call(target, getRow(this)) == false){return false;}
						if ($(e.target).parent().hasClass('datagrid-cell-check')){return false;}
						if (e.which != 1){return false;}
						opts.finder.getTr(target, $(this).attr('datagrid-row-index')).droppable({accept:'no-accept'});
					},
					onStartDrag: function() {
						$(this).draggable('proxy').css({
							left: -10000,
							top: -10000
						});
			        	var row = getRow(this);
						opts.onStartDrag.call(target, row);
						state.draggingRow = row;
					},
					onDrag: function(e) {
						var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
						var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
						if (d>3){	// when drag a little distance, show the proxy object
							$(this).draggable('proxy').show();
							var tr = opts.finder.getTr(target, parseInt($(this).attr('datagrid-row-index')), 'body');
							$.extend(e.data, {
								startX: tr.offset().left,
								startY: tr.offset().top,
								offsetWidth: 0,
								offsetHeight: 0
							});
						}
						this.pageY = e.pageY;
					},
					onStopDrag:function(){
						for(var i=0; i<state.disabledRows.length; i++){
							var index = dg.datagrid('getRowIndex', state.disabledRows[i]);
							if (index >= 0){
								opts.finder.getTr(target, index).droppable('enable');
							}
						}
						state.disabledRows = [];
						var index = dg.datagrid('getRowIndex', state.draggingRow);
						dg.datagrid('enableDnd', index);
						opts.onStopDrag.call(target, state.draggingRow);
					}
				}).droppable({
					accept: 'tr.datagrid-row',
					onDragEnter: function(e, source){
						if (opts.onDragEnter.call(target, getRow(this), getRow(source)) == false){
							allowDrop(source, false);
							var tr = opts.finder.getTr(target, $(this).attr('datagrid-row-index'));
							tr.find('td').css('border', '');
							tr.droppable('disable');
							state.disabledRows.push(getRow(this));
						}
					},
					onDragOver: function(e, source) {
						var targetRow = getRow(this);
						if ($.inArray(targetRow, state.disabledRows) >= 0){return;}
						var pageY = source.pageY;
						var top = $(this).offset().top;
						var bottom = top + $(this).outerHeight();
						
						allowDrop(source, true);
						var tr = opts.finder.getTr(target, $(this).attr('datagrid-row-index'));
						tr.children('td').css('border','');
						if (pageY > top + (bottom - top) / 2) {
							tr.children('td').css('border-bottom','1px solid red');
						} else {
							tr.children('td').css('border-top','1px solid red');
						}
						
						// 拖拽区域与非冻结区域隔离，不可相互拖拽
						if(getRow(source).frozen != targetRow.frozen){
							allowDrop(source, false);
							tr.find('td').css('border', '');
							tr.droppable('disable');
							return;
						}
						
						if (opts.onDragOver.call(target, targetRow, getRow(source)) == false){
							allowDrop(source, false);
							tr.find('td').css('border', '');
							tr.droppable('disable');
							state.disabledRows.push(targetRow);
						}
					},
					onDragLeave: function(e, source) {
						allowDrop(source, false);
						var tr = opts.finder.getTr(target, $(this).attr('datagrid-row-index'));
						tr.children('td').css('border','');
						opts.onDragLeave.call(target, getRow(this), getRow(source));
					},
					onDrop: function(e, source) {
						var sourceIndex = parseInt($(source).attr('datagrid-row-index'));
						var destIndex = parseInt($(this).attr('datagrid-row-index'));
						
						var tr = opts.finder.getTr(target, $(this).attr('datagrid-row-index'));
						var td = tr.children('td');
						var point =  parseInt(td.css('border-top-width')) ? 'top' : 'bottom';
						td.css('border','');
						
						var rows = dg.datagrid('getRows');
						var dRow = rows[destIndex];
						var sRow = rows[sourceIndex];
						if (opts.onBeforeDrop.call(target, dRow, sRow, point) == false){
							return;
						}
						insert();
						opts.onDrop.call(target, dRow, sRow, point);
						
						function insert(){
							var row = $(target).datagrid('getRows')[sourceIndex];
							var index = 0;
							if (point == 'top'){
								index = destIndex;
							} else {
								index = destIndex+1;
							}
							if (index < sourceIndex){
								dg.datagrid('deleteRow', sourceIndex).datagrid('insertRow', {
									index: index,
									row: row
								});
								dg.datagrid('enableDnd', index);
							} else {
								dg.datagrid('insertRow', {
									index: index,
									row: row
								}).datagrid('deleteRow', sourceIndex);
								dg.datagrid('enableDnd', index-1);
							}
						}
					}
				});
				
				function allowDrop(source, allowed){
					var icon = $(source).draggable('proxy').find('span.tree-dnd-icon');
					icon.removeClass('tree-dnd-yes tree-dnd-no').addClass(allowed ? 'tree-dnd-yes' : 'tree-dnd-no');
				}
				function getRow(tr){
					return opts.finder.getRow(target, $(tr));
				}
			});
		}
		
	});
})(jQuery);
