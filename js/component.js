var ComponentEvent = function () {
    return {
        ON_INIT_VIEW: "ON_INIT_VIEW",
        ON_RESIZE: "ON_RESIZE",
        ON_RESIZE_STOP: "ON_RESIZE_STOP",
        AFTER_ADD_CHILD_VIEW_ON_CHILD: "AFTER_ADD_CHILD_VIEW_ON_CHILD",
        AFTER_ADD_CHILD_VIEW: "AFTER_ADD_CHILD_VIEW",
        AFTER_ADD_CHILD: "AFTER_ADD_CHILD",
        ON_DROP: "ON_DROP",
        ON_DROP_CHILD: "ON_DROP_CHILD",
        ON_DELETE: "Delete",
        ON_COPY: 'Copy',
        ON_CUT: 'Cut',
        ON_UNDO: 'UnDo',
        ON_REDO: 'ReDo',
        ON_SAVE: 'Save',
        ON_SELECT_ALL: 'Select_All',
        ON_PASE: 'Pase',
        ON_MENU_CLICK: "ON_MENU_CLICK",
        AFTER_BASIC_PROP_UPDATE: "AFTER_BASIC_PROP_UPDATE",
        AFTER_UNSELECT: "AFTER_UNSELECT"
    };
}();
/**
 * 组件抽象类,规约：子组件只能实现on开头的方法，只有这些方法是留给子控件使用的
 **/
var Component = function (json) {
    EventHandler.apply(this, []);
    this.type = json.type || "Component"; //控件类型
    this.id = json.id;//控件ID(设计器内使用的id)
    if ($.isBlank(this.id)) {
        this.id = UIComponentTypes.getComponentId(this.type);
    }
    this.name = json.name || json.id; //控件名称(运行时ID,默认为控件id)
    this.width = json.width;//控件宽度
    this.height = json.height;//控件高度
    this.html = json.html || "";//控件初始Html
    this.dropAble = json.dropAble || false;
    this.parentId = $.getDefaultIfNull(json.parentId, UIDesigner.designPanelId);//父控件
    this.parentChildId = $.getDefaultIfNull(json.parentChildId, null);//在父控件中的位置
    this.childIdMap = new HashMap();//子控件集合存储Id
    this.designable = true;//控件可设计
    this.resizable = json.resizable || true;
    this.draggable = json.draggable || true;
    this.droppable = json.droppable || true;
    this.handles = "e, s, se";

    this.childs = json.childs;

    this.hasProperty = true;//是否有属性
    this.hasNoWidth = json.hasNoWidth || false;
    this.hasNoHeight = json.hasNoHeight || false;


    /**
     * 更新属性，同步更新属性框
     */
    this.updateProperty = function (propName, val, type) {
        this.setPropertyValue(propName, val);
        if ('height' == propName) {
            this.resizeWH(null, $.delPx(val));
        }
        if ('width' == propName) {
            this.resizeWH($.delPx(val), null);
        }
        this.onPropertyUpdateView(propName, val);
        this.updatePropertyEditor(propName);
    };
    this.updatePropertyEditor = function (propName) {
    };
    /**
     * 更新控件属性事件
     */
    this.onPropertyUpdateView = function (key, val) {
    };
    this.resizeWH = function (width, height) {
        if (width) {
            $("#" + this.id).width(this.hasNoWidth ? '' : width);
        }
        if (height) {
            $("#" + this.id).height(this.hasNoHeight ? '' : height);
        }
    };
    /**
     * 设置属性值
     */
    this.setPropertyValue = function (name, val) {
        this[name] = val;
    };
    this.getType = function () {
        return UIComponentTypes.getComponentType(this.type);
    };
    this.getParentComp = function () {
        return UIComponentTypes.getComponentById(this.parentId);
    };
    this.getHtml = function () {
        var innerHtml = this.onDraw();
        var dotStyle = "";
//        var dotStyle = "";
//        var actionDiv = "";
        var actionDiv = "<div id=\"" + this.id + "_action\" class=\"comp-action\" style='z-index: 2000;'></div>";
        var wrapper = "<div id=\"" + this.id + "\" style=\"" + dotStyle + ";position:relative;\" class=\"" + this.type + " Component\">" + innerHtml + actionDiv + "</div>";
        return wrapper;
    };
    /**
     * 绘制界面
     * @param json
     */
    this.draw = function () {
        if ($.isArray(this.childs)) {
            var length = this.childs.length;
            for (var i = 0; i < length; i++) {
                var child = this.childs[i];
                var childComp = UIComponentTypes.createComponent(child);
                if (childComp != null) {
                    childComp.parentId = this.id;
                    this.childIdMap.put(childComp.id, childComp.id);
                    var html = childComp.getHtml();
                    if (!$.isBlank(html)) {
                        $($.getJqueryId(this.id)).append(html);
                        childComp.initEvent();
                    }
                    childComp.draw();
                }
            }
        }
        this.onInitEvent();
    };
    this.onDraw = function () {
        return this.html;
    };
    this.initEvent = function () {
        this.makeSelectable();
        if (this.designable) {
            this.makeResizable();
            this.makeDraggable();
            this.makeDroppable();
        }
//        $.$(this).addClass("comp-div");
        this.onInitEvent();
    };
    this.makeResizable = function () {
        if (this.resizable)
            var handles = this.handles;
        $.$(this).resizable({
            containment: "parent",
            handles: handles,
            helper: "ui-resizable-helper",
            resize: function (event, ui) {
                var comp = $(ui.element).comp();
                if (comp != null) {
                    $(ui.element).css({left: 0, top: 0});
                    $(ui.element).css({position: "relative"});
                    comp.onResize(event, ui);
                } else {
                    return false;
                }

            },
            stop: function (event, ui) {
                var comp = $(ui.element).comp();
                if (comp != null) {
                    $(ui.element).css({left: 0, top: 0});
                    comp.width = ui.size.width - 2;// 边框修正
                    comp.height = ui.size.height - 2;
                    $(ui.element).css({position: "relative"});
                    comp.onResizeStop(event, ui);
                }
            }
        });
    };
    this.onResize = function (event, ui) {

    };
    this.onResizeStop = function (event, ui) {

    };
    this.makeSelectable = function () {
        $.$(this).bind("mouseenter", function () {
            var comp = $(this).comp();
            comp._actionOver = true;
        });
        $.$(this).bind("mouseleave", this, function (event) {
            var comp = $(this).comp();
            comp._actionOver = false;
        });
        $.$(this).bind("click", this, function (event) {
            $(document).triggerHandler("click.*");// 模拟触发其它click事件,实际使用过程中发现会拦截点击事件,造成其它模块无法正确完成流程
            return false;
        });
        //单击可选中
        $.$(this).bind("mousedown", this, function (event) {
            $(document).triggerHandler("click.*");// 模拟触发其它click事件,实际使用过程中发现会拦截点击事件,造成其它模块无法正确完成流程
            if (event.which != 1) {
                return false;
            }
            var comp = event.data;
            if (comp._actionOver || !event.ctrlKey) {
                if (!UIDesigner.isSelected(comp)) {
                    UIDesigner.selectComponent(comp);
                }
                return false;
            } else {
                if (!UIDesigner._seletingInComponent) {
                    UIDesigner._seletingInComponent = true;
                    UIDesigner.selectComponent(comp);
                }
                return true;
            }
        });
    };
    /**
     * 判断相等
     */
    this.equals = function (comp) {
        if (comp == null)
            return false;
        if ($.isArray(comp))
            return false;
        return this.id == comp.id;
    };
    /**
     * 取消选中
     */
    this.onUnSelect = function () {
        $.$(this).removeClass("comp-select");
//        $.$(this).addClass("comp-div");
//        $.$(this).find('.cell-select').removeClass('cell-select');
//        this.callEventHandler(ComponentEvent.AFTER_UNSELECT);
    };
    this.onSelect = function () {
        $.$(this).addClass("comp-select");
//        $.$(this).removeClass("comp-div");
    };

    this.makeDraggable = function () {
        if (this.draggable) {
            $("#" + this.id).draggable({
                helper: 'clone',
//                handle:"#" + this.id + "_action",
                containment: "parent",
                appendTo: 'body',
                zIndex: 2000, // 2000以下是控件与调整大小的范围,2000以上是控件箱属性箱,菜单的范围
////                delay:300,
//                scroll:false,
                cursor: "move",
                cursorAt: {top: -2, left: -2},
                start: function () {
                    if ($.isArray(UIDesigner.seletedComponent)) {
                        return false;// 选中多个不允许拖拽,
                    }
                    $(this).css({"display": "none"});// 直接更改style中display,不要使用hide,会破坏样式内的设置
                },
                stop: function () {
                    $(this).css({"display": ""});// 直接删除style中display属性,不要使用show,会破坏样式内的设置
                }
            });
            $.$(this).draggable('option', 'handle', "#" + this.id + "_action");
        }

    };
    /**
     * 获得拖拽的句柄,默认为对象自身
     */
    this.getDragHandle = function () {
        return $.$(this);
    };

    this.makeDroppable = function () {
        if (this.droppable) {
            $.$(this).droppable({
                tolerance: 'pointer', // 鼠标所在位置即为拖拽位置
                accept: function (drag) {
                    var id = drag.attr("id");
                    if (!id)
                        return false;
                    var onDropId = $(this).attr("id");
                    var onDropCop = UIComponentTypes.getComponentById(onDropId);
                    if (onDropCop == null) {
                        return false;
                    }
                    var comp = UIComponentTypes.getComponentById(id);
                    if (comp) {
                        var accept = onDropCop.acceptType(id, null, comp.type);
                        return accept;
                    }
                    return false;
                },
                drop: function (event, ui) {
                    if (UIDesigner.seletedComponent == null) {
                        return;// 没有选中控件不继续下面的操作
                    }
                    var onDropId = $(this).attr("id");
                    var onDropCop = UIComponentTypes.getComponentById(onDropId);
                    if (onDropCop == undefined) {

                        return;// 使用过程中发现这个值会找不到(快速拖拽时),这里增加一个判断
                    }
                    var dropId = ui.draggable.attr("id");
                    var dropCop = UIComponentTypes.getComponentById(dropId);
                    if (dropCop == null) {
                        return;
                    }
                    UIDesigner.justifyReferPosition(event);// 判断位置
                    if ($.isArray(UIDesigner.seletedComponent)) {
                        for (var i = 0; i < UIDesigner.seletedComponent.length; i++) {
                            var sc = UIDesigner.seletedComponent[i];
                            if (!onDropCop.acceptType(sc.id, null, sc.type)) {
                                return;
                            }
                        }
                        onDropCop.onDrop(UIDesigner.seletedComponent);
                    } else {
                        if (onDropCop.acceptType(UIDesigner.seletedComponent.id, null, UIDesigner.seletedComponent.type)) {
                            onDropCop.onDrop(dropCop);
                        }
                    }
                    UIDesigner.alreadyEdit = true;
                }
            });
        }
    }
    /**
     * 获取父控件
     */
    this.getParent = function () {
        return UIComponentTypes.getComponentById(this.parentId);
    };
    /**
     * 删除子控件
     */
    this.removeChild = function (child) {
        if ($.isArray(child)) {
            for (var i = 0; i < child.length; i++) {
                this.childIdMap.remove(child[i].id);
            }
        } else {
            this.childIdMap.remove(child.id);
        }
    };
    /**
     * 拖入子控件
     */
    this.onDrop = function (dropCop, fromAction) {
        UIDesigner.alreadyEdit = true;
        if (dropCop == null) {
            return;
        }
        if ($.isArray(dropCop)) {
            for (var i = 0; i < dropCop.length; i++) {
                var one = dropCop[i];
                one.getParent().removeChild(one);
                one.parentChildId = null;
            }
        } else {
            dropCop.getParent().removeChild(dropCop);
            dropCop.parentChildId = null;
        }
        this.addChild(dropCop);
        this.addChildView(dropCop);
        this.callEventHandler(ComponentEvent.ON_DROP, dropCop);
    };
    /**
     * 添加子控件
     */
    this.addChildView = function (child) {
        var last = UIDesigner.getLastDragOverComponent();
        var orderId = null;
        var i;
        if (last != null && this == last.getParent()) {
            if ($.isArray(child)) {
                var has = false;
                for (i = 0; i < child.length; i++) {
                    if (child[i] == last) {
                        has = true;
                        break;
                    }
                }
                if (!has) {
                    orderId = last.id;
                }
            } else {
                if (child != last) {
                    orderId = last.id;
                }
            }
        }
        if ($.isArray(child)) {
            for (i = 0; i < child.length; i++) {
                if (orderId == null) {
                    $("#" + child[i].id).appendTo("#" + this.id).css({left: 0, top: 0});
                } else {
                    if ('L' == UIDesigner._lastDragOverDirection) {
                        $("#" + orderId).before($("#" + child[i].id));
                    } else {
                        $("#" + orderId).after($("#" + child[i].id));
                    }
                    $("#" + child[i].id).css({left: 0, top: 0});
                }
            }
        } else {
            if (orderId == null) {
                $("#" + child.id).appendTo("#" + this.id).css({left: 0, top: 0});
            } else {
                if ('L' == UIDesigner._lastDragOverDirection) {
                    $("#" + orderId).before($("#" + child.id));
                } else {
                    $("#" + orderId).after($("#" + child.id));
                }
                $("#" + child.id).css({left: 0, top: 0});
            }
        }
        this.callEventHandler(ComponentEvent.AFTER_ADD_CHILD_VIEW, child);
    };
    /**
     * 添加子控件
     */
    this.addChild = function (child) {
        var self = this, i, j;
        var last = UIDesigner.getLastDragOverComponent();
        var orderId = null;
        if (last != null && this == last.getParent() && (child != null && child.id != last.id)) {
            orderId = last.id;// 自己不能与自己相对,必须除去这种情况
        }
        if (orderId == null) {
            if ($.isArray(child)) {
                for (i = 0; i < child.length; i++) {
                    child[i].parentId = this.id;
                    this.childIdMap.put(child[i].id, child[i].id);
                }
            } else {
                this.childIdMap.put(child.id, child.id);
                child.parentId = this.id;
            }
        } else {
            var oldChilds = this.childIdMap.values();
            var childMapTemp = new HashMap();
            var oldChild = null;
            if ($.isArray(child)) {
                for (j = 0; j < oldChilds.length; j++) {
                    oldChild = oldChilds[j];
                    if ("L" == UIDesigner._lastDragOverDirection) {
                        if (oldChild == orderId) {
                            for (i = 0; i < child.length; i++) {
                                child[i].parentId = self.id;
                                childMapTemp.put(child[i].id, child[i].id);
                            }
                        }
                        childMapTemp.put(oldChild, oldChild);
                    } else {
                        childMapTemp.put(oldChild, oldChild);
                        if (oldChild == orderId) {
                            for (i = 0; i < child.length; i++) {
                                child[i].parentId = self.id;
                                childMapTemp.put(child[i].id, child[i].id);
                            }
                        }
                    }
                }
                this.childIdMap = childMapTemp;
            } else {
                for (j = 0; j < oldChilds.length; j++) {
                    oldChild = oldChilds[j];
                    if ("L" == UIDesigner._lastDragOverDirection) {
                        if (oldChild == orderId) {
                            childMapTemp.put(child.id, child.id);
                        }
                        childMapTemp.put(oldChild, oldChild);
                    } else {
                        childMapTemp.put(oldChild, oldChild);
                        if (oldChild == orderId) {
                            childMapTemp.put(child.id, child.id);
                        }
                    }
                }
                this.childIdMap = childMapTemp;
                child.parentId = this.id;
            }
        }
        this.callEventHandler(ComponentEvent.AFTER_ADD_CHILD, child);
    };
    /**
     * 可接收拖入的类型,默认根据dropAble属性进行判断
     */
    this.getAcceptType = function () {
        return this.dropAble ? ".Component:not(.DialogComponent)" : "";// 默认只有page可以拖入对话框控件
    };
    /**
     * 判断能否拖入
     */
    this.acceptType = function (id, childId, type) {
        return $("#" + id).is(this.getAcceptType());
    };

    /**
     * 初始化事件等等
     * @param json
     */
    this.onInitEvent = function () {

    };
}