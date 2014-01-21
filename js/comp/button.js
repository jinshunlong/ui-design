/**
 * 按钮组件
 * @type {*}
 */
var ButtonComponent = function (json) {
    Component.apply(this, new Array(json));
    this.handles = "e";
    this.height = 25;
    this.width = 200;
    this.onResize = function (event, ui) {
        $("#" + this.id + "_input").width(ui.size.width - 14);
        $.$(this).css({position: "relative", height: "25px"});
    };
    this.onResizeStop = function (event, ui) {
        $.$(this).css({position: "relative", height: "25px"});
    };
    this.onDraw = function () {
        return "<button id='" + this.id + "_input' type='text' style='display: block;width:" + $.toPx(this.width) + "'>按钮</button>";
    };
    this.onInitEvent = function () {
        $.$(this).width($.toPx(this.width));
        $("#" + this.id + "_input").width(this.width - 16);
        $("#" + this.id + "_input").height("19px");
    }
};

UIComponentTypes.registerType(new ComponentType({
    name: "ButtonComponent",
    description: "ButtonComponent"
}));