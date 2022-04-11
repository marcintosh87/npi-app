Rails.application.routes.draw do
  get "/providers_search/:npi", to: 'providers#get_providers'
  resources :providers
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


end
