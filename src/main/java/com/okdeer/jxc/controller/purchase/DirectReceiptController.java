/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年3月28日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.purchase;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.branch.vo.BranchSpecVo;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.BigDecimalUtils;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.Disabled;
import com.okdeer.jxc.common.utils.NumberToCN;
import com.okdeer.jxc.common.utils.OrderNoUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.UUIDHexGenerator;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.form.entity.PurchaseForm;
import com.okdeer.jxc.form.entity.PurchaseFormDetail;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.form.purchase.qo.FormQueryQo;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormDetailPO;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormPO;
import com.okdeer.jxc.form.purchase.service.PurchaseFormServiceApi;
import com.okdeer.jxc.form.purchase.vo.PurchaseFormDetailVo;
import com.okdeer.jxc.form.purchase.vo.ReceiptFormVo;
import com.okdeer.jxc.goods.entity.GoodsBranchPriceVo;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByPurchase;
import com.okdeer.jxc.goods.qo.GoodsBranchPriceQo;
import com.okdeer.jxc.goods.service.GoodsBranchPriceServiceApi;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.price.PriceConstant;

/**
 * ClassName: DirectReceiptController 
 * @Description: 直送收货controller
 * @author zhengwj
 * @date 2017年3月28日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("directReceipt")
public class DirectReceiptController extends BasePrintController<DirectReceiptController, PurchaseFormDetailPO> {

	/**
	 * @Fields purchaseFormServiceApi : 收货单service
	 */
	@Reference(version = "1.0.0", check = false)
	private PurchaseFormServiceApi purchaseFormServiceApi;

	/**
	 * @Fields goodsBranchPriceService : 店铺商品价格service
	 */
	@Reference(version = "1.0.0", check = false)
	private GoodsBranchPriceServiceApi goodsBranchPriceService;

	/**
	 * @Fields branchesServiceApi : 机构service
	 */
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesService;

	/**
	 * 机构设置Dubbo接口
	 */
	@Reference(version = "1.0.0", check = false)
	private BranchSpecServiceApi branchSpecService;
	
    @Reference(version = "1.0.0", check = false)
    private BranchesServiceApi branchesServiceApi;
	/**
	 * @Fields orderNoUtils : 订单号工具
	 */
	@Autowired
	private OrderNoUtils orderNoUtils;

	/**
	 * @Fields goodsSelectImportComponent : 商品选择工具
	 */
	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	/**
	 * @Description: 直送收货列表页面
	 * @author zhengwj
	 * @date 2017年3月30日
	 */
	@RequestMapping(value = "list")
	public String list() {
		return "form/purchase/directReceipt/directReceiptList";
	}

	/**
	 * @Description: 处理查询参数
	 * @author zhengwj
	 * @date 2017年4月1日
	 */
	private FormQueryQo getParam(FormQueryQo qo) {
		if (qo.getEndTime() != null) {
			// 结束日期加一天
			qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
		}
		// 直送收货单
		qo.setFormType(FormType.PM.toString());
		qo.setBranchCompleCode(getCurrBranchCompleCode());

		// 处理供应商
		String supplierName = qo.getSupplierName();
		if (StringUtils.isNotBlank(supplierName)) {
			supplierName = supplierName.substring(supplierName.lastIndexOf("]") + 1, supplierName.length());
			qo.setSupplierName(supplierName);
		}

		// 处理收货机构
		String branchName = qo.getBranchName();
		if (StringUtils.isNotBlank(branchName)) {
			branchName = branchName.substring(branchName.lastIndexOf("]") + 1, branchName.length());
			qo.setBranchName(branchName);
		}

		// 处理制单人
		String operateUserName = qo.getOperateUserName();
		if (StringUtils.isNotBlank(operateUserName)) {
			operateUserName = operateUserName.substring(operateUserName.lastIndexOf("]") + 1, operateUserName.length());
			qo.setOperateUserName(operateUserName);
		}
		return qo;
	}

	/**
	 * @Description: 获取直送收货单列表
	 * @param qo 查询条件
	 * @author zhengwj
	 * @date 2017年3月30日
	 */
	@RequestMapping(value = "getList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseFormPO> getList(FormQueryQo qo) {
		try {
			qo = getParam(qo);
			PageUtils<PurchaseFormPO> page = purchaseFormServiceApi.selectPage(qo);
			// 过滤数据权限字段
			cleanAccessData(page);
			return page;
		} catch (Exception e) {
			LOG.error("获取直送收货单列表异常:{}", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 新增直送收货列表页面
	 * @author zhengwj
	 * @date 2017年3月30日
	 */
	@RequiresPermissions("JxcDirectReceipt:add")
	@RequestMapping(value = "add")
	public ModelAndView add(String formId, ModelAndView modelAndView) {
		if (!BranchTypeEnum.HEAD_QUARTERS.getCode().equals(UserUtil.getCurrBranchType())) {
			// 查询是否需要自动加载商品
			BranchSpecVo vo = branchSpecService.queryByBranchId(UserUtil.getCurrBranchId());
			if (null != vo) {
				modelAndView.addObject("cascadeGoods", vo.getIsSupplierCascadeGoodsPm());
				
				//允许直送收货单不引用单据收货：0.否，1.是
				modelAndView.addObject("isAllowPmRefPa", vo.getIsAllowPmRefPa());
			}
		}
		if(StringUtils.isNotBlank(formId)){
			PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formId);
			modelAndView.addObject("form", form);
		}
		modelAndView.setViewName("form/purchase/directReceipt/directAdd");
		return modelAndView;
	}

	/**
	 * @Description: 保存直送收货单
	 * @param jsonText 直送收货单
	 * @author zhengwj
	 * @date 2017年3月30日
	 */
	@RequiresPermissions("JxcDirectReceipt:add")
	@RequestMapping(value = "save", method = RequestMethod.POST)
	@ResponseBody
	public RespJson save(@RequestBody String jsonText) {
		RespJson resp;
		try {
			ReceiptFormVo formVo = JSON.parseObject(jsonText, ReceiptFormVo.class);
			
			// 验证商品
			List<String> skuIds = new ArrayList<String>();
			List<PurchaseFormDetailVo> detailList = formVo.getDetailList();
			
			//不是引用订单收货，需要验证
			if(StringUtils.isNotBlank(formVo.getRefFormNo())){
				skuIds = new ArrayList<String>();
				if(CollectionUtils.isNotEmpty(detailList)){
				    for (PurchaseFormDetailVo detailVo : detailList) {
				        skuIds.add(detailVo.getSkuId());
				    }
				}
				//RespJson resp = saveValid(skuIds,formVo.getBranchId());
				resp = validReceiptItem(skuIds, formVo.getRefFormId());
				if(!resp.isSuccess()){
					return resp;
				}
			}
			
			// 处理结果
			StringBuilder sb = new StringBuilder();
			skuIds = new ArrayList<String>();
			for (PurchaseFormDetailVo detailVo : detailList) {
				skuIds.add(detailVo.getSkuId());
				// 非赠送，单价为0
				if (detailVo.getIsGift() == 0 && BigDecimal.ZERO.compareTo(detailVo.getPrice()) == 0) {
					sb.append("[" + detailVo.getSkuCode() + "]单价为0，请重新修改；\n");
				}
			}
			if (StringUtils.isNotBlank(sb.toString())) {
				return RespJson.error(sb.toString());
			}
			resp = saveValid(skuIds, formVo.getBranchId());
			if (!resp.isSuccess()) {
				return resp;
			}

			PurchaseForm form = new PurchaseForm();
			BeanUtils.copyProperties(formVo, form);

			String formId = UUIDHexGenerator.generate();
			SysUser user = UserUtil.getCurrentUser();
			String formNo = orderNoUtils.getOrderNoAll(FormType.PM.name() + user.getBranchCode(), 4);
			Date now = new Date();

			form.setId(formId);
			form.setFormType(FormType.PM);
			form.setFormNo(formNo);
			form.setIo(1);
			
			String refFormNo = formVo.getRefFormNo();
			if (StringUtils.isNotBlank(refFormNo)) {// 设置引用单据类型
				form.setRefFormNoType(refFormNo.substring(0, 2));
			}
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
			BigDecimal totalAmount = BigDecimal.ZERO;
			BigDecimal untaxedTotalAmount = BigDecimal.ZERO;
			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail formDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, formDetail);
				
	            // 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把价格备份替换成价格值
                if(formDetail.checkPirceBack()){
                    formDetail.setPriceBack(formDetail.getPrice());
                }
				formDetail.setId(UUIDHexGenerator.generate());
				formDetail.setFormId(formId);
				formDetail.setCreateTime(now);
				formDetail.setCreateUserId(user.getId());
				formDetail.setUpdateTime(now);
				formDetail.setUpdateUserId(user.getId());
				formDetail.setDisabled(0);
                // 明细，重新计算金额值
                formDetail.calcAmount(formDetail.getRealNum());
                totalAmount = totalAmount.add(formDetail.getAmount());
                untaxedTotalAmount = untaxedTotalAmount.add(formDetail.getUntaxedAmount());
				list.add(formDetail);
			}
			// 重设单据金额
			form.setAmount(BigDecimalUtils.formatDecimal(totalAmount, 4));
			form.setUntaxedAmount(BigDecimalUtils.formatDecimal(untaxedTotalAmount, 4));
			// 保存订单
			resp = purchaseFormServiceApi.save(form, list);
			if (resp.isSuccess()) {
				resp.put("formId", formId);
			}
		} catch (Exception e) {
			LOG.error("保存直送收货单异常:{}", e);
			resp = RespJson.error("保存直送收货单失败");
		}
		return resp;
	}
	
	public RespJson validReceiptItem(List<String> skuIds, String formId) {
        List<PurchaseFormDetailPO> list = purchaseFormServiceApi.selectDetailById(formId);
        
		PurchaseForm refForm = purchaseFormServiceApi.get(formId);
		if (refForm == null) {
			return RespJson.businessError("引用采购订单不存在！");
		}

		// 已经被引用
		if (refForm.getIsRef() != null && refForm.getIsRef().intValue() == 1) {
			return RespJson.businessError("引用的采购订单已经被引用！");
		}
        
		// 已终止状态
		if(refForm.getDealStatus().intValue()==3){
			return RespJson.businessError("引用的采购订单是已终止状态！");
		}
		
        if ((CollectionUtils.isNotEmpty(skuIds) && CollectionUtils.isNotEmpty(list) && skuIds.size() > list.size()) || CollectionUtils.isEmpty(list)) {
            return RespJson.businessError("已选采购单号，不允许添加其他商品");
        }
        Map<String, PurchaseFormDetailPO> tempMap = new HashMap<String, PurchaseFormDetailPO>();
        for (PurchaseFormDetailPO pdPo : list) {
            tempMap.put(pdPo.getSkuId(), pdPo);
        }
        for (String skuId : skuIds) {
            PurchaseFormDetailPO pdPo = tempMap.get(skuId);
            if (pdPo == null) {
                return RespJson.businessError("已选采购单号，不允许添加其他商品");
            }
        }
        return RespJson.success();
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
		Branches branch = branchesService.getBranchInfoById(branchId);
		// 机构类型(0.总部、1.分公司、2.物流中心、3.自营店、4.加盟店B、5.加盟店C)
		if (BranchTypeEnum.SELF_STORE.getCode().equals(branch.getType())
				|| BranchTypeEnum.FRANCHISE_STORE_B.getCode().equals(branch.getType())
				|| BranchTypeEnum.FRANCHISE_STORE_C.getCode().equals(branch.getType())) {
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
		if (StringUtils.isNotBlank(sb.toString())) {
			return RespJson.error(sb.toString());
		}
		return RespJson.success();
	}

	/**
	 * @Description: 审核直送收货单
	 * @param formId 点多id
	 * @param status 审核状态
	 * @author zhengwj
	 * @date 2017年3月31日
	 */
	@RequiresPermissions("JxcDirectReceipt:audit")
	@RequestMapping(value = "check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(String formId, Integer status) {
		RespJson respJson;
		try {
			PurchaseFormPO po = purchaseFormServiceApi.selectPOById(formId);
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

			SysUser user = UserUtil.getCurrentUser();
			respJson = purchaseFormServiceApi.check(formId, FormStatus.enumValueOf(status), user.getId());
		} catch (RuntimeException e) {
			LOG.error("审核出现异常，单据id：" + formId, e);
			respJson = RespJson.error("审核出现异常，原因：" + e.getMessage());
		}
		return respJson;
	}

	/**
	 * @Description: 批量删除直送收货单
	 * @param formIds 单据id
	 * @author zhengwj
	 * @date 2017年3月30日
	 */
	@RequiresPermissions("JxcDirectReceipt:delete")
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	@ResponseBody
	public RespJson delete(@RequestParam(value = "formIds[]") List<String> formIds) {
		RespJson resp;
		SysUser user = UserUtil.getCurrentUser();
		try {
			resp = purchaseFormServiceApi.deleteByIds(formIds, user.getId());
		} catch (BusinessException e) {
			LOG.error("批量删除直送收货单失败:{}", e);
			resp = RespJson.error(e.getMessage());
		}
		return resp;
	}

	/**
	 * @Description: 编辑直送收货列表页面
	 * @author zhengwj
	 * @date 2017年3月30日
	 */
	@RequiresPermissions("JxcDirectReceipt:edit")
	@RequestMapping(value = "edit")
	public ModelAndView edit(String formId, ModelAndView modelAndView) {
		try {
			PurchaseFormPO form = purchaseFormServiceApi.selectPOById(formId);
			if (form == null) {
				LOG.error("直送收货单数据为空：订单Id：{}", formId);
				modelAndView.setViewName("/error/500");
				return modelAndView;
			}
			// 如果已删除
			if (Disabled.INVALID.ordinal() == form.getDisabled().intValue()) {
				LOG.error("直送收货单已删除：订单Id：{}", formId);
				modelAndView.setViewName("/error/500");
				return modelAndView;
			}
			if (!BranchTypeEnum.HEAD_QUARTERS.getCode().equals(UserUtil.getCurrBranchType())) {
				// 查询是否需要自动加载商品
				BranchSpecVo vo = branchSpecService.queryByBranchId(UserUtil.getCurrBranchId());
				if (null != vo) {
					modelAndView.addObject("cascadeGoods", vo.getIsSupplierCascadeGoodsPm());
					
					//允许直送收货单不引用单据收货：0.否，1.是
					modelAndView.addObject("isAllowPmRefPa", vo.getIsAllowPmRefPa());
				}
			}
			modelAndView.addObject("form", form);
		} catch (Exception e) {
			LOG.error("编辑直送收货错误:{}", e);
		}
		modelAndView.setViewName("form/purchase/directReceipt/directEdit");
		return modelAndView;
	}

	/**
	 * @Description: 更新直送收货单
	 * @author zhengwj
	 * @date 2017年3月31日
	 */
	@RequiresPermissions("JxcDirectReceipt:edit")
	@RequestMapping(value = "update", method = RequestMethod.POST)
	@ResponseBody
	public RespJson update(@RequestBody String jsonText) {
		RespJson resp;
		try {
			ReceiptFormVo formVo = JSON.parseObject(jsonText, ReceiptFormVo.class);

			// 验证商品
			List<String> skuIds = new ArrayList<String>();
			List<PurchaseFormDetailVo> detailList = formVo.getDetailList();
			// 处理结果
			StringBuilder sb = new StringBuilder();
			for (PurchaseFormDetailVo detailVo : detailList) {
				skuIds.add(detailVo.getSkuId());
				// 非赠送，单价为0
				if (detailVo.getIsGift() == 0 && BigDecimal.ZERO.compareTo(detailVo.getPrice()) == 0) {
					sb.append("[" + detailVo.getSkuCode() + "]单价为0，请重新修改；\n");
				}
			}
			if (StringUtils.isNotBlank(sb.toString())) {
				return RespJson.error(sb.toString());
			}
			resp = saveValid(skuIds, formVo.getBranchId());
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
            BigDecimal totalAmount = BigDecimal.ZERO;
            BigDecimal untaxedTotalAmount = BigDecimal.ZERO;
			for (PurchaseFormDetailVo purchaseFormDetailVo : listVo) {
				PurchaseFormDetail purchaseFormDetail = new PurchaseFormDetail();
				BeanUtils.copyProperties(purchaseFormDetailVo, purchaseFormDetail);
				
                // 处理价格备份：如果价格不为0且价格和备份价格不想等，表示页面有作价格修改，需把价格备份替换成价格值
                if(purchaseFormDetail.checkPirceBack()){
                    purchaseFormDetail.setPriceBack(purchaseFormDetail.getPrice());
                }
				purchaseFormDetail.setId(UUIDHexGenerator.generate());
				purchaseFormDetail.setFormId(formId);
				purchaseFormDetail.setCreateTime(now);
				purchaseFormDetail.setCreateUserId(user.getId());
				purchaseFormDetail.setUpdateTime(now);
				purchaseFormDetail.setUpdateUserId(user.getId());
				purchaseFormDetail.setDisabled(0);
                // 明细，重新计算金额值
                purchaseFormDetail.calcAmount(purchaseFormDetail.getRealNum());
                totalAmount = totalAmount.add(purchaseFormDetail.getAmount());
                untaxedTotalAmount = untaxedTotalAmount.add(purchaseFormDetail.getUntaxedAmount());
				list.add(purchaseFormDetail);
			}
			// 重设单据金额
			form.setAmount(BigDecimalUtils.formatDecimal(totalAmount, 4));
			form.setUntaxedAmount(BigDecimalUtils.formatDecimal(untaxedTotalAmount, 4));

			form.setUpdateUserId(user.getId());
			form.setUpdateTime(now);
			resp = purchaseFormServiceApi.update(form, list);
			if (resp.isSuccess()) {
				resp.put("formId", formId);
			}
		} catch (Exception e) {
			LOG.error("更新直送收货单异常:{}", e);
			resp = RespJson.error("更新直送收货单失败");
		}
		return resp;
	}

	/**
	 * @Description: 获取订单详情列表
	 * @param formId 订单id
	 * @author zhengwj
	 * @date 2017年3月30日
	 */
	@RequestMapping(value = "getDetailList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<PurchaseFormDetailPO> getDetailList(String formId) {
		try {
		    PurchaseForm form = purchaseFormServiceApi.get(formId);
		    if (form == null ) {
		        return PageUtils.emptyPage();
		    }
            String branchId = form.getBranchId();
            Branches branch = branchesServiceApi.getBranchInfoById(branchId);

            // 取分公司数据
            if (branch.getType() > 1) {
                branchId = branch.getParentId();
            }
            PageUtils<PurchaseFormDetailPO> pageDetail = PageUtils.emptyPage();
            BranchSpecVo branchSpec = branchSpecService.queryByBranchId(branchId);
            // 允许采购收货取采购订单价格：0.否，1.是
            if (branchSpec.getIsAllowPiGetPaPrice().intValue() == 0) {
                List<PurchaseFormDetailPO> list = purchaseFormServiceApi.getDetailAndPriceById(formId);
                pageDetail = new PageUtils<>(list);
            } else {
                pageDetail = purchaseFormServiceApi.selectDetail(formId);
            }
			return pageDetail;
		} catch (Exception e) {
			LOG.error("获取订单详情列表异常:{}", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 打印直送收货单列表
	 * @author zhengwj
	 * @date 2017年3月31日
	 */
	@RequiresPermissions("JxcDirectReceipt:print")
	@RequestMapping(value = "print", method = RequestMethod.GET)
	@ResponseBody
	public String print(FormQueryQo qo, HttpServletResponse response, HttpServletRequest request) {
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("startDate", DateUtils.formatDate(qo.getStartTime(), "yyyy-MM-dd"));
			map.put("endDate", DateUtils.formatDate(qo.getEndTime(), "yyyy-MM-dd"));
			map.put("printName", UserUtil.getCurrentUser().getUserName());
			qo.setPage(1);
			qo.setRows(PrintConstant.PRINT_MAX_LIMIT);
			qo = getParam(qo);
			LOG.debug("直送收货单打印参数：{}", qo);
			int lenght = purchaseFormServiceApi.queryPageListCount(qo);
			if (lenght > PrintConstant.PRINT_MAX_ROW) {
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			PageUtils<PurchaseFormPO> pageList = purchaseFormServiceApi.selectPage(qo);
			List<PurchaseFormPO> list = pageList.getList();
			if (!CollectionUtils.isEmpty(list) && list.size() > PrintConstant.PRINT_MAX_ROW) {
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			String path = PrintConstant.DIRECT_RECEIPT;
			cleanAccessData(list);
			JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, list, "");
		} catch (Exception e) {
			LOG.error(PrintConstant.DIRECT_RECEIPT_ERROR, e);
		}
		return null;
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
			replaceMap.put("_订单编号", form.getFormNo() != null ? form.getFormNo() : "");
			replaceMap.put("formNo", form.getFormNo() != null ? form.getFormNo() : "");
			// 供应商
			replaceMap.put("_供应商", form.getSupplierName() != null ? form.getSupplierName() : "");
			replaceMap.put("supplierName", form.getSupplierName() != null ? form.getSupplierName() : "");
			// 制单人员
			replaceMap.put("_制单人员", form.getSalesmanName() != null ? form.getSalesmanName() : "");
			replaceMap.put("salesmanName", form.getSalesmanName() != null ? form.getSalesmanName() : "");
			// 机构名称
			replaceMap.put("_机构名称", form.getBranchName() != null ? form.getBranchName() : "");
			replaceMap.put("branchName", form.getBranchName() != null ? form.getBranchName() : "");
			// 下单日期
			if (form.getCreateTime() != null) {
				replaceMap.put("_下单日期", DateUtils.formatDate(form.getCreateTime(), "yyyy-MM-dd"));
				replaceMap.put("createTime", DateUtils.formatDate(form.getCreateTime(), "yyyy-MM-dd"));
			} else {
				replaceMap.put("_下单日期", "");
				replaceMap.put("createTime", "");
			}
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
				replaceMap.put("validTime", DateUtils.formatDate(form.getValidTime(), "yyyy-MM-dd"));
			} else {
				replaceMap.put("_审核日期", "");
				replaceMap.put("validTime", "");
			}
			// 人民币总金额大写
			replaceMap.put("_人民币总金额大写", NumberToCN.number2CNMontrayUnit(form.getAmount()));
			replaceMap.put("amountCN", NumberToCN.number2CNMontrayUnit(form.getAmount()));
			// 总金额
			replaceMap.put("_总金额", BigDecimalUtils.formatFourDecimal(form.getAmount()).toString());
			replaceMap.put("amount", BigDecimalUtils.formatFourDecimal(form.getAmount()).toString());
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
			/**
			 * added by zhangqin on 2016-12-01 14:36 end
			 */
		}
		cleanDataMap(getPriceAccess(), replaceMap);
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
		try {
			List<PurchaseFormDetailPO> list = purchaseFormServiceApi.selectDetail(formNo).getList();
			if (null != list) {
				cleanAccessData(list);
				return list;
			}
		} catch (Exception e) {
			LOG.error("直送收货单打印列表异常:{}", e);
		}
		return new ArrayList<>();
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
			if (GoodsSelectImportHandle.TYPE_SKU_CODE.equals(type)) {
				// 货号
				field = new String[] { "skuCode", "realNum", "price", "ingoreAmount", "isGift" };
			} else if (GoodsSelectImportHandle.TYPE_BAR_CODE.equals(type)) {
				// 条码
				field = new String[] { "barCode", "realNum", "price", "ingoreAmount", "isGift" };
			}
			Map<String, String> mapBranchid = new HashMap<>();
			mapBranchid.put("formType", "PM");

			GoodsSelectImportVo<GoodsSelect> vo = goodsSelectImportComponent.importSelectGoods(fileName, is, field,
					new GoodsSelectByPurchase(), branchId, user.getId(), type, "/directReceipt/downloadErrorFile",
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
									if ("是".equals(isGift)) {
										// 如果是赠品，单价设置为0
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
								if (price == null) {
									obj.setPrice(obj.getPurchasePrice());
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
					}, mapBranchid);
			respJson.put("importInfo", vo);
        } catch (BusinessException e) {
            respJson = RespJson.error(e.getMessage());
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常:{}", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("用户导入异常:{}", e);
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
		if (GoodsSelectImportHandle.TYPE_SKU_CODE.equals(type)) {
			// 货号
			columns = new String[] { "skuCode", "realNum", "price", "ingoreAmount", "isGift" };
			headers = new String[] { "货号", "数量", "单价", "金额", "是否赠品" };
		} else if (GoodsSelectImportHandle.TYPE_BAR_CODE.equals(type)) {
			// 条码
			columns = new String[] { "barCode", "realNum", "price", "ingoreAmount", "isGift" };
			headers = new String[] { "条码", "数量", "单价", "金额", "是否赠品" };
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
	public void exportList(HttpServletResponse response, String formId) {
		LOG.debug("PurchaseFormController.export:{}",formId);
		try {
			List<PurchaseFormDetailPO> exportList = purchaseFormServiceApi.selectDetailById(formId);
			String fileName = "直送收货单_" + DateUtils.getCurrSmallStr();
			String templateName = ExportExcelConstant.DIRECTRECEIPTFORM;
			// 导出Excel
			cleanAccessData(exportList);
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("导出直送收货单异常:{}", e);
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
	public void exportTemp(HttpServletResponse response, String type) {
		LOG.debug("导出采购导入模板请求参数,type={}", type);
		try {
			String fileName = "";
			String templateName = "";
			if (GoodsSelectImportHandle.TYPE_SKU_CODE.equals(type)) {
				templateName = ExportExcelConstant.DIRECT_RECEIPT_SKUCODE_TEMPLE;
				fileName = "货号导入模板";
			} else if (GoodsSelectImportHandle.TYPE_BAR_CODE.equals(type)) {
				templateName = ExportExcelConstant.DIRECT_RECEIPT_BARCODE_TEMPLE;
				fileName = "条码导入模板";
			}
			if (StringUtils.isNotBlank(fileName) && StringUtils.isNotBlank(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出直送收货导入模板异常", e);
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
