/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年5月22日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.analysis;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.analysis.po.BepMonthAnalysisPo;
import com.okdeer.jxc.report.analysis.qo.BepAnalysisQo;
import com.okdeer.jxc.report.analysis.service.BepAnalysisService;

/**
 * ClassName: BepDayAnalysisController 
 * @Description: 门店月盈亏平衡分析
 * @author liwb
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("report/bepMonthAnalysis")
public class BepMonthAnalysisController extends BaseController<BepMonthAnalysisController> {

	@Reference(version = "1.0.0", check = false)
	private BepAnalysisService bepDayAnalysisService;

	/**
	 * 跳转到列表
	 */
	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("report/analysis/bepMonthAnalysisList");
	}

	@RequestMapping(value = "getList", method = RequestMethod.POST)
	public PageUtils<BepMonthAnalysisPo> getList(BepAnalysisQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		qo.setPageNum(pageNumber);
		qo.setPageSize(pageSize);

		// 构建查询参数
		buildParams(qo);

		LOG.debug("查询月盈亏平衡分析条件：{}", qo);

		try {
			PageUtils<BepMonthAnalysisPo> page = bepDayAnalysisService.getBepMonthAnalysisForPage(qo);
			return page;
		} catch (Exception e) {
			LOG.error("分页查询月盈亏平衡分析异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author liwb
	 * @date 2017年5月27日
	 */
	private void buildParams(BepAnalysisQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

		qo.setStartTime(DateUtils.parseJfp(qo.getTxtStartDate()));
		qo.setEndTime(DateUtils.addMonths(DateUtils.parseJfp(qo.getTxtEndDate()), 1));

		// 构建所选月份列表，用于计算机构费用平摊
		if (null != qo.getStartTime() && null != qo.getEndTime() && qo.getStartTime().compareTo(qo.getEndTime()) < 0) {
			Date firstTime = bepDayAnalysisService.getFirstCostTime();
			int startMonth = Integer.parseInt(DateUtils.formatDate(firstTime, "yyyyMM"));
			int endMonth = Integer.parseInt(DateUtils.formatDate(qo.getEndTime(), "yyyyMM"));
			List<String> monthStrList = new ArrayList<>();
			do {
				monthStrList.add(Integer.toString(startMonth));
				startMonth++;
			} while (startMonth < endMonth);
			qo.setMonthStrList(monthStrList);
		}
	}

	@RequestMapping(value = "exportExcelList", method = RequestMethod.POST)
	public void exportExcelList(BepAnalysisQo qo, HttpServletResponse response) {
		try {

			// 构建查询参数
			buildParams(qo);

			LOG.debug("查询月盈亏平衡分析条件：{}", qo);

			String timeStr = DateUtils.formatDate(qo.getStartTime(), DateUtils.DATE_JFP_STR) + "-"
					+ DateUtils.formatDate(qo.getEndTime(), DateUtils.DATE_JFP_STR);

			// 导出文件名称，不包括后缀名
			String reportFileName = "月盈亏平衡分析" + timeStr;

			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.BEY_MONTH_ANALYSIS_EXPORT_TEMPLATE;

			// 模板名称，包括后缀名
			List<BepMonthAnalysisPo> dataList = bepDayAnalysisService.getBepMonthAnalysisForExport(qo);

			exportListForXLSX(response, dataList, reportFileName, templateName);

		} catch (Exception e) {
			LOG.error("月盈亏平衡分析导出失败", e);
		}

	}

}
