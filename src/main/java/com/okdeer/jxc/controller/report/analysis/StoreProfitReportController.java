/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年9月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.analysis;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.analysis.qo.StoreExpendDetailQo;
import com.okdeer.jxc.report.analysis.service.StoreProfitReportService;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.retail.common.entity.colsetting.GridColumn;
import com.okdeer.retail.common.report.DataRecord;
import com.okdeer.retail.common.util.JacksonUtil;

/**
 * ClassName: StoreProfitReportController 
 * @Description: 门店利润报表Controller
 * @author liwb
 * @date 2017年9月13日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@SuppressWarnings("deprecation")
@RestController
@RequestMapping("report/storeProfit")
public class StoreProfitReportController extends BaseController<StoreProfitReportController> {

	@Reference(version = "1.0.0", check = false)
	private StoreProfitReportService storeProfitReportService;

	/**
	 * 跳转到列表
	 */
	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("report/analysis/storeProfitReportList");
	}

	@RequestMapping(value = "getList", method = RequestMethod.POST)
	public PageUtils<DataRecord> getList(StoreExpendDetailQo qo) {

		try {
			
			// 构建查询参数
			buildParams(qo);

			LOG.debug("查询门店利润报表条件：{}", qo);

			PageUtils<DataRecord> page = storeProfitReportService.getReportList(qo);

			return page;
		} catch (Exception e) {
			LOG.error("查询门店利润报表异常:", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "getColumns", method = RequestMethod.POST)
	public RespJson getColumns(StoreExpendDetailQo qo) {
		try {
			// 构建查询参数
			buildParams(qo);

			LOG.debug("获取门店利润报表列数据查询条件：{}", qo);

			int count = storeProfitReportService.getStoreCount(qo);
			boolean flg = false;
			
			// 如果超过20个，要弹框提示
			if(count > StoreProfitReportService.MAX_STORE_NUM){
				flg = true;
			}
			
			qo.setMaxNo(StoreProfitReportService.MAX_STORE_NUM);

			List<DataRecord> storeList = storeProfitReportService.getStoreList(qo);

			if (CollectionUtils.isEmpty(storeList)) {
				LOG.warn("获取门店利润报表列数据为空！");
				return RespJson.businessError("获取门店利润报表列数据为空!");
			}

			List<GridColumn> storeInfoList = new ArrayList<GridColumn>();
			List<GridColumn> storeAmountList = new ArrayList<GridColumn>();

			// 是否加粗 格式，isBold 函数在JS文件中实现
			StringBuffer boldFmt = new StringBuffer();
			boldFmt.append(".separator.function(value,row,index){");
			boldFmt.append("return isBold(value, row, index);");
			boldFmt.append("}.separator.");

			// 构建 行号 列
			GridColumn rowNo = new GridColumn();
			rowNo.setField(StoreProfitReportService.COLUMN_ROW_NO);
			rowNo.setTitle("行号");
			rowNo.setRowspan(2); // 行合并
			rowNo.setWidth("40px");
			rowNo.setAlign("center");
			rowNo.setFormatter(boldFmt.toString());
			storeInfoList.add(rowNo);

			// 构建 项目 列
			GridColumn itemName = new GridColumn();
			itemName.setField(StoreProfitReportService.COLUMN_ITEM_NAME);
			itemName.setTitle("项目");
			itemName.setRowspan(2); // 行合并
			itemName.setWidth("100px");
			itemName.setFormatter(boldFmt.toString());
			storeInfoList.add(itemName);

			// 构建 合计 列
			GridColumn totalColumn = new GridColumn();
			totalColumn.setField(StoreProfitReportService.COLUMN_TOTAL_COLUMN);
			totalColumn.setTitle("合计");
			totalColumn.setColspan(2); // 列合并
			storeInfoList.add(totalColumn);

			// 金额格式化，getPriceFmtB 函数在JS文件中实现
			StringBuffer amountFmt = new StringBuffer();
			amountFmt.append(".separator.function(value,row,index){");
			amountFmt.append("return displayAmount(value);");
			amountFmt.append("}.separator.");

			// 构建 合计金额 列
			GridColumn totalColumn1 = buildMonthAmountColumn(amountFmt.toString(), 0);
			GridColumn totalColumn2 = buildTotalAmountColumn(amountFmt.toString(), 0);
			storeAmountList.add(totalColumn1);
			storeAmountList.add(totalColumn2);

			int i = 1;
			for (DataRecord r : storeList) {
				GridColumn store = new GridColumn(); // 店铺名称
				store.setField(StoreProfitReportService.COLUMN_BRANCH_NAME + i);
				store.setTitle(r.getString(StoreProfitReportService.COLUMN_BRANCH_NAME));
				store.setColspan(2); // 列合并

				GridColumn column1 = buildMonthAmountColumn(amountFmt.toString(), i); // 当月金额
				GridColumn column2 = buildTotalAmountColumn(amountFmt.toString(), i); // 年累计金额

				storeInfoList.add(store);
				storeAmountList.add(column1);
				storeAmountList.add(column2);

				if (i >= 20) {
					break;
				}
				i++;
			}

			List<List<GridColumn>> columns = new ArrayList<List<GridColumn>>();
			columns.add(storeInfoList);
			columns.add(storeAmountList);

			String data = JacksonUtil.toJson(columns);
			data = data.replaceAll("\".separator.", "").replaceAll(".separator.\"", "");
			
			RespJson respJson = RespJson.success();
			respJson.setData(data);
			respJson.put("flg", flg);

			return respJson;
		} catch (Exception e) {
			LOG.error("获取门店利润报表列数据异常:", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 构建 当月金额 列
	 * @param format
	 * @return
	 * @author liwb
	 * @date 2017年9月14日
	 */
	private GridColumn buildMonthAmountColumn(String format, int storeIndex) {
		GridColumn totalColumn1 = new GridColumn();
		totalColumn1.setField(StoreProfitReportService.COLUMN_MONTH_AMOUNT + storeIndex);
		totalColumn1.setTitle("当月金额");
		totalColumn1.setAlign("right"); // 金额右对齐
		totalColumn1.setWidth("120px");
		totalColumn1.setFormatter(format);
		return totalColumn1;
	}

	/**
	 * @Description: 构建 累计金额 列
	 * @param formatSb
	 * @return
	 * @author liwb
	 * @date 2017年9月14日
	 */
	private GridColumn buildTotalAmountColumn(String format, int storeIndex) {
		GridColumn totalColumn2 = new GridColumn();
		totalColumn2.setField(StoreProfitReportService.COLUMN_TOTAL_AMOUNT + storeIndex);
		totalColumn2.setTitle("年累计金额");
		totalColumn2.setAlign("right"); // 金额右对齐
		totalColumn2.setWidth("120px");
		totalColumn2.setFormatter(format);
		return totalColumn2;
	}

	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author liwb
	 * @date 2017年5月27日
	 */
	private void buildParams(StoreExpendDetailQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			throw new BusinessException("查询机构为空");
		}

		if (qo.getRptDate() != null) {
			Date rptStartDate = DateUtils.getYearFirstDay(qo.getRptDate()); // 获取年第一天
			qo.setRptStartDate(rptStartDate);
		}
	}

	@RequestMapping(value = "exportList", method = RequestMethod.POST)
	public void exportList(StoreExpendDetailQo qo, HttpServletResponse response) {
		try {
			// 构建查询参数
			buildParams(qo);

			LOG.debug("查询门店利润报表条件：{}", qo);

			String timeStr = DateUtils.formatDate(qo.getRptDate(), DateUtils.DATE_JFP_STR);

			// 导出文件名称，不包括后缀名
			String reportFileName = "门店利润报表_" + timeStr;
			
			// 最多1000个店铺数据
			qo.setMaxNo(1000);

			List<DataRecord> storeList = storeProfitReportService.getStoreList(qo);

			List<String> headerList = new ArrayList<String>();
			List<String> columnList = new ArrayList<String>();

			// 行号 列
			headerList.add("行号");
			columnList.add(StoreProfitReportService.COLUMN_ROW_NO);

			// 项目 列
			headerList.add("项目");
			columnList.add(StoreProfitReportService.COLUMN_ITEM_NAME);

			// 合计 列
			headerList.add("合计");
			headerList.add("合计");
			columnList.add(StoreProfitReportService.COLUMN_MONTH_AMOUNT + 0);
			columnList.add(StoreProfitReportService.COLUMN_TOTAL_AMOUNT + 0);

			int i = 1;
			for (DataRecord store : storeList) {
				headerList.add(store.getString(StoreProfitReportService.COLUMN_BRANCH_NAME));
				headerList.add(store.getString(StoreProfitReportService.COLUMN_BRANCH_NAME));
				columnList.add(StoreProfitReportService.COLUMN_MONTH_AMOUNT + i);
				columnList.add(StoreProfitReportService.COLUMN_TOTAL_AMOUNT + i);
				i++;
			}

			String[] headers = headerList.toArray(new String[headerList.size()]);
			String[] columns = columnList.toArray(new String[columnList.size()]);

			// 模板名称，包括后缀名
			List<DataRecord> reportList = storeProfitReportService.getReportListForExport(qo);

			List<JSONObject> dataList = new ArrayList<JSONObject>();
			for (DataRecord r : reportList) {
				JSONObject jObj = new JSONObject();
				for (Entry<String, Object> entry : r.entrySet()) {
					jObj.put(entry.getKey(), entry.getValue());
				}
				dataList.add(jObj);
			}

			// 和并列的公用列名
			String[] mergeHeaders = new String[] { "当月金额", "年累计金额" };

			// 从第一列开始合并列头
			int firstColIndex = 2;

			ExcelExportUtil.exportMergeHeaderExcel(reportFileName, headers, columns, dataList, response, firstColIndex,
					mergeHeaders);

		} catch (Exception e) {
			LOG.error("门店利润报表导出失败", e);
		}

	}

}
