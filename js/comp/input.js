/**
 * 输入框组件
 * @type {*}
 */
var InputComponent = function (json) {
    Component.apply(this, new Array(json));
    this.handles = "e";
    this.height = 25;
    this.width = 200;
    this.onResize = function (event, ui) {
        $("#" + this.id + "_input").width(ui.size.width - 4);
        $.$(this).css({position: "relative", height: "25px"});
    };
    this.onResizeStop = function (event, ui) {
        $.$(this).css({position: "relative", height: "25px"});
    };
    this.onDraw = function () {
        return "<input id='" + this.id + "_input' type='text' style='z-index:1;display: block;width:" + $.toPx(this.width) + "'></input>";
    };
    this.onInitEvent = function () {
        $.$(this).width($.toPx(this.width));
        $("#" + this.id + "_input").width(this.width - 6);
        $("#" + this.id + "_input").height("19px");
    }
};

UIComponentTypes.registerType(new ComponentType({
    name: UIComponentTypes.InputComponent,
    description: UIComponentTypes.InputComponent
}));