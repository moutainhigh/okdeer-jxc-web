<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>建店费用类别</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <%@ include file="/WEB-INF/views/system/exportChose.jsp"%>
    <script  src="${ctx}/static/js/views/settle/franchise/account/accountList.js?V=${versionNo}"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4 upad-4">
        <form id="queryForm" action="" method="post">
            <div class="ub ub-ac">
                <div class="ubtns">
                    <div class="ubtns-item" onclick="queryForm()">查询</div>
					<shiro:hasPermission name="JxcFranchiseAc:export">
				        <input type="hidden" id="startCount" name="startCount"/>
				        <input type="hidden" id="endCount" name="endCount"/>
                    	<div class="ubtns-item" onclick="exportAccountList()">导出</div>
                    </shiro:hasPermission>
					<shiro:hasPermission name="JxcFranchiseAc:print">
                    	<div class="ubtns-item-disabled">打印</div>
                    </shiro:hasPermission>
                    <div class="ubtns-item" id="set" onclick="gFunRefresh()" >重置</div>
                    <div class="ubtns-item-disabled" >设置</div>
                    <div class="ubtns-item" onclick="toClose()">关闭</div>
                </div>
                <div class="ub ub-ac umar-l20">
                 <!-- 引入时间选择控件 -->
                <%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
                </div>
            </div>
                <div class="ub umar-t8">
                    <div class="ub ub-ac" id="branchComponent">
                        <div class="umar-r10 uw-70 ut-r">机构:</div>
                        <input type="hidden" id="branchId" name="branchId"/>
                        <input class="uinp ub ub-f1" type="text" id="branchName" name="branchName"/>
                        <div class="uinp-more" >...</div>
                    </div>
                    <div class="ub ub-ac umar-l64">
                        <div class="umar-r10 uw-70 ut-r">单号:</div>
                        <input class="uinp" type="text" id="targetformNo" name="targetFormNo">
                    </div>
                </div>
                <div class="ub umar-t8">
                    <div class="ub ub-ac">
                        <div class="umar-r10 uw-70 ut-r">汇总类型:</div>
                        <div class="ub ub-ac umar-r10">
                            <label>
                                <input type="radio" name="type" value="1" checked="checked" onclick="initfraAcountList()"/><span>到期账款</span>
                            </label>
                        </div>
                        <div class="ub ub-ac umar-r10">
                            <label>
                                <input type="radio" name="type" value="2" onclick="initfraAcountList()"/><span>历史往来账款</span>
                            </label>
                        </div>
                        <div class="ub ub-ac umar-r10">
                            <label>
                                <input  type="radio" name="type" value="3"  onclick="initfraAcountList()"/><span>未收款账款汇总</span>
                            </label>
                        </div>
                        <div class="ub ub-ac umar-r10">
                            <label>
                                <input  type="radio" name="type" value="4"  onclick="initfraAcountList()"/><span>未收款账款明细</span>
                            </label>
                        </div>
                        <div class="ub ub-ac umar-r10">
                            <label>
                                <input  type="radio" name="type" value="5"  onclick="initfraAcountList()"/><span>已收账款明细</span>
                            </label>
                        </div>
                        <div class="ub ub-ac umar-r10">
                            <label>
                                <input  type="radio" name="type" value="6"  onclick="initfraAcountList()"/><span>预收账款明细</span>
                            </label>
                        </div>
                        <div class="ub ub-ac umar-r10">
                            <label>
                                <input  type="radio" name="type" value="7"  onclick="initfraAcountList()"/><span>加盟店毛利明细</span>
                            </label>
                        </div>
                    </div>
                </div>
            
        </form>
        <div class="ub ub-f1  umar-t8 umar-b8">
            <table id="fraAccountList"></table>
        </div>
    </div>

</body>
</html>

</html>
