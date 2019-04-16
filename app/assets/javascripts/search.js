$(document).on('turbolinks:load', function() {

  var search_list = $("#user-search-result");

  function appendUserName(user) {
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</a>
                </div>`
    search_list.append(html);
  }
  // ユーザー名が検索で出てきた時のHTMLの表示
  function appendNoUserName(fail_comment) {
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${fail_comment}</p>
                </div>`
    search_list.append(html);
  }
  // ユーザー名が検索で出てこない時のHTMLの表示

  $("#user-search-field").on("keyup", function() {
    var input = $("#user-search-field").val();
    if(input!==""){
    // inputが空白じゃない場合
      $.ajax({
        type: 'GET',
        url: '/users',
        data: { name: input },
        dataType: 'json'
      })
      .done(function(users) {
        $("#user-search-result").empty();
        // 一度検索結果を空にする
        if (users.length!== 0) {
        // ユーザー数が0じゃないなら当てはまるユーザーを繰り返し表示
          users.forEach(function(users){
            appendUserName(users);
          });
        }
        else {
          appendNoUserName("一致する名前はありません");
        }
      })
      .fail(function() {
        alert("ユーザー検索に失敗しました");
      })
    }
  });

  var search_list_add = $("#chat-group-users");
  // 現在のチャットメンバーを表示
  function appendUserNameAdd(user_name, user_id) {
     var html =`<div class='chat-group-user clearfix js-chat-member' id='chat-group-user-8'>
                  <input name='group[user_ids][]' type='hidden' value='${user_id}'>
                  <p class='chat-group-user__name'>${user_name}</p>
                  <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                </div>`
      search_list_add.append(html);
  }

  $("#user-search-result").on("click", ".chat-group-user__btn--add", function () {
    var user_name = $(this).data("user-name");
    var user_id = $(this).data("user-id");
    $(this).parent().remove();
    // #user-search-resultから削除
    appendUserNameAdd(user_name, user_id);
  })
  $("#chat-group-users").on("click", ".js-remove-btn", function () {
    $(this).parent().remove();
    // #chat-group-usersから削除
  });
});
