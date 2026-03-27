# frozen_string_literal: true

module Api
  module V1
    class ListingDetailPresenter < ListingPresenter
      def initialize(listing, is_admin: false)
        super(listing)
        @is_admin = is_admin
      end

      def as_json
        payload = base_payload.merge(
          agent: agent_payload,
          description: listing.description,
          street_address: listing.street_address,
          postcode: listing.postcode,
          country: listing.country
        )

        return payload unless @is_admin

        payload.merge(internal_status_notes: listing.internal_status_notes)
      end
    end
  end
end
