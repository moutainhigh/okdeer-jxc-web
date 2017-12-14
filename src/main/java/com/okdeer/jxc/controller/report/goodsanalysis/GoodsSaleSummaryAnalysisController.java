package com.okdeer.jxc.controller.report.goodsanalysis;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
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
		EasyUIPageInfo<?> page=null;
		if (KEY_BY_GOODS.equals(qo.getTabKey())) {
			page= goodsSaleSummaryAnalysisFacade.queryListPageByGoods(qo);
		} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
			page= goodsSaleSummaryAnalysisFacade.queryListPageByBigCategory(qo);
		} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
			page= goodsSaleSummaryAnalysisFacade.queryListPageByStore(qo);
		} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
			page= goodsSaleSummaryAnalysisFacade.queryListPageByStoreGoods(qo);
		}
		if (page != null) {
			cleanAccessData(page);
		}
		return page;
	}

	@Override
	protected Object queryTotal(GoodsSaleSummaryAnalysisQo qo) {
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
		}
		return null;
	}

	@Override
	protected List<?> queryList(GoodsSaleSummaryAnalysisQo qo) {
		List<?> list = null;
		if (KEY_BY_GOODS.equals(qo.getTabKey())) {
			list = goodsSaleSummaryAnalysisFacade.queryListByGoods(qo);
		} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
			list = goodsSaleSummaryAnalysisFacade.queryListByBigCategory(qo);
		} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
			list = goodsSaleSummaryAnalysisFacade.queryListByStore(qo);
		} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
			list = goodsSaleSummaryAnalysisFacade.queryListByStoreGoods(qo);
		}
		if (list != null) {
			cleanAccessData(list);
		}
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
