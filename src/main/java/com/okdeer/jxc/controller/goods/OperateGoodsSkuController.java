/** 
 *@Project: ysc-jxc-web 
 *@Author: taomm
 *@Date: 2016年7月18日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.goods;

import java.math.BigDecimal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.enums.GoodsStatusEnum;
import com.okdeer.jxc.common.enums.GoodsTypeEnum;
import com.okdeer.jxc.common.enums.PricingTypeEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.goods.entity.GoodsBrand;
import com.okdeer.jxc.goods.entity.GoodsSku;
import com.okdeer.jxc.goods.qo.GoodsBrandQo;
import com.okdeer.jxc.goods.qo.GoodsSkuQo;
import com.okdeer.jxc.goods.service.GoodsBarcodeService;
import com.okdeer.jxc.goods.service.GoodsBrandServiceApi;
import com.okdeer.jxc.goods.service.GoodsSkuServiceApi;
import com.okdeer.jxc.goods.vo.GoodsSkuVo;
import com.okdeer.jxc.supplier.po.SupplierPo;
import com.okdeer.jxc.supplier.qo.SupplierQo;
import com.okdeer.jxc.supplier.service.SupplierServiceApi;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: OperateGoodsSkuController 
 * @Description: 运营商品档案controller
 * @author zhangchm
 * @date 2017年5月26日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("common/operateGoods")
public class OperateGoodsSkuController extends BaseController<OperateGoodsSkuController> {

	@Reference(version = "1.0.0", check = false)
	private GoodsSkuServiceApi goodsSkuService;
	
	@Reference(version = "1.0.0", check = false)
	private GoodsBrandServiceApi goodsBrandService;
	
	@Reference(version = "1.0.0", check = false)
	private SupplierServiceApi supplierService;
	
	@Reference(version = "1.0.0", check = false)
	private GoodsBarcodeService goodsBarcodeService;
	/**
	 * 
	 * @Description: 商品档案跳转页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "view")
	public String view() {
		return "operateArchive/goods/goodsList";
	}

	/**
	 * 
	 * @Description: 根据类目查询商品列表
	 * @param vo
	 * @return   
	 * @return List<GoodsSkuVo>  
	 * @throws
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "queryGoodsSku", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsSku> queryGoodsSku(
			GoodsSkuQo qo,String categoryCode1,String brandId1,String supplierId1,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.debug("qo:" + qo.toString());
		if (!qo.isOutGoods()) {// 淘汰商品
			qo.setStatus(GoodsStatusEnum.OBSOLETE.ordinal());
		}
		if(StringUtils.isNotBlank(categoryCode1)){
			qo.setCategoryCode(categoryCode1);
		}
		if(StringUtils.isNotBlank(brandId1)){
			qo.setBrandId(brandId1);
		}
		if(StringUtils.isNotBlank(supplierId1)){
			qo.setSupplierId(supplierId1);
		}
		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);
		PageUtils<GoodsSku> page = goodsSkuService.queryOperateSkuByPage(qo);
		LOG.debug("page" + page.toString());
		return page;
	}

	/**
	 * 
	 * @Description: 商品新增跳转页
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "addGoodsView")
	public String addGoodsView(Model model, HttpServletRequest request) {
		model.addAttribute("date", DateUtils.getCurrSmallRStr());
		model.addAttribute("action", "create");
		
		//品牌查询
		GoodsBrandQo  brand = new GoodsBrandQo();
		brand.setBrandCodeOrName("其他");
		brand.setPageNumber(Constant.ONE);
		brand.setPageSize(Constant.ONE);
		PageUtils<GoodsBrand> goodsBrands = goodsBrandService.queryLists(brand);
		model.addAttribute("goodsBrand", goodsBrands.getList().get(0));
		
		//供应商查询
		SupplierQo supplier = new SupplierQo();
		supplier.setSupplierName("默认供应商");
		String branchId = UserUtil.getCurrBranchId();
		supplier.setBranchId(branchId);
		supplier.setPageNumber(Constant.ONE);
		supplier.setPageSize(Constant.ONE);
		PageUtils<SupplierPo> suppliers = supplierService.queryLists(supplier);
		model.addAttribute("supplier", suppliers.getList().get(0));
		
		// 将计价方式，商品状态，商品类型的枚举放入model中
		addEnum(model);

		// 如果选择了类别，则可以查询出普通商品的货号
		String rootCategoryCode = request.getParameter("rootCategoryCode");
		if (StringUtils.isNotEmpty(rootCategoryCode)) {
			GoodsSku sku = new GoodsSku();
			sku.setSkuCode(goodsSkuService.getSkuCodeByPricingType(
					PricingTypeEnum.ORDINARY, rootCategoryCode));
			model.addAttribute("data", sku);
		}
		return "operateArchive/goods/addGoods";
	}

	/**
	 * 
	 * @Description: 商品复制跳转页
	 * @param model
	 * @param request
	 * @return
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "copyGoodsView")
	public String copyGoodsView(Model model, String id) {
		model.addAttribute("date", DateUtils.getCurrSmallRStr());
		model.addAttribute("action", "copy");

		GoodsSku sku = goodsSkuService.queryById(id);
		sku.setId(null); // 此处把id设置为空，保存时复制和新增就可以共用一个controller方法
		sku.setSkuCode(null); // 货号
		sku.setSkuName(null); // 商品名称
		sku.setBarCode(null); // 条码

		model.addAttribute("data", sku);
		// 将计价方式，商品状态，商品类型的枚举放入model中
		addEnum(model);

		return "operateArchive/goods/addGoods";
	}

	/**
	 * 
	 * @Description: 修改页跳转
	 * @param model
	 * @param request
	 * @return
	 * @author taomm
	 * @date 2016年8月15日
	 */
	@RequestMapping(value = "updateGoodsView")
	public String updateGoodsView(Model model, String id) {
		model.addAttribute("date", DateUtils.getCurrSmallRStr());
		model.addAttribute("action", "update");

		GoodsSku sku = goodsSkuService.queryById(id);
		model.addAttribute("data", sku);
		// 将计价方式，商品状态，商品类型的枚举放入model中
		model.addAttribute("goodpPicingType", sku.getPricingType().ordinal());
		addEnum(model);

		return "operateArchive/goods/updateGoods";
	}

	/**
	 * 
	 * @Description: 修改商品时，根据商品id获取商品信息
	 * @param request
	 * @return
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "getGoodsSkuById")
	@ResponseBody
	public RespJson getGoodsSkuById(HttpServletRequest request) {
		String id = request.getParameter("id");
		if (StringUtils.isNotEmpty(id)) {
			GoodsSku sku = goodsSkuService.queryById(id);
			RespJson jesp = RespJson.success();
			jesp.put("_data", sku);
			return jesp;
		} else {
			RespJson jesp = RespJson.error("商品id为空");
			return jesp;
		}
	}

	/**
	 * 
	 * @Description: 类别选择跳转页
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "chooseCategory")
	public String chooseCategory() {
		return "operateArchive/goods/chooseCategory";
	}

	/**
	 * 
	 * @Description: 新增商品
	 * @param sku
	 * @return
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "addGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addGoods(@Valid GoodsSkuVo sku, BindingResult validate) {
		if (validate.hasErrors()) {
			String errorMessage = validate.getFieldError().getDefaultMessage();
			LOG.warn("validate errorMessage:" , errorMessage);
			return RespJson.error(errorMessage);
		}
		if(StringUtils.isEmpty(sku.getCategoryCode())){
			return RespJson.error("请选择商品类别！");
		}
		
		//校验零售价
		BigDecimal salePrice = sku.getSalePrice();
		if(salePrice == null){
			return RespJson.error("零售价不能为空");
		}
		BigDecimal price = BigDecimal.ZERO;
		if(salePrice.compareTo(price) == 0) {
			return RespJson.error("零售价必须大于0");
		}
		
		
		try {
			// 如果非普通商品没有设置条码，则把当前商品代码
			if (StringUtils.isEmpty(sku.getBarCode())
					&& !PricingTypeEnum.ORDINARY.equals(sku.getPricingType())) {
				sku.setBarCode(sku.getSkuCode());
			}
			
			if (sku.getVipPrice()==null || sku.getVipPrice().compareTo(price)==0) {
				sku.setVipPrice(sku.getSalePrice());
			}
			
			if (sku.getPurchasePrice()==null) {
				sku.setPurchasePrice(price);
			}
			
			if (sku.getDistributionPrice()==null) {
				sku.setDistributionPrice(price);
			}
			if (sku.getWholesalePrice()==null) {
				sku.setWholesalePrice(price);
			}
			if (sku.getLowestPrice()==null) {
				sku.setLowestPrice(price);
			}
			sku.setUpdateUserId(UserUtil
					.getCurrentUser().getId());
			sku.setDisabled(3);
			RespJson json = goodsSkuService.addGoodsSku(sku, UserUtil.getCurrentUser().getId());
			return json;
		} catch (Exception e) {
			LOG.error("新增商品异常:", e);
			return RespJson.error("新增商品异常");
		}
	}

	/**
	 * 
	 * @Description: 修改商品
	 * @param sku
	 * @return
	 * @author taomm
	 * @date 2016年8月3日
	 */
	@RequestMapping(value = "updateGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateGoods(@Valid GoodsSkuVo sku, BindingResult validate) {
		if (validate.hasErrors()) {
			String errorMessage = validate.getFieldError().getDefaultMessage();
			LOG.warn("validate errorMessage:", errorMessage);
			return RespJson.error(errorMessage);
		}
		
		//校验零售价
		BigDecimal salePrice = sku.getSalePrice();
		if(salePrice == null){
			return RespJson.error("零售价不能为空");
		}
		BigDecimal price = BigDecimal.ZERO;
		if(salePrice.compareTo(price) == 0) {
			return RespJson.error("零售价必须大于0");
		}
		
		try {
			if (sku.getVipPrice()==null || sku.getVipPrice().compareTo(price) == 0) {
				sku.setVipPrice(sku.getSalePrice());
			}
			if (sku.getPurchasePrice()==null) {
				sku.setPurchasePrice(price);
			}
			if (sku.getDistributionPrice()==null) {
				sku.setDistributionPrice(price);
			}
			if (sku.getWholesalePrice()==null) {
				sku.setWholesalePrice(price);
			}
			if (sku.getLowestPrice()==null) {
				sku.setLowestPrice(price);
			}
			return goodsSkuService.updateGoodsSku(sku, UserUtil.getCurrentUser().getId());
		} catch (Exception e) {
			LOG.error("修改商品异常:", e);
			return RespJson.error("修改商品异常");
		}
	}

	/**
	 * 
	 * @Description: 删除商品
	 * @param request
	 * @return
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "delGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson delGoods(String id) {
		try {
			return goodsSkuService.delGoodsById(id, UserUtil.getCurrentUser()
					.getId());

		} catch (Exception e) {
			LOG.error("删除商品失败:", e);
			return RespJson.error("删除商品失败:");
		}
	}

	/**
	 * 
	 * @Description: 抽取出来需要放入model中键值对
	 * @param model
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	public void addEnum(Model model) {
		model.addAttribute("pricingType", PricingTypeEnum.values()); // 计价方式
		model.addAttribute("goodsStatus", GoodsStatusEnum.values()); // 商品状态
		model.addAttribute("goodsType", GoodsTypeEnum.values()); // 商品类型
	}

	/**
	 * 
	 * @Description: 普通商品验证条码是否重复  true：重复   false：不重复
	 * @param barCode
	 * @return
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "checkBarCodeByOrdinary", method = RequestMethod.POST)
	@ResponseBody
	public RespJson checkBarCodeByOrdinary(String barCode, String id) {
		/**
		 * 2.4 新增条码表，判断是否重复要在条码表取值
		 */
		boolean isExists = goodsBarcodeService.barCodeIsExist(barCode,id);
		if (isExists) { // 重复
			RespJson json = RespJson.error("商品条码重复");
			json.put("_data", barCode);
			return json;
		} else {
			RespJson json = RespJson.success();
			json.put("_data", barCode);
			return json;
		}
	}

	/**
	 * 
	 * @Description: 根据商品名称获取助记码
	 * @param skuName
	 * @return
	 * @author zhangchm
	 * @date 2017年5月26日
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
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "getSkuCode", method = RequestMethod.POST)
	@ResponseBody
	public String getSkuCode(String pricingType, String categoryCode) {
		PricingTypeEnum type = PricingTypeEnum.enumNameOf(pricingType);
		goodsSkuService.getSkuCodeByPricingType(type, categoryCode);
		String code = goodsSkuService.getSkuCodeByPricingType(type,
				categoryCode);
		return code;
	}

	/**
	 * 
	 * @Description: 计件、计重商品获取条码
	 * @param pricingType
	 * @param SkuCode
	 * @return
	 * @author zhangchm
	 * @date 2017年5月26日
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
	 * @author zhangchm
	 * @date 2017年5月26日
	 */
	@RequestMapping(value = "exportGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportGoods(GoodsSkuQo qo, 
			String categoryCode1,String brandId1,String supplierId1,
			HttpServletResponse response) {
		try {
			if(StringUtils.isNotBlank(categoryCode1)){
				qo.setCategoryCode(categoryCode1);
			}
			if(StringUtils.isNotBlank(brandId1)){
				qo.setBrandId(brandId1);
			}
			if(StringUtils.isNotBlank(supplierId1)){
				qo.setSupplierId(supplierId1);
			}
			if (!qo.isOutGoods()) {// 淘汰商品
				qo.setStatus(GoodsStatusEnum.OBSOLETE.ordinal());
			}
			
 			List<GoodsSku> list = goodsSkuService.querySkuByParams(qo);
			if (CollectionUtils.isNotEmpty(list)) {
				if (list.size() > ExportExcelConstant.EXPORT_MAX_SIZE) {
					RespJson json = RespJson.error("最多只能导出" + ExportExcelConstant.EXPORT_MAX_SIZE
							+ "条数据");
					return json;
				}
				// 导出文件名称，不包括后缀名
				String fileName = "商品档案列表" + "_" + DateUtils.getCurrSmallStr();
				// 模板名称，包括后缀名
				String templateName = ExportExcelConstant.GOODS_EXPORT_EXCEL;

				// 导出Excel
				list = handleDateReport(list);
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
	private List<GoodsSku> handleDateReport(List<GoodsSku> exportList) {
		for (GoodsSku vo : exportList) {
			if(vo.getSalePrice()!=null && vo.getSalePrice().compareTo(BigDecimal.ZERO) ==1 && vo.getPurchasePrice()!=null){
				BigDecimal marginTax = vo.getSalePrice().subtract(vo.getPurchasePrice());
				marginTax = marginTax.multiply(new BigDecimal(100));
				BigDecimal val =marginTax.divide(vo.getSalePrice(),2,BigDecimal.ROUND_HALF_UP);
				vo.setMarginTax(val+"%");
			}else{
				vo.setMarginTax("00.00%");
			}
		}
		return exportList;
	}

}
