/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.report.qo.SaleFlowReportQo;
import com.okdeer.jxc.report.service.SaleFlowReportService;
import com.okdeer.jxc.report.vo.SaleFlowReportVo;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * 
 * ClassName: SaleFlowReportController 
 * @Description: 销售流水
 * @author dongh
 * @date 2016年8月18日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("saleFlow/report")
public class SaleFlowReportController extends AbstractSimpleGpeController<SaleFlowReportQo, SaleFlowReportVo> {

	@Reference(version = "1.0.0", check = false)
	private SaleFlowReportService saleFlowReportService;

	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, "saleFlow", GpeMarkContrant.KEY_LIST);
	}

	/**
	 * @Description: 重新写，因为用户中心路径已经定为了view。。。
	 * @param modelAndView
	 * @return   
	 * @return ModelAndView  
	 * @throws
	 * @author yangyq02
	 * @date 2017年11月23日
	 */
	@RequestMapping(value = "/view")
	public ModelAndView view(ModelAndView modelAndView) {
		return super.index(modelAndView);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("report/cash/saleFlowReport");
		return modelAndView;
	}

	@Override
	protected Set<String> getForbidSet() {
		return null;
	}

	@Override
	protected Class<SaleFlowReportVo> getViewObjectClass() {
		return SaleFlowReportVo.class;
	}

	@Override
	protected EasyUIPageInfo<SaleFlowReportVo> queryListPage(SaleFlowReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		// 查询分页数据
		return saleFlowReportService.queryListPage(qo);
	}

	@Override
	protected SaleFlowReportVo queryTotal(SaleFlowReportQo qo) {
		// 如果机构为空
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		return saleFlowReportService.querySaleFlowReportSum(qo);
	}

	@Override
	protected List<SaleFlowReportVo> queryList(SaleFlowReportQo qo) {
		// 如果机构为空
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		// 查询数据
		List<SaleFlowReportVo> list= saleFlowReportService.queryLists(qo);
		return list;
	}

}
