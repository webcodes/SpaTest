define(function(require){
	var stringUtil = require("utils/stringutils");
	var offset;
	var msgClassMap = [
			{type: "success", cssclass: "xemsgr-success"},
			{type: "error", cssclass: "xemsgr-error"},
			{type: "info", cssclass: "xemsgr-info"}
		];
	var createMessageNode = function(msgType, msg, options) {
		var match = $.grep(msgClassMap, function(map, index) {
			return map.type === msgType;
		});
		match = (match && match.length > 0) ? match[0].cssclass : "";
		
		//can be more than one message at a time.stack them
		var $msgArray = $("[id^='msg-container']");
		var msgIndex = $msgArray.length;
		var stackPosition = '';
		if(msgIndex) {
			offset = offset || 0;
			var latestMsgEl = $($msgArray[msgIndex-1]);
			offset = offset + latestMsgEl.height();
			//var position = latestMsgEl.css("position");
			if (/xemsgr-top/.test(options.positionClass)) {
				stackPosition = "style=top:" + offset + 'px';
			}
			else {
				stackPosition = "style=bottom:" + offset + 'px';
			}
		}
		var msgEl = stringUtil.format("<div class='xemsgr-msg'>{0}</div>", msg);
		var msgCloseEl = options.closeButton ? "<button class='xemsgr-close-button'>×</button>" : "";
		var msgwrapper = stringUtil.format("<div id='msg-container-{4}' class='{3}' {5}><div class= '{0}'>{1}{2}</div></div>", [match,msgCloseEl,msgEl, options.positionClass, msgIndex, stackPosition ]);
		
		$(msgwrapper).appendTo($(document.body))
		.fadeIn(options.showDuration, function() {
			//set up event handler for close
			$(".xemsgr-close-button").click(function() {
				var container = $(this).parents("[id^='msg-container']");
				container.stop(true, true);
				offset = offset - container.height();
				container.remove();
			});
		})
		.delay(options.timeOut)
		.fadeOut(options.hideDuration, function(){
		 	offset = offset - $(this).height();
		 	$(this).remove();
		});
	};

	var showError = function(msg, options) {
		showMessage("error", msg, options);
	}
	var showSuccess = function(msg, options) {
		showMessage("success", msg, options);
	}
	var showMessage = function(msgType, msg, options) {
		if (!msg) {
			return;
		}
		var defaultOptions = {
			"closeButton": true,
			"positionClass": "xemsgr-bottom-full",
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "4000"
		};
		if (options) {
			defaultOptions = $.extend(defaultOptions, options);
		}
		msgType = msgType || "info";
		createMessageNode(msgType, msg, defaultOptions);
		//toastr.options = defaultOptions;
		//toastr[msgType](msg);
	};

	return {
		showError : showError,
		showSuccess : showSuccess,
		showMessage : showMessage
	};
});