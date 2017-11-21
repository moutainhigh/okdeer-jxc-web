
package com.okdeer.jxc.common.controller;

import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.utils.PriceGrantUtil;
import com.okdeer.retail.common.page.EasyUIPageInfo;
import com.okdeer.retail.common.price.DataAccessParser;
import com.okdeer.retail.common.util.GridExportPrintUtils;
import com.okdeer.retail.facade.report.facade.BaseReportFacade;
import com.okdeer.retail.facade.report.qo.BaseReportQo;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 
 * ClassName: BaseReportController 
 * @Description: 报表BaseController
 * @author zhangq
 * @date 2017年7月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
public abstract class BaseReportController<Q extends BaseReportQo, V> extends BaseController<V> {

	/**
	 * @Fields MAX_REPORT_TYPE : 报表最大分类查询类型数
	 */
	public static String MAX_REPORT_TYPE="maxReportType";

	ExecutorService excutor = Executors.newFixedThreadPool(20);

	/**
	 * 
	 * @Description: 获取跳转路径
	 * @return String  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	protected abstract String getViewName();

	/**
	 * 
	 * @Description: 获取Model对象
	 * @param model
	 * @return Model  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	protected abstract Model getModel(Model model);

	/**
	 * 
	 * @Description: 获取查询对象
	 * @param qo
	 * @return Q  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	protected abstract Q getQueryObject(Q qo);

	/**
	 * 
	 * @Description: 获取显示对象的class
	 * @param qo
	 * @return Class<V>  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	protected abstract Class<V> getViewObjectClass();

	/**
	 * 
	 * @Description: 获取facade对象
	 * @return BaseReportFacade<Q,V>  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	protected abstract BaseReportFacade<Q, V> getReportFade();

	/**
	 * 
	 * @Description: 跳转报表首页
	 * @return ModelAndView  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	@RequestMapping(value = "/index")
	public String index(Model model) {
		// 获取model对象
		model = getModel(model);

		// 无权限访问的字段
		Set<String> forbiddenSets = PriceGrantUtil.getNoPriceGrantSets();
		DataAccessParser parser = new DataAccessParser(getViewObjectClass(), forbiddenSets);
		forbiddenSets = parser.getAllForbiddenSets();

		// 所有列
		if (model.containsAttribute("maxReportType")) {
			Integer maxReportType = (Integer) model.asMap().get("maxReportType");
			JSONObject jsonObject = new JSONObject();
			for (int i = 1; i < maxReportType + 1; i++) {
				String columns = GridExportPrintUtils.getAccessGridColumnsJson(getViewObjectClass(), forbiddenSets, i);
				jsonObject.put("columns" + i, columns);
			}
			model.addAttribute("columnsArr", jsonObject);
		} else {
			String columns = GridExportPrintUtils.getAccessGridColumnsJson(getViewObjectClass(), forbiddenSets, null);
			model.addAttribute("columns", columns);
		}

		return getViewName();
	}

	/**
	 * 
	 * @Description: 获取报表数据
	 * @param qo
	 * @param pageNumber
	 * @param pageSize
	 * @return EasyUIPageInfo<V>  
	 * @author zhangq
	 * @date 2017年7月22日
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public EasyUIPageInfo<V> getReportList(Q qo, @RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		try {
			// 分页参数
			qo.setPageNum(pageNumber);
			qo.setPageSize(pageSize);
			getQueryObject(qo);
			// 查询数据
			EasyUIPageInfo<V> page = getReportFade().queryListPage(qo);

			cleanAccessData(page.getList());
			cleanAccessData(page.getFooter());
			return page;
		} catch (Exception e) {
			LOG.error("获取报表数据异常:{}", e);
		}
		return null;
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
	 * @date 2017年7月22日
	 */
	@RequestMapping(value = "/export", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, Q qo) {
		RespJson resp = RespJson.success();
		try {
			getQueryObject(qo);
			//查询合计
			CompletableFuture<V> totalFuture = CompletableFuture.supplyAsync(() -> getReportFade().queryListTotal(qo), excutor);
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
			for(int i = 0; i < resIndex; i++){
				int newStart = (i * LIMIT_REQ_COUNT) + startCount;
				qo.setStartCount(newStart);
				qo.setEndCount(LIMIT_REQ_COUNT);
				List<V> tempList = getReportFade().queryList(qo);
				exportList.addAll(tempList);
				// 如果实际只有100条数据，页面导出输入1-20000，查询到结果集不足每页最大时，不再执行后面的查询
				if(CollectionUtils.isEmpty(tempList) || tempList.size() != LIMIT_REQ_COUNT){
				    break;
				}
			}
			
			// 存在余数时，查询剩余的数据
			if(modIndex > 0){
				int newStart = (resIndex * LIMIT_REQ_COUNT) + startCount;
				int newEnd = modIndex;
				qo.setStartCount(newStart);
				qo.setEndCount(newEnd);
				List<V> tempList = getReportFade().queryList(qo);
				exportList.addAll(tempList);
			}

			exportList.add(totalFuture.get());
			// 无权限访问的字段
			Set<String> forbiddenSets = PriceGrantUtil.getNoPriceGrantSets();
			DataAccessParser parser = new DataAccessParser(getViewObjectClass(), forbiddenSets);
			forbiddenSets = parser.getAllForbiddenSets();

			// 导出
			GridExportPrintUtils.exportAccessExcel(getViewObjectClass(), exportList, forbiddenSets, response,
					qo.getReportType());
		} catch (Exception e) {
			LOG.error("导出列表信息异常:{}", e);
			resp = RespJson.error("导出列表信息异常");
		}
		return resp;
	}

	/**
	 * @Description: 获取列表字段
	 * @param reportType 报表类型
	 * @author zhengwj
	 * @date 2017年9月7日
	 */
	@RequestMapping(value = "getColumns", method = RequestMethod.POST)
	@ResponseBody
	public RespJson getColumns(Integer reportType) {
		RespJson respJson = RespJson.success();
		try {
			// 无权限访问的字段
			Set<String> forbiddenSets = PriceGrantUtil.getNoPriceGrantSets();
			DataAccessParser parser = new DataAccessParser(getViewObjectClass(), forbiddenSets);
			forbiddenSets = parser.getAllForbiddenSets();

			// 所有列
			String columns = GridExportPrintUtils.getAccessGridColumnsJson(getViewObjectClass(), forbiddenSets,
					reportType);
			respJson.put("columns", columns);
		} catch (Exception e) {
			LOG.error("获取列表字段异常:", e);
			respJson = RespJson.error("获取列表字段异常！");
		}
		return respJson;
	}

}
