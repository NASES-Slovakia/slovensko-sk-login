class UpvsController < ActionController::API
  SESSION_TIMEOUT = 20.minutes

  def login
    redirect_to '/auth/saml'
  end

  def callback
    response = request.env['omniauth.auth']['extra']['response_object']
    info_from_assertion = Upvs.parse_info_from_upvs_response(response)

    create_session(user_info: info_from_assertion)
  end

  def logout
    if params[:SAMLRequest]
      clean_session

      redirect_to "/auth/saml/slo?#{slo_request_params.to_query}"
    elsif params[:SAMLResponse]
      redirect_to "/auth/saml/slo?#{slo_response_params.to_query}"
    else
      clean_session
      redirect_to '/auth/saml/spslo'
    end
  end

  private

  def authenticate
    if valid_session?(session)
      session[:login_expires_at] = SESSION_TIMEOUT.from_now
    else
      redirect_to root_path
    end
  end

  def create_session(user_info: nil)
    session[:login_expires_at] = SESSION_TIMEOUT.from_now
    session[:user_info] = user_info
    redirect_to root_path
  end

  def clean_session
    session[:login_expires_at] = nil
    session[:user_info] = nil
  end

  def valid_session?(session)
    session[:login_expires_at].try(:to_time).present? && session[:login_expires_at].to_time > Time.current
  end

  def auth_hash
    request.env['omniauth.auth']
  end

  def login_path
    auth_path
  end

  def default_after_login_path
    root_path
  end

  def slo_request_params
    params.permit(:SAMLRequest, :SigAlg, :Signature)
  end

  def slo_response_params(redirect_url: root_path)
    params.permit(:SAMLResponse, :SigAlg, :Signature).merge(RelayState: redirect_url)
  end
end
