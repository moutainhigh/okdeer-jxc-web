package com.okdeer.jxc.controller.settle.charge;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.TreeUtils;
import com.okdeer.jxc.common.utils.entity.Tree;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.settle.charge.entity.ChargeCategory;
import com.okdeer.jxc.settle.charge.qo.ChargeCategoryQo;
import com.okdeer.jxc.settle.charge.service.ChargeCategoryService;

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
	@RequestMapping(value = "addView")
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
	@RequestMapping(value = "updateView")
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
	@RequestMapping(value = "/publicView",method = RequestMethod.GET)
	public String publicView() {
		return "settle/charge/public/publicChargeCategory";
	}

	@RequestMapping(value = "/addCategory", method = RequestMethod.POST)
	@ResponseBody
	public RespJson addCategory(ChargeCategory chargeCategory) {
		// 校验基本数据
		RespJson json = validateParm(chargeCategory);
		if (!json.isSuccess()) {
			return json;
		}
		return chargeCategoryService.addChargeCategory(chargeCategory);
	}

	@RequestMapping(value = "/updateCategory", method = RequestMethod.POST)
	@ResponseBody
	public RespJson updateCategory(ChargeCategory chargeCategory) {
		// 校验基本数据
		RespJson json = validateParm(chargeCategory);
		if (!json.isSuccess()) {
			return json;
		}
		return chargeCategoryService.updateChargeCategory(chargeCategory);
	}

	@RequestMapping(value = "/deleteCategoryCode", method = RequestMethod.POST)
	@ResponseBody
	public RespJson deleteCategoryCode(String[] ids) {
		// 校验基本数据
		return chargeCategoryService.deleteCharge(Arrays.asList(ids));
	}

	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<ChargeCategory> list(ChargeCategoryQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		qo.setPageNumber(pageNumber);
		qo.setPageSize(pageSize);
		/*List<String> list=new ArrayList<>();
		list.add("3");
		qo.setLevels(list);*/
		return chargeCategoryService.queryLists(qo);
	}

	@RequestMapping(value = "getCategoryToTree")
	@ResponseBody
	public String getCategoryToTree(ChargeCategoryQo qo) {
		List<Tree> trees = chargeCategoryService.queryCategoryToTree(qo);
		Tree tree=null;
		if (trees.size() == 0) {
			tree = new Tree();
			tree.setId("0");
			tree.setCode("0");
			tree.setCodeText("所有[0]");
			tree.setLevel(0);
			tree.setText("所有");
		}
		trees = TreeUtils.getTree(trees);
		if (trees.size() == 0) {
			trees.add(0, tree);
		}
		return JSON.toJSONString(trees);
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
	private RespJson validateParm(ChargeCategory chargeCategory) {
		if (chargeCategory == null) {
			return RespJson.error("参数不允许为null");
		}
		if (StringUtils.isEmpty(chargeCategory.getParentId())) {
			return RespJson.error("父类ID不允许为null");
		}
		if (StringUtils.isEmpty(chargeCategory.getCategoryName())) {
			return RespJson.error("类别名称不允许为空");
		}
		chargeCategory.setCreateUserId(this.getCurrUserId());
		return RespJson.success();
	}
}
