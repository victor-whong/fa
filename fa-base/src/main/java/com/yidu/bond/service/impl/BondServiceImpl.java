package com.yidu.bond.service.impl;

import com.yidu.bond.dao.BondDao;
import com.yidu.bond.domain.Bond;
import com.yidu.bond.paging.BondPaging;
import com.yidu.bond.service.BondService;
import com.yidu.format.LayuiFormat;
import com.yidu.utils.IDUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;

/**
 * 类的描述:债券业务逻辑类
 *
 * @author wh
 * @since 2020/9/3 10:12
 */
@Service
public class BondServiceImpl implements BondService {
    @Autowired
    private BondDao bondDao;
    @Autowired
    private LayuiFormat layuiFormat;
    @Override
    public LayuiFormat findAll(BondPaging bondPaging) {
        //计算分页
        int limit = bondPaging.getLimit();
        int page = (bondPaging.getPage()-1)*limit;
        bondPaging.setPage(page);
        bondPaging.setLimit(limit);

        dispose(bondPaging);

        List<Bond> bonds = bondDao.findAll(bondPaging);
        if (CollectionUtils.isEmpty(bonds)){   //集合为空
            layuiFormat.setCode(1);  //状态码0为查询到数据
            layuiFormat.setCount(0L);
            layuiFormat.setMsg("未查询到指定数据哦!");

        }else{
            layuiFormat.setCode(0);  //状态码0为查询到数据
            layuiFormat.setCount(bondDao.findCount(bondPaging));
            layuiFormat.setMsg("成功找到数据");
            layuiFormat.setData(bonds);
        }
        return layuiFormat;
    }

    @Override
    public int addBond(Bond bond) {
        bond.setBondId(IDUtil.getUuid());
        return bondDao.addBond(bond);
    }

    @Override
    public int updateBond(Bond bond) {
        return bondDao.updateBond(bond);
    }

    @Override
    public int updateUsable(String usable, String bondIds) {
        int flag = 0;
        if(null != bondIds && null != usable){
            String[] ids = bondIds.split(",");
            for(String bondId: ids){
                flag = bondDao.updateUsable(usable,bondId);
            }
        }

        return flag;
    }

    /**
     * 将查询范围的空值进行边界数值处理，start>end是将其进行交换
     * @param bondPaging 联级查询的参数对象
     */
    private void dispose(BondPaging bondPaging) {
        if(null == bondPaging.getStartActualIssuance()){
            bondPaging.setStartActualIssuance(0D);
        }
        if(null == bondPaging.getStartCouponRate()){
            bondPaging.setStartCouponRate(0D);
        }
        if(null == bondPaging.getStartTerm()){
            bondPaging.setStartTerm(0D);
        }

        if(null == bondPaging.getEndActualIssuance()){
            bondPaging.setEndActualIssuance(1000D);
        }
        if(null == bondPaging.getEndCouponRate()){
            bondPaging.setEndCouponRate(20D);
        }
        if(null == bondPaging.getEndTerm()){
            bondPaging.setEndTerm(100D);
        }

        if(bondPaging.getStartActualIssuance()>bondPaging.getEndActualIssuance()){
            Double content = bondPaging.getStartActualIssuance();
            bondPaging.setStartActualIssuance(bondPaging.getEndActualIssuance());
            bondPaging.setEndActualIssuance(content);
        }
        if(bondPaging.getStartCouponRate()>bondPaging.getEndCouponRate()){
            Double content = bondPaging.getStartCouponRate();
            bondPaging.setStartCouponRate(bondPaging.getEndCouponRate());
            bondPaging.setEndCouponRate(content);
        }
        if(bondPaging.getStartTerm()>bondPaging.getEndTerm()){
            Double content = bondPaging.getStartTerm();
            bondPaging.setStartTerm(bondPaging.getEndTerm());
            bondPaging.setEndTerm(content);
        }
    }
}
