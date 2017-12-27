/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2017年5月22日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.archive;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.SysConstant;
import com.okdeer.jxc.common.enums.FmRefundTypeEnum;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.common.vo.UpdateStatusVo;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.system.entity.SysDict;
import com.okdeer.jxc.system.entity.SysDictType;
import com.okdeer.jxc.system.qo.SysDictQo;
import com.okdeer.jxc.system.service.SysDictService;
import com.okdeer.jxc.system.vo.SysDictVo;

/**
 * ClassName: FinancialCodeController 
 * @Description: 财务代码Controller
 * @author liwb
 * @date 2017年5月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RestController
@RequestMapping("archive/financeCode")
public class FinanceCodeController extends BaseController<FinanceCodeController> {

	@Reference(version = "1.0.0", check = false)
	private SysDictService sysDictService;

	@RequestMapping(value = "toManager")
	public ModelAndView toManager() {
		return new ModelAndView("archive/financeCode/financeList");
	}

	@RequestMapping(value = "toAdd")
	public ModelAndView toAdd(String dictTypeCode) {
		ModelAndView mv = new ModelAndView("archive/financeCode/editFinance");
		// POS付款方式 需要把退货类型枚举列表传给前端
		if(StringUtils.isNotBlank(dictTypeCode) && SysConstant.DICT_TYPE_POS_PAYMENT_CODE.equals(dictTypeCode)){
			mv.addObject("refundTypeList", FmRefundTypeEnum.values());
		}
		mv.addObject("dictTypeCode", dictTypeCode);
		return mv;
	}

	@RequestMapping(value = "getDictById")
	public RespJson getDictById(String dictId) {
		if (StringUtils.isBlank(dictId)) {
			return RespJson.error("字典id为空");
		}

		LOG.debug("字典Id：{}", dictId);
		try {
			SysDict sysDict = sysDictService.getById(dictId);

			RespJson respJson = RespJson.success(sysDict);
			return respJson;
		} catch (Exception e) {
			LOG.error("获取财务代码详情错误：", e);
		}

		return RespJson.error();
	}

	/**
	 * @Description: 获取财务代码树形结构
	 * @return
	 * @author liwb
	 * @date 2017年5月24日
	 */
	@RequestMapping(value = "getFinanceCodeToTree")
	public String getFinanceCodeToTree() {
		try {

			return sysDictService.getFinanceCodeToTree();

		} catch (Exception e) {
			LOG.error("查询财务代码树形结构异常:", e);
		}
		return StringUtils.EMPTY;
	}

	/**
	 * @Description: 分页查询财务代码
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 * @author liwb
	 * @date 2017年5月24日
	 */
	@RequestMapping(value = "getDictList", method = RequestMethod.POST)
	public PageUtils<SysDict> getDictList(SysDictQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {

		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);
		LOG.debug("查询财务代码条件：{}", qo);

		try {
			
			return sysDictService.getFinanceCodeForPage(qo);
		} catch (Exception e) {
			LOG.error("分页查询财务代码异常:", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "exportHandel", method = RequestMethod.POST)
	public RespJson exportHandel(SysDictQo qo, HttpServletResponse response) {
		try {
			LOG.debug("导出财务代码条件：{}", qo);

			List<SysDict> list = sysDictService.getFinanceCodeForExport(qo);

			RespJson respJson = super.validateExportList(list);
			if (!respJson.isSuccess()) {
				LOG.info(respJson.getMessage());
				return respJson;
			}

			// 导出文件名称，不包括后缀名
			String fileName = "财务代码列表_" + DateUtils.getCurrSmallStr();

			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.FINANCE_CODE_EXPORT_TEMPLATE;

			// 导出Excel
			exportListForXLSX(response, list, fileName, templateName);
			return null;

		} catch (Exception e) {
			LOG.error("导出财务代码失败", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 新增财务代码信息
	 * @param sysDict
	 * @return
	 * @author liwb
	 * @date 2017年5月24日
	 */
	@RequestMapping(value = "addFinanceCode", method = RequestMethod.POST)
	public RespJson addFinanceCode(SysDict sysDict) {
		LOG.debug("新增财务代码参数：{}", sysDict);
		try {

			sysDict.setCreateUserId(super.getCurrUserId());
			return sysDictService.addFinanceCode(sysDict);

		} catch (Exception e) {
			LOG.error("新增财务代码失败：", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 修改财务代码信息
	 * @param sysDict
	 * @return
	 * @author liwb
	 * @date 2017年5月24日
	 */
	@RequestMapping(value = "updateFinanceCode", method = RequestMethod.POST)
	public RespJson updateFinanceCode(SysDict sysDict) {
		LOG.debug("修改财务代码参数：{}", sysDict);
		try {

			sysDict.setUpdateUserId(super.getCurrUserId());
			return sysDictService.updateFinanceCode(sysDict);

		} catch (Exception e) {
			LOG.error("修改财务代码失败：", e);
		}
		return RespJson.error();
	}

	/**
	 * @Description: 批量删除财务代码
	 * @param idList
	 * @return
	 * @author liwb
	 * @date 2017年5月24日
	 */
	@RequestMapping(value = "deleteFinanceCode", method = RequestMethod.POST)
	public RespJson deleteFinanceCode(String ids) {

		if (StringUtils.isBlank(ids)) {
			return RespJson.businessError("ID列表为空");
		}

		LOG.debug("批量删除财务代码参数：{}", ids);

		List<String> idList = Arrays.asList(ids.split(","));

		try {

			SysDictVo vo = new SysDictVo();
			vo.setUpdateUserId(super.getCurrUserId());
			vo.setIdList(idList);

			return sysDictService.deleteFinanceCode(vo);

		} catch (Exception e) {
			LOG.error("批量删除财务代码失败：", e);
		}
		return RespJson.error();
	}

	   /**
     * @Description: 代码
     * @param qo
     * @param pageNumber
     * @param pageSize
     * @return
     * @author liwb
     * @date 2017年5月24日
     */
    @RequestMapping(value = "getDictListByTypeCode", method = RequestMethod.POST)
    public List<SysDict> getDictListByTypeCode(String dictTypeCode) {
        LOG.debug("支付方式dictType：{}", dictTypeCode);
        try {
            SysDictQo qo = new SysDictQo();
            qo.setTypeCode(dictTypeCode);
            return sysDictService.getFinanceCodeForExport(qo);
        } catch (Exception e) {
            LOG.error("分页查询财务代码异常:", e);
        }
        return new ArrayList<SysDict>();
    }
    
    
    @RequestMapping(value = "addDictType", method = RequestMethod.POST)
	public RespJson addDictType(SysDictType dictType) {
		LOG.debug("新增字典类型参数：{}", dictType);
		try {

			dictType.setCreateUserId(super.getCurrUserId());
			return sysDictService.addSysDictType(dictType);

		} catch (Exception e) {
			LOG.error("新增字典类型失败：", e);
		}
		return RespJson.error();
	}
    
    @RequestMapping(value = "deleteDictType", method = RequestMethod.POST)
	public RespJson deleteDictType(String id) {
    	
    	LOG.debug("删除字典类型参数：{}", id);

		if (StringUtils.isBlank(id)) {
			return RespJson.businessError("ID为空");
		}

		try {

			UpdateStatusVo vo = new UpdateStatusVo();
			vo.setUpdateUserId(super.getCurrUserId());
			vo.setId(id);

			return sysDictService.deleteSysDictType(vo);

		} catch (Exception e) {
			LOG.error("删除字典类型失败：", e);
		}
		return RespJson.error();
	}
}
