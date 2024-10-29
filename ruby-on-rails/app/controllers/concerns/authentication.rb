module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate
  end

  SESSION_TIMEOUT = 20.minutes

  def authenticate
    if valid_session?(session)
      session[:login_expires_at] = SESSION_TIMEOUT.from_now
    else
      redirect_to root_path
    end
  end

  def create_session(saml_identifier: nil)
    session[:login_expires_at] = SESSION_TIMEOUT.from_now
    session[:saml_identifier] = saml_identifier
    redirect_to root_path
  end

  def clean_session
    session[:login_expires_at] = nil
    session[:saml_identifier] = nil
  end

  def valid_session?(session)
    session[:login_expires_at].try(:to_time).present? && session[:login_expires_at].to_time > Time.current
  end

  private

  def auth_hash
    request.env['omniauth.auth']
  end

  def login_path
    auth_path
  end

  def default_after_login_path
    root_path
  end
end
