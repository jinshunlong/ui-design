/**
 * PageComponent，是跟组件
 * @type {*}
 */
var PageComponent = function (json) {
    Component.apply(this, new Array(json));
    this.id = "designer-canvas";
    this.draggable = false;
    this.dropAble = true;
    this.onInitEvent = function () {
        $.$(this).resizable();
        this.makeSelectable();
        this.makeDroppable();
    }
};