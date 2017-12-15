/**
 * @Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 * @project okdeer
 * @Package: com.okdeer.jxc.controller.sale
 * @author songwj
 * @date 2017年08月16 18:37
 * 注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.okdeer.jxc.controller.sale;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Maps;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.JsonMapper;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.pos.service.PosGroupKeyService;
import com.okdeer.jxc.pos.vo.PosGroupKeyDetailVo;
import com.okdeer.jxc.pos.vo.PosGroupKeyVo;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author songwj
 * @ClassName: PosAdFormController
 * @Description: TODO
 * @project okdeer
 * @date 2017年08月16 18:37
 * =================================================================================================
 * Task ID            Date               Author           Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * V2.8          2017年08月16   songwj             TODO
 */
@RestController
@RequestMapping("pos/group/key")
public class PosGroupKeyController extends BaseController<PosGroupKeyController> {

    @Reference(version = "1.0.0", check = false)
    PosGroupKeyService posGroupKeyService;

    @RequestMapping(value = "/list")
    public ModelAndView list() {
        Map<String, String> model = Maps.newHashMap();
        return new ModelAndView("sale/pos/group/keylist", model);
    }

    @RequestMapping(value = "/addGroup/{branchId}", method = RequestMethod.GET)
    public ModelAndView addGroup(@PathVariable(value = "branchId") String branchId) {
        String groupCode = posGroupKeyService.getGroupCode(branchId);
        Map<String, String> model = Maps.newHashMap();
        model.put("groupCode", groupCode);
        model.put("branchId", branchId);
        return new ModelAndView("sale/pos/group/addGroup", model);
    }

    @RequestMapping(value = "/editGroup", method = RequestMethod.GET)
    public ModelAndView editGroup() {
        return new ModelAndView("sale/pos/group/editGroup");
    }

    @RequestMapping(value = "/save/group", method = RequestMethod.POST)
    public RespJson saveGroup(PosGroupKeyVo posGroupKey) {
        try {
            if (posGroupKeyService.verification(posGroupKey)) {
                return RespJson.error("分组名称和排序不能重复!");
            } else {
                posGroupKeyService.savePosGroupKey(posGroupKey);
                return RespJson.success();
            }
        } catch (Exception e) {
            LOG.error("保存分组失败!", e);
            return RespJson.error("保存分组失败!");
        }
    }

    @RequestMapping(value = "/save/groups", method = RequestMethod.POST)
    public RespJson saveGroups(String jsontext, String branchId) {

        try {
            List<PosGroupKeyVo> posGroupKeys = JsonMapper.nonDefaultMapper().fromJson(jsontext, JsonMapper.nonDefaultMapper().contructCollectionType(ArrayList.class, PosGroupKeyVo.class));
            if (CollectionUtils.isNotEmpty(posGroupKeys)) {
                posGroupKeyService.savePosGroupKeys(posGroupKeys, branchId);
                return RespJson.success();
            } else {
                return RespJson.error("保存分组失败!");
            }
        } catch (Exception e) {
            LOG.error("保存分组失败!", e);
            return RespJson.error("保存分组失败!");
        }
    }

    @RequestMapping(value = "/del/group/{id}", method = RequestMethod.POST)
    public RespJson delGroup(@PathVariable(value = "id") String id) {
        try {
            posGroupKeyService.deletePosGroupKey(id);
            return RespJson.success();
        } catch (Exception e) {
            LOG.error("删除分组失败!", e);
            return RespJson.error("删除分组失败!");
        }
    }

    @RequestMapping(value = "/update/{branchId}", method = RequestMethod.POST)
    public RespJson updateGroup(@PathVariable(value = "branchId") String branchId, PosGroupKeyVo posGroupKey) {
        try {
            posGroupKey.setBranchId(branchId);
            if (posGroupKeyService.verification(posGroupKey)) {
                return RespJson.error("分组名称和排序不能重复!");
            } else {
                posGroupKeyService.updatePosGroupKey(posGroupKey);
                return RespJson.success();
            }
        } catch (Exception e) {
            LOG.error("更新分组失败!", e);
            return RespJson.error("更新分组失败!");
        }
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public PageUtils<PosGroupKeyVo> list(String branchId,
                         @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
                         @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            PageUtils<PosGroupKeyVo> posGroupKeyList = this.posGroupKeyService.getPosGroupKeyList(branchId, pageSize, pageNumber);
            return posGroupKeyList;
        } catch (Exception e) {
            LOG.error("获取分组列表失败!", e);
            return PageUtils.emptyPage();
        }
    }

    @RequestMapping(value = "/copy", method = RequestMethod.POST)
    public RespJson copy(String sourceBranchId, String targetBranchId) {
        try {
            List<PosGroupKeyVo> datas = this.posGroupKeyService.copy(sourceBranchId, targetBranchId);
            return RespJson.success(datas);
        } catch (Exception e) {
            LOG.error("获取分组列表失败!", e);
            return RespJson.error("获取分组列表失败!");
        }
    }

    @RequestMapping(value = "/goods/top/list", method = RequestMethod.POST)
    public PageUtils<PosGroupKeyDetailVo> goodsTopList(String branchId, String groupId,
                                 @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
                                 @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            PageUtils<PosGroupKeyDetailVo> posGroupKeyList = this.posGroupKeyService.selectPosGroupKeyDetailList(branchId, groupId, true, pageSize, pageNumber);
            return posGroupKeyList;
        } catch (Exception e) {
            LOG.error("获取分组列表失败!", e);
            return PageUtils.emptyPage();
        }
    }

    @RequestMapping(value = "/goods/list", method = RequestMethod.POST)
    public PageUtils<PosGroupKeyDetailVo> goodsList(String branchId, String groupId,
                              @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
                              @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            PageUtils<PosGroupKeyDetailVo> posGroupKeyList = this.posGroupKeyService.selectPosGroupKeyDetailList(branchId, groupId, false, pageSize, pageNumber);
            return posGroupKeyList;
        } catch (Exception e) {
            LOG.error("获取分组列表失败!", e);
            return PageUtils.emptyPage();
        }
    }

    @RequestMapping(value = "/save/goods", method = RequestMethod.POST)
    public RespJson saveGoods(HttpServletRequest request, String groupId) {
        try {
            List<PosGroupKeyDetailVo> posGroupKeys = JsonMapper.nonDefaultMapper().fromJson(request.getParameter("jsontext"), JsonMapper.nonDefaultMapper().contructCollectionType(ArrayList.class, PosGroupKeyDetailVo.class));
            for (int i = 0, length = posGroupKeys.size(); i < length; ++i) {
                PosGroupKeyDetailVo vo = posGroupKeys.get(i);
                vo.setGroupId(groupId);
                vo.setCreateTime(new Date());
                vo.setCreateUserId(getCurrUserId());
                posGroupKeys.set(i, vo);
            }
            posGroupKeyService.savePosGroupKeyDetails(posGroupKeys);
            return RespJson.success();
        } catch (Exception e) {
            LOG.error("保存分组商品失败!", e);
            return RespJson.error("保存分组商品失败!");
        }
    }

}
