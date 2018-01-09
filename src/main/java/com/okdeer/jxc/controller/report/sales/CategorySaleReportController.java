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
import com.okdeer.jxc.controller.common.ReportController;
import com.okdeer.jxc.report.sale.CategorySaleCostQo;
import com.okdeer.jxc.report.sale.CategorySaleCostReportServiceApi;
import com.okdeer.jxc.report.sale.CategorySaleCostVo;
import com.okdeer.retail.common.page.EasyUIPageInfo;
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
	public EasyUIPageInfo<CategorySaleCostVo> reportListPageNew(HttpServletRequest request,
			@RequestParam(value = "page", defaultValue = PAGE_NO) Integer page,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) Integer rows) throws ExecutionException,
			InterruptedException {
		// return super.reportListPage(request, page, rows);

		Map<String, Object> map = this.builderParams(request, null);
		CategorySaleCostQo qo = JSON.parseObject(JSON.toJSONString(map), CategorySaleCostQo.class);
		qo.setPageSize(rows);
		qo.setPageRow(page);
		// 异步获取合计
		CategorySaleCostVo total;
		EasyUIPageInfo<CategorySaleCostVo> pageData = categorySaleCostReportServiceApi.getListPageNew(qo);
		if (CollectionUtils.isEmpty(pageData.getFooter())) {
			total = new CategorySaleCostVo();
		} else {
			total = pageData.getFooter().get(0);
		}
		try {
			List<CategorySaleCostVo> list = pageData.getList();
			if (!CollectionUtils.isEmpty(list)) {
				List<String> categoryCodeList = new ArrayList<String>();
				Map<String, CategorySaleCostVo> saleListMap = new HashMap<String, CategorySaleCostVo>();
				for (CategorySaleCostVo vo : list) {
					vo.setBeginCostAmount(BigDecimal.ZERO);
					vo.setEndCostAmount(BigDecimal.ZERO);
					categoryCodeList.add(vo.getCategoryCode());
					saleListMap.put(vo.getCategoryCode() + vo.getBranchId(), vo);
				}
				BigDecimal hundred = BigDecimal.valueOf(100);
				// 根据合计，一击期初期末，计算显示到页面数据
				for (CategorySaleCostVo vo : list) {
					// 销售占比 如果合计为0，其他占比全部是100%
					if (isZeroOrNull(total.getSaleAmount())) {
						vo.setSaleRate("100%");
					} else {
						// 设置销售占比
						vo.setSaleRate(vo.getSaleAmount().multiply(hundred)
								.divide(total.getSaleAmount(), BigDecimal.ROUND_HALF_UP, 4)
								+ "%");
					}

					// 毛利占比 如果合计为0，其他占比全部是100%
					if (isZeroOrNull(total.getProfitAmount())) {
						vo.setMarginrate("100%");
					} else {
						// 设置销售占比
						vo.setMarginrate(vo.getProfitAmount().multiply(hundred)
								.divide(total.getProfitAmount(), BigDecimal.ROUND_HALF_UP, 4)
								+ "%");
					}
					// 设置毛利率
					vo.setProfitRate(isZeroOrNull(vo.getSaleAmount()) ? "0%" : vo.getProfitAmount().multiply(hundred)
							.divide(vo.getSaleAmount(), BigDecimal.ROUND_HALF_UP, 4)
							+ "%");
					// 计算库存周转率 期间销售成本/[(期初成本+期末成本)/2]
				}
			}
			return pageData;
		} catch (Exception e) {
			LOG.error("类别销售汇总查询出现异常：{}", e);
			return null;
		}
	}

	private boolean isZeroOrNull(BigDecimal big) {
		if (big == null) {
			return true;
		}
		if (BigDecimal.ZERO.compareTo(big) == 0) {
			return true;
		}
		return false;
	}

	private BigDecimal nulltoZero(BigDecimal big) {
		if (big == null) {
			return BigDecimal.ZERO;
		} else {
			return big;
		}
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
		Map<String, Object> map = this.builderParams(request, null);
		CategorySaleCostQo qo = JSON.parseObject(JSON.toJSONString(map), CategorySaleCostQo.class);
		// 获取合计金额，合计只是用来计算 占比，导出不显示
		CategorySaleCostVo total = categorySaleCostReportServiceApi.getTotalNew(qo);

		BigDecimal sumXsNum = BigDecimal.ZERO;
		BigDecimal sumXsAmount = BigDecimal.ZERO;
		BigDecimal sumProfitAmount = BigDecimal.ZERO;

		// Future<CategorySaleCostVo> listFuture =
		// RpcContext.getContext().getFuture();
		List<CategorySaleCostVo> list = categorySaleCostReportServiceApi.getListNew(qo);
		try {
			if (!CollectionUtils.isEmpty(list)) {
				List<String> categoryCodeList = new ArrayList<String>();
				Map<String, CategorySaleCostVo> saleListMap = new HashMap<String, CategorySaleCostVo>();
				for (CategorySaleCostVo vo : list) {
					vo.setBeginCostAmount(BigDecimal.ZERO);
					vo.setEndCostAmount(BigDecimal.ZERO);
					categoryCodeList.add(vo.getCategoryCode());
					saleListMap.put(vo.getCategoryCode() + vo.getBranchId(), vo);
				}
				BigDecimal hundred = BigDecimal.valueOf(100);
				// 根据合计，一击期初期末，计算显示到页面数据
				for (CategorySaleCostVo vo : list) {
					// 销售占比 如果合计为0，其他占比全部是100%
					if (isZeroOrNull(total.getSaleAmount())) {
						vo.setSaleRate("100%");
					} else {
						// 设置销售占比
						vo.setSaleRate(vo.getSaleAmount().multiply(hundred)
								.divide(total.getSaleAmount(), BigDecimal.ROUND_HALF_UP, 4)
								+ "%");
					}
					// 毛利占比 如果合计为0，其他占比全部是100%
					if (isZeroOrNull(total.getProfitAmount())) {
						vo.setMarginrate("100%");
					} else {
						// 设置销售占比
						vo.setMarginrate(vo.getProfitAmount().multiply(hundred)
								.divide(total.getProfitAmount(), BigDecimal.ROUND_HALF_UP, 4)
								+ "%");
					}
					// 设置毛利率
					vo.setProfitRate(isZeroOrNull(vo.getSaleAmount()) ? "0%" : vo.getProfitAmount().multiply(hundred)
							.divide(vo.getSaleAmount(), BigDecimal.ROUND_HALF_UP, 4)
							+ "%");
					// 计算库存周转率 期间销售成本/[(期初成本+期末成本)/2]

					sumXsNum = sumXsNum.add(vo.getSaleNum());
					sumXsAmount = sumXsAmount.add(vo.getSaleAmount());
					sumProfitAmount = sumProfitAmount.add(vo.getProfitAmount());
				}
			}
			CategorySaleCostVo sumTotal = categorySaleCostReportServiceApi.getTotalNew(qo);

			sumTotal.setSaleAmount(sumXsAmount);
			sumTotal.setSaleNum(sumXsNum);
			sumTotal.setProfitAmount(sumProfitAmount);
			sumTotal.setBranchCode("合计：");
			list.add(sumTotal);
			String reportFileName = null;
			String templateName = null;
			String timeStr = StringUtil.replaceAll((String) map.get("startTime"), "-", "") + "-"
					+ StringUtil.replaceAll((String) map.get("endTime"), "-", "") + "-";
			reportFileName = "类别销售分析" + timeStr;
			if ("1".equals(map.get("reportType")) || 1 == Integer.parseInt(map.get("reportType").toString())) {
				templateName = "categoryBigSaleReport.xlsx";
			} else if ("2".equals(map.get("reportType")) || 2 == Integer.parseInt(map.get("reportType").toString())) {
				templateName = "categoryCenterSaleReport.xlsx";
			}
			if ("3".equals(map.get("reportType")) || 3 == Integer.parseInt(map.get("reportType").toString())) {
				templateName = "categorysmallSaleReport.xlsx";
			}

			exportListForXLSX(response, list, reportFileName, templateName);
		} catch (Exception e) {
			LOG.error("导出类别销售汇总出现异常{}", e);
		}
	}

}
