package com.okdeer.jxc.common.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.common.qo.GpePageQo;
import com.okdeer.retail.framework.gpe.bean.CustomMarkBean;
import com.okdeer.retail.framework.gpe.bean.UserConfigBean;
import com.okdeer.retail.framework.gpe.helper.ExportHelper;
import com.okdeer.retail.framework.gpe.helper.GpeHelper;
import com.okdeer.retail.framework.gpe.helper.GridHelper;
import com.okdeer.retail.framework.gpe.helper.LocalCustomMarkHelper;
import com.okdeer.retail.framework.gpe.helper.SettingHelper;

/**
 * 
 * ClassName: AbstractSimpleGpeController 
 * @Description: Gpe抽象Controller
 * @author zhangq
 * @date 2017年10月24日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Component
public abstract class AbstractSimpleGpeController<Q extends GpePageQo, V> extends BaseController<V> {

	/**
	 * 
	 * @Description: 获取用户自定义标记
	 * @return MethodListenerBean  
	 * @author zhangq
	 * @date 2017年10月25日
	 */
	protected abstract CustomMarkBean getCustomMark();

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
	protected abstract Set<String> getForbidSet();

	/**
	 * 
	 * @Description: 获取Vo对象的class
	 * @return Class<V>  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	protected abstract Class<V> getViewObjectClass();

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
	protected abstract EasyUIPageInfo<V> queryListPage(Q qo);

	/**
	 * 
	 * @Description: 查询汇总数据
	 * @param qo
	 * @return V  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	protected abstract V queryTotal(Q qo);

	/**
	 * 
	 * @Description: 查询列表数据
	 * @param qo
	 * @return List<V>  
	 * @author zhangq
	 * @date 2017年10月24日
	 */
	protected abstract List<V> queryList(Q qo);

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
			modelAndView.addObject("columns", getGridColumns());
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
	public EasyUIPageInfo<V> queryListPage(Q qo, @RequestParam(value = "page") int pageNumber,
			@RequestParam(value = "rows") int pageSize) {
		// 分页参数
		qo.setPageNum(pageNumber);
		qo.setPageSize(pageSize);
		// 查询数据
		EasyUIPageInfo<V> list = queryListPage(qo);
		//添加数据权限的处理
		cleanAccessData(list);
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
		V total = queryTotal(qo);
		//添加数据权限的处理
		cleanAccessData(total);
		// 导出的数据列表
		List<V> exportList = new ArrayList<V>();

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
			List<V> tempList = queryList(qo);
			exportList.addAll(tempList);
		}

		// 存在余数时，查询剩余的数据
		if (modIndex > 0) {
			int newStart = (resIndex * LIMIT_REQ_COUNT) + startCount;
			int newEnd = modIndex;
			qo.setStartCount(newStart);
			qo.setEndCount(newEnd);
			List<V> tempList = queryList(qo);
			exportList.addAll(tempList);
		}
		//部分报表导出不需要合计栏
		if(total!=null){
			// 添加到数据列表
			exportList.add(total);
		}
		// 获取没有权限访问的字段
		Set<String> forbidSet = getForbidSet();

		// 获取Vo对象的class
		Class<V> clazz = getViewObjectClass();

		// 获取用户自定义标记
		CustomMarkBean customMarkBean = getCustomMark();
		LocalCustomMarkHelper.setLocalCustomMark(customMarkBean);
		//添加数据权限的处理
		cleanAccessData(exportList);
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
	public String queryColumnsJson() {
		return getGridColumns();
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
	public String querySettingJson() {
		// 获取没有权限访问的字段
		Set<String> forbidSet = getForbidSet();

		// 获取Vo对象的class
		Class<V> clazz = getViewObjectClass();

		// 获取用户自定义标记
		CustomMarkBean customMarkBean = getCustomMark();
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
	public RespJson gpesave(String setting) {
		// 获取用户自定义标记
		CustomMarkBean mark = getCustomMark();

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
	public RespJson gperestore() {
		// 获取用户自定义标记
		CustomMarkBean mark = getCustomMark();

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
	private String getGridColumns() {
		// 获取没有权限访问的字段
		Set<String> forbidSet = getForbidSet();

		// 获取Vo对象的class
		Class<V> clazz = getViewObjectClass();

		// 获取用户自定义标记
		CustomMarkBean customMarkBean = getCustomMark();
		LocalCustomMarkHelper.setLocalCustomMark(customMarkBean);

		// 获取grid columns json字符串
		return GridHelper.getGridColumnsJson(getCurrUserId(), clazz, forbidSet);
	}
}
