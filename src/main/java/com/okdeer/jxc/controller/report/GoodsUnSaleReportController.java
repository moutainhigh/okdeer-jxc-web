/**
 * @Project: okdeer-jxc-web
 * @Author: liux01
 * @Date: 2017年2月15日
 * @Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved.
 */
package com.okdeer.jxc.controller.report;

import com.alibaba.dubbo.rpc.RpcContext;
import com.google.common.collect.Lists;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.report.qo.GoodsUnsaleReportQo;
import com.okdeer.jxc.report.service.GoodsUnsaleReportService;
import com.okdeer.jxc.report.vo.GoodsUnsaleReportVo;
import com.okdeer.jxc.utils.UserUtil;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;


/**
 * ClassName: GoodsUnSaleReportController 
 * @Description: TODO
 * @author liux01
 * @date 2017年2月15日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/goodsUnsale")
public class GoodsUnSaleReportController extends BaseController<GoodsUnSaleReportController> {

    //@Reference(version = "1.0.0", check = false)
    @Resource
    private GoodsUnsaleReportService goodsUnsaleReportService;

    /**
     * @return
     * @Description: TODO
     * @author liux01
     * @date 2017年2月15日
     */
    @RequestMapping(value = "/list")
    public String list() {
        return "/report/goodsUnsale/goodsUnsaleReport";
    }

    /**
     * @param vo
     * @param pageNumber
     * @param pageSize
     * @return
     * @Description: 查询滞销信息
     * @author liux01
     * @date 2017年2月15日
     */
    @RequestMapping(value = "getGoodsUnsaleReportList", method = RequestMethod.POST)
    @ResponseBody
    public PageUtils<GoodsUnsaleReportVo> getGoodsUnsaleReportList(
            GoodsUnsaleReportQo vo,
            @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
            @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        LOG.debug(LogConstant.OUT_PARAM, vo.toString());
        try {
            vo.setPageNumber(pageNumber);
            vo.setPageSize(pageSize);
            /*vo.setSourceBranchId(UserUtil.getCurrBranchId());*/
            if (StringUtils.isEmpty(vo.getBranchCompleCode())) {
                vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
            }
            goodsUnsaleReportService.getGoodsUnsaleReportList(vo);
            Future<PageUtils<GoodsUnsaleReportVo>> listFuture = RpcContext.getContext().getFuture();
            goodsUnsaleReportService.queryGoodsUnsaleReportSum(vo);
            Future<GoodsUnsaleReportVo> unsaleReportVoFuture = RpcContext.getContext().getFuture();

//            PageUtils<GoodsUnsaleReportVo> list = listFuture.get();

            GoodsUnsaleReportVo reportVo = unsaleReportVoFuture.get();
           /* List<GoodsUnsaleReportVo> footer = new ArrayList<GoodsUnsaleReportVo>();
            if (reportVo != null) {
                // 过滤数据权限字段
                cleanAccessData(reportVo);
                footer.add(reportVo);
                list.setTotal(reportVo.getCount());
            }
            list.setFooter(footer);*/
            PageUtils<GoodsUnsaleReportVo> pages = new PageUtils<GoodsUnsaleReportVo>(listFuture.get().getList(),
                    reportVo, reportVo.getCount(), pageNumber, pageSize);
            
            // 过滤数据权限字段
            cleanAccessData(pages);
            return pages;
        } catch (Exception e) {
            LOG.error("获取滞销信息列表信息异常:{}", e);
        }
        return null;
    }

    /**
     * @param response
     * @param vo
     * @return
     * @Description: 导出滞销信息
     * @author liux01
     * @date 2017年2月15日
     */
    @RequestMapping(value = "/exportList2", method = RequestMethod.POST)
    @ResponseBody
    public RespJson exportList2(HttpServletResponse response, GoodsUnsaleReportQo vo) {
        RespJson resp = RespJson.success();
        try {
            vo.setSourceBranchId(UserUtil.getCurrBranchId());
            //goodsUnsaleReportService.queryGoodsUnsaleReportSum(vo);
            vo.setPageNumber(vo.getStartCount());
            vo.setPageSize(vo.getEndCount() - vo.getStartCount());
            List<GoodsUnsaleReportVo> exportList = queryListPartition(vo);
            //Future<GoodsUnsaleReportVo> goodsUnsaleReportVo = RpcContext.getContext().getFuture();
            //goodsUnsaleReportVo.setBranchCode("合计:");
            //exportList.add(goodsUnsaleReportVo);
            // 过滤数据权限字段
            cleanAccessData(exportList);
            String fileName = "商品滞销查询报表_" + DateUtils.getCurrSmallStr();
            String templateName = ExportExcelConstant.GOODS_UNSALE_REPORT;
            exportListForXLSX(response, exportList, fileName, templateName);
        } catch (Exception e) {
            LOG.error("导出滞销信息列表异常：{}", e);
            resp = RespJson.error("导出滞销信息列表异常");
        }
        return resp;
    }
    /**
	 * 
	 * @Description: 导出滞销信息
	 * @param response
	 * @param vo
	 * @return
	 * @author liux01
	 * @date 2017年2月15日
	 */
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, GoodsUnsaleReportQo vo) {
		RespJson resp = RespJson.success();
		try {
			// 导出的数据列表
			List<GoodsUnsaleReportVo> exportList = new ArrayList<GoodsUnsaleReportVo>();

			// 限制导出数据的起始数量
			int startCount = limitStartCount(vo.getStartCount());
			// 限制导出数据的总数量
			int endCount = limitEndCount(vo.getEndCount());

			// 商，按2K条数据一次查询拆分，可以拆分为多少次查询
			int resIndex = (int) (endCount / LIMIT_REQ_COUNT);
			// 余数，按2K拆分后，剩余的数据
			int modIndex = endCount % LIMIT_REQ_COUNT;

			// 每2K条数据一次查询
			for (int i = 0; i < resIndex; i++) {
				int newStart = (i * LIMIT_REQ_COUNT) + startCount;
				vo.setStartCount(newStart);
				vo.setEndCount(LIMIT_REQ_COUNT);
				List<GoodsUnsaleReportVo> tempList =goodsUnsaleReportService. exportList("",vo);
				exportList.addAll(tempList);
			}

			// 存在余数时，查询剩余的数据
			if (modIndex > 0) {
				int newStart = (resIndex * LIMIT_REQ_COUNT) + startCount;
				int newEnd = modIndex;
				vo.setStartCount(newStart);
				vo.setEndCount(newEnd);
				List<GoodsUnsaleReportVo> tempList =goodsUnsaleReportService.exportList("",vo);
				exportList.addAll(tempList);
			}
			
			//Future<GoodsUnsaleReportVo> goodsUnsaleReportVo = RpcContext.getContext().getFuture();
			//goodsUnsaleReportVo.setBranchCode("合计:");
			//exportList.add(goodsUnsaleReportVo);
			// 过滤数据权限字段
			cleanAccessData(exportList);
			String fileName = "商品滞销查询报表_"+DateUtils.getCurrSmallStr();
			String templateName = ExportExcelConstant.GOODS_UNSALE_REPORT;
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("导出滞销信息列表异常：{}", e);
			resp = RespJson.error("导出滞销信息列表异常");
		}
		return resp;
	}

    /**
     * @param qo
     * @param response
     * @param request
     * @return
     * @Description: 打印
     * @author liux01
     * @date 2017年2月16日
     */
    @RequestMapping(value = "printReport", method = RequestMethod.GET)
    @ResponseBody
    public String printReport(GoodsUnsaleReportQo qo, HttpServletResponse response, HttpServletRequest request) {
        try {
            qo.setSourceBranchId(UserUtil.getCurrBranchId());
            /*goodsUnsaleReportService.exportList(qo);
            Future<List<GoodsUnsaleReportVo>> exportListFuture = RpcContext.getContext().getFuture();*/
            goodsUnsaleReportService.queryGoodsUnsaleReportSum(qo);
            Future<GoodsUnsaleReportVo> unsaleReportVoFuture = RpcContext.getContext().getFuture();
            List<GoodsUnsaleReportVo> exportList = queryListPartition(qo);
            GoodsUnsaleReportVo vo = unsaleReportVoFuture.get();
            if (vo != null) {
                vo.setBranchCode("合计:");
                exportList.add(vo);
            }
            int lenght = exportList.size();
            if (lenght > PrintConstant.PRINT_MAX_ROW) {
                return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
            }
            // 过滤数据权限字段
            cleanAccessData(exportList);
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("startDate", qo.getStartTime());
            map.put("endDate", qo.getEndTime());
            map.put("printName", UserUtil.getCurrentUser().getUserName());
            String path = PrintConstant.GOODS_UNSALE_REPORT;
            JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, exportList, "");
        } catch (Exception e) {
            LOG.error(PrintConstant.GOODS_UNSALE_PRINT_ERROR, e);
        }
        return null;
    }


    /**
     * 把导出的请求分成多次，一次请求1000条数据
     *
     * @param qo
     * @return
     */
    private List<GoodsUnsaleReportVo> queryListPartition(GoodsUnsaleReportQo qo) throws ExecutionException, InterruptedException {
        int startCount = limitStartCount(qo.getStartCount());
        int endCount = limitEndCount(qo.getEndCount());

        LOG.info("GoodsUnSaleReportController.exportList商品滞销报表导出startCount和endCount参数：{}, {}", startCount, endCount);

        int resIndex = (endCount / 1000);
        int modIndex = endCount % 1000;
        LOG.info("GoodsUnSaleReportController.exportList商品滞销报表导出resIndex和modIndex参数：{}, {}", resIndex, modIndex);
        List<GoodsUnsaleReportVo> data = Lists.newArrayList();
        List<Future<PageUtils<GoodsUnsaleReportVo>>> futures = Lists.newArrayList();
        if (resIndex > 0) {
            for (int i = 0; i < resIndex; i++) {
                int newStart = (i * 1000) + startCount;
                qo.setPageNumber(i + 1);
                qo.setPageSize(1000);
                LOG.info("GoodsUnSaleReportController.exportList for商品滞销报表导出i、startCount、endCount参数：{}, {}, {}", i, newStart, 1000);
                goodsUnsaleReportService.getGoodsUnsaleReportList(qo);
                Future<PageUtils<GoodsUnsaleReportVo>> listFuture = RpcContext.getContext().getFuture();
                //data.addAll(listFuture.get().getList());
                futures.add(listFuture);
                if (futures.size() % 5 == 0) {
                    forEachFuture(data, futures);
                }
            }
            forEachFuture(data, futures);
            if (modIndex > 0) {
                int newStart = (resIndex * 1000) + startCount;
                int newEnd = modIndex;
                qo.setPageNumber(resIndex);
                qo.setPageSize(newEnd);
                LOG.info("GoodsUnSaleReportController.exportList商品滞销报表导出mod、startCount、endCount参数:{}, {}", newStart, newEnd);
                goodsUnsaleReportService.getGoodsUnsaleReportList(qo);
                Future<PageUtils<GoodsUnsaleReportVo>> listFuture = RpcContext.getContext().getFuture();
                data.addAll(listFuture.get().getList());
            }

        } else {
            qo.setPageNumber(1);
            qo.setPageSize(qo.getEndCount());
            LOG.info("GoodsUnSaleReportController.exportList商品滞销报表导出不超过:{}", 1000);
            goodsUnsaleReportService.getGoodsUnsaleReportList(qo);
            Future<PageUtils<GoodsUnsaleReportVo>> listFuture = RpcContext.getContext().getFuture();
            forEachFuture(data, futures);
            data.addAll(listFuture.get().getList());
        }
        return data;
    }

    private void forEachFuture(List<GoodsUnsaleReportVo> data, List<Future<PageUtils<GoodsUnsaleReportVo>>> futures) {
        if (!futures.isEmpty()) {
            futures.stream().forEach((future) -> {
                try {
                    data.addAll(future.get().getList());
                } catch (Exception e) {
                    LOG.error("滯銷商品情況分析導出異常!", e);
                }
            });
            futures.clear();
        }
    }
}
