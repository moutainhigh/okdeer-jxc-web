/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年5月22日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.finance.store;  

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.enums.StoreChargeEnum;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.report.ReportService;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.common.ReportController;
import com.okdeer.jxc.settle.store.service.StoreChargeSearchService;
import com.okdeer.retail.common.report.DataRecord;


/**
 * ClassName: StoreChargeSearchController 
 * @Description: 门店费用查询Controller
 * @author liwb
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("finance/storeChargeSearch")
public class StoreChargeSearchController extends ReportController {
	
	@Reference(version = "1.0.0", check = false)
	private StoreChargeSearchService storeChargeSearchService;
	
	@RequestMapping(value = "toManager")
	public String toManager() {
		return "finance/storeCharge/storeChargeSearch";
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getReportService()
	 */
	@Override
	public ReportService getReportService() {
		return storeChargeSearchService;
	}
	
	@RequestMapping(value = "exportExcelList")
	@ResponseBody
	public void exportExcelList(HttpServletRequest request, HttpServletResponse response) {
		try {
			LOG.debug("门店费用查询导出功能");
			Map<String, Object> map = getParam(request);
			String reportFileName = "";
			String templateName = "";
			String queryType = map.containsKey("queryType") ? map.get("queryType").toString() : null;
			if (StringUtils.isBlank(queryType)) {
				throw new BusinessException("系统错误，查询类型为空");
			}

			String timeStr = StringUtils.replace(map.get("month").toString(), "-", "");

			if ("total".equals(queryType)) { // 汇总
				reportFileName = "门店费用汇总查询" + timeStr;
				templateName = ExportExcelConstant.STORE_CHARGE_TOTAL_EXPORT_TEMPLATE;

			} else if ("detail".equals(queryType)) {// 明细
				reportFileName = "门店费用明细查询" + timeStr;
				templateName = ExportExcelConstant.STORE_CHARGE_DETAIL_EXPORT_TEMPLATE;

			}

			// 模板名称，包括后缀名
			List<DataRecord> dataList = storeChargeSearchService.getList(map);
			
			// 导出Excel			
			Map<String, Object> param = new HashMap<>();
			param.put("titleName", "门店运营费用");
			param.put("header", "费用");
			exportParamListForXLSX(response, dataList, param, reportFileName, templateName);
		} catch (Exception e) {
			LOG.error("门店费用查询导出失败", e);
		}
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getParam(javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public Map<String, Object> getParam(HttpServletRequest request) {
		Map<String, Object> map = this.builderParams(request, null);
		if (!map.containsKey("branchCompleCode")) {
			map.put("branchCompleCode", super.getCurrBranchCompleCode());
		}
		if(map.containsKey("month")){
			String monthStr = map.get("month").toString();
			if(monthStr.contains("-")){
				monthStr = monthStr.replaceAll("-", "");
				map.put("month", Integer.valueOf(monthStr));
			}
		}
		map.put("chargeType", StoreChargeEnum.STORE_CHARGE.getCode());
		return map;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getFileName()
	 */
	@Override
	public String getFileName() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getHeaders()
	 */
	@Override
	public String[] getHeaders() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getColumns()
	 */
	@Override
	public String[] getColumns() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#formatter(com.okdeer.jxc.common.report.DataRecord)
	 */
	@Override
	public void formatter(DataRecord dataRecord) {
		
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getPriceAccess()
	 */
	@Override
	public Map<String, String> getPriceAccess() {
		// TODO Auto-generated method stub
		return null;
	}

}
