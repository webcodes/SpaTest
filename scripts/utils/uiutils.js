define(function(require){
	var stringUtil = require("utils/stringutils");
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
		
		var msgEl = stringUtil.format("<div class='xemsgr-msg'>{0}</div>", msg);
		var msgCloseEl = options.closeButton ? "<button class='xemsgr-close-button'>×</button>" : "";
		var msgwrapper = stringUtil.format("<div id='msg-container' class='{3}'><div class= '{0}'>{1}{2}</div></div>", [match,msgCloseEl,msgEl, options.positionClass ]);
		$(msgwrapper).appendTo($(document.body))
		.fadeIn(options.showDuration, function() {
			//set up event handler for close
			$(".xemsgr-close-button").click(function() {
				var container = $("#msg-container");
				container.stop(true, true);
				container.remove();
			});
		})
		.delay(options.timeOut)
		.fadeOut(options.hideDuration, function(){
		 	$("#msg-container").remove();
		});
	};

	var showError = function(msg, options) {
		showMessage("error", msg, options);
	}
	var showSuccess = function(msg, options) {
		showMessage("success", msg, options);
	}
	var showMessage = function(msgType, msg, options) {
		if (!msg)
			return;
		var defaultOptions = {
			"closeButton": true,
			"positionClass": "xemsgr-top-full",
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