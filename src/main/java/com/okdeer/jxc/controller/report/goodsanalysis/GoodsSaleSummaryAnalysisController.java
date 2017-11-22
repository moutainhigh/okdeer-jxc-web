package com.okdeer.jxc.controller.report.goodsanalysis;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.controller.AbstractMutilGpeController;
import com.okdeer.retail.common.page.EasyUIPageInfo;
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
		if (KEY_BY_GOODS.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListPageByGoods(qo);
		} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListPageByBigCategory(qo);
		} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListPageByStore(qo);
		} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListPageByStoreGoods(qo);
		}
		return null;
	}

	@Override
	protected Object queryTotal(GoodsSaleSummaryAnalysisQo qo) {
		if (KEY_BY_GOODS.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListTotalByGoods(qo);
		} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListTotalByBigCategory(qo);
		} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListTotalByStore(qo);
		} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListTotalByStoreGoods(qo);
		}
		return null;
	}

	@Override
	protected List<?> queryList(GoodsSaleSummaryAnalysisQo qo) {
		if (KEY_BY_GOODS.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListByGoods(qo);
		} else if (KEY_BY_BIG_CATEGORY.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListByBigCategory(qo);
		} else if (KEY_BY_STORE.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListByStore(qo);
		} else if (KEY_BY_STORE_GOODS.equals(qo.getTabKey())) {
			return goodsSaleSummaryAnalysisFacade.queryListByStoreGoods(qo);
		}
		return null;
	}

}
