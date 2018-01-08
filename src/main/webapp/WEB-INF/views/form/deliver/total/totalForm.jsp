<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>要货单汇总——单据筛选</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
     <script  src="${ctx}/static/js/views/deliver/total/totalForm.js?V=${versionNo}"></script>
    
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
        <form id="totalForm">
             <div class="ub ub-ac">
                <div class="ubtns">
                <shiro:hasPermission name="JxcDeliverTotal:search">
                <div class="ubtns-item" onclick="queryForm()">查询</div>
                </shiro:hasPermission>
                <shiro:hasPermission name="JxcDeliverTotal:nextStep">
                <div class="ubtns-item" onclick="nextStep()">下一步</div>
                </shiro:hasPermission>
                <div class="ubtns-item" onclick="clearForm()">重置</div>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
                </div>
             </div>


            <div class="ub umar-t20">
                <div class="ub  ub-ac uw-516" id="targetBranchComponent">
                <div class="umar-r10 uw-70 ut-r">要货机构:</div>
                <input class="uinp ub ub-f1" type="hidden" id="targetBranchIdStr" name="targetBranchIdStr" value="">
                <input class="uinp ub ub-f1" type="text" id="targetBranchCodeName" readonly="readonly" value="" name="targetBranchCodeName">
                <div class="uinp-more">...</div>
                </div>

            </div>

            <div class="ub umar-t20">
                <div class="ub  ub-ac uw-516" id="sourceBranchComponent">
                <div class="umar-r10 uw-70 ut-r">发货机构:</div>
                <input class="uinp ub ub-f1" type="hidden" id="sourceBranchIdStr" name="sourceBranchIdStr" value="">
                <input class="uinp ub ub-f1" type="text" id="sourceBranchCodeName" readonly="readonly" value="" name="sourceBranchCodeName">
                <div class="uinp-more">...</div>

                </div>
                <i class="ub ub-ac uc-red">*</i>
            </div>

            <div class="ub umar-t20">
            <div class="ub ub-ac uw-516">
            <div class="umar-r10 uw-70 ut-r">要货日期:</div>

            <input class="Wdate uw-300 uinp-no-more" name="startTime" id="startTime" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endTime\');}'})" />
            &nbsp;至&nbsp;
            <input class="Wdate uw-300 uinp-no-more" name="endTime" id="endTime" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'startTime\');}',maxDate:'%y-%M-%d'})" />
            <i class="ub ub-ac uc-red">*</i>

            </div>
            </div>

        </form>
        <input type="hidden" name="formData" id="formData" value='${formData }' />

        <div class="ub uw umar-t8 ub-f1">
        <table id="gridTotalList"></table>
        </div>
    </div>
</body>
</html>