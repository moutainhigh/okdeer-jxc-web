/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.report.qo.CashFlowReportQo;
import com.okdeer.jxc.report.service.CashFlowReportService;
import com.okdeer.jxc.report.vo.CashFlowReportVo;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * 	
 * ClassName: CashFlowReportController 
 * @Description: 收银流水查询
 * @author dongh
 * @date 2016年8月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * *   商业管理系统1.0.0	2016年8月22日                  dongh              创建收银Controller
 *     商业管理系统1.0.0	2016年8月31日                  zhongy             添加导出报表条件查询
 *      商业管理系统1.0.0	2016年9月05日                  lijy02                                       打印报表
 */
@Controller
@RequestMapping("cashFlow/report")
public class CashFlowReportController extends AbstractSimpleGpeController<CashFlowReportQo, CashFlowReportVo> {

	@Reference(version = "1.0.0", check = false)
	private CashFlowReportService cashFlowReportService;

	/**
	 * @Description: 收银流水报表跳转页面
	 * @return
	 * @author taomm
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "/view")
	public ModelAndView view(ModelAndView modelAndView) {
		return super.index(modelAndView);
	}


	// 封装请求参数
	private CashFlowReportQo getParmas(CashFlowReportQo qo) {

		if (qo.getEndTime() != null) {
			// qo.setEndTime(DateUtils.getNextDay(qo.getEndTime()));
			qo.setEndTime(DateUtils.getNextMinute(qo.getEndTime()));
		}

		// 如果没有修改所选机构等信息，则去掉该参数
		String branchNameOrCode = qo.getBranchNameOrCode();
		if (StringUtils.isNotBlank(branchNameOrCode) && branchNameOrCode.contains("[")
				&& branchNameOrCode.contains("]")) {
			qo.setBranchNameOrCode(null);
		}
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode()) ) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		// 如果没有修改所选收银员信息，则去掉该参数
		String cashierNameOrCode = qo.getCashierNameOrCode();
		if (StringUtils.isNotBlank(cashierNameOrCode) && cashierNameOrCode.contains("[")
				&& cashierNameOrCode.contains("]")) {
			qo.setCashierNameOrCode(null);
		}

		if ("3".equals(qo.getOrderType())) {
			// 扫码购
			qo.setOrderType("2");
			qo.setSource(2);
		} else if ("2".equals(qo.getOrderType())) {
			// POS订单
			qo.setSource(1);
		} else if ("4".equals(qo.getOrderType())) {
			// 会员自助
			qo.setOrderType("2");
			qo.setSource(3);
		} else if ("5".equals(qo.getOrderType())) {
			// 微信小程序扫码购
			qo.setOrderType("2");
			qo.setSource(4);
		}
		LOG.info(JSON.toJSONString(qo));
		return qo;
	}

	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, GpeMarkContrant.SECTION_CASH_FLOW, GpeMarkContrant.KEY_LIST);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("report/cash/cashFlowReport");
		return modelAndView;
	}

	@Override
	protected Set<String> getForbidSet() {
		return null;
	}

	@Override
	protected Class<CashFlowReportVo> getViewObjectClass() {
		return CashFlowReportVo.class;
	}

	@Override
	protected EasyUIPageInfo<CashFlowReportVo> queryListPage(CashFlowReportQo qo) {
		return cashFlowReportService.queryPageList(getParmas(qo));
	}

	@Override
	protected CashFlowReportVo queryTotal(CashFlowReportQo qo) {
		return cashFlowReportService.queryCashFlowReportSum(getParmas(qo));
	}

	@Override
	protected List<CashFlowReportVo> queryList(CashFlowReportQo qo) {
		//因为 先查询合计参数 orderType 已经被改变，不符合密等，不能再处理参数
		//getParmas(qo)
		return cashFlowReportService.queryList(qo);
	}
}
