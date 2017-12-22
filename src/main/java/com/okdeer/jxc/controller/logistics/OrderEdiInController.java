package com.okdeer.jxc.controller.logistics;

import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.enums.DeliverAuditStatusEnum;
import com.okdeer.jxc.common.enums.DeliverStatusEnum;
import com.okdeer.jxc.common.enums.FormSourcesEnum;
import com.okdeer.jxc.common.enums.IsGiftEnum;
import com.okdeer.jxc.common.enums.IsReference;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.OrderNoUtils;
import com.okdeer.jxc.common.utils.UUIDHexGenerator;
import com.okdeer.jxc.form.deliver.entity.DeliverForm;
import com.okdeer.jxc.form.deliver.entity.DeliverFormList;
import com.okdeer.jxc.form.deliver.service.DeliverFormServiceApi;
import com.okdeer.jxc.form.deliver.service.QueryDeliverFormListServiceApi;
import com.okdeer.jxc.form.deliver.vo.DeliverFormListVo;
import com.okdeer.jxc.form.deliver.vo.DeliverFormVo;
import com.okdeer.jxc.form.entity.PurchaseForm;
import com.okdeer.jxc.form.entity.PurchaseFormDetail;
import com.okdeer.jxc.form.enums.FormStatus;
import com.okdeer.jxc.form.enums.FormType;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormDetailPO;
import com.okdeer.jxc.form.purchase.qo.PurchaseFormPO;
import com.okdeer.jxc.form.purchase.service.PurchaseFormServiceApi;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.service.GoodsSelectServiceApi;
import com.okdeer.jxc.goods.vo.GoodsSkuVo;
import com.okdeer.jxc.goods.vo.GoodsStockVo;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;
import com.okdeer.jxc.utils.poi.ExcelReaderUtil;

/**
 * 
 * ClassName: OrderEdiController 
 * @Description: 物流订单EDI导入
 * @author zhangq
 * @date 2017年8月21日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("logistic/ediIn")
public class OrderEdiInController {
	@Reference(version = "1.0.0", check = false)
	private PurchaseFormServiceApi purchaseFormServiceApi;
	@Reference(version = "1.0.0", check = false)
	private DeliverFormServiceApi deliverFormServiceApi;
	@Reference(version = "1.0.0", check = false)
	private QueryDeliverFormListServiceApi queryDeliverFormListServiceApi;
	@Reference(version = "1.0.0", check = false)
	private GoodsSelectServiceApi goodsSelectServiceApi;
	@Autowired
	private OrderNoUtils orderNoUtils;
	/**
	 * 采购入库单（标准版）
	 */
	public static final int[] STD_PI_INDEX = new int[] { 0, 1, 2, 3, 4, 5, 6, 7 };
	/**
	 * 销售出库单（标准版）
	 */
	public static final int[] STD_DO_INDEX = new int[] { 0, 1, 2, 3, 4, 5, 6, 7 };
	/**
	 * 配送点退货单（标准版）
	 */
	public static final int[] STD_DI_INDEX = new int[] { 0, 1, 2, 3, 4, 5, 6};
	/**
	 * 供应商退货单（标准版）
	 */
	public static final int[] STD_PR_INDEX = new int[] { 0, 1, 2, 3, 4, 5, 6};
	/**
	 * 采购入库单（卡萨版）
	 */
	public static final int[] KASA_PI_INDEX = new int[] { 5, 11, 13, 16, 25, 26 };
	/**
	 * 销售出库单（卡萨版）
	 */
	public static final int[] KASA_DO_INDEX = new int[] { 13, 28, 29, 33, 39, 40 };
	/**
	 * 配送点退货单（卡萨版）
	 */
	public static final int[] KASA_DI_INDEX = new int[] { 5, 11, 13, 16, 25, 26, 27 };
	/**
	 * 对照字段（标准版）
	 */
	public static final String[] STD_MAPPING_FIELDS = new String[] { "formNo", "logisticFormNo", "rowNo", "skuCode",
			"barCode", "num", "giftNum", "remark" };
	
	/**
	 * 对照字段（标准版）
	 */
	public static final String[] STD_MAPPING_DI_FIELDS = new String[] { "formNo", "logisticFormNo", "rowNo", "skuCode",
			"barCode", "num", "remark" };
	/**
	 * 对照字段
	 */
	public static final String[] MAPPING_FIELDS = new String[] { "formNo", "rowNo", "skuCode", "barCode", "giftNum",
			"num" };
	/**
	 * 对照字段
	 */
	public static final String[] MAPPING_DI_FIELDS = new String[] { "formNo", "rowNo", "skuCode", "barCode",
			"rejectsNum", "shelveNum", "num" };
	/**
	 * LOG
	 */
	protected final Logger LOG = LoggerFactory.getLogger(this.getClass());

	/**
	 * 
	 * @Description: 跳转页面
	 * @return String  
	 * @author zhangq
	 * @date 2017年8月21日
	 */
	@RequestMapping
	public String index() {
		return "logistics/ediImport";
	}

	/**
	 * 
	 * @Description: 导入   
	 * @return void  
	 * @author zhangq
	 * @date 2017年8月21日
	 */
	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importExcel(@RequestParam("file") MultipartFile[] files) {
		// 导入结果
		Set<String> result = new HashSet<String>();
		try {
			for (MultipartFile file : files) {
				if (!file.isEmpty()) {
					String fileName = file.getOriginalFilename();
					// 卡萨物流导入采购单
					if (fileName.contains("采购单")) {
						savePiFormKasa(file, result);
					} else if (fileName.contains("销售单")) {
						// 卡萨物流导入销售单(配送出库单)
						saveDoFormKasa(file, result);
					} else if (fileName.contains("采购入库单")) {
						// 三方物流导入采购入库单
						savePiFormStd(file, result);
					} else if (fileName.contains("配送出库单")) {
						// 三方物流导入配送出库单
						saveDoFormStd(file, result);
					} else if (fileName.contains("供应商退货单")) {
						savePrFormStd(file, result);
					} else if (fileName.contains("配送点退货单")) {
						// 卡萨物流导入配送点退货单
						saveDiFormKasa(file, result);
					} else if (fileName.contains("配送点退货")) {
						// 三方物流导入配送点退货单
						saveDiFormStd(file, result);
					}
				}
			}
		} catch (Exception e) {
			LOG.error("==============================【调试】物流EDI导入失败：{}", e);
			if (result.isEmpty()) {
				return RespJson.error("导入失败。");
			} else {
				return RespJson.success(result);
			}
		}
		return RespJson.success(result);
	}

	/**
	 * @Description: 配送点退货单(卡萨版)
	 * @param file
	 * @param result   
	 * @return void  
	 * @throws
	 * @author zhangchm
	 * @date 2017年10月12日
	 */
	private void saveDiFormKasa(MultipartFile file, Set<String> result) {
		try {
			// 文件流
			InputStream is = file.getInputStream();
			// 解析Excel
			List<ImportEntity> xlsList = ExcelReaderUtil.readXls(is, 2, 0, KASA_DI_INDEX, MAPPING_DI_FIELDS,
					new ImportEntity());
			saveDiForm(xlsList, result);
		} catch (Exception e) {
			result.add(file.getOriginalFilename() + "导入失败。");
			LOG.error("{}导入失败。", file.getOriginalFilename());
		}
	}

	/**
	 * @Description: 配送点退货单(标准版)
	 * @param file
	 * @param result   
	 * @return void  
	 * @throws
	 * @author zhangchm
	 * @date 2017年10月12日
	 */
	private void saveDiFormStd(MultipartFile file, Set<String> result) {
		try {
			// 文件流
			InputStream is = file.getInputStream();
			// 解析Excel
			List<ImportEntity> xlsList = ExcelReaderUtil.readXlsx(is, 1, 0, STD_DI_INDEX, STD_MAPPING_DI_FIELDS,
					new ImportEntity());
			saveDiForm(xlsList, result);
		} catch (Exception e) {
			result.add(file.getOriginalFilename() + "导入失败。");
			LOG.error("{}导入失败。", file.getOriginalFilename());
		}
	}

	/**
	 * 
	 * @Description: 保存采购单（标准版）
	 * @param file
	 * @param result
	 * @return void  
	 * @author zhangq
	 * @date 2017年9月5日
	 */
	private void savePiFormStd(MultipartFile file, Set<String> result) throws Exception {
		try {
			// 文件流
			InputStream is = file.getInputStream();
			// 解析Excel
			List<ImportEntity> xlsList = ExcelReaderUtil.readXlsx(is, 1, 0, STD_PI_INDEX, STD_MAPPING_FIELDS,
					new ImportEntity());
			// 保存采购入库单
			savePiForm(xlsList, result);
		} catch (Exception e) {
			result.add(file.getOriginalFilename() + "导入失败。");
			LOG.error("{}导入失败。", file.getOriginalFilename());
		}
	}

	/**
	 * 
	 * @Description: 保存销售单（标准版）
	 * @param file
	 * @param result
	 * @return void  
	 * @author zhangq
	 * @date 2017年9月5日
	 */
	private void saveDoFormStd(MultipartFile file, Set<String> result) throws Exception {
		try {
			// 文件流
			InputStream is = file.getInputStream();
			// 解析Excel
			List<ImportEntity> xlsList = ExcelReaderUtil.readXlsx(is, 1, 0, STD_DO_INDEX, STD_MAPPING_FIELDS,
					new ImportEntity());
			// 保存配送出库单
			saveDoForm(xlsList, result);
		} catch (Exception e) {
			result.add(file.getOriginalFilename() + "导入失败。");
			LOG.error("{}导入失败。", file.getOriginalFilename());
		}
	}

	/**
	 * 
	 * @Description: 供应商退货单（标准版）
	 * @param file
	 * @param result   
	 * @return void  
	 * @author zhangq
	 * @date 2017年9月5日
	 */
	private void savePrFormStd(MultipartFile file, Set<String> result) {
	}

	/**
	 * 
	 * @Description: 保存采购单（卡萨版）
	 * @param file
	 * @throws Exception   
	 * @return void  
	 * @author zhangq
	 * @date 2017年8月23日
	 */
	private void savePiFormKasa(MultipartFile file, Set<String> result) {
		try {
			// 文件流
			InputStream is = file.getInputStream();
			// 解析Excel
			List<ImportEntity> xlsList = ExcelReaderUtil.readXls(is, 3, 1, KASA_PI_INDEX, MAPPING_FIELDS,
					new ImportEntity());
			// 保存采购入库单
			savePiForm(xlsList, result);
		} catch (Exception e) {
			result.add(file.getOriginalFilename() + "导入失败。");
			LOG.error("{}导入失败。", file.getOriginalFilename());
		}
	}

	/**
	 * 
	 * @Description: 保存销售单（卡萨版）
	 * @param file   
	 * @return void  
	 * @author zhangq
	 * @date 2017年8月23日
	 */
	private void saveDoFormKasa(MultipartFile file, Set<String> result) throws Exception {
		try {
			// 文件流
			InputStream is = file.getInputStream();
			// 解析Excel
			List<ImportEntity> xlsList = ExcelReaderUtil.readXls(is, 3, 1, KASA_DO_INDEX, MAPPING_FIELDS,
					new ImportEntity());
			saveDoForm(xlsList, result);
		} catch (BusinessException e) {
			LOG.error("==============================【调试】BusinessException 物流EDI导入失败：{}", e);
		} catch (Exception e) {
			result.add(file.getOriginalFilename() + "导入失败。");
			LOG.error("{}Exception导入失败。", file.getOriginalFilename());
			LOG.error("{}Exception失败原因。", e);
		}
	}

	private void savePiForm(List<ImportEntity> xlsList, Set<String> result) {
		// 当前用户
		SysUser user = UserUtil.getCurrentUser();
		// 按订单分类，Key：单据号，Value：解析值
		Map<String, Map<String, ImportEntity>> formMap = convertToMap(xlsList);
		// 遍历
		for (Map.Entry<String, Map<String, ImportEntity>> entry : formMap.entrySet()) {
			// 单号
			String formNo = entry.getKey();
			// 查询采购申请单
			PurchaseFormPO paForm = purchaseFormServiceApi.selectPOByFormNo(formNo);
			if (null == paForm) {
				result.add("<font color='red'>采购入库单【" + formNo + "】导入失败，失败原因：该单号在零售系统中不存在。</font></br>");
				continue;
			}
			// 查询采购申请单明细
			List<PurchaseFormDetailPO> paDetailList = purchaseFormServiceApi.selectDetailByFormNo(formNo);
			// 采购申请单明细按“货号_是否赠品”转换为map，方便查询
			Map<String, PurchaseFormDetailPO> paDetailMap = new HashMap<String, PurchaseFormDetailPO>();
			for (PurchaseFormDetailPO detail : paDetailList) {
				// 货号
				String skuCode = detail.getSkuCode();
				// 是否赠品
				Integer isGift = detail.getIsGift();
				// KEY：货号_是否赠品，VALUE：采购申请单明细
				paDetailMap.put(skuCode + "_" + isGift, detail);
			}
			// 采购入库单
			PurchaseForm piForm = createPi(paForm);
			// 采购收货单明细
			BigDecimal totalNum = BigDecimal.ZERO;
			BigDecimal amount = BigDecimal.ZERO;
			BigDecimal untaxedAmount = BigDecimal.ZERO;
			List<PurchaseFormDetail> piDetailList = new ArrayList<PurchaseFormDetail>();
			Map<String, ImportEntity> importList = formMap.get(formNo);
			for (Map.Entry<String, ImportEntity> entryEntity : importList.entrySet()) {
				String skuCode = entryEntity.getKey();
				ImportEntity entity = entryEntity.getValue();
				entity.setNum(entity.getNum().subtract(entity.getGiftNum()));
				// 采购入库正常商品明细
				if (entity.getNum().compareTo(BigDecimal.ZERO) > 0) {
					PurchaseFormDetailPO paDetail = paDetailMap.get(skuCode + "_" + "0");
					if (null != paDetail) {
						// 采购入库单明细
						PurchaseFormDetail formDetail = createPiDetail(piForm.getId(), paDetail, entity, 0,
								entity.getRowNo(), user.getId());
						// 添加到列表
						piDetailList.add(formDetail);
						totalNum = totalNum.add(formDetail.getDealNum());
						amount = amount.add(formDetail.getAmount());
						untaxedAmount = untaxedAmount.add(formDetail.getUntaxedAmount());
					}
				}
				// 采购入库赠品明细
				if (entity.getGiftNum().compareTo(BigDecimal.ZERO) > 0) {
					PurchaseFormDetailPO paDetail = paDetailMap.get(skuCode + "_" + "1");
					if (null != paDetail) {
						// 采购入库单明细
						PurchaseFormDetail formDetail = createPiDetail(piForm.getId(), paDetail, entity, 1,
								entity.getRowNo(), user.getId());
						// 添加到列表
						piDetailList.add(formDetail);
						totalNum = totalNum.add(formDetail.getDealNum());
						amount = amount.add(formDetail.getAmount());
						untaxedAmount = untaxedAmount.add(formDetail.getUntaxedAmount());
					}
				}
			}
			piForm.setTotalNum(totalNum);
			piForm.setAmount(amount);
			piForm.setUntaxedAmount(untaxedAmount);
			RespJson resp = purchaseFormServiceApi.save(piForm, piDetailList);
			if (resp.isSuccess()) {
				result.add("采购入库单【" + formNo + "】导入成功。</br>");
			} else {
				result.add("<font color='red'>采购入库单【" + formNo + "】导入失败，失败原因：" + resp.getMessage() + "</font></br>");
			}
		}
	}

	private void saveDoForm(List<ImportEntity> xlsList, Set<String> result) {
		// 当前用户
		SysUser user = UserUtil.getCurrentUser();
		// 按订单分类，Key：采购申请单单号，Value：解析的值
		Map<String, Map<String, ImportEntity>> formMap = convertToMap(xlsList);
		// 遍历
		for (Map.Entry<String, Map<String, ImportEntity>> entry : formMap.entrySet()) {
			// 要货申请单单号
			String daFormNo = entry.getKey();
			// 要货申请单
			DeliverForm daForm = deliverFormServiceApi.queryDeliverFormByFormNo(daFormNo);
			if (daForm == null) {
				continue;
			}
			// 要货申请单明细
			List<DeliverFormList> daDetailList = queryDeliverFormListServiceApi.getDeliverListByFormNo(daFormNo);
			if (CollectionUtils.isEmpty(daDetailList)) {
				continue;
			}
			
			// 要货申请单明细按“货号_是否赠品”转换为map，方便查询
			Map<String, DeliverFormList> daDetailMap = new HashMap<String, DeliverFormList>();
			for (DeliverFormList detail : daDetailList) {
				// 货号
				String skuCode = detail.getSkuCode();
				// 是否赠品
				Integer isGift = Integer.valueOf(detail.getIsGift());
				// KEY：货号_是否赠品，VALUE：采购申请单明细
				daDetailMap.put(skuCode + "_" + isGift, detail);
			}
			
			// 配送出库单
			DeliverFormVo doForm = createDeliverForm(daForm, FormType.DO.name());
			// 配送出库单明细
			BigDecimal totalNum = BigDecimal.ZERO;
			BigDecimal amount = BigDecimal.ZERO;
			BigDecimal untaxedAmount = BigDecimal.ZERO;
			List<DeliverFormListVo> detailList = new ArrayList<DeliverFormListVo>();
			for (Map.Entry<String, ImportEntity> entryEntity : entry.getValue().entrySet()) {
				// 货号
				String skuCode = entryEntity.getKey();
				// 导入实体类
				ImportEntity entity = entryEntity.getValue();
				entity.setNum(entity.getNum().subtract(entity.getGiftNum()));
				// 配送出库商品明细
				if (entity.getNum().compareTo(BigDecimal.ZERO) > 0) {
					DeliverFormList daDetail = daDetailMap.get(skuCode + "_" + "0");
					if (null != daDetail) {
						// 配送出库单明细
						DeliverFormListVo formDetail = createDetail(doForm, daDetail, entity, 0, entity.getRowNo(),
								user.getId());
						// 添加到列表
						detailList.add(formDetail);
						totalNum = totalNum.add(formDetail.getDealNum());
						amount = amount.add(formDetail.getAmount());
						untaxedAmount = untaxedAmount.add(formDetail.getUntaxedAmount());
					}
				}
				// 配送出库赠品明细
				if (entity.getGiftNum().compareTo(BigDecimal.ZERO) > 0) {
					DeliverFormList daDetail = daDetailMap.get(skuCode + "_" + "1");
					if (null != daDetail) {
						// 配送出库单明细
						DeliverFormListVo formDetail = createDetail(doForm, daDetail, entity, 1, entity.getRowNo(),
								user.getId());
						// 添加到列表
						detailList.add(formDetail);
						totalNum = totalNum.add(formDetail.getDealNum());
						amount = amount.add(formDetail.getAmount());
						untaxedAmount = untaxedAmount.add(formDetail.getUntaxedAmount());
					}
				}
			}
			// 重新按出库单配置获取商品配送价格
			List<GoodsSkuVo> goodsSkuVos = new ArrayList<>();
			for (DeliverFormListVo deliverFormListVo : detailList) {
				GoodsSkuVo gsVo = new GoodsSkuVo();
				gsVo.setId(deliverFormListVo.getSkuId());
				gsVo.setSkuCode(deliverFormListVo.getSkuCode());
				goodsSkuVos.add(gsVo);
			}
			if (!setDoFormDetailPrice(daForm, goodsSkuVos, detailList,result)) {
				return;
			}
			
			doForm.setTotalNum(totalNum);
			doForm.setAmount(amount);
			doForm.setUntaxedAmount(untaxedAmount);
			doForm.setDeliverFormListVo(detailList);
			RespJson resp = deliverFormServiceApi.insertForm(doForm);
			if (resp.isSuccess()) {
				result.add("配送出库单【" + daFormNo + "】导入成功。</br>");
			} else {
				result.add("<font color='red'>配送出库单【" + daFormNo + "】导入失败，失败原因：" + resp.getMessage() + "</font></br>");
			}
		}
	}

	private void saveDiForm(List<ImportEntity> xlsList, Set<String> result) {
		// 当前用户
		SysUser user = UserUtil.getCurrentUser();
		// 按订单分类，Key：门店配送出库单单号，Value：解析的值
		Map<String, Map<String, ImportEntity>> formMap = diConvertToMap(xlsList);
		// // 遍历
		for (Map.Entry<String, Map<String, ImportEntity>> entry : formMap.entrySet()) {
			// 配送出库单单号
			String doFormNo = entry.getKey();
			// 配送出库单
			DeliverForm doForm = deliverFormServiceApi.queryDeliverFormByFormNo(doFormNo);
			if (doForm == null) {
				continue;
			}
			// 配送出库单明细
			List<DeliverFormList> doDetailList = queryDeliverFormListServiceApi.getDeliverListByFormNo(doFormNo);
			if (CollectionUtils.isEmpty(doDetailList)) {
				continue;
			}
			List<GoodsSkuVo> goodsSkuVos = new ArrayList<>();
			// 配送出库单明细按“货号_是否赠品”转换为map，方便查询
			Map<String, DeliverFormList> doDetailMap = new HashMap<String, DeliverFormList>();
			for (DeliverFormList detail : doDetailList) {
				// 货号
				String skuCode = detail.getSkuCode();
				// 是否赠品
				Integer isGift = Integer.valueOf(detail.getIsGift());
				// KEY：货号_是否赠品，VALUE：配送出库单明细
				doDetailMap.put(skuCode + "_" + isGift, detail);
				GoodsSkuVo gsVo = new GoodsSkuVo();
				gsVo.setId(detail.getSkuId());
				goodsSkuVos.add(gsVo);
			}
			// 按出库单明细获取商品配送价格
//			setDoFormDetailPrice(doForm, goodsSkuVos, doDetailList);
			// 配入出库单
			DeliverFormVo diForm = createDeliverForm(doForm, FormType.DI.name());
			// 配送入库单明细
			BigDecimal totalNum = BigDecimal.ZERO;
			BigDecimal amount = BigDecimal.ZERO;
			BigDecimal untaxedAmount = BigDecimal.ZERO;
			BigDecimal num = BigDecimal.ZERO;
			List<DeliverFormListVo> detailList = new ArrayList<DeliverFormListVo>();
			for (Map.Entry<String, ImportEntity> entryEntity : entry.getValue().entrySet()) {
				// 货号
				String skuCode = entryEntity.getKey();
				// 导入实体类
				ImportEntity entity = entryEntity.getValue();
				entity.setNum(entity.getNum());
				DeliverFormList doDetail = doDetailMap.get(skuCode + "_" + "0");
				DeliverFormList giftDaDetail = doDetailMap.get(skuCode + "_" + "1");
				num = entity.getNum();
				if (doDetail != null && giftDaDetail != null) {
					// 说明其中含有赠品数量
					if (num.compareTo(doDetail.getDealNum()) > 0) {
						// 此为非赠品数量
						entity.setNum(doDetail.getDealNum());
						// 此为赠品数量
						entity.setGiftNum(num.subtract(doDetail.getDealNum()));
					} else {
						entity.setNum(num);
						entity.setGiftNum(BigDecimal.ZERO);
					}
				} else if (doDetail == null && giftDaDetail != null) {
					entity.setNum(BigDecimal.ZERO);
					entity.setGiftNum(num);
				} else if (doDetail != null && giftDaDetail == null) {
					entity.setNum(num);
					entity.setGiftNum(BigDecimal.ZERO);
				}
				// 配送出库商品明细
				if (entity.getNum().compareTo(BigDecimal.ZERO) > 0) {
					DeliverFormList doDetails = doDetailMap.get(skuCode + "_" + "0");
					if (null != doDetails) {
						// 配送出库单明细
						DeliverFormListVo formDetail = createDetail(diForm, doDetail, entity, 0, entity.getRowNo(),
								user.getId());
						// 添加到列表
						detailList.add(formDetail);
						totalNum = totalNum.add(formDetail.getDealNum());
						amount = amount.add(formDetail.getAmount());
						untaxedAmount = untaxedAmount.add(formDetail.getUntaxedAmount());
					}
				}
				// 配送出库赠品明细
				if (entity.getGiftNum().compareTo(BigDecimal.ZERO) > 0) {
					DeliverFormList doDetails = doDetailMap.get(skuCode + "_" + "1");
					if (null != doDetails) {
						// 配送出库单明细
						DeliverFormListVo formDetail = createDetail(diForm, doDetails, entity, 1, entity.getRowNo(),
								user.getId());
						// 添加到列表
						detailList.add(formDetail);
						totalNum = totalNum.add(formDetail.getDealNum());
						amount = amount.add(formDetail.getAmount());
						untaxedAmount = untaxedAmount.add(formDetail.getUntaxedAmount());
					}
				}
			}
			diForm.setTotalNum(totalNum);
			diForm.setAmount(amount);
			diForm.setUntaxedAmount(untaxedAmount);
			diForm.setDeliverFormListVo(detailList);
			RespJson resp = deliverFormServiceApi.insertForm(diForm);
			if (resp.isSuccess()) {
				result.add("配送入库单【" + doFormNo + "】导入成功。</br>");
			} else {
				result.add("<font color='red'>配送入库单【" + doFormNo + "】导入失败，失败原因：" + resp.getMessage() + "</font></br>");
			}
		}
	}

	/** 
	 * {
	 * "branchId":"080b1000156211e689240050569e21f2",
	 * "stockBranchId":"8a284fd056c2991b0156d4fa4a230836",
	 * "type":"DO","fieldName":"id",
	 * "goodsSkuVo":[
	 * {"id":"2c9380af59f5836e015a089b7e561965"},
	 * {"id":"2c9380af59f5836e015a089c2df01968"},
	 * {"id":"2c9380af59f5836e015a089d2a28196e"}]}
	 * @Description: 重新按出库单配置获取商品配送价格
	 * @author xuyq
	 * @date 2017年9月27日
	 */
	private boolean setDoFormDetailPrice(DeliverForm daForm, List<GoodsSkuVo> goodsSkuVos,
			List<DeliverFormListVo> daDetailList,Set<String> result) {
		GoodsStockVo goodsStockVos = new GoodsStockVo();
		goodsStockVos.setBranchId(daForm.getSourceBranchId());
		goodsStockVos.setStockBranchId(daForm.getTargetBranchId());
		goodsStockVos.setType("DO");
		goodsStockVos.setFieldName("id");
		goodsStockVos.setGoodsSkuVo(goodsSkuVos);
		List<GoodsSelect> goodsList = goodsSelectServiceApi.queryByBrancheAndSkuIdsToDo(goodsStockVos);
		if (CollectionUtils.isEmpty(goodsList)) {
			StringBuffer buffer = new StringBuffer();
			for (GoodsSkuVo goodsSkuVo : goodsSkuVos) {
				buffer.append(goodsSkuVo.getSkuCode()+",");
			}
			result.add("商品货号为:" + buffer.toString() + "商品配送价格获取失败!");
			return false;
		}
		Map<String, GoodsSelect> goodsMap = new HashMap<>();
		for (GoodsSelect goods : goodsList) {
			goodsMap.put(goods.getSkuId(), goods);
		}
		// 替换价格
		StringBuffer error = new StringBuffer();
		for (DeliverFormListVo detail : daDetailList) {
			if (goodsMap.get(detail.getSkuId()) == null) {
				error.append(detail.getSkuCode() + ",");
				continue;
			} else {
				// 不是赠品的赋值
				if (IsGiftEnum.NO.getIndex().equals(detail.getIsGift())) {
					detail.setPrice(goodsMap.get(detail.getSkuId()).getDistributionPrice());
				} else {
					detail.setPrice(BigDecimal.ZERO);
				}
			}
		}
		if (error.length() > 0) {
			result.add("<font color='red'>配送出库单【" + daForm.getFormNo() + "】导入失败，失败原因商品货号为:" + error.toString() + "的商品查询不到配送价格</font></br>");
			return false;
		}
		return true;
	}

	/**
	 * 
	 * @Description: 创建采购入库单对象
	 * @param paForm
	 * @return PurchaseForm  
	 * @author zhangq
	 * @date 2017年8月24日
	 */
	private PurchaseForm createPi(PurchaseFormPO paForm) {
		// 当前用户
		SysUser user = UserUtil.getCurrentUser();
		// 当前时间
		Date now = new Date();
		// 入库单ID
		String formId = UUIDHexGenerator.generate();
		// 入库单单号
		String piFormNo = orderNoUtils.getOrderNo(FormType.PI.name() + user.getBranchCode());
		// 采购入库单
		PurchaseForm form = new PurchaseForm();
		form.setId(formId); // 入库单ID
		form.setRefFormNo(paForm.getFormNo()); // 引用单号
		form.setIsRef(0); // 是否引入
		form.setFormType(FormType.PI); // 单据类型：采购入库单
		form.setFormNo(piFormNo); // 入库单单号
		form.setIo(1); // 库存增加
		form.setBranchId(paForm.getBranchId()); // 机构ID
		form.setSupplierId(paForm.getSupplierId()); // 供应商ID
		form.setRemark("物流系统导入。");
		form.setCreaterBranchId(user.getBranchId()); // 创建机构ID：当前操作人机构ID
		form.setStatus(FormStatus.WAIT_CHECK.getValue()); // 审核状态：待审核
		form.setDealStatus(0); // 处理状态：未处理
		form.setDisabled(0); // 删除状态：未删除
		form.setCreateUserId(user.getId()); // 创建人ID
		form.setCreateTime(now); // 创建时间：当前时间
		form.setUpdateUserId(user.getId()); // 更新人ID
		form.setUpdateTime(now); // 更新时间：当前时间
		return form;
	}

	/**
	 * 
	 * @Description: 创建采购入库单明细对象
	 * @param piFormId
	 * @param paDetail
	 * @param importEntity
	 * @param isGift
	 * @param rowNo
	 * @param userId
	 * @return PurchaseFormDetail  
	 * @author zhangq
	 * @date 2017年8月24日
	 */
	private PurchaseFormDetail createPiDetail(String piFormId, PurchaseFormDetailPO paDetail,
			ImportEntity importEntity, Integer isGift, int rowNo, String userId) {
		// 数量
		BigDecimal num = BigDecimal.ZERO;
		if (isGift == 0) {
			num = importEntity.getNum();
		} else {
			num = importEntity.getGiftNum();
		}
		// 采购入库单明细
		PurchaseFormDetail formDetail = new PurchaseFormDetail();
		formDetail.setId(UUIDHexGenerator.generate()); // 明细ID
		formDetail.setFormId(piFormId); // 入库单ID
		formDetail.setSkuId(paDetail.getSkuId()); // 商品ID
		formDetail.setSkuCode(paDetail.getSkuCode()); // 商品货号
		formDetail.setBarCode(paDetail.getBarCode()); // 商品条码
		formDetail.setRowNo(rowNo); // 行号
		formDetail.setDealNum(num); // 已处理数量（被引用后处理的数量）
		formDetail.setLargeNum(num.divide(paDetail.getPurchaseSpec(), 4, RoundingMode.HALF_UP)); // 箱数
		formDetail.setRealNum(num); // 数量
		formDetail.setOriginalPrice(paDetail.getOriginalPrice()); // 原价
		formDetail.setPrice(paDetail.getPrice()); // 单价
		formDetail.setPriceBack(paDetail.getPriceBack()); // 单价备份
		formDetail.setSalePrice(paDetail.getSalePrice()); // 销售价
		formDetail.setAmount(num.multiply(paDetail.getPrice())); // 金额
		formDetail.setUntaxedAmount(paDetail.getUntaxedAmount());
		formDetail.setUntaxedPrice(paDetail.getUntaxedPrice());
		formDetail.setTax(paDetail.getTax()); // 税率
		formDetail.setIsGift(isGift); // 是否赠品
		formDetail.setRemark(paDetail.getRemark()); // 备注
		formDetail.setCreateTime(new Date()); // 创建时间：当前时间
		formDetail.setCreateUserId(userId); // 创建人ID
		formDetail.setUpdateTime(new Date()); // 更新时间
		formDetail.setUpdateUserId(userId); // 更新人ID
		formDetail.setDisabled(0); // 删除状态：未删除
		return formDetail;
	}

	/**
	 * 
	 * @Description: 创建配送出库单对象
	 * @param daForm
	 * @return DeliverFormVo  
	 * @author zhangq
	 * @date 2017年8月24日
	 */
	private DeliverFormVo createDeliverForm(DeliverForm form, String formType) {
		// 当前用户
		SysUser user = UserUtil.getCurrentUser();
		// 当前时间
		Date now = new Date();
		// 配送出库单ID
		String formId = UUIDHexGenerator.generate();
		// 配送出库单单号
		String doFormNo = orderNoUtils.getOrderNo(formType + user.getBranchCode());
		// 配送出库单
		DeliverFormVo deliverFormVo = new DeliverFormVo();
		deliverFormVo.setId(formId);
		deliverFormVo.setDeliverFormId(formId); // 单据ID
		deliverFormVo.setFormNo(doFormNo); // 单据编号
		deliverFormVo.setFormType(formType); // 单据类型：配送出库单
		if (FormType.DO.name().equals(formType)) {
			deliverFormVo.setIo("0"); // 库存减少
		} else {
			deliverFormVo.setIo("1"); // 库存增加
		}
		deliverFormVo.setStatus(DeliverAuditStatusEnum.WAIT_CHECK.getIndex()); // 状态：待审核
		deliverFormVo.setDealStatus(DeliverStatusEnum.PENDING.getIndex()); // 处理状态：待处理
		deliverFormVo.setIsReference(IsReference.NO.getIndex());
		deliverFormVo.setCreaterBranchId(UserUtil.getCurrBranchId());
		deliverFormVo.setValue(user.getId(), user.getId(), null, null);
		deliverFormVo.setFormSources(FormSourcesEnum.SYSTEM.getKey());
		deliverFormVo.setReferenceId(form.getDeliverFormId()); // 引用单ID
		deliverFormVo.setReferenceNo(form.getFormNo()); // 引用单编号
		deliverFormVo.setCreateUserId(user.getId()); // 创建用户ID
		deliverFormVo.setCreateTime(now); // 创建用户时间
		deliverFormVo.setUpdateUserId(user.getId()); // 修改用户ID
		deliverFormVo.setUpdateTime(now); // 修改时间
		deliverFormVo.setDisabled(0); // 删除状态：未删除
		deliverFormVo.setSourceBranchId(form.getSourceBranchId());
		deliverFormVo.setTargetBranchId(form.getTargetBranchId());
		return deliverFormVo;
	}

	/**
	 * 
	 * @Description: 创建配送出库明细对象
	 * @param piFormId
	 * @param daDetail
	 * @param importEntity
	 * @param isGift
	 * @param rowNo
	 * @param userId
	 * @return DeliverFormListVo 
	 * @author zhangq
	 * @date 2017年8月24日
	 */
//	private DeliverFormListVo createDoDetail(DeliverFormVo doForm, DeliverFormList daDetail, ImportEntity importEntity,
//			Integer isGift, int rowNo, String userId) {
//		// 数量
//		BigDecimal num = BigDecimal.ZERO;
//		if (isGift == 0) {
//			num = importEntity.getNum();
//		} else {
//			num = importEntity.getGiftNum();
//		}
//		// 配送出库单明细
//		DeliverFormListVo formDetail = new DeliverFormListVo();
//		formDetail.setDeliverFormListId(UUIDHexGenerator.generate()); // 明细ID
//		formDetail.setFormId(doForm.getId()); // 出库单ID
//		formDetail.setFormNo(doForm.getFormNo()); // 出库单单号
//		formDetail.setSkuId(daDetail.getSkuId()); // 商品ID
//		formDetail.setSkuName(daDetail.getSkuName()); // 商品名称
//		formDetail.setSpec(daDetail.getSpec());
//		formDetail.setSkuCode(daDetail.getSkuCode()); // 商品货号
//		formDetail.setBarCode(daDetail.getBarCode()); // 商品条码
//		formDetail.setRowNo(rowNo); // 行号
//		formDetail.setDealNum(num); // 已处理数量（被引用后处理的数量）
//		formDetail.setLargeNum(num.divide(daDetail.getDistributionSpec(), 4, RoundingMode.HALF_UP)); // 箱数
//		formDetail.setOriginalPrice(daDetail.getOriginalPrice()); // 原价
//		formDetail.setPrice(daDetail.getPrice()); // 单价
//		formDetail.setPriceBack(daDetail.getPriceBack()); // 单价备份
//		formDetail.setSalePrice(daDetail.getSalePrice()); // 销售价
//		formDetail.setAmount(num.multiply(daDetail.getPrice())); // 金额
//		formDetail.setIsGift(isGift.toString()); // 是否赠品
//		formDetail.setRemark(daDetail.getRemark()); // 备注
//		formDetail.setApplyNum(daDetail.getApplyNum()); // 申请储量
//		formDetail.setInputTax(daDetail.getInputTax()); // 税率
//		formDetail.setDistributionSpec(daDetail.getDistributionSpec()); // 配送规格
//		return formDetail;
//	}
	
	/**
	 * @Description: 创建配送明细对象
	 * @param doForm
	 * @param doDetail
	 * @param importEntity
	 * @param isGift
	 * @param rowNo
	 * @param userId
	 * @return   
	 * @return DeliverFormListVo  
	 * @throws
	 * @author zhangchm
	 * @date 2017年10月13日
	 */
	private DeliverFormListVo createDetail(DeliverFormVo doForm, DeliverFormList doDetail, ImportEntity importEntity,
			Integer isGift, int rowNo, String userId) {
		// 数量
		BigDecimal num = BigDecimal.ZERO;
		if (isGift == 0) {
			num = importEntity.getNum();
		} else {
			num = importEntity.getGiftNum();
		}
		// 配送出库单明细
		DeliverFormListVo formDetail = new DeliverFormListVo();
		formDetail.setDeliverFormListId(UUIDHexGenerator.generate()); // 明细ID
		formDetail.setFormId(doForm.getId()); // 出库单ID
		formDetail.setFormNo(doForm.getFormNo()); // 出库单单号
		formDetail.setSkuId(doDetail.getSkuId()); // 商品ID
		formDetail.setSkuName(doDetail.getSkuName()); // 商品名称
		formDetail.setSpec(doDetail.getSpec());
		formDetail.setSkuCode(doDetail.getSkuCode()); // 商品货号
		formDetail.setBarCode(doDetail.getBarCode()); // 商品条码
		formDetail.setRowNo(rowNo); // 行号
		formDetail.setApplyNum(doDetail.getApplyNum()); // 预定数量
		if (FormType.DO.name().equals(doForm.getFormType())) {
			formDetail.setDealNum(num); // 已处理数量（被引用后处理的数量）
		}
		if (FormType.DI.name().equals(doForm.getFormType())) {
			formDetail.setDealNum(doDetail.getDealNum()); // 已处理数量（被引用后处理的数量）
			formDetail.setReceiveNum(num); // 已收货数量
		} 
		formDetail.setLargeNum(num.divide(doDetail.getDistributionSpec(), 4, RoundingMode.HALF_UP)); // 箱数
		formDetail.setOriginalPrice(doDetail.getOriginalPrice()); // 原价
		formDetail.setPrice(doDetail.getPrice()); // 单价
		formDetail.setPriceBack(doDetail.getPriceBack()); // 单价备份
		formDetail.setSalePrice(doDetail.getSalePrice()); // 销售价
		formDetail.setAmount(num.multiply(doDetail.getPrice())); // 金额
	    formDetail.setUntaxedAmount(doDetail.getUntaxedAmount());
	    formDetail.setUntaxedPrice(doDetail.getUntaxedPrice());
		formDetail.setIsGift(isGift.toString()); // 是否赠品
		formDetail.setRemark(doDetail.getRemark()); // 备注
		formDetail.setApplyNum(doDetail.getApplyNum()); // 申请储量
		formDetail.setInputTax(doDetail.getInputTax()); // 税率
		formDetail.setDistributionSpec(doDetail.getDistributionSpec()); // 配送规格
		return formDetail;
	}
	
	/**
	 * @Description: 将导入的对象转换为map，Key为单号，Value为根据货号汇总的数据
	 * @param list
	 * @return   
	 * @return Map<String,Map<String,ImportEntity>>  
	 * @throws
	 * @author zhangchm
	 * @date 2017年10月13日
	 */
	private Map<String, Map<String, ImportEntity>> diConvertToMap(List<ImportEntity> list) {
		// 按订单分类，Key：单据号，Value：解析值
		Map<String, Map<String, ImportEntity>> formMap = new HashMap<String, Map<String, ImportEntity>>();
		for (ImportEntity entity : list) {
			String formNo = entity.getFormNo();
			if (!formMap.containsKey(formNo)) {
				Map<String, ImportEntity> map = new HashMap<String, ImportEntity>();
				formMap.put(formNo, map);
			}
			// 根据货号汇总数据，零售不关注一品多码，需要将物流的一品多码汇总
			String skuCode = entity.getSkuCode();
			BigDecimal num = null;
			if (formMap.get(formNo).containsKey(skuCode)) {
				ImportEntity already = formMap.get(formNo).get(skuCode);
				BigDecimal alreadyRejectsNum = (already.getRejectsNum() == null ? BigDecimal.ZERO : already.getRejectsNum());
				BigDecimal alreadyShelveNum = (already.getShelveNum() == null ? BigDecimal.ZERO : already.getShelveNum());
				BigDecimal entityRejectsNum = (entity.getRejectsNum() == null ? BigDecimal.ZERO : entity.getRejectsNum());
				BigDecimal entityShelveNum = (entity.getShelveNum() == null ? BigDecimal.ZERO : entity.getShelveNum());
				BigDecimal entityGiftNum = (entity.getGiftNum() == null ? BigDecimal.ZERO : entity.getGiftNum());
				num = already.getNum().add(entity.getNum()).add(alreadyRejectsNum).add(alreadyShelveNum).add(entityRejectsNum).add(entityShelveNum);
				already.setNum(num);
				already.setRejectsNum(alreadyRejectsNum.add(entityRejectsNum));
				already.setShelveNum(alreadyShelveNum.add(entityShelveNum));
				already.setGiftNum(already.getGiftNum().add(entityGiftNum));
				formMap.get(formNo).put(skuCode, already);
			} else {
				BigDecimal entityRejectsNum = (entity.getRejectsNum() == null ? BigDecimal.ZERO : entity.getRejectsNum());
				BigDecimal entityShelveNum = (entity.getShelveNum() == null ? BigDecimal.ZERO : entity.getShelveNum());
				BigDecimal entityGiftNum = (entity.getGiftNum() == null ? BigDecimal.ZERO : entity.getGiftNum());
				entity.setRejectsNum(entityRejectsNum);
				entity.setShelveNum(entityShelveNum);
				entity.setGiftNum(entityGiftNum);
				entity.setNum(entity.getNum().add(entityRejectsNum).add(entityShelveNum));
				formMap.get(formNo).put(skuCode, entity);
			}
		}
		return formMap;
	}
	
	/**
	 * @Description: 将导入的对象转换为map，Key为单号，Value为根据货号汇总的数据
	 * @param list
	 * @return Map<String,Map<String,ImportEntity>>  
	 * @author zhangq
	 * @date 2017年9月5日
	 */
	private Map<String, Map<String, ImportEntity>> convertToMap(List<ImportEntity> list) {
		// 按订单分类，Key：单据号，Value：解析值
		Map<String, Map<String, ImportEntity>> formMap = new HashMap<String, Map<String, ImportEntity>>();
		for (ImportEntity entity : list) {
			String formNo = entity.getFormNo();
			if (!formMap.containsKey(formNo)) {
				Map<String, ImportEntity> map = new HashMap<String, ImportEntity>();
				formMap.put(formNo, map);
			}

			// 根据货号汇总数据，零售不关注一品多码，需要将物流的一品多码汇总
			String skuCode = entity.getSkuCode();
			if (formMap.get(formNo).containsKey(skuCode)) {
				ImportEntity already = formMap.get(formNo).get(skuCode);
				already.setNum(already.getNum().add(entity.getNum()));
				already.setGiftNum(already.getGiftNum().add(entity.getGiftNum()));
				formMap.get(formNo).put(skuCode, already);
			} else {
				formMap.get(formNo).put(skuCode, entity);
			}
		}
		return formMap;
	}
}