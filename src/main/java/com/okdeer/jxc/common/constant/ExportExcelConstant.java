
package com.okdeer.jxc.common.constant;

/**
 * ClassName: ExportExcelConstant 
 * @Description: 导出Excel常量类
 * @author liwb
 * @date 2016年8月22日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * 商业管理系统1.0.0	  2016年8月18日			 liwb			     导出Excel常量类
 */

public interface ExportExcelConstant {

	/**
	 * @Fields TEMPLATE_DIR : 导出模板文件目录 /template/excel/
	 */
	String TEMPLATE_EXPORT_DIR = "/template/excel/export/";

	/**
	 * @Fields EXPORT_MAX_SIZE : 导出最大记录数
	 */
	int EXPORT_MAX_SIZE = 20001;

	/**
	 * @Fields EXPORT_SHEET_PAGE_SIZE : 每页显示大小，1000
	 */
	int EXPORT_SHEET_PAGE_SIZE = 1000;

	/**
	 * @Fields USER_LIST : 用户列表模板文件名称“UserList.xlsx”
	 */
	String USER_LIST = "UserList.xlsx";

	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM : 调价单模版名称“GoodsPriceAdjustForm.xlsx”
	 */
	String GOODS_PRICE_ADJUST_FORM = "GoodsPriceAdjustForm.xlsx";

	/**
	 * @Fields GOODS_BRANCH_PRICE_ADJUST_FORM : 调价单模版名称“GoodsBranchPriceAdjustForm.xlsx”
	 */
	String GOODS_BRANCH_PRICE_ADJUST_FORM = "GoodsBranchPriceAdjustForm.xlsx";

	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM : 采购明细表
	 */
	String PURCHASE_DETAIL_REPORT = "PurchaseDetail.xlsx";
	
	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM : 要货与库存报表
	 */
	String DELIVER_AND_STOCK_REPORT = "DeliverAndStockReport.xlsx";
	
	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM : 东莞大仓补货分析
	 */
	String DG_STOCK_ANALYSIS = "DgStockAnalysis.xlsx";

	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM_TEMPLE_SKUCODE : 调价单货号导入模板
	 */
	String GOODS_PRICE_ADJUST_FORM_TEMPLE_SKUCODE = "priceAdjustSkuTemp.xlsx";

	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM_TEMPLE_BARCODE : 调价单条形码模板
	 */
	String GOODS_PRICE_ADJUST_FORM_TEMPLE_BARCODE = "priceAdjustBarTemp.xlsx";

	/**
	     * @Fields GOODS_BRANCH_PRICE_ADJUST_TEMPLE_SKUCODE : 门店调价单货号导入模板
	 */
	String GOODS_BRANCH_PRICE_ADJUST_TEMPLE_SKUCODE = "branchPriceAdjustSkuTemp.xlsx";

	/**
	 * @Fields GOODS_BRANCH_PRICE_ADJUST_TEMPLE_BARCODE : 门店调价单货号导入模板
	 */
	String GOODS_BRANCH_PRICE_ADJUST_TEMPLE_BARCODE = "branchPriceAdjustBarTemp.xlsx";

	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM_TEMPLE_SKUCODE : 成本调价单货号导入模板
	 */
	String COST_GOODS_PRICE_ADJUST_FORM_TEMPLE_SKUCODE = "costPriceAdjustSkuTemp.xlsx";

	/**
	 * @Fields GOODS_PRICE_ADJUST_FORM_TEMPLE_BARCODE : 调价单条形码模板
	 */
	String COST_GOODS_PRICE_ADJUST_FORM_TEMPLE_BARCODE = "costPriceAdjustBarTemp.xlsx";

	/**
	 * 库存调整
	 */
	String STOCKADJUST = "StockAdjust.xlsx";

	/**
	 * @Fields STOCK_LEAD_SKU_TEMPLE : 领用单货号导入模板
	 */
	String STOCK_LEAD_SKU_TEMPLE = "StockLeadSkuTemple.xlsx";

	/**
	 * @Fields STOCK_LEAD_BAR_TEMPLE : 领用单条码导入模板
	 */
	String STOCK_LEAD_BAR_TEMPLE = "StockLeadBarTemple.xlsx";

	/**
	 * @Fields STOCKLEAD : 领用单导出模板
	 */
	String STOCKLEAD = "StockLead.xlsx";
	
	/**
	 * @Fields STOCK_LEAD_DETAIL : 领用查询导出模板-领用明细
	 */
	String STOCK_LEAD_DETAIL = "StockLeadDetail.xlsx";
	
	/**
	 * @Fields STOCK_LEAD_GOODS : 领用查询导出模板-商品汇总
	 */
	String STOCK_LEAD_GOODS = "StockLeadGoods.xlsx";
	
	/**
	 * @Fields STOCK_LEAD_FIRST_CATEGORY : 领用查询导出模板-一级类别
	 */
	String STOCK_LEAD_FIRST_CATEGORY = "StockLeadFirstCategory.xlsx";
	
	/**
	 * @Fields STOCK_LEAD_SECOND_CATEGORY : 领用查询导出模板-二级类别
	 */
	String STOCK_LEAD_SECOND_CATEGORY = "StockLeadSecondCategory.xlsx";

	/**
	 * @Fields STOCK_REIMBURSE_SKU_TEMPLE : 报损单货号导入模板
	 */
	String STOCK_REIMBURSE_SKU_TEMPLE = "StockReimburseSkuTemple.xlsx";

	/**
	 * @Fields STOCK_REIMBURSE_BAR_TEMPLE : 报损单条码导入模板
	 */
	String STOCK_REIMBURSE_BAR_TEMPLE = "StockReimburseBarTemple.xlsx";

	/**
	 * @Fields STOCKREIMBURSE : 报损单导出模板
	 */
	String STOCKREIMBURSE = "StockReimburse.xlsx";

	/**
	 * @Fields STOCK_REIMBURSE_DETAIL : 报损查询导出模板-领用明细
	 */
	String STOCK_REIMBURSE_DETAIL = "StockReimburseDetail.xlsx";
	
	/**
	 * @Fields STOCK_REIMBURSE_GOODS : 报损查询导出模板-商品汇总
	 */
	String STOCK_REIMBURSE_GOODS = "StockReimburseGoods.xlsx";
	
	/**
	 * @Fields STOCK_REIMBURSE_FIRST_CATEGORY : 报损查询导出模板-一级类别
	 */
	String STOCK_REIMBURSE_FIRST_CATEGORY = "StockReimburseFirstCategory.xlsx";
	
	/**
	 * @Fields STOCK_REIMBURSE_SECOND_CATEGORY : 报损查询导出模板-二级类别
	 */
	String STOCK_REIMBURSE_SECOND_CATEGORY = "StockReimburseSecondCategory.xlsx";
	
	/**
	 * 商品销售汇总
	 */
	String GOODS_SALE_REPORT = "goodsSaleReport.xlsx";

	String CATEGORY_SALE_REPORT = "categorySaleReport.xlsx";

	String STORE_DAY_SALE_REPORT = "storeDaySaleReport.xlsx";

	String GOODS_SALE_AMOUNT_REPORT = "goodsSaleAmountReport.xlsx";

	String POOL_SALE_REPORT = "poolSaleReport.xlsx";

	String GOODS_UNSALE_REPORT = "goodsUnsaleReport.xlsx";

	String DAY_REPORT = "dayReport.xlsx";

	String POOL_SALE_DETAIL_REPORT = "poolSaleDetailReport.xlsx";

	String GOODS_SALE_NUM_REPORT = "goodsSaleNumReport.xlsx";

	String GOODS_SALE_PROFIT_REPORT = "goodsSaleProfitReport.xlsx";

	String GOODS_OUT_IN_DETAIL_REPORT = "goodsOutInDetailReport.xlsx";

	String STOCK_ADJUST_SKU_TEMPLE = "StockAdjustSkuTemple.xlsx";

	String STOCK_ADJUST_BAR_TEMPLE = "StockAdjustBarTemple.xlsx";

	String GOODS_STATUS_SKU_TEMPLE = "GoodsStatusSkuTemple.xlsx";

	String GOODS_STATUS_BAR_TEMPLE = "GoodsStatusBarTemple.xlsx";

	/**
	 * @Fields BARCODE_TEMPLE_TYPE : 条形码模板类型
	 */
	String BARCODE_TEMPLE_TYPE = "barCodeTemple";

	/**
	 * @Fields SKUCODE_TEMPLE_TYPE : 货号模板类型
	 */
	String SKUCODE_TEMPLE_TYPE = "skuCodeTemple";

	/**
	 * @Fields BARCODE_TEMPLE : 条码导出模板
	 */
	String BARCODE_TEMPLE = "barCodeTemp.xlsx";

	/**
	 * @Fields SKUCODE_TEMPLE : 货号导出模板
	 */
	String SKUCODE_TEMPLE = "skuCodeTemp.xlsx";

	/**
	 * 商品档案导出模板
	 */
	String GOODS_EXPORT_EXCEL = "goodsExport.xlsx";

	/** 
	 * 商品存量修改-导入货号模板
	 */
	String STOCK_INDEX_SKU_TEMPLE = "StockIndexSkuTemple.xlsx";

	/**
	 * 商品存量修改-导入条码模板
	 */
	String STOCK_INDEX_BAR_TEMPLE = "StockIndexBarTemple.xlsx";

	/**
	 * 商品供应商档案模板
	 */
	String SUPPLIER_EXPORT_EXCEL = "supplierExport.xlsx";
	
	/**
	 * 物流供应商档案导出模板
	 */
	String SUPPLIER_LOGISTICS_EXPORT_EXCEL = "supplierLogisticsExport.xlsx";
	
	/*** 机构信息导出模板  */
	String BRANCH_EXPORT_TEMPLATE = "branchExportTemplate.xlsx";
	
	/*** 机构信息导出模板  */
	String BRANCH_LOGISTICS_EXPORT = "branchLogisticsExport.xlsx";
	
	/*** 物流导出销售单模板  */
	String DELIVER_FORM_LISTLOGISTICS = "DeliverFormListLogistics.xlsx";
	
	/*** 物流导出销售单列表  */
	String DELIVER_FORMS = "DeliverForms.xlsx";
	
	/*** 物流导出门店退货单列表  */
	String DELIVER_DR_FORMS = "DeliverDrForms.xlsx";
	
	/*** 物流导出门店回单列表  */
	String DELIVER_DB_FORMS = "DeliverDbForms.xlsx";
	
	/*** 物流导出采购单列表  */
	String PURCHASE_FORMS = "PurchaseForms.xlsx";
	
	/*** 物流导出供应商退货单列表  */
	String PURCHASE_PR_FORMS = "PurchasePrForms.xlsx";
	
	/*** 物流导出销售单模板  */
	String DELIVER_FORM_DBSHEET = "DBSheet.xlsx";
	
	/*** 物流导出退货单模板  */
	String DELIVER_FORM_RETURN_LISTLOGISTICS = "DeliverFormListReturnLogistics.xlsx";
	
	/*** 财务代码导出模板  */
	String FINANCE_CODE_EXPORT_TEMPLATE = "financeCodeExportTemplate.xlsx";
	
	/*** 门店费用汇总导出模板  */
	String STORE_CHARGE_TOTAL_EXPORT_TEMPLATE = "storeChargeTotalExportTemplate.xlsx";
	
	/*** 门店费用明细导出模板  */
	String STORE_CHARGE_DETAIL_EXPORT_TEMPLATE = "storeChargeDetailExportTemplate.xlsx";
	
	/*** 日盈亏平衡分析导出模板  */
	String BEY_DAY_ANALYSIS_EXPORT_TEMPLATE = "beyDayAnalysisExportTemplate.xlsx";
	
	/*** 月盈亏平衡分析导出模板  */
	String BEY_MONTH_ANALYSIS_EXPORT_TEMPLATE = "beyMonthAnalysisExportTemplate.xlsx";
	
	/*** 门店月盈亏平衡明细分析导出模板  */
	String BEY_MONTH_DETAIL_EXPORT_TEMPLATE = "beyMonthDetailExportTemplate.xlsx";
	
	/*** 门店费用详情列表导出模板  */
	String STORE_CHARGE_MAIN_EXPORT_TEMPLATE = "storeChargeMainExportTemplate.xlsx";
	/**
	 * 门店固定费用详情列表导出模板
	 */
	String FINANCE_CHARGE_MAIN_EXPORT_TEMPLATE = "financeChargeMainExportTemplate.xlsx";

	/*** 系统操作日志列表导出模板  */
	String SYS_OPERATE_LOG_EXPORT_TEMPLATE = "sysOperateLogExportTemplate.xlsx";
	
	/*** 线上订单查询列表导出模板  */
	String ONLINE_ORDER_SEARCH_LIST_EXPORT_TEMPLATE = "onlineOrderSearchListExportTemplate.xlsx";
	
	/*** 线上订单商品信息列表导出模板  */
	String ONLINE_ORDER_GOODS_DETAIL_EXPORT_TEMPLATE = "onlineOrderGoodsDetailExportTemplate.xlsx";
	
	/*** 门店费用详情导入模板  */
	String STORE_CHARGE_MAIN_IMPORT_TEMPLATE = "storeChargeMainImportTemplate.xlsx";
	
	/*** 门店目标计划环比导出模板  */
	String STORE_PLAN_MOM_REPORT_TEMPLATE = "storePlanMoMReportTemplate.xlsx";
	
	/*** 商品引入导出模板  */
	String BRANCH_GOODS_EXPORT_TEMPLATE = "branchGoodsExportTemplate.xlsx";

	/**
	 * 成本调价单导出模板
	 */
	String COST_ADJUST_EXPORT_EXCEL = "costAdjustExport.xlsx";

	/**
	 * @Fields STOCKREPORT : 库存报表
	 */
	String STOCKREPORT = "StockReport.xlsx";
	
	/**
	 * @Fields STOCKREPORT : 仓库商品查询
	 */
	String STOREGOODSREPORT = "StoreGoodsReport.xlsx";

	/**
	* @Fields SALEFLOWREPORT : 销售流水
	*/
	String SALEFLOWREPORT = "SaleFlowReport.xlsx";

	/**
	* @Fields GOODSREPORT : 商品查询
	*/
	String GOODSREPORT = "GoodsReport.xlsx";
	
	/**
	* @Fields GOODSREPORT : 物流商品查询
	*/
	String GOODSLOGISTICSREPORT = "GoodsLogisticsReport.xlsx";
	
	/**
	* @Fields BRANCHGOODSSALEREPORT : 分公司商品查询分析
	*/
	String BRANCHGOODSSALEREPORT = "BranchGoodsSaleReport.xlsx";

	/**
	* @Fields CASHFLOWREPORT : 收银流水
	*/
	String CASHFLOWREPORT = "CashFlowReport.xlsx";

	/**
	* @Fields CASHDAILYREPORT : 收银日报
	*/
	String CASHDAILYREPORT = "CashDailyReport.xlsx";
	
	/**
	* @Fields CASHDAILYREPORT : 收银日报
	*/
	String CASHDAILYREPORT_SYY = "CashDailyReport_SYY.xlsx";
	/**
	* @Fields CASHDAILYREPORT : 收银日报
	*/
	String CASHDAILYREPORT_MD = "CashDailyReport_MD.xlsx";
	/**
	* @Fields CASHDAILYREPORT : 收银日报
	*/
	String CASHDAILYREPORT_RQ = "CashDailyReport_RQ.xlsx";

	/**
	* @Fields CASHCHECKREPORT : 收银对账
	*/
	String CASHCHECKREPORT = "CashCheckReport.xlsx";

	/**
	 * @Fields PURCHASEFORM : 采购单 退货单 收货单
	 */
	String PURCHASEFORM = "purchaseForm.xlsx";
	
	/**
	 * @Fields PURCHASEFORM : 物流导出采购单
	 */
	String PURCHASE_FORM_LOGISTICS = "purchaseFormLogistics.xlsx";

	/**
	 * @Fields DIRECTRECEIPTFORM : 直送收货单
	 */
	String DIRECTRECEIPTFORM = "DirectReceiptForm.xlsx";

	/**
	 * @Fields PURCHASEFORMHH : 采购单 退货单 收货单 货号模版
	 */
	String PURCHASEFORMCODE = "purchaseFormCode.xlsx";

	/**
	 * @Fields PURCHASEFORMHH :DA 要货单 DO 出库单  DI入库单  DD 店间要货  DR退货申请 导出模版
	 */
	String DELIVERFORM = "DeliverForm.xlsx";

	String DELIVERFORM_DO = "DeliverFormDO.xlsx";

	String DELIVERFORM_DI = "DeliverFormDI.xlsx";

	String DELIVERFORM_DY = "DeliverFormDY.xlsx";

	String DELIVERFORM_DD = "DeliverFormDD.xlsx";

	String DELIVERFORM_DR = "DeliverFormDR.xlsx";

	/**
	 * @Fields DADOFORM : DADOform.xlsx
	 */
	String DADOFORM = "DADOForm.xlsx";

	/**
	 * @Fields RETURN_FORM : ReturnForm.xlsx
	 */
	String RETURN_FORM = "ReturnForm.xlsx";
	
	/**
	 * @Fields RETURN_FORM : 
	 */
	String RETURN_FORM_LOGISTICS = "ReturnFormLogistics.xlsx";

	/**
	 * 商品采购货号导入模板
	 */
	String PURCHASE_GOODS_SKUCODE_TEMPLE = "PurchaseGoodsSkuCodeTemple.xlsx";

	/**
	 * 商品采购条码导入模板
	 */
	String PURCHASE_GOODS_BARCODE_TEMPLE = "PurchaseGoodsBarCodeTemple.xlsx";

	/**
	 * 直送收货货号导入模板
	 */
	String DIRECT_RECEIPT_SKUCODE_TEMPLE = "DirectReceiptSkuCodeTemple.xlsx";

	/**
	 * 直送收货条码导入模板
	 */
	String DIRECT_RECEIPT_BARCODE_TEMPLE = "DirectReceiptBarCodeTemple.xlsx";

	/**
	 * 商品引入货号导入模板
	 */
	String GOODS_INTRODUCE_SKU_CODE_TEMPLE = "GoodsIntroduceSkuCodeTemple.xlsx";

	/**
	 * 商品引入条码导入模板
	 */
	String GOODS_INTRODUCE_BAR_CODE_TEMPLE = "GoodsIntroduceBarCodeTemple.xlsx";

	/**
	 * 配送要货单货号导入模板
	 */
	String DELIVER_GOODS_SKUCODE_TEMPLE = "DeliverGoodsSkuCodeTemple.xlsx";

	/**
	 * 配送要货单条码导入模板
	 */
	String DELIVER_GOODS_BARCODE_TEMPLE = "DeliverGoodsBarCodeTemple.xlsx";

	/**
	 * 配送出库单货号导入模板
	 */
	String DELIVER_GOODS_SKUCODE_REPORT = "DeliverGoodsSkuCodeReport.xlsx";

	/**
	 * 配送出库单条码导入模板
	 */
	String DELIVER_GOODS_BARCODE_REPORT = "DeliverGoodsBarCodeReport.xlsx";

	/**
	 * @Fields PURCHASEFORM : 采购单 退货单 收货单
	 */
	String DELIVER_REPORT = "DeliverReport.xlsx";

	/**
	* @Fields 按单采购到货率报表
	*/
	String ARRIVAL_RATE_FORMNO_REPORT = "ArrivalRateFormNoReport.xlsx";

	/**
	 * @Fields 按供应商采购到货率报表
	 */
	String ARRIVAL_RATE_SUPPLIER_REPORT = "ArrivalRateSupplierReport.xlsx";

	/**
	 * @Fields 按分类商采购到货率报表
	 */
	String ARRIVAL_RATE_CATEGORY_REPORT = "ArrivalRateCategoryReport.xlsx";

	/**
	 * @Fields 按商品商采购到货率报表
	 */
	String ARRIVAL_RATE_GOODS_REPORT = "ArrivalRateGoodsReport.xlsx";

	/**
	 * @Fields PURCHASEFORM : 配送明细
	 */
	String DELIVER_FORM_LIST_REPORT = "DeliverFormListReport.xlsx";

	/**
	 * @Fields PUR_REPORT_TOTAL_SUPPLIER : 采购报表  汇总（供应商）
	 */
	String PUR_REPORT_TOTAL_SUPPLIER = "PurReportTotalSupplier.xlsx";

	/**
	 * @Fields PUR_REPORT_TOTAL_SUPPLIER : 采购报表  汇总（商品）
	 */
	String PUR_REPORT_TOTAL_GOODS = "PurReportTotalGoods.xlsx";

	/**
	 * @Fields PUR_REPORT_TOTAL_SUPPLIER : 采购报表  汇总（类别）
	 */
	String PUR_REPORT_TOTAL_CATEGORY = "PurReportTotalCategory.xlsx";

	/**
	 * @Fields PUR_REPORT_TOTAL_SUPPLIER : 采购报表  汇总（单据）
	 */
	String PUR_REPORT_TOTAL_FORMNO = "PurReportTotalFormNo.xlsx";

	/**
	 * @Fields PURCHASEFORM : 导出店铺销售排名列表
	 */
	String TRADE_ORDER_COUNT_REPORT = "TradeOrderCountReport.xlsx";

	/**
	 * @Fields PURCHASEFORM : 导出调价查询列
	 */
	String PRICING_QUERY = "princingQuery.xlsx";

	/**
	 * @Fields PURCHASEFORM : 导出配送缺货率分析明细
	 */
	String DELIVERY_DETAIL = "deliveryDetail.xlsx";

	/**
	 * @Fields DELIVERY_SUM_GOODS : 导出配送缺货率分析商品汇总
	 */
	String DELIVERY_SUM_GOODS = "deliverySumGoods.xlsx";
	
	/**
	 * @Fields DELIVERY_SUM_FORM : 导出配送缺货率分析单据汇总
	 */
	String DELIVERY_SUM_FORM = "deliverySumForm.xlsx";
	
	/**
	 * @Fields DELIVERY_SUM_BRANCH : 导出配送缺货率分析店铺汇总
	 */
	String DELIVERY_SUM_BRANCH = "deliverySumBranch.xlsx";

	/**
	* @Fields 供应商机构商品关系报表
	*/
	String SUPPLIER_BRANCH_GOODS_REPORT = "SupplierBranchGoodsReport.xlsx";

	/**
	 * @Fields 促销活动商品查询报表
	 */
	String ACTIVITY_GOODS_REPORT = "ActivityGoodsReport.xlsx";

	/**
	* @Fields GiftExchangeRecode : 积分兑换记录
	*/
	String GIFT_EXCHANGE_RECODE = "GiftExchangeRecode.xlsx";

	/**
	 * @Fields PURCHASEFORM : BD业绩报表
	 */
	String DILIVER_REPORT = "DiLiverReport.xlsx";

	/**
	 * @Fields GOODS_BRAND_REPORT : 商品品牌报表
	 */
	String GOODS_BRAND_REPORT = "GoodsBrandReport.xlsx";
	
	/**
	 * @Fields GOODS_BARCODE_REPORT : 物流商品条码报表
	 */
	String GOODS_BARCODE_REPORT = "GoodsBarcodeReport.xlsx";

	/**
	 * @Fields GOODS_CATEGORY_REPORT : 商品类别报表
	 */
	String GOODS_CATEGORY_REPORT = "GoodsCategoryReport.xlsx";

	/**
	* @Fields GOODSREPORT : 物流类别报表
	*/
	String GOODS_CATEGORY_LOGISTICS_REPORT = "GoodsCategoryLogisticsReport.xlsx";
	
	/**
	 * 时段客单
	 */
	String TIMESECTIONSALEREPORT = "timeSectionSellReport.xlsx";

	/**
	 * 库存异常查询
	 */
	String STOCKEXCEPTION = "stockException.xlsx";

	/**
	 * 库存销售周转率
	 */
	String SALEROTARATEREPORT = "saleRotaRateReport.xlsx";

	/**
	 * 库存成本周转率
	 */
	String COSTROTARATEREPORT = "costRotaRateReport.xlsx";

	/**
	 * 盘点差异查询-汇总
	 */
	String DIFFSEARCHSUMMARIZING = "diffSearchSummarizing.xlsx";

	/**
	 * 盘点差异查询-类别汇总
	 */
	String DIFFSEARCHCATEGORYSUM = "diffSearchCategorySummarizing.xlsx";
	/**
	 * 盘点差异查询-明细
	 */
	String DIFFSEARCHDETAIL = "diffSearchDetail.xlsx";

	/**
	 * @Fields STOCK_TAKING_MISS_GOODS : 漏盘商品查询
	 */
	String STOCK_TAKING_MISS_GOODS = "stockTakingMissGoods.xlsx";

	/**
	 * 新品申请导出模板
	 */
	String NEW_GOODS_APPLY_REPORT = "newGoodsApplyReport.xlsx";

	/**
	 *  @Fields NEW_GOODS_APPLY_TEMPLE : 新品申请导入模板
	 */
	String NEW_GOODS_APPLY_TEMPLE = "NewGoodsApplyTemple.xlsx";

	/*** 会员消费报表——订单统计   */
	String MEMBER_ORDER_ALL = "memberOrderAll.xlsx";
	
	/*** 会员消费报表——汇总统计   */
	String MEMBER_TOTAL_ALL = "memberTotalAll.xlsx";

	/**
	 * @Fields MEMBER_ORDER_LIST : 会员消费明细
	 */
	String MEMBER_ORDER_LIST = "MemberOrderList.xlsx";

	/**
	 * 最大值数值
	 */
	double MAXNUM = 999999.99;

	/**
	 * 调价订单详情导出
	 */
	String OVERDUE_APPROVED_DETAIL = "overdueApprovedDetail.xlsx";

	/**
	 * 查看调价订单货号导入模板 SkuCode
	 */
	String OVERDUE_APPROVED_SKUCODE_TEMPLE = "overdueApprovedSkuCodeTemple.xlsx";

	/**
	 * 查看调价订单货号导入模板Barcode
	 */
	String OVERDUE_APPROVED_BARCODE_TEMPLE = "overdueApprovedBarCodeTemple.xlsx";

	/**
	 * @Fields PURCHASE_REPLENISH_ANALY_REPORT : 店铺补货分析报表导出模板
	 */
	String PURCHASE_REPLENISH_ANALY_REPORT = "purchaseReplenishAnalyReport.xlsx";

	/**
	 * @Fields OVER_SHORT_REPORT1 : 长短款导出模板   长短款日报表
	 */
	String OVER_SHORT_REPORT1 = "overShortReport1.xlsx";

	/**
	 * @Fields OVER_SHORT_REPORT2 : 长短款导出模板   长短款日报表（日汇总）
	 */
	String OVER_SHORT_REPORT2 = "overShortReport2.xlsx";

	/**
	 * @Fields OVER_SHORT_REPORT3 : 长短款导出模板   入袋记录报表
	 */
	String OVER_SHORT_REPORT3 = "overShortReport3.xlsx";

	/**
	 * @Fields DOSHEET1 : 出库单模板一
	 */
	String DOSHEET1 = "DOSheet1.xlsx";

	/**
	 * @Fields DOSHEET2 : 出库单模板二
	 */
	String DOSHEET2 = "DOSheet2.xlsx";

	/**
	 * @Fields NEW_GOODS_SALE_ANALYSIS_report : 新品销售分析
	 */
	String NEW_GOODS_SALE_ANALYSIS_REPORT = "newGoodsSaleAnalysis.xlsx";

	/**
	 * @Fields SUPPLIER_MONTHLY_REPORT : 供应商进销存月报表
	 */
	String SUPPLIER_MONTHLY_REPORT = "SupplierMonthlyReport.xlsx";
	
	/**
	 * @Fields MONTHLY_REPORT : 月进销存报表
	 */
	String MONTHLY_REPORT = "MonthlyReport.xlsx";

	/** 商品促销方案详情   */
	String ACTIVITY_DETAIL_QUERY_FOR_GOODS = "activityDetailQueryForGoods.xlsx";

	/*** 类别促销方案详情 */
	String ACTIVITY_DETAIL_QUERY_FOR_CATEGORY = "activityDetailQueryForCategory.xlsx";

	/*** 满减促销方案详情 */
	String ACTIVITY_DETAIL_QUERY_FOR_FULLREDUCTION = "activityDetailQueryForFullReduction.xlsx";
	
	/*** 商品买满送促销方案详情 */
	String ACTIVITY_DETAIL_QUERY_FOR_FULLGIVE_GOODS = "activityDetailQueryForFullGiveGoods.xlsx";
	
	/*** 类别买满送促销方案详情 */
	String ACTIVITY_DETAIL_QUERY_FOR_FULLGIVE_CATEGORY = "activityDetailQueryForFullGiveCategory.xlsx";
	
	/*** 类别买满送促销方案详情 */
	String ACTIVITY_DETAIL_QUERY_FOR_FULLGIVE_ALL = "activityDetailQueryForFullGiveAll.xlsx";
	
	
	/**
	 * @Fields STOCK_TAKING_MISS_GOODS : 盘点明细
	 */
	String STOCKTAKING_PPDETAIL = "stockTakingPPDetail.xlsx";

	/**
	 * 未知商品明細
	 */
	String STOCKTAKING_UNKNOWN_DETAIL = "stockTakingUNknownDetail.xlsx";

	/**
	 * @Fields STOCK_TAKING_MISS_GOODS : 差异处理明细
	 */
	String STOCKTAKING_DIFFDETAIL = "stockTakingDiffDetail.xlsx";
	
	/*** 特价活动商品引入货号导入模板  */
	String ACTIVITY_SPECIAL_GOODS_SKUCODE_TEMPLATE = "activitySpecialGoodsSkuCodeTemplate.xlsx";

	/*** 特价活动商品引入条码导入模板  */
	String ACTIVITY_SPECIAL_GOODS_BARCODE_TEMPLATE = "activitySpecialGoodsBarCodeTemplate.xlsx";
	
	/*** 折扣活动商品引入货号导入模板  */
	String ACTIVITY_DISCOUNT_GOODS_SKUCODE_TEMPLATE = "activityDiscountGoodsSkuCodeTemplate.xlsx";
	
	/*** 折扣活动商品引入条码导入模板  */
	String ACTIVITY_DISCOUNT_GOODS_BARCODE_TEMPLATE = "activityDiscountGoodsBarCodeTemplate.xlsx";
	
	/*** 偶数特价活动商品引入货号导入模板  */
	String ACTIVITY_EVEN_GOODS_SKUCODE_TEMPLATE = "activityEvenGoodsSkuCodeTemplate.xlsx";
	
	/*** 偶数特价活动商品引入条码导入模板  */
	String ACTIVITY_EVEN_GOODS_BARCODE_TEMPLATE = "activityEvenGoodsBarCodeTemplate.xlsx";
	
	/**
	 * 一开通交易明细
	 */
	String ICC_CARD_TRADING_DETAIL = "iccCardTradingDetail.xlsx" ;
	/**
	 * 一卡通交易汇总
	 */
	String ICC_CARD_SUM_TRADING_DETAIL = "iccCardSumTradingDetail.xlsx";
	
	/**
	 * 一卡通账户管理
	 */
	String ICC_CARD_ACCOUNT_MANAGEMENT = "iccCardAccountManagement.xlsx";

	/**
	 * 加盟店到期账款
	 */
	String FRANCHISE_ACCOUNT1 = "FranchiseAccount1.xlsx";
	/**
	 * 加盟店历史往来账款
	 */
	String FRANCHISE_ACCOUNT2 = "FranchiseAccount2.xlsx";
	/**
	 * 加盟店未收账款汇总
	 */
	String FRANCHISE_ACCOUNT3 = "FranchiseAccount3.xlsx";
	/**
	 * 加盟店未收账款明细
	 */
	String FRANCHISE_ACCOUNT4 = "FranchiseAccount4.xlsx";
	/**
	 * 加盟店已收账款明细
	 */
	String FRANCHISE_ACCOUNT5 = "FranchiseAccount5.xlsx";
	/**
	 * 加盟店预收账款明细
	 */
	String FRANCHISE_ACCOUNT6 = "FranchiseAccount6.xlsx";
	/**
	 * 加盟店毛利明细
	 */
	String FRANCHISE_ACCOUNT7 = "FranchiseAccount7.xlsx";

	/**
	 * 到期账款
	 */
    String EXPIRE_ACCOUNTS_PAYABLE = "expireAccountsPayable.xlsx";
    
    /**
     * 历史往来账款
     */
    String DEALINGS_ACCOUNTS_PAYABLE = "dealingsAccountsPayable.xlsx";
    
    /**
     * 未付款账款汇总
     */
    String UNPAID_ACCOUNTS_PAYABLE = "unpaidAccountsPayable.xlsx";
    
    /**
     * 未付款账款明细
     */
    String UNPAID_ACCOUNTS_PAYABLE_DETAIL = "unpaidAccountsPayableDetail.xlsx";

    /**
     * 已付账款汇总
     */
    String PAID_ACCOUNTS_PAYABLE = "paidAccountsPayable.xlsx";
    
    /**
     * 已付账款明细
     */
    String PAID_ACCOUNTS_PAYABLE_DETAIL = "paidAccountsPayableDetail.xlsx";
    
    /**
     * 预付账款明细
     */
    String ADVANCE_ACCOUNTS_PAYABLE_DETAIL = "advanceAccountsPayableDetail.xlsx";
    
	/**
	 * @Fields 商品毛利率报表
	 */
	String GOODS_GROSS_PROFIT_RATE = "goodsGrossProfitRate.xlsx";
	
	/**
	 * @Fields 时段销售对比分析报表
	 */
	String PERIOD_SALE_CONTRAST = "periodSaleContrast.xlsx";

	/**
	 * 供应商进货报表
	 */
	String SUPPLIER_STOCK_REPORT = "SupplierStockReport.xlsx";

	/**
	 * 供应商销售报表
	 */
	String SUPPLIER_SELL_REPORT = "SupplierSellReport.xlsx";

	/**
	 * @Fields 货类销售对比分析报表
	 */
	String GOODS_SALE_CONTRAST = "goodsSaleContrast.xlsx";

	/**
	 * 门店销售报表
	 */
	String STORE_SELL_REPORT = "storeSellReport.xlsx";

	/**
	 * 日进销存报表
	 */
	String DAY_SUM_REPORT = "daySumReport.xlsx";

	/**
	 * 会员活动领取记录详情
	 */
	String POS_PRIZE_RECORD_DETAIL = "posPrizeRecordDetail.xlsx";

	/**
	 * 采购成本调整查询
	 */
	String PURCHASE_COST_FORM = "purchaseCostForm.xlsx";

	/**
	 * 采购成本调整明细
	 */
	String PURCHASE_COST_FORM_DETAIL = "purchaseCostFormDetail.xlsx";

	/**
	 * 采购促销单
	 */
	String PURCHASE_ACTIVITYL_FORM = "purchaseActivityForm.xlsx";

	/**
	 * 采购促销单明细
	 */
	String PURCHASE_ACTIVITYL_FORM_DETAIL = "purchaseActivityFormDetail.xlsx";

	/**
	 * 采购促销活动货号导入模板
	 */
	String PURCHASE_ACTIVITYL_GOODS_SKUCODE_TEMPLATE = "purchaseActivitylGoodsSkuCodeTemplate.xlsx";

	/**
	 * 采购促销活动条码导入模板
	 */
	String PURCHASE_ACTIVITYL_GOODS_BARCODE_TEMPLATE = "purchaseActivitylGoodsBarCodeTemplate.xlsx";
	
	   /**
     * @Fields PUR_EXPIRE_FORM_BY_SUPPLIER : 供应商过期订单查询  汇总（供应商）
     */
    String PUR_EXPIRE_FORM_BY_SUPPLIER = "PurExpireFormBySupplier.xlsx";
    /**
     * @Fields PUR_EXPIRE_FORM_BY_FORM : 供应商过期订单查询  汇总（单据）
     */
    String PUR_EXPIRE_FORM_BY_FORMNO = "PurExpireFormByFormNo.xlsx";
    /**
     * @Fields PUR_STATE_TRACK : 采购订单状态跟踪
     */
    String PUR_STATE_TRACK = "PurStateTrack.xlsx";
    
    String CHARGE_CATEGORY="chargeCategory.xlsx";
}
