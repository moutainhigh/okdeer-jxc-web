/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhangchm
 *@Date: 2017年6月6日
 *@Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved.
 */
package com.okdeer.jxc.controller.report.branch;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Supplier;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.enums.GoodsTypeEnum;
import com.okdeer.jxc.common.enums.PricingTypeEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.controller.report.GoodsReportController;
import com.okdeer.jxc.report.branch.service.BranchGoodsSaleReportApi;
import com.okdeer.jxc.report.qo.GoodsReportQo;
import com.okdeer.jxc.report.vo.BranchGoodsSaleReportVo;
import com.okdeer.jxc.system.entity.SysUser;

/**
 * ClassName: BranchGoodsSaleReportController 
 * @Description: 分公司下属直营店商品查询分析
 * @author zhangchm
 * @date 2017年6月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("report/branchGoodsSaleReport")
public class BranchGoodsSaleReportController extends BaseController<GoodsReportController> {
	
	@Reference(version = "1.0.0", check = false)
	BranchesServiceApi branchesServiceApi;
	
	
	@Reference(version = "1.0.0", check = false)
	BranchGoodsSaleReportApi branchGoodsSaleReportApi;

	ExecutorService excutor = Executors.newFixedThreadPool(20);

	/**
	 * @Description: 跳转分公司商品查询分析页面
	 * @param model
	 * @return   
	 * @return String  
	 * @throws
	 * @author zhangchm
	 * @date 2017年6月6日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		SysUser user = getCurrentUser();
		Branches branchesGrow = branchesServiceApi.getBranchInfoById(user.getBranchId());
		model.addAttribute("branchesGrow", branchesGrow);
		//商品类型
		model.addAttribute("goodsType", GoodsTypeEnum.values());
		//计价方式
		model.addAttribute("pricingType", PricingTypeEnum.values()); 
		return "report/branch/branchGoodsSaleReport";
	}
	
	/**
	 * @Description: 分公司商品查询
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return PageUtils<GoodsReportVo>  
	 * @throws
	 * @author zhangchm
	 * @date 2017年6月6日
	 */
	@RequestMapping(value = "getList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<BranchGoodsSaleReportVo> getList(
			GoodsReportQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);
			// 店铺不能为空
			if (StringUtils.isEmpty(qo.getBranchName())) {
				LOG.error("店铺为空");
				return PageUtils.emptyPage();
			}
			
			PageUtils<BranchGoodsSaleReportVo> bgsReportPage = branchGoodsSaleReportApi.queryBranchGoodsSaleReport(qo);
			
			List<BranchGoodsSaleReportVo> footer = new ArrayList<>();
			footer.add(branchGoodsSaleReportApi.queryBranchGoodsSaleReportSum(qo));
			bgsReportPage.setFooter(footer);
			// 过滤数据权限字段
            cleanAccessData(bgsReportPage);
			return bgsReportPage;
		} catch (Exception e) {
			LOG.error("分公司商品查询数据出现异常:", e);
		}
		return PageUtils.emptyPage();
	}
	
	/**
	 * @Description: 导出
	 * @param response
	 * @param formNo
	 * @param type
	 * @param pattern   
	 * @return void  
	 * @throws
	 * @author zhangchm
	 * @date 2017年6月7日
	 */
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, GoodsReportQo qo) {

		LOG.debug("商品查询导出execl：vo" + qo);
		try {
			
			qo.setPageNumber(qo.getStartCount());
			qo.setPageSize(qo.getEndCount());
			// 店铺不能为空
			if (StringUtils.isEmpty(qo.getBranchName())) {
				LOG.error("店铺为空");
				return RespJson.error("店铺为空");
			}

            //PageUtils<BranchGoodsSaleReportVo> pageList = branchGoodsSaleReportApi.queryBranchGoodsSaleReport(qo);
            List<BranchGoodsSaleReportVo> list = queryListPartition(qo);
			//list.add(branchGoodsSaleReportApi.queryBranchGoodsSaleReportSum(qo));

            if (CollectionUtils.isNotEmpty(list)) {
                // 过滤数据权限字段
                cleanAccessData(list);
                String fileName = "分公司商品查询分析" + "_" + DateUtils.getCurrSmallStr();
				String templateName = ExportExcelConstant.BRANCHGOODSSALEREPORT;
				exportListForXLSX(response, list, fileName, templateName);
			} else {
				RespJson json = RespJson.error("无数据可导");
				return json;
			}
		} catch (Exception e) {
			LOG.error("商品查询导出execl出现错误{}", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}


    /**
	 * 把导出的请求分成多次，一次请求2000条数据
	 *
	 * @param qo
	 * @return
	 */
	private List<BranchGoodsSaleReportVo> queryListPartition(GoodsReportQo qo) throws ExecutionException, InterruptedException {
		int startCount = limitStartCount(qo.getStartCount());
		int endCount = limitEndCount(qo.getEndCount());

        LOG.info("BranchGoodsSaleReportController.queryBranchGoodsSaleReport商品库存导出startCount和endCount参数：{}, {}", startCount, endCount);

		int resIndex = (endCount / 5000);
		int modIndex = endCount % 5000;
		LOG.info("BranchGoodsSaleReportController.queryBranchGoodsSaleReport商品库存导出resIndex和modIndex参数：{}, {}", resIndex, modIndex);
		CompletableFuture<List<BranchGoodsSaleReportVo>> future = null;

		if (resIndex > 0) {
			for (int i = 0; i < resIndex; i++) {
				int newStart = (i * 5000) + startCount;
				qo.setStartCount(newStart);
				qo.setEndCount(5000);
				LOG.info("BranchGoodsSaleReportController.queryBranchGoodsSaleReport for商品库存导出i、startCount、endCount参数：{}, {}, {}", i, newStart, 5000);
				future = CompletableFuture.supplyAsync((Supplier<List<BranchGoodsSaleReportVo>>) branchGoodsSaleReportApi.queryBranchGoodsSaleReport(qo)::getList, excutor);
			}
			if (modIndex > 0) {
				int newStart = (resIndex * 5000) + startCount;
				int newEnd = modIndex;
				qo.setStartCount(newStart);
				qo.setEndCount(newEnd);
				LOG.info("BranchGoodsSaleReportController.queryBranchGoodsSaleReport商品库存导出mod、startCount、endCount参数:{}, {}", newStart, newEnd);
				future = CompletableFuture.supplyAsync((Supplier<List<BranchGoodsSaleReportVo>>) branchGoodsSaleReportApi.queryBranchGoodsSaleReport(qo)::getList, excutor);
			}
		} else {
			LOG.info("BranchGoodsSaleReportController.queryBranchGoodsSaleReport商品库存导出不超过:{}", 5000);
			future = CompletableFuture.supplyAsync((Supplier<List<BranchGoodsSaleReportVo>>) branchGoodsSaleReportApi.queryBranchGoodsSaleReport(qo)::getList, excutor);
		}
		return future.get();

	}
}
