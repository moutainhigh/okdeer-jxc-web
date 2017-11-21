/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer
 * @Package: com.okdeer.jxc.controller.report
 * @author songwj
 * @date 2017年11月07 17:07
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.report;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Maps;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.report.ReportService;
import com.okdeer.jxc.controller.common.ReportController;
import com.okdeer.jxc.report.service.OutOfStockServiceApi;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.price.PriceConstant;
import com.okdeer.retail.common.report.DataRecord;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author songwj
 * @ClassName: DirectOutOfStockController
 * @Description: 直送配送缺货率报表分析
 * @project okdeer
 * @date 2017年11月07 17:07
 * =================================================================================================
 * Task ID            Date               Author           Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * V2.9.4          2017年11月07   songwj             TODO
 */
@RestController
@RequestMapping("report/direct/outOfStock")
public class DirectOutOfStockController extends ReportController {

    @Reference(version = "1.0.0", check = false)
    private OutOfStockServiceApi outOfStockServiceApi;

    @RequestMapping("/view")
    public ModelAndView view() {
        Map<String, String> map = Maps.newHashMap();
        map.put("branchId", getCurrBranchId());
        return new ModelAndView("report/direct/outOfStock", map);
    }

    @Override
    public ReportService getReportService() {
        return outOfStockServiceApi;
    }

    @Override
    public Map<String, Object> getParam(HttpServletRequest request) {
        Map<String, Object> map = this.builderParams(request, null);
        map.put("sourceBranchCompleteCode", UserUtil.getCurrBranchCompleCode());
        map.put("isDirect", Boolean.TRUE);
        return map;
    }

    /**
     * @return
     * @Description: 价格权限字段过滤Map集合 <权限名称， 权限字段，多个以','分隔>
     * @author liwb
     * @date 2017年7月20日
     */
    @Override
    public Map<String, String> getPriceAccess() {
        Map<String, String> map = new HashMap<String, String>();
        map.put(PriceConstant.DISTRIBUTION_PRICE, "inAmount,outAmount,DIAmount");
        return map;
    }

    @RequestMapping(value = "/exportList")
    public String exportList(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> map = getParam(request);
        map.put("startCount", Integer.parseInt(map.get("startCount").toString()));
        map.put("endCount", Integer.parseInt(map.get("endCount").toString()));
        String fileName = null;
        String templateName = null;
        // 判断是否是汇总查询/明细
        try {
            String branchName = getCurrBranchName();
            Object obj = map.get("targetBranchName");
            if (obj != null) {
                branchName = obj.toString();
            }
            List<DataRecord> reportList = outOfStockServiceApi.getList(map);
            DataRecord dataRecord = outOfStockServiceApi.getTotal(map);
            if ("0".equals(map.get("type"))) {
                LOG.debug("导出直送配送缺货率报表分析商品明细导出查询参数:{}" + map.toString());
                fileName = branchName + "直送配送缺货率分析商品明细表" + map.get("startTime").toString().replaceAll("-", "") + '-'
                        + map.get("endTime").toString().replaceAll("-", "");
                templateName = ExportExcelConstant.DELIVERY_DETAIL;
                dataRecord.put("inFormNo", "合计");
            } else if ("1".equals(map.get("type"))) {
                LOG.debug("导出直送配送缺货率报表分析商品汇总导出查询参数:{}" + map.toString());
                fileName = branchName + "直送配送缺货率商品汇总表" + map.get("startTime").toString().replaceAll("-", "") + '-'
                        + map.get("endTime").toString().replaceAll("-", "");
                templateName = ExportExcelConstant.DELIVERY_SUM_GOODS;
                dataRecord.put("skuCode", "合计");
            } else if ("2".equals(map.get("type"))) {
                LOG.debug("导出直送配送缺货率报表分析单据汇总导出查询参数:{}" + map.toString());
                fileName = branchName + "直送配送缺货率单据汇总表" + map.get("startTime").toString().replaceAll("-", "") + '-'
                        + map.get("endTime").toString().replaceAll("-", "");
                templateName = ExportExcelConstant.DELIVERY_SUM_FORM;
                dataRecord.put("targetBranchName", "合计");
            } else if ("3".equals(map.get("type"))) {
                LOG.debug("导出直送配送缺货率报表分析店铺汇总导出查询参数:{}" + map.toString());
                fileName = branchName + "直送配送缺货率店铺汇总表" + map.get("startTime").toString().replaceAll("-", "") + '-'
                        + map.get("endTime").toString().replaceAll("-", "");
                templateName = ExportExcelConstant.DELIVERY_SUM_BRANCH;
                dataRecord.put("targetBranchName", "合计");
            }

            reportList.add(dataRecord);
            cleanDataMaps(getPriceAccess(), reportList);

            // 导出Excel
            Map<String, Object> param = new HashMap<>();
            param.put("branchName", branchName);
            exportParamListForXLSX(response, reportList, param, fileName, templateName);

        } catch (Exception e) {
            LOG.error("直送配送缺货率报表分析查询异常:", e);
        }
        return null;
    }


    @Override
    public String getFileName() {
        return null;
    }

    @Override
    public String[] getHeaders() {
        return new String[0];
    }

    @Override
    public String[] getColumns() {
        return new String[0];
    }

    @Override
    public void formatter(DataRecord dataRecord) {

    }
}
