/*
 * Add a button to html widget to insert embedded picture into the html widget
 */

var _t = openerp.web._t, _tl = openerp.web._tl;

openerp.html_widget_embedded_picture = function(instance) {

    var QWeb = instance.web.qweb, _t = instance.web._t;
    instance.web.form.FieldTextHtml
            .include({

                init : function() {
                    this._super.apply(this, arguments);
                },

                start : function() {
                    this._super.apply(this, arguments);
                    var self = this;
                    self.add_template_picture_loader();
                    self.focus_on_picture_loader();
                },

                focus_on_picture_loader : function(){
                    var self = this;
                    $("#button_picture_loader", this.$el).click(function() {
                        var dlg = $(QWeb.render('template_form_picture_loader')).dialog({
                            resizable: false,
                        });
                        $("button.filepicker", this.$el).click(
                                function(event){
                                    self.file_selection(dlg);
                        });
                    });
                },
                file_selection: function (dialog) {
                    /*
                     * generate a function for the post form answer allowing to insert
                     * a file from a local selection
                     */
                    dialog.removeClass('has-error').find('.help-block').empty();
                    $('button.filepicker', dialog).removeClass('btn-danger btn-success');

                    var dlg = dialog;
                    var self = this;
                    var callback = _.uniqueId('func_');
                    $('input[name=func]', dialog).val(callback);

                    window[callback] = function (img, error) {
                        delete window[callback];
                        self.file_selected(img, error, dlg);
                    };
                    dialog.submit();
                },

                file_selected: function(img, error, dialog) {
                    /*
                     * img: image to be inserted
                     * error: possible error message
                     * dialog: reference to the open dialog
                     */
                    var self = this;
                    var $button = this.$('button.filepicker');
                    if (!error) {
                        self.insert_and_focus_picture(img);
                        $(dialog).dialog('close');
                    } else {
                        url = null;
                        this.$('form').addClass('has-error')
                            .find('.help-block').text(error);
                        $button.addClass('btn-danger');
                    }
                },

                insert_and_focus_picture : function(content) {
                    /*
                     * pre: content is initialized
                     * post: content is insert into the 'cleditor' text area
                     */
                    var self = this;
                    self.$cleditor.execCommand("inserthtml", content);
                    self.$cleditor.focus();
                },

                add_template_picture_loader : function() {
                    /*
                     * Add qweb to the cleditor toolbar
                     */
                    $(".cleditorToolbar", this.$el).find(".cleditorGroup").eq(-2)
                            .find(".cleditorDivider:last").parent().before(
                                    $(QWeb.render('template_button_picture_loader')));
                },

            });
}