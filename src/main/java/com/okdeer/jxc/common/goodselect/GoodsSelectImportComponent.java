/**
 * @Project: okdeer-jxc-web
 * @Author: xiaoj02
 * @Date: 2016年10月13日
 * @Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved.
 */
package com.okdeer.jxc.common.goodselect;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSONArray;
import com.google.common.collect.Maps;
import com.okdeer.jxc.common.utils.UuidUtils;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.service.GoodsSelectServiceApi;
import com.okdeer.jxc.goods.vo.GoodsSelectVo;
import com.okdeer.jxc.stock.service.StocktakingApplyServiceApi;
import com.okdeer.jxc.stock.vo.StocktakingBatchVo;
import com.okdeer.jxc.utils.poi.ExcelExportUtil;
import com.okdeer.jxc.utils.poi.ExcelReaderUtil;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;


/**
 * 商品选择，通用excel导入组件
 * ClassName: GoodsSelectCompent 
 * @author xiaoj02
 * @date 2016年10月13日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *		v1.1			2016-10-17		xiaoj02				商品选择，通用excel导入组件
 */
@Component
public class GoodsSelectImportComponent {

    private static final Logger LOG = LoggerFactory.getLogger(GoodsSelectImportComponent.class);

    @Reference(version = "1.0.0", check = false)
    private GoodsSelectServiceApi goodsSelectServiceApi;

    @Reference(version = "1.0.0", check = false)
    private StocktakingApplyServiceApi stocktakingApplyServiceApi;

    @Resource
    private StringRedisTemplate redisTemplateTmp;

    /**
     * 导入excel，通过导入的数据查询商品(单个机构)
     *
     * @param fileName                   文件名，用于识别excel文件版本
     * @param is                         文件流
     * @param fields                     属性数组，excel数据列所对应实体类属性
     * @param entity                     业务实体类
     * @param branchId                   机构
     * @param userId                     用户
     * @param type                       导入类型，（0货号、1条码）
     * @param errorFileDownloadUrlPrefix 失败文件下载地址前缀
     * @param businessValid              业务验证回调
     * @param map_branchid               要货机构和发货机构id map
     * @return
     * @author xiaoj02
     * @date 2016年10月15日
     */
    public <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoods(String fileName, InputStream is,
                                                                            String[] fields, T entity, String branchId, String userId, String type, String errorFileDownloadUrlPrefix,
                                                                            GoodsSelectImportBusinessValid businessValid, Map<String, String> map_branchid) {
        String[] branchIds = {branchId};
        return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchIds, userId, type, false,
                errorFileDownloadUrlPrefix, businessValid, map_branchid, null);
    }

    /**
     * 导入excel，查询商品(多个机构)
     *
     * @param fileName                   文件名，用于识别excel文件版本
     * @param is                         文件流
     * @param fields                     属性数组，excel数据列所对应实体类属性
     * @param entity                     业务实体类
     * @param branchId                   机构
     * @param userId                     用户
     * @param type                       导入类型，（0货号、1条码）
     * @param errorFileDownloadUrlPrefix 失败文件下载地址前缀
     * @param businessValid              业务验证回调
     * @return
     * @author xiaoj02
     * @date 2016年10月15日
     */
    public <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoodsMultiBranch(String fileName,
                                                                                       InputStream is, String[] fields, T entity, String[] branchId, String userId,
                                                                                       String type, String errorFileDownloadUrlPrefix, GoodsSelectImportBusinessValid businessValid) {
        return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchId, userId, type, false,
                errorFileDownloadUrlPrefix, businessValid, null, null);
    }

    /**
     * 导入excel，查询商品和库存(单个机构)
     *
     * @param fileName                   文件名，用于识别excel文件版本
     * @param is                         文件流
     * @param fields                     属性数组，excel数据列所对应实体类属性
     * @param entity                     业务实体类
     * @param branchId                   机构
     * @param userId                     用户
     * @param type                       导入类型，（0货号、1条码）
     * @param errorFileDownloadUrlPrefix 失败文件下载地址前缀
     * @param businessValid              业务验证回调
     * @return
     * @author xiaoj02
     * @date 2016年10月15日
     */
    public <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoodsWithStock(String fileName,
                                                                                     InputStream is, String[] fields, T entity, String branchId, String userId,
                                                                                     String type, String errorFileDownloadUrlPrefix, GoodsSelectImportBusinessValid businessValid) {
        String[] branchIds = {branchId};
        return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchIds, userId, type, true,
                errorFileDownloadUrlPrefix, businessValid, null, null);
    }

    /**
     * 导入excel，查询商品和库存(单个机构)
     *
     * @param fileName                   文件名，用于识别excel文件版本
     * @param is                         文件流
     * @param fields                     属性数组，excel数据列所对应实体类属性
     * @param entity                     业务实体类
     * @param branchId                   机构
     * @param userId                     用户
     * @param type                       导入类型，（0货号、1条码）
     * @param errorFileDownloadUrlPrefix 失败文件下载地址前缀
     * @param businessValid              业务验证回调
     * @param statusList                 商品状态列表
     * @return
     * @author xiaoj02
     * @date 2016年10月15日
     */
    public <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoodsWithStock(String fileName,
                                                                                     InputStream is, String[] fields, T entity, String branchId, String userId,
                                                                                     String type, String errorFileDownloadUrlPrefix, List<Integer> statusList,
                                                                                     GoodsSelectImportBusinessValid businessValid) {
        String[] branchIds = {branchId};
        return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchIds, userId, type, true,
                errorFileDownloadUrlPrefix, businessValid, null, statusList);
    }


    /**
     * 导入excel，查询商品和库存(单个机构)
     *
     * @param fileName                   文件名，用于识别excel文件版本
     * @param is                         文件流
     * @param fields                     属性数组，excel数据列所对应实体类属性
     * @param entity                     业务实体类
     * @param branchId                   机构
     * @param userId                     用户
     * @param type                       导入类型，（0货号、1条码）
     * @param errorFileDownloadUrlPrefix 失败文件下载地址前缀
     * @param businessValid              业务验证回调
     * @return
     * @author xiaoj02
     * @date 2016年10月15日
     */
    public <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoodsWithStock(String fileName, InputStream is, String[] fields,
                                                                                     T entity, String branchId, String userId, String type, String errorFileDownloadUrlPrefix,
                                                                                     GoodsSelectImportBusinessValid businessValid, Map<String, String> map_branchid) {
        String[] branchIds = {branchId};
        return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchIds, userId, type, true,
                errorFileDownloadUrlPrefix, businessValid, map_branchid, null);
    }

    /**
     * 导入excel，查询商品和库存(多个机构)
     *
     * @param fileName                   文件名，用于识别excel文件版本
     * @param is                         文件流
     * @param fields                     属性数组，excel数据列所对应实体类属性
     * @param entity                     业务实体类
     * @param branchId                   机构
     * @param userId                     用户
     * @param type                       导入类型，（0货号、1条码）
     * @param errorFileDownloadUrlPrefix 失败文件下载地址前缀
     * @param businessValid              业务验证回调
     * @return
     * @author xiaoj02
     * @date 2016年10月15日
     */
    public <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoodsMultiBranchWithStock(String fileName,
                                                                                                InputStream is, String[] fields, T entity, String[] branchId, String userId, String type,
                                                                                                String errorFileDownloadUrlPrefix, GoodsSelectImportBusinessValid businessValid) {
        return importSelectGoodsMultiBranch(fileName, is, fields, entity, branchId, userId, type, true,
                errorFileDownloadUrlPrefix, businessValid, null, null);
    }


    /**
     * 导入excel，查询商品
     *
     * @author xiaoj02
     * @date 2016年10月13日
     */
    private <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoodsMultiBranch(String fileName,
                                                                                        InputStream is, String[] fields, T entity, String[] branchId, String userId, String type,
                                                                                        Boolean withStock, String errorFileDownloadUrlPrefix, GoodsSelectImportBusinessValid businessValid,
                                                                                        Map<String, String> map_branchid, List<Integer> statusList) {
        //读取excel
        List<JSONObject> excelList = ExcelReaderUtil.readExcel(fileName, is, fields);

        if (StringUtils.isBlank(type)) {
            LOG.error("导入类型为空");
            throw new RuntimeException("导入类型为空");
        }

        GoodsSelectImportHandle goodsSelectImportHandle = null;
        List<GoodsSelect> dbList = null;
        List<GoodsSelect> dbList1 = new ArrayList<GoodsSelect>();
        String activityType = map_branchid == null ? "" : map_branchid.get("activityType");

        if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)
                || type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {// 货号
            //构建数据过滤对象
            goodsSelectImportHandle = new GoodsSelectImportSkuCodeHandle(excelList, fields, businessValid);

            //获取已验证成功的数据的货号
            List<String> list = goodsSelectImportHandle.getExcelSuccessCode();

            if (CollectionUtils.isEmpty(list)) {
                dbList1 = new ArrayList<GoodsSelect>();
            } else {
                //根据货号查询商品
                if (StringUtils.isNotBlank(activityType)) {
                    map_branchid = Maps.newHashMap();
                    map_branchid.put("activityType", "12");
                }
                dbList = goodsSelectServiceApi.queryListBySkuCode(list.toArray(new String[list.size()]), branchId, withStock, map_branchid, statusList);
                //-----------------------------新增一校验成功数据为准--------------------------//
                List<JSONObject> successData = goodsSelectImportHandle.getExcelListSuccessData();
                for (int i = 0; i < successData.size(); i++) {
                    JSONObject obj = successData.get(i);
                    String skuCode = obj.getString("skuCode");
                    for (GoodsSelect goodsSelect : dbList) {
                        if (skuCode.equals(goodsSelect.getSkuCode())) {
                            dbList1.add(goodsSelect);
                            break;
                        }
                    }
                }
                //---------------------------新增一校验成功数据为准----------------------------//
            }
        } else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)
                || type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE_NUM)) {// 条码
            //构建数据过滤对象
            goodsSelectImportHandle = new GoodsSelectImportBarCodeHandle(excelList, fields, businessValid);
            Map<String, GoodsSelect> map = ((GoodsSelectImportBarCodeHandle) goodsSelectImportHandle).getGoodsMap();
            Map<String, JSONObject> importMap = ((GoodsSelectImportBarCodeHandle) goodsSelectImportHandle).getImportMap();
            //获取已验证成功的数据的条码
            List<String> list = goodsSelectImportHandle.getExcelSuccessCode();

            if (CollectionUtils.isEmpty(list)) {
                dbList1 = new ArrayList<GoodsSelect>();
            } else {
                if (map_branchid != null && map_branchid.containsKey("StocktakingForm")) {
                    GoodsSelectVo paramVo = new GoodsSelectVo();
                    paramVo.setBarCodes(list);
                    paramVo.setBranchIds(Arrays.asList(branchId));
                    paramVo.setIsManagerStock(1);
                    // 盘点商品状态（0，1，2）商品状态：0正常，1停售，2停购，3淘汰
                    paramVo.setStatusList(Arrays.asList(0, 1, 2));
                    StocktakingBatchVo batchVo = stocktakingApplyServiceApi.getStocktakingBatchVoById(map_branchid.get("batchId"));
                    if (batchVo != null && StringUtils.isNotBlank(batchVo.getCategoryShowsStr())) {
                        // 过滤类别条件
                        List<String> categoryCodes = Arrays.asList(batchVo.getCategoryShowsStr().split(","));
                        paramVo.setCategoryCodes(categoryCodes);
                    }
                    dbList = goodsSelectServiceApi.queryByCodeListsByVo(paramVo);
                    //---------------------------新增一校验成功数据为准----------------------------//
                    List<JSONObject> successData = goodsSelectImportHandle.getExcelListSuccessData();
                    for (int i = 0; i < successData.size(); i++) {
                        JSONObject obj = successData.get(i);
                        String barCode = obj.getString("barCode");
                        for (GoodsSelect goodsSelect : dbList) {
                            if (barCode.equals(goodsSelect.getBarCode())) {
                                dbList1.add(goodsSelect);
                                break;
                            }
                        }
                    }
                } else {

                    if (StringUtils.isNotBlank(activityType)) {
                        map_branchid = Maps.newHashMap();
                        map_branchid.put("activityType", "activityType");
                    }
                    //根据条码查询商品，过滤掉条码重复的商品
                    dbList = goodsSelectServiceApi.queryListByBarCode(list.toArray(new String[list.size()]), branchId, withStock, map_branchid, statusList);

                    //---------------------------新增一校验成功数据为准----------------------------//

                    /**
                     * 2.4.0 添加条码表，根据附加条码查询的条码不一定和查询到的条码一致，所以不比较 by yangyq
                     */
                    List<JSONObject> successData = goodsSelectImportHandle.getExcelListSuccessData();
                    for (int i = 0; i < successData.size(); i++) {
                        JSONObject obj = successData.get(i);
                        String barCode = obj.getString("barCode");
                        for (GoodsSelect goodsSelect : dbList) {
                            if (barCode.equals(goodsSelect.getBarCode()) || (goodsSelect.getBarCodes() != null
                                    && goodsSelect.getBarCodes().indexOf(barCode) >= 0)) {
                                if (importMap.containsKey(getKeyWithGift(goodsSelect.getBarCode(), obj))) {
                                    obj.element("error", GoodsSelectImportBarCodeHandle.CODE_IS_REPEAT);
                                    importMap.get(getKeyWithGift(goodsSelect.getBarCode(), obj)).element("error",
                                            GoodsSelectImportBarCodeHandle.CODE_IS_REPEAT);
                                    dbList1.remove(map.get(getKeyWithGift(goodsSelect.getBarCode(), obj)));
                                } else {
                                    importMap.put(getKeyWithGift(goodsSelect.getBarCode(), obj), obj);
                                    importMap.put(getKeyWithGift(barCode, obj), obj);
                                    dbList1.add(goodsSelect);
                                    map.put(getKeyWithGift(goodsSelect.getBarCode(), obj), goodsSelect);
                                    map.put(getKeyWithGift(barCode, obj), goodsSelect);
                                    if (StringUtils.isNotBlank(goodsSelect.getBarCodes())) {
                                        String[] barCodes = goodsSelect.getBarCodes().split(",");
                                        for (int z = 0; z < barCodes.length; z++) {
                                            importMap.put(getKeyWithGift(barCodes[z], obj), obj);
                                            map.put(getKeyWithGift(barCodes[z], obj), goodsSelect);
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                    //----------------------------新增一校验成功数据为准---------------------------//
                }
            }

        } else {
            throw new RuntimeException("导入类型不合法:\t" + type);
        }

        //与数据库对比,标记处该店铺中未查询到的数据
        goodsSelectImportHandle.checkWithDataBase(dbList);


        GoodsSelectImportVo<T> goodsSelectImportVo = new GoodsSelectImportVo<T>();

        @SuppressWarnings("unchecked")
        List<T> successList = (List<T>) goodsSelectImportHandle.getSuccessData(dbList1, fields, entity);

        goodsSelectImportVo.setList(successList);

        Integer successNum = goodsSelectImportHandle.getExcelListSuccessData().size();

        Integer errorNum = goodsSelectImportHandle.getExcelListErrorData().size();

        StringBuffer message = new StringBuffer();
        message.append("成功：");
        message.append(successNum);
        message.append("条，");
        message.append("失败：");
        message.append(errorNum);
        message.append("条。");

        goodsSelectImportVo.setMessage(message.toString());

        List<JSONObject> errorList = goodsSelectImportHandle.getExcelListErrorData();

        if (errorList != null && errorList.size() > 0) {//有错误数据
            //列转换处理
            businessValid.errorDataFormatter(errorList);

            //错误excel内容
            String jsonText = JSONArray.toJSON(errorList).toString();
            //文件key
            String code = "jxc_goodsSelectImport_" + UuidUtils.getUuid();
            // 保存10分钟，用户每次导入都保存一个错误文件
            redisTemplateTmp.opsForValue().set(code, jsonText, 10, TimeUnit.MINUTES);

            goodsSelectImportVo.setErrorFileUrl(errorFileDownloadUrlPrefix + "?code=" + code + "&type=" + type);
        } else {//无错误数据
            // 每次导入都是新的错误文件，不需要删除旧值
            //String code = "goodsSelectImport_" + userId;
            //redisTemplateTmp.delete(code);
        }

        return goodsSelectImportVo;
    }

    /**
     * @param key
     * @param obj
     * @return
     * @Description: 组装包含是否赠品的key
     * @author zhengwj
     * @date 2017年7月26日
     */
    public static String getKeyWithGift(String key, JSONObject obj) {
        return key + (obj.containsKey("isGift") ? obj.get("isGift") : "");
    }

    /**
     * @param code           下载的key
     * @param reportFileName 导出文件名称
     * @param headers        表格头名称
     * @param columns        表格头对应的属性名称
     * @param response       输出对象
     * @Description: 下载错误文件
     * @author xiaoj02
     * @date 2016年10月15日
     */
    public void downloadErrorFile(String code, String reportFileName, String[] headers, String[] columns, HttpServletResponse response) {
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


    /**
     * 多机构加上供应商条件过滤商品
     *
     * @param fileName
     * @param is
     * @param fields
     * @param activityGoodsImportVo
     * @param branchIdList
     * @param id
     * @param type
     * @param errorFileDownloadUrlPrefix
     * @param businessValid
     * @param supplierId
     * @return
     */
    public <T extends GoodsSelect> GoodsSelectImportVo<T> importGoods(String fileName, InputStream is, String[] fields, T entity, List<String> branchIdList, String id, String type, String errorFileDownloadUrlPrefix, GoodsSelectImportBusinessValid businessValid, String supplierId) {
        //读取excel
        List<JSONObject> excelList = ExcelReaderUtil.readExcel(fileName, is, fields);

        if (StringUtils.isBlank(type)) {
            LOG.error("导入类型为空");
            throw new RuntimeException("导入类型为空");
        }

        GoodsSelectImportHandle goodsSelectImportHandle = null;
        List<GoodsSelect> dbList = null;
        List<GoodsSelect> dbList1 = new ArrayList<>();
        if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)
                || type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE_NUM)) {// 货号
            //构建数据过滤对象
            goodsSelectImportHandle = new GoodsSelectImportSkuCodeHandle(excelList, fields, businessValid);

            //获取已验证成功的数据的货号
            List<String> list = goodsSelectImportHandle.getExcelSuccessCode();

            if (CollectionUtils.isEmpty(list)) {
                dbList1 = new ArrayList<GoodsSelect>();
            } else {
                //根据货号查询商品
                dbList = goodsSelectServiceApi.queryListBySkuCode(list.toArray(new String[list.size()]), branchIdList, supplierId);
                //-----------------------------新增一校验成功数据为准--------------------------//
                List<JSONObject> successData = goodsSelectImportHandle.getExcelListSuccessData();
                for (int i = 0; i < successData.size(); i++) {
                    JSONObject obj = successData.get(i);
                    String skuCode = obj.getString("skuCode");
                    for (GoodsSelect goodsSelect : dbList) {
                        if (skuCode.equals(goodsSelect.getSkuCode())) {
                            dbList1.add(goodsSelect);
                            break;
                        }
                    }
                }
                //---------------------------新增一校验成功数据为准----------------------------//
            }
        } else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)
                || type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE_NUM)) {// 条码
            //构建数据过滤对象
            goodsSelectImportHandle = new GoodsSelectImportBarCodeHandle(excelList, fields, businessValid);
            Map<String, GoodsSelect> map = ((GoodsSelectImportBarCodeHandle) goodsSelectImportHandle).getGoodsMap();
            Map<String, JSONObject> importMap = ((GoodsSelectImportBarCodeHandle) goodsSelectImportHandle).getImportMap();
            //获取已验证成功的数据的条码
            List<String> list = goodsSelectImportHandle.getExcelSuccessCode();

            if (CollectionUtils.isEmpty(list)) {
                dbList1 = new ArrayList<GoodsSelect>();
            } else {

                //根据条码查询商品，过滤掉条码重复的商品
                dbList = goodsSelectServiceApi.queryListByBarCode(list.toArray(new String[list.size()]), branchIdList, supplierId);

                //---------------------------新增一校验成功数据为准----------------------------//

                /**
                 * 2.4.0 添加条码表，根据附加条码查询的条码不一定和查询到的条码一致，所以不比较 by yangyq
                 */
                List<JSONObject> successData = goodsSelectImportHandle.getExcelListSuccessData();
                for (int i = 0; i < successData.size(); i++) {
                    JSONObject obj = successData.get(i);
                    String barCode = obj.getString("barCode");
                    for (GoodsSelect goodsSelect : dbList) {
                        if (barCode.equals(goodsSelect.getBarCode()) || (goodsSelect.getBarCodes() != null
                                && goodsSelect.getBarCodes().indexOf(barCode) >= 0)) {
                            if (importMap.containsKey(getKeyWithGift(goodsSelect.getBarCode(), obj))) {
                                obj.element("error", GoodsSelectImportBarCodeHandle.CODE_IS_REPEAT);
                                importMap.get(getKeyWithGift(goodsSelect.getBarCode(), obj)).element("error",
                                        GoodsSelectImportBarCodeHandle.CODE_IS_REPEAT);
                                dbList1.remove(map.get(getKeyWithGift(goodsSelect.getBarCode(), obj)));
                            } else {
                                importMap.put(getKeyWithGift(goodsSelect.getBarCode(), obj), obj);
                                importMap.put(getKeyWithGift(barCode, obj), obj);
                                dbList1.add(goodsSelect);
                                map.put(getKeyWithGift(goodsSelect.getBarCode(), obj), goodsSelect);
                                map.put(getKeyWithGift(barCode, obj), goodsSelect);
                                if (StringUtils.isNotBlank(goodsSelect.getBarCodes())) {
                                    String[] barCodes = goodsSelect.getBarCodes().split(",");
                                    for (int z = 0; z < barCodes.length; z++) {
                                        importMap.put(getKeyWithGift(barCodes[z], obj), obj);
                                        map.put(getKeyWithGift(barCodes[z], obj), goodsSelect);
                                    }
                                }
                            }
                            break;
                        }
                    }
                    //----------------------------新增一校验成功数据为准---------------------------//
                }
            }

        } else {
            throw new RuntimeException("导入类型不合法:\t" + type);
        }

        //与数据库对比,标记处该店铺中未查询到的数据
        goodsSelectImportHandle.checkWithDataBase(dbList);


        GoodsSelectImportVo<T> goodsSelectImportVo = new GoodsSelectImportVo<T>();

        @SuppressWarnings("unchecked")
        List<T> successList = (List<T>) goodsSelectImportHandle.getSuccessData(dbList1, fields, entity);

        goodsSelectImportVo.setList(successList);

        Integer successNum = goodsSelectImportHandle.getExcelListSuccessData().size();

        Integer errorNum = goodsSelectImportHandle.getExcelListErrorData().size();

        StringBuffer message = new StringBuffer();
        message.append("成功：");
        message.append(successNum);
        message.append("条，");
        message.append("失败：");
        message.append(errorNum);
        message.append("条。");

        goodsSelectImportVo.setMessage(message.toString());

        List<JSONObject> errorList = goodsSelectImportHandle.getExcelListErrorData();

        if (errorList != null && errorList.size() > 0) {//有错误数据
            //列转换处理
            businessValid.errorDataFormatter(errorList);

            //错误excel内容
            String jsonText = JSONArray.toJSON(errorList).toString();
            //文件key
            String code = "jxc_goodsSelectImport_" + UuidUtils.getUuid();
            // 保存10分钟，用户每次导入都保存一个错误文件
            redisTemplateTmp.opsForValue().set(code, jsonText, 10, TimeUnit.MINUTES);

            goodsSelectImportVo.setErrorFileUrl(errorFileDownloadUrlPrefix + "?code=" + code + "&type=" + type);
        } else {//无错误数据
            // 每次导入都是新的错误文件，不需要删除旧值
            //String code = "goodsSelectImport_" + userId;
            //redisTemplateTmp.delete(code);
        }

        return goodsSelectImportVo;
    }
}
