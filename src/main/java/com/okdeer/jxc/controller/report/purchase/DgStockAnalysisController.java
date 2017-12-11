package com.okdeer.jxc.controller.report.purchase;

import com.alibaba.dubbo.rpc.RpcContext;
import com.google.common.collect.Lists;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.purchase.qo.FormQueryQo;
import com.okdeer.jxc.form.purchase.service.PurchaseReportService;
import com.okdeer.jxc.form.purchase.vo.DgStockAnalysisVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/***
 * 
 * ClassName: DgStockAnalysisController 
 * @Description: 东莞大仓补货分析
 * @author xuyq
 * @date 2017年9月5日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/purchase")
public class DgStockAnalysisController extends BaseController<PurchaseReportController> {

    /**
     * @Fields purchaseReportService : 采购报表service
     */
    //@Reference(version = "1.0.0", check = false)
    @Resource
    private PurchaseReportService purchaseReportService;

    /***
     * 
     * @Description: 页面跳转
     * @return String
     * @author xuyq
     * @date 2017年9月5日
     */
    @RequestMapping("/dgStockAnalysis")
    public String dgStockAnalysis() {
        return "report/purchase/dgStockAnalysis";
    }

    /**
     * 
     * @Description: 东莞大仓补货分析报表数据查询
     * @param qo 查询条件
     * @param pageNumber
     * @param pageSize
     * @return PageUtils
     * @author xuyq
     * @date 2017年9月5日
     */
    @RequestMapping(value = "getDgStockAnalysisList", method = RequestMethod.POST)
    @ResponseBody
    public PageUtils<DgStockAnalysisVo> getDgStockAnalysisList(FormQueryQo qo,
            @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
            @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            LOG.debug("东莞大仓补货分析报表数据查询：{}", qo);
            if (StringUtils.isEmpty(qo.getBranchName())) {
                qo.setBranchCompleCode(getCurrBranchCompleCode());
            }
            qo.setPageNumber(pageNumber);
            qo.setPageSize(pageSize);
            qo.setBranchId(Constant.DG_BRANCH_ID);
            if (qo.getEndTime() != null) {
                Date time = DateUtils.getNextDay(qo.getEndTime());
                qo.setEndTime(time);
            }

            /*purchaseReportService.getDgStockAnalysisPageList(qo);
            Future<PageUtils<DgStockAnalysisVo>> listFuture = RpcContext.getContext().getFuture();
            // 2、查询合计
            purchaseReportService.getDgStockAnalysisListSum(qo);
            Future<DgStockAnalysisVo> voFuture = RpcContext.getContext().getFuture();*/

            //1、查询列表
            purchaseReportService.getDgStockAnalysisPageListNew(qo);
            Future<List<DgStockAnalysisVo>> listFuture = RpcContext.getContext().getFuture();

            // 2、查询合计
            purchaseReportService.sumDgStockAnalysis(qo);
            Future<DgStockAnalysisVo> sumFuture = RpcContext.getContext().getFuture();

            // 3、统计个数
            purchaseReportService.countDgStockAnalysis(qo);
            Future<Long> countFuture = RpcContext.getContext().getFuture();

            DgStockAnalysisVo vo = sumFuture.get();

            List<DgStockAnalysisVo> footer = new ArrayList<>();
            footer.add(vo);

            List<DgStockAnalysisVo> vos = listFuture.get();
            PageUtils<DgStockAnalysisVo> list = new PageUtils<>(vos, footer, countFuture.get(), pageNumber, pageSize);

            // 过滤数据权限字段
            cleanAccessData(list);
            return list;

        } catch (Exception e) {
            LOG.error("东莞大仓补货分析报表数据查询异常:{}", e);
        }
        return PageUtils.emptyPage();
    }

    /**
     * 
     * @Description: 导出
     * @param response
     * @param qo
     * @param pageNumber
     * @param pageSize
     * @author xuyq
     * @date 2017年9月5日
     */
    @RequestMapping(value = "exportDgStockAnalysis")
    public void exportDgStockAnalysis(HttpServletResponse response, FormQueryQo qo,
            @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
            @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        LOG.debug("东莞大仓补货分析报表导出:{}", qo);
        try {
            if (qo.getEndTime() != null) {
                Date time = DateUtils.getNextDay(qo.getEndTime());
                qo.setEndTime(time);
            }
            qo.setBranchId(Constant.DG_BRANCH_ID);
            List<DgStockAnalysisVo> exportList = queryListPartition(qo);
            /*if(CollectionUtils.isNotEmpty(exportList)){
                // 2、查询合计
                DgStockAnalysisVo vo = purchaseReportService.getDgStockAnalysisListSum(qo);
                exportList.add(vo);
            }*/
            // 导出文件名称，不包括后缀名
            String fileName = "东莞大仓补货分析" + "_" + DateUtils.getCurrSmallStr();
            // 模板名称，包括后缀名
            String templateName = ExportExcelConstant.DG_STOCK_ANALYSIS;
            // 导出Excel
            cleanAccessData(exportList);
            exportListForXLSX(response, exportList, fileName, templateName);
        } catch (Exception e) {
            LOG.error("东莞大仓补货分析导出:{}", e);
        }
    }

    /**
     * 把导出的请求分成多次，一次请求2000条数据
     *
     * @param qo
     * @return
     */
    private List<DgStockAnalysisVo> queryListPartition(FormQueryQo qo) throws ExecutionException, InterruptedException {
        int startCount = limitStartCount(qo.getStartCount());
        int endCount = limitEndCount(qo.getEndCount());

        LOG.info("DgStockAnalysisController.exportDgStockAnalysis东莞大仓导出startCount和endCount参数：{}, {}", startCount, endCount);

        int resIndex = (endCount / 5000);
        int modIndex = endCount % 5000;
        LOG.info("DgStockAnalysisController.exportDgStockAnalysis东莞大仓导出startCount和endCount参数：{}, {}", resIndex, modIndex);
        List<DgStockAnalysisVo> data = Lists.newArrayList();
        List<Future<List<DgStockAnalysisVo>>> futures = Lists.newArrayList();
        if (resIndex > 0) {
            for (int i = 0; i < resIndex; i++) {
                int newStart = (i * 5000) + startCount;
                qo.setStartCount(newStart);
                qo.setEndCount(5000);
                LOG.info("DgStockAnalysisController.exportDgStockAnalysis东莞大仓导出startCount和endCount参数导出i、startCount、endCount参数：{}, {}, {}", i, newStart, 5000);
                purchaseReportService.getDgStockAnalysisListNew(qo);
                Future<List<DgStockAnalysisVo>> listFuture = RpcContext.getContext().getFuture();
                //data.addAll(listFuture.get().getList());
                futures.add(listFuture);
                if (futures.size() % 5 == 0) {
                    forEachFuture(data, futures);
                }
            }
            forEachFuture(data, futures);
            if (modIndex > 0) {
                int newStart = (resIndex * 5000) + startCount;
                int newEnd = modIndex;
                qo.setStartCount(newStart);
                qo.setEndCount(newEnd);
                LOG.info("DgStockAnalysisController.exportDgStockAnalysis东莞大仓导出startCount和endCount参数mod、startCount、endCount参数:{}, {}", newStart, newEnd);
                purchaseReportService.getDgStockAnalysisListNew(qo);
                Future<List<DgStockAnalysisVo>> listFuture = RpcContext.getContext().getFuture();
                data.addAll(listFuture.get());
            }
        } else {
            LOG.info("DgStockAnalysisController.exportDgStockAnalysis东莞大仓导出startCount和endCount参数导出不超过:{}", 5000);
            purchaseReportService.getDgStockAnalysisListNew(qo);
            Future<List<DgStockAnalysisVo>> listFuture = RpcContext.getContext().getFuture();
            forEachFuture(data, futures);
            data.addAll(listFuture.get());
        }
        return data;

    }

    private void forEachFuture(List<DgStockAnalysisVo> data, List<Future<List<DgStockAnalysisVo>>> futures) {
        if (!futures.isEmpty()) {
            futures.stream().forEach((future) -> {
                try {
                    data.addAll(future.get());
                } catch (Exception e) {
                    LOG.error("东莞大仓導出異常!", e);
                }
            });
            futures.clear();
        }
    }
}
