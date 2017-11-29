package com.okdeer.jxc.common.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.okdeer.jxc.common.constant.GpeMarkContrant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.common.qo.GpePageQo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;
import com.okdeer.retail.framework.gpe.bean.MutilCustomMarkBean;
import com.okdeer.retail.framework.gpe.bean.UserConfigBean;
import com.okdeer.retail.framework.gpe.helper.ExportHelper;
import com.okdeer.retail.framework.gpe.helper.GpeHelper;
import com.okdeer.retail.framework.gpe.helper.GridHelper;
import com.okdeer.retail.framework.gpe.helper.LocalCustomMarkHelper;
import com.okdeer.retail.framework.gpe.helper.SettingHelper;

/**
 * 
 * ClassName: AbstractMutilGpeController 
 * @Description: Gpe抽象Controller，适用于多选项卡模式
 * @author zhangq
 * @date 2017年11月6日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
public abstract class AbstractMutilGpeController<Q extends GpePageQo> extends BaseController<Object> implements
		GpeMarkContrant {

	/**
	 * 
	 * @Description: 获取用户自定义标记
	 * @return MethodListenerBean  
	 * @author zhangq
	 * @date 2017年10月25日
	 */
	protected abstract MutilCustomMarkBean getMutilCustomMark();

	/**
	 * 
	 * @Description: 获取ModelAndView对象
	 * @param model
	 * @return Model  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	protected abstract ModelAndView getModelAndView(ModelAndView modelAndView);

	/**
	 * 
	 * @Description: 获取没有权限访问的字段
	 * @return Set<String>  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	protected abstract Set<String>[] getForbidSetArray();

	/**
	 * 
	 * @Description: 获取Vo对象的class
	 * @return Class<V>  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	protected abstract Class<?>[] getViewObjectClassArray();

	/**
	 * 
	 * @Description: 分页查询
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return EasyUIPageInfo<V>  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	protected abstract EasyUIPageInfo<?> queryListPage(Q qo);

	/**
	 * 
	 * @Description: 查询汇总数据
	 * @param qo
	 * @return V  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	protected abstract Object queryTotal(Q qo);

	/**
	 * 
	 * @Description: 查询列表数据
	 * @param qo
	 * @return List<V>  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	protected abstract List<?> queryList(Q qo);

	/**
	 * 
	 * @Description: 跳转首页
	 * <p>特殊需求无法满足时，可重写该方法。
	 * @param modelAndView
	 * @return String  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	@RequestMapping(value = "/index")
	public ModelAndView index(ModelAndView modelAndView) {
		// 获取ModelAndView对象
		modelAndView = getModelAndView(modelAndView);

		// 加入columns属性
		if (modelIncludeColumns()) {
			modelAndView.addObject("columns", getGridColumns(null));
		}

		// 返回ModelAndView
		return modelAndView;
	}

	/**
	 * 
	 * @Description: 获取分页数据
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return EasyUIPageInfo<V>  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public EasyUIPageInfo<?> queryListPage(Q qo, @RequestParam(value = "page") int pageNumber,
			@RequestParam(value = "rows") int pageSize) {
		// 分页参数
		qo.setPageNum(pageNumber);
		qo.setPageSize(pageSize);
		// 查询数据
		EasyUIPageInfo<?> list = queryListPage(qo);
		return list;
	}

	/**
	 * 
	 * @Description: 导出Excel</br>
	 * 内部封装功能有：导出条数限制、大数据容量分批查询、数据级权限过滤</br>
	 * PS:</br>
	 * dubbo默认传输数据大小为8MB，service层向web层传输大数据容量的对象时，会受到Dubbo的限制并报错。</br>
	 * 当报表导出字段值较多时，例如日进销存报表，2W条数据的大小超过了8MB。</br>
	 * 故当数据超过2K条时，进行分批查询，每次最多查2K条，然后在web层组装。</br>
	 * @param response
	 * @param qo
	 * @return RespJson  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	@RequestMapping(value = "/export", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, Q qo) {
		// 查询合计
		Object total = queryTotal(qo);

		// 导出的数据列表
		List<Object> exportList = new ArrayList<Object>();

		// 限制导出数据的起始数量
		int startCount = limitStartCount(qo.getStartCount());
		// 限制导出数据的总数量
		int endCount = limitEndCount(qo.getEndCount());

		// 商，按2K条数据一次查询拆分，可以拆分为多少次查询
		int resIndex = (int) (endCount / LIMIT_REQ_COUNT);
		// 余数，按2K拆分后，剩余的数据
		int modIndex = endCount % LIMIT_REQ_COUNT;

		// 每2K条数据一次查询
		for (int i = 0; i < resIndex; i++) {
			int newStart = (i * LIMIT_REQ_COUNT) + startCount;
			qo.setStartCount(newStart);
			qo.setEndCount(LIMIT_REQ_COUNT);
			List<?> tempList = queryList(qo);
			exportList.addAll(tempList);
		}

		// 存在余数时，查询剩余的数据
		if (modIndex > 0) {
			int newStart = (resIndex * LIMIT_REQ_COUNT) + startCount;
			int newEnd = modIndex;
			qo.setStartCount(newStart);
			qo.setEndCount(newEnd);
			List<?> tempList = queryList(qo);
			exportList.addAll(tempList);
		}

		// 部分报表导出不需要合计栏
		if (total != null) {
			// 添加到数据列表
			exportList.add(total);
		}

		// 选项卡索引
		int index = getTabKeyIndex(qo.getTabKey());

		// 获取没有权限访问的字段
		Set<String> forbidSet = null;
		Set<String>[] forbidSetArray = getForbidSetArray();
		if (null != forbidSetArray && forbidSetArray.length > 0) {
			forbidSet = getForbidSetArray()[index];
		}

		// 获取Vo对象的class
		Class<?> clazz = getViewObjectClassArray()[index];

		// 获取用户自定义标记
		CustomMarkBean customMarkBean = new CustomMarkBean(null, null, null);
		LocalCustomMarkHelper.setLocalCustomMark(customMarkBean);

		// 导出
		ExportHelper.export(getCurrUserId(), clazz, exportList, forbidSet, response);
		return RespJson.success();
	}

	/**
	 * 
	 * @Description: 获取表格columns
	 * @return String  
	 * @author zhangq
	 * @date 2017年11月1日
	 */
	@RequestMapping(value = "/gpegridcolumns", method = RequestMethod.POST)
	@ResponseBody
	public String queryColumnsJson(String tabKey) {
		return getGridColumns(tabKey);
	}

	/**
	 * 
	 * @Description: 获取用户自定义设置
	 * @return String  
	 * @author zhangq
	 * @date 2017年10月25日
	 */
	@RequestMapping(value = "/gpesetting", method = RequestMethod.POST)
	@ResponseBody
	public String querySettingJson(String tabKey) {
		// 选项卡索引
		int index = getTabKeyIndex(tabKey);

		// 获取没有权限访问的字段
		Set<String> forbidSet = null;
		Set<String>[] forbidSetArray = getForbidSetArray();
		if (null != forbidSetArray && forbidSetArray.length > 0) {
			forbidSet = getForbidSetArray()[index];
		}

		// 获取Vo对象的class
		Class<?> clazz = getViewObjectClassArray()[index];

		// 获取用户自定义标记
		MutilCustomMarkBean mutilCustomMarkBean = getMutilCustomMark();
		CustomMarkBean customMarkBean = new CustomMarkBean(mutilCustomMarkBean.getMoudle(),
				mutilCustomMarkBean.getSection(), mutilCustomMarkBean.getKeys()[index]);
		LocalCustomMarkHelper.setLocalCustomMark(customMarkBean);

		// 获取setting json字符串
		return SettingHelper.getSettingJson(getCurrUserId(), clazz, forbidSet);
	}

	/**
	 * 
	 * @Description: 保存用户自定义设置
	 * @return RespJson  
	 * @author zhangq
	 * @date 2017年10月26日
	 */
	@RequestMapping(value = "/gpesave", method = RequestMethod.POST)
	@ResponseBody
	public RespJson gpesave(String setting, String tabKey) {
		// 选项卡索引
		int index = getTabKeyIndex(tabKey);

		// 获取用户自定义标记
		MutilCustomMarkBean mutilCustomMarkBean = getMutilCustomMark();
		CustomMarkBean mark = new CustomMarkBean(mutilCustomMarkBean.getMoudle(), mutilCustomMarkBean.getSection(),
				mutilCustomMarkBean.getKeys()[index]);

		// 用户自定义设置对象
		UserConfigBean bean = new UserConfigBean();
		bean.setUserId(getCurrUserId());
		bean.setMoudle(mark.getMoudle());
		bean.setSection(mark.getSection());
		bean.setKey(mark.getKey());
		bean.setValue(setting);
		bean.setCreateTime(new Date());
		bean.setUpdateTime(new Date());

		// 保存
		boolean success = GpeHelper.userConfigFacade.save(bean);
		if (success) {
			return RespJson.success();
		} else {
			return RespJson.error("保存设置失败");
		}
	}

	/**
	 * 
	 * @Description: 充值用户自定义设置
	 * @return RespJson  
	 * @author zhangq
	 * @date 2017年10月30日
	 */
	@RequestMapping(value = "/gperestore", method = RequestMethod.POST)
	@ResponseBody
	public RespJson gperestore(String tabKey) {
		// 选项卡索引
		int index = getTabKeyIndex(tabKey);

		// 获取用户自定义标记
		MutilCustomMarkBean mutilCustomMarkBean = getMutilCustomMark();
		CustomMarkBean mark = new CustomMarkBean(mutilCustomMarkBean.getMoudle(), mutilCustomMarkBean.getSection(),
				mutilCustomMarkBean.getKeys()[index]);

		// 获取设置
		String setting = GpeHelper.userConfigFacade.get(getCurrUserId(), mark.getMoudle(), mark.getSection(),
				mark.getKey());
		if (null == setting) {
			return RespJson.success();
		}

		// 保存
		boolean success = GpeHelper.userConfigFacade.restore(getCurrUserId(), mark.getMoudle(), mark.getSection(),
				mark.getKey());
		if (success) {
			return RespJson.success();
		} else {
			return RespJson.error("保存设置失败");
		}
	}

	/**
	 * 
	 * @Description: 首页ModelAndView中是否包含easyui支持的columns属性</br>
	 * 默认为false，如需要修改可在继承类中override该方法
	 * @return boolean  
	 * @author zhangq
	 * @date 2017年11月3日
	 */
	public boolean modelIncludeColumns() {
		return false;
	}

	/**
	 * 
	 * @Description: 获取grid需要的columns
	 * @return String  
	 * @author zhangq
	 * @date 2017年11月3日
	 */
	private String getGridColumns(String tabKey) {
		// 选项卡索引
		int index = getTabKeyIndex(tabKey);

		// 获取没有权限访问的字段
		Set<String> forbidSet = null;
		Set<String>[] forbidSetArray = getForbidSetArray();
		if (null != forbidSetArray && forbidSetArray.length > 0) {
			forbidSet = getForbidSetArray()[index];
		}

		// 获取Vo对象的class
		Class<?> clazz = getViewObjectClassArray()[index];

		// 获取用户自定义标记
		MutilCustomMarkBean mutilCustomMarkBean = getMutilCustomMark();
		CustomMarkBean customMarkBean = new CustomMarkBean(mutilCustomMarkBean.getMoudle(),
				mutilCustomMarkBean.getSection(), mutilCustomMarkBean.getKeys()[index]);
		LocalCustomMarkHelper.setLocalCustomMark(customMarkBean);

		// 获取grid columns json字符串
		return GridHelper.getGridColumnsJson(getCurrUserId(), clazz, forbidSet);
	}

	/**
	 * 
	 * @Description: 获取选项卡索引
	 * @param tabKey
	 * @return int  
	 * @author zhangq
	 * @date 2017年11月6日
	 */
	private int getTabKeyIndex(String tabKey) {
		int index = 0;
		String[] keys = getMutilCustomMark().getKeys();
		for (int i = 0; i < keys.length; i++) {
			if (keys[i].equals(tabKey)) {
				index = i;
				break;
			}
		}
		return index;
	}
}
