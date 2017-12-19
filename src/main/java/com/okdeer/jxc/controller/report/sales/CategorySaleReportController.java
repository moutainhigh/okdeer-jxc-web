package com.okdeer.jxc.controller.report.sales;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.castor.util.StringUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.rpc.RpcContext;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.report.ReportService;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.JSONUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.common.ReportController;
import com.okdeer.jxc.report.sale.CategorySaleCostQo;
import com.okdeer.jxc.report.sale.CategorySaleCostReportServiceApi;
import com.okdeer.jxc.report.sale.CategorySaleCostVo;
import com.okdeer.retail.common.price.PriceConstant;
import com.okdeer.retail.common.report.DataRecord;

@Controller
@RequestMapping("report/sale/categorySaleReport")
public class CategorySaleReportController extends ReportController {

	//@Reference(version = "1.0.0", check = false)
	@Resource
//	@Reference(version = "1.0.0", check = false)
	CategorySaleCostReportServiceApi categorySaleCostReportServiceApi;

	@RequestMapping(value = "view")
	public String view() {
		return "report/sale/categorySaleReport";
	}

	@Override
	public ReportService getReportService() {
		return categorySaleCostReportServiceApi;
	}

	@Override
	public Map<String, Object> getParam(HttpServletRequest request) {
		Map<String, Object> map = this.builderParams(request, null);
		if (!map.containsKey("branchCompleCode")) {
			map.put("branchCompleCode", this.getCurrBranchCompleCode());
		}
		return map;
	}

	@Override
	public String getFileName() {
		return null;
	}

	@Override
	public String[] getHeaders() {
		return null;
	}

	@Override
	public String[] getColumns() {
		return null;
	}

	@Override
	public void formatter(DataRecord dataRecord) {

	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getPriceAccess()
	 */
	@Override
	public Map<String, String> getPriceAccess() {
		Map<String, String> map = new HashMap<String, String>();
		map.put(PriceConstant.COST_PRICE, "profitAmount,profitRate,marginrate"); // 毛利，毛利率，毛利占比
		return map;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#reportListPage(javax.servlet.http.HttpServletRequest, java.lang.Integer, java.lang.Integer)
	 */
	@RequestMapping("reportListPageNew")
	@ResponseBody
	public PageUtils<CategorySaleCostVo> reportListPageNew(HttpServletRequest request,
			@RequestParam(value = "page", defaultValue = PAGE_NO) Integer page,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) Integer pageSize) throws ExecutionException, InterruptedException {

		Map<String, Object> map = this.builderParams(request, null);
		CategorySaleCostQo qo=	JSON.parseObject(JSON.toJSONString(map), CategorySaleCostQo.class);
		qo.setPageSize(pageSize);
		qo.setPageRow(page);
		//异步获取合计
		categorySaleCostReportServiceApi.getTotalNew(qo);
		CategorySaleCostVo total=new CategorySaleCostVo();
		Future<CategorySaleCostVo> listFuture = RpcContext.getContext().getFuture();


		List<CategorySaleCostVo> list=categorySaleCostReportServiceApi.getListPageNew(qo);
		if(!CollectionUtils.isEmpty(list)){
			List<String> categoryCodeList=new ArrayList<String>();
			Map<String,CategorySaleCostVo> saleListMap=new HashMap<String,CategorySaleCostVo>();
			for(CategorySaleCostVo vo:list){
				vo.setBeginCostAmount(BigDecimal.ZERO);
				vo.setEndCostAmount(BigDecimal.ZERO);
				categoryCodeList.add(vo.getCategoryCode());
				saleListMap.put(vo.getCategoryCode()+vo.getBranchId(), vo);
			}
			qo.setCategoryCodes(categoryCodeList);
			//异步获取期初期末
			categorySaleCostReportServiceApi.getBeginCostAmountList(qo);
			Future<List<CategorySaleCostVo>> listFuture2 = RpcContext.getContext().getFuture();

			//异步获取期末
			categorySaleCostReportServiceApi.getEndCostAmountList(qo);
			Future<List<CategorySaleCostVo>> listFuture3 = RpcContext.getContext().getFuture();

			List<CategorySaleCostVo> beginList=listFuture2.get();
			//将期初赋值
			for(CategorySaleCostVo begin:beginList){
				if(saleListMap.containsKey(begin.getCategoryCode()+begin.getBranchId())){
					CategorySaleCostVo vo=	saleListMap.get(begin.getCategoryCode()+begin.getBranchId());
					vo.setBeginCostAmount( begin.getBeginCostAmount());
				}
			}
			List<CategorySaleCostVo> endList=listFuture3.get();
			//期末赋值
			for(CategorySaleCostVo begin:endList){
				if(saleListMap.containsKey(begin.getCategoryCode()+begin.getBranchId())){
					CategorySaleCostVo vo=	saleListMap.get(begin.getCategoryCode()+begin.getBranchId());
					vo.setEndCostAmount(begin.getEndCostAmount());
				}
			}
			BigDecimal hundred=BigDecimal.valueOf(100);
			total=listFuture.get();
			//根据合计，一击期初期末，计算显示到页面数据
			for(CategorySaleCostVo vo:list){
				// 销售占比  如果合计为0，其他占比全部是100%
				if(isZeroOrNull(total.getSaleAmount())){
					vo.setSaleRate("100%");
				}else{
					//设置销售占比
					vo.setSaleRate(vo.getSaleAmount().multiply(hundred).divide(total.getSaleAmount(),BigDecimal.ROUND_HALF_UP,4 )+"%");
				}

				// 毛利占比  如果合计为0，其他占比全部是100%
				if(isZeroOrNull(total.getProfitAmount())){
					vo.setMarginrate("100%");
				}else{
					//设置销售占比
					vo.setMarginrate(vo.getProfitAmount().multiply(hundred).divide(total.getProfitAmount(),BigDecimal.ROUND_HALF_UP,4 )+"%");
				}
				//设置毛利率
				vo.setProfitRate(isZeroOrNull(vo.getSaleAmount())?"0%":vo.getProfitAmount().multiply(hundred).divide(vo.getSaleAmount(),BigDecimal.ROUND_HALF_UP,4 )+"%");
				//计算库存周转率 期间销售成本/[(期初成本+期末成本)/2]
				if(isZeroOrNull( nulltoZero(vo.getBeginCostAmount()).add(nulltoZero(vo.getEndCostAmount())))){
					vo.setSaleRotationRate("100%");
					vo.setSaleRotationDay(BigDecimal.ZERO);
				}else{
					BigDecimal saleRotationRate= vo.getSaleCostAmount().multiply(hundred).divide(nulltoZero(vo.getBeginCostAmount()).add(nulltoZero(vo.getEndCostAmount())).divide(BigDecimal.valueOf(2)),BigDecimal.ROUND_HALF_UP,4 );
					vo.setSaleRotationRate(saleRotationRate+"%");
					//计算库存周转天数 库存周转率/当前计算天数
					int diff=DateUtils.caculateDays(qo.getEndTime(), qo.getStartTime())+1;
					vo.setSaleRotationDay(isZeroOrNull( vo.getSaleCostAmount())?BigDecimal.ZERO: BigDecimal.valueOf( diff) .divide(saleRotationRate,BigDecimal.ROUND_HALF_UP,4));
				}

			}
		}
		PageUtils<CategorySaleCostVo> pageDate =new PageUtils<>(list);
		List<CategorySaleCostVo> footList=new ArrayList<CategorySaleCostVo>();
		footList.add(total);
		pageDate.setFooter(footList);
		pageDate.setTotal(total.getCount());
		return pageDate;
	}
	private BigDecimal nulltoZero(BigDecimal big){
		if(big==null){
			return BigDecimal.ZERO;
		}else{
			return big;
		}
	}
	private boolean isZeroOrNull(BigDecimal big){
		if(big==null){
			return true;
		}
		if(BigDecimal.ZERO.compareTo(big)==0){
			return true;
		}
		return false;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#exportExcel(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@RequestMapping(value = "exportExcel")
	@Override
	public void exportExcel(HttpServletRequest request, HttpServletResponse response) {

		try {
			LOG.debug("商品销售汇总导出");
			Map<String, Object> map = getParam(request);
			String reportFileName = "";
			String templateName = "";
			if (map.get("reportType") == null || StringUtils.isEmpty(map.get("reportType").toString())) {
				return;
			}
			String timeStr = StringUtil.replaceAll((String) map.get("startTime"), "-", "") + "-"
					+ StringUtil.replaceAll((String) map.get("endTime"), "-", "") + "-";
			reportFileName = "类别销售分析" + timeStr;
			if ("1".equals(map.get("reportType"))||1==Integer.parseInt(map.get("reportType").toString())) {
				templateName = "categoryBigSaleReport.xlsx";
			} else if ("2".equals(map.get("reportType"))||2==Integer.parseInt(map.get("reportType").toString())) {
				templateName = "categoryCenterSaleReport.xlsx";
			}
			if ("3".equals(map.get("reportType"))||3==Integer.parseInt(map.get("reportType").toString())) {
				templateName = "categorysmallSaleReport.xlsx";
			}
			// 模板名称，包括后缀名
			List<DataRecord> dataList = getReportService().getList(map);
			DataRecord sumRecord = categorySaleCostReportServiceApi.getTotal(map);
			if(sumRecord!=null){
				for(DataRecord  data:dataList){
					if(sumRecord.get("saleAmount")==null){
						data.put("saleRate", "0");
					}else{
						BigDecimal sumSaleAmount=(BigDecimal)sumRecord.get("saleAmount");
						BigDecimal saleAmount=(BigDecimal)data.get("saleAmount");
						data.put("saleRate",BigDecimal.ZERO.compareTo(sumSaleAmount)==0?"0%":saleAmount .divide(sumSaleAmount,BigDecimal.ROUND_HALF_UP,4).multiply(new BigDecimal("100"))+"%" );
					}

					if(sumRecord.get("profitAmount")==null){
						data.put("marginrate", "0");
					}else{
						BigDecimal sumSaleAmount=(BigDecimal)sumRecord.get("profitAmount");
						BigDecimal saleAmount=(BigDecimal)data.get("profitAmount");
						data.put("marginrate",BigDecimal.ZERO.compareTo(sumSaleAmount)==0?"0%":saleAmount.divide(sumSaleAmount,BigDecimal.ROUND_HALF_UP,4).multiply(new BigDecimal("100"))+"%" );
					}
					if(data.get("profitRate")!=null){
						data.put("profitRate", data.get("profitRate")+"%");
					}
					if(data.get("saleRotationRate")!=null){
						data.put("saleRotationRate", data.get("saleRotationRate")+"%");
					}
				}
			}
			dataList.add(sumRecord);
			cleanDataMaps(getPriceAccess(), dataList);
			exportListForXLSX(response, dataList, reportFileName, templateName);
		} catch (Exception e) {
			LOG.error("类别销售汇总导出失败",e);
		}
	}

}
