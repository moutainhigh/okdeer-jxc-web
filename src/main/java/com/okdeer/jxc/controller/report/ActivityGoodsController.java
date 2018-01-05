/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhongy
 *@Date: 2016年10月25日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.base.common.utils.StringUtils;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.qo.ActivityGoodsReportQo;
import com.okdeer.jxc.report.service.ActivityGoodsServiceApi;
import com.okdeer.jxc.report.vo.ActivityGoodsReportVo;
import com.okdeer.jxc.sale.enums.ActivityType;

/**
 * ClassName: ActivityGoodsController 
 * @author zhongy
 * @date 2016年12月12日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *		重构2.0			2016-12-12			zhongy			  促销活动商品信息查询
 */

@Controller
@RequestMapping("activity/goods")
public class ActivityGoodsController extends BaseController<ActivityGoodsReportVo>{
	
	
	@Reference(version = "1.0.0", check = false)
	private ActivityGoodsServiceApi activityGoodsService;
	
	/**
	 * 跳转到促销活动商品查询页面
	 * @return
	 * @author zhongy
	 * @date 2016年12月12日
	 */
	@RequestMapping(value = "view")
	public String view() {
		return "report/activity/activityGoodsList";
	}
	
	/**
	 * @Description: 促销活动商品查询
	 * @param qo 请求参数
	 * @param pageNumber
	 * @param pageSize
	 * @return 返回查询结果
	 * @author zhongy
	 * @date 2016年12月12日
	 */
	@RequestMapping(value = "getList")
	@ResponseBody
	public PageUtils<ActivityGoodsReportVo> getList(ActivityGoodsReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		    LOG.debug("促销活动商品查询请求参数,qo={}", qo);
		try {
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);
			handelReqParam(qo);
			//1、列表查询
			PageUtils<ActivityGoodsReportVo> arrivalRateReport = activityGoodsService.findPageActivityGoods(qo);
			
			//2、汇总查询
			ActivityGoodsReportVo sum = activityGoodsService.queryListSum(qo);
			List<ActivityGoodsReportVo> footer =new ArrayList<ActivityGoodsReportVo>();
			footer.add(sum);
			arrivalRateReport.setFooter(footer);
			
			return arrivalRateReport;
		} catch (Exception e) {
			LOG.error("促销活动商品查询查询异常:", e);
		}
		return PageUtils.emptyPage();
	}
	
	
	/**
	 * 
	 * @Description: 促销活动商品
	 * @param response
	 * @param vo
	 * @return
	 * @author zhongy
	 * @date 2016年12月12日
	 */
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, ActivityGoodsReportQo qo) {

		LOG.debug("UserController.exportList start ,parameter vo=",qo);
		try {
			//1、列表查询
			handelReqParam(qo);
			List<ActivityGoodsReportVo> arrivalRateReport = activityGoodsService.findActivityGoods(qo);
			
			if(CollectionUtils.isNotEmpty(arrivalRateReport)){
				//2、汇总查询
				ActivityGoodsReportVo sum = activityGoodsService.queryListSum(qo);
				arrivalRateReport.add(sum);
				String fileName = "促销销售查询" + "_" + DateUtils.getCurrSmallStr();
				
				String templateName = ExportExcelConstant.ACTIVITY_GOODS_REPORT;
				exportListForXLSX(response, arrivalRateReport, fileName, templateName);
			}else{
				RespJson json = RespJson.error("无数据可导");
				return json;
			}
		} catch (Exception e) {
			LOG.error("UserController.exportList Exception:", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}
	
	//请求参数特殊处理
	private void handelReqParam(ActivityGoodsReportQo qo) {
		qo.setBranchCompleCode(getCurrBranchCompleCode());
		String activityType = qo.getActivityType();
		if (StringUtils.isNotBlank(activityType)) {
			String[] arr = activityType.split(",");
			List<String> activityTypes = Arrays.asList(arr);
			List<String> list = new ArrayList<>(activityTypes);
			for (String string : activityTypes) {
				// 手工折扣里面包含了：单品折扣和整单折扣
				if (ActivityType.MANUAL_DISCOUNT.getValue().toString().equals(string)) {
					list.add(ActivityType.ALL_DISCOUNT.getValue().toString());
				}
				// 手工议价里面包含了：手工议价和整单折价
				if (ActivityType.MEMBER_BARGAIN.getValue().toString().equals(string)) {
					list.add(ActivityType.ALL_CAT_RATE_PRICE.getValue().toString());
				}
			}
			qo.setActivityTypes(list);
		}
		if (qo.getEndTime() != null) {
			qo.setEndTime(DateUtils.getNextDay(qo.getEndTime()));
		}
	}
}
