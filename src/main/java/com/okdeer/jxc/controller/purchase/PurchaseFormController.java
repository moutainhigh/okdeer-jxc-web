/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年8月1日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.purchase;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.rpc.RpcException;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.branch.vo.BranchSpecVo;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.enums.SaleWayEnum;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.*;
import com.okdeer.jxc.form.entity.PurchaseForm;
import com.okdeer.jxc.form.entity.PurchaseFormDetail;
import com.okdeer.jxc.form.enums.FormDealStatus;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.form.purchase.qo.FormQueryQo;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormDetailPO;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormPO;
import com.okdeer.jxc.form.purchase.service.PurchaseActivityService;
import com.okdeer.jxc.form.purchase.service.PurchaseCostFormService;
import com.okdeer.jxc.form.purchase.service.PurchaseFormServiceApi;
import com.okdeer.jxc.form.purchase.vo.*;
import com.okdeer.jxc.goods.entity.GoodsBranchPriceVo;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByPurchase;
import com.okdeer.jxc.goods.qo.GoodsBranchPriceQo;
import com.okdeer.jxc.goods.service.GoodsBranchPriceServiceApi;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.price.PriceConstant;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;

/**
 * ClassName: PurchaseFormController 
 * @author xiaoj02
 * @date 2016年8月1日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *		重构2.0			2016-8-5			xiaoj02			 采购controller
 *		零售系统V1.20	2016-11-4			lijy02			采购审核部分审核后回写字段
 */
@Controller
@RequestMapping("form/purchase")
public class PurchaseFormController extends BasePrintController<PurchaseForm, PurchaseFormDetailPO> {

	@Reference(version = "1.0.0", check = false)
	private PurchaseFormServiceApi purchaseFormServiceApi;

	@Reference(version = "1.0.0", check = false)
	private GoodsBranchPriceServiceApi goodsBranchPriceService;

	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	@Autowired
	private OrderNoUtils orderNoUtils;

	@Reference(version = "1.0.0", check = false)
	BranchesServiceApi branchesServiceApi;

	@Reference(version = "1.0.0", check = false)
	private PurchaseActivityService purchaseActivityService;

    @Reference(version = "1.0.0", check = false)
    private PurchaseCostFormService purchaseCostFormService;

	/**
	 * 机构设置Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private BranchSpecServiceApi branchSpecServiceApi;

	/**
	 * 跳转到新增采购单页面
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月12日
	 */
	@RequestMapping(value = "orderAdd")
	public String viewAdd(HttpServletRequest request) {
		if (!UserUtil.getCurrBranchType().equals(BranchTypeEnum.HEAD_QUARTERS.getCode())) {
			// 查询是否需要自动加载商品
			BranchSpecVo vo = branchSpecServiceApi.queryByBranchId(UserUtil.getCurrBranchId());
			if (null != vo) {
				request.setAttribute("cascadeGoods", vo.getIsSupplierCascadeGoodsPa());
			}
		}
		return "form/purchase/orderAdd";
	}

	/**
	 * 跳转到新增收货单页面
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月12日
	 */
	@RequestMapping(value = "receiptAdd")
	public String viewAddReceiving() {
		return "form/purchase/receiptAdd";
	}

	/**
	 * @Description: 新增页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhongy
	 * @date 2016年12月17日
	 */
	@RequestMapping(value = "addReceiptForm")
	public String addDeliverForm(PurchaseFormPO vo, Model model) {
		LOG.debug(LogConstant.OUT_PARAM, vo.toString());
		String formId = vo.getId();
		PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formId);
		cleanAccessData(form);
		model.addAttribute("form", form);
		return "form/purchase/receiptAdd";
	}

	/**
	 * 跳转到新增退货单页面
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月12日
	 */
	@RequestMapping(value = "returnAdd")
	public String viewAddReturn(HttpServletRequest request) {
		if (!UserUtil.getCurrBranchType().equals(BranchTypeEnum.HEAD_QUARTERS.getCode())) {
			// 查询是否需要自动加载商品
			BranchSpecVo vo = branchSpecServiceApi.queryByBranchId(UserUtil.getCurrBranchId());
			if (null != vo) {
				request.setAttribute("cascadeGoods", vo.getIsSupplierCascadeGoodsPr());
			}
		}
		return "form/purchase/returnAdd";
	}

	/**
	 * 收货单列表数据
	 * @param qo
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "receiptListData", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseFormPO> receiptListData(FormQueryQo qo) {
		try {
			if (qo.getEndTime() != null) {
				// 结束日期加一天
				Calendar cal = Calendar.getInstance();
				cal.setTime(qo.getEndTime());
				cal.add(Calendar.DATE, 1);
				qo.setEndTime(cal.getTime());
			}
			// 采购单
			qo.setFormType(FormType.PI.toString());
			qo.setBranchCompleCode(getCurrBranchCompleCode());

			// 处理供应商
			String supplierName = qo.getSupplierName();
			if (StringUtils.isNotBlank(supplierName)) {
				supplierName = supplierName.substring(supplierName.lastIndexOf("]") + 1, supplierName.length());
				qo.setSupplierName(supplierName);
			}

			// 处理机构
			String branchName = qo.getBranchName();
			if (StringUtils.isNotBlank(branchName)) {
				branchName = branchName.substring(branchName.lastIndexOf("]") + 1, branchName.length());
				qo.setBranchName(branchName);
			}

			// 收货单价格权限不过滤总金额
			PageUtils<PurchaseFormPO> page = purchaseFormServiceApi.selectPage(qo);
			return page;
		} catch (Exception e) {
			LOG.error("获取采购收货列表数据异常：", e);
		}
		return PageUtils.emptyPage();
		
	}

	@RequestMapping(value = "returnListData", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseFormPO> returnListData(FormQueryQo qo) {
		try {
			if (qo.getEndTime() != null) {
				// 结束日期加一天
				Calendar cal = Calendar.getInstance();
				cal.setTime(qo.getEndTime());
				cal.add(Calendar.DATE, 1);
				qo.setEndTime(cal.getTime());
			}
			// 采购单
			qo.setFormType(FormType.PR.name());
			qo.setBranchCompleCode(getCurrBranchCompleCode());

			// 处理供应商
			String supplierName = qo.getSupplierName();
			if (StringUtils.isNotBlank(supplierName)) {
				supplierName = supplierName.substring(supplierName.lastIndexOf("]") + 1, supplierName.length());
				qo.setSupplierName(supplierName);
			}

			// 处理机构
			String branchName = qo.getBranchName();
			if (StringUtils.isNotBlank(branchName)) {
				branchName = branchName.substring(branchName.lastIndexOf("]") + 1, branchName.length());
				qo.setBranchName(branchName);
			}

			PageUtils<PurchaseFormPO> page = purchaseFormServiceApi.selectPage(qo);
			cleanAccessData(page);
			return page;
		} catch (Exception e) {
			LOG.error("获取采购退货列表数据异常：", e);
		}
		return PageUtils.emptyPage();
		
	}

	/**
	 * 跳转到修改页面
	 * @param formId
	 * @param model
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月12日
	 */
	@RequestMapping(value = "orderEdit")
	public String orderEdit(String formId, String report, HttpServletRequest request) {
		try {
			PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formId);

			if (form == null) {
				String errorMsg = String.format("采购订单不存在或已删除！单据Id：%s", formId);
				LOG.error(errorMsg);
				request.setAttribute(ERROR_MSG, errorMsg);
				return PAGE_500;
			}

			// 如果已删除
			if (Disabled.INVALID.ordinal() == form.getDisabled().intValue()) {
				String errorMsg = String.format("采购订单已删除！单据Id：%s", formId);
				LOG.error(errorMsg);
				request.setAttribute(ERROR_MSG, errorMsg);
				return PAGE_500;
			}

			request.setAttribute("form", form);
			if (FormStatus.CHECK_SUCCESS.getValue().equals(form.getStatus())) {// 已审核，不能修改
				if (FormStatus.CHECK_SUCCESS.getValue().equals(form.getStatus()) && form.getDealStatus() != null
						&& FormDealStatus.STOP.getValue().equals(form.getDealStatus())) {
					request.setAttribute("status", FormDealStatus.STOP.getLabel());
					request.setAttribute("close", report);
					return "form/purchase/orderView";
				} else {
					request.setAttribute("status", FormStatus.CHECK_SUCCESS.getLabel());
					request.setAttribute("close", report);
					return "form/purchase/orderView";
				}
			}

			if (FormDealStatus.FINISH.getValue().equals(form.getDealStatus())) {// 处理完成，不能修改
				request.setAttribute("status", FormDealStatus.FINISH.getLabel());
				return "form/purchase/orderView";
			}

			if (FormDealStatus.STOP.getValue().equals(form.getDealStatus())) {// 已终止，不能修改
				request.setAttribute("status", FormDealStatus.STOP.getLabel());
				return "form/purchase/orderView";
			}

			if (!UserUtil.getCurrBranchType().equals(BranchTypeEnum.HEAD_QUARTERS.getCode())) {
				// 查询是否需要自动加载商品
				BranchSpecVo vo = branchSpecServiceApi.queryByBranchId(UserUtil.getCurrBranchId());
				if (null != vo) {
					request.setAttribute("cascadeGoods", vo.getIsSupplierCascadeGoodsPa());
				}
			}
			return "form/purchase/orderEdit";
		} catch (Exception e) {
			LOG.error("跳转到采购订单修改页异常", e);
			request.setAttribute(ERROR_MSG, "系统错误！");
		}
		return PAGE_500;

	}

	/**
	 * 跳转到退货单修改界面
	 * @param formId
	 * @param request
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "returnEdit")
	public String returnEdit(String formId, String report, HttpServletRequest request) {
		try {
			PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formId);
			if (form == null) {
				LOG.error("采购订单数据为空：订单Id：{}", formId);
				return "/error/500";
			}

			// 如果已删除
			if (Disabled.INVALID.ordinal() == form.getDisabled().intValue()) {
				LOG.error("采购订已删除：订单Id：{}", formId);
				return "/error/500";
			}

			request.setAttribute("form", form);
			if (FormStatus.CHECK_SUCCESS.getValue().equals(form.getStatus())) {// 已审核，不能修改
				request.setAttribute("status", FormStatus.CHECK_SUCCESS.getLabel());
				request.setAttribute("close", report);
				return "form/purchase/returnView";
			}

			if (FormDealStatus.FINISH.getValue().equals(form.getDealStatus())) {// 处理完成，不能修改
				request.setAttribute("status", FormDealStatus.FINISH.getLabel());
				return "form/purchase/returnView";
			}

			if (FormDealStatus.STOP.getValue().equals(form.getDealStatus())) {// 已终止，不能修改
				request.setAttribute("status", FormDealStatus.STOP.getLabel());
				return "form/purchase/returnView";
			}

			if (!UserUtil.getCurrBranchType().equals(BranchTypeEnum.HEAD_QUARTERS.getCode())) {
				// 查询是否需要自动加载商品
				BranchSpecVo vo = branchSpecServiceApi.queryByBranchId(UserUtil.getCurrBranchId());
				if (null != vo) {
					request.setAttribute("cascadeGoods", vo.getIsSupplierCascadeGoodsPr());
				}
			}
			return "form/purchase/returnEdit";
		} catch (Exception e) {
			LOG.error("跳转到采购退货修改页异常", e);
			request.setAttribute(ERROR_MSG, "系统错误！");
		}
		return PAGE_500;

	}

    @RequestMapping(value = "ref/count")
    public @ResponseBody
    RespJson refCount(String formNo) {
        int count = purchaseCostFormService.countPurchaseCostFormByRefFormNo(formNo);
        if (count == 0) {
            return RespJson.success();
        }
        return RespJson.error();
    }

    /**
     * 跳转到收货单修改页面
     *
     * @param formId
     * @param model
     * @return
     * @author xiaoj02
     * @date 2016年8月12日
     */
    @RequestMapping(value = "receiptEdit")
    public String receiptEdit(String formId, String report, HttpServletRequest request, String formType) {
        try {
            PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formId);

			if (form == null) {
				LOG.error("采购订单数据为空：订单Id：{}", formId);
				return "/error/500";
			}

			// 如果已删除
			if (Disabled.INVALID.ordinal() == form.getDisabled().intValue()) {
				LOG.error("采购订已删除：订单Id：{}", formId);
				return "/error/500";
            }

            //if (StringUtils.equalsIgnoreCase("FP", formType)) {
            int count = purchaseCostFormService.countPurchaseCostFormByRefFormNo(form.getFormNo());
            if (count > 0) {
                request.setAttribute("bool", Boolean.TRUE);
            }
            //}
            request.setAttribute("form", form);
            if (FormStatus.CHECK_SUCCESS.getValue().equals(form.getStatus())) {// 已审核，不能修改
                request.setAttribute("status", FormStatus.CHECK_SUCCESS.getLabel());
                request.setAttribute("close", report);
                return "form/purchase/receiptView";
            }

			if (FormDealStatus.FINISH.getValue().equals(form.getDealStatus())) {// 处理完成，不能修改
				request.setAttribute("status", FormDealStatus.FINISH.getLabel());
				return "form/purchase/receiptView";
			}

			if (FormDealStatus.STOP.getValue().equals(form.getDealStatus())) {// 已终止，不能修改
				request.setAttribute("status", FormDealStatus.STOP.getLabel());
				return "form/purchase/receiptView";
			}

			return "form/purchase/receiptEdit";
		} catch (Exception e) {
			LOG.error("跳转到采购收货修改页异常", e);
			request.setAttribute(ERROR_MSG, "系统错误！");
		}
		return PAGE_500;
		
	}

	/**
	 * 跳转到退货单界面
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "returnList")
	public String viewReturnList() {
		return "form/purchase/returnList";
	}

	/**
	 * 跳转到收货单列表
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月15日
	 */
	@RequestMapping(value = "receiptList")
	public String viewReceiptList() {
		return "form/purchase/receiptList";
	}

	/**
	 * 跳转到采购单列表
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月15日
	 */
	@RequestMapping(value = "orderList")
	public String viewList() {
		return "form/purchase/orderList";
	}

	/**
	 * 根据id，查询单据
	 * @param formId
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "get", method = RequestMethod.POST)
	@ResponseBody
	public RespJson get(String formId) {
		try {
			PurchaseForm form = purchaseFormServiceApi.get(formId);
			if (form == null) {
				return RespJson.error("无法通过此id查询到数据，数据可能已被删除");
			}
			RespJson resp = RespJson.success();
			cleanAccessData(form);
			resp.put("obj", form);
			return resp;
		} catch (Exception e) {
			LOG.error("获取单据详情异常：", e);
		}
		return RespJson.error();
	}

	/**
	 * 删除
	 * @param formId
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	@ResponseBody
	public RespJson delete(String formIds) {
		try {
			SysUser user = UserUtil.getCurrentUser();
			RespJson resp = new RespJson();
			if (StringUtils.isNotBlank(formIds)) {
				String[] arr = formIds.split(",");
				// for (int i = 0; i < arr.length; i++) {
				// resp = purchaseFormServiceApi.delete(arr[i], user.getId());
				// }
				try {
					resp = purchaseFormServiceApi.deleteByIds(Arrays.asList(arr), user.getId());
				} catch (BusinessException e) {
					return RespJson.posBusinessError(e.getMessage());
				}
			}
			return resp;
		} catch (Exception e) {
			LOG.error("删除采购订单异常：", e);
		}
		return RespJson.error();
	}

	/**
	 * 获取单据列表json
	 * @param qo 通用查询对象
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "listData", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseFormPO> listData(FormQueryQo qo) {
		try {
			if (qo.getEndTime() != null) {
				// 结束日期加一天
				Calendar cal = Calendar.getInstance();
				cal.setTime(qo.getEndTime());
				cal.add(Calendar.DATE, 1);
				qo.setEndTime(cal.getTime());
			}
			// 采购单
			qo.setFormType(FormType.PA.toString());
			String supplierName = qo.getSupplierName();
			if (StringUtils.isNotBlank(supplierName)) {
				supplierName = supplierName.substring(supplierName.lastIndexOf("]") + 1, supplierName.length());
				qo.setSupplierName(supplierName);
			}
			qo.setBranchCompleCode(getCurrBranchCompleCode());
			PageUtils<PurchaseFormPO> page = purchaseFormServiceApi.selectPage(qo);
			cleanAccessData(page);
			return page;
		} catch (Exception e) {
			LOG.error("获取单据列表异常：", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * 查询商品详情
	 * @param formId
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月5日
	 */
	@RequestMapping(value = "detailList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseFormDetailPO> getDetailJson(String formId) {
		try {
			PageUtils<PurchaseFormDetailPO> list = purchaseFormServiceApi.selectDetail(formId);
			return list;
		} catch (Exception e) {
			LOG.error("查询采购单据商品详情异常：", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 根据机构配置，获取采购订单详情信息
	 * @param formId
	 * @return
	 * @author liwb
	 * @date 2017年8月18日
	 */
	@RequestMapping(value = "getDetailListById", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseFormDetailPO> getDetailListById(String formId) {
		try {
			PurchaseForm form = purchaseFormServiceApi.get(formId);
			List<PurchaseFormDetailPO> list = null;
            if (form != null && FormType.PA.equals(form.getFormType())) {
				String branchId = form.getBranchId();
				Branches branch = branchesServiceApi.getBranchInfoById(branchId);

				// 取分公司数据
				if (branch.getType() > 1) {
					branchId = branch.getParentId();
				}

				BranchSpecVo branchSpec = branchSpecServiceApi.queryByBranchId(branchId);
				// 允许采购收货取采购订单价格：0.否，1.是
				if (branchSpec.getIsAllowPiGetPaPrice().intValue() == 0) {
					list = purchaseFormServiceApi.getDetailAndPriceById(formId);
				} else {
					list = purchaseFormServiceApi.selectDetailById(formId);
				}
			} else {
				list = purchaseFormServiceApi.selectDetailById(formId);
			}

			PageUtils<PurchaseFormDetailPO> page = new PageUtils<PurchaseFormDetailPO>(list);

			return page;
		} catch (Exception e) {
			LOG.error("获取采购订单详情出错：", e);
		}

		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "valid/activity/price", method = RequestMethod.POST)
	@ResponseBody
	public RespJson validActivityPrice(@RequestBody String jsonText) {
		PurchaseFormVo formVo = JSON.parseObject(jsonText, PurchaseFormVo.class);

		// 验证
		List<String> skuIds = new ArrayList<String>();
		List<PurchaseFormDetailVo> detailList = formVo.getDetailList();
		for (PurchaseFormDetailVo detailVo : detailList) {
			skuIds.add(detailVo.getSkuId());
		}

		//查询促销商品价格
        List<PurchaseActivityDetailVo> purchaseActivityDetailVos = purchaseActivityService.getNewPurPriceBySkuIds(skuIds, formVo.getSupplierId());
        boolean bool = false;
		StringBuilder message = new StringBuilder();
		int count = 1;
		if (CollectionUtils.isNotEmpty(purchaseActivityDetailVos)) {
			for (PurchaseActivityDetailVo purchaseActivityDetailVo : purchaseActivityDetailVos) {
				for (int i = 0, length = detailList.size(); i < length; ++i) {
					if (StringUtils.equals(purchaseActivityDetailVo.getSkuId(), detailList.get(i).getSkuId())
							&& !purchaseActivityDetailVo.getNewPurPrice().equals(detailList.get(i).getPrice())) {
						++count;
						if (count <= 3) {
							bool = true;
							message.append("'").append(detailList.get(i).getSkuName()).append("'、");
						}
					}
				}
			}
		}
		if (bool) {
			message.deleteCharAt(message.length() - 1);
			if (count > 3) {
				message.append("等").append(count).append("种");
			}
			message.append("商品价格已产生变动，是否按当前单据价格继续保存？");
			return RespJson.error(message.toString());
		}
		return RespJson.success();
	}

	/**
	 * 保存单据和单据商品详情
	 * @param validate
	 * @param form
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "saveOrder", method = RequestMethod.POST)
	@ResponseBody
	public RespJson save(@RequestBody String jsonText) {
		try {
			StopWatch sw = new StopWatch();
			PurchaseFormVo formVo = JSON.parseObject(jsonText, PurchaseFormVo.class);

			// 验证
			List<String> skuIds = new ArrayList<String>();
			List<PurchaseFormDetailVo> detailList = formVo.getDetailList();
			for (PurchaseFormDetailVo detailVo : detailList) {
				skuIds.add(detailVo.getSkuId());
			}
			sw.start("保存采购订单校验商品");
			RespJson resp = saveValid(skuIds, formVo.getBranchId());
			sw.stop();
			if (!resp.isSuccess()) {
				return resp;
			}

			PurchaseForm form = new PurchaseForm();

			BeanUtils.copyProperties(formVo, form);

			String formId = UUIDHexGenerator.generate();

			SysUser user = UserUtil.getCurrentUser();

			String formNo = orderNoUtils.getOrderNo(FormType.PA.name() + user.getBranchCode());

			Date now = new Date();

			form.setId(formId);
			form.setFormType(FormType.PA);
			form.setFormNo(formNo);
			form.setIo(1);
			// 前端设置
			// branchId、supplierId、totalNum、amount、salesmanId、remark

			form.setCreaterBranchId(user.getBranchId());
			form.setStatus(FormStatus.WAIT_CHECK.getValue());
			form.setDealStatus(0);
			form.setDisabled(0);

			form.setCreateUserId(user.getId());
			form.setCreateTime(now);
			form.setUpdateUserId(user.getId());
			form.setUpdateTime(now);

			List<PurchaseFormDetail> list = new ArrayList<>();
			List<PurchaseFormDetailVo> listVo = formVo.getDetailList();

			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail formDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, formDetail);

                if (formDetail.checkPirce()) {
                    return RespJson.error("[" + formDetail.getSkuCode() + "]采购价格不能为0");
                }
				// 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把备份价格替换成价格值
				formDetail.setPriceBack(formDetail.getPrice());
				formDetail.setId(UUIDHexGenerator.generate());
				formDetail.setFormId(formId);
				formDetail.setCreateTime(now);
				formDetail.setCreateUserId(user.getId());
				formDetail.setUpdateTime(now);
				formDetail.setUpdateUserId(user.getId());
				formDetail.setDisabled(0);
				list.add(formDetail);
			}

			sw.start("保存采购订单");
			// 保存采购订单
			RespJson respJson = purchaseFormServiceApi.save(form, list);
			sw.stop();
			if (respJson.isSuccess()) {
				respJson.put("formId", formId);
			}
			LOG.debug(sw.prettyPrint());
			return respJson;
        } catch (RpcException e) {
            LOG.error("保存采购订单异常：", e);
            return RespJson.error("保存采购订单服务超时");
        } catch (Exception e) {
            LOG.error("保存采购订单异常：", e);
        }
        return RespJson.error("保存采购订单服务异常");
	}

	@RequestMapping(value = "saveReturn", method = RequestMethod.POST)
	@ResponseBody
	public RespJson saveReturn(@RequestBody String jsonText) {

		try {
			ReturnFormVo formVo = JSON.parseObject(jsonText, ReturnFormVo.class);

			PurchaseForm form = new PurchaseForm();
			BeanUtils.copyProperties(formVo, form);

			String formId = UUIDHexGenerator.generate();

			SysUser user = UserUtil.getCurrentUser();
			String formNo = orderNoUtils.getOrderNo(FormType.PR.name() + user.getBranchCode());

			Date now = new Date();

			form.setId(formId);
			form.setFormType(FormType.PR);
			form.setFormNo(formNo);
			form.setIo(1);
			// 前端设置
			// branchId、supplierId、totalNum、amount、salesmanId、remark

			form.setCreaterBranchId(user.getBranchId());
			form.setStatus(FormStatus.WAIT_CHECK.getValue());
			form.setDealStatus(0);
			form.setDisabled(0);

			form.setCreateUserId(user.getId());
			form.setCreateTime(now);
			form.setUpdateUserId(user.getId());
			form.setUpdateTime(now);

			String refFormNo = formVo.getRefFormNo();
			if (StringUtils.isNotBlank(refFormNo)) {// 设置引用单据类型
				form.setRefFormNoType(refFormNo.substring(0, 2));
			}

			List<PurchaseFormDetail> list = new ArrayList<>();
			List<PurchaseFormDetailVo> listVo = formVo.getDetailList();

			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail formDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, formDetail);

				if (formDetail.checkPirce()) {
                    return RespJson.error("[" + formDetail.getSkuCode() + "]采购价格不能为0");
                }
				// 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把备份价格替换成价格值
				formDetail.setPriceBack(formDetail.getPrice());
				formDetail.setId(UUIDHexGenerator.generate());
				formDetail.setFormId(formId);
				formDetail.setCreateTime(now);
				formDetail.setCreateUserId(user.getId());
				formDetail.setUpdateTime(now);
				formDetail.setUpdateUserId(user.getId());
				formDetail.setDisabled(0);
				list.add(formDetail);
			}

			// 保存采购订单
			RespJson respJson = purchaseFormServiceApi.save(form, list);
			if (respJson.isSuccess()) {
				respJson.put("formId", formId);
			}
			return respJson;
		} catch (Exception e) {
			LOG.error("保存采购退货异常：", e);
		}
		return RespJson.error("保存采购退货异常！");

	}

	@RequestMapping(value = "saveReceipt", method = RequestMethod.POST)
	@ResponseBody
	public RespJson saveReceipt(@RequestBody String jsonText) {

		try {
			ReceiptFormVo formVo = JSON.parseObject(jsonText, ReceiptFormVo.class);

			// 不是引用订单收货，需要验证
			if (StringUtils.isNotBlank(formVo.getRefFormNo())) {
				List<String> skuIds = new ArrayList<String>();
				List<PurchaseFormDetailVo> detailList = formVo.getDetailList();
				if (CollectionUtils.isNotEmpty(detailList)) {
					for (PurchaseFormDetailVo detailVo : detailList) {
						skuIds.add(detailVo.getSkuId());
					}
				}
				// RespJson resp = saveValid(skuIds,formVo.getBranchId());
				RespJson resp = validReceiptItem(skuIds, formVo.getRefFormId());
				if (!resp.isSuccess()) {
					return resp;
				}
			}

			PurchaseForm form = new PurchaseForm();
			BeanUtils.copyProperties(formVo, form);

			String formId = UUIDHexGenerator.generate();
			SysUser user = UserUtil.getCurrentUser();
			String formNo = orderNoUtils.getOrderNo(FormType.PI.name() + user.getBranchCode());

			Date now = new Date();

			form.setId(formId);
			form.setFormType(FormType.PI);
			form.setFormNo(formNo);
			form.setIo(1);
			// 前端设置
			// branchId、supplierId、totalNum、amount、salesmanId、remark

			form.setCreaterBranchId(user.getBranchId());
			form.setStatus(FormStatus.WAIT_CHECK.getValue());
			form.setDealStatus(0);
			form.setDisabled(0);

			form.setCreateUserId(user.getId());
			form.setCreateTime(now);
			form.setUpdateUserId(user.getId());
			form.setUpdateTime(now);

			List<PurchaseFormDetail> list = new ArrayList<PurchaseFormDetail>();
			List<PurchaseFormDetailVo> listVo = formVo.getDetailList();

			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail formDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, formDetail);

				if (formDetail.checkPirce()) {
                    return RespJson.error("[" + formDetail.getSkuCode() + "]采购价格不能为0");
                }
				// 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把备份价格替换成价格值
				formDetail.setPriceBack(formDetail.getPrice());
				formDetail.setId(UUIDHexGenerator.generate());
				formDetail.setFormId(formId);
				formDetail.setCreateTime(now);
				formDetail.setCreateUserId(user.getId());
				formDetail.setUpdateTime(now);
				formDetail.setUpdateUserId(user.getId());
				formDetail.setDisabled(0);
				list.add(formDetail);
			}

			// 保存采购订单
			RespJson respJson = purchaseFormServiceApi.save(form, list);
			if (respJson.isSuccess()) {
				respJson.put("formId", formId);
			}
			return respJson;
		} catch (Exception e) {
			LOG.error("保存采购收货异常：", e);
		}

		return RespJson.error("保存采购收货异常");
	}

	/**
	 * 修改单据
	 * @param validate
	 * @param form
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "updateOrder", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateOrder(@RequestBody String jsonText) {
		try {
			PurchaseFormVo formVo = JSON.parseObject(jsonText, PurchaseFormVo.class);
			// 验证
			List<String> skuIds = new ArrayList<String>();
			List<PurchaseFormDetailVo> detailList = formVo.getDetailList();
			for (PurchaseFormDetailVo detailVo : detailList) {
				skuIds.add(detailVo.getSkuId());
			}
			RespJson resp = saveValid(skuIds, formVo.getBranchId());
			if (!resp.isSuccess()) {
				return resp;
			}

			PurchaseForm form = new PurchaseForm();
			BeanUtils.copyProperties(formVo, form);

			List<PurchaseFormDetail> list = new ArrayList<PurchaseFormDetail>();

			String formId = form.getId();
			SysUser user = UserUtil.getCurrentUser();
			Date now = new Date();
			List<PurchaseFormDetailVo> listVo = formVo.getDetailList();

			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail formDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, formDetail);

				if (formDetail.checkPirce()) {
                    return RespJson.error("[" + formDetail.getSkuCode() + "]采购价格不能为0");
                }
				// 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把备份价格替换成价格值
				formDetail.setPriceBack(formDetail.getPrice());
				formDetail.setId(UUIDHexGenerator.generate());
				formDetail.setFormId(formId);
				formDetail.setCreateTime(now);
				formDetail.setCreateUserId(user.getId());
				formDetail.setUpdateTime(now);
				formDetail.setUpdateUserId(user.getId());
				formDetail.setDisabled(0);
				list.add(formDetail);
			}

			RespJson respJson = purchaseFormServiceApi.update(form, list);
			return respJson;
		} catch (Exception e) {
			LOG.error("修改采购订单异常：", e);
		}
		return RespJson.error("修改采购订单异常");
		
	}

	/**
	 * 修改单据
	 * @param validate
	 * @param form
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "updateReceipt", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateReceipt(@RequestBody String jsonText) {
		
		try {
			ReceiptFormVo formVo = JSON.parseObject(jsonText, ReceiptFormVo.class);

			// 不是引用订单收货，需要验证
			if (StringUtils.isNotBlank(formVo.getRefFormNo())) {
				List<String> skuIds = new ArrayList<String>();
				List<PurchaseFormDetailVo> detailList = formVo.getDetailList();
				if (CollectionUtils.isNotEmpty(detailList)) {
					for (PurchaseFormDetailVo detailVo : detailList) {
						skuIds.add(detailVo.getSkuId());
					}
				}
				// RespJson resp = saveValid(skuIds,formVo.getBranchId());
				RespJson resp = validReceiptItem(skuIds, formVo.getRefFormId());
				if (!resp.isSuccess()) {
					return resp;
				}
			}

			PurchaseForm form = new PurchaseForm();
			BeanUtils.copyProperties(formVo, form);

			List<PurchaseFormDetail> list = new ArrayList<PurchaseFormDetail>();

			String formId = form.getId();
			SysUser user = UserUtil.getCurrentUser();
			Date now = new Date();
			List<PurchaseFormDetailVo> listVo = formVo.getDetailList();

			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail purchaseFormDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, purchaseFormDetail);
				
				if (purchaseFormDetail.checkPirce()) {
                    return RespJson.error("[" + purchaseFormDetail.getSkuCode() + "]采购价格不能为0");
                }
				// 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把备份价格替换成价格值
				purchaseFormDetail.setPriceBack(purchaseFormDetail.getPrice());
				purchaseFormDetail.setId(UUIDHexGenerator.generate());
				purchaseFormDetail.setFormId(formId);
				purchaseFormDetail.setCreateTime(now);
				purchaseFormDetail.setCreateUserId(user.getId());
				purchaseFormDetail.setUpdateTime(now);
				purchaseFormDetail.setUpdateUserId(user.getId());
				purchaseFormDetail.setDisabled(0);

				list.add(purchaseFormDetail);
			}

			RespJson respJson = purchaseFormServiceApi.update(form, list);
			return respJson;
		} catch (Exception e) {
			LOG.error("修改采购收货异常：", e);
		}
		return RespJson.error();

		
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
	public RespJson validReceiptItem(List<String> skuIds, String formId) {
		List<PurchaseFormDetailPO> list = purchaseFormServiceApi.selectDetailById(formId);
		if ((CollectionUtils.isNotEmpty(skuIds) && CollectionUtils.isNotEmpty(list) && skuIds.size() > list.size())
				|| CollectionUtils.isEmpty(list)) {
			return RespJson.error("已选采购单号，不允许添加其他商品");
		}
		Map<String, PurchaseFormDetailPO> tempMap = new HashMap<String, PurchaseFormDetailPO>();
		for (PurchaseFormDetailPO pdPo : list) {
			tempMap.put(pdPo.getSkuId(), pdPo);
		}
		for (String skuId : skuIds) {
			PurchaseFormDetailPO pdPo = tempMap.get(skuId);
			if (pdPo == null) {
				return RespJson.error("已选采购单号，不允许添加其他商品");
			}
		}
		return RespJson.success();
	}

	/**
	 * 修改单据
	 * @param validate
	 * @param form
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "updateReturn", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateReturn(@RequestBody String jsonText) {
		try {
			ReturnFormVo formVo = JSON.parseObject(jsonText, ReturnFormVo.class);

			PurchaseForm form = new PurchaseForm();
			BeanUtils.copyProperties(formVo, form);

			String refFormNo = formVo.getRefFormNo();
			if (StringUtils.isNotBlank(refFormNo)) {// 设置引用单据类型
				form.setRefFormNoType(refFormNo.substring(0, 2));
			}

			List<PurchaseFormDetail> list = new ArrayList<PurchaseFormDetail>();

			String formId = form.getId();
			SysUser user = UserUtil.getCurrentUser();
			Date now = new Date();
			List<PurchaseFormDetailVo> listVo = formVo.getDetailList();

			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail purchaseFormDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, purchaseFormDetail);

				if (purchaseFormDetail.checkPirce()) {
                    return RespJson.error("[" + purchaseFormDetail.getSkuCode() + "]采购价格不能为0");
                }
				// 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把备份价格替换成价格值
				purchaseFormDetail.setPriceBack(purchaseFormDetail.getPrice());
				purchaseFormDetail.setId(UUIDHexGenerator.generate());
				purchaseFormDetail.setFormId(formId);
				purchaseFormDetail.setCreateTime(now);
				purchaseFormDetail.setCreateUserId(user.getId());
				purchaseFormDetail.setUpdateTime(now);
				purchaseFormDetail.setUpdateUserId(user.getId());
				purchaseFormDetail.setDisabled(0);

				list.add(purchaseFormDetail);
			}

			RespJson respJson = purchaseFormServiceApi.update(form, list);
			return respJson;
		} catch (Exception e) {
			LOG.error("修改采购退货异常：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "/valid/check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(String formId) {
		PurchaseFormPO po = purchaseFormServiceApi.selectPOById(formId);
		if (po.getFormType().equals(FormType.PA)) {
			// 所有商品ID
			List<String> skuIds = new ArrayList<String>();
			List<PurchaseFormDetailPO> detailList = purchaseFormServiceApi.selectDetailById(formId);
			for (PurchaseFormDetailPO detailVo : detailList) {
				skuIds.add(detailVo.getSkuId());
			}

			//查询促销商品价格
            List<PurchaseActivityDetailVo> purchaseActivityDetailVos = purchaseActivityService.getNewPurPriceBySkuIds(skuIds, po.getSupplierId());
            boolean bool = false;
			StringBuilder message = new StringBuilder();
			int count = 1;
			if (CollectionUtils.isNotEmpty(purchaseActivityDetailVos)) {
				for (PurchaseActivityDetailVo purchaseActivityDetailVo : purchaseActivityDetailVos) {
					for (int i = 0, length = detailList.size(); i < length; ++i) {
						if (StringUtils.equals(purchaseActivityDetailVo.getSkuId(), detailList.get(i).getSkuId())
								&& !purchaseActivityDetailVo.getNewPurPrice().equals(detailList.get(i).getPrice())) {
							++count;
							if (count <= 3) {
								bool = true;
								message.append("'").append(detailList.get(i).getSkuName()).append("'、");
							}
						}
					}
				}
			}
			if (bool) {
				message.deleteCharAt(message.length() - 1);
				if (count > 3) {
					message.append("等").append(count).append("种");
				}
				message.append("商品价格已产生变动，是否按当前单据价格继续审核？");
				return RespJson.error(message.toString());
			}

		}
		return RespJson.success();

	}

	/**
	 * 审核
	 * @param formId
	 * @param status
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(String formId, Integer status) {
		try {
			StopWatch sw = new StopWatch();
			PurchaseFormPO po = purchaseFormServiceApi.selectPOById(formId);
			sw.start("审核采购订单校验商品");
			if (po.getFormType().equals(FormType.PA)) {
				// 所有商品ID
				List<String> skuIds = new ArrayList<String>();
				List<PurchaseFormDetailPO> detailList = purchaseFormServiceApi.selectDetailById(formId);
				for (PurchaseFormDetailPO detailVo : detailList) {
					skuIds.add(detailVo.getSkuId());
				}

				RespJson resp = saveValid(skuIds, po.getBranchId());
				if (!resp.isSuccess()) {
					return resp;
				}

			}
			sw.stop();

			SysUser user = UserUtil.getCurrentUser();
			RespJson respJson = RespJson.success();
			try {
				sw.start("审核采购订单");
				respJson = purchaseFormServiceApi.check(formId, FormStatus.enumValueOf(status), user.getId());
				sw.stop();
			} catch (RuntimeException e) {
				LOG.error("审核出现异常，单据id：" + formId, e);
				respJson = RespJson.error("审核出现异常，原因：" + e.getMessage());
			}
			LOG.debug(sw.prettyPrint());
			return respJson;
		} catch (Exception e) {
			LOG.error("审核采购单据异常：", e);
		}
		return RespJson.success();
	}

	/**
	 * @Description: 批量审核
	 * @param formId
	 * @param status
	 * @return
	 * @author liwb
	 * @date 2017年3月10日
	 */
	@RequestMapping(value = "batchCheck", method = RequestMethod.POST)
	@ResponseBody
	public RespJson batchCheck(String formIds, Integer status) {

		LOG.debug("单据Id列表：{}，审核状态：{}", formIds, status);
		RespJson respJson = RespJson.success();
		try {
			if (StringUtils.isBlank(formIds)) {
				return RespJson.argumentError("单据Id不能为空！");
			}

			if (status == null) {
				return RespJson.argumentError("审核状态不能为空！");
			}

			String[] ids = formIds.split(",");
			for (String id : ids) {
				respJson = purchaseFormServiceApi.check(id, FormStatus.enumValueOf(status), getCurrUserId());
				if (!respJson.isSuccess()) {
					LOG.error("采购订单审核失败，订单Id：{},失败消息：{}", id, respJson.getMessage());
					return respJson;
				} else {
					LOG.info("采购订单审核成功，订单Id：{}", id);
				}
			}
		} catch (Exception e) {
			LOG.error("批量审核采购订单异常：", e);
			respJson = RespJson.error("审核出现异常，原因：" + e.getMessage());
		}
		return respJson;
	}

	/**
	 * 终止
	 * @param formId
	 * @param status
	 * @return
	 * @author xiaoj02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "stop", method = RequestMethod.POST)
	@ResponseBody
	public RespJson stop(String formId) {
		try {
			SysUser user = UserUtil.getCurrentUser();
			return purchaseFormServiceApi.stop(formId, user.getId());
		} catch (Exception e) {
			LOG.error("终止采购单据异常：", e);
		}
		return RespJson.error();
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintReplace(java.lang.String)
	 */
	@Override
	protected Map<String, Object> getPrintReplace(String formNo) {
		PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formNo);
		Map<String, Object> replaceMap = new HashMap<String, Object>();
		if (null != form) {
			// 审核状态
			switch (form.getStatus().intValue()) {
				case 0:
					replaceMap.put("_审核状态", "待审核");
					replaceMap.put("status", "待审核");
					break;
				case 1:
					replaceMap.put("_审核状态", "审核通过");
					replaceMap.put("status", "审核通过");
					break;
				case 2:
					replaceMap.put("_审核状态", "审核不通过");
					replaceMap.put("status", "审核不通过");
					break;
				default:
					replaceMap.put("_审核状态", "");
					replaceMap.put("status", "");
					break;
			}
			// 订单编号
            replaceMap.put("_采购退货单号", form.getFormNo() != null ? form.getFormNo() : "");
            replaceMap.put("_采购收货单号", form.getFormNo() != null ? form.getFormNo() : "");
            replaceMap.put("formNo", form.getFormNo() != null ? form.getFormNo() : "");
            replaceMap.put("_原订单号", form.getFormNo() != null ? form.getRefFormNo() : "");
            replaceMap.put("_引用单号", form.getFormNo() != null ? form.getRefFormNo() : "");
			replaceMap.put("_订单编号", form.getFormNo() != null ? form.getFormNo() : "");
			PurchaseFormPO refForm = purchaseFormServiceApi.selectPOByFormNo(form.getRefFormNo());
			if (form.getFormNo() != null && StringUtils.startsWithIgnoreCase(form.getFormNo(), FormType.PI.name())) {
				replaceMap.put("_采购订单号", refForm.getFormNo());
			} else if (refForm != null && StringUtils.isNotBlank(refForm.getRefFormNo())) {
				replaceMap.put("_采购订单号", refForm.getRefFormNo() != null ? refForm.getRefFormNo() : "");
			} else {
				replaceMap.put("_采购订单号", "");
			}
			replaceMap.put("refFormNo", form.getRefFormNo() != null ? form.getRefFormNo() : "");
			// 供应商
			replaceMap.put("_供应商名称", form.getSupplierName() != null ? form.getSupplierName() : "");
			replaceMap.put("supplierName",
					form.getSupplierName() != null ? "[" + form.getSupplierCode() + "]" + form.getSupplierName() : "");
			// 制单人员
			replaceMap.put("_制单人员", form.getCreateUserName() != null ? form.getCreateUserName() : "");
			replaceMap.put("createUserName", form.getCreateUserName() != null ? form.getCreateUserName() : "");
			// 机构名称
			replaceMap.put("_机构名称", form.getBranchName() != null ? form.getBranchName() : "");
			replaceMap.put("branchName",
					form.getBranchName() != null ? "[" + form.getBranchCode() + "]" + form.getBranchName() : "");
			// 下单日期
			if (form.getCreateTime() != null) {
				replaceMap.put("_下单日期", DateUtils.formatDate(form.getCreateTime(), "yyyy-MM-dd"));
				replaceMap.put("createTime", DateUtils.formatDate(form.getCreateTime(), "yyyy-MM-dd HH:mm"));
			} else {
				replaceMap.put("_下单日期", "");
				replaceMap.put("createTime", "");
			}
			// 采购人员
			replaceMap.put("_采购人员", form.getSalesmanName() != null ? form.getSalesmanName() : "");
			replaceMap.put("salesmanName", form.getSalesmanName() != null ? form.getSalesmanName() : "");
			// 交货日期
			if (form.getDeliverTime() != null) {
				replaceMap.put("_交货日期", DateUtils.formatDate(form.getDeliverTime(), "yyyy-MM-dd"));
				replaceMap.put("deliverTime", DateUtils.formatDate(form.getDeliverTime(), "yyyy-MM-dd"));
			} else {
				replaceMap.put("_交货日期", "");
				replaceMap.put("deliverTime", "");
			}
			// 审核人员
			replaceMap.put("_审核人员", form.getValidUserName() != null ? form.getValidUserName() : "");
			replaceMap.put("validUserName", form.getValidUserName() != null ? form.getValidUserName() : "");
			// 备注
			replaceMap.put("_备注", form.getRemark());
			replaceMap.put("remark", form.getRemark());
			// 审核日期
			if (form.getValidTime() != null) {
				replaceMap.put("_审核日期", DateUtils.formatDate(form.getValidTime(), "yyyy-MM-dd"));
				replaceMap.put("validTime", DateUtils.formatDate(form.getValidTime(), "yyyy-MM-dd HH:mm"));
			} else {
				replaceMap.put("_审核日期", "");
				replaceMap.put("validTime", "");
			}
			// 人民币总金额大写
			replaceMap.put("_人民币总金额大写", NumberToCN.number2CNMontrayUnit(form.getAmount()));
			replaceMap.put("amountCN", NumberToCN.number2CNMontrayUnit(form.getAmount()));
			// 总金额
			replaceMap.put("_总金额", BigDecimalUtils.formatTwoDecimal(form.getAmount()).toString());
			replaceMap.put("amount", BigDecimalUtils.formatTwoDecimal(form.getAmount()).toString());
			// 合计金额
			replaceMap.put("_合计金额", NumberToCN.number2CNMontrayUnit(form.getAmount()));
			// 打印人
			replaceMap.put("_打印人", getCurrentUser().getUserName());
			replaceMap.put("printUserName", getCurrentUser().getUserName());
			// 打印时间
			replaceMap.put("_打印时间", DateUtils.formatDate(new Date(), "yyyy-MM-dd"));
			replaceMap.put("printTime", DateUtils.formatDate(new Date(), "yyyy-MM-dd"));

			/**
			 * added by zhangqin on 2016-12-01 14:36 begin
			 * 新增供应商联系人、供应商电话号码、供应商手机号码、机构联系人、机构联系电话、机构详细地址字段
			 */
			// 供应商联系人
			replaceMap.put("_供应商联系人", form.getSupplierContcat() != null ? form.getSupplierContcat() : "");
			replaceMap.put("supplierContcat", form.getSupplierContcat() != null ? form.getSupplierContcat() : "");
			// 供应商电话号码
			replaceMap.put("_供应商电话号码", form.getSupplierPhone() != null ? form.getSupplierPhone() : "");
			// 供应商手机号码
			replaceMap.put("_供应商手机号码", form.getSupplierMobile() != null ? form.getSupplierMobile() : "");
			replaceMap.put("supplierMobile", form.getSupplierMobile() != null ? form.getSupplierMobile() : "");
			// 机构联系人
			replaceMap.put("_机构联系人", form.getBranchContacts() != null ? form.getBranchContacts() : "");
			replaceMap.put("branchContacts", form.getBranchContacts() != null ? form.getBranchContacts() : "");
			// 机构联系电话
			replaceMap.put("_机构联系电话", form.getBranchMobile() != null ? form.getBranchMobile() : "");
			replaceMap.put("branchMobile", form.getBranchMobile() != null ? form.getBranchMobile() : "");
			// 机构详细地址
			replaceMap.put("_机构详细地址", form.getBranchAddress() != null ? form.getBranchAddress() : "");
			replaceMap.put("_送货地址", form.getBranchAddress() != null ? form.getBranchAddress() : "");
			replaceMap.put("branchAddress", form.getBranchAddress() != null ? form.getBranchAddress() : "");

			// 付款期限
			if (form.getPaymentTime() != null) {
				replaceMap.put("paymentTime", DateUtils.formatDate(form.getPaymentTime(), "yyyy-MM-dd"));
			}
			replaceMap.put("saleWay", SaleWayEnum.getValue(form.getSaleWay()));

			// 交货期限
			if (form.getDeliverTime() != null) {
				replaceMap.put("_交货期限", DateUtils.formatDate(form.getDeliverTime(), "yyyy-MM-dd"));
				replaceMap.put("deliverTime", DateUtils.formatDate(form.getDeliverTime(), "yyyy-MM-dd"));
			}

			/**
			 * added by zhangqin on 2016-12-01 14:36 end
			 */
			// 采购收货单的总金额不受价格权限控制
			if (!FormType.PI.equals(form.getFormType())) {
				cleanDataMap(getPriceAccess(), replaceMap);
			}
		}
		return replaceMap;
	}

	private Map<String, String> getPriceAccess() {
		Map<String, String> map = new HashMap<String, String>();
		map.put(PriceConstant.PURCHASE_PRICE, "_人民币总金额大写,amountCN,_总金额,amount,_合计金额");
		return map;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintDetail(java.lang.String)
	 */
	@Override
	protected List<PurchaseFormDetailPO> getPrintDetail(String formNo) {
		List<PurchaseFormDetailPO> list = purchaseFormServiceApi.selectDetail(formNo).getList();
		cleanAccessData(list);
		return list;
	}

	/**
	 * 商品导入
	 * @param file
	 * @param type 0货号、1条码
	 * @param branchId
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月14日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String type, String branchId) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}

			if (StringUtils.isBlank(type)) {
				return RespJson.error("导入类型为空");
			}

			// 文件流
			InputStream is = file.getInputStream();
			// 获取文件名
			String fileName = file.getOriginalFilename();

			SysUser user = UserUtil.getCurrentUser();

			String[] field = null;

			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
				field = new String[] { "skuCode", "realNum", "price", "isGift" };
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
				field = new String[] { "barCode", "realNum", "price", "isGift" };
			}

			GoodsSelectImportVo<GoodsSelect> vo = goodsSelectImportComponent.importSelectGoods(fileName, is, field,
					new GoodsSelectByPurchase(), branchId, user.getId(), type, "/form/purchase/downloadErrorFile",
					new GoodsSelectImportBusinessValid() {

						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {
							for (JSONObject obj : excelListSuccessData) {
								try {
									String realNum = obj.getString("realNum");
									Double.parseDouble(realNum);
								} catch (Exception e) {
									obj.element("realNum", 0);
								}

								try {
									String isGift = obj.getString("isGift");
									if ("是".equals(isGift)) {// 如果是赠品，单价设置为0
										obj.element("isGift", "1");
										obj.element("price", 0);
									} else if ("否".equals(isGift)) {
										obj.element("isGift", "0");
									} else {
										obj.element("error", "是否赠品字段填写有误");
									}
								} catch (Exception e) {
									obj.element("error", "是否赠品字段填写有误");
								}
							}
						}

						/**
						 * (non-Javadoc)
						 * @see com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid#formatter(java.util.List)
						 */
						@Override
						public void formatter(List<? extends GoodsSelect> list, List<JSONObject> excelListSuccessData,
								List<JSONObject> excelListErrorData) {
							for (GoodsSelect objGoods : list) {
								GoodsSelectByPurchase obj = (GoodsSelectByPurchase) objGoods;

								BigDecimal price = obj.getPrice();
								// 非赠品才替换导入文件中的导入价格
								if (Constant.ZERO_STR.equals(obj.getIsGift()) && price != null) {
									obj.setPurchasePrice(price);
								}
							}
						}

						/**
						 * (non-Javadoc)
						 * @see com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid#errorDataFormatter(java.util.List)
						 */
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
					}, null);
			respJson.put("importInfo", vo);
        } catch (BusinessException e) {
            respJson = RespJson.error(e.getMessage());
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常:", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("用户导入异常:", e);
		}
		return respJson;

	}

	/**
	 * @author xiaoj02
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "downloadErrorFile")
	public void downloadErrorFile(String code, String type, HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = null;
		String[] columns = null;

		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
			columns = new String[] { "skuCode", "realNum", "price", "isGift" };
			headers = new String[] { "货号", "数量", "单价", "是否赠品" };
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
			columns = new String[] { "barCode", "realNum", "price", "isGift" };
			headers = new String[] { "条码", "数量", "单价", "是否赠品" };
		}

		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * @Description: 导出明细
	 * @param formId 单号
	 * @return
	 * @author lijy02
	 * @date 2016年8月29日
	 */
	@RequestMapping(value = "exportList")
	public void exportList(HttpServletResponse response, String formId, String type) {
		LOG.debug("PurchaseFormController.export:" + formId);
		try {
			List<PurchaseFormDetailPO> exportList = purchaseFormServiceApi.selectDetailById(formId);
			String fileName = "";
			String templateName = "";
			if (FormType.PA.toString().equals(type)) {
				// 导出文件名称，不包括后缀名
				fileName = "采购单" + "_" + DateUtils.getCurrSmallStr();
				// 模板名称，包括后缀名
				templateName = ExportExcelConstant.PURCHASEFORM;
			} else if (FormType.PI.toString().equals(type)) {
				// 导出文件名称，不包括后缀名
				fileName = "收货单" + "_" + DateUtils.getCurrSmallStr();
				templateName = ExportExcelConstant.DADOFORM;
			} else {
				// 导出文件名称，不包括后缀名
				fileName = "退货单" + "_" + DateUtils.getCurrSmallStr();
				templateName = ExportExcelConstant.RETURN_FORM;
			}
			// 导出Excel
			cleanAccessData(exportList);
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("GoodsPriceAdjustController:exportList:", e);
		}
	}

	/**
	 * @Description: 采购导入模板
	 * @param response
	 * @param type
	 * @author zhongy
	 * @date 2016年10月12日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, Integer type) {
		LOG.debug("导出采购导入模板请求参数,type={}", type);
		try {
			String fileName = "";
			String templateName = "";
			if (Constant.ZERO == type) {
				templateName = ExportExcelConstant.PURCHASE_GOODS_SKUCODE_TEMPLE;
				fileName = "货号导入模板";
			} else if (Constant.ONE == type) {
				templateName = ExportExcelConstant.PURCHASE_GOODS_BARCODE_TEMPLE;
				fileName = "条码导入模板";
			} else if (Constant.TWO == type) {
				templateName = ExportExcelConstant.GOODS_INTRODUCE_SKU_CODE_TEMPLE;
				fileName = "货号导入模板";
			} else if (Constant.THREE == type) {
				templateName = ExportExcelConstant.GOODS_INTRODUCE_BAR_CODE_TEMPLE;
				fileName = "条码导入模板";
			}
			if (StringUtils.isNotBlank(fileName) && StringUtils.isNotBlank(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出采购导入模板异常", e);
		}
	}

	/**
	 * 
	 * @Description: 采购订单保存验证
	 * @return RespJson  
	 * @author zhangq
	 * @date 2017年3月16日
	 */
	public RespJson saveValid(List<String> skuIds, String branchId) {
		// 订单明细商品是否有停购或淘汰情况
		GoodsBranchPriceQo qo = new GoodsBranchPriceQo();

		// 所有商品ID
		qo.setGoodsStoreSkuIds(skuIds);

		// 机构ID
		qo.setBranchId(branchId);

		// 其他参数
		qo.setPage(1);
		qo.setRows(skuIds.size());
		// 查询商品信息
		PageUtils<GoodsBranchPriceVo> page = null;
		Branches branch = branchesServiceApi.getBranchInfoById(branchId);// 机构类型(0.总部、1.分公司、2.物流中心、3.自营店、4.加盟店B、5.加盟店C)
		if (branch.getType() == 3 || branch.getType() == 4 || branch.getType() == 5) {
			page = goodsBranchPriceService.queryBranchGoods(qo);
		} else {
			page = goodsBranchPriceService.queryBranchCompanyGoods(qo);
		}
		List<GoodsBranchPriceVo> list = page.getList();

		// 处理结果
		StringBuilder sb = new StringBuilder();
		for (GoodsBranchPriceVo branchGoodsVo : list) {
			// 停购
			if ("2".equals(branchGoodsVo.getStatus())) {
				sb.append(branchGoodsVo.getSkuName() + "[" + branchGoodsVo.getSkuCode() + "]已停购；\n");
			}
			// 淘汰
			if ("3".equals(branchGoodsVo.getStatus())) {
				sb.append(branchGoodsVo.getSkuName() + "[" + branchGoodsVo.getSkuCode() + "]已淘汰；\n");
			}
		}
		if (!sb.toString().equals("")) {
			return RespJson.error(sb.toString());
		}
		return RespJson.success();
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