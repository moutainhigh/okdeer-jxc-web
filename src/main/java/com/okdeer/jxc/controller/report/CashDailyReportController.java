/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.report.qo.CashDailyReportQo;
import com.okdeer.jxc.report.service.CashDailyReportService;
import com.okdeer.jxc.report.vo.CashDailyReportByCashierVo;
import com.okdeer.jxc.report.vo.CashDailyReportByDateVo;
import com.okdeer.jxc.report.vo.CashDailyReportVo;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;

/**
 * 
 * ClassName: CashDailyReportController 
 * @Description: 收银日报
 * @author dongh
 * @date 2016年8月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *     商业管理系统1.0.0	2016年8月22日                  dongh              创建收银日报Controller
 *     商业管理系统1.0.0	2016年8月31日                  zhongy             添加导出报表条件查询
 *     商业管理系统1.0.0	2016年9月2日                   lijy02			  	 打印
 */

@Controller
@RequestMapping("cashDaily/report")
public class CashDailyReportController extends AbstractMutilGpeController<CashDailyReportQo> {

	@Reference(version = "1.0.0", check = false)
	private CashDailyReportService cashDailyReportService;

	/**
	 * 
	 * @Description: 收银日报报表跳转页面
	 * @return
	 * @author taomm
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "/view")
	public ModelAndView view(ModelAndView modelAndView) {
		return super.index(modelAndView);
	}

	/**
	 * @Description: 初始化默认参数
	 * @param qo
	 * @author liwb
	 * @date 2016年9月23日
	 */
	private CashDailyReportQo buildDefaultParams(CashDailyReportQo qo) {
		if (qo.getEndTime() != null) {
			qo.setEndTime(DateUtils.getNextDay(qo.getEndTime()));
		}

		// 如果没有修改所选机构等信息，则去掉该参数
		String branchNameOrCode = qo.getBranchNameOrCode();
		if (StringUtils.isNotBlank(branchNameOrCode) && branchNameOrCode.contains("[")
				&& branchNameOrCode.contains("]")) {
			qo.setBranchNameOrCode(null);
		}

		// 如果没有修改所选收银员信息，则去掉该参数
		String cashierNameOrCode = qo.getCashierNameOrCode();
		if (StringUtils.isNotBlank(cashierNameOrCode) && cashierNameOrCode.contains("[")
				&& cashierNameOrCode.contains("]")) {
			qo.setCashierNameOrCode(null);
		}

		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCode()) && StringUtils.isBlank(qo.getBranchNameOrCode())) {
			qo.setBranchCompleCode(getCurrBranchCompleCode());
		}
		return qo;
	}

	/**
	 * @Description: 日结报表打印
	 * @param FormNo
	 * @param request
	 * @param response
	 * @author lijy02
	 * @date 2016年9月3日
	 */
	@RequestMapping(value = "printReport", method = RequestMethod.GET)
	@ResponseBody
	public String printReport(CashDailyReportQo qo, HttpServletResponse response, HttpServletRequest request,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber) {
		try {
			qo.setPageNum(pageNumber);
			qo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
			// 初始化默认参数
			qo = buildDefaultParams(qo);
			LOG.debug("日结报表打印参数：{}", qo.toString());
			int lenght=cashDailyReportService.queryPageListCount(qo);
			if(lenght>PrintConstant.PRINT_MAX_ROW){
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			EasyUIPageInfo<CashDailyReportVo> cashFlowReport = cashDailyReportService.queryPageList(qo);
			List<CashDailyReportVo> list = cashFlowReport.getList();
			if(!CollectionUtils.isEmpty(list)&&list.size()>PrintConstant.PRINT_MAX_ROW){
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			BigDecimal allTotal = BigDecimal.ZERO;
			for (CashDailyReportVo cashDailyReportVo : list) {
				allTotal = allTotal.add(cashDailyReportVo.getTotal());
			}
			String path = PrintConstant.CASH_DAILY_REPORT;
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("startDate", null != qo.getStartTime() ? DateUtils.formatDate(qo.getStartTime(), DateUtils.DATE_SMALL_STR_R) : "");
			map.put("endDate", null != qo.getEndTime() ? DateUtils.formatDate(qo.getEndTime(), DateUtils.DATE_SMALL_STR_R) : "");
			map.put("printName", UserUtil.getCurrentUser().getUserName());
			map.put("allTotal", allTotal);
			JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, list, "");
		} catch (Exception e) {
			LOG.error(PrintConstant.CASH_FLOW_PRINT_ERROR, e);
		}
		return null;
	}

	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_REPORT, GpeMarkContrant.SECTION_CASH_DAILY_REPORT, GpeMarkContrant.KEY_BY_CASHIER,
				GpeMarkContrant.KEY_BY_BRANCH, GpeMarkContrant.KEY_BY_DATE);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("report/cash/cashDailyReport");
		return modelAndView;
	}

	@Override
	protected Set<String>[] getForbidSetArray() {
		return null;
	}

	@Override
	protected Class<?>[] getViewObjectClassArray() {
		return new Class<?>[] {CashDailyReportByCashierVo.class,CashDailyReportVo.class,CashDailyReportByDateVo.class};
	}

	@Override
	protected EasyUIPageInfo<?> queryListPage(CashDailyReportQo qo) {
		buildDefaultParams(qo);
		return cashDailyReportService.queryPageList(qo);
	}

	@Override
	protected Object queryTotal(CashDailyReportQo qo) {
		buildDefaultParams(qo);
		return cashDailyReportService.queryCashDailyReportSum(qo);
	}

	@Override
	protected List<?> queryList(CashDailyReportQo qo) {
		buildDefaultParams(qo);
		return cashDailyReportService.queryList(qo);
	}
}
