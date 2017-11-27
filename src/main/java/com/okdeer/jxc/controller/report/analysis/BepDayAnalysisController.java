/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年5月22日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.analysis;

import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.report.analysis.po.BepDayAnalysisByUnDepreciationPo;
import com.okdeer.jxc.report.analysis.po.BepDayAnalysisPo;
import com.okdeer.jxc.report.analysis.qo.BepAnalysisQo;
import com.okdeer.jxc.report.analysis.service.BepAnalysisService;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;

/**
 * ClassName: BepDayAnalysisController 
 * @Description: 门店日盈亏平衡分析
 * @author liwb
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("report/bepDayAnalysis")
public class BepDayAnalysisController extends AbstractMutilGpeController<BepAnalysisQo> {

	@Reference(version = "1.0.0", check = false)
	private BepAnalysisService bepDayAnalysisService;

	/**
	 * 跳转到列表
	 */
	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("report/analysis/bepDayAnalysisList");
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
		
		// 日期+1
		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));

	}


	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_REPORT, "bepDayAnalysis", "depreciation",
				"unDepreciation");
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("report/analysis/bepDayAnalysisList");
		return modelAndView;
	}

	@Override
	protected Set<String>[] getForbidSetArray() {
		return null;
	}

	@Override
	protected Class<?>[] getViewObjectClassArray() {
		return new Class[]{BepDayAnalysisPo.class,BepDayAnalysisByUnDepreciationPo.class};
	}

	@Override
	protected EasyUIPageInfo<?> queryListPage(BepAnalysisQo qo) {
		buildParams(qo);
		return bepDayAnalysisService.getBepDayAnalysisForPage(qo);
	}

	@Override
	protected Object queryTotal(BepAnalysisQo qo) {
		buildParams(qo);
		BepDayAnalysisPo bepDay= bepDayAnalysisService.getBepDayAnalysisListNewSum(qo);
		return bepDay;
	}

	@Override
	protected List<?> queryList(BepAnalysisQo qo) {
		buildParams(qo);
		return bepDayAnalysisService.getBepDayAnalysisForExport(qo);
	}

}
