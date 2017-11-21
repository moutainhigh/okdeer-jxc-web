/** 
 *@Project: ysc-jxc-web 
 *@Author: taomm
 *@Date: 2016年7月18日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.goods;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.base.common.exception.ServiceException;
import com.okdeer.base.common.utils.UuidUtils;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.SysConstant;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.enums.GoodsStatusEnum;
import com.okdeer.jxc.common.enums.GoodsTypeEnum;
import com.okdeer.jxc.common.enums.NewGoodsApplyEnum;
import com.okdeer.jxc.common.enums.PricingTypeEnum;
import com.okdeer.jxc.common.enums.SaleWayEnum;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.goodselect.NewGoodsApplyImportComponent;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.goods.entity.GoodsBrand;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByPurchase;
import com.okdeer.jxc.goods.entity.GoodsSku;
import com.okdeer.jxc.goods.entity.NewGoodsApply;
import com.okdeer.jxc.goods.qo.GoodsBrandQo;
import com.okdeer.jxc.goods.qo.NewGoodsApplyQo;
import com.okdeer.jxc.goods.service.GoodsBarcodeService;
import com.okdeer.jxc.goods.service.GoodsBrandServiceApi;
import com.okdeer.jxc.goods.service.GoodsSkuServiceApi;
import com.okdeer.jxc.goods.service.NewGoodsApplyServiceApi;
import com.okdeer.jxc.supplier.po.SupplierPo;
import com.okdeer.jxc.supplier.qo.SupplierQo;
import com.okdeer.jxc.supplier.service.SupplierServiceApi;
import com.okdeer.jxc.system.entity.SysOperateLog;
import com.okdeer.jxc.system.service.SysOperateLogService;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: NewGoodsApplyController 
 * @Description: 新品申请controller
 * @author zhongy
 * @date 2017年02月14日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    进销存2.2.0		   2017年02月14日                     zhongy               新增
 */
@Controller
@RequestMapping("goods/newGoodsApply")
public class NewGoodsApplyController extends BaseController<NewGoodsApplyController> {

	@Reference(version = "1.0.0", check = false)
	private NewGoodsApplyServiceApi newGoodsApplyService;

	@Reference(version = "1.0.0", check = false)
	private GoodsBrandServiceApi goodsBrandService;

	@Reference(version = "1.0.0", check = false)
	private SupplierServiceApi supplierService;

	@Reference(version = "1.0.0", check = false)
	private GoodsSkuServiceApi goodsSkuService;

	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesServiceApi;

	@Autowired
	private NewGoodsApplyImportComponent newGoodsApplyImportComponent;

	@Reference(version = "1.0.0", check = false)
	private GoodsBarcodeService goodsBarcodeService;

	@Reference(version = "1.0.0", check = false)
	private SysOperateLogService sysOperateLogService;

	/**
	 * 
	 * @Description: 新品申请调整页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "view")
	public String view() {
		return "newGoodsApply/newGoodsApplyList";
	}

	/**
	 * @Description: 根据类目查询新品申请列表
	 * @param vo
	 * @return List<NewGoodsApplyQo>  
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "queryNewGoodsApply", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<NewGoodsApply> queryNewGoodsApply(NewGoodsApplyQo qo, String categoryCode1, String brandId1,
			String supplierId1, @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		if (StringUtils.isNotBlank(categoryCode1)) {
			qo.setCategoryCode(categoryCode1);
		}
		if (StringUtils.isNotBlank(brandId1)) {
			qo.setBrandId(brandId1);
		}
		if (StringUtils.isNotBlank(supplierId1)) {
			qo.setSupplierId(supplierId1);
		}
		if (qo.getEndTime() != null) {
			qo.setEndTime(DateUtils.getNextDay(qo.getEndTime()));
		}
		// 默认当前机构
		qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());

		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);
		PageUtils<NewGoodsApply> page = newGoodsApplyService.queryPageByParams(qo);
        // 过滤数据权限字段
        cleanAccessData(page);
		return page;
	}

	/**
	 * @Description: 新品申请新增跳转页
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "addGoodsView")
	public String addGoods(Model model, HttpServletRequest request) {
		model.addAttribute("date", DateUtils.getCurrSmallRStr());
		model.addAttribute("action", "create");

		// 品牌查询
		GoodsBrandQo brand = new GoodsBrandQo();
		brand.setBrandCodeOrName("其他");
		brand.setPageNumber(Constant.ONE);
		brand.setPageSize(Constant.ONE);
		PageUtils<GoodsBrand> goodsBrands = goodsBrandService.queryLists(brand);
		model.addAttribute("goodsBrand", goodsBrands.getList().get(0));

		// 供应商查询
		String branchId = "";
		List<SupplierPo> suppliers = new ArrayList<SupplierPo>();
		Integer branchType = UserUtil.getCurrBranchType();
		if (branchType.compareTo(BranchTypeEnum.SELF_STORE.getCode()) == 0
				|| branchType.compareTo(BranchTypeEnum.FRANCHISE_STORE_B.getCode()) == 0
				|| branchType.compareTo(BranchTypeEnum.FRANCHISE_STORE_C.getCode()) == 0) {
			branchId = UserUtil.getCurrBranchId();
			suppliers = findSupplier(branchId);
			if (CollectionUtils.isEmpty(suppliers)) {
				Branches branches = branchesServiceApi.getBranchInfoById(UserUtil.getCurrBranchId());
				suppliers = findSupplier(branches.getParentId());
			}
		} else {
			branchId = UserUtil.getCurrBranchId();
			suppliers = findSupplier(branchId);
		}

		model.addAttribute("supplier", suppliers.get(0));
		// 将计价方式，商品状态，商品类型的枚举放入model中
		addEnum(model);

		// 如果选择了类别，则可以查询出普通商品的货号
		String rootCategoryCode = request.getParameter("rootCategoryCode");
		if (StringUtils.isNotEmpty(rootCategoryCode)) {
			GoodsSku sku = new GoodsSku();
			sku.setSkuCode(goodsSkuService.getSkuCodeByPricingType(PricingTypeEnum.ORDINARY, rootCategoryCode));
			model.addAttribute("data", sku);
		}
		return "newGoodsApply/addNewGoodsApply";
	}

	private List<SupplierPo> findSupplier(String branchId) {
		SupplierQo supplier = new SupplierQo();
		supplier.setSupplierName("默认供应商");
		supplier.setBranchId(branchId);
		supplier.setPageNumber(Constant.ONE);
		supplier.setPageSize(Constant.ONE);
		PageUtils<SupplierPo> suppliers = supplierService.queryLists(supplier);
		List<SupplierPo> list = suppliers.getList();
		return list;
	}

	/**
	 * 
	 * @Description: 商品复制跳转页
	 * @param model
	 * @param request
	 * @return
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "copyGoodsView")
	public String copyGoodsView(Model model, String id) {
		model.addAttribute("date", DateUtils.getCurrSmallRStr());
		model.addAttribute("action", "copy");

		NewGoodsApply sku = newGoodsApplyService.selectByPrimaryKey(id);
		sku.setId(null); // 此处把id设置为空，保存时复制和新增就可以共用一个controller方法
		sku.setSkuCode(null); // 货号
		sku.setSkuName(null); // 商品名称
		sku.setBarCode(null); // 条码
		model.addAttribute("data", sku);
		// 将计价方式，商品状态，商品类型的枚举放入model中
		addEnum(model);

		return "newGoodsApply/addNewGoodsApply";
	}

	/**
	 * @Description: 修改页跳转
	 * @param model
	 * @param request
	 * @return
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "updateGoodsView")
	public String updateGoodsView(Model model, String id) {
		model.addAttribute("date", DateUtils.getCurrSmallRStr());
		model.addAttribute("action", "update");

		NewGoodsApply sku = newGoodsApplyService.selectByPrimaryKey(id);
		model.addAttribute("data", sku);
		// 将计价方式，商品状态，商品类型的枚举放入model中
		model.addAttribute("goodpPicingType", sku.getPricingType().ordinal());
		addEnum(model);

		NewGoodsApplyEnum examineStatus = sku.getExamineStatus();
		if (NewGoodsApplyEnum.EXAMINE_PASS.equals(examineStatus)) {
			return "newGoodsApply/viewNewGoodsApply";
		}
		return "newGoodsApply/updateNewGoodsApply";
	}

	/**
	 * 
	 * @Description: 修改商品时，根据商品id获取商品信息
	 * @param request
	 * @return
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "getGoodsSkuById")
	@ResponseBody
	public RespJson getGoodsSkuById(HttpServletRequest request) {
		String id = request.getParameter("id");
		if (StringUtils.isNotEmpty(id)) {
			NewGoodsApply sku = newGoodsApplyService.selectByPrimaryKey(id);
			sku.setSaleWayName(SaleWayEnum.getValue(sku.getSaleWay()));
			RespJson jesp = RespJson.success();
			NewGoodsApplyEnum examineStatus = sku.getExamineStatus();
            if (NewGoodsApplyEnum.EXAMINE_PASS.equals(examineStatus)) {
                // 过滤数据权限字段
                cleanAccessData(sku);
            }
			jesp.put("_data", sku);
			return jesp;
		} else {
			RespJson jesp = RespJson.error("商品id为空");
			return jesp;
		}
	}

	/**
	 * @Description: 类别选择跳转页
	 * @return String  
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "chooseCategory")
	public String chooseCategory() {
		return "archive/goods/chooseCategory";
	}

	/**
	 * 
	 * @Description: 新增商品
	 * @param sku
	 * @return
	 * @author zhongy
	 * @date 2017年02月14日
	 */
	@RequestMapping(value = "addGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addGoods(@Valid NewGoodsApply sku, BindingResult validate) {
		if (validate.hasErrors()) {
			String errorMessage = validate.getFieldError().getDefaultMessage();
			return RespJson.error(errorMessage);
		}
		if (StringUtils.isEmpty(sku.getCategoryCode())) {
			return RespJson.error("请选择商品类别！");
		}
		try {
			sku.setBarCode(sku.getBarCode().replace(" ", ""));
			// 如果非普通商品没有设置条码，则把当前商品代码
			if (StringUtils.isEmpty(sku.getBarCode()) && !PricingTypeEnum.ORDINARY.equals(sku.getPricingType())) {
				sku.setBarCode(sku.getSkuCode());
			}
			BigDecimal price = BigDecimal.ZERO;
			if (sku.getSalePrice() == null) {
				sku.setSalePrice(price);
			}
			if (sku.getVipPrice() == null || sku.getVipPrice().compareTo(price) == 0) {
				sku.setVipPrice(sku.getSalePrice());
			}
			if (sku.getPurchasePrice() == null) {
				sku.setPurchasePrice(price);
			}
			if (sku.getDistributionPrice() == null) {
				sku.setDistributionPrice(price);
			}
			if (sku.getWholesalePrice() == null) {
				sku.setWholesalePrice(price);
			}
			if (sku.getLowestPrice() == null) {
				sku.setLowestPrice(price);
			}
			// 申请机构
			sku.setBranchId(UserUtil.getCurrBranchId());
			sku.setCreateUserId(UserUtil.getCurrUserId());
			sku.setId(UuidUtils.getUuid());
			List<NewGoodsApply> newGoodsApplys = new ArrayList<NewGoodsApply>();
			newGoodsApplys.add(sku);
			newGoodsApplyService.batchSaveNewGoodsApply(newGoodsApplys);
			RespJson json = RespJson.success();
			json.put("id", sku.getId());
			return json;
		} catch (Exception e) {
			LOG.error("新增商品异常:", e);
			return RespJson.error(e.toString());
		}
	}

	/**
	 * @Description: 修改商品
	 * @param sku
	 * @return
	 * @author taomm
	 * @date 2016年8月3日
	 */
	@RequestMapping(value = "updateGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateGoods(@Valid NewGoodsApply sku, BindingResult validate) {
		if (validate.hasErrors()) {
			String errorMessage = validate.getFieldError().getDefaultMessage();
			return RespJson.error(errorMessage);
		}
		try {
			sku.setBarCode(sku.getBarCode().replace(" ", ""));
			BigDecimal price = BigDecimal.ZERO;
			if (sku.getSalePrice() == null) {
				sku.setSalePrice(price);
			}
			if (sku.getVipPrice() == null) {
				sku.setVipPrice(price);
			}
			if (sku.getPurchasePrice() == null) {
				sku.setPurchasePrice(price);
			}
			if (sku.getDistributionPrice() == null) {
				sku.setDistributionPrice(price);
			}
			if (sku.getWholesalePrice() == null) {
				sku.setWholesalePrice(price);
			}
			if (sku.getLowestPrice() == null) {
				sku.setLowestPrice(price);
			}
			
			sku.setUpdateTime(new Date());
			sku.setUpdateUserId(getCurrUserId());
			newGoodsApplyService.updateByPrimaryKey(sku);
			return RespJson.success();
		} catch (Exception e) {
			LOG.error("修改商品异常:", e);
			return RespJson.error(e.toString());
		}
	}

	/**
	 * 删除
	 * @param ids
	 * @return
	 * @author zhongy
	 * @date 2017年02月15日
	 */
	@RequestMapping(value = "delGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson delete(String ids) {
		RespJson resp = RespJson.success();
		try {
			if (StringUtils.isNotBlank(ids)) {
				String[] arr = ids.split(",");
				// 1 校验新品状态
				List<String> idList = Arrays.asList(arr);
				List<Integer> examineStatusList = new ArrayList<Integer>();
				examineStatusList.add(Constant.ONE);
				examineStatusList.add(Constant.TWO);
				List<NewGoodsApply> list = newGoodsApplyService.selectByIds(idList, examineStatusList);
				StringBuffer sb = new StringBuffer();
				for (NewGoodsApply newGoodsApply : list) {
					sb.append(newGoodsApply.getSkuName() + ",");
				}
				if (StringUtils.isNotBlank(sb)) {
					resp = RespJson.error("商品名称：【" + sb.substring(0, sb.length() - 1) + "】状态为已审核，不能删除!");
					return resp;
				}
				
				List<NewGoodsApply> oplist = newGoodsApplyService.selectByIds(idList);

				// 2 删除新品
				newGoodsApplyService.deleteByIds(idList);

				// 操作日志
				addOpLog(oplist);
			}
		} catch (ServiceException e) {
			LOG.error("删除新品申请异常：", e);
			resp = RespJson.error("删除新品申请异常!");
		}
		return resp;
	}

	/**
	 * @Description: 操作日志
	 * @param list
	 * @author liwb
	 * @date 2017年6月22日
	 */
	private void addOpLog(List<NewGoodsApply> list) {

		if (CollectionUtils.isEmpty(list)) {
			return;
		}

		SysOperateLog opLog = null;
		List<SysOperateLog> oplogList = new ArrayList<SysOperateLog>();
		for (NewGoodsApply goods : list) {
			opLog = buildOpLog(3, goods, "删除新品");
			oplogList.add(opLog);
		}
		sysOperateLogService.batchAddSysOpLog(oplogList);
	}

	/**
	 * @Description: 构建新品操作日志
	 * @param operateType
	 * @param currUserId
	 * @param branchId
	 * @param skuId
	 * @param content
	 * @return
	 * @author liwb
	 * @date 2017年6月22日
	 */
	private SysOperateLog buildOpLog(Integer operateType, NewGoodsApply goods, String content) {
		String branchId = goods.getBranchId();
		// 为空则默认为总部
		branchId = StringUtils.isBlank(branchId) ? SysConstant.MANAGER_BRANCH_ID : branchId;

		String title = goods.getSkuName();
		// 组装系统操作日志数据
		SysOperateLog opLog = new SysOperateLog();
		opLog.setId(UuidUtils.getUuid());
		opLog.setBranchId(branchId);
		opLog.setOperateName("新品申请");
		opLog.setOperateType(operateType);
		opLog.setTitle(title);
		opLog.setContent(content);
		opLog.setCreateUserId(getCurrUserId());
		opLog.setCreateTime(new Date());

		return opLog;
	}

	/**
	 * 审核新品申请
	 * @param ids
	 * @return
	 * @author zhongy
	 * @date 2017年02月15日
	 */
	@RequestMapping(value = "auditingGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson auditingGoods(String ids) {
		RespJson resp = RespJson.success();
		try {
			if (StringUtils.isNotBlank(ids)) {
				String[] arr = ids.split(",");
				List<String> list = Arrays.asList(arr);
				String updateUserId = UserUtil.getCurrUserId();
				resp = newGoodsApplyService.auditingGoods(list, NewGoodsApplyEnum.EXAMINE_PASS, updateUserId);
			}
		} catch (Exception e) {
			LOG.error("审核新品申请异常：", e);
			resp = RespJson.error("审核新品申请异常!");
		}
		return resp;
	}

	/**
	 * 
	 * @Description: 抽取出来需要放入model中键值对
	 * @param model
	 * @author taomm
	 * @date 2016年8月15日
	 */
	public void addEnum(Model model) {
		model.addAttribute("pricingType", PricingTypeEnum.values()); // 计价方式
		model.addAttribute("goodsStatus", GoodsStatusEnum.values()); // 商品状态
		model.addAttribute("goodsType", GoodsTypeEnum.values()); // 商品类型
	}

	/**
	 * 
	 * @Description: 商品验证条码、名称是否重复
	 * @param barCode
	 * @param skuName
	 * @param id
	 * @return
	 * @author zhongy
	 * @date 2017年02月15日
	 */
	@RequestMapping(value = "checkBarCodeByOrdinary", method = RequestMethod.POST)
	@ResponseBody
	public RespJson checkBarCodeByOrdinary(String barCode, String skuName, String id) {

		String currBranchId = UserUtil.getCurrBranchId();
		if (StringUtils.isNotBlank(barCode)) {
			barCode = barCode.replace(" ", "");
			// 1、校验标准库商品条码重复
			/**
			 * 2.4 新增条码表，判断是否重复要在条码表取值
			 */
			int isExistsBarCode = goodsBarcodeService.queryCountBaseByBarCode(barCode, id);
			if (isExistsBarCode > 0) {
				RespJson json = RespJson.error("商品条码在标准库重复");
				json.put("_data", barCode);
				return json;
			}
			// 2、校验新品申请库商品条码重复
			Integer barCodeSum = newGoodsApplyService.queryCountByBarCode(barCode.trim(), id, currBranchId);
			if (barCodeSum > 0) {
				RespJson json = RespJson.error("商品条码在新品申请中重复");
				json.put("_data", barCode);
				return json;
			}
		}
		if (StringUtils.isNotBlank(skuName)) {
			// 3、校验标准库商品名称重复
			boolean isExistsSkuName = goodsSkuService.isExistsBySkuName(skuName.trim(), id);
			if (isExistsSkuName) {
				RespJson json = RespJson.error("商品名称在标准库重复");
				json.put("_data", barCode);
				return json;
			}

			// 4、校验新品申请库商品名称重复
			Integer skuNameSum = newGoodsApplyService.queryCountBySkuName(skuName.trim(), id, currBranchId);
			if (skuNameSum > 0) {
				RespJson json = RespJson.error("商品名称在新品申请中重复");
				json.put("_data", barCode);
				return json;
			}
		} else {
			RespJson json = RespJson.error("商品名称为空");
			json.put("_data", barCode);
			return json;
		}
		RespJson json = RespJson.success();
		json.put("_data", barCode);
		return json;
	}

	/**
	 * 
	 * @Description: 根据商品名称获取助记码
	 * @param skuName
	 * @return
	 * @author taomm
	 * @date 2016年8月15日
	 */
	@RequestMapping(value = "getMemoryCode", method = RequestMethod.POST)
	@ResponseBody
	public String getMemoryCode(String skuName) {
		String memoryCode = null;
		memoryCode = goodsSkuService.getMemoryCode(skuName);
		return memoryCode;
	}

	/**
	 * 
	 * @Description: 根据计价方式和类别编码获取货号
	 * @param pricingType
	 * @param categoryCode
	 * @return
	 * @author taomm
	 * @date 2016年8月18日
	 */
	@RequestMapping(value = "getSkuCode", method = RequestMethod.POST)
	@ResponseBody
	public String getSkuCode(String pricingType, String categoryCode) {
		PricingTypeEnum type = PricingTypeEnum.enumNameOf(pricingType);
		goodsSkuService.getSkuCodeByPricingType(type, categoryCode);
		String code = goodsSkuService.getSkuCodeByPricingType(type, categoryCode);
		return code;
	}

	/**
	 * 
	 * @Description: 计件、计重商品获取条码
	 * @param pricingType
	 * @param SkuCode
	 * @return
	 * @author taomm
	 * @date 2016年8月19日
	 */
	@RequestMapping(value = "getBarCode", method = RequestMethod.POST)
	@ResponseBody
	public String getBarCode(String pricingType, String SkuCode) {
		PricingTypeEnum type = PricingTypeEnum.enumNameOf(pricingType);
		String barCode = goodsSkuService.getBarCode(type, SkuCode);
		return barCode;
	}

	/**
	 * @Description: 导出
	 * @param qo
	 * @param response
	 * @return
	 * @author lijy02
	 * @date 2016年9月14日
	 */
	@RequestMapping(value = "exportGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportGoods(NewGoodsApplyQo qo, String categoryCode1, String brandId1, String supplierId1,
			HttpServletResponse response) {
		try {
			if (StringUtils.isNotBlank(categoryCode1)) {
				qo.setCategoryCode(categoryCode1);
			}
			if (StringUtils.isNotBlank(brandId1)) {
				qo.setBrandId(brandId1);
			}
			if (StringUtils.isNotBlank(supplierId1)) {
				qo.setSupplierId(supplierId1);
			}
			if (qo.getEndTime() != null) {
				qo.setEndTime(DateUtils.getNextDay(qo.getEndTime()));
			}
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());

			List<NewGoodsApply> list = newGoodsApplyService.queryListByParams(qo);
			if (CollectionUtils.isNotEmpty(list)) {
				handleDateReport(list);
				if (list.size() > ExportExcelConstant.EXPORT_MAX_SIZE) {
					RespJson json = RespJson.error("最多只能导出" + ExportExcelConstant.EXPORT_MAX_SIZE + "条数据");
					return json;
				}
				String fileName = "新品申请导出" + "_" + DateUtils.getCurrSmallStr();
				String templateName = ExportExcelConstant.NEW_GOODS_APPLY_REPORT;
				// 过滤数据权限字段
		        cleanAccessData(list);
				exportListForXLSX(response, list, fileName, templateName);
			} else {
				RespJson json = RespJson.error("无数据可导");
				return json;
			}
		} catch (Exception e) {
			LOG.error("导出商品失败", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}

	// 导出数据特殊处理
	private List<NewGoodsApply> handleDateReport(List<NewGoodsApply> exportList) {
		for (NewGoodsApply vo : exportList) {
			if (vo.getSalePrice() != null && vo.getSalePrice().compareTo(BigDecimal.ZERO) == 1
					&& vo.getPurchasePrice() != null) {
				BigDecimal marginTax = vo.getSalePrice().subtract(vo.getPurchasePrice());
				marginTax = marginTax.multiply(new BigDecimal(100));
				BigDecimal val = marginTax.divide(vo.getSalePrice(), 2, BigDecimal.ROUND_HALF_UP);
				vo.setMarginTax(val + "%");
			} else {
				vo.setMarginTax("00.00%");
			}
		}
		return exportList;
	}

	/**
	 * 商品导入
	 * @param file
	 * @return
	 * @author zhongy
	 * @date 2017年02月16日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String type) {
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

			// 当前导入用户id
			String userId = UserUtil.getCurrUserId();

			// 当前导入机构id
			String branchId = UserUtil.getCurrBranchId();

			String[] field = new String[] { "skuName", "barCode", "purchasePrice", "salePrice", "vipPrice",
					"distributionPrice", "wholesalePrice", "categoryCode", "spec", "unit", "purchaseSpec",
					"distributionSpec", "brandCode", "vaildity", "originPlace", "pricingType", "type", "managerStock",
					"fastDeliver", "allowActivity", "allowAdjust", "remark" };

			GoodsSelectImportVo<GoodsSelect> vo = newGoodsApplyImportComponent.importSelectGoods(fileName, is, field,
					new GoodsSelectByPurchase(), branchId, userId, type, "/goods/newGoodsApply/downloadErrorFile",
					new GoodsSelectImportBusinessValid() {

						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {
							for (JSONObject obj : excelListSuccessData) {
								String type = obj.getString("type");
								boolean managerStock = obj.getString("managerStock").equals("是");
								GoodsTypeEnum typeEnum = GoodsTypeEnum.ORDINARY;
								if (!StringUtils.isBlank(type)) {
									typeEnum = GoodsTypeEnum.enumValueOf(type);
								}
								if (typeEnum == GoodsTypeEnum.BIND && managerStock) {
									obj.element("error", "捆绑商品不可以管理库存");
								}
								if (typeEnum == GoodsTypeEnum.AUTOMATICTRANSFER && managerStock) {
									obj.element("error", "自动转货不可以管理库存");
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
						}

						/**
						 * (non-Javadoc)
						 * @see com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid#errorDataFormatter(java.util.List)
						 */
						@Override
						public void errorDataFormatter(List<JSONObject> list) {
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
		String[] headers = new String[] { "商品名称", "条形码", "进货价", "零售价", "会员价", "配送价", "批发价", "小类编码", "规格", "库存单位",
				"采购规格", "配送规格", "品牌编码", "保质期天数", "产地", "计价方式", "商品类型", "备注" };
		String[] columns = new String[] { "skuName", "barCode", "purchasePrice", "salePrice", "vipPrice",
				"distributionPrice", "wholesalePrice", "categoryCode", "spec", "unit", "purchaseSpec",
				"distributionSpec", "brandCode", "vaildity", "originPlace", "pricingType", "type", "remark" };
		newGoodsApplyImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * @Description: 新品申请导入模板下载
	 * @param response
	 * @author zhongy
	 * @date 2017年02月16日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response) {
		try {
			String fileName = "新品申请导入模板";
			String templateName = ExportExcelConstant.NEW_GOODS_APPLY_TEMPLE;
			if (StringUtils.isNotBlank(fileName) && StringUtils.isNotBlank(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("新品申请导入模板下载异常", e);
		}
	}

}
