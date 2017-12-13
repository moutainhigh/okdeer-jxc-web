/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhangchm
 *@Date: 2016年7月20日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.supplier.common;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.base.common.utils.StringUtils;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.supplier.entity.Supplier;
import com.okdeer.jxc.supplier.entity.SupplierExt;
import com.okdeer.jxc.supplier.po.SupplierPo;
import com.okdeer.jxc.supplier.qo.SupplierQo;
import com.okdeer.jxc.supplier.service.SupplierServiceApi;
import com.okdeer.jxc.utils.UserUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ClassName: SupplierController 
 * @Description: 供应商组件Controller
 * @author zhangchm
 * @date 2016年7月20日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    进销存2.0.0		   2016年7月20日                  zhangchm            创建供应商组件Controller， 查询供应商
 */

@Controller
@RequestMapping("common/supplier")
public class SupplierCommonController extends BaseController<SupplierCommonController> {

	@Reference(version = "1.0.0", check = false)
	private SupplierServiceApi supplierService;

	// 店铺服务接口
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesService;

	/**
	 * @Description: 公共选择供应商
	 * @return   
	 * @author zhangchm
	 * @date 2016年7月21日
	 */
	@RequestMapping(value = "views")
	public String views(HttpServletRequest req, Model model) {
		String saleWayNot = req.getParameter("saleWayNot");
		String isDirect = req.getParameter("isDirect");
		if("purchase".equals(saleWayNot) || "chain".equals(saleWayNot)) {
			model.addAttribute("saleWayNot", saleWayNot);
		}
		if (StringUtils.isNotBlank(isDirect)) {
			model.addAttribute("isDirect", isDirect);		
		}
		return "component/publicSupplier";
	}

	/**
	 * @Description: 查询供应商
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @author zhangchm
	 * @date 2016年7月22日
	 */
	@RequestMapping(value = "getComponentList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<SupplierPo> getComponentList(
			SupplierQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);
			
			if(StringUtils.isNotBlank(qo.getQueryType()) && "ALL".equals(qo.getQueryType())){
				return supplierService.queryLists(qo);
			}

			String branchId  = qo.getBranchId();
			if (StringUtils.isNotBlank(branchId) && branchId.contains(",")) {
				String[] branchIds = StringUtils.splitByWholeSeparatorPreserveAllTokens(branchId, ",");

				List<String> branchIdsList = Arrays.stream(branchIds).map((str) -> {
					String tmpBranchId = "";
					Branches branches = branchesService.getBranchInfoById(str);
					if (branches != null && StringUtils.isNotBlank(branches.getParentId())) {
						// 如果机构类型不是 0 1 需要查询他们的分公司 找到他们分公司的供应商
						if (branches.getType() != 0 && branches.getType() != 1) {
							// 查询店铺的分公司
							// 把父级的id加入条件查询分公司的供应商
							tmpBranchId = branches.getParentId();
						} else {
							tmpBranchId = str;
						}
					}
					return tmpBranchId;
				}).collect(Collectors.toList());
				qo.setBranchId("");
				qo.setBranchIds(branchIdsList);
				qo.setDataType(1);
			} else {
				if (StringUtils.isNullOrEmpty(branchId)) {
					// begin added by lijy02 2016.9.12:添加过滤条件
					branchId = UserUtil.getCurrBranchId();
					// end added by lijy02
				}
				qo.setBranchId(branchId);
				Branches branches = branchesService.getBranchInfoById(branchId);
				if (branches != null && StringUtils.isNotBlank(branches.getParentId())) {
					// 如果机构类型不是 0 1 需要查询他们的分公司 找到他们分公司的供应商
					if (branches.getType() != 0 && branches.getType() != 1) {
						// 查询店铺的分公司
						// 把父级的id加入条件查询分公司的供应商
						qo.setBranchId(branches.getParentId());
					}
				}
				// 只对门店做允许门店订货控制
				if (branches != null && !(BranchTypeEnum.SELF_STORE.getCode().equals(branches.getType())
						|| BranchTypeEnum.FRANCHISE_STORE_B.getCode().equals(branches.getType())
						|| BranchTypeEnum.FRANCHISE_STORE_C.getCode().equals(branches.getType()))) {
					qo.setIsAllowPurchase(null);
				}

				//总部是否查询自己及下属所有的供应商,否则只查询自己的供应商 不为空就查询所有
				if ("0".equals(branchId) && StringUtils.isNotBlank(qo.getSupplierSelectType())) {
					qo.setBranchId("");
					qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
				} else {
					//公共组件默认带出总部的供应商
					qo.setDataType(1);
				}
			}
			PageUtils<SupplierPo> suppliers = supplierService.queryLists(qo);
			return suppliers;
		} catch (Exception e) {
			LOG.error("查询供应商异常:", e);
		}
		return null;
	}

	/**
	 * 
	 * @Description: 获取供应商树
	 * @return
	 * @author taomm
	 * @date 2016年8月15日
	 */
	@RequestMapping(value = "getSupplierToTree")
	@ResponseBody
	public String getSupplierToTree(String supplierId) {
		try {
			String brandTree = supplierService.querySupplierToTree(supplierId);
			return brandTree;
		} catch (Exception e) {
			LOG.error("查询供应商树结构异常:", e);
		}
		return null;
	}

	/**
	 * 
	 * @Description: 获得供应商信息
	 * @param id
	 * @return
	 * @author xiaoj02
	 * @date 2016年9月13日
	 */
	@RequestMapping(value = "getById")
	@ResponseBody
	public RespJson getById(String id) {
		Supplier supplier = supplierService.getById(id);
		RespJson respJson = RespJson.success();
		respJson.put("supplier", supplier);
		return respJson;
	}
	
	/***
	 * 
	 * @Description: 获得供应商扩展信息
	 * @param id 供应商ID
	 * @return RespJson
	 * @author xuyq
	 * @date 2017年5月27日
	 */
	@RequestMapping(value = "getSupplierExtById")
	@ResponseBody
	public RespJson getSupplierExtById(String supplierId) {
	    SupplierExt supplierExt = supplierService.getSupplierExtById(supplierId);
	    RespJson respJson = RespJson.success();
	    respJson.put("supplierExt", supplierExt);
	    return respJson;
	}

}
