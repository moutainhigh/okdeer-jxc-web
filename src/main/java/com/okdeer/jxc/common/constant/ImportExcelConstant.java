
package com.okdeer.jxc.common.constant;

/**
 * ClassName: ImportExcelConstant 
 * @Description: 导入Excel常量类
 * @author liwb
 * @date 2016年8月31日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * 商业管理系统1.0.0	  2016年8月18日			 liwb			     导入Excel常量类
 */

public interface ImportExcelConstant {

	/**
	 * @Fields TEMPLATE_DIR : 导入模板文件目录 /template/excel/import
	 */
	String TEMPLATE_IMPORT_DIR = "/template/excel/import/";

	/**
	 * @Fields USER_LIST_FIELDS : 用户信息导入字段名信息
	 */
	String[] USER_LIST_FIELDS = { "id", "userCode", "userName", "mobile",
			"branchId", "branchType", "createTime" };

	/**
	 * @Fields GOODS_PRICE_ADJUST_FIELDS : 调价单信息导入字段名信息
	 */
	String[] GOODS_PRICE_ADJUST_FIELDS = { "skuCode", "skuName", "barCode",
			"spec", "unit", "oldPurPrice", "newPurPrice", "oldSalePrice",
			"newSalePrice", "oldDcPrice", "newDcPrice", "oldWsPrice",
			"newWsPrice", "oldVipPrice", "newVipPrice" };

	/**
	 * @Fields GOODS_PRICE_ADJUST_FIELDS : 中州价签打印字段
	 */
	String[] PRINT_ZZ_FIELDS = { "barCode", "skuName", "spec", "salePrice",
			"unit", "originPlace" };

	/**
	 * @Fields IMPORTMAX : 导入最大限制10000
	 */
	Integer IMPORTMAX = 10000;

	/**
	 * @Fields IMPORTMAXERRO : 导入数据不能超过10000
	 */
	String IMPORTMAXERRO = "导入数据不能超过10000";
	
	/*************************************** 配送要货单 货号导入 start  ***************************************/

	/*** 要货申请单货号导入字段、箱数  */
	String[] DELIVER_GOODS_SKUCODE_LARGE_NUM = { "skuCode", "largeNum" };

	/*** 要货申请单货号导入字段、箱数 */
	String[] DELIVER_GOODS_SKUCODE_HEADERS_LARGE_NUM = { "货号", "箱数" };
	
	/*** 要货申请单货号导入字段、数量 */
	String[] DELIVER_GOODS_SKUCODE_NUM = { "skuCode", "num" };

	/*** 要货申请单货号导入字段、数量 */
	String[] DELIVER_GOODS_SKUCODE_HEADERS_NUM = { "货号", "数量" };
	
	/*************************************** 配送要货单 货号导入 end  *****************************************/
	
	
	
	
	/*************************************** 配送要货单 条码导入 start  ***************************************/
	
	/*** 要货申请单条码导入字段、箱数 */
	String[] DELIVER_GOODS_BARCODE_LARGE_NUM = { "barCode", "largeNum" };

	/*** 要货申请单货号导入字段、箱数 */
	String[] DELIVER_GOODS_BARCODE_HEADERS_NUM = { "条码", "箱数" };

	/*** 要货申请单条码导入字段、数量 */
	String[] DELIVER_GOODS_BARCODE_NUM = { "barCode", "num" };

	/*** 要货申请单货号导入字段、数量 */
	String[] DELIVER_GOODS_BARCODE_HEADERS_LARGE_NUM = { "条码", "数量" };
	
	/*************************************** 配送要货单 货号导入 end  *****************************************/
	
	
	
	
	
	/*************************************** 配送出库单 货号导入 start  ***************************************/
	
	/*** 配送出库单货号导入字段——箱数  */
	String[] DO_GOODS_SKUCODE_COLUMNS_LARGENUM = { "skuCode", "largeNum", "distributionPrice", "amount", "isGift" };

	/*** 配送出库单货号导入字段——箱数 */
	String[] DO_GOODS_SKUCODE_HEADERS_LARGENUM = { "货号", "箱数", "单价", "金额", "是否赠品" };
	
	/*** 配送出库单货号导入字段——数量  */
	String[] DO_GOODS_SKUCODE_COLUMNS_NUM = { "skuCode", "num", "distributionPrice", "amount", "isGift" };
	
	/*** 配送出库单货号导入字段——数量 */
	String[] DO_GOODS_SKUCODE_HEADERS_NUM = { "货号", "数量", "单价", "金额", "是否赠品" };
	
	/*************************************** 配送出库单 货号导入 end  *****************************************/
	
	
	
	/*************************************** 配送出库单 条码导入 start  ***************************************/

	/*** 配送出库单条码导入字段——箱数 */
	String[] DO_GOODS_BARCODE_COLUMNS_LARGENUM = { "barCode", "largeNum", "distributionPrice", "amount", "isGift" };

	/*** 配送出库单货号导入字段——箱数 */
	String[] DO_GOODS_BARCODE_HEADERS_LARGENUM = { "条码", "箱数", "单价", "金额", "是否赠品" };
	
	/*** 配送出库单条码导入字段——数量 */
	String[] DO_GOODS_BARCODE_COLUMNS_NUM = { "barCode", "num", "distributionPrice", "amount", "isGift" };
	
	/*** 配送出库单货号导入字段 ——数量*/
	String[] DO_GOODS_BARCODE_HEADERS_NUM = { "条码", "数量", "单价", "金额", "是否赠品" };
	
	/*************************************** 配送出库单 条码导入 end  *****************************************/
	
	
	
	/*** 门店费用导入字段    */
	String[] STORE_CHARGE_FIELDS = { "costTypeCode", "amount", "remark" };

	/*** 门店费用导入表头  */
	String[] STORE_CHARGE_HEADERS = { "费用编码", "费用金额", "备注" };
}
