/**
 *@Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 *@Project: okdeer-jxc-web
 *@Package: com.okdeer.jxc.controller.finance.iccard
 *@Author: songwj
 *@Date: 2017年5月19日 上午9:49:28
 *注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */

package com.okdeer.jxc.controller.finance.iccard;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.finance.iccard.service.ICCardTradingService;
import com.okdeer.jxc.finance.iccard.vo.TradeOrderPayVo;

/**
 * @ClassName: ICCardTradingController
 * @Description:  一开通交易查询
 * @project okdeer-jxc-web
 * @author songwj
 * @date 2017年5月19日 上午9:49:28
 * =================================================================================================
 *     Task ID	         Date		  Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *     V2.6         	2017年5月19日		  songwj		   一开通交易查询
 */
@Controller
@RestController
@RequestMapping("iccard/trading")
public class ICCardTradingController extends BasePrintController<TradeOrderPayVo, TradeOrderPayVo> {

	private static final Logger logger = LoggerFactory.getLogger(ICCardTradingController.class);

	@Reference(version = "1.0.0", check = false)
	private ICCardTradingService icCardTradingService;

	@RequestMapping(value = "", method = RequestMethod.GET)
	public ModelAndView iccardSetting() {
		return new ModelAndView("finance/iccard/iccardTradingList");
	}

	@RequestMapping(value = "/list")
	public PageUtils<TradeOrderPayVo> overdueApprovedList(TradeOrderPayVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize, HttpServletRequest request) {

		Optional<TradeOrderPayVo> optional = Optional.ofNullable(vo);
		vo = optional.orElse(new TradeOrderPayVo());
		vo.setPageNumber(pageNumber);
		vo.setPageSize(pageSize);
		String salesmanId = request.getParameter("salesmanId");
		String queryType = request.getParameter("queryType");
		if (StringUtils.isNotBlank(salesmanId)) {
			vo.setOperatorId(salesmanId);
		}
		String branchCompleCode = request.getParameter("branchCompleCode");
		if(StringUtils.isNotBlank(branchCompleCode)){
			vo.setBranchCode(branchCompleCode);
		}else{
			vo.setBranchCode(getCurrentUser().getBranchCompleCode());
		}

		PageUtils<TradeOrderPayVo> suppliers;// = PageUtils.emptyPage();
		try {
			if (StringUtils.equalsIgnoreCase("1", queryType)) {
				suppliers = icCardTradingService.selectTradingList(vo, Boolean.TRUE);
				TradeOrderPayVo tradeOrderPayVo = icCardTradingService.sumTradingList(vo);
				tradeOrderPayVo = tradeOrderPayVo == null ? new TradeOrderPayVo() : tradeOrderPayVo;
				tradeOrderPayVo.setBranchCode("SUM");
				List<TradeOrderPayVo> list = new ArrayList<TradeOrderPayVo>();
				list.add(tradeOrderPayVo);
				suppliers.setFooter(list);
			} else {
				vo.setValue("");
				suppliers = icCardTradingService.selectTradingSumList(vo, Boolean.TRUE);
				TradeOrderPayVo tradeOrderPayVo = icCardTradingService.sumTradingSumList(vo);
				tradeOrderPayVo = tradeOrderPayVo == null ? new TradeOrderPayVo() : tradeOrderPayVo;
				tradeOrderPayVo.setBranchCode("SUM");
				List<TradeOrderPayVo> list = new ArrayList<TradeOrderPayVo>();
				list.add(tradeOrderPayVo);
				suppliers.setFooter(list);
			}

			return suppliers;
		} catch (Exception e) {
			logger.error("一卡通查询列表失败！", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "/exports")
	public RespJson export(TradeOrderPayVo vo, HttpServletRequest request, HttpServletResponse response) {
		try {
			Optional<TradeOrderPayVo> optional = Optional.ofNullable(vo);
			vo = optional.orElse(new TradeOrderPayVo());
			vo.setPageNumber(Integer.valueOf(PAGE_NO));
			vo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
			String salesmanId = request.getParameter("salesmanId");
			String queryType = request.getParameter("queryType");
			String branchCompleCode = request.getParameter("branchCompleCode");
			if (StringUtils.isNotBlank(salesmanId)) {
				vo.setOperatorId(salesmanId);
			}
			if(StringUtils.isNotBlank(branchCompleCode)){
				vo.setBranchCode(branchCompleCode);
			}else{
				vo.setBranchCode(getCurrentUser().getBranchCompleCode());
			}
			if(StringUtils.isNotBlank(vo.getBranchName())){
				vo.setBranchName(vo.getBranchCode().replaceAll("[\\[\\d+\\]]",""));
			}
			if (StringUtils.equalsIgnoreCase("1", queryType)) {
				PageUtils<TradeOrderPayVo> suppliers = icCardTradingService.selectTradingList(vo, Boolean.FALSE);
				List<TradeOrderPayVo> list = suppliers.getList();
				if (!list.isEmpty() && list.size() > 0) {
					String fileName = "一卡通交易明细" + "_" + DateUtils.getCurrSmallStr();
					String templateName = ExportExcelConstant.ICC_CARD_TRADING_DETAIL;
					
					TradeOrderPayVo tradeOrderPayVo = icCardTradingService.sumTradingList(vo);
					tradeOrderPayVo = tradeOrderPayVo == null ? new TradeOrderPayVo() : tradeOrderPayVo;
					tradeOrderPayVo.setBranchCode("合计:");
					//添加合计
					list.add(tradeOrderPayVo);
					
					exportListForXLSX(response, list, fileName, templateName);
				} else {
					return RespJson.error("无数据可导");
				}
			} else {
				PageUtils<TradeOrderPayVo> suppliers = icCardTradingService.selectTradingSumList(vo, Boolean.FALSE);
				List<TradeOrderPayVo> list = suppliers.getList();
				if (!list.isEmpty() && list.size() > 0) {
					String fileName = "一卡通交易汇总" + "_" + DateUtils.getCurrSmallStr();
					String templateName = ExportExcelConstant.ICC_CARD_SUM_TRADING_DETAIL;
					TradeOrderPayVo tradeOrderPayVo = icCardTradingService.sumTradingSumList(vo);
					tradeOrderPayVo = tradeOrderPayVo == null ? new TradeOrderPayVo() : tradeOrderPayVo;
					tradeOrderPayVo.setBranchCode("合计：");
					//添加到合计
					list.add(tradeOrderPayVo);
					exportListForXLSX(response, list, fileName, templateName);
				} else {
					return RespJson.error("无数据可导");
				}
			}
		} catch (Exception e) {
			logger.error("一卡通查询详情导出异常:", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}

	@RequestMapping(value = "/report/print", method = RequestMethod.GET)
	public String editPrintReport(TradeOrderPayVo vo, HttpServletResponse response, HttpServletRequest request) {
		Optional<TradeOrderPayVo> optional = Optional.ofNullable(vo);
		vo = optional.orElse(new TradeOrderPayVo());
		vo.setPageNumber(Integer.valueOf(PAGE_NO));
		vo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);

		PageUtils<TradeOrderPayVo> suppliers;
		String salesmanId = request.getParameter("salesmanId");
		String queryType = request.getParameter("queryType");
		String branchCompleCode = request.getParameter("branchCompleCode");

		if (StringUtils.isNotBlank(salesmanId)) {
			vo.setOperatorId(salesmanId);
		}
		if(StringUtils.isNotBlank(branchCompleCode)){
			vo.setBranchCode(branchCompleCode);
		}else{
			vo.setBranchCode(getCurrentUser().getBranchCompleCode());
		}
		if(StringUtils.isNotBlank(vo.getBranchName())){
			vo.setBranchName(vo.getBranchCode().replaceAll("[\\[\\d+\\]]",""));
		}
		String path;
		if (StringUtils.equalsIgnoreCase("1", queryType)) {
			suppliers = icCardTradingService.selectTradingList(vo, Boolean.TRUE);
			path = PrintConstant.ICC_CARD_TRADING_DETAIL;
		} else {
			suppliers = icCardTradingService.selectTradingSumList(vo, Boolean.TRUE);
			path = PrintConstant.ICC_CARD_SUM_TRADING_DETAIL;
		}

		List<TradeOrderPayVo> list = suppliers.getList();

		if (list.size() > PrintConstant.PRINT_MAX_ROW) {
			return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
		}

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("startDate", DateUtils.formatDate(vo.getStartTime(), DateUtils.DATE_SMALL_STR_R));
		map.put("endDate", DateUtils.formatDate(vo.getEndTime(), DateUtils.DATE_SMALL_STR_R));
		map.put("printName", getCurrentUser().getUserName());
		JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, list, "");
		return null;
	}

	@Override
	protected Map<String, Object> getPrintReplace(String formNo) {
		return null;
	}

	@Override
	protected List<TradeOrderPayVo> getPrintDetail(String formNo) {
		return null;
	}

	@Override
	protected BranchSpecServiceApi getBranchSpecService() {
		return null;
	}
}
