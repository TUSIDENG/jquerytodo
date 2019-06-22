;(function () {
    'use strict';
    var $form_add_task = $('.add-task'),
    $task_list = $('.task-list'),
    $form_task_detail = $('.task-detail'),
    $task_detail_mask = $('.task-detail-mask'),
    $title, $form_task_detail_title,
     task_list = {};

     init();

     $form_add_task.on('submit', function (e) {
        e.preventDefault();
        
         var new_task = {};
         var $input = $(this).find('input[name=title]');
         new_task.title = $input.val();
         if (!new_task.title) return;
        
         if (add_task(new_task)) {
            var $task_item = render_task_item(new_task, task_list.length - 1);
            $task_list.prepend($task_item);
             $input.val(null);
         }
     });

     /**
      * 监听任务删除
      * 使用了事件委托
      * 使用index方法获取匹配的元素中指定元素的索引
      */
     $task_list.on('click', '.action.delete', function(event) {
         var index = $(this).parent().parent().data('index');
         var tmp = confirm('确认删除吗?');
         (tmp ? delete_task(index) : null) ? render_task_list() : null;
     })

     /**
      * 监听点击任务详情
      */
     $task_list.on('click', '.action.detail', function() {
         var index = $(this).parent().parent().data('index');
         show_task_detail(index);
     })

     /**
      * 双击任务单项显示任务详情
      */
     $task_list.on('dblclick', '.task-item', function() {
         var index = $(this).data('index');
         show_task_detail(index);
     })

     /**
      * 点击遮罩隐藏任务详情面板
      */
     $task_detail_mask.on('click', hide_task_detail);

     /**
      * 增加任务详情描述
      */
     $form_task_detail.on('submit', function(event) {
         event.preventDefault();

         var index = $form_task_detail.data('index');

         if (index === undefined || !task_list[index]) return;
         var item = task_list[index];
         item.title = $form_task_detail_title.val();
         item.desc = $form_task_detail.find('textarea[name=desc]').val();
         item.remind = $form_task_detail.find('input[name=remind]').val();
         store.set('task_list', task_list);

         hide_task_detail();
         render_task_list();
     });

     /**
      * 双击任务标题，变为input
      */
     $form_task_detail.on('dblclick', $title, function() {
        $title.hide();
        $form_task_detail_title.show();
     })

    function init() {
         task_list = store.get('task_list') || [];
         if (task_list.length) {
             render_task_list();
         }
     }

    function add_task(new_task) {
        task_list.push(new_task);
        store.set('task_list', task_list);
        return true;
    }

    /**
     * 删除一条Task 
     */
    function delete_task(index) {
        if (index === undefined || !task_list[index]) return;
        task_list.splice(index, 1);
        store.set('task_list', task_list);
        return true;
    }

    // 展示任务详情
    function show_task_detail(index)
    {
        var tpl = render_task_detail(index);
        $form_task_detail.html(tpl);
        $form_task_detail.show();
        $task_detail_mask.show();

        $title= $('.title');
        $form_task_detail_title = $form_task_detail.find('input[name=title]');
    }

    // 隐藏任务详情
    function hide_task_detail()
    {
        $form_task_detail.hide();
        $task_detail_mask.hide();
    }

    /**
     * 渲染所有Task模板
     */
    function render_task_list() {
        $task_list.empty();
        task_list.map(function(task, index) {
            var $task_item = render_task_item(task, index);
            $task_list.prepend($task_item);
        });
    }

    /**
     * 渲染单条Task模板
     * @param {Task} data 
     * @param {int} index 
     */
    function render_task_item(data, index) {
        var list_item_tpl = '<li class="task-item" data-index="' + index + '">' +
        '<span><input type="checkbox" name="" id=""></span>' +
        '<span class="task-title">' + data.title + '</span>' +
        '<span class="fr">' +
            '<span class="action detail"> 详情</span>' +
            '<span class="action delete"> 删除</span>' +
        '</span>'
        '</li>';

        return $(list_item_tpl);
    }

    /**
     * 渲染任务详情
     * @param {int} index 
     */
    function render_task_detail(index) {
        $form_task_detail.data('index', index);
        var item = task_list[index];

        var tpl = '<div class="input-item">' + 
        '<div class="title">' +
        item.title + 
    '</div>' +
    '<div>' +
    '<input type="text" name="title" style="display: none;"  value="' + item.title + '">' +
    '</div>' + 
    '</div>' +
        '<div class="desc input-item">' +
            '<textarea name="desc" id="">' + (item.desc ? item.desc : '') + '</textarea>' +
        '</div>' +
    '<div class="input-item remind">' +
        '<input type="date" value="' + (item.remind || '') + '" name="remind" id="">' +
    '</div>' +
    '<div class="input-item">' +
    '<button type="submit">submit</button>' +
    '</div>';
    return tpl;
    }
})();