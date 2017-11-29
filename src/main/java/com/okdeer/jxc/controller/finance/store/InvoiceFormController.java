/** 
 *@Project: okdeer-jxc-web 
 *@Author: songwj
 *@Date: 2017年11月29日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.finance.store;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.settle.finance.po.InvoiceFormPo;
import com.okdeer.jxc.settle.finance.po.InvoiceFormRefundPo;
import com.okdeer.jxc.settle.finance.qo.InvoiceFormQo;
import com.okdeer.jxc.settle.finance.service.InvoiceFormService;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;

/**
 * ClassName: InvoiceFormController 
 * @Description: 用户发票申请Controller
 * @author songwj
 * @date 2017年11月29日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("finance/invoiceFormReport")
public class InvoiceFormController extends AbstractMutilGpeController<InvoiceFormQo> {

	@Reference(version = "1.0.0", check = false)
	private InvoiceFormService invoiceFormService;

	private void buildDefaultParams(InvoiceFormQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getMutilCustomMark()
	 */
	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_FINANCE, GpeMarkContrant.INVOICE_FORM_REPORT,
				InvoiceFormService.REPORT_TYPE_DEFAULT, InvoiceFormService.REPORT_TYPE_REFUND);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("finance/invoiceForm/reportList");
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
		return new Class<?>[] { InvoiceFormPo.class, InvoiceFormRefundPo.class };
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryListPage(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected EasyUIPageInfo<?> queryListPage(InvoiceFormQo qo) {
		buildDefaultParams(qo);
		return invoiceFormService.queryPageList(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryTotal(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected Object queryTotal(InvoiceFormQo qo) {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#queryList(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected List<?> queryList(InvoiceFormQo qo) {
		buildDefaultParams(qo);
		return invoiceFormService.queryExportList(qo);
	}

}
