/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年9月5日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.stock;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.enums.StockAdjustEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.stock.service.StockAdjustSearchService;
import com.okdeer.jxc.stock.vo.StockAdjustSearchVo;

/**
 * ClassName: StockLeadSearchController 
 * @Description: 领用查询
 * @author zhengwj
 * @date 2017年9月5日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("/stock/leadSearch")
public class StockLeadSearchController extends BaseController<StockLeadSearchController> {

	/**
	 * @Fields stockAdjustSearchService : 库存调整查询service
	 */
	@Reference(version = "1.0.0", check = false)
	private StockAdjustSearchService stockAdjustSearchService;

	/**
	 * @Description: 领用查询页面
	 * @author zhengwj
	 * @date 2017年9月5日
	 */
	@RequestMapping(value = "list")
	public String list() {
		return "/stockLead/stockLeadSearchList";
	}

	/**
	 * @Description: 构建参数
	 * @author zhengwj
	 * @date 2017年9月6日
	 */
	private void buildParam(StockAdjustSearchVo vo) {
		vo.setFormType(StockAdjustEnum.LEAD.getKey());
		if (StringUtils.isBlank(vo.getBranchId())) {
			vo.setBranchCompleCode(getCurrBranchCompleCode());
		}

		if (StringUtils.isNotBlank(vo.getEndTime())) {
			vo.setEndTime(DateUtils.getSmallRStr(DateUtils.getDayAfter(DateUtils.parse(vo.getEndTime(),"yyyy-MM-dd"))));
		}

		// 类别汇总查询时将二级类别查询设置为第四种查询
		if (vo.getType() == 3 && vo.getCategoryType() == 2) {
			vo.setType(4);
		}
	}

	/**
	 * @Description: 获取领用列表数据
	 * @author zhengwj
	 * @date 2017年9月5日
	 */
	@RequestMapping(value = "getList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<StockAdjustSearchVo> getList(StockAdjustSearchVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.debug(LogConstant.OUT_PARAM, vo);
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			buildParam(vo);
			PageUtils<StockAdjustSearchVo> reportList = stockAdjustSearchService.getSearchList(vo);
			// 过滤数据权限字段
			cleanAccessData(reportList);
			return reportList;
		} catch (Exception e) {
			LOG.error("获取领用列表数据异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 导出领用查询
	 * @author zhengwj
	 * @date 2017年9月5日
	 */
	@RequiresPermissions("JxcLeadSearch:export")
	@RequestMapping(value = "exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, StockAdjustSearchVo vo) {
		RespJson resp = RespJson.success();
		try {
			buildParam(vo);
			List<StockAdjustSearchVo> exportList = stockAdjustSearchService.getExportList(vo);
			// 过滤数据权限字段
			cleanAccessData(exportList);

			String fileName = "领用查询" + "_" + DateUtils.getCurrSmallStr();
			String templateName = "";

			switch (vo.getType()) {
				case 1:
					templateName = ExportExcelConstant.STOCK_LEAD_DETAIL;
					break;
				case 2:
					templateName = ExportExcelConstant.STOCK_LEAD_GOODS;
					break;
				case 3:
					templateName = ExportExcelConstant.STOCK_LEAD_FIRST_CATEGORY;
					break;
				case 4:
					templateName = ExportExcelConstant.STOCK_LEAD_SECOND_CATEGORY;
					break;
				default:
					return RespJson.error("导出领用查询异常");
			}

			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("导出领用查询异常：{}", e);
			resp = RespJson.error("导出领用查询异常");
		}
		return resp;
	}

}
