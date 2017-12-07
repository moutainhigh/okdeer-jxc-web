package com.okdeer.jxc.controller.settle.charge;

import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.charge.entity.Charge;
import com.okdeer.retail.common.page.PageUtils;

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
@RequestMapping("/settle/charge/charge")
public class ChargeController extends BaseController<ChargeController> {

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
		return "settle/charge/charge";
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
		return "settle/charge/chargeAdd";
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
		return "settle/charge/chargeUpdate";
	}

	@RequestMapping(value = "publicView", method = RequestMethod.POST)
	public String publicView() {
		return "settle/charge/public/publicCharge";
	}

	@RequestMapping(value = "/addCharge", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addCategory(@Valid Charge charge) {
		return RespJson.error();
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<Charge> list(@Valid Charge charge) {
		return null;
	}
	@RequestMapping(value = "/updateCharge", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateCategory(@Valid Charge charge) {
		return RespJson.error();
	}
}
