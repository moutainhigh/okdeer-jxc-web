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

import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.jxc.settle.charge.qo.BuildChargeSearchQo;
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
public class LotterySearchController extends AbstractMutilGpeController<BuildChargeSearchQo> {

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getMutilCustomMark()
	 */
	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		// TODO Auto-generated method stub
		return null;
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
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryListPage(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected EasyUIPageInfo<?> queryListPage(BuildChargeSearchQo qo) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryTotal(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected Object queryTotal(BuildChargeSearchQo qo) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryList(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected List<?> queryList(BuildChargeSearchQo qo) {
		// TODO Auto-generated method stub
		return null;
	}

}
