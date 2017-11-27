
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
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.facade.report.psi.facade.MonthSumFinanceReportFacade;
import com.okdeer.retail.facade.report.psi.qo.MonthSumFinanceReportQo;
import com.okdeer.retail.facade.report.psi.vo.MonthSumFinanceByBranchDetailVo;
import com.okdeer.retail.facade.report.psi.vo.MonthSumFinanceByBranchVo;
import com.okdeer.retail.facade.report.psi.vo.MonthSumFinanceByGoodsDetailVo;
import com.okdeer.retail.facade.report.psi.vo.MonthSumFinanceByGoodsVo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;

/**
 * ClassName: MonthSumFinanceReportController 
 * @Description: 财务月进销存报表
 * @author zhengwj
 * @date 2017年9月4日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/month/finance")
public class MonthSumFinanceReportController extends AbstractMutilGpeController<MonthSumFinanceReportQo> {

	/**
	 * 日进销存报表Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private MonthSumFinanceReportFacade monthSumFinanceReportFacade;

	/**
	 * 按机构汇总
	 */
	private static final String KEY_BY_BRANCH = "byBranch";

	/**
	 * 按商品汇总
	 */
	private static final String KEY_BY_GOODS = "byGoods";

	/**
	 * 按机构明细
	 */
	private static final String KEY_BY_BRANCH_DETAIL = "byBranchDetail";

	/**
	 * 按商品明细
	 */
	private static final String KEY_BY_GOODS_DETAIL = "byGoodsDetail";

	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_REPORT, SECTION_FINANCEMONTHSUM, KEY_BY_BRANCH, KEY_BY_GOODS,
				KEY_BY_BRANCH_DETAIL, KEY_BY_GOODS_DETAIL);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.addObject("startTime",
				LocalDate.now().minusMonths(1).format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		modelAndView.setViewName("/report/month/monthSumFinanceReport");
		return modelAndView;
	}

	@Override
	protected Set<String>[] getForbidSetArray() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected Class<?>[] getViewObjectClassArray() {
		return new Class<?>[] { MonthSumFinanceByBranchVo.class, MonthSumFinanceByGoodsVo.class,
				MonthSumFinanceByBranchDetailVo.class, MonthSumFinanceByGoodsDetailVo.class };
	}

	@Override
	protected EasyUIPageInfo<?> queryListPage(MonthSumFinanceReportQo qo) {
		// 查询参数
		buildQo(qo);
		// 根据不同的tabkey查询
		switch (qo.getTabKey()) {
			case KEY_BY_BRANCH:
				return monthSumFinanceReportFacade.queryListPageByBranch(qo);
			case KEY_BY_GOODS:
				return monthSumFinanceReportFacade.queryListPageByGoods(qo);
			case KEY_BY_BRANCH_DETAIL:
				return monthSumFinanceReportFacade.queryListPageByBranchDetail(qo);
			case KEY_BY_GOODS_DETAIL:
				return monthSumFinanceReportFacade.queryListPageByGoodsDetail(qo);
			default:
				break;
		}

		return null;
	}

	@Override
	protected Object queryTotal(MonthSumFinanceReportQo qo) {
		// 查询参数
		buildQo(qo);
		// 根据不同的tabkey查询
		switch (qo.getTabKey()) {
			case KEY_BY_BRANCH:
				return monthSumFinanceReportFacade.queryListTotalByBranch(qo);
			case KEY_BY_GOODS:
				return monthSumFinanceReportFacade.queryListTotalByGoods(qo);
			case KEY_BY_BRANCH_DETAIL:
				return monthSumFinanceReportFacade.queryListTotalByBranchDetail(qo);
			case KEY_BY_GOODS_DETAIL:
				return monthSumFinanceReportFacade.queryListTotalByGoodsDetail(qo);
			default:
				break;
		}
		return null;
	}

	@Override
	protected List<?> queryList(MonthSumFinanceReportQo qo) {
		// 查询参数
		buildQo(qo);
		// 根据不同的tabkey查询
		switch (qo.getTabKey()) {
			case KEY_BY_BRANCH:
				return monthSumFinanceReportFacade.queryListByBranch(qo);
			case KEY_BY_GOODS:
				return monthSumFinanceReportFacade.queryListByGoods(qo);
			case KEY_BY_BRANCH_DETAIL:
				return monthSumFinanceReportFacade.queryListByBranchDetail(qo);
			case KEY_BY_GOODS_DETAIL:
				return monthSumFinanceReportFacade.queryListByGoodsDetail(qo);
			default:
				break;
		}
		return null;
	}

	/**
	 * 
	 * @Description: 构建查询参数
	 * @param qo   
	 * @return void  
	 * @author zhangq
	 * @date 2017年11月24日
	 */
	private void buildQo(MonthSumFinanceReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchId())) {
			qo.setBranchId(UserUtil.getCurrBranchId());
		}
		// 月结日期
		if (StringUtils.isEmpty(qo.getSumDate())) {
			qo.setSumDate(LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		}
	}
}
