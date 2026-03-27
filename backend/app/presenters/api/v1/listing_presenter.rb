# frozen_string_literal: true

module Api
  module V1
    class ListingPresenter
      attr_reader :listing

      def initialize(listing)
        @listing = listing
      end

      private

      def base_payload
        {
          id: listing.id,
          title: listing.title,
          headline: listing.headline,
          listing_status: listing.listing_status,
          suburb: listing.suburb,
          state: listing.state,
          price_cents: listing.price_cents,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          property_type: listing.property_type,
          thumbnail_url: listing.thumbnail_url
        }
      end

      def agent_payload
        agent = listing.agent
        {
          id: agent.id,
          full_name: agent.full_name,
          phone: agent.phone,
          agency_name: agent.agency_name
        }
      end
    end
  end
end
