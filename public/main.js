const drawList = function() { 
    const mytodolist = $('#todolist');

     $('#addbttn').on('click', function(){
        const val = $('#addbox').val();
        $('#addbox').val('');
    $.ajax({
        url         : "/todos",
        type        : 'post',
        dataType    : 'json',
        data        : JSON.stringify({
            message   : val,
            completed : false
        }),
        contentType : "application/json; charset=utf-8",
        success     : function(data) {
            mytodolist.html();
            drawList();
        },
        error       : function(data) {
            alert('Error creating todo');
        }
     });
 });

    $.ajax({
        url      : "/todos",
        type     : 'get',
        dataType : 'json',
        success  : function(todos) {
           
            mytodolist.html('');
            const SearchText = $('#srchbox').val();

            const filteredList = todos.filter(function(TodoItem) {
                  if (!SearchText){
                     return true;
                  } 
            if (TodoItem.message.toLowerCase().indexOf(SearchText.toLowerCase()) >= 0) {
                return true;
            }
            return false;
            }); 

        filteredList.forEach(function(TodoItem) {
            let li = $('<li>' + TodoItem.message + '<button class="delbttn">Delete</button>' + '<input type = "checkbox"> </li>');
            
        li.find(".delbttn").on("click", function(){
            $.ajax({
                url     : "/todos/" + TodoItem.id,
                type    : 'delete',
                dataType : 'json',
                success : function(todo) {
                    li.remove();
                },
                error   : function(data) {
                    alert('Error deleting the item');
                }
            });
        });
        
        li.find("input").prop("checked",TodoItem.completed).on("change",function(){
            let completed = $(this).prop("checked");
            TodoItem.completed = completed;
            $.ajax({
                url         : "/todos/" + TodoItem.id,
                type        : 'put',
                dataType    : 'json',
                data        : JSON.stringify(TodoItem),
                contentType : "application/json; charset=utf-8",
                success     : function(data) {
                    
                },
                error       : function(data) {
                alert('Error updating todo');
                } 
           });
        });

            
            mytodolist.append(li);
        }); 

    },
        error    : function(data) {
            alert('Error searching');
        }
    });
};
$('#srchbttn').on('click', function(){
    drawList();
});

drawList();
