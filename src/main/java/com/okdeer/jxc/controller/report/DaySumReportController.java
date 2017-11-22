/*package com.okdeer.jxc.controller.report;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.controller.BaseReportController;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.facade.report.facade.BaseReportFacade;
import com.okdeer.retail.facade.report.facade.DaySumReportFacade;
import com.okdeer.retail.facade.report.qo.DaySumReportQo;
import com.okdeer.retail.facade.report.vo.DaySumReportVo;
import com.okdeer.retail.framework.gpe.annotation.GpeMethodListener;
import com.okdeer.retail.framework.gpe.helper.GpeHelper;

*//**
 * 
 * ClassName: DaySumReportController 
 * @Description: 日进销存报表
 * @author zhangq
 * @date 2017年6月8日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 *//*
@Controller
@RequestMapping("report/day1")
public class DaySumReportController extends BaseReportController<DaySumReportQo,DaySumReportVo> {

	*//**
	 * 日进销存报表Dubbo接口
	 *//*
	@Reference(version = "1.0.0", check = false)
	private DaySumReportFacade daySumReportFacade;
	
	@Override
	protected BaseReportFacade<DaySumReportQo, DaySumReportVo> getReportFade() {
		return daySumReportFacade;
	}
	
	@Override
	protected String getViewName() {
		
		test01(UserUtil.getCurrentUser().getId());
		return "/report/day/daySumReport";
	}
	
	@Override
	protected Model getModel(Model model) {
		model.addAttribute("branchId", UserUtil.getCurrentUser().getBranchId());
		model.addAttribute("branchName", UserUtil.getCurrentUser().getBranchName());
		return model;
	}
	
	@Override
	protected DaySumReportQo getQueryObject(DaySumReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchId())) {
			qo.setBranchId(UserUtil.getCurrBranchId());
		}
		return qo;
	}
	
	@Override
	protected Class<DaySumReportVo> getViewObjectClass() {
		return DaySumReportVo.class;
	}
	
	@GpeMethodListener(moudle = "report", section = "daysum", key = "list")
	public String test01(String userId) {
		GpeHelper.getGpeBean(DaySumReportVo.class);
		return null;
	}
	
}
*/