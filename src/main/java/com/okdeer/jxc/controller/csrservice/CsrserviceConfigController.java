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
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.google.common.collect.Maps;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.JsonMapper;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.csrservice.service.StoreCsrserviceService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;
import java.util.List;
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
            return RespJson.success(storeCsrserviceService.getStoreCsrservices(branchId, branches.getBranchId()));
        } catch (Exception e) {
            LOG.error("加载便民服务失败!", e);
            return RespJson.error("加载便民服务失败!");
        }
    }

    @RequestMapping(value = "/save/csrservice")
    public RespJson saveStoreCsrservice(String branchId, String data) {
        try {
            if (StringUtils.isBlank(branchId)) {
                return RespJson.error("请先选择门店,再进行保存!");
            }
            if (StringUtils.isNotBlank(data)) {
                TypeFactory typeFactory = JsonMapper.nonEmptyMapper().getMapper().getTypeFactory();
                JavaType type = typeFactory.constructCollectionType(List.class, Map.class);
                List<Map> datas = JsonMapper.nonEmptyMapper().fromJson(data, type);
                return storeCsrserviceService.saveStoreCsrservice(branchId, datas);
            }
            return storeCsrserviceService.saveStoreCsrservice(branchId, Collections.emptyList());
        } catch (Exception e) {
            LOG.error("保存便民服务失败!", e);
            return RespJson.error("保存便民服务失败!");
        }
    }
}
