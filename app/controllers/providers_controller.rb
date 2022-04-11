class ProvidersController < ApplicationController
    require 'rest-client'

    def get_providers
        #using rest client gem, the response from third party API is being routed to /providers_search/:npi
        npi = params[:npi]
        url = "https://npiregistry.cms.hhs.gov/api/?version=2.1&number=#{npi}"
        res = RestClient.get(url)

        render json: res
        
    end
    
end
