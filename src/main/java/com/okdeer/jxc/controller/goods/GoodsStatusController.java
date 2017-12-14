/** 
 *@Project: okdeer-jxc-web 
 *@Author: liux01
 *@Date: 2017年3月6日 
 *@Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.goods;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.qo.GoodsStatusQo;
import com.okdeer.jxc.goods.service.GoodsStatusService;
import com.okdeer.jxc.goods.vo.GoodsStatusVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

import net.sf.json.JSONObject;


/**
 * ClassName: GoodsStatusController 
 * @Description: 商品状态查询管理
 * @author liux01
 * @date 2017年3月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    V2.3版本                                       2017-3-6           liux01            商品状态查询管理
 */
@Controller
@RequestMapping("goods/status")
public class GoodsStatusController extends BaseController<GoodsStatusController> {

	@Reference(version = "1.0.0", check = false)
    private GoodsStatusService goodsStatusService;
	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;
	/**
	 * 
	 * @Description: 商品状态列表
	 * @return
	 * @author liux01
	 * @date 2017年3月6日
	 */
	@RequestMapping(value = "list")
	public String list(Model model) {
		model.addAttribute("branchId", UserUtil.getCurrBranchId());
		model.addAttribute("branchCode", UserUtil.getCurrBranchCompleCode());
		model.addAttribute("branchName", "["+UserUtil.getCurrBranchCode()+"]"+UserUtil.getCurrentUser().getBranchName());
		model.addAttribute("branchType", UserUtil.getCurrBranchType());
		return "goods/goodsStatus/goodsStatusList";
	}
	/**
	 * 
	 * @Description: 获取商品状态列表
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author liux01
	 * @date 2017年3月6日
	 */
	@RequestMapping(value = "getGoodsStatusList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsStatusVo> getGoodsStatusList(
			GoodsStatusQo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			PageUtils<GoodsStatusVo> list = goodsStatusService.getGoodsStatusList(vo);
			// 过滤数据权限字段
			cleanAccessData(list);
			return list;
		} catch (Exception e) {
			LOG.error("获取滞销信息列表信息异常:{}", e);
		}
		return null;
	}
	/**
	 * 
	 * @Description: 淘汰向导查询
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author liux01
	 * @date 2017年3月9日
	 */
	@RequestMapping(value = "getOutGuideList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsStatusVo> getOutGuideList(
			GoodsStatusQo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			if(StringUtils.isBlank(vo.getBranchCompleCode())){
				vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			}
			if(vo.getGuideType() == null){
			    vo.setGuideType(0);
			}
			PageUtils<GoodsStatusVo> list = goodsStatusService.getOutGuideList(vo);
			// 过滤数据权限字段
			cleanAccessData(list);
			return list;
		} catch (Exception e) {
			LOG.error("获取滞销信息列表信息异常:{}", e);
		}
		return null;
	}
	/**
	 * 
	 * @Description: 停购向导查询
	 * @param vo
	 * @param pageNumber  当前页
	 * @param pageSize 每页显示数
	 * @return
	 * @author liux01
	 * @date 2017年3月13日
	 */
	@RequestMapping(value = "getStopGuideList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsStatusVo> getStopGuideList(
			GoodsStatusQo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			if(com.okdeer.jxc.common.utils.StringUtils.isBlank(vo.getBranchCompleCode())){
				vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			}
			if(vo.getGuideType() == null){
                vo.setGuideType(0);
            }
			PageUtils<GoodsStatusVo> list = goodsStatusService.getStopGuideList(vo);
			cleanAccessData(list);
			return list;
		} catch (Exception e) {
			LOG.error("获取滞销信息列表信息异常:{}", e);
		}
		return null;
	}
	/**
	 * 
	 * @Description: 货号条码导入
	 * @param file
	 * @param branchId
	 * @param type
	 * @return
	 * @author liux01
	 * @date 2017年3月6日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String branchId, String type,String status) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}
			if(StringUtils.isBlank(status)){
				return RespJson.error("商品状态为空");
			}
			InputStream is = file.getInputStream();
			// 获取文件名
			String fileName = file.getOriginalFilename();
			SysUser user = UserUtil.getCurrentUser();
			String[] field = null;
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
				field = new String[] {"skuCode"};
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
				field = new String[] {"barCode"};
			}
			Map<String,String> map = new HashMap<String,String>();
			map.put("status", status);
			map.put("formType", FormType.GS.toString());
			GoodsSelectImportVo<GoodsSelect> vo = goodsSelectImportComponent.importSelectGoodsWithStock(
					fileName, is, field, new GoodsSelect(), branchId, user.getId(), type,
					"/goods/status/downloadErrorFile", new GoodsSelectImportBusinessValid() {
						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {
							
						}

						/**
						 * (non-Javadoc)
						 * @see com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid#formatter(java.util.List)
						 */
						@Override
						public void formatter(List<? extends GoodsSelect> list, List<JSONObject> excelListSuccessData,
								List<JSONObject> excelListErrorData) {
						}

						/**
						 * (non-Javadoc)
						 * @see com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid#errorDataFormatter(java.util.List)
						 */
						@Override
						public void errorDataFormatter(List<JSONObject> list) {

						}
					},map);
			respJson.put("importInfo", vo);
        } catch (BusinessException e) {
            respJson = RespJson.error(e.getMessage());
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常:", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("用户导入异常:", e);
		}
		return respJson;

	}
	
	/**
	 * 
	 * @Description: 导出异常信息
	 * @param code
	 * @param type
	 * @param response
	 * @author liux01
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "downloadErrorFile")
	public void downloadErrorFile(String code, String type, HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = null;
		String[] columns = null;

		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
			columns = new String[] { "skuCode"};
			headers = new String[] { "货号"};
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
			columns = new String[] { "barCode"};
			headers = new String[] { "条码"};
		}
		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}
	/**
	 * 
	 * @Description: 导入模板
	 * @param response
	 * @param type
	 * @author liux01
	 * @date 2017年3月6日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, String type) {
		try {
			// 导出文件名称，不包括后缀名
			String fileName = null;
			String templateName = null;
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
				fileName = "商品状态货号导入模板";
				templateName = ExportExcelConstant.GOODS_STATUS_SKU_TEMPLE;
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
				templateName = ExportExcelConstant.GOODS_STATUS_BAR_TEMPLE;
				fileName = "商品状态条码导入模板";
			}
			// 导出Excel
			exportListForXLSX(response, null, fileName, templateName);
		} catch (Exception e) {
			LOG.error("商品状态条码导入失败:{}", e);
		}
	}
	/**
	 * 
	 * @Description: 更新店铺商品状态
	 * @param ids 店铺商品ID集合
	 * @param type 操作类型（0：停售 1：停购 2：淘汰，3：恢复）
	 * @return
	 * @author liux01
	 * @date 2017年3月6日
	 */
	@RequestMapping(value = "updateGoodsStatus")
	@ResponseBody
	public RespJson updateGoodsStatus(String ids,Integer type,String branchId){
		RespJson respJson = RespJson.success();
		try {
			if(StringUtils.isBlank(ids)){
				return RespJson.error("未选择店铺商品");
			}
			String[] idArray = ids.split(",");
			return goodsStatusService.updateGoodsStatus(Arrays.asList(idArray), type, branchId, super.getCurrUserId());
		} catch (Exception e) {
			respJson = RespJson.error("更新店铺商品状态异常");
			LOG.error("更新店铺商品状态异常:", e);
		}
		return respJson;
		
	}
}
