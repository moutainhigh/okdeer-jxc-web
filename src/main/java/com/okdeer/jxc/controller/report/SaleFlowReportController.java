/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.print.JasperHelper;
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
	/**
	 * 
	 * @Description: 收银流水导出报表
	 * @param response
	 * @param vo
	 * @return
	 * @author dongh
	 * @date 2016年8月25日
	 *//*
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList2(HttpServletResponse response, SaleFlowReportQo qo) {

		LOG.debug("UserController.exportList start ,parameter vo=" + qo);
		try {
			qo.setPageNum(Constant.ONE);
			qo.setPageSize(Constant.MAX_EXPORT_NUM);
			// 设置默认查询条件参数
			qo = getDefultParmas(qo);
			// 1、查询列表
			
			//查询合计
			SaleFlowReportVo saleFlowReportVo = saleFlowReportService.querySaleFlowReportSum(qo);
			
			// 导出的数据列表
			List<SaleFlowReportVo> exportList = new ArrayList<SaleFlowReportVo>();
			
			// 限制导出数据的起始数量
			int startCount = limitStartCount(qo.getStartCount());
			// 限制导出数据的总数量
			int endCount = limitEndCount(qo.getEndCount());
			
			// 商，按2K条数据一次查询拆分，可以拆分为多少次查询
			int resIndex = (int) (endCount / LIMIT_REQ_COUNT);
			// 余数，按2K拆分后，剩余的数据
			int modIndex = endCount % LIMIT_REQ_COUNT;
			
			// 每2K条数据一次查询
			for(int i = 0; i < resIndex; i++){
				int newStart = (i * LIMIT_REQ_COUNT) + startCount;
				qo.setStartCount(newStart);
				qo.setEndCount(LIMIT_REQ_COUNT);
				List<SaleFlowReportVo> tempList = saleFlowReportService.querySaleList(qo);
				exportList.addAll(tempList);
			}
			// 存在余数时，查询剩余的数据
			if(modIndex > 0){
				int newStart = (resIndex * LIMIT_REQ_COUNT) + startCount;
				int newEnd = modIndex;
				qo.setStartCount(newStart);
				qo.setEndCount(newEnd);
				List<SaleFlowReportVo> tempList = saleFlowReportService.querySaleList(qo);
				exportList.addAll(tempList);
			}
			
			if(CollectionUtils.isNotEmpty(exportList)){
				// 2、汇总查询
				exportList.add(saleFlowReportVo);
				String fileName = "销售流水报表" + "_" + DateUtils.getCurrSmallStr();
				String templateName = ExportExcelConstant.SALEFLOWREPORT;
				exportListForXLSX(response, exportList, fileName, templateName);
			}else{
				RespJson json = RespJson.error("无数据可导");
				return json;
			}
		} catch (Exception e) {
			LOG.error("UserController.exportList Exception:", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}*/
	private SaleFlowReportQo getDefultParmas(SaleFlowReportQo qo) {
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
		if (StringUtils.isBlank(qo.getBranchCode()) && StringUtils.isBlank(qo.getBranchNameOrCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}

		return qo;
	}
	/**
	 * @Description: 收银对账报表打印
	 * @param qo
	 * @param response
	 * @param request
	 * @param pageNumber
	 * @author lijy02
	 * @date 2016年9月6日
	 */
	@RequestMapping(value = "printReport", method = RequestMethod.GET)
	@ResponseBody
	public String printReport(SaleFlowReportQo qo, HttpServletResponse response, HttpServletRequest request) {
		try {
			// 设置默认查询条件参数
			qo = getDefultParmas(qo);
			if(saleFlowReportService.querySaleListCount(qo)>PrintConstant.PRINT_MAX_ROW){
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			
			List<SaleFlowReportVo> list = saleFlowReportService.querySaleList(qo);
			if(!CollectionUtils.isEmpty(list)&&list.size()>PrintConstant.PRINT_MAX_ROW){
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			String path = PrintConstant.SALE_FLOW_REPORT;

			Map<String, Object> map = new HashMap<String, Object>();
			map.put("startDate", qo.getStartTime());
			map.put("endDate", qo.getEndTime());
			map.put("printName", UserUtil.getCurrentUser().getUserName());
			JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, list, "");
		} catch (Exception e) {
			LOG.error(PrintConstant.SALE_FLOW_PRINT_ERROR, e);
		}
		return null;
	}
	
}
