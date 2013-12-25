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
        comp.init(json);
        return comp;
    }
};
var ComponentTypes = function () {
    this.types = new HashMap();
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
        var compType = this.getComponentType(json.type);
        return compType.createComponent(json);
    };
    this.isType = function (comp, type) {
        if (comp.type == type) {
            return true;
        }
        return false;
    }
    this.Component = "Component";
    this.PageComponent = "PageComponent";
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