/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年10月26日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.common;

import com.okdeer.jxc.common.report.ReportService;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.retail.common.report.DataRecord;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * ClassName: ReportController 
 * @Description: ReportController
 * @author xiaoj02
 * @date 2016年10月26日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *	v1.2.0				2016-10-26		xiaoj02				报表通用controller
 */
@SuppressWarnings("deprecation")
public abstract class ReportController extends BaseController<T> {

	ExecutorService excutor = Executors.newFixedThreadPool(20);

	public abstract ReportService getReportService();

	public abstract Map<String, Object> getParam(HttpServletRequest request);
	
	/**
	 * @Description: 价格权限字段过滤Map集合 <权限名称， 权限字段，多个以','分隔>
	 * @return
	 * @author liwb
	 * @date 2017年7月20日
	 */
	public abstract Map<String, String> getPriceAccess();

	@RequestMapping("reportList")
	@ResponseBody
	public List<DataRecord> reportList(HttpServletRequest request) {
		/**List<DataRecord> list = getReportService().getList(getParam(request));*/
		List<DataRecord> list = queryListPartition(getParam(request));
		for(DataRecord dataRecord:list){
			formatter(dataRecord);
		}
		return list;
	}

	@RequestMapping("reportListPage")
	@ResponseBody
	public PageUtils<DataRecord> reportListPage(HttpServletRequest request,
												@RequestParam(value = "page", defaultValue = PAGE_NO) Integer page,
												@RequestParam(value = "rows", defaultValue = PAGE_SIZE) Integer rows) throws ExecutionException, InterruptedException {
		PageUtils<DataRecord> list = getReportService().getListPage(getParam(request), page, rows);
		for(DataRecord dataRecord:list.getList()){
			formatter(dataRecord);
		}
		cleanDataMaps(getPriceAccess(), list.getList());
		cleanDataMaps(getPriceAccess(), list.getFooter());
		return list;
	}

	@RequestMapping(value = "exportExcel")
	public void exportExcel(HttpServletRequest request, HttpServletResponse response) {
		String reportFileName = getFileName();
		String[] headers = getHeaders();
		String[] columns = getColumns();
		/**List<DataRecord> dataList = getReportService().getList(getParam(request));*/
		List<DataRecord> dataList = queryListPartition(getParam(request));

		List<JSONObject> jsonList = new ArrayList<JSONObject>();
		for (DataRecord dataRecord : dataList) {
			JSONObject jsonObject = new JSONObject();
			// 格式化数据
			formatter(dataRecord);

			jsonObject.putAll(dataRecord);
			jsonList.add(jsonObject);
		}

		ExcelExportUtil.exportExcel(reportFileName, headers, columns, jsonList, response);
	}

    public List<DataRecord> queryListPartition(Map<String, Object> param) {
        List<DataRecord> recordList = new ArrayList<>();
        int startCount = limitStartCount(Integer.parseInt(String.valueOf(param.get("startCount"))));
        int endCount = limitEndCount(Integer.parseInt(String.valueOf(param.get("endCount"))));

        LOG.info("ReportController.queryListPartition查询记录数导出startCount和endCount参数：{}, {}", startCount, endCount);
		int resIndex = (endCount / LIMIT_REQ_COUNT);
		int modIndex = endCount % LIMIT_REQ_COUNT;
		LOG.info("ReportController.queryListPartition查询记录数导出resIndex和modIndex参数：{}, {}", resIndex, modIndex);
		if (resIndex > 0) {
			for (int i = 0; i < resIndex; i++) {
				int newStart = (i * LIMIT_REQ_COUNT) + startCount;
				param.put("startCount", newStart);
				param.put("endCount", LIMIT_REQ_COUNT);
				LOG.info("ReportController.queryListPartition for查询记录数导出i、startCount、endCount参数：{}, {}, {}", i, newStart,
						LIMIT_REQ_COUNT);
				List<DataRecord> tempList = getReportService().getList(param);
				recordList.addAll(tempList);
				// 如果实际只有100条数据，页面导出输入1-20000，查询到结果集不足每页最大时，不再执行后面的查询
				if (CollectionUtils.isEmpty(tempList) || tempList.size() != LIMIT_REQ_COUNT) {
					break;
				}
			}
			if (modIndex > 0) {
				int newStart = (resIndex * LIMIT_REQ_COUNT) + startCount;
				int newEnd = modIndex;
				param.put("startCount", newStart);
				param.put("endCount", LIMIT_REQ_COUNT);
				LOG.info("ReportController.queryListPartition查询记录数导出mod、startCount、endCount参数:{}, {}", newStart, newEnd);
                List<DataRecord> tempList = getReportService().getList(param);
                recordList.addAll(tempList);
			}
		} else {
			LOG.info("ReportController.queryListPartition查询记录数导出不超过:{}", LIMIT_REQ_COUNT);
            List<DataRecord> tempList = getReportService().getList(param);
            recordList.addAll(tempList);
		}
		return recordList;
	}

	public abstract String getFileName();

	public abstract String[] getHeaders();

	public abstract String[] getColumns();

	public abstract void formatter(DataRecord dataRecord);

	/**
	 * @Description: 将参数转成map
	 * @param req
	 * @param model
	 * @return   
	 * @return Map<String,Object>  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月26日
	 */
	public Map<String, Object> builderParams(HttpServletRequest req, Model model) {
		Map<String, Object> retParams = new HashMap<String, Object>(req.getParameterMap().size());
		Map<String, String[]> params = req.getParameterMap();
		String branchCompleCode = UserUtil.getCurrentUser().getBranchCompleCode();
		retParams.put("branchCompleCode", branchCompleCode);
		if (null != params && params.size() > 0) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			for (Entry<String, String[]> p : params.entrySet()) {
				if (null == p.getValue() || StringUtils.isEmpty(Arrays.toString(p.getValue())))
					continue;
				// 只转换一个参数，多个参数不转换
				String values[] = (String[]) p.getValue();
				String match = "^((((1[6-9]|[2-9]\\d)\\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\\d):[0-5]?\\d:[0-5]?\\d$";
				if (StringUtils.isNotBlank(values[0])) {
					if (values[0].matches(match)) {
						try {
							retParams.put(p.getKey(), sdf.parse(values[0]));
						} catch (ParseException e) {
							retParams.put(p.getKey(), values);
							LOG.error("builderParams将参数转成map失败:{}", e);
						}
					} else if (p.getKey().equals("queryCondition") && model.asMap().containsKey("queryCondition")) {
						retParams.put(p.getKey(), model.asMap().get("queryCondition"));
					} else {
						retParams.put(p.getKey(), values[0].trim());
					}
				}
			}
		}
		return retParams;
	}
}
