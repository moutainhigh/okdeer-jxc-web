/** 
 *@Project: okdeer-jxc-web 
 *@Author: lijy02
 *@Date: 2016年10月25日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.goods;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.castor.util.StringUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.report.ReportService;
import com.okdeer.jxc.controller.common.ReportController;
import com.okdeer.jxc.report.goods.service.GoodsTotalAnalsiServiceApi;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.price.PriceConstant;
import com.okdeer.retail.common.report.DataRecord;

/**
 * ClassName: GoodsTotalAnalsi 
 * @Description: 商品销售汇总分析
 * @author lijy02
 * @date 2016年11月9日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *  V1.30商业管理系统       2016.11.9        lijy02				 商品销售汇总分析
 */
 
@Controller
@RequestMapping("report/goodsTotalAnalysi1")
public class GoodsTotalAnalsiController extends ReportController {
	
	/**
	 * @Fields GoodsTotalAnalsiServiceApi : 商品汇总分析service
	 */
	@Reference(version = "1.0.0", check = false)
	private GoodsTotalAnalsiServiceApi goodsTotalAnalsiServiceApi;
	
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesServiceApi;
	
	/**
	 * @Description: 列表页面
	 * @return
	 * @author lijy02
	 * @date 2016年11月9日
	 */
	@RequestMapping("/list")
	public String list(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		return "report/goods/goodsTotalAnalysiList";
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getReportService()
	 */
	@Override
	public ReportService getReportService() {
		return goodsTotalAnalsiServiceApi;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getParam(javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public Map<String, Object> getParam(HttpServletRequest request) {
		Map<String, Object> map= this.builderParams(request, null);
		if(!map.containsKey("branchCompleCode")){
			map.put("branchCompleCode", UserUtil.getCurrBranchCompleCode());
		}
		if (map.containsKey("supplierId")) {
			map.remove("supplierName");
		} else if (map.containsKey("supplierName")) {
			String supplierName = (String) map.get("supplierName");
			if (supplierName.indexOf("]") > 0) {				
				map.put("supplierName", supplierName.substring(supplierName.indexOf("]") + 1));
			}
		}
		return map;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getFileName()
	 */
	@Override
	public String getFileName() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getHeaders()
	 */
	@Override
	public String[] getHeaders() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getColumns()
	 */
	@Override
	public String[] getColumns() {
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#formatter(com.okdeer.jxc.common.report.DataRecord)
	 */
	@Override
	public void formatter(DataRecord dataRecord) {
		
	}
	
	
	/**
	 * (non-Javadoc) 导出
	 * @see com.okdeer.jxc.controller.common.ReportController#exportExcel(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@RequestMapping(value = "exportGoodsAnalsisExcel")
	public void exportExcel(HttpServletRequest request, HttpServletResponse response){
		try {
			LOG.debug("商品销售汇总导出" );
			Map<String, Object> map = getParam(request);
			String reportFileName="";
			String templateName="";
			if(map.get("searchType")==null||StringUtils.isEmpty(map.get("searchType").toString())){
				return ;
			}
			String timeStr=StringUtil.replaceAll((String) map.get("startTime"),"-" , "")+"-"+StringUtil.replaceAll((String) map.get("endTime"),"-" , "")+"-";
			if("goodsTotal".equals(map.get("searchType"))){
				reportFileName="商品销售汇总分析" + timeStr+"商品汇总";
				templateName="GoodsAnalysiBySku.xlsx";
			}else if("categoryTotal".equals(map.get("searchType"))){
				reportFileName="商品销售汇总分析"+ timeStr+"大类汇总";
				templateName="GoodsAnalysiByBigCategory.xlsx";
			}else if("branchTotal".equals(map.get("searchType"))){
				reportFileName="商品销售汇总分析"+ timeStr+"店铺汇总";
				templateName="GoodsAnalysiByBranch.xlsx";
			}else if("branchSkuTotal".equals(map.get("searchType"))){
                reportFileName="商品销售汇总分析"+ timeStr+"店铺商品汇总";
                templateName="GoodsAnalysiByBranchSku.xlsx";
            }
			// 模板名称，包括后缀名
			List<DataRecord> dataList=goodsTotalAnalsiServiceApi.getList(map);
			DataRecord data = goodsTotalAnalsiServiceApi.getExportTotal(map);
			dataList.add(data);
			cleanDataMaps(getPriceAccess(), dataList);
			exportListForXLSX(response, dataList, reportFileName, templateName);
		} catch (Exception e) {
			LOG.error("商品销售汇总导出失败" );
		}
		
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.controller.common.ReportController#getPriceAccess()
	 */
	@Override
	public Map<String, String> getPriceAccess() {
		Map<String, String> map = new HashMap<String, String>();
		map.put(PriceConstant.SALE_PRICE, "saleAmount"); //销售额
		map.put(PriceConstant.COST_PRICE, "costAmount,grossProfit,grossProfitRate"); //成本额，毛利，毛利率
		return map;
	}

}
