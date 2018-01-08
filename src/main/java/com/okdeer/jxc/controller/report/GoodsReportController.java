/** 
 *@Project: okdeer-jxc-web 
 *@Author: taomm
 *@Date: 2016年8月15日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.enums.GoodsStatusEnum;
import com.okdeer.jxc.common.enums.GoodsTypeEnum;
import com.okdeer.jxc.common.enums.PricingTypeEnum;
import com.okdeer.jxc.common.enums.SaleWayEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.goods.entity.GoodsBranchPrice;
import com.okdeer.jxc.goods.entity.GoodsBranchPriceVo;
import com.okdeer.jxc.goods.qo.GoodsBranchPriceQo;
import com.okdeer.jxc.goods.service.GoodsBranchPriceServiceApi;
import com.okdeer.jxc.report.qo.GoodsReportQo;
import com.okdeer.jxc.report.service.GoodsReportService;
import com.okdeer.jxc.report.vo.GoodsReportVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

/**
 * 	
 * ClassName: GoodsReportController 
 * @Description: 库存查询
 * @author dongh
 * @date 2016年8月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    进销存2.0.0		   2016年9月12日                  dongh            库存查询
 *    商业管理系统 		   2016年9月12日			yangyq02				库存查询完善
 */
@Controller
@RequestMapping("goods/report")
public class GoodsReportController extends BaseController<GoodsReportController> {

	@Reference(version = "1.0.0", check = false)
	private GoodsReportService goodsReportService;

	@Reference(version = "1.0.0", check = false)
	BranchesServiceApi branchesServiceApi;

	@Reference(version = "1.0.0", check = false)
	private GoodsBranchPriceServiceApi goodsBranchPriceService;

	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesService;

	/**
	 * 
	 * @Description: 商品查询跳转页
	 * @return
	 * @author taomm
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		/**
		 * added by zhangqin on 2017-02-16 begin
		 * 需求V2.2,新增计价方式、商品状态、商品类型筛选条件
		 */
		// 计价方式
		model.addAttribute("pricingType", PricingTypeEnum.values());
		// 商品状态
		model.addAttribute("goodsStatus", GoodsStatusEnum.values());
		// 商品类型
		model.addAttribute("goodsType", GoodsTypeEnum.values());

		model.addAttribute("saleWayList", SaleWayEnum.values());
		/**
		 * added by zhangqin on 2017-02-16 end
		 */
		return "report/goods/goodsReport";
	}

	/**
	 * 
	 * @Description: 跳转编辑页
	 * @param model
	 * @return String  
	 * @author zhangq
	 * @date 2017年2月16日
	 */
	@RequestMapping(value = "toEdit")
	public String toEdit(GoodsReportQo qo, Model model) {
		// 计价方式
		model.addAttribute("pricingType", PricingTypeEnum.values());
		// 商品状态
		model.addAttribute("goodsStatus", GoodsStatusEnum.values());
		model.addAttribute("branchType", UserUtil.getCurrBranchType());
		// 商品类型
		model.addAttribute("goodsType", GoodsTypeEnum.values());
		return "report/goods/goodsEdit";
	}

	/**
	 * 
	 * @Description: 查询商品信息
	 * @param qo
	 * @param model
	 * @return GoodsReportVo  
	 * @author zhangq
	 * @date 2017年2月17日
	 */
	@RequestMapping(value = "getGoodsInfo", method = RequestMethod.GET)
	@ResponseBody
	public RespJson getGoodsInfo(GoodsReportQo qo, Model model) {
		GoodsReportVo sku = goodsReportService.queryGoodsInfo(qo);
		// 如果编辑的机构为门店，则只可以修改供应商相关信息
		Branches branch = branchesService.getBranchInfoById(sku.getBranchId());// 机构类型(0.总部、1.分公司、2.物流中心、3.自营店、4.加盟店B、5.加盟店C)
		RespJson jesp = RespJson.success();
		if (branch.getType() == 2 || branch.getType() == 3 || branch.getType() == 4 || branch.getType() == 5) {
			jesp.put("isStore", true);
		} else {
			jesp.put("isStore", false);
		}
		cleanAccessData(sku);
		jesp.put("_data", sku);
		return jesp;
	}

	/**
	 * 
	 * @Description: 商品查询
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author dongh
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "getList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsReportVo> getList(GoodsReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);

			// 如果没有选择店铺，则查询登录人所在机构的商品
			if (StringUtils.isEmpty(qo.getBranchId())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			
			PageUtils<GoodsReportVo> goodsReport = goodsReportService.queryListToPage(qo);
			// 过滤数据权限字段
			cleanAccessData(goodsReport);
			return goodsReport;

		} catch (Exception e) {
			LOG.error("查询商品选择数据出现异常:", e);
		}
		return null;
	}

	/**
	 * 
	 * @Description: 商品查询导出
	 * @param response
	 * @param vo
	 * @return
	 * @author dongh
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, GoodsReportQo qo) {

		LOG.debug("商品查询导出execl：vo" + qo);
		try {
			// 机构条件只根据id查询
			qo.setBranchName(null);
			// 如果没有选择店铺，则查询登录人所在机构的商品
			if (StringUtils.isEmpty(qo.getBranchId())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}

			List<GoodsReportVo> exportList = goodsReportService.queryList(qo);
			if (CollectionUtils.isNotEmpty(exportList)) {
				Branches branches = branchesService.getBranchInfoById(qo.getBranchId());
				String branchName = branches != null ? branches.getBranchName() : getCurrentUser().getBranchName();
				String fileName = branchName + "商品查询列表" + "_" + DateUtils.getCurrSmallStr();

				String templateName = ExportExcelConstant.GOODSREPORT;

				cleanAccessData(exportList);
				Map<String, Object> param = new HashMap<>();
				param.put("branchName", branchName);
				exportParamListForXLSX(response, exportList, param, fileName, templateName);
			} else {
				RespJson json = RespJson.error("无数据可导");
				return json;
			}
		} catch (Exception e) {
			LOG.error("商品查询导出execl出现错误{}", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}

	/**
	 * @Description: 商品查询打印
	 * @param qo
	 * @param response
	 * @param request
	 * @param pageNumber
	 * @author lijy02
	 * @date 2016年9月13日
	 */
	@RequestMapping(value = "printReport", method = RequestMethod.GET)
	@ResponseBody
	public String printReport(GoodsReportQo qo, HttpServletResponse response, HttpServletRequest request,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber) {
		try {
			// 如果没有选择店铺，则查询登录人所在机构的商品
			if (StringUtils.isEmpty(qo.getBranchName())) {
				qo.setBranchId(UserUtil.getCurrBranchId());
			}
			String branchCode = UserUtil.getCurrBranchCode();
			qo.setBranchCode(branchCode);
			qo.setPageNumber(pageNumber);
			qo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
			if (goodsReportService.queryListCount(qo) > PrintConstant.PRINT_MAX_ROW) {
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			List<GoodsReportVo> list = goodsReportService.queryList(qo);
			if (!CollectionUtils.isEmpty(list) && list.size() > PrintConstant.PRINT_MAX_ROW) {
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			String path = PrintConstant.GOODS_REPORT;
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("printName", UserUtil.getCurrentUser().getUserName());
			cleanAccessData(list);
			JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, list, "");
		} catch (Exception e) {
			LOG.error(PrintConstant.SALE_FLOW_PRINT_ERROR, e);
		}
		return null;
	}

	@RequestMapping(value = "querySkuBranchBySkuId", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsBranchPriceVo> querySkuBranchBySkuIdCodes(GoodsBranchPriceQo qo) {
		try {
			qo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			List<GoodsBranchPriceVo> branchList = goodsBranchPriceService.querySkuBranchBySkuId(qo);

			PageUtils<GoodsBranchPriceVo> goodsReport = new PageUtils<GoodsBranchPriceVo>(branchList);
			cleanAccessData(goodsReport);
			return goodsReport;
		} catch (Exception e) {
			LOG.error("查询商品各机构信息失败", e);
			return null;
		}
	}

	/**
	 * @Description: 保存分公司安全库存
	 * @param qo
	 * @return   
	 * @return PageUtils<GoodsBranchPriceVo>  
	 * @throws
	 * @author yangyq02
	 * @date 2017年3月12日
	 */
	@RequestMapping(value = "saveBranchsafetyCoefficient", method = RequestMethod.POST)
	@ResponseBody
	public RespJson saveBranchsafetyCoefficient(@RequestBody String json) {
		try {
			List<GoodsBranchPrice> list = JSON.parseArray(json, GoodsBranchPrice.class);
			for (GoodsBranchPrice goodsBranchPrice : list) {
				goodsBranchPrice.setUpdateUserId(UserUtil.getCurrUserId());
			}
			return goodsBranchPriceService.saveBranchsafetyCoefficient(list);
		} catch (Exception e) {
			LOG.error("查询商品各机构信息失败", e);
			return RespJson.error("保存机构安全系数失败");
		}
	}

}
