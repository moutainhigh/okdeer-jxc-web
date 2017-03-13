/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年3月6日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.stock;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
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
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.enums.StockAdjustEnum;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.print.JasperHelper;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByStockAdjust;
import com.okdeer.jxc.stock.service.StockAdjustServiceApi;
import com.okdeer.jxc.stock.vo.StockFormDetailVo;
import com.okdeer.jxc.stock.vo.StockFormVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: StockLeadController 
 * @Description: 领用单
 * @author zhengwj
 * @date 2017年3月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("/stock/lead")
public class StockLeadController extends BasePrintController<StockLeadController, StockFormDetailVo> {

	/**
	 * @Fields stockAdjustServiceApi : 库存调整service
	 */
	@Reference(version = "1.0.0", check = false)
	private StockAdjustServiceApi stockAdjustServiceApi;

	/**
	 * @Fields goodsSelectImportComponent : 商品选择
	 */
	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	/**
	 * @Description: 领用单列表页面
	 * @author zhengwj
	 * @date 2017年3月6日
	 */
	@RequestMapping(value = "list")
	public String list() {
		return "/stockLead/stockLeadList";
	}

	/**
	 * @Description: 获取领用单列表
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequestMapping(value = "getStockFormList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<StockFormVo> getStockFormList(StockFormVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.info(LogConstant.OUT_PARAM, vo.toString());
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			// 调整类型
			vo.setFormType(StockAdjustEnum.LEAD.getKey());
			PageUtils<StockFormVo> stockFormList = stockAdjustServiceApi.getStockFormList(vo);
			LOG.info(LogConstant.PAGE, stockFormList.toString());
			return stockFormList;
		} catch (Exception e) {
			LOG.error("获取领用单列表信息异常:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 领用单新增页面
	 * @author zhengwj
	 * @date 2017年3月6日
	 */
	@RequiresPermissions("JxcStockLead:add")
	@RequestMapping(value = "add")
	public String add() {
		return "/stockLead/stockLeadAdd";
	}

	/**
	 * @Description: 保存领用单
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockLead:add")
	@RequestMapping(value = "save", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addStcokForm(@RequestBody String jsonText) {
		RespJson resp;
		try {
			StockFormVo vo = JSON.parseObject(jsonText, StockFormVo.class);
			SysUser user = UserUtil.getCurrentUser();
			vo.setCreateUserId(user.getId());
			vo.setFormType(StockAdjustEnum.LEAD.getKey());
			return stockAdjustServiceApi.addStockForm(vo);
		} catch (Exception e) {
			LOG.error("保存领用单信息异常:{}", e);
			resp = RespJson.error("保存领用单信息失败");
		}
		return resp;
	}

	/**
	 * @Description: 删除领用单
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockLead:delete")
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	@ResponseBody
	public RespJson deleteStockForm(@RequestParam(value = "ids[]") List<String> ids) {
		LOG.info(LogConstant.OUT_PARAM_LISTS, ids);
		RespJson resp;
		try {
			return stockAdjustServiceApi.deleteCombineSplit(ids);
		} catch (Exception e) {
			LOG.error("删除领用单信息异常:{}", e);
			resp = RespJson.error("删除领用单信息失败");
		}
		return resp;
	}

	/**
	 * @Description: 获取领用单详情列表
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequestMapping(value = "getStockFormDetailList", method = RequestMethod.GET)
	@ResponseBody
	public List<StockFormDetailVo> getStockFormDetailList(String id) {
		try {
			return stockAdjustServiceApi.getStcokFormDetailList(id);
		} catch (Exception e) {
			LOG.error("获取领用单信息异常:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 领用单编辑页面
	 * @author zhengwj
	 * @date 2017年3月7日
	 */
	@RequiresPermissions("JxcStockLead:edit")
	@RequestMapping(value = "edit", method = RequestMethod.GET)
	public String edit(String id, HttpServletRequest request) {
		StockFormVo stockFormVo;
		try {
			stockFormVo = stockAdjustServiceApi.getStcokFormInfo(id);
			request.setAttribute("stockFormVo", stockFormVo);
		} catch (Exception e) {
			LOG.error("领用单查询详情错误:{}", e);
		}
		return "/stockLead/stockLeadView";
	}

	/**
	 * @Description: 保存领用单
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockLead:edit")
	@RequestMapping(value = "update", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateStockForm(@RequestBody String jsonText) {
		RespJson resp;
		try {
			StockFormVo vo = JSON.parseObject(jsonText, StockFormVo.class);
			SysUser user = UserUtil.getCurrentUser();
			vo.setCreateUserId(user.getId());
			return stockAdjustServiceApi.updateStockForm(vo);
		} catch (Exception e) {
			LOG.error("更新领用单信息异常:{}", e);
			resp = RespJson.error("更新领用单信息失败");
		}
		return resp;
	}

	/**
	 * @Description: 审核领用单
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequestMapping(value = "check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(String id) {
		RespJson resp;
		try {
			SysUser user = UserUtil.getCurrentUser();
			return stockAdjustServiceApi.check(id, user.getId());
		} catch (Exception e) {
			LOG.error("审核领用单信息异常:{}", e);
			resp = RespJson.error(e.getMessage());
		}
		return resp;
	}

	/**
	 * @Description: 下载导入模板
	 * @param type 文件类型
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockLead:import")
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, String type) {
		try {
			// 导出文件名称，不包括后缀名
			String fileName = null;
			String templateName = null;
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
				fileName = "领用单货号导入模板";
				templateName = ExportExcelConstant.STOCK_LEAD_SKU_TEMPLE;
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
				templateName = ExportExcelConstant.STOCK_LEAD_BAR_TEMPLE;
				fileName = "领用单条码导入模板";
			}
			// 导出Excel
			exportListForXLSX(response, null, fileName, templateName);
		} catch (Exception e) {
			LOG.error("领用单导入失败:{}", e);
		}
	}

	/**
	 * @Description: 导入文件
	 * @param file 文件
	 * @param branchId 机构id
	 * @param type 文件类型
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockLead:import")
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
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
				// 货号
				field = new String[] { "skuCode", "realNum", "largeNum" };
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
				// 条码
				field = new String[] { "barCode", "realNum", "largeNum" };
			}
			GoodsSelectImportVo<GoodsSelectByStockAdjust> vo = goodsSelectImportComponent.importSelectGoodsWithStock(
					fileName, is, field, new GoodsSelectByStockAdjust(), branchId, user.getId(), type,
					"/stock/lead/downloadErrorFile", new GoodsSelectImportBusinessValid() {

						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {
							for (JSONObject obj : excelListSuccessData) {
								if (obj.get("realNum") != null) {
									String realNum = obj.getString("realNum");
									try {
										Double.parseDouble(realNum);
									} catch (Exception e) {
										obj.element("error", "数量必填");
									}
								}
								if (obj.get("realNum") != null && Integer.parseInt(obj.getString("realNum")) == 0) {
									obj.element("error", "数量不能为0");
								}
								if (obj.get("largeNum") != null) {
									String largeNum = obj.getString("largeNum");
									try {
										Double.parseDouble(largeNum);
									} catch (Exception e) {
										obj.element("error", "箱数必填");
									}
								}
								if (obj.get("largeNum") != null && Integer.parseInt(obj.getString("largeNum")) == 0) {
									obj.element("error", "箱数不能为0");
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
	 * @Description: 下载导入异常信息
	 * @param code 下载的key
	 * @param type 文件类型
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockLead:import")
	@RequestMapping(value = "downloadErrorFile")
	public void downloadErrorFile(String code, String type, HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = null;
		String[] columns = null;

		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
			// 货号
			columns = new String[] { "skuCode", "realNum" };
			headers = new String[] { "货号", "数量" };
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
			// 条码
			columns = new String[] { "barCode", "realNum" };
			headers = new String[] { "条码", "数量" };
		}

		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * @Description: 导出数据
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockLead:export")
	@RequestMapping(value = "exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, StockFormVo vo) {
		RespJson resp = RespJson.success();
		try {
			List<StockFormDetailVo> exportList = stockAdjustServiceApi.exportList(vo);
			String fileName = "领用单" + "_" + DateUtils.getCurrSmallStr();
			String templateName = ExportExcelConstant.STOCKLEAD;
			// 导出时将负数转为正数
			if (null != exportList && !exportList.isEmpty()) {
				for (StockFormDetailVo stockFormDetailVo : exportList) {
					stockFormDetailVo.setLargeNum(stockFormDetailVo.getLargeNum().substring(1));
					stockFormDetailVo.setRealNum(stockFormDetailVo.getRealNum().substring(1));
					stockFormDetailVo.setAmount(stockFormDetailVo.getAmount().substring(1));
				}
			}
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("导出领用单商品异常：{}", e);
			resp = RespJson.error("导出领用单商品异常");
		}
		return resp;
	}

	/**
	 * @Description: 打印领用单列表
	 * @author zhengwj
	 * @date 2017年3月10日
	 */
	@RequiresPermissions("JxcStockLead:print")
	@RequestMapping(value = "print", method = RequestMethod.GET)
	@ResponseBody
	public String printReport(StockFormVo vo, HttpServletResponse response, HttpServletRequest request,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber) {
		try {
			vo.setPageNumber(1);
			vo.setPageSize(PrintConstant.PRINT_MAX_LIMIT);
			LOG.debug("领用单打印参数：{}", vo.toString());
			int lenght = stockAdjustServiceApi.queryPageListCount(vo);
			if (lenght > PrintConstant.PRINT_MAX_ROW) {
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			vo.setFormType(StockAdjustEnum.LEAD.getKey());
			PageUtils<StockFormVo> stockFormList = stockAdjustServiceApi.getStockFormList(vo);
			List<StockFormVo> list = stockFormList.getList();
			if (!CollectionUtils.isEmpty(list) && list.size() > PrintConstant.PRINT_MAX_ROW) {
				return "<script>alert('打印最大行数不能超过3000行');top.closeTab();</script>";
			}
			String path = PrintConstant.STOCK_LEAD;
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("startDate", vo.getStartTime());
			map.put("endDate", vo.getEndTime());
			map.put("printName", UserUtil.getCurrentUser().getUserName());
			JasperHelper.exportmain(request, response, map, JasperHelper.PDF_TYPE, path, list, "");
		} catch (Exception e) {
			LOG.error(PrintConstant.STOCK_LEAD_ERROR, e);
		}
		return null;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintReplace(java.lang.String)
	 */
	@Override
	protected Map<String, Object> getPrintReplace(String id) {
		StockFormVo form = stockAdjustServiceApi.getStcokFormInfo(id);
		Map<String, Object> replaceMap = new HashMap<String, Object>();
		if (null != form) {
			// 单号
			replaceMap.put("_单号", form.getFormNo() != null ? form.getFormNo() : "");
			replaceMap.put("formNo", form.getFormNo() != null ? form.getFormNo() : "");
			// 领用机构
			replaceMap.put("_领用机构", form.getBranchCode() != null && form.getBranchName() != null
					? "[" + form.getBranchCode() + "]" + form.getBranchName() : "");
			replaceMap.put("branchName", form.getBranchCode() != null && form.getBranchName() != null
					? "[" + form.getBranchCode() + "]" + form.getBranchName() : "");
			// 备注
			replaceMap.put("_备注", form.getRemark());
			replaceMap.put("remark", form.getRemark());
			// 制单人员
			replaceMap.put("_制单人员", form.getCreateUserName() != null ? form.getCreateUserName() : "");
			replaceMap.put("createUserName", form.getCreateUserName() != null ? form.getCreateUserName() : "");
			// 最后修改人
			replaceMap.put("_最后修改人", form.getUpdateUserName() != null ? form.getUpdateUserName() : "");
			replaceMap.put("updateUserName", form.getUpdateUserName() != null ? form.getUpdateUserName() : "");
			// 审核人员
			replaceMap.put("_审核人员", form.getValidUserName() != null ? form.getValidUserName() : "");
			replaceMap.put("validUserName", form.getValidUserName() != null ? form.getValidUserName() : "");
			// 制单时间
			if (form.getCreateTime() != null) {
				replaceMap.put("_制单时间", DateUtils.formatDate(form.getCreateTime(), "yyyy-MM-dd HH:mm"));
				replaceMap.put("createTime", DateUtils.formatDate(form.getCreateTime(), "yyyy-MM-dd HH:mm"));
			} else {
				replaceMap.put("_制单时间", "");
				replaceMap.put("createTime", "");
			}
			// 修改时间
			if (form.getUpdateTime() != null) {
				replaceMap.put("_修改时间", DateUtils.formatDate(form.getUpdateTime(), "yyyy-MM-dd HH:mm"));
				replaceMap.put("updateTime", DateUtils.formatDate(form.getUpdateTime(), "yyyy-MM-dd HH:mm"));
			} else {
				replaceMap.put("_修改时间", "");
				replaceMap.put("updateTime", "");
			}
			// 审核时间
			if (form.getValidTime() != null) {
				replaceMap.put("_审核时间", form.getValidTime());
				replaceMap.put("validTime", form.getValidTime());
			} else {
				replaceMap.put("_审核时间", "");
				replaceMap.put("validTime", "");
			}
		}
		return replaceMap;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintDetail(java.lang.String)
	 */
	@Override
	protected List<StockFormDetailVo> getPrintDetail(String id) {
		List<StockFormDetailVo> list = stockAdjustServiceApi.getStcokFormDetailList(id);
		// 合计
		BigDecimal totalLargeNum = BigDecimal.ZERO;
		BigDecimal totalRealNum = BigDecimal.ZERO;
		BigDecimal totalAmount = BigDecimal.ZERO;
		if (null != list && !list.isEmpty()) {
			for (StockFormDetailVo stockFormDetailVo : list) {
				// 打印时将负数转为正数
				stockFormDetailVo.setLargeNum(stockFormDetailVo.getLargeNum().substring(1));
				stockFormDetailVo.setRealNum(stockFormDetailVo.getRealNum().substring(1));
				stockFormDetailVo.setAmount(stockFormDetailVo.getAmount().substring(1));
				totalLargeNum = totalLargeNum.add(new BigDecimal(stockFormDetailVo.getLargeNum()));
				totalRealNum = totalRealNum.add(new BigDecimal(stockFormDetailVo.getRealNum()));
				totalAmount = totalAmount.add(new BigDecimal(stockFormDetailVo.getAmount()));
			}
			StockFormDetailVo total = new StockFormDetailVo();
			total.setSkuCode("合计");
			total.setLargeNum(totalLargeNum.toString());
			total.setRealNum(totalRealNum.toString());
			total.setAmount(totalAmount.toString());
			list.add(total);
		}
		return list;
	}

}
