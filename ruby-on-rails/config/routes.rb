# == Route Map
#

Rails.application.routes.draw do
  namespace :upvs do
    get :login
    get :logout
  end

  scope "auth/saml", as: :upvs, controller: :upvs do
    get :login
    get :logout

    post :callback
  end

  get :auth, path: "prihlasenie", to: "upvs#login"

  root "sessions#login"
end
