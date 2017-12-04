/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年11月23日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.purchase;  

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.rpc.RpcContext;
import com.google.common.collect.Lists;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.purchase.po.PurchaseReplenishBranchPo;
import com.okdeer.jxc.form.purchase.qo.FormQueryQo;
import com.okdeer.jxc.form.purchase.service.PurchaseReplenishAnalyService;


/**
 * ClassName: PurchaseReplenishBranchController 
 * @Description: 机构补货分析Controller
 * @author liwb
 * @date 2017年11月23日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@RestController
@RequestMapping("purchase/report/replenishAnaly")
public class PurchaseReplenishBranchController extends BaseController<PurchaseReplenishBranchController> {
	
	@Resource
	private PurchaseReplenishAnalyService purchaseReplenishAnalyService;
	
	@RequestMapping("/toManager")
    public ModelAndView toManager() {
        return new ModelAndView("form/purchase/report/purchaseReplenishBranch");
    }
	
	@RequestMapping(value = "reportList", method = RequestMethod.POST)
	public PageUtils<PurchaseReplenishBranchPo> reportList(FormQueryQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		try {
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);

			// 构建查询参数
			buildSearchParams(qo);
			LOG.debug("查询机构补货分析条件：{}", qo);
			
			// 2、查询合计
            purchaseReplenishAnalyService.getBranchReplenishAnalyReportSum(qo);
            Future<PurchaseReplenishBranchPo> sumFuture = RpcContext.getContext().getFuture();

			//1、查询列表
			purchaseReplenishAnalyService.getBranchReplenishAnalyReportList(qo);
            Future<List<PurchaseReplenishBranchPo>> listFuture = RpcContext.getContext().getFuture();

            PurchaseReplenishBranchPo total = sumFuture.get();
            
            if(total.getDataCount() == 0 ){
            	return PageUtils.emptyPage();
            }
            
            List<PurchaseReplenishBranchPo> list = listFuture.get();
            PageUtils<PurchaseReplenishBranchPo> page = new PageUtils<PurchaseReplenishBranchPo>(list, total, total.getDataCount());
            page.setPageNum(pageNumber);
            page.setPageSize(pageSize);

            // 过滤数据权限字段
            cleanAccessData(list);
            
            return page;
		} catch (Exception e) {
			LOG.error("分页查询机构补货分析异常:", e);
		}
		return PageUtils.emptyPage();
	}
	
	@RequestMapping(value = "exportList")
	public RespJson exportList(FormQueryQo qo, HttpServletResponse response) {
		try {
			
			// 构建查询参数
			buildSearchParams(qo);
			
			String branchName = qo.getBranchName();
			
			List<PurchaseReplenishBranchPo> exportList = queryListPartition(qo);
			
            // 导出文件名称，不包括后缀名
            String fileName = branchName + "补货分析" + "_" + DateUtils.getSmallStr(qo.getStartTime()) + "_"
					+ DateUtils.getSmallStr(qo.getEndTime());
            // 模板名称，包括后缀名
            String templateName = ExportExcelConstant.PURCHASE_REPLENISH_BRANCH;
            // 导出Excel
            cleanAccessData(exportList);
            
            // 导出Excel			
 			Map<String, Object> param = new HashMap<>();
 			param.put("branchName", branchName);
         			
 			exportParamListForXLSX(response, exportList, param, fileName, templateName);
            
		} catch (Exception e) {
			LOG.error("导出机构补货分析失败：", e);
		}
		return RespJson.error();
	}
	
	private List<PurchaseReplenishBranchPo> queryListPartition(FormQueryQo qo) throws ExecutionException, InterruptedException {
        int startCount = limitStartCount(qo.getStartCount());
        int endCount = limitEndCount(qo.getEndCount());

        LOG.info("机构补货分析导出startCount和endCount参数：{}, {}", startCount, endCount);

        int resIndex = (endCount / 5000);
        int modIndex = endCount % 5000;
        LOG.info("机构补货分析导出resIndex和modIndex参数：{}, {}", resIndex, modIndex);
        List<PurchaseReplenishBranchPo> data = Lists.newArrayList();
        List<Future<List<PurchaseReplenishBranchPo>>> futures = Lists.newArrayList();
        if (resIndex > 0) {
            for (int i = 0; i < resIndex; i++) {
                int newStart = (i * 5000) + startCount;
                qo.setStartCount(newStart);
                qo.setEndCount(5000);
                LOG.info("DgStockAnalysisController.exportDgStockAnalysis东莞大仓导出startCount和endCount参数导出i、startCount、endCount参数：{}, {}, {}", i, newStart, 5000);
                purchaseReplenishAnalyService.getBranchReplenishAnalyExportList(qo);
                Future<List<PurchaseReplenishBranchPo>> listFuture = RpcContext.getContext().getFuture();
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
                purchaseReplenishAnalyService.getBranchReplenishAnalyExportList(qo);
                Future<List<PurchaseReplenishBranchPo>> listFuture = RpcContext.getContext().getFuture();
                data.addAll(listFuture.get());
            }
        } else {
            LOG.info("DgStockAnalysisController.exportDgStockAnalysis东莞大仓导出startCount和endCount参数导出不超过:{}", 5000);
            purchaseReplenishAnalyService.getBranchReplenishAnalyExportList(qo);
            Future<List<PurchaseReplenishBranchPo>> listFuture = RpcContext.getContext().getFuture();
            forEachFuture(data, futures);
            data.addAll(listFuture.get());
        }
        return data;

    }

    private void forEachFuture(List<PurchaseReplenishBranchPo> data, List<Future<List<PurchaseReplenishBranchPo>>> futures) {
        if (!futures.isEmpty()) {
            futures.stream().forEach((future) -> {
                try {
                    data.addAll(future.get());
                } catch (Exception e) {
                    LOG.error("机构补货分析异常：", e);
                }
            });
            futures.clear();
        }
    }
	
	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author liwb
	 * @date 2017年5月31日
	 */
	private void buildSearchParams(FormQueryQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
			qo.setBranchName(super.getCurrBranchName());
		}
		
		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

}
