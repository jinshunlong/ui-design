/**
 * 该类是辅助功能的集合类
 **/

(function ($) {
    /**
     * 如果val为空，返回defaultVal，否则返回val;
     * @param val
     * @param defaultVal
     * @returns {*}
     */
    $.getDefaultIfNull = function (val, defaultVal) {
        if (val == null) {
            return defaultVal;
        }
        return val;
    };
    $.getJqueryId = function (id) {
        return "#" + id;
    };
    $.$ = function (comp) {
        return $($.getJqueryId(comp.id));
    };
    $.fn.extend({
            comp: function () {
                var id = $(this).attr("id");
                var comp = UIComponentTypes.getComponentById(id);
                return comp;
            }
        }
    );
    $.toPx = function (obj) {
        if (obj == null || obj == undefined) {
            return obj;
        }
        var str = '' + obj;
        if (str.indexOf('px') != -1 || str.indexOf('%') != -1) {
            return str;
        }
        return str + 'px';
    };
    $.delPx = function (obj) {
        if (obj == null || obj == undefined) {
            return obj;
        }
        var str = '' + obj;
        var index = str.indexOf('px');
        if (index != -1 && str.indexOf('%') == -1) {
            return str.substring(0, index);
        }
        return str;
    };
    $.isTrue = function (val) {
        switch (typeof val) {
            case "boolean":
                return val;
            case "string" :
                return new String(val).toLowerCase() == "true";
            case "number":
                return val != 0;
            default :
                return val;
        }
    }
    /**
     * 判断空
     * @param obj
     */
    $.isBlank = function (obj) {
        if (obj == null || obj == "" || obj == undefined) {
            return true;
        }
        return false;
    }

})(jQuery);

/**
 * 辅助类入口
 * @param json
 * @constructor
 */
var Utils = function () {
    this.init = function (json) {
        //初始化提示框
        this.messageId = json.messageId || "dialog-message";
        if ($($.getJqueryId(this.messageId)).length == 0) {
            $("body").append("<div id=\"" + this.messageId + "\"></div>")
        }
    }
    /**
     * 弹出提示框
     * @param json
     */
    this.showMessage = function (json) {
        var _json = {
            autoOpen: false,
            title: '消息框',
            model: true,
            width: 500,
            //  closeOnEscape:true,
            buttons: {
                '[关闭]': function () {
                    $(this).dialog('close');
                }
            }
        };
        if (!$.isPlainObject(json)) {
            $($.getJqueryId(this.messageId)).html(json);
        } else {
            if (json.message != null) {
                $($.getJqueryId(this.messageId)).html(json.message);
            }
            _json = $.extend(_json, json);
        }
        $($.getJqueryId(this.messageId)).dialog(_json);
        $($.getJqueryId(this.messageId)).dialog("open");
    };
    this.debug = function (title, msg) {
        $.pnotify({
            title: title,
            text: msg,
            type: 'error',
            shadow: false
        });
    };
    this.confirm = function (json) {
        var _json = {
            autoOpen: false,
            title: '消息框',
            model: true,
            width: 500,
            buttons: {
                '[确定]': function () {
                    if (json.callback != null) {
                        json.callback();
                    }
                    $(this).dialog('close');
                },
                '[取消]': function () {
                    $(this).dialog('close');
                }
            }
        };
        if (!$.isPlainObject(json)) {
            $($.getJqueryId(this.messageId)).html(json);
        } else {
            if (json.message != null) {
                $($.getJqueryId(this.messageId)).html(json.message);
            }
            _json = $.extend(_json, json);
        }
        $($.getJqueryId(this.messageId)).dialog(_json);
        $($.getJqueryId(this.messageId)).dialog("open");
    }
};
window.Utils = new Utils();
/**
 * HashMap数据结构的实现
 * @constructor
 */
var HashMap = function () {
    this._keyArray = new Array();
    this._value = new Object();
    this.put = function (key, value) {
        if (key == null || key == undefined) {
            return;
        }
        this._keyArray.push(key);
        this._value[key] = value;
    };
    this.get = function (key) {
        if (key == null || key == undefined) {
            return null;
        }
        return this._value[key];
    };
    this.containsKey = function (key) {
        if (key == null || key == undefined) {
            return false;
        }
        return this.get(key) == null ? false : true;
    };
    this.remove = function (key) {
        if (key == null || key == undefined) {
            return;
        }
        var index = $.inArray(key, this._keyArray);
        if (index != -1) {
            this._keyArray.splice(index, 1);
            delete this._value[key];
        }

    };
    this.size = function () {
        return this._keyArray.length;
    };
    this.getKeyByIndex = function (index) {
        var size = this.size();
        if (index >= 0 && index < size) {
            var key = this._keyArray[index];
            return key;
        }
        return null;
    };
    this.getValueByIndex = function (index) {
        var size = this.size();
        if (index >= 0 && index < size) {
            var key = this._keyArray[index];
            return this.get(key);
        }
        return null;
    }

}

var EventHandler = function () {
    this._eventHandler = new Object();//控件事件处理
    this._eventHandlerId = 0;//事件处理计数器
    /**
     * 添加一个事件监听处理方法
     */
    this.addEventHandler = function (name, callback, target) {
        if (this._eventHandler[name] == undefined || this._eventHandler[name] == null) {
            this._eventHandler[name] = new Object();
        }
        var eventId = this._eventHandlerId++;
        var temp = new Object();
        temp.target = target;
        temp.callback = callback;
        this._eventHandler[name][eventId] = temp;
        return eventId;
    };

    /**
     * 删除事件监听，eventId为空时删除所有
     */
    this.removeEventHandler = function (name, eventId) {
        if (this._eventHandler[name] == undefined || this._eventHandler[name] == null) {
            return;
        }
        if (eventId == null) {
            this._eventHandler[name] = null;//全部删除
        } else {
            this._eventHandler[name][eventId] = null;
        }
    };

    /**
     * 设置唯一事件监听
     */
    this.setEventHandler = function (name, callback, target) {
        this._eventHandler[name] = new Object();
        var temp = new Object();
        temp.target = target;
        temp.callback = callback;
        this._eventHandler[name]["value"] = temp;
        return "value";
    };
    /**
     * 触发事件
     */
    this.callEventHandler = function (name, data) {
        if (this._eventHandler[name] == undefined || this._eventHandler[name] == null) {
            return;
        }
        var call, events, target;
        events = this._eventHandler[name];
        var args = new Array();
        args.push(data);
        for (var prop in events) {
            if (events[prop] != undefined && events[prop] != null) {
                if (events[prop]["target"] != undefined && events[prop]["target"] != null) {
                    target = events[prop]["target"];
                } else {
                    target = this;
                }
                if (events[prop]["callback"] != undefined && events[prop]["callback"] != null) {
                    call = events[prop]["callback"];
                    call.apply(target, args);
                }
            }
        }
    };
};