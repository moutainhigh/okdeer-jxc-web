/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年12月28日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.deliver;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.gson.GsonUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.deliver.entity.DeliverForm;
import com.okdeer.jxc.form.deliver.qo.DeliverTotalFormQo;
import com.okdeer.jxc.form.deliver.service.DeliverTotalService;

/**
 * ClassName: DeliverTotalGenerateController 
 * @Description: 要货单汇总生成Controller
 * @author liwb
 * @date 2017年12月28日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("form/deliverTotal")
public class DeliverTotalController extends BaseController<DeliverTotalController> {

	@Reference(version = "1.0.0", check = false)
	private DeliverTotalService deliverTotalService;

	/**
	 * @Description: 第一步，条件筛选界面
	 * @param qo
	 * @param model
	 * @return
	 * @author liwb
	 * @date 2017年12月28日
	 */
	@RequestMapping(value = "toTotalForm")
	public String toTotalForm(DeliverTotalFormQo qo, Model model) {
		LOG.debug("要货单汇总查询第一步，条件筛选信息：{}", qo);
		String formData = GsonUtils.toJson(qo);

		model.addAttribute("formData", formData);
		return "form/deliver/total/totalForm";
	}

	/**
	 * @Description: 第二部，单据清单确认界面
	 * @param qo
	 * @param model
	 * @return
	 * @author liwb
	 * @date 2017年12月28日
	 */
	@RequestMapping(value = "toTotalDataList", method = RequestMethod.POST)
	public String toTotalDataList(DeliverTotalFormQo qo, Model model) {
		LOG.debug("要货单汇总查询第二步，单据清单确认页面：{}", qo);

		String formData = GsonUtils.toJson(qo);

		model.addAttribute("formData", formData);

		return "form/deliver/total/totalDataList";
	}

	/**
	 * @Description: 第一步，条件筛选查询数据
	 * @param qo
	 * @return
	 * @author liwb
	 * @date 2017年12月28日
	 */
	@RequestMapping(value = "getFormList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverForm> getFormList(DeliverTotalFormQo qo) {

		// 构建查询参数
		buildSearchParams(qo);
		LOG.debug("要货单汇总查询条件：{}", qo);

		try {

			List<DeliverForm> list = deliverTotalService.getFormList(qo);

			return new PageUtils<DeliverForm>(list);
		} catch (Exception e) {
			LOG.error("要货单汇总查询异常:", e);
		}
		return PageUtils.emptyPage();
	}

	private void buildSearchParams(DeliverTotalFormQo qo) {
		
		if(StringUtils.isBlank(qo.getTargetBranchIdStr())){
			throw new BusinessException("要货机构不能为空");
		}
		if(StringUtils.isBlank(qo.getSourceBranchIdStr())){
			throw new BusinessException("发货机构不能为空");
		}
		
		List<String> targetBranchIds = Arrays.asList(qo.getTargetBranchIdStr().split(","));
		List<String> sourceBranchIds = Arrays.asList(qo.getSourceBranchIdStr().split(","));
		
		qo.setTargetBranchIds(targetBranchIds);
		qo.setSourceBranchIds(sourceBranchIds);
		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

}
