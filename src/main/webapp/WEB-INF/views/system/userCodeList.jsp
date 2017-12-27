<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>员工二维码列表</title>

<%@ include file="/WEB-INF/views/include/header.jsp"%>

	<script>
	$(function(){
	if(!window.localStorage){
	alert("浏览器支持localstorage");
	}else{
	var storage=window.localStorage;

	var  data=storage.userData;

	$('#userData').val(data);
	}
	$('#printdata').submit();
	storage.clear();
	});
	</script>

</head>
<body class="uw ufs-14 uc-black upad-8 box-border">
	<form id="printdata" action="${ctx}/system/user/printUserCode" method="post">
		<input type="hidden" id="userData" name='userData' value=""/>
	</form>
</body>
</html>