/** 
 *@Project: okdeer-jxc-web 
 *@Author: liwb
 *@Date: 2016年8月31日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.utils.poi;

import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.utils.NumberUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

/**
 * ClassName: ExcelReaderUtil 
 * @Description: Excel 读取工具类
 * @author liwb
 * @date 2016年8月31日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * 商业管理系统1.0.0    2016年8月31日                  liwb				 Excel 读取工具类
 * 商业管理系统1.0.0    2016年9月8日                     zhangq              规范代码，增加私有构造函数用以隐藏公开构造函数
 */
public class ExcelReaderUtil {

	// Begin added by zhangq 2016-09-08 增加私有构造函数用以隐藏公开构造函数
	/**
	 * 私有构造函数
	 * <p>Title: 私有构造函数</p> 
	 * <p>Description: 增加私有构造函数用以隐藏公开构造函数</p>
	 */
	private ExcelReaderUtil() {

	}

	// End added by zhangq 2016-09-08 增加私有构造函数用以隐藏公开构造函数

	/**
	 * LOG
	 */
	private static final Logger LOG = LoggerFactory.getLogger(ExcelReaderUtil.class);

	/**
	 * @Fields OFFICE_EXCEL_2003_POSTFIX : xls格式，2003版本
	 */
	public static final String OFFICE_EXCEL_2003_POSTFIX = "xls";

	/**
	 * @Fields OFFICE_EXCEL_2010_POSTFIX : xlsx格式，2007版本
	 */
	public static final String OFFICE_EXCEL_2010_POSTFIX = "xlsx";

	/**
	 * @Fields POINT : 字符"."
	 */
	public static final String POINT = ".";

	/**
	 * @Description: 根据文件名，获取文件后缀，用于判断Excel格式，xls（2003），xlsx（2007）
	 * @param fileName
	 * @return
	 * @author liwb
	 * @date 2016年8月31日
	 */
	public static String getSuffix(String fileName) {
		if (StringUtils.isBlank(fileName)) {
			return null;
		}
		if (fileName.contains(POINT)) {
			StringBuilder sb = new StringBuilder(fileName);
			return sb.substring(sb.lastIndexOf(POINT) + 1, sb.length());
		}
		return null;
	}

	/**
	 * @Description: 读取Excel，返回数据列表，自动判断格式 xls（2003），xlsx（2007）
	 * @param fileName 文件名
	 * @param is	文件流
	 * @param fields 字段名称
	 * @param entity 实体类
	 * @return
	 * @author liwb
	 * @date 2016年8月31日
	 */
	public static <T> List<T> readExcel(String fileName, InputStream is, String[] fields, T entity) {
		if (StringUtils.isBlank(fileName)) {
			return Collections.emptyList();
		}

		// 根据文件名，获取文件后缀
		String postfix = getSuffix(fileName);

		if (StringUtils.isBlank(postfix)) {
			LOG.warn("文件名 [{}] suffix is empty", fileName);
			return Collections.emptyList();
		}
		List<T> importList = new ArrayList<>();
		// xls(2003)格式
		if (OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
		    importList = readXls(is, fields, entity);
		} else if (OFFICE_EXCEL_2010_POSTFIX.equals(postfix)) {
			// xlsx(2007)格式
		    importList = readXlsx(is, fields, entity);
		}
		LOG.debug("文件[{}], 后缀名为=[{}]", fileName, postfix);
        if (CollectionUtils.isNotEmpty(importList) && importList.size() > 1001) {
            throw new BusinessException("每次最多只能导入1000条数据，请修改导入文件数据后，重新导入.");
        }
		return importList;
	}

	/**
	 * @Description: 读取Excel，返回数据列表，自动判断格式 xls（2003），xlsx（2007）
	 * @param fileName 文件名
	 * @param is	文件流
	 * @param fields 字段列表
	 * @return JSONObject List
	 * @author liwb
	 * @date 2016年10月13日
	 */
	public static List<JSONObject> readExcel(String fileName, InputStream is, String[] fields) {
		if (StringUtils.isBlank(fileName)) {
			return Collections.emptyList();
		}

		// 根据文件名，获取文件后缀
		String postfix = getSuffix(fileName);

		if (StringUtils.isBlank(postfix)) {
			LOG.warn("文件名 [{}] suffix is empty", fileName);
			return Collections.emptyList();
		}

		List<JSONObject> importList = new ArrayList<>();
		// xls(2003)格式
		if (OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
		    importList = readXls(is, fields);
		} else if (OFFICE_EXCEL_2010_POSTFIX.equals(postfix)) {
			// xlsx(2007)格式
		    importList = readXlsx(is, fields);
		}
		LOG.debug("文件[{}], 后缀名为=[{}]", fileName, postfix);
        if (CollectionUtils.isNotEmpty(importList) && importList.size() > 1001) {
            throw new BusinessException("每次最多只能导入1000条数据，请修改导入文件数据后，重新导入.");
        }
		return importList;
	}

	/**
	 * @Description: 读取Excel第一列的数据，并返回数据列表
	 * @param fileName
	 * @param is
	 * @param entity
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	public static <T> List<T> readExcelForFirstColumn(String fileName, InputStream is, T entity) {
		if (StringUtils.isBlank(fileName)) {
			return Collections.emptyList();
		}

		// 根据文件名，获取文件后缀
		String postfix = getSuffix(fileName);

		if (StringUtils.isBlank(postfix)) {
			LOG.warn("文件名 [{}] suffix is empty", fileName);
			return Collections.emptyList();
		}

		// xls(2003)格式
		if (OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
			return readXlsForFirstColumn(is, entity);
		} else if (OFFICE_EXCEL_2010_POSTFIX.equals(postfix)) {
			// xlsx(2007)格式
			return readXlsxForFirstColumn(is, entity);
		}
		LOG.debug("文件[{}], 后缀名为=[{}]", fileName, postfix);
		return Collections.emptyList();
	}

	/**
	 * @Description: 读取Excel标题栏列表,xlsx格式(2007)
	 * @param is
	 * @return
	 * @author liwb
	 * @date 2016年8月31日
	 */
	public static List<String> readXlsxTitle(InputStream is) {
		XSSFWorkbook workbook = null;
		try {
			workbook = new XSSFWorkbook(is);
			XSSFSheet sheet = workbook.getSheetAt(0);
			XSSFRow row = sheet.getRow(0);
			int cellCount = row.getLastCellNum();
			List<String> list = new ArrayList<String>();
			String title = null;

			// Read the Cell，循环遍历Excel单元格
			for (int cellNum = 0; cellNum < cellCount; cellNum++) {
				XSSFCell cell = row.getCell(cellNum);
				if (cell == null) {
					continue;
				}
				Object content = getValue(cell);
				title = content == null ? "" : content.toString();
				list.add(title);
			}
			return list;
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 读取Excel标题栏列表,xls格式(2003)
	 * @param is
	 * @return
	 * @author liwb
	 * @date 2016年8月31日
	 */
	public static List<String> readXlsTitle(InputStream is) {
		HSSFWorkbook workbook = null;
		try {
			workbook = new HSSFWorkbook(is);
			HSSFSheet sheet = workbook.getSheetAt(0);
			HSSFRow row = sheet.getRow(0);
			int cellCount = row.getLastCellNum();
			List<String> list = new ArrayList<String>();
			String title = null;

			// Read the Cell，循环遍历Excel单元格
			for (int cellNum = 0; cellNum < cellCount; cellNum++) {
				HSSFCell cell = row.getCell(cellNum);
				if (cell == null) {
					continue;
				}
				Object content = getValue(cell);
				title = content == null ? "" : content.toString();
				list.add(title);
			}
			return list;
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 读取xlsx 2007  格式的Excel，并返回List数据
	 * @param is	InputStream 文件流
	 * @param fields 标题字段名称
	 * @param entity 实体类对象	
	 * @return 实体类列表
	 * @author liwb
	 * @date 2016年8月31日
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> readXlsx(InputStream is, String[] fields, T entity) {

		LOG.debug("读取Excel文件, 表头为={}, 实体为={}", Arrays.toString(fields), entity);
		XSSFWorkbook workbook = null;
		try {
			workbook = new XSSFWorkbook(is);
			JSONArray jArray = readSheet(workbook, fields);

			return JSONArray.toList(jArray, entity, new JsonConfig());
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}
	
	/**
	 * @Description: 读取xlsx 2007  格式的Excel，并返回List数据
	 * @param is	InputStream 文件流
	 * @param fields 标题字段名称
	 * @param entity 实体类对象	
	 * @return 实体类列表
	 * @author liwb
	 * @date 2016年8月31日
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> readXlsx(InputStream is, int beginSkip, int endSkip, int[] columns, String[] fields, T entity) {
		LOG.debug("读取Excel文件, 表头为={}, 实体为={}", Arrays.toString(fields), entity);
		XSSFWorkbook workbook = null;
		try {
			workbook = new XSSFWorkbook(is);
			JSONArray jArray = readSheet(workbook,beginSkip,endSkip,columns, fields);

			return JSONArray.toList(jArray, entity, new JsonConfig());
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}
	

	/**
	 * @Description: 读取xlsx 2007  格式的Excel，并返回List JSONObject数据
	 * @param is	InputStream 文件流
	 * @param fields	标题字段名称
	 * @return
	 * @author liwb
	 * @date 2016年10月13日
	 */
	@SuppressWarnings("unchecked")
	public static List<JSONObject> readXlsx(InputStream is, String[] fields) {

		LOG.debug("读取Excel文件, 表头为={}", Arrays.toString(fields));
		XSSFWorkbook workbook = null;
		try {
			workbook = new XSSFWorkbook(is);
			JSONArray jArray = readSheet(workbook, fields);

			return JSONArray.toList(jArray, new JSONObject(), new JsonConfig());
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 读取sheet
	 * @param workbook
	 * @param fields
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static JSONArray readSheet(Workbook workbook, String[] fields) {
		JSONArray jArray = new JSONArray();

		// sheet count
		int sheetCount = workbook.getNumberOfSheets();

		// Read the Sheet，循环遍历sheet页
		for (int sheetNum = 0; sheetNum < sheetCount; sheetNum++) {
			Sheet sheet = workbook.getSheetAt(sheetNum);
			if (sheet == null) {
				continue;
			}

			readRow(sheet, fields, jArray);
		}

		return jArray;
	}

	/**
	 * @Description: 读取行
	 * @param sheet
	 * @param fields
	 * @param jArray
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static void readRow(Sheet sheet, String[] fields, JSONArray jArray) {
		int rowCount = sheet.getLastRowNum();
		// Read the Row，循环遍历Excel行数,从第0行开始读取，第0行为标题，用于判断货号和条码，判断模板是否正确
		for (int rowNum = 0; rowNum <= rowCount; rowNum++) {
			Row row = sheet.getRow(rowNum);
			if (row == null) {
				continue;
			}

			readCell(row, fields, jArray);
		}

		// 读取表格后循环检查所有字段是否存在，不存在的补空，防止后面使用时报错
		for (int i = 0; i < jArray.size(); i++) {
			JSONObject jsonObject = jArray.getJSONObject(i);
			for (String columnName : fields) {
				if (!jsonObject.containsKey(columnName)) {
					jsonObject.element(columnName, "");
				}
				// 读取条码后需要去掉空格
				if ("barCode".equals(columnName)) {
					String barCode = (String) jsonObject.get(columnName);
					jsonObject.put(columnName, barCode.replace(" ", ""));
				}
			}
		}
	}

	/**
	 * @Description: 读取单元格
	 * @param row
	 * @param fields
	 * @param jArray
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static void readCell(Row row, String[] fields, JSONArray jArray) {
		JSONObject json = null;

		boolean isBlankRow = true;

		// Read the Cell，循环遍历Excel单元格
		for (int cellNum = 0; cellNum < fields.length; cellNum++) {
			if (json == null) {
				json = new JSONObject();
			}
			Cell cell = row.getCell(cellNum);
			if (cell == null) {
				continue;
			}
			Object content = getValue(cell);

			if (isBlankRow && ((content instanceof String && StringUtils.isNotBlank((String) content))
					|| content instanceof Double)) {
				isBlankRow = false;
			}

			json.element(fields[cellNum], content);
		}

		if (!isBlankRow && json != null && !json.isEmpty()) {
			jArray.add(json);
		}
	}

	/**
	 * @Description: 07版本读取Excel第一列
	 * @param is
	 * @param entity
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static <T> List<T> readXlsxForFirstColumn(InputStream is, T entity) {

		LOG.debug("读取Excel文件, 实体为={}", entity);
		Workbook workbook = null;
		try {
			workbook = new XSSFWorkbook(is);

			return readFiirstColumnCommon(workbook, entity);
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();

	}

	/**
	 * @Description: 03版本读取Excel第一列
	 * @param is
	 * @param entity
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static <T> List<T> readXlsForFirstColumn(InputStream is, T entity) {
		LOG.debug("读取Excel文件, 数据实体为={}", entity);
		Workbook workbook = null;
		try {
			workbook = new HSSFWorkbook(is);

			return readFiirstColumnCommon(workbook, entity);
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 获取第一列的通用方法
	 * @param entity
	 * @param workbook
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	@SuppressWarnings("unchecked")
	private static <T> List<T> readFiirstColumnCommon(Workbook workbook, T entity) {
		// 只读取第一个sheet
		Sheet sheet = workbook.getSheetAt(0);

		JSONArray jArray = readRowColumn(sheet, entity);

		return JSONArray.toList(jArray, entity, new JsonConfig());
	}

	/**
	 * @Description: 只读取第一个sheet，第一列
	 * @param sheet
	 * @param entity
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static <T> JSONArray readRowColumn(Sheet sheet, T entity) {
		int rowCount = sheet.getLastRowNum();

		JSONArray jArray = new JSONArray();

		// Read the Row，循环遍历Excel行数,从第1行开始读取，第0行为标题，只读取第一列
		for (int rowNum = 1; rowNum <= rowCount; rowNum++) {
			Row row = sheet.getRow(rowNum);
			if (row == null) {
				continue;
			}

			// 只读取第一列
			Cell cell = row.getCell(0);
			if (cell == null) {
				continue;
			}
			Object content = getValue(cell);

			if (entity instanceof String) {
				content = String.valueOf(content);
			}
			jArray.add(content);
		}

		return jArray;
	}

	/**
	 * @Description: 关闭流
	 * @param is
	 * @param workbook
	 * @author liwb
	 * @date 2016年9月17日
	 */
	private static void closeIO(InputStream is, Workbook workbook) {
		try {
			if (workbook != null) {
				workbook.close();
			}
			if (is != null) {
				is.close();
			}
		} catch (IOException e) {
			LOG.error("流已关闭:", e);
		}
	}

	/**
	 * @Description: 读取xlsx 2003  格式的Excel，并返回List数据
	 * @param is	InputStream 文件流
	 * @param fields 标题字段名称
	 * @param entity 实体类对象	
	 * @return 实体类列表
	 * @author liwb
	 * @date 2016年8月31日
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> readXls(InputStream is, String[] fields, T entity) {
		LOG.debug("读取Excel文件, 文件表头为={}, 数据实体为={}", Arrays.toString(fields), entity);
		HSSFWorkbook workbook = null;
		try {
			workbook = new HSSFWorkbook(is);
			JSONArray jArray = readSheet(workbook, fields);
			return JSONArray.toList(jArray, entity, new JsonConfig());
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 读取xlsx 2003  格式的Excel，并返回List JSONObject数据
	 * @param is
	 * @param fields
	 * @return
	 * @author liwb
	 * @date 2016年10月13日
	 */
	@SuppressWarnings("unchecked")
	public static List<JSONObject> readXls(InputStream is, String[] fields) {
		LOG.debug("读取Excel文件, 文件表头为={}", Arrays.toString(fields));
		HSSFWorkbook workbook = null;
		try {
			workbook = new HSSFWorkbook(is);
			JSONArray jArray = readSheet(workbook, fields);
			return JSONArray.toList(jArray, new JSONObject(), new JsonConfig());
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 得到execl值，object类型
	 * @param cell
	 * @return   
	 * @return Object  
	 * @throws
	 * @author yangyq02
	 * @date 2016年9月6日
	 */
	private static Object getValue(Cell cell) {
		if (cell == null) {
			return null;
		}
		Object obj = null;
		switch (cell.getCellType()) {
			case Cell.CELL_TYPE_BOOLEAN:
				obj = cell.getBooleanCellValue();
				break;
			case Cell.CELL_TYPE_NUMERIC:

				// 科学计数法格式化
				obj = getScienceNum(cell);
				break;
			case Cell.CELL_TYPE_FORMULA:

				// 如果是Date类型则，转化为Data格式
				obj = getDateValue(cell);
				break;
			default:
				obj = cell.getStringCellValue();
				break;
		}
		return obj;
	}

	/**
	 * @Description: Data类型格式化
	 * @param cell
	 * @return
	 * @author liwb
	 * @date 2016年9月17日
	 */
	private static Object getDateValue(Cell cell) {
		Object obj;
		if (DateUtil.isCellDateFormatted(cell)) {
			obj = cell.getDateCellValue();
		} else {
			// 如果是纯数字
			obj = cell.getNumericCellValue();
		}
		return obj;
	}

	/**
	 * @Description: 科学计数法格式化
	 * @param cell
	 * @param obj
	 * @return
	 * @author liwb
	 * @date 2016年9月17日
	 */
	private static Object getScienceNum(Cell cell) {
		Object obj = null;

		// 如果是日期类型
		if (DateUtil.isCellDateFormatted(cell)) {
			return cell.getDateCellValue();
		} else {
			// 如果是纯数字
			obj = cell.getNumericCellValue();

			// 解决数字，默认加0的问题
			if (cell.toString().endsWith(".0")) {
				obj = new DecimalFormat("#").format(Double.parseDouble(cell.toString()));
			}
		}

		if (NumberUtils.isENum(String.valueOf(obj))) {
			DecimalFormat df = new DecimalFormat("0");
			obj = df.format(obj);
		}
		return obj;
	}

	/**
	 * @Description: 读取xlsx 2003  格式的Excel，并返回List数据
	 * @param is	InputStream 文件流
	 * @param fields 标题字段名称
	 * @param entity 实体类对象	
	 * @return 实体类列表
	 * @author liwb
	 * @date 2016年8月31日
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> readXls(InputStream is, int beginSkip, int endSkip, int[] columns, String[] fields,
			T entity) {
		LOG.debug("读取Excel文件, 文件表头为={}, 数据实体为={}", Arrays.toString(fields), entity);
		HSSFWorkbook workbook = null;
		try {
			workbook = new HSSFWorkbook(is);
			JSONArray jArray = readSheet(workbook, beginSkip, endSkip, columns, fields);
			return JSONArray.toList(jArray, entity, new JsonConfig());
		} catch (IOException e) {
			LOG.error("读取Excel文件出错:", e);
		} finally {
			closeIO(is, workbook);
		}
		return Collections.emptyList();
	}

	/**
	 * @Description: 读取sheet
	 * @param workbook
	 * @param fields
	 * @return
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static JSONArray readSheet(Workbook workbook, int beginSkip, int endSkip, int[] columns, String[] fields) {
		JSONArray jArray = new JSONArray();

		// sheet count
		int sheetCount = workbook.getNumberOfSheets();

		// Read the Sheet，循环遍历sheet页
		for (int sheetNum = 0; sheetNum < sheetCount; sheetNum++) {
			Sheet sheet = workbook.getSheetAt(sheetNum);
			if (sheet == null) {
				continue;
			}

			readRow(sheet, beginSkip, endSkip, columns, fields, jArray);
		}

		return jArray;
	}

	/**
	 * @Description: 读取行
	 * @param sheet
	 * @param fields
	 * @param jArray
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static void readRow(Sheet sheet, int beginSkip, int endSkip, int[] columns, String[] fields,
			JSONArray jArray) {
		int rowCount = sheet.getLastRowNum();
		// Read the Row，循环遍历Excel行数,从第0行开始读取，第0行为标题，用于判断货号和条码，判断模板是否正确
		for (int rowNum = beginSkip; rowNum <= rowCount - endSkip; rowNum++) {
			Row row = sheet.getRow(rowNum);
			if (row == null) {
				continue;
			}

			readCell(row, columns, fields, jArray);
		}

		// 读取表格后循环检查所有字段是否存在，不存在的补空，防止后面使用时报错
		for (int i = 0; i < jArray.size(); i++) {
			JSONObject jsonObject = jArray.getJSONObject(i);
			for (String columnName : fields) {
				if (!jsonObject.containsKey(columnName)) {
					jsonObject.element(columnName, "");
				}
			}
		}
	}

	/**
	 * @Description: 读取单元格
	 * @param row
	 * @param fields
	 * @param jArray
	 * @author liwb
	 * @date 2016年9月24日
	 */
	private static void readCell(Row row, int[] columns, String[] fields, JSONArray jArray) {
		JSONObject json = null;

		boolean isBlankRow = true;

		// Read the Cell，循环遍历Excel单元格
		for (int cellNum = 0; cellNum < columns.length; cellNum++) {
			if (json == null) {
				json = new JSONObject();
			}

			Cell cell = row.getCell(columns[cellNum]);
			if (cell == null) {
				continue;
			}
			Object content = getValue(cell);

			if (isBlankRow && ((content instanceof String && StringUtils.isNotBlank((String) content))
					|| content instanceof Double)) {
				isBlankRow = false;
			}

			json.element(fields[cellNum], content);
		}

		if (!isBlankRow && json != null && !json.isEmpty()) {
			jArray.add(json);
		}
	}
}
