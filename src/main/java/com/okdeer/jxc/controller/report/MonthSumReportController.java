package com.okdeer.jxc.controller.report;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.facade.report.facade.MonthSumReportFacade;
import com.okdeer.retail.facade.report.qo.MonthSumReportQo;
import com.okdeer.retail.facade.report.vo.MonthSumReportVo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * 
 * ClassName: MonthSumReportController 
 * @Description: 月进销存报表
 * @author zhangq
 * @date 2017年7月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/month")
public class MonthSumReportController extends AbstractSimpleGpeController<MonthSumReportQo, MonthSumReportVo> {

	/**
	 * 日进销存报表Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private MonthSumReportFacade monthSumReportFacade;

	@RequestMapping(value = "/list")
	public ModelAndView list(ModelAndView modelAndView) {
		return super.index(modelAndView);
	}

	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, GpeMarkContrant.SECTION_MONTHSUM,
				GpeMarkContrant.KEY_LIST);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.addObject("startTime",
				LocalDate.now().minusMonths(1).format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		modelAndView.setViewName("/report/month/monthSumReport");
		return modelAndView;
	}

	@Override
	protected Set<String> getForbidSet() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected Class<MonthSumReportVo> getViewObjectClass() {
		return MonthSumReportVo.class;
	}

	@Override
	protected EasyUIPageInfo<MonthSumReportVo> queryListPage(MonthSumReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchId())) {
			qo.setBranchId(UserUtil.getCurrBranchId());
		}
		// 月结日期
		if (StringUtils.isEmpty(qo.getSumDate())) {
			qo.setSumDate(LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		}
		return monthSumReportFacade.queryListPage(qo);
	}

	@Override
	protected MonthSumReportVo queryTotal(MonthSumReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchId())) {
			qo.setBranchId(UserUtil.getCurrBranchId());
		}
		// 月结日期
		if (StringUtils.isEmpty(qo.getSumDate())) {
			qo.setSumDate(LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		}
		MonthSumReportVo vo= monthSumReportFacade.queryListTotal(qo);
		vo.setSumDate("合计:");
		return vo;
	}

	@Override
	protected List<MonthSumReportVo> queryList(MonthSumReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchId())) {
			qo.setBranchId(UserUtil.getCurrBranchId());
		}
		// 月结日期
		if (StringUtils.isEmpty(qo.getSumDate())) {
			qo.setSumDate(LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		}
		return monthSumReportFacade.queryList(qo);
	}
}
