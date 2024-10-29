class ApplicationController < ActionController::Base
  include Authentication
  after_action :verify_authorized
end
