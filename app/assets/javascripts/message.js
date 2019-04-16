$(document).on('turbolinks:load', function() {
  function buildHTML(message){
    var image = message.image.url ? `<img src='${message.image.url}'> ` : ' '
    var html = `<div class="message">
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                      ${message.user_name}
                    </div>
                    <div class="upper-message__date">
                      ${message.date}
                    </div>
                  </div>
                  <div class="lower-message__content">
                    ${message.content}
                  </div>
                      ${image}
                </div>`
    return html;
  }
  $("#message_content").on("submit", function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $(".messages").append(html);
      $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight});
      $("#message_content,#message_image")[0].reset();
      $(".form__submit").removeAttr("disabled");
    })
    .fail(function(){
      alert("error");
    })
  })

  var auto_reload = setInterval(function() {
    // setInterval:一定時間毎に繰り返し処理してくれる
    if (location.href.match(/\/groups\/\d+\/messages/)){
      // が含まれているURLに画面遷移する
      var url = $(location).attr('pathname');
       // 現在のページのURLのパス名
      var message_id = $('.message').last().data('id');

      $.ajax({
        url: url,
        type: 'GET',
        data: {id: message_id},
        dataType:'json'
      })
        .done(function(data){
          data.forEach(function(message){
            var html = buildHTML(message);
            $(".chat-main__body").append(html);
          })
          $(".chat-main__body").animate({scrollTop:$('.chat_main-body')});
        })
        .fail(function(){
          alert('自動更新に失敗しました');
        });
      } else {
        clearInterval(interval);
        }
    },5000 );
});
