/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhangchm
 *@Date: 2016年10月25日
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.deliver;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.form.deliver.entity.DeliverFormList;
import com.okdeer.jxc.report.qo.DeliverFormReportQo;
import com.okdeer.jxc.report.service.DeliverFormReportServiceApi;
import com.okdeer.jxc.report.vo.DeliverDaAndDoFormListVo;
import com.okdeer.jxc.report.vo.DeliverFormVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: DeliverReportController 
 * @Description: 配送报表
 * @author zhangchm
 * @date 2016年10月25日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * 零售管理系统V1.0.2	  2016年10月25日                  zhangchm            配送报表Controller
 */
@Controller
@RequestMapping("form/deliverReport")
public class DeliverReportController extends BasePrintController<DeliverReportController, DeliverFormList> {

	@Reference(version = "1.0.0", check = false)
	private DeliverFormReportServiceApi deliverFormReportServiceApi;

	@Reference(version = "1.0.0", check = false)
	BranchesServiceApi branchesServiceApi;

	/**
	 * @Description: 跳转要货单状态跟踪页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		return "report/deliver/DaReport";
	}

	/**
	 * @Description: 跳转配送明细查询页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "viewDeliverList")
	public String viewDeliverList(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		return "report/deliver/DeliverFormListReport";
	}

	/**
	 * @Description: 要货单状态跟踪查询
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "getDaForms", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverFormVo> getDaForms(DeliverFormReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.info(LogConstant.OUT_PARAM, qo.toString());
		try {
			if (StringUtils.isNullOrEmpty(qo.getBranchId())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);
			PageUtils<DeliverFormVo> page = deliverFormReportServiceApi.queryLists(qo);
			List<DeliverFormVo> footer = new ArrayList<DeliverFormVo>();
			DeliverFormVo vo = deliverFormReportServiceApi.queryListsSum(qo);
			if (vo != null) {
				footer.add(vo);
			}
			page.setFooter(footer);
			LOG.info(LogConstant.PAGE, page.toString());
			return page;
		} catch (Exception e) {
			LOG.error("要货单查询数据出现异常:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 根据要货单查询明细
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	// @RequestMapping(value = "deliverEdit")
	// public String deliverEdit(String deliverFormId, Model model) {
	// LOG.info(LogConstant.OUT_PARAM, deliverFormId);
	// DeliverFormVo form = deliverFormReportServiceApi.queryById(deliverFormId);
	// model.addAttribute("form", form);
	// LOG.info(LogConstant.PAGE, form.toString());
	// // 已审核，不能修改
	// if (FormType.DA.toString().equals(form.getFormType())) {
	// Branches branches = branchesServiceApi.getBranchInfoById(getCurrBranchId());
	// model.addAttribute("minAmount", branches.getMinAmount());
	// model.addAttribute("salesman", branches.getSalesman() == null ? "" : branches.getSalesman());
	// return "report/deliver/DaListView";
	// } else if (FormType.DO.toString().equals(form.getFormType())) {
	// form.setRebateMoney(BigDecimalUtils.formatDecimal(form.getRebateMoney(), 2));
	// form.setAddRebateMoney(BigDecimalUtils.formatDecimal(form.getAddRebateMoney(), 2));
	// return "form/deliver/DoView";
	// } else {
	// return "form/deliver/DiView";
	// }
	// }

	/**
	 * @Description: 导出要货单列表
	 * @param formId 单号
	 * @return
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "exportList")
	public void exportList(HttpServletResponse response, DeliverFormReportQo qo) {
		LOG.info(LogConstant.OUT_PARAM, qo.toString());
		try {
			if (StringUtils.isNullOrEmpty(qo.getBranchId())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			List<DeliverFormVo> exportList = deliverFormReportServiceApi.queryDeliverForms(qo);
			DeliverFormVo vo = deliverFormReportServiceApi.queryListsSum(qo);
			vo.setFormNo("合计：");
			exportList.add(vo);
			String fileName = "要货单状态跟踪";
			String templateName = ExportExcelConstant.DELIVER_REPORT;
			// 导出Excel
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("DeliverReportController:exportList:", e);
		}
	}

	/**
	 * @Description: 配送明细查询
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "getDeliverFormList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverDaAndDoFormListVo> getDeliverFormList(DeliverFormReportQo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.info(LogConstant.OUT_PARAM, vo.toString());
		try {
			if (StringUtils.isNullOrEmpty(vo.getBranchId())) {
				vo.setBranchId(UserUtil.getCurrBranchId());
			}
			if (StringUtils.isNullOrEmpty(vo.getDeliverType())) {
				vo.setDeliverType("");
			}
			if(BranchTypeEnum.HEAD_QUARTERS.getCode().toString().equals(vo.getBranchId())) {
				vo.setBranchId(null);
			}
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			PageUtils<DeliverDaAndDoFormListVo> page = deliverFormReportServiceApi.queryDaAndDoFormList(vo);
			DeliverDaAndDoFormListVo deliverDaAndDoFormListVo = deliverFormReportServiceApi
					.queryDaAndDoFormListsSum(vo);
			List<DeliverDaAndDoFormListVo> footer = new ArrayList<DeliverDaAndDoFormListVo>();
			if (deliverDaAndDoFormListVo != null) {
				footer.add(deliverDaAndDoFormListVo);
			}
			page.setFooter(footer);
			LOG.info(LogConstant.PAGE, page.toString());
			return page;
		} catch (Exception e) {
			LOG.error("要货单查询数据出现异常:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 导出要货单列表
	 * @param formId 单号
	 * @return
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "exportDeliverFormList")
	public void exportDeliverFormList(HttpServletResponse response, DeliverFormReportQo vo) {
		LOG.info(LogConstant.OUT_PARAM, vo.toString());
		try {
			if (StringUtils.isNullOrEmpty(vo.getBranchId())) {
				vo.setBranchId(UserUtil.getCurrBranchId());
			}
			if (StringUtils.isNullOrEmpty(vo.getDeliverType())) {
				vo.setDeliverType("");
			}
			if (BranchTypeEnum.HEAD_QUARTERS.getCode().toString().equals(vo.getBranchId())) {
				vo.setBranchId(null);
			}
			List<DeliverDaAndDoFormListVo> exportList = deliverFormReportServiceApi.queryDaAndDoFormLists(vo);

			DeliverDaAndDoFormListVo deliverDaAndDoFormListVo = deliverFormReportServiceApi
					.queryDaAndDoFormListsSum(vo);
			deliverDaAndDoFormListVo.setFormNo("合计：");
			exportList.add(deliverDaAndDoFormListVo);
			String fileName = "配送明细查询";
			String templateName = ExportExcelConstant.DELIVER_FORM_LIST_REPORT;
			// 导出Excel
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("DeliverReportController:exportList:", e);
		}
	}

	@Override
	protected Map<String, Object> getPrintReplace(String formNo) {
		return null;
	}

	@Override
	protected List<DeliverFormList> getPrintDetail(String formNo) {
		return null;
	}

	/**
	 * @Description: 跳转BD业绩报表页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "viewBD")
	public String viewBD(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		return "report/deliver/BDReport";
	}

	/**
	 * @Description: 配送BD业绩报表
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "getBDReport", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverDaAndDoFormListVo> getBDReport(DeliverFormReportQo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.info(LogConstant.OUT_PARAM, vo.toString());
		try {
			if (StringUtils.isNullOrEmpty(vo.getBranchId())) {
				vo.setBranchId(UserUtil.getCurrBranchId());
			}
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			PageUtils<DeliverDaAndDoFormListVo> page = deliverFormReportServiceApi.queryBDFormLists(vo);
			DeliverDaAndDoFormListVo deliverDaAndDoFormListVo = deliverFormReportServiceApi.queryBDFormListsSum(vo);
			List<DeliverDaAndDoFormListVo> footer = new ArrayList<DeliverDaAndDoFormListVo>();
			if (deliverDaAndDoFormListVo != null) {
				footer.add(deliverDaAndDoFormListVo);
			}
			page.setFooter(footer);
			LOG.info(LogConstant.PAGE, page.toString());
			return page;
		} catch (Exception e) {
			LOG.error("要货单查询数据出现异常:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 导出BD业绩报表
	 * @return
	 * @author zhangchm
	 * @date 2016年10月25日
	 */
	@RequestMapping(value = "exportBDList")
	public void exportBDList(HttpServletResponse response, DeliverFormReportQo qo) {
		LOG.info(LogConstant.OUT_PARAM, qo.toString());
		try {
			if (StringUtils.isNullOrEmpty(qo.getBranchId())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			List<DeliverDaAndDoFormListVo> exportList = deliverFormReportServiceApi.queryBDFormList(qo);
			DeliverDaAndDoFormListVo vo = deliverFormReportServiceApi.queryBDFormListsSum(qo);
			vo.setSalesman("合计：");
			exportList.add(vo);
			String fileName = "BD业绩报表";
			String templateName = ExportExcelConstant.DILIVER_REPORT;
			// 导出Excel
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("DeliverReportController:exportBDList:", e);
		}
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getBranchSpecService()
	 */
	@Override
	protected BranchSpecServiceApi getBranchSpecService() {
		return null;
	}

}
