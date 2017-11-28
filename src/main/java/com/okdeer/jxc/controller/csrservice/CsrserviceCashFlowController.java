/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer
 * @Package: com.okdeer.jxc.controller.csrservice
 * @author songwj
 * @date 2017年11月28 09:31
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.csrservice;

import com.google.common.collect.Maps;
import com.okdeer.jxc.controller.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

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

    @RequestMapping(value = "")
    public ModelAndView config() {
        Map<String, String> model = Maps.newHashMap();
        return new ModelAndView("csrservice/cash/flow", model);
    }
}
