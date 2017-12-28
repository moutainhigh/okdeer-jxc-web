package com.okdeer.jxc.common.constant;

public interface GpeMarkContrant {

	/**
	 * 报表Moudle
	 */
	String MOUDLE_REPORT = "report";

	/**
	 * 仓库Moudle
	 */
	String MOUDLE_STOCK = "stock";
	
	/** 财务Moudle  */
	String MOUDLE_FINANCE = "finance";
	
	/** 零售Moudle  */
	String MOUDLE_RETAIL = "retail";

	/**
	 * 日结报表Section
	 */
	String SECTION_DAYSUM = "daysum";

	/**
	 * 月结报表Section
	 */
	String SECTION_MONTHSUM = "monthsum";

	/**
	 * 财务月进销存报表
	 */
	String SECTION_FINANCEMONTHSUM = "financeMonthsum";

	/**
	 * 商品销售汇总分析
	 */
	String SECTION_GOODS_SALE_SUMMARY_ANALYSIS = "goodsSaleSummaryAnalysis";

	/**
	 * 收银流水
	 */
	String SECTION_CASH_FLOW = "cashFlow";

	/**
	 * 收银对账
	 */
	String SECTION_CASH_DAILY_REPORT = "cashDailyReport";

	/**
	 * 库存明细
	 */
	String SECTION_STOCK_DETAIL = "stockDetail";
	
	/**
	 * 门店日盈亏分析
	 */
	String SECTION_BEPDAY_ANALYSIS = "bepDayAnalysis";
	
	/**
	 * @Fields SECTION_STORE_SELL : ，门店进销存汇总分钟
	 */
	String SECTION_STORE_SELL = "storeSell";

	/**
	 * 一卡通账号充值提现明细
	 */
	String SECTION_ICCARD_DETAIL = "icCardDetail";
	
	/**
	 * @Fields SECTION_STORE_ATTENDANCE : 员工考勤查询
	 */
	String SECTION_STORE_ATTENDANCE = "storeAttendance";
	
	/**
	 * @Fields SECTION_EMPLOYEE_DISCOUNT : 员工折扣消费查询
	 */
	String SECTION_EMPLOYEE_DISCOUNT = "employeeDiscount";
	
	/**
	 * 通用Key:list
	 */
	String KEY_LIST = "list";

	/**
	 * 按商品汇总
	 */
	String KEY_BY_GOODS = "byGoods";

	/**
	 * 按大类汇总
	 */
	String KEY_BY_BIG_CATEGORY = "byGigCategory";

	/**
	 * 按店铺汇总
	 */
	String KEY_BY_STORE = "byStore";

	/**
	 * 按店铺商品汇总
	 */
	String KEY_BY_STORE_GOODS = "byStoreGoods";

	/**
	 * 按大类汇总
	 */
	String KEY_BY_CASHIER = "cashier";

	/**
	 * 机构汇总
	 */
	String KEY_BY_BRANCH = "branch";

	/**
	 * 日期汇总
	 */
	String KEY_BY_DATE = "date";
	
	/**
	 * 含折旧
	 */
	String KEY_BY_DEPRECIATION = "depreciation";
	/**
	 * 不含折旧
	 */
	String KEY_BY_UN_DEPRECIATION = "unDepreciation";
	
	/*** 用户发票处理 报表  */
	String INVOICE_FORM_REPORT = "invoiceFormReport";
	
	/*** 开店费用查询 报表  */
	String BUILD_CHARGE_SEARCH_REPORT = "buildChargeSearchReport";
	
	/*** 奖券登记查询 报表  */
	String LOTTERY_SEARCH_REPORT = "lotterySearchReport";

}
