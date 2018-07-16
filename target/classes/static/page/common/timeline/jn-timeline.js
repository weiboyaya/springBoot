if (!window.Common) {
    Common = {};
}
Common.Timeline = {};

/**
 * 时间轴初始化 依赖jquery和jn-timeline.css
 * @param  {Object} config 传入时间轴配置参数
 */
Common.Timeline.init = function(options) {

    var defaults = {
        container: { //容器
            id: 'timeline',
            isExt: false
        },
        domId: "jn-timeline", //默认为#jn-timeline
        isShowContent: true, //是否显示Content
        isAllRight: false, //Content是否全部显示在右侧
        isShowName: true, //是否显示名称
        nodeConfig: [{ //各个节点的配置
            nodeName: "申请环节", //节点名称
            nodeState: 2, //节点状态：初始状态0(灰色),当前状态1(红色),历史状态2(蓝色),结束状态3(黑色)
            nodeType: "1", //节点类型：1-操作节点 2-审批节点
            nodeFunc: function() {
                alert("click1");
                return false;
            },
            nodeFuncParam: ""
        }, {
            nodeName: "提交预判提交预判",
            nodeState: 2,
            nodeType: "1",
            nodeFunc: function() {
                alert("click2");
                return false;
            },
            nodeFuncParam: ""
        }, {
            nodeName: "提交预判",
            nodeState: 1,
            nodeType: "2",
            nodeFunc: function() {
                alert("click3");
                return false;
            },
            nodeFuncParam: ""
        }, {
            nodeName: "提交预判",
            nodeState: 0,
            nodeType: "1",
            nodeFunc: function() {
                alert("click4");
                return false;
            },
            nodeFuncParam: ""
        }]
    };

    var settings = {}; //global settings

    $.extend(settings, defaults, options);

    Common.Timeline._initHTML(settings);
    Common.Timeline._initNode(settings);
};


Common.Timeline._initHTML = function(options) {
    var timeLineHtmlStr = '<div id=' + options.domId + ' class="jn-timeline"></div>';
    var itemHtmlStr = '';

    $.each(options.nodeConfig, function(index, value) {
        itemHtmlStr = itemHtmlStr + '<div id="' + options.domId + '-node-' + index + '"class="jn-timeline-item">\
      <div class="jn-timeline-item-icon iconfont icon-shenpiliucheng"></div>\
      <span class="jn-timeline-item-name">' + value.nodeName + '</span>\
      <div class="jn-timeline-item-content">\
      <div class="jn-arrow-left"></div><h1>' + value.nodeName + '</h1><ul class="focusBox clearfix"></ul><div class="jn-timeline-item-content-panel"></div><button>点击进入</button>' + '</div></div>';
    });

    var containerID = '#' + options.container.id;
    var domId = '#' + options.domId;

    //判断容器是否是Ext
    if (options.container.isExt) {
        $(containerID + '>.x-panel-bwrap>.x-panel-body').append(timeLineHtmlStr);
    } else {
        $(containerID).append(timeLineHtmlStr);
    }

    $(domId).append(itemHtmlStr);
};

Common.Timeline._initNode = function(options) {
    var $timeline = $('#' + options.domId),
        $itemGroup = $timeline.find('.jn-timeline-item'),
        $iconGroup = $timeline.find('.jn-timeline-item-icon'),
        $contentGroup = $timeline.find('.jn-timeline-item-content');
    $itemNameGroup = $timeline.find('.jn-timeline-item-name');

    //将最后一个节点的线隐藏
    $('.jn-timeline-item:last-child').addClass('jn-timelime-item-line-hide');

    //是否显示name
    if (!options.isShowName) {
        $itemNameGroup.remove();
    }

    //是否显示Content
    if (!options.isShowContent) {
        $contentGroup.remove();
        $timeline.addClass('jn-timeline-no-content');
        $.each(options.nodeConfig, function(index, value) {
            if (value.nodeType === '2') {
                $itemGroup.eq(index).addClass('jn-timeline-item-small');
            }
            Common.Timeline.nodeStateChange($itemGroup.eq(index), value.nodeState);
            var nodeFunc = options.nodeConfig[index].nodeFunc;
            var nodeFuncParam = options.nodeConfig[index].nodeFuncParam;
            //节点注册click事件
            $iconGroup.eq(index).on('click', function() {
                nodeFunc.call(this, nodeFuncParam);
            });
        });
        return;
    }

    //Content是否都显示在右边。
    if (options.isAllRight) {
        $timeline.addClass('jn-timeline-all-right');
    }

    $.each(options.nodeConfig, function(index, value) {
        if (value.nodeType === '2') {
            $itemGroup.eq(index).addClass('jn-timeline-item-small');
            $contentGroup.eq(index).children('button').remove();
        } else {
            if (!options.isAllRight) {
                $itemNameGroup.eq(index).addClass('jn-timeline-item-name-left');
                $contentGroup.eq(index).css('left', '0');
                $contentGroup.eq(index).find('.jn-arrow-left').removeClass('jn-arrow-left').addClass('jn-arrow-right');
            }
        }
        Common.Timeline.nodeStateChange($itemGroup.eq(index), value.nodeState);

        var nodeFunc = options.nodeConfig[index].nodeFunc;
        var nodeFuncParam = options.nodeConfig[index].nodeFuncParam;

        //[进入按钮]注册click事件
        $itemGroup.eq(index).find('button').on('click', function() {
            nodeFunc.call(this, nodeFuncParam);
        });
        //节点注册click事件
        $iconGroup.eq(index).on('click', function() {
            nodeFunc.call(this, nodeFuncParam);
        });
    });
};

//节点颜色改变
Common.Timeline.nodeStateChange = function($itemDom, nodeState) {
    if (nodeState === 1) {
        $itemDom.children('.jn-timeline-item-icon').removeClass('icon-shenpiliucheng').addClass('icon-liuchengshenpizhong');
        $itemDom.addClass('jn-timeline-item-color-yellow').addClass('jn-timeline-item-current');
    } else if (nodeState === 2) {
        $itemDom.children('.jn-timeline-item-icon').removeClass('icon-shenpiliucheng').addClass('icon-tongguoliucheng');
        $itemDom.addClass('jn-timeline-item-color-blue');
    } else if (nodeState === 3) {
        $itemDom.children('.jn-timeline-item-icon').removeClass('icon-shenpiliucheng').addClass('icon-liuchengbutongguo');
        $itemDom.addClass('jn-timeline-item-color-red');
    }
};

/*
 * 增加节点的子流程和流程日志  add by zhengwei 2016-10-31
 * nodeMsgArr 元节点数组
 * expand  日志信息是否展开(true:展开 false:收起)
 * maxStepNum  最多显示元节点数量
 */
Common.Timeline.nodeChildFlow=function(nodeMsgArr,expand,maxStepNum){
	if(maxStepNum==""||maxStepNum==undefined)//默认值
		maxStepNum=5;
	if(nodeMsgArr==""||nodeMsgArr==undefined){
		nodeMsgArr=[{
			flowIndex: 2,
			msg:[{
				instNo: "83",
				operDesc: "提交预审",
				operName: "微贷客户经理",
				timeStamp: "2016-12-14 15:51:31"
			},{
				instNo: "83",
				operDesc: "预审通过",
				operName: "微贷客户经理",
				timeStamp: "2016-12-14 15:51:44"
			}],
			nodeIndex: "",
			nodeNum: "",
			nodeState: 2
		},{
			flowIndex: 2,
			msg:[{
				instNo: "84",
				operDesc: "提交合规审查",
				operName: "小微贷后台登记",
				timeStamp: "2016-12-14 15:52:38"
			}],
			nodeIndex: "1",
			nodeNum: "3",
			nodeState: 1
		} ];
	}
	
	
	$.each(nodeMsgArr,function(index,flowArr){
		initFlowPoint(flowArr.flowIndex,flowArr.nodeIndex,flowArr.nodeNum,flowArr.nodeState);
		$.each(flowArr.msg,function(msgIndex,msgArr){
			initFlowMsg(flowArr.flowIndex,msgIndex,msgArr);
		});
		
	});
	
	
	function initFlowMsg(index,msgIndex,arr){//生成审批信息
		
		if($(".msg_"+index+"_"+arr.instNo).length==0){
			var operInfo="<ul class='msg_"+index+'_'+arr.instNo+"'><a style=\"cursor:pointer;\">\
			<span class=\"hideOrShow_ico\" ><img class=\"hideOrShow_btn\" src=\"./img/group-collapse.gif\"></span>\
			<span class=\"group_msg_title\">"+arr.timeStamp +"  【"+arr.operName+"】"+arr.operDesc+"<br/></span></a>\
			<hr />\
			</ul>";
			$('#jn-timeline-node-'+index).find('.jn-timeline-item-content-panel').append(operInfo);
			$('.msg_'+index+'_'+arr.instNo).addClass("flowNode_"+arr.instNo);
			
			$('.msg_'+index+'_'+arr.instNo+' a').unbind().on("click",function(){
				if($('.msg_'+index+'_'+arr.instNo+' li').css('display')== 'none'){
					$('.msg_'+index+'_'+arr.instNo+' li').show();
					$('.msg_'+index+'_'+arr.instNo).find(".hideOrShow_btn").attr("src","./img/group-collapse.gif");
				}else{
					$('.msg_'+index+'_'+arr.instNo+' li').hide();
					$('.msg_'+index+'_'+arr.instNo).find(".hideOrShow_btn").attr("src","./img/group-expand.gif");
				}
				
			});
			
			if(!expand){
				$('.msg_'+index+'_'+arr.instNo+' a').trigger('click');
			}
			
			
		}
		$('.msg_'+index+'_'+arr.instNo).append("<li>"+arr.timeStamp+"  【"+arr.operName+"】"+arr.operDesc+"<br/>"+"</li>");
		if(!expand)
			$('.msg_'+index+'_'+arr.instNo+' li').hide();
		
		$('.focusBox li').click(function(){
		 	/*var indexs = $('.focusBox li').index(this);
		 	$('.focusBox li').removeClass('cur').eq(indexs).addClass('cur');
		 	$("#"+this.parentNode.parentNode.parentNode.id).find('.jn-timeline-item-content-panel').children().hide();
		 	//$("#"+this.parentNode.parentNode.parentNode.id).find('.jn-timeline-item-content-panel').children().eq(index).show();
		 	$("#"+this.parentNode.parentNode.parentNode.id).find(".flowNode_"+indexs).show();
		 	*/
		 });//.eq(0).trigger('click');
		
	};
	function initFlowPoint(flowIndex,nodeIndex,nodeNum,nodeState){//生成审批子节点
		var bfOmit=0;
		var afOmit=0;
		if(nodeIndex==""||nodeNum==""||nodeState!='1')
			return;
		var oneSideNum=Math.round(Number(maxStepNum)/2);
		var omitNum=(nodeNum-oneSideNum*2);
		if(/*Number(nodeNum)>Number(maxStepNum)*/false){//暂时不走分支1，由于页面设计效果不佳
			for(var i=1;i<Number(nodeNum)+1;i++){
				var li = "<li></li>";
				if(i<=oneSideNum){
					var $li=$(li).append("<span title='"+i+"'>"+i+"</span>");
					$('#jn-timeline-node-'+flowIndex).find('.focusBox').append($li);
					checkNode(flowIndex,nodeIndex,i,0);
				}else if(i+oneSideNum>nodeNum){
					var $li=$(li).append("<span title='"+i+"'>"+i+"</span>");
					$('#jn-timeline-node-'+flowIndex).find('.focusBox').append($li);
					checkNode(flowIndex,nodeIndex,i,(nodeIndex>oneSideNum&&nodeIndex<=nodeNum-oneSideNum)?omitNum-1:omitNum);
				}else{
					if(i<nodeIndex&&bfOmit==0){
						bfOmit=1;
						$('#jn-timeline-node-'+flowIndex).find('.focusBox').append("<span class='omit-span' title='…'>…</span>");
					}else if(i==nodeIndex){
						var li = "<li></li>";
						var $li=$(li).append("<span title='"+i+"'>"+i+"</span>");
						var $li=$li.append("<div class='current-node-index' title='当前位置'><img src='./page/mloan/img/dqwz.png' /></div>");
						$('#jn-timeline-node-'+flowIndex).find('.focusBox').append($li);
				    	$('#jn-timeline-node-'+flowIndex).find('.focusBox li').eq(i-1).addClass("current-point").addClass("cur");
				    }else if(i>nodeIndex&&afOmit==0){
				    	afOmit=1;
				    	$('#jn-timeline-node-'+flowIndex).find('.focusBox').append("<span class='omit-span' title='…' >…</span>");
				    }
				}
			}
		}else{
			for(var i=1;i<Number(nodeNum)+1;i++){
				var $li = $("<li></li>");
				//var $li=$(li).append("<span title='"+i+"'>"+i+"</span>");
				$('#jn-timeline-node-'+flowIndex).find('.focusBox').append($li);
				checkNode(flowIndex,nodeIndex,i,0);
			}
		}	
	};
	
	function checkNode(flowIndex,nodeIndex,i,omitNum){
		if(i<nodeIndex){
	    	$('#jn-timeline-node-'+flowIndex).find('.focusBox li').eq(i-omitNum-1).addClass("history-point");
	    }else if(i==nodeIndex){
	    	//$('#jn-timeline-node-'+flowIndex).find('.focusBox li').eq(i-omitNum-1).append("<div class='current-node-index' title='当前位置'><img src='./page/mloan/img/dqwz.png' /></div>");
	    	$('#jn-timeline-node-'+flowIndex).find('.focusBox li').eq(i-omitNum-1).addClass("current-point").addClass("cur");
	    }else if(i>nodeIndex){
	    	$('#jn-timeline-node-'+flowIndex).find('.focusBox li').eq(i-omitNum-1).addClass("future-point");
	    }
	}
};
