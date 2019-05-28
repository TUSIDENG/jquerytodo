;(function () {
    'use strict';
    var $form_add_task = $('.add-task'),
    $delete_task,
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
            render_task_list();
             $input.val(null);
         }
     });

     /**
      * 监听任务删除
      */
     function listen_task_delete() {
        $delete_task.on('click', function() {
            var $this = $(this);
            var index = $this.parent().parent().data('index');
            var tmp = confirm('确认删除?');
            (tmp ? delete_task(index) : null) ? render_task_list() : null;
        })
     }

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

    /**
     * 渲染所有Task模板
     */
    function render_task_list() {
        $task_list.empty();
        task_list.map(function(task, index) {
            var $task_item = render_task_item(task, index);
            $task_list.append($task_item);
        });
        $delete_task = $('.action.delete');
        listen_task_delete();
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
            '<span class="action"> 详情</span>' +
            '<span class="action delete"> 删除</span>' +
        '</span>'
        '</li>';

        return $(list_item_tpl);
    }
})();