package com.okdeer.jxc.controller.component;  

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 
 * ClassName: ErrorDialogController 
 * @Description: TODO
 * @author zhangq
 * @date 2017年3月17日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("component/dialog")
public class DialogController {
	/**
	 * 
	 * @Description: 错误对话框
	 * @return String  
	 * @author zhangq
	 * @date 2017年3月17日
	 */
	@RequestMapping(value = "error")
	public String toErrorDialog(){
		return "component/publicErrorDialog";
	}

	/**
	 * 
	 * @Description: GPE设置窗口
	 * @return String  
	 * @author zhangq
	 * @date 2017年11月9日
	 */
    @RequestMapping(value = "gpeSettingDialog")
    public String gpeSetting(){
        return "component/publicGpeSetting";
    }
	
    /**
     * 
     * @Description: GPE导出窗口
     * @return String  
     * @author zhangq
     * @date 2017年11月9日
     */
    @RequestMapping(value = "gpeExportDialog")
    public String gpeExport(){
    	return "component/publicGpeExport";
    }
}
