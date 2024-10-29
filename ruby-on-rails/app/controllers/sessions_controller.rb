class SessionsController < ApplicationController
  skip_before_action :authenticate
  skip_after_action :verify_authorized

  def login
  end

  def destroy
    clean_session

    redirect_to root_path
  end
end
