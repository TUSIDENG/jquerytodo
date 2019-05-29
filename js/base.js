;(function () {
    'use strict';
    var $form_add_task = $('.add-task'),
    $task_detail = $('.task-detail'),
    $task_detail_mask = $('.task-detail-mask'),
    $task_list = $('.task-list'),
     task_list = {};

     init();

     $form_add_task.on('submit', function (e) {
        e.preventDefault();
        
         var new_task = {};
         var $input = $(this).find('input[name=title]');
         new_task.title = $input.val();
         if (!new_task.title) return;
        
         if (add_task(new_task)) {
            var $task_item = render_task_item(new_task);
            $task_list.append($task_item);
             $input.val(null);
         }
     });

     /**
      * 监听任务删除
      * 使用了事件委托
      * 使用index方法获取匹配的元素中指定元素的索引
      */
     $task_list.on('click', '.action.delete', function(event) {
         var index = $('.task-item').index($(this).parent().parent());
         var tmp = confirm('确认删除吗?');
         (tmp ? delete_task(index) : null) ? render_task_list() : null;
     })

     /**
      * 监听点击任务详情
      */
     $task_list.on('click', '.action.detail', function() {
         var index = $('.task-item').index($(this).parent().parent());
         show_task_detail(index);
     })

     /**
      * 点击遮罩隐藏任务详情面板
      */
     $task_detail_mask.on('click', hide_task_detail);

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
        if (index ===undefined || !task_list[index]) return;
        task_list.splice(index, 1);
        store.set('task_list', task_list);
        return true;
    }

    // 展示任务详情
    function show_task_detail(index)
    {
        var tpl = render_task_detail(index);
        $task_detail.html(tpl);
        $task_detail.show();
        $task_detail_mask.show();
    }

    // 隐藏任务详情
    function hide_task_detail()
    {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    /**
     * 渲染所有Task模板
     */
    function render_task_list() {
        $task_list.empty();
        task_list.map(function(task, index) {
            var $task_item = render_task_item(task, index);
            $task_list.append($task_item);
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
        var item = task_list[index];
        var tpl = '<div class="title">' +
        item.title + 
    '</div>' +
    '<div>' +
        '<div class="desc">' +
            '<textarea name="" value="' + item.desc + '" id=""></textarea>' +
        '</div>' +
    '</div>' +
    '<div class="remind">' +
        '<input type="date" value="' + item.remind + '" name="" id="">' +
        '<!-- <button type="submit">submit</button> -->' +
    '</div>'
    return tpl;
    }
})();