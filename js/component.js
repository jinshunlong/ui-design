/**
 * 组件抽象类
 **/
var Component = function (json) {
    this.type = json.type || "Component"; //控件类型
    this.id = json.id;//控件ID(设计器内使用的id)
    this.name = json.name || json.id; //控件名称(运行时ID,默认为控件id)
    this.width = json.width;//控件宽度
    this.height = json.height;//控件高度
    this.html = json.html || "";//控件初始Html

    this.parentId = $.getDefaultIfNull(json.parentId, UIDesigner.designPanelId);//父控件
    this.parentChildId = $.getDefaultIfNull(json.parentChildId, null);//在父控件中的位置
    this.childIdMap = new HashMap();//子控件集合存储Id
    this.designable = true;//控件可设计
    this.hasProperty = true;//是否有属性

    this.getType = function () {
        return ComponentTypes.getComponentType(this.type);
    };

    /**
     * 留着初始化使用的
     */
    this.init = function (json) {
        this.onInit(json);

    };
}