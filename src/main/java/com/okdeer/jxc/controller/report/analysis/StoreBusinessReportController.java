/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年12月6日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.analysis;

import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.analysis.qo.StoreBusinessReportQo;
import com.okdeer.jxc.report.analysis.service.StoreBusinessReportService;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.retail.common.entity.colsetting.GridColumn;
import com.okdeer.retail.common.report.DataRecord;
import com.okdeer.retail.common.util.JacksonUtil;

import net.sf.json.JSONObject;

/**
 * ClassName: StoreBusinessSearchController 
 * @Description: 分公司月经营利润表controller
 * @author zhengwj
 * @date 2017年12月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("report/storeBusiness")
public class StoreBusinessReportController extends BaseController<StoreBusinessReportController> {

	/**
	 * @Fields storeBusinessReportService : StoreBusinessReportService
	 */
	@Reference(version = "1.0.0", check = false)
	private StoreBusinessReportService storeBusinessReportService;

	/**
	 * 跳转到列表
	 */
	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("report/analysis/storeBusinessReportList");
	}

	/**
	 * @Description: 查询列表
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "getList", method = RequestMethod.POST)
	public PageUtils<DataRecord> getList(StoreBusinessReportQo qo) {
		try {
			// 构建查询参数
			buildParams(qo);
			qo.setMaxNo(StoreBusinessReportService.MAX_STORE_NUM);
			LOG.debug("查询分公司月经营利润报表条件：{}", qo);
			PageUtils<DataRecord> page = storeBusinessReportService.getReportList(qo);
			return page;
		} catch (Exception e) {
			LOG.error("查询分公司月经营利润报表异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 构建查询参数
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	private void buildParams(StoreBusinessReportQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}
	}

	/**
	 * @Description: 获取页面表头
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "getColumns", method = RequestMethod.POST)
	public RespJson getColumns(StoreBusinessReportQo qo) {
		try {
			// 构建查询参数
			buildParams(qo);
			LOG.debug("获取分公司月经营利润报表列数据查询条件：{}", qo);

			int count = storeBusinessReportService.getStoreCount(qo);
			boolean flg = false;
			// 如果超过20个，要弹框提示
			if (count > StoreBusinessReportService.MAX_STORE_NUM) {
				flg = true;
			}
			qo.setMaxNo(StoreBusinessReportService.MAX_STORE_NUM);

			List<DataRecord> storeList = storeBusinessReportService.getStoreList(qo);
			if (CollectionUtils.isEmpty(storeList)) {
				LOG.warn("获取分公司月经营利润报表列数据为空！");
				return RespJson.businessError("获取分公司月经营利润报表列数据为空!");
			}

			List<GridColumn> storeInfoList = new ArrayList<>();
			List<GridColumn> storeAmountList = new ArrayList<>();

			// 构建 门店 列
			GridColumn store = new GridColumn();
			store.setField(StoreBusinessReportService.COLUMN_STORE);
			store.setTitle("门店");
			// 行合并
			store.setRowspan(2);
			store.setWidth("100px");
			storeInfoList.add(store);

			// 金额格式化，getTwoDecimalB 函数在JS文件中实现
			StringBuilder amountFmt = new StringBuilder();
			amountFmt.append(".separator.function(value,row,index){");
			amountFmt.append("return getTwoDecimalB(value);");
			amountFmt.append("}.separator.");

			// 循环店铺，构建表头店铺名称
			for (int i = 1; i <= storeList.size() && i <= StoreBusinessReportService.MAX_STORE_NUM; i++) {
				DataRecord record = storeList.get(i - 1);
				GridColumn item = new GridColumn();
				item.setField(StoreBusinessReportService.COLUMN_BRANCH_NAME + i);
				// 店铺名称
				item.setTitle(record.getString(StoreBusinessReportService.COLUMN_BRANCH_NAME));
				// 列合并
				item.setColspan(2);
				storeInfoList.add(item);

				// 当月金额
				GridColumn column1 = new GridColumn();
				column1.setField(StoreBusinessReportService.COLUMN_MONTH_AMOUNT + i);
				column1.setTitle("当月金额");
				column1.setAlign("right");
				column1.setWidth("120px");
				column1.setFormatter(amountFmt.toString());
				storeAmountList.add(column1);
				// 当月占比
				GridColumn column2 = new GridColumn();
				column2.setField(StoreBusinessReportService.COLUMN_MONTH_PROPORTION + i);
				column2.setTitle("当月占比");
				column2.setAlign("right");
				column2.setWidth("120px");
				column2.setFormatter(amountFmt.toString());
				storeAmountList.add(column2);
			}

			List<List<GridColumn>> columns = new ArrayList<>();
			columns.add(storeInfoList);
			columns.add(storeAmountList);

			String data = JacksonUtil.toJson(columns);
			data = data.replaceAll("\".separator.", "").replaceAll(".separator.\"", "");

			RespJson respJson = RespJson.success();
			respJson.setData(data);
			respJson.put("flg", flg);

			return respJson;
		} catch (Exception e) {
			LOG.error("获取分公司月经营利润报表列数据异常:", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 导出列表
	 * @author zhengwj
	 * @date 2017年12月7日
	 */
	@RequestMapping(value = "exportList", method = RequestMethod.POST)
	public void exportList(StoreBusinessReportQo qo, HttpServletResponse response) {
		try {
			// 构建查询参数
			buildParams(qo);
			LOG.debug("导出分公司月经营利润报表条件：{}", qo);
			// 导出文件名称，不包括后缀名
			String reportFileName = "分公司月经营利润报表_" + DateUtils.formatDate(qo.getMonth(), DateUtils.DATE_JFP_STR);

			// 最多1000个店铺数据
			qo.setMaxNo(StoreBusinessReportService.MAX_EXPORT_STORE_NUM);

			List<DataRecord> storeList = storeBusinessReportService.getStoreList(qo);

			List<String> headerList = new ArrayList<>();
			List<String> columnList = new ArrayList<>();

			// 门店 列
			headerList.add("门店");
			columnList.add(StoreBusinessReportService.COLUMN_STORE);

			int i = 1;
			for (DataRecord record : storeList) {
				headerList.add(record.getString(StoreBusinessReportService.COLUMN_BRANCH_NAME));
				headerList.add(record.getString(StoreBusinessReportService.COLUMN_BRANCH_NAME));
				columnList.add(StoreBusinessReportService.COLUMN_MONTH_AMOUNT + i);
				columnList.add(StoreBusinessReportService.COLUMN_MONTH_PROPORTION + i);
				i++;
			}

			String[] headers = headerList.toArray(new String[headerList.size()]);
			String[] columns = columnList.toArray(new String[columnList.size()]);

			List<DataRecord> reportList = storeBusinessReportService.getReportListForExport(qo);
			List<JSONObject> dataList = new ArrayList<>();
			for (DataRecord r : reportList) {
				JSONObject jsonObject = new JSONObject();
				for (Entry<String, Object> entry : r.entrySet()) {
					jsonObject.put(entry.getKey(), entry.getValue());
				}
				dataList.add(jsonObject);
			}

			// 和并列的公用列名
			String[] mergeHeaders = new String[] { "当月金额", "当月占比" };
			// 从第一列开始合并列头
			int firstColIndex = 1;

			ExcelExportUtil.exportMergeHeaderExcel(reportFileName, headers, columns, dataList, response, firstColIndex,
					mergeHeaders);
		} catch (Exception e) {
			LOG.error("分公司月经营利润报表导出失败", e);
		}
	}

}
