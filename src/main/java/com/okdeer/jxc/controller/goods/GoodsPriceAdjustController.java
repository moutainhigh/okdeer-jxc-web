/** 
 *@Project: okdeer-jxc-web 
 *@Author: lijy02
 *@Date: 2016年8月1日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.goods;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.branch.service.BranchSpecServiceApi;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.controller.BasePrintController;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.BigDecimalUtils;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.ListUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.goods.entity.GoodsPriceForm;
import com.okdeer.jxc.goods.entity.GoodsPriceFormAll;
import com.okdeer.jxc.goods.entity.GoodsPriceFormBranch;
import com.okdeer.jxc.goods.entity.GoodsPriceFormDetail;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectPriceAdjst;
import com.okdeer.jxc.goods.service.GoodsPriceAdustServiceApi;
import com.okdeer.jxc.goods.vo.GoodsPriceFormConst;
import com.okdeer.jxc.goods.vo.GoodsPriceFormVo;
import com.okdeer.jxc.sale.goods.service.ModifyPriceOrderService;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

import net.sf.json.JSONObject;

/**
 * ClassName: GoodsPriceAdjustController 
 * @Description: 商品调价单控制类
 * @author lijy02
 * @date 2016年8月1日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *	       商业管理系统		2016年8月1日			李俊义				商品调价单控制类
 */

@Controller
@RequestMapping("goods/priceAdjust")
public class GoodsPriceAdjustController extends BasePrintController<GoodsPriceAdjustController, GoodsPriceFormDetail> {

	// 商品调整服务类
	@Reference(version = "1.0.0", check = false)
	private GoodsPriceAdustServiceApi goodsPriceAdustService;

	// 导入
	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;
	
	@Reference(version = "1.0.0", check = false)
	private ModifyPriceOrderService modifyPriceOrderService;

	/**
	 * @Description: 调价单页面展示
	 * @return
	 * @author lijy02
	 * @date 2016年8月1日
	 */
	@RequestMapping(value = "/view", method = RequestMethod.GET)
	public String view() {
		return "goods/modifyPriceOrder";
	}

	/**
	 * @Description: 新增页面
	 * @return first 表示打开新增页面  权限的控制(区分是新增页面还是修改页面)
	 * @author lijy02
	 * @date 2016年8月1日
	 */
	@RequestMapping(value = "/addFormView", method = RequestMethod.GET)
	public String addFormView(Model model, HttpServletRequest request) {
		model.addAttribute("first", Constant.ONE);
		model.addAttribute("close", request.getAttribute("report"));
		model.addAttribute("loginBranchId", UserUtil.getCurrBranchId());
		return "goods/addModifyPriceOrder";
	}

	/**
	 * @Description: 调价公式页面
	 * @return
	 * @author lijy02
	 * @date 2016年8月15日
	 */
	@RequestMapping(value = "/modifyPriceDialog", method = RequestMethod.GET)
	public String modifyPriceDialog() {
		return "goods/modifyPriceDialog";
	}

	/**
	 * @Description: 根据条件获取调价单分页列表
	 * @param pageNumber 页码
	 * @param pageSize 每页最大显示数
	 * @param goodsPriceFormVo 调价单搜索实体类
	 * @return
	 * @author lijy02
	 * @date 2016年8月3日
	 */
	@RequestMapping(value = "/queryByCondition", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<GoodsPriceForm> queryByCondition(GoodsPriceFormVo goodsPriceFormVo) {
		try {
			if (goodsPriceFormVo.getEndTime() != null) {
				Date time = DateUtils.getNextDay(goodsPriceFormVo.getEndTime());
				goodsPriceFormVo.setEndTime(time);
			}
			goodsPriceFormVo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			LOG.debug("调价单搜索 ：goodsPriceFormVo:{}", goodsPriceFormVo);
			return goodsPriceAdustService.queryLists(goodsPriceFormVo);
		} catch (Exception e) {
			LOG.error(GoodsPriceFormConst.SEARCH_GOODS_PRICE_FOMR_ERRO, e);
		}
		return null;
	}

	/**
	 * @Description: 根据formNo获得单据详情列表
	 * @param formNo
	 * @return
	 * @author lijy02
	 * @date 2016年8月15日
	 */
	@RequestMapping(value = "/queryDetailsByformNo")
	@ResponseBody
	public List<GoodsPriceFormDetail> queryDetailsByformNo(String formNo) {
		LOG.debug("调价单搜索 ：formNo:{}", formNo);
		List<GoodsPriceFormDetail> list = goodsPriceAdustService.queryDetailPriceByformNo(formNo);
		return list;
	}
	
	/**
	 * @Description: 根据formNo删除单据
	 * @param formNo 主键formNo
	 * @return
	 * @author lijy02
	 * @date 2016年8月3日
	 */
	@RequestMapping(value = "/removeForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson removeForm(String formNo) {
		// 获取当前用户
		SysUser user = UserUtil.getCurrentUser();
		// 修改人
		String updateUserId = user.getId();
		try {
			goodsPriceAdustService.removeFormByFormNo(formNo, updateUserId);
		} catch (Exception e) {
			LOG.error(GoodsPriceFormConst.DELETE_GOODS_PRICE_FOMR_ERRO, e);
			RespJson respJson = RespJson.error(GoodsPriceFormConst.DELETE_GOODS_PRICE_FOMR_ERRO);
			return respJson;
		}
		return RespJson.success();
	}

	/**
	 * @Description: 新增调价单
	 * @param goodsPriceForm
	 * @param GoodsPriceDetailList
	 * @param goodsPriceFormBranch
	 * @return
	 * @author lijy02
	 * @date 2016年8月4日
	 */
	@RequestMapping(value = "/saveForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson saveForm(@RequestBody String data) {
		/**String formNo = "";
		String createTime = "";
		String createUserName = "";
		GoodsPriceFormAll goodsPriceFormAll = null;
		GoodsPriceForm goodsPriceForm = null;
		List<GoodsPriceFormDetail> goodsPriceFormDetailList = null;
		String branchIds = null;
		try {
			LOG.debug("新增调价单 ：data=" + data);
			if (StringUtils.isNotEmpty(data)) {
				goodsPriceFormAll = JSON.parseObject(data, GoodsPriceFormAll.class);
				if (goodsPriceFormAll != null) {
					goodsPriceForm = goodsPriceFormAll.getGoodsPriceForm();
					goodsPriceFormDetailList = goodsPriceFormAll.getGoodsPriceFormDetailList();
					branchIds = goodsPriceFormAll.getBranchIds();
				} else {
					RespJson rep = RespJson.error("保存数据不能为空！");
					return rep;
				}
			} else {
				RespJson rep = RespJson.error("保存数据不能为空！");
				return rep;
			}
			SysUser user = UserUtil.getCurrentUser();
			if (user == null) {
				RespJson rep = RespJson.error("用户不能为空！");
				return rep;
			}
			// 生成uuid主键
			String formId = UUIDHexGenerator.generate();
			// 货号
			formNo = orderNoUtils.getOrderNo(FormType.PC.name(), getCurrBranchCode());
			goodsPriceForm.setId(formId);
			// 单据数据设置
			goodsPriceForm.setFormType(FormType.PC.name());
			goodsPriceForm.setFormNo(formNo);
			// 判断是否生效
			goodsPriceForm.setIsEffected(Constant.ZERO_STR);
			// 用户数据
			goodsPriceForm.setCreateUserId(user.getId());
			createUserName = user.getUserName();
			goodsPriceForm.setCreateUserName(createUserName);
			goodsPriceForm.setCreateBranchId(user.getBranchId());
			goodsPriceForm.setCreateBranchCode(user.getBranchCode());
			goodsPriceForm.setCreateTime(new Date());
			goodsPriceForm.setStatus(Constant.ZERO);
			// 设置商品价格单据信息
			goodsPriceFormDetailList = setFormData(goodsPriceForm, goodsPriceFormDetailList);
			// 生成商品机构关联表单数据
			List<GoodsPriceFormBranch> goodsPriceFormBranchList = setGoodsPriceFormBranch(branchIds, formNo);
			// 新增单据
			goodsPriceAdustService.addForm(goodsPriceForm, goodsPriceFormDetailList, goodsPriceFormBranchList);
		} catch (Exception e) {
			LOG.error(GoodsPriceFormConst.ADD_GOODS_PRICE_FOMR_ERRO, e);
			return RespJson.error(GoodsPriceFormConst.ADD_GOODS_PRICE_FOMR_ERRO);
		}
		RespJson rep = RespJson.success();
		// 需要返回到页面上的数据
		formNo = goodsPriceForm.getFormNo();
		createTime = DateUtils.getCurrSmallRStr();
		rep.put("goodsPriceForm", goodsPriceForm);
		rep.put("createUserName", createUserName);
		rep.put("createUserDate", createTime);
		return rep;**/
	    LOG.debug("新增调价单 ：data:{}", data);
        try {
            if (StringUtils.isBlank(data)) {
                return RespJson.error("保存数据不能为空！");
            }
            GoodsPriceFormAll  goodsPriceFormAll = JSON.parseObject(data, GoodsPriceFormAll.class);
            if (goodsPriceFormAll == null) {
                return RespJson.error("保存数据不能为空！");
            }
            SysUser user = UserUtil.getCurrentUser();
            return goodsPriceAdustService.saveGoodsPriceForm(goodsPriceFormAll, user);
        } catch (Exception e) {
            LOG.error(GoodsPriceFormConst.ADD_GOODS_PRICE_FOMR_ERRO, e);
            return RespJson.error(GoodsPriceFormConst.ADD_GOODS_PRICE_FOMR_ERRO);
        }
	}
	/**
	 * @Description: 修改调价单据详情信息
	 * @param goodsPriceForm
	 * @param validate
	 * @param goodsPriceFormBranch
	 * @return
	 * @author lijy02
	 * @date 2016年8月6日
	 */
	@RequestMapping(value = "/updateForm", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateForm(@RequestBody String list) {
		/**GoodsPriceFormAll goodsPriceFormAll = null;
		GoodsPriceForm goodsPriceForm = null;
		List<GoodsPriceFormDetail> goodsPriceFormDetailList = null;
		String branchIds = null;
		try {
			LOG.debug("修改调价单 ：list=" + list);
			if (StringUtils.isNotEmpty(list)) {
				goodsPriceFormAll = JSON.parseObject(list, GoodsPriceFormAll.class);
				if (goodsPriceFormAll != null) {
					goodsPriceForm = goodsPriceFormAll.getGoodsPriceForm();
					goodsPriceFormDetailList = goodsPriceFormAll.getGoodsPriceFormDetailList();
					branchIds = goodsPriceFormAll.getBranchIds();
				} else {
					RespJson rep = RespJson.error("保存数据不能为空！");
					return rep;
				}
			} else {
				RespJson rep = RespJson.error("保存数据不能为空！");
				return rep;
			}
			// 用户数据
			SysUser user = UserUtil.getCurrentUser();
			if (user == null) {
				RespJson rep = RespJson.error("用户数据不能为空！");
				return rep;
			}
			goodsPriceForm.setUpdateUserId(user.getId());
			goodsPriceForm.setUpdateTime(new Date());
			// 设置商品价格单据信息
			goodsPriceFormDetailList = setFormData(goodsPriceForm, goodsPriceFormDetailList);
			// 生成商品机构关联表单数据
			List<GoodsPriceFormBranch> goodsPriceFormBranchList = setGoodsPriceFormBranch(branchIds,
					goodsPriceForm.getFormNo());
			// 修改单据
			goodsPriceAdustService.updateForm(goodsPriceForm, goodsPriceFormDetailList, goodsPriceFormBranchList);
		} catch (Exception e) {
			LOG.error(GoodsPriceFormConst.UPDATE_GOODS_PRICE_FOMR_ERRO, e);
			RespJson respJson = RespJson.error(GoodsPriceFormConst.UPDATE_GOODS_PRICE_FOMR_ERRO);
			return respJson;
		}
		RespJson rep = RespJson.success();
		rep.put("goodsPriceForm", goodsPriceForm);
		return rep;**/
	    LOG.debug("修改调价单 ：data:{}", list);
        try {
            if (StringUtils.isBlank(list)) {
                return RespJson.error("保存数据不能为空！");
            }
            GoodsPriceFormAll goodsPriceFormAll = JSON.parseObject(list, GoodsPriceFormAll.class);
            if (goodsPriceFormAll == null) {
                return RespJson.error("保存数据不能为空！");
            }
            SysUser user = UserUtil.getCurrentUser();
            return goodsPriceAdustService.updateGoodsPriceForm(goodsPriceFormAll, user);
        } catch (Exception e) {
            LOG.error(GoodsPriceFormConst.UPDATE_GOODS_PRICE_FOMR_ERRO, e);
            return RespJson.error(GoodsPriceFormConst.UPDATE_GOODS_PRICE_FOMR_ERRO);
        }
	}

	/**
	 * @Description: 详情跟修改调价单据
	 * @param formNo 单号
	 * @param model
	 * @return
	 * @author lijy02
	 * @date 2016年8月8日
	 */
	@RequestMapping(value = "/getForm", method = RequestMethod.GET)
	public String getForm(String formNo, Model model) {
		// 根据formNo查询单据
		GoodsPriceForm goodsPriceForm = goodsPriceAdustService.queryFormInCheck(formNo);
		List<GoodsPriceFormBranch> goodsPriceFormBranch = goodsPriceAdustService.queryPriceFormBranch(formNo);
		StringBuilder branchId = new StringBuilder();
		StringBuilder branchName = new StringBuilder();
		if (!ListUtils.isEmptyList(goodsPriceFormBranch)) {
			for (int i = 0; i < goodsPriceFormBranch.size(); i++) {
				if (i != goodsPriceFormBranch.size() - 1) {
					branchId.append(goodsPriceFormBranch.get(i).getBranchId() + ",");
					branchName.append(goodsPriceFormBranch.get(i).getBranchName() + ",");
				} else {
					branchId.append(goodsPriceFormBranch.get(i).getBranchId());
					branchName.append(goodsPriceFormBranch.get(i).getBranchName());
				}
			}
		}
		model.addAttribute("goodsPriceForm", goodsPriceForm);
		model.addAttribute("branchId", branchId);
		model.addAttribute("branchName", branchName);
		return "goods/addModifyPriceOrder";
	}

	/**
	 * @Description: 根据单号进入详情页面
	 * @param formNo 单号
	 * @param model
	 * @return
	 * @author lijy02
	 * @date 2016年8月8日
	 */
	@RequestMapping(value = "/showDetail", method = RequestMethod.GET)
	public String showDetail(String formNo, Model model, String report) {
		// 根据formNo查询单据
		GoodsPriceForm goodsPriceForm = goodsPriceAdustService.queryFormInCheck(formNo);
		// 根据formNo查询调价单详情
		List<GoodsPriceFormBranch> goodsPriceFormBranch = goodsPriceAdustService.queryPriceFormBranch(formNo);
		StringBuffer branchId = new StringBuffer();
		// 显示code+name组合
		StringBuffer branchName = new StringBuffer();
		String branchAreaCode = goodsPriceForm.getBranchAreaCode();
		String branchAreaCodeName = Constant.CUSTOM;
		if (StringUtils.isNotEmpty(branchAreaCode)) {
			branchAreaCodeName = "[" + branchAreaCode + "]" + goodsPriceForm.getBranchAreaName();
		}
		if (!ListUtils.isEmptyList(goodsPriceFormBranch)) {
			for (int i = 0; i < goodsPriceFormBranch.size(); i++) {
				if (i != goodsPriceFormBranch.size() - 1) {
					branchId.append(goodsPriceFormBranch.get(i).getBranchId() + ",");
					branchName.append("[" + goodsPriceFormBranch.get(i).getBranchCode() + "]"
							+ goodsPriceFormBranch.get(i).getBranchName() + ",");
				} else {
					branchId.append(goodsPriceFormBranch.get(i).getBranchId());
					branchName.append("[" + goodsPriceFormBranch.get(i).getBranchCode() + "]"
							+ goodsPriceFormBranch.get(i).getBranchName());
				}
			}
		}
		model.addAttribute("goodsPriceForm", goodsPriceForm);
		model.addAttribute("branchId", branchId);
		model.addAttribute("branchAreaCodeName", branchAreaCodeName);
		
		model.addAttribute("branchName", StringUtils.isEmpty(goodsPriceForm.getBranchsName())? branchName:goodsPriceForm.getBranchsName() );
		model.addAttribute("branchsFullName",StringUtils.isEmpty(goodsPriceForm.getBranchsFullName())? branchName:goodsPriceForm.getBranchsFullName());
		model.addAttribute("close", report);
		return "goods/addModifyPriceOrder";
	}

	/**
	 * @Description: 单据审核 1.修改调价单据状态值 2.修改店铺商品价格
	 * @param formNo
	 * @param status
	 * @return
	 * @author lijy02
	 * @date 2016年8月22日
	 */
	@RequestMapping(value = "/checkForm")
	@ResponseBody
	public RespJson checkForm(String formNo, Integer status, String effectDate) {
		try {
			// 判断获得的生效时间是否为null 生效时间是空说明生效时间小于所填时间 要返回给用户错误信息
			if (StringUtils.isEmpty(effectDate)) {
				return RespJson.error(GoodsPriceFormConst.EFFECTDATE_NOT_NULL);
			}
			Date date = DateUtils.parse(effectDate, DateUtils.DATE_SMALL_STR_R);
			// 根据单号获取订单信息
			GoodsPriceForm goodsPriceForm = goodsPriceAdustService.queryFormByFormNo(formNo, date);
			if (goodsPriceForm == null) {
				LOG.error(GoodsPriceFormConst.FORM_NOT_SAVE);
				return RespJson.error(GoodsPriceFormConst.FORM_NOT_SAVE);
			}
			goodsPriceForm.setStatus(status);
			// 获取当前用户
			SysUser user = UserUtil.getCurrentUser();
			String updateUserId = "";
			if (user != null) {
				updateUserId = user.getId();
				goodsPriceForm.setValidUserId(user.getId());
				goodsPriceForm.setUpdateUserId(updateUserId);
			} else {
				return RespJson.error("获取用户信息失败");
			}
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date effect = sdf.parse(effectDate);
			goodsPriceForm.setEffectDate(effect);
			if (DateUtils.compareDate(effect) < 0) {
				return RespJson.error("生效时间比今天小");
			} else {
				goodsPriceAdustService.checkForm(goodsPriceForm);
			}
		} catch (Exception e) {
			LOG.error("审核调价单失败", e);
			return RespJson.error("审核调价单失败");
		}
		RespJson resp = RespJson.success();
		resp.put("formNo", formNo);
		resp.put("status", Constant.CHECK_STATUS);
		return resp;
	}

	/**
	 * @Description: 导出明细
	 * @param formNo 单号
	 * @return
	 * @author lijy02
	 * @date 2016年8月29日
	 */
	@RequestMapping(value = "exportList")
	public void exportList(HttpServletResponse response, String formNo) {
		LOG.debug("GoodsPriceAdjustController:exportList:{}", formNo);
		try {
			List<GoodsPriceFormDetail> exportList = goodsPriceAdustService.queryDetailPriceByformNo(formNo);
			
			for(GoodsPriceFormDetail goods : exportList){
				BigDecimal oldSaleRate = BigDecimal.ZERO;
				BigDecimal newSaleRate = BigDecimal.ZERO;
				
				//计算原毛利率
				if(goods.getOldSalePrice()!=null && goods.getOldSalePrice().compareTo(BigDecimal.ZERO)>0 &&
						goods.getOldPurPrice()!=null){
					// 毛利率 = （销售价 - 进货价）/ 销售价 * 100
					oldSaleRate = goods.getOldSalePrice().subtract(goods.getOldPurPrice()).
							divide(goods.getOldSalePrice(), 4).multiply(new BigDecimal("100"));
				}
				
				//计算新毛利率
				if(goods.getNewSalePrice()!=null && goods.getNewSalePrice().compareTo(BigDecimal.ZERO)>0 &&
						goods.getNewPurPrice()!=null){
					// 毛利率 = （销售价 - 进货价）/ 销售价 * 100
					newSaleRate = goods.getNewSalePrice().subtract(goods.getNewPurPrice()).
							divide(goods.getNewSalePrice(), 4).multiply(new BigDecimal("100"));
				}
				goods.setOldSaleRateStr(BigDecimalUtils.formatTwoDecimal(oldSaleRate)+"%");
				goods.setNewSaleRateStr(BigDecimalUtils.formatTwoDecimal(newSaleRate)+"%");
			}
			
			// 导出文件名称，不包括后缀名
			String fileName = "调价单" + "_" + DateUtils.getCurrSmallStr();
			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.GOODS_PRICE_ADJUST_FORM;
			// 导出Excel
			cleanAccessData(exportList);
			exportListForXLSX(response, exportList, fileName, templateName);
		} catch (Exception e) {
			LOG.error("GoodsPriceAdjustController:exportList:", e);
		}
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
		LOG.debug("GoodsPriceAdjustController:exportList:{}", type);
		try {
			// 导出文件名称，不包括后缀名
			String fileName = "调价单货号导入模板";
			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.GOODS_PRICE_ADJUST_FORM_TEMPLE_SKUCODE;
			if (Constant.ZERO == type) {
				templateName = ExportExcelConstant.GOODS_PRICE_ADJUST_FORM_TEMPLE_SKUCODE;
				fileName = "调价单货号导入模板";
			} else {
				templateName = ExportExcelConstant.GOODS_PRICE_ADJUST_FORM_TEMPLE_BARCODE;
				fileName = "调价单条形码导入模板";
			}
			// 导出Excel
			exportListForXLSX(response, null, fileName, templateName);
		} catch (Exception e) {
			LOG.error("调价单导入模版下载失败:", e);
		}
	}

	/**
	 * 
	 * @Description: 调价单导入
	 * @param file
	 * @param type 0货号、1条码
	 * @param branchId
	 * @return
	 * @author lijy02
	 * @date 2016年10月14日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String type, String[] branchId) {
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

			String[] field = null;

			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
				field = new String[] { "skuCode", "ignoreSkuName", "ignoreSpec", "newPurPrice", "newSalePrice",
						"newDcPrice", "newWsPrice", "newVipPrice" };
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
				field = new String[] { "barCode", "ignoreSkuName", "ignoreSpec", "newPurPrice", "newSalePrice",
						"newDcPrice", "newWsPrice", "newVipPrice" };
			}

			GoodsSelectImportVo<GoodsSelect> vo = goodsSelectImportComponent.importSelectGoodsMultiBranch(fileName, is,
					field, new GoodsSelectPriceAdjst(), branchId, user.getId(), type,
					"/goods/priceAdjust/downloadErrorFile", new GoodsSelectImportBusinessValid() {

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
	 * @Description: 导入错误excel下载
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
			columns = new String[] { "skuCode", "ignoreSkuName", "ignoreSpec", "newPurPrice", "newSalePrice",
					"newDcPrice", "newWsPrice", "newVipPrice" };
			headers = new String[] { "货号", "商品名称", "规格", "新进货价", "新零售价", "新配送价", "新批发价", "新会员价" };
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
			columns = new String[] { "barCode", "ignoreSkuName", "ignoreSpec", "newPurPrice", "newSalePrice",
					"newDcPrice", "newWsPrice", "newVipPrice" };
			headers = new String[] { "条码", "商品名称", "规格", "新进货价", "新零售价", "新配送价", "新批发价", "新会员价" };
		}

		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintReplace(java.lang.String)
	 */
	@Override
	protected Map<String, Object> getPrintReplace(String formNo) {
		Map<String, Object> replaceMap = new HashMap<String, Object>();
		GoodsPriceForm goodsPriceForm = goodsPriceAdustService.queryFormByFormNo(formNo);
		List<GoodsPriceFormBranch> goodsPriceFormBranch = goodsPriceAdustService.queryPriceFormBranch(formNo);
		// 调价单机构名显示
		StringBuffer branchName = new StringBuffer();
		if (!ListUtils.isEmptyList(goodsPriceFormBranch)) {
			for (int i = 0; i < goodsPriceFormBranch.size(); i++) {
				if (i != goodsPriceFormBranch.size() - 1) {
					branchName.append(goodsPriceFormBranch.get(i).getBranchName() + ",");
				} else {
					branchName.append(goodsPriceFormBranch.get(i).getBranchName());
				}
			}
		}
		if (goodsPriceForm != null) {
			// 调价设置显示
			StringBuffer priceSet = new StringBuffer();
			// if (goodsPriceForm.getIsModifyDcPrice() == 1) {
			// priceSet.append("	配送价	");
			// }
			// if (goodsPriceForm.getIsModifyPurPrice() == 1) {
			// priceSet.append("	采购价	");
			// }
			// if (goodsPriceForm.getIsModifySalePrice() == 1) {
			// priceSet.append("	销售价	");
			// }
			// if (goodsPriceForm.getIsModifyVipPrice() == 1) {
			// priceSet.append("	会员价	");
			// }
			// if (goodsPriceForm.getIsModifyWsPrice() == 1) {
			// priceSet.append("	配送价	");
			// }
			replaceMap.put("_单号", goodsPriceForm.getFormNo());
			replaceMap.put("_区域", goodsPriceForm.getBranchAreaName());
			replaceMap.put("_生效日期", goodsPriceForm.getEffectDate());
			replaceMap.put("_分店列表", branchName != null ? branchName : "");
			replaceMap.put("_备注", goodsPriceForm.getRemark() != null ? goodsPriceForm.getRemark() : "");
			replaceMap.put("_制单人员", goodsPriceForm.getCreateUserName() != null ? goodsPriceForm.getCreateUserName()
					: "");
			replaceMap.put("_制单日期", goodsPriceForm.getCreateTime());
			replaceMap.put("_审核人员", goodsPriceForm.getValidUserName() != null ? goodsPriceForm.getValidUserName() : "");
			replaceMap.put("_审核日期", goodsPriceForm.getValidTime() != null ? goodsPriceForm.getValidTime() : "");
			replaceMap.put("_调价设置", priceSet);
		}
		return replaceMap;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getPrintDetail(java.lang.String)
	 */
	@Override
	protected List<GoodsPriceFormDetail> getPrintDetail(String formNo) {
		// 根据formNo得到详情数据
		List<GoodsPriceFormDetail> goodsPriceFormDetailList = goodsPriceAdustService.queryDetailsByFormNo(formNo);
		cleanAccessData(goodsPriceFormDetailList);
		return goodsPriceFormDetailList;
	}

	/**
	 * (non-Javadoc)
	 * @see com.okdeer.jxc.common.controller.BasePrintController#getBranchSpecService()
	 */
	@Override
	protected BranchSpecServiceApi getBranchSpecService() {
		return null;
	}
}
