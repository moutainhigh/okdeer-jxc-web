/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年6月5日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.common.fmChargeImport;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.collections.CollectionUtils;

import com.okdeer.jxc.common.utils.StringUtils;

/**
 * ClassName: ChargeImportHandle 
 * @Description: 费用导入处理
 * @author liwb
 * @date 2017年6月5日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

public class FmChargeImportHandle {

	List<JSONObject> excelListFullData = null;

	List<JSONObject> excelListSuccessData = null;

	List<JSONObject> excelListErrorData = null;

	List<String> excelSuccessChargeCode = null;

	// 临时存储数据
	List<JSONObject> tempExcelListSuccessData = new ArrayList<JSONObject>();

	public FmChargeImportHandle(List<JSONObject> excelList, String[] excelField) {
		// 不需要判断货号条码模板，直接去除第一行标题行
		if (!CollectionUtils.isEmpty(excelList)) {
			excelList.remove(0);
		}

		this.excelListFullData = excelList;

		validateForExcelData();

		// 深度拷贝正确的数据
		tempExcelListSuccessData.addAll(excelListSuccessData);

		refreshSuccessData();
	}

	/**
	 * 与数据库对比，查出不存在的数据
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	public void checkWithDataBase(List<FmChargeImportItemVo> dblist) {
		refreshSuccessData();
	}

	/**
	 * 根据chargeCode获取集合中的数据
	 * @param list
	 * @param chargeCode
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月14日
	 */
	private JSONObject getSuccessDataByBarCode(String chargeCode) {
		for (JSONObject jObj : excelListSuccessData) {
			if (jObj.containsKey(FmChargeImportConstant.KEY_CODE)) {
				String objChargeCode = jObj.getString(FmChargeImportConstant.KEY_CODE);
				if (objChargeCode.equals(chargeCode)) {
					excelListSuccessData.remove(jObj);
					return jObj;
				}
			}
		}
		return null;
	}

	/**
	 * @Description: 验证数据有效性 
	 * @author liwb
	 * @date 2017年6月5日
	 */
	private void validateForExcelData() {

		Map<String, Integer> chargeCodeSet = new LinkedHashMap<String, Integer>();

		for (int i = 0; i < excelListFullData.size(); i++) {
			JSONObject obj = excelListFullData.get(i);

			// 费用编码
			String chargeCode = "";

			if (obj.containsKey(FmChargeImportConstant.KEY_CODE)) {

				chargeCode = obj.getString(FmChargeImportConstant.KEY_CODE);
				if (StringUtils.isBlank(chargeCode)) {
					obj.element("error", "费用编码为空");
					continue;
				} else {
					obj.put(FmChargeImportConstant.KEY_CODE, chargeCode.trim());
				}

				// 商品名称重复
				if (chargeCodeSet.keySet().contains(chargeCode)) {

					// 取出原来重复的数据,标记重复
					Integer index = chargeCodeSet.get(chargeCode);
					JSONObject existsObj = excelListFullData.get(index);
					obj.element("error", "费用编码重复");

					if (existsObj.get("error") == null) {
						existsObj.element("error", "费用编码重复");
					}
					continue;
				}

			} else {
				obj.element("error", "费用编码为空");
				continue;
			}
			
			// 数量
			String num = "";
			String numKey = FmChargeImportConstant.KEY_NUM;

			if (obj.containsKey(numKey)) {

				num = obj.getString(numKey);
				if (StringUtils.isBlank(num)) {
					obj.element("error", "数量为空");
					continue;
				} else {
					num = num.trim();
					boolean flg = checkRequiredCommonNum(obj, num, "数量");
					if (!flg) {
						continue;
					}
					obj.put(numKey, num);
				}

			} else {
				obj.element("error", "数量为空");
				continue;
			}

			// 采购价
			String price = "";
			String priceKey = FmChargeImportConstant.KEY_PRICE;

			if (obj.containsKey(priceKey)) {

				price = obj.getString(priceKey);
				if (StringUtils.isNotBlank(price)) {
					price = price.trim();
					boolean flg = checkRequiredCommonNum(obj, price, "采购价");
					if (!flg) {
						continue;
					}
					obj.put(priceKey, price);
				}

			}
			
			// 保修期限
			String validity = "";
			String validityKey = FmChargeImportConstant.KEY_VALIDITY;
			
			if (obj.containsKey(validityKey)) {
				
				validity = obj.getString(validityKey);
				if (StringUtils.isNotBlank(validity)) {
					validity = validity.trim();
					boolean flg = checkRequiredCommonNum(obj, validity, "保修期限");
					if (!flg) {
						continue;
					}
					
					try {
						Integer.parseInt(validity);
					} catch (Exception e) {
						obj.element("error", "保修期限只能为整数");
						continue;
					}
					obj.put(validityKey, validity);
				}
				
			}

			// 备注
			String remark = "";

			if (obj.containsKey("remark")) {
				remark = obj.getString("remark");
				if (StringUtils.isNotBlank(remark)) {
					obj.put("remark", remark.trim());
				}
			}

			chargeCodeSet.put(chargeCode, i);

		}
		// 刷新
		refreshSuccessData();
	}

	/**
	 * @Description: 数值类型校验
	 * @param obj 对象
	 * @param colkey 字段key
	 * @param msg 提示信息
	 * @return   
	 * @return boolean  
	 * @throws
	 * @author zhongy
	 * @date 2017年2月24日
	 */
	private boolean checkRequiredCommonNum(JSONObject obj, String numStr, String colLabel) {
		try {
			Double.parseDouble(numStr);
			
			BigDecimal num = new BigDecimal(numStr);
			
			if(num.compareTo(BigDecimal.ZERO) <= 0){
				obj.element("error", colLabel + "必须大于0");
				return false;
			}
			
			
			// 最大值 999999
			if(num.compareTo(BigDecimal.valueOf(999999)) > 0){
				obj.element("error", colLabel + "不能大于 999999");
				return false;
			}
			
		} catch (Exception e) {
			obj.element("error", colLabel + "只能为数字");
			return false;
		}
		return true;
	}

	/**
	 * 更新有效的数据列表
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	private void refreshSuccessData() {
		excelListSuccessData = new ArrayList<JSONObject>();
		excelSuccessChargeCode = new ArrayList<String>();
		excelListErrorData = new ArrayList<JSONObject>();
		for (JSONObject jsonObject : excelListFullData) {
			if (jsonObject.get("error") == null) {
				excelListSuccessData.add(jsonObject);
				boolean barCodeFlag = jsonObject.containsKey(FmChargeImportConstant.KEY_CODE);
				if (barCodeFlag) {
					excelSuccessChargeCode.add(jsonObject.getString(FmChargeImportConstant.KEY_CODE));
				}
			} else {
				excelListErrorData.add(jsonObject);
			}
		}
	}

	public List<FmChargeImportItemVo> getSuccessData(List<FmChargeImportItemVo> list, String[] excelField,
			FmChargeImportItemVo entity) {
		JSONArray arr = JSONArray.fromObject(list);

		for (int i = 0; i < arr.size(); i++) {
			JSONObject obj = arr.getJSONObject(i);

			boolean chargeCodeFlg = obj.containsKey(FmChargeImportConstant.KEY_CODE);
			JSONObject excelJson = new JSONObject();
			if (chargeCodeFlg) {
				String chargeCode = obj.getString(FmChargeImportConstant.KEY_CODE);
				excelJson = getSuccessDataByBarCode(chargeCode);
			}

			// 忽略第一列,合并属性
			for (int j = 1; j < excelField.length; j++) {
				obj.element(excelField[j], excelJson.get(excelField[j]));
			}
		}

		@SuppressWarnings("unchecked")
		List<FmChargeImportItemVo> temp = JSONArray.toList(arr, entity, new JsonConfig());
		
		// 刷新
		refreshSuccessData();
		return temp;

	}

	/**
	 * @return the excelListSuccessData
	 */
	public List<JSONObject> getExcelListSuccessData() {
		return excelListSuccessData;
	}

	/**
	 * @return the excelSuccessBarCode
	 */
	public List<String> getExcelSuccessCode() {
		return excelSuccessChargeCode;
	}

	/**
	 * @return the excelListErrorData
	 */
	public List<JSONObject> getExcelListErrorData() {
		return excelListErrorData;
	}

}
