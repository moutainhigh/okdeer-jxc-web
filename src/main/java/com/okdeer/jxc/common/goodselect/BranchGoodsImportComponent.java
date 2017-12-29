/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年10月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.common.goodselect;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSONArray;
import com.okdeer.jxc.goods.entity.GoodsBranchPriceVo;
import com.okdeer.jxc.goods.service.GoodsBranchPriceServiceApi;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.jxc.utils.poi.ExcelReaderUtil;

import net.sf.json.JSONObject;


/**
 * 商品选择，通用excel导入组件
 * ClassName: BranchGoodsImportComponent 
 * @author zhongy
 * @date 2017年02月21日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *		v2.2			2017年02月21日		zhongy		                   新增
 */

@Component
public class BranchGoodsImportComponent {

	private static final Logger LOG = LoggerFactory.getLogger(BranchGoodsImportComponent.class);

	@Reference(version = "1.0.0", check = false)
	private GoodsBranchPriceServiceApi goodsBranchPriceService;

	@Resource 
	private StringRedisTemplate redisTemplateTmp;

	/**
	 * 导入excel，通过导入的数据查询商品(单个机构)
	 * @param fileName 文件名，用于识别excel文件版本
	 * @param is	文件流
	 * @param fields	属性数组，excel数据列所对应实体类属性
	 * @param entity	业务实体类
	 * @param branchId 机构
	 * @param userId 用户
	 * @param type 导入类型，（0货号、1条码）
	 * @param errorFileDownloadUrlPrefix  失败文件下载地址前缀
	 * @param businessValid 业务验证回调
	 * @param map_branchid 要货机构和发货机构id map
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月15日
	 */
	public <T extends GoodsBranchPriceVo> BranchGoodsImportVo<T> importSelectGoods(String fileName, InputStream is,
			String[] fields, T entity, String branchId,Integer status, String userId, String type, String errorFileDownloadUrlPrefix,
			GoodsSelectImportBusinessValid businessValid, Map<String, String> map_branchid) {
		return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchId, status, userId, type, false,
				errorFileDownloadUrlPrefix, businessValid, map_branchid);
	}

	/**
	 *  导入excel，查询商品(多个机构)
	 * @param fileName 文件名，用于识别excel文件版本
	 * @param is	文件流
	 * @param fields	属性数组，excel数据列所对应实体类属性
	 * @param entity	业务实体类
	 * @param branchId 机构
	 * @param userId 用户
	 * @param type 导入类型，（0货号、1条码）
	 * @param errorFileDownloadUrlPrefix  失败文件下载地址前缀
	 * @param businessValid 业务验证回调
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月15日
	 */
	public <T extends GoodsBranchPriceVo> BranchGoodsImportVo<T> importSelectGoodsMultiBranch(String fileName, InputStream is, String[] fields, T entity, 
			String branchId,Integer status, String userId, String type, String errorFileDownloadUrlPrefix ,GoodsSelectImportBusinessValid businessValid) {
		return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchId,status, userId, type, false,
				errorFileDownloadUrlPrefix, businessValid, null);
	}

	/**
	 * 导入excel，查询商品和库存(单个机构)
	 * @param fileName 文件名，用于识别excel文件版本
	 * @param is	文件流
	 * @param fields	属性数组，excel数据列所对应实体类属性
	 * @param entity	业务实体类
	 * @param branchId 机构
	 * @param userId 用户
	 * @param type 导入类型，（0货号、1条码）
	 * @param errorFileDownloadUrlPrefix  失败文件下载地址前缀
	 * @param businessValid 业务验证回调
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月15日
	 */
	public <T extends GoodsBranchPriceVo> BranchGoodsImportVo<T> importSelectGoodsWithStock(String fileName, InputStream is, String[] fields, 
			T entity, String branchId,Integer status, String userId, String type, String errorFileDownloadUrlPrefix ,GoodsSelectImportBusinessValid businessValid) {
		return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchId,status, userId, type, true,
				errorFileDownloadUrlPrefix, businessValid, null);
	}

	/**
	 * 导入excel，查询商品和库存(多个机构)
	 * @param fileName 文件名，用于识别excel文件版本
	 * @param is	文件流
	 * @param fields	属性数组，excel数据列所对应实体类属性
	 * @param entity	业务实体类
	 * @param branchId 机构
	 * @param userId 用户
	 * @param type 导入类型，（0货号、1条码）
	 * @param errorFileDownloadUrlPrefix  失败文件下载地址前缀
	 * @param businessValid 业务验证回调
	 * @return
	 * @author xiaoj02
	 * @date 2016年10月15日
	 */
	public <T extends GoodsBranchPriceVo> BranchGoodsImportVo<T> importSelectGoodsMultiBranchWithStock(String fileName,
			InputStream is, String[] fields, T entity, String branchId,Integer status, String userId, String type,
			String errorFileDownloadUrlPrefix, GoodsSelectImportBusinessValid businessValid) {
		return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchId,status, userId, type, true,
				errorFileDownloadUrlPrefix, businessValid, null);
	}


	/**
	 * 导入excel，查询商品
	 * @author zhongy
	 * @date 2017年02月21日
	 */
	@SuppressWarnings("static-access")
	private <T extends GoodsBranchPriceVo> BranchGoodsImportVo<T> importSelectGoodsMultiBranch(String fileName,
			InputStream is, String[] fields, T entity, String branchId,Integer status, String userId, String type,
			Boolean withStock, String errorFileDownloadUrlPrefix, GoodsSelectImportBusinessValid businessValid,
			Map<String, String> map_branchid) {
		List<JSONObject> excelList = ExcelReaderUtil.readExcel(fileName, is, fields);

		if(StringUtils.isBlank(type)){
			LOG.error("导入类型为空");
			throw new RuntimeException("导入类型为空");
		}

		BranchGoodsImportHandle BranchGoodsImportHandle = null;
		List<GoodsBranchPriceVo> dbList = null;
		List<GoodsBranchPriceVo> dbList1 = new ArrayList<GoodsBranchPriceVo>(); 
		if (type.equals(BranchGoodsImportHandle.TYPE_SKU_CODE)) {
			//构建数据过滤对象
			BranchGoodsImportHandle = new BranchGoodsImportSkuCodeHandle(type,excelList, fields, businessValid);

			//获取已验证成功的数据的货号
			List<String> list = BranchGoodsImportHandle.getExcelSuccessCode();

			if(CollectionUtils.isEmpty(list)){
				dbList1 = new ArrayList<GoodsBranchPriceVo>();
			}else{
				//根据货号查询商品
				if (map_branchid == null) {
					dbList = goodsBranchPriceService.querySkuGoodsByBarCodes(list, branchId, Integer.valueOf(type), status);
				} else {
					dbList = goodsBranchPriceService.queryOperateSkuGoodsByBarCodes(list, branchId, Integer.valueOf(type), status);
				}
				//-----------------------------新增一校验成功数据为准--------------------------//
				List<JSONObject> successData = BranchGoodsImportHandle.getExcelListSuccessData();
				for (int i = 0; i < successData.size(); i++) {
					JSONObject obj = successData.get(i);	
					String skuCode = obj.getString("skuCode");
					for(GoodsBranchPriceVo goodsSelect : dbList){
						if(skuCode.equals(goodsSelect.getSkuCode())){
							dbList1.add(goodsSelect);
							break;
						}
					}
				}
				//---------------------------新增一校验成功数据为准----------------------------//
			}
		} else if (type.equals(BranchGoodsImportHandle.TYPE_BAR_CODE)) {
			//构建数据过滤对象
			BranchGoodsImportHandle = new BranchGoodsImportSkuCodeHandle(type,excelList, fields, businessValid);

			//获取已验证成功的数据的条码
			List<String> list = BranchGoodsImportHandle.getExcelSuccessCode();

			if(CollectionUtils.isEmpty(list)){
				dbList1 = new ArrayList<GoodsBranchPriceVo>();
			}else{
				//根据条码查询商品，过滤掉条码重复的商品
				if (map_branchid == null) {
					dbList = goodsBranchPriceService.querySkuGoodsByBarCodes(list, branchId, Integer.valueOf(type), status);
				} else {
					dbList = goodsBranchPriceService.queryOperateSkuGoodsByBarCodes(list, branchId, Integer.valueOf(type), status);
				}
				//---------------------------新增一校验成功数据为准----------------------------//
				List<JSONObject> successData = BranchGoodsImportHandle.getExcelListSuccessData();

				Map<String, JSONObject> importMap=new HashMap<String, JSONObject>();

				Map<String, GoodsBranchPriceVo> importVoMap=new HashMap<String, GoodsBranchPriceVo>();

				for (int i = 0; i < successData.size(); i++) {
					JSONObject obj = successData.get(i);	
					String barCode = obj.getString("barCode");

					if(!importMap.containsKey(barCode)){
						//跳出外层循环标示
						one: for(GoodsBranchPriceVo goodsSelect : dbList){
							if(barCode.equals(goodsSelect.getBarCode())){
								dbList1.add(goodsSelect);
								importMap.put(goodsSelect.getBarCode(), obj);
								importVoMap.put(goodsSelect.getBarCode(), goodsSelect);
								String[] barCodes=goodsSelect.getBarCodes().split(",");
								for(int z=0;z<barCodes.length;z++){
										importMap.put(barCodes[z], obj);
										importVoMap.put(barCodes[z], goodsSelect);
								}
								break;
							}
							String[] barCodes=goodsSelect.getBarCodes().split(",");
							for(int z=0;z<barCodes.length;z++){
								if(barCodes[z].equals(barCode)){
									dbList1.add(goodsSelect);
									importMap.put(goodsSelect.getBarCode(), obj);
									importVoMap.put(goodsSelect.getBarCode(), goodsSelect);
									for(int y=0;y<barCodes.length;y++){
											importMap.put(barCodes[y], obj);
											importVoMap.put(barCodes[y], goodsSelect);
									}

									break one;
								}
							}
						}
					}else{
						//如果有重复，要将重复的删除
						obj.element("error", GoodsSelectImportBarCodeHandle.CODE_IS_REPEAT);
						importMap.get(barCode).element("error", GoodsSelectImportBarCodeHandle.CODE_IS_REPEAT);
						dbList1.remove( importVoMap.get(barCode));
					}
				}
				//----------------------------新增一校验成功数据为准---------------------------//
			}

		}else{
			throw new RuntimeException("导入类型不合法:\t"+type);
		}

		//与数据库对比,标记处该店铺中未查询到的数据
		BranchGoodsImportHandle.checkWithDataBase(dbList,type);


		BranchGoodsImportVo<T> goodsSelectImportVo = new BranchGoodsImportVo<T>();

		@SuppressWarnings("unchecked")
		List<T> successList = (List<T>) BranchGoodsImportHandle.getSuccessData(type,dbList1, fields, entity);

		goodsSelectImportVo.setList(successList);

		Integer successNum = BranchGoodsImportHandle.getExcelListSuccessData().size();

		Integer errorNum = BranchGoodsImportHandle.getExcelListErrorData().size();

		StringBuffer message = new StringBuffer();
		message.append("成功：");
		message.append(successNum);
		message.append("条，");
		message.append("失败：");
		message.append(errorNum);
		message.append("条。");

		goodsSelectImportVo.setMessage(message.toString());

		List<JSONObject> errorList = BranchGoodsImportHandle.getExcelListErrorData();

		if(errorList != null && errorList.size() > 0){//有错误数据
			//列转换处理
			businessValid.errorDataFormatter(errorList);

			//错误excel内容
			String jsonText = JSONArray.toJSON(errorList).toString();
			//文件key
			String code = "jxc_goodsSelectImport_" + userId;
			// 保存10分钟，单用户同时只能保存一个错误文件
			redisTemplateTmp.opsForValue().set(code, jsonText, 10, TimeUnit.MINUTES);

			goodsSelectImportVo.setErrorFileUrl(errorFileDownloadUrlPrefix + "?code="+code+"&type="+type);
		}else{//无错误数据
			String code = "jxc_goodsSelectImport_" + userId;
			redisTemplateTmp.delete(code);
		}

		return goodsSelectImportVo;
	}

	/**
	 * 
	 * @Description: 下载错误文件
	 * @param code 下载的key
	 * @param reportFileName 导出文件名称
	 * @param headers 表格头名称
	 * @param columns 表格头对应的属性名称
	 * @param response 输出对象
	 * @author xiaoj02
	 * @date 2016年10月15日
	 */
	public void downloadErrorFile(String code, String reportFileName, String[] headers, String[] columns, HttpServletResponse response){
		String jsonText = redisTemplateTmp.opsForValue().get(code);

		if(jsonText != null){
			headers = ArrayUtils.add(headers, "错误原因");
			columns = ArrayUtils.add(columns, "error");

			List<JSONObject> dataList = JSONArray.parseArray(jsonText, JSONObject.class);

			ExcelExportUtil.exportExcel(reportFileName, headers, columns, dataList, response);
		}else{
			response.reset();// 清空输出流
			response.setContentType("text/html");// 定义输出类型
			response.setCharacterEncoding("UTF-8");
			try {
				response.getWriter().println("文件不存在或者文件已过期");
			} catch (IOException e) {
				LOG.error("获取response.getWriter失败",e);
			}
		}
	}

}
