/*!
 * Reference link dialog plugin for Editor.md
 *
 * @file        reference-link-dialog.js
 * @author      HuoHongJian
 * @version     1.0.0
 * @updateTime  2017-02-20
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

        var pluginName   = "opt-dialog";
        var ReLinkId     = 1;

        exports.fn.optDialog = function() {

            var _this       = this;
            var cm          = this.cm;
            var lang        = this.lang;
            var editor      = this.editor;
            var settings    = this.settings;
            var cursor      = cm.getCursor();
            var selection   = cm.getSelection();
            var dialogLang  = lang.dialog.referenceLink;
            var classPrefix = this.classPrefix;
            var dialogName  = classPrefix + pluginName, dialog;

            cm.focus();

            if (editor.find("." + dialogName).length < 1)
            {      
                var dialogHTML = '\
                <div class="editormd-form">\
                    <label>标题：</label><input type="text" id="data-title" /><br/>\
                    <label>TAGS：</label><input type="text" id="data-tags" /><br/>\
                    <label>属性：</label>\
                        <span>\
                            <label><input type="checkbox" name="data-recommend" value="true" /> 推荐</label>\
                            <label><input type="radio" name="data-state" value="发表" checked> 发表</label>\
                            <label><input type="radio" name="data-state" value="隐藏" /> 隐藏</label>\
                            <label><input type="radio" name="data-state" value="删除" /> 删除</label>\
                        </span>\
                    <br/>\
                    <label>摘要：</label><textarea id="data-abstract"></textarea><br/>\
                    <label style="float:left;">类别：</label>\
                    <ul id="data-categories"></ul>\
                    <br/>\
                </div>'

                dialog = this.createDialog({
                    footer     : true, //default true, false,  //不显示footer
                    name       : dialogName,
                    title      : '更多信息',//dialogLang.title,
                    width      : 580,
                    height     : 450,
                    content    : dialogHTML,
                    mask       : settings.dialogShowMask,
                    drag       : settings.dialogDraggable,
                    lockScreen : settings.dialogLockScreen,
                    maskStyle  : {
                        opacity         : settings.dialogMaskOpacity,
                        backgroundColor : settings.dialogMaskBgColor
                    },
                    buttons : {
                        enter  : [lang.buttons.enter, function() {
                            if (saveArticle()) {    // defined in edit.js
                                this.hide().lockScreen(false).hideMask();
                            }
                            return false;
                        }],
                        cancel : [lang.buttons.cancel, function() {                                   
                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }]
                    }
                });
                dialog.hide();
                dialog.hideMask();
                dialog.lockScreen(false);
            //    dialog.show();
                

                $('.editormd-opt-dialog .editormd-enter-btn').html('保存');
                optDialogInitFunction(); // defined in edit.js

            }
            else
            {
                dialog = editor.find("." + dialogName);
                // dialog.find("[data-name]").val("[" + ReLinkId + "]");
                // dialog.find("[data-url-id]").val("");
                // dialog.find("[data-url]").val("http://");
                // dialog.find("[data-title]").val(selection);
                this.dialogShowMask(dialog);
                this.dialogLockScreen();
                dialog.show();
            }
            ReLinkId++;
        };

    };
    
    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory;
    }
    else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
        if (define.amd) { // for Require.js

            define(["editormd"], function(editormd) {
                factory(editormd);
            });

        } else { // for Sea.js
            define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
        }
    } 
    else
    {
        factory(window.editormd);
    }

})();
