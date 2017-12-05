/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年6月5日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.common.chargeImport;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.collections.CollectionUtils;

import com.okdeer.jxc.common.constant.SysConstant;
import com.okdeer.jxc.common.utils.StringUtils;

/**
 * ClassName: ChargeImportHandle 
 * @Description: ChargeImportHandle
 * @author liwb
 * @date 2017年6月5日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

public class ChargeImportHandle {

	List<JSONObject> excelListFullData = null;

	List<JSONObject> excelListSuccessData = null;

	List<JSONObject> excelListErrorData = null;

	List<String> excelSuccessChargeCode = null;

	ChargeImportBusinessValid businessValid = null;
	
	String costTypeCode = null;

	// 临时存储数据
	List<JSONObject> tempExcelListSuccessData = new ArrayList<JSONObject>();

	public ChargeImportHandle(List<JSONObject> excelList, String[] excelField, ChargeImportBusinessValid businessValid, String code) {
		// 不需要判断货号条码模板，直接去除第一行标题行
		if (!CollectionUtils.isEmpty(excelList)) {
			excelList.remove(0);
		}

		this.excelListFullData = excelList;
		this.businessValid = businessValid;
		this.costTypeCode = code;

		checkChargeCodeIsNullAndRepeat();

		if (businessValid != null) {
			// 深度拷贝正确的数据
			tempExcelListSuccessData.addAll(excelListSuccessData);
			// 业务校验
			businessValid.businessValid(excelListSuccessData, excelField);

			refreshSuccessData();
		}
	}

	/**
	 * 与数据库对比，查出不存在的数据
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	public void checkWithDataBase(List<ChargeImportItemVo> dblist) {
		refreshSuccessData();
	}

	/**
	 * 根据costTypeCode获取集合中的数据
	 * @param list
	 * @param costTypeCode
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月14日
	 */
	private JSONObject getSuccessDataByBarCode(String costTypeCode) {
		for (JSONObject jObj : excelListSuccessData) {
			if (jObj.containsKey("costTypeCode")) {
				String objChargeCode = jObj.getString("costTypeCode");
				if (objChargeCode.equals(costTypeCode)) {
					excelListSuccessData.remove(jObj);
					return jObj;
				}
			}
		}
		return null;
	}

	/**
	 * @Description: 检查费用是否重复
	 * @author liwb
	 * @date 2017年6月5日
	 */
	private void checkChargeCodeIsNullAndRepeat() {

		Map<String, Integer> chargeCodeSet = new LinkedHashMap<String, Integer>();

		for (int i = 0; i < excelListFullData.size(); i++) {
			JSONObject obj = excelListFullData.get(i);

			// 费用编码
			String costTypeCode = "";

			if (obj.containsKey("costTypeCode")) {

				costTypeCode = obj.getString("costTypeCode");
				if (StringUtils.isBlank(costTypeCode)) {
					obj.element("error", "费用编码为空");
					continue;
				} else {
					obj.put("costTypeCode", costTypeCode.trim());
				}

				// 商品名称重复
				if (chargeCodeSet.keySet().contains(costTypeCode)) {

					// 取出原来重复的数据,标记重复
					Integer index = chargeCodeSet.get(costTypeCode);
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

			// 费用金额
			String amount = "";
			String amountKey = "amount";

			if (obj.containsKey(amountKey)) {

				amount = obj.getString(amountKey);
				if (StringUtils.isBlank(amount)) {
					obj.element("error", "费用金额为空");
					continue;
				} else {
					obj.put(amountKey, amount.trim());
				}

			} else {
				obj.element("error", "费用金额为空");
				continue;
			}

			// 备注
			String remark = "";

			if (obj.containsKey("remark")) {
				remark = obj.getString("remark");
				if (StringUtils.isNotBlank(remark)) {
					obj.put("remark", remark.trim());
				}
			}

			boolean amountFlg = checkRequiredCommonPrice(obj, amountKey);
			if (!amountFlg) {
				continue;
			}

			chargeCodeSet.put(costTypeCode, i);

		}
		// 刷新
		refreshSuccessData();
	}

	/**
	 * @Description: 价格必填校验
	 * @param obj 对象
	 * @param colkey 字段key
	 * @param msg 提示信息
	 * @return   
	 * @return boolean  
	 * @throws
	 * @author zhongy
	 * @date 2017年2月24日
	 */
	private boolean checkRequiredCommonPrice(JSONObject obj, String colkey) {
		boolean colFlag = obj.containsKey(colkey);
		if (colFlag) {
			String priceStr = obj.getString(colkey);
			if (StringUtils.isBlank(priceStr)) {
				obj.element("error", "金额不能为空");
				return false;
			} else {
				try {
					Double.parseDouble(priceStr);
					
					BigDecimal price = new BigDecimal(priceStr);
					
					if(price.compareTo(BigDecimal.ZERO) == 0){
						obj.element("error", "金额不能为0");
						return false;
					}
					
					// 进项税额可以为负数
					if(!SysConstant.DICT_TYPE_INPUT_TAX_AUTH_CODE.equals(costTypeCode) && price.compareTo(BigDecimal.ZERO) < 0){
						obj.element("error", "金额必须大于0");
						return false;
					}
					
					
					// 最大值 999999
					if(price.compareTo(BigDecimal.valueOf(999999)) > 0){
						obj.element("error", "金额不能大于 999999");
						return false;
					}
					
					// 最小值 -999999
					if(SysConstant.DICT_TYPE_INPUT_TAX_AUTH_CODE.equals(costTypeCode) && price.compareTo(BigDecimal.valueOf(-999999)) < 0){
						obj.element("error", "金额不能小于 -999999");
						return false;
					}
					
				} catch (Exception e) {
					obj.element("error", "金额只能为数字");
					return false;
				}
			}
		} else {
			obj.element("error", "费用金额为空");
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
				boolean barCodeFlag = jsonObject.containsKey("costTypeCode");
				if (barCodeFlag) {
					excelSuccessChargeCode.add(jsonObject.getString("costTypeCode"));
				}
			} else {
				excelListErrorData.add(jsonObject);
			}
		}
	}

	public List<ChargeImportItemVo> getSuccessData(List<ChargeImportItemVo> list, String[] excelField,
			ChargeImportItemVo entity) {
		JSONArray arr = JSONArray.fromObject(list);

		for (int i = 0; i < arr.size(); i++) {
			JSONObject obj = arr.getJSONObject(i);

			boolean costTypeCodeFlg = obj.containsKey("costTypeCode");
			JSONObject excelJson = new JSONObject();
			if (costTypeCodeFlg) {
				String costTypeCode = obj.getString("costTypeCode");
				excelJson = getSuccessDataByBarCode(costTypeCode);
			}

			// 忽略第一列,合并属性
			for (int j = 1; j < excelField.length; j++) {
				obj.element(excelField[j], excelJson.get(excelField[j]));
			}
		}

		@SuppressWarnings("unchecked")
		List<ChargeImportItemVo> temp = JSONArray.toList(arr, entity, new JsonConfig());

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
