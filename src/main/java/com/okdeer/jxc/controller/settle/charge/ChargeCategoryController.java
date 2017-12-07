package com.okdeer.jxc.controller.settle.charge;

import java.util.List;

import javax.validation.Valid;

import net.sf.json.JSONArray;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.charge.entity.ChargeCategory;
import com.okdeer.jxc.settle.charge.qo.ChargeCategoryQo;
import com.okdeer.jxc.settle.charge.service.ChargeCategoryService;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.TreeUtils;
import com.okdeer.jxc.common.utils.entity.Tree;


/**
 * ClassName: ChargeCategoryController 
 * @Description: 机构开店费用类别
 * @author yangyq02
 * @date 2017年12月7日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("/settle/charge/chargeCategory")
public class ChargeCategoryController extends BaseController<ChargeCategoryController> {

	@Reference(version = "1.0.0", check = false)
	ChargeCategoryService chargeCategoryService;

	/**
	 * @Description: 机构开店费用类别页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "view")
	public String views() {
		return "settle/charge/chargeCategory";
	}

	/**
	 * @Description: 新增跳转页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "addView", method = RequestMethod.POST)
	public String addView() {
		return "settle/charge/chargeCategoryAdd";
	}

	/**
	 * @Description: 修改跳转页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "updateView", method = RequestMethod.POST)
	public String updateView() {
		return "settle/charge/chargeCategoryUpdate";
	}

	/**
	 * @Description: 类别选择公共组件
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2017年12月7日
	 */
	@RequestMapping(value = "publicView", method = RequestMethod.POST)
	public String publicView() {
		return "settle/charge/public/publicChargeCategory";
	}

	@RequestMapping(value = "/addCategory", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addCategory(@Valid ChargeCategory chargeCategory) {
		// 校验基本数据
		return chargeCategoryService.addCharge(chargeCategory);
	}

	@RequestMapping(value = "/updateCategory", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateCategory(@Valid ChargeCategory chargeCategory) {
		// 校验基本数据
		return chargeCategoryService.updateCharge(chargeCategory);
	}

	@RequestMapping(value = "/deleteCategoryCode", method = RequestMethod.POST)
	@ResponseBody
	public RespJson deleteCategoryCode(List<String> ids) {
		// 校验基本数据
		return chargeCategoryService.deleteCharge(ids);
	}

	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<ChargeCategory> list( ChargeCategoryQo qo) {
		return chargeCategoryService.queryLists(qo);
	}

	@RequestMapping(value = "getCategoryToTree")
	@ResponseBody
	public String getCategoryToTree(ChargeCategoryQo qo) {
		
//		List<Tree> trees = chargeCategoryService.queryGoodsCategoryToTree(qo);
//		trees = TreeUtils.getTree(trees);
//		return JSONArray.fromObject(trees).toString();
		return null;
	}
}
