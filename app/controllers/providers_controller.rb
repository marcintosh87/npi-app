class ProvidersController < ApplicationController
    require 'rest-client'

    def get_providers
        npi = params[:npi]
        url = "https://npiregistry.cms.hhs.gov/api/?version=2.1&number=#{npi}"
        res = RestClient.get(url)

        render json: res
        
    end
    
end
