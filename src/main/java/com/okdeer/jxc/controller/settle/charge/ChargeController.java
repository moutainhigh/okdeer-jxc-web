package com.okdeer.jxc.controller.settle.charge;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.charge.entity.Charge;
import com.okdeer.jxc.settle.charge.service.ChargeService;
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

	@Reference(version = "1.0.0", check = false)
	ChargeService chargeService;

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
	@RequestMapping(value = "updateView")
	public String updateView() {
		return "settle/charge/chargeUpdate";
	}

	@RequestMapping(value = "publicView")
	public String publicView() {
		return "settle/charge/public/publicCharge";
	}

	@RequestMapping(value = "/addCharge", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addCategory(@Valid Charge charge) {
		RespJson json = validateParm(charge);
		if (!json.isSuccess()) {
			return json;
		}
		charge.setCategoryId(this.getCurrUserId());
		return chargeService.addCharge(charge);
	}

	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<Charge> list(Charge charge) {
		return null;
	}

	@RequestMapping(value = "/updateCharge", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateCategory(Charge charge) {
		RespJson json = validateParm(charge);
		if (!json.isSuccess()) {
			return json;
		}
		charge.setUpdateUserId(this.getCurrUserId());
		return chargeService.updateCharge(charge);
	}

	/**
	 * @Description: 验证基本参数
	 * @param chargeCategory
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2017年12月7日
	 */
	private RespJson validateParm(Charge charge) {
		if (charge == null) {
			return RespJson.error("参数不允许为null");
		}
		if (StringUtils.isEmpty(charge.getCategoryId())) {
			return RespJson.error("父类ID不允许为null");
		}
		if (StringUtils.isEmpty(charge.getChargeName())) {
			return RespJson.error("类别名称不允许为空");
		}
		charge.setCreateUserId(this.getCurrUserId());
		return RespJson.success();
	}
}
