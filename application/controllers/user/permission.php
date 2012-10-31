<?php

/**
 * 权限管理
 *
 * @author: weelion <weelion@qq.com>
 * @copyright: Copyright (c) 2012 EIMO Tech All Rights Reserved.
 * @version: $Id:permission.php  2012年10月29日 星期一 16时55分06秒Z $
 */
class User_Permission_Controller extends Base_Controller {

    // 权限列表
    public function action_index() {
    
        return View::make('user.permission.list'); 
    }

    // 权限列表
    public function action_filter() {
    
    }

    // 权限添加
    public function action_add() {
    
        return View::make('user.permission.add');
    }

    // 权限添加处理
    public function action_insert() {
    
        $input = Input::all();

        $rules = Config::get('validation.permission');
        $validation = Validator::make($input, $rules);
        if( $validation->fails() ) {
            exit('有必填未填写');
        } else {
            $data = [
                'description' => Input::get('description'),
                'rule'        => Input::get('rule'),
                ];

            Permission::insert($data);
            Session::flash('tips', '权限添加成功');

            return Redirect::to('user/permission/add');
        }
    }

    // 权限更新
    public function action_edit() {
    
        return View::make('user.permission.edit'); 
    }

    // 权限更新处理
    public function action_update() {
    
    }

    // 权限删除
    public function action_delete() {
    
    }
}
?>
