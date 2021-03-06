/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年10月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.common.goodselect;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.okdeer.jxc.common.enums.GoodsTypeEnum;
import com.okdeer.jxc.goods.entity.GoodsSelect;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.EnumMorpher;
import net.sf.json.util.JSONUtils;

/**
 * ClassName: GoodsSelectImport 
 * @author xiaoj02
 * @date 2016年10月13日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

public class GoodsSelectImportSkuCodeHandle implements GoodsSelectImportHandle{
	
	public static final String CODE_IS_BLANK = "货号为空";
	public static final String CODE_IS_REPEAT = "货号重复";
	public static final String NOT_EXISTS = "找不到该商品或该商品状态不正确";
	public static final String ERROR_TEMPLATE = "模板使用错误";

	List<JSONObject> excelListFullData = null;
	List<JSONObject> excelListSuccessData = null;
	List<JSONObject> excelListErrorData = null;
	
	List<String> excelSuccessSkuCode = null; 
	
	GoodsSelectImportBusinessValid businessValid;
	
	// 临时存储数据
	List<JSONObject> tempExcelListSuccessData = new ArrayList<JSONObject>();
	
	@SuppressWarnings("unchecked")
	public GoodsSelectImportSkuCodeHandle(List<JSONObject> excelList, String[] excelField, GoodsSelectImportBusinessValid businessValid){
		// 第一条记录为标题行，取出第一条记录用于判断模板
		if (!CollectionUtils.isEmpty(excelList)) {
			JSONObject title = excelList.get(0);
			title.forEach((key, value) -> title.put(key, ((String) value).trim()));
			// 没有货号字段，视为错误模板
			if (!title.containsValue("货号")) {
				for (int i = 0; i < excelList.size(); i++) {
					JSONObject obj = excelList.get(i);
					obj.element("error", ERROR_TEMPLATE);
				}
			}
			// 去除标题行，留下数据
			excelList.remove(0);
			this.excelListFullData = excelList;
			//刷新
			refreshSuccessData();
		} else {			
			this.excelListFullData = excelList;
		}
		this.businessValid = businessValid;
		//检验标记出SkuCode重复或者为空的数据
		checkSkuCodeIsNullAndRepeat();
		
		if(businessValid != null){
			// 深度拷贝正确的数据
			tempExcelListSuccessData.addAll(excelListSuccessData);
			//业务校验
			businessValid.businessValid(excelListSuccessData, excelField);
			//刷新
			refreshSuccessData();
		}
	}
	
	/**
	 * 与数据库对比，查出不存在的数据
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	@Override
	public void checkWithDataBase(List<? extends GoodsSelect> dblist) {
		for (int i = 0; i < excelListSuccessData.size(); i++) {
			JSONObject jsonObject = excelListSuccessData.get(i);
			String skuCode = jsonObject.getString("skuCode");
			GoodsSelect goods = getBySkuCode(dblist, skuCode);
			if(goods == null){//数据库不存在的数据
				jsonObject.element("error", NOT_EXISTS);
			}
		}
		//刷新
		refreshSuccessData();
		
		
	}
	
	/**
	 * 根据skuCode获取集合中的数据
	 * @param list
	 * @param skuCode
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月14日
	 */
	private GoodsSelect getBySkuCode(List<? extends GoodsSelect> list, String skuCode){
		for (GoodsSelect goods : list) {
			String objSkuCode = goods.getSkuCode();
			if(skuCode.equals(objSkuCode)){
				return goods;
			}
		}
		return null;
	}
	
	/**
	 * 根据skuCode获取集合中的数据
	 * @param list
	 * @param skuCode
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月14日
	 */
	private JSONObject getSuccessDataBySkuCode(String skuCode){
		for (JSONObject goods : excelListSuccessData) {
			String objSkuCode = goods.getString("skuCode");
			if(skuCode.equals(objSkuCode)){
				excelListSuccessData.remove(goods);
				return goods;
			}
		}
		return null;
	}
	

	/**
	 * 检验标记出SkuCode重复或者为空的数据
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	private void checkSkuCodeIsNullAndRepeat(){
		
		Map<String,Integer> skuCodeSet = new LinkedHashMap<String,Integer>();
		for (int i = 0; i < excelListSuccessData.size(); i++) {
			JSONObject obj = excelListSuccessData.get(i);
			if(!obj.containsKey("skuCode")){
				obj.element("error", CODE_IS_BLANK);
				continue;
			}
			String objSkuCode = obj.getString("skuCode");
			String isGift = "";
			if(obj.containsKey("isGift")){
				isGift = obj.getString("isGift");
			}
			//货号为空
			if(StringUtils.isBlank(objSkuCode)){
				obj.element("error", CODE_IS_BLANK);
				continue;
			}
			//货号重复
			if(skuCodeSet.keySet().contains(objSkuCode+isGift)){
				
				obj.element("error", CODE_IS_REPEAT);
				//取出原来重复的数据,标记重复
				Integer index = skuCodeSet.get(objSkuCode+isGift);
				JSONObject existsObj = excelListSuccessData.get(index);
				if(existsObj.get("error") == null){
					existsObj.element("error", CODE_IS_REPEAT);
				}
				
				continue;
			}
			skuCodeSet.put(objSkuCode+isGift,new Integer(i));
		}
		
		//刷新
		refreshSuccessData();
	}
	
	/**
	 * 更新有效的数据列表
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	private void refreshSuccessData(){
		excelListSuccessData = new ArrayList<JSONObject>();
		excelSuccessSkuCode = new ArrayList<String>();
		excelListErrorData = new ArrayList<JSONObject>();
		for (JSONObject jsonObject : excelListFullData) {
			if(jsonObject.get("error") == null){
				excelListSuccessData.add(jsonObject);
				excelSuccessSkuCode.add(jsonObject.getString("skuCode"));
			}else{
				excelListErrorData.add(jsonObject);
			}
		}
	}
	
	@Override
	public <T extends GoodsSelect> List<T> getSuccessData(List<T> list, String[] excelField,T entity){
		JSONArray arr = JSONArray.fromObject(list);
		
		for (int i = 0; i < arr.size(); i++) {
			JSONObject obj = arr.getJSONObject(i);	
			
			String skuCode = obj.getString("skuCode");
			JSONObject excelJson = getSuccessDataBySkuCode(skuCode);
			
			//忽略第一列,合并属性
			for (int j = 1; j < excelField.length; j++) {
				obj.element(excelField[j], excelJson.get(excelField[j]));
			}
		}
		JSONUtils.getMorpherRegistry().registerMorpher(new EnumMorpher(GoodsTypeEnum.class));
		
		JsonConfig jsonConfig = new JsonConfig();
		@SuppressWarnings("unchecked")
		List<T> temp = JSONArray.toList(arr, entity, jsonConfig);
		
		//处理数据
		businessValid.formatter(temp, tempExcelListSuccessData, excelListErrorData);
		// 刷新
		refreshSuccessData();
		return temp;
		
	}
	
	/**
	 * @return the excelListSuccessData
	 */
	@Override
	public List<JSONObject> getExcelListSuccessData() {
		return excelListSuccessData;
	}
	
	/**
	 * @return the excelSuccessSkuCode
	 */
	@Override
	public List<String> getExcelSuccessCode() {
		return excelSuccessSkuCode;
	}
	
	/**
	 * @return the excelListErrorData
	 */
	@Override
	public List<JSONObject> getExcelListErrorData() {
		return excelListErrorData;
	}
	
}
