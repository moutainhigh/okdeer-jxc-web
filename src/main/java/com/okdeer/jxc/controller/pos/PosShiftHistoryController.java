package com.okdeer.jxc.controller.pos;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.ss.formula.functions.T;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.base.redis.IRedisTemplateWrapper;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.pos.entity.PosLoginInfo;
import com.okdeer.jxc.pos.entity.PosShiftHistoryExt;
import com.okdeer.jxc.pos.enums.ShiftTypeEnum;
import com.okdeer.jxc.pos.service.PosShiftHistoryServiceApi;
import com.okdeer.jxc.pos.vo.PosShiftHistoryVo;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: PosBindController 
 * @Description: POS绑定Controller 
 * @author yangyq02
 * @date 2016年11月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@Controller
@RequestMapping("pos/shiftHistory")
public class PosShiftHistoryController extends BaseController<T> {

	@Reference(version = "1.0.0", check = false)
	private PosShiftHistoryServiceApi posShiftHistoryServiceApi;
	@Reference(version = "1.0.0", check = false)
	com.okdeer.jxc.pos.service.PosLoginInfoServiceApi posLoginInfoServiceApi;
	@Resource
	private IRedisTemplateWrapper<String, String> redisTemplateWrapper;
	/**
	 * @Description: 显示列表页面
	 * @param type
	 * @param model
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		return "pos/shiftHistoryList";
	}

	/**
	 * @Description: 跳转到添加页面
	 * @param type
	 * @param model
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年10月13日
	 */
	@RequestMapping(value = "add")
	public String add(Model model) {
		return "pos/registerAdd";
	}

	@RequestMapping(value = "edit")
	public String edit(Model model) {
		return "pos/registeredit";
	}

	@RequestMapping(value = "queryList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<Map<String,Object>> queryList(PosShiftHistoryVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			LOG.debug("qo:" + vo.toString());
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			vo.setBranchCompleCode(UserUtil.getCurrBranchCompleCode());
			PageUtils<Map<String,Object>> page = posShiftHistoryServiceApi.queryLists(vo);
			LOG.debug("page" + page.toString());
			return page;
		} catch (RuntimeException e) {
			LOG.error("删除成本调整单失败！:{}", e);
			return null;
		} catch (Exception e) {
			LOG.error("删除成本调整单失败！:{}", e);
			return null;
		}
	}

	/**
	 * @Description: 店长交班
	 * @param posRegister
	 * @return   
	 * @return RespJson  
	 * @throws
	 * @author yangyq02
	 * @date 2016年11月30日
	 */
	@RequestMapping(value = "shiftExchange", method = RequestMethod.POST)
	@ResponseBody
	public RespJson shiftExchange(String id) {
		try {
			//根据班次获取用户信息
			PosLoginInfo logininfo= posLoginInfoServiceApi.getLoginInfoByShift( id);

			RespJson json= posShiftHistoryServiceApi.changeShifts(id, UserUtil.getCurrBranchId(), UserUtil.getCurrUserId(),
					ShiftTypeEnum.SHOPKEEPER.getValue());
			//注销掉redis
			try {
				redisTemplateWrapper.del(logininfo.getToken());
			} catch (Exception e) {
				LOG.error("Redis删除token失败", e);
			}
			return json;
		} catch (RuntimeException e) {
			LOG.error("添加POS登记失败！:{}", e);
			return null;
		} catch (Exception e) {
			LOG.error("添加POS登记失败！:{}", e);
			return RespJson.error("添加POS登记失败！");
		}
	}
	@RequestMapping(value = "shiftDetail")
	public String getShift(Model model,String id){
		PosShiftHistoryExt  shift=posShiftHistoryServiceApi.getCalculationShiftInfo(id);
		model.addAttribute("shift", shift);
		return "pos/shiftDetail";
	}

}
