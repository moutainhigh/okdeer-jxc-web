/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer
 * @Package: com.okdeer.jxc.controller.csrservice
 * @author songwj
 * @date 2017年11月28 09:32
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.csrservice;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Maps;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.csrservice.service.StoreCsrserviceService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

/**
 * @author songwj
 * @ClassName: CsrserviceConfigController
 * @Description: TODO
 * @project okdeer
 * @date 2017年11月28 09:32
 * =================================================================================================
 * Task ID            Date               Author           Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * V2.X          2017年11月28   songwj             TODO
 */
@RestController
@RequestMapping("service/config")
public class CsrserviceConfigController extends BaseController<CsrserviceConfigController> {

    @Reference(version = "1.0.0", check = false)
    private StoreCsrserviceService storeCsrserviceService;

    @Reference(version = "1.0.0", check = false)
    private BranchesServiceApi branchesService;


    @RequestMapping(value = "")
    public ModelAndView config() {
        Map<String, String> model = Maps.newHashMap();
        return new ModelAndView("csrservice/config/config", model);
    }

    @RequestMapping(value = "/csrservice")
    public RespJson getCsrservice(String branchId) {
        try {
            Branches branches = branchesService.getParentById(branchId);
            return RespJson.success(storeCsrserviceService.getStoreCsrservices(branches.getBranchId()));
        } catch (Exception e) {
            LOG.error("加载便民服务失败!", e);
            return RespJson.error("加载便民服务失败!");
        }
    }
}
