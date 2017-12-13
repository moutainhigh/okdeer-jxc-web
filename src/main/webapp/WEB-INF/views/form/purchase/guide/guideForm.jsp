<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>采购向导——条件筛选</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
     <script  src="${ctx}/static/js/views/purchase/guide/guideForm.js?V=${versionNo}"></script>
    
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4  ubor">
	<div class="ub ub-ac upad-4">
        <div class="ubtns umar-l20 umar-t10">
        	<shiro:hasPermission name="JxcPurchaseGuide:nextStep">
                <div id="btnNext" class="ubtns-item" onclick="nextStep()">下一步</div>
            </shiro:hasPermission>
            <div class="ubtns-item" onclick="clearForm()">重置</div>
			<div class="ubtns-item" onclick="toClose()">关闭</div>
        </div>
    </div>
    <input type="hidden" name="formData" id="formData" value='${formData}' />
    <form id="addForm" action="" method="post">
    <div class="ub ub-ver umar-l20">
    	<div class="ub umar-t20">
    			<div class="ub ub-ac uw-516">
					<div class="umar-r10 uw-70 ut-r">采购机构:</div>
					<input type="hidden" id="branchId" name="branchId" />
					<input type="hidden" id="branchCode" name="branchCode" />
					<input type="hidden" id="branchCompleCode" name="branchCompleCode" />
					<input type="hidden" id="branchType" name="branchType" />
					<input type="hidden" id="branchParentId" name="branchParentId" />
					<input class="uinp ub ub-f1 easyui-validatebox" type="text" id="branchCodeName" name="branchCodeName" 
						maxlength="50" readOnly data-options="required:true" onclick="selectBranches()" />
					<div class="uinp-more" onclick="selectBranches()" >...</div>

				</div>
				<div class="umar-l4"><i class="uc-red">*</i></div>
    	</div>
    	
    	<div class="ub umar-t20">
    		<div class="ub ub-ac uw-516" id="categorySelect">
					<div class="umar-r10 uw-70 ut-r">商品类别:</div>
					<input type="hidden" id="categoryCode" name="categoryCode" />
					<input class="uinp ub ub-f1" type="text" id="categoryCodeName" name="categoryCodeName" maxlength="50"/>
					<div class="uinp-more">...</div>
				</div>
    	</div>
    	
    	<div class="ub umar-t20">
    	    	<div class="ub ub-ac uw-516" id="supplierComponent">
					<div class="umar-r10 uw-70 ut-r">供应商:</div>
					<input type="hidden" id="supplierId" name="supplierId" />
					<input class="uinp ub ub-f1" type="text" id="supplierCodeName" name="supplierCodeName" maxlength="50"/>
					<div class="uinp-more" >...</div>
				</div>
    	</div>
    	
    	<div class="ub umar-t20">
	    	<div class="ub ub-ac uw-516">
					<div class="umar-r10 uw-70 ut-r">要货日期:</div>

					<input class="Wdate uw-300 uinp-no-more"  readonly="readonly" disabled="disabled" name="startTime" id="startTime" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endTime\');}'})" />
					&nbsp;至&nbsp;
                    <input class="Wdate uw-300 uinp-no-more"  readonly="readonly" disabled="disabled" name="endTime" id="endTime" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'startTime\');}',maxDate:'%y-%M-%d'})" />
					<i class="uc-red">*</i>
					<div class="umar-l20">
						<label><input type="checkbox" id="ignore" disabled="disabled">统计已经执行过向导的要货单</label>
					</div>
			</div>
    	</div>
    	
    	<input type="hidden" id="guideType" name="guideType" value="1">
    	<div class="ub umar-t20">
    		<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">选择模式:</div>
					<label><input type="radio" class="radioItem" name="guideType" value="1" checked>[常规商品]按库存存量指标采购</label>
			</div>

			
    	</div>
    	<div class="ub">
		<div class="ub ub-ac">
			<div class="umar-r10 uw-70 ut-r"></div>
			<label class="uc-blue">按采购机构的设置的库存存量指标采购，统计库存低于存量指标下限的商品，并按指标上限与进货规格给出订货数量建议。</label>
			<br/>
			<label class="uc-blue">订货数量 ＝ 存量指标上限－当前库存，取进货规格整数倍（大于订货数量的值）</label>
			</div>
		</div>
    	
    	<div class="ub umar-t20">
			<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r"></div>
					<label><input type="radio" class="radioItem" name="guideType" value="2">[常规商品]按安全库存采购</label>	
			</div>
		</div>
		<div class="ub">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-70 ut-r"></div>
				<label class="uc-blue">按订货周期，安全库存系数与机构出库数（销售或配送）统计建议订货数据。</label>
				<br/>
				<label class="uc-blue">订货数量＝订货周期*安全系数*MAX（上周日均销量，前周日均销量）－当前库存，取进货规格整数倍（大于订货数量的值）</label>   
			</div>
		</div>
		
    	<div class="ub umar-t20">
			<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r"></div>
					<label><input type="radio" class="radioItem" name="guideType" value="3">[常规商品]按门店要货单采购</label>	
			</div>
		</div>
		
		<div class="ub">
		<div class="ub ub-ac">
			<div class="umar-r10 uw-70 ut-r"></div>
				<label class="uc-blue">按各门店要货数量汇总进行采购。</label>
				<br/>
				<label class="uc-blue">订货数量＝ 门店要货总数，取进货规格整数倍（大于订货数量的值）</label>
			</div>
		</div>
		
 		<div class="ub umar-t20">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-70 ut-r"></div>
				<label><input type="radio" class="radioItem" name="guideType" value="4">[直送商品]按门店直送要货单汇总采购</label>
			</div>
		</div>
		
		<div class="ub">
		<div class="ub ub-ac">
			<div class="umar-r10 uw-70 ut-r"></div>
				<label class="uc-blue">按各门店直送要货数量汇总进行采购。</label>
				<br/>
				<label class="uc-blue">订货数量＝ 门店直送要货总数，取进货规格整数倍（大于订货数量的值）</label>
			</div>
		</div>
		
		<div class="ub umar-t20">
			<div class="ub ub-ac">
				<div class="umar-r10 uw-70 ut-r"></div>
				<label><input type="radio" class="radioItem" name="guideType" value="5">[直送商品]按门店直送要货单分别采购(按门店生成订货)</label>
			</div>
		</div>
		
		<div class="ub">
		<div class="ub ub-ac">
			<div class="umar-r10 uw-70 ut-r"></div>
				<label class="uc-blue">将门店的直送要货单按供应商分解成各个供应商的订单，且订单指定送货地点为门店。</label>
				<br/>
				<label class="uc-blue">订货数量＝ 门店直送要货数量，取进货规格整数倍（大于订货数量的值）</label>
			</div>
		</div>
	
    </div>
    </form>
    
	</div>
</body>
</html>