package com.okdeer.jxc.controller.report.goodsanalysis;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.common.price.PriceConstant;
import com.okdeer.retail.facade.report.goodsanalysis.facade.GoodsSaleSummaryAnalysisFacade;
import com.okdeer.retail.facade.report.goodsanalysis.qo.GoodsSaleSummaryAnalysisQo;
import com.okdeer.retail.facade.report.goodsanalysis.vo.GoodsSaleSummaryAnalysisByBigCategoryVo;
import com.okdeer.retail.facade.report.goodsanalysis.vo.GoodsSaleSummaryAnalysisByGoodsVo;
import com.okdeer.retail.facade.report.goodsanalysis.vo.GoodsSaleSummaryAnalysisByStoreVo;
import com.okdeer.retail.facade.report.goodsanalysis.vo.GoodsSaleSummaryAnalysisByStoreGoodsVo;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;

/**
 * 
 * ClassName: GoodsSaleSummaryAnalysisController 
 * @Description: 商品销售汇总分析
 * @author zhangq
 * @date 2017年11月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/goodsTotalAnalysi")
public class GoodsSaleSummaryAnalysisController extends AbstractMutilGpeController<GoodsSaleSummaryAnalysisQo> {

	/**
	 * 商品销售汇总分析Facade接口
	 */
	@Reference(version = "1.0.0", check = false)
	private GoodsSaleSummaryAnalysisFacade goodsSaleSummaryAnalysisFacade;

	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesServiceApi;

	@RequestMapping("/list")
	public ModelAndView list(ModelAndView modelAndView) {
		return index(modelAndView);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getMutilCustomMark()
	 */
	@Override
	protected MutilCustomMarkBean getMutilCustomMark() {
		return new MutilCustomMarkBean(MOUDLE_REPORT, SECTION_GOODS_SALE_SUMMARY_ANALYSIS, KEY_BY_GOODS,
				KEY_BY_BIG_CATEGORY, KEY_BY_STORE, KEY_BY_STORE_GOODS);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(getCurrBranchId());
		modelAndView.addObject("branchesGrow", branchesGrow);
		modelAndView.setViewName("/report/goodsanalysis/goodsSaleSummaryAnalysis");
		return modelAndView;
	}

	@Override
	protected Set<String>[] getForbidSetArray() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractMutilGpeController#getViewObjectClassArray()
	 */
	@Override
	protected Class<?>[] getViewObjectClassArray() {
		return new Class<?>[] { GoodsSaleSummaryAnalysisByGoodsVo.class, GoodsSaleSummaryAnalysisByBigCategoryVo.class,
				GoodsSaleSummaryAnalysisByStoreVo.class, GoodsSaleSummaryAnalysisByStoreGoodsVo.class };
	}

	@Override
	protected EasyUIPageInfo<?> queryListPage(GoodsSaleSummaryAnalysisQo qo) {
		try {
			if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
				qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			}
			int startCount = (qo.getPageNum() - 1) * qo.getPageSize();
			int endCount = qo.getPageSize();
			qo.setStartCount(startCount);
			qo.setEndCount(endCount);
			EasyUIPageInfo<?> page = null;
			if (KEY_BY_GOODS.equals(qo.getTabKey())) {
				page = goodsSaleSummaryAnalysisFacade.queryListPageByGoods(qo);
			} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
				page = goodsSaleSummaryAnalysisFacade.queryListPageByBigCategory(qo);
			} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
				page = goodsSaleSummaryAnalysisFacade.queryListPageByStore(qo);
			} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
				page = goodsSaleSummaryAnalysisFacade.queryListPageByStoreGoods(qo);
			}
			if (page != null) {
				cleanAccessData(page);
			}
			return page;
		} catch (Exception e) {
			LOG.error("商品销售分析查询出现异常:{}", e);
		}
		return null;
	}

	@Override
	protected Object queryTotal(GoodsSaleSummaryAnalysisQo qo) {
		//用list自动算，不再查询一次，以提高效率
		/*if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		if (KEY_BY_GOODS.equals(qo.getTabKey())) {
			GoodsSaleSummaryAnalysisByGoodsVo vo = goodsSaleSummaryAnalysisFacade.queryListTotalByGoods(qo);
			vo.setSkuCode("合计:");
			cleanAccessData(vo);
			return vo;
		} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
			GoodsSaleSummaryAnalysisByBigCategoryVo vo = goodsSaleSummaryAnalysisFacade.queryListTotalByBigCategory(qo);
			vo.setBigCategoryCode("合计:");
			cleanAccessData(vo);
			return vo;
		} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
			GoodsSaleSummaryAnalysisByStoreVo vo = goodsSaleSummaryAnalysisFacade.queryListTotalByStore(qo);
			vo.setStoreCode("合计:");
			cleanAccessData(vo);
			return vo;
		} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
			GoodsSaleSummaryAnalysisByStoreGoodsVo vo = goodsSaleSummaryAnalysisFacade.queryListTotalByStoreGoods(qo);
			vo.setStoreCode("合计:");
			cleanAccessData(vo);
			return vo;
		}*/
		return null;
	}

	@Override
	protected List<?> queryList(GoodsSaleSummaryAnalysisQo qo) {
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		List<?> list = null;
		if (KEY_BY_GOODS.equals(qo.getTabKey())) {
			list = totalGoods(goodsSaleSummaryAnalysisFacade.queryListByGoods(qo));
		} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
			list = totalCategory(goodsSaleSummaryAnalysisFacade.queryListByBigCategory(qo));
		} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
			list = totalStore(goodsSaleSummaryAnalysisFacade.queryListByStore(qo));
		} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
			list = totalStoreGoods(goodsSaleSummaryAnalysisFacade.queryListByStoreGoods(qo));
		}
		if (list != null) {
			cleanAccessData(list);
		}
		return list;
	}

	private List<GoodsSaleSummaryAnalysisByGoodsVo> totalGoods(List<GoodsSaleSummaryAnalysisByGoodsVo> list) {
		BigDecimal sumXsNum = BigDecimal.ZERO;
		BigDecimal sumXsAmount = BigDecimal.ZERO;
		BigDecimal sumXsCost = BigDecimal.ZERO;
		BigDecimal saleProfitAmount = BigDecimal.ZERO;
		for (GoodsSaleSummaryAnalysisByGoodsVo vo : list) {
			sumXsNum = sumXsNum.add(vo.getXsNum());
			sumXsAmount = sumXsAmount.add(vo.getXsAmount());
			sumXsCost = sumXsCost.add(vo.getCostAmount());
			saleProfitAmount = saleProfitAmount.add(vo.getSaleProfitAmount());
		}
		GoodsSaleSummaryAnalysisByGoodsVo total = new GoodsSaleSummaryAnalysisByGoodsVo();
		total.setXsNum(sumXsNum);
		total.setXsAmount(sumXsAmount);
		total.setCostAmount(sumXsCost);
		total.setSaleProfitAmount(saleProfitAmount);
		total.setSkuCode("合计：");
		list.add(total);
		return list;
	}

	private List<GoodsSaleSummaryAnalysisByBigCategoryVo> totalCategory(
			List<GoodsSaleSummaryAnalysisByBigCategoryVo> list) {
		BigDecimal sumXsNum = BigDecimal.ZERO;
		BigDecimal sumXsAmount = BigDecimal.ZERO;
		BigDecimal sumXsCost = BigDecimal.ZERO;
		BigDecimal saleProfitAmount = BigDecimal.ZERO;
		for (GoodsSaleSummaryAnalysisByBigCategoryVo vo : list) {
			sumXsNum = sumXsNum.add(vo.getXsNum());
			sumXsAmount = sumXsAmount.add(vo.getXsAmount());
			sumXsCost = sumXsCost.add(vo.getCostAmount());
			saleProfitAmount = saleProfitAmount.add(vo.getSaleProfitAmount());
		}
		GoodsSaleSummaryAnalysisByBigCategoryVo total = new GoodsSaleSummaryAnalysisByBigCategoryVo();
		total.setXsNum(sumXsNum);
		total.setXsAmount(sumXsAmount);
		total.setCostAmount(sumXsCost);
		total.setSaleProfitAmount(saleProfitAmount);
		total.setBigCategoryCode("合计：");
		list.add(total);
		return list;
	}

	private List<GoodsSaleSummaryAnalysisByStoreVo> totalStore(List<GoodsSaleSummaryAnalysisByStoreVo> list) {
		BigDecimal sumXsNum = BigDecimal.ZERO;
		BigDecimal sumXsAmount = BigDecimal.ZERO;
		BigDecimal sumXsCost = BigDecimal.ZERO;
		BigDecimal saleProfitAmount = BigDecimal.ZERO;
		for (GoodsSaleSummaryAnalysisByStoreVo vo : list) {
			sumXsNum = sumXsNum.add(vo.getXsNum());
			sumXsAmount = sumXsAmount.add(vo.getXsAmount());
			sumXsCost = sumXsCost.add(vo.getCostAmount());
			saleProfitAmount = saleProfitAmount.add(vo.getSaleProfitAmount());
		}
		GoodsSaleSummaryAnalysisByStoreVo total = new GoodsSaleSummaryAnalysisByStoreVo();
		total.setXsNum(sumXsNum);
		total.setXsAmount(sumXsAmount);
		total.setCostAmount(sumXsCost);
		total.setSaleProfitAmount(saleProfitAmount);
		total.setStoreCode("合计：");
		list.add(total);
		return list;
	}

	private List<GoodsSaleSummaryAnalysisByStoreGoodsVo> totalStoreGoods(
			List<GoodsSaleSummaryAnalysisByStoreGoodsVo> list) {
		BigDecimal sumXsNum = BigDecimal.ZERO;
		BigDecimal sumXsAmount = BigDecimal.ZERO;
		BigDecimal sumXsCost = BigDecimal.ZERO;
		BigDecimal saleProfitAmount = BigDecimal.ZERO;
		for (GoodsSaleSummaryAnalysisByStoreGoodsVo vo : list) {
			sumXsNum = sumXsNum.add(vo.getXsNum());
			sumXsAmount = sumXsAmount.add(vo.getXsAmount());
			sumXsCost = sumXsCost.add(vo.getCostAmount());
			saleProfitAmount = saleProfitAmount.add(vo.getSaleProfitAmount());
		}
		GoodsSaleSummaryAnalysisByStoreGoodsVo total = new GoodsSaleSummaryAnalysisByStoreGoodsVo();
		total.setXsNum(sumXsNum);
		total.setXsAmount(sumXsAmount);
		total.setCostAmount(sumXsCost);
		total.setSaleProfitAmount(saleProfitAmount);
		total.setStoreCode("合计：");
		list.add(total);
		return list;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getPriceAccess()
	 */
	public Map<String, String> getPriceAccess() {
		Map<String, String> map = new HashMap<String, String>();
		map.put(PriceConstant.SALE_PRICE, "saleAmount"); // 销售额
		map.put(PriceConstant.COST_PRICE, "costAmount,grossProfit,grossProfitRate"); // 成本额，毛利，毛利率
		return map;
	}

}
