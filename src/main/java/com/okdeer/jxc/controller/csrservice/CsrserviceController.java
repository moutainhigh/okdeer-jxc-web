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
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.enums.DisabledEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.UUIDHexGenerator;
import com.okdeer.jxc.common.utils.entity.Tree;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.csrservice.service.CsrserviceTypeService;
import com.okdeer.jxc.csrservice.vo.CsrserviceTypeVo;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;
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

    @Reference(version = "1.0.0", check = false)
    private CsrserviceTypeService csrserviceTypeService;

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
                List<CsrserviceTypeVo> csrserviceTypeVos = csrserviceTypeService.getlist(branches.getBranchesId());
                csrserviceTypeVos.stream().forEach(vo -> {
                    Tree tree1 = new Tree();
                    tree1.setId(vo.getId());
                    tree1.setPid(vo.getParentId());
                    tree1.setCode(vo.getTypeCode());
                    tree1.setText(vo.getTypeName());
                    datas.add(tree1);
                });
            });
            maps.put("datas", datas);
            //return branchesService.getBranchAndAreaToTree(super.getCurrBranchCompleCode());
        } catch (Exception e) {

            LOG.error("查询机构供应商区域树形结构异常:", e);
        }
        return maps;
    }
    
    @RequestMapping(value = "add/{branchId}/{pid}", method = RequestMethod.POST)
    public Map<String, String> add(@PathVariable("branchId") String branchId, @PathVariable("pid") String pid) {
        String uuid = UUIDHexGenerator.generate();
        CsrserviceTypeVo vo = new CsrserviceTypeVo();
        vo.setId(uuid);
        vo.setParentId(pid);
        vo.setBranchId(branchId);
        vo.setTypeCode(csrserviceTypeService.getTypeCode());
        vo.setLevel(1);
        vo.setCreateUserId(getCurrUserId());
        vo.setCreateTime(new Date());
        vo.setDisabled(DisabledEnum.NO.getIndex());
        vo.setTypeName("新增服务类型");
        csrserviceTypeService.save(vo);
        return ImmutableMap.of("id", uuid);
    }

    @RequestMapping(value = "update/{branchId}/{id}", method = RequestMethod.POST)
    public RespJson update(@PathVariable("branchId") String branchId, @PathVariable("id") String id, String typeName) {
        CsrserviceTypeVo vo = new CsrserviceTypeVo();
        vo.setId(id);
        vo.setTypeName(typeName);
        try {
            if (csrserviceTypeService.uniqueTypeName(branchId, typeName)) {
                csrserviceTypeService.update(vo);
                return RespJson.success();
            } else {
                return RespJson.error("服务类型名不能重复");
            }
        } catch (Exception e) {
            LOG.error("更新服务类型失败!", e);
            return RespJson.error("更新服务类型失败!");
        }
    }

    @RequestMapping(value = "del/{id}", method = RequestMethod.POST)
    public RespJson del(@PathVariable("id") String id) {
        try {
            boolean bool = csrserviceTypeService.del(id);
            if (bool) {
                return RespJson.success();
            } else {
                return RespJson.error("该服务类型下有服务项目，不能删除!");
            }
        } catch (Exception e) {
            LOG.error("删除服务类型失败!", e);
            return RespJson.error("删除服务类型失败!");
        }
    }
    
    
    
	@RequestMapping(value = "editService", method = RequestMethod.GET)
	public ModelAndView editService() {
		return new ModelAndView("/csrservice/editServiceDialog");
	}
}
