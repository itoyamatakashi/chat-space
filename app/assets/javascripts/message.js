$(document).on('turbolinks:load', function(){
  function buildHTML(message){
    var img = message.image ? `<img src=${ message.image }>` : "";
    var html = `<div class="message" data-message-id="${message.id}">
                  <div class="upper-message">
                    <div class="upper-message__user">
                      ${ message.user_name }
                    </div>
                    <div class="upper-message__date">
                      ${ message.created_at }
                    </div>
                  </div>
                  <div class="lower-message">
                    <div class="lower-message__content">
                      ${ message.content }
                    </div>
                    ${ img }
                  </div>
                </div>`
    return html;
  }

  function scroll(){
    $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight},'fast')
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')

    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      if (data.length !== 0) {
        var html = buildHTML(data);
      $('.messages').append(html);
      $('.form__submit').prop('disabled', false);
      scroll();
      $('#new_message')[0].reset();
      }
      else {
        alert('メッセージを入力してください');
        $('.form__submit').prop('disabled', false);
        }
    })
    .fail(function(){
      alert('error');
    })
  });

  var reloadMessages = function() {
    var last_message_id = $('.message:last').data('message-id');  // カスタムデータ属性を利用して、最新のメッセージIDを取得しています。
    var href = 'api/messages#index {:format=>"json"}'            // urlのリクエスト先と形式を指定
    if (window.location.href.match(/\/groups\/\d+\/messages/)){  // group/:group_id/messagesというURLの時だけ、以降の記述が実行されます。
    $.ajax({
        url: href,
        type: "get",
        dataType: 'json',
        data: {id: last_message_id }
      })
      .done(function(messages) {                  //フォームに入力されたデータを引数として取得しています。
        var insertHTML = '';
        messages.forEach(function(message) {
          insertHTML = buildHTML(message);
            $('.messages').append(insertHTML);
            $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
        })
      })
      .fail(function() {
      });
    }
      // else {
      //   clearInterval(interval);
      // }
    };
    setInterval(reloadMessages, 5000);
  });