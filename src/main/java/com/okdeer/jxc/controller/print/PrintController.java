/** 
 *@Project: okdeer-jxc-web 
 *@Author: yangyq02
 *@Date: 2016年8月11日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.controller.print;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSONObject;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.constant.PrintConstant;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportBusinessValid;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportComponent;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportHandle;
import com.okdeer.jxc.common.goodselect.GoodsSelectImportVo;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.entity.GoodsSelectByCostPrice;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: PrintController 
 * @Description: 打印Controller类
 * @author yangyq02
 * @date 2016年8月11日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    进销存2.Constant.ZERO.Constant.ZERO		   2016年8月20日                  杨永钦                                                PrintController
 */
@Controller
@RequestMapping("print")
public class PrintController extends BaseController<PrintController> {

	private static final Logger LOG = LoggerFactory.getLogger(PrintController.class);
    //二维码路径
    @Value("qrCodeUrl")
    private static String qrCodeUrl = "http://update.okdeer.com/ymlstore.html";
    // 价签logo的路径
    private static String LOGO_PATH = "/template/excel/print/priceTag.png";

	@Autowired
	private GoodsSelectImportComponent goodsSelectImportComponent;

	// 价签logo图片
	private static Image logo = null;
	
	@Reference(version = "1.0.0", check = false)
	private BranchesServiceApi branchesService;
	/**
	 * @Description: 打印选择商品界面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "view")
	public String view(Model model) {
		model.addAttribute("branchId", getCurrBranchId());
		return "print/pricePrint";
	}

	/**
	 * @Description: 价签打印页面
	 * @return   
	 * @return String  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月25日
	 */
	@RequestMapping(value = "printGoodsView")
	public String printGoodsView() {
		return "print/priceGoodsLabel";
	}

	/**
	 * @Fields EIGHT : 8
	 */
	private final static int EIGHT = 8;

	/**
	 * @Fields TEN : 10
	 */
	private final static int TEN = Constant.TEN;

	/**
	 * @Fields TWELVE : 12
	 */
	private final static int TWELVE = 12;

	/**
	 * @Fields FOURTEEN : 14
	 */
	private final static int FOURTEEN = 14;

	/**
	 * @Fields HUNDRED : 100
	 */
	private final static int HUNDRED = 100;

	/**
	 * @Fields ROW_HIGH : 行高
	 */
	private final static int ROW_HIGH = 26;

	/**
	 * @Fields ROW_HIGH : 行高
	 */
	private final static int SMALL_ROW_HIGH = 16;

	/**
	 * @Fields FONT8 : 8号字体
	 */
	private final static Font FONT8 = new Font(getBaseFont(), EIGHT, Font.NORMAL);

	/**
	 * @Fields FONT10 : 10号字体
	 */
	private final static Font FONT10 = new Font(getBaseFont(), TEN, Font.NORMAL);

	/**
	 * @Fields FONT12 : 12号字体加粗
	 */
	private final static Font FONT12 = new Font(getBaseFont(), TWELVE, Font.BOLD);

	/**
	 * @Fields FONT14BOLD : 14号加粗
	 */
	private final static Font FONT14BOLD = new Font(getBaseFont(), FOURTEEN, Font.BOLD);

	private final static String pathName = PrintController.class.getResource("/").getPath();

	private static BaseFont baseFont;

	private static BaseFont getBaseFont() {
		if (baseFont == null) {
			try {
				baseFont = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
			} catch (DocumentException e) {
				LOG.error("文件异常：", e);
			} catch (IOException e) {
				LOG.error("IO异常:", e);
			}
		}
		return baseFont;
	}

	/**
	 * @Description: 价签打印
	 * @param data
	 * @param request
	 * @param response   
	 * @return void  
	 * @throws
	 * @author yangyq02
	 * @date 2016年8月23日
	 */
	@RequestMapping(value = "printLabel", method = RequestMethod.POST)
	@ResponseBody
	public void printLabel(String printNo, String data,String branchId, HttpServletRequest request, HttpServletResponse response) {
		List<GoodsPrint> list;
		String pathName = getClass().getResource("/").getPath();
		if (data.trim().length() > Constant.ZERO) {
			list = JSONObject.parseArray(data, GoodsPrint.class);
			List<GoodsPrint> pintList = new ArrayList<GoodsPrint>();
			if (!CollectionUtils.isEmpty(list)) {
				for (int i = Constant.ZERO; i < list.size(); i++) {
					list.get(i).setBranchId(branchId);
					// 替换条码里面的空格和将数字转为俩位小数
					if (StringUtils.isNotEmpty(list.get(i).getBarCode())) {
						list.get(i).setBarCode(list.get(i).getBarCode().trim().replaceAll(" ", ""));
					}
					if (list.get(i).getSalePrice() != null) {
						list.get(i).setSalePrice(
								list.get(i).getSalePrice().setScale(Constant.TWO, BigDecimal.ROUND_HALF_UP));
					}
					if (list.get(i).getPromotionPrice() != null) {
						list.get(i).setPromotionPrice(
								list.get(i).getPromotionPrice().setScale(Constant.TWO, BigDecimal.ROUND_HALF_UP));
					}
					// 生成条形码图片
					if (StringUtils.isNotEmpty(list.get(i).getBarCode())) {
						String barCode = list.get(i).getBarCode();
						if (!barCode.startsWith("0")) {
							BigDecimal bd = new BigDecimal(list.get(i).getBarCode());
							barCode = bd.toString();
						}
						list.get(i).setBarCodeImg(OneBarcodeUtil.createBarcode(barCode, pathName));
					}
					// 如果是多份，则将集合添加，打印多次
					if (list.get(i).getPrintCount() != null && list.get(i).getPrintCount() > Constant.ONE) {
						for (int j = Constant.ZERO; j < list.get(i).getPrintCount(); j++) {
							pintList.add(list.get(i));
						}
					} else {
						pintList.add(list.get(i));
					}
				}
				try{
					cleanAccessData(pintList);
					if ("1".equals(printNo)) {
						exportPdf1(response, pintList);
					} else if ("2".equals(printNo)) {
						exportPdf2(response, pintList);
					}  else {
						JasperHelper.exportmain(request, response, null, JasperHelper.PDF_TYPE, PrintConstant.PRINT_LABEL
								+ printNo + ".jrxml", pintList, "test");
					}
				}catch(Exception e){
					LOG.error("价签打印出现异常：{}",e);
					try {
						e.printStackTrace(response.getWriter());
					} catch (IOException e1) {
						e1.printStackTrace();
					}
				}
			}
		}
	}

	/**
	 * @Description: 55*25规格 一行三个，A4纸，11行共33个
	 * @param response
	 * @param goodsSelect   
	 * @return void  
	 * @throws
	 * @author yangyq02
	 * @date 2016年9月12日
	 */
	public void exportPdf1(HttpServletResponse response, List<GoodsPrint> goodsSelect) {

		try {
			initLogo();
			List<GoodsPrint> printList = goodsSelect;
			// 开始写入pdf
			// 步骤1：创建一个document 设置marginLeft, marginRight,marginTop,marginBottom
			Document document = getDocument(PageSize.A4, 63, 64, Constant.TEN, Constant.TEN, response);
			// 设置中文字体
			// 字符串样式
			// 建立一个书写器(Writer)与document对象关联，通过书写器(Writer)可以将文档写入到磁盘中。
			// 设置输出流
			java.io.OutputStream os = response.getOutputStream();
			response.reset();
			response.setContentType("application/pdf");// 保存为pdf
			response.setCharacterEncoding("utf-8");
			// 步骤2：为document创建一个监听，将PDG流写入到文件中
			PdfWriter.getInstance(document, os);

			// 步骤3：打开文档
			document.open();

			// 创建一个有3列的表格
			PdfPTable mainTable = new PdfPTable(3);
			mainTable.setWidthPercentage(HUNDRED);
			int i = Constant.ZERO;
			int totalPrintNum = printList.size();
			for (GoodsPrint p : printList) {
				PdfPCell mainCell = full(FONT8, p, mainTable, SMALL_ROW_HIGH, FONT12, 20);
				i++;
				if (i == totalPrintNum) {
					// 如果是最后一条记录，需要填充空白单元格到主表格中
					if (i % 3 != Constant.ZERO) {
						for (int j = 3; j > i % 3; j--) {
							mainCell = new PdfPCell();
							mainCell.setBorder(Constant.ZERO);
							mainCell.setPadding(1.5f);
							mainCell.setPaddingBottom(5f);
							mainTable.addCell(mainCell);
						}
					}
					// 增加到文档中
					document.add(mainTable);
				} else {
					if (i % 3 == Constant.ZERO) {
						// 增加到文档中
						document.add(mainTable);
						mainTable = new PdfPTable(3);
						mainTable.setWidthPercentage(HUNDRED);
					}
					// 一页显示多少
					if (i % 33 == Constant.ZERO) {
						document.newPage();
					}
				}
			}
			// 关闭文档。
			document.close();
			os.flush();
			os.close();
		} catch (Exception e) {
			LOG.error("导出PDF时发生异常，{}", e);
		}
	}

	/**
	 * @Description: 85*40规格 一行三个，A4纸，7行共14个
	 * @param response
	 * @param goodsSelect   
	 * @return void  
	 * @throws
	 * @author yangyq02
	 * @date 2016年9月12日
	 */
	public void exportPdf2(HttpServletResponse response, List<GoodsPrint> goodsSelect) {
		try {
			initLogo();
			List<GoodsPrint> printList = goodsSelect;
			// 开始写入pdf
			// 步骤1：创建一个document 设置marginLeft, marginRight,marginTop,marginBottom
			Document document = new Document(PageSize.A4, 53, 53, Constant.TEN, Constant.TEN);
			// 设置中文字体
			// 字符串样式

			// 建立一个书写器(Writer)与document对象关联，通过书写器(Writer)可以将文档写入到磁盘中。
			// 设置输出流
			java.io.OutputStream os = response.getOutputStream();
			response.reset();
			response.setContentType("application/pdf");// 保存为pdf
			response.setCharacterEncoding("utf-8");

			// 步骤2：为document创建一个监听，将PDG流写入到文件中
			PdfWriter.getInstance(document, os);

			// 步骤3：打开文档
			document.open();

			// 创建一个有3列的表格
			PdfPTable mainTable = new PdfPTable(Constant.TWO);
			mainTable.setWidthPercentage(HUNDRED);
			int i = Constant.ZERO;
			int totalPrintNum = printList.size();
			for (GoodsPrint p : printList) {
				PdfPCell mainCell = full(FONT10, p, mainTable, ROW_HIGH, FONT14BOLD, 32);
				i++;
				if (i == totalPrintNum) {
					// 如果是最后一条记录，需要填充空白单元格到主表格中
					if (i % Constant.TWO != Constant.ZERO) {
						for (int j = Constant.TWO; j > i % Constant.TWO; j--) {
							mainCell = new PdfPCell();
							mainCell.setBorder(Constant.ZERO);
							mainCell.setPadding(1.5f);
							mainCell.setPaddingBottom(5f);
							mainTable.addCell(mainCell);
						}
					}
					// 增加到文档中
					document.add(mainTable);
				} else {
					if (i % Constant.TWO == Constant.ZERO) {
						// 增加到文档中
						document.add(mainTable);

						mainTable = new PdfPTable(Constant.TWO);
						mainTable.setWidthPercentage(HUNDRED);
					}
					// 一页显示多少
					if (i % FOURTEEN == Constant.ZERO) {
						document.newPage();
					}
				}
			}
			// 关闭文档。
			document.close();
			os.flush();
			os.close();
		} catch (Exception e) {
			LOG.error("导出PDF时发生异常，{}", e);
		}
	}

	BaseColor baseColor = new BaseColor(255, 245, Constant.ZERO);

	BaseColor whitewColor = new BaseColor(255, 255, 255);

	public void initLogo() {
		if (logo == null) {
			try {
				logo = Image.getInstance(getClass().getResource(LOGO_PATH));
			} catch (Exception e) {
				LOG.error("生产logo图片失败，{}", e);
			}
		}
	}

	private void addCell(PdfPTable table, Element[] elements, int height, boolean isborder) {
		addCell(table, elements, Constant.ONE, height, isborder);
	}

	private void addCell(PdfPTable table, Element[] elements, int colspan, int height, boolean isborder) {
		addCell(table, elements, colspan, null, height, isborder);
	}

	private void addCell(PdfPTable table, Element[] elements, int colspan, BaseColor backgoundColor, int height,
			boolean isborder) {
		addCell(table, elements, colspan, Constant.ONE, backgoundColor, height, isborder);
	}

	private void addCell(PdfPTable table, Element[] elements, int colspan, int rowspan, BaseColor backgoundColor,
			int height, boolean isborder) {
		// 边框颜色
		BaseColor borderColor = new BaseColor(140, 189, 58);

		PdfPCell cell = new PdfPCell();

		if (elements == null || elements.length == Constant.ZERO) {
			table.addCell(cell);
			return;
		}

		if (elements.length == Constant.ONE) {
			cell.addElement(elements[Constant.ZERO]);
		} else {
			for (Element element : elements) {
				cell.addElement(element);
			}
		}
		if (isborder) {
			cell.setBorderColor(borderColor);
		} else {
			cell.setBorderColor(whitewColor);
		}
		if (backgoundColor != null) {
			cell.setBackgroundColor(backgoundColor);
		}
		cell.setColspan(colspan);
		cell.setRowspan(rowspan);
		cell.setFixedHeight(height);
		table.addCell(cell);
	}

	private String clean(String str) {
		return str == null ? "" : str;
	}

	public Document getDocument(Rectangle rect, int left, int right, int width, int hight, HttpServletResponse response)
			throws IOException, DocumentException {
		Document document = new Document(rect, left, right, width, hight);
		// 设置中文字体
		// 字符串样式
		// 建立一个书写器(Writer)与document对象关联，通过书写器(Writer)可以将文档写入到磁盘中。
		// 设置输出流
		response.reset();
		response.setContentType("application/pdf");// 保存为pdf
		response.setCharacterEncoding("utf-8");
		// 步骤2：为document创建一个监听，将PDG流写入到文件中
		PdfWriter.getInstance(document, response.getOutputStream());
		// 步骤3：打开文档
		document.open();
		return document;
	}

	public PdfPCell full(Font font, GoodsPrint p, PdfPTable mainTable, int hight, Font bootFont, int firstHight) {
		try {
			PdfPTable innerTable = new PdfPTable(3);
			innerTable.setWidthPercentage(HUNDRED);
			// 第一行是logo图片 占3列
			addCell(innerTable, new Element[] { logo }, 3, new BaseColor(140, 189, 58), firstHight, true);
			// 第二行品名和产地，品名占2列
			// 品名
			addCell(innerTable, new Element[] { new Paragraph("品名：" + clean(p.getSkuName()), font) }, Constant.TWO,
					hight, true);
			// 产地
			addCell(innerTable, new Element[] { new Paragraph("产地：" + clean(p.getOriginPlace()), font) }, hight, true);

			// 第三行 规格和单位
			addCell(innerTable, new Element[] { new Paragraph("规格：" + clean(p.getSpec()), font) }, hight, true);

			addCell(innerTable, new Element[] { new Paragraph("单位：" + clean(p.getUnit()), font) }, hight, true);
			// 零售价占两行
			addCell(innerTable,
					new Element[] {
					new Paragraph(" 零售价: ", font),
					new Phrase("￥ " + (p.getSalePrice() == null ? "" : clean(p.getSalePrice().toString())),
							bootFont) }, Constant.ONE, Constant.TWO, new BaseColor(255, 245, Constant.ZERO),
							hight, true);

			// 第四行：条码
			Image barcodeImg = null;
			PdfPCell cell = new PdfPCell();
			if (StringUtils.isNotEmpty(p.getBarCodeImg())) {
				barcodeImg = Image.getInstance(pathName + "/" + p.getBarCodeImg());
				barcodeImg.scaleAbsolute(HUNDRED, hight);
				cell = new PdfPCell(barcodeImg);
				cell.setPadding(1.5f);
				cell.setBorderColor(new BaseColor(140, 189, 58));
				cell.setColspan(Constant.TWO);
				cell.setRowspan(Constant.ONE);
				innerTable.addCell(cell);
			} else {
				// 如果条码不存在，则存入一个空的表格
				cell = new PdfPCell();
				cell.setBorderColor(new BaseColor(140, 189, 58));
				cell.setFixedHeight(17f);
				cell.setColspan(Constant.TWO);
				innerTable.addCell(cell);
			}

			// 创建一个主表格单元
			PdfPCell mainCell = new PdfPCell(innerTable);
			mainCell.setBorder(Constant.ZERO);
			mainCell.setPadding(1.5f);
			mainCell.setPaddingBottom(1.5f);
			// 把主表格单元添加到主表格中
			mainTable.addCell(mainCell);
			return mainCell;
		} catch (Exception e) {
			LOG.error("导出PDF时发生异常，{}", e);
		}
		return null;
	}

	@RequestMapping(value = "importList")
	@ResponseBody
	public RespJson importList(@RequestParam("file") MultipartFile file, String type) {
		RespJson respJson = RespJson.success();
		try {
			if (file.isEmpty()) {
				return RespJson.error("文件为空");
			}

			if (org.apache.commons.lang3.StringUtils.isBlank(type)) {
				return RespJson.error("导入类型为空");
			}
			String branchId = UserUtil.getCurrBranchId();

			// 文件流
			InputStream is = file.getInputStream();
			// 获取文件名
			String fileName = file.getOriginalFilename();

			SysUser user = UserUtil.getCurrentUser();

			String[] field = null;

			if (type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)) {// 货号
				field = new String[] { "skuCode", "newCostPrice" };
			} else if (type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)) {// 条码
				field = new String[] { "barCode", "newCostPrice" };
			}
			GoodsSelectImportVo<GoodsSelectByCostPrice> vo = goodsSelectImportComponent.importSelectGoods(fileName, is,
					field, new GoodsSelectByCostPrice(), branchId, user.getId(), type,
					"/cost/costAdjust/downloadErrorFile", new GoodsSelectImportBusinessValid() {

				@Override
				public void formatter(List<? extends GoodsSelect> list,
						List<net.sf.json.JSONObject> excelListSuccessData,
						List<net.sf.json.JSONObject> excelListErrorData) {
					for (GoodsSelect objGoods : list) {
						GoodsSelectByCostPrice obj = (GoodsSelectByCostPrice) objGoods;
						BigDecimal newCostprice = obj.getNewCostPrice();
						if (newCostprice == null) {
							obj.setNewCostPrice(obj.getCostPrice());
						}
					}
				}

				@Override
				public void errorDataFormatter(List<net.sf.json.JSONObject> list) {

				}

				@Override
				public void businessValid(List<net.sf.json.JSONObject> excelListSuccessData, String[] excelField) {

				}

			}, null);
			respJson.put("importInfo", vo);
        } catch (BusinessException e) {
            respJson = RespJson.error(e.getMessage());
		} catch (IOException e) {
			respJson = RespJson.error("读取Excel流异常");
			LOG.error("读取Excel流异常:", e);
		} catch (Exception e) {
			respJson = RespJson.error("导入发生异常");
			LOG.error("用户导入异常:", e);
		}
		return respJson;
	}

	/**
	 * @Description: 导出调价单模板
	 * @param response
	 * @param type
	 * @author lijy02
	 * @date 2016年10月10日
	 */
	@RequestMapping(value = "exportTemp")
	public void exportTemp(HttpServletResponse response, Integer type) {
		LOG.debug("CostAdjustController:" + type);
		try {
			// 导出文件名称，不包括后缀名
			String fileName = "商品价签货号导入模板";
			// 模板名称，包括后缀名
			String templateName = ExportExcelConstant.SKUCODE_TEMPLE;
			if (Constant.ZERO == type) {
				templateName = ExportExcelConstant.SKUCODE_TEMPLE;
				fileName = "商品价签货号导入模板";
			} else {
				templateName = ExportExcelConstant.BARCODE_TEMPLE;
				fileName = "商品价签条码导入模板";
			}
			// 导出Excel
			exportListForXLSX(response, null, fileName, templateName);
		} catch (Exception e) {
			LOG.error("成本调价单导入模版下载失败:", e);
		}
	}

    /**
     * @Description: 下载机构二维码
     * @param response
     * @param branchId   
     * @return void  
     * @throws
     * @author yangyq02
     * @date 2017年11月17日
     */
    @RequestMapping(value = "downBranchQrCode")
    public void downQrCode(HttpServletResponse response,String branchId,String branchCode) {
        try {
        	Branches branches=null;
        	if(StringUtils.isEmpty(branchId)&& StringUtils.isNotEmpty(branchCode)){
        		//查询机构ID
        		branches=branchesService.getBranchInfoByCode(branchCode);
        	}else if(StringUtils.isNotEmpty(branchId)&&! this.getCurrBranchId().equals(branchId)){
        		branches=branchesService.getBranchInfoById(branchId);
        	}
            String info = MessageFormat.format(qrCodeUrl + "?type=1&branchId={0}",branches==null? this.getCurrBranchId():branches.getBranchId());
            BufferedImage bufferedImage = com.okdeer.jxc.controller.print.QRCodeUtil.encoderQRCoder(info, 1000, 1000,200,200);
            response.setContentType("image/jpeg");
            response.setHeader("content-disposition", "attachment;filename="
                    + URLEncoder.encode((branches==null?this.getCurrBranchName():branches.getBranchName())+"店铺二维码.png", "UTF-8"));

            ImageIO.write(bufferedImage, "png", response.getOutputStream());
        } catch (Exception e) {
            LOG.error("店铺二维码信息生成失败:", e);
        }
    }
}
