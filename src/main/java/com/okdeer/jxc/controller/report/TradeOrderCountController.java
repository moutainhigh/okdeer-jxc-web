/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhangchm
 *@Date: 2016年10月25日
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.dubbo.rpc.RpcContext;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.report.qo.TradeOrderCountQo;
import com.okdeer.jxc.report.service.TradeOrderCountServiceApi;
import com.okdeer.jxc.report.vo.TradeOrderCountVo;
import com.okdeer.jxc.system.entity.SysUser;

/**
 * ClassName: TradeOrderCountController 
 * @Description: 店铺销售排名
 * @author zhangchm
 * @date 2016年10月25日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * 零售管理系统V1.0.2	  2016年10月25日                  zhangchm            配送报表Controller
 */
@Controller
@RequestMapping("bill/tradeOrderCount")
public class TradeOrderCountController extends BasePrintController<TradeOrderCountController, TradeOrderCountVo> {

	//@Reference(version = "1.0.0", check = false)
	@Resource
	TradeOrderCountServiceApi tradeOrderCountServiceApi;

	@Reference(version = "1.0.0", check = false)
	BranchesServiceApi branchesServiceApi;

	/**
	 * @Description: 跳转店铺销售排名页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		return "report/order/tradeOrderCount";
	}

	/**
	 * @Description: 店铺销售排名列表
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author zhangchm
	 * @date 2016年10月27日
	 */
	@RequestMapping(value = "getTradeOrderCounts", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<TradeOrderCountVo> getTradeOrderCounts(TradeOrderCountQo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.debug(LogConstant.OUT_PARAM, vo.toString());
		try {
			if (null == vo.getStartTime() || null == vo.getEndTime()) {
				LOG.info("店铺销售排序查询时间段为空，不可查询");
				return PageUtils.emptyPage();
			}
			Date time = DateUtils.getNextDay(vo.getEndTime());
			vo.setEndTime(time);
			if (StringUtils.isNullOrEmpty(vo.getBranchId())) {
				vo.setBranchId(getCurrBranchId());
			}
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			tradeOrderCountServiceApi.queryTradeOrderCountSum(vo);
			Future<TradeOrderCountVo> tradeOrderCountVo = RpcContext.getContext().getFuture();

			PageUtils<TradeOrderCountVo> tradeOrderCountVos = tradeOrderCountServiceApi.queryLists(vo);

			List<TradeOrderCountVo> footer = new ArrayList<TradeOrderCountVo>();
			if (tradeOrderCountVo != null) {
				footer.add(tradeOrderCountVo.get());
			}
			tradeOrderCountVos.setFooter(footer);

			// 过滤数据权限字段
			cleanAccessData(tradeOrderCountVos);
			LOG.debug(LogConstant.PAGE, tradeOrderCountVos.toString());
			return tradeOrderCountVos;
		} catch (Exception e) {
			LOG.error("店铺销售排名列表查询出现异常:{}", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 导出店铺销售排名列表
	 * @param formId 单号
	 * @return
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, TradeOrderCountQo vo) {
		LOG.debug(LogConstant.OUT_PARAM, vo.toString());
		RespJson resp = RespJson.success();
		try {
			if (null == vo.getStartTime() || null == vo.getEndTime()) {
				LOG.info("店铺销售排序查询时间段为空，不可导出");
				return RespJson.error("请选择查询时间段");
			}
			Date time = DateUtils.getNextDay(vo.getEndTime());
			vo.setEndTime(time);
			if (StringUtils.isNullOrEmpty(vo.getBranchId())) {
				vo.setBranchId(getCurrBranchId());
			}
			List<TradeOrderCountVo> exportList = tradeOrderCountServiceApi.queryTradeOrderCount(vo);
			exportList.add(total(exportList,vo));
			//刪除合計功能,建議採用excel的模板合計,提高效率
			//TradeOrderCountVo tradeOrderCountVo = tradeOrderCountServiceApi.queryTradeOrderCountSum(vo);
			//tradeOrderCountVo.setBranchName("合计：");
			///exportList.add(tradeOrderCountVo);
			// 过滤数据权限字段
			cleanAccessData(exportList);
			String fileName = "店铺销售排名";
			String templateName = ExportExcelConstant.TRADE_ORDER_COUNT_REPORT;
			// 导出Excel
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("TradeOrderCountController:exportList:", e);
			resp = RespJson.error("导出店铺销售排名异常");
		}
		return resp;
	}

	@Override
	protected Map<String, Object> getPrintReplace(String formNo) {
		return null;
	}

	@Override
	protected List<TradeOrderCountVo> getPrintDetail(String formNo) {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getBranchSpecService()
	 */
	@Override
	protected BranchSpecServiceApi getBranchSpecService() {
		return null;
	}
	//计算合计
	private TradeOrderCountVo total(List<TradeOrderCountVo> list,TradeOrderCountQo qo){
		TradeOrderCountVo total=new TradeOrderCountVo();
		total.setBranchName("合计");
		total.setCostAmount(BigDecimal.ZERO);
		total.setDayAvgNum(BigDecimal.ZERO);
		total.setGrossProfit(BigDecimal.ZERO);
//		total.setGrossProfitRate(BigDecimal.ZERO);
		total.setLinePrice(BigDecimal.ZERO);
		total.setOffLinePrice(BigDecimal.ZERO);
		total.setPrice(BigDecimal.ZERO);
		total.setTotalAmount(BigDecimal.ZERO);
		total.setTotalLineAmount(BigDecimal.ZERO);
		total.setTotalLineNum(BigDecimal.ZERO);
		total.setTotalLineSaleNum(BigDecimal.ZERO);
		total.setTotalNum(BigDecimal.ZERO);
		total.setTotalOffLineNum(BigDecimal.ZERO);
		total.setTotalSaleNum(BigDecimal.ZERO);
		for(TradeOrderCountVo vo:list){
			total.setCostAmount(total.getCostAmount().add(vo.getCostAmount()));
			total.setGrossProfit(total.getGrossProfit().add(vo.getGrossProfit()));
			total.setTotalAmount(total.getTotalAmount().add(vo.getTotalAmount()));
			total.setTotalLineAmount(total.getTotalLineAmount().add(vo.getTotalLineAmount()));
			total.setTotalLineNum(total.getTotalLineNum().add(vo.getTotalLineNum()));
			total.setTotalLineSaleNum(total.getTotalLineSaleNum().add(vo.getTotalLineSaleNum()));
			total.setTotalNum(total.getTotalNum().add(vo.getTotalNum()));
			total.setTotalOffLineNum(total.getTotalOffLineNum().add(vo.getTotalOffLineNum()));
			total.setTotalSaleNum(total.getTotalSaleNum().add(vo.getTotalSaleNum()));
		}
		total.setGrossProfitRate(total.getGrossProfit().divide(total.getTotalAmount(),BigDecimal.ROUND_HALF_DOWN,4 ).multiply(BigDecimal.valueOf(100))+"%");
		total.setPrice(isZero(total.getTotalNum())? total.getTotalAmount(): total.getTotalAmount().divide(total.getTotalNum(),BigDecimal.ROUND_HALF_DOWN,4));
		total.setLinePrice(isZero(total.getTotalLineNum())?total.getTotalLineAmount(): total.getTotalLineAmount().divide(total.getTotalLineNum(),BigDecimal.ROUND_HALF_DOWN,4));
		//线下客单价 (总金额-线上金额)/(总订单数-线上订单数)
		total.setOffLinePrice(isZero(total.getTotalNum ().subtract(total.getTotalLineNum()))?total.getTotalAmount().subtract(total.getTotalLineAmount()): total.getTotalAmount().subtract(total.getTotalLineAmount()).divide(total.getTotalNum ().subtract(total.getTotalLineNum()),BigDecimal.ROUND_HALF_DOWN,4));
		//计算日均销量
		int days= DateUtils.pastDays(qo.getStartTime(),qo.getEndTime());
		total.setDayAvgNum(total.getTotalNum().divide(BigDecimal.valueOf(days),BigDecimal.ROUND_HALF_DOWN,4));
		return total;
	}
	private boolean isZero(BigDecimal val){
		if(val==null||BigDecimal.ZERO.compareTo(val)==0){
			return true;
		}
		return false;
	}

}
