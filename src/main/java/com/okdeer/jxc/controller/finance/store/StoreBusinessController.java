/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhengwj
 *@Date: 2017年12月6日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.finance.store;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.common.utils.gson.GsonUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.settle.store.qo.StoreBusinessQo;
import com.okdeer.jxc.settle.store.service.StoreBusinessService;
import com.okdeer.jxc.settle.store.vo.StoreBusinessVo;

/**
 * ClassName: StoreBusinessController 
 * @Description: 门店经营数据controller
 * @author zhengwj
 * @date 2017年12月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("finance/storeBusiness")
public class StoreBusinessController extends BaseController<StoreBusinessController> {

	/**
	 * @Fields storeBusinessService : StoreBusinessService
	 */
	@Reference(version = "1.0.0", check = false)
	private StoreBusinessService storeBusinessService;

	/**
	 * @Description: 列表页面
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("finance/storeBusiness/storeBusinessList");
	}

	/**
	 * @Description: 新增页面
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "toAdd")
	public ModelAndView toAdd() {
		return new ModelAndView("finance/storeBusiness/storeBusinessAdd");
	}

	/**
	 * @Description: 详情页面
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "toEdit")
	public ModelAndView toEdit(String formId) {

		if (StringUtils.isBlank(formId)) {
			return super.toErrorPage("门店经营数据为空");
		}

		StoreBusinessVo vo = storeBusinessService.getStoreBusinessById(formId);

		if (vo == null) {
			return super.toErrorPage("门店经营数据不存在，请刷新后重试！");
		}

		ModelAndView mv = new ModelAndView("finance/storeBusiness/storeBusinessEdit");
		mv.addObject("form", vo);

		if (FormStatus.WAIT_CHECK.getValue().equals(vo.getAuditStatus())) {
			// 待审核
			mv.addObject("businessStatus", "edit");
		} else if (FormStatus.CHECK_SUCCESS.getValue().equals(vo.getAuditStatus())) {
			// 已审核
			mv.addObject("businessStatus", "check");
		}

		return mv;
	}

	/**
	 * @Description: 分页查询门店经营数据列表
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "getStoreBusinessList", method = RequestMethod.POST)
	public PageUtils<StoreBusinessVo> getStoreBusinessList(StoreBusinessQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);
		// 构建查询参数
		buildSearchParams(qo);
		LOG.debug("查询门店经营数据条件：{}", qo);
		try {
			return storeBusinessService.getStoreBusinessPage(qo);
		} catch (Exception e) {
			LOG.error("分页查询门店经营数据异常:", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * @Description: 构建查询参数
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	private void buildSearchParams(StoreBusinessQo qo) {
		// 默认当前机构
		if (StringUtils.isBlank(qo.getBranchCompleCode())) {
			qo.setBranchCompleCode(super.getCurrBranchCompleCode());
		}
		qo.setEndTime(DateUtils.getDayAfter(qo.getEndTime()));
	}

	/**
	 * @Description: 新增门店经营数据
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "addStoreBusiness", method = RequestMethod.POST)
	public RespJson addStoreBusiness(@RequestBody String jsonText) {
		LOG.debug("新增门店经营数据参数：{}", jsonText);
		try {
			StoreBusinessVo vo = GsonUtils.fromJson(jsonText, StoreBusinessVo.class);
			vo.setCreateUserId(super.getCurrUserId());
			return storeBusinessService.saveStoreBusiness(vo);
		} catch (Exception e) {
			LOG.error("新增门店经营数据失败：", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 修改门店经营数据
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "updateStoreBusiness", method = RequestMethod.POST)
	public RespJson updateStoreBusiness(@RequestBody String jsonText) {
		try {
			StoreBusinessVo vo = GsonUtils.fromJson(jsonText, StoreBusinessVo.class);
			vo.setUpdateUserId(super.getCurrUserId());
			return storeBusinessService.updateStoreBusiness(vo);
		} catch (Exception e) {
			LOG.error("修改门店经营数据失败：", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 审核门店经营数据
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "auditStoreBusiness", method = RequestMethod.POST)
	public RespJson auditStoreBusiness(String formId) {
		LOG.debug("审核门店经营数据ID：{}", formId);
		try {
			return storeBusinessService.auditStoreBusiness(formId, super.getCurrUserId());
		} catch (Exception e) {
			LOG.error("审核门店经营数据失败：", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 删除门店经营数据
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "deleteStoreBusiness", method = RequestMethod.POST)
	public RespJson deleteStoreBusiness(@RequestParam(value = "ids[]") List<String> ids) {
		LOG.debug("删除门店经营数据ID：{}", ids);
		try {
			return storeBusinessService.deleteStoreBusiness(ids, super.getCurrUserId());
		} catch (Exception e) {
			LOG.error("删除门店经营数据失败：", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 导出门店经营数据
	 * @author zhengwj
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "exportDetail")
	public RespJson exportDetail(String formId, HttpServletResponse response) {
		try {
			LOG.debug("导出门店经营数据单据Id：{}", formId);
			// 导出文件名称，不包括后缀名
			String fileName = "门店经营数据明细" + "_" + DateUtils.getCurrSmallStr();
			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.STORE_BUSINESS_DETAIL_EXPORT_TEMPLATE;
			StoreBusinessVo vo = storeBusinessService.getStoreBusinessById(formId);
			List<StoreBusinessVo> list = new ArrayList<>();
			list.add(vo);
			// 导出Excel
			exportListForXLSX(response, list, fileName, templateName);
			return RespJson.success();
		} catch (Exception e) {
			LOG.error("导出门店运营费用单据失败：", e);
		}
		return RespJson.error();
	}
}
