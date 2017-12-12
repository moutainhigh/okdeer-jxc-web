/** 
 *@Project: okdeer-jxc-web 
 *@Author: liux01
 *@Date: 2016年11月10日 
 *@Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.report;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.service.GoodsSaleAmountReportServiceApi;
import com.okdeer.jxc.report.vo.GoodsSaleAmountReportVo;
import com.okdeer.jxc.utils.UserUtil;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;

import java.util.ArrayList;
import java.util.List;


/**
 * ClassName: GoodsSaleAmountReportController 
 * @Description: TODO
 * @author liux01
 * @date 2016年11月10日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("goods/goodsSaleAmount")
public class GoodsSaleAmountReportController extends BaseController<GoodsSaleAmountReportController> {

	@Reference(version = "1.0.0", check = false)
	private GoodsSaleAmountReportServiceApi goodsSaleAmountReportServiceApi;

    @Reference(version = "1.0.0", check = false)
    BranchesServiceApi branchesServiceApi;

	@RequestMapping(value = "/list")
	public String list(){
		return "/report/goods/goodsSaleAmountReport";
	}
	
	/**
	 * 
	 * @Description: 获取单品ABC销售额列表
	 * @param vo 单品ABC销售额对象
	 * @param pageNumber 页数
	 * @param pageSize 每页显示数
	 * @return
	 * @author liux01
	 * @date 2016年11月11日
	 */
	@RequestMapping(value = "goodsSaleAmountList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsSaleAmountReportVo> goodsSaleAmountList(
			GoodsSaleAmountReportVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.debug(LogConstant.OUT_PARAM, vo.toString());
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			/*vo.setSourceBranchId(UserUtil.getCurrBranchId());
            Branches branches = branchesServiceApi.getBranchInfoById(vo.getBranchId());
            if (branches.getType() == 0 || branches.getType() == 1) {//总部或者分公司
                vo.setBrancheType(Boolean.TRUE);
            }*/
			if(StringUtils.isEmpty(vo.getBranchCompleCode())){
				vo.setBranchCompleCode(this.getCurrBranchCompleCode());
			}
            PageUtils<GoodsSaleAmountReportVo> goodsOutInfoDetailList = goodsSaleAmountReportServiceApi.goodsSaleAmountList(vo);
            GoodsSaleAmountReportVo goodsSaleAmountReportVo = goodsSaleAmountReportServiceApi.queryGoodsSaleAmountSum(vo);
            List<GoodsSaleAmountReportVo> footer = new ArrayList<GoodsSaleAmountReportVo>();
            if (goodsSaleAmountReportVo != null) {
                footer.add(goodsSaleAmountReportVo);
            }
            goodsOutInfoDetailList.setFooter(footer);
            // 过滤数据权限字段
            cleanAccessData(goodsOutInfoDetailList);
            return goodsOutInfoDetailList;
        } catch (Exception e) {
            LOG.error("获取单品ABC销售额列表异常:{}", e);
        }
        return null;
    }


    /**
     *
     * @Description: 导出单品ABC销售额列表
     * @param response
     * @param vo 单品ABC销售额对象
     * @return
     * @author liux01
     * @date 2016年11月11日
     */
    @RequestMapping(value = "/exportList", method = RequestMethod.POST)
    @ResponseBody
    public RespJson exportList(HttpServletResponse response, GoodsSaleAmountReportVo vo) {
        RespJson resp = RespJson.success();
        try {
			vo.setSourceBranchId(UserUtil.getCurrBranchId());
            Branches branches = branchesServiceApi.getBranchInfoById(vo.getBranchId());
            if (branches.getType() == 0 || branches.getType() == 1) {//总部或者分公司
                vo.setBrancheType(Boolean.TRUE);
            }
            List<GoodsSaleAmountReportVo> exportList = goodsSaleAmountReportServiceApi.exportList(vo);
            GoodsSaleAmountReportVo goodsSaleAmountReportVo = goodsSaleAmountReportServiceApi.queryGoodsSaleAmountSum(vo);
            goodsSaleAmountReportVo.setBranchName("合计:");
            exportList.add(goodsSaleAmountReportVo);
            // 过滤数据权限字段
            cleanAccessData(exportList);
            String fileName = "单品销售额ABC分析" + vo.getStartTime().replace("-", "") + "-" + vo.getEndTime().replace("-", "");
            String templateName = ExportExcelConstant.GOODS_SALE_AMOUNT_REPORT;
            exportListForXLSX(response, exportList, fileName, templateName);
        } catch (Exception e) {
            LOG.error("导出单品ABC销售额列表异常：{}", e);
            resp = RespJson.error("导出单品ABC销售额列表异常");
        }
        return resp;
    }


}
