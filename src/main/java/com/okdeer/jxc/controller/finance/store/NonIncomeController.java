/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年5月22日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.finance.store;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.okdeer.jxc.common.constant.SysConstant;
import com.okdeer.jxc.common.enums.StoreChargeEnum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.chargeImport.ChargeImportBusinessValid;
import com.okdeer.jxc.common.chargeImport.ChargeImportComponent;
import com.okdeer.jxc.common.chargeImport.ChargeImportVo;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.ImportExcelConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.common.utils.gson.GsonUtils;
import com.okdeer.jxc.common.vo.UpdateStatusVo;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.settle.store.po.StoreChargeDetailPo;
import com.okdeer.jxc.settle.store.po.StoreChargePo;
import com.okdeer.jxc.settle.store.qo.StoreChargeQo;
import com.okdeer.jxc.settle.store.service.StoreChargeService;
import com.okdeer.jxc.settle.store.vo.StoreChargeVo;

/**
 * ClassName: NonIncomeController 
 * @Description: 营业外收入Controller
 * @author zhengwj
 * @date 2017年9月9日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("finance/nonIncome")
public class NonIncomeController extends BaseController<NonIncomeController> {

	@Reference(version = "1.0.0", check = false)
	private StoreChargeService storeChargeService;

	@Autowired
	private ChargeImportComponent chargeImportComponent;

	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("finance/nonIncome/incomeList");
	}

	@RequestMapping(value = "toAdd")
	public ModelAndView toAdd() {
		return new ModelAndView("finance/nonIncome/incomeAdd");
	}

	@RequestMapping(value = "toEdit")
	public ModelAndView toEdit(String formId) {

		if (StringUtils.isBlank(formId)) {
			return super.toErrorPage("单据ID为空");
		}

		StoreChargePo po = storeChargeService.getStoreChargeById(formId);

		ModelAndView mv = new ModelAndView("finance/nonIncome/incomeEdit");
		mv.addObject("form", po);

		// 待审核
		if (FormStatus.WAIT_CHECK.getValue().equals(po.getAuditStatus())) {
			mv.addObject("chargeStatus", "edit");
		}
		// 已审核
		else if (FormStatus.CHECK_SUCCESS.getValue().equals(po.getAuditStatus())) {
			mv.addObject("chargeStatus", "check");
		}

		return mv;
	}

	@RequestMapping(value = "getIncomeList", method = RequestMethod.POST)
	public PageUtils<StoreChargePo> getIncomeList(StoreChargeQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);

		// 构建查询参数
		buildSearchParams(qo);
		qo.setChargeType(StoreChargeEnum.NON_INCOME.getCode());
		LOG.debug("查询营业外收入条件：{}", qo);

		try {

			return storeChargeService.getStoreChargeForPage(qo);
		} catch (Exception e) {
			LOG.error("分页查询营业外收入异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author liwb
	 * @date 2017年5月31日
	 */
	private void buildSearchParams(StoreChargeQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

	@RequestMapping(value = "getDetailList", method = RequestMethod.POST)
	public PageUtils<StoreChargeDetailPo> getDetailList(String formId) {

		LOG.debug("获取营业外收入详情信息列表 ，营业外收入单ID：{}", formId);

		try {

			List<StoreChargeDetailPo> list = storeChargeService.getDetailListByFormId(formId);

			return new PageUtils<StoreChargeDetailPo>(list);

		} catch (Exception e) {
			LOG.error("获取营业外收入详情信息列表异常：", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "addIncome", method = RequestMethod.POST)
	public RespJson addIncome(@RequestBody String jsonText) {
		LOG.debug("新增营业外收入参数：{}", jsonText);
		try {

			StoreChargeVo vo = GsonUtils.fromJson(jsonText, StoreChargeVo.class);
			vo.setCreateUserId(super.getCurrUserId());

			vo.setChargeType(StoreChargeEnum.NON_INCOME.getCode());
			return storeChargeService.addStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("新增营业外收入失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "updateIncome", method = RequestMethod.POST)
	public RespJson updateIncome(@RequestBody String jsonText) {
		LOG.debug("修改营业外收入参数：{}", jsonText);
		try {

			StoreChargeVo vo = GsonUtils.fromJson(jsonText, StoreChargeVo.class);
			vo.setUpdateUserId(super.getCurrUserId());

			return storeChargeService.updateStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("修改营业外收入失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "checkIncome", method = RequestMethod.POST)
	public RespJson checkIncome(String formId) {
		LOG.debug("审核营业外收入ID：{}", formId);
		try {

			UpdateStatusVo vo = new UpdateStatusVo();
			vo.setId(formId);
			vo.setUpdateUserId(super.getCurrUserId());

			return storeChargeService.checkStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("审核营业外收入失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "deleteIncome", method = RequestMethod.POST)
	public RespJson deleteIncome(String formId) {
		LOG.debug("删除营业外收入ID：{}", formId);
		try {

			UpdateStatusVo vo = new UpdateStatusVo();
			vo.setId(formId);
			vo.setUpdateUserId(super.getCurrUserId());

			return storeChargeService.deleteStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("删除营业外收入失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "exportList")
	public RespJson exportList(String formId, HttpServletResponse response) {
		try {

			LOG.debug("导出营业外收入单据Id：{}", formId);

			List<StoreChargeDetailPo> list = storeChargeService.getDetailListByFormId(formId);

			RespJson respJson = super.validateExportList(list);
			if (!respJson.isSuccess()) {
				LOG.info(respJson.getMessage());
				return respJson;
			}

			// 导出文件名称，不包括后缀名
			String fileName = "营业外收入详情列表" + "_" + DateUtils.getCurrSmallStr();

			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.STORE_CHARGE_MAIN_EXPORT_TEMPLATE;

			// 导出Excel
			Map<String, Object> param = new HashMap<>();
			param.put("titleName", "营业外收入");
			param.put("header", "收入");
			exportParamListForXLSX(response, list, param, fileName, templateName);

			return RespJson.success();

		} catch (Exception e) {
			LOG.error("导出门店运营费用单据失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "importList")
	public RespJson importList(@RequestParam("file") MultipartFile file) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}

			// 文件流
			InputStream is = file.getInputStream();

			// 获取文件名
			String fileName = file.getOriginalFilename();

			// // 文件流
			// InputStream tempIs = file.getInputStream();
			// 获取标题
			// List<String> firstColumn = ExcelReaderUtil.readXlsxTitle(tempIs);

			String[] fields = ImportExcelConstant.STORE_CHARGE_FIELDS;

			ChargeImportBusinessValid businessValid = new ChargeImportBusinessValid();

			ChargeImportVo importVo = chargeImportComponent.importSelectCharge(fileName, is, fields,
					super.getCurrUserId(), "/finance/nonIncome/downloadErrorFile", businessValid,
					SysConstant.DICT_TYPE_NON_BUSINESS_INCOME_CODE);

			respJson.put("importInfo", importVo);
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("用户导入异常", e);
		}
		return respJson;
	}

	/**
	 * @Description: 错误信息下载
	 * @param code
	 * @param type
	 * @param response
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "downloadErrorFile")
	public void downloadErrorFile(HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = ImportExcelConstant.STORE_CHARGE_HEADERS;
		String[] columns = ImportExcelConstant.STORE_CHARGE_FIELDS;

		chargeImportComponent.downloadErrorFile(super.getCurrUserId(), reportFileName, headers, columns, response);
	}

	/**
	 * @Description: 配送要货导入模板
	 * @param response
	 * @param type
	 * @author zhangchm
	 * @date 2016年10月15日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response) {
		LOG.debug("导出营业外收入导入模板请求参数");
		try {
			String fileName = "营业外收入详情导入模板";
			String templateName = ExportExcelConstant.STORE_CHARGE_MAIN_IMPORT_TEMPLATE;
			if (!StringUtils.isEmpty(fileName) && !StringUtils.isEmpty(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出营业外收入导入模板异常:{}", e);
		}
	}

}
