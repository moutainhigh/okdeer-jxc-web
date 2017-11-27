/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.enums.BranchGoodsStatusEnum;
import com.okdeer.jxc.common.enums.PricingTypeEnum;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.qo.StockReportQo;
import com.okdeer.jxc.report.service.StockReportService;
import com.okdeer.jxc.report.vo.StockReportVo;
import com.okdeer.jxc.utils.UserUtil;

/**
 * 
 * ClassName: StockReportController 
 * @Description: 库存查询
 * @author dongh
 * @date 2016年8月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("stock/report")
public class StockReportController extends BaseController<StockReportController> {

	@Reference(version = "1.0.0", check = false)
	private StockReportService stockReportService;

	/**
	 * 
	 * @Description: 商品库存查询跳转页
	 * @return 返回视图
	 * @author taomm
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		model.addAttribute("pricingType", PricingTypeEnum.values()); // 计价方式
		model.addAttribute("goodsStatus", BranchGoodsStatusEnum.values()); // 商品状态
		return "report/goods/goodsStockReport";
	}

	/**
	 * 
	 * @Description: 库存查询
	 * @param qo 请求参数
	 * @param pageNumber
	 * @param pageSize
	 * @return 返回查询结果
	 * @author dongh
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "getList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<StockReportVo> getList(StockReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			LOG.debug("商品库存查询，报表查询参数：{}", qo);
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);
			LOG.info("StockReportController.getList商品库存查询分页参数：{}, {}", pageNumber, pageSize);

			// 构建默认参数
			qo = buildDefaultParams(qo);

			// 1、列表查询
			PageUtils<StockReportVo> page = stockReportService.queryListToPage(qo);
			// 获取页脚合计一栏数据
			List<StockReportVo> sum = getFooterList(qo);
			page.setFooter(sum);
			// 过滤数据权限字段
			cleanAccessData(page);
			return page;
		} catch (Exception e) {
			LOG.error("商品库存查询异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 获取页脚合计一栏数据
	 * @param qo
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private List<StockReportVo> getFooterList(StockReportQo qo) {
		// 2、汇总查询
		StockReportVo footer = stockReportService.queryStockReportSum(qo);

		String branchCode = "<b>" + footer.getBranchCode() + "</b>";
		footer.setBranchCode(branchCode);
		if (null == footer.getActual()) {
			footer.setActual(BigDecimal.ZERO);
		}
		if (null == footer.getCostAmount()) {
			footer.setCostAmount(BigDecimal.ZERO);
		}
		if (null == footer.getUntaxedCostAmount()) {
		    footer.setUntaxedCostAmount(BigDecimal.ZERO);
		}
		if (null == footer.getSaleAmount()) {
			footer.setSaleAmount(BigDecimal.ZERO);
		}
		footer.setCostPrice(null);
		footer.setSalePrice(null);
		List<StockReportVo> sum = new ArrayList<StockReportVo>();
		sum.add(footer);
		return sum;
	}

	/**
	 * 
	 * @Description: 报表导出
	 * @param request
	 * @param response
	 * @param vo
	 * @author dongh
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public String exportList(StockReportQo qo, HttpServletResponse response) {

		LOG.debug("商品库存查询，报表导出参数：{}", qo);
		try {
			// 构建默认参数
			qo = buildDefaultParams(qo);
			// 2、汇总查询(导出的请求分成多次，先求总计，再查明细)
			StockReportVo footer = stockReportService.queryStockReportSum(qo);
			if (null == footer.getActual()) {
				footer.setActual(BigDecimal.ZERO);
			}
			if (null == footer.getCostAmount()) {
				footer.setCostAmount(BigDecimal.ZERO);
			}
			if (null == footer.getUntaxedCostAmount()) {
			    footer.setUntaxedCostAmount(BigDecimal.ZERO);
			}
			if (null == footer.getSaleAmount()) {
				footer.setSaleAmount(BigDecimal.ZERO);
			}
			// 1、列表查询
//			List<StockReportVo> exportList = stockReportService.queryList(qo);
			List<StockReportVo> exportList = queryListPartition(qo);
			
			if (CollectionUtils.isEmpty(exportList)) {
				exportList = new ArrayList<StockReportVo>();
			}
			exportList.add(footer);
			// 过滤数据权限字段
			cleanAccessData(exportList);
			String fileName = "商品库存报表" + "_" + DateUtils.getCurrSmallStr();
			String templateName = ExportExcelConstant.STOCKREPORT;
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("商品库存查询报表导出异常:", e);
		}
		return null;
	}

	/**
	 * @Description: 构建默认参数
	 * @param qo
	 * @author liwb
	 * @date 2016年9月26日
	 */
	private StockReportQo buildDefaultParams(StockReportQo qo) {

		// 去掉选择机构的展示参数
		String branchNameOrCode = qo.getBranchNameOrCode();
		if (StringUtils.isNotBlank(branchNameOrCode) && branchNameOrCode.contains("[") && branchNameOrCode.contains("]")) {
			qo.setBranchNameOrCode(null);
		}

		// 去掉选择类型的展示参数
		String categoryNameCode = qo.getCategoryNameOrCode();
		if (StringUtils.isNotBlank(categoryNameCode) && categoryNameCode.contains("[") && categoryNameCode.contains("]")) {
			qo.setCategoryNameOrCode(null);
		}

		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCode()) && StringUtils.isBlank(qo.getBranchNameOrCode())) {
			/**
			 * 2.5.3  默认查询当前分公司
			 */
//			if(UserUtil.getCurrBranchType()==0||UserUtil.getCurrBranchType()==1||UserUtil.getCurrBranchType()==1){
				qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
//			}else{
//				String branchCompleCode=UserUtil.getCurrBranchCompleCode();
//				qo.setBranchCompleCode(branchCompleCode.substring(0, branchCompleCode.length()-5));
//			}
		}

		return qo;
	}

	/**
	 * 把导出的请求分成多次，一次请求LIMIT_REQ_COUNT条数据
	 * @param qo
	 * @return
	 */
	private List<StockReportVo> queryListPartition(StockReportQo qo){
		List<StockReportVo> voList = new ArrayList<>();
		int startCount = limitStartCount(qo.getStartCount());
		int endCount = limitEndCount(qo.getEndCount());
		
		LOG.info("StockReportController.queryListPartition商品库存导出startCount和endCount参数：{}, {}", startCount, endCount);
		
		int resIndex = (int) (endCount / LIMIT_REQ_COUNT);
		int modIndex = endCount % LIMIT_REQ_COUNT;
		LOG.info("StockReportController.queryListPartition商品库存导出resIndex和modIndex参数：{}, {}", resIndex, modIndex);
		if(resIndex > 0){
			for(int i = 0; i < resIndex; i++){
				int newStart = (i * LIMIT_REQ_COUNT) + startCount;
				qo.setStartCount(newStart);
				qo.setEndCount(LIMIT_REQ_COUNT);
				LOG.info("StockReportController.queryListPartition for商品库存导出i、startCount、endCount参数：{}, {}, {}", i, newStart, LIMIT_REQ_COUNT);
				List<StockReportVo> tempList = stockReportService.queryList(qo);
				voList.addAll(tempList);
			}
			if(modIndex > 0){
				int newStart = (resIndex * LIMIT_REQ_COUNT) + startCount;
				int newEnd = modIndex;
				qo.setStartCount(newStart);
				qo.setEndCount(newEnd);
				LOG.info("StockReportController.queryListPartition商品库存导出mod、startCount、endCount参数:{}, {}", newStart, newEnd);
				List<StockReportVo> tempList = stockReportService.queryList(qo);
				voList.addAll(tempList);
			}
		}else{
			List<StockReportVo> tempList = stockReportService.queryList(qo);
			LOG.info("StockReportController.queryListPartition商品库存导出不超过:{}", LIMIT_REQ_COUNT);
			voList.addAll(tempList);
		}
		return voList;
	}
}