/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年6月5日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.common.fmChargeImport;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
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
import com.okdeer.jxc.common.utils.BigDecimalUtils;
import com.okdeer.jxc.common.utils.JSONUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.settle.charge.entity.Charge;
import com.okdeer.jxc.settle.charge.service.ChargeService;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.jxc.utils.poi.ExcelReaderUtil;

/**
 * ClassName: FmChargeImportComponent 
 * @Description: 费用导入公共组件
 * @author liwb
 * @date 2017年6月5日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Component
public class FmChargeImportComponent {

	private static final Logger LOG = LoggerFactory.getLogger(FmChargeImportComponent.class);

	private static final String prefixKey = "jxc:buildChargeImport:";

	@Reference(version = "1.0.0", check = false)
	private ChargeService chargeService;

	@Resource
	private StringRedisTemplate redisTemplateTmp;

	public FmChargeImportVo importSelectCharge(String fileName, InputStream is, String[] fields, String userId,
			String errorFileDownloadUrlPrefix) throws ServiceException {
		// 1、读取excel
		List<JSONObject> excelList = ExcelReaderUtil.readExcel(fileName, is, fields);

		// 2、校验导入数据
		FmChargeImportHandle chargeImportHandle = new FmChargeImportHandle(excelList, fields);

		// 3 获取到excel导入成功数据
		handelExcelSuccessData(chargeImportHandle);

		// 4 刷新数据
		chargeImportHandle.checkWithDataBase(null);

		net.sf.json.JSONArray jArray = net.sf.json.JSONArray.fromObject(chargeImportHandle.getExcelListSuccessData());

		List<FmChargeImportItemVo> dbList1 = JSONUtils.parseJSONArray(jArray, new FmChargeImportItemVo());

		List<FmChargeImportItemVo> successList = chargeImportHandle.getSuccessData(dbList1, fields,
				new FmChargeImportItemVo());

		FmChargeImportVo chargeImportVo = new FmChargeImportVo();

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

		// 文件key
		String code = prefixKey + userId;

		if (errorList != null && errorList.size() > 0) {// 有错误数据

			// 错误excel内容
			String jsonText = JSONArray.toJSON(errorList).toString();

			// 保存10分钟，单用户同时只能保存一个错误文件
			redisTemplateTmp.opsForValue().set(code, jsonText, 10, TimeUnit.MINUTES);

			chargeImportVo.setErrorFileUrl(errorFileDownloadUrlPrefix);
		} else {// 无错误数据
			redisTemplateTmp.delete(code);
		}

		return chargeImportVo;
	}

	// 处理excel校验成功的数据
	private void handelExcelSuccessData(FmChargeImportHandle chargeImportHandle) {
		List<JSONObject> successDatas = chargeImportHandle.getExcelListSuccessData();

		for (JSONObject obj : successDatas) {

			String chargeCode = obj.getString(FmChargeImportConstant.KEY_CODE); // 费用编码
			String numStr = obj.getString(FmChargeImportConstant.KEY_NUM); // 数量
			String priceStr = obj.getString(FmChargeImportConstant.KEY_PRICE); // 价格
			String validityStr = obj.getString(FmChargeImportConstant.KEY_VALIDITY); // 保修期限
			String remark = obj.getString(FmChargeImportConstant.KEY_REMARK); // 备注

			if (StringUtils.isNotBlank(chargeCode)) {
				Charge charge = chargeService.getInfoByCode(chargeCode);
				if (charge == null) {
					obj.element("error", "费用编码不存在");
					continue;
				} else {
					obj.put(FmChargeImportConstant.KEY_ID, charge.getId());
					obj.put(FmChargeImportConstant.KEY_CODE, charge.getChargeCode());
					obj.put(FmChargeImportConstant.KEY_NAME, charge.getChargeName());
					obj.put("spec", charge.getSpec()); //规格
					obj.put("unit", charge.getUnit()); //单位
				}
				
				/** 默认值赋值  */
				
				BigDecimal num = BigDecimal.ZERO;
				BigDecimal purPrice = BigDecimal.ZERO;
				
				// 数量
				if (StringUtils.isBlank(numStr)) {
					obj.put(FmChargeImportConstant.KEY_NUM, "0.0000");
				}else{
					num = new BigDecimal(numStr.trim());
				}
				
				// 采购价
				if(StringUtils.isBlank(priceStr)){
					obj.put(FmChargeImportConstant.KEY_PRICE, charge.getPurPrice());
					purPrice = charge.getPurPrice();
				}else{
					purPrice = new BigDecimal(priceStr.trim());
				}
				
				// 金额 = 数量 * 采购价
				BigDecimal amount = BigDecimalUtils.formatFourDecimal(num.multiply(purPrice));
				obj.put("amount", amount);
				
				// 保修期限
				if(StringUtils.isBlank(validityStr)){
					obj.put(FmChargeImportConstant.KEY_VALIDITY, charge.getValidity());
				}
				
				// 保修期限
				if(StringUtils.isBlank(remark)){
					obj.put(FmChargeImportConstant.KEY_REMARK, charge.getRemark());
				}
				
			}

		}
	}

	public void downloadErrorFile(String userId, String reportFileName, String[] headers, String[] columns,
			HttpServletResponse response) {
		String code = prefixKey + userId;

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
