/** 
 *@Project: okdeer-jxc-web 
 *@Author: lijy02
 *@Date: 2016年10月25日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.purchase;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.purchase.po.PurchaseReportPo;
import com.okdeer.jxc.form.purchase.qo.FormQueryQo;
import com.okdeer.jxc.form.purchase.service.PurchaseReportService;


@Controller
@RequestMapping("report/purchase")
public class PurchaseReportController extends
		BaseController<PurchaseReportController> {

	/**
	 * @Fields purchaseReportService : 采购报表service
	 */
	@Reference(version = "1.0.0", check = false)
	private PurchaseReportService purchaseReportService;

	/**
	 * @Description: 采购报表明细
	 * @return
	 * @author lijy02
	 * @date 2016年10月25日
	 */
	@RequestMapping("/detail")
	public String detail() {
		return "report/purchase/details";
	}
	
	/**
	 * @Description: 采购汇总页面
	 * @return
	 * @author lijy02
	 * @date 2016年10月25日
	 */
	@RequestMapping("/total")
	public String total() {
		return "report/purchase/total";
	}
	
	/**
	 * @Description: 采购明细查询
	 * @param qo 采购报名查询字段类
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author lijy02
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "getPurReportDetail", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseReportPo> getPurReportDetail(
			FormQueryQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			LOG.debug("采购明细查询：{}", qo);
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);

			PageUtils<PurchaseReportPo> list = purchaseReportService
					.getPurReportDetail(qo);

			// 2、查询合计
			PurchaseReportPo vo = purchaseReportService
					.getPurReportDetailSum(qo);
			List<PurchaseReportPo> footer = new ArrayList<PurchaseReportPo>();
			footer.add(vo);
			list.setFooter(footer);
			return list;

		} catch (Exception e) {
			LOG.error("采购明细查询:", e);
		}
		return PageUtils.emptyPage();
	}
	
	
	/**
	 * @Description: 采购单明细导出
	 * @param response
	 * @param qo
	 * @author lijy02
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "exportDetails")
	public void exportDetails(HttpServletResponse response,FormQueryQo qo) {
		LOG.info("采购单明细导出:{}" + qo);
		try {
			PageUtils<PurchaseReportPo> result = purchaseReportService
					.getPurReportDetail(qo);
			List<PurchaseReportPo> exportList =result.getList();
			// 导出文件名称，不包括后缀名
			String fileName = "采购明细表" + "_" + DateUtils.getCurrSmallStr();
			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.PURCHASE_DETAIL_REPORT;
			// 导出Excel
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("GoodsPriceAdjustController:exportList:", e);
		}
	}
	/**
	 * @Description: 采购汇总表
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author lijy02
	 * @date 2016年10月26日
	 */
	@RequestMapping(value = "getPurReportTotal", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseReportPo> getPurReportTotal(
			FormQueryQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			LOG.debug("采购汇总表查询：{}", qo);
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);
			PageUtils<PurchaseReportPo> list=null;
			switch (qo.getSearchType()) {
				case "supplierTotal":
					list=getPurReportTotalBySupplier(qo);
					break;
				case "formNoTotal":
					list=getPurReportTotalByFormNo(qo);
					break;
				case "categoryTotal":
					list=getPurReportTotalByCategory(qo);
					break;	
				default:
					list=getPurReportTotalByGoods(qo);
					break;
			}
			return list;
		} catch (Exception e) {
			LOG.error("采购汇总表查询:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: TODO
	 * @param qo
	 * @return
	 * @author lijy02
	 * @date 2016年10月26日
	 */
	private PageUtils<PurchaseReportPo> getPurReportTotalByCategory(
			FormQueryQo qo) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @Description: TODO
	 * @param qo
	 * @return
	 * @author lijy02
	 * @date 2016年10月26日
	 */
	private PageUtils<PurchaseReportPo> getPurReportTotalByFormNo(FormQueryQo qo) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @Description: TODO
	 * @param qo
	 * @return
	 * @author lijy02
	 * @date 2016年10月26日
	 */
	private PageUtils<PurchaseReportPo> getPurReportTotalBySupplier(
			FormQueryQo qo) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @Description: 获得采购报表汇总（按商品）
	 * @author lijy02
	 * @date 2016年10月26日
	 */
	private PageUtils<PurchaseReportPo> getPurReportTotalByGoods(FormQueryQo qo) {
		PageUtils<PurchaseReportPo> list = purchaseReportService
				.getPurReportTotalByGoods(qo);
		// 2、查询合计
		PurchaseReportPo vo = purchaseReportService
				.getPurReportTotalByGoodsSum(qo);
		List<PurchaseReportPo> footer = new ArrayList<PurchaseReportPo>();
		footer.add(vo);
		list.setFooter(footer);
		return list;
	}
	
}
