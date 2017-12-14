/** 
 *@Project: okdeer-jxc-web 
 *@Author: lijy02
 *@Date: 2016年10月25日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.report.purchase;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.purchase.po.PurchaseStateTrackPo;
import com.okdeer.jxc.form.purchase.qo.FormQueryQo;
import com.okdeer.jxc.form.purchase.service.PurchaseReportService;

/**
 * 
 * ClassName: PurchaseStateTrackController 
 * @Description: 采购订单状态跟踪
 * @author xuyq
 * @date 2017年9月30日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/purchase")
public class PurchaseStateTrackController extends BaseController<PurchaseStateTrackController> {

    /**
     * @Fields purchaseReportService : 采购报表service
     */
    @Reference(version = "1.0.0", check = false)
    private PurchaseReportService purchaseReportService;

    /**
     * 
     * @Description: 采购订单状态跟踪
     * @return String
     * @author xuyq
     * @date 2017年9月30日
     */
    @RequestMapping("/stateTrackList")
    public String stateTrackList() {
        return "report/purchase/stateTrackList";
    }

    /**
     * 
     * @Description: 采购订单状态跟踪查询
     * @param qo 采购报表查询条件QO
     * @param pageNumber
     * @param pageSize
     * @return PageUtils
     * @author xuyq
     * @date 2017年9月30日
     */
    @RequestMapping(value = "getStateTrackList", method = RequestMethod.POST)
    @ResponseBody
    public PageUtils<PurchaseStateTrackPo> getStateTrackList(FormQueryQo qo,
            @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
            @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            if (StringUtils.isEmpty(qo.getBranchId())) {
                qo.setBranchCode(getCurrBranchCompleCode());
            }
            qo.setPageNumber(pageNumber);
            qo.setPageSize(pageSize);
            if (qo.getEndTime() != null) {
                Date time = DateUtils.getNextDay(qo.getEndTime());
                qo.setEndTime(time);
            }

            LOG.debug("采购订单状态跟踪查询：{}", qo);
            PageUtils<PurchaseStateTrackPo> list = purchaseReportService.getStateTrackPage(qo);
            // 过滤数据权限字段
            cleanAccessData(list);
            return list;

        } catch (Exception e) {
            LOG.error("采购订单状态跟踪查询:{}", e);
        }
        return PageUtils.emptyPage();
    }

    /**
     * 
     * @Description: 导出
     * @param response
     * @param qo 采购报表查询条件QO
     * @param pageNumber
     * @param pageSize
     * @author xuyq
     * @date 2017年9月30日
     */
    @RequestMapping(value = "exportStateTrackList")
    public void exportStateTrackList(HttpServletResponse response, FormQueryQo qo,
            @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
            @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            if (StringUtils.isEmpty(qo.getBranchId())) {
                qo.setBranchCode(getCurrBranchCode());
            }
            if (qo.getEndTime() != null) {
                Date time = DateUtils.getNextDay(qo.getEndTime());
                qo.setEndTime(time);
            }

            LOG.debug("采购订单状态跟踪查询导出:{}", qo);
            List<PurchaseStateTrackPo> list = purchaseReportService.getStateTrackList(qo);
            // 导出文件名称，不包括后缀名
            String fileName = "采购订单状态跟踪" + "_" + DateUtils.getCurrSmallStr();
            // 模板名称，包括后缀名
            String templateName = ExportExcelConstant.PUR_STATE_TRACK;
            // 导出Excel
            cleanAccessData(list);
            exportListForXLSX(response, list, fileName, templateName);
        } catch (Exception e) {
            LOG.error("采购订单状态跟踪查询导出:{}", e);
        }
    }
}
