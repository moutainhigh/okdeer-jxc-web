package com.okdeer.jxc.controller.finance.iccard;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.finance.iccard.qo.ICCardChargeQo;
import com.okdeer.jxc.finance.iccard.service.ICCardChargeDetailService;
import com.okdeer.jxc.finance.iccard.vo.ICCardChargeVo;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * ClassName: ICCardChargeDetailController 
 * @Description: 一卡通充值
 * @author yangyq02
 * @date 2017年12月26日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("iccard/chargeDetail")
public class ICCardChargeDetailController extends AbstractSimpleGpeController<ICCardChargeQo, ICCardChargeVo> {

	@Reference(version = "1.0.0", check = false)
	ICCardChargeDetailService iCCardChargeDetailService;

	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, GpeMarkContrant.SECTION_ICCARD_DETAIL,
				GpeMarkContrant.KEY_LIST);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("finance/iccard/iccardChargeDetail");
		return modelAndView;
	}

	@Override
	protected Set<String> getForbidSet() {
		return null;
	}

	@Override
	protected Class<ICCardChargeVo> getViewObjectClass() {
		return ICCardChargeVo.class;
	}

	@Override
	protected EasyUIPageInfo<ICCardChargeVo> queryListPage(ICCardChargeQo qo) {
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(this.getCurrBranchCompleCode());
		}
		EasyUIPageInfo<ICCardChargeVo> page= iCCardChargeDetailService.queryPageList(qo);
		LOG.error( JSON.toJSONString(page.getList()));
		return page;
	}

	@Override
	protected ICCardChargeVo queryTotal(ICCardChargeQo qo) {
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(this.getCurrBranchCompleCode());
		}
		return iCCardChargeDetailService.queryTotal(qo);
	}

	@Override
	protected List<ICCardChargeVo> queryList(ICCardChargeQo qo) {
		if (StringUtils.isEmpty(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(this.getCurrBranchCompleCode());
		}
		return iCCardChargeDetailService.queryList(qo);
	}
}
