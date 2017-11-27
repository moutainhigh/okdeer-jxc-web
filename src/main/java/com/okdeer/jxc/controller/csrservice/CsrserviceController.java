/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer
 * @Package: com.okdeer.jxc.controller.csrservice
 * @author songwj
 * @date 2017年11月23 16:01
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.csrservice;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.utils.entity.Tree;
import com.okdeer.jxc.controller.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;

/**
 * @author songwj
 * @ClassName: CsrserviceController
 * @Description: 便民服务项目维护
 * @project okdeer
 * @date 2017年11月23 16:01
 * =================================================================================================
 * Task ID            Date               Author           Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * V2.10         2017年11月23   songwj             TODO
 */
@RestController
@RequestMapping("service/item")
public class CsrserviceController extends BaseController<CsrserviceController> {

    @Reference(version = "1.0.0", check = false)
    private BranchesServiceApi branchesServiceApi;

    @RequestMapping(value = "")
    public ModelAndView list() {
        return new ModelAndView("/csrservice/item");
    }


    @RequestMapping(value = "tree")
    public Map<String, List<Tree>> getBranchAreaToTree() {
        Map<String, List<Tree>> maps = Maps.newHashMap();
        try {
            List<Branches> list = branchesServiceApi.getBranches();
            List<Tree> datas = Lists.newArrayList();

            list.stream().forEach(branches -> {
                Tree tree = new Tree();
                tree.setId(branches.getBranchesId());
                tree.setPid(branches.getParentId());
                tree.setCode(branches.getBranchCode());
                tree.setText(branches.getBranchName());
                datas.add(tree);
            });
            maps.put("datas", datas);
            //return branchesService.getBranchAndAreaToTree(super.getCurrBranchCompleCode());
        } catch (Exception e) {

            LOG.error("查询机构供应商区域树形结构异常:", e);
        }
        return maps;
    }
}
