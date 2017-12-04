$(function () {
    $('#branchComponent').branchSelect({
        param: {
            branchTypesStr: $_jxc.branchTypeEnum.OWN_STORES + "," + $_jxc.branchTypeEnum.FRANCHISE_STORE_B + ',' + $_jxc.branchTypeEnum.FRANCHISE_STORE_C,
            type: 'NOTREE'
        },
        //数据过滤
        onAfterRender:function(data){
            var branchId = data.branchId;
            $("#content").empty();
           queryServiceList(branchId);
        }
    });
});

function queryServiceList(branchId) {
    $_jxc.ajax({
        url: contextPath + "/service/config/csrservice",
        data:{
            "branchId": branchId
        }
    },function(result){
        if(result && result.code == 0){
            if(result.data.length > 0){
                $("#btnSave").removeClass("uinp-no-more")
                $('#btnSave').attr('onclick','saveService()');
                createPage(result.data);
            }else{
                $("#btnSave").addClass("uinp-no-more")
                $('#btnSave').removeAttr('onclick');
            }

        }else{
            $("#content").empty();
            $_jxc.alert(result.message);
        }
    });
}

function createPage(serviceList){
    var content = $("#content");
    $.each(serviceList,function (index,item) {
        var temp_html = '';
        if(item.checked == true){
            temp_html = ' checked=checked '
        }
        var li_html = $('<li class="ub"> <div class="ub level">' +
            ' <div class="ub ub-ac ub-pc uw-200 bor-rb bor-left"> <label> ' +
            '<input type="checkbox" class="parentNode oneNode"' +
            'id="'+item.id+'" ' +
            'level="'+item.level+'" ' + temp_html +
                ' /> ' + item.name +
            '</label> </div> </div></li>');

        var ul = $('<ul class="ub ub-ver levelContent two"></ul>');


        if(item.child && item.child.length > 0) {
            var childs = item.child;
            $.each(childs,function (index,child) {

                var temp_html = '';
                if(child.checked == true){
                    temp_html = ' checked=checked '
                }

                var child_li = $('<li class="ub uh-40"> <div class="ub level"> ' +
                    '<div class="ub ub-ac upad-l10 uw-200 bor-rb"> <label> ' +
                    '<input type="checkbox" ' + temp_html +
                    'id="'+child.id+'" ' +
                    'parentId="'+child.parentId+'" ' +
                    'level="'+child.level+'" class="parentNode twoNode" />'  + child.name  +
                    ' </label> </div> </div> </li>');

                child_li.appendTo(ul);
            })
        }else{
            var child_li = $('<li class="ub uh-40"> <div class="ub level"> ' +
                '<div class="ub ub-ac upad-l10 uw-200 bor-rb"> <label> ' +
                ' </label> </div> </div> </li>');

            child_li.appendTo(ul);
        }

        ul.appendTo(li_html);
        li_html.appendTo(content);
    })

}



$(document).on('change','.parentNode,.treeItem',function(){
    var flag = $(this).prop('checked');
    if($(this).attr('class') == 'treeItem' ){
        var opeInputLength = $(this).closest('.levelContent').find('label').length;
        var opeInputCheckedLength = $(this).closest('.levelContent').find('input[type="checkbox"]:checked').length;
        if(opeInputLength == opeInputCheckedLength){
            $($(this).closest('li').find('input.twoNode')[0]).prop('checked',true);
        }
    }else{
        var checkebox = $(this).closest('.level').next('.levelContent').find('input[type="checkbox"]');
        $.each(checkebox, function (index,obj) {
            $(obj).prop('checked',flag);
        })
    }
    filterCheckDom();
});

function filterCheckDom(){
    $.each($('.levelContent.two').children('li'),function(index,obj){
        var checkThreeItems = $(obj).find("input.twoNode:checked");
        if(checkThreeItems.length > 0){
            $($(obj).find(".twoNode")[0]).prop('checked',true);
        }else{
            $($(obj).find(".twoNode")[0]).prop('checked',false);
        }
    })

    $.each($("#content li"),function(index,obj){
        var checkInputs = $(obj).children('.levelContent.two').find('input[type="checkbox"]:checked');
        if(checkInputs.length > 0){
            $($(obj).find('.oneNode')[0]).prop('checked',true);
        }
        // else{
        //     $($(obj).find('.oneNode')[0]).prop('checked',false);
        // }
    });

}

//保存
function saveService(){
    if($_jxc.isStringNull($("#branchId").val())){
        $_jxc.alert("请先选择一个店铺");
        return;
    }

    var menusIds = [];
    var parentNodes = $(".parentNode.oneNode");
    $.each(parentNodes,function (n,pnode) {
        var pchecked =  $(pnode).is(":checked");
        if(pchecked){
            var menDomObj = {};
            menDomObj.id = $(pnode).attr('id') ||'';
            menDomObj.parentId = $(pnode).attr('parentId') ||'';
            menusIds.push(menDomObj);
        }

    })

    var treeMenus = $(".two.levelContent");
    $.each(treeMenus, function (index,obj){
        var menuLiContent = $(obj).children('li');

        if(menuLiContent.length > 0 ){
            $.each(menuLiContent,function(inj,menDom){
                // var checkInputs =  $(menDom).find('.levelContent input[type="checkbox"]:checked');
                var menuDom = $(menDom).find('.twoNode')[0];
                var menuDomCheck = $(menuDom).prop('checked');
                //菜单对象
                var menuObj = {};
                menuObj.id = $(menuDom).attr('id') ||'';
                menuObj.parentId = $(menuDom).attr('parentId') ||'';
                //子节点有勾选
                // if(checkInputs.length > 0){
                //     $.each(checkInputs, function (iny,elt) {
                //         menuObj.operPermissions.push($(elt).attr('id'));
                //     });
                //     menusIds.push(menuObj);
                // }else

                if(menuDomCheck){
                    menusIds.push(menuObj);
                }
            });
        }

    });

    var branchId = $("#branchId").val();
    var data = JSON.stringify(menusIds);

    $_jxc.ajax({
        url: contextPath + "/service/config/save/csrservice",
        data:{
            "branchId":branchId,
            "data":data
        }
    },function(result){
        if(result && result.code == 0){
            $_jxc.alert("保存成功！");
            //toClose();
        }else{
            $_jxc.alert(result.message);
        }
    });
}