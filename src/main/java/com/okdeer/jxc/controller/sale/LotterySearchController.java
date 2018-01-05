/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年12月27日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.sale;  

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
import com.okdeer.jxc.sale.lottery.po.LotterySearchPo;
import com.okdeer.jxc.sale.lottery.po.LotterySearchTotalPo;
import com.okdeer.jxc.sale.lottery.qo.LotterySearchQo;
import com.okdeer.jxc.sale.lottery.service.LotterySearchService;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;


/**
 * ClassName: LotterySearchController 
 * @Description: 奖券登记查询Controller
 * @author liwb
 * @date 2017年12月27日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("sale/lotterySearch")
public class LotterySearchController extends AbstractMutilGpeController<LotterySearchQo> {
	
	@Reference(version = "1.0.0", check = false)
	private LotterySearchService lotterySearchService;

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getMutilCustomMark()
	 */
	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_RETAIL, LOTTERY_SEARCH_REPORT,
				LotterySearchService.REPORT_TYPE_TOTAL, LotterySearchService.REPORT_TYPE_DETAIL);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("sale/lottery/lotterySearch");
		return modelAndView;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getForbidSetArray()
	 */
	@Override
	protected Set<String>[] getForbidSetArray() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getViewObjectClassArray()
	 */
	@Override
	protected Class<?>[] getViewObjectClassArray() {
		return new Class<?>[] { LotterySearchTotalPo.class, LotterySearchPo.class };
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryListPage(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected EasyUIPageInfo<?> queryListPage(LotterySearchQo qo) {
		buildDefaultParams(qo);
		return lotterySearchService.getPageList(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryTotal(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected Object queryTotal(LotterySearchQo qo) {
		buildDefaultParams(qo);
		return lotterySearchService.getTotalSum(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryList(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected List<?> queryList(LotterySearchQo qo) {
		buildDefaultParams(qo);
		return lotterySearchService.getExportList(qo);
	}
	
	private void buildDefaultParams(LotterySearchQo qo) {
		if (StringUtils.isBlank(qo.getTabKey())) {
			throw new BusinessException("系统错误，报表类型为空");
		}
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

}
