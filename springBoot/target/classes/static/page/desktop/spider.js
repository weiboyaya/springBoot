 window.onload =function init(){
		$("#input_start").on('click',start);
		$("#input_url").on('mouseover',function(){
			var val=$("#input_url").val();
			$("#input_url").attr("title",val);
		});
	 };
	function start(){
		var val=$('#input_url').val();
		if(val==''||val==undefined){
			alert("请输入url地址");
			return ;
		}
		$.ajax({
		async : true,
		cache : false,
		type : "POST",
		dataType : "json",
		url : "/WebMagic.do?method=start",
		data:{
		url:val
		},
		beforeSend: function(){
		},
		success : function(data) {
			if(data.success=="true"){
				getSpiderList();
			}else{
				alert("操作失败！");
			}
		}
		});
	return;
	}
	
	function getSpiderList(){
		$.ajax({
		async : true,
		cache : false,
		type : "POST",
		dataType : "json",
		url : "/WebMagic.do?method=getSpiderList",
		data:{
		},
		beforeSend: function(){
		},
		success : function(data) {
			if(data.success=="true"){
				crtTable(data.result);
			}else{
				alert("查询爬取数据列表失败！");
			}
		}
		});
	}
	
	function crtTable(datas){
		$("#result_data").empty();
		var title=$("<div>爬取数据结果如下：</div>");
		title.addClass("result-title");
		title.appendTo($("#result_data"));
		var table=$("<table class='altrowstable' border='1'>");
		table.appendTo($("#result_data"));
		//设置标题
		var headtr= $("<tr></tr>");
		headtr.addClass("head_tr");
		headtr.appendTo(table);
		var headtd=$("<td>图片名称</td><td>图片大小(KB)</td><td>创建日期</td>");
		headtd.addClass("head_td");
		headtd.appendTo(headtr);
		
		for(var i=0;i<datas.length;i++){
			var tr=$("<tr></tr>");
			if(i % 2 == 0){
				tr.addClass("evenrowcolor");
			}else{
				tr.addClass("oddrowcolor");
			}      
			tr.appendTo(table);
			var td=$("<td>"+datas[i].filename+"</td>");
			td.appendTo(tr);
			var size=datas[i].filesize/1024;
			size=size.toFixed(2);
			var td=$("<td>"+size+"</td>");
			td.appendTo(tr);
			var d=new Date();
			d.setTime(datas[i].mdate.time);
			var date=d.format("yyyy年MM月dd hh:mm:ss");
			var td=$("<td>"+date+"</td>");
			td.appendTo(tr);
		}
		 $("#result_data").append("</table>");
	}
	
	Date.prototype.format = function (fmt) { 
		  var o = {
		    "M+": this.getMonth() + 1, //月份
		    "d+": this.getDate(), //日
		    "h+": this.getHours(), //小时
		    "m+": this.getMinutes(), //分
		    "s+": this.getSeconds(), //秒
		    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
		    "S": this.getMilliseconds() //毫秒
		  };
		  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		  for (var k in o)
		  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		  return fmt;
		};