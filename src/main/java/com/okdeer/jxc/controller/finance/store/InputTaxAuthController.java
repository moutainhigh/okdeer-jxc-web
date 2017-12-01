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

import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.SysConstant;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.enums.StoreChargeEnum;
import com.okdeer.jxc.common.exception.BusinessException;

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
 * ClassName: InputTaxAuthController 
 * @Description: 进项税额认证登记Controller
 * @author liwb
 * @date 2017年9月8日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
 
@RestController
@RequestMapping("finance/inputTaxAuth")
public class InputTaxAuthController extends BaseController<InputTaxAuthController> {

	@Reference(version = "1.0.0", check = false)
	private StoreChargeService storeChargeService;
	
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchService;

	@Autowired
	private ChargeImportComponent chargeImportComponent;

	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("finance/inputTaxAuth/inputTaxAuthList");
	}

	@RequestMapping(value = "toAdd")
	public ModelAndView toAdd() {
		return new ModelAndView("finance/inputTaxAuth/inputTaxAuthAdd");
	}

	@RequestMapping(value = "toEdit")
	public ModelAndView toEdit(String formId) {

		if (StringUtils.isBlank(formId)) {
			return super.toErrorPage("单据ID为空");
		}

		StoreChargePo po = storeChargeService.getStoreChargeById(formId);
		
		if(po == null){
			return super.toErrorPage("单据不存在，请刷新后重试！");
		}

		ModelAndView mv = new ModelAndView("finance/inputTaxAuth/inputTaxAuthEdit");
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

	@RequestMapping(value = "getFormList", method = RequestMethod.POST)
	public PageUtils<StoreChargePo> getFormList(StoreChargeQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		try {
			
			qo.setPageNumber(pageNumber);
			qo.setPageSize(pageSize);

			// 构建查询参数
			buildSearchParams(qo);
			qo.setChargeType(StoreChargeEnum.INPUT_TAX_AUTH.getCode());
			LOG.debug("查询进项税额认证条件：{}", qo);

			return storeChargeService.getStoreChargeForPage(qo);
		} catch (Exception e) {
			LOG.error("分页查询进项税额认证异常:", e);
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

		LOG.debug("获取进项税额认证详情信息列表 ，进项税额认证单ID：{}", formId);

		try {

			List<StoreChargeDetailPo> list = storeChargeService.getDetailListByFormId(formId);

			return new PageUtils<StoreChargeDetailPo>(list);

		} catch (Exception e) {
			LOG.error("获取进项税额认证详情信息列表异常：", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "addForm", method = RequestMethod.POST)
	public RespJson addForm(@RequestBody String jsonText) {
		LOG.debug("新增进项税额认证参数：{}", jsonText);
		try {

			StoreChargeVo vo = GsonUtils.fromJson(jsonText, StoreChargeVo.class);
			vo.setCreateUserId(super.getCurrUserId());
			
			String branchId = vo.getBranchId();
			if(StringUtils.isBlank(branchId)){
				return RespJson.businessError("机构为空");
			}
			
			
			Branches branch = branchService.getBranchInfoById(vo.getBranchId());
			
			if (branch == null) {
				return RespJson.businessError("所选机构不存在！");
			}
			
			// 只允许分公司
			if(!BranchTypeEnum.BRANCH_OFFICE.getCode().equals(branch.getType())){
				return RespJson.businessError("机构只能选择分公司"); 
			}

			vo.setChargeType(StoreChargeEnum.INPUT_TAX_AUTH.getCode());
			return storeChargeService.addStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("新增进项税额认证失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "updateForm", method = RequestMethod.POST)
	public RespJson updateForm(@RequestBody String jsonText) {
		LOG.debug("修改进项税额认证参数：{}", jsonText);
		try {

			StoreChargeVo vo = GsonUtils.fromJson(jsonText, StoreChargeVo.class);
			vo.setUpdateUserId(super.getCurrUserId());

			return storeChargeService.updateStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("修改进项税额认证失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "checkForm", method = RequestMethod.POST)
	public RespJson checkForm(String formId) {
		LOG.debug("审核进项税额认证ID：{}", formId);
		try {

			UpdateStatusVo vo = new UpdateStatusVo();
			vo.setId(formId);
			vo.setUpdateUserId(super.getCurrUserId());

			return storeChargeService.checkStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("审核进项税额认证失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "deleteForm", method = RequestMethod.POST)
	public RespJson deleteForm(String formId) {
		LOG.debug("删除进项税额认证ID：{}", formId);
		try {

			UpdateStatusVo vo = new UpdateStatusVo();
			vo.setId(formId);
			vo.setUpdateUserId(super.getCurrUserId());

			return storeChargeService.deleteStoreCharge(vo);

		} catch (Exception e) {
			LOG.error("删除进项税额认证失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "exportList")
	public RespJson exportList(String formId, HttpServletResponse response) {
		try {

			LOG.debug("导出进项税额认证单据Id：{}", formId);

			List<StoreChargeDetailPo> list = storeChargeService.getDetailListByFormId(formId);

			RespJson respJson = super.validateExportList(list);
			if (!respJson.isSuccess()) {
				LOG.info(respJson.getMessage());
				return respJson;
			}

			// 导出文件名称，不包括后缀名
			String fileName = "进项税额认证详情列表" + "_" + DateUtils.getCurrSmallStr();

			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.STORE_CHARGE_MAIN_EXPORT_TEMPLATE;

			// 导出Excel			
			Map<String, Object> param = new HashMap<>();
			param.put("titleName", "进项税额认证");
			param.put("header", "支出");
			exportParamListForXLSX(response, list, param, fileName, templateName);

			return RespJson.success();

		} catch (Exception e) {
			LOG.error("导出进项税额认证单据失败：", e);
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

			String[] fields = ImportExcelConstant.STORE_CHARGE_FIELDS;

			ChargeImportBusinessValid businessValid = new ChargeImportBusinessValid();

			ChargeImportVo importVo = chargeImportComponent.importSelectCharge(fileName, is, fields,
					super.getCurrUserId(), "/finance/inputTaxAuth/downloadErrorFile", businessValid, SysConstant.DICT_TYPE_INPUT_TAX_AUTH_CODE);

			respJson.put("importInfo", importVo);
        } catch (BusinessException e) {
            respJson = RespJson.error(e.getMessage());
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
		try {
			String fileName = "进项税额认证详情导入模板";
			String templateName = ExportExcelConstant.STORE_CHARGE_MAIN_IMPORT_TEMPLATE;
			if (!StringUtils.isEmpty(fileName) && !StringUtils.isEmpty(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出进项税额认证导入模板异常:{}", e);
		}
	}

}
