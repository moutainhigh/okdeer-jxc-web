/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年3月6日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.stock;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.okdeer.jxc.common.enums.StockAdjustEnum;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByStockAdjust;
import com.okdeer.jxc.stock.service.StockAdjustServiceApi;
import com.okdeer.jxc.stock.vo.StockFormDetailVo;
import com.okdeer.jxc.stock.vo.StockFormVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

import net.sf.json.JSONObject;

/**
 * ClassName: StockReimburseController 
 * @Description: 报损单
 * @author zhengwj
 * @date 2017年3月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("/stock/reimburse")
public class StockReimburseController extends BaseController<StockReimburseController> {

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
	 * @Description: 报损单列表页面
	 * @author zhengwj
	 * @date 2017年3月6日
	 */
	@RequestMapping(value = "list")
	public String list() {
		return "/stockReimburse/stockReimburseList";
	}

	/**
	 * @Description: 获取报损单列表
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
			vo.setFormType(StockAdjustEnum.REIMBURSE.getKey());
			PageUtils<StockFormVo> stockFormList = stockAdjustServiceApi.getStockFormList(vo);
			LOG.info(LogConstant.PAGE, stockFormList.toString());
			return stockFormList;
		} catch (Exception e) {
			LOG.error("获取报损单列表信息异常:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 报损单新增页面
	 * @author zhengwj
	 * @date 2017年3月6日
	 */
	@RequiresPermissions("JxcStockReimburse:add")
	@RequestMapping(value = "add")
	public String add() {
		return "/stockReimburse/stockReimburseAdd";
	}

	/**
	 * @Description: 保存报损单
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockReimburse:add")
	@RequestMapping(value = "save", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addStcokForm(@RequestBody String jsonText) {
		RespJson resp;
		try {
			StockFormVo vo = JSON.parseObject(jsonText, StockFormVo.class);
			SysUser user = UserUtil.getCurrentUser();
			vo.setCreateUserId(user.getId());
			vo.setFormType(StockAdjustEnum.REIMBURSE.getKey());
			return stockAdjustServiceApi.addStockForm(vo);
		} catch (Exception e) {
			LOG.error("保存报损单信息异常:{}", e);
			resp = RespJson.error("保存报损单信息失败");
		}
		return resp;
	}

	/**
	 * @Description: 删除报损单
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockReimburse:delete")
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	@ResponseBody
	public RespJson deleteStockForm(@RequestParam(value = "ids[]") List<String> ids) {
		LOG.info(LogConstant.OUT_PARAM_LISTS, ids);
		RespJson resp;
		try {
			return stockAdjustServiceApi.deleteCombineSplit(ids);
		} catch (Exception e) {
			LOG.error("删除报损单信息异常:{}", e);
			resp = RespJson.error("删除报损单信息失败");
		}
		return resp;
	}

	/**
	 * @Description: 获取报损单详情列表
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequestMapping(value = "getStockFormDetailList", method = RequestMethod.GET)
	@ResponseBody
	public List<StockFormDetailVo> getStockFormDetailList(String id) {
		try {
			return stockAdjustServiceApi.getStcokFormDetailList(id);
		} catch (Exception e) {
			LOG.error("获取报损单信息异常:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 报损单编辑页面
	 * @author zhengwj
	 * @date 2017年3月7日
	 */
	@RequiresPermissions("JxcStockReimburse:edit")
	@RequestMapping(value = "edit", method = RequestMethod.GET)
	public String edit(String id, HttpServletRequest request) {
		StockFormVo stockFormVo;
		try {
			stockFormVo = stockAdjustServiceApi.getStcokFormInfo(id);
			request.setAttribute("stockFormVo", stockFormVo);
		} catch (Exception e) {
			LOG.error("报损单查询详情错误:{}", e);
		}
		return "/stockReimburse/stockReimburseView";
	}

	/**
	 * @Description: 保存报损单
	 * @author zhengwj
	 * @date 2017年3月8日
	 */
	@RequiresPermissions("JxcStockReimburse:edit")
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
			LOG.error("更新报损单信息异常:{}", e);
			resp = RespJson.error("更新报损单信息失败");
		}
		return resp;
	}

	/**
	 * @Description: 审核报损单
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
			LOG.error("审核报损单信息异常:{}", e);
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
	@RequiresPermissions("JxcStockReimburse:import")
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, String type) {
		try {
			// 导出文件名称，不包括后缀名
			String fileName = null;
			String templateName = null;
			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {
				fileName = "报损单货号导入模板";
				templateName = ExportExcelConstant.STOCK_REIMBURSE_SKU_TEMPLE;
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {
				templateName = ExportExcelConstant.STOCK_REIMBURSE_BAR_TEMPLE;
				fileName = "报损单条码导入模板";
			}
			// 导出Excel
			exportListForXLSX(response, null, fileName, templateName);
		} catch (Exception e) {
			LOG.error("报损单导入失败:{}", e);
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
	@RequiresPermissions("JxcStockReimburse:import")
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
					"/stock/reimburse/downloadErrorFile", new GoodsSelectImportBusinessValid() {

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
	@RequiresPermissions("JxcStockReimburse:import")
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
	@RequiresPermissions("JxcStockReimburse:export")
	@RequestMapping(value = "exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, StockFormVo vo) {
		RespJson resp = RespJson.success();
		try {
			List<StockFormDetailVo> exportList = stockAdjustServiceApi.exportList(vo);
			String fileName = "报损单" + "_" + DateUtils.getCurrSmallStr();
			String templateName = ExportExcelConstant.STOCKREIMBURSE;
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
			LOG.error("导出报损单商品异常：{}", e);
			resp = RespJson.error("导出报损单商品异常");
		}
		return resp;
	}

}