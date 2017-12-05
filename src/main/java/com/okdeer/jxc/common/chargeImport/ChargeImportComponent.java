/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年6月5日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.common.chargeImport;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang3.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSONArray;
import com.okdeer.base.common.exception.ServiceException;
import com.okdeer.jxc.common.utils.JSONUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.system.entity.SysDict;
import com.okdeer.jxc.system.service.SysDictService;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.jxc.utils.poi.ExcelReaderUtil;

/**
 * ClassName: ChargeImportComponent 
 * @Description: 费用选择公共组件
 * @author liwb
 * @date 2017年6月5日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Component
public class ChargeImportComponent {

	private static final Logger LOG = LoggerFactory.getLogger(ChargeImportComponent.class);

	@Reference(version = "1.0.0", check = false)
	private SysDictService sysDictService;

	@Resource
	private StringRedisTemplate redisTemplateTmp;

	public ChargeImportVo importSelectCharge(String fileName, InputStream is, String[] fields, String userId,
			String errorFileDownloadUrlPrefix, ChargeImportBusinessValid businessValid,String code) throws ServiceException {
		// 1、读取excel
		List<JSONObject> excelList = ExcelReaderUtil.readExcel(fileName, is, fields);

		// 2、校验导入数据
		ChargeImportHandle chargeImportHandle = new ChargeImportHandle(excelList, fields, businessValid, code);

		// 3 获取到excel导入成功数据
		handelExcelSuccessData(chargeImportHandle,code);

		// 4 刷新数据
		chargeImportHandle.checkWithDataBase(null);

		net.sf.json.JSONArray jArray = net.sf.json.JSONArray.fromObject(chargeImportHandle.getExcelListSuccessData());

		List<ChargeImportItemVo> dbList1 = JSONUtils.parseJSONArray(jArray, new ChargeImportItemVo());

		List<ChargeImportItemVo> successList = chargeImportHandle.getSuccessData(dbList1, fields,
				new ChargeImportItemVo());

		ChargeImportVo chargeImportVo = new ChargeImportVo();

		chargeImportVo.setList(successList);

		Integer successNum = chargeImportHandle.getExcelListSuccessData().size();

		Integer errorNum = chargeImportHandle.getExcelListErrorData().size();

		StringBuffer message = new StringBuffer();
		message.append("成功：");
		message.append(successNum);
		message.append("条，");
		message.append("失败：");
		message.append(errorNum);
		message.append("条。");

		chargeImportVo.setMessage(message.toString());

		List<JSONObject> errorList = chargeImportHandle.getExcelListErrorData();

		if (errorList != null && errorList.size() > 0) {// 有错误数据
			// 列转换处理
			businessValid.errorDataFormatter(errorList);

			// 错误excel内容
			String jsonText = JSONArray.toJSON(errorList).toString();

			// 文件key
			code = "jxc:storeChargeImport:" + userId;

			// 保存10分钟，单用户同时只能保存一个错误文件
			redisTemplateTmp.opsForValue().set(code, jsonText, 10, TimeUnit.MINUTES);

			chargeImportVo.setErrorFileUrl(errorFileDownloadUrlPrefix);
		} else {// 无错误数据
			code = "jxc:storeChargeImport:" + userId;
			redisTemplateTmp.delete(code);
		}

		return chargeImportVo;
	}

	// 处理excel校验成功的数据
	private void handelExcelSuccessData(ChargeImportHandle chargeImportHandle,String code) {
		List<JSONObject> successDatas = chargeImportHandle.getExcelListSuccessData();

		for (JSONObject obj : successDatas) {

			String costTypeCode = obj.getString("costTypeCode"); // 费用代码

			if (StringUtils.isNotBlank(costTypeCode)) {
				SysDict dict = sysDictService.getInfoByCode(code, costTypeCode);
				if (dict == null) {
					obj.element("error", "费用代码不存在");
					continue;
				} else {
					obj.put("costTypeId", dict.getId());
					obj.put("costTypeLabel", dict.getLabel());
				}
			}

		}
	}

	public void downloadErrorFile(String userId, String reportFileName, String[] headers, String[] columns,
			HttpServletResponse response) {
		String code = "jxc:storeChargeImport:" + userId;

		String jsonText = redisTemplateTmp.opsForValue().get(code);

		if (jsonText != null) {
			headers = ArrayUtils.add(headers, "错误原因");
			columns = ArrayUtils.add(columns, "error");

			List<JSONObject> dataList = JSONArray.parseArray(jsonText, JSONObject.class);

			ExcelExportUtil.exportExcel(reportFileName, headers, columns, dataList, response);
		} else {
			response.reset();// 清空输出流
			response.setContentType("text/html");// 定义输出类型
			response.setCharacterEncoding("UTF-8");
			try {
				response.getWriter().println("文件不存在或者文件已过期");
			} catch (IOException e) {
				LOG.error("获取response.getWriter失败", e);
			}
		}
	}

}
