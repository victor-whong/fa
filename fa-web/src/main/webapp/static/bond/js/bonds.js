/*
 * layui引入样式的两种方式:模块化用和全模块用法
 * layui的初始化模块可以理解为，引入这个模块的js文件
 * 值得注意的是：layui的模块之间存在依赖关系，例如引入了table模块，它会layui/lay/moudules/table.js
 * 这个文件引入进来，并且它还会将这个模块所依赖的其他模块自动加入进来，
 * 实际引入的模块有：table、form、jquery、layer、laypage、laytpl、util，7个js文件
 * 所以我仅仅初始化了table模块，却能获得form、jquery、layer的模块对象
 */
//layui初始化表格模组 
layui.use(['table', 'laydate', 'util', 'upload'], function() {
	// 获得模块对象
	var table = layui.table;
	var form = layui.form;
	var $ = layui.jquery;
	var layer = layui.layer;
	var laydate = layui.laydate;
	var util = layui.util;
	var upload = layui.upload;
	//判断点击的”添加“操作还是“修改”操作
	var addAndEdit = "";
	// 全局的对象，存放选中行的dom元素
	var checkElem;





	//下拉搜索框设置
	var hideBtn = $("#hideBtn");
	var flag = false;
	var search_header = $("#search-header");
	search_header.css("top",-search_header.height());
	hideBtn.click(function () {
		let height = search_header.height();
		if(flag){
			search_header.animate({
				"top":-height
			},"fast","linear");
			flag = false;
		}else {
			search_header.animate({
				"top":0
			},"fast","linear");
			flag = true;
		}



		/*if(flag){
		}
		search_header.css("top",-height);*/
	});
	//----1.用户数据表格渲染------------------------------------------------------------------
	table.render({
		elem: '#bondTable',
		url: '../bond/list', //后期改回获取用户列表的后端程序的url
		method: 'post',
		height: 'full-10',
		where: {}, // 你额外要携带数据，以键值对的方式存入
		toolbar: '#userToolbar', // 开启头部工具栏，并为其绑定左侧模板
		// cellMinWidth: 80, // 全局定义所有常规单元格的最小宽度（默认：60）
		cellMaxWidth: 200,
		page: true, // 开启分页
		limit: 10, // 每页显示的条数
		limits: [5,10, 20, 50, 100], // 每页条数的选择项
		loading: true, // 是否显示加载条(切换分页的时候显示）
		title: '用户表', // 定义 table 的大标题（在文件导出等地方会用到）
		id: 'bondTable', // 设定容器唯一 id
		// 隔行变色
		even: false,
		cols: [
				[{
					title:'序列',
					type: 'numbers',
					fixed:'left', //钉在左侧
				}, // 序号
				{
					type: 'checkbox',
					fixed:'left', //钉在左侧
				}, //复选框
                {
					field:'bondId',
					title:'债券Id',
					fixed:'left', //钉在左侧
					hide: true, //一般情况下不显示用户ID
                    align:'center',
					width: 100
                },
				{
					field: 'bondCode',
					title: '债券代码',
					fixed:'left', //钉在左侧
					align: "center",
					width: 100
				},
				{
					field: 'bondShortName',
					title: '债券简称',
					fixed:'left',
					align: "center",
					width: 100
				},
				{
					field: 'actualIssuance',
					title: '发行量(亿元)',
					sort: true,
					align: "center",
					width: 160
				},
				{
					field: 'issuePrice',
					title: '发行价格',
					sort: true,
					align: "center",
					width: 130
				},
				{
					field: 'par',
					title: '票面价值',
					sort: true,
					align: "center",
					width: 130
				},
				{
					field: 'term',
					title: '期限(年)',
					sort: true,
					align: "center",
					width: 130
				},
				{
					field: 'paymentFrequency',
					title: '付息方式',
                    align: "center",
					width: 140
				},
				{
					field: 'valueDateStr',
					title: '起息日期',
					align: "center",
					width: 130
				},
				{
					field: 'expireDateStr',
					title: '到期日期',
					align: "center",
					width: 130
				},
				{
					field: 'couponRate',
					title: '票面利率',
					sort: true,
					align: "center",
					width: 150
				},
				{
					field: 'bondFullName',
					title: '债券全称',
					align: "center",
					width: 150
				},
				{
					field: 'description',
					title: '备注',
					align: "center",
					width: 150
				},
				{
					field: 'usable',
					title: '是否可用',
					fixed:'right',
					align: "center",
					width: 95,
					templet: function (data) {
						if(data.usable == "1"){
							return '<span class="useable font-color  my-bg-green">可用</span>';
						}else {
							return '<span class="useable font-color  my-bg-red1">弃用</span>';
						}
					}
				}

			]
		]
	});
	//----1.用户数据表格渲染------------------------------------------------------------------
	
	//----2.添加用户入职时间选择器--------------------------------------------------------------------
	laydate.render({
		elem: '#addExpireDate'
	});

	//修改用户入职时间选择器
	laydate.render({
		elem: '#addValueDate'
	});


	//----3.处理头部条件组合搜素------------------------------------------------------------------
	form.on('submit(SearchBtn)', function(data) {
		//将搜索下列框收回
		let height = search_header.height();
		if(flag){
			search_header.animate({
				"top":-height
			},"fast","linear");
			flag = false;
		}else {
			search_header.animate({
				"top":0
			},"fast","linear");
			flag = true;
		}
		// 搜索并刷新数据表格
		table.reload('bondTable', {
			url: '../bond/list', //
			where: data.field,
			page: {
				curr: 1 //从第一页开始
			},
			limit: 10
		});
		return false; // 阻止表单跳转。
	});
	//债券添加或修改按钮时间
	form.on('submit(addBtn)', function(data) {
		//通知进行的操作是添加“操作”
		if(addAndEdit == "add"){
			$.ajax({
				url:'../bond/add',//
				type: 'post',
				data: data.field,
				success:function (obj) {
					layer.closeAll();
					if(obj == 1){
						addOpen.close();
						layer.msg("添加成功！", {
							icon: 1 // 图标，可输入范围0~6
						});

					}else{
						layer.msg("添加出错！", {
							icon: 2 // 图标，可输入范围0~6
						});
					}
				}

			});
			// 刷新数据表格
			table.reload('bondTable', {
				url: '../bond/list' //
			});
		}
		if(addAndEdit == "edit"){
			$.ajax({
				type: 'POST',  //适用RESTful风格的添加： 查询GET、添加POST、更新PUT、删除DELETE
				async: false,
				url: '../bond/update', //后期改为添加用户的后台程序的url
				data: data.field,
				success: function(obj) {
					// 关闭页面上所有类型的所有弹框
					layer.closeAll();
					if(obj == 1) {
						layer.msg("修改成功！", {
							icon: 1 // 图标，可输入范围0~6
						});
						//	修改行数据
					  let a = checkElem.children("[data-field='bondCode']").children().html();
					  alert(a);
					} else {
						layer.msg("修改失败！", {
							icon: 2 // 图标，可输入范围0~6
						});
					}
				}
			});
		}
		return false; // 阻止表单跳转
	});

	//----3.处理表行修改------------------------------------------------------------------
	table.on("tool(bondTableEvent)",function (obj) {
		var data =  obj.data;
		console.log(data);
		if (obj.event == "update"){
            initUpdateUserModal(data);
		}
    });

	// 用户列表头部工具栏添加|修改|删除(逻辑删除)|恢复按钮的事件句柄绑定
	table.on('toolbar(bondTableEvent)', function(obj) {
		//获取当前表格选中状态和选中的一行dom元素
		// checkElem = table.checkStatus(obj.tr);
		// 获取当前表格选中状态和选中的数据
		var checkStatus = table.checkStatus(obj.config.id);
		// console.log(obj);
		// console.log(checkStatus);
		// console.log(checkStatus.data[0].bondId);

		// 区分点击的按钮
		/*obj.update({
			bondCode: "sd"
		});*/
		// 定义一个要删除的所有资源ID的字符串
		let idStr = "";
		switch(obj.event) {
			case 'addUser':
				// 弹出新增模态框
				initAddModal();
				break;
			case 'updateUser':
				// 选择的数据数量
				if(checkStatus.data.length > 1) {
					layer.msg("最多只能修改一行数据哦！！", {
						icon: 4 //图标，可输入范围0~6
					});
				} else if(checkStatus.data.length < 1) {
					layer.msg("请选择要修改的数据哦！！", {
						icon: 4 //图标，可输入范围0~6
					});
				} else if(checkStatus.data[0].usable == '0') {
					layer.msg("该用户被弃用了哦！！", {
						icon: 4 //图标，可输入范围0~6
					});
				} else {
					// 弹出修改模态框，传递当前选中的一行数据过去
					initUpdateUserModal(checkStatus.data[0]);
				}
				break;
			case 'frozenRecord':
				// 当前选中行的数据
				var data = checkStatus.data;
				//判断是否有选中
				if(checkStatus.data.length < 1) {
					layer.msg("请选择你要弃用的债券！！", {
						icon: 4 //图标，可输入范围0~6
					});
					return;
				}
				// 遍历传递过来的要删除的数据
				for(var i = 0; i < data.length; i++) {
					if(data[i].usable == '0') {
						layer.msg("所选的债券已经被弃用！", {
							icon: 4 // 图标，可输入范围0~6
						});
						return;
					}
					// 拿出用户ID进行拼接
					idStr += data[i].bondId + ",";
				}
				// 截取掉因为拼接产生的多余的一个逗号
				idStr = idStr.substring(0, idStr.length - 1);
				frozenORrecoverArchives(idStr, '0');
				break;
			case 'restoreRecord':
				// 当前选中行的数据
				var data = checkStatus.data;
				//判断是否有选中
				if(checkStatus.data.length < 1) {
					layer.msg("请选择你要还原的债券！！", {
						icon: 4 //图标，可输入范围0~6
					});
					return;
				}
				// 遍历传递过来的要删除的数据
				for(var i = 0; i < data.length; i++) {
					if(data[i].usable == '1') {
						layer.msg("所选债券是可用的，无需修改！", {
							icon: 4 // 图标，可输入范围0~6
						});
						return;
					}
					// 拿出资源ID进行拼接
					idStr += data[i].bondId + ",";
				}
				// 截取掉因为拼接产生的多余的一个逗号
				idStr = idStr.substring(0, idStr.length - 1);
				frozenORrecoverArchives(idStr, '1');
				break;
		};
	});
	
	// 监听锁定操作
	form.on('switch(usable)', function(obj) {
		frozenORrecoverArchives(obj.value, this.checked == true ? 'Y' : 'N');
	});

	// 定义弃用或还原的方法
	var frozenORrecoverArchives = function(bondIds, usable) {
		// 定义提示信息, 状态
		var msg;
		if(usable == '1') {
			msg = "还原";
		} else {
			msg = "弃用";
		}
		// 发送异步请求冻结或还原资源
		$.ajax({
			async: false, // 默认为true，false表示同步，如果当前请求没有返回则不执行后续代码
			type: "post",
			url:'../bond/updateUsable' ,//  /updateUser   '/updateUserStatus/' + userIds + "/" + usable
			data: {
			    bondIds:bondIds,
                usable:usable
			},
			success: function(data) {
				if(data == "1") {
					layer.msg(msg + "成功！", {
						icon: 1 // 图标，可输入范围0~6
					});
				} else {
					layer.msg(msg + "失败！", {
						icon: 2
					});
				}
				// 刷新数据表格
				table.reload('bondTable', {
					url: '../bond/list'
				});
			}
		});
	};
	// var hiddeDisable = function(){
	//
    // }

	// 初始化新增模态框
	var initAddModal = function() {
		// 弹出一个页面层
		addAndEdit = "add";
		layer.open({
			type: 1, // 基本层类型0~4，1为页面层
			title: '添加债券', // 标题
			skin: "layui-layer-molv",
			anim: 2, // 弹出动画
			area: ["100%","100%"], //自适应宽高 只写一个参数就是表示宽度，高度会自适应 // 宽高 只写一个参数就是表示宽度，高度会自适应
			content: $("#addModal"), // 文本、html都行
			resize: false, // 是否允许拉伸
			end: function() { // 弹出层销毁时的回调函数（不论何种方式，只要关闭了就执行）
				// 清空表单
				$("#addForm")[0].reset();
			}
		});

	}

	// 初始化修改模态框
	var initUpdateUserModal = function(data) {
		//通知进行的操作是修改“操作”
		addAndEdit = "edit";
		// 弹出一个页面层
		layer.open({
			type: 1, // 基本层类型0~4，1为页面层
			title: '修改用户', // 标题
			skin: "layui-layer-molv",
			anim: 2, // 弹出动画
			area: ["100%","100%"], //自适应宽高 只写一个参数就是表示宽度，高度会自适应 // 宽高 只写一个参数就是表示宽度，高度会自适应
			content: $("#addModal"), // 文本、html都行
			resize: false, // 是否允许拉伸
			end: function() { // 弹出层销毁时的回调函数（不论何种方式，只要关闭了就执行）
				// 清空表单
				$("#addForm")[0].reset();
			}
		});
		// 表单赋值
		form.val('addForm', {
			bondId:data.bondId,
			bondCode:data.bondCode,
			bondShortName:data.bondShortName,
			actualIssuance:data.actualIssuance,
			issuePrice:data.issuePrice,
			par:data.par,
			term:data.term,
			paymentFrequency:data.paymentFrequency,
			valueDate:data.valueDateStr,
			expireDate:data.expireDateStr,
			couponRate:data.couponRate,
			bondFullName:data.bondFullName,
			description:data.description
		});
	};

	// $.ajax({
	// 	url: '/findUserByConditionuuuu',//system/org',
	// 	dataType: 'json',
	// 	type: 'post',
	// 	success: function(data) {
	// 		$.each(data, function(index) {
	// 			var orgName = data[index].orgName;
	// 			var orgId = data[index].orgId;
	// 			/* var sdSdd = data[index].sdSdd; */
	// 			// 头部的搜索
	// 			$("#queryOrgName").append(
	// 				"<option value='" + orgName + "'>" + orgName +
	// 				"</option>");
	// 			// 添加
	// 			$("#addOrgName").append(
	// 				"<option value='" + orgId + "'>" + orgName +
	// 				"</option>");
	// 			// 修改
	// 			$("#updateOrgName").append(
	// 				"<option value='" + orgId + "'>" + orgName +
	// 				"</option>");
	// 			// form.render()渲染将option添加进去
	// 			form.render();
	// 		});
	// 	}
	// });

	// 自定义表单校验
	form.verify({
		pass: [ /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		mobile: function(value) {
			var msg;
			$.ajax({
				type: "POST",
				url: '/verifyTelephone',//system/toVerifyUserPhone
				async: false, // 使用同步的方法
				data: {
					'telephone': value
				},
				dataType: 'json',
				success: function(result) {
					if(result.flag) {
						msg = result.msg;
					}
				}
			});
			return msg;
		}
	});
});



