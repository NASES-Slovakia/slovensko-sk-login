require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

if ['development', 'test'].include? ENV['RAILS_ENV']
  Dotenv::Rails.load
end

module SlovenskoSkLogin
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    config.middleware.use Rack::Attack

    config.time_zone = 'Europe/Bratislava'
  end
end
