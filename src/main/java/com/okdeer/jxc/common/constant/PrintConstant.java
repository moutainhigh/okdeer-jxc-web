
package com.okdeer.jxc.common.constant;

/**
 * ClassName: PrintConstant 
 * @Description: 打印常量
 * @author lijy02
 * @date 2016年9月2日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *	商业管理系统		2016.9.2			lijy02				打印常量
 */

public interface PrintConstant {

	/**
	 * @Fields TEMPLATE_DIR : 打印模板文件目录 /template/excel/print
	 */
	String TEMPLATE_PRINT_DIR = "/template/excel/print/";

	/**
	 * @Fields CASH_DAILY_REPORT : 收银日报模版
	 */
	String CASH_DAILY_REPORT = "CashDailyReport.jrxml";

	/**
	 * @Fields GOODS_UNSALE_REPORT : 收银日报模版
	 */
	String GOODS_UNSALE_REPORT = "goodsUnsaleReport.jrxml";

	/**
	 * @Fields CASH_FLOW_REPORT : 收银流水模版
	 */
	String CASH_FLOW_REPORT = "CashFlowReport.jrxml";

	/**
	 * @Fields CASH_CHECK_REPORT : 收银对账报表模版
	 */
	String CASH_CHECK_REPORT = "CashCheckReport.jrxml";

	/**
	 * @Fields CASH_FLOW_REPORT : 销售流水报表模版
	 */
	String SALE_FLOW_REPORT = "SaleFlowReport.jrxml";

	/**
	 * @Fields CASH_DAILY_PRINT_ERROR : 日结报表打印失败
	 */
	String CASH_DAILY_PRINT_ERROR = "日结报表打印失败{}";

	/**
	 * @Fields CASH_FLOW_PRINT_ERROR : 收银流水报表打印失败
	 */
	String CASH_FLOW_PRINT_ERROR = "收银流水报表打印失败{}";

	/**
	 * @Fields CASH_CHECK_PRINT_ERROR ：收银对账打印失败
	 */
	String CASH_CHECK_PRINT_ERROR = "收银对账报表打印失败{}";

	/**
	 * @Fields SALE_FLOW_PRINT_ERROR ：销售流水打印失败
	 */
	String SALE_FLOW_PRINT_ERROR = "销售流水报表打印失败{}";

	String GOODS_UNSALE_PRINT_ERROR = "商品滞销报表打印失败{}";

	/**
	 * @Fields PRINT_LABEL : 商品打印价签名
	 */
	String PRINT_LABEL = "ProductLabel";

	/**
	 * @Fields GOODS_REPORT : 商品报表
	 */
	String GOODS_REPORT = "GoodsReport.jrxml";

	/**
	 * @Fields goods_report_error : 上皮你报表打印失败
	 */
	String GOODS_REPORT_ERROR = "商品报表打印失败{}";

	/**
	 * @Fields PRINT_LIMIT : 打印限最大数量
	 */
	Integer PRINT_MAX_LIMIT = 10000;

	/**
	 * @Fields PRINT_MAX_ROW : 打印限最大数量
	 */
	Integer PRINT_MAX_ROW = 3000;

	/*** 会员消费报表——汇总统计模版	 */
	String MEMBER_TOTAL_ALL_REPORT = "MemberTotalAllReport.jrxml";
	
	/*** 会员消费报表——订单统计模版	 */
	String MEMBER_ORDER_ALL_REPORT = "MemberOrderAllReport.jrxml";

	/*** 会员消费报表——消费明细模版	 */
	String MEMBER_ORDER_LIST_REPORT = "MemberOrderListReport.jrxml";
	
	/*** 员工二维码打印模板	 */
	String USER_CODE_LIST_REPORT = "userCodeListReport.jrxml";

	/** 
	 * @Fields COST_ROTARATE_REPORT : 库存成本周转率
	 */
	String COST_ROTARATE_REPORT = "costRotaRateReport.jrxml";

	/**
	 * @Fields SALE_ROTARATE_REPORT : 库存销售周转率
	 */
	String SALE_ROTARATE_REPORT = "saleRotaRateReport.jrxml";

	/**
	 * @Fields DIFF_DISPOSE_DETAIL : 差异详情
	 */
	String DIFF_DISPOSE_DETAIL = "diffDisposeDetail.jrxml";

	/**
	 * @Fields DIFF_SEARCH_DETAIL : 差异查询明细
	 */
	String DIFF_SEARCH_DETAIL = "diffSearchDetail.jrxml";

	/**
	 * @Fields DIFF_SEARCH_SUMMARIZING : 差异查询汇总
	 */
	String DIFF_SEARCH_SUMMARIZING = "diffSearchSummarizing.jrxml";
	
	/**
	 * @Fields DIFF_SEARCH_CATEGORY_SUM : 差异查询-类别汇总
	 */
	String DIFF_SEARCH_CATEGORY_SUM = "diffSearchCategorySummarizing.jrxml";

	/**
	 * @Fields ROTARATE_PRINT_ERROR ：库存周转率打印失败
	 */
	String ROTARATE_PRINT_ERROR = "库存周转率打印失败{}";

	/**
	 * @Fields STOCK_LEAD : 领用单列表模板
	 */
	String STOCK_LEAD = "StockLead.jrxml";

	/**
	 * @Fields STOCK_LEAD_ERROR ：领用单列表打印失败
	 */
	String STOCK_LEAD_ERROR = "领用单列表打印失败{}";

	/**
	 * @Fields STOCK_REIMBURSE : 报损单列表模板
	 */
	String STOCK_REIMBURSE = "StockReimburse.jrxml";

	/**
	 * @Fields STOCK_REIMBURSE_ERROR ：报损单列表打印失败
	 */
	String STOCK_REIMBURSE_ERROR = "领用单列表打印失败{}";

	/**
	 * @Fields STOCK_TAKING_MISS_GOODS : 漏盘商品列表
	 */
	String STOCK_TAKING_MISS_GOODS = "stockTakingMissGoods.jrxml";

	/**
	 * @Fields OVERDUE_APPLY_REPORT : 调价订单申请打印
	 */
	String OVERDUE_APPLY_REPORT = "overdueApply.jrxml";

	/**
	 * @Fields OVERDUE_APPROVED_REPORT : 调价订单申请打印
	 */
	String OVERDUE_APPROVED_REPORT = "overdueApproved.jrxml";

	/**
	 * @Fields OVERDUE_APPROVED_REPORT_DETAIL : 调价订单申请详情打印
	 */
	String OVERDUE_APPROVED_REPORT_DETAIL = "overdueApprovedDetail.jrxml";

	/**
	 * @Fields DIRECT_RECEIPT : 直送收货列表
	 */
	String DIRECT_RECEIPT = "DirectReceipt.jrxml";

	/**
	 * @Fields DIRECT_RECEIPT_ERROR : 直送收货列表打印失败
	 */
	String DIRECT_RECEIPT_ERROR = "直送收货列表打印失败{}";

	/**
	 * @Fields SUPPLIER_MONTHLY_REPORT : 供应商进销存月报表
	 */
	String SUPPLIER_MONTHLY_REPORT = "SupplierMonthlyReport.jrxml";
	
	/**
	 * @Fields MONTHLY_REPORT : 月进销存报表
	 */
	String MONTHLY_REPORT = "MonthlyReport.jrxml";
	
	/**
	 * 一开通交易明细
	 */
	String ICC_CARD_TRADING_DETAIL = "iccCardTradingDetail.jrxml";
	
	/**
	 * 一卡通交易汇总
	 */
	String ICC_CARD_SUM_TRADING_DETAIL = "iccCardSumTradingDetail.jrxml";

	/**
	 * 供应商进货报表
	 */
	String SUPPLIER_STOCK_REPORT = "SupplierStockReport.jrxml";

	/**
	 * 供应商销售报表
	 */
	String SUPPLIER_SELL_REPORT = "SupplierSellReport.jrxml";

	/**
	 * 门店销售报表
	 */
	String STORE_SELL_REPORT = "StoreSellReport.jrxml";

	/**
	 * 采购成本调整列表
	 */
	String PURCHASE_COST_PRINT = "purchaseCost.jrxml";

	/**
	 * 采购成本调整详细列表
	 */
	String PURCHASE_COST_PRINT_DETAIL = "purchaseCostDetail.jrxml";

}