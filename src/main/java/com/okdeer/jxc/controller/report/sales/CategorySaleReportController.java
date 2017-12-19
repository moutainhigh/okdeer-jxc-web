package com.okdeer.jxc.controller.report.sales;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.castor.util.StringUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.report.ReportService;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.common.ReportController;
import com.okdeer.jxc.report.sale.CategorySaleCostReportServiceApi;
import com.okdeer.retail.common.price.PriceConstant;
import com.okdeer.retail.common.report.DataRecord;

@Controller
@RequestMapping("report/sale/categorySaleReport")
public class CategorySaleReportController extends ReportController {

	@Reference(version = "1.0.0", check = false)
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
	@RequestMapping("reportListPageNew")
	@ResponseBody
	public PageUtils<DataRecord> reportListPageNew(HttpServletRequest request,
												@RequestParam(value = "page", defaultValue = PAGE_NO) Integer page,
												@RequestParam(value = "rows", defaultValue = PAGE_SIZE) Integer rows) throws ExecutionException, InterruptedException {
		return super.reportListPage(request, page, rows);
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
