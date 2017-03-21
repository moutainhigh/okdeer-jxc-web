/** 
 *@Project: okdeer-jxc-web 
 *@Author: yangyq02
 *@Date: 2016年8月6日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.purchase;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.entity.PurchaseSelect;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormDetailPO;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormPO;
import com.okdeer.jxc.form.purchase.service.PurchaseFormServiceApi;
import com.okdeer.jxc.form.purchase.service.PurchaseSelectServiceApi;
import com.okdeer.jxc.form.purchase.vo.PurchaseSelectVo;

/**
 * ClassName: PurchaseSelectController 
 * @Description: 选择采购订单controller
 * @author yangyq02
 * @date 2016年8月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *     重构2.0			2016-8-5			yangyq02			 选择采购订单controller
 */
@Controller
@RequestMapping("form/purchaseSelect")
public class PurchaseSelectController extends BaseController<PurchaseSelectController> {

	/**
	 * @Fields purchaseSelectServiceApi : 采购订单选择API
	 */
	@Reference(version = "1.0.0", check = false)
	private PurchaseSelectServiceApi purchaseSelectServiceApi;

	@Reference(version = "1.0.0", check = false)
	private PurchaseFormServiceApi purchaseFormServiceApi;
	
	/**
	 * @Description: 选择页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月6日
	 */
	@RequestMapping(value = "view")
	public String view(String type, Model model) {
		model.addAttribute("type", type);
		return "component/publicForm";
	}

	/**
	 * @Description: 采购订单选择查询
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月8日
	 */
	@RequestMapping(value = "getPurchaseFormList")
	@ResponseBody
	public PageUtils<PurchaseSelect> getPurchaseFormList(
			PurchaseSelectVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			/**
			 * update by xiaoj02 2016-9-7 start
			 */
//			vo.setBranchId(UserUtil.getCurrBranchId());
			
			vo.setBranchCode(getCurrBranchCompleCode());
			
			//处理机构
			String branchName = vo.getBranchName();
			if(StringUtils.isNotBlank(branchName)){
				branchName = branchName.substring(branchName.lastIndexOf("]")+1,branchName.length());
				vo.setBranchName(branchName);
			}
			
			//处理供应商
			String supplierName = vo.getSupplierName();
			if(StringUtils.isNotBlank(supplierName)){
				supplierName = supplierName.substring(supplierName.lastIndexOf("]")+1,supplierName.length());
				vo.setSupplierName(supplierName);
			}
			
			/**
			 * update by xiaoj02 2016-9-7 end
			 */
			LOG.info("vo:{}", vo.toString());
			PageUtils<PurchaseSelect> suppliers = purchaseSelectServiceApi
					.queryLists(vo);
			LOG.info("page:{}", suppliers.toString());
			return suppliers;
		} catch (Exception e) {
			LOG.error("采购订单选择查询数据出现异常:", e);
		}
		return null;
	}
	
	/**
	 * 根据单据id,获取单据内容
	 * @param formId
	 * @return
	 * @author xiaoj02
	 * @date 2016年9月8日
	 */
	@RequestMapping(value = "getPurchaseForm")
	@ResponseBody
	public RespJson getPurchaseForm(String formId){
		PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formId);
		List<PurchaseFormDetailPO> list = purchaseFormServiceApi.selectDetailById(formId);
		RespJson resp = RespJson.success();
		resp.put("form", form);
		resp.put("list", list);
		return resp;
		
	}
	
}
