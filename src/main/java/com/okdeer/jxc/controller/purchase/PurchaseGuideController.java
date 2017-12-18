/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年3月7日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.purchase;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.common.utils.gson.GsonUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.purchase.po.PurchaseGuideGoodsPo;
import com.okdeer.jxc.form.purchase.po.PurchaseGuideOrderPo;
import com.okdeer.jxc.form.purchase.qo.PurchaseGuideQo;
import com.okdeer.jxc.form.purchase.service.PurchaseGuideService;
import com.okdeer.jxc.form.purchase.vo.PurchaseGuideGoodsVo;

/**
 * ClassName: PurchaseGuideController 
 * @Description: 采购向导Controller
 * @author liwb
 * @date 2017年3月7日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("form/purchaseGuide")
public class PurchaseGuideController extends BaseController<PurchaseGuideController> {

	@Reference(version = "1.0.0", check = false)
	private PurchaseGuideService purchaseGuideService;

	/**
	 * @Description: 第一步，条件筛选页面
	 * @return
	 * @author liwb
	 * @date 2017年3月8日
	 */
	@RequestMapping(value = "toGuideForm")
	public String guideForm(PurchaseGuideQo qo, Model model) {
		LOG.debug("第一步默认条件筛选信息：{}", qo);
		String formData = GsonUtils.toJson(qo);

		model.addAttribute("formData", formData);
		return "form/purchase/guide/guideForm";
	}

	/**
	 * @Description: 第二步，商品清单确认页面
	 * @param qo
	 * @param model
	 * @return
	 * @author liwb
	 * @date 2017年3月8日
	 */
	@RequestMapping(value = "toGuideGoodsList", method = RequestMethod.POST)
	public String guideGoodsList(PurchaseGuideQo qo, Model model) {
		LOG.debug("第二步，商品清单确认页面：{}", qo);

		String formData = GsonUtils.toJson(qo);

		model.addAttribute("formData", formData);

		return "form/purchase/guide/guideGoodsList";
	}

	/**
	 * @Description: 第三步，采购订单管理页面
	 * @return
	 * @author liwb
	 * @date 2017年3月8日
	 */
	@RequestMapping(value = "toGuideOrderList")
	public String toGuideOrderList(String guideNo, Model model) {
		LOG.debug("跳转到第三步采购订单列表页，采购向导批次号：{}", guideNo);
		model.addAttribute("guideNo", guideNo);
		return "form/purchase/guide/guideOrderList";
	}

	/**
	 * @Description: 生成采购订单数据
	 * @param dataList
	 * @return
	 * @author liwb
	 * @date 2017年3月9日
	 */
	@RequestMapping(value = "generFormList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson generFormList(@RequestBody String jsonData) {

		RespJson respJson = RespJson.error();
		try {
		    JSONObject obj = JSON.parseObject(jsonData);
		    String guideParam = obj.getString("guideParam");
		    String dataList =  obj.getString("dateList");
		            
		    // 重新构建向导数据
		    List<PurchaseGuideGoodsVo> goodsVoList = buildGuideGoodsVoList(guideParam,dataList);
		    LOG.info("重新构建向导数据：{}", goodsVoList.size());
			respJson = purchaseGuideService.generPurchaseFormList(goodsVoList, getCurrentUser());
			if (!respJson.isSuccess()) {
				LOG.error(respJson.getMessage());
			} else {
				LOG.info("采购向导批次号为：{}", respJson.getData());
			}
		} catch (Exception e) {
			LOG.error("生成采购订单失败：{}", e);
		}

		return respJson;
	}

	/**
	 * 
	 * @Description: 重新构建向导数据
	 * @param guideParam
	 * @param dataList
	 * @return
	 * @throws Exception
	 * @date 2017年12月15日
	 */
    private List<PurchaseGuideGoodsVo> buildGuideGoodsVoList(String guideParam, String dataList) {
        List<PurchaseGuideGoodsVo> goodsVoList = Lists.newArrayList();
        // 原向导条件页参数
        PurchaseGuideQo qo = GsonUtils.fromJson(guideParam, PurchaseGuideQo.class);
        // 构建查询条件信息
        buldSearchParams(qo);
        // 再次查询向导生成的集合（数据权限控制后，可能存在价格金额为空的情况，故需要重新查询一次）
        PageUtils<PurchaseGuideGoodsPo> page = purchaseGuideService.getGoodsList(qo);
        if (page == null || CollectionUtils.isEmpty(page.getList())) {
            return goodsVoList;
        }
        // 解析页面传递集合
        List<PurchaseGuideGoodsVo> goodsVoPageList = GsonUtils.fromJsonList(dataList, PurchaseGuideGoodsVo.class);
        // 组织页面传递集合的MAP结构，以机构ID+供应商ID+商品ID为主键
        Map<String, PurchaseGuideGoodsVo> goodsVoPageMap = new HashMap<>();
        for (PurchaseGuideGoodsVo pageGgVo : goodsVoPageList) {
            goodsVoPageMap.put(pageGgVo.getBranchId() + pageGgVo.getSupplierId() + pageGgVo.getSkuId(), pageGgVo);
        }
        // 获得原向导条件页参数查询到的结果
        List<PurchaseGuideGoodsPo> goodsPoList = page.getList();
        for (PurchaseGuideGoodsPo gVo : goodsPoList) {
            PurchaseGuideGoodsVo verifyVo = goodsVoPageMap
                    .get(gVo.getBranchId() + gVo.getSupplierId() + gVo.getSkuId());
            // 如果查询到的商品在页面传递的集合中存在，则作为正式生成订单的数据，如果不存在，表示页面已对初始查询的结果做删除处理，则不能作为正式生成订单的数据
            if (verifyVo != null) {
                String verifyVoJson = GsonUtils.toJson(gVo);
                PurchaseGuideGoodsVo officialGVo = GsonUtils.fromJson(verifyVoJson, PurchaseGuideGoodsVo.class);
                if (officialGVo != null) {
                    goodsVoList.add(officialGVo);
                }
            }
        }
        return goodsVoList;
    }
	/**
	 * @Description: 第二部，获取商品清单列表
	 * @param qo
	 * @return
	 * @author liwb
	 * @date 2017年3月8日
	 */
    @RequestMapping(value = "getGoodsList", method = RequestMethod.POST)
    @ResponseBody
    public PageUtils<PurchaseGuideGoodsPo> getGoodsList(PurchaseGuideQo qo) {
        LOG.debug("获取采购向导商品清单条件信息：{}", qo);
        try {
			// 必填参数
			if (StringUtils.isBlank(qo.getBranchId()) || qo.getBranchType() == null) {
				LOG.error("机构信息为空，系统异常！");
				return PageUtils.emptyPage();
			}

			// 构建查询条件信息
			buldSearchParams(qo);

			PageUtils<PurchaseGuideGoodsPo> page = purchaseGuideService.getGoodsList(qo);
			LOG.info("重新构建向导数据：{}", page.getList().size());
			cleanAccessData(page);
			return page;
		} catch (Exception e) {
			LOG.error("获取采购向导商品清单异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 构建查询条件信息
	 * @param qo
	 * @author liwb
	 * @date 2017年3月20日
	 */
	private void buldSearchParams(PurchaseGuideQo qo) {
		// 结束日期加一天
		if (qo.getDeliverEndDate() != null) {
			qo.setDeliverEndDate(DateUtils.getDayAfter(qo.getDeliverEndDate()));
		}

		String supplierCodeName = qo.getSupplierCodeName();
		if (StringUtils.isNotBlank(supplierCodeName)) {

			// 如果是选择的供应商信息，清空供应商名称
			if (supplierCodeName.contains("[") && supplierCodeName.contains("]")) {
				qo.setSupplierCodeName(null);
			} else {

				// 如果是自己填写的供应商信息，则清空供应商Id
				qo.setSupplierId(null);
			}
		}

		String categoryCodeName = qo.getCategoryCodeName();
		if (StringUtils.isNotBlank(categoryCodeName)) {

			// 如果是选择的类别信息，清空类别名称
			if (categoryCodeName.contains("[") && categoryCodeName.contains("]")) {
				qo.setCategoryCodeName(null);
			} else {

				// 如果是自己填写的信息，则清空分类编号
				qo.setCategoryCode(null);
			}
		}
	}

	/**
	 * @Description: 第三步，获取采购向导生成的订单数据
	 * @param guideNo
	 * @return
	 * @author liwb
	 * @date 2017年3月10日
	 */
	@RequestMapping(value = "getOrderList")
	@ResponseBody
	public PageUtils<PurchaseGuideOrderPo> getOrderList(String guideNo) {
		LOG.debug("获取采购向导订单列表向导批次号：{}", guideNo);
		try {
			PageUtils<PurchaseGuideOrderPo> page = purchaseGuideService.getGuideOrderList(guideNo);
			// 过滤数据权限字段
			cleanAccessData(page);
			return page;
		} catch (Exception e) {
			LOG.error("获取采购向导商品清单异常:", e);
		}
		return PageUtils.emptyPage();
	}

}
