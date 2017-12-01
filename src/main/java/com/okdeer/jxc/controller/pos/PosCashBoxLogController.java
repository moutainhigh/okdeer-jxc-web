package com.okdeer.jxc.controller.pos;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.pos.qo.CashBoxLogQo;
import com.okdeer.jxc.pos.service.CashBoxServiceApi;
import com.okdeer.jxc.pos.vo.CashBoxLogVo;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * ClassName: PosCashBoxLogController 
 * @Description: pos机开钱箱日志
 * @author yangyq02
 * @date 2017年11月29日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
 
@Controller
@RequestMapping("pos/cashBoxLog")
public class PosCashBoxLogController extends AbstractSimpleGpeController<CashBoxLogQo, CashBoxLogVo> {

	@Reference(version = "1.0.0", check = false)
	CashBoxServiceApi cashBoxServiceApi;

	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, "cashBoxLog", GpeMarkContrant.KEY_LIST);
	}

	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("pos/cashBoxLog");
		return modelAndView;
	}

	@Override
	protected Set<String> getForbidSet() {
		return null;
	}

	@Override
	protected Class<CashBoxLogVo> getViewObjectClass() {
		return CashBoxLogVo.class;
	}

	@Override
	protected EasyUIPageInfo<CashBoxLogVo> queryListPage(CashBoxLogQo qo) {
		//结束时间加一分钟
		if (qo.getEndTime() != null) {
			// qo.setEndTime(DateUtils.getNextDay(qo.getEndTime()));
			qo.setEndTime(DateUtils.getNextMinute(qo.getEndTime()));
		}
		// 如果没有修改所选收银员信息，则去掉该参数
		String cashierNameOrCode = qo.getCashierNameOrCode();
		if (StringUtils.isNotBlank(cashierNameOrCode) && cashierNameOrCode.contains("[")
				&& cashierNameOrCode.contains("]")) {
			qo.setCashierNameOrCode(null);
		}
		return cashBoxServiceApi.queryListPage(qo);
	}

	@Override
	protected CashBoxLogVo queryTotal(CashBoxLogQo qo) {
		return null;
	}

	@Override
	protected List<CashBoxLogVo> queryList(CashBoxLogQo qo) {
		String cashierNameOrCode = qo.getCashierNameOrCode();
		if (StringUtils.isNotBlank(cashierNameOrCode) && cashierNameOrCode.contains("[")
				&& cashierNameOrCode.contains("]")) {
			qo.setCashierNameOrCode(null);
		}
		List<CashBoxLogVo> list= cashBoxServiceApi.queryLists(qo);
		return list;
	}

}
