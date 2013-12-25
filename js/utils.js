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