/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.report.qo.CashCheckReportQo;
import com.okdeer.jxc.report.service.CashCheckReportService;
import com.okdeer.jxc.report.vo.CashCheckReportVo;

/**
 * 
 * ClassName: CashCheckReportController 
 * @Description: 收银对账
 * @author dongh
 * @date 2016年8月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("cashCheck/report")
public class CashCheckReportController extends BaseController<CashCheckReportController> {

	@Reference(version = "1.0.0", check = false)
	private CashCheckReportService cashCheckReportService;

	/**
	 * 
	 * @Description: 收银对账报表跳转页面
	 * @return
	 * @author taomm
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "view")
	public String view() {
		return "report/cash/cashCheckReport";
	}

	/**
	 * 
	 * @Description: 收银对账查询
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author dongh
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "getList")
	@ResponseBody
	public PageUtils<CashCheckReportVo> getList(CashCheckReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			LOG.debug("收银对账查询参数{}", qo);

			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);

			qo = buildDefaultParams(qo);
			PageUtils<CashCheckReportVo> CashFlowReport = cashCheckReportService.queryList(qo);
			return CashFlowReport;
		} catch (Exception e) {
			LOG.error("收银对账查询参数异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 初始化默认参数
	 * @param qo
	 * @author liwb
	 * @date 2016年9月23日
	 */
	private CashCheckReportQo buildDefaultParams(CashCheckReportQo qo) {

		// 如果没有修改所选机构等信息，则去掉该参数
		String branchNameOrCode = qo.getBranchNameOrCode();
		if (StringUtils.isNotBlank(branchNameOrCode) && branchNameOrCode.contains("[")
				&& branchNameOrCode.contains("]")) {
			qo.setBranchNameOrCode(null);
		}

		// 如果没有修改所选收银员信息，则去掉该参数
		String cashierNameOrCode = qo.getCashierNameOrCode();
		if (StringUtils.isNotBlank(cashierNameOrCode) && cashierNameOrCode.contains("[")
				&& cashierNameOrCode.contains("]")) {
			qo.setCashierNameOrCode(null);
		}

		if (qo.getEndTime() != null) {
			qo.setEndTime(DateUtils.getNextDay(qo.getEndTime()));
		}

		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCode()) && StringUtils.isBlank(qo.getBranchNameOrCode())) {
			qo.setBranchCompleCode(getCurrBranchCompleCode());
		}

		return qo;
	}

	/**
	 * 
	 * @Description: 收银对账报表导出
	 * @param response
	 * @param vo
	 * @return
	 * @author dongh
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "/exportList")
	@ResponseBody
	public String exportList(HttpServletResponse response, CashCheckReportQo qo) {
		LOG.info("收银对账导出查询参数:{}" + qo);
		try {
			qo.setPageNumber(Constant.ONE);
			qo.setPageSize(Constant.MAX_EXPORT_NUM);
			qo = buildDefaultParams(qo);
			PageUtils<CashCheckReportVo> exportList = cashCheckReportService.queryList(qo);
			String fileName = "收银对账" + "_" + DateUtils.getCurrSmallStr();
			String templateName = ExportExcelConstant.CASHCHECKREPORT;
			exportListForXLSX(response, exportList.getList(), fileName, templateName);
		} catch (Exception e) {
			LOG.error("收银对账导出查询异常:", e);
		}
		return null;
	}

	// start by lijy02
	/**
	 * @Description: 收银对账报表打印
	 * @param qo
	 * @param response
	 * @param request
	 * @param pageNumber
	 * @author lijy02
	 * @date 2016年9月6日
	 */
	@RequestMapping(value = "printReport", method = RequestMethod.GET)
	@ResponseBody
	public void printReport(CashCheckReportQo qo, HttpServletResponse response, HttpServletRequest request,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber) {
		try {
			String branchCode = getCurrBranchCode();
			qo.setBranchCode(branchCode);
			qo.setPageNumber(pageNumber);
			qo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
			// 默认当前机构
			if (StringUtils.isBlank(qo.getBranchCompleCode()) && StringUtils.isBlank(qo.getBranchNameOrCode())) {
				qo.setBranchCompleCode(getCurrBranchCompleCode());
			}
			PageUtils<CashCheckReportVo> cashCheckReportVo = cashCheckReportService.queryList(qo);
			List<CashCheckReportVo> list = cashCheckReportVo.getList();
			String path = PrintConstant.CASH_CHECK_REPORT;
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("startDate", qo.getStartTime());
			map.put("endDate", qo.getEndTime());
			map.put("printName", getCurrentUser().getUserName());
			JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, list, "");
		} catch (Exception e) {
			LOG.error(PrintConstant.CASH_CHECK_PRINT_ERROR, e);
		}
	}
	// end by lijy02
}
