/**
 * DIV组件
 * @type {*}
 */
var DIVComponent = function (json) {
    Component.apply(this, new Array(json));
    this.height = 200;
    this.width = 200;
    this.dropAble = true;
    this.onDraw = function () {
        return "";
    };
    this.onInitEvent = function () {
        $.$(this).width($.toPx(this.width)).height($.toPx(this.height));
    }
};

UIComponentTypes.registerType(new ComponentType({
    name: "DIVComponent",
    description: "DIVComponent"
}));