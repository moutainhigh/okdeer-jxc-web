<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>价签打印</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/retail/priceprint.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">

	<div class="ub ub-ver ub-f1 upad-8">
		<div class="ub ub-ac">
			<!--buttons-->
			<div class="ubtns">
				<div class="ubtns-item" id="selectGoods" onclick="chooseproduct()">商品选择</div>
				<div class="ubtns-item" id="importsukcode" onclick="toImportproduct(0)">导入货号</div>
          		<div class="ubtns-item" id="importbarcode" onclick="toImportproduct(1)">导入条码</div>
				<div class="ubtns-item" onclick="printtable()">打印</div>
				<div class="ubtns-item" onclick="toClose()">关闭</div>

			</div>
		</div>
		<div class="uabs uatk">

			<div class="uatit">导入文件选择</div>
			<div class="uacon">
				<input class="uinp ub" id="filename" type="text" />
				<label class="ualable">选择文件<input type="file" class="uafile" value="" name="xlfile" id="xlf" /></label>
			</div>
			<div class="uabtns ">
				<button class="uabtn umar-r30"
					onclick="postelsx('pricePrint','/goods/goodsSelect')">导入</button>
				<button class="uabtn" onclick="uaclose()">取消</button>
			</div>
		</div>
		<div class="ub ub-ver umar-t12">
			<div class="ub umar-t8">
			  <div class="ub ub-ac uw-300 umar-l36">
                   <div class="umar-r10 ut-r">机构店铺:</div>
                   <div class="ub">
                       <input type="hidden" id="branchId" name="branchId" value="${branchId}"  />
                       <input class="uinp ub ub-f1" type="text" id="branchName" readonly="readonly" value=""/>
                       <div class="uinp-more" onclick="searchBranch()">...</div>
                   </div>
               </div>
				<div class="ub ub-ac">
					<div class="umar-r10 uw-100 ut-r">价签样式选择:</div>

					<select class="uselect" id="optionseletc" onChange="onChangeSelect()"name="optionseletc">
<!-- 						
						<option value="6">标准促销价签(72*32.5mm 4*6)</option>
						<option value="4">促销（85*40mm无底 1*7）</option>
						<option value="8">标准促销价签(72*32.5mm 4*6)无底</option>
						<option value="11">标准促销价签(72*32.5mm 4*6 无底色)</option> -->
						
						<option value="15">二维码价签(58*28.5mm 3*9)</option>
						 <option value="13">新标准价签(58*28.5mm 3*9)</option>
						
						<option value="12">新标准价签(72*32.5mm 4*6)</option> 
						<option value="5">标准价签(72*32.5mm 4*6)</option>
						<option value="7">标准价签(72*32.5mm 4*6)无底</option>
						<option value="1">正常（55*25mm有底 3*10）</option>
						<option value="2">正常（85*40mm有底 2*7）</option>
						<option value="3">正常（85*40mm无底 1*7）</option>
						<option value="17">二维码价签无底(60*32mm 3*9)</option>
						<option value="19">二维码价签无底(60*30mm 3*9)</option>
						<option value="21">二维码价签无底(合肥60*30mm 3*9)</option>
                        <option value="25">二维码价签无底(50*28mm 4*9)</option>
                        <option value="23">二维码价签无底2(50*28mm 4*9)</option>
					</select>
				</div>


				<div class="ub ub-ac umar-l64 jiaqType">
                    <div class="umar-r10 uw-70 ut-r">价签类型:</div>
                    <div class="ub ub-ac umar-r10">
						<label class="radioItemLable">
						   <input class="radioItem" type="radio" value="0" name="status" checked="checked" /><span>正常价签</span>
						</label>
                    </div>
                    <div class="ub ub-ac umar-r10 umar-l40">
						<label class="radioItemLable">
							<input class="radioItem" type="radio" value="1" name="status" /><span>促销价签</span>
						</label>
                    </div>
					<input type="hidden" id="priceType" name="priceType" value="0"/>
                </div>

			</div>

			<div class="ub umar-t8 umar-b8">
			
				<div class="ub ub-ac uw-288 umar-l20">
					<div class="umar-r10  ut-r">设置打印数:</div>
                    <input class="uinp uw-206 easyui-numberbox easyui-validatebox"
                           data-options="min:1,max:999999,precision:0,required:true,onChange:changeNum"
                           id="printnum" value="1"/>
				</div>
				
				<div class="ub ub-ac uw-300 umar-l58 activity unhide">
                   <div class="umar-r10 uw-70 ut-r">活动编号:</div>
                   <div class="ub">
                       <input type="hidden" id="actionId" name="actionId" value=""  />
                       <input class="uinp ub ub-f1" type="text" id="actionName" readonly="readonly" value=""/>
                       <div class="uinp-more" onclick="selectActivity()">...</div>
                   </div>
               </div>
				
				<div class="ub ub-ac uw-300 umar-l12 discount unhide">
					<div class="umar-r10 uw-100 ut-r">统一促销折扣:</div>
					<input class="uinp ub ub-f1"  type="number" onafterpaste="if(isNaN(value)|| value > 10) {execCommand('undo');this.value=''}" id="discount" />
						<div class="umar-l10">折</div>
				</div>
				
			</div>

		</div>

		<div class="ub ub-f1">
		<table id="pricePrint"></table>
		</div>
	</div>
</body>
</html>
