$(function () {
    $('#branchComponent').branchSelect({
        // param: {
        //     scope: 1,//数据显示 xxxx机构所有
        //     selectType: 1,  //多选
        //     branchTypesStr:$_jxc.branchTypeEnum.FRANCHISE_STORE_B+','+$_jxc.branchTypeEnum.FRANCHISE_STORE_C
        //     type:'NOTREE',
        // },
//数据过滤
        onAfterRender:function(data){
            var branchId = data.branchId;
           queryServiceList(branchId);
        }
    });
});

function queryServiceList(branchId) {
    $_jxc.ajax({
        url:contextPath+"/system/role/produceRoleAuth",
        data:{
            "branchId":branchId,
        }
    },function(result){
        if(result && result.code == 0){

        }else{
            $_jxc.alert(result.message);
        }
    });
}

function createPage(serviceList){
    var content = $("#content");
    $.each(serviceList,function (index,item) {
        var temp_html = '';


        var li_html = '<li class="ub"> <div class="ub level">' +
            ' <div class="ub ub-ac ub-pc uw-128 bor-rb bor-left"> <label> ' +
            '<input type="checkbox" class="parentNode oneNode"' +
            'id="'+item.id+'" ' +
            'level="'+item.level+'" ' + temp_html
                ' />'

            '</label> </div> </div></li>';

        if(item.checked == true){
            temp_html = ' checked=checked '
        }

        var ul = ' <ul class="ub ub-ver levelContent two"></ul>';

        var child_li = '<li class="ub "> <div class="ub level"> ' +
            '<div class="ub ub-ac upad-l10 uw-128 bor-rb"> <label> ' +
            '<input type="checkbox" id="${i2.id }" ' +
            'parentId="${i2.parentId }" ' +
            'level="${i2.level }"class="treeItem" />' +
            ' </label> </div> </div> </li>'

    })

}

$(document).on('change','.parentNode,.treeItem',function(){
    var flag = $(this).prop('checked');
    if($(this).attr('class') == 'treeItem' ){
        var opeInputLength = $(this).closest('.levelContent').find('label').length;
        var opeInputCheckedLength = $(this).closest('.levelContent').find('input[type="checkbox"]:checked').length;
        if(opeInputLength == opeInputCheckedLength){
            $($(this).closest('li').find('input.threeNode')[0]).prop('checked',true);
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
        var checkThreeItems = $(obj).find("input.threeNode:checked");
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
        }else{
            $($(obj).find('.oneNode')[0]).prop('checked',false);
        }
    });

}