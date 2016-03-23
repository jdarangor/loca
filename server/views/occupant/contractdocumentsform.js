LOCA.ContractDocumentsForm = (function($, moment, i18next) {
    function ContractDocumentsForm() {
        LOCA.Form.call(this, {
            alertOnFieldError: true
        });
    }

    // SUBOBJECT OF FORM
    ContractDocumentsForm.prototype = Object.create(LOCA.Form.prototype);
    ContractDocumentsForm.prototype.constructor = ContractDocumentsForm;

    // METHODS TO OVERRIDE
    ContractDocumentsForm.prototype.getDomSelector = function() {
        return '#contract-documents-form';
    };

    // No add possibility
    // ContractDocumentsForm.prototype.getAddUrl = function() {
    //     return '/documents/add';
    // };

    ContractDocumentsForm.prototype.getUpdateUrl = function() {
        return '/documents/update';
    };

    ContractDocumentsForm.prototype.getDefaultData = function() {
        return {
            _id: '',
            occupantId: '',
            documents: [{name:'', expirationDate:''}]
        };
    };

    ContractDocumentsForm.prototype.getManifest = function() {
        var self = this;
        return {
            'name_0': {
                minlength: 2
            },
            'expirationDate_0': {
                required: {
                    depends: function(/*element*/) {
                        return $(self.getDomSelector() + ' #name_0').val().trim() !== '';
                    }
                },
                fdate: [i18next.t('__fmt_date__')]
            }
        };
    };

    ContractDocumentsForm.prototype.beforeSetData = function(args) {
        var self = this;
        var occupant = args[0];

        this.documentRowCount=0;

        if (occupant.documents) {
            occupant.documents.forEach(function(doc, index) {
                if (doc.expirationDate) {
                    doc.expirationDate = moment(doc.expirationDate).format(i18next.t('__fmt_date__')); //db formtat to display one
                }
                if (index !==0) { // Except first one row still exists
                    self.addDocumentRow();
                }
            });
        }
    };

    ContractDocumentsForm.prototype.afterSetData = function(args) {
        var occupant = args[0];

        $(this.getDomSelector() + ' #occupantNameLabel').html(i18next.t('\'s documents', {name:occupant.name}));
    };

    ContractDocumentsForm.prototype.onGetData = function(data) {
        if (data.documents) {
            data.documents.forEach(function(doc) {
                if (doc.expirationDate) {
                    doc.expirationDate = moment(doc.expirationDate, i18next.t('__fmt_date__')).toDate(); //display format to db one
                }
            });
        }
        return data;
    };

    ContractDocumentsForm.prototype.onBind = function() {
        var self = this;

        // Dynamic property rows
        $(this.getDomSelector() + ' #btn-add-document').click(function() {
            self.addDocumentRow();
            return false;
        });

        // Remove dynamic rows
        $(this.getDomSelector() + ' .form-btn-remove-row').click(function() {
            var $row = $(this).parents('.form-row');
            if (!$row.hasClass('master-form-row')) {
                $row.remove();
            }
            else {
                $(self.getDomSelector() + ' #name_0').val('');
                $(self.getDomSelector() + ' #expirationDate_0').val('');
            }
            return false;
        });

        // TODO: Put this in css
        //$(this.getDomSelector() + ' .master-form-row .form-btn-remove-row').hide();
    };

    ContractDocumentsForm.prototype.addDocumentRow = function() {
        var self = this;
        // Create new property row
        var $newRow;
        var itemDocumentName;
        var itemExpirtationDateName;

        self.documentRowCount++;
        $newRow = $(self.getDomSelector() + ' #documents .master-form-row').clone(true).removeClass('master-form-row');
        $('.has-error', $newRow).removeClass('has-error');
        $('label.error', $newRow).remove();
        itemDocumentName = 'name_'+self.documentRowCount;
        itemExpirtationDateName = 'expirationDate_'+self.documentRowCount;
        $('#name_0',$newRow).attr('id', itemDocumentName).attr('name', itemDocumentName).val('');
        $('#expirationDate_0',$newRow).attr('id', itemExpirtationDateName).attr('name', itemExpirtationDateName).val('');
        $('.form-btn-remove-row',$newRow).show();
        // Add new property row in DOM
        $(self.getDomSelector() + ' #documents').append($newRow);

        //Add jquery validation rules for new added fields
        $('#'+itemDocumentName, $newRow).rules('add', {
            required:true,
            minlength: 2
        });

        $('#'+itemExpirtationDateName, $newRow).rules('add', {
            required: true,
            fdate: [i18next.t('__fmt_date__')]
        });
    };

    return ContractDocumentsForm;
})(window.$, window.moment, window.i18next);

