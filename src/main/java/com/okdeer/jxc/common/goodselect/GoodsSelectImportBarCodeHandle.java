/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年10月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.common.goodselect;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.EnumMorpher;
import net.sf.json.util.JSONUtils;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.okdeer.jxc.common.enums.GoodsTypeEnum;
import com.okdeer.jxc.goods.entity.GoodsSelect;

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

public class GoodsSelectImportBarCodeHandle implements GoodsSelectImportHandle{

	public static final String CODE_IS_BLANK = "条码为空";
	public static final String CODE_IS_REPEAT = "条码重复";
	public static final String NOT_EXISTS = "找不到该商品或者该商品状态不正确";
	public static final String ERROR_TEMPLATE = "模板使用错误";

	/**
	 * @Fields goodsMap : 条码和商品的缓存
	 */
	private Map<String,GoodsSelect> goodsMap;
	
	/**
	 * @Fields importMap : 导入缓存
	 */
	private Map<String,JSONObject> importMap;
	
	List<JSONObject> excelListFullData = null;
	List<JSONObject> excelListSuccessData = null;
	List<JSONObject> excelListErrorData = null;

	List<String> excelSuccessBarCode = null; 

	GoodsSelectImportBusinessValid businessValid;

	// 临时存储数据
	List<JSONObject> tempExcelListSuccessData = new ArrayList<JSONObject>();


	public Map<String, GoodsSelect> getGoodsMap() {
		if(goodsMap==null){
			goodsMap=new HashMap<String,GoodsSelect>();
		}
		return goodsMap;
	}

	public void setGoodsMap(Map<String, GoodsSelect> goodsMap) {
		this.goodsMap = goodsMap;
	}

	
	public Map<String, JSONObject> getImportMap() {
		if(importMap==null){
			importMap=new HashMap<String,JSONObject>();
		}
		return importMap;
	}

	
	public void setImportMap(Map<String, JSONObject> importMap) {
		this.importMap = importMap;
	}

	@SuppressWarnings("unchecked")
	public GoodsSelectImportBarCodeHandle(List<JSONObject> excelList, String[] excelField, GoodsSelectImportBusinessValid businessValid){
		// 第一条记录为标题行，取出第一条记录用于判断模板
		if (!CollectionUtils.isEmpty(excelList)) {
			JSONObject title = excelList.get(0);
			title.forEach((key, value) -> title.put(key, ((String) value).trim()));
			// 没有货号字段，视为错误模板
			if (!title.containsValue("条码")) {
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
		//检验标记出BarCode重复或者为空的数据
		checkBarCodeIsNullAndRepeat();

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
			String barCode = jsonObject.getString("barCode");
			GoodsSelect goods = getByBarCode(dblist, barCode, jsonObject);
			if(goods == null){//数据库不存在的数据
				jsonObject.element("error", NOT_EXISTS);
			}
		}

		//刷新
		refreshSuccessData();
	}

	/**
	 * 根据barCode获取集合中的数据
	 * @param list
	 * @param barCode
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月14日
	 */
	private GoodsSelect getByBarCode(List<? extends GoodsSelect> list, String barCode, JSONObject obj) {
		for (GoodsSelect goods : list) {
			String objBarCode = goods.getBarCode();
			if (barCode.equals(objBarCode)) {
				return goods;
			}
		}
		if (this.getGoodsMap().containsKey(GoodsSelectImportComponent.getKeyWithGift(barCode, obj))) {
			return this.getGoodsMap().get(GoodsSelectImportComponent.getKeyWithGift(barCode, obj));
		}

		return null;
	}

	/**
	 * 根据barCode获取集合中的数据
	 * @param list
	 * @param barCode
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月14日
	 */
	private JSONObject getSuccessDataByBarCode(String barCode, String barCodes){
		for (JSONObject goods : excelListSuccessData) {
			String objBarCode = goods.getString("barCode");
			if (objBarCode.equals(barCode)) {
				excelListSuccessData.remove(goods);
				return goods;
			} else if (StringUtils.isNotBlank(barCodes)) {
				// 导入副条码时使用此匹配
				for (String code : barCodes.split(",")) {
					if (code.equals(objBarCode)) {
						excelListSuccessData.remove(goods);
						return goods;
					}
				}
			}
//			else if(this.getGoodsMap().containsKey(barCode)){
//				excelListSuccessData.remove(goods);
//				return goods;
//			}
		}
		return null;
	}


	/**
	 * 检验标记出BarCode重复或者为空的数据
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	private void checkBarCodeIsNullAndRepeat(){

		Map<String,Integer> barCodeSet = new LinkedHashMap<String,Integer>();
		for (int i = 0; i < excelListSuccessData.size(); i++) {
			JSONObject obj = excelListSuccessData.get(i);
			String objBarCode = obj.getString("barCode");

			String isGift = "";
			if(obj.containsKey("isGift")){
				isGift = obj.getString("isGift");
			}
			//条码为空
			if(StringUtils.isBlank(objBarCode)){
				obj.element("error", CODE_IS_BLANK);
				continue;
			}
			//条码重复
			if(barCodeSet.keySet().contains(objBarCode+isGift)){
				//取出原来重复的数据,标记重复
				Integer index = barCodeSet.get(objBarCode+isGift);
				JSONObject existsObj = excelListSuccessData.get(index);
				obj.element("error", CODE_IS_REPEAT);
				if(existsObj.get("error") == null){
					existsObj.element("error", CODE_IS_REPEAT);
				}
				continue;
			}
			barCodeSet.put(objBarCode+isGift,new Integer(i));
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
		excelSuccessBarCode = new ArrayList<String>();
		excelListErrorData = new ArrayList<JSONObject>();
		for (JSONObject jsonObject : excelListFullData) {
			if(jsonObject.get("error") == null){
				excelListSuccessData.add(jsonObject);
				excelSuccessBarCode.add(jsonObject.getString("barCode"));
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
			if(obj.containsKey("error")){
				continue;
			}

			String barCode = obj.getString("barCode");
			JSONObject excelJson = new JSONObject();
			excelJson = getSuccessDataByBarCode(barCode, obj.getString("barCodes"));
			if (excelJson == null) {
				excelJson = this.getImportMap().get(GoodsSelectImportComponent.getKeyWithGift(barCode, obj));
			}
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
	 * @return the excelSuccessBarCode
	 */
	@Override
	public List<String> getExcelSuccessCode() {
		return excelSuccessBarCode;
	}

	/**
	 * @return the excelListErrorData
	 */
	@Override
	public List<JSONObject> getExcelListErrorData() {
		return excelListErrorData;
	}

}
