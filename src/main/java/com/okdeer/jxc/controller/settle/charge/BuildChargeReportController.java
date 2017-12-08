/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年9月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.settle.charge;

import java.util.ArrayList;
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
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.charge.qo.BuildChargeTypeReportQo;
import com.okdeer.jxc.settle.charge.service.BuildChargeReportService;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.retail.common.entity.colsetting.GridColumn;
import com.okdeer.retail.common.report.DataRecord;
import com.okdeer.retail.common.util.JacksonUtil;

/**
 * ClassName: StoreProfitReportController 
 * @Description: 开店投资费用报表Controller
 * @author liwb
 * @date 2017年12月08日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@SuppressWarnings("deprecation")
@RestController
@RequestMapping("report/buildChargeInvest")
public class BuildChargeReportController extends BaseController<BuildChargeReportController> {

	@Reference(version = "1.0.0", check = false)
	private BuildChargeReportService buildChargeReportService;

	/**
	 * 跳转到列表
	 */
	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("finance/buildCharge/buildChargeReportList");
	}

	@RequestMapping(value = "getList", method = RequestMethod.POST)
	public PageUtils<DataRecord> getList(BuildChargeTypeReportQo qo) {

		try {

			// 构建查询参数
			buildParams(qo);

			LOG.debug("查询开店投资费用报表条件：{}", qo);

			PageUtils<DataRecord> page = buildChargeReportService.getReportList(qo);

			return page;
		} catch (Exception e) {
			LOG.error("查询开店投资费用报表异常:", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "getColumns", method = RequestMethod.POST)
	public RespJson getColumns(BuildChargeTypeReportQo qo) {
		try {
			// 构建查询参数
			buildParams(qo);

			LOG.debug("获取开店投资费用报表列数据查询条件：{}", qo);

			int count = buildChargeReportService.getStoreCount(qo);
			boolean flg = false;

			// 如果超过20个，要弹框提示
			if (count > BuildChargeReportService.MAX_STORE_NUM) {
				flg = true;
			}

			qo.setMaxNo(BuildChargeReportService.MAX_STORE_NUM);

			List<DataRecord> storeList = buildChargeReportService.getStoreList(qo);

			if (CollectionUtils.isEmpty(storeList)) {
				LOG.warn("获取开店投资费用报表列数据为空！");
				return RespJson.businessError("获取开店投资费用报表列数据为空!");
			}
			
			// 是否加粗 格式，isBold 函数在JS文件中实现
			StringBuffer boldFmt = new StringBuffer();
			boldFmt.append(".separator.function(value,row,index){");
			boldFmt.append("return isFooter(value, row, index);");
			boldFmt.append("}.separator.");

			List<GridColumn> storeInfoList = new ArrayList<GridColumn>();
			List<GridColumn> storeAmountList = new ArrayList<GridColumn>();

			// 构建 三级类别 列
			GridColumn threeLevelType = new GridColumn();
			threeLevelType.setField(BuildChargeReportService.COL_KEY_THREE_LEVEL_CG_NAME);
			threeLevelType.setTitle(BuildChargeReportService.COL_TITLE_THREE_LEVEL_CG_NAME);
			threeLevelType.setRowspan(2); // 行合并
			threeLevelType.setWidth("100px");
			threeLevelType.setFormatter(boldFmt.toString());
			storeInfoList.add(threeLevelType);

			// 构建 费用编码 列
			GridColumn chargeCode = new GridColumn();
			chargeCode.setField(BuildChargeReportService.COL_KEY_CHARGE_CODE);
			chargeCode.setTitle(BuildChargeReportService.COL_TITLE_CHARGE_CODE);
			chargeCode.setRowspan(2); // 行合并
			chargeCode.setWidth("70px");
			storeInfoList.add(chargeCode);

			// 构建 费用名称 列
			GridColumn chargeName = new GridColumn();
			chargeName.setField(BuildChargeReportService.COL_KEY_CHARGE_NAME);
			chargeName.setTitle(BuildChargeReportService.COL_TITLE_CHARGE_NAME);
			chargeName.setRowspan(2); // 行合并
			chargeName.setWidth("120px");
			storeInfoList.add(chargeName);

			// 构建 合计 列
			GridColumn totalColumn = new GridColumn();
			totalColumn.setField(BuildChargeReportService.COL_KEY_TOTAL_COLUMN);
			totalColumn.setTitle(BuildChargeReportService.COL_TITLE_TOTAL_COLUMN);
			totalColumn.setColspan(2); // 列合并
			storeInfoList.add(totalColumn);

			// 金额格式化，getPriceFmtB 函数在JS文件中实现
			StringBuffer amountFmt = new StringBuffer();
			amountFmt.append(".separator.function(value,row,index){");
			amountFmt.append("return getPriceFmtB(value);");
			amountFmt.append("}.separator.");

			// 构建合计总 数量、金额 列
			GridColumn totalColumn1 = buildTotalNumColumn(amountFmt.toString(), 0);
			GridColumn totalColumn2 = buildTotalAmountColumn(amountFmt.toString(), 0);
			storeAmountList.add(totalColumn1);
			storeAmountList.add(totalColumn2);

			int i = 1;
			for (DataRecord r : storeList) {

				// 显示名称 [机构编码]机构名称
				String branchName = r.getString(BuildChargeReportService.COL_KEY_BRANCH_NAME);

				GridColumn store = new GridColumn(); // 店铺名称
				store.setField(BuildChargeReportService.COL_KEY_BRANCH_NAME + i);
				store.setTitle(branchName);
				store.setColspan(2); // 列合并

				GridColumn column1 = buildTotalNumColumn(amountFmt.toString(), i); // 数量
				GridColumn column2 = buildTotalAmountColumn(amountFmt.toString(), i); // 金额

				storeInfoList.add(store);
				storeAmountList.add(column1);
				storeAmountList.add(column2);

				if (i >= BuildChargeReportService.MAX_STORE_NUM) {
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
			LOG.error("获取开店投资费用报表列数据异常:", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 构建 数量 列
	 * @param format
	 * @return
	 * @author liwb
	 * @date 2017年9月14日
	 */
	private GridColumn buildTotalNumColumn(String format, int storeIndex) {
		GridColumn totalColumn1 = new GridColumn();
		totalColumn1.setField(BuildChargeReportService.COL_KEY_TOTAL_NUM + storeIndex);
		totalColumn1.setTitle(BuildChargeReportService.COL_TITLE_TOTAL_NUM);
		totalColumn1.setAlign("right"); // 金额右对齐
		totalColumn1.setWidth("120px");
		totalColumn1.setFormatter(format);
		return totalColumn1;
	}

	/**
	 * @Description: 构建 金额 列
	 * @param formatSb
	 * @return
	 * @author liwb
	 * @date 2017年9月14日
	 */
	private GridColumn buildTotalAmountColumn(String format, int storeIndex) {
		GridColumn totalColumn2 = new GridColumn();
		totalColumn2.setField(BuildChargeReportService.COL_KEY_TOTAL_AMOUNT + storeIndex);
		totalColumn2.setTitle(BuildChargeReportService.COL_TITLE_TOTAL_AMOUNT);
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
	private void buildParams(BuildChargeTypeReportQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

	}

	@RequestMapping(value = "exportList", method = RequestMethod.POST)
	public void exportList(BuildChargeTypeReportQo qo, HttpServletResponse response) {
		try {
			// 构建查询参数
			buildParams(qo);

			LOG.debug("查询开店投资费用报表条件：{}", qo);

			String timeStr = DateUtils.getCurrSmallStr();

			// 导出文件名称，不包括后缀名
			String reportFileName = "开店投资费用报表_" + timeStr;

			// 最多1000个店铺数据
			qo.setMaxNo(1000);

			List<DataRecord> storeList = buildChargeReportService.getStoreList(qo);

			List<String> headerList = new ArrayList<String>();
			List<String> columnList = new ArrayList<String>();

			// 三级类别 列
			headerList.add(BuildChargeReportService.COL_TITLE_THREE_LEVEL_CG_NAME);
			columnList.add(BuildChargeReportService.COL_KEY_THREE_LEVEL_CG_NAME);

			// 编号 列
			headerList.add(BuildChargeReportService.COL_TITLE_CHARGE_CODE);
			columnList.add(BuildChargeReportService.COL_KEY_CHARGE_CODE);

			// 名称 列
			headerList.add(BuildChargeReportService.COL_TITLE_CHARGE_NAME);
			columnList.add(BuildChargeReportService.COL_KEY_CHARGE_NAME);

			// 合计 列
			headerList.add(BuildChargeReportService.COL_TITLE_TOTAL_COLUMN);
			headerList.add(BuildChargeReportService.COL_TITLE_TOTAL_COLUMN);
			columnList.add(BuildChargeReportService.COL_KEY_TOTAL_NUM + 0);
			columnList.add(BuildChargeReportService.COL_KEY_TOTAL_AMOUNT + 0);

			int i = 1;
			for (DataRecord store : storeList) {
				headerList.add(store.getString(BuildChargeReportService.COL_KEY_BRANCH_NAME));
				headerList.add(store.getString(BuildChargeReportService.COL_KEY_BRANCH_NAME));
				columnList.add(BuildChargeReportService.COL_KEY_TOTAL_NUM + i);
				columnList.add(BuildChargeReportService.COL_KEY_TOTAL_AMOUNT + i);
				i++;
			}

			String[] headers = headerList.toArray(new String[headerList.size()]);
			String[] columns = columnList.toArray(new String[columnList.size()]);

			// 模板名称，包括后缀名
			List<DataRecord> reportList = buildChargeReportService.getReportListForExport(qo);

			List<JSONObject> dataList = new ArrayList<JSONObject>();
			for (DataRecord r : reportList) {
				JSONObject jObj = new JSONObject();
				for (Entry<String, Object> entry : r.entrySet()) {
					jObj.put(entry.getKey(), entry.getValue());
				}
				dataList.add(jObj);
			}

			// 和并列的公用列名
			String[] mergeHeaders = new String[] { BuildChargeReportService.COL_TITLE_TOTAL_NUM,
					BuildChargeReportService.COL_TITLE_TOTAL_AMOUNT };

			// 从第一列开始合并列头
			int firstColIndex = 3;

			ExcelExportUtil.exportMergeHeaderExcel(reportFileName, headers, columns, dataList, response, firstColIndex,
					mergeHeaders);

		} catch (Exception e) {
			LOG.error("开店投资费用报表导出失败", e);
		}

	}

}
