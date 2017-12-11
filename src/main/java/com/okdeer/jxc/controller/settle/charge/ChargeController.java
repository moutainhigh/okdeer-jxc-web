package com.okdeer.jxc.controller.settle.charge;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.gson.GsonUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.charge.entity.Charge;
import com.okdeer.jxc.settle.charge.qo.ChargeQo;
import com.okdeer.jxc.settle.charge.service.ChargeService;

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
	@RequestMapping(value = "/view")
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
	@RequestMapping(value = "/addView")
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
	@RequestMapping(value = "/updateView")
	public String updateView() {
		return "settle/charge/chargeUpdate";
	}

	@RequestMapping(value = "publicView")
	public String publicView() {
		return "settle/charge/public/publicCharge";
	}

	@RequestMapping(value = "/addCharge", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addCharge(@RequestBody String jsonText) {
		LOG.debug("新增建店费档案费用参数：{}", jsonText);
		try {
			Charge charge = JSON.parseObject(jsonText, Charge.class);
			RespJson json = validateParm(charge);
			if (!json.isSuccess()) {
				return json;
			}
			charge.setCreateUserId(this.getCurrUserId());
			return chargeService.addCharge(charge);
		} catch (Exception e) {
			LOG.error("新增建店费档案费用异常{}", e);
			return RespJson.error("新增建店费档案费用异常");
		}
	}

	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<Charge> list(ChargeQo qo, @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);
		return chargeService.queryLists(qo);
	}

	@RequestMapping(value = "/updateCharge", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateCategory(@RequestBody String jsonText) {
		try {
			Charge charge = JSON.parseObject(jsonText, Charge.class);
			RespJson json = validateParm(charge);
			if (StringUtils.isEmpty(charge.getId())) {
				return RespJson.error("id不允许为空");
			}
			if (!json.isSuccess()) {
				return json;
			}
			charge.setUpdateUserId(this.getCurrUserId());
			return chargeService.updateCharge(charge);
		} catch (Exception e) {
			LOG.error("修改建店费档案费用异常{}", e);
			return RespJson.error("修改建店费档案费用异常");
		}
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
		/*if (StringUtils.isEmpty(charge.getId())) {
			return RespJson.error("id不允许为空");
		}*/
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
