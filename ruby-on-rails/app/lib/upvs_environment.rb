module UpvsEnvironment
  extend self

  def sso_settings
    return @sso_settings if @sso_settings

    idp_metadata = OneLogin::RubySaml::IdpMetadataParser.new.parse_to_hash(File.read(sso_metadata_file('upvs')))
    sp_metadata = Hash.from_xml(File.read(sso_metadata_file(ENV.fetch('UPVS_SSO_SUBJECT')))).fetch('EntityDescriptor')

    @sso_settings ||= idp_metadata.merge(
      request_path: '/auth/saml',
      callback_path: '/auth/saml/callback',

      issuer: sp_metadata['entityID'],
      assertion_consumer_service_url: sp_metadata['SPSSODescriptor']['AssertionConsumerService'].first['Location'],
      single_logout_service_url: sp_metadata['SPSSODescriptor']['SingleLogoutService'].first['Location'],
      idp_sso_target_url: idp_metadata[:idp_sso_service_url],
      idp_slo_target_url: idp_metadata[:idp_slo_service_url],
      name_identifier_format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
      protocol_binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      sp_name_qualifier: sp_metadata['entityID'],
      idp_name_qualifier: idp_metadata[:idp_entity_id],

      idp_slo_session_destroy: proc { |env, session| },

      certificate: sso_certificate,
      private_key: sso_private_key,

      security: {
        authn_requests_signed: true,
        logout_requests_signed: true,
        logout_responses_signed: true,
        want_assertions_signed: true,
        want_assertions_encrypted: true,
        want_name_id: true,
        metadata_signed: true,
        embed_sign: true,

        digest_method: XMLSecurity::Document::SHA512,
        signature_method: XMLSecurity::Document::RSA_SHA512,
      },

      double_quote_xml_attribute_values: true,
      force_authn: false,
      passive: false,
      allow_clock_drift: 5000
    )
  end

  private

  def sso_private_key
    ENV.fetch('UPVS_SSO_SP_PRIVATE_KEY')
  end

  def sso_certificate
    ENV.fetch('UPVS_SSO_SP_CERTIFICATE')
  end

  def sso_metadata_file(subject)
    Rails.root.join('security', "#{subject}_#{Upvs.env}.metadata.xml").to_s
  end
end
