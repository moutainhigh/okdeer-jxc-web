/**
 * Created by huangj02 on 2016/8/5.
 */
//日期控件
function myformatter(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
function myparser(s){
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}
/**
 * 动态编辑表格数据转换
 * 可编辑的表格提交时，转换数组成键值对对象，方便后台对接与验证
 * @param list 数据对象
 * @param listName 与后台接口对应的参数名称
 * @returns {___anonymous624_625}
 */
function tableArrayFormatter(list,listName){
	var result={};
	listName = listName ? listName : 'list';
	if(list && list.length){
		for(var i=0;i<list.length;i++){
			var obj = list[i];
			for(var attr in obj){
				var resultAttrName = listName + "[" + i + "]." + attr ;
				result[resultAttrName] = obj[attr];
			}
		}
		return result;
	}
}

/**
 * Created by xiaoj02 on 2016/08/15.
 */
$.fn.serializeObject=function(){  
    var serializeObj={};  
    var array=this.serializeArray();  
    $(array).each(function(){  
        if(serializeObj[this.name]){  
            if($.isArray(serializeObj[this.name])){  
                serializeObj[this.name].push(this.value);  
            }else{  
                serializeObj[this.name]=[serializeObj[this.name],this.value];  
            }  
        }else{  
            serializeObj[this.name]=this.value;   
        }  
    });  
    return serializeObj;  
};

/**
 * Created by zhanghuan on 2016/08/10.
 * 日期范围工具类
 */
var dateUtil = {
    /**
     * 添加开始时间
     */
    addStartTime:function(date){
        var result = new Date(date);
        var newResult = result.getFullYear() + "-" + this.parseDate(result.getMonth() + 1) + "-" + this.parseDate(result.getDate())+" 00:00";
        return new Date(newResult);
    },
    /**
     * 添加结束时间
     */
    addEndTime:function(date){
        var result = new Date(date);
        var newResult = result.getFullYear() + "-" + this.parseDate(result.getMonth() + 1) + "-" + this.parseDate(result.getDate())+" 23:59";
        return new Date(newResult);
    },
    /**
     * 获取系统当前时间
     * @returns {Date}
     */
    getCurrentDate:function () {
        return new Date();
    },
    getCurrentDateTime:function () {
    	 var result = new Date();
         var newResult = result.getFullYear() + "-" + this.parseDate(result.getMonth() + 1) + "-" + this.parseDate(result.getDate())+" 16:00";
         return new Date(newResult);
    },
    /**
     * 获取系统当前时间显示值，默认格式yyyy-MM-dd
     * @returns {string}
     */
    getCurrentDateStr:function (fmt) {
    	
    	//默认时间格式化
    	if(!fmt){
    		fmt = "yyyy-MM-dd hh:mm";
    	}
    	var d = this.getCurrentDate();
    	return dateUtil.addEndTime(d).format(fmt);
    },
    
    /**
     * 获取系统当前时间显示值，默认格式yyyy-MM-dd
     * @returns {string}
     */
    getCurrentDateDay:function (fmt) {
    	
    	//默认时间格式化
    	if(!fmt){
    		fmt = "yyyy-MM-dd";
    	}
    	var d = this.getCurrentDate();
    	return dateUtil.addEndTime(d).format(fmt);
    },
    
    /**
     * 获取当前日期前面几天或者后面几天
     * @returns {string}
     */
    getCurrDayPreOrNextDay:function(flag,dayParamater){
        var d = this.getCurrentDate();
        if(flag == "prev"){  //前面几天
            //当前日期的毫秒数 - 天数 * 一天的毫秒数
            var n = d.getTime() - dayParamater * 24 * 60 * 60 * 1000;
        }else if(flag == "next"){  //后面几天
            //当前日期的毫秒数 + 天数 * 一天的毫秒数
            var n = d.getTime() + dayParamater * 24 * 60 * 60 * 1000;
        }
        var result = new Date(n);
        return result.getFullYear() + "-" + this.parseDate(result.getMonth() + 1) + "-" + this.parseDate(result.getDate());
    },
    
    /**
     * 获取上一个月
     * @returns {Date}
     */
    getPreMonthDate:function(){
    	var d = this.getCurrentDate();
    	d.setMonth(d.getMonth()-1);
    	//bug20313
    	//d.setDate(d.getDate()+1);
    	return d;
    },
    
    /**
     * 获取当前日期前面几天或者后面几天，默认格式yyyy-MM-dd
     * @returns {String}
     */
    getPreMonthDateStr:function(fmt){
    	//默认时间格式化
    	if(!fmt){
    		fmt = "yyyy-MM-dd hh:mm";
    	}
    	var d = this.getPreMonthDate();
    	return dateUtil.addStartTime(d).format(fmt);
    },
    
    /***
     * 获得本周起止时间
     */
    getCurrentWeek:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //返回date是一周中的某一天
        var week = currentDate.getDay();
        //返回date是一个月中的某一天
        var month = currentDate.getDate();

        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //减去的天数
        var minusDay = week != 0 ? week - 1 : 6;
        //alert(minusDay);
        //本周 周一
        var monday = new Date(currentDate.getTime() - (minusDay * millisecond));
        //本周 周日
        var sunday = new Date(monday.getTime() + (6 * millisecond));
        //添加本周时间
        startStop.push(monday); //本周起始时间
        //添加本周最后一天时间
        startStop.push(sunday); //本周终止时间
        //返回
        return startStop;
    },
    /**
     * 获得上一周的起止日期
     * **/
    getPreviousWeek:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //返回date是一周中的某一天
        var week = currentDate.getDay();
        //返回date是一个月中的某一天
        var month = currentDate.getDate();
        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //减去的天数
        var minusDay = week != 0 ? week - 1 : 6;
        //获得当前周的第一天
        var currentWeekDayOne = new Date(currentDate.getTime() - (millisecond * minusDay));
        //上周最后一天即本周开始的前一天
        var priorWeekLastDay = new Date(currentWeekDayOne.getTime() - millisecond);
        //上周的第一天
        var priorWeekFirstDay = new Date(priorWeekLastDay.getTime() - (millisecond * 6));

        //添加至数组
        startStop.push(priorWeekFirstDay);
        startStop.push(priorWeekLastDay);

        return startStop;
    },
    /***
     * 获得本月的起止时间
     */
    getCurrentMonth:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //求出本月第一天
        var firstDay = new Date(currentYear, currentMonth, 1);


        //当为12月的时候年份需要加1
        //月份需要更新为0 也就是下一年的第一个月
        if (currentMonth == 11) {
            currentYear++;
            currentMonth = 0; //就为
        } else {
            //否则只是月份增加,以便求的下一月的第一天
            currentMonth++;
        }

        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //下月的第一天
        var nextMonthDayOne = new Date(currentYear, currentMonth, 1);
        //求出上月的最后一天
        var lastDay = new Date(nextMonthDayOne.getTime() - millisecond);

        //添加至数组中返回
        startStop.push(firstDay);
        startStop.push(lastDay);
        //返回
        return startStop;
    },
    /**
     * 返回上一个月的第一天Date类型
     * @param year 年
     * @param month 月
     **/
    getPriorMonthFirstDay:function (year, month) {
        //年份为0代表,是本年的第一月,所以不能减
        if (month == 0) {
            month = 11; //月份为上年的最后月份
            year--; //年份减1
            return new Date(year, month, 1);
        }
        //否则,只减去月份
        month--;
        return new Date(year, month, 1); ;
    },
    /**
     * 获得上一月的起止日期
     * ***/
    getPreviousMonth:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //获得上一个月的第一天
        var priorMonthFirstDay = this.getPriorMonthFirstDay(currentYear, currentMonth);
        //获得上一月的最后一天
        var priorMonthLastDay = new Date(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth(), this.getMonthDays(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth()));
        //添加至数组
        startStop.push(priorMonthFirstDay);
        startStop.push(priorMonthLastDay);
        //返回
        return startStop;
    },
    /**
     * 获得该月的天数
     * @param year年份
     * @param month月份
     * */
    getMonthDays:function (year, month) {
        //本月第一天 1-31
        var relativeDate = new Date(year, month, 1);
        //获得当前月份0-11
        var relativeMonth = relativeDate.getMonth();
        //获得当前年份4位年
        var relativeYear = relativeDate.getFullYear();

        //当为12月的时候年份需要加1
        //月份需要更新为0 也就是下一年的第一个月
        if (relativeMonth == 11) {
            relativeYear++;
            relativeMonth = 0;
        } else {
            //否则只是月份增加,以便求的下一月的第一天
            relativeMonth++;
        }
        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //下月的第一天
        var nextMonthDayOne = new Date(relativeYear, relativeMonth, 1);
        //返回得到上月的最后一天,也就是本月总天数
        return new Date(nextMonthDayOne.getTime() - millisecond).getDate();
    },
    /**
     * 得到本季度开始的月份
     * @param month 需要计算的月份
     ***/
    getQuarterSeasonStartMonth:function (month) {
        var quarterMonthStart = 0;
        var spring = 0; //春
        var summer = 3; //夏
        var fall = 6;   //秋
        var winter = 9; //冬
        //月份从0-11
        if (month < 3) {
            return spring;
        }

        if (month < 6) {
            return summer;
        }

        if (month < 9) {
            return fall;
        }

        return winter;
    },
    /**
     * 获得本季度的起止日期
     */
    getCurrentSeason:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //获得本季度开始月份
        var quarterSeasonStartMonth = this.getQuarterSeasonStartMonth(currentMonth);
        //获得本季度结束月份
        var quarterSeasonEndMonth = quarterSeasonStartMonth + 2;

        //获得本季度开始的日期
        var quarterSeasonStartDate = new Date(currentYear, quarterSeasonStartMonth, 1);
        //获得本季度结束的日期
        var quarterSeasonEndDate = new Date(currentYear, quarterSeasonEndMonth, this.getMonthDays(currentYear, quarterSeasonEndMonth));
        //加入数组返回
        startStop.push(quarterSeasonStartDate);
        startStop.push(quarterSeasonEndDate);
        //返回
        return startStop;
    },
    /**
     * 得到上季度的起始日期
     * year 这个年应该是运算后得到的当前本季度的年份
     * month 这个应该是运算后得到的当前季度的开始月份
     * */
    getPriorSeasonFirstDay:function (year, month) {
        var quarterMonthStart = 0;
        var spring = 0; //春 0,1,2
        var summer = 3; //夏 3,4,5
        var fall = 6;   //秋 6,7,8
        var winter = 9; //冬 9,10,11
        //月份从0-11
        switch (month) {//季度的其实月份
            case 0:
            case 1:
            case 2:
                //如果是第一季度则应该到去年的冬季
                year--;
                month = winter;
                break;
            case 3:
            case 4:
            case 5:
                month = spring;
                break;
            case 6:
            case 7:
            case 8:
                month = summer;
                break;
            case 9:
            case 10:
            case 11:
                month = fall;
                break;

        };

        return new Date(year, month, 1);
    },
    /**
     * 得到上季度的起止日期
     * **/
    getPreviousSeason:function(){
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //上季度的第一天
        var priorSeasonFirstDay = this.getPriorSeasonFirstDay(currentYear, currentMonth);
        //上季度的最后一天
        var priorSeasonLastDay = new Date(priorSeasonFirstDay.getFullYear(), priorSeasonFirstDay.getMonth() +2, this.getMonthDays(priorSeasonFirstDay.getFullYear(), priorSeasonFirstDay.getMonth() +2));
        //添加至数组
        startStop.push(priorSeasonFirstDay);
        startStop.push(priorSeasonLastDay);
        return startStop;
    },
    /***
     * 得到本年的起止日期
     *
     */
    getCurrentYear:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();

        //本年第一天
        var currentYearFirstDate = new Date(currentYear, 0, 1);
        //本年最后一天
        var currentYearLastDate = new Date(currentYear, 11, 31);
        //添加至数组
        startStop.push(currentYearFirstDate);
        startStop.push(currentYearLastDate);
        //返回
        return startStop;
    },
    
    /***
     * 得到本年的第一天
     *
     */
    getCurrentYearFirstDate:function () {
    	var currentYearFirstDate = this.getCurrentYear()[0];
        
        return currentYearFirstDate;
    },
    
    /***
     * 得到本年的最后一天
     *
     */
    getCurrentYearLastDate:function () {
    	var currentYearLastDate = this.getCurrentYear()[1];
        
        return currentYearLastDate;
    },
    
    /**
     * //如果数据小于10.加一个0
     * @param date
     * @returns {*}
     */
    parseDate:function(date) {
        if (date < 10) {
            date = '0' + date;
        }
        return date;
    },

    compareDate:function (startDate,endDate) {
        var d1 = new Date(startDate.replace(/\-/g, "\/"));
        var d2 = new Date(endDate.replace(/\-/g, "\/"));

        if(startDate!=""&&endDate!=""&&d1 >d2)
        {
            return true;
        }
        return false;
    }

}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
/*
 调用：
 var time1 = new Date().format("yyyy-MM-dd");
 var time2 = new Date().format("yyyy-MM-dd HH:mm:ss");
 */
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//两种调用方式
//var template1="我是{0}，今年{1}了";
//var template2="我是{name}，今年{age}了";
//var result1=template1.format("loogn",22);
//var result2=template2.format({name:"loogn",age:22});
//两个结果都是"我是loogn，今年22了"
//字符串格式化
String.prototype.format = function(args) {
  var result = this;
  if (arguments.length > 0) {    
      if (arguments.length == 1 && typeof (args) == "object") {
          for (var key in args) {
              if(args[key]!=undefined){
                  var reg = new RegExp("({" + key + "})", "g");
                  result = result.replace(reg, args[key]);
              }
          }
      }
      else {
          for (var i = 0; i < arguments.length; i++) {
              if (arguments[i] != undefined) {
                  var reg = new RegExp("({[" + i + "]})", "g");
                  result = result.replace(reg, arguments[i]);
              }
          }
      }
  }
  return result;
}

String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
}  

String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}

/**
* 是否选择行数据
*/
function rowIsNull(row) {
	if (row) {
		return false;
	} else {
		$.messager.show({
			title : "提示",
			msg : "请选择一条数据！",
			position : "topCenter",
			timeout : 1500,
			showType : 'slide',
          style:{
      		right:'',
      		top:document.body.scrollTop+document.documentElement.scrollTop+50,
      		bottom:''
      	}
		});
		return true;
	}
}


/**
* ajax返回提示
* @param data    返回的数据
* @param dg datagrid
* @param d    弹窗
* @returns {Boolean} ajax是否成功
*/
function successTip(data, dg, d) {
  if (data == 'success') {
      $.messager.show({
          title: "提示",
          msg: "操作成功！",
          position: "topCenter",
          timeout: 1500,
          showType: 'show',
          style:{
      		right:'',
      		top:document.body.scrollTop+document.documentElement.scrollTop+50,
      		bottom:''
      	}
      });
      if (dg != null) {
          dg.datagrid('reload');
      }
      if (d != null) {
          d.panel('close');
      }
      return true;
  } else {
      $.messager.show({
          title: "提示",
          msg: data,
          position: "topCenter",
          timeout: 1500,
          showType: 'slide',
          style:{
      		right:'',
      		top:document.body.scrollTop+document.documentElement.scrollTop+50,
      		bottom:''
      	}
      });
      return false;
  }
}

/**
 * 弹出框
 * @param data 提示信息
 * @param refreshDgMethod 刷新datagrid方法名称
 * @param closeDMethod 关闭窗口方法名称
 * @returns {Boolean}
 */
function alertTip(data, refreshDgMethod, closeDMethod) {
	  if (data == 'success') {
	      $.messager.show({
	          title: "提示",
	          msg: "操作成功！",
	          position: "topCenter",
	          timeout: 1500,
	          showType: 'show',
	          style:{
	      		right:'',
	      		top:document.body.scrollTop+document.documentElement.scrollTop+50,
	      		bottom:''
	      	}
	      });
	      if (refreshDgMethod) {
	    	  refreshDgMethod();
	      }
	      if (closeDMethod) {
	    	  closeDMethod();
	      }
	      return true;
	  } else {
	      $.messager.show({
	          title: "提示",
	          msg: data,
	          position: "topCenter",
	          timeout: 1500,
	          showType: 'slide',
	          style:{
	      		right:'',
	      		top:document.body.scrollTop+document.documentElement.scrollTop+50,
	      		bottom:''
	      	}
	      });
	      return false;
	  }
	}

/**
* ajax返回提示
* @param data    返回的数据
* @param dg datagrid
* @param d    弹窗
* @returns {Boolean} ajax是否成功
*/
function showMsgExt(data, dg, d) {
  if (data.status == 0) {
      $.messager.show({
          title: "提示",
          msg: data.msg,
          position: "topCenter",
          timeout: 1500,
          showType: 'slide',
          style:{
      		right:'',
      		top:document.body.scrollTop+document.documentElement.scrollTop+50,
      		bottom:''
      	}
      });
      if (dg != null) {
          dg.datagrid('reload');
      }
      if (d != null) {
          d.panel('close');
      }
      return true;
  } else {
      $.messager.alert("提示", data.msg,"error");
      return false;
  }
}

/**
* ajax返回提示
* @param data    返回的数据
* @param  datagrid id
* @param d 弹窗id
* @returns {Boolean} ajax是否成功
*/
function successTipTwo(data, dg, d) {
  if (data == 'success') {
      if (dg != null)
          $(dg).datagrid('reload');
      if (d != null)
          $(d).panel('close');
      $.messager.show({
          title: "提示",
          msg: "操作成功！",
          position: "topCenter",
          timeout: 1500,
          showType: 'slide'
      });
      return true;
  } else {
      $.messager.show({
          title: "提示",
          msg: data,
          position: "topCenter",
          timeout: 1500,
          showType: 'slide'
      });
      return false;
  }
}

/**
* 提写公共的show方法
*
* @param title 标题
* @param icon 图标 info error 默认info
* @param msg 消息
* @param position 显示位置 默认topCenter
* @author wangfan 2015.07.28
*/
function psmaMessageShowFour(title, icon, msg, position) {
  $.messager.show({
      title: title,
      icon: icon,
      msg: msg,
      position: position,
      timeout: 1500,
      showType: 'slide'
  });
}
/**
* 提写公共的show方法
*
* @param msg 消息
* @author wangfan 2015.07.28
*/
function psmaMessageShowOne(msg) {
  $.messager.show({
      title: "提示",
      msg: msg,
      position: "topCenter",
      timeout: 1500,
      showType: 'slide'
  });
}
/**
* 提写公共的show方法
*
* @param title 标题
* @param msg 消息
* @author wangfan 2015.07.28
*/
function psmaMessageShowTwo(title, msg) {
  $.messager.show({
      title: title,
      msg: msg,
      position: "topCenter",
      timeout: 1500,
      showType: 'slide'
  });
}
/**
* 提写公共的show方法
*
* @param title 标题
* @param msg 消息
* @param position 显示位置
* @author wangfan 2015.07.28
*/
function psmaMessageShowThree(title, msg, position) {
  $.messager.show({
      title: title,
      msg: msg,
      position: position,
      timeout: 1500,
      showType: 'slide'
  });
}

$.fn.serializeObject=function(){  
  var serializeObj={};  
  var array=this.serializeArray();  
  var str=this.serialize();  
  $(array).each(function(){  
      if(serializeObj[this.name]){  
          if($.isArray(serializeObj[this.name])){  
              serializeObj[this.name].push(this.value);  
          }else{  
              serializeObj[this.name]=[serializeObj[this.name],this.value];  
          }  
      }else{  
          serializeObj[this.name]=this.value;   
      }  
  });  
  return serializeObj;  
};

//frame元素新增tab页
function addTabForTop(subtitle, url){
	window.top.addTab(subtitle, url, null);
}

//frame元素新增tab页
function addTabForTop(subtitle, url, icon){
	window.top.addTab(subtitle, url, icon);
}

//根据标题选择tab页
function selectTab(subtitle){
	window.top.selectTab(subtitle);
}

//frame元素刷新tab页
function refreshTabForTop(subtitle){
	window.top.refluseTabByTitle(subtitle);
}

//刷新当前tab
function refreshCurrTab(){
	$('#mm-tabupdate').click();
}

//关闭tab页
function closeCurrTab(){
	window.top.closeTab();
}

//获取tab页
function getTab(subtitle){
	return window.top.getTabByTitle(subtitle);
}

//子页面处理刷新父页面列表,关闭子页面
function refreshParentTab(parentTitle, currTitle){
	var parentTab = getTab(parentTitle);
	selectTab(parentTitle);
	var parentFrame = parentTab.find('iframe')[0].contentWindow
	parentFrame.refreshDataGrid();
	if(currTitle){
		window.top.closeTab(currTitle);
	}
};

/**
 * 获取链接参数
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function isEmptyArray(array) {
	if(array && array.length >= 0){
		return false;
	}
	return true;
}

/**
 * 保留两位小数
 * @param decimal
 * @returns
 */
function formatTwoDecimal(decimal){
	if(decimal !== null && decimal !== '' && decimal !== undefined && !isNaN(decimal)){
		return parseFloat(decimal).toFixed(2);
	}
	return decimal;
}

function getTwoDecimalB(decimal){
	if(decimal == null || decimal === '' || decimal == undefined){
		return null;
	}
	return '<b>'+formatTwoDecimal(decimal)+'</b>';
}

function getPriceFmtB(decimal){
	return '<b>' + parseFloat(decimal || 0).toFixed(2) + '</b>';
}

/**
 * 格式化日期，返回格式化后的字符串
 * @param dateValue Date值
 * @param pattern 格式，默认为 yyyy-MM-dd hh:mm:ss
 * @returns
 */
function formatDate(dateValue, pattern){
	if(!pattern){
		pattern = 'yyyy-MM-dd hh:mm:ss';
	}
	if(dateValue){
		return new Date(dateValue).format(pattern);
	}
	return dateValue;
}
/**
 * 日期月份选择
 * @param dateValue Month值
 * @param pattern 格式，默认为 yyyy-MM
 * @returns
 */
function selectMonth(){  
    WdatePicker({ dateFmt:'yyyy-MM', isShowToday: false, isShowClear: false });  
}  



/*----------------jxc util  ---------------------------*/

/*----------------jxc component js start  ---------------------------*/
var $_jxc = {
	/**
	 * bwp 07/07/13
	 * 数字金额最大值
	 */
	MAXNUMBER:999999.99,
	/**
	 * bwp 07/08/02
	 * 校验输入字符 非数字字符 返回 ''
	 */
	checkNUM:function(obj){
		if(obj.value != '' &&  isNaN(obj.value)){
			obj.value = '';
		}
	},	
	/**
	 * bwp 07/06/07
	 * 进销存机构类型枚举对象(参照后台BranchesTypeEnum.java类设置)
	 * @returns
	 * <br/>demo
	 * <br/>$_jxc.branchTypeEnum.HEAD_QUARTERS
	 * branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B + ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_C
	 */	
	branchTypeEnum:{
		HEAD_QUARTERS:0,     //总部
		BRANCH_COMPANY:1,    //分公司
		LOGISTICS:2,         //物流中心
		OWN_STORES:3,        //自营店
		FRANCHISE_STORE_B:4, //加盟店
		FRANCHISE_STORE_C:5  //加盟店 
	},
	
	/**
	 * bwp 07/05/24
	 * alert 提示组件
	 * @param msg   提示信息
	 * @param title 提示标题 可以不传
	 * @param cb    回调 可以不传
	 * @returns
	 * <br/>demo: $_jxc.alert('处理失败',function(){})
	 */
	alert:function(msg,cb,title,icon){
	    $(this).removeClass("panel-tool");
        // $(".panel-tool-close").css("display","none");
		if (msg == 'success') msg = '操作成功';
		$.messager.alert("",msg,icon||"info",function(){
			if (typeof cb == 'function') {
		    	cb();
            }
		});
	},
	/**
	 * bwp 07/05/26
	 * confirm 提示组件
	 * @param msg   提示信息
	 * @param cb    回调事件
	 * @param title 提示标题 可以不传
	 * @returns
	 * <br/>demo:
	 * <br/> $_jxc.confirm('是否删除？',function(r){
	 * 	    	if(r){
	 * 				alert('您选择了确认')	
	 * 			}
	 * 		})
	 */
	confirm:function(msg,cb,title){
		$.messager.confirm(title||'确认',msg||'',function(r){    
		    if (typeof cb == 'function') {
		    	cb(r);
            }
		});  
	},
	
	/**
	 * bwp 07/07/06
	 * dialog组件封装
	 * http://www.jeasyui.com/documentation/index.php
	 * @param param   参数对象 请阅读easyui文档 
	 * @returns
	 * <br/>demo:
	 * $_jxc.dialog({
	 *    target:''
	 * 	  title: 'My Dialog',
	 *    href:'xxxx/xxx/xxx',
	 *    buttons:[{
				text:'保存',
				handler:function(){...}
			},{
				text:'关闭',
				handler:function(){...}
			}]
	 * })
	 */
	dialog:function(param){
		var _dialog_param = {
			title: 'My Dialog',    
		    width: 200,    
		    height: 200,    
		    closed: false,//定义是否在初始化的时候关闭面板。
		    cache: false, //True to cache the panel content that loaded from href.
		    modal: true, //定义是否将窗体显示为模式化窗口。
		    onClose:function(){
		    	if(param && param.target){
		    		
		    	}else{
		    		$(_dialogObj).panel('destroy');
		    		_dialogObj = null;
		    	}
		    },
		}
		
		_dialog_param = $.extend(_dialog_param,param)
		
		var _dialogObj = $(_dialog_param.target || '<div />').dialog(_dialog_param);
		return _dialogObj;
		
	},
	
	/**
	 * bwp 07/05/26
	 * 对ajax请求做了封装，统一项目的ajax请求。
	 * @namespace jQuery扩展封装
	 * @param params 对ajax变动频繁的参数 以对象方式入参 {url:'abc',type:'POST',dataType:'json'}
	 * @param {successCb} 成功回调 必传 
	 * @param {errorCb} 错误回调 不传的话安装默认方式处理
	 * <br/>demo:
	 * <br/>$_jxc.ajax({
	    	url:contextPath + '/settle/supplierChain'
	    },function(result){
	    	
	    },function(err){
	    	
	    })
	 */
	ajax:function(params, successCb, errorCb,$btns){
		gFunStartLoading();
		if ($btns){
			$btns.forEach(function(btnObj,index){
				$(btnObj).prop("disabled","disabled");
                $(btnObj).prop("readOnly","readOnly");
                $(btnObj).addClass('uinp-no-more');
			})
        }
		//ajax参数
		var defaultParams = {
            type: 'POST',
            dataType: 'JSON',
		}
		
		defaultParams = $.extend(defaultParams,params);
		
		//成功回调
		defaultParams['success'] = function(result){
			gFunEndLoading();
			if ($btns){
    			$btns.forEach(function(btnObj,index){
    				$(btnObj).removeProp("disabled");
    			})
            }
			if (typeof successCb == 'function') {
				successCb(result);
            }
		}
		//错误回调
		defaultParams['error'] = function(err){
			gFunEndLoading();
			if ($btns){
    			$btns.forEach(function(btnObj,index){
    				$(btnObj).removeProp("disabled");
    			})
            }
			if (typeof errorCb == 'function') {
				errorCb(err);
            }else{
            	$_jxc.alert("请求发送失败或服务器处理失败");
            }
		}
		
		//异步之前
		defaultParams['beforeSend'] = function(XHR){
			var sts = new Date().getTime();
            //url = url ? (url.indexOf('?')>-1 ? url + '&_t='+ sts : url + '?_t='+sts):url
		}
		defaultParams['complete'] = function() {
            // Handle the complete event
        }
		
		$.ajax(defaultParams);
	},

	isStringNull:function (str) {
        if(str == null || typeof str == 'undefined') return true;
        str = str.toString();
        if(!str) return true;
        if(str.trim() == "") return true;
        if (str.length == 0) return true;
        if (str.replace(/(^s*)|(s*$)/g, "").length ==0) return true;
        return false;
	},
	
	/**
	 * bwp 07/06/05
	 * 对可输入的 机构 供应商 或者制单人这类可以输入又可以弹窗选择的输入表单 编辑表单时选择处理情况hidden表单的值
	 * <br/>例如 [0001]默认供应商 注：表单dom 父元素加一个 .form-group class样式以确定作用范围
	 * @namespace 编辑表单时选择处理情况hidden表单的值 
	 * @param obj 表单对象
	 * @param domIds 而外要处理的 dom元素id值
	 * demo1:
	 * <div class='ub ub-ac'>
	 * <input class='uinp ub ub-f1' type='text' id='branchName' name='branchName' onblur='$_jxc.clearHideInpOnEdit(this)'/>
	 * </div>
	 * demo2:
	 * <div class='ub ub-ac form-group'>
	 * 	<div class='ub'>
	 * 		<input class='uinp ub ub-f1' type='text' id='branchName' name='branchName' onblur='$_jxc.clearHideInpOnEdit(this)'/>
	 * 	</div>
	 * </div>
	 */
	clearHideInpOnEdit:function(obj,domIds){
		//父元素
		var _editGroup = $(obj).closest('.form-group');
		if(_editGroup.length < 1){
			_editGroup = $(obj).parent('.ub');
		}
		//隐藏域表单
		$(_editGroup).find('input[type="hidden"]').val('');
	},
	
	/**
	 * 机构供应商自动完成交互公用方法
	 */
	autoCompleteComponent:function (){
		return {
			/**
			 * dom元素
			 */
			dom:null,
			/**
			 * 设置组件的dom元素赋值
			 */
			setDom:function(arg){
				this.dom = arg;
			},
			/**
			 * 组件参数
			 */
			param:{},
			/**
			 * 处理一些选择组件前的校验
			 * return false 结束逻辑
			 */
			onShowBefore:function(arg){
				return true;
			},
			/**
			 * 数据过滤
			 */
			loadFilter:function(data){
				
				return data;
			},
			/**
			 * dom 渲染之后
			 */
			onAfterRender:function(data){
				
			},
			/**
			 * 格式化数据 显示数据
			 */
			onLoadSuccess:function(data){
				var _component = $.data(this,'component');
				var _this = _component.dom;
				//返回NO时 输入动作没匹配到数据 
				if(data == 'NO'){
					//匹配到多数据 弹窗但未选择的情况下 设置清空
					if(!$($(_this).find('input[type="hidden"]').eq(0)).val()){
						$_jxc.clearHideInpOnEdit($(_this).find('input[type="text"]'));
						$(_this).find('input[type="text"]').val("");
					}
				}else{
					data = _component.loadFilter(data);
					_component.setDataOfDom(data,_this);
					_component.onAfterRender(data);
				}
			},
			/**
			 * 设置dom元素值
			 */
			setDataOfDom:function(data,dom){
				var _that = this;
				var _this = this.dom
				//根据name赋值
				$(_this).find('input').each(function(index,ob){
					if(ob){
						var inputName = $(ob).attr('name');
						var inputType = $(ob).attr('type');
						$(ob).val(setValue(inputName,inputType,ob))
					}
				})
				
				function setValue(inputName,type,ob){
					//多选时 返回数组
					if(data.constructor == Array){
						var _str = [];
						data.forEach(function(obj,index){
							if(type == 'text'){
								$(ob).data('oldData',_that.textFomatter(obj))
								_str.push(_that.textFomatter(obj));
							}else{
								_str.push(obj[inputName])
							}
						});
						return _str.join(',');
					}else{
						//单选返回对象
						if(type == 'text'){
							$(ob).data('oldData',_that.textFomatter(data));
							return  _that.textFomatter(data);
						}else{
							return data[inputName];
						}
					}
				}
			},
			/**
			 * 初始化事件绑定
			 */
			initDomEvent:function(){
				var _component = this;
				var _this = _component.dom[0];
				//$(this) 返回的是一个 dom 数组
				$(_this).each(function(index,elt){
					if(elt){
					    //判断输入框(有且只有一个)
						var editInput = $(elt).find('input[type="text"]');
						//是否readonly 
						var readonlyFlag = $(editInput).prop('readonly');
						//是否disabled
						var disableFlag = $(editInput).prop('disabled');
						//是否置灰
						var disableCss = $(editInput).hasClass('uinp-no-more');
						
						//置灰状态下 结束 逻辑
						if((disableCss && readonlyFlag) || disableFlag )return;
						
						//只读绑定 点击事件
						if(readonlyFlag){
							//绑定 显示 机构选择事件
							$(editInput).on('click',_component.showComponentMsg)
						}else{
							//非 只读 绑定 blur keyup 事件
							$(editInput).on('blur',_component.onblur);
							$(editInput).on('keyup',_component.onkeyup);
						}
						// 【...】 按钮绑定事件
						$(elt).find('.uinp-more').on('click',_component.showComponentMsg);
						//组件挂起
						$.data($(elt).find('.uinp-more')[0],'component',_component);
						$.data($(editInput)[0],'component',_component);
					}
				})
			},
			showComponentMsg:function(ev){
				var _component = $.data($(this)[0],'component');
				var _editInput = $(this);
				//点击【...】 按钮 
				if($(_editInput).hasClass('uinp-more')){
					_editInput = $(_editInput).parent('.ub').find('input[type="text"]');
				}
				//input置灰  则return;
				if($(_editInput).hasClass('uinp-no-more') || $(_editInput).prop('disabled'))return;
				
				//判断前置条件
				if(_component.relyOnId && !$.trim($('#'+_component.relyOnId).val())){
					$_jxc.alert(_component.relyError);
					return false;
				}
				
				//处理onShowBefore (避免用户重载 )
				if(!_component.onShowBefore(_component))return;
					
				_component.getComponentDetail();
				
			},
			//失去焦点事件
			onblur:function(ev){
				var _component = $.data($(this)[0],'component');
				var nameOrCode = $.trim($(this).val())||'';
				
				//重新编辑时 清空隐藏域 避免没选择数据就关闭窗口
				if($(this).data('oldData') && nameOrCode && $(this).data('oldData') != nameOrCode)$_jxc.clearHideInpOnEdit($(this));
				
				//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
				if(ev.keyCode && ev.keyCode != 13){
					return;
				}
				
				//未输入值时，直接返回，无需查询
				if('' == nameOrCode){
					$_jxc.clearHideInpOnEdit($(this));
					return;
				}
				
				//未发生变化 return;
				if(nameOrCode &&  $(this).data('oldData') == nameOrCode)return;
				
				//获取数据
				_component.getComponentDetail(nameOrCode);
				
			},
			//键盘事件
			onkeyup:function(ev){
				var _component = $.data($(this)[0],'component');
				var nameOrCode = $.trim($(this).val())||'';
				
				//重新编辑时 清空隐藏域 避免没选择数据就关闭窗口
				if($(this).data('oldData') && nameOrCode && $(this).data('oldData') != nameOrCode)$_jxc.clearHideInpOnEdit($(this));
				
				//非回车事件和失去焦点，不做处理(失焦时event.keyCode为undefined)
				if(ev.keyCode && ev.keyCode != 13){
					return;
				}
				
				//未输入值时，直接返回，无需查询
				if('' == nameOrCode){
					$_jxc.clearHideInpOnEdit($(this));
					return;
				}
				
				//未发生变化 return;
				if(nameOrCode && $(this).data('oldData') == nameOrCode)return;
				
				//自动失去焦点
				$(this).blur();
				
				//_default.getComponentDetail(nameOrCode);
				
			},

		}
	},
	
	/**
	 * bwp 07/08/03 过滤数据公用方法
	 * 后台返回列表数据 只有list节点 
	 * 把后台的 list 赋值给 datagrid组件必须要的 rows 参数
	 * demo:
	 * <br> $_jxc.gridLoadFilter(data);
	 */
	gridLoadFilter:function(data){
		//判断 data 非数组下执行
		if(!(data instanceof Array)) {
			//后台没有返回的rows节点情况下执行
			if(typeof data.rows == 'undefined'){
				data.rows = data.list||[];
			}
		}
		return data; 
	},
	
	/**
	 * 四舍五入
	 * @param number 
	 * @param arg  位数 例如 2：四舍五入保存2位小数
	 */
	roundx:function(number,arg){
		number = new Number(number);
		with(Math){   
	        return round(number*pow(10,arg))/pow(10,arg);   
	    }  
	}
	
}

/*----------------extend easyui  js start  -------------------------*/
//扩展jQuery easyui datagrid增加动态改变列编辑的类型
$.extend($.fn.datagrid.methods, {
    addEditor : function(jq, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(jq).datagrid('getColumnOption', item.field);
                e.editor = item.editor;
            });
        } else {
            var e = $(jq).datagrid('getColumnOption', param.field);
            e.editor = param.editor;
        }
    },
    removeEditor : function(jq, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(jq).datagrid('getColumnOption', item);
                e.editor = {};
            });
        } else {
            var e = $(jq).datagrid('getColumnOption', param);
            e.editor = {};
        }
    }
}); 

$.extend($.fn.datagrid.defaults.editors, {
	numberspinner: {
		init: function(container, options){
			var input = $('<input type="text">').appendTo(container);
			return input.numberspinner(options);
		},
		destroy: function(target){
			$(target).numberspinner('destroy');
		},
		getValue: function(target){
			return $(target).numberspinner('getValue');
		},
		setValue: function(target, value){
			$(target).numberspinner('setValue',value);
		},
		resize: function(target, width){
			$(target).numberspinner('resize',width);
		}
	}
});

$.extend($.fn.datagrid.defaults.editors, {
	datebox: {
		init: function(container, options){
			var input = $('<input type="text">').appendTo(container);
			return input.datebox(options);
		},
		destroy: function(target){
			$(target).datebox('destroy');
		},
		getValue: function(target){
			return $(target).datebox('getValue');
		},
		setValue: function(target, value){
			$(target).datebox('setValue',value);
		},
		resize: function(target, width){
			$(target).datebox('resize',width);
		}
	}
});

//重写 datarid 默认的 loadFilter 函数  2.7
$.extend($.fn.datagrid.defaults, {
	loadFilter:function(data){
		return $_jxc.gridLoadFilter(data);
	}
});


//表单验证
$.extend($.fn.validatebox.defaults.rules, {
    idcard: {// 验证身份证
        validator: function (value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    maxLength:{
        validator: function(value, param){
            return value.length <= param[0];
        },
        message: '最大只能输入{0}个字符'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少（2）个字符.'
    },
    maxLength:{
        validator: function(value, param){
            return value.length <= param[0];
        },
        message: '最大只能输入{0}个字符'
    },
    leng: {
        validator: function (value, param) {
            return value.length == param[0];
        },
        message: '请输入{0}个字符.'
    },
    length: { validator: function (value, param) {
	        var len = $.trim(value).length;
	        return len >= param[0] && len <= param[1];
    	},
        message: "输入内容长度必须介于{0}和{1}之间."
    },
    phone: {// 验证电话号码
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-88888888'
    },
    mobile: {// 验证手机号码
        validator: function (value) {
        	return /^1\d{10}$/i.test(value);
        },
        message: '手机号码格式不正确'
    },
    intOrFloat: {// 验证整数或小数
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    intNum: {// 验证整数
        validator: function (value) {
            return /^\d+(\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    currency: {// 验证货币
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    qq: {// 验证QQ,从10000开始
        validator: function (value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    integer: {// 验证整数 可正负数
        validator: function (value) {
            //return /^[+]?[1-9]+\d*$/i.test(value);
            return /^([+]?[0-9])|([-]?[0-9])+\d*$/i.test(value);
        },
        message: '请输入整数'
    },
    age: {// 验证年龄
        validator: function (value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
        },
        message: '年龄必须是0到120之间的整数'
    },

    chinese: {// 验证中文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符
        validator: function (value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno: {// 验证传真
        validator: function (value) {
            //            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '传真号码不正确'
    },
    zip: {// 验证邮政编码
        validator: function (value) {
            return /^[1-9]\d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    ip: {// 验证IP地址
        validator: function (value) {
            //return /^((1?\d?\d|(2([0-4]\d|5[0-5])))\.){3}(1?\d?\d|(2([0-4]\d|5[0-5])))$/.test(value);
        	 var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/   
             return re.test(value);   
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    date: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            //格式yyyy-MM-dd或yyyy-M-d
            return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
        },
        message: '清输入合适的日期格式'
    },
    msn: {
        validator: function (value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    },
    same: {
        validator: function (value, param) {
            if ($("#" + param[0]).val() != "" && value != "") {
                return $("#" + param[0]).val() == value;
            } else {
                return true;
            }
        },
        message: '两次输入的密码不一致！'
    },
    port: {
        validator: function (value, param) {
            var parten=/^(\d)+$/g;
            if(parten.test(value)&&parseInt(value)<=65535&&parseInt(value)>=0){
                return true;
            }else{
                return false;
            }
        },
        message: '端口在0到65535之间！'
    }
});
/*----------------extend easyui  js start  ------------------------*/

/*----------------jxc component js end  ---------------------------*/

//表头拖动
$.extend($.fn.datagrid.methods, {
    columnMoving: function (jq) {
        return jq.each(function () {
            var target = this;
            var cells = $(this).datagrid('getPanel').find('div.datagrid-header td[field]');
            cells.draggable({
                revert: true,
                cursor: 'pointer',
                edge: 5,
                proxy: function (source) {
                    var p = $('<div class="tree-node-proxy tree-dnd-no" style="position:absolute;border:1px solid #ff0000"/>').appendTo('body');
                    p.html($(source).text());
                    p.hide();
                    return p;
                },
                onBeforeDrag: function (e) {
                    e.data.startLeft = $(this).offset().left;
                    e.data.startTop = $(this).offset().top;
                },
                onStartDrag: function () {
                    $(this).draggable('proxy').css({
                        left: -10000,
                        top: -10000
                    });
                },
                onDrag: function (e) {
                    $(this).draggable('proxy').show().css({
                        left: e.pageX + 15,
                        top: e.pageY + 15
                    });
                    return false;
                }
            }).droppable({
                accept: 'td[field]',
                onDragOver: function (e, source) {
                    $(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
                    $(this).css('border-left', '1px solid #ff0000');
                },
                onDragLeave: function (e, source) {
                    $(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
                    $(this).css('border-left', 0);
                },
                onDrop: function (e, source) {
                    $(this).css('border-left', 0);
                    var fromField = $(source).attr('field');
                    var toField = $(this).attr('field');
                    setTimeout(function () {
                        moveField(fromField, toField);
                        $(target).datagrid();
                        $(target).datagrid('columnMoving');
                    }, 0);
                }
            });

            // move field to another location
            function moveField(from, to) {
                var columns = $(target).datagrid('options').columns;
                var cc = columns[0];
                var c = _remove(from);
                if (c) {
                    _insert(to, c);
                }

                function _remove(field) {
                    for (var i = 0; i < cc.length; i++) {
                        if (cc[i].field == field) {
                            var c = cc[i];
                            cc.splice(i, 1);
                            return c;
                        }
                    }
                    return null;
                }
                function _insert(field, c) {
                    var newcc = [];
                    for (var i = 0; i < cc.length; i++) {
                        if (cc[i].field == field) {
                            newcc.push(c);
                        }
                        newcc.push(cc[i]);
                    }
                    columns[0] = newcc;
                }
            }
        });
    }
});