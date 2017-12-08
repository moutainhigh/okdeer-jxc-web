/**
 *@Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 *@Project: okdeer-jxc-web
 *@Package: com.okdeer.jxc.controller.finance.iccard
 *@Author: songwj
 *@Date: 2017年5月19日 上午9:49:28
 *注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */

package com.okdeer.jxc.controller.finance.iccard;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Maps;
import com.okdeer.jxc.branch.entity.BranchSpec;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.FastJsonUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.finance.iccard.entity.ICCardDevice;
import com.okdeer.jxc.finance.iccard.entity.ICCardSetting;
import com.okdeer.jxc.finance.iccard.service.ICCardAccountService;
import com.okdeer.jxc.finance.iccard.service.ICCardSettingService;
import com.okdeer.jxc.finance.iccard.vo.ICCardAccountVo;
import com.okdeer.jxc.finance.iccard.vo.ICCardDeviceVo;
import com.okdeer.jxc.utils.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * @ClassName: ICcardSettingController
 * @Description:  一开通设置
 * @project okdeer-jxc-web
 * @author songwj
 * @date 2017年5月19日 上午9:49:28
 * =================================================================================================
 *     Task ID	         Date		  Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *     V2.6         	2017年5月19日		  songwj		  一开通设置
 */
@Controller
@RestController
@RequestMapping("iccard/setting")
public class ICCardSettingController extends BaseController<Object>{
	
	private static final Logger logger = LoggerFactory.getLogger(ICCardSettingController.class);
	
	@Reference(version = "1.0.0", check = false)
	private ICCardSettingService icCardSettingService;
	
	@Reference(version = "1.0.0", check = false)
	private ICCardAccountService icCardAccountService;
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public ModelAndView iccardSetting() {
		Map<String, Object> map = Maps.newConcurrentMap();
		BranchSpec branchSpec = icCardSettingService.selectBranchSpecByBranchId(UserUtil.getCurrentUser().getBranchId());
		map.put("enabled", branchSpec.getEcardEnabled());
		map.put("minAmount", branchSpec.getEcardMinAmount());
		return new ModelAndView("finance/iccard/iccardSetting",map);
	}
	
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public RespJson save(Byte enabled, BigDecimal minAmount, String selRows){
		List<ICCardSetting> icCardSettings =  com.alibaba.fastjson.JSON.parseArray(selRows, ICCardSetting.class);
		boolean bool = icCardSettingService.updateBranchSpec(UserUtil.getCurrentUser().getBranchId(), enabled, minAmount,icCardSettings);
        if (bool) {
            return RespJson.success("一卡通设置成功!");
        }
        return RespJson.error("一卡通设置失败!");
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public RespJson updateDetail(String settingId,String ip, int port,String cardType,String code) {
		ICCardSetting icCardSetting = new ICCardSetting();
		icCardSetting.setId(settingId);
		icCardSetting.setClearingCenterIp(ip);
		icCardSetting.setClearingCenterPort(port);
		//icCardSetting.setEcardType(cardType);
		icCardSetting.setOperationDeptCode(code);
		icCardSettingService.updateICCardSetting(icCardSetting);
		return RespJson.success("更新一卡通成功!");
	}
	
	@RequestMapping(value = "/type/save", method = RequestMethod.POST)
	public RespJson save(String ip, int port,String cardType,String code){
		
		if(icCardSettingService.isExistICCardSetting(UserUtil.getCurrentUser().getBranchId(), cardType)){
			return RespJson.error("一卡通已经存在，请添加其它一卡通!");
		}else{
			icCardSettingService.saveICCardSetting(UserUtil.getCurrentUser().getBranchId(), ip, port, cardType, code, UserUtil.getCurrentUser().getId());
			return RespJson.success("添加一卡通成功!");
		}
	}

	@RequestMapping(value = "/type/delete/{id}", method = RequestMethod.POST)
	public RespJson delete(@PathVariable("id")String id){
		if(icCardSettingService.isExistBranch(id)){
			return RespJson.error("该一卡通已有店铺开通使用,不能删除!");
		}else{
			ICCardSetting icCardSetting = new ICCardSetting();
			icCardSetting.setDisabled(Byte.valueOf("1"));
			icCardSetting.setId(id);
			icCardSettingService.updateICCardSetting(icCardSetting);
			return RespJson.success("删除一卡通成功!");
		}
	}
	
	@RequestMapping(value = "/type/list")
	public PageUtils<ICCardSetting> typeList(){
		PageUtils<ICCardSetting> suppliers = PageUtils.emptyPage();
		try {
			suppliers = icCardSettingService.selectBranchAllSettingList(UserUtil.getCurrentUser().getBranchId());
			return suppliers;
		} catch (Exception e) {
			logger.error("一卡通查询列表失败！", e);
		}
		return suppliers;
	}
	
	@RequestMapping(value = "/branch/list")
	public PageUtils<ICCardAccountVo> iccardBranchList(String settingId,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize, HttpServletRequest request) {
		PageUtils<ICCardAccountVo> suppliers = PageUtils.emptyPage();
		try {
			suppliers = icCardSettingService.selectSettingBranch(settingId, pageNumber, pageSize);
			return suppliers;
		} catch (Exception e) {
			logger.error("查询一卡通店铺列表失败！", e);
		}
		return suppliers;
	}
	
	@RequestMapping(value = "/get/branch")
	public RespJson iccardBranchList(String branchCode){
		ICCardAccountVo vo = icCardAccountService.selectAccount(branchCode);
		if(vo!=null){
			return RespJson.success(vo);
		}
		return RespJson.error();
	}
	
	@RequestMapping(value = "/save/shop", method = RequestMethod.POST)
	public RespJson saveShop(String settingId,@RequestParam(value = "ids[]") String[] ids,@RequestParam(value = "enableds[]")byte[] enableds){
		if (icCardSettingService.checkShopConfig(settingId, ids)) {
			boolean bool = icCardSettingService.saveShop(settingId, ids, enableds, getCurrUserId());
            if (bool) {
                return RespJson.success("一卡通设置成功!");
            }
            return RespJson.error("一卡通设置失败!");
        } else {
            return RespJson.error("一个门店只能开通一种类型的一卡通!");
        }
    }
	
	@RequestMapping(value = "/get/device")
	public PageUtils<ICCardDevice> iccardBranchDeviceList(String branchId,String settingId,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize, HttpServletRequest request) {
		PageUtils<ICCardDevice> suppliers = PageUtils.emptyPage();
		
		try {
			suppliers = icCardSettingService.selectByBranchId(branchId,settingId, pageNumber, pageSize);
			return suppliers;
		} catch (Exception e) {
			logger.error("查询一卡通店铺列表失败！", e);
		}
		return suppliers;
	}
	
	@RequestMapping(value = "/pos/{branchId}")
	public RespJson getPosRegiste(@PathVariable("branchId") String branchId){
		List<Map<String,Object>> data= this.icCardSettingService.selectPosRegiste(branchId);
		return RespJson.success(data);
	}
	
	@RequestMapping(value = "/save/pos", method = RequestMethod.POST)
	public RespJson savePos(/*String branchId,String settingId, String posList*/ @RequestBody String jsonText) {
		
		ICCardDeviceVo vo = FastJsonUtils.parseObject(jsonText, ICCardDeviceVo.class);
		
		boolean bool = icCardSettingService.savePos(vo.getBranchId(),vo.getSettingId(), vo.getPosList(), getCurrUserId());
        if (bool) {
            return RespJson.success("设备设置成功!");
        }
        return RespJson.error("设备设置失败!");
	}
	
	@RequestMapping(value = "/judge/branch", method = RequestMethod.POST)
	public RespJson judgeBranch(String branchId, String settingId) {
		boolean bool = icCardSettingService.isExistICCardSettingBranch(branchId, settingId);
        if (bool) {
            return RespJson.success();
        }
        return RespJson.error();
	}
	
	@RequestMapping(value = "addIcCardType", method = RequestMethod.GET)
	public ModelAndView addIcCardType() {
		return new ModelAndView("finance/iccard/addIcCardType");
	}
	
	@RequestMapping(value = "editIcCardType", method = RequestMethod.GET)
	public ModelAndView editIcCardType() {
		return new ModelAndView("finance/iccard/editIcCardType");
	}
	
	@RequestMapping(value = "icCardShopSetting", method = RequestMethod.GET)
	public ModelAndView icCardShopSetting() {
		return new ModelAndView("finance/iccard/iccardShopSetting");
	}
}
