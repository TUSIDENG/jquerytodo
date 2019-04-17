;(function () {
    'use strict';
    var $form_add_task = $('.add-task'),
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
             $task_list.append(render_task_list(new_task));
             $input.val(null);
         }
     });

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

    function render_task_list() {
        $task_list.empty();
        task_list.map(function(task, index) {
            var $task_item_tpl = render_task_tpl(task);
            $task_list.append($task_item_tpl);
        });
    }

    function render_task_tpl(data) {
        var list_item_tpl = '<li class="task-item">' + 
        '<span><input type="checkbox" name="" id=""></span>' +
        '<span class="task-title">' + data.title + '</span>' +
        '<span class="fr">' +
            '<span class="action"> 详情</span>' +
            '<span class="action"> 删除</span>' +
        '</span>'
        '</li>';

        return $(list_item_tpl);
    }
})();