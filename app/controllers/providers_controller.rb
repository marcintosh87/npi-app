class ProvidersController < ApplicationController
    require 'rest-client'

    def get_providers
        url = "https://npiregistry.cms.hhs.gov/api/?version=2.1&number=#{1285637231}"
        res = RestClient.get(url)

        render json: res
        
    end
    
end
