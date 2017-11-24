/** 
 *@Project: okdeer-jxc-web 
 *@Author: yangyq02
 *@Date: 2016年8月3日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.goods;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Joiner;
import com.google.common.collect.Lists;
import com.okdeer.base.common.exception.ServiceException;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.result.ResultCodeEnum;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.scale.Message;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.form.purchase.service.PurchaseActivityService;
import com.okdeer.jxc.form.purchase.vo.PurchaseActivityDetailVo;
import com.okdeer.jxc.goods.entity.GoodsCategory;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectDeliver;
import com.okdeer.jxc.goods.qo.GoodsCategoryQo;
import com.okdeer.jxc.goods.service.GoodsCategoryServiceApi;
import com.okdeer.jxc.goods.service.GoodsSelectServiceApi;
import com.okdeer.jxc.goods.service.GoodsSupplierBranchServiceApi;
import com.okdeer.jxc.goods.vo.GoodsSelectVo;
import com.okdeer.jxc.goods.vo.GoodsSkuVo;
import com.okdeer.jxc.goods.vo.GoodsStockVo;
import com.okdeer.jxc.utils.UserUtil;
import net.sf.json.JSONArray;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

/**
 * ClassName: GoodsSelectController 
 * @Description: 商品选择Controller类
 * @author yangyq02
 * @date 2016年8月3日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *	进销存V2.0.0		2016年8月3日			       杨永钦  			           商品选择Controller类
 *	商业管理系统		2016.9.17			   李俊义				商品选择Controller类修改
 */
@Controller
@RequestMapping("goods/goodsSelect")
public class GoodsSelectController extends BaseController<GoodsSelectController> {

	@Reference(version = "1.0.0", check = false)
	private GoodsSelectServiceApi goodsSelectServiceApi;

	@Reference(version = "1.0.0", check = false)
	private GoodsCategoryServiceApi goodsCategoryService;

	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesService;

	@Reference(version = "1.0.0", check = false)
	GoodsSupplierBranchServiceApi goodsSupplierBranchServiceApi;

    @Reference(version = "1.0.0", check = false)
    private PurchaseActivityService purchaseActivityService;

	/**
	 * @Description: 商品选择view
	 * @param  model
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月3日
	 */
	@RequestMapping(value = "view")
	public String view(HttpServletRequest req, Model model) {
		LOG.debug("商品选择跳转页面参数:{}", req.toString());
		String type = req.getParameter("type");
		String supplierId = req.getParameter("supplierId");
		String sourceBranchId = req.getParameter("sourceBranchId");
		String targetBranchId = req.getParameter("targetBranchId");
		String branchId = req.getParameter("branchId");
		String categoryCodes = req.getParameter("categoryCodes");
		String isManagerStock = req.getParameter("isManagerStock");
		// 商品公共组件查询判断是否过滤捆绑商品
		String flag = req.getParameter("flag");
		model.addAttribute("flag", flag);
		model.addAttribute("type", type);
		model.addAttribute("searchSupplierId", supplierId);
		model.addAttribute("sourceBranchId", sourceBranchId);
		model.addAttribute("targetBranchId", targetBranchId);
		model.addAttribute("branchId", branchId);
		model.addAttribute("categoryCodes", categoryCodes);
		model.addAttribute("isManagerStock", isManagerStock);
		return "component/publicGoods";
	}

	/**
	 * @Description: 查询商品列表
	 * @param vo GoodsSelectVo商品选择VO
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return PageUtils<GoodsSelect>  
	 * @throws
	 * @author yangyq02 lijy02
	 * @date 2016年8月3日
	 */
	@RequestMapping(value = "getGoodsList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsSelect> getGoodsList(GoodsSelectVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			
			if(StringUtils.isEmpty(vo.getFormType())){
				vo.setFormType(vo.getType());
			}
			// 如果页面上有传入机构 则选择页面上的
			// 没有传入机构则选择登录机构
			String branchId = vo.getBranchId();
			if (StringUtils.isEmpty(branchId)) {
				vo.setBranchId(UserUtil.getCurrBranchId());
			}
			// 多机构查询
			if (branchId != null) {
                if (branchId.indexOf(",") != -1) {
                    vo.setBranchId("");
                    vo.setBranchIds(Arrays.asList(branchId.split(",")));
                } else if (FormType.PL.name().equals(vo.getFormType())) {
                    vo.setBranchId("");
                    vo.setBranchIds(Arrays.asList(branchId));
                }
            }

			// 多商品状态查询
			if (StringUtils.isNotBlank(vo.getStatuses())) {
				List<Integer> statusList = new ArrayList<>();
				for (String temp : vo.getStatuses().split(",")) {
					statusList.add(Integer.valueOf(temp));
				}
				vo.setStatusList(statusList);
			}

			// 如果formType 是属于配送中的数据 说明不需要管理库存
			if (FormType.DA.name().equals(vo.getFormType()) || FormType.DO.name().equals(vo.getFormType())
					|| FormType.DY.name().equals(vo.getFormType()) || FormType.DI.name().equals(vo.getFormType())
					|| FormType.DR.name().equals(vo.getFormType()) || FormType.DD.name().equals(vo.getFormType())) {
				vo.setIsManagerStock(1);
			}
			LOG.info("商品查询参数:{}" + vo.toString());
			// 要货单商品资料查询、价格查询
			if (FormType.DA.name().equals(vo.getFormType()) || FormType.DD.name().equals(vo.getFormType())
					|| FormType.DY.name().equals(vo.getFormType())) {
				PageUtils<GoodsSelect> goodsSelects = goodsSelectServiceApi.getGoodsListDA(vo);
				return replaceBarCode(goodsSelects, vo);
			}

			// 退货单
			if (FormType.DR.name().equals(vo.getFormType())) {
				PageUtils<GoodsSelect> goodsSelects = goodsSelectServiceApi.getGoodsListDR(vo);
				return replaceBarCode(goodsSelects, vo);
			}

			// 如果是促销活动页面查询商品，需要过滤掉不参加促销的商品
			if (FormType.PX.name().equals(vo.getFormType())) {
				vo.setAllowActivity(true);
			}
			// 如果是促销活动页面查询商品，需要过滤掉不参加促销的商品
			if (FormType.PS.name().equals(vo.getFormType())) {
				vo.setAllowAdjustPrice(true);
			}
			PageUtils<GoodsSelect> suppliers = null;
			if (FormType.PA.name().equals(vo.getFormType()) || FormType.PR.name().equals(vo.getFormType())
                    || FormType.PM.name().equals(vo.getFormType()) || FormType.PL.name().equals(vo.getFormType())) {
                // 直送收货需要过滤非淘汰、非停购的直送商品
				if (FormType.PM.name().equals(vo.getFormType())) {
					vo.setIsFastDeliver(1);
				}
				if (StringUtils.isNotBlank(vo.getSupplierId())) {
					// 根据机构id判断查询采购商品
					suppliers = queryPurchaseGoods(vo);
				} else {
					suppliers = goodsSelectServiceApi.queryLists(vo);
                    if (FormType.PA.name().equals(vo.getFormType())) {
                        List<GoodsSelect> goodsSelects = suppliers.getList();
                        List<String> skus = Lists.newArrayList();

                        for (GoodsSelect goodsSelect : goodsSelects) {
                            skus.add(goodsSelect.getId());
                        }

                        //查询促销商品价格
						List<PurchaseActivityDetailVo> purchaseActivityDetailVos = purchaseActivityService.getNewPurPriceBySkuIds(skus, vo.getActivitySupplierId());

                        if (CollectionUtils.isNotEmpty(purchaseActivityDetailVos)) {
                            for (PurchaseActivityDetailVo purchaseActivityDetailVo : purchaseActivityDetailVos) {
                                for (int i = 0, length = goodsSelects.size(); i < length; ++i) {
                                    GoodsSelect goodsSelect = goodsSelects.get(i);
                                    if (StringUtils.equals(purchaseActivityDetailVo.getSkuId(), goodsSelect.getSkuId())
                                            && StringUtils.isNotBlank(purchaseActivityDetailVo.getBranchId())
                                            && purchaseActivityDetailVo.getBranchId().indexOf(branchId) != -1) {
                                        goodsSelect.setPurchasePrice(purchaseActivityDetailVo.getNewPurPrice());
                                        goodsSelects.set(i, goodsSelect);
                                    }
                                }
                            }
                        }
                        suppliers.setList(goodsSelects);
                    }
                }
			} else {
				suppliers = goodsSelectServiceApi.queryLists(vo);
			}
			// 用查询条件的国际码替换主条码
			replaceBarCode(suppliers, vo);
			return suppliers;
		} catch (Exception e) {
			LOG.error("查询商品选择数据出现异常:{}", e);
		}
		return PageUtils.emptyPage();
	}

	// 根据机构id判断查询采购商品
	private PageUtils<GoodsSelect> queryPurchaseGoods(GoodsSelectVo vo) throws ServiceException {
        PageUtils<GoodsSelect> suppliers;
        if (FormType.PL.name().equals(vo.getFormType())) {//采购促销单
            List<String> branchIds = vo.getBranchIds();
            String[] branchNames = StringUtils.splitByWholeSeparatorPreserveAllTokens(vo.getBranchName(), ",");

            List<String> branchIdList = Lists.newArrayList();
            List<String> branchList = Lists.newArrayList();

            for (int i = 0, length = branchNames.length; i < length; ++i) {
                if (StringUtils.isNotBlank(branchNames[i]) && branchNames[i].contains("所有")) {
                    List<Branches> queryBranchIds = branchesService.queryChildById(branchIds.get(i));
					for (Branches branches : queryBranchIds) {
						branchIdList.add(branches.getBranchesId());
					}
				} else {
					branchList.add(branchIds.get(i));
                }
            }


			vo.setBranchIdStrs(Joiner.on(",").join(branchList));
            vo.setBranchIds(branchIdList);
            suppliers = goodsSelectServiceApi.queryPurchaseGoodsLists(vo);

        } else {
            // 1、查询选择机构
            String branchId = vo.getBranchId();
            String supplierId = vo.getSupplierId();
            Branches branches = branchesService.getBranchInfoById(branchId);
            Integer type = branches.getType();
            // 2、判断选择机构类型为店铺还是分公司,type : 机构类型(0.总部、1.分公司、2.物流中心、3.自营店、4.加盟店B、5.加盟店C)
            if (type == Constant.THREE || type == Constant.FOUR || type == Constant.FIVE) {
                Integer count = goodsSupplierBranchServiceApi.queryCountByBranchIdAndSupplierId(branchId, supplierId);
                if (count == 0) {
                    // 2.2 如果供应商机构商品关系不存在,需要查询该机构上级分公司
                    vo.setParentId(branches.getParentId());
                } else {
                    vo.setParentId(branchId);
                }
            } else {
                vo.setParentId(branchId);
            }
			vo.setSupplier(StringUtils.isBlank(supplierId));
			suppliers = goodsSelectServiceApi.queryPurchaseGoodsLists(vo);
            List<GoodsSelect> goodsSelects = suppliers.getList();
            List<String> skus = Lists.newArrayList();

            for (GoodsSelect goodsSelect : goodsSelects) {
                skus.add(goodsSelect.getId());
            }

            //查询促销商品价格
			List<PurchaseActivityDetailVo> purchaseActivityDetailVos = purchaseActivityService.getNewPurPriceBySkuIds(skus, StringUtils.isBlank(vo.getActivitySupplierId()) ? supplierId : vo.getActivitySupplierId());

            if (CollectionUtils.isNotEmpty(purchaseActivityDetailVos)) {
                for (PurchaseActivityDetailVo purchaseActivityDetailVo : purchaseActivityDetailVos) {
                    for (int i = 0, length = goodsSelects.size(); i < length; ++i) {
                        GoodsSelect goodsSelect = goodsSelects.get(i);
                        if (StringUtils.equals(purchaseActivityDetailVo.getSkuId(), goodsSelect.getSkuId())
                                && StringUtils.isNotBlank(purchaseActivityDetailVo.getBranchId())
                                && purchaseActivityDetailVo.getBranchId().indexOf(branchId) != -1) {
                            goodsSelect.setPurchasePrice(purchaseActivityDetailVo.getNewPurPrice());
                            goodsSelects.set(i, goodsSelect);
                        }
                    }
                }
            }
            suppliers.setList(goodsSelects);
        }

		// 用查询条件的国际码替换主条码
		replaceBarCode(suppliers, vo);
		return suppliers;
	}

	/**
	 * @Description: 根据货号批量查询商品
	 * @param skuCodes
	 * @return   
	 * @return List<GoodsSelect>  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月23日
	 */
	@RequestMapping(value = "importSkuCode", method = RequestMethod.POST)
	@ResponseBody
	public List<GoodsSelect> importSkuCode(GoodsSelectVo paramVo) {
		String branchId = paramVo.getBranchId();
		String type = paramVo.getType();
		String sourceBranchId = paramVo.getSourceBranchId();
		String targetBranchId = paramVo.getTargetBranchId();
		List<GoodsSelect> suppliers = null;
		try {
			// 多商品状态查询
			if (StringUtils.isNotBlank(paramVo.getStatuses())) {
				List<Integer> statusList = new ArrayList<>();
				for (String temp : paramVo.getStatuses().split(",")) {
					statusList.add(Integer.valueOf(temp));
				}
				paramVo.setStatusList(statusList);
			}

			if (FormType.DA.name().equals(type) || FormType.DD.name().equals(type) || FormType.DY.name().equals(type)
					|| FormType.DR.name().equals(type)) {
				GoodsSelectVo vo = new GoodsSelectVo();
				vo.setIsManagerStock(1);
				vo.setTargetBranchId(targetBranchId);
				vo.setSourceBranchId(sourceBranchId);
				vo.setSkuCodesOrBarCodes(paramVo.getSkuCodesOrBarCodes());
				vo.setPageNumber(1);
				vo.setPageSize(50);
				vo.setFormType(type);
				vo.setStatusList(paramVo.getStatusList());
				PageUtils<GoodsSelect> goodsSelects = PageUtils.emptyPage();
				if (FormType.DR.name().equals(type)) {
					goodsSelects = goodsSelectServiceApi.getGoodsListDR(vo);
				} else {
					goodsSelects = goodsSelectServiceApi.getGoodsListDA(vo);
				}
				suppliers = goodsSelects.getList();
			} else {
				// 如果是促销活动页面查询商品，需要过滤掉不参加促销的商品
				boolean alowActivity = false;
				if (FormType.PX.name().equals(type)) {
					alowActivity = true;
				}
				// 如果是门店商品调价单页面，需要过滤掉不参加调价的商品
				boolean allowAdjustPrice = false;
				if (FormType.PS.name().equals(type)) {
					allowAdjustPrice = true;
				}
				if (StringUtils.isEmpty(branchId)) {
					branchId = UserUtil.getCurrBranchId();
				}
				List<String> branchIds = new ArrayList<String>(0);
				// 多机构查询
				if (branchId.indexOf(",") != -1) {
					branchIds = Arrays.asList(branchId.split(","));
					branchId = "";
					// 查询多机构，要把当前机构赋值为空
					paramVo.setBranchId(null);
				}
				// 根据有无skuCodes传来数据 空表示是导入货号 有数据表示导入数据
				paramVo.setAllowActivity(alowActivity);
				paramVo.setAllowAdjustPrice(allowAdjustPrice);
				paramVo.setBranchIds(branchIds);
				if (FormType.PM.name().equals(type)) {
					// 如果为直送收货，且供应商不是主供应商时，查询出其他供就商也存在的商品
					paramVo.setPageNumber(1);
					paramVo.setPageSize(1);
					suppliers = queryPurchaseGoods(paramVo).getList();
				} else {
					// 采购订单，采购退货输入货号或条码时，只匹配机构自己引入的商品
                    if (FormType.PA.name().equals(type) || FormType.PR.name().equals(type)) {
                        paramVo.setSupplierId(null);
                    } else if (FormType.PL.name().equals(type)) {//采购促销单
                        paramVo.setBranchId("");
                        if (branchId.contains(",")) {
                            paramVo.setBranchIds(Arrays.asList(branchId.split(",")));
                        } else {
                            branchIds = Collections.singletonList(branchId);
                        }
                        String[] branchNames = StringUtils.splitByWholeSeparatorPreserveAllTokens(paramVo.getBranchName(), ",");

                        List<String> branchIdList = Lists.newArrayList();
                        List<String> branchList = Lists.newArrayList();

                        for (int i = 0, length = branchNames.length; i < length; ++i) {
                            if (StringUtils.isNotBlank(branchNames[i]) && branchNames[i].contains("所有")) {
                                List<Branches> queryBranchIds = branchesService.queryChildById(branchIds.get(i));
                                for (Branches branches : queryBranchIds) {
                                    branchIdList.add(branches.getBranchesId());
                                }
                            } else {
                                branchList.add(branchIds.get(i));
                            }
                        }


                        paramVo.setBranchIdStrs(Joiner.on(",").join(branchList));
                        paramVo.setBranchIds(branchIdList);
                        /**suppliers = goodsSelectServiceApi.queryPurchaseGoodsLists(vo);*/

                    }
					suppliers = goodsSelectServiceApi.queryByCodeListsByVo(paramVo);

                    if (FormType.PA.name().equals(type)) {
                        List<GoodsSelect> goodsSelects = suppliers;
                        List<String> skus = Lists.newArrayList();

                        for (GoodsSelect goodsSelect : goodsSelects) {
                            skus.add(goodsSelect.getId());
                        }

                        //查询促销商品价格
						List<PurchaseActivityDetailVo> purchaseActivityDetailVos = purchaseActivityService.getNewPurPriceBySkuIds(skus, StringUtils.isBlank(paramVo.getActivitySupplierId()) ? paramVo.getSupplierId() : paramVo.getActivitySupplierId());
						if (CollectionUtils.isNotEmpty(purchaseActivityDetailVos)) {
                            for (PurchaseActivityDetailVo purchaseActivityDetailVo : purchaseActivityDetailVos) {
                                for (int i = 0, length = goodsSelects.size(); i < length; ++i) {
                                    GoodsSelect goodsSelect = goodsSelects.get(i);
                                    if (StringUtils.equals(purchaseActivityDetailVo.getSkuId(), goodsSelect.getSkuId())
                                            && StringUtils.isNotBlank(purchaseActivityDetailVo.getBranchId())
                                            && purchaseActivityDetailVo.getBranchId().indexOf(branchId) != -1) {
                                        goodsSelect.setPurchasePrice(purchaseActivityDetailVo.getNewPurPrice());
                                        goodsSelects.set(i, goodsSelect);
                                    }
                                }
                            }
                        }
                        suppliers = goodsSelects;
                    }
                }
			}
			LOG.debug("根据货号查询商品:{}", suppliers);
			// 用查询条件的国际码替换主条码
			replaceBarCode(suppliers, paramVo);
			return suppliers;
		} catch (Exception e) {
			LOG.error("查询商品选择数据出现异常:{}", e);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 查询电子秤商品 （重和计件商品）
	 * @param GoodsSelectJson
	 * @param response
	 * @return   
	 * @return List<GoodsSelect>  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月23日
	 */
	@RequestMapping(value = "queryScaleGoods", method = RequestMethod.POST)
	@ResponseBody
	public Message queryScaleGoods(String GoodsSelectJson) {
		Message msg = new Message();
		try {
			GoodsSelectVo goodsVo = JSON.parseObject(GoodsSelectJson, GoodsSelectVo.class);
			LOG.debug("goodsVo:" + goodsVo);
			goodsVo.setBranchId(UserUtil.getCurrBranchId());
			goodsVo.setPricingType(99);
			LOG.info("vo:" + goodsVo.toString());
			List<GoodsSelect> list = goodsSelectServiceApi.queryScaleGoods(goodsVo);
			// 用查询条件的国际码替换主条码
			replaceBarCode(list, goodsVo);
			msg.setData(list);
			return msg;
		} catch (Exception e) {
			msg.setSuccess(Message.FAIT);
			msg.setMessage(e.getMessage());
			LOG.error("查询商品选择数据出现异常:{}", e);
		}
		return msg;
	}

	/**
	 * @Description 查询类别
	 * @param vo
	 * @param categoryVoJson
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @author yangyq02
	 * @date 2016年7月20日
	 */
	@RequestMapping(value = "getComponentList", method = RequestMethod.POST)
	@ResponseBody
	public Message getComponentList(String categoryVoJson) {
		Message msg = new Message();
		try {
			GoodsCategoryQo vo = JSON.parseObject(categoryVoJson, GoodsCategoryQo.class);
			LOG.debug("vo:" + vo.toString());
			PageUtils<GoodsCategory> suppliers = goodsCategoryService.queryLists(vo);
			LOG.debug("page" + suppliers.toString());
			msg.setData(suppliers.getList());
			return msg;
		} catch (Exception e) {
			msg.setMessage(e.getMessage());
			msg.setSuccess(Message.FAIT);
			LOG.error("查询查询类别异常:{}", e);
		}
		return msg;
	}

	/**
	 * @Description: enter事件配送导入
	 * @param skuCode
	 * @param formType
	 * @param sourceBranchId
	 * @param targetBranchId
	 * @return
	 * @author lijy02
	 * @date 2016年9月24日
	 */
	@RequestMapping(value = "enterSearchGoodsDeliver", method = RequestMethod.POST)
	@ResponseBody
	public List<GoodsSelect> enterSearchGoodsDeliver(String skuCode, String formType, String sourceBranchId,
			String targetBranchId) {
		LOG.debug("enter事件配送导入参数:skuCode=" + skuCode + ",formType=" + formType + ",sourceBranchId=" + sourceBranchId
				+ ",targetBranchId=" + targetBranchId);
		List<GoodsSelect> goodsSelect = new ArrayList<GoodsSelect>();
		if (StringUtils.isNotEmpty(skuCode)) {
			goodsSelect = goodsSelectServiceApi.queryBySkuCodeForDeliver(skuCode, formType, sourceBranchId,
					targetBranchId);
		}
		return goodsSelect;
	}

	/**
	 * @Description: 获取商品库存、价格 
	 * @param req
	 * @return
	 * @author zhangchm
	 * @date 2016年10月12日
	 */
	@RequestMapping(value = "selectStockAndPrice", method = RequestMethod.POST)
	@ResponseBody
	public List<GoodsSelectDeliver> selectStockAndPrice(HttpServletRequest req) {
		String goodsStockVo = req.getParameter("goodsStockVo");
		List<GoodsSelect> goodsSelect = new ArrayList<GoodsSelect>(0);
		List<GoodsSelectDeliver> goodsSelectDeliverTemp = new ArrayList<GoodsSelectDeliver>(0);
		try {
			GoodsStockVo goodsStockVos = new ObjectMapper().readValue(goodsStockVo, GoodsStockVo.class);
			goodsSelect = goodsSelectServiceApi.queryByBrancheAndSkuIds(goodsStockVos);
			List<GoodsSelectDeliver> goodsSelectDeliver = new ArrayList<GoodsSelectDeliver>(0);
			goodsSelectDeliverTemp = getGoodsSelectDeliverLists(goodsStockVos, goodsSelect, goodsSelectDeliver, true);
		} catch (IOException e) {
			LOG.error("获取商品库存、价格 异常:{}", e);
		}
		return goodsSelectDeliverTemp;
	}

	/**
	 * @Description: 获取商品库存、价格 
	 * @param req
	 * @return
	 * @author zhangchm
	 * @date 2016年10月12日
	 */
	@RequestMapping(value = "selectStockAndPriceToDo", method = RequestMethod.POST)
	@ResponseBody
	public List<GoodsSelectDeliver> selectStockAndPriceToDo(HttpServletRequest req) {
		String goodsStockVo = req.getParameter("goodsStockVo");
		List<GoodsSelect> goodsSelect = new ArrayList<GoodsSelect>(0);
		List<GoodsSelectDeliver> goodsSelectDeliverTemp = new ArrayList<GoodsSelectDeliver>(0);
		try {
			GoodsStockVo goodsStockVos = new ObjectMapper().readValue(goodsStockVo, GoodsStockVo.class);
			goodsSelect = goodsSelectServiceApi.queryByBrancheAndSkuIdsToDo(goodsStockVos);
			List<GoodsSelectDeliver> goodsSelectDeliver = new ArrayList<GoodsSelectDeliver>(0);
			goodsSelectDeliverTemp = getGoodsSelectDeliverLists(goodsStockVos, goodsSelect, goodsSelectDeliver, false);
		} catch (IOException e) {
			LOG.error("获取商品库存、价格 异常:{}", e);
		}
		return goodsSelectDeliverTemp;
	}

	/**
	 * @Description: 值转换
	 * @param goodsStockVos
	 * @param goodsSelects
	 * @param goodsSelectDelivers
	 * @param flag
	 * @return
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	private List<GoodsSelectDeliver> getGoodsSelectDeliverLists(GoodsStockVo goodsStockVos,
			List<GoodsSelect> goodsSelects, List<GoodsSelectDeliver> goodsSelectDelivers, boolean flag) {
		GoodsSelectDeliver goodsSelectDeliver = null;
		for (GoodsSelect goodsSelect : goodsSelects) {
			goodsSelectDeliver = new GoodsSelectDeliver();
			BeanUtils.copyProperties(goodsSelect, goodsSelectDeliver);
			goodsSelectDelivers.add(goodsSelectDeliver);
		}
		if (StringUtils.isEmpty(goodsStockVos.getGoodsSkuVo().get(0).getLargeNum())) {
			return goodsSelectDelivers;
		} else {
			Map<String, GoodsSkuVo> map = getGoodsSkuVo(goodsStockVos);
			if (flag) {
				for (GoodsSelectDeliver temp : goodsSelectDelivers) {
					temp.setLargeNum(map.get(temp.getId()).getLargeNum());
				}
			} else {
				for (GoodsSelectDeliver temp : goodsSelectDelivers) {
					GoodsSkuVo vo = map.get(temp.getId());
					temp.setLargeNum(vo.getLargeNum());
					temp.setIsGift(vo.getIsGift());
					temp.setPrice(vo.getDistributionPrice());
				}
			}
			return goodsSelectDelivers;
		}
	}

	/**
	 * @Description: 获取页面传递商品数量
	 * @param goodsStockVos
	 * @return
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	private Map<String, GoodsSkuVo> getGoodsSkuVo(GoodsStockVo goodsStockVos) {
		Map<String, GoodsSkuVo> map = new HashMap<String, GoodsSkuVo>();
		for (GoodsSkuVo goodsSkuVo : goodsStockVos.getGoodsSkuVo()) {
			map.put(goodsSkuVo.getId(), goodsSkuVo);
		}
		return map;
	}

	/**
	 * @Description: 商品选择view
	 * @param  model
	 * @return String  
	 * @throws
	 * @author zhongy
	 * @date 2016年11月09日
	 */
	@RequestMapping(value = "goGoodsSku")
	public String goGoodsSku(Model model, HttpServletRequest request) {
		String branchId = request.getParameter("branchId");
		model.addAttribute("branchId", branchId);
		return "component/publicGoodsSku";
	}

	/**
	 * @Description: 查询商品列表
	 * @param vo GoodsSelectVo商品选择VO
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return PageUtils<GoodsSelect>  
	 * @throws
	 * @author zhongy
	 * @date 2016年11月09日
	 */
	@RequestMapping(value = "queryGoodsSkuLists", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsSelect> queryGoodsSkuLists(GoodsSelectVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			LOG.debug("标准商品查询参数,vo={}", vo);
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			PageUtils<GoodsSelect> suppliers = goodsSelectServiceApi.queryGoodsSkuLists(vo);
			return replaceBarCode(suppliers, vo);
		} catch (Exception e) {
			LOG.error("标准查询商品选择数据出现异常:{}", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 查询要货单中已订数量
	 * @param req
	 * @return
	 * @author zhangchm
	 * @date 2016年12月12日
	 */
	@RequestMapping(value = "queryAlreadyNum", method = RequestMethod.POST)
	@ResponseBody
	public RespJson queryAlreadyNum(HttpServletRequest req) {
		RespJson respJson = RespJson.success();
		String goodsStockVo = req.getParameter("goodsStockVo");
		List<Map<String, Object>> goodsSelect = new ArrayList<Map<String, Object>>();
		try {
			GoodsStockVo goodsStockVos = new ObjectMapper().readValue(goodsStockVo, GoodsStockVo.class);
			
			if(CollectionUtils.isEmpty(goodsStockVos.getGoodsSkuVo())){
				return RespJson.argumentError("参数异常");
			}
			goodsSelect = goodsSelectServiceApi.queryAlreadyNum(goodsStockVos);
			JSONArray jsonObject = JSONArray.fromObject(goodsSelect);
			respJson.put("data", jsonObject);
		} catch (Exception e) {
			respJson.put(RespJson.KEY_CODE, ResultCodeEnum.FAIL.getCode());
			LOG.error("获取商品库存、价格 异常:{}", e);
			return RespJson.businessError("获取商品库存、价格异常");
		}
		return respJson;
	}

	/**
	 * @Description: 公共提示框 三个按钮
	 * @return   
	 * @author zhaoly
	 * @date 2017年02月23日
	 */
	@RequestMapping(value = "goPublicComfirmDialog")
	public String goPublicComfirmDialog() {
		return "component/publicComfirmDialog";
	}

	/**
	 * @Description: 替换国际码，用输入的国际码替换商品主条码
	 * @param page
	 * @param vo
	 * @return   
	 * @return PageUtils<GoodsSelect>  
	 * @throws
	 * @author yangyq02
	 * @date 2017年7月12日
	 */
	private PageUtils<GoodsSelect> replaceBarCode(PageUtils<GoodsSelect> page, GoodsSelectVo vo) {
		if (page == null || CollectionUtils.isEmpty(page.getList())) {
			return page;
		}
		// 改变对象值
		replaceBarCode(page.getList(), vo);
		return page;
	}

	//
	/**
	 * @Description: 替换国际码，用输入的国际码替换商品主条码
	 * @param list
	 * @param vo
	 * @return   
	 * @return List<GoodsSelect>  
	 * @throws
	 * @author yangyq02
	 * @date 2017年7月12日
	 */
	private List<GoodsSelect> replaceBarCode(List<GoodsSelect> list, GoodsSelectVo vo) {
		if (CollectionUtils.isEmpty(list)) {
			return list;
		}
		Map<String, GoodsSelect> map = new HashMap<>();
		for (GoodsSelect goods : list) {
			if (StringUtils.isNotEmpty(goods.getBarCodes())) {
				String[] barCodes = goods.getBarCodes().split(",");
				for (String str : barCodes) {
					map.put(str, goods);
				}
			}
		}
		if (CollectionUtils.isNotEmpty(vo.getBarCodes())) {
			for (String barCode : vo.getBarCodes()) {
				if (map.containsKey(barCode)) {
					map.get(barCode).setBarCode(barCode);
				}
			}
		}
		if (CollectionUtils.isNotEmpty(vo.getSkuCodesOrBarCodes())) {
			for (String barCode : vo.getSkuCodesOrBarCodes()) {
				if (map.containsKey(barCode)) {
					map.get(barCode).setBarCode(barCode);
				}
			}
		}
		// 模糊匹配的计算
		if (StringUtils.isNotEmpty(vo.getGoodsInfo())) {
			for (GoodsSelect goods : list) {
				int count = 0;
				String tempBar = null;
				if (StringUtils.isNotEmpty(goods.getBarCodes())) {
					String[] barCodes = goods.getBarCodes().split(",");
					for (String barCode : barCodes) {
						if (barCode.indexOf(vo.getGoodsInfo()) != -1) {
							tempBar = barCode;
							count++;
						}
					}
					if (count == 1) {
						goods.setBarCode(tempBar);
					}
				}
			}
		}
		return list;
	}
}