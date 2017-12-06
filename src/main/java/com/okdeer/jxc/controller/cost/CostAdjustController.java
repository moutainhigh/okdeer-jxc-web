
package com.okdeer.jxc.controller.cost;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.collections.CollectionUtils;
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
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.BigDecimalUtils;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.cost.entity.StockCostForm;
import com.okdeer.jxc.cost.entity.StockCostFormAll;
import com.okdeer.jxc.cost.entity.StockCostFormDetail;
import com.okdeer.jxc.cost.service.StockCostFormServiceApi;
import com.okdeer.jxc.cost.vo.StockCostFormVo;
import com.okdeer.jxc.dict.entity.Dict;
import com.okdeer.jxc.dict.service.DictServiceApi;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByCostPrice;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.retail.common.exception.BizException;

/**
 * ClassName: CostAdjustController 
 * @Description: 
 * @author yangyq02
 * @date 2016年10月15日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *      零售系统			2016-10-17			yangyq02	        配送（调拨单）Controller
 */

@Controller
@RequestMapping("cost/costAdjust")
public class CostAdjustController extends BaseController<StockCostForm> {

	@Reference(version = "1.0.0", check = false)
	private StockCostFormServiceApi stockCostFormServiceApi;

	@Reference(version = "1.0.0", check = false)
	DictServiceApi dictServiceApi;

	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	/**
	 * @Description: 显示列表页面
	 * @param type
	 * @param model
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		return "cost/costAdjustList";
	}

	/**
	 * @Description: 跳转到添加页面
	 * @param type
	 * @param model
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "add")
	public String add(Model model) {
		List<Dict> dict = dictServiceApi.getDictByType("COST_ADJUST_REASON");
		model.addAttribute("COST_ADJUST_REASON", dict);
		return "cost/costAdjustAdd";
	}

	/**
	 * @Description: 跳转到修改页面
	 * @param type
	 * @param model
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "edit")
	public String edit(String id, Model model) {
		StockCostForm costForm = stockCostFormServiceApi.queryCostFormDetail(id);
		costForm.getCreateTime().getTime();
		model.addAttribute("data", costForm);
		List<Dict> dict = dictServiceApi.getDictByType("COST_ADJUST_REASON");
		model.addAttribute("COST_ADJUST_REASON", dict);
		if (Constant.INTEGER_ONE.equals(costForm.getStatus())) {
			return "cost/costAdjustCheck";
		}
		return "cost/costAdjustEdit";
	}

	/**
	 * @Description: 查询列表集合
	 * @param vo
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return PageUtils<StockCostForm>  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "queryList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<StockCostForm> queryList(StockCostFormVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			LOG.debug("查询列表集合qo:{}", vo);
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			PageUtils<StockCostForm> page = stockCostFormServiceApi.queryLists(vo);
			LOG.debug("page:{}", page);
			return page;
		} catch (RuntimeException e) {
			LOG.error("运行异常删除成本调整单失败！:{}", e);
			return null;
		} catch (Exception e) {
			LOG.error("异常删除成本调整单失败！:{}", e);
			return null;
		}
	}

	/**
	 * @Description: 添加成本调整
	 * @param jsonData
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "addCostForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addCostForm(String jsonData) {
		try {
			if (jsonData == null) {
				RespJson.error("json数据不允许为空！");
			}
			StockCostFormAll stockCostFormAl = JSON.parseObject(jsonData, StockCostFormAll.class);
			stockCostFormAl.getStockCostForm().setCreateUserId(UserUtil.getCurrUserId());
			stockCostFormAl.setBranchCode(UserUtil.getCurrBranchCode());
			LOG.debug("qo:{}" , stockCostFormAl);
			return stockCostFormServiceApi.insertCostForm(stockCostFormAl);
		} catch (RuntimeException e) {
			LOG.error("新增成本调整单失败！:{}", e);
			return RespJson.error(e.getMessage());
		} catch (Exception e) {
			LOG.error("新增成本调整单失败！:{}", e);
			return RespJson.error("新增成本调整单失败！");
		}
	}

	/**
	 * @Description: 修改成调整
	 * @param jsonData
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "updateCostForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateCostForm(String jsonData) {
		try {
			if (jsonData == null) {
				RespJson.error("json数据不允许为空！");
			}
			StockCostFormAll stockCostFormAl = JSON.parseObject(jsonData, StockCostFormAll.class);
			if (StringUtils.isEmpty(stockCostFormAl.getStockCostForm().getBranchId())) {
				RespJson.error("机构ID不允许为空！");
			}
			stockCostFormAl.getStockCostForm().setUpdateUserId(UserUtil.getCurrUserId());
			LOG.debug("qo:{}", stockCostFormAl);
			return stockCostFormServiceApi.updateCostForm(stockCostFormAl);
		} catch (RuntimeException e) {
			LOG.error("运行异常删除成本调整单失败！:{}", e);
			return RespJson.error(e.getMessage());
		} catch (Exception e) {
			LOG.error("删除成本调整单失败！:{}", e);
			return RespJson.error("删除成本调整单失败！");
		}
	}

	/**
	 * @Description: 删除成本调整
	 * @param id
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "deleteCostForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson deleteCostForm(String id) {
		try {
			if (id == null) {
				return RespJson.error("id不允许为空！");
			}
			return stockCostFormServiceApi.deleteCostFormById(id);
		} catch (RuntimeException e) {
			LOG.error("删除成本调整单失败！:{}", e);
			return RespJson.error(e.getMessage());
		} catch (Exception e) {
			LOG.error("删除成本调整单失败！:{}", e);
			return RespJson.error("删除成本调整单失败！");
		}
	}

	/**
	 * @Description: 查看详情
	 * @param id
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "queryCostFormDetail", method = RequestMethod.POST)
	@ResponseBody
	public StockCostForm queryCostFormDetail(String id) {
		try {
			return stockCostFormServiceApi.queryCostFormDetail(id);
		} catch (RuntimeException e) {
			LOG.error("查看成本调整单明细！:{}", e);
		} catch (Exception e) {
			LOG.error("删除成本调整单失败！:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 查看明细列表详细
	 * @param id
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "queryCostFormDetailList", method = RequestMethod.POST)
	@ResponseBody
	public List<StockCostFormDetail> queryCostFormDetailList(String id) {
		try {
			List<StockCostFormDetail> list = stockCostFormServiceApi.queryCostFormDetailList(id);
			return list;
		} catch (RuntimeException e) {
			LOG.error("查看成本调整单明细！:{}", e);
		} catch (Exception e) {
			LOG.error("删除成本调整单失败！:{}", e);
		}
		return null;
	}

	/**
	 * @Description: 审核
	 * @param id
	 * @param pageNumber
	 * @param pageSize
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(String id) throws BizException{
		try {
			if (id == null) {
				return RespJson.error("id不允许为空！");
			}
			RespJson json = stockCostFormServiceApi.check(id, UserUtil.getCurrUserId());
			return json;
		}
		catch (RuntimeException e) {
			LOG.error("审核成本调整单失败！:{}", e);
			return RespJson.error(e.getMessage());
		} catch (Exception e) {
			LOG.error("审核成本调整单失败！:{}", e);
			return RespJson.error("审核成本调整单失败！");
		}
	}

	/**
	 * @Description: 成本调价导出
	 * @param id
	 * @param response
	 * @return
	 * @author lijy02
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "exportGoods", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportGoods(String id, HttpServletResponse response) {
		try {
			List<StockCostFormDetail> list = stockCostFormServiceApi.queryCostFormDetailList(id);
			if (CollectionUtils.isNotEmpty(list)) {
				// 导出文件名称，不包括后缀名
				String fileName = "成本调价单" + "_" + DateUtils.getCurrSmallStr();
				// 模板名称，包括后缀名
				String templateName = ExportExcelConstant.COST_ADJUST_EXPORT_EXCEL;

				// 导出Excel
				exportListForXLSX(response, list, fileName, templateName);
				return null;
			} else {
			    return RespJson.error("无数据可导");
			}
		} catch (Exception e) {
			LOG.error("导出商品失败", e);
			return RespJson.error(e.toString());
		}
	}

	/**
	 * @Description: 成本调价导入
	 * @param file
	 * @param type
	 * @param branchId
	 * @return
	 * @author lijy02
	 * @date 2016年10月17日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String type, String branchId) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}

			if (StringUtils.isBlank(type)) {
				return RespJson.error("导入类型为空");
			}

			// 文件流
			InputStream is = file.getInputStream();
			// 获取文件名
			String fileName = file.getOriginalFilename();

			SysUser user = UserUtil.getCurrentUser();
			if (branchId == null) {
				branchId = UserUtil.getCurrBranchId();
			}

			String[] field = null;

			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
				field = new String[] { "skuCode", "newCostPrice", "untaxedNewPrice" };
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
				field = new String[] { "barCode", "newCostPrice", "untaxedNewPrice" };
			}

			Map<String,String> map = new HashMap<String,String>();
			map.put("formType", "IP");
			GoodsSelectImportVo<GoodsSelectByCostPrice> vo = goodsSelectImportComponent.importSelectGoodsWithStock(
					fileName, is, field, new GoodsSelectByCostPrice(), branchId, user.getId(), type,
					"/cost/costAdjust/downloadErrorFile", new GoodsSelectImportBusinessValid() {

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
							for (GoodsSelect objGoods : list) {
								GoodsSelectByCostPrice obj = (GoodsSelectByCostPrice) objGoods;
								BigDecimal newCostprice = obj.getNewCostPrice();
								BigDecimal diffMoney = obj.getDiffMoney();
								BigDecimal actual = StringUtils.isNotEmpty(obj.getActual()) ? new BigDecimal(obj.getActual()) : BigDecimal.ZERO;
								if (newCostprice == null) {
									obj.setNewCostPrice(obj.getCostPrice());
								}
								if(diffMoney == null){
									BigDecimal costPrice = obj.getCostPrice() != null ? obj.getCostPrice() : BigDecimal.ZERO;
									BigDecimal tempBig = newCostprice.subtract(costPrice).multiply(actual);
									obj.setDiffMoney(BigDecimalUtils.formatDecimal(tempBig, 4));
								}
								BigDecimal untaxedNewPrice = obj.getUntaxedNewPrice();
								BigDecimal untaxedDiffMoney = obj.getUntaxedDiffMoney();
								if (untaxedNewPrice == null) {
								    obj.setUntaxedNewPrice(obj.getUntaxedCostPrice());
								}
								if(untaxedDiffMoney == null){
								    BigDecimal untaxedCostPrice = obj.getUntaxedCostPrice() != null ? obj.getUntaxedCostPrice() : BigDecimal.ZERO;
								    BigDecimal tempBig = untaxedNewPrice.subtract(untaxedCostPrice).multiply(actual);
								    obj.setUntaxedDiffMoney(BigDecimalUtils.formatDecimal(tempBig, 4));
								}
							}
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
	 * @Description: 下载错误模版
	 * @param code
	 * @param type
	 * @param response
	 * @author lijy02
	 * @date 2016年10月17日
	 */
	@RequestMapping(value = "downloadErrorFile")
	public void downloadErrorFile(String code, String type, HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = null;
		String[] columns = null;

		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
			columns = new String[] { "skuCode", "newCostPrice" , "untaxedNewPrice" };
			headers = new String[] { "货号", "新价" };
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
			columns = new String[] { "barCode", "newCostPrice", "untaxedNewPrice"  };
			headers = new String[] { "条码", "新价" };
		}

		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * @Description: 导出调价单模板
	 * @param response
	 * @param type
	 * @author lijy02
	 * @date 2016年10月10日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, Integer type) {
		LOG.debug("CostAdjustController:{}", type);
		try {
			// 导出文件名称，不包括后缀名
			String fileName = "成本调价单条形码导入模板";
			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.COST_GOODS_PRICE_ADJUST_FORM_TEMPLE_BARCODE;
			if (Constant.ZERO == type) {
				templateName = ExportExcelConstant.COST_GOODS_PRICE_ADJUST_FORM_TEMPLE_SKUCODE;
				fileName = "成本调价单货号导入模板";
			}
			// 导出Excel
			exportListForXLSX(response, null, fileName, templateName);
		} catch (Exception e) {
			LOG.error("成本调价单导入模版下载失败:", e);
		}
	}
}
