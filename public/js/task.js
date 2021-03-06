var task_id=0;
//$('.dropdown-menu').dropdown();
$(function() {
    tTable = $('#task_list_table').dataTable({
        bSort: false,
        bProcessing: true,
        bFilter: true,
        bServerSide: true,
        bJQueryUI: false,
        sPaginationType: 'full_numbers',
        sAjaxSource: '/task/filter',
        sDom: '<"H"fl<"clear">>tr<"F"ip>',
        oLanguage: { sUrl: '/js/plugins/tables/lang_cn.txt' },
        aoColumnDefs: [
            { sTitle: "发布人", aTargets: [0], sWidth: '50px'},
            { sTitle: "内容", aTargets: [1] },
            { sTitle: "级别", aTargets: [2], sWidth: '30px' },
            { sTitle: "分配时间", aTargets: [3], sWidth: '110px' },
            { sTitle: "操作", aTargets: [4], bSearchable: false, sClass: "tableActs", sWidth: "100px" },
        ],
        fnRowCallback: function(nRow,aData, iDisplayIndex, iDisplayIndexFull) {
            var id = aData[4];
            var operation = '<a href="/task/info?task_id=' + id + '" class="tablectrl_small bDefault tipS" original-title="详情"><span class="iconb" data-icon=""></span></a>' + 
                            '<a href="javascript:void(0);" data-id="' + id + '" class="tablectrl_small bDefault tipS" original-title="标记处理状态" onclick="handle('+id+')"><span class="iconb" data-icon=""></span></a>';        
            $('td:eq(4)', nRow).html(operation);
            if(aData[0]){
                var username=aData[0];
            }else{
                var username='系统';
            }
            $('td:eq(0)', nRow).html(username);
        },
        fnInitComplete: function() {
            $('.select_action, select[name$="list_table_length"],.checkAll').uniform();
        }
        
    });

    $('#task_finish').dialog({
        autoOpen: false,
        resizable:false,
        modal: true,
        buttons: {
            "已处理": function () {
                var msg = $.trim($('#message').val());
                if(!msg){
                    $('#message').focus();
                    $.jGrowl('请填写备注信息！');
                    return false;
                }
                $.post('/task/hidden',{tasks_id:tasks_id,handle:1,comment:msg},function(response){
                    $.jGrowl(response.message);
                    if(response.status=='success'){
                        $('#message').val('');
                        $(this).dialog("close");
                        location.reload();
                    }
                },'json');
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });
    $('#task_finish_confirm').dialog({
        autoOpen: false,
        resizable:false,
        modal: true,
        buttons: {
            "确认": function () {
                $(this).dialog("close");
                $('#task_finish').dialog('open');
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });
    $('#task_confirm').dialog({
        autoOpen: false,
        resizable:false,
        modal: true,
        buttons: {
            "提交": function () {
                push_task();
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });
    $('#bulidtask').click(function(){
       $('#task_confirm').dialog('open'); 
    });
    $( ".uMin" ).slider({ /* Slider with minimum */
        range: "min",
        value: 0,
        min: 0,
        max: 9,
        slide: function( event, ui ) {
            $( "#task_level" ).val(ui.value );
        }
    });        
});
function handle(id){
    task_id = id;
    $('#task_finish_confirm').dialog('open');
    return false;
}
function push_task(){
    var task_type = $('#task_type option:selected').val();
    var task_entity_id = $('#task_entity_id').val();
    var task_level = $('#task_level').val();
    var task_to_uid =$('#task_to_uid option:selected').val();
    var task_content =$('#task_content').val();
    var task_channel = $('input[name="task_channel"]:checked').val();
    if (task_channel==0) {
        if(empty(task_entity_id)){
            $.jGrowl('请填写实际id！');
            $('#task_level').focus();
            return false;
        }
    }
    if(empty(task_content)){
        $.jGrowl('请填写任务内容！');
        $('#task_content').focus();
        return false;
    }

    task_entity_id = (task_channel==0)?entity_id:task_entity_id;
    var parent_id = (task_channel==0)?task_id:0;

    $.post('/task/insert',{to_uid:task_to_uid,parent_id:parent_id,type:task_type,entity_id:task_entity_id,content:task_content,level:task_level},function(response){
        $('#task_confirm').dialog('close');
            $.jGrowl(response.message);
    },'json');
}