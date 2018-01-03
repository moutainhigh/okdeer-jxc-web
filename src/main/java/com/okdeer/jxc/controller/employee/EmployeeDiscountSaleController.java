/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年12月27日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.employee;

import java.util.ArrayList;
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
import com.okdeer.retail.facade.report.employee.facade.EmployeeDiscountSaleFacade;
import com.okdeer.retail.facade.report.employee.qo.EmployeeDiscountSaleQo;
import com.okdeer.retail.facade.report.employee.vo.EmployeeDiscountSaleOrderVo;
import com.okdeer.retail.facade.report.employee.vo.EmployeeDiscountSaleSummaryVo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;

/**
 * ClassName: EmployeeDiscountSaleController 
 * @Description: 员工折扣消费查询
 * @author zhengwj
 * @date 2017年12月27日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("sale/employeeDiscount")
public class EmployeeDiscountSaleController extends AbstractMutilGpeController<EmployeeDiscountSaleQo> {

	/**
	 * @Fields KEY_SUMMARY_STATISTICS : 汇总统计
	 */
	private static final String KEY_SUMMARY_STATISTICS = "summaryStatistics";

	/**
	 * @Fields KEY_ORDER_STATISTICS : 订单统计
	 */
	private static final String KEY_ORDER_STATISTICS = "orderStatistics";

	/**
	 * 员工折扣消费查询Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private EmployeeDiscountSaleFacade employeeDiscountSaleFacade;

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getCustomMark()
	 */
	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_REPORT, SECTION_EMPLOYEE_DISCOUNT, KEY_SUMMARY_STATISTICS,
				KEY_ORDER_STATISTICS);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("/report/employee/discount");
		return modelAndView;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getForbidSetArray()
	 */
	@Override
	protected Set<String>[] getForbidSetArray() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getViewObjectClassArray()
	 */
	@Override
	protected Class<?>[] getViewObjectClassArray() {
		return new Class<?>[] { EmployeeDiscountSaleSummaryVo.class, EmployeeDiscountSaleOrderVo.class };
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryListPage(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected EasyUIPageInfo<?> queryListPage(EmployeeDiscountSaleQo qo) {
		buildQo(qo);
		switch (qo.getTabKey()) {
			case KEY_SUMMARY_STATISTICS:
				return employeeDiscountSaleFacade.queryListPageBySummary(qo);
			case KEY_ORDER_STATISTICS:
				return employeeDiscountSaleFacade.queryListPageByOrder(qo);
			default:
				break;
		}
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryTotal(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected Object queryTotal(EmployeeDiscountSaleQo qo) {
		buildQo(qo);
		switch (qo.getTabKey()) {
			case KEY_SUMMARY_STATISTICS:
				return employeeDiscountSaleFacade.queryTotalBySummary(qo);
			case KEY_ORDER_STATISTICS:
				return employeeDiscountSaleFacade.queryTotalByOrder(qo);
			default:
				break;
		}
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryList(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected List<?> queryList(EmployeeDiscountSaleQo qo) {
		switch (qo.getTabKey()) {
			case KEY_SUMMARY_STATISTICS:
				return employeeDiscountSaleFacade.queryListBySummary(qo);
			case KEY_ORDER_STATISTICS:
				return employeeDiscountSaleFacade.queryListByOrder(qo);
			default:
				break;
		}
		return new ArrayList<>();
	}

	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author zhengwj
	 * @date 2017年12月28日
	 */
	private void buildQo(EmployeeDiscountSaleQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchId())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		if (StringUtils.isNotEmpty(qo.getEndTime())) {
			qo.setEndTime(DateUtils.getSmallRStr(DateUtils.getNextDay(DateUtils.parse(qo.getEndTime(), "yyyy-MM-dd"))));
		}
	}

}
