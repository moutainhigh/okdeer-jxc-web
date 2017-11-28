<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<title>新增编辑服务代码</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<script
        src="${ctx}/static/js/views/csrservice/editServiceDialog.js?V=${versionNo}3"></script>
<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
    <div class="ub ub-ac upad-4">
        <div class="ubtns">
            <button class="ubtns-item" onclick="saveServiceCode()" id="saveBtn">保存</button>
            <button class="ubtns-item" onclick="closeFinanceDialog()">关闭</button>
        </div>
    </div>
    <div class="ub uline"></div>
    <form id="financeAdd">
        <input type="hidden" name="dictTypeId" id="dictTypeId"/>
        <div class="ub upad-4 umar-t10">
            <div class="ub ub-ac">
                <div class="umar-r10 uw-70 ut-r">所属分公司:</div>
                <input class="uinp ub ub-f1 easyui-validatebox" type="text" id="branchName"
                       name="branchName" readonly maxlength="20"/>
            </div>
        </div>
        <div class="ub ub-ver upad-4">
            <div class="ub upad-4 umar-t10">
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">编号:</div>
                    <input class="uinp  ub ub-f1" type="text" id="csrserviceCode" name="csrserviceCode"
                           readonly maxlength="4" value="<c:out value="${code}"/>"/>
                    <input type="hidden" name="typeId" id="typeId"/>
                    <input type="hidden" name="id" id="id"/>
                </div>
            </div>
            <div class="ub upad-4 umar-t10">
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">服务类型:</div>
                    <input class="uinp ub ub-f1 easyui-validatebox" type="text" id="csrserviceType"
                           name="csrserviceType" readonly maxlength="20"/>
                </div>
            </div>

            <div class="ub upad-4 umar-t10">
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">服务名称:</div>
                    <input class="uinp ub ub-f1 easyui-validatebox" type="text" id="csrserviceName"
                           name="csrserviceName" maxlength="20"/>
                </div>
                <i class="ub uc-red">*</i>
            </div>

            <div class="ub upad-4 umar-t10">
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">单价:</div>
                    <input class="uinp  easyui-numberbox" type="text" data-options="min:0" name="referencePrice"
                           id="referencePrice">
                </div>
                <i class="ub uc-red">*</i>
            </div>

            <div class="ub upad-4 umar-t10">
                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">是否可以改价:</div>
                    <select class="easyui-combobox uselect" name="isAllowAdjustPrice"
                            data-options="editable:false"
                            id="isAllowAdjustPrice">
                        <option value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </div>
                <i class="ub uc-red">*</i>
            </div>

            <div class="ub upad-4 umar-t10">

                <div class="ub ub-ac">
                    <div class="umar-r10 uw-70 ut-r">备注:</div>
                    <input class="uinp ub ub-f1" type="text" id="remark"
                           name="remark" maxlength="20"/>
                </div>
            </div>

            <div class="ub upad-4 umar-t10">

                <div class="ub ub-ac">
                    <div class="umar-r10 uw-30 ut-r"></div>
                    <div id="cbDiv">
                        <label for="ckbSave" id="ckbSaveLabel"><input id="ckbSave" type="checkbox" checked="checked">保存后自动新增</label>
                    </div>

                </div>
            </div>

        </div>
    </form>
</div>
