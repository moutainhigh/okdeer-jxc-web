/** 
 *@Project: okdeer-jxc-web 
 *@Author: liux01
 *@Date: 2016年10月11日 
 *@Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.stock;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.enums.StockAdjustEnum;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByStockAdjust;
import com.okdeer.jxc.stock.service.StockAdjustServiceApi;
import com.okdeer.jxc.stock.vo.StockFormDetailVo;
import com.okdeer.jxc.stock.vo.StockFormVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: StockAdjustController 
 * @Description: 商品库存调整
 * @author liux01
 * @date 2016年10月11日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    零售管理系统		    2016年10月11日		liux01				商品库存调整
 */
@Controller
@RequestMapping("/stock/adjust")
public class StockAdjustController extends BaseController<StockAdjustController> {

	@Reference(version = "1.0.0", check = false)
	private StockAdjustServiceApi stockAdjustServiceApi;

	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	/**
	 * 
	 * @Description: 获取库存调整列表页面
	 * @return
	 * @author liux01
	 * @date 2016年10月11日
	 */
	@RequestMapping(value = "/list")
	public String list() {
		return "/stockAdjust/list";
	}

	/**
	 * 
	 * @Description: 获取库存调整新增页面
	 * @return
	 * @author liux01
	 * @date 2016年10月11日
	 */
	@RequestMapping(value = "/add")
	public String add() {
		return "/stockAdjust/add";
	}

	/**
	 * 
	 * @Description: 获取库存调整编辑页面
	 * @return
	 * @author liux01
	 * @date 2016年10月11日
	 */
	@RequestMapping(value = "/edit", method = RequestMethod.GET)
	public String edit(String id, HttpServletRequest request) {
		StockFormVo stockFormVo = stockAdjustServiceApi.getStcokFormInfo(id);
		request.setAttribute("stockFormVo", stockFormVo);
		if (FormStatus.CHECK_SUCCESS.getValue().equals(stockFormVo.getStatus())) {
		    return "/stockAdjust/check";
        }
		return "/stockAdjust/edit";
	}

	/**
	 * 
	 * @Description: 审核通过跳转页面
	 * @param id
	 * @param request
	 * @return
	 * @author liux01
	 * @date 2016年10月18日
	 */
	@RequestMapping(value = "/checkSuccess", method = RequestMethod.GET)
	public String checkSuccess(String id, String report, HttpServletRequest request) {
		StockFormVo stockFormVo = stockAdjustServiceApi.getStcokFormInfo(id);
		request.setAttribute("stockFormVo", stockFormVo);
		request.setAttribute("close", report);
		return "/stockAdjust/check";
	}

	/**
	 * 
	 * @Description: 获取单据列表信息
	 * @param vo  库存调整对象
	 * @param pageNumber  当前页数
	 * @param pageSize 每页显示数
	 * @return
	 * @author liux01
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "getStockFormList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<StockFormVo> getStockFormList(StockFormVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.debug(LogConstant.OUT_PARAM, vo);
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			//调整类型
			vo.setFormType(StockAdjustEnum.ADJUST.getKey());
			PageUtils<StockFormVo> stockFormList = stockAdjustServiceApi.getStockFormList(vo);
			// 过滤数据权限字段
			cleanAccessData(stockFormList);
			LOG.debug(LogConstant.PAGE, stockFormList);
			return stockFormList;
		} catch (Exception e) {
			LOG.error("获取单据列表信息异常:{}", e);
		}
		return null;
	}

	/**
	 * 
	 * @Description: 保存库存调整单据
	 * @param vo  库存调整对象
	 * @param pageNumber  当前页数
	 * @param pageSize 每页显示数
	 * @return
	 * @author liux01
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "addStockForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addStcokForm(@RequestBody String jsonText) {
		RespJson resp;
		try {
			StockFormVo vo = JSON.parseObject(jsonText, StockFormVo.class);
			SysUser user = UserUtil.getCurrentUser();
			vo.setCreateUserId(user.getId());
			vo.setFormType(StockAdjustEnum.ADJUST.getKey());
			return stockAdjustServiceApi.addStockForm(vo);
		} catch (Exception e) {
			LOG.error("保存单据信息异常:{}", e);
			resp = RespJson.error("保存单据信息失败");
		}
		return resp;

	}

	/**
	 * 
	 * @Description: 更新信息
	 * @param vo 库存调整实体对象
	 * @return
	 * @author liux01
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "updateStockForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateStockForm(@RequestBody String jsonText) {
		RespJson resp;
		try {
			StockFormVo vo = JSON.parseObject(jsonText, StockFormVo.class);
			SysUser user = UserUtil.getCurrentUser();
			vo.setCreateUserId(user.getId());
			return stockAdjustServiceApi.updateStockForm(vo);
		} catch (Exception e) {
			LOG.error("更新单据信息异常:{}", e);
			resp = RespJson.error("更新单据信息失败");
		}
		return resp;

	}

	/**
	 * 
	 * @Description: 获取库存调整明细信息
	 * @param id 库存调整主键ID
	 * @return
	 * @author liux01
	 * @date 2016年11月4日
	 */
	@RequestMapping(value = "getStockFormDetailList", method = RequestMethod.GET)
	@ResponseBody
	public List<StockFormDetailVo> getStockFormDetailList(String id) {
		LOG.debug(LogConstant.OUT_PARAM, id);
		try {
			return stockAdjustServiceApi.getStcokFormDetailList(id);
		} catch (Exception e) {
			LOG.error("获取单据信息异常:{}", e);
		}
		return null;
	}

	/**
	 * 
	 * @Description: 审核单据信息
	 * @param ID  库存调整主键ID
	 * @return
	 * @author liux01
	 * @date 2016年10月14日
	 */
	@RequestMapping(value = "check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(String id) {
		RespJson resp;
		try {
			SysUser user = UserUtil.getCurrentUser();
			return stockAdjustServiceApi.check(id, user.getId());
		} catch (Exception e) {
			LOG.error("审核单据信息异常:{}", e);
			resp = RespJson.error(e.getMessage());
		}
		return resp;
	}

	/**
	 * 
	 * @Description: 删除库存调整信息
	 * @param id 库存调整主键ID
	 * @return
	 * @author liux01
	 * @date 2016年10月14日
	 */
	@RequestMapping(value = "deleteStockAdjust", method = RequestMethod.POST)
	@ResponseBody
	public RespJson deleteStockAdjust(String id) {
		RespJson resp;
		try {
			return stockAdjustServiceApi.deleteStockAdjust(id);
		} catch (Exception e) {
			LOG.error("删除单据信息异常:{}", e);
			resp = RespJson.error("删除单据信息失败");
		}
		return resp;
	}

	/**
	 * 
	 * @Description: 导出
	 * @param response
	 * @param qo
	 * @return
	 * @author liux01
	 * @date 2016年10月14日
	 */
	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, StockFormVo vo) {

		RespJson resp = RespJson.success();
		try {
			List<StockFormDetailVo> exportList = stockAdjustServiceApi.exportList(vo);
			// 过滤数据权限字段
            cleanAccessData(exportList);
			String fileName = "库存调整" + "_" + DateUtils.getCurrSmallStr();

			String templateName = ExportExcelConstant.STOCKADJUST;

			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("导出库存调整商品异常：{}", e);
			resp = RespJson.error("导出库存调整商品异常");
		}
		return resp;
	}

	/**
	 * 
	 * @Description: 文件导入
	 * @param file 文件
	 * @param branchId  机构ID
	 * @param type 类型
	 * @return
	 * @author liux01
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String branchId, String type) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}
			InputStream is = file.getInputStream();
			// 获取文件名
			String fileName = file.getOriginalFilename();
			SysUser user = UserUtil.getCurrentUser();
			String[] field = null;
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
				field = new String[] { "skuCode", "realNum", "largeNum" };
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
				field = new String[] { "barCode", "realNum", "largeNum" };
			}
			GoodsSelectImportVo<GoodsSelectByStockAdjust> vo = goodsSelectImportComponent.importSelectGoodsWithStock(
					fileName, is, field, new GoodsSelectByStockAdjust(), branchId, user.getId(), type,
					"/stock/adjust/downloadErrorFile", new GoodsSelectImportBusinessValid() {

						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {
							for (JSONObject obj : excelListSuccessData) {
								/*if (obj.get("realNum") != null) {
									String realNum = obj.getString("realNum");
									try {
										Double.parseDouble(realNum);
										if (obj.get("realNum") != null && BigDecimal.ZERO
												.compareTo(new BigDecimal(obj.getString("realNum"))) == 0) {
											obj.element("error", "数量不能为0");
										}
									} catch (Exception e) {
										obj.element("error", "数量必填");
									}
								}
								if (obj.get("largeNum") != null) {
									String largeNum = obj.getString("largeNum");
									try {
										Double.parseDouble(largeNum);
										if (obj.get("largeNum") != null && BigDecimal.ZERO
												.compareTo(new BigDecimal(obj.getString("largeNum"))) == 0) {
											obj.element("error", "箱数不能为0");
										}
									} catch (Exception e) {
										obj.element("error", "箱数必填");
									}
								}*/
                                if (obj.get("realNum") == null && obj.get("largeNum") == null) {
                                    obj.element("error", "箱数/数量必须选填一项");
                                    continue;
                                }
                                String realNum = obj.getString("realNum");
                                String largeNum = obj.getString("largeNum");
                                boolean realBoo = StringUtils.isNumeric(realNum);
                                boolean largeBoo = StringUtils.isNumeric(largeNum);
                                if(!realBoo && !largeBoo){
                                    obj.element("error", "箱数/数量必须选填一项数字");
                                    continue;
                                }
                                if ((realBoo && BigDecimal.ZERO.compareTo(new BigDecimal(realNum)) == 0)
                                        && (largeBoo && BigDecimal.ZERO.compareTo(new BigDecimal(largeNum)) == 0)) {
                                    obj.element("error", "箱数/数量必须选填一项大于0");
                                    continue;
                                }
							}
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

					});

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
			columns = new String[] { "skuCode", "realNum" };
			headers = new String[] { "货号", "数量" };
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
			columns = new String[] { "barCode", "realNum" };
			headers = new String[] { "条码", "数量" };
		}

		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * 
	 * @Description: 导入模板下载
	 * @param response
	 * @param type
	 * @author liux01
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, String type) {
		try {
			// 导出文件名称，不包括后缀名
			String fileName = null;
			String templateName = null;
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
				fileName = "库存调整货号导入模板";
				templateName = ExportExcelConstant.STOCK_ADJUST_SKU_TEMPLE;
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
				templateName = ExportExcelConstant.STOCK_ADJUST_BAR_TEMPLE;
				fileName = "库存调整条码导入模板";
			}
			// 导出Excel
			exportListForXLSX(response, null, fileName, templateName);
		} catch (Exception e) {
			LOG.error("库存调整导入失败:{}", e);
		}
	}

}
