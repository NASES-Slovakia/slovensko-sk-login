module Upvs
  def self.env
    @env ||= ActiveSupport::StringInquirer.new(ENV.fetch('UPVS_ENV', 'fix'))
  end

  def self.parse_info_from_upvs_response(response)
    assertion = parse_assertion(response)

    exp = response.not_on_or_after.to_i
    nbf = response.not_before.to_i
    iat = assertion.attributes['IssueInstant'].to_time.to_i
    now = Time.now.to_f

    raise ArgumentError, :exp if exp <= now
    raise ArgumentError, :nbf if nbf > now
    raise ArgumentError, :iat if iat > nbf

    {
      "subject": {
        "name": response.attributes['Subject.FormattedName'].to_s,
        "sub": response.attributes['SubjectID'].to_s,
        "saml_identifier": response.attributes["Subject.UPVSIdentityID"],
      },
      "actor": {
        "name": response.attributes['Actor.FormattedName'].to_s,
        "sub": response.attributes['ActorID'].to_s
      },
      "saml_attributes": response.attributes.to_h,
    }
  end

  def self.parse_assertion(response)
    document = response.decrypted_document|| response.document
    assertion = REXML::XPath.first(document, '//saml:Assertion')

    raise ArgumentError unless assertion

    # force namespaces directly on element, otherwise they are not present
    assertion.namespaces.slice('dsig', 'saml', 'xsi').each do |prefix, uri|
      assertion.add_namespace(prefix, uri)
    end

    # force double quotes on attributes, actually preserve response format
    assertion.context[:attribute_quote] = :quote

    assertion
  end
end
