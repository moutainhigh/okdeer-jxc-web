/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer
 * @Package: com.okdeer.jxc.controller.csrservice
 * @author songwj
 * @date 2017年11月28 09:31
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.csrservice;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Maps;
import com.okdeer.jxc.bill.service.TradeOrderCsrserviceService;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.csrservice.service.CsrserviceTypeService;
import com.okdeer.jxc.csrservice.vo.CsrserviceTypeVo;
import com.okdeer.jxc.report.qo.CashFlowReportQo;
import com.okdeer.jxc.report.vo.CashFlowReportVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * @author songwj
 * @ClassName: CsrserviceCashController
 * @Description: TODO
 * @project okdeer
 * @date 2017年11月28 09:31
 * =================================================================================================
 * Task ID            Date               Author           Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * V2.X          2017年11月28   songwj             TODO
 */
@RestController
@RequestMapping("service/cash/flow")
public class CsrserviceCashFlowController extends BaseController<CsrserviceCashFlowController> {

    @Reference(version = "1.0.0", check = false)
    private CsrserviceTypeService csrserviceTypeService;

    @Reference(version = "1.0.0", check = false)
    private TradeOrderCsrserviceService tradeOrderCsrserviceService;

    @Reference(version = "1.0.0", check = false)
    private BranchesServiceApi branchesService;


    @RequestMapping(value = "")
    public ModelAndView config() {
        Map<String, Object> model = Maps.newHashMap();
        String branchId = "";
        if (StringUtils.equalsIgnoreCase(getCurrBranchId(), "0")) {
            branchId = "";
        } else {
            Branches branches = branchesService.getParentById(branchId);
            if (branches.getType() == 1) {//分公司
                branchId = getCurrBranchId();
            } else {//店铺
                branchId = branches.getParentId();
            }
        }
        List<CsrserviceTypeVo> datas = csrserviceTypeService.getCsrserviceTypeVos(branchId);
        model.put("data", datas);
        return new ModelAndView("csrservice/cash/flow", model);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public PageUtils<CashFlowReportVo> getReportList(CashFlowReportQo vo,
                                                     @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
                                                     @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

        try {
            if (StringUtils.isBlank(vo.getBranchCode())) {
                vo.setBranchCode(getCurrBranchCompleCode());
            }
            vo.setPageNum(pageNumber);
            vo.setPageSize(pageSize);
            PageUtils<CashFlowReportVo> list = tradeOrderCsrserviceService.getPageList(vo);
            list.setFooter(Arrays.asList(tradeOrderCsrserviceService.sumList(vo)));
            return list;
        } catch (Exception e) {
            LOG.error("便民服务销售流水查询异常!", e);
            return PageUtils.emptyPage();
        }
    }


    @RequestMapping(value = "/export/list", method = RequestMethod.POST)
    public RespJson exportList(HttpServletResponse response, CashFlowReportQo vo) {
        RespJson resp = RespJson.success();
        if (StringUtils.isBlank(vo.getBranchCode())) {
            vo.setBranchCode(getCurrBranchCompleCode());
        }
        List<CashFlowReportVo> exportList = tradeOrderCsrserviceService.getList(vo);

        String fileName = "便民服务收银流水_" + DateUtils.getCurrSmallStr();
        String templateName = ExportExcelConstant.CSRSERVICE_CASH_FLOW;
        exportListForXLSX(response, exportList, fileName, templateName);
        return resp;
    }
}
