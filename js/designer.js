/**
 * 设计器的入口类
 *
 **/

var UIDesigner = function () {
    this.designPanelId = null;
    this.designCanvasId = null;
    this.page = null;
    this.init = function (json) {
        if (json == null) {
            json = {type: ComponentTypes.PageComponent};
        }
        this.designPanelId = json.designPanelId || "designer";
        this.designCanvasId = json.designCanvasId || "designer-canvas";
        json.id = this.designCanvasId;
        json.type = UIComponentTypes.PageComponent;
        this.page = window.UIComponentTypes.createComponent(json);
    };
    this.loadFromJson = function (json) {
        this.page = ComponentTypes.createComponent(json);
        if (!ComponentTypes.isType(this.page, ComponentTypes.PageComponent)) {
            Utils.showMessage("json数据错误，无法加载");
        }
    };
};
//将Designer注册到Window上
window.UIDesigner = new UIDesigner();