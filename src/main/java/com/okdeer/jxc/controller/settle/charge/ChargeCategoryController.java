package com.okdeer.jxc.controller.settle.charge;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.charge.entity.ChargeCategory;

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
@RestController
@RequestMapping("/settle/charge/chargeCategory")
public class ChargeCategoryController extends BaseController<ChargeCategoryController> {

	/**
	 * @Description: 机构开店费用类别页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2017年12月6日
	 */
	@RequestMapping(value = "views")
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

	@RequestMapping(value = "/addCategory", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addCategory(@Valid ChargeCategory goodsCategory) {
		return RespJson.error();
	}

	@RequestMapping(value = "/updateCategory", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateCategory(@Valid ChargeCategory goodsCategory) {
		return RespJson.error();
	}
}
