/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年11月8日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.member;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.member.po.NewMemberReportPo;
import com.okdeer.jxc.report.member.qo.NewMemberReportQo;
import com.okdeer.jxc.report.member.service.NewMemberReportService;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;

/**
 * ClassName: NewMemberReportController 
 * @Description: 新会员统计报表
 * @author liwb
 * @date 2017年11月8日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@RestController
@RequestMapping("newMember/report")
public class NewMemberReportController extends BaseController<NewMemberReportController> {

	/*** 按店铺统计列信息  */
	private static final String[] BRANCH_REPORT_HEADERS = { "机构编码", "机构名称", "新会员数", "新会员重构数", "会员重构率" };

	private static final String[] BRANCH_REPORT_COLUMNS = { "branchCode", "branchName", "newMemberNum",
			"repeatMemberNum", "repeatMemberRate" };

	/*** 按收营员统计列信息  */
	private static final String[] CASHIER_REPORT_HEADERS = { "机构编码", "机构名称", "收银员编号", "收银员名称", "新会员数", "新会员重构数",
			"会员重构率" };

	private static final String[] CASHIER_REPORT_COLUMNS = { "branchCode", "branchName", "cashierCode", "cashierName",
			"newMemberNum", "repeatMemberNum", "repeatMemberRate" };

	/*** 按日期统计列信息  */
	private static final String[] DATE_REPORT_HEADERS = { "日期", "机构编码", "机构名称", "新会员数", "新会员重构数", "会员重构率" };

	private static final String[] DATE_REPORT_COLUMNS = { "rptDateStr", "branchCode", "branchName", "newMemberNum",
			"repeatMemberNum", "repeatMemberRate" };

	@Reference(version = "1.0.0", check = false)
	private NewMemberReportService newMemberReportService;

	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("report/member/newMemberReport");
	}

	@RequestMapping(value = "reportList", method = RequestMethod.POST)
	public PageUtils<NewMemberReportPo> getStoreChargeList(NewMemberReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);

		// 构建查询参数
		buildSearchParams(qo);
		LOG.debug("查询新会员统计报表条件：{}", qo);

		try {

			return newMemberReportService.getReportForPage(qo);
		} catch (Exception e) {
			LOG.error("分页查询新会员统计报表异常:", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "exportList")
	public RespJson exportList(NewMemberReportQo qo, HttpServletResponse response) {
		try {
			
			// 构建查询参数
			buildSearchParams(qo);

			LOG.debug("导出新会员统计报表：{}", qo);

			List<NewMemberReportPo> list = newMemberReportService.getReportForExport(qo);

			RespJson respJson = super.validateExportList(list);
			if (!respJson.isSuccess()) {
				LOG.info(respJson.getMessage());
				return respJson;
			}

			String[] headers = null;
			String[] columns = null;
			String reportTypeStr = null;

			// 获取统计数据
			switch (qo.getReportType()) {
				case 0: // 0：按店铺统计(默认)
					headers = BRANCH_REPORT_HEADERS;
					columns = BRANCH_REPORT_COLUMNS;
					reportTypeStr = "按店铺统计";
					break;
				case 1: // 1：按收营员统计
					headers = CASHIER_REPORT_HEADERS;
					columns = CASHIER_REPORT_COLUMNS;
					reportTypeStr = "按收营员统计";
					break;
				case 2: // 2：按日统计
					headers = DATE_REPORT_HEADERS;
					columns = DATE_REPORT_COLUMNS;
					reportTypeStr = "按日统计";
					break;
				default:
					return RespJson.businessError("报表类型错误！");
			}

			// 导出文件名称，不包括后缀名
			String fileName = "新会员统计报表——" + reportTypeStr + "_" + DateUtils.getSmallStr(qo.getStartTime()) + "_"
					+ DateUtils.getSmallStr(qo.getEndTime());

			List<JSONObject> dataList = new ArrayList<JSONObject>();
			for (NewMemberReportPo po : list) {
				JSONObject jObj = JSONObject.fromObject(po);
				dataList.add(jObj);
			}

			ExcelExportUtil.exportExcel(fileName, headers, columns, dataList, response);

			return RespJson.success();

		} catch (Exception e) {
			LOG.error("导出新会员统计报表失败：", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author liwb
	 * @date 2017年5月31日
	 */
	private void buildSearchParams(NewMemberReportQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

}
