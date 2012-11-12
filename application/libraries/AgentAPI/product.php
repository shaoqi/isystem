<?php
/**
 * 代理商API 产品相关
 * 包含列表 产品上架编辑信息处理
 *
 * @author: shaoqi <shaoqisq123@gmail.com>
 * @copyright: Copyright (c) 2012 UFCEC Tech All Rights Reserved.
 * @version: $Id$
 */
class AgentAPI_product{

    /**
     * 产品列表
     *
     * @param  mixed $params 相关参数至少包含 分页信息
     *
     * @return mixed
     */
    public static function lists($params){
        $fileds = ['p.id', 'min_price', 'max_price', 'weight','size','name'];
        return Product::filter($fileds,'cn')->get();
    }

    /**
     * 产品上架操作以及产品信息的编辑
     *
     * 需要提供 产品id,渠道id,代理商id,语言,单价,标题,关键词，短描述，描述
     *
     * @param array $params 编辑或者插入的数据
     *
     * @return array
     */
    public static function sale($params){
        $data_key = [
            'product_id', 'channel_id', 'agent_id', 'language', 'price', 
            'title', 'keywords', 'short_description', 'description'
        ];
        $data = [];
        foreach($data_key as $value){
            if(isset($params[$value])){
                if(empty($params[$value])){
                    throw new Exception($value.' is null');
                }else{
                    $data[$value] = $params[$value];
                }
            }else{
                throw new Exception($value.' is null');
            }
        }

        $product_sale_id = Product_Sale::getId($data['agent_id'], $data['product_id'], $data['channel_id']);

        if($sale_id){
            $data['status']=0;
            $requslt = Product_Sale::update($product_sale_id, $data);
            if($requslt){
                // 发送任务tasks
                return ['product_id'=>$data['product_id'], 'channel_id'=>$data['channel_id']];
            }else{
                throw new Exception("update_sql_wrong", 1);            }
        }else{
            // 创建的时间
            $data['created_at'] = date('Y-m-d H:i:s');
            $requset = Product_Sale::insert($data);
            if($requset){
                // 发送任务插入tasks
                return ['product_id'=>$data['product_id'], 'channel_id'=>$data['channel_id']];
            }else{
                throw new Exception("insert_sql_wrong", 1);
            }
        }
    }
}