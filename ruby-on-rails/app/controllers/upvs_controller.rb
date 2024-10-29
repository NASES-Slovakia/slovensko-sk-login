class UpvsController < ActionController::API
  include Authentication
  skip_before_action :authenticate

  def login
    redirect_to '/auth/saml'
  end

  def callback
    response = request.env['omniauth.auth']['extra']['response_object']
    saml_identifier = response.attributes["Subject.UPVSIdentityID"]

    create_session(saml_identifier: saml_identifier)
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

  def slo_request_params
    params.permit(:SAMLRequest, :SigAlg, :Signature)
  end

  def slo_response_params(redirect_url: root_path)
    params.permit(:SAMLResponse, :SigAlg, :Signature).merge(RelayState: redirect_url)
  end
end
