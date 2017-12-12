package com.okdeer.jxc.controller.report;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.facade.report.facade.DaySumReportFacade;
import com.okdeer.retail.facade.report.qo.DaySumReportQo;
import com.okdeer.retail.facade.report.vo.DaySumReportVo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * 
 * ClassName: DaySumReportControllerNew 
 * @Description: 日进销存报表
 * @author zhangq
 * @date 2017年10月25日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/day")
public class DaySumReportControllerNew extends AbstractSimpleGpeController<DaySumReportQo, DaySumReportVo> {

	/**
	 * 日进销存报表Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private DaySumReportFacade daySumReportFacade;

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getCustomMark()
	 */
	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, GpeMarkContrant.SECTION_DAYSUM,
				GpeMarkContrant.KEY_LIST);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.addObject("branchId", UserUtil.getCurrentUser().getBranchId());
		modelAndView.addObject("branchName", UserUtil.getCurrentUser().getBranchName());
		modelAndView.setViewName("/report/day/daySumReport");
		return modelAndView;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getForbidSet()
	 */
	@Override
	protected Set<String> getForbidSet() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getViewObjectClass()
	 */
	@Override
	protected Class<DaySumReportVo> getViewObjectClass() {
		return DaySumReportVo.class;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#queryListPage(com.okdeer.retail.facade.report.qo.BaseReportQo)
	 */
	@Override
	protected EasyUIPageInfo<DaySumReportVo> queryListPage(DaySumReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		// 查询分页数据
		return daySumReportFacade.queryListPage(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#queryTotal(com.okdeer.retail.facade.report.qo.BaseReportQo)
	 */
	@Override
	protected DaySumReportVo queryTotal(DaySumReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		return daySumReportFacade.queryListTotal(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#queryList(com.okdeer.retail.facade.report.qo.BaseReportQo)
	 */
	@Override
	protected List<DaySumReportVo> queryList(DaySumReportQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		// 查询数据
		return daySumReportFacade.queryList(qo);
	}

}
