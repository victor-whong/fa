package com.yidu.deposit.dao;

import com.yidu.deposit.paging.CashInventoryPaging;
import com.yidu.deposit.domain.CashInventory;

import java.util.List;

/**
 * 类的描述:现金库存持久层接口
 *
 * @author wh
 * @since 2020/9/11 14:38
 */
public interface CashInventoryDao {

    /**
     * 模糊加分页查询所有现金库存
     * @param cashInventoryPaging 现金库存对象
     * @return  金库存数据集合
     */
    List<CashInventory> findAll(CashInventoryPaging cashInventoryPaging);
    /**
     * 模糊加分页查询所有现金库存数量
     * @param cashInventoryPaging 现金库存对象
     * @return  现金库存数据条数
     */
    Long findCashInventoryCount(CashInventoryPaging cashInventoryPaging);

    /**
     * 根据id查询现金库存
     * @param cashInventoryId 现金库存id
     * @return 现金库存对象
     */
    CashInventory fundCashInventoryById(String cashInventoryId);
}
