/** 
 *@Project: okdeer-jxc-web 
 *@Author: yangyq02
 *@Date: 2016年8月8日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.deliver;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.deliver.entity.DeliverSelect;
import com.okdeer.jxc.form.deliver.service.DeliverSelectServiceApi;
import com.okdeer.jxc.form.deliver.vo.DeliverSelectVo;
import com.okdeer.jxc.form.entity.PurchaseForm;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: DeliverSelectController 
 * @Description: 配送单（调拨单）选择
 * @author yangyq02
 * @date 2016年8月8日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *      重构2.0			2016-8-6			yangyq02	        配送（调拨单）Controller
 */
@Controller
@RequestMapping("form/deliverSelect")
public class DeliverSelectController extends BaseController<PurchaseForm> {

	@Reference(version = "1.0.0", check = false)
	private DeliverSelectServiceApi deliverSelectServiceApi;

	/**
	 * @Description: 制定调拨单选择页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月11日
	 */
	@RequestMapping(value = "view")
	public String view(String type, Model model) {
		model.addAttribute("type", type);
		return "component/publicForm";
	}

	/**
	 * @Description: 配送（调拨单）单据选择
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月8日
	 */
	@RequestMapping(value = "getDeliverFormList")
	@ResponseBody
	public PageUtils<DeliverSelect> getDeliverFormList(DeliverSelectVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			/**
			 * @author zhangchm
			 * 修改查询公共组件配送单号选择start
			 */
			// 如果是要货单说明登录店铺是根据要货单出库，登录店铺id就是source_branch_id
			if (FormType.DA.toString().equals(vo.getFormType())) {
				vo.setSourceBranchId(UserUtil.getCurrBranchId());
			} else if (FormType.DO.toString().equals(vo.getFormType())) {
				// 如果是配送出库说明登录店铺是根据出库单收货，登录店铺id就是target_branch_id
				vo.setTargetBranchId(UserUtil.getCurrBranchId());
			} else if (FormType.DI.toString().equals(vo.getFormType())) {
				vo.setTargetBranchId(UserUtil.getCurrBranchId());
			} else {
				LOG.warn("查询配送单号类型错误!");
				return null;
			}
			/**
			 * @author zhangchm
			 * 修改查询公共组件配送单号选择end
			 */
			LOG.info("vo:" + vo.toString());
			PageUtils<DeliverSelect> suppliers = deliverSelectServiceApi.queryLists(vo);
			LOG.info("page" + suppliers.toString());
			return suppliers;
		} catch (Exception e) {
			LOG.error("调拨单订单选择查询数据出现异常:", e);
		}
		return null;
	}
}
