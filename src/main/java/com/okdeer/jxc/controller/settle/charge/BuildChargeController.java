/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年5月22日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.settle.charge;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.common.utils.gson.GsonUtils;
import com.okdeer.jxc.common.vo.UpdateStatusVo;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.settle.charge.po.BuildChargeDetailPo;
import com.okdeer.jxc.settle.charge.po.BuildChargePo;
import com.okdeer.jxc.settle.charge.qo.BuildChargeQo;
import com.okdeer.jxc.settle.charge.service.BuildChargeService;
import com.okdeer.jxc.settle.charge.vo.BuildChargeVo;

/**
 * ClassName: BuildChargeController 
 * @Description: 建店费用登记Controller
 * @author liwb
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("finance/buildCharge")
public class BuildChargeController extends BaseController<BuildChargeController> {

	@Reference(version = "1.0.0", check = false)
	private BuildChargeService buildChargeService;

	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("finance/buildCharge/buildChargeList");
	}

	@RequestMapping(value = "toAdd")
	public ModelAndView toAdd() {
		return new ModelAndView("finance/buildCharge/buildChargeAdd");
	}

	@RequestMapping(value = "toEdit")
	public ModelAndView toEdit(String formId) {

		if (StringUtils.isBlank(formId)) {
			return super.toErrorPage("单据ID为空");
		}

		BuildChargePo po = buildChargeService.getBuildChargeById(formId);
		
		if(po == null){
			return super.toErrorPage("单据不存在，请刷新后重试！");
		}

		ModelAndView mv = new ModelAndView("finance/buildCharge/buildChargeEdit");
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

	@RequestMapping(value = "getBuildChargeList", method = RequestMethod.POST)
	public PageUtils<BuildChargePo> getBuildChargeList(BuildChargeQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);

		// 构建查询参数
		buildSearchParams(qo);
		LOG.debug("查询建店费用条件：{}", qo);

		try {

			return buildChargeService.getBuildChargeForPage(qo);
		} catch (Exception e) {
			LOG.error("分页查询建店费用异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 构建查询参数
	 * @param qo
	 * @author liwb
	 * @date 2017年5月31日
	 */
	private void buildSearchParams(BuildChargeQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}

		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

	@RequestMapping(value = "getDetailList", method = RequestMethod.POST)
	public PageUtils<BuildChargeDetailPo> getDetailList(String formId) {

		LOG.debug("获取建店费用详情信息列表 ，建店费用单ID：{}", formId);

		try {

			List<BuildChargeDetailPo> list = buildChargeService.getDetailListByFormId(formId);

			return new PageUtils<BuildChargeDetailPo>(list);

		} catch (Exception e) {
			LOG.error("获取建店费用详情信息列表异常：", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "addBuildCharge", method = RequestMethod.POST)
	public RespJson addBuildCharge(@RequestBody String jsonText) {
		LOG.debug("新增建店费用参数：{}", jsonText);
		try {

			BuildChargeVo vo = GsonUtils.fromJson(jsonText, BuildChargeVo.class);
			vo.setCreateUserId(super.getCurrUserId());

			return buildChargeService.addBuildCharge(vo);

		} catch (Exception e) {
			LOG.error("新增建店费用失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "updateBuildCharge", method = RequestMethod.POST)
	public RespJson updateBuildCharge(@RequestBody String jsonText) {
		LOG.debug("修改建店费用参数：{}", jsonText);
		try {

			BuildChargeVo vo = GsonUtils.fromJson(jsonText, BuildChargeVo.class);
			vo.setUpdateUserId(super.getCurrUserId());

			return buildChargeService.updateBuildCharge(vo);

		} catch (Exception e) {
			LOG.error("修改建店费用失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "checkBuildCharge", method = RequestMethod.POST)
	public RespJson checkBuildCharge(String formId) {
		LOG.debug("审核建店费用ID：{}", formId);
		try {

			UpdateStatusVo vo = new UpdateStatusVo();
			vo.setId(formId);
			vo.setUpdateUserId(super.getCurrUserId());

			return buildChargeService.checkBuildCharge(vo);

		} catch (Exception e) {
			LOG.error("审核建店费用失败：", e);
		}
		return RespJson.error();
	}

	@RequestMapping(value = "deleteBuildCharge", method = RequestMethod.POST)
	public RespJson deleteBuildCharge(String formId) {
		LOG.debug("删除建店费用ID：{}", formId);
		try {

			UpdateStatusVo vo = new UpdateStatusVo();
			vo.setId(formId);
			vo.setUpdateUserId(super.getCurrUserId());

			return buildChargeService.deleteBuildCharge(vo);

		} catch (Exception e) {
			LOG.error("删除建店费用失败：", e);
		}
		return RespJson.error();
	}

//	@RequestMapping(value = "exportList")
//	public RespJson exportList(String formId, HttpServletResponse response) {
//		try {
//
//			LOG.debug("导出建店费用单据Id：{}", formId);
//
//			List<BuildChargeDetailPo> list = BuildChargeService.getDetailListByFormId(formId);
//
//			RespJson respJson = super.validateExportList(list);
//			if (!respJson.isSuccess()) {
//				LOG.info(respJson.getMessage());
//				return respJson;
//			}
//
//			// 导出文件名称，不包括后缀名
//			String fileName = "门店运营费用详情列表" + "_" + DateUtils.getCurrSmallStr();
//
//			// 模板名称，包括后缀名
//			String templateName = ExportExcelConstant.STORE_CHARGE_MAIN_EXPORT_TEMPLATE;
//			
//			// 导出Excel			
//			Map<String, Object> param = new HashMap<>();
//			param.put("titleName", "门店运营费用");
//			param.put("header", "费用");
//			exportParamListForXLSX(response, list, param, fileName, templateName);
//
//			return RespJson.success();
//
//		} catch (Exception e) {
//			LOG.error("导出门店运营费用单据失败：", e);
//		}
//		return RespJson.error();
//	}
//
//	@RequestMapping(value = "importList")
//	public RespJson importList(@RequestParam("file") MultipartFile file) {
//		RespJson respJson = RespJson.success();
//		try {
//			if (file.isEmpty()) {
//				return RespJson.error("文件为空");
//			}
//
//			// 文件流
//			InputStream is = file.getInputStream();
//
//			// 获取文件名
//			String fileName = file.getOriginalFilename();
//
//			// // 文件流
//			// InputStream tempIs = file.getInputStream();
//			// 获取标题
//			// List<String> firstColumn = ExcelReaderUtil.readXlsxTitle(tempIs);
//
//			String[] fields = ImportExcelConstant.STORE_CHARGE_FIELDS;
//
//			ChargeImportBusinessValid businessValid = new ChargeImportBusinessValid();
//
//			ChargeImportVo importVo = chargeImportComponent.importSelectCharge(fileName, is, fields,
//					super.getCurrUserId(), "/finance/BuildCharge/downloadErrorFile", businessValid, SysConstant.DICT_TYPE_STORE_CHARGE_CODE);
//
//			respJson.put("importInfo", importVo);
//        } catch (BusinessException e) {
//            respJson = RespJson.error(e.getMessage());
//		} catch (IOException e) {
//			respJson = RespJson.error("读取Excel流异常");
//			LOG.error("读取Excel流异常", e);
//		} catch (Exception e) {
//			respJson = RespJson.error("导入发生异常");
//			LOG.error("用户导入异常", e);
//		}
//		return respJson;
//	}
//
//	/**
//	 * @Description: 错误信息下载
//	 * @param code
//	 * @param type
//	 * @param response
//	 * @author zhangchm
//	 * @date 2016年10月15日
//	 */
//	@RequestMapping(value = "downloadErrorFile")
//	public void downloadErrorFile(HttpServletResponse response) {
//		String reportFileName = "错误数据";
//
//		String[] headers = ImportExcelConstant.STORE_CHARGE_HEADERS;
//		String[] columns = ImportExcelConstant.STORE_CHARGE_FIELDS;
//
//		chargeImportComponent.downloadErrorFile(super.getCurrUserId(), reportFileName, headers, columns, response);
//	}
//
//	@RequestMapping(value = "exportTemp")
//	public void exportTemp(HttpServletResponse response) {
//		LOG.debug("导出建店费用导入模板请求参数");
//		try {
//			String fileName = "建店费用详情导入模板";
//			String templateName = ExportExcelConstant.STORE_CHARGE_MAIN_IMPORT_TEMPLATE;
//			if (!StringUtils.isEmpty(fileName) && !StringUtils.isEmpty(templateName)) {
//				exportListForXLSX(response, null, fileName, templateName);
//			}
//		} catch (Exception e) {
//			LOG.error("导出建店费用导入模板异常:{}", e);
//		}
//	}

}
