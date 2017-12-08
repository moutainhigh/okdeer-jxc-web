/** 
 *@Project: okdeer-jxc-web 
 *@Author: liux01
 *@Date: 2016年10月26日 
 *@Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.report;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.report.service.GoodsOutInDetailServiceApi;
import com.okdeer.jxc.report.vo.GoodsOutInDetailVo;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * ClassName: GoodsOutInDetailReportController 
 * @Description: 商品出入库明细报表
 * @author liux01
 * @date 2016年10月26日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * 零售V2.5			2017-05-05		 zhangqin			 报表及导出增加成本价和成本金额，并进价文案修改为单价，进价金额改为单据金额。规范注释及LOG。
 */
@Controller
@RequestMapping("goods/goodsDetail")
public class GoodsOutInDetailReportController extends AbstractSimpleGpeController<GoodsOutInDetailVo, GoodsOutInDetailVo>{
	
	/**
	 * 商品出入库明细报表Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private GoodsOutInDetailServiceApi goodsOutInDetailServiceApi;
	
	/**
	 * 
	 * @Description: 报表页跳转
	 * @return String  
	 * @author zhangq
	 * @date 2017年5月5日
	 */
	@RequestMapping(value = "/list")
	public String list(){
		return "/report/goods/goodsOutInDetailReport";
	}
	

	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_STOCK, GpeMarkContrant.SECTION_STOCK_DETAIL, GpeMarkContrant.KEY_LIST);
		
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("/report/goods/goodsOutInDetailReport");
		return modelAndView;
	}

	@Override
	protected Set<String> getForbidSet() {
		return null;
	}

	@Override
	protected Class<GoodsOutInDetailVo> getViewObjectClass() {
		return GoodsOutInDetailVo.class;
	}

	@Override
	protected EasyUIPageInfo<GoodsOutInDetailVo> queryListPage(GoodsOutInDetailVo qo) {
		EasyUIPageInfo<GoodsOutInDetailVo> page= goodsOutInDetailServiceApi.getGoodsOutInDetailList(qo);
		return page;
	}

	@Override
	protected GoodsOutInDetailVo queryTotal(GoodsOutInDetailVo qo) {
		GoodsOutInDetailVo vo= goodsOutInDetailServiceApi.queryGoodsOutInDetailCountSum(qo);
		vo.setBranchName("合计:");
		return vo;
	}

	@Override
	protected List<GoodsOutInDetailVo> queryList(GoodsOutInDetailVo qo) {
		return goodsOutInDetailServiceApi.exportList(qo);
	}
}
