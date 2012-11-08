@layout('layout.base')
@section('script')
@endsection
@section('sidebar')
    @include('../../block.sidebar')
@endsection
@section('content')
<!-- COntent begins -->
<div id="content">
    <div class="contentTop">
        <span class="pageTitle"><span class="icon-user-2"></span>编辑类别</span>
        <div class="clear"></div>
    </div>

    <!-- Breadcrumbs line begins -->
    <div class="breadLine">
        <div class="bc">
            <ul id="breadcrumbs" class="breadcrumbs">
                <li><a href="{{ URL::base() }}">控制中心</a></li>
                <li><a href="{{ URL::to('product') }}" title="">产品管理</a></li>
                <li><a href="{{ URL::to('product/category') }}" title="">分类管理</a></li>
                <li class="current"><a href="{{ URL::to('product/category/edit') }}/agent/edit" title="">编辑分类</a></li>
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

    <script type="text/javascript">
        $(function(){
            var categories = eval('(' + '{{$categories}}' + ')');
            var category_id = {{ $category->id }};

            var select = '<option value>--请选择--</option>';
            for(var i in categories) {
                select += '<option value="' + categories[i].id + '">' + categories[i].name + '</option>';
            }

            $('#category').html(select);


        });
    </script>

    <!-- Main content bigins -->
    <div class="wrapper">
        <form action="{{ URL::to('product/category/update') }}" method="POST" class="main">
            <fieldset>
                <input type="hidden" name='category_id' value="{{$category->id}}" />
                <div class="widget fluid">
                    <div class="whead"><h6>编辑分类</h6><div class="clear"></div></div>
                    <div class="formRow">
                        <div class="grid3"><label>所在分类：</label></div>
                        <div class="grid9">{{ Category::name($category->id) }}<span id="category_modify" class="ml20 bDefault buttonS">修改</span></div>
                        <div class="clear"></div>
                    </div>
                    <div class="formRow">
                        <div class="grid3"><label>分类名：</label></div>
                        <div class="grid9"><input type="text" name="phone" value="{{ $category->name }}" style="width: 14.89361702%"/></div>
                        <div class="clear"></div>
                    </div>
                    <div class="formRow">
                        <div class="grid3"><label>排序：</label></div>
                        <div class="grid9"><input type="text" name="email" value="{{ $category->sort }}" style="width: 14.89361702%"/></div>
                        <div class="clear"></div>
                    </div>
                    <div class="formRow textC">
                        <span><input type="submit" class="bBlue buttonM" value="保存" /></span>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <!-- Main content ends -->

</div>
@endsection