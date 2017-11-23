package com.okdeer.jxc.controller.report.sales;

import com.alibaba.dubbo.rpc.RpcContext;
import com.okdeer.jxc.common.enums.BusinessTypeEnum;
import com.okdeer.jxc.common.enums.OrderResourceEnum;
import com.okdeer.jxc.common.report.ReportService;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.common.ReportController;
import com.okdeer.jxc.report.sale.GoodSaleDetailServiceApi;
import com.okdeer.retail.common.price.PriceConstant;
import com.okdeer.retail.common.report.DataRecord;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * ClassName: GoodSaleDetailController 
 * @Description: 商品销售明细分析
 * @author yangyq02
 * @date 2017年7月21日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
 
@Controller
@RequestMapping("report/sale/goodSaleDetailReport")
@SuppressWarnings("deprecation")
public class GoodSaleDetailController extends ReportController {

	//@Reference(version = "1.0.0", check = false)
	@Resource
	GoodSaleDetailServiceApi goodSaleDetailServiceApi;

	@RequestMapping(value = "view")
	public String view() {
		return "report/sale/goodSaleDetailReport";
	}

	@Override
	public ReportService getReportService() {
		return goodSaleDetailServiceApi;
	}

	@Override
	public Map<String, Object> getParam(HttpServletRequest request) {
		Map<String, Object> map = this.builderParams(request, null);
		/*
		 * if(!map.containsKey("branchCompleCode")){ map.put("branchCompleCode",
		 * UserUtil.getCurrBranchCompleCode()); }
		 */
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
	@RequestMapping("reportList")
	@ResponseBody
	public List<DataRecord> reportList(HttpServletRequest request) {
		List<DataRecord> list = getReportService().getList(getParam(request));
		for (DataRecord dataRecord : list) {
			formatter(dataRecord);
		}
		return list;
	}

	@Override
	@RequestMapping("reportListPage")
	@ResponseBody
	public PageUtils<DataRecord> reportListPage(HttpServletRequest request,
												@RequestParam(value = "page", defaultValue = PAGE_NO) Integer page,
												@RequestParam(value = "rows", defaultValue = PAGE_SIZE) Integer rows) throws ExecutionException, InterruptedException {
		Map<String, Object> param = getParam(request);
        //goodSaleDetailServiceApi.getListPage(param, page, rows);
        //Future<PageUtils<DataRecord>> listFuture = RpcContext.getContext().getFuture();
        ///goodSaleDetailServiceApi.getTotal(param);
        //Future<DataRecord> footerDataFuture = RpcContext.getContext().getFuture();

        //1、查询列表
        goodSaleDetailServiceApi.getListNew(param);
        Future<List<DataRecord>> listFuture = RpcContext.getContext().getFuture();

        // 2、统计个数
        goodSaleDetailServiceApi.countGoodSaleDetail(param);
        Future<Long> countFuture = RpcContext.getContext().getFuture();

        // 3、查询合计
        goodSaleDetailServiceApi.sumList(param);
        Future<DataRecord> sumFuture = RpcContext.getContext().getFuture();

        DataRecord vo = sumFuture.get();

        List<DataRecord> footer = new ArrayList<>();
        footer.add(vo);

        List<DataRecord> vos = listFuture.get();
        PageUtils<DataRecord> list = new PageUtils<>(vos, footer, countFuture.get());
        list.setPageNum(page);
        list.setPageSize(rows);
        for (DataRecord dataRecord : list.getList()) {
			formatter(dataRecord);
		}
		cleanDataMaps(getPriceAccess(), list.getList());
		cleanDataMaps(getPriceAccess(), list.getFooter());
		return list;
	}

	@Override
	public void formatter(DataRecord dataRecord) {
		if (dataRecord.get("businessType") != null && StringUtils.isNotBlank(dataRecord.get("businessType").toString())) {
			dataRecord.put("businessTypeStr", BusinessTypeEnum.getName(dataRecord.get("businessType").toString()));
		}
		if (dataRecord.get("orderType") != null && StringUtils.isNotBlank(dataRecord.get("orderType").toString())) {
			dataRecord.put("orderTypeStr",
					OrderResourceEnum.getName(Integer.parseInt(dataRecord.get("orderType").toString())));
		}
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#exportExcel(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@RequestMapping(value = "exportExcel")
	@Override
	public void exportExcel(HttpServletRequest request, HttpServletResponse response) {
		try {
			LOG.debug("新品销售分析导出");
			Map<String, Object> map = getParam(request);

			String timeStr = StringUtils.replace((String) map.get("startTime"), "-", "") + "-"
					+ StringUtils.replace((String) map.get("endTime"), "-", "") + "-";

			String reportFileName = "商品销售明细分析" + timeStr;
			String templateName = "GoodSaleDetail.xlsx";
			DataRecord data = goodSaleDetailServiceApi.getTotal(map);
			// 模板名称，包括后缀名
			/** List<DataRecord> dataList = getReportService().getList(map);*/
			List<DataRecord> dataList = queryListPartition(map);
			for (DataRecord dataRecord : dataList) {
				formatter(dataRecord);
			}
			
			dataList.add(data);
			cleanDataMaps(getPriceAccess(), dataList);
			exportListForXLSX(response, dataList, reportFileName, templateName);
		} catch (Exception e) {
			LOG.error("新品销售分析导出失败", e);
		}

	}
	/**
	 * @see com.okdeer.jxc.controller.common.ReportController#getPriceAccess()
	 */
	@Override
	public Map<String, String> getPriceAccess() {
		Map<String, String> map = new HashMap<String, String>();
		map.put(PriceConstant.COST_PRICE, "costPrice,costAmount"); //成本价，成本金额
		return map;
	}
}
