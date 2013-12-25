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
            json.type = "Component";
        }
    }
};
var ComponentTypes = function () {
    this.types = new HashMap();
    this.registerType = function (componentType) {
        this.types.put(componentType.name, componentType);
    };
    this.getType = function (type) {
        if (type == null) {
            type = "Component";
        }
        return this.types.get(type);
    };
    this.createComponent = function (json) {
        var type = this.getType(json.type);
        return type.createComponent(json);
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

window.ComponentTypes = new ComponentTypes();
ComponentTypes.registerType(new ComponentType({
    name: ComponentType.Component,
    description: ComponentType.Component
}));