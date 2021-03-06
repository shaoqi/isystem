initsearch = false;
$(function(){
    sTable = $('#stock_list_table').dataTable({
        bSort: false,
        bProcessing: true,
        bFilter: true,
        bServerSide: true,
        bStateSave: true,
        bJQueryUI: false,
        sPaginationType: 'full_numbers',
        sAjaxSource: '/stock/filter',
        sDom: '<"H"<"#slist_options"l<"clear">><"#slist_search"<"clear">>>tr<"F"ip>',
        oLanguage: { sUrl: '/js/plugins/tables/lang_cn.txt' },
        aoColumnDefs: [
                { sTitle: "名称", aTargets: [0] },
                { sTitle: "仓库", aTargets: [1], sWidth: '80px' },
                { sTitle: "编码", aTargets: [2], sWidth: '100px' },
                { sTitle: "可销售", aTargets: [3], sWidth: '90px' },
                { sTitle: "不可销售", aTargets: [4], sWidth: '90px' },
                { sTitle: "加入时间",aTargets: [5], bSearchable: false, sWidth: '120px' },
                { sTitle: "操作", aTargets: [6], bSearchable: false, sClass: "tableActs", sWidth: '80px' }
            ],
        fnRowCallback: function(nRow, aData, iDisplayIndexFull, iDisplayIndexFull) {
            var title = aData[0];
            var sellable = aData[3];
            var unsellable = aData[4];
            var id = aData[6];

            // 操作
            var operation =  '<a class="tablectrl_small bDefault tipS" action="stock_modify" stock_id="'+id+'" original-title="调整"><span class="iconb" data-icon="&#xe057"></span></a>';
                operation += '<a class="tablectrl_small bDefault tipS" action="stock_adjust" stock_id="'+id+'" original-title="调仓"><span class="iconb" data-icon="&#xe09c"></span></a>';
                operation += '<a class="tablectrl_small bDefault tipS" action="stock_entry_dialog" stock_id="'+id+'" original-title="入库"><span class="iconb" data-icon="&#xe02f"></span></a>';

            $('td:eq(0)', nRow).html('<span field="title'+id+'">' + title + '</span>');
            $('td:eq(1)', nRow).attr('field', 'storage'+id);
            $('td:eq(3)', nRow).html('<span field="sellable'+id+'">' + sellable + '</span>');
            $('td:eq(4)', nRow).html('<span field="unsellable'+id+'">' + unsellable + '</span>');
            $('td:eq(6)', nRow).html(operation).find('.tipS').tipsy({gravity: 's',fade: true, html:true});
        },
        fnDrawCallback: function() {
            $('#stock_list_table').css('width', '100%');
        },
        fnInitComplete: function() {

            // 初始化搜索
            var search = '<div class="formRow" style="border-bottom: none">' +
                         '  <div class="grid1 textR">' +
                         '      <span>名称：</span>' +
                         '  </div>' +
                         '  <div id="filter_stock_name" class="grid2"></div>' +
                         '  <div class="grid1 textR">' +
                         '      <span>编码：</span>' +
                         '  </div>' +
                         '  <div id="filter_stock_code" class="grid2"></div>' +
                         '  <div class="grid1 textR">' +
                         '      <span>仓库：</span>' +
                         '  </div>' +
                         '  <div id="filter_stock_storage" class="grid2"></div>' +
                         '  <div class="grid2">' +
                         '      <span class="buttonS bBlue hand" id="stock_search">搜索</span>' +
                         '      <span class="buttonS bDefault hand" id="stock_search_reset">重置</span>' +
                         '  </div>' +
                         '  <div class="clear"></div>' +
                         '</div>';
            $('#slist_search').html(search);

            $('#stock_list_table_length').addClass('mb15');
            $('.select_action, select[name$="list_table_length"], .checkAll').uniform();
        }
    
    });

    // 搜索选项卡初始化搜索
    $('a[ckey="slist_search"]').click(function() {
        if(!initsearch) initSearch();
    });

    // 搜索
    $('#stock_search').live('click', function() {
    
        $('.stock_search').each(function() {
            var value = $(this).val();
            var index = $(this).attr('index');

            if(value != '') {
                sTable.fnSetFilter(index, value);
            } else {
                sTable.fnSetFilter(index, '');
            }
        });

        sTable.fnDraw();
    });

    // 重置搜索
    $('#stock_search_reset').live('click', function() {
        sTable.fnFilterClear();
    });

    // 库存调整    
    var stock_modify_dialog = $('#stock_modify_dialog');
    stock_modify_dialog.dialog({
        autoOpen: false,
        width: '40%',
        modal: true,
        open: function() {
            var stock_id = stock_modify_dialog.attr('stock_id');
            var title = $('span[field="title'+stock_id+'"]').text();
            var sellable = $('span[field="sellable'+stock_id+'"]').text();
            var unsellable = $('span[field="unsellable'+stock_id+'"]').text();
            $('#ui-dialog-title-stock_modify_dialog').html('库存调整 - ' + title);
            stock_modify_dialog.find('input[name="sellable"]').val(sellable);
            stock_modify_dialog.find('input[name="unsellable"]').val(unsellable);
        },
        buttons: {
            "取消": function() {
                $(this).dialog("close");
            },
            "保存": function() {
                var stock_id = stock_modify_dialog.attr('stock_id');
                var sellable = $('input[name="sellable"]').val();
                var unsellable = $('input[name="unsellable"]').val();
                //console.log(stock_id + ' - ' + sellable + ' - ' + unsellable);
                $.ajax({
                    url: '/stock/modify',
                    type: 'POST',
                    data: {stock_id:stock_id, sellable:sellable, unsellable:unsellable},
                    dataType: 'json',
                    success: function(data) {
                        if(data.message != 'undefined') {
                            $.jGrowl(data.message);
                            if(data.status == 'success') {

                                // 成功后效果stock_modify_dialog
                                var span_sellable = $('span[field="sellable'+stock_id+'"]');
                                var span_unsellable = $('span[field="unsellable'+stock_id+'"]');

                                var differ_sellable = sellable - span_sellable.text();
                                var differ_unsellable = unsellable - span_unsellable.text();
                                if(differ_sellable != 0) {
                                    if(differ_sellable > 0) {
                                        span_sellable.after('<span class="green">(+'+ differ_sellable +')</span>');
                                    } else if(differ_sellable < 0) {
                                        span_sellable.after('<span class="red">('+ differ_sellable +')</span>');
                                    }
                                    span_sellable.next().delay(1500).fadeOut(300, function() {
                                        $(this).remove();
                                        span_sellable.text(sellable);
                                    });
                                }

                                if(differ_unsellable != 0) {
                                    if(differ_unsellable > 0) {
                                        span_unsellable.after('<span class="green">(+'+differ_unsellable+')</span>');
                                    } else if(differ_unsellable < 0){
                                        span_unsellable.after('<span class="red">('+differ_unsellable+')</span>');
                                    }
                                    span_unsellable.next().delay(1500).fadeOut(300, function() {
                                        $(this).remove();
                                        span_unsellable.text(unsellable);
                                    });
                                }
                            }
                        } else {
                            $.jGrowl('未知错误！');
                        }
                    },
                    error: function() {
                        $.jGrowl('请求失败！');
                    }
                });
                $(this).dialog("close");
            }
        }
    });

    // 调整
    $('a[action="stock_modify"]').live('click', function() {
        var id = $(this).attr('stock_id');
        stock_modify_dialog.attr('stock_id', id);
        stock_modify_dialog.dialog('open');
    });

    // 调仓对话框
    var stock_adjust_dialog = $('#stock_adjust_dialog');
    stock_adjust_dialog.dialog({
        autoOpen: false,
        width: '40%',
        modal: true,
        open: function()
        {
            var stock_id = stock_adjust_dialog.attr('stock_id');
            var title = $('span[field="title'+stock_id+'"]').text();
            var storage = $('td[field="storage'+stock_id+'"]').text();

            // 重置弹出框
            $('select[name="storage"]').find('option').each(function() {
                var text = $(this).text();
                if(text == storage) {
                    $(this).css('display', 'none');
                }

                $(this).attr('selected', false);
            });
            $.uniform.update('select[name="storage"]');
            $('input[name="quantity"]').val('');

            $('#ui-dialog-title-stock_adjust_dialog').html('调仓 - ' + title);
        },
        buttons: {
            "取消": function() 
            {
                $(this).dialog("close"); 
            },
            "保存": function() 
            {
                var stock_id = stock_adjust_dialog.attr('stock_id');
                var storage_id = $('select[name="storage"]').val();
                var quantity =  $('input[name="quantity"]').val();
                var to_stock_id = $('input[name="stock_id"]:checked').val();
                if(typeof(to_stock_id) == 'undefined') {
                    to_stock_id = $('input[name="to_stock_id"]').val();
                }
                // console.log(stock_id + ' - ' + storage_id + ' - ' + adjust);
                $.ajax({
                    url: '/stock/adjust/do_adjust',
                    type: 'POST',
                    data: {stock_id:stock_id, storage_id:storage_id, quantity:quantity, to_stock_id:to_stock_id},
                    dataType: 'json',
                    success: function(data) 
                    {
                        if(data.message != 'undefined') {
                            $.jGrowl(data.message);

                            if(data.status == 'success') {
                                var span_sellable = $('span[field="sellable'+stock_id+'"]');
                                span_sellable.after('<span class="red">(-'+ quantity +')</span>');
                                span_sellable.next().delay(1500).fadeOut(300, function() {
                                    $(this).remove();
                                    span_sellable.text(span_sellable.text() - quantity);
                                });
                            }
                        }
                    },
                    error: function() 
                    {
                        $.jGrowl('请求错误！');
                    }
                });
                $(this).dialog("close");
            }
        }
    });

    // 调仓
    $('a[action="stock_adjust"]').live('click', function() {
        var id = $(this).attr('stock_id');
        stock_adjust_dialog.attr('stock_id', id);
        $('.stock_list').remove();
        $('#adjust').css('border-bottom', 'none');
        stock_adjust_dialog.dialog('open');
    });

    // 获取仓库库存信息
    $('select[name="storage"]').live('change', function() 
    {
        var storage_id = $(this).val();
        $('.stock_list').remove();
        $('#adjust').css('border-bottom', 'none');
        if(storage_id == '') return;
        var stock_id = stock_adjust_dialog.attr('stock_id');
        $.ajax({
            url: '/stock/info',
            type: 'POST',
            data: {storage_id: storage_id, stock_id:stock_id},
            dataType: 'json',
            success: function(data) 
            {
                if(data.length > 1) {
                    $('#adjust').removeAttr('style');
                    var html = '<div class="formRow stock_list" style="border-bottom: none">';
                    html += '<ul>';
                    for(i in data) {
                        html += '<li><input type="radio" name="stock_id" id="rs'+i+'" value="'+data[i].id+'"/><lable for="rs'+i+'">' + data[i].code + '［可售:'+data[i].sellable+'，不可售:'+data[i].unsellable+'］</lable></li>';

                    }
                    html += '</ul></div>';
                    $('#adjust').after(html);
                    $('#adjust').next().find('input:radio').uniform();
                } else if(data.length > 0) {
                    $('input[name="quantity"]').after('<input class="stock_list" type="hidden" name="to_stock_id" value="'+data[0].id+'"/>');
                } else {
                    $('input[name="quantity"]').after('<input class="stock_list" type="hidden" name="to_stock_id" value=""/>');
                }
            },
            error: function() 
            {
                $.jGrowl('请求错误！');
            }
        });
    });

    // 入库弹出层
    var stock_entry_dialog = $('#stock_entry_dialog');
    stock_entry_dialog.dialog({
        autoOpen: false,
        width: '40%',
        modal: true,
        open: function() {
            var stock_id = stock_entry_dialog.attr('stock_id');
            initEntry(stock_id);
        },
        close: function()
        {
            sTable.fnDraw();
        },
        buttons: {
            "取消": function() 
            {
                $(this).dialog('close');
            }
        }
    });
    
    // 入库
    $('a[action="stock_entry_dialog"]').live('click', function()
    {
        var stock_id = $(this).attr('stock_id');
        stock_entry_dialog.attr('stock_id', stock_id);
        stock_entry_dialog.dialog('open');
    });

    // data table api  重新设置提交数据
    $.fn.dataTableExt.oApi.fnSetServerParams = function(oSettings, fn)
    {
        oSettings.fnServerParams = fn;
    }

    // 调仓入库列表初始化
    eTable = $('#entry_list_table').dataTable({
        bSort: false,
        bFilter: false,
        bServerSide: true,
        sServerMethod: 'POST',
        bJQueryUI: false,
        sAjaxSource: '/stock/adjust/entry',
        sDom: 't',
        oLanguage: { sUrl: '/js/plugins/tables/lang_cn.txt'},
        aoColumnDefs: [
            {aTargets: [0], sTitle: '产品去向', sClass: 'noBorderB'},
            {aTargets: [1], bVisible: false},
            {aTargets: [2], sTitle: '数量', sClass: 'noBorderB textC', sWidth: '60'},
            {aTargets: [3], sTitle: '时间', sClass: 'noBorderB textC', sWidth: '150'},
            {aTargets: [4], sTitle: '操作', sClass: 'tableActs noBorderB', sWidth: '80'},
            {aTargets: [5], bVisible: false},
        ],
        fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull)
        {
            var id = aData[4];
            var to_stock_id = aData[5];

            var to = aData[0] + '[' + aData[1] + ']';
                to += '<span class="icon-arrow-right-2" style="margin-left: 10px; color: #97AF32"></span>';
                to += $('td[field="storage'+to_stock_id+'"]').text();
            
            var operation = '<a class="tablectrl_small bDefault tipS" action="adjust_entry" original-title="入库" adjust_id="'+id+'"><span class="iconb" data-icon="&#xe02f"></span></a>' +
                            '<a class="tablectrl_small bDefault tipS" action="adjust_cancel"  original-title="取消" adjust_id="'+id+'"><span class="iconb" data-icon="&#xe035"></span></a>';
                          
            $('td:eq(0)', nRow).html(to);
            $('td:eq(3)', nRow).html(operation).find('.tipS').tipsy({gravity: 's',fade: true, html:true});
        },
        fnServerParams: function(aoData)
        {
            oSettings = this.fnSettings();
            stock_id = oSettings._iStockId;
            if(typeof(stock_id) != 'undefined')
                aoData.push({name: 'stock_id', value: stock_id});
        }
    });


    // 确认入库操作
    $('a[action="adjust_entry"]').live('click', function()
    {
        var $this = $(this);
        var adjust_id = $this.attr('adjust_id');
        $.ajax({
            url: '/stock/adjust/do_entry',
            type: 'POST',
            data: {adjust_id: adjust_id},
            dataType: 'json',
            success: function(data) 
            {
                if(typeof(data.message) != 'undefined') {
                    $.jGrowl(data.message);
                    if(data.status == 'success') {
                        $this.parent().parent().fadeOut(300, function(){
                            var tbody = $('#entry_list_table > tbody');
                            if(tbody.find('tr:visible').length < 1) {
                                tbody.html('<tr><td colspan="4" class="dataTables_empty">亲，没有了哦！</td></tr>');
                                $('.tipsy').remove();
                            }
                        });
                    }
                } else {
                    $.jGrowl('未知错误！');
                }
            },
            error: function()
            {
                $.jGrowl('请求失败！');
            }
        });
    });

    // 取消入库操作
    $('a[action="adjust_cancel"]').live('click', function()
    {
        var $this = $(this);
        var adjust_id = $this.attr('adjust_id');
        $.ajax({
            url: '/stock/adjust/do_cancel',
            type: 'POSt',
            data: {adjust_id: adjust_id},
            dataType: 'json',
            success: function(data)
            {
                if(typeof(data.message) != 'undefined') {
                    $.jGrowl(data.message);
                    if(data.status == 'success') {
                        $this.parent().parent().fadeOut(300, function() {
                            var tbody = $('#entry_list_table > tbody');
                            if(tbody.find('tr:visible').length < 1) {
                                tbody.html('<tr><td colspan="4" class="dataTables_empty">亲，没有了哦！</td></tr>');
                                $('.tipsy').remove();
                            }
                        });
                        
                    }
                } else {
                    $.jGrowl('未知错误！');
                }
            },
            error: function()
            {
                $.jGrowl('请求失败！');
            }
        });
    });



});

// 调仓入库列表
function initEntry(stock_id)
{
    var oSettings = eTable.fnSettings();
    oSettings._iStockId = stock_id;
    eTable.fnDraw();
}


