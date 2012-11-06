@layout('layout.base')
@section('script')
    {{ HTML::script('js/sale.js') }}
@endsection
@section('sidebar')
    @include('../block.sidebar')
@endsection
@section('content')
<div id="content">
    <div class="contentTop">
        <span class="pageTitle"><span class="icon-user-2"></span>销售列表</span>
        <div class="clear"></div>
    </div>

    <!-- Breadcrumbs line begins -->
    <div class="breadLine">
        <div class="bc">
            <ul id="breadcrumbs" class="breadcrumbs">
                <li><a href="{{ URL::base() }}">控制中心</a></li>
                <li><a href="{{ URL::to('product') }}">产品管理</a></li>
                <li class="current"><a href="{{ URL::to('product/sale') }}">销售列表</a></li>
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

    <!-- Main content begins -->
    <div class="wrapper">
        <div class="widget">
            <div class="whead"><h6>销售列表</h6><div class="clear"></div></div>
            <div class="shownpars">
                <table cellpadding="0" cellspacing="0" border="0" class="dTable" id="sale_list_table"></table>
            </div>
        </div>
    </div>
    <!-- Main content ends-->
    <script type="text/javascript">
        $(function() {
            sTable = $('#sale_list_table').dataTable({
                bSort: false,
                bProcessing: true,
                bFilter: true,
                bServerSide: true,
                bJQueryUI: false,
                sPaginationType: 'full_numbers',
                sAjaxSource: '/product/sale/filter',
                sDom: '<"H"fl>tr<"F"ip>',
                aoColumnDefs: [
                    { sTitle: "全选", aTargets: [0] },
                    { sTitle: "标题", aTargets: [1] },
                    { sTitle: "SKU", aTargets: [2] },
                    { sTitle: "价格", aTargets: [3] },
                    { sTitle: "渠道", aTargets: [4] },
                    { sTitle: "代理商", aTargets: [5] },
                    { sTitle: "状态", aTargets: [6] },
                    { sTitle: "操作", aTargets: [7] },
                ],
                fnRowCallback: function(nRow,aData, iDisplayIndex, iDisplayIndexFull) {
                    var id = aData[7];
                    var operation = '<ul class="btn-group toolbar">' +
                                   '    <li>' +
                                   '        <a href="/product/category/edit?category_id=' + id + '"  class="tablectrl_small bDefault edit">' +
                                   '            <span class="iconb" data-icon=""></span>' +
                                   '        </a>' +
                                   '    </li>' +
                                   '    <li>' +
                                   '        <a href="javascript:void(0);" data-id="' + id + '" class="tablectrl_small bDefault delete">' +
                                   '            <span class="iconb" data-icon=""></span>' +
                                   '        </a>' +
                                   '    </li>' +
                                   '</ul>';
                    $('td:eq(7)', nRow).html(operation);
                }
            });

        });
    </script>

    <!-- delete confirm begins-->
    <div id="sale_delete_confirm" style="display:none" title="提示">
        <p>你确定下架此产品？</p>
    </div>
    <!-- delete confirm ends-->
</div>
@endsection
