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
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.enums.DisabledEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.UUIDHexGenerator;
import com.okdeer.jxc.common.utils.entity.Tree;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.csrservice.service.CsrserviceTypeService;
import com.okdeer.jxc.csrservice.vo.CsrserviceTypeVo;
import com.okdeer.jxc.csrservice.vo.CsrserviceVo;
import org.apache.commons.lang3.RandomUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
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

            if (getCurrBranchId().equals("0")) {//总部
                list.stream().forEach(branches -> {
                    createTrees(datas, branches);
                });
            } else {//分公司
                list.parallelStream().forEach(branches -> {
                    if (getCurrBranchId().equals(branches.getBranchId())) {
                        createTrees(datas, branches);
                    }
                });
            }
            maps.put("datas", datas);
            //return branchesService.getBranchAndAreaToTree(super.getCurrBranchCompleCode());
        } catch (Exception e) {

            LOG.error("查询机构供应商区域树形结构异常:", e);
        }
        return maps;
    }

    private void createTrees(List<Tree> datas, Branches branches) {
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
    }

    @RequestMapping(value = "add/{branchId}/{pid}", method = RequestMethod.POST)
    public Map<String, String> add(@PathVariable("branchId") String branchId, @PathVariable("pid") String pid) {
        Map<String, String> map = Maps.newHashMap();
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
        vo.setTypeName("新增服务类型" + RandomUtils.nextInt(1, 1000));
        csrserviceTypeService.save(vo);
        map.put("id", uuid);
        map.put("name", vo.getTypeName());
        return map;
    }

    @RequestMapping(value = "update/{branchId}/{id}", method = RequestMethod.POST)
    public RespJson update(@PathVariable("branchId") String branchId, @PathVariable("id") String id, String typeName) {
        CsrserviceTypeVo vo = new CsrserviceTypeVo();
        vo.setId(id);
        vo.setTypeName(typeName);
        try {
            if (csrserviceTypeService.uniqueTypeName(branchId, typeName, id)) {
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
                return RespJson.error("该服务类型下有服务项目或者已被门店关联，不能删除!");
            }
        } catch (Exception e) {
            LOG.error("删除服务类型失败!", e);
            return RespJson.error("删除服务类型失败!");
        }
    }
    
	@RequestMapping(value = "editService", method = RequestMethod.GET)
	public ModelAndView editService() {
        return new ModelAndView("/csrservice/editServiceDialog", ImmutableMap.of("code", csrserviceTypeService.getCsrserviceCode()));
    }


    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public PageUtils<CsrserviceVo> getReportList(CsrserviceVo vo,
                                                 @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
                                                 @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            if (org.apache.commons.lang3.StringUtils.isBlank(vo.getTypeId())) {
                vo.setTypeId(getCurrBranchId());
            }
            PageUtils<CsrserviceVo> list = csrserviceTypeService.getCsrserviceVoList(vo, pageSize, pageNumber);
            return list;
        } catch (Exception e) {
            LOG.error("查詢服務項目異常!", e);
            return PageUtils.emptyPage();
        }
    }


    @RequestMapping(value = "/del/csrservice", method = RequestMethod.POST)
    public RespJson delete(String[] ids) {
        try {
            if (ids != null && ids.length > 0) {
                return csrserviceTypeService.delCsrservice(Arrays.asList(ids));
            }
            return RespJson.success();
        } catch (Exception e) {
            LOG.error("删除服务项目失败!", e);
            return RespJson.error("删除服务项目失败！");
        }
    }

    @RequestMapping(value = "/edit/csrservice", method = RequestMethod.POST)
    public RespJson edit(CsrserviceVo csrserviceVo, HttpServletResponse response) {

        try {
            if (csrserviceTypeService.uniqueCsrserviceTypeName(csrserviceVo.getTypeId(), csrserviceVo.getCsrserviceName(), csrserviceVo.getId())) {
                csrserviceVo.setUpdateTime(new Date());
                csrserviceVo.setUpdateUserId(getCurrUserId());
                csrserviceTypeService.updateCsrservice(csrserviceVo);
                return RespJson.success();
            } else {
                return RespJson.error("服务类型名称不能重复!");
            }
        } catch (Exception e) {
            LOG.error("更新服务项目失败!", e);
            return RespJson.error("更新服务项目失败！");
        }
    }

    @RequestMapping(value = "/save/csrservice", method = RequestMethod.POST)
    public RespJson save(CsrserviceVo csrserviceVo) {

        try {
            if (csrserviceTypeService.uniqueCsrserviceTypeName(csrserviceVo.getTypeId(), csrserviceVo.getCsrserviceName(), null)) {
                csrserviceVo.setId(UUIDHexGenerator.generate());
                csrserviceVo.setCreateTime(new Date());
                csrserviceVo.setCreateUserId(getCurrUserId());
                csrserviceVo.setDisabled(DisabledEnum.NO.getIndex());
                //if(StringUtils.isBlank(csrserviceVo.getCsrserviceCode())) {
                csrserviceVo.setCsrserviceCode(csrserviceTypeService.getCsrserviceCode());
                //}
                csrserviceTypeService.saveCsrservice(csrserviceVo);
                return RespJson.success();
            } else {
                return RespJson.error("服务类型名称不能重复!");
            }
        } catch (Exception e) {
            LOG.error("新增服务项目失败!");
            return RespJson.error("新增服务项目失败!");
        }
    }


    @RequestMapping(value = "export", method = RequestMethod.POST)
    public RespJson exportHandel(CsrserviceVo vo, HttpServletResponse response) {
        try {
        	if (org.apache.commons.lang3.StringUtils.isBlank(vo.getTypeId())) {
        		vo.setTypeId(getCurrBranchId());
        	}
            LOG.debug("导出服务项目条件：{}", vo);
            List<CsrserviceVo> list = csrserviceTypeService.getCsrserviceVoList(vo);

            RespJson respJson = super.validateExportList(list);
            if (!respJson.isSuccess()) {
                LOG.info(respJson.getMessage());
                return respJson;
            }

            // 导出文件名称，不包括后缀名
            String fileName = "服务项目列表_" + DateUtils.getCurrSmallStr();

            // 模板名称，包括后缀名
            String templateName = ExportExcelConstant.CSRSERVICE_TYPE_EXPORT_TEMPLATE;

            // 导出Excel
            exportListForXLSX(response, list, fileName, templateName);
            return null;

        } catch (Exception e) {
            LOG.error("导出财务代码失败", e);
        }
        return RespJson.error();
    }
}
