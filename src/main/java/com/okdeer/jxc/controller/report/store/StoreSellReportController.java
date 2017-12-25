/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer-jxc-web
 * @Package: com.okdeer.jxc.controller.report.supplier
 * @author songwj
 * @date 2017年07月14 17:18
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.report.store;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.facade.report.entity.StoreSell;
import com.okdeer.retail.facade.report.facade.StoreSellFacade;
import com.okdeer.retail.facade.report.qo.StoreSellQo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 *
 * @ClassName: SupplierStockReportController
 * @Description: 门店销售报表
 * @project okdeer-jxc-web
 * @author songwj
 * @date 2017年07月14 17:18
 * =================================================================================================
 *     Task ID            Date               Author           Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *     V2.7         2017年07月14   songwj             TODO
 */
@RestController
@RequestMapping("/report/store/sell")
public class StoreSellReportController extends AbstractSimpleGpeController<StoreSellQo, StoreSell> {

	@Reference(version = "1.0.0", check = false)
	StoreSellFacade storeSellFacade;

	/*
	 * @RequestMapping(value = "/list", method = RequestMethod.POST) public
	 * PageUtils<StoreSell> getReportList(StoreSellQo vo,
	 * 
	 * @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
	 * 
	 * @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
	 * //Optional<StoreSellQo> optional = Optional.ofNullable(vo); //vo =
	 * optional.orElse(new StoreSellQo()); vo.setPageNum(pageNumber);
	 * vo.setPageSize(pageSize);
	 * if(StringUtils.isBlank(vo.getBranchCompleCode())){
	 * vo.setBranchCode(getCurrBranchCompleCode()); }else{
	 * vo.setBranchCode(vo.getBranchCompleCode()); } if
	 * (StringUtils.isNotBlank(vo.getStartTime())) { PageUtils<StoreSell>
	 * pageUtils = storeSellFacade.getStoreSells(vo);
	 * 
	 * if(pageUtils!=null){ StoreSell reportVo =
	 * storeSellFacade.sumStoreSells(vo); if(reportVo!=null){
	 * reportVo.setBranchCode("SUM"); pageUtils.setFooter(new
	 * ArrayList<StoreSell>(Arrays.asList(reportVo))); }else{
	 * pageUtils.setFooter(new ArrayList<StoreSell>()); } // 过滤数据权限字段
	 * cleanAccessData(pageUtils); return pageUtils; } } return
	 * PageUtils.emptyPage(); }
	 */

	/*@RequestMapping(value = "/export/list", method = RequestMethod.POST)
	public RespJson exportList(HttpServletResponse response, StoreSellQo vo) {
		RespJson resp = RespJson.success();
		// Optional<StoreSellQo> optional = Optional.ofNullable(vo);
		// vo = optional.orElse(new StoreSellQo());

		if (StringUtils.isBlank(vo.getBranchCompleCode())) {
			vo.setBranchCode(getCurrBranchCompleCode());
		} else {
			vo.setBranchCode(vo.getBranchCompleCode());
		}
		if (StringUtils.isNotBlank(vo.getStartTime())) {
			List<StoreSell> exportList = storeSellFacade.exportStoreSells(vo);
			// 过滤数据权限字段
			cleanAccessData(exportList);
			String fileName = "门店商品进销汇总分析_" + DateUtils.getCurrSmallStr();
			String templateName = ExportExcelConstant.STORE_SELL_REPORT;
			exportListForXLSX(response, exportList, fileName, templateName);
		} else {
			resp = RespJson.error();
		}
		return resp;
	}*/

	@RequestMapping(value = "/print", method = RequestMethod.GET)
	public String printReport(StoreSellQo vo, HttpServletResponse response, HttpServletRequest request) {
		// Optional<StoreSellQo> optional = Optional.ofNullable(vo);
		// vo = optional.orElse(new StoreSellQo());
		vo.setPageNum(Integer.valueOf(PAGE_NO));
		vo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
		// 默认当前机构
		if (StringUtils.isBlank(vo.getBranchCompleCode())) {
			vo.setBranchCode(getCurrBranchCompleCode());
		} else {
			vo.setBranchCode(vo.getBranchCompleCode());
		}
		if (StringUtils.isNotBlank(vo.getStartTime())) {
			List<StoreSell> exportList = storeSellFacade.exportStoreSells(vo);
			// 过滤数据权限字段
			cleanAccessData(exportList);
			if (exportList.size() > PrintConstant.PRINT_MAX_ROW) {
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			String path = PrintConstant.STORE_SELL_REPORT;
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("startDate", vo.getStartTime());
			map.put("endDate", vo.getStartTime());
			map.put("printName", getCurrentUser().getUserName());
			JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, exportList, "");
		}
		return null;
	}

	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, GpeMarkContrant.SECTION_STORE_SELL, GpeMarkContrant.KEY_LIST);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("/report/store/selllist");
		return modelAndView;
	}

	@Override
	protected Set<String> getForbidSet() {
		return null;
	}

	@Override
	protected Class<StoreSell> getViewObjectClass() {
		return StoreSell.class;
	}

	@Override
	protected EasyUIPageInfo<StoreSell> queryListPage(StoreSellQo qo) {
		if(StringUtils.isEmpty(qo.getBranchCompleCode())){
			qo.setBranchCompleCode(this.getCurrBranchCompleCode());
		}
		return storeSellFacade.getStoreSells(qo);
	}

	@Override
	protected StoreSell queryTotal(StoreSellQo qo) {
		if(StringUtils.isEmpty(qo.getBranchCompleCode())){
			qo.setBranchCompleCode(this.getCurrBranchCompleCode());
		}
		StoreSell sell= storeSellFacade.sumStoreSells(qo);
		sell.setBranchCode("合计：");
		return sell;
	}

	@Override
	protected List<StoreSell> queryList(StoreSellQo qo) {
		if(StringUtils.isEmpty(qo.getBranchCompleCode())){
			qo.setBranchCompleCode(this.getCurrBranchCompleCode());
		}
		return storeSellFacade.exportStoreSells(qo);
	}
}
