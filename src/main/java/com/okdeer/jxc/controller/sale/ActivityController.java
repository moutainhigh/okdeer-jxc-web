/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年11月10日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.sale;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.OrderNoUtils;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.common.utils.UUIDHexGenerator;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.sale.activity.po.ActivityGoodsGiftPo;
import com.okdeer.jxc.sale.activity.service.ActivityServiceApi;
import com.okdeer.jxc.sale.activity.vo.*;
import com.okdeer.jxc.sale.entity.ActivityBranch;
import com.okdeer.jxc.sale.entity.ActivityDetail;
import com.okdeer.jxc.sale.entity.ActivityGoodsGift;
import com.okdeer.jxc.sale.entity.ActivityMain;
import com.okdeer.jxc.sale.enums.ActivityStatus;
import com.okdeer.jxc.sale.enums.ActivityType;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.jfree.util.Log;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;

/**
 * ClassName: ActivityController 
 * @author xiaoj02
 * @date 2016年11月10日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("sale/activity")
public class ActivityController extends BaseController<ActivityController> {

	@Reference(version = "1.0.0", check = false)
	private ActivityServiceApi mainServiceApi;
	
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesService;

	@Autowired
	private OrderNoUtils orderNoUtils;
	
	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	/**
	 * 跳转到列表
	 */
	@RequestMapping(value = "list")
	public String viewList() {
		return "sale/activity/list";
	}

	/**
	 * 跳转到新增页面
	 */
	@RequestMapping(value = "add")
	public String viewAdd() {
		return "sale/activity/add";
	}

	/**
	 * 跳转到修改页面
	 */
	@RequestMapping(value = "edit")
	public String viewEdit(String activityId, HttpServletRequest request) {
		request.setAttribute("activityId", activityId);
		ActivityMain main = mainServiceApi.get(activityId);
		if (main == null) {
			return "error/404";
		}
		// 判断是否已审核
		if (main.getActivityStatus().equals(ActivityStatus.WAIT_CHECK.getValue())) {
			return "sale/activity/edit";
		} else {
			return "sale/activity/view";
		}
	}
	
	/**
	 * 跳转到复制页面
	 */
	@RequestMapping(value = "toCopy")
	public String toCopy(String activityId, Model model) {
		ActivityMain main = mainServiceApi.get(activityId);
		if (main == null) {
			LOG.warn("促销活动不存在，活动Id：{}", activityId);
			model.addAttribute("errorMsg","该商品调价单已被删除！");
			return "error/info";
		}
		
		model.addAttribute("activityId", activityId);
		return "sale/activity/edit";
	}

	/**
	 * 保存活动
	 */
	@RequestMapping(value = "save", method = RequestMethod.POST)
	@ResponseBody
	public RespJson save(@RequestBody String jsonText) {
		RespJson resp = RespJson.success();
		try {
			LOG.debug("保存促销活动参数信息:{}", jsonText);
			// 转换Json数据
			ActivityVo activityVo = JSON.parseObject(jsonText, ActivityVo.class);
			// if(activityVo.getActivityType()==12){
			// 	activityVo.setMaxDiscountAmount(activityVo.getSaleAmount());
			// }
			// 数据验证
			String validMsg = activityVo.validate();

			if (validMsg != null) {
				Log.warn(validMsg);
				return RespJson.businessError(validMsg);
			}

			// 构建活动ActivityMain
			ActivityMain main = new ActivityMain();
			BeanUtils.copyProperties(activityVo, main);
			SysUser user = UserUtil.getUser();
			Date now = new Date();

			main.setId(UUIDHexGenerator.generate());
			main.setActivityStatus(ActivityStatus.WAIT_CHECK.getValue());
			main.setCreateUserId(user.getId());
			main.setCreateTime(now);
			main.setUpdateUserId(user.getId());
			main.setUpdateTime(now);
			main.setDisabled(0);
			String activityCode = orderNoUtils.getOrderNo(FormType.PX + user.getBranchCode());
			main.setActivityCode(activityCode);

			// 构建活动详情列表ActivityDetail
			List<ActivityDetail> detailList = new ArrayList<ActivityDetail>();
			List<ActivityGoodsGift> goodsGiftList = new ArrayList<ActivityGoodsGift>();
			List<ActivityDetailVo> listVo = activityVo.getDetailList();

			// 买满送活动需要重新组装活动详情数据
			if (ActivityType.BUY_FULL_GIVE.getValue().equals(activityVo.getActivityType())) {

				// 构建买满送数据
				buildFullGiveData(activityVo, main, detailList, goodsGiftList, listVo);

			} else {
				for (ActivityDetailVo activityDetailVo : listVo) {

					ActivityDetail activityDetail = new ActivityDetail();
					BeanUtils.copyProperties(activityDetailVo, activityDetail);

					String detailId = UUIDHexGenerator.generate();
					activityDetail.setId(detailId);
					activityDetail.setActivityId(main.getId());
                    activityDetail.setDiscountNum(activityDetailVo.getDiscountNum() != null ? activityDetailVo.getDiscountNum().intValue() : null);
					if (activityVo.getActivityType() == 12) {
						activityDetail.setGoodsPackageGroupId(main.getId());
					}
					detailList.add(activityDetail);
				}
			}

			// 构建活动店铺列表ActivityBranch
			List<ActivityBranch> branchList = new ArrayList<ActivityBranch>();
			String[] branchArray = activityVo.getBranchIds().split(",");
			for (int i = 0; i < branchArray.length; i++) {
				String branchId = branchArray[i];
				ActivityBranch activityBranch = new ActivityBranch();
				activityBranch.setId(UUIDHexGenerator.generate());
				activityBranch.setActivityId(main.getId());
				activityBranch.setBranchId(branchId);
				branchList.add(activityBranch);
			}

			// 保存活动
			mainServiceApi.save(main, detailList, branchList, goodsGiftList);
			resp.put("activityId", main.getId());
		} catch (Exception e) {
			LOG.error("保存活动出现异常：", e);
			return RespJson.error("保存活动出现异常");
		}
		return resp;
	}

	/**
	 * @Description: 构建买满送促销详情数据
	 * @param main
	 * @param detailList 保存到DB中的详情数据列表
	 * @param listVo 详情数据列表
	 * @param i 梯度编号
	 * @param gradientVo 梯度Vo
	 * @author liwb
	 * @date 2017年4月11日
	 */
	private void buildFullGiveDetailList(ActivityMain main, List<ActivityDetail> detailList,
			List<ActivityDetailVo> listVo, int i, ActivityGradientVo gradientVo) {
		// 重新构建活动详情记录
		for (ActivityDetailVo activityDetailVo : listVo) {

			ActivityDetail activityDetail = new ActivityDetail();
			BeanUtils.copyProperties(activityDetailVo, activityDetail);
			BeanUtils.copyProperties(gradientVo, activityDetail); // 复制买满金额/买满数量信息

			activityDetail.setId(UUIDHexGenerator.generate());
			activityDetail.setActivityId(main.getId());
			activityDetail.setGroupNum(i); // 梯度编号

			detailList.add(activityDetail);
		}
	}

	/**
	 * @Description: 将梯度数据排序
	 * @param gradientList
	 * @param activityPattern
	 * @author liwb
	 * @date 2017年4月11日
	 */
	private void sortGradientList(List<ActivityGradientVo> gradientList, int activityPattern) {
		// 按买满价格/买满金额 排序
		Collections.sort(gradientList, new Comparator<ActivityGradientVo>() {

			/**
			 * (non-Javadoc)
			 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
			 */
			@Override
			public int compare(ActivityGradientVo o1, ActivityGradientVo o2) {
				if (activityPattern == 0) {
					BigDecimal limitAmount = o1.getLimitAmount();
					BigDecimal otherimitAmount = o2.getLimitAmount();
					return limitAmount.compareTo(otherimitAmount);
				} else {
					BigDecimal limitCount = o1.getLimitCount();
					BigDecimal otherimitCount = o2.getLimitCount();
					return limitCount.compareTo(otherimitCount);
				}

			}
		});
	}

	/**
	 * @Description: 构建买满送礼品数据信息
	 * @param detailId
	 * @param giftVoList
	 * @param giftList
	 * @author liwb
	 * @date 2017年4月10日
	 */
	private void buildGoodsGiftList(String activityId, int groupNum, List<ActivityGoodsGift> giftVoList,
			List<ActivityGoodsGift> giftList) {
		for (ActivityGoodsGift goodsGift : giftVoList) {
			goodsGift.setId(UUIDHexGenerator.generate());
			goodsGift.setActivityId(activityId);
			goodsGift.setGroupNum(groupNum);
		}
		giftList.addAll(giftVoList);
	}

	/**
	 * 修改活动
	 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	@ResponseBody
	public RespJson update(@RequestBody String jsonText) {
		try {
			LOG.debug("修改促销活动参数信息:{}", jsonText);
			// 转换Json数据
			ActivityVo activityVo = JSON.parseObject(jsonText, ActivityVo.class);
			//
			// if(activityVo.getActivityType()==12){
			// 	activityVo.setMaxDiscountAmount(activityVo.getSaleAmount());
			// }
			// 验证数据
			String validMsg = activityVo.validate();

			if (validMsg != null) {
				return RespJson.argumentError(validMsg);
			}

			if (activityVo.getId() == null) {
				return RespJson.argumentError("活动Id不能为空");
			}

			// 构建活动ActivityMain
			ActivityMain main = new ActivityMain();
			BeanUtils.copyProperties(activityVo, main);
			SysUser user = UserUtil.getUser();
			Date now = new Date();

			main.setUpdateUserId(user.getId());
			main.setUpdateTime(now);

			// 构建活动详情列表ActivityDetail
			List<ActivityDetail> detailList = new ArrayList<ActivityDetail>();
			List<ActivityGoodsGift> goodsGiftList = new ArrayList<ActivityGoodsGift>();
			List<ActivityDetailVo> listVo = activityVo.getDetailList();

			// 买满送活动需要重新组装活动详情数据
			if (ActivityType.BUY_FULL_GIVE.getValue().equals(activityVo.getActivityType())) {

				// 构建买满送数据
				buildFullGiveData(activityVo, main, detailList, goodsGiftList, listVo);

			} else {
				for (ActivityDetailVo activityDetailVo : listVo) {

					ActivityDetail activityDetail = new ActivityDetail();
					BeanUtils.copyProperties(activityDetailVo, activityDetail);

					String detailId = UUIDHexGenerator.generate();

					activityDetail.setId(detailId);
					activityDetail.setActivityId(main.getId());
                    activityDetail.setDiscountNum(activityDetailVo.getDiscountNum() == null ? null : activityDetailVo.getDiscountNum().intValue());

					detailList.add(activityDetail);
				}
			}

			// 构建活动店铺列表ActivityBranch
            List<ActivityBranch> branchList = new ArrayList<>();
            String[] branchArray = activityVo.getBranchIds().split(",");
			for (int i = 0; i < branchArray.length; i++) {
				String branchId = branchArray[i];
				ActivityBranch activityBranch = new ActivityBranch();
				activityBranch.setId(UUIDHexGenerator.generate());
				activityBranch.setActivityId(main.getId());
				activityBranch.setBranchId(branchId);
				branchList.add(activityBranch);
			}

			// 保存活动
			return mainServiceApi.update(main, detailList, branchList, goodsGiftList);

		} catch (Exception e) {
			LOG.error("修改活动出现异常：", e);
			return RespJson.error("修改活动出现异常");
		}
	}

	/**
	 * @Description: 构建买满送数据
	 * @param activityVo
	 * @param main
	 * @param detailList
	 * @param goodsGiftList
	 * @param listVo
	 * @author liwb
	 * @date 2017年4月12日
	 */
	private void buildFullGiveData(ActivityVo activityVo, ActivityMain main, List<ActivityDetail> detailList,
			List<ActivityGoodsGift> goodsGiftList, List<ActivityDetailVo> listVo) {
		List<ActivityGradientVo> gradientList = activityVo.getGradientList();

		// 全场活动
		if (activityVo.getActivityScope() == 2) {
			ActivityDetailVo fullCourt = new ActivityDetailVo();
			listVo.clear();
			listVo.add(fullCourt);
		}

		// 将梯度数据排序
		sortGradientList(gradientList, activityVo.getActivityPattern());

		// 促销详情记录数 = 促销活动记录数 * 促销梯度记录数
		for (int i = 0; i < gradientList.size(); i++) {
			ActivityGradientVo gradientVo = gradientList.get(i);

			// 梯度编号
			int groupNum = i + 1;

			// 构建买满送促销详情数据
			buildFullGiveDetailList(main, detailList, listVo, groupNum, gradientVo);

			// 构建买满送礼品信息数据
			buildGoodsGiftList(main.getId(), groupNum, gradientVo.getGoodsGiftList(), goodsGiftList);
		}
	}

	/**
	 * 审核活动
	 */
	@RequestMapping(value = "check", method = RequestMethod.POST)
	@ResponseBody
	public RespJson check(String activityId) {
		try {
			LOG.debug("审核：activityId：{}", activityId);
			SysUser user = UserUtil.getUser();
			return mainServiceApi.check(activityId, user.getId());
		} catch (Exception e) {
			LOG.error("审核活动出现异常：", e);
			return RespJson.error("审核活动出现异常");
		}
	}

	/**
	 * 终止活动
	 */
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	@ResponseBody
	public RespJson delete(String activityId) {
		try {
			LOG.debug("删除：activityId：{}", activityId);
			SysUser user = UserUtil.getUser();
			return mainServiceApi.delete(activityId, user.getId());
		} catch (Exception e) {
			LOG.error("删除活动出现异常：", e);
			return RespJson.error("删除活动出现异常");
		}
	}

	/**
	 * 终止活动
	 */
	@RequestMapping(value = "stop", method = RequestMethod.POST)
	@ResponseBody
	public RespJson stop(String activityId) {
		try {
			LOG.debug("终止：activityId：{}", activityId);
			SysUser user = UserUtil.getUser();
			return mainServiceApi.stop(activityId, user.getId());
		} catch (Exception e) {
			LOG.error("终止活动出现异常：", e);
			return RespJson.error("终止活动出现异常");
		}
	}

	/**
	 * 查询单个活动
	 */
	@RequestMapping(value = "get", method = RequestMethod.GET)
	@ResponseBody
	public RespJson get(String activityId) {
		RespJson resp = RespJson.success();
		try {
			LOG.debug("查询单个活动：get：{}", activityId);
			Map<String, Object> activityMain = mainServiceApi.getMain(activityId);
			List<Map<String, Object>> activityBranch = mainServiceApi.getBranch(activityId);
			resp.put("obj", activityMain);
			resp.put("branch", activityBranch);
		} catch (Exception e) {
			LOG.error("查询单个活动出现异常：", e);
			return RespJson.error("查询单个活动出现异常");
		}
		return resp;
	}

	/**
	 * 查询单个活动的详情
	 */
	@RequestMapping(value = "getDetail", method = RequestMethod.GET)
	@ResponseBody
	public PageUtils<Map<String, Object>> getDetail(ActivityListQueryVo activityListQueryVo) {
		try {
			LOG.debug("查询活动详情：getDetail：{}", activityListQueryVo);
			PageUtils<Map<String, Object>> activityDetail = mainServiceApi.getDetail(activityListQueryVo);
			return activityDetail;
		} catch (Exception e) {
			LOG.error("查询活动详情出现异常：", e);
			return null;
		}
	}

	/**
	 * 查询单个活动的详情(满减活动)
	 */
	@RequestMapping(value = "getDetailFullCut", method = RequestMethod.GET)
	@ResponseBody
	public PageUtils<Map<String, Object>> getDetailFullCut(ActivityListQueryVo activityListQueryVo) {
		try {
			LOG.debug("查询活动详情(满减)：getDetailFullCut：{}", activityListQueryVo);
			PageUtils<Map<String, Object>> activityDetail = mainServiceApi.getDetailFullCut(activityListQueryVo);
			return activityDetail;
		} catch (Exception e) {
			LOG.error("查询活动详情(满减)出现异常：", e);
			return null;
		}
	}

	/**
	 * 查询单个活动的满减优惠信息(满减活动)
	 */
	@RequestMapping(value = "getLimitAmountFullCut", method = RequestMethod.GET)
	@ResponseBody
	public PageUtils<Map<String, Object>> getLimitAmountFullCut(String activityId) {
		try {
			LOG.debug("查询活动详情(满减优惠信息)：getLimitAmountFullCut：{}", activityId);
			PageUtils<Map<String, Object>> activityDetail = mainServiceApi.getLimitAmountFullCut(activityId);
			return activityDetail;
		} catch (Exception e) {
			LOG.error("查询活动详情(满减优惠信息)出现异常：", e);
			return null;
		}
	}

	/**
	 * 查询单个活动的详情(买满送)
	 */
	@RequestMapping(value = "getDetailFullGive", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<Map<String, Object>> getDetailFullGive(ActivityListQueryVo activityListQueryVo) {
		try {
			LOG.debug("查询活动详情(买满送)：getDetailFullGive：{}", activityListQueryVo);
			PageUtils<Map<String, Object>> activityDetail = mainServiceApi.getDetailFullGive(activityListQueryVo);
			return activityDetail;
		} catch (Exception e) {
			LOG.error("查询活动详情(买满送)出现异常：", e);
			return PageUtils.emptyPage();
		}
	}

	/**
	 * 查询单个买满送活动的优惠梯度
	 */
	@RequestMapping(value = "getGradientForFullGive", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<ActivityGradientVo> getGradientForFullGive(String activityId) {
		try {
			LOG.debug("查询活动详情(买满送)的优惠梯度，活动Id:{}", activityId);
			PageUtils<ActivityGradientVo> activityDetail = mainServiceApi.getGradientForFullGive(activityId);
			return activityDetail;
		} catch (Exception e) {
			LOG.error("查询活动详情(买满送)的优惠梯度出现异常：", e);
			return PageUtils.emptyPage();
		}
	}
	
	@RequestMapping(value = "getGiftListForGroupNum", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<ActivityGoodsGiftPo> getGiftListForGroupNum(String activityId, Integer groupNum) {
		try {
			LOG.debug("查询买满送的赠品信息，活动Id:{}，组号：{}", activityId, groupNum);
			List<ActivityGoodsGiftPo> activityDetail = mainServiceApi.getGiftListByActivityId(activityId, groupNum);
			
			PageUtils<ActivityGoodsGiftPo> page = new PageUtils<ActivityGoodsGiftPo>(activityDetail);
			return page;
		} catch (Exception e) {
			LOG.error("查询买满送的赠品信息异常：", e);
		}
		return PageUtils.emptyPage();
	}

	/**
	 * 查询活动列表
	 */
	@RequestMapping(value = "listData", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<Map<String, Object>> listData(ActivityListQueryVo queryVo) {
		try {
			LOG.debug("查询活动列表：listData：{}", queryVo);
			queryVo.setSourceBranchId(UserUtil.getCurrBranchId());
			PageUtils<Map<String, Object>> page = mainServiceApi.listPage(queryVo);
			return page;
		} catch (Exception e) {
			LOG.error("查询活动列表出现异常：", e);
			return null;
		}
	}
	
	/**
	 * @Description: 商品导入
	 * @param file
	 * @param type 0货号、1条码
	 * @param branchIds 机构Id数组，用,拼接
	 * @param activityType 活动类型，只有 1特价、2折扣、3偶数特价 支持导入
	 * @return
	 * @author liwb
	 * @date 2017年4月12日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String type, String branchIds, Integer activityType) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.argumentError("文件为空");
			}

			if (StringUtils.isBlank(type)) {
				return RespJson.argumentError("导入类型为空");
			}
			
			if (StringUtils.isBlank(branchIds)) {
				return RespJson.argumentError("机构Id数据为空");
			}
			
			if(activityType==null){
				return RespJson.argumentError("活动类型为空");
			}

			// 文件流
			InputStream is = file.getInputStream();
			
			// 获取文件名
			String fileName = file.getOriginalFilename();

			SysUser user = UserUtil.getCurrentUser();

			//构建导入字段信息
			String[] field = buildFields(type, activityType);
			if(field==null){
				return RespJson.argumentError("活动类型错误！");
			}
			
			String branchId = null;
			
			if(branchIds.contains(",")){
				//取第一个店铺的父级Id，即分公司Id
				String storeId = branchIds.substring(0, branchIds.indexOf(","));
				branchId = branchesService.getBranchInfoById(storeId).getParentId();
			}else{
				branchId = branchIds;
			}
			
			
			GoodsSelectImportVo<GoodsSelect> vo = goodsSelectImportComponent.importSelectGoods(fileName, is, field,
					new ActivityGoodsImportVo(), branchId, user.getId(), type, "/sale/activity/downloadErrorFile",
					new GoodsSelectImportBusinessValid() {

						@Override
						public void businessValid(List<JSONObject> excelListSuccessData, String[] excelField) {
							for (JSONObject obj : excelListSuccessData) {
								try {
									String saleAmount = obj.getString("saleAmount");
									Double.parseDouble(saleAmount);
								} catch (Exception e) {
									obj.element("saleAmount", 0);
								}
								
								try {
									String discount = obj.getString("discount");
									Double.parseDouble(discount);
								} catch (Exception e) {
									obj.element("discount", 0);
								}
							}
						}

						/**
						 * (non-Javadoc)
						 * @see com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid#formatter(java.util.List)
						 */
						@Override
						public void formatter(List<? extends GoodsSelect> list, List<JSONObject> excelListSuccessData,
								List<JSONObject> excelListErrorData) {
							for (GoodsSelect objGoods : list) {
								ActivityGoodsImportVo obj = (ActivityGoodsImportVo) objGoods;

								BigDecimal price = obj.getPrice();
								if (price == null) {
									obj.setPrice(obj.getSalePrice());
								}
							}
						}

						/**
						 * (non-Javadoc)
						 * @see com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid#errorDataFormatter(java.util.List)
						 */
						@Override
						public void errorDataFormatter(List<JSONObject> list) { 
							
						}
					}, null);
			vo.setErrorFileUrl(vo.getErrorFileUrl() + "&activityType=" + activityType);
			respJson.put("importInfo", vo);
        } catch (BusinessException e) {
            respJson = RespJson.error(e.getMessage());
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常:", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("导入商品异常:", e);
		}
		return respJson;

	}

	/**
	 * @Description: 构建导入字段信息
	 * @param type
	 * @param activityType
	 * @return
	 * @author liwb
	 * @date 2017年4月12日
	 */
	private String[] buildFields(String type, Integer activityType) {
		String[] field = null;
		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
			if(ActivityType.SALE_PRICE.getValue().equals(activityType)){ //特价
				field = new String[] { "skuCode", "saleAmount"};
			}else if(ActivityType.DISCOUNT.getValue().equals(activityType)){ //折扣
				field = new String[] { "skuCode", "discount"};
			}else if(ActivityType.EVEN_SALE.getValue().equals(activityType)){ //偶数特价
				field = new String[] { "skuCode", "saleAmount"};
			}else{
				return null;
			}
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
			if(ActivityType.SALE_PRICE.getValue().equals(activityType)){ //特价
				field = new String[] { "barCode", "saleAmount"};
			}else if(ActivityType.DISCOUNT.getValue().equals(activityType)){ //折扣
				field = new String[] { "barCode", "discount"};
			}else if(ActivityType.EVEN_SALE.getValue().equals(activityType)){ //偶数特价
				field = new String[] { "barCode", "saleAmount"};
			}else{
				return null;
			}
		}
		return field;
	}

	/**
	 * @Description: 下载错误数据
	 * @param code
	 * @param type
	 * @param activityType
	 * @param response
	 * @author liwb
	 * @date 2017年4月12日
	 */
	@RequestMapping(value = "downloadErrorFile")
	public void downloadErrorFile(String code, String type, Integer activityType, HttpServletResponse response) {
		String reportFileName = "错误数据";

		String[] headers = null;
		String[] columns = null;

		if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
			if(ActivityType.SALE_PRICE.getValue().equals(activityType)){ //特价
				columns = new String[] { "skuCode", "saleAmount"};
				headers = new String[] { "货号", "特价"};
			}else if(ActivityType.DISCOUNT.getValue().equals(activityType)){ //折扣
				columns = new String[] { "skuCode", "discount"};
				headers = new String[] { "货号", "折扣"};
			}else if(ActivityType.EVEN_SALE.getValue().equals(activityType)){ //偶数特价
				columns = new String[] { "skuCode", "saleAmount"};
				headers = new String[] { "货号", "偶数特价"};
			}else{
				LOG.warn("活动类型不正确");
				return;
			}
		} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
			if(ActivityType.SALE_PRICE.getValue().equals(activityType)){ //特价
				columns = new String[] { "barCode", "saleAmount"};
				headers = new String[] { "条码", "特价"};
			}else if(ActivityType.DISCOUNT.getValue().equals(activityType)){ //折扣
				columns = new String[] { "barCode", "discount"};
				headers = new String[] { "条码", "折扣"};
			}else if(ActivityType.EVEN_SALE.getValue().equals(activityType)){ //偶数特价
				columns = new String[] { "barCode", "saleAmount"};
				headers = new String[] { "条码", "偶数特价"};
			}else{
				LOG.warn("活动类型不正确");
				return;
			}
		}

		goodsSelectImportComponent.downloadErrorFile(code, reportFileName, headers, columns, response);
	}
	
	/**
	 * @Description: 活动商品导入模板下载
	 * @param response
	 * @param type
	 * @author liwb
	 * @date 2016年10月12日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, String type, Integer activityType) {
		LOG.debug("导出活动商品导入模板参数,type:{}, activityType:{}", type, activityType);
		try {
			String fileName = "";
			String templateName = "";
			
			if (GoodsSelectImportHandle.TYPE_SKU_CODE.equals(type)) {// 货号
				if(ActivityType.SALE_PRICE.getValue().equals(activityType)){ //特价
					templateName = ExportExcelConstant.ACTIVITY_SPECIAL_GOODS_SKUCODE_TEMPLATE;
					fileName = "特价活动货号导入模板";
				}else if(ActivityType.DISCOUNT.getValue().equals(activityType)){ //折扣
					templateName = ExportExcelConstant.ACTIVITY_DISCOUNT_GOODS_SKUCODE_TEMPLATE;
					fileName = "折扣活动货号导入模板";
				}else if(ActivityType.EVEN_SALE.getValue().equals(activityType)){ //偶数特价
					templateName = ExportExcelConstant.ACTIVITY_EVEN_GOODS_SKUCODE_TEMPLATE;
					fileName = "偶数特价活动货号导入模板";
				}else{
					LOG.warn("活动类型不正确");
					return;
				}
			} else if (GoodsSelectImportHandle.TYPE_BAR_CODE.equals(type)) {// 条码
				if(ActivityType.SALE_PRICE.getValue().equals(activityType)){ //特价
					templateName = ExportExcelConstant.ACTIVITY_SPECIAL_GOODS_BARCODE_TEMPLATE;
					fileName = "特价活动条码导入模板";
				}else if(ActivityType.DISCOUNT.getValue().equals(activityType)){ //折扣
					templateName = ExportExcelConstant.ACTIVITY_DISCOUNT_GOODS_BARCODE_TEMPLATE;
					fileName = "折扣活动条码导入模板";
				}else if(ActivityType.EVEN_SALE.getValue().equals(activityType)){ //偶数特价
					templateName = ExportExcelConstant.ACTIVITY_EVEN_GOODS_BARCODE_TEMPLATE;
					fileName = "偶数特价活动条码导入模板";
				}else{
					LOG.warn("活动类型不正确");
					return;
				}
			}
			
			if (StringUtils.isNotBlank(fileName) && StringUtils.isNotBlank(templateName)) {
				exportListForXLSX(response, null, fileName, templateName);
			}
		} catch (Exception e) {
			LOG.error("导出活动商品导入模板异常", e);
		}
	}
	
}
