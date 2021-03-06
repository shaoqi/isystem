<?php

/**
 * 任务模型
 *
 * @author: william <377658@qq.com>
 * @copyright: Copyright (c) 2012 UFCEC Tech All Rights Reserved.
 * @version: $Id:Tasks.php  2012年11月06日 星期二 17时12分47秒Z $
 */
class Tasks {

    /**
     * 任务列表
     *
     * @param: $fields array 字段
     *
     * return object
     */
    public static function filter($fields, $filter = []) {
        $query = DB::table('tasks')->left_join('users', 'tasks.from_uid', '=', 'users.id')
                                   ->select($fields);

        foreach ($filter as $key => $value) {
            if(!empty($value)){
                $query = $query->where($key, '=', $value);
            }
        }

        return $query;
    }

    /**
     * 查看任务信息
     *
     * @param: $tasks_id integer 任务id
     *
     * return object
     */
    public static function info($tasks_id){
        return DB::table('tasks')->where('id', '=', $tasks_id)->first();
    }

    /**
     * 新建任务
     *
     * @param: $data array 插入的内容
     *
     * return object
     */
    public static function insert($data){
        return DB::table('tasks')->insert($data);
    }

    /**
     * 更新任务
     *
     * @param: $tasks_id integer 任务的id
     * @param: $fields   array   更新的内容
     *
     * return object
     */
    public static function update($tasks_id, $data){
        return DB::table('tasks')->where('id', '=', $tasks_id)->update($data);
    }

    /**
     * 获取任务的统计
     *
     * @param: $user_id integer 用户id
     *
     * return object
     */
    public static function statistics($user_id=0)
    {
        $fields = [DB::raw('COUNT(`id`) AS total'), 'handle'];
        return DB::table('tasks')->select($fields)->group_by('handle')->get();
    }
}