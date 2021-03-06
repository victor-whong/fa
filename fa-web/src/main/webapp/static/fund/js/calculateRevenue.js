$(function(){

/*
 * layui引入样式的两种方式:模块化用和全模块用法
 * layui的初始化模块可以理解为，引入这个模块的js文件
 * 值得注意的是：layui的模块之间存在依赖关系，例如引入了table模块，它会layui/lay/moudules/table.js
 * 这个文件引入进来，并且它还会将这个模块所依赖的其他模块自动加入进来，
 * 实际引入的模块有：table、form、jquery、layer、laypage、laytpl、util，7个js文件
 * 所以我仅仅初始化了table模块，却能获得form、jquery、layer的模块对象
 */
//layui初始化表格模组 
layui.use(['table', 'laydate', 'upload','element'], function() {
	// 获得模块对象
    var tId = 'feeCalculateTable';
    var url = '../calcRevenue/fundInventoryList';
	var table = layui.table;
	var form = layui.form;
	var $ = layui.jquery;
	var layer = layui.layer;
	var laydate = layui.laydate;
	var upload = layui.upload;
	var element = layui.element;

	//----1.基金交易数据表格渲染------------------------------------------------------------------
    element.on('tab',function (data) {
        tId = data.elem.find(".layui-show table").attr("id");
		url = data.index === 0 ? '../calcRevenue/fundInventoryList':'../calcRevenue/cashInventoryList';
        table.resize(tId);
        resize();
    });


	//----2.头部搜索栏基金交易日期时间选择器--------------------------------------------------------------------


    //----3.处理头部条件组合搜素------------------------------------------------------------------
    form.on('submit(calcRevenueSearchBtn)', function(data) {
        // 执行后台代码
        table.reload(tId, {
            url: url,
            where: data.field,  // 设定异步数据接口的额外参数，任意设
            page: {
                curr: 1 //从第一页开始
            },
            limit: 10
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });


	//----3.处理表行修改------------------------------------------------------------------
	// table.on("tool(fundTableEvent)",function (obj) {
	// 	var data =  obj.data;
	// 	console.log(data);
	// 	if (obj.event == "update"){
    //         initUpdatefundModal(data);
	// 	}
    // });

    window.onresize=function(){
        resize();
    }

    var ltips=layer.tips("为你定制的搜索^_^","[title='搜索']",{tips:[2,'#1211115e'],time:3000,shadeClose:true});
	// 基金交易未结算数据表头部工具栏结算|导入按钮的事件句柄绑定
	table.on('toolbar(fundTableEvent)', function(obj) {
		// 获取当前表格选中状态和选中的数据
		var checkStatus = table.checkStatus(obj.config.id);
		// 区分点击的按钮
		switch(obj.event) {
            case 'LAYTABLE_SEARCH':
                laytablesearch();
                layer.close(ltips);
                break;
			case 'upload':
				// 弹出上传模态框
                initUploadModal();
                break;
			case 'settlement':
				// 当前选中行的数据
				var data = checkStatus.data;
				//判断是否有选中
				if(checkStatus.data.length < 1) {
					layer.msg("请选择你要结算的数据！！", {
						icon: 4 //图标，可输入范围0~6
					});
                    return;
				}
				// 定义一个要结算的所有交易数据ID的字符串
				var fundTradeIdStr = "";
				// 遍历传递过来的要结算的数据
				for(var i = 0; i < data.length; i++) {
					if(data[i].tradeStatus == '1') {
						layer.msg("所选数据中有已结算数据！", {
							icon: 1 // 图标，可输入范围0~6
						});
						return;
					}
					// 拿出基金交易数据Id进行拼接
                    fundTradeIdStr += data[i].fundTradeId + ",";
				}
				// 截取掉因为拼接产生的多余的一个逗号
                fundTradeIdStr = fundTradeIdStr.substring(0, fundTradeIdStr.length - 1);
                // 调用修改基金状态请求方法
                updateTradeStatus(fundTradeIdStr, '1');
				break;
		};
	});


    $("#reset").click(function () {
        table.reload(tId, {
            url:url,
            where:{
                fundNo:null,
                fundName: null,
            }
        })
    });
    // 定义修改交易状态请求方法
    var updateTradeStatus = function(fundTradeIds,tradeStatus) {
        $.ajax({
            url:"../fundSettlement",
            type:'post',
            data:{
                fundTradeIds:fundTradeIds,
                tradeStatus:tradeStatus
            },
            success:function (data) {
                if(data == 1) {
                    layer.msg("结算成功！", {
                        icon: 1 // 图标，可输入范围0~6
                    });
                } else {
                    layer.msg("结算失败！", {
                        icon: 1 // 图标，可输入范围0~6
                    });
                }
                table.reload('fundTradeTable',{
                    url:"../findAllFundTrade?b=0"
                });
                table.reload('fundTradeTable2',{
                    url:"../findAllFundTrade?b=1"
                })
            }
        })

    };



    function resize(){
        // $("#dataTable .layui-table-fixed thead tr").css("height",$("#dataTable thead tr").height() + "px");
        // $(".layui-table-body:last table").css("height", $(".layui-table-main")[0].clientHeight+"px")
        $("#dataTable  .layui-table-fixed thead tr").css("height",$("#dataTable thead tr").height() + "px");
        $("#dataTable2  .layui-table-fixed thead tr").css("height",$("#dataTable2 thead tr").height() + "px");
		$.each($(".layui-table-body:eq(1) table tr"),function (index,data) {
			$(data).css("height",$(".layui-table-main:first tr").get(index).clientHeight+"px")
        })
		$.each($(".layui-table-body:last table tr"),function (index,data) {
			$(data).css("height",$(".layui-table-main:last tr").get(index).clientHeight+"px")
        })
    }
    // 初始化上传模态框
    var initUploadModal = function(data) {
        // 弹出一个页面层
        layer.open({
            type: 1, // 基本层类型0~4，1为页面层
            title: '', // 标题
            skin: "",
            anim: 2, // 弹出动画
            area: ["100%",'100%'], //自适应宽高 只写一个参数就是表示宽度，高度会自适应 // 宽高 只写一个参数就是表示宽度，高度会自适应
            content: $("#upload"), // 文本、html都行
            resize: false, // 是否允许拉伸
        });

    };




    //渲染上传模态框
    upload.render({
        elem:'#upload',
        accept: 'file',
        url:"../upload",
    done: function(res){
        //上传完毕回调
        layer.closeAll();
        layer.msg(res.success);
        // 刷新数据表格
        table.reload('fundTradeTable', {
            url: '../findAllFundTrade?b=0'
        });
        table.reload('fundTradeTable2', {
            url: '../findAllFundTrade?b=1'
        });
        resize()
    }
    ,error: function(){
            //请求异常回调
            layer.msg("上传失败,请检查数据格式是否正确");
    },
    acceptMime:Lay_xls_xlsx,
    exts: 'xls|excel|xlsx',
    });

	// 自定义表单校验
	// form.verify({
	// 	pass: [ /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
	// 	mobile: function(value) {
	// 		var msg;
	// 		$.ajax({
	// 			type: "POST",
	// 			url: '../verifyTelephone',//system/toVerifyfundPhone
	// 			async: false, // 使用同步的方法
	// 			data: {
	// 				'telephone': value
	// 			},
	// 			dataType: 'json',
	// 			success: function(result) {
	// 				if(result.flag) {
	// 					msg = result.msg;
	// 				}
	// 			}
	// 		});
	// 		return msg;
	// 	}
	// });
    // function laytablesearch(){search.stop().slideToggle(1500);}



});
});
