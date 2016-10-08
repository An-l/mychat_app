$(function() {
	
	var user = {
		name: 'coffce',
		pictrue: './images/1.jpg'
	};

	var list = [{
		name: 'an',
		pictrue: './images/2.png',
		historys: [{
			user: 'an',
			content: 'hello',
			time: '15:10'
		}, {
			user: 'coffce',
			content: 'hi',
			time: '15:23'
		}]
	}, {
		name: 'bili',
		pictrue: './images/3.jpg',
		historys: [{
			user: 'bili',
			content: 'I`m bili!',
			time: '18:22'
		}, {
			user: 'coffce',
			content: 'hello bili!',
			time: '19:11'
		}]
	}, ];
	var activeWindow = {};
	var searchStr = '';

	var $list = $('.list ul');
	var $messages = $('.message ul');
	var $search = $('.search');


	// 输入框监听键盘事件
	$('#textArea').on('keyup', function(event) {
		if (event.ctrlKey && event.keyCode == 13) {
			var text = $('#textArea').val();

			var now = new Date();
			var newHistory = {
				user: user.name,
				content: text,
				time: now.getHours() + ':' + now.getMinutes()
			};
			activeWindow.historys.push(newHistory);

			$('#textArea').val('');
			//初始化message
			showMessage(activeWindow, createMessageItem);
		}
	});

	$search.on('input', function(event) {
		searchStr = $search.val();

		//初始化好友列表
		showList();
	});


	/**
	 * [createListItem]
	 * @param  {[object]} item [description]
	 * 1.创建List中的item节点
	 * 2.为每一个item绑定cilck事件
	 * 3.在click事件中调用showMessage()来初始化message面板,
	 *   修改activeWindow为当前会话的窗口（item）。
	 */
	var createListItem = function(item) {
		var li = $('<li>');
		var img = $('<img>');
		var p = $('<p>');
		img.addClass('avatar').width(30).height(30)
			.attr({
				src: item.pictrue,
				alt: item.pictrue
			});
		p.addClass('name').text(item.name);

		li.append(img).append(p);

		li.on('click', function(event) {
			li.addClass('active').siblings().removeClass('active');

			//初始化message
			showMessage(item, createMessageItem);

			//修改activeWindow为当前会话的窗口（item）。
			//由于是对象，所以传递的是地址。
			//对activeWindow对象的属性进行的修改，也会体现在item中。
			activeWindow = item;
		});

		$list.append(li);
	};


	/**
	 * [createMessageItem]
	 * @param  {[object]} item    [list[i]]
	 * @param  {[object]} history [list[i].historys[j]]
	 * 1.创建message节点
	 * 2.判断message来自哪个用户(myself or other)，修改显示的样式
	 * 3.添加到$('.message ul')中
	 */
	var createMessageItem = function(item, history) {
		var li = $('<li>');
		var time = $('<p>');
		var span = $('<span>');
		var main = $('<div>');
		var img = $('<img>');
		var text = $('<div>');

		if (history.user === user.name) {
			main.addClass('self');
			img.attr({
				src: user.pictrue,
				alt: user.pictrue
			});
		} else {
			img.attr({
				src: item.pictrue,
				alt: item.pictrue
			});
		}

		span.text(history.time);
		time.addClass('time').append(span);
		img.addClass('avatar').width(30).height(30);
		text.addClass('text').text(history.content);
		main.addClass('main').append(img).append(text);

		li.append(time).append(main);

		$messages.append(li);
	};


	/**
	 * [showMessage 初始化message面板]
	 * @param  {[object]}   item     [list[i]]
	 * @param  {Function} callback [createMessageItem()]
	 * 1.遍历list[i].historys
	 * 2.调用createMessageItem创建message节点
	 */
	var showMessage = function(item, callback) {
		$messages.html('');
		var historys = item.historys;
		for (var i = 0; i < historys.length; i++) {
			callback && callback(item, historys[i]);
		}
	};

	/**
	 * [showList 初始化好友列表]
	 * 1.初始化好友列表
	 * 2.实现搜索功能
	 */
	var showList = function() {
		$list.html('');	//清空好友列表

		for (var i = 0; i < list.length; i++) {
			//实现搜索功能
			if (searchStr == '') {
				createListItem(list[i]);
			} else {
				if (list[i].name.indexOf(searchStr) == -1) {
					continue;
				} else {
					createListItem(list[i]);
				}
			}
		}

	};

	/**
	 * [init 初始化入口函数]
	 */
	var init = function() {
		$('.sidebar .name').text(user.name);
		$('.sidebar .avatar').attr({
			src: user.pictrue,
			alt: user.pictrue
		});
		//初始化好友列表
		showList();

		// 初始化时显示第一个好友聊天窗口
		$list.find('li').eq(0).trigger('click');
	};

	//初始化入口函数
	init();
});