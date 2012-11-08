<?php

/**
 * 代理商模型
 *
 * @author: william <377658@qq.com>
 * @copyright: Copyright (c) 2012 UFCEC Tech All Rights Reserved.
 * @version: $Id:Agent.php  2012年11月06日 星期二 01时56分34秒Z $
 */
class Agent {

    /**
     * 获取代理商信息
     *
     * @param: $agent_id integer 代理商ID
     * 
     * return object
     */
    public static function info($agent_id) {
        return DB::table('agents')->where('id', '=', $agent_id)->first();
    }

    /**
     * 列表
     *
     * @param: $fields array 字段
     *
     * return object
     */
    public static function filter($fields) {

        return DB::table('agents')->select($fields)->order_by('id', 'DESC');
    }

    /**
     * 添加代理商
     *
     * @param: $data array 数据
     *
     * return void
     */
    public static function insert($data) {
        DB::table('agents')->insert($data);
    }

    /**
     * 更新代理商
     *
     * @param: $agent_id integer 代理商ID
     * @param: $data     array   数据
     *
     * return void
     */
    public static function update($agent_id, $data) {
        DB::table('agents')->where('id', '=', $agent_id)->update($data);
    }

    /**
     * 删除代理商
     *
     * @param: $agent_id integer 代理商ID
     *
     * return void
     */
    public static function delete($agent_id) {
        DB::table('agents')->where('id', '=', $agent_id)->delete();
    }
}

?>