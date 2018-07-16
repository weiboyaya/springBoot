if (!window.Common) {
    Common = {};
}
Common.WebUpload = {};

/*appframe.loadCss("/webUpload/css/webuploader.css", "webuploaderCSS");
appframe.loadCss("/webUpload/css/easyui.css", "easyuiCSS");
appframe.loadCss("/webUpload/css/icon.css", "iconCSS");
appframe.loadCss("/webUpload/css/settingBox.css", "settingBoxCSS");
appframe.loadCss("/webUpload/css/viewer.css", "viewerCSS");*/


/**
 * 文件上传组件初始化方法
 *
 * 该方法依赖第三方插件: webuploader (https://github.com/fex-team/webuploader)
 *
 * @param  {Object} config 传入WebUpload的配置参数对象
 */
Common.fileConfig={
	fileCount :0, // 添加的文件数量
        filesize : 0, // 添加的文件总大小
        ratio : window.devicePixelRatio || 1, // 优化retina, 在retina下这个值是2
        thumbnailWidth : 110 * (window.devicePixelRatio || 1), // 缩略图大小
        thumbnailHeight : 110 * (window.devicePixelRatio || 1),
        state : 'pedding',
        percentages : {}, // 所有文件的进度信息，key为file id
		settings:'',
        uploader:'',
        nodeId:'',
        nodeTxt:'',
        modelId:'',
        bnNo:'',
        custNo:'',
        selFile:[]
};

 
Common.WebUpload.init = function(options) {
    //默认配置
    var defaultSetting = {
        container: { //容器
            id: 'uploadDiv',
            isExt: false
        },
        domId:"uploadfileHtml",
        windowId:"uploadfileHtml",
        showDownBtn:true,
		showAddFileBtn:true,
		showUploadBtn:true,
		showSelecAllBtn:true,
		edit:true,
		remove:true,
		config:{
			bnNo:'',
			custNo:'',
			modelId:'',
			maxPicSize:'8',
			thumbTypes:'jpg|jpeg|png|gif|bmp'
		}
    };
	
    //全局配置
    var settings = {};
    $.extend(settings, defaultSetting, options);
    
    //初始化dom结构
    Common.WebUpload._initHTML(settings);
    //初始化右侧菜单
    Common.WebUpload._initRightNav(settings);

    var uploader = Common.WebUpload._createUploaderObj(settings, domObj);

    Common.WebUpload._initActionListener(settings, uploader);
	
	Common.WebUpload.getParams(settings);
	
	//Common.WebUpload.Tree(Common.fileConfig.bnNo,Common.fileConfig.modelId);
	Common.WebUpload.getCompleteFile();
	Common.fileConfig.settings=settings;
	Common.fileConfig.uploader=uploader;
	Common.WebUpload.initSettingBox(settings);
	 //获取dom对象
    var domObj = Common.WebUpload._getDomObj(settings);
    
    Common.WebUpload.initOperation(settings,domObj);

};
//初始化操作
Common.WebUpload.initOperation=function(settings,domObj){
	if(!settings.showDownBtn){
		domObj.down.parent().hide();
	}
	if(!settings.showAddFileBtn){
		domObj.add.parent().parent().hide();
	}
	if(!settings.showUploadBtn){
		domObj.upload.parent().hide();
	}
	if(!settings.showSelecAllBtn){
		domObj.selecAll.parent().hide();
		domObj.cancelSelec.parent().hide();
	}
	if(!settings.edit){
	}
	$("#dndArea div[id^='rt'] label").css('height','0');
	//$('.queueList').css('opacity','0.3');
	Common.WebUpload.clear();
	domObj.placeHolder.addClass('element-invisible');
	$(".rightNav").addClass('rightNav_display');
};

Common.WebUpload.getParams=function(settings){
	Common.fileConfig.bnNo=settings.config.bnNo;
	Common.fileConfig.custNo=settings.config.custNo;
	Common.fileConfig.modelId=settings.config.modelId;
};
/**
 * 创建dom
 */
Common.WebUpload._initHTML = function(settings) {
	$("#"+settings.container.id).find('.x-panel-body').html(""); 
	if($("#settingBox").length>0)
		$("#settingBox").remove();
    var upLoadHtmlStr = '<div id="'+settings.domId+'" class="upload_domain">\
    	<div id="wrapper">\
        <div id="container">\
            <div id="uploader">\
              <div class="queueList">\
                <div id="dndArea" class="placeholder">\
                  <div id="filePicker"></div>\
                </div>\
              </div>\
              <div class="statusBar" >\
                <div class="info"></div>\
                <div class="btns">\
                </div>\
    			<div class="remind">\
    				<span>温馨提示：</br> 1、添加等待上传附件后，鼠标移至该附件可以修改名称及备注、删除操作。</br>\
    					2、上传成功的附件只能查看属性、删除、下载(选中上传成功的附件，点击下载按钮)。</br>\
    					3、附件上双击查看大图(只对图片有效，非图片不显示)。</br>\
    					4、目前支持的图片格式：jpg、png、gif。</br>\</span>\
    			</div>\
              </div>\
            </div>\
          </div>\
        </div>\
    	</div>';
        var tree='<div class="left">\
        	<div style="text-align:left;margin:5px;height: 20px;width:250px;">\
			<input type="text" id="search_tree" />\
			<label class="tree_button_wrapper">\
			<button id="search_tree_btn" title="搜索" ></button>\
			</label>\
			<label class="tree_button_wrapper">\
			<button id="collapseAll_tree" title="收起" ></button>\
			</label>\
			<label class="tree_button_wrapper">\
			<button id="expandAll_tree" title="展开" ></button>\
			</label>\
  		    </div>\
  		    <div id="erecord_tree"></div>\
        </div>';
        var progress='<div id="progressDiv" class="progress">\
            <span class="text">0%</span>\
            <span class="percentage"></span>\
          </div>';
        var settingBox = '<div id="settingBox">\
        <div class="row1">\
           属性设置<a href="javascript:void(0)" title="关闭窗口" class="close_btn" id="closeBtn">×</a>\
        </div>\
        <div class="row">\
        	<div class="labelName" >文件名:</div>\
        	<span class="inputBox">\
                <input type="text" id="txtName" placeholder="" />\
        		<input type="text" id="postfix" disabled="disabled" placeholder="" />\
            </span><a href="javascript:void(0)" title="文件名称不能为空" class="warning" id="warn">*</a>\
        </div>\
        <div class="row">\
            备&ensp;&ensp;注: <span class="inputBox">\
				<textarea rows="3" id="remark" placeholder="最多500字"></textarea>\
            </span>\
        </div>\
        <div class="row">\
            <a href="#" id="save">保存</a><a href="javascript:void(0)" id="close">关闭</a>\
        </div>\
    </div>';
    var upLoadHtmlStr = tree+upLoadHtmlStr;
    var upLoadHtmlStr = upLoadHtmlStr+progress;
    //$("#"+settings.windowId).append(settingBox);
    var upLoadHtmlStr = upLoadHtmlStr+settingBox;
   
    var containerID = '#' + settings.container.id;

    //判断容器是否是Ext
    if (settings.container.isExt) {
    	if($(containerID + '>.x-panel-bwrap>.x-panel-body').length>0){
    		$(containerID + '>.x-panel-bwrap>.x-panel-body').append(upLoadHtmlStr);
    	}else{
    		$(containerID).append(upLoadHtmlStr);
    	}
    } else {
        $(containerID).append(upLoadHtmlStr);
    }

};

Common.WebUpload._initRightNav=function(settings){
	var rightNav="<div class='rightNav btns'>\
				 <a><div class='rightNav_btns' id='selecAll'><img src='/page/webUpload/img/selecAll.png'><span class='rightNav_btns_text'>全  选</span></div></a>\
				 <a><div class='rightNav_btns' id='cancelSelec'><img src='/page/webUpload/img/cancelSelec.png'><span class='rightNav_btns_text'>取消全选</span></div></a>\
				 <a><div class='rightNav_btns' id='fileDownload'><img src='/page/webUpload/img/download.png'><span class='rightNav_btns_text'>下  载</span></div></a>\
				 <a><div class='rightNav_btns'><img src='/page/webUpload/img/add.png'><div id='filePicker2'></div></div></a>\
				 <a><div class='rightNav_btns' id='uploadBtn'><img src='/page/webUpload/img/upload.png'><span class='rightNav_btns_text'>开始上传</span></div></a>\
				 </div>";
	var containerID = '#' + settings.container.id;
	//判断容器是否是Ext
    if (settings.container.isExt) {
    	if($(containerID + '>.x-panel-bwrap>.x-panel-body').length>0){
    		$(containerID + '>.x-panel-bwrap>.x-panel-body').append(rightNav);
    	}else{
    		$(containerID).append(rightNav);
    	}
    } else {
        $(containerID).append(rightNav);
    }
};

/**
 * 获取dom对象
 * @param  {[type]} settings [全局配置]
 * @return {Obj} [dom对象]
 */
Common.WebUpload._getDomObj = function(settings) {
    var $wrap = $('#' + settings.domId),

        // 新建图片容器
        $queue = $('<ul class="filelist"></ul>').appendTo($wrap.find('.queueList')),

        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),

        // 文件总体选择信息。
        $info = $statusBar.find('.info'),

        // 【开始上传】按钮
        //$upload = $wrap.find('.uploadBtn'),
        $upload = $('#uploadBtn'),
        //【下载】按钮
        $down = $("#fileDownload"),
        //【继续添加】按钮
        $add = $("#filePicker2"),
		//【全选】
		$selecAll=$("#selecAll");
		//【取消全选】
		$cancelSelec=$("#cancelSelec");
        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),

        //进度条一开始是隐藏的
        $progress = $('#progressDiv').hide();

    return {
        wrap: $wrap,
        queue: $queue,
        statusBar: $statusBar,
        info: $info,
        upload: $upload,
        down: $down,
        add: $add,
        selecAll:$selecAll,
        cancelSelec:$cancelSelec,
        placeHolder: $placeHolder,
        progress: $progress
    }
};

/**
 * 
 * @param  {[type]} settings [全局配置]
 */
Common.WebUpload.initSettingBox=function(settings){
		//按钮的透明度
		$("#save").hover(function () {
			$(this).stop().animate({
				opacity: '1'
			}, 600);
		}, function () {
			$(this).stop().animate({
				opacity: '0.8'
			}, 1000);
		});
		
		//文本框不允许为空---单个文本触发
		$("#txtName").on('blur', function () {	
			var txtName = $("#txtName").val();
			if (txtName == "" || txtName == undefined || txtName == null) {
				$("#warn").css({ display: 'block' });
			}
			else {
				$("#warn").css({ display: 'none' });
			}
		});
		$("#txtName").on('focus', function () {
			$("#warn").css({ display: 'none' });
		});
		
		$('#close').on('click', function () {
			$("#settingBox").fadeOut("fast");
			$("#mask").css({ display: 'none' });
		});
		//关闭
		$(".close_btn").hover(function () { $(this).css({ color: 'black' }) }, function () { $(this).css({ color: '#999' }) }).on('click', function () {
			$("#settingBox").fadeOut("fast");
			$("#mask").css({ display: 'none' });
		});
}

/**
 * 获取文件配置
 * @return {[type]} [description]
 */
Common.WebUpload._getFileConfig = function() {

        fileCount = 0, // 添加的文件数量
        filesize = 0, // 添加的文件总大小
        ratio = window.devicePixelRatio || 1, // 优化retina, 在retina下这个值是2
        thumbnailWidth = 110 * ratio, // 缩略图大小
        thumbnailHeight = 110 * ratio,

        /**
         * 文件上传状态描述
         * @type {pedding}:未选择文件
         * @type {ready}:文件已选择，已准备好上传
         * @type {uploading}:正在上传
         * @type {confirm}:
         * @type {done}:上传完成
         */
        state = 'pedding',
        percentages = {}; // 所有文件的进度信息，key为file id
		wordBlob="data:image/jpeg;base64,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";	
		excelBlob="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCABuAG4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmqKKKwPACiigkKOTigAop8EUtycQRvKf9hS38q1LXwpr17/qdMmx6vhP507FKMnsjIorrbb4ba/PzILeAf7b5P6Ck1/wJLoGjNqE1+srKyjy1jwOTjrmjlZfsalr2OTopaKRkJRS0UAJRS0UAJXV+G/Ac3iDTlv8A7ckEbMQF8vceDj1rlK9f+G//ACKMP/XR/wD0I1UVdnRh4RnO0jPtvhZpyAG6vriU+i4UVr2/w/8ADluQfsPmEd3kY5/DNdIKWrsj0lRprZFK20fTbIf6NZQRe6oBVylpDVGiSWwcVyvxFQv4VdF5LSoB9dwrqq5X4iuyeFndfvLKhH/fQpPYir8DOCHgHxIRkWS4P/TVaX/hAPEn/Piv/f1aUfEDxGBgXS4H+wK3PD/i/Wb7TdZmuLhWe1tfMiO0cNz/AIVGh58Y0JOyuYX/AAgHiT/nxX/v6tH/AAgHiT/nxX/v6tH/AAsHxJj/AI+1/wC+B/hWv4T8Z65qnii0sbu4V4JQ25QgGcCjQIxoSaSuclquj32i3CwX8PlSOu5QGByPwqlXbfFL/kPWv/Xv/WuJqXozCrFQm4oSvX/hv/yKMP8A10f/ANCNeQV6/wDDf/kUYf8Aro//AKEacNzfCfxDqxTHmjTO6RFx6mn1598TdBRrVdYgQh0YLPjuDwD+HFaPQ9GpJwi5JHoAYEZyMVRTXNLmuxaRX8Ek5Yr5auC2R1rjbTxoln8P4pmbddqDbKOp3AcE/hiq/wAMNFMks+tTrnGY4iR1P8R/p+dK5l7a8oqPU9JrlviIFbwuyudqmZAx9BuFdTXKfEcFvCkiqMkyoAB3+YU3saVf4bOR/sDwd31+X/vtP8K2dD0nw3Bp+rJaatJNHLb7Z2LL8i888Vw//CN62R/yCbr/AL9muh8M6LqlvpWupNp88bTWm2MMhBc88CoXocNN+98A3+wPBv8A0H5v++0/wrU8M6N4YtvEdrPYaxJcXSBtkbMpDcc9BXGDw3reP+QTdf8Afs1teDND1W08YWNxcadcRRIH3O6EAcUL0FTfvr3C38Uv+Q9af9e/9a4mu2+KX/IetP8Ar3/rXE0nuZYj+KxK9f8Ahv8A8ijD/wBdH/8AQjXkFev/AA3/AORRh/66P/6EaIbmmE/iHViqesWMepaTdWcp2rLGV3enHWrgrmfH2rf2X4amRH2z3P7pMdeev6ZrVnpTaUW2ePOXVTAXDIrnGOmemf0r3Tw3p0Wl6DaWkTh1WMEsOjE8k/rXj82gzxeFbfWBExEkzKcf3Ox/Q16N8OdW+3+HRbSSbpbRthB67f4f8PwqI7nBhfdnZ9Trq5T4iu0fhZ3U4ZZUIPvuFdVmuW+Imz/hF28z7nnR7sem4ZqnsdtX4GefDx14kAAGonA/2BW94e8Va1e6ZrU1xeF3trXzIjtHytzzVcP8OscxXGfrJWxoreDfsGqfYEmEP2f/AErdv5Tnpn8alX7nHTU+bWf4nIjx34kx/wAhE/8AfArY8JeLtc1LxVZ2V3emSCQPuXaBnApu/wCHP/PO5/OStPw23gk+IbYaUkwvsN5RYvjpz146Ua3FTU+ZXn+Jm/FL/kPWn/Xv/WuJrtvil/yHrT/r3/rXE1MtzDEfxWJXr/w3/wCRRh/66P8A+hGvIK9f+G//ACKMP/XR/wD0I0Q3NMJ/EOrri/E3gjUPEOo/aX1ZViXiOExfcHfnNdoKWtGrnpTgpqzKH9lW/wDY39l7AYBD5WPbGK4/wt4R1zw3rnnmS3ktJAUkCuc47HGOtd/RRYl04tp9hBmuV+IqNJ4WdFGWaVAPruFdXXJ/EclfCkjAkESoQR2+YUPYKv8ADZwY8A+IyMiyXn/bFbvh/wAJazY6brMNxbBXurXy4huHLc1x/wDwkGs9tWu/+/xrovDGsalPpOvPNqFxI0VpujZpCSh55HpUK1zz6Tpc2iZQHgDxJ/z5D/vsVr+E/B2uaZ4ps767tQkEQbc28HGRXKjxDrOP+Qtd/wDf41t+C9a1S68Y2MFxqNzLEwfcjykg8elCtcVN0udWTLnxS/5D1p/17/1ria7X4pf8h20/69/61xVKW5GI/isSvX/hv/yKMP8A10f/ANCNeQVbtdU1CxXbaX08C9dqSED8qUXZio1FTldnv4pa8UtvHXiO2wBqBlUdpEB/+vWrb/FPVo2H2iyt5l77Mqf51pzI71i6bPVqK4jT/idpk4/02J7U+wLfyFb1p4t0G8AMWpwAns7BT+Rp3RtGrCWzNmuX+IAU+G8PjaZ4859Nwroo7q3nG6KeNx6qwNcz8SP+RSl/66J/6EKHsFV+4yVdI8H7RmDTs45+7Vi3tfC9rHNHALGNJ12SBWUbh6GvE8D0owPSo5jhWJS+yey/2R4O/wCeGnf+O1LaWXhaxukubUWEUyZ2upUEV4rgUYFHMJYlL7J2PxLuoLrW7ZreZJQsGCUbOOa4+kApaT1OecueTkJS0lLUmYUUUUwCkwKWigBySSQsGikdGHQqxBqxNq2o3Nsbae+nlhPVJJCw/WqtFMd2FFFFIAooooAKKKKAP//Z";
		txtBlob="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCABuAG4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2aqerf8gyb6D+Yq5VPVv+QbN9B/MUAcp8W3ZPBLFGZT9qi5U4PU15ZoXh/Xdfill03dKsTBGLXG3BIyOpr1L4u/8AIkN/19RfzNeO6NGra3p5ZQSLmPH/AH2KaEzpp/B3ifT7aS5u0MUUS7nY3Q4Hr1ovNG1vSp7eC7WdXuv9TslLB+cYBB9x+dX/AIpRI/jJWZQSLVOT9TXZeEDOPDOn2+qNbi/PmPpa3HL7Qvykjrxk9P4cUxHJw+GfERnlgUnzIdu9ftQyuRkd/SnX3h/xLY2k1xO0kcUSF3P2noB3xmspLW4XxCg1NS16LxTMz8nfvGT9PTHGMYra+JUUb+KFZkBYW64J+poAk8Na3cjWrTz55HjuhsJLElW7EfiK9LS4KMEnwNxwr9A3t7GvF9KkKvaOP+WdyAP++gf/AGavZZZ7RYylxNCqsMMsjgAj8aTGi5RWXbX8ELBFu47i3JwrrIGMfsfb3rTpDFooooAKp6t/yDJvoP5irlU9V/5Bs30H8xQByfxcGfBJA5/0qL+ZrzCw8MeJEeG7g0i5yjLIhMfcHI4Ne565Zw3sVokyB1jukkCnoSMkfrT+adxHkd/YeMNY1NNR1HSpJZ0CqMQALgHIBHerFxZ+ML7VotVurO5+1whRCyR7VjA6AD+frXqlFFwseZ3dr4p1K/S/vNOdrhMYZIAucHIz61Fqth4o1m7+1X2nzSS7QgKQ7RgV6jRRcLHk0Gg6xHbtHJp1yjeYWB2HuAOPyqlN4R1GZy76feSsTnJiY/qa9moouFjw6bRr3RZI7qXTdQtlDqDIIQAMnud1e5adMySNZuH+RFdN/UA8YP0I/I1XvokmsJ4pVDI6EMD0NWk/5DT+1qv/AKE1IZeooooAKp6r/wAg2b6D+Yq5VPVf+QbN+H8xQAaiMrB/12H8jUeKmv8A7sH/AF1H8jTcUAR4oxUmKMUAR4oxUmKo39z5Y8pD8x+8fQVzYrEww1J1J9PxLpwc5cqJDMpbg8CnpIrVhyXm1tgPPepY78KQuee9eThMydR+91OyeFcVc1Lsf6HMf9g1ZT/kOS/9eyf+hPVMlpNOlc9ChxVxP+Q5P/17R/8AoT170XdXOFqzsXaKKKYgqnqv/INl/D+Yq5VPVf8AkGzfh/MUAOvekH/XUfyNGKW9/wCWH/XUfyNLQA3FGKdRQBDcS+RbyS4B2rkD3rnrt5Eh85uWc4z71uakC1qE/vuBVW6jtRa7LjBHXGec14GbUfby5b7L8TvwklDVrdnLTTeUu7OWPSrWgWUuo3JeTPkRnLt/ePpTZNPGo3IW0QqucF2PyqK6u0jtbC1S2gI2oOvcnuTXHleAcpc8tl+J14vEqMeVbv8AAkuFH2Z1AAG3AAp8Y/4nVwf+naL/ANCkqOaQNCcdyB+oqWP/AJDFz/17xf8AoUlfVniluiiigAqnqv8AyDZvw/mKuVT1X/kGzfh/MUAPvP8Alh/11H8jTqbd9YP+uo/kakoAbS44z2qve6hbaeqG4faXJCgDr/QfjWVObHU5/PECtIQFBkuI/wBBlsdfSgDC8e+I9W0zUtJg0OOO5yzvco33dvAGW/hPXH8jVX7deX7BpI3GeqqCR+feuwS0v0Xy4f3I7F2RgPoAorUx7VhPD05y5pK5pGpKKsmcfaR3jqAIpNo7YwK17a0uONy4+tbVFb7GZSeEpCuT1kQf+PCpof8AkL3XtDEP1ei7/wBSn/XaL/0NaSDnVrz/AHIh/wChUAXaKKKACqeq/wDINm/D+Yq5VPVv+QZN9B/MUAPvQxEIUgN5gwSMgHB7VD9lu3Hz6i4P/TKJVH65/nVi5jkkEZj25Rw2GPXrTSLzskH/AH0f8KAIRaXY/wCYnNj/AK5R5/lR/ZsLsGuHkuCDkeaRjP0AxUwF33WD8GP+FKVuT0MS/gTQBJijFRGK7PSeIf8AbIn/ANmoEV33uIv+/J/+KoAlxRimeVPjmdR9I/8AE1G6bP8AWagyfgg/mKAC8H7lf+u0X/oa022/5Ct79Ix+hqFp7JSPP1lWVWDbXkiAJByOgB6inabNHdXV7cwsHhd1VJB0bC8kHuM96ANGiiigApkkaTRNHIoZHGGB7in0UAZf9jSL8seq3yIOFUOpwPTJGaP7FY/e1TUG/wC2wH8hWpRQBl/2FCfvXt+3/b0w/lR/wj9n3mvT9buT/GtSigDL/wCEd00/eSd/9+5kP82o/wCEb0c/esUb/eYn+ZrUooAy/wDhGtE76Van6xg09fD+jJ93SrMfSBf8K0aKAKi6VpyfdsLZfpCv+FWgAoAUAAdAKWigAooooA//2Q==";
	    rarBlob="data:image/jpeg;base64,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";
	    bmpBlob="data:image/jpeg;base64,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";
		unknowBlob="data:image/jpeg;base64,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";

    return {
        fileCount: fileCount,
        filesize: filesize,
        thumbnailWidth: thumbnailWidth,
        thumbnailHeight: thumbnailHeight,
        state: state,
        percentages: percentages,
		wordBlob:wordBlob,
		excelBlob:excelBlob,
		txtBlob:txtBlob,
		rarBlob:rarBlob,
		bmpBlob:bmpBlob,
		unknowBlob:unknowBlob
    }
};

/**
 * 初始化uploader对象
 * @param  {[type]} settings [description]
 * @return {[type]}          [description]
 */
Common.WebUpload._createUploaderObj = function(settings, domObj) {

    //检测flash
    if (!Common.WebUpload.util().checkFlash()) {
        return;
    }

    // 实例化uoloader
    var uploader = WebUploader.create({
        pick: {
            id: '#filePicker',
            label: '点击选择附件'
        },
        formData: {
            uid: 123
        },
        compress: {
            width: 0.6,
            height: 0.6,

            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 80,

            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: false,

            // 是否允许裁剪。
            crop: false,

            // 是否保留头部meta信息。
            preserveHeaders: true,

            // 如果发现压缩后文件大小比原来还大，则使用原来图片
            // 此属性可能会影响图片自动纠正功能
            noCompressIfLarger: false,

            // 单位字节，如果图片大小小于此值，不会采用压缩。
            compressSize: settings.config.maxPicSize
        },
        duplicate:true,
        dnd: '#dndArea',
        paste: '#uploader',
        swf: './flash/Uploader.swf',
        //runtimeOrder: 'flash',
        chunked: false,
		//server: 'http://127.0.0.1:8080/mloan/com.jsjn.platform.file.FileUploader.do?method=upLoadFile',
		server: '/WebUploadAction.do?method=upload',
		// 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
        disableGlobalDnd: true,
        fileNumLimit: 50,
        filesizeLimit: 100 * 1024 * 1024, // 单次最多100 M
        fileSingleSizeLimit: 8 * 1024 * 1024 // 单个文件最多8 M
    });
    return uploader;
};

/**
 * 初始化upload的一系列动作监听器
 * @param  {Obj} settings [description]
 * @return {[type]}          [description]
 */
Common.WebUpload._initActionListener = function(settings, uploader) {
    var DomObj = Common.WebUpload._getDomObj(settings);
    var FileConfig = Common.WebUpload._getFileConfig();
       state = Common.fileConfig.state, // 可能有pedding, ready, uploading, confirm, done.
        percentages = Common.fileConfig.percentages; // 所有文件的进度信息，key为file id
	 var $wrap = $('#uploader');
	 /*var lightBoxSettings={
		 overlayBgColor: 		'#000',		
			overlayOpacity:			0.8,		
			fixedNavigation:		false,		
			imageLoading:			'./webUpload/img/lightbox-ico-loading.gif',		
			imageBtnPrev:			'./webUpload/img/lightbox-btn-prev.gif',			
			imageBtnNext:			'./webUpload/img/lightbox-btn-next.gif',			
			imageBtnClose:			'./webUpload/img/lightbox-btn-close.gif',		
			imageBlank:				'./webUpload/img/lightbox-blank.gif',		
			containerBorderSize:	10,			
			containerResizeSpeed:	400,		
			txtImage:				'Image',	
			txtOf:					'of',		
			keyToClose:				'c',		
			keyToPrev:				'p',		
			keyToNext:				'n',		
			imageArray:				[],
			activeImage:			0,
			appendBody:             "#"+settings.windowId
	 };*/

            // 图片容器
            $queue = $('<ul class="filelist"></ul>')
            .appendTo($wrap.find('.queueList')),

            // 状态栏，包括进度和控制按钮
            $statusBar = $wrap.find('.statusBar'),

            // 文件总体选择信息。
            $info = $statusBar.find('.info'),

            // 上传按钮
            //$upload = $wrap.find('.uploadBtn'),
            $upload = $('#uploadBtn'),

            // 没选择文件之前的内容。
            $placeHolder = $wrap.find('.placeholder'),

            $progress = $('#progressDiv').hide();
            // 添加“添加文件”的按钮，
            uploader.addButton({
                id: '#filePicker2',
                label: '继续添加'
            });
            	
    // 拖拽时不接受 js, txt 文件。
    uploader.on('dndAccept', function(items) {
    });

    //文件选择框打开事件
    uploader.on('dialogOpen', function() {
    });

    //文件加入队列事件
    uploader.on('fileQueued', function(file) {
        Common.fileConfig.fileCount++;
        Common.fileConfig.filesize += Number(file.size);

        if (Common.fileConfig.fileCount === 1) {
            DomObj.placeHolder.addClass('element-invisible');
            DomObj.statusBar.show();
        }
        $(' .filelist:last').show();
        addFile(file);
		setState('ready');
        updateTotalProgress();		
    });
	
	
	uploader.on('fileDequeued',function(file){
		Common.fileConfig.fileCount--;
        Common.fileConfig.filesize -= Number(file.size);

        if (!Common.fileConfig.fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();
	})
	
	 // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
    uploader.on('uploadBeforeSend', function(object, data, headers) {
        data.maxSize = "1024000";
        data.path = "me";
        data.width = "200";
        data.height = "200"; 
        if(!!window.ActiveXObject || "ActiveXObject" in window){
        	 headers['Access-Control-Allow-Origin'] = '*';
             headers['Access-Control-Request-Headers'] = 'content-type';
             headers['Access-Control-Request-Method'] = 'POST';
        }
    });

    //监听上传进度
    uploader.on('uploadProgress', function(file, percentage) {
    	console.info('percentage:' + percentage);
		var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        Common.fileConfig.percentages[file.id][1] = percentage;
        updateTotalProgress();
    });
    
    uploader.on('uploadSuccess',function(file,response){
    	Common.WebUpload.uploadFileData(file,response);
    });
    
    uploader.on('uploadError',function(file,reason){
    	Common.WebUpload.uploadFile();
    });

    //监听所有动作
    var count = 0;
    uploader.on('all', function(type) {
        count = count + 1;
    });

    //监听异常
    uploader.onError = function(code) {
    	var errorCode={};
    	errorCode["F_EXCEED_SIZE"]='单个附件大小超过最大上限8M！';
    	errorCode["Q_EXCEED_NUM_LIMIT"]='单次上传附件数量超过最大上限50个！';
    	errorCode["Q_EXCEED_SIZE_LIMIT"]='单次上传附件总大小超过100M！';
    	errorCode["Q_TYPE_DENIED"]='附件类型不支持！';
    	alert(errorCode[code]);
    };
    
    $("#search_tree_btn").on('click',function(){
    	$("#erecord_tree").tree("search", $("#search_tree").val());
    })
    
    $("#collapseAll_tree").on('click',function(){
    	$("#erecord_tree").tree("collapseAll");
    })
    
     $("#expandAll_tree").on('click',function(){
    	$("#erecord_tree").tree("expandAll");
    })
	
	//------ add
		
		// 当有文件添加进来时执行，负责view的创建
        function addFile(file) {
            var $li = $('<li id="' + file.id + '" title='+file.name+' style="border:4px solid white">' +
                    '<p class="title"></p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress"><span></span></p>' +
                    '<p class="filename" title='+file.name+' >'+file.name+'</p>'+
                    '</li>'),

                $btns = $('<div class="file-panel">' +
				    '<span class="cancel">删除</span>' +
                    '<span class="rotateRight">向右旋转</span>' +
                    '<span class="rotateLeft">向左旋转</span>'+
					'<span class="edit">编辑</span></div>').appendTo($li),
                $prgress = $li.find('p.progress span'),
                $wrap = $li.find('p.imgWrap'),
                $info = $('<p class="error"></p>');
            	$(' .filelist:last').append($li);
                showError = function(files,code) {
                    switch (code) {
                        case 'exceed_size':
                            text = '文件大小超出';
                            break;

                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败，请重试';
                            break;
                    }
                    
                    $('<p class="error"></p>').text(text).appendTo($('#'+files.id));
                };

            if (file.getStatus() === 'invalid') {
                showError(file,file.statusText);
            } else{
                // @todo lazyload
                $wrap.text('预览中');
                uploader.makeThumb(file, function(error, src) {
                    var img,
                    isViewer=false;

                    if (error) {
						//img = $('<img src="./img/other.png">');
						//$wrap.empty().append(img);
                        //$wrap.text('不能预览');
                       // return;
                    }

                    if (Common.WebUpload.util().isSupportBase64()) {						
						var src_ck="";
						if(src==undefined){
							isViewer=false;
							var _ext=file.ext.toLocaleLowerCase();
							if(_ext=="doc"||_ext=="docx"){
								src_ck=Common.WebUpload._getFileConfig().wordBlob;
							}else if(_ext=="xlsx"||_ext=="xls"){
								src_ck=Common.WebUpload._getFileConfig().excelBlob;
							}else if(_ext=="txt"){
								src_ck=Common.WebUpload._getFileConfig().txtBlob;
							}else if(_ext=="zip"||_ext=="rar"){
								src_ck=Common.WebUpload._getFileConfig().rarBlob;
							}else{
								src_ck=Common.WebUpload._getFileConfig().unknowBlob;
							}
						}else if(settings.config.thumbTypes.indexOf(file.ext) != -1){
							isViewer=true;
							src_ck=src;
						}else{
							src_ck=Common.WebUpload._getFileConfig().unknowBlob;
							setState('ready');
						}
						
						if(isViewer){
							img = $("<img class='viewer-imgs' title='"+file.name+"' alt='"+file.name+"' data-original='"+src_ck+"'  src='" + src_ck + "'>");
						}else{
							img = $("<img title='"+file.name+"' alt='"+file.name+"' data-original='"+src_ck+"'  src='" + src_ck + "'>");
						}
                        $wrap.empty();
						$('#'+file.id+' .imgWrap').append(img);
						$(".rightNav").removeClass('rightNav_display');
						initViewer();
						
                    } else {
                        $.ajax('../../server/preview.php', {
                            method: 'POST',
                            data: src,
                            dataType: 'json'
                        }).done(function(response) {
                            if (response.result) {
                                img = $("<img src='" + response.result + "'>");
                                $wrap.empty().append(img);
                            } else {
                                $wrap.text("预览出错");
                            }
                        });
                    }						
                }, thumbnailWidth, thumbnailHeight)
				
                Common.fileConfig.percentages[file.id] = [file.size, 0];
                file.rotation = 0;
            }

            file.on('statuschange', function(cur, prev) {
                if (prev === 'progress') {
                    $prgress.hide().width(0);
                } else if (prev === 'queued') {
                    $li.off('mouseenter mouseleave');
                    $btns.remove();
                }

                // 成功
                if (cur === 'error' || cur === 'invalid') {
                    showError(file,file.statusText);
                    Common.fileConfig.percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError(file,'interrupt');
                } else if (cur === 'queued') {
                    $info.remove();
                    $prgress.css('display', 'block');
                    Common.fileConfig.percentages[file.id][1] = 0;
                } else if (cur === 'progress') {
                    $info.remove();
                    $prgress.css('display', 'block');
                } else if (cur === 'complete') {
                    $prgress.hide().width(0);
                    $li.append("<span class='success'></span>");
                }

                $li.removeClass('state-' + prev).addClass('state-' + cur);
            });

            $li.on('mouseenter', function() {
                $btns.stop().animate({
                    height: 30
                });
            });

            $li.on('mouseleave', function() {
                $btns.stop().animate({
                    height: 0
                });
            });
			
		    $li.on('click',function(){
				if($li.find(' .success').length>0){
					if($li.attr('sel') == null || $li.attr('sel') == undefined || $li.attr('sel') == '0'){
						$li.attr('sel', 1);
						$li.css('border','4px solid rgb(73,102,194)');
						addToArray(file,false);
					}else{
						$li.attr('sel', 0);
						$li.css('border','4px solid white');
						removeFromArray(file,false);
					}
				}	
			});

            $btns.on('click', 'span', function() {
            	if(state=='pedding'){
                	state='ready';
                }
                var index = $(this).index(),
                    deg;

                switch (index) {
                    case 0:
						uploader.removeFile(file);
                        return;
                        
                    case 1:
						file.rotation += 90;
                        break;
                    case 2:
						file.rotation -= 90;
                        break;
					case 3:
						if(!$("#mask").length){
							$("#"+settings.windowId).append("<div id='mask'></div>");	
						}
						$("#mask").addClass("mask").fadeIn("slow");
						$("#settingBox").fadeIn("slow");
						var nameArray=file.name.split(".");
						var postfix=nameArray[nameArray.length-1];
						$("#txtName").val(file.name.substr(0,file.name.length-postfix.length-1));
						$("#postfix").val(postfix);
						$("#remark").val(file.remark);
						//文本框不允许为空---按钮触发
						$("#save").attr('disabled','');
						fileMsg=file;
						$("#save").on('click', function (uploader) {
							var txtName = $("#txtName").val();
							var postfix = $("#postfix").val();
							var remark = $("#remark").val();
							if (txtName == "" || txtName == undefined || txtName == null) {
								$("#warn").css({ display: 'block' });
							}
							else {
								$(".warning").css({ display: 'none' });
								fileMsg.name = (txtName+"."+postfix);
								fileMsg.remark = remark;
								$("#"+file.id).attr('title',fileMsg.name);
								$("#"+file.id+" .filename").attr('title',fileMsg.name);
								$("#"+file.id+" img").attr('title',fileMsg.name);
								$("#"+file.id+" .filename").html(fileMsg.name);
								$("#settingBox").fadeOut("fast");
								$("#mask").css({ display: 'none' });
							}
						});
					    break;
                }
			
                //BUGID:11673  MODIFIED BY GEPANJIANG    --begin
                if (Common.WebUpload.util().isSupportTransition()) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $wrap.css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg});
                } else {
                    $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                }
              //BUGID:11673  MODIFIED BY GEPANJIANG    --END

            });

            $li.appendTo($(' .filelist:last'));	

        }
		
        Common.WebUpload.addCompleteFile=function(file){
			DomObj.placeHolder.addClass('element-invisible');
			$(".rightNav").removeClass('rightNav_display');
			$statusBar.removeClass('element-invisible');
			$(' .filelist:last').show();
            DomObj.statusBar.show();
            if($('#filePicker2').html().indexOf('继续添加')<0){
            	// 添加“继续添加”的按钮，
                uploader.addButton({
                    id: '#filePicker2',
                    label: '继续添加'
                });
            }
           
			 var $li = $('<li id="'+file.id+'" title="" style="border:4px solid white">' +
                    '<p class="title"></p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress"><span></span></p>' +
                    '<p class="filename" title='+file.filename+' >'+file.filename+'</p>'+
					'<span class="success"></span>'+
                    '</li>'),

                $btns = $('<div class="file-panel">' +
				    '<span class="cancel">删除</span>' +
                    '<span class="rotateRight">向右旋转</span>' +
                    '<span class="rotateLeft">向左旋转</span>'+
					'<span class="edit">编辑</span></div>').appendTo($li),
                $prgress = $li.find('p.progress span'),
                $wrap = $li.find('p.imgWrap'),
                $info = $('<p class="error"></p>');
				$(' .filelist:last').append($li);
				var src_ck="";
				var src_rel="";
				var isViewer=false;
				var f_name=file.filename.split('.');
				var _ext=f_name[f_name.length-1].toLocaleLowerCase();
				if(_ext=="doc"||_ext=="docx"){
					src_ck=Common.WebUpload._getFileConfig().wordBlob;
				}else if(_ext=="xlsx"||_ext=="xls"){
					src_ck=Common.WebUpload._getFileConfig().excelBlob;
				}else if(_ext=="txt"){
					src_ck=Common.WebUpload._getFileConfig().txtBlob;
				}else if(_ext=="zip"||_ext=="rar"){
					src_ck=Common.WebUpload._getFileConfig().rarBlob;
				}else if(file.thumbSrc==""){
					src_ck=Common.WebUpload._getFileConfig().unknowBlob;
				}else if(settings.config.thumbTypes.indexOf(_ext) != -1){//图片
					src_rel=Common.WebUpload.getTruePic(file);
					//src_ck='http://172.31.18.151/mloan' + '/' + file.thumbSrc;
					src_ck=src_rel;
					isViewer=true;
				}else{
					src_ck=Common.WebUpload._getFileConfig().unknowBlob;
				}
					
				if(isViewer){
					img = $("<img class='viewer-imgs' title='"+file.filename+"' alt='"+file.filename+"' data-original='"+src_rel+"'  src='" + src_ck + "'>");
				}else{
					img = $("<img title='"+file.filename+"' alt='"+file.filename+"' data-original='"+src_ck+"'  src='" + src_ck + "'>");
				}
                $wrap.empty();
				$('#'+file.id+' .imgWrap').append(img);
				initViewer();
				
				$li.on('mouseenter', function() {
                $btns.stop().animate({
                    height: 30
                });
            });

            $li.on('mouseleave', function() {
                $btns.stop().animate({
                    height: 0
                });
            });
			
		    $li.on('click',function(){
				if($li.find(' .success').length>0){
					if($li.attr('sel') == null || $li.attr('sel') == undefined || $li.attr('sel') == '0'){
						$li.attr('sel', 1);
						$li.css('border','4px solid rgb(73,102,194)');
						addToArray(file,true);
					}else{
						$li.attr('sel', 0);
						$li.css('border','4px solid white');
						removeFromArray(file,true);
					}
				}	
			});
			var rotation=0;
			$btns.on('click', 'span', function() {
                var index = $(this).index(),
                    deg;
				var id = $(this).parent().parent().attr('id');

                switch (index) {
                    case 0:
                    	if(settings.remove)
                    		removeServerFile(file);
                        return;
                        
                    case 1:
                    	if(undefined == file.rotation || null == file.rotation){
                    		file.rotation = 0;
                    	}
                    	file.rotation += 90;
                        break;
                    case 2:
                    	if(undefined == file.rotation || null == file.rotation){
                    		file.rotation = 0;
                    	}
                    	file.rotation -= 90;
                        break;
					case 3:
						if(!$("#mask").length){
							$("#"+settings.windowId).append("<div id='mask'></div>");	
						}
						$("#mask").addClass("mask").fadeIn("slow");
						$("#settingBox").fadeIn("slow");
						var nameArray=file.filename.split(".");
						var postfix=nameArray[nameArray.length-1];
						$("#txtName").val(file.filename.substr(0,file.filename.length-postfix.length-1));
						$("#postfix").val(postfix);
						$("#remark").val();
						fileMsg=file;
						$("#save").on('click', function (uploader) {
							if(!settings.edit){
								return;
							}
							var txtName = $("#txtName").val();
							var postfix = $("#postfix").val();
							var remark = $("#remark").val();
							if (txtName == "" || txtName == undefined || txtName == null) {
								$("#warn").css({ display: 'block' });
							}
							else {
								$(".warning").css({ display: 'none' });
								fileMsg.filename = (txtName+"."+postfix);
								fileMsg.remark = remark;
								Common.WebUpload.updateFileData(fileMsg);
								$("#settingBox").fadeOut("fast");
								$("#mask").css({ display: 'none' });
							}
						});
					    break;
                }
				
                if (Common.WebUpload.util().isSupportTransition()) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $wrap.css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg
                    });
                } else {
                	/*alert($wrap.prop("outerHTML"));
                	alert(file.rotation);*/
                    //$wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                    $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');

                }


            });
			Common.fileConfig.fileCount++;
			Common.fileConfig.filesize=Number(Common.fileConfig.filesize)+Number(file.filesize);
			updateStatus();
		};
		
		 Common.WebUpload.replaceFile=function(bfFile,afFile){
			 Common.fileConfig.filesize=(Number(Common.fileConfig.filesize)-Number(bfFile.firstSize)+Number(afFile.filesize));
			 var $li= $('#'+bfFile.id);
			 $li.unbind();
			 $btns = $('<div class="file-panel">' +
					    '<span class="cancel">删除</span>' +
	                    '<span class="rotateRight">向右旋转</span>' +
	                    '<span class="rotateLeft">向左旋转</span>'+
						'<span class="edit">编辑</span></div>').appendTo($li);
			 $('#'+bfFile.id+' .filename').attr('title',afFile.filename);
			 $('#'+bfFile.id+' .filename').text(afFile.filename);
			 var f_name=afFile.filename.split('.');
			 var src_ck="";
			 var _ext=f_name[f_name.length-1].toLocaleLowerCase();
			 if(_ext=="doc"||_ext=="docx"){
					src_ck=Common.WebUpload._getFileConfig().wordBlob;
				}else if(_ext=="xlsx"||_ext=="xls"){
					src_ck=Common.WebUpload._getFileConfig().excelBlob;
				}else if(_ext=="txt"){
					src_ck=Common.WebUpload._getFileConfig().txtBlob;
				}else if(_ext=="zip"||_ext=="rar"){
					src_ck=Common.WebUpload._getFileConfig().rarBlob;
				}else if(_ext=="bmp"||_ext=="BMP"){
					src_ck=Common.WebUpload._getFileConfig().bmpBlob;
				}else if(afFile.thumbSrc==""){
					src_ck=Common.WebUpload._getFileConfig().unknowBlob;
				}else if(settings.config.thumbTypes.indexOf(_ext) != -1){//图片
					src_ck=Common.WebUpload.getTruePic(afFile);
				}else{
					src_ck=Common.WebUpload._getFileConfig().unknowBlob;
				}
			 $('#'+bfFile.id+' .imgWrap >img').attr('data-original',src_ck);
			 $li.attr('id',afFile.id);
			 var $wrap = $li.find('p.imgWrap');
			 $li.on('mouseenter', function() {
				 $('#'+$li.attr('id')+' .file-panel').stop().animate({
					 height: 30
		         });
		     });

			 $li.on('mouseleave', function() {
				 $('#'+$li.attr('id')+' .file-panel').stop().animate({
		             height: 0
		         });
		     });
			 $li.on('click',function(){
				if($li.find(' .success').length>0){
					if($li.attr('sel') == null || $li.attr('sel') == undefined || $li.attr('sel') == '0'){
						$li.attr('sel', 1);
						$li.css('border','4px solid rgb(73,102,194)');
						addToArray(afFile,true);
					}else{
						$li.attr('sel', 0);
						$li.css('border','4px solid white');
						removeFromArray(afFile,true);
					}
				}	
			});
			var rotation=0;
			$btns.on('click', 'span', function() {
				var index = $(this).index(),
	            deg;
				var id = $(this).parent().parent().attr('id');

	            switch (index) {
	            	case 0:
	            		if(settings.remove)
	            			removeServerFile(afFile);
	                    return;
	                        
	                case 1:
	                	if(undefined == afFile.rotation || null == afFile.rotation){
	                		afFile.rotation = 0;
                    	}
	                	afFile.rotation += 90;
	                    break;
	                case 2:
	                	if(undefined == afFile.rotation || null == afFile.rotation){
	                		afFile.rotation = 0;
                    	}
	                	afFile.rotation -= 90;
	                    break;
					case 3:
						if(!$("#mask").length){
							$("#"+settings.windowId).append("<div id='mask'></div>");	
						}
						$("#mask").addClass("mask").fadeIn("slow");
						$("#settingBox").fadeIn("slow");
						var nameArray=afFile.filename.split(".");
						var postfix=nameArray[nameArray.length-1];
						$("#txtName").val(afFile.filename.substr(0,afFile.filename.length-postfix.length-1));
						$("#postfix").val(postfix);
						$("#remark").val(afFile.remark);
						fileMsg=afFile;
						$("#save").on('click', function (uploader) {
							if(!settings.edit){
								return;
							}
							var txtName = $("#txtName").val();
							var postfix = $("#postfix").val();
							var remark = $("#remark").val();
							if (txtName == "" || txtName == undefined || txtName == null) {
								$("#warn").css({ display: 'block' });
							}
							else {
								$(".warning").css({ display: 'none' });
								fileMsg.filename = (txtName+"."+postfix);
								fileMsg.remark = remark;
								Common.WebUpload.updateFileData(fileMsg);
								$("#settingBox").fadeOut("fast");
								$("#mask").css({ display: 'none' });
							}
						});
						break;
	               }
					
	               if (Common.WebUpload.util().isSupportTransition()) {
	                   deg = 'rotate(' + afFile.rotation + 'deg)';
	                   $wrap.css({
	                        '-webkit-transform': deg,
	                        '-mos-transform': deg,
	                        '-o-transform': deg,
	                        'transform': deg
	                   });
	                } else {
	                    $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((afFile.rotation / 90) % 4 + 4) % 4) + ')');
	                }
	           });
			updateStatus();
		 };
		 // 负责view的销毁
        function removeServerFile(file) {
			if(confirm("是否确认删除")){
            updateTotalProgress();
			//删除数据库数据
			if($('#'+file.id+' .success').length>0)
				Common.WebUpload.removeFileOnDb(file);
			}
        }
        
        function updateServerFile(file){
        	
        }

        // 负责view的销毁
        function removeFile(file) {
            var $li = $('#' + file.id);

            delete percentages[file.id];
            $li.off().find('.file-panel').off().end().remove();
        }

        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                spans = $progress.children(),
                percent;

            $.each(Common.fileConfig.percentages, function(k, v) {
                total += v[0];
                loaded += v[0] * v[1];
            });

            //total为所有待上传
            percent = total ? loaded / total : 0;
            console.info('percent:' + percent + "  total:" + total + "  loaded:" + loaded);
            
            //spans.eq(0)-->总体进度条上的文本             spans.eq(1)-->总体进度条的进度
            spans.eq(0).text(Math.round(percent * 100) + '%');
            spans.eq(1).css('width', Math.round(percent * 100) + '%');
            updateStatus();
        }

        function updateStatus() {
            var text = '',
                stats;
			stats = uploader.getStats();
            if (state === 'ready') {
                text = '待上传'+(Common.fileConfig.fileCount-$('li').find(' .success').length)+'个文件,'+'已上传' + ($('li').find(' .success').length) + '个文件，共' +
                    WebUploader.formatSize(Common.fileConfig.filesize) + '。';
            } else if (state === 'confirm') {
                if (stats.uploadFailNum||$('li').find(' .success').length) {
                    text = '已成功上传' + stats.successNum + '个文件，' +
                        stats.uploadFailNum + '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>';
                }

            } else {
                text = '共' + Common.fileConfig.fileCount + '个（' +
                    WebUploader.formatSize(Common.fileConfig.filesize) +
                    '），已上传' + ($('li').find(' .success').length) + '个';

                if (stats.uploadFailNum) {
                    text += '，失败' + stats.uploadFailNum + '个';
                }
            }

            $info.html(text);
        }
        Common.WebUpload.updateStatus=function(){
        	updateStatus();
        };

        function setState(val) {
            var file, stats;

            if (val === state) {
                return;
            }

            $upload.removeClass('state-' + state);
            $upload.addClass('state-' + val);
            state = val;

            switch (state) {
                case 'pedding':
                    $placeHolder.removeClass('element-invisible');
                    $placeHolder.css("display","");
                    $queue.hide();
                    $statusBar.addClass('element-invisible');
                    $(".rightNav").addClass('rightNav_display');
                    uploader.refresh();
                    break;

                case 'ready':
                    //$placeHolder.addClass('element-invisible');
                	$placeHolder.css("display","none");
                    $('#filePicker2').removeClass('element-invisible');
                    $queue.show();
                    $statusBar.css('display','');
                    $statusBar.removeClass('element-invisible');
                    uploader.refresh();
                    break;

                case 'uploading':
                    $('#filePicker2').addClass('element-invisible');
                    $progress.show();
                    //$upload.text('暂停上传');
                    break;

                case 'paused':
                    $progress.show();
                    //$upload.text('继续上传');
                    break;

                case 'confirm':
                    $progress.hide();
                    $('#filePicker2').removeClass('element-invisible');
                    //$upload.text('开始上传');
                    
                    stats = uploader.getStats();
                    if (stats.successNum && !stats.uploadFailNum) {
                        setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if (stats.successNum) {
                        //alert('上传成功');
                    } else {
                        // 没有成功的图片，重设
                        state = 'done';
                        location.reload();
                    }
                    break;
            }

            updateStatus();
        }

        uploader.on('all', function(type) {
            var stats;
            switch (type) {
                case 'uploadFinished':
                    setState('confirm');
                    break;

                case 'startUpload':
                    setState('uploading');
                    break;

                case 'stopUpload':
                    setState('paused');
                    break;

            }
        });
		
		$("#fileDownload").on('click', function (uploader) {
			var arr=Common.fileConfig.selFile;
			if(arr.length!=0){
				Common.WebUpload.batchDownLoad();
			}else{
				alert('请选择已上传文件进行下载！');
			}
			return false;
		});

        $upload.on('click', function() {
            if ($(this).hasClass('disabled')) {
                return false;
            }

            if (state === 'ready') {
            	if(uploader.getFiles('inited').length>0||uploader.getFiles('queued').length>0){
            		showMask();
            		Common.WebUpload.uploadFile();//继续上传
            	}else{
            		alert('请选择需要上传的附件！');
            	}		
            } else if (state === 'paused') {
                uploader.upload();
            } else if (state === 'uploading') {
                uploader.stop();
            }
        });

        $info.on('click', '.retry', function() {
        	var errFile= uploader.getFiles('error');
			for(var i=0;i<errFile.length;i++){
				Common.fileConfig.percentages[errFile[i].id] = [errFile[i].size, 0];
			}
            uploader.retry();
        });

        $info.on('click', '.ignore', function() {
			//忽略
			state='pedding';
			var errFile= uploader.getFiles('error');
			for(var i=0;i<errFile.length;i++){
				uploader.removeFile( errFile[i] );
			}
			Common.fileConfig.percentages={};
        });

        $upload.addClass('state-' + state);
        updateTotalProgress();
		//------ end
        $('#selecAll').on('click',function(){
        	var $li=$('.queueList li');
    		for(var i=0;i<$li.length;i++){
    			var fid=$li[i].id;
    			if(($('#'+fid).attr('sel')==null || $('#'+fid).attr('sel')==undefined || $('#'+fid).attr('sel')=='0') && $('#'+fid).find(' .success').length>0)
    				$('#'+fid).trigger("click");
    		}
        });
        
        $("#cancelSelec").on('click',function(){
        	var $li=$('.queueList li');
        	for(var i=0;i<$li.length;i++){
					var fid=$li[i].id;
					if($('#'+fid).attr('sel')=='1'&&$('#'+fid).find(' .success').length>0)
						$('#'+fid).trigger("click");
				}
        });
        
        Common.WebUpload.clear=function(){
        	$(' .filelist:last li').remove();
        	$statusBar.addClass('element-invisible');
        	$(".rightNav").addClass('rightNav_display');
        	$("#filePicker2 > div").eq(1).css({width:"100px",height:'40px'});
        	Common.fileConfig.percentages={};
        	$info.html('');
        };
        
        function addToArray(file,isLoad){
        	var arr=Common.fileConfig.selFile;
        	for(var i=0;i<arr.length;i++){
        		if(isLoad){
        			if(arr[i].id==file.id)
            			return;	
        		}else{
        			if(arr[i].__hash==file.__hash&&arr[i].name==file.name)
            			return;	
        		}
        		
        	}
        	arr[arr.length]=file;
        }
        
        function removeFromArray(file,isLoad){
        	var arr=Common.fileConfig.selFile;
        	for(var i=0;i<arr.length;i++){
        		if(isLoad){
        			if(arr[i].id==file.id)
        				arr.splice(i,1);
        		}else{
        			if(arr[i].__hash==file.__hash&&arr[i].name==file.name)
        				arr.splice(i,1);
        		}
        		
        	}
        }
        Common.fileConfig.removeFromArray=function(file,isLoad){
        	removeFromArray(file,isLoad);
        };
        Common.WebUpload.reset=function(){
        	if(Common.fileConfig.settings.showAddFileBtn){
        		DomObj.placeHolder.removeClass('element-invisible');
        	}else{
        		DomObj.placeHolder.addClass('element-invisible');
        	}
        	DomObj.placeHolder.removeAttr("disabled");
			$statusBar.addClass('element-invisible');
			$(' .filelist:last').show();
        };
        Common.WebUpload.setDisabled=function(){
        	DomObj.placeHolder.addClass('element-invisible');
        	$(".rightNav").addClass('rightNav_display');
			$statusBar.addClass('element-invisible');
			$(' .filelist:last').show();
        };
        Common.WebUpload.removeStatusFile=function(){
        	files= uploader.getFiles();
        	for(var i=0;i<files.length;i++){
        		uploader.removeFile(files[i]);
        	}
        	uploader.resetStats();
        	Common.fileConfig.fileCount=0;
			Common.fileConfig.filesize=0;
			Common.fileConfig.selFile=[];
        };
        
        Common.WebUpload.uploadFile=function(){
        	var queList= uploader.getFiles('queued');
        	var initList= uploader.getFiles('inited');
        	if(queList.length>0){
        		if(Common.fileConfig.percentages[queList[0].id]==undefined)
        			Common.fileConfig.percentages[queList[0].id] = [queList[0].size, 0];
        		uploader.upload(queList[0]);
        	}else if(initList.length>0){
        		if(Common.fileConfig.percentages[initList[0].id]==undefined)
            		Common.fileConfig.percentages[initList[0].id] = [initList[0].size, 0];
            	uploader.upload(initList[0]);
        	}else{
        		hideMask();
        	}
        };
        
        Common.WebUpload.setUploadError=function(file){
        	file.setStatus('error','');
        	$("#"+file.id).find('.success').remove();
        	uploader.setStatsByName("numOfSuccess",uploader.getStats().successNum>0?uploader.getStats().successNum-1:0);
        };
        function showMask(){
        	if(!$("#uploadMask").length){
				$("#"+settings.windowId).append("<div id='uploadMask'></div>");	
			}
			$("#uploadMask").addClass("mask").fadeIn("slow");
			$("#progressDiv").css('z-index','10000' );
        }
        function hideMask(){
        	$("#uploadMask").css({ display: 'none' });
        	$("#progressDiv").css('z-index','0');
        }
        
        function initViewer(){
        	var $viewer=$(".queueList");
        	var options={
        			url:'data-original',
        			appendBody:settings.container.id
        	};
        	$viewer.viewer(options);
        }
        
        //BUGID: 11639  ADDED BY ZHENGWEI      ---- begin
        $("#filePicker2").parent().find("img").on('click',function(){
        	$("#filePicker2").find("label").trigger("click");
        });
        //BUGID: 11639  ADDED BY ZHENGWEI      ---- end
        
};


/**
 * 工具类：用来检测浏览器的某些行为
 * @return Obj
 */
Common.WebUpload.util = function() {
    // 判断浏览器是否支持图片的base64
    var isSupportBase64 = function() {
        var data = new Image();
        var support = true;
        data.onload = data.onerror = function() {
            if (this.width != 1 || this.height != 1) {
                support = false;
            }
        };
        data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        return support;
    };


    // 检测是否已经安装flash，检测flash的版本
    var getFlashVersion = function() {
        var version;

        try {
            version = navigator.plugins['Shockwave Flash'];
            version = version.description;
        } catch (ex) {
            try {
                version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                    .GetVariable('$version');
            } catch (ex2) {
                version = '0.0';
            }
        }
        version = version.match(/\d+/g);
        return parseFloat(version[0] + '.' + version[1], 10);
    };

    //检测浏览器是否支持图片旋转
    var isSupportTransition = function() {
        var s = document.createElement('p').style,
            r = 'transition' in s ||
            'WebkitTransition' in s ||
            'MozTransition' in s ||
            'msTransition' in s ||
            'OTransition' in s;
        s = null;
        return r;
    };

    //若IE浏览器不支持flash,则检测flash并提示更新
    var checkFlash = function() {
        if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {
            var flashVersion = getFlashVersion();
            if (flashVersion) {
            } else { // 没有安装flash。
                alert('您的IE没有安装flash！请安装flash后再尝试上传或者使用chrome进行上传！');
                return false;
            }
        } else if (!WebUploader.Uploader.support()) {
            alert('您的浏览器不支持文件上传!');
            return false;
        }

        return true;
    };

    return {
        isSupportBase64: isSupportBase64,
        getFlashVersion: getFlashVersion,
        isSupportTransition: isSupportTransition,
        checkFlash: checkFlash
    };
};

//更新上传完成文件信息
Common.WebUpload.updateFileData=function(file){
	$.ajax({
		type:'POST',
		url:'/mloan/ERecordAction.do?method=uploadFileData',
		data:{
			id:file.id,
			fileRName:file.filename,
			remark:file.remark
		},
		dataType:'json',
		success:function(data){
			$("#"+data.data.id).attr('title',data.data.fileRName);
			$("#"+data.data.id+" .filename").attr('title',data.data.fileRName);
			$("#"+data.data.id+" img").attr('title',data.data.fileRName);
			$("#"+data.data.id+" .filename").html(data.data.fileRName);
			if(data.success){
			}else{
				alert(data.errMsg);
			}
		},
		error:function(){
			alert("操作失败!");
		}
	});
};

//上传成功，保存到数据库
Common.WebUpload.uploadFileData=function(file,response){
	if(response.filePath==undefined){//文件上传失败
		alert("上传失败,错误信息："+response.msg);
		Common.WebUpload.setUploadError(file);
		Common.WebUpload.uploadFile();//继续上传
	}else{
		var filePath=response.filePath;
		filePath=filePath.replace(/\\/g,'/');
		var index=filePath.lastIndexOf("/")+1;
		$.ajax({
			type:'POST',
			url:'/WebUploadAction.do?method=saveFilemsg',
			data:{
				filesize:file.size,
				filename:response.filename,
				filePath:filePath.substr(0,index)
			},
			dataType:'json',
			success:function(data){
				if(data.success){
					alert("文件上传成功!");
					$("#uploadMask").removeClass("mask");
					//Common.WebUpload.uploadThumbFileData(data.data,file);
				}else{
					alert(data.errMsg);
					Common.WebUpload.setUploadError(file);
					Common.WebUpload.uploadFile();//继续上传
				}
			},
			error:function(){
				alert("操作失败!");
			}
		});
	}
};

Common.WebUpload.uploadThumbFileData=function(response,file){
	var compress,
	width=(file._info==undefined)?"":file._info.width,
	height=(file._info==undefined)?"":file._info.height;
	//BUGID:11686   MODIFIED BY ZHENGWEI   ----begin
	if(file._compressed!=undefined&&file._info!=undefined){
		if(Common.fileConfig.uploader.options.compress.width>1){
			width=(Common.fileConfig.uploader.options.compress.width)/file._info.width;
		}else if(Common.fileConfig.uploader.options.compress.width>0){
			width=Common.fileConfig.uploader.options.compress.width;
		}
		if(Common.fileConfig.uploader.options.compress.height>1){
			height=(Common.fileConfig.uploader.options.compress.height)/file._info.height;
		}else if(Common.fileConfig.uploader.options.compress.height>0){
			height=Common.fileConfig.uploader.options.compress.height;
		}
		compress=(width>height)?height:width;
		compress=(compress>1)?1:compress;
		width=Math.round(file._info.width*compress);
		height=Math.round(file._info.height*compress);
	}
	//BUGID:11686   MODIFIED BY ZHENGWEI   ----end
	
	
	$.ajax({
		type:'POST',
		url:'/mloan/ERecordAction.do?method=SaveThumbData',
		data:{
			filesize:file.size,
			fileRName:response.fileRName,
			fileVName:response.fileVName,
			filePath:response.filePath,
		},
		dataType:'json',
		success:function(data){
			Common.WebUpload.getFileByNo(response.id,file);
			Common.WebUpload.uploadFile();//继续上传
		},
		error:function(){
			Common.WebUpload.setUploadError(file);
			Common.WebUpload.uploadFile();//继续上传
			alert("操作失败!");
		}
	});
};
//根据上传成功文件编号查询文件信息
Common.WebUpload.getFileByNo=function(id,file){
	$.ajax({
		type:'POST',
		url:'/mloan/ERecordAction.do?method=getThumbList',
		data:{
			custNo:Common.fileConfig.custNo,
			bnNo:Common.fileConfig.bnNo,
			bnType:'10',
			nodeId:Common.fileConfig.nodeId,
			id:id
		},
		dataType:'json',
		success:function(data){
			if(data.total==0){
				return;
			}
			var files=data.root;
			Common.WebUpload.replaceFile(file,files[0]);
		},
		error:function(){
		}
	});
};


//获取已上传成功的文件信息
Common.WebUpload.getCompleteFile= function(settings, uploader,nodeId,bnNo){
	$.ajax({
		type:'POST',
		url:'/WebUploadAction.do?method=getFileList',
		data:{
		},
		dataType:'json',
		success:function(data){
			if(data.data.length==0){
				Common.WebUpload.reset();
				return;
			}
			var file=data.data;
			for(var i=0;i<file.length;i++){
				Common.WebUpload.addCompleteFile(file[i]);
			}
		},
		error:function(){
			alert("操作失败!");
		}
	});
};

Common.WebUpload.getTruePic=function(file){
	var filePath2= 'http://localhost:8080/WebUploadAction.do?method=getFile&filename=' + file.filename;
	return filePath2;
};

//删除服务器附件
Common.WebUpload.removeFileOnDb =function(file){
	$.ajax({
		type:'POST',
		url:'/WebUploadAction.do?method=removeFile',
		data:{
			id:file.id,
			filename:file.filename
		},
		dataType:'json',
		success:function(data){
			if(data.success){
				Common.fileConfig.removeFromArray(file,true);
				Common.fileConfig.fileCount--;
				Common.fileConfig.filesize -= Number(file.filesize);
				if (!Common.fileConfig.fileCount) {
					$('#' + Common.fileConfig.settings.domId).find('.uploadBtn').removeClass('state-complete');
					$('#' + Common.fileConfig.settings.domId).find('.uploadBtn').addClass('state-pedding');
					$('#' + Common.fileConfig.settings.domId).find('.placeholder').removeClass('element-invisible');
					$('#' + Common.fileConfig.settings.domId).find('.filelist:last').hide();
					$('#' + Common.fileConfig.settings.domId).find('.statusBar').addClass('element-invisible');
					$("#dndArea div[id^='rt']").css('left','40%');
					$('#'+file.id).off().find('.file-panel').off().end().remove();
				}
				 $('#' + file.id).off().find('.file-panel').off().end().remove();
				 if($(".filelist:last>li").length==0)
				 	$(".rightNav").addClass('rightNav_display');
				 Common.WebUpload.updateStatus();
			}else{
				alert(data.errMsg);
			}
		},
		error:function(){
			alert("操作失败!");
		}
	});
};

/**
 * 根据电子档案编号查询树
 */
Common.WebUpload.Tree=function(bnNo,modelId){
	$.ajax({
		async : true,
		cache : false,
		type : "POST",
		dataType : "json",
		url : "/mloan/ERecordAction.do?method=getTreeNodeList",
		data:{
			bnNo:bnNo, // 业务编号
			modelId:modelId
		},
		beforeSend: function(){
		},
		success : function(data) {
			Common.WebUpload.crtTree(data,bnNo);
		}
	});
};

Common.WebUpload.crtTree=function(obj,bnNo){
	$('#erecord_tree').tree({
		data:obj,
		onClick:function(node){
			Common.WebUpload.clear();
			$("#dndArea div[id^='rt']").css('left','40%');
			$("#dndArea div[id^='rt'] label").css('height','100%');
			Common.WebUpload.removeStatusFile();
			if(node.isLeaf=='Y'&&node.children.length==0){
				$('.queueList').css('opacity','1');
				if(Common.fileConfig.settings.showAddFileBtn){
					$('#' + Common.fileConfig.settings.domId).find('.placeholder').removeClass('element-invisible');
				}else{
					$('#' + Common.fileConfig.settings.domId).find('.placeholder').addClass('element-invisible');
				}
				Common.fileConfig.nodeId=node.id;
				Common.fileConfig.nodeTxt=node.text;
				Common.WebUpload.getCompleteFile(Common.fileConfig.settings,Common.fileConfig.uploader,node.id,bnNo);
			}else{
				$("#dndArea div[id^='rt'] label").css('height','0');
				//$('.queueList').css('opacity','0.3'); 
				Common.WebUpload.setDisabled();
			}
		}
	});
};

/*===================下载文件 
 * options:{ 
 * url:'',  //下载地址 
 * data:{name:value}, //要发送的数据 
 * method:'post' 
 * } 
 */  	
Common.WebUpload.batchDownLoad = function () {
	var arr=Common.fileConfig.selFile;
	var fileNoList="";
	var hasPic=false;
	for(var i=0;i<arr.length;i++){
		fileNoList+=arr[i].id+",";
		var f_name= arr[i].filename.split(".");
		var _ext= f_name[f_name.length-1].toLocaleLowerCase();
		if(_ext=="jpeg"||_ext=="jpg"||_ext=="png"||_ext=="bmp"||_ext=="gif")
			hasPic=true;
	}
	fileNoList=""+fileNoList.substring(0,fileNoList.length-1);
	var options={
		url:'/WebUploadAction.do?method=batchDownLoad',
		data:{
			fileNoList:fileNoList,
			nodeTxt:decodeURIComponent(Common.fileConfig.nodeTxt)
		},
		method:'post'
	};
	if(false/*hasPic*/){
		var selecBox = '<div id="selecBox">\
        <div class="row1">\
           下载选项<a href="javascript:void(0)" title="关闭窗口" class="close_btn" id="selecBox_closeBtn">×</a>\
        </div>\
        <div class="row">\
        	请选择是否下载原图：</div>\
        <div class="row">\
        	<input id="checkBox_0" type="checkbox" name="downLoadCheck" checked="checked" />原图\
        </div>\
        <div class="row">\
            <a href="#" id="selecBox_ok">确定</a><a href="javascript:void(0)" id="selecBox_cancel">取消</a>\
        </div>\
	    </div>';
		$("#"+Common.fileConfig.settings.windowId).append(selecBox);
		$("#selecBox").fadeIn("slow");
		if(!$("#mask").length){
			$("#"+Common.fileConfig.settings.windowId).append("<div id='mask'></div>");	
		}
		$("#mask").addClass("mask").fadeIn("slow");
		$("#selecBox_ok").on("click",function(){
			$("#selecBox").fadeOut("fast");
			$("#mask").css({ display: 'none' });
			var checked=$("input[name='downLoadCheck']:checked").val();
			if(checked!='on'){
				options={
				url:'/WebUploadAction.do?method=batchDownLoad',
				data:{
					fileNoList:fileNoList,
					nodeTxt:decodeURIComponent(Common.fileConfig.nodeTxt),
					params:'scalerate=0.5'
				},
				method:'post'
				}; 
			}
			var config = $.extend(true, { method: 'post' }, options);  
		    var $iframe = $('<iframe id="down-file-iframe" />');  
		    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');  
		    $form.attr('action', config.url);  
		    for (var key in config.data) {  
		        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');  
		    }  
		    $iframe.append($form);  
		    $(document.body).append($iframe);  
		    $form[0].submit();  
		    $iframe.remove();
		    $("#selecBox").remove();  
			
		});
		
		$("#selecBox_cancel").on("click",function(){
			$("#selecBox").fadeOut("fast");
			$("#mask").css({ display: 'none' });
			$("#selecBox").remove();
		});
		
		$("#selecBox_closeBtn").on("click",function(){
			$("#selecBox").fadeOut("fast");
			$("#mask").css({ display: 'none' });
			$("#selecBox").remove();
		});
	}else{
	
	    //BUGID:11671  MODIFIED BY GEPANJIANG        ----begin
	    var config = $.extend(true, { method: 'post' }, options);  
	    var $iframe = $('<div></div>');    //这里原先中iframe
	    var $form = $('<form method="' + config.method + '" />');  
	    $form.attr('action', config.url);  
	    for (var key in config.data) {  
	        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');  
	    }  
	    
	    
	    //var form = '<form target="down-file-iframe" method="post" action="/mloan/ERecordAction.do?method=batchDownLoad"><input type="hidden" name="fileNoList" value="32000011400000001659"><input type="hidden" name="nodeTxt" value="身份证"></form>';
	    $iframe.append($form);  
	    //var iframe = '<iframe id="down-file-iframe"><form target="down-file-iframe" method="post" action="/mloan/ERecordAction.do?method=batchDownLoad"><input type="hidden" name="fileNoList" value="32000011400000001659"><input type="hidden" name="nodeTxt" value="身份证"></form></iframe>';
	    $(document.body).append($iframe);  
	    $form[0].submit();  
	    $iframe.remove();
	    //BUGID:11671  MODIFIED BY GEPANJIANG        ----end
	}
};	



Common.WebUpload.test=function(){
	$.ajax({
		async : true,
		cache : false,
		type : "POST",
		dataType : "json",
		url : "/WebUploadAction.do?method=getFileList",
		data:{
			filename:'xxxx',
			filesize:1000
		},
		beforeSend: function(){
		},
		success : function(data) {
			alert(data);
		}
	});
};