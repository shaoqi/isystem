@layout('layout.base')
@section('script')
{{ HTML::script('js/plugins/tables/jquery.dataTables.js') }}
{{ HTML::script('js/user.js') }}
@endsection
@section('sidebar')
    @include('block.sidebar')
@endsection
@section('content')
<!-- Content begins -->    
<div id="content">
    <div class="contentTop">
        <span class="pageTitle"><span class="icon-user-2"></span>用户管理</span>
        <div class="clear"></div>
    </div>

    <!-- Breadcrumbs line begins -->
    <div class="breadLine">
        <div class="bc">
            <ul id="breadcrumbs" class="breadcrumbs">
                <li><a href="{{ URL::base() }}">控制中心</a></li>
                <li class="current"><a href="{{ URL::to('user') }}">用户管理</a></li>
            </ul>
        </div>
        
        <div class="breadLinks">
            <ul>
                <li><a href="#" title=""><i class="icos-list"></i><span>新订单</span> <strong>(+58)</strong></a></li>
                <li><a href="#" title=""><i class="icos-check"></i><span>新任务</span> <strong>(+12)</strong></a></li>
                <li class="has">
                    <a title="">
                        <i class="icos-money3"></i>
                        <span>快捷导航</span>
                        <span><img src="/images/elements/control/hasddArrow.png" alt=""></span>
                    </a>
                    <ul>
                        <li><a href="#" title=""><span class="icos-add"></span>New invoice</a></li>
                        <li><a href="#" title=""><span class="icos-archive"></span>History</a></li>
                        <li class="noBorderB"><a href="#" title=""><span class="icos-printer"></span>Print invoices</a></li>
                    </ul>
                </li>
            </ul>
             <div class="clear"></div>
        </div>
    </div>
    <!-- Breadcrumbs line ends -->

    <!-- Main content bigins -->
    <div class="wrapper">

        <div style="margin-top: 35px">
            <a href="{{ URL::base() }}/user/add" class="buttonM bDefault floatR"><span class="icon-home-5"></span><span>添加用户</span></a>
            <div class="clear"></div>
        </div>

        <!--users begins-->
        <div class="widget">
            <div class="whead"><h6>用户列表</h6><div class="clear"></div></div>
            <div class="shownpars">
                <table cellpadding="0" cellspacing="0" border="0" class="dTable" id="user_list_table"></table>
            </div>
            <script type="text/javascript">
                $(function(){
                    uTable = $('#user_list_table').dataTable({
                        bSort: false,
                        bProcessing: true,
                        bFilter: true,
                        bServerSide: true,
                        bJQueryUI: false,
                        sPaginationType: 'full_numbers',
                        sAjaxSource: '{{ URL::base() }}/user/filter',
                        sDom: '<"H"fl<"clear">>tr<"F"ip>',
                        oLanguage: { sUrl: '/js/plugins/tables/lang_cn.txt' },
                        aoColumnDefs: [
                                { sTitle: "帐号",  aTargets: [0] },
                                { sTitle: "Email", aTargets: [1] },
                                { sTitle: "最后登录IP", aTargets: [2], bSearchable: false },
                                { sTitle: "激活状态",aTargets: [3], bSearchable: false, sWidth: '60px' },
                                { sTitle: "最后登录时间", aTargets: [4], bSearchable: false },
                                { sTitle: "操作", "aTargets": [5], bSearchable: false, sClass: "tableActs", sWidth: '80px' }
                                    ],
                        fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                            var activate = (aData[3] == 1) ? '<span class="fileSuccess"></span>' : '<span class="fileError"></span>';
                            var id = aData[5];
                            var operation = '<a href="/user/edit?user_id=' + id + '" class="tablectrl_small bDefault tipS" original-title="编辑"><span class="iconb" data-icon=""></span></a>' + 
                                            '<a href="javascript:void(0);" data-id="' + id + '" class="tablectrl_small bDefault tipS" original-title="详情"><span class="iconb" data-icon=""></span></a>' +
                                            '<a href="javascript:void(0);" data-id="' + id + '" class="tablectrl_small bDefault tipS" original-title="删除"><span class="iconb" data-icon=""></span></a>';

                            $('td:eq(3)', nRow).html(activate);
                            $('td:eq(5)', nRow).html(operation);
                        },
                });

            });
            </script>
            <div class="clear"></div>
        </div>
        <div id="user-edit-dailog">

        </div>
        <!-- user ends -->
    </div>
    <!-- Main content ends -->
</div>
<!-- Content ends -->    
@endsection