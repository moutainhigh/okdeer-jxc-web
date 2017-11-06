/** 
 *@Project: okdeer-jxc-web 
 *@Author: liux01
 *@Date: 2017年2月15日 
 *@Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.report;

import com.alibaba.dubbo.rpc.RpcContext;
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
	 * 
	 * @Description: TODO
	 * @return
	 * @author liux01
	 * @date 2017年2月15日
	 */
	@RequestMapping(value = "/list")
	public String list(){
		return "/report/goodsUnsale/goodsUnsaleReport";
	}
	/**
	 * 
	 * @Description: 查询滞销信息
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return
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
			vo.setSourceBranchId(UserUtil.getCurrBranchId());
			if(StringUtils.isEmpty(vo.getBranchCompleCode())){
				vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			}
			goodsUnsaleReportService.getGoodsUnsaleReportList(vo);
			Future<PageUtils<GoodsUnsaleReportVo>> listFuture = RpcContext.getContext().getFuture();
			goodsUnsaleReportService.queryGoodsUnsaleReportSum(vo);
			Future<GoodsUnsaleReportVo> unsaleReportVoFuture = RpcContext.getContext().getFuture();

			PageUtils<GoodsUnsaleReportVo> list = listFuture.get();

			GoodsUnsaleReportVo reportVo = unsaleReportVoFuture.get();
			List<GoodsUnsaleReportVo> footer = new ArrayList<GoodsUnsaleReportVo>();
			if(reportVo !=null){
				// 过滤数据权限字段
				cleanAccessData(reportVo);
				footer.add(reportVo);
				list.setTotal(reportVo.getCount());
			}
			list.setFooter(footer);
			// 过滤数据权限字段
			cleanAccessData(list);
			return list;
		} catch (Exception e) {
			LOG.error("获取滞销信息列表信息异常:{}", e);
		}
		return null;
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
			vo.setSourceBranchId(UserUtil.getCurrBranchId());
			//goodsUnsaleReportService.queryGoodsUnsaleReportSum(vo);
			vo.setPageNumber(vo.getStartCount());
			vo.setPageSize(vo.getEndCount() - vo.getStartCount());
			goodsUnsaleReportService.getGoodsUnsaleReportList(vo);
			Future<PageUtils<GoodsUnsaleReportVo>> listFuture = RpcContext.getContext().getFuture();
			List<GoodsUnsaleReportVo> exportList = listFuture.get().getList();
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
	 * 
	 * @Description: 打印
	 * @param qo
	 * @param response
	 * @param request
	 * @return
	 * @author liux01
	 * @date 2017年2月16日
	 */
	@RequestMapping(value = "printReport", method = RequestMethod.GET)
	@ResponseBody
	public String printReport(GoodsUnsaleReportQo qo, HttpServletResponse response, HttpServletRequest request) {
		try {
			qo.setSourceBranchId(UserUtil.getCurrBranchId());
			goodsUnsaleReportService.exportList(qo);
			Future<List<GoodsUnsaleReportVo>> exportListFuture = RpcContext.getContext().getFuture();
			goodsUnsaleReportService.queryGoodsUnsaleReportSum(qo);
			Future<GoodsUnsaleReportVo> unsaleReportVoFuture = RpcContext.getContext().getFuture();
			GoodsUnsaleReportVo vo = unsaleReportVoFuture.get();
			List<GoodsUnsaleReportVo> exportList = exportListFuture.get();
			if(vo !=null){
				vo.setBranchCode("合计:");
				exportList.add(vo);
			}
			int lenght= exportList.size();
			if(lenght>PrintConstant.PRINT_MAX_ROW){
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
}
