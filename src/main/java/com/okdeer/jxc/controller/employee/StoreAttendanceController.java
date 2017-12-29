/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年12月27日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.employee;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.controller.AbstractSimpleGpeController;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.facade.report.employee.facade.StoreAttendanceFacade;
import com.okdeer.retail.facade.report.employee.qo.StoreAttendanceQo;
import com.okdeer.retail.facade.report.employee.vo.StoreAttendanceVo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;

/**
 * ClassName: StoreAttendance 
 * @Description: 员工考勤查询
 * @author zhengwj
 * @date 2017年12月27日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("store/attendance")
public class StoreAttendanceController extends AbstractSimpleGpeController<StoreAttendanceQo, StoreAttendanceVo> {

	/**
	 * @Fields storeAttendanceFacade : 员工考勤查询接口
	 */
	@Reference(version = "1.0.0", check = false)
	private StoreAttendanceFacade storeAttendanceFacade;

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getCustomMark()
	 */
	@Override
	protected CustomMarkBean getCustomMark() {
		return new CustomMarkBean(GpeMarkContrant.MOUDLE_REPORT, GpeMarkContrant.SECTION_STORE_ATTENDANCE,
				GpeMarkContrant.KEY_LIST);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getModelAndView(org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	protected ModelAndView getModelAndView(ModelAndView modelAndView) {
		modelAndView.setViewName("/report/employee/attendance");
		return modelAndView;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getForbidSet()
	 */
	@Override
	protected Set<String> getForbidSet() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#getViewObjectClass()
	 */
	@Override
	protected Class<StoreAttendanceVo> getViewObjectClass() {
		return StoreAttendanceVo.class;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#queryListPage(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected EasyUIPageInfo<StoreAttendanceVo> queryListPage(StoreAttendanceQo qo) {
		buildQo(qo);
		// 查询分页数据
		return storeAttendanceFacade.queryListPage(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#queryTotal(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected StoreAttendanceVo queryTotal(StoreAttendanceQo qo) {
		buildQo(qo);
		return storeAttendanceFacade.queryListTotal(qo);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.AbstractSimpleGpeController#queryList(com.okdeer.retail.common.qo.GpePageQo)
	 */
	@Override
	protected List<StoreAttendanceVo> queryList(StoreAttendanceQo qo) {
		// 查询数据
		return storeAttendanceFacade.queryList(qo);
	}

	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author zhengwj
	 * @date 2017年12月28日
	 */
	private void buildQo(StoreAttendanceQo qo) {
		// 如果机构为空
		if (StringUtils.isEmpty(qo.getStoreId())) {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
		}
		if (StringUtils.isNotEmpty(qo.getEndTime())) {
			qo.setEndTime(DateUtils.getSmallRStr(DateUtils.getNextDay(DateUtils.parse(qo.getEndTime(), "yyyy-MM-dd"))));
		}
	}
}
