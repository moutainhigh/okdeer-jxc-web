/** 
 *@Project: okdeer-jxc-web 
 *@Author: yangyq02
 *@Date: 2016年8月8日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.deliver;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.branch.vo.BranchSpecVo;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.enums.DeliverAuditStatusEnum;
import com.okdeer.jxc.common.utils.BigDecimalUtils;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.deliver.entity.DeliverForm;
import com.okdeer.jxc.form.deliver.entity.DeliverFormGoods;
import com.okdeer.jxc.form.deliver.entity.DeliverFormList;
import com.okdeer.jxc.form.deliver.service.DeliverFormServiceApi;
import com.okdeer.jxc.form.deliver.service.DeliverSuggestNumService;
import com.okdeer.jxc.form.deliver.service.QueryDeliverFormListServiceApi;
import com.okdeer.jxc.form.deliver.vo.DeliverFormBranchVo;
import com.okdeer.jxc.form.deliver.vo.DeliverSuggestNumVo;
import com.okdeer.jxc.form.deliver.vo.QueryDeliverFormVo;
import com.okdeer.jxc.form.enums.FormType;

/**
 * ClassName: DeliverFormListController 
 * @Description: 配送单（调拨单）明细
 * @author yangyq02
 * @date 2016年8月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    进销存2.0.0		   2016年8月23日                  zhangchm            配送单（调拨单）明细Controller
 */
@Controller
@RequestMapping("form/deliverFormList")
public class DeliverFormListController extends BaseController<DeliverFormListController> {

	@Reference(version = "1.0.0", check = false)
	private QueryDeliverFormListServiceApi queryDeliverFormListServiceApi;
	
	@Reference(version = "1.0.0", check = false)
	private DeliverSuggestNumService deliverSuggestNumService;
	
	@Reference(version = "1.0.0", check = false)
	private DeliverFormServiceApi deliverFormService;
	
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchService;
	
	@Reference(version = "1.0.0", check = false)
	private BranchSpecServiceApi branchSpecService;

	/**
	 * @Description: 引入单据明细查询，单价查询
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author zhangchm
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "getDeliverFormLists", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverFormList> getDeliverFormLists(QueryDeliverFormVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(1);
			vo.setPageSize(999999);
			LOG.debug("vo:{}", vo.toString());
			PageUtils<DeliverFormList> deliverFormLists = queryDeliverFormListServiceApi.queryLists(vo);
			LOG.debug("page:{}", deliverFormLists.toString());
			return deliverFormLists;
		} catch (Exception e) {
			LOG.error("要货单查询明细数据出现异常", e);
		}
		return null;
	}

	/**
	 * @Description: 要货单查询明细
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author zhangchm
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "getDeliverFormListsById", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverFormList> getDeliverFormListsById(QueryDeliverFormVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber) {
		try {
			vo.setPageNumber(1);
			vo.setPageSize(999999);
			LOG.debug("vo:{}", vo.toString());
			
			// 允许要货单审核后按类别排序
			if(FormType.DA.name().equals(vo.getDeliverType())){
				Integer isAllowDaAuditSort = buildIsAllowDaAuditSortParam(vo.getDeliverFormId());
				vo.setIsAllowDaAuditSort(isAllowDaAuditSort);
			}
			
			PageUtils<DeliverFormList> deliverFormLists = queryDeliverFormListServiceApi
					.getDeliverFormListsAndStockByIdOrFormNo(vo);
			return deliverFormLists;
		} catch (Exception e) {
			LOG.error("要货单查询明细数据出现异常", e);
		}
		return PageUtils.emptyPage();
	}
	
	
	/**
	 * @Description: 允许要货单审核后按类别排序 参数
	 * @param formId
	 * @return
	 * @author liwb
	 * @date 2017年8月18日
	 */
	private Integer buildIsAllowDaAuditSortParam(String formId){
		DeliverForm deliverForm = deliverFormService.queryDeliverFormById(formId);
		
		if(!DeliverAuditStatusEnum.CHECK_SUCCESS.getName().equals(deliverForm.getStatus())){
			return null;
		}
		
		Branches branch = branchService.getBranchInfoById(deliverForm.getTargetBranchId());
		
		// 取分公司Id
		String branchId = branch.getBranchId();
		if(branch.getType()>1){
			branchId = branch.getParentId();
		}
		
		BranchSpecVo branchSpec = branchSpecService.queryByBranchId(branchId);
		
		return branchSpec.getIsAllowDaAuditSort();
	}

	/**
	 * @Description: 导出明细  导出货号 pattern 1 表示货号
	 * @param formId 单号
	 * @return
	 * @author lijy02
	 * @date 2016年8月29日
	 */
	@RequestMapping(value = "exportList")
	public void exportList(HttpServletResponse response, String formNo, String type, String pattern) {
		LOG.debug("DeliverFormListController.export:" + formNo);
		try {
			
			DeliverFormBranchVo branchVo = deliverFormService.getDeliverBranchInfoByFormNo(formNo);
			
			QueryDeliverFormVo vo = new QueryDeliverFormVo();

			// 允许要货单审核后按类别排序
			if(FormType.DA.name().equals(type)){
				Integer isAllowDaAuditSort = buildIsAllowDaAuditSortParam(branchVo.getFormId());
				vo.setIsAllowDaAuditSort(isAllowDaAuditSort);
			}
			vo.setFormNo(formNo);
			List<DeliverFormList> exportList = queryDeliverFormListServiceApi.getDeliverList(vo);
			
	         // 过滤数据权限字段
            cleanAccessData(exportList);
			String fileName = "";
			String templateName = "";
			String branchName = "";

			if (FormType.DA.toString().equals(type)) {
				// 导出文件名称，不包括后缀名
				branchName = branchVo.getTargetBranchName(); //要货机构，即入库机构
				fileName = branchName + "要货单" + "_" + DateUtils.getCurrSmallStr();
			} else if (FormType.DO.toString().equals(type)) {
				// 导出文件名称，不包括后缀名
				branchName = branchVo.getSourceBranchName(); //出库机构
				fileName = branchName + "出库单" + "_" + DateUtils.getCurrSmallStr();
			}else if (FormType.DD.toString().equals(type)){
				// 导出文件名称，不包括后缀名
				branchName = branchVo.getTargetBranchName(); //要货机构，即入库机构
				fileName = branchName + "店间配送单" + "_" + DateUtils.getCurrSmallStr();
			}else if (FormType.DY.toString().equals(type)){
				// 导出文件名称，不包括后缀名
				branchName = branchVo.getTargetBranchName(); //要货机构，即入库机构
				fileName = branchName + "直送要货单" + "_" + DateUtils.getCurrSmallStr();
			}else if (FormType.DR.toString().equals(type)){
				// 导出文件名称，不包括后缀名
				branchName = branchVo.getSourceBranchName(); //出库机构
				fileName = branchName + "退货单" + "_" + DateUtils.getCurrSmallStr();
			}
			else {
				// 导出文件名称，不包括后缀名
				branchName = branchVo.getTargetBranchName(); //即入库机构
				fileName = branchName + "入库单" + "_" + DateUtils.getCurrSmallStr();
			}
			if (Constant.STRING_ONE.equals(pattern)) {
				// 模板名称，包括后缀名
				templateName = ExportExcelConstant.PURCHASEFORMCODE;
				fileName = fileName + "_" + "货号";
			} else {
				if (FormType.DA.toString().equals(type)) {
					// 模板名称，包括后缀名
					templateName = ExportExcelConstant.DELIVERFORM;
				}else if (FormType.DO.toString().equals(type)) {
					// 模板名称，包括后缀名
					templateName = ExportExcelConstant.DELIVERFORM_DO;
				} else if (FormType.DD.toString().equals(type)) {
					// 模板名称，包括后缀名
					templateName = ExportExcelConstant.DELIVERFORM_DD;
				}else if (FormType.DY.toString().equals(type)) {
					// 模板名称，包括后缀名
					templateName = ExportExcelConstant.DELIVERFORM_DY;
				}else if (FormType.DR.toString().equals(type)) {
					// 模板名称，包括后缀名
					templateName = ExportExcelConstant.DELIVERFORM_DR;
				}
				else{
					templateName = ExportExcelConstant.DELIVERFORM_DI;
				}
			}
			BigDecimalUtils.toFormatBigDecimal(exportList, 4);
			
			// 导出Excel			
			Map<String, Object> param = new HashMap<>();
			param.put("branchName", branchName);
			exportParamListForXLSX(response, exportList, param, fileName, templateName);
			
		} catch (Exception e) {
			LOG.error("GoodsPriceAdjustController:exportList:", e);
		}
	}
	
	/**
	 * @Description: 配送建议数量列表
	 * @param vo
	 * @return
	 * @author xuyq
	 * @date 2017年4月12日
	 */
	@RequestMapping(value = "getDeliverSuggestNumItemList", method = RequestMethod.POST)
	@ResponseBody
	public List<DeliverFormGoods> getDeliverSuggestNumItemList(DeliverSuggestNumVo vo) {
		LOG.debug("配送建议数量，获取商品信息列表参数:{}", vo);
		List<DeliverFormGoods> itemList = new ArrayList<DeliverFormGoods>();
		try {
			itemList =  deliverSuggestNumService.getFormGoodsListSuggest(vo);
			return itemList;
		} catch (Exception e) {
			LOG.error("配送建议数量，获取商品信息列表异常", e);
		}
		return itemList;
	}
	
	/**
	 * @Description: 出库引用单据时获取单据商品列表
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author liwb
	 * @date 2017年10月12日
	 */
	@RequestMapping(value = "importDelverList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverFormList> importDelverList(QueryDeliverFormVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(1);
			vo.setPageSize(999999);
			LOG.debug("vo:{}", vo.toString());
			PageUtils<DeliverFormList> deliverFormLists = queryDeliverFormListServiceApi.importDelverList(vo.getDeliverFormId());
			return deliverFormLists;
		} catch (Exception e) {
			LOG.error("要货单查询明细数据出现异常", e);
		}
		return null;
	}
}
