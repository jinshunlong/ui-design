/**
 * PageComponent，是跟组件
 * @type {*}
 */
var PageComponent = function (json) {
    Component.apply(this, new Array(json));
    this.onInit = function (json) {
        $($.getJqueryId(this.id)).resizable();
    }

};