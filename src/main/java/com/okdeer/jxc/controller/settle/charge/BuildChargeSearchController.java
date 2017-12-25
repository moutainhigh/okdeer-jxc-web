/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年5月22日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.settle.charge;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.settle.charge.po.BuildChargeSearchPo;
import com.okdeer.jxc.settle.charge.po.BuildChargeSearchTotalPo;
import com.okdeer.jxc.settle.charge.qo.BuildChargeSearchQo;
import com.okdeer.jxc.settle.charge.service.BuildChargeSearchService;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;

/**
 * ClassName: StoreChargeSearchController 
 * @Description: 建店费用查询Controller
 * @author liwb
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("finance/buildChargeSearch")
public class BuildChargeSearchController extends AbstractMutilGpeController<BuildChargeSearchQo> {

	@Reference(version = "1.0.0", check = false)
	private BuildChargeSearchService buildChargeSearchService;

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getMutilCustomMark()
	 */
	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_REPORT, BUILD_CHARGE_SEARCH_REPORT,
				BuildChargeSearchService.REPORT_TYPE_TOTAL, BuildChargeSearchService.REPORT_TYPE_DETAIL);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("finance/buildCharge/buildChargeSearch");
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
		return new Class<?>[] { BuildChargeSearchTotalPo.class, BuildChargeSearchPo.class };
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryListPage(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected EasyUIPageInfo<?> queryListPage(BuildChargeSearchQo qo) {
		buildDefaultParams(qo);
		return buildChargeSearchService.getPageList(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryTotal(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected Object queryTotal(BuildChargeSearchQo qo) {
		buildDefaultParams(qo);
		return buildChargeSearchService.getTotalSum(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryList(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected List<?> queryList(BuildChargeSearchQo qo) {
		buildDefaultParams(qo);
		return buildChargeSearchService.getExportList(qo);
	}

	private void buildDefaultParams(BuildChargeSearchQo qo) {
		if (StringUtils.isBlank(qo.getTabKey())) {
			throw new BusinessException("系统错误，报表类型为空");
		}
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

}
