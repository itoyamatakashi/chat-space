class Api::MessagesController < ApplicationController
  def index
    #グループの情報をインスタンス変数@groupに保存 これを元にDBからグループを取得する
    @group = Group.find(params[:group_id])
    last_message_id = params[:id].to_i
    # ajaxで送られてくる最後のメッセージのid番号を変数に代入
    @messages = @group.messages.includes(:user).where("id > #{last_message_id}")
    # includesはN+1問題対策
  end
end