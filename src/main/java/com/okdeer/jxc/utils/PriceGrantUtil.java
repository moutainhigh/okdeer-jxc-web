
package com.okdeer.jxc.utils;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.okdeer.jxc.common.enums.PriceGrantEnum;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.handler.PriceGrantHandler;
import com.okdeer.jxc.system.entity.SysUser;

/**
 * ClassName: PriceGrantUtil 
 * @Description: 价格权限控制
 * @author liwb
 * @date 2016年8月13日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *		进销存2.0	  2016年8月18日			 liwb			    价格权限控制工具类
 */

public class PriceGrantUtil {

	/**
	 * 私有构造函数
	 * <p>Title: 私有构造函数</p> 
	 * <p>Description: 增加私有构造函数用以隐藏公开构造函数</p>
	 */
	private PriceGrantUtil() {
		super();
	}

	/**
	 * @Description: 过滤价格权限
	 * @param handler
	 * @author liwb
	 * @date 2016年8月18日
	 */
	public static void grantPrice(PriceGrantHandler handler) {

		// 过滤销售价
		BigDecimal salePrice = grantSalePrice(handler.getSalePrice());
		handler.setSalePrice(salePrice);

		// 过滤会员价
		BigDecimal vipPrice = grantVipPrice(handler.getVipPrice());
		handler.setVipPrice(vipPrice);

		// 过滤采购价
		BigDecimal purchasePrice = grantPurchasePrice(handler.getPurchasePrice());
		handler.setPurchasePrice(purchasePrice);

		// 过滤批发价
		BigDecimal wholesalePrice = grantWholesalePrice(handler.getWholesalePrice());
		handler.setWholesalePrice(wholesalePrice);

		// // 过滤最低售价
		// BigDecimal lowestPrice = grantLowestPrice(handler.getLowestPrice());
		// handler.setLowestPrice(lowestPrice);

		// 过滤销售价
		BigDecimal distributionPrice = grantDistributionPrice(handler.getDistributionPrice());
		handler.setDistributionPrice(distributionPrice);
	}

	/**
	 * @Description: 根据权限获取零售价
	 * @param salePrice
	 * @return
	 * @author liwb
	 * @date 2016年8月13日
	 */
	public static BigDecimal grantSalePrice(BigDecimal salePrice) {
		return grantPriceCommon(salePrice, PriceGrantEnum.SALE_PRICE);
	}

	/**
	 * @Description: 根据权限获取会员价
	 * @param vipPrice
	 * @return
	 * @author liwb
	 * @date 2016年8月13日
	 */
	public static BigDecimal grantVipPrice(BigDecimal vipPrice) {
		return grantPriceCommon(vipPrice, PriceGrantEnum.VIP_PRICE);
	}

	/**
	 * @Description: 根据权限获取成本价
	 * @param costPrice
	 * @return
	 * @author liwb
	 * @date 2017年6月7日
	 */
	public static BigDecimal grantCostPrice(BigDecimal costPrice) {
		return grantPriceCommon(costPrice, PriceGrantEnum.COST_PRICE);
	}

	/**
	 * @Description: 根据权限获取采购价
	 * @param purchasePrice
	 * @return
	 * @author liwb
	 * @date 2016年8月13日
	 */
	public static BigDecimal grantPurchasePrice(BigDecimal purchasePrice) {
		return grantPriceCommon(purchasePrice, PriceGrantEnum.PURCHASE_PRICE);
	}

	/**
	 * @Description: 根据权限获取批发价
	 * @param wholesalePrice
	 * @return
	 * @author liwb
	 * @date 2016年8月13日
	 */
	public static BigDecimal grantWholesalePrice(BigDecimal wholesalePrice) {
		return grantPriceCommon(wholesalePrice, PriceGrantEnum.WHOLESALE_PRICE);
	}

	// /**
	// * @Description: 根据权限获取最低售价
	// * @param wholesalePrice
	// * @return
	// * @author liwb
	// * @date 2016年8月13日
	// */
	// public static BigDecimal grantLowestPrice(BigDecimal lowestPrice) {
	// return grantPriceCommon(lowestPrice, PriceGrantEnum.LOWEST_PRICE);
	// }

	/**
	 * @Description: 根据权限获取配送价
	 * @param wholesalePrice
	 * @return
	 * @author liwb
	 * @date 2016年8月13日
	 */
	public static BigDecimal grantDistributionPrice(BigDecimal distributionPrice) {
		return grantPriceCommon(distributionPrice, PriceGrantEnum.DISTRIBUTION_PRICE);
	}

	/**
	 * @Description: 获取Session中的用户价格权限
	 * @param userId
	 * @return
	 * @author liwb
	 * @date 2016年8月17日
	 */
	public static String getPriceGrant() {

		SysUser sysUser = UserUtil.getCurrentUser();
		if (sysUser == null) {
			throw new BusinessException("用户未登陆，或者session失效");
		}

		return sysUser.getPriceGrant();
	}

	/**
	 * @Description: 获取存在的价格权限集合
	 * @return
	 * @author liwb
	 * @date 2017年6月7日
	 */
	public static Set<String> getHasPriceGrantSets() {
		String priceGrant = getPriceGrant();

		Set<String> hasGrantSet = new HashSet<String>();

		if (StringUtils.isBlank(priceGrant)) {
			return hasGrantSet;
		}

		// 价格权限数组
		String[] priceGrants = priceGrant.split(",");

		hasGrantSet.addAll(Arrays.asList(priceGrants));

		return hasGrantSet;

	}

	/**
	 * @Description: 获取不存在的价格权限集合
	 * @return
	 * @author liwb
	 * @date 2017年6月7日
	 */
	public static Set<String> getNoPriceGrantSets() {
		String priceGrant = getPriceGrant();

		Set<String> noGrantSet = new HashSet<String>();

		// 添加所有权限
		for (PriceGrantEnum priceGrantEnum : PriceGrantEnum.values()) {
			noGrantSet.add(priceGrantEnum.getValue());
		}

		// 价格权限为空，则无权限的集合为所有
		if (StringUtils.isBlank(priceGrant)) {
			return noGrantSet;
		}

		// 价格权限数组
		String[] priceGrants = priceGrant.split(",");

		// 移除存在的价格权限
		for (String str : priceGrants) {
			noGrantSet.remove(str);
		}

		return noGrantSet;
	}

	/**
	 * @Description: 获取价格权限通用方法，无权限返回null，有权限则返回价格本身
	 * @param price
	 * @param priceGrantEnum
	 * @return
	 * @author liwb
	 * @date 2016年8月13日
	 */
	private static BigDecimal grantPriceCommon(BigDecimal price, PriceGrantEnum priceGrantEnum) {

		// 如果有权限，则直接返回价格
		Set<String> priceGrantSet = getHasPriceGrantSets();

		// 权限为空，说明没有权限
		if (CollectionUtils.isEmpty(priceGrantSet)) {
			return null;
		}

		for (String s : priceGrantSet) {
			if (priceGrantEnum.getValue().equals(s)) {
				return price;
			}
		}

		return null;
	}

}
