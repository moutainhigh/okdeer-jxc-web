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
import com.alibaba.fastjson.JSON;
import com.google.common.collect.Maps;
import com.okdeer.jxc.common.enums.AuditStatusEnum;
import com.okdeer.jxc.common.enums.DisabledEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.pos.service.PosAdServiceApi;
import com.okdeer.jxc.pos.vo.PosAdFormDetailVo;
import com.okdeer.jxc.pos.vo.PosAdFormVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
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
@RequestMapping("pos/ad/form")
public class PosAdFormController extends BaseController<PosAdFormController> {

    @Reference(version = "1.0.0", check = false)
    private PosAdServiceApi posAdServiceApi;

    /**
     * @Fields uploadToken : 文件上传命名空间
     */
    @Value("${fileUploadToken}")
    private String uploadToken;

    /**
     * @Fields filePrefix : 七牛文件路径前缀
     */
    @Value("${filePrefix}")
    private String filePrefix;

    @RequestMapping(value = "/list")
    public ModelAndView list() {
        Map<String, String> model = Maps.newHashMap();
        return new ModelAndView("sale/pos/ad/adlist", model);
    }

    @RequestMapping(value = "/add")
    public ModelAndView add() {
        Map<String, String> model = Maps.newHashMap();
        return new ModelAndView("sale/pos/ad/addAd", model);
    }

    @RequestMapping(value = "edit/{id}")
    public ModelAndView edit(@PathVariable(value = "id") String id) {
        Map<String, Object> model = Maps.newHashMap();
        model.put("form", posAdServiceApi.getPosAdByFormId(id));

        List<PosAdFormDetailVo> posGroupKeys = posAdServiceApi.getPosAdDetailList(id);
        for (int i = 0, length = posGroupKeys.size(); i < length; ++i) {
            PosAdFormDetailVo vo = posGroupKeys.get(i);
            if(StringUtils.isNotBlank(vo.getPicUrl())) {
                vo.setPicUrl(filePrefix + "/" + vo.getPicUrl());
            }
            posGroupKeys.set(i, vo);
        }
        model.put("detail", posGroupKeys);
        return new ModelAndView("sale/pos/ad/editAd", model);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public PageUtils<PosAdFormVo> list(PosAdFormVo vo,
                                       @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
                                       @RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
        try {
            vo.setPageNumber(pageNumber);
            vo.setPageSize(pageSize);
            if(StringUtils.isBlank(vo.getCreateUserId())){
                vo.setCreateUserId(getCurrUserId());
            }
            PageUtils<PosAdFormVo> posWheelsurfFormVoPageUtils = this.posAdServiceApi.getPosAdList(vo);
            //return RespJson.success(posWheelsurfFormVoPageUtils);
            return posWheelsurfFormVoPageUtils;
        } catch (Exception e) {
            LOG.error("获取POS客屏广告列表失败!", e);
            //return RespJson.error("获取POS客屏活动列表失败!" );
        }
        return PageUtils.emptyPage();
    }

    @RequestMapping(value = "/del", method = RequestMethod.POST)
    public RespJson del(@RequestParam(value = "ids[]") String[] ids) {
        try {
            boolean bool = Boolean.FALSE;
            for (String id : ids) {
                PosAdFormVo vo = posAdServiceApi.getPosAdByFormId(id);
                if (AuditStatusEnum.AUDIT.getCode().equals(vo.getAuditStatus()) || AuditStatusEnum.OVER.getCode().equals(vo.getAuditStatus())) {
                    bool = Boolean.TRUE;
                    break;
                }
            }
            if (bool) {
                return RespJson.error("刪除的数据包含已审核或已终止的单据,请刷新再删除!");
            } else {
                posAdServiceApi.delPosAdFormAndDetail(ids);
                return RespJson.success();
            }
        } catch (Exception e) {
            LOG.error("删除POS客屏广告失败!", e);
            return RespJson.error("删除POS客屏广告失败!");
        }
    }

    @RequestMapping(value = "/over", method = RequestMethod.POST)
    public RespJson over(String formId) {
        try {
            PosAdFormVo vo = posAdServiceApi.getPosAdByFormId(formId);
            if (vo.getDisabled() == DisabledEnum.YES.getIndex()) {
                return RespJson.error("该POS客屏广告已被删除,无法终止!");
            } else if (AuditStatusEnum.UNAUDIT.getCode().equals(vo.getAuditStatus())) {
                return RespJson.error("该POS客屏广告未审核,无法终止!");
            } else {
                vo = new PosAdFormVo();
                vo.setId(formId);
                vo.setAuditStatus(AuditStatusEnum.OVER.getCode());
                vo.setAuditTime(new Date());
                vo.setAuditUserId(getCurrUserId());
                posAdServiceApi.updatePosAdForm(vo);
                return RespJson.success();
            }
        } catch (Exception e) {
            LOG.error("终止POS客屏广告失败!", e);
            return RespJson.error("终止POS客屏广告失败!");
        }
    }

    @RequestMapping(value = "/audit", method = RequestMethod.POST)
    public RespJson audit(String formId) {
        try {
            PosAdFormVo vo = posAdServiceApi.getPosAdByFormId(formId);
            if (vo.getDisabled() == DisabledEnum.YES.getIndex()) {
                return RespJson.error("该POS客屏广告已被删除,无法审核!");
            } else if (AuditStatusEnum.OVER.getCode().equals(vo.getAuditStatus())) {
                return RespJson.error("该POS客屏广告已终止,无需审核!");
            } else {
                vo = new PosAdFormVo();
                vo.setId(formId);
                vo.setAuditStatus(AuditStatusEnum.AUDIT.getCode());
                vo.setAuditTime(new Date());
                vo.setAuditUserId(getCurrUserId());
                posAdServiceApi.updatePosAdForm(vo);
                return RespJson.success();
            }
        } catch (Exception e) {
            LOG.error("审核POS客屏广告失败!", e);
            return RespJson.error("审核POS客屏广告失败!");
        }
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public RespJson save(HttpServletRequest request, String mainImg, @RequestParam(value = "imgs[]") String[] imgs) {
        try {
            PosAdFormVo vo = JSON.parseObject(request.getParameter("formObj"), PosAdFormVo.class);
            vo.setBranchCode(getCurrBranchCode());
            vo.setCreateUserId(getCurrUserId());
            vo.setCreateUserName(getCurrentUser().getUserName());
            vo.setMainImg(StringUtils.replace(mainImg, filePrefix + "/", ""));
            if (imgs != null && imgs.length > 0) {
                String[] datas = new String[imgs.length];
                for (int i = 0; i < imgs.length; ++i) {
                    if(StringUtils.contains(imgs[i],"addImg.png")){
                        datas[i] = "";
                    }else {
                        datas[i] = StringUtils.replace(imgs[i], filePrefix + "/", "");
                    }
                }
                vo.setImgs(datas);
            }
            String id = posAdServiceApi.insertPosAdFormAndDetail(vo);
            return RespJson.success(new HashMap<String, String>() {
                {
                    put("id", id);
                }
            });
        } catch (Exception e) {
            LOG.error("保存POS客屏广告失败!", e);
            return RespJson.error("保存POS客屏广告失败!");
        }
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public RespJson update(HttpServletRequest request, String mainImg, @RequestParam(value = "imgs[]") String[] imgs) {
        try {

            PosAdFormVo vo = JSON.parseObject(request.getParameter("formObj"), PosAdFormVo.class);
            vo.setUpdateTime(new Date());
            vo.setUpdateUserId(getCurrUserId());
            vo.setMainImg(StringUtils.replace(mainImg, filePrefix + "/", ""));
            if (imgs != null && imgs.length > 0) {
                String[] datas = new String[imgs.length];
                for (int i = 0; i < imgs.length; ++i) {
                    if(StringUtils.contains(imgs[i],"addImg.png")){
                        datas[i] = "";
                    }else {
                        datas[i] = StringUtils.replace(imgs[i], filePrefix + "/", "");
                    }
                }
                vo.setImgs(datas);
            }
            posAdServiceApi.updatePosAdFormAndDetail(vo);
            return RespJson.success();
        } catch (Exception e) {
            LOG.error("保存POS客屏广告失败!", e);
            return RespJson.error("保存POS客屏广告失败!");
        }
    }

}
