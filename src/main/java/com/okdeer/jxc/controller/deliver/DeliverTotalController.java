/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年12月28日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.deliver;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.okdeer.jxc.common.utils.gson.GsonUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.deliver.qo.DeliverTotalFormQo;

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

}
