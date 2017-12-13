package com.okdeer.jxc.controller.report.logistics;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.logistics.qo.LogisticsDeliverDaSumQo;
import com.okdeer.jxc.report.logistics.servce.LogisticsDeliverDaSumService;
import com.okdeer.jxc.report.logistics.vo.LogisticsDeliverDaSumVo;
import com.okdeer.retail.common.page.EasyUIPageInfo;

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
@RestController
@RequestMapping("logistics/deliverDaSum")
public class LogisticsDeliverDaSumController extends BaseController<LogisticsDeliverDaSumController> {

	@Reference(version = "1.0.0", check = false)
	private LogisticsDeliverDaSumService logisticsDeliverDaSumService;

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#index(org.springframework.web.servlet.ModelAndView)
	 */
	@RequestMapping(value = "/index")
	public ModelAndView index(ModelAndView modelAndView) {
		// 获取ModelAndView对象
		modelAndView.setViewName("logistics/deliverDaSum");
		// 返回ModelAndView
		return modelAndView;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "list")
	public EasyUIPageInfo<LogisticsDeliverDaSumVo> getBranchList(LogisticsDeliverDaSumQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		qo.setPageNum(pageNumber);
		qo.setPageSize(pageSize);
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(this.getCurrBranchCompleCode());
		}
		if (StringUtils.isNotBlank(qo.getSourceBranchId())) {
			qo.setSourceBranchName(null);
		}
		LOG.debug("查询物流销售单商品汇总导出：{}", qo);
		try {
			return logisticsDeliverDaSumService.queryListPage(qo);
		} catch (Exception e) {
			LOG.error("查询物流销售单商品汇总导出异常:", e);
		}
		return new EasyUIPageInfo(new ArrayList<LogisticsDeliverDaSumVo>());
	}

	@RequestMapping(value = "exportList")
	public RespJson exportList(LogisticsDeliverDaSumQo qo, HttpServletResponse response) {
		try {
			// 默认当前机构
			if (StringUtils.isBlank(qo.getBranchCompleCode())) {
				qo.setBranchCompleCode(this.getCurrBranchCompleCode());
			}
			if (StringUtils.isNotBlank(qo.getSourceBranchId())) {
				qo.setSourceBranchName(null);
			}
			List<LogisticsDeliverDaSumVo> list = logisticsDeliverDaSumService.queryList(qo);
			String fileName = "物流销售单商品汇总";
			String templateName = "logisticsDeliverDaSum.xlsx";
			/*
			 * LogisticsDeliverDaSumVo sumVo
			 * =logisticsDeliverDaSumService.queryTotal(qo); list.add(sumVo);
			 */
			// 导出Excel
			exportListForXLSX(response, list, fileName, templateName);
			// 添加导出次数
			return null;
		} catch (Exception e) {
			LOG.error("查询物流销售单商品汇总导出{}", e);
		}
		return RespJson.error();
	}

}
