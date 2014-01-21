/**
 * 设计器的入口类
 *
 **/

var Designer = function () {
    EventHandler.apply(this, []);
    this.designPanelId = null;
    this.designCanvasId = null;
    this.page = null;
    this.seletedComponent = null;
    this._seletingInComponent = false;

    /**
     * 取消选中控件
     */
    this.unSelectAllComponents = function () {
        if (this.seletedComponent == null) {
            return;
        }
        if (!$.isArray(this.seletedComponent)) {
            this.seletedComponent.onUnSelect();
        } else {
            for (var i = 0; i < this.seletedComponent.length; i++) {
                var comp = this.seletedComponent[i];
                comp.onUnSelect();
            }
        }
    };
    /**   * 判断是否选中，comp可以是Array
     */
    this.isSelected = function (comp) {
        if (this.seletedComponent == null) {
            return false;
        }
        if (!$.isArray(this.seletedComponent)) {
            if (!$.isArray(comp)) {
                return this.seletedComponent == comp;
            } else {
                return ($.inArray(this.seletedComponent, comp) != -1);
            }
        } else {
            if (!$.isArray(comp)) {
                return ($.inArray(comp, this.seletedComponent) != -1);
            } else {
                for (var i = 0; i < this.seletedComponent.length; i++) {
                    var onecomp = this.seletedComponent[i];
                    if ($.inArray(comp, onecomp) == -1) {
                        return false;
                    }
                }
                return true;
            }
        }
    };
    /**
     * 设置最后一次DragOver的控件
     */
    this.setLastDragOverComponent = function (comp) {
        this._lastDragOverComp = comp;
        this._lastDragOverDirection = 'R';
    };
    /**
     * 获取最后一次DragOver的控件
     */
    this.getLastDragOverComponent = function () {
        if (this._lastDragOverComp != null && UIComponentTypes.getComponentById(this._lastDragOverComp.id) == null) {
            this._lastDragOverComp = null;
        }
        return this._lastDragOverComp;
    };
    this.justifyReferPosition = function (event) {
        // 鼠标移动时判断是否超过控件的一半,认为在后面添加
        var component = this.getLastDragOverComponent();
        if (component != null) {
            var over = $("#" + component.id);
            if (event.clientX > (over.offset().left + (over.width() / 2))) {
                this._lastDragOverDirection = 'R';
            } else {
                this._lastDragOverDirection = 'L';
            }
        }
    };
    /*
     * 选中控件
     */
    this.selectComponent = function (comps, first) {
        if (comps == null) {
            return;
        }
        //排除单个已经被选中的情况
        if (!first && (!$.isArray(this.seletedComponent) && !$.isArray(comps) && comps.equals(this.seletedComponent))) {
            return;
        }
        this.unSelectAllComponents();
        if ($.isArray(comps)) {
            for (var i = 0; i < comps.length; i++) {
                var comp = comps[i];
                comp.onSelect();
            }
            this.seletedComponent = comps;
//            this.callEventHandler(ComponentEvent.EVENT_ON_SELECT);
        } else {
            this.seletedComponent = comps;
            this.seletedComponent.onSelect();
//            this.callEventHandler(IDE.EVENT_ON_SELECT);
        }
    };
    this.init = function (json) {
        if (json == null) {
            json = {type: UIComponentTypes.PageComponent};
        }
        this.designPanelId = json.designPanelId || "designer";
        this.designCanvasId = json.designCanvasId || "designer-canvas";
        json.id = this.designCanvasId;
        json.type = UIComponentTypes.PageComponent;
        this.page = window.UIComponentTypes.createComponent(json);
        this.page.draw();
    };
    this.loadFromJson = function (json) {
        this.page = UIComponentTypes.createComponent(json);
        if (!UIComponentTypes.isType(this.page, UIComponentTypes.PageComponent)) {
            Utils.showMessage("json数据错误，无法加载");
        }
        this.page.draw();
    };
};
//将Designer注册到Window上
window.UIDesigner = new Designer();