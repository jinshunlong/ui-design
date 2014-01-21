/**
 * 组件的类型
 * @param json
 * @constructor
 */
var ComponentType = function (json) {
    this.name = json.name;
    this.description = json.description;
    this.wizardUrl = json.wizardUrl;
    this.properties = json.properties;
    this.createComponent = function (json) {
        if (json.type == null) {
            json.type = ComponentTypes.Component;
        }
        var comp = eval("(new " + json.type + "(json))");
        if (comp == null) {
            Utils.showMessage("创建组件:" + json.type + "失败！");
            return null;
        }
        return comp;
    }
};
var ComponentTypes = function () {
    this.types = new HashMap();
    this.components = new HashMap();
    this.compIdMap = new HashMap();
    this.registerType = function (componentType) {
        this.types.put(componentType.name, componentType);
    };
    this.getComponentType = function (type) {
        if (type == null) {
            type = "Component";
        }
        return this.types.get(type);
    };
    this.createComponent = function (json) {
        try {
            var compType = this.getComponentType(json.type);
            var comp = compType.createComponent(json);
            if (comp != null) {
                this.registerComp(comp);
            }
            return comp;
        } catch (e) {
            Utils.showMessage("解析错误：" + e.name + ":" + e.message);
        }
        return null;
    };
    this.isType = function (comp, type) {
        if (comp.type == type) {
            return true;
        }
        return false;
    };
    this.registerComp = function (comp) {
        this.components.put(comp.id, comp);
    };
    this.getComponentById = function (id) {
        return this.components.get(id);
    };
    this.getComponentId = function (type) {
        var index = this.compIdMap.get(type);
        if ($.isBlank(index)) {
            index = 1;
            this.compIdMap.put(type, index);
        } else {
            index++;
            this.compIdMap.put(type, index);
        }
        return type + "_" + index;
    }
    this.Component = "Component";
    this.PageComponent = "PageComponent";
    this.InputComponent = "InputComponent";
};

window.UIComponentTypes = new ComponentTypes();
UIComponentTypes.registerType(new ComponentType({
    name: UIComponentTypes.Component,
    description: UIComponentTypes.Component
}));

UIComponentTypes.registerType(new ComponentType({
    name: UIComponentTypes.PageComponent,
    description: UIComponentTypes.PageComponent
}));

