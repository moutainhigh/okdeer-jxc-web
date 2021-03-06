/**
 *@Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 *@Project: okdeer-jxc-web
 *@Package: com.okdeer.jxc.controller.report.month
 *@Author: songwj
 *@Date: 2017年3月30日 下午2:27:37
 *注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */

package com.okdeer.jxc.controller.report.month;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Maps;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.report.service.MonthStatementService;
import com.okdeer.jxc.report.vo.MonthlyReportVo;

/**
 * @ClassName: MonthlyReportController
 * @Description: TODO
 * @project okdeer-jxc-web
 * @author songwj
 * @date 2017年3月30日 下午2:27:37
 * =================================================================================================
 *     Task ID	         Date		  Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *              	2017年3月30日		  songwj		 
 */
@RestController
@RequestMapping("report/month_old")
public class MonthlyReportController extends BaseController<MonthlyReportController> {

	/**
	 * Logger for this class
	 */
	private static final Logger logger = LoggerFactory.getLogger(MonthlyReportController.class.getName());

	@Reference(version = "1.0.0", check = false)
	private MonthStatementService monthStatementService;

	@RequestMapping(value = "/list")
	public ModelAndView add() {
		if (logger.isDebugEnabled()) {
			logger.debug("add() - start"); //$NON-NLS-1$
		}

		Map<String, String> model = Maps.newHashMap();
		// model.put("branchId", UserUtil.getCurrentUser().getBranchId());
		// model.put("branchName", UserUtil.getCurrentUser().getBranchName());
		model.put("startTime",
				LocalDate.now().minusMonths(1).format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		ModelAndView returnModelAndView = new ModelAndView("report/month/monthlylist", model);
		if (logger.isDebugEnabled()) {
			logger.debug("add() - end"); //$NON-NLS-1$
		}
		return returnModelAndView;
	}

	@RequestMapping(value = "details/list", method = RequestMethod.POST)
	public PageUtils<MonthlyReportVo> getReportList(MonthlyReportVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		if (logger.isDebugEnabled()) {
			logger.debug("getReportList(MonthlyReportVo, int, int) - start"); //$NON-NLS-1$
		}

		Optional<MonthlyReportVo> optional = Optional.ofNullable(vo);
		vo = optional.orElse(new MonthlyReportVo());
		vo.setPageNumber(pageNumber);
		vo.setPageSize(pageSize);
		if(StringUtils.isBlank(vo.getBranchId())){
		    vo.setBranchId(getCurrBranchId());
		}
		if (StringUtils.isNotBlank(vo.getStartTime())) {
			vo.setRptDate(vo.getStartTime());
		} else {
			vo.setRptDate(LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		}
		PageUtils<MonthlyReportVo> pageUtils = monthStatementService.getMonthReportList(vo);
		
		if(pageUtils==null){
			return PageUtils.emptyPage();
		}
		// 汇总合计
		List<MonthlyReportVo> vos = pageUtils.getList();
		if (!CollectionUtils.isEmpty(vos)) {
			if (pageUtils != null) {
			    	MonthlyReportVo footer = monthStatementService.sumMonthReportList(vo);
			    	if(footer!=null){
        			    	footer.setBranchCode("SUM");
        				pageUtils.setFooter(new ArrayList<MonthlyReportVo>(){
        				    private static final long serialVersionUID = 1L;
        
        				    {
        					add(footer);
        				    }
        				});
			    	}
			}
			
			// 过滤数据权限字段
			cleanAccessData(pageUtils);
			return pageUtils;
		}
		PageUtils<MonthlyReportVo> returnPageUtils = PageUtils.emptyPage();
		if (logger.isDebugEnabled()) {
			logger.debug("getReportList(MonthlyReportVo, int, int) - end"); //$NON-NLS-1$
		}
		return returnPageUtils;
	}

	@RequestMapping(value = "/export/list", method = RequestMethod.POST)
	public RespJson exportList(HttpServletResponse response, MonthlyReportVo vo) {
		if (logger.isDebugEnabled()) {
			logger.debug("exportList(HttpServletResponse, MonthlyReportVo) - start"); //$NON-NLS-1$
		}
		RespJson returnRespJson = RespJson.success();
		Optional<MonthlyReportVo> optional = Optional.ofNullable(vo);
		vo = optional.orElse(new MonthlyReportVo());
		if(StringUtils.isBlank(vo.getBranchId())){
		    vo.setBranchId(getCurrBranchId());
		}
		if (StringUtils.isNotBlank(vo.getStartTime())) {
			vo.setRptDate(vo.getStartTime());
		} else {
			vo.setRptDate(LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		}
		List<MonthlyReportVo> exportList = monthStatementService.exportMonthList(vo);
        // 过滤数据权限字段
        cleanAccessData(exportList);
		String fileName = "月进销存报表_" + DateUtils.getCurrSmallStr();
		String templateName = ExportExcelConstant.MONTHLY_REPORT;
		try {
			exportListForXLSX(response, exportList, fileName, templateName);
			if (logger.isDebugEnabled()) {
				logger.debug("exportList(HttpServletResponse, MonthlyReportVo) - end"); //$NON-NLS-1$
			}
			return returnRespJson;
		} catch (Exception e) {
			logger.error("exportList(HttpServletResponse, MonthlyReportVo) - exception ignored", e); //$NON-NLS-1$
			returnRespJson = RespJson.error("导出execl失败!");
		}

		if (logger.isDebugEnabled()) {
			logger.debug("exportList(HttpServletResponse, MonthlyReportVo) - end"); //$NON-NLS-1$
		}
		return returnRespJson;
	}

	@RequestMapping(value = "/print", method = RequestMethod.GET)
	public String printReport(MonthlyReportVo vo, HttpServletResponse response, HttpServletRequest request) {
		Optional<MonthlyReportVo> optional = Optional.ofNullable(vo);
		vo = optional.orElse(new MonthlyReportVo());
		vo.setPageNumber(Integer.valueOf(PAGE_NO));
		vo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
		// 默认当前机构
		if (StringUtils.isBlank(vo.getBranchId()) && StringUtils.isBlank(vo.getBranchName())) {
			vo.setBranchId(getCurrBranchId());
		}
		if (StringUtils.isNotBlank(vo.getStartTime())) {
			vo.setRptDate(vo.getStartTime());
		} else {
			vo.setRptDate(LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_JFP_STR_R)));
		}
		List<MonthlyReportVo> exportList = monthStatementService.exportMonthList(vo);
		// 过滤数据权限字段
        cleanAccessData(exportList);
		if (exportList.size() > PrintConstant.PRINT_MAX_ROW) {
			return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
		}
		String path = PrintConstant.MONTHLY_REPORT;
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("startDate", vo.getRptDate());
		map.put("printName", getCurrentUser().getUserName());
		JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, exportList, "");
		return null;
	}
}
