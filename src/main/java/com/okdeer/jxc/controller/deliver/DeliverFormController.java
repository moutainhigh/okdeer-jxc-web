/** 
 *@Project: okdeer-jxc-web 
 *@Author: yangyq02
 *@Date: 2016年8月8日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.deliver;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.base.common.utils.mapper.JsonMapper;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.entity.BranchesGrow;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.branch.vo.BranchSpecVo;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.ImportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.constant.SysConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.enums.DeliverAuditStatusEnum;
import com.okdeer.jxc.common.enums.DeliverStatusEnum;
import com.okdeer.jxc.common.enums.DisabledEnum;
import com.okdeer.jxc.common.enums.FormSourcesEnum;
import com.okdeer.jxc.common.enums.FormTypeEnum;
import com.okdeer.jxc.common.enums.IsReference;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.BigDecimalUtils;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.NumberToCN;
import com.okdeer.jxc.common.utils.OrderNoUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.UuidUtils;
import com.okdeer.jxc.form.deliver.entity.DeliverForm;
import com.okdeer.jxc.form.deliver.entity.DeliverFormList;
import com.okdeer.jxc.form.deliver.service.DeliverConfigServiceApi;
import com.okdeer.jxc.form.deliver.service.DeliverFormServiceApi;
import com.okdeer.jxc.form.deliver.service.QueryDeliverFormListServiceApi;
import com.okdeer.jxc.form.deliver.service.QueryDeliverFormServiceApi;
import com.okdeer.jxc.form.deliver.vo.DeliverFormListVo;
import com.okdeer.jxc.form.deliver.vo.DeliverFormVo;
import com.okdeer.jxc.form.deliver.vo.QueryDeliverFormVo;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectDeliver;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.jxc.utils.poi.ExcelReaderUtil;
import com.okdeer.retail.common.price.PriceConstant;

/**
 * ClassName: DeliverFormController 
 * @Description: 配送单（调拨单）
 * @author yangyq02
 * @date 2016年8月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    进销存2.0.0		   2016年8月17日                  zhangchm            配送单（调拨单）Controller
 *    商业管理系统 		   2016.9.1			lijy02				修改继承controller 完善打印功能
 */
@Controller
@RequestMapping("form/deliverForm")
public class DeliverFormController extends BasePrintController<DeliverFormController, DeliverFormList> {

	@Reference(version = "1.0.0", check = false)
	private QueryDeliverFormServiceApi queryDeliverFormServiceApi;

	@Reference(version = "1.0.0", check = false)
	private DeliverFormServiceApi deliverFormServiceApi;

	@Reference(version = "1.0.0", check = false)
	private QueryDeliverFormListServiceApi queryDeliverFormListServiceApi;

	@Reference(version = "1.0.0", check = false)
	private DeliverConfigServiceApi deliverConfigServiceApi;

	/**
	 * BranchSpecService
	 */
	@Reference(version = "1.0.0", check = false)
	private BranchSpecServiceApi branchSpecService;

	@Autowired
	private OrderNoUtils orderNoUtils;

	@Reference(version = "1.0.0", check = false)
	BranchesServiceApi branchesServiceApi;

	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	/**
	 * 机构设置Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private BranchSpecServiceApi branchSpecServiceApi;

	/**
	 * @Description: 跳转要货单页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年8月17日
	 */
	@RequestMapping(value = "viewsDA")
	public String viewDA(Model model) {
		model.addAttribute("targetBranchId", getCurrBranchId());
		return "form/deliver/deliverList";
	}

	/**
	 * @Description: 跳转直送要货单页面
	 * @param model
	 * @return
	 * @author xuyq
	 * @date 2017年3月30日
	 */
	@RequestMapping(value = "viewsDY")
	public String viewsDY(Model model) {
		model.addAttribute("targetBranchId", getCurrBranchId());
		return "form/deliver/deliverDyList";
	}

	/**
	 * @Description: 跳转出库单
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年8月17日
	 */
	@RequestMapping(value = "viewsDO")
	public String viewsDO(Model model) {
		model.addAttribute("sourceBranchId", getCurrBranchId());
		return "form/deliver/DoList";
	}

	/**
	 * @Description: 跳转入库单
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年8月17日
	 */
	@RequestMapping(value = "viewsDI")
	public String viewsDI(Model model) {
		model.addAttribute("targetBranchId", getCurrBranchId());
		return "form/deliver/DiList";
	}

	/**
	 * @Description: 跳转退货申请单
	 * @param model
	 * @return
	 * @author liwb
	 * @date 2017年3月30日
	 */
	@RequestMapping(value = "viewsDR")
	public String viewsDR(Model model) {
		model.addAttribute("targetBranchId", getCurrBranchId());
		return "form/deliver/refund/DrList";
	}

	/**
	 * @Description: 返利设置页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年9月6日
	 */
	@RequestMapping(value = "rebate")
	public String rebate() {
		return "form/deliver/rebate";
	}

	/**
	 * @Description: 新增页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2016年8月29日
	 */
	@RequestMapping(value = "addDeliverForm")
	public String addDeliverForm(QueryDeliverFormVo vo, Model model) {
		LOG.debug(LogConstant.OUT_PARAM, vo);
		SysUser user = getCurrentUser();
		String deliverType = vo.getDeliverType();
		model.addAttribute("user", user);
		BranchesGrow branchesGrow = branchesServiceApi.queryBranchesById(user.getBranchId());
		// branchesGrow.setMinAmount(branchesGrow.getTargetBranchMinAmount())
		Integer type = branchesGrow.getTargetBranchType();
		if (FormType.DA.toString().equals(deliverType)) {
			if (BranchTypeEnum.HEAD_QUARTERS.getCode().intValue() == type.intValue()) {
				// 如果是总店，则不让进行任何业务操作，只能查询
				// return "form/deliver/deliverList"
			} else if (BranchTypeEnum.BRANCH_OFFICE.getCode().intValue() == type.intValue()) {
				// 判断要货机构是否是分店，如果是分店，要货机构可以选择该分店下的所有机构，有效时间为该分店的，起订金额为目标机构的
				branchesGrow
						.setValidityTime(branchesGrow.getTargetBranchValidityNumDays() == 0 ? SysConstant.VALIDITY_DAY
								: branchesGrow.getTargetBranchValidityNumDays());
				branchesGrow.setSourceBranchId("");
				branchesGrow.setSourceBranchName("");
			} else {
				// 如果为店铺，则只能是该机构本身，不能选择，有效时间为该店铺对应的分店的，起订金额为该店铺对应分店的
				branchesGrow
						.setValidityTime(branchesGrow.getSourceBranchValidityNumDays() == 0 ? SysConstant.VALIDITY_DAY
								: branchesGrow.getSourceBranchValidityNumDays());
			}

			model.addAttribute("branchesGrow", branchesGrow);
			return "form/deliver/deliverAdd";
		} else if (FormType.DO.toString().equals(deliverType)) {
			if (BranchTypeEnum.HEAD_QUARTERS.getCode().intValue() == type.intValue()
					|| BranchTypeEnum.BRANCH_OFFICE.getCode().intValue() == type.intValue()) {
				branchesGrow.setSourceBranchId("");
				branchesGrow.setSourceBranchName("");
			}
			boolean isAllowDrGenerDo = true;
			// 当前登录机构是否可引用退货单出库出库
            if (BranchTypeEnum.HEAD_QUARTERS.getCode().intValue() != type.intValue()
                    && Constant.INTEGER_ONE.equals(branchesGrow.getIsAllowDrGenerDo())) {
                // 如果是分公司或店铺账号，且允许入库引用门店退货申请时自动生成配送出库单，则不需要再引用退货单做出库单
                isAllowDrGenerDo = false;
            }
            model.addAttribute("isAllowDrGenerDo", isAllowDrGenerDo);
			model.addAttribute("branchesGrow", branchesGrow);
			// 需求修改，点击要货单生成出库单，将要货单id传入
			if (!StringUtils.isEmpty(vo.getDeliverFormId())) {
				model.addAttribute("referenceId", vo.getDeliverFormId());
				model.addAttribute("refFormType", vo.getRefDeliverType());
			}
			return "form/deliver/DoAdd";
		} else if (FormType.DR.toString().equals(deliverType)) { // 退货申请

			if (BranchTypeEnum.HEAD_QUARTERS.getCode().intValue() == type.intValue()
					|| BranchTypeEnum.BRANCH_OFFICE.getCode().intValue() == type.intValue()) {
				branchesGrow.setSourceBranchId("");
				branchesGrow.setSourceBranchName("");
			}
			model.addAttribute("branchesGrow", branchesGrow);
			// 需求修改，点击要货单生成出库单，将要货单id传入
			if (!StringUtils.isEmpty(vo.getDeliverFormId())) {
				model.addAttribute("referenceId", vo.getDeliverFormId());
			}
			return "form/deliver/refund/DrAdd";
		} else if (FormType.DY.toString().equals(deliverType)) { // 直送要货
			if (BranchTypeEnum.HEAD_QUARTERS.getCode().intValue() == type.intValue()) {
				// 如果是总店，则不让进行任何业务操作，只能查询
				// return "form/deliver/deliverList"
			} else if (BranchTypeEnum.BRANCH_OFFICE.getCode().intValue() == type.intValue()) {
				// 判断要货机构是否是分店，如果是分店，要货机构可以选择该分店下的所有机构，有效时间为该分店的，起订金额为目标机构的
				branchesGrow
						.setValidityTime(branchesGrow.getTargetBranchValidityNumDays() == 0 ? SysConstant.VALIDITY_DAY
								: branchesGrow.getTargetBranchValidityNumDays());
				branchesGrow.setSourceBranchId("");
				branchesGrow.setSourceBranchName("");
			} else {
				// 如果为店铺，则只能是该机构本身，不能选择，有效时间为该店铺对应的分店的，起订金额为该店铺对应分店的
				branchesGrow
						.setValidityTime(branchesGrow.getSourceBranchValidityNumDays() == 0 ? SysConstant.VALIDITY_DAY
								: branchesGrow.getSourceBranchValidityNumDays());
			}

			model.addAttribute("branchesGrow", branchesGrow);
			return "form/deliver/deliverDyAdd";
		} else {
			// 需求修改，点击要货单生成出库单，将要货单id传入
			if (!StringUtils.isEmpty(vo.getDeliverFormId())) {
				model.addAttribute("referenceId", vo.getDeliverFormId());
			}
			return "form/deliver/DiAdd";
		}
	}

	/**
	 * @Description: 根据要货单跳转页面
	 * @param vo
	 * @param model
	 * @param type
	 * @return
	 * @author zhangchm
	 * @date 2016年8月29日
	 */
	@RequestMapping(value = "deliverEdit")
	public String deliverEdit(QueryDeliverFormVo vo, String report, Model model) {
		LOG.debug(LogConstant.OUT_PARAM, vo);
		model.addAttribute("type", vo.getFormSources());
		vo.setFormSources("");
		DeliverForm form = queryDeliverFormServiceApi.queryEntity(vo);
		model.addAttribute("form", form);
		LOG.debug(LogConstant.PAGE, form);
		// 待审核，可修改
		if (DeliverAuditStatusEnum.WAIT_CHECK.getName().equals(form.getStatus())) {
			if (FormType.DA.toString().equals(form.getFormType())) {
				Branches branches = branchesServiceApi.getBranchInfoById(form.getTargetBranchId());
				model.addAttribute("minAmount", form.getMinAmount());
				model.addAttribute("targetBranchType", branches.getType());
				model.addAttribute("targetDeliverPriceSpec", branches.getDeliverPriceSpec());
				model.addAttribute("salesman", branches.getSalesman() == null ? "" : branches.getSalesman());
				return "form/deliver/deliverEdit";
			} else if (FormType.DO.toString().equals(form.getFormType())) {
				return "form/deliver/DoEdit";
			} else if (FormType.DD.toString().equals(form.getFormType())) {
				return "form/deliver/DDEdit";
			} else if (FormType.DR.toString().equals(form.getFormType())) {
				return "form/deliver/refund/DrEdit";
			} else if (FormType.DY.toString().equals(form.getFormType())) {
				return "form/deliver/deliverDyEdit";
			} else {
				return "form/deliver/DiEdit";
			}
		} else {
			// 返回状态
			if (DeliverStatusEnum.STOPPED.getName().equals(form.getDealStatus())) {
				model.addAttribute("status", Constant.DEAL_STATUS);
			} else if (DeliverStatusEnum.REFUSE.getName().equals(form.getDealStatus())) {
				model.addAttribute("status", DeliverStatusEnum.REFUSE.getName());
			} else {
				model.addAttribute("status", Constant.STATUS);
			}
			// 已审核，不能修改
			if (FormType.DA.toString().equals(form.getFormType())) {
				Branches branches = branchesServiceApi.getBranchInfoById(getCurrBranchId());
				model.addAttribute("minAmount", branches.getMinAmount());
				model.addAttribute("salesman", branches.getSalesman() == null ? "" : branches.getSalesman());
				model.addAttribute("close", report);
				return "form/deliver/deliverView";
			} else if (FormType.DO.toString().equals(form.getFormType())) {
				form.setRebateMoney(BigDecimalUtils.formatDecimal(form.getRebateMoney(), 2));
				form.setAddRebateMoney(BigDecimalUtils.formatDecimal(form.getAddRebateMoney(), 2));
				model.addAttribute("close", report);
				return "form/deliver/DoView";
			} else if (FormType.DD.toString().equals(form.getFormType())) {
				return "form/deliver/DDView";
			} else if (FormType.DR.toString().equals(form.getFormType())) {
				model.addAttribute("close", report);
				return "form/deliver/refund/DrView";
			} else if (FormType.DY.toString().equals(form.getFormType())) {
				Branches branches = branchesServiceApi.getBranchInfoById(getCurrBranchId());
				model.addAttribute("minAmount", branches.getMinAmount());
				model.addAttribute("salesman", branches.getSalesman() == null ? "" : branches.getSalesman());
				model.addAttribute("close", report);
				return "form/deliver/deliverDyView";
			} else {
				model.addAttribute("close", report);
				return "form/deliver/DiView";
			}
		}
	}

	/**
	 * @Description: 要货单查询
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return PageUtils<PurchaseSelect>  
	 * @throws
	 * @author zhangchm
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "getDeliverForms", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<DeliverForm> getDeliverForms(QueryDeliverFormVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.debug(LogConstant.OUT_PARAM, vo);
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);

			String deliverType = vo.getDeliverType();

			// 如果是出库单/要货单/退货单
			if (FormType.DO.toString().equals(deliverType) || FormType.DD.toString().equals(deliverType)
					|| FormType.DR.toString().equals(deliverType)) {
				if (StringUtils.isEmpty(vo.getSourceBranchId())) {
					vo.setSourceBranchCompleteCode(UserUtil.getCurrBranchCompleCode());
				}
			} else {
				// 获取机构ID
				if (StringUtils.isEmpty(vo.getTargetBranchId())) {
					vo.setTargetBranchCompleteCode(UserUtil.getCurrBranchCompleCode());
				}
			}

			String sourceBranchName = vo.getSourceBranchName();
			String targetBranchName = vo.getTargetBranchName();
			if (StringUtils.isNotEmpty(sourceBranchName)) {
				if (sourceBranchName.contains("[") && sourceBranchName.contains("]")) {
					vo.setSourceBranchName(null);
				} else {
					vo.setSourceBranchId(null);
				}
			}

			if (StringUtils.isNotEmpty(targetBranchName)) {
				if (targetBranchName.contains("[") && targetBranchName.contains("]")) {
					vo.setTargetBranchName(null);
				} else {
					vo.setTargetBranchId(null);
				}
			}
			PageUtils<DeliverForm> deliverForms = queryDeliverFormServiceApi.queryLists(vo);
			// 过滤数据权限字段
			cleanAccessData(deliverForms);
			LOG.debug(LogConstant.PAGE, deliverForms);
			return deliverForms;
		} catch (Exception e) {
			LOG.error("要货单查询数据出现异常:{}", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 保存要货申请单
	 * @param vo
	 * @param branchCode
	 * @param validate
	 * @return
	 * @author zhangchm
	 * @date 2016年8月20日
	 */
	@RequestMapping(value = "insertDeliverForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson insertDeliverForm(@RequestBody String formVo) {
		RespJson respJson = RespJson.success();
		try {
			DeliverFormVo vo = JsonMapper.nonDefaultMapper().fromJson(formVo, DeliverFormVo.class);
			// 配送出库，入库，如果引用订单，需要验证商品条目
			if ((FormType.DI.toString().equals(vo.getFormType()) || FormType.DO.toString().equals(vo.getFormType()))
					&& StringUtils.isNotBlank(vo.getReferenceNo())) {
				List<String> skuIds = new ArrayList<String>();
				List<DeliverFormListVo> deliverFormListVo = vo.getDeliverFormListVo();
				if (CollectionUtils.isNotEmpty(deliverFormListVo)) {
					for (DeliverFormListVo detailVo : deliverFormListVo) {
						skuIds.add(detailVo.getSkuId());
					}
				}
				RespJson resp = validReceiptItem(skuIds, vo.getReferenceId(),vo.getDeliverFormId());
				if (!resp.isSuccess()) {
					return resp;
				}
			}
			String getId = UuidUtils.getUuid();
			String formNo = "";
			if (StringUtils.isEmpty(vo.getBranchCode())) {
				formNo = orderNoUtils.getOrderNo(new StringBuilder(vo.getFormType()).append(getCurrBranchCode())
						.toString());
			} else {
				formNo = orderNoUtils.getOrderNo(new StringBuilder(vo.getFormType()).append(vo.getBranchCode())
						.toString());
			}
			// 获取单号
			// 获取登录人
			SysUser user = getCurrentUser();
			// 设置值
			vo.setDeliverFormId(getId);
			vo.setFormNo(formNo);
			vo.setStatus(DeliverAuditStatusEnum.WAIT_CHECK.getIndex());
			vo.setDealStatus(DeliverStatusEnum.PENDING.getIndex());
			vo.setIsReference(IsReference.NO.getIndex());
			vo.setCreaterBranchId(UserUtil.getCurrBranchId());
			vo.setValue(user.getId(), user.getId(), null, null);
			vo.setFormSources(FormSourcesEnum.SYSTEM.getKey());
            BigDecimal totalAmount = BigDecimal.ZERO;
            BigDecimal untaxedTotalAmount = BigDecimal.ZERO;
			for (DeliverFormListVo deliverFormListVo : vo.getDeliverFormListVo()) {
				deliverFormListVo.setDeliverFormListId(UuidUtils.getUuid());
				deliverFormListVo.setFormNo(formNo);
				deliverFormListVo.setFormId(getId);
				// 如果是店间配送单，配送出库数量等于 申请数量
				if (FormType.DD.toString().equals(vo.getFormType())) {
					deliverFormListVo.setDealNum(deliverFormListVo.getApplyNum());
				}
				BigDecimal itemNum;
                if (FormType.DA.toString().equals(vo.getFormType())
                        || FormType.DY.toString().equals(vo.getFormType())) {
                    itemNum = deliverFormListVo.getApplyNum();
                } else {
                    itemNum = deliverFormListVo.getDealNum();
                }
				// 单价备份默认用单价
				if (deliverFormListVo.checkPirceBack()) {
					deliverFormListVo.setPriceBack(deliverFormListVo.getPrice());
				}
                if (deliverFormListVo.checkUntaxedPirceBack()) {
                    deliverFormListVo.setUntaxedPriceBack(deliverFormListVo.getUntaxedPrice());
                }
				// 如果页面传递非赠品 ，且价格不为0，数量不为0，但金额为0的明细，重新计算金额值
				deliverFormListVo.setZeroAmount(itemNum);
				totalAmount = totalAmount.add(deliverFormListVo.getAmount());
				untaxedTotalAmount = untaxedTotalAmount.add(deliverFormListVo.getUntaxedAmount());
			}
			// 重算单据金额
			vo.setAmount(BigDecimalUtils.formatDecimal(totalAmount, 4));
			vo.setUntaxedAmount(BigDecimalUtils.formatDecimal(untaxedTotalAmount, 4));
			respJson = deliverFormServiceApi.insertForm(vo);
			if (respJson.getStatus() != 0) {
				return respJson;
			}
			respJson.put("formId", getId);
		} catch (Exception e) {
			LOG.error("保存配送申请单出现异常", e);
			respJson = RespJson.error("添加配送申请单失败！");
		}
		return respJson;
	}

	/***
	* 
	* @Description: 验证采购退货商品项
	* @param skuIds
	* @param formId
	* @return
	* @author xuyq
	* @date 2017年5月12日
	*/
	public RespJson validReceiptItem(List<String> skuIds,String referenceId,String formId) {
	    // 验证引用单据是否已经被引用（多窗口操作）
	    DeliverForm deliverForm = deliverFormServiceApi.queryDeliverFormById(referenceId);
        // 入库单如果引用店间入库时，判断是否已终止
        if (DeliverStatusEnum.STOPPED.getName().equals(deliverForm.getDealStatus())) {
            return RespJson.error("当前引用单据已终止，请重新选择");
        }
        
        int count = deliverFormServiceApi.queryListsByReferenceIds(referenceId, formId);
        if (count > 0) {
            return RespJson.error("当前引用单据已被使用，请重新选择");
        }
		List<DeliverFormList> list = queryDeliverFormListServiceApi.getDeliverListById(referenceId);
		if ((CollectionUtils.isNotEmpty(skuIds) && CollectionUtils.isNotEmpty(list) && skuIds.size() > list.size())
				|| CollectionUtils.isEmpty(list)) {
			return RespJson.error("已选配送单号，不允许添加其他商品");
		}
		Map<String, DeliverFormList> tempMap = new HashMap<String, DeliverFormList>();
		for (DeliverFormList delForm : list) {
			tempMap.put(delForm.getSkuId(), delForm);
		}
		for (String skuId : skuIds) {
			DeliverFormList pdPo = tempMap.get(skuId);
			if (pdPo == null) {
				return RespJson.error("已选配送单号，不允许添加其他商品");
			}
		}
		return RespJson.success();
	}

	/**
	 * @Description: 修改配送单
	 * @param vo
	 * @param validate
	 * @return
	 * @author zhangchm
	 * @date 2016年8月20日
	 */
	@RequestMapping(value = "updateDeliverForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateDeliverForm(@RequestBody String formVo) {
		RespJson respJson = RespJson.success();
		long start = System.currentTimeMillis();
		LOG.debug(LogConstant.OUT_PARAM, formVo);
		try {
			DeliverFormVo vo = JsonMapper.nonDefaultMapper().fromJson(formVo, DeliverFormVo.class);
			// 不是引用订单，需要验证
			if ((FormType.DI.toString().equals(vo.getFormType()) || FormType.DO.toString().equals(vo.getFormType()))
					&& StringUtils.isNotBlank(vo.getReferenceNo())) {
				List<String> skuIds = new ArrayList<String>();
				List<DeliverFormListVo> deliverFormListVo = vo.getDeliverFormListVo();
				if (CollectionUtils.isNotEmpty(deliverFormListVo)) {
					for (DeliverFormListVo detailVo : deliverFormListVo) {
						skuIds.add(detailVo.getSkuId());
					}
				}
				RespJson resp = validReceiptItem(skuIds, vo.getReferenceId(),vo.getDeliverFormId());
				if (!resp.isSuccess()) {
					return resp;
				}
			}
			// 获取登录人
			SysUser user = UserUtil.getCurrentUser();
			// 设置值
			vo.setUpdateUserId(user.getId());
			vo.setUpdateTime(DateUtils.getCurrDate());
			vo.setCreaterBranchId(user.getBranchId());
			vo.setIsReference(IsReference.NO.getIndex());
			vo.setFormSources(FormSourcesEnum.SYSTEM.getKey());
			vo.setDealStatus(DeliverStatusEnum.PENDING.getIndex());
			vo.setStatus(DeliverAuditStatusEnum.WAIT_CHECK.getIndex());
			vo.setDisabled(DisabledEnum.NO.getIndex());
            BigDecimal totalAmount = BigDecimal.ZERO;
            BigDecimal untaxedTotalAmount = BigDecimal.ZERO;
			for (DeliverFormListVo deliverFormListVo : vo.getDeliverFormListVo()) {
				deliverFormListVo.setDeliverFormListId(UuidUtils.getUuid());
				deliverFormListVo.setFormId(vo.getDeliverFormId());
				deliverFormListVo.setFormNo(vo.getFormNo());
				if (FormType.DD.toString().equals(vo.getFormType())) {
					deliverFormListVo.setDealNum(deliverFormListVo.getApplyNum());
				}
				
                BigDecimal itemNum;
                if (FormType.DA.toString().equals(vo.getFormType())
                        || FormType.DY.toString().equals(vo.getFormType())) {
                    itemNum = deliverFormListVo.getApplyNum();
                } else {
                    itemNum = deliverFormListVo.getDealNum();
                }
				// 单价备份默认用单价
				if (deliverFormListVo.checkPirceBack()) {
					deliverFormListVo.setPriceBack(deliverFormListVo.getPrice());
				}
				
                // 如果页面传递非赠品 ，且价格不为0，数量不为0，但金额为0的明细，重新计算金额值
				deliverFormListVo.setZeroAmount(itemNum);
                totalAmount = totalAmount.add(deliverFormListVo.getAmount());
                untaxedTotalAmount = untaxedTotalAmount.add(deliverFormListVo.getUntaxedAmount());
			}
            // 重设单据金额
            vo.setAmount(BigDecimalUtils.formatDecimal(totalAmount, 4));
            vo.setUntaxedAmount(BigDecimalUtils.formatDecimal(untaxedTotalAmount, 4));
			respJson = deliverFormServiceApi.updateForm(vo);
			if (respJson.getStatus() != 0) {
				return respJson;
			}
			respJson.put("formId", vo.getDeliverFormId());
		} catch (Exception e) {
			LOG.error("修改配送单出现异常:{}", e);
			respJson = RespJson.error("修改配送单失败！");
		}
		long end = System.currentTimeMillis();
		LOG.debug("修改配送单据所用时间{}", (end - start));
		return respJson;
	}

	/**
	 * @Description: 删除要货单(假删除)
	 * @param formIds  
	 * @return
	 * @author zhangchm
	 * @date 2016年8月20日
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "deleteDeliverForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson deleteDeliverForm(@RequestBody String formIds) {
		RespJson respJson = RespJson.success();
		LOG.debug(LogConstant.OUT_PARAM, formIds);
		try {
			if (StringUtils.isEmpty(formIds)) {
				LOG.error("未选择要删除的单据！");
				return RespJson.error("未选择要删除的单据！");
			}
			List<String> formIdsList = JsonMapper.nonDefaultMapper().fromJson(formIds, List.class);
			if (CollectionUtils.isEmpty(formIdsList)) {
				LOG.error("未选择要删除的单据！");
				return RespJson.error("未选择要删除的单据！");
			}
			// 获取登录人
			SysUser user = UserUtil.getCurrentUser();
			DeliverFormVo vo = new DeliverFormVo();
			vo.setDeliverFormIds(formIdsList);
			// 设置值
			vo.setUpdateUserId(user.getId());
			vo.setUpdateTime(DateUtils.getCurrDate());
			return deliverFormServiceApi.updateToRemove(vo);
		} catch (Exception e) {
			LOG.error("删除配送单出现异常", e);
			respJson = RespJson.error("删除配送单失败！");
		}
		return respJson;
	}

	/**
	 * @Description: 审核
	 * @param vo  deliverType( DA:要货单, DD:店间要货, DO:出库单, DI: 入库单 ,DR:退货申请),status=1
	 * @return
	 * @author zhangchm
	 * @date 2016年8月29日
	 */
	@RequestMapping(value = "check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(QueryDeliverFormVo vo) {
		LOG.debug(LogConstant.OUT_PARAM, vo);
		try {
			SysUser user = UserUtil.getCurrentUser();
			vo.setUpdateUserId(user.getId());
			return deliverFormServiceApi.check(vo);
		} catch (RuntimeException e) {
			LOG.warn(e.getMessage());
			return RespJson.error("审核操作失败:" + e.getMessage());
		} catch (Exception e) {
			LOG.error("配送单审核操作失败", e);
			return RespJson.error("审核操作失败！");
		}
	}

	/**
	 * @Description: 配送出库审核前判断是否允许负库存出库，允许并存在负库存需要提示
	 * @author zhengwj
	 * @date 2017年4月17日
	 */
	@RequestMapping(value = "checkValid", method = RequestMethod.POST)
	@ResponseBody
	public RespJson checkValid(QueryDeliverFormVo vo) {
		LOG.debug(LogConstant.OUT_PARAM, vo.toString());
		try {
			BranchSpecVo branchSpecVo = branchSpecServiceApi.queryByBranchId(vo.getSourceBranchId());
            boolean isAllowFormMinusStock = branchSpecVo.getIsAllowMinusStock() == 1;
			Branches targetBranch = branchesServiceApi.getBranchInfoById(vo.getSourceBranchId());
			Integer branchType = targetBranch.getType();
			// 目标机构是店铺，并且引用单据为店间或退货时
			if ((BranchTypeEnum.SELF_STORE.getCode().equals(branchType)
			        || BranchTypeEnum.FRANCHISE_STORE_B.getCode().equals(branchType)
			        || BranchTypeEnum.FRANCHISE_STORE_C.getCode().equals(branchType))
			        && ((FormType.DD.toString().equals(vo.getRefDeliverType())
			                && Constant.INTEGER_ONE.equals(branchSpecVo.getIsAllowMinusStockDdOut()))
			                || (FormType.DR.toString().equals(vo.getRefDeliverType())
			                        && !Constant.INTEGER_ONE.equals(branchSpecVo.getIsAllowMinusStockDrOut())))) {
			    isAllowFormMinusStock = false;
			}
			// 不允许负库存出库，直接审核，否则判断是否存在负库存需要提示
			if (!isAllowFormMinusStock) {
				return RespJson.success();
			}
			vo.setPageNumber(1);
			vo.setPageSize(999999);
			LOG.debug("vo:{}", vo.toString());
			PageUtils<DeliverFormList> deliverFormLists = queryDeliverFormListServiceApi
					.getDeliverFormListsAndStockByIdOrFormNo(vo);
			LOG.debug("page:{}", deliverFormLists.toString());
			List<DeliverFormList> list = deliverFormLists.getList();
			if (CollectionUtils.isEmpty(list)) {
				return RespJson.error("审核操作失败！");
			}
			// 校验是否负库存
			boolean checkValid = false;
			for (DeliverFormList deliverFormList : list) {
				// 当前库存-数量
				int result = deliverFormList.getSourceStock().subtract(deliverFormList.getDealNum())
						.compareTo(BigDecimal.ZERO);
				// 存在负库存
				if (result < 0) {
					checkValid = true;
					break;
				}
			}
			if (checkValid) {
				return RespJson.businessError("需要确认负库存出库！");
			}
		} catch (Exception e) {
			LOG.error("要货单查询明细数据出现异常", e);
		}
		return RespJson.success();
	}

	/**
	 * @Description: 查询要货机构的发货机构信息,要货机构为店铺
	 * @param branchesId  
	 * @return
	 * @author zhangchm
	 * @date 2016年9月18日
	 */
	@RequestMapping(value = "getSourceBranch", method = RequestMethod.POST)
	@ResponseBody
	public RespJson getSourceBranch(String branchesId) {
		RespJson respJson = RespJson.success();
		BranchesGrow branchesGrow = branchesServiceApi.queryBranchesById(branchesId);
		respJson.put("sourceBranchId", branchesGrow.getSourceBranchId());
		respJson.put("sourceBranchName", branchesGrow.getSourceBranchName());
		respJson.put("sourceBranchCode", branchesGrow.getSourceBranchCode());
		respJson.put("validityTime", DateUtils.getDaysAfter(
				DateUtils.getCurrDate(),
				branchesGrow.getSourceBranchValidityNumDays() == 0 ? SysConstant.VALIDITY_DAY : branchesGrow
						.getSourceBranchValidityNumDays()));
		respJson.put("salesman", branchesGrow.getSalesman());
		respJson.put("minAmount", branchesGrow.getMinAmount());
		Branches sourceBranch = branchesServiceApi.getBranchInfoById(branchesGrow.getSourceBranchId());
		respJson.put("deliverPriceSpec", sourceBranch.getDeliverPriceSpec());
		return respJson;
	}

	/***
	 * 
	 * @Description: 查询机构配置
	 * @param branchId branchId
	 * @return RespJson
	 * @author xuyq
	 * @date 2017年6月2日
	 */
	@RequestMapping(value = "queryBranchSpecById", method = RequestMethod.POST)
	@ResponseBody
	public RespJson queryBranchSpecById(String branchId) {
		RespJson resp = RespJson.success();
		try {
			BranchSpecVo spceVo = branchSpecService.queryByBranchId(branchId);
			resp.put("spceVo", spceVo);
		} catch (Exception e) {
			LOG.error("查询机构配置异常:{}", e);
			resp = RespJson.error("查询机构配置异常");
		}
		return resp;
	}

	/**
	 * @Description: 终止
	 * @param vo  
	 * @return
	 * @author zhangchm
	 * @date 2016年8月29日
	 */
	@RequestMapping(value = "stopped", method = RequestMethod.POST)
	@ResponseBody
	public RespJson stopped(QueryDeliverFormVo vo) {
		SysUser user = UserUtil.getCurrentUser();
		vo.setOperateUserId(user.getId());
		LOG.debug(LogConstant.OUT_PARAM, vo);
		return deliverFormServiceApi.stoppedDeliverForm(vo);
	}

	// begin by lijy02 2016.9.12 :添加打印
	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintReplace(java.lang.String)
	 */
	@Override
	protected Map<String, Object> getPrintReplace(String formNo) {
		Map<String, Object> replaceMap = new HashMap<String, Object>();
		DeliverForm deliverForm = deliverFormServiceApi.queryDeliverFormById(formNo);
		// 单号
		replaceMap.put("_单号", deliverForm.getFormNo() != null ? deliverForm.getFormNo() : "");
		replaceMap.put("_订单编号", deliverForm.getFormNo() != null ? deliverForm.getFormNo() : "");
		replaceMap.put("formNo", deliverForm.getFormNo() != null ? deliverForm.getFormNo() : "");
		// 要货机构
		replaceMap.put("_要货机构", deliverForm.getTargetBranchName() != null ? deliverForm.getTargetBranchName() : "");
		replaceMap.put("targetBranchName",
				deliverForm.getTargetBranchName() != null ? deliverForm.getTargetBranchName() : "");
		replaceMap.put("targetBranchCode",
				deliverForm.getTargetBranchCode() != null ? deliverForm.getTargetBranchCode() : "");
		// 收货地址
		replaceMap.put("_收货地址", deliverForm.getTargetBranchAddress() != null ? deliverForm.getTargetBranchAddress()
				: "");
		replaceMap.put("targetBranchAddress",
				deliverForm.getTargetBranchAddress() != null ? deliverForm.getTargetBranchAddress() : "");
		// 发货机构
		replaceMap.put("_发货机构", deliverForm.getSourceBranchName() != null ? deliverForm.getSourceBranchName() : "");
		replaceMap.put("sourceBranchName",
				deliverForm.getSourceBranchName() != null ? deliverForm.getSourceBranchName() : "");
		replaceMap.put("sourceBranchCode",
				deliverForm.getSourceBranchCode() != null ? deliverForm.getSourceBranchCode() : "");

		// 收货机构
		replaceMap.put("_收货机构", deliverForm.getSourceBranchName() != null ? deliverForm.getSourceBranchName() : "");
		replaceMap.put("sourceBranchName",
				deliverForm.getSourceBranchName() != null ? deliverForm.getSourceBranchName() : "");
		// 有效期限
		replaceMap.put(
				"_有效期限",
				deliverForm.getValidityTime() != null ? DateUtils.formatDate(deliverForm.getValidityTime(),
						"yyyy-MM-dd HH:mm:ss") : "");
		replaceMap.put(
				"validityTime",
				deliverForm.getValidityTime() != null ? DateUtils.formatDate(deliverForm.getValidityTime(),
						"yyyy-MM-dd HH:mm:ss") : "");
		// 备注
		replaceMap.put("_备注", deliverForm.getRemark() != null ? deliverForm.getRemark() : "");
		replaceMap.put("targetBranchRemark",
				deliverForm.getTargetBranchRemark() != null ? deliverForm.getTargetBranchRemark() : "");
		// 制单人员
		replaceMap.put("_制单人员", deliverForm.getCreateUserName() != null ? deliverForm.getCreateUserName() : "");
		replaceMap
				.put("createUserName", deliverForm.getCreateUserName() != null ? deliverForm.getCreateUserName() : "");
		// 制单日期
		replaceMap.put(
				"_制单日期",
				deliverForm.getCreateTime() != null ? DateUtils.formatDate(deliverForm.getCreateTime(),
						"yyyy-MM-dd HH:mm:ss") : "");
		replaceMap.put(
				"createTime",
				deliverForm.getCreateTime() != null ? DateUtils.formatDate(deliverForm.getCreateTime(),
						"yyyy-MM-dd HH:mm:ss") : "");
		// 审核日期
		replaceMap.put(
				"_审核日期",
				deliverForm.getValidTime() != null ? DateUtils.formatDate(deliverForm.getValidTime(),
						"yyyy-MM-dd HH:mm:ss") : "");
		replaceMap.put(
				"validTime",
				deliverForm.getValidTime() != null ? DateUtils.formatDate(deliverForm.getValidTime(),
						"yyyy-MM-dd HH:mm:ss") : "");
		// 审核人员
		replaceMap.put("_审核人员", deliverForm.getValidUserName() != null ? deliverForm.getValidUserName() : "");
		replaceMap.put("validUserName", deliverForm.getValidUserName() != null ? deliverForm.getValidUserName() : "");
		// 配送单号
		replaceMap.put("_配送单号", deliverForm.getReferenceNo() != null ? deliverForm.getReferenceNo() : "");
		replaceMap.put("referenceNo", deliverForm.getReferenceNo() != null ? deliverForm.getReferenceNo() : "");
		// 要货单号
		replaceMap.put("_要货单号", deliverForm.getReferenceNo() != null ? deliverForm.getReferenceNo() : "");
		replaceMap.put("referenceNo", deliverForm.getReferenceNo() != null ? deliverForm.getReferenceNo() : "");
		// 业务人员
		replaceMap.put("_业务人员", deliverForm.getSalesman() != null ? deliverForm.getSalesman() : "");
		replaceMap.put("salesman", deliverForm.getSalesman() != null ? deliverForm.getSalesman() : "");
		replaceMap.put("salesmanName", deliverForm.getSalesmanName() != null ? deliverForm.getSalesmanName() : "");
		// 申请
		replaceMap.put("_申请人", deliverForm.getTargetBranchName() != null ? deliverForm.getTargetBranchName() : "");
		replaceMap.put("targetBranchName",
				deliverForm.getTargetBranchName() != null ? deliverForm.getTargetBranchName() : "");
		// 联系人
		replaceMap.put("_联系人", deliverForm.getContacts() != null ? deliverForm.getContacts() : "");
		replaceMap.put("contacts", deliverForm.getContacts() != null ? deliverForm.getContacts() : "");
		// 联系电话
		replaceMap.put("_联系电话", deliverForm.getMobile() != null ? deliverForm.getMobile() : "");
		replaceMap.put("mobile", deliverForm.getMobile() != null ? deliverForm.getMobile() : "");
		// 返利
		replaceMap.put("_返利", BigDecimalUtils.formatFourDecimal(deliverForm.getAddRebateMoney()).toString());
		replaceMap.put("addRebateMoney", BigDecimalUtils.formatFourDecimal(deliverForm.getAddRebateMoney()).toString());
		// 折扣
		replaceMap.put("_折扣", BigDecimalUtils.formatFourDecimal(deliverForm.getRebateMoney()).toString());
		replaceMap.put("rebateMoney", BigDecimalUtils.formatFourDecimal(deliverForm.getRebateMoney()).toString());
		// 人民币总金额大写
		replaceMap.put("_人民币总金额大写", NumberToCN.number2CNMontrayUnit(deliverForm.getAmount()));
		replaceMap.put("amountCN", NumberToCN.number2CNMontrayUnit(deliverForm.getAmount()));
		// 总金额
		replaceMap.put("_总金额", BigDecimalUtils.formatFourDecimal(deliverForm.getAmount()).toString());
		replaceMap.put("amount", BigDecimalUtils.formatFourDecimal(deliverForm.getAmount()).toString());

		replaceMap.put("daRemark", deliverForm.getDaRemark() != null ? deliverForm.getDaRemark() : "");

		// 退货单
		if (FormType.DR.toString().equals(deliverForm.getFormType())) {

			// 退货机构
			replaceMap.put("_退货机构", deliverForm.getSourceBranchName() != null ? deliverForm.getSourceBranchName() : "");
			replaceMap.put("sourceBranchName",
					deliverForm.getSourceBranchName() != null ? deliverForm.getSourceBranchName() : "");

			// 收货机构
			replaceMap.put("_收货机构", deliverForm.getTargetBranchName() != null ? deliverForm.getTargetBranchName() : "");
			replaceMap.put("targetBranchName",
					deliverForm.getTargetBranchName() != null ? deliverForm.getTargetBranchName() : "");

			// 备注
			replaceMap.put("_备注", deliverForm.getRemark() != null ? deliverForm.getRemark() : "");
			replaceMap.put("reamrk", deliverForm.getRemark() != null ? deliverForm.getRemark() : "");

		}
		cleanDataMap(getPriceAccess(), replaceMap);
		return replaceMap;
	}

	private Map<String, String> getPriceAccess() {
		Map<String, String> map = new HashMap<String, String>();
		map.put(PriceConstant.DISTRIBUTION_PRICE, "_人民币总金额大写,amountCN,_总金额,amount,_合计金额"); // 配送价
		return map;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintDetail(java.lang.String)
	 */
	@Override
	protected List<DeliverFormList> getPrintDetail(String formNo) {
		List<DeliverFormList> dfList = queryDeliverFormListServiceApi.getDeliverListById(formNo);
		// 过滤数据权限字段
		cleanAccessData(dfList);
		return dfList;
	}

	// end by lijy02

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintDetail(java.util.List, java.util.Map)
	 */
	@Override
	protected void getPrintDetail(List<DeliverFormList> list, Map<String, Object> params) {
		BigDecimal largeNum = BigDecimal.ZERO;
		BigDecimal dealNum = BigDecimal.ZERO;
		for (DeliverFormList deliverFormList : list) {
			largeNum = largeNum.add(deliverFormList.getLargeNum());
			dealNum = dealNum.add(deliverFormList.getDealNum());
		}
		params.put("largeNum", largeNum);
		params.put("dealNum", dealNum);
	}

	/**
	 * @Description: 要货单导入功能
	 * @param file
	 * @param type 0货号、1条码
	 * @param targetBranchId
	 * @param sourceBranchId
	 * @return
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String type, String targetBranchId,
			String sourceBranchId, String formType) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}
			if (StringUtils.isEmpty(type)) {
				return RespJson.error("导入类型为空");
			}
			SysUser user = UserUtil.getCurrentUser();
			// 文件流
			InputStream is = file.getInputStream();
			// 文件流
			InputStream tempIs = file.getInputStream();
			// 获取文件名
			String fileName = file.getOriginalFilename();
			// 获取标题
			List<String> firstColumn = ExcelReaderUtil.readXlsxTitle(tempIs);

			String[] fields = null;
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
				if (firstColumn.indexOf(GoodsSelectImportHandle.LARGE_NUM) == 1) {
					fields = ImportExcelConstant.DELIVER_GOODS_SKUCODE_LARGE_NUM;
				} else {
					fields = ImportExcelConstant.DELIVER_GOODS_SKUCODE_NUM;
					type = GoodsSelectImportHandle.TYPE_SKU_CODE_NUM;
				}

			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
				if (firstColumn.indexOf(GoodsSelectImportHandle.LARGE_NUM) == 1) {
					fields = ImportExcelConstant.DELIVER_GOODS_BARCODE_LARGE_NUM;
				} else {
					fields = ImportExcelConstant.DELIVER_GOODS_BARCODE_NUM;
					type = GoodsSelectImportHandle.TYPE_BAR_CODE_NUM;
				}
			}
			Map<String, String> map = new HashMap<String, String>();
			map.put("targetBranchId", targetBranchId);
			map.put("sourceBranchId", sourceBranchId);
			map.put("formType", formType);
			final String finalType = type;
			GoodsSelectImportVo<GoodsSelectDeliver> vo = goodsSelectImportComponent.importSelectGoods(fileName, is,
					fields, new GoodsSelectDeliver(), sourceBranchId, user.getId(), type,
					"/form/deliverForm/downloadErrorFile", new GoodsSelectImportBusinessValid() {

						@Override
						public void formatter(List<? extends GoodsSelect> successData,
								List<JSONObject> excelListSuccessData, List<JSONObject> excelListErrorData) {
							if (firstColumn.indexOf(GoodsSelectImportHandle.LARGE_NUM) == 1) {
								for (GoodsSelect objGoods : successData) {
									GoodsSelectDeliver obj = (GoodsSelectDeliver) objGoods;
									if (!StringUtils.isEmpty(obj.getLargeNum()) && obj.getDistributionSpec() != null) {
										obj.setNum(new BigDecimal(obj.getLargeNum())
												.multiply(obj.getDistributionSpec()).toEngineeringString());
									}
								}
							} else {
								Map<String, String> map = new HashMap<String, String>();
								List<GoodsSelectDeliver> lists = new ArrayList<GoodsSelectDeliver>();
								for (int i = 0; i < successData.size(); i++) {
									GoodsSelectDeliver obj = (GoodsSelectDeliver) successData.get(i);
									if (checkNumAndDistributionSpec(obj, excelListErrorData, finalType, map)) {
										// 设置箱数
										obj.setLargeNum(new BigDecimal(obj.getNum()).divide(obj.getDistributionSpec(),
												4, RoundingMode.HALF_UP).toEngineeringString());
									} else {
										lists.add(obj);
									}
								}
								for (GoodsSelectDeliver obj : lists) {
									successData.remove(obj);
								}
								// 从新组织数据
								setSuccessData(map, excelListSuccessData, finalType);
							}
						}

						/**
						 * @Description: 从新组织数据
						 * @param map
						 * @param excelListSuccessData
						 * @param type
						 * @author zhangchm
						 * @date 2017年1月10日
						 */
						private void setSuccessData(Map<String, String> map, List<JSONObject> excelListSuccessData,
								String type) {
							for (JSONObject json : excelListSuccessData) {
								String temp = "";
								if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
									temp = json.getString("skuCode");
								} else {
									temp = json.getString("barCode");
								}
								if (map.get(temp) != null) {
									json.element("error", map.get(temp));
								}
							}
						}

						/**
						 * @Description: 验证数量是否是 箱数的整数倍
						 * @param obj
						 * @param excelListErrorData
						 * @param type 类型
						 * @param map
						 * @return boolean
						 * @author zhangchm
						 * @date 2017年1月10日
						 */
						private boolean checkNumAndDistributionSpec(GoodsSelectDeliver obj,
								List<JSONObject> excelListErrorData, String type, Map<String, String> map) {
							JSONObject json = null;
							BigDecimal checkNum = new BigDecimal(obj.getNum());
							try {
								BigDecimal realLargeNum = checkNum.divide(obj.getDistributionSpec(), 8,
										RoundingMode.HALF_UP);
								BigDecimal tempLargeNum = checkNum.divide(obj.getDistributionSpec(), 0,
										RoundingMode.HALF_UP);
								String formType = map.get("formType");
								// 只有要货或直送要货才校验数量，箱数整数倍
                                if (!FormTypeEnum.DA.toString().equals(formType)
                                        && !FormTypeEnum.DY.toString().equals(formType)) {
                                    return true;
                                }
								if (realLargeNum.compareTo(tempLargeNum) != 0) {
									json = new JSONObject();
									if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
										json.element("skuCode", obj.getSkuCode());
										map.put(obj.getSkuCode(), "该商品输入数量不是箱数的整数倍,规格 : " + obj.getDistributionSpec());
									} else {
										json.element("barCode", obj.getBarCode());
										map.put(obj.getBarCode(), "该商品输入数量不是箱数的整数倍,规格 : " + obj.getDistributionSpec());
									}
									json.element("num", checkNum);
									json.element("error", "该商品输入数量不是箱数的整数倍,规格 : " + obj.getDistributionSpec());
									excelListErrorData.add(json);
									return false;
								}
							} catch (NumberFormatException e) {
								json = new JSONObject();
								if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
									json.element("skuCode", obj.getSkuCode());
									map.put(obj.getSkuCode(), "输入的数量不是数字!");
								} else {
									json.element("barCode", obj.getBarCode());
									map.put(obj.getBarCode(), "输入的数量不是数字!");
								}
								json.element("num", checkNum);
								json.element("error", "输入的数量不是数字!");
								excelListErrorData.add(json);
								LOG.error("导入的箱数或数量不是数字", e);
								return false;
							}
							return true;
						}

						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {

						}

						@Override
						public void errorDataFormatter(List<JSONObject> list) {
							for (JSONObject json : list) {
								LOG.info(json.toString());
							}
						}

					}, map);
			respJson.put("importInfo", vo);
		} catch (BusinessException e) {
			respJson = RespJson.error(e.getMessage());
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("用户导入异常", e);
		}
		return respJson;

	}

	/**
	 * @Description: 错误信息下载
	 * @param code
	 * @param type
	 * @param response
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "downloadErrorFile")
	public void downloadErrorFile(String code, String type, HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = null;
		String[] columns = null;

		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
			// 货号
			columns = ImportExcelConstant.DELIVER_GOODS_SKUCODE_LARGE_NUM;
			headers = ImportExcelConstant.DELIVER_GOODS_SKUCODE_HEADERS_LARGE_NUM;
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
			// 条码
			columns = ImportExcelConstant.DELIVER_GOODS_BARCODE_LARGE_NUM;
			headers = ImportExcelConstant.DELIVER_GOODS_BARCODE_HEADERS_LARGE_NUM;
		} else if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
			// 货号
			columns = ImportExcelConstant.DELIVER_GOODS_SKUCODE_NUM;
			headers = ImportExcelConstant.DO_GOODS_SKUCODE_HEADERS_NUM;
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE_NUM)) {
			// 条码
			columns = ImportExcelConstant.DELIVER_GOODS_BARCODE_NUM;
			headers = ImportExcelConstant.DELIVER_GOODS_BARCODE_HEADERS_NUM;
		} else {
			LOG.warn("导入类型错误");
			return;
		}
		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * @Description: 配送要货导入模板
	 * @param response
	 * @param type
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, Integer type) {
		LOG.debug("导出配送要货导入模板请求参数,type:{}", type);
		try {
			String fileName = "";
			String templateName = "";
			if (Constant.ZERO == type) {
				// 商品货号
				templateName = ExportExcelConstant.DELIVER_GOODS_SKUCODE_TEMPLE;
				fileName = "要货申请单货号导入模板";
			} else if (Constant.ONE == type) {
				templateName = ExportExcelConstant.DELIVER_GOODS_BARCODE_TEMPLE;
				fileName = "要货申请单条码导入模板";
			}
			if (!StringUtils.isEmpty(fileName) && !StringUtils.isEmpty(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出要货申请单导入模板异常:{}", e);
		}
	}

	@RequestMapping(value = "exportTempDr")
	public void exportTempDr(HttpServletResponse response, Integer type) {
		LOG.debug("导出配送要货导入模板请求参数,type:{}", type);
		try {
			String fileName = "";
			String templateName = "";
			if (Constant.ZERO == type) {
				// 商品货号
				templateName = ExportExcelConstant.DELIVER_GOODS_SKUCODE_TEMPLE;
				fileName = "退货申请单货号导入模板";
			} else if (Constant.ONE == type) {
				templateName = ExportExcelConstant.DELIVER_GOODS_BARCODE_TEMPLE;
				fileName = "退货申请单条码导入模板";
			}
			if (!StringUtils.isEmpty(fileName) && !StringUtils.isEmpty(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出要货申请单导入模板异常", e);
		}
	}

	/**
	 * @Description: 直送要货导入模板
	 * @param response
	 * @param type
	 * @author xuyq
	 * @date 2017年4月19日
	 */
	@RequestMapping(value = "exportDyTemp")
	public void exportDyTemp(HttpServletResponse response, Integer type) {
		LOG.debug("导出直送要货导入模板请求参数,type:{}", type);
		try {
			String fileName = "";
			String templateName = "";
			if (Constant.ZERO == type) {
				// 商品货号
				templateName = ExportExcelConstant.DELIVER_GOODS_SKUCODE_TEMPLE;
				fileName = "直送要货申请单货号导入模板";
			} else if (Constant.ONE == type) {
				templateName = ExportExcelConstant.DELIVER_GOODS_BARCODE_TEMPLE;
				fileName = "直送要货申请单条码导入模板";
			}
			if (!StringUtils.isEmpty(fileName) && !StringUtils.isEmpty(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出直送要货申请单导入模板异常:{}", e);
		}
	}

	/**
	 * @Description: 配送出库导入模板
	 * @param response
	 * @param type
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "exportReport")
	public void exportReport(HttpServletResponse response, Integer type) {
		LOG.debug("导出配送出库导入模板请求参数,type:{}", type);
		try {
			String fileName = "";
			String templateName = "";
			if (Constant.ZERO == type) {
				// 商品货号
				templateName = ExportExcelConstant.DELIVER_GOODS_SKUCODE_REPORT;
				fileName = "配送出库单货号导入模板";
			} else if (Constant.ONE == type) {
				templateName = ExportExcelConstant.DELIVER_GOODS_BARCODE_REPORT;
				fileName = "配送出库单条码导入模板";
			}
			if (!StringUtils.isEmpty(fileName) && !StringUtils.isEmpty(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出配送出库单导入模板异常:{}", e);
		}
	}

	/**
	 * @Description: 出库单导入功能
	 * @param file
	 * @param type 0货号、1条码
	 * @param branchId
	 * @return
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "reportList")
	@ResponseBody
	public RespJson reportList(@RequestParam("file") MultipartFile file, String type, String sourceBranchId,
			String targetBranchId, String formType) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}
			if (StringUtils.isEmpty(type)) {
				return RespJson.error("导入类型为空");
			}
			SysUser user = UserUtil.getCurrentUser();
			// 文件流
			InputStream is = file.getInputStream();
			InputStream tempIs = file.getInputStream();

			// 获取文件名
			String fileName = file.getOriginalFilename();

			// 获取标题
			List<String> firstColumn = ExcelReaderUtil.readXlsxTitle(tempIs);

			String[] fields = null;

			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
				if (firstColumn.indexOf(GoodsSelectImportHandle.LARGE_NUM) == 1) {
					fields = ImportExcelConstant.DO_GOODS_SKUCODE_COLUMNS_LARGENUM;
				} else {
					fields = ImportExcelConstant.DO_GOODS_SKUCODE_COLUMNS_NUM;
					type = GoodsSelectImportHandle.TYPE_SKU_CODE_NUM;
				}

			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
				if (firstColumn.indexOf(GoodsSelectImportHandle.LARGE_NUM) == 1) {
					fields = ImportExcelConstant.DO_GOODS_BARCODE_COLUMNS_LARGENUM;
				} else {
					fields = ImportExcelConstant.DO_GOODS_BARCODE_COLUMNS_NUM;
					type = GoodsSelectImportHandle.TYPE_BAR_CODE_NUM;
				}
			}
			Map<String, String> map = new HashMap<String, String>();
			map.put("targetBranchId", targetBranchId);
			map.put("sourceBranchId", sourceBranchId);
			map.put("formType", formType);
			final String finalType = type;
			GoodsSelectImportVo<GoodsSelectDeliver> vo = goodsSelectImportComponent.importSelectGoods(fileName, is,
					fields, new GoodsSelectDeliver(), sourceBranchId, user.getId(), type,
					"/form/deliverForm/downloadError", new GoodsSelectImportBusinessValid() {

						@Override
						public void formatter(List<? extends GoodsSelect> successData,
								List<JSONObject> excelListSuccessData, List<JSONObject> excelListErrorData) {
							if (firstColumn.indexOf(GoodsSelectImportHandle.LARGE_NUM) == 1) {
								for (GoodsSelect objGoods : successData) {
									GoodsSelectDeliver obj = (GoodsSelectDeliver) objGoods;
									if (!StringUtils.isEmpty(obj.getLargeNum()) && obj.getDistributionSpec() != null) {
										obj.setNum(new BigDecimal(obj.getLargeNum())
												.multiply(obj.getDistributionSpec()).toEngineeringString());
									}
								}
							} else {
								Map<String, String> map = new HashMap<String, String>();
								List<GoodsSelectDeliver> lists = new ArrayList<GoodsSelectDeliver>();
								for (int i = 0; i < successData.size(); i++) {
									GoodsSelectDeliver obj = (GoodsSelectDeliver) successData.get(i);
									if (checkNumAndDistributionSpec(obj, excelListErrorData, finalType, map)) {
										// 设置箱数
										obj.setLargeNum(new BigDecimal(obj.getNum()).divide(obj.getDistributionSpec(),
												4, RoundingMode.HALF_UP).toEngineeringString());
									} else {
										lists.add(obj);
									}
								}
								for (GoodsSelectDeliver obj : lists) {
									successData.remove(obj);
								}
								// 从新组织数据
								setSuccessData(map, excelListSuccessData, finalType);
							}
						}

						private void setSuccessData(Map<String, String> map, List<JSONObject> excelListSuccessData,
								String type) {
							for (JSONObject json : excelListSuccessData) {
								String temp = "";
								if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
									temp = json.getString("skuCode");
								} else {
									temp = json.getString("barCode");
								}
								if (map.get(temp) != null) {
									json.element("error", map.get(temp));
								}
							}
						}

						private boolean checkNumAndDistributionSpec(GoodsSelectDeliver obj,
								List<JSONObject> excelListErrorData, String type, Map<String, String> map) {
							JSONObject json = null;
							BigDecimal checkNum = new BigDecimal(obj.getNum());
							String goodsTip = null;
							String goodsTipKey = null;
							try {
								BigDecimal realLargeNum = checkNum.divide(obj.getDistributionSpec(), 8,
										RoundingMode.HALF_UP);
								BigDecimal tempLargeNum = checkNum.divide(obj.getDistributionSpec(), 0,
										RoundingMode.HALF_UP);
								if (realLargeNum.compareTo(tempLargeNum) == 0) {
									return true;
								}
                                String formType = map.get("formType");
                                // 只有要货或直送要货才校验数量，箱数整数倍
                                if (!FormTypeEnum.DA.toString().equals(formType)
                                        && !FormTypeEnum.DY.toString().equals(formType)) {
                                    return true;
                                }
								json = new JSONObject();
								if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
									goodsTip = obj.getSkuCode();
									goodsTipKey = "skuCode";
								} else {
									goodsTip = obj.getBarCode();
									goodsTipKey = "barCode";
								}
								map.put(goodsTip, goodsTip + " 该商品输入数量不是箱数的整数倍,规格 : " + obj.getDistributionSpec());
								json.element(goodsTipKey, goodsTip);
								json.element("num", checkNum);
								json.element("error", goodsTip + "该商品输入数量不是箱数的整数倍,规格 : " + obj.getDistributionSpec());
								excelListErrorData.add(json);
								return false;
							} catch (NumberFormatException e) {
								json = new JSONObject();
								if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
									goodsTip = obj.getSkuCode();
									goodsTipKey = "skuCode";
								} else {
									goodsTip = obj.getBarCode();
									goodsTipKey = "barCode";
								}
								map.put(goodsTip, goodsTip + " 输入的数量不是数字!");
								json.element(goodsTipKey, goodsTip);
								json.element("num", checkNum);
								json.element("error", goodsTip + " 输入的数量不是数字!");
								excelListErrorData.add(json);
								LOG.error("导入的箱数或数量不是数字", e);
								return false;
							}
						}

						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {
							for (JSONObject obj : excelListSuccessData) {

								String numKey = null;
								if (obj.containsKey("largeNum")) {
									numKey = "largeNum";
								} else {
									numKey = "num";
								}
								String num = obj.getString(numKey);
								
								// 如果为空时，默认为0
								if(StringUtils.isBlank(num)){
									num = "0";
									obj.element(numKey, 0);
								}else{
									try {
										Double.parseDouble(num);
									} catch (Exception e) {
//										obj.element(numKey, 0);
										obj.element("error", "箱数/数量 填写有误");
									}
								}
								
								try {
									String isGift = obj.getString("isGift");
									if ("是".equals(isGift)) {// 如果是赠品，单价设置为0
										obj.element("isGift", "1");
										obj.element("price", 0);
									} else if ("否".equals(isGift)) {
										obj.element("isGift", "0");
									} else {
										obj.element("isGift", "0"); //赠品默认为否
									}
								} catch (Exception e) {
									obj.element("error", "是否赠品字段填写有误");
								}
							}
						}

						@Override
						public void errorDataFormatter(List<JSONObject> list) {
							for (JSONObject obj : list) {
								if (obj.containsKey("isGift")) {
									String isGift = obj.getString("isGift");
									if ("1".equals(isGift)) {
										obj.element("isGift", "是");
									} else if ("0".equals(isGift)) {
										obj.element("isGift", "否");
									}
								}
							}
						}
					}, map);
			respJson.put("importInfo", vo);
		} catch (BusinessException e) {
			respJson = RespJson.error(e.getMessage());
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("用户导入异常", e);
		}
		return respJson;
	}

	/**
	 * @Description: 错误信息下载
	 * @param code
	 * @param type
	 * @param response
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "downloadError")
	public void downloadError(String code, String type, HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = null;
		String[] columns = null;

		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) { // 货号
			
			columns = ImportExcelConstant.DO_GOODS_SKUCODE_COLUMNS_LARGENUM;
			headers = ImportExcelConstant.DO_GOODS_SKUCODE_HEADERS_LARGENUM;
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
			// 条码
			columns = ImportExcelConstant.DO_GOODS_BARCODE_COLUMNS_LARGENUM;
			headers = ImportExcelConstant.DO_GOODS_BARCODE_HEADERS_LARGENUM;
		} else if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {
			// 货号
			columns = ImportExcelConstant.DO_GOODS_SKUCODE_COLUMNS_NUM;
			headers = ImportExcelConstant.DO_GOODS_SKUCODE_HEADERS_NUM;
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE_NUM)) {
			// 条码
			columns = ImportExcelConstant.DO_GOODS_BARCODE_COLUMNS_NUM;
			headers = ImportExcelConstant.DO_GOODS_BARCODE_HEADERS_NUM;
		} else {
			LOG.warn("导入类型错误");
			return;
		}
		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * @Description: 查询发货机构信息,要货机构信息，单据信息
	 * @param referenceId  
	 * @return
	 * @author zhangchm
	 * @date 2016年9月18日
	 */
	@RequestMapping(value = "getSourceBranchAndTargetBranchAndFormNo", method = RequestMethod.POST)
	@ResponseBody
	public RespJson getSourceBranchAndTargetBranchAndFormNo(String referenceId) {
		RespJson respJson = RespJson.success();
		try {
			Map<String, String> map = queryDeliverFormServiceApi.getSourceBranchAndTargetBranchAndFormNo(referenceId);
			respJson.put("data", map);
		} catch (Exception e) {
			respJson = RespJson.error();
			LOG.error("查询发货机构信息,要货机构信息，单据信息异常:{}", e);
		}
		return respJson;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getBranchSpecService()
	 */
	@Override
	protected BranchSpecServiceApi getBranchSpecService() {
		return branchSpecServiceApi;
	}

	/**
	 * @Description: 查询当天已审核的要货单数量
	 * @param sourceBranchId 发货机构id
	 * @param targetBranchId 要货机构id
	 * @return
	 * @author zhengwj
	 * @date 2017年8月2日
	 */
	@RequestMapping(value = "getTodayCheckDaCount", method = RequestMethod.POST)
	@ResponseBody
	public RespJson getTodayCheckDaCount(String sourceBranchId, String targetBranchId) {
		RespJson resp = RespJson.success();
		try {
			Integer count = deliverFormServiceApi.getTodayCheckDaCount(sourceBranchId, targetBranchId);
			resp.put("count", count);
		} catch (Exception e) {
			LOG.error("查询当天已审核的要货单数量异常:{}", e);
			resp = RespJson.error("查询当天已审核的要货单数量异常");
		}
		return resp;
	}

	/**
	 * @Description: 订单拒收
	 * @param doIds 批量拒收订单ID
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2017年9月4日
	 */
	@RequestMapping(value = "refuseDeliverForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson refuseDeliverForm(@RequestBody String[] ids) {
		RespJson resp = RespJson.success();
		try {
			if (ids == null || ids.length == 0) {
				return RespJson.error("请选择单据再操作！");
			}
			resp = deliverFormServiceApi.refuseDeliverForm(ids, getCurrUserId());
		} catch (Exception e) {
			LOG.error("拒收操作失败", e);
			resp = RespJson.error("拒收操作失败");
		}
		return resp;
	}
}
