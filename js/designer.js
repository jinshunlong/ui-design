/**
 * 设计器的入口类
 *
 **/

var Designer = function () {
    this.designPanelId = null;

    this.page = null;
    this.init = function (json) {
        this.designPanelId = json.designPanelId || "designer";
        if ($($.getJqueryId(this.designPanelId)).length == 0) {
            $("body").append("<div id=\"" + this.designPanelId + "\"></div>")
        }
    };
    this.loadFromJson = function (json) {
        this.page = ComponentTypes.createComponent(json);
        if (!ComponentTypes.isType(this.page, ComponentTypes.PageComponent)) {
            Utils.showMessage("json数据错误，无法加载");
        }
    };
};
//将Designer注册到Window上
window.Desinger = new Designer();