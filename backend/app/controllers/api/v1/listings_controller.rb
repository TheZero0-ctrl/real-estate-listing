# frozen_string_literal: true

module Api
  module V1
    class ListingsController < ApplicationController
      def index
        relation = Listings::FilterQuery.call(Property.visible_scope(is_admin?), listing_params)
        page, per_page = pagination_params

        pagy, listings = pagy(:offset, relation, page:, limit: per_page)

        render json: {
          data: listings.map { |listing| listing_payload(listing) },
          meta: pagination_meta(pagy)
        }
      end

      def show
        listing = Property
                  .visible_scope(is_admin?)
                  .includes(:agent)
                  .find_by(id: params[:id])

        return render json: { error: "Listing not found" }, status: :not_found unless listing

        render json: { data: listing_detail_payload(listing) }
      end

      private

      def listing_params
        params.permit(:price_min, :price_max, :beds, :baths, :property_type, :suburb, :keyword, sort: %i[key direction])
      end

      def listing_payload(listing)
        {
          id: listing.id,
          title: listing.title,
          headline: listing.headline,
          suburb: listing.suburb,
          state: listing.state,
          price_cents: listing.price_cents,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          property_type: listing.property_type,
          thumbnail_url: listing.thumbnail_url,
          agent_name: listing.agent_name
        }
      end

      def listing_detail_payload(listing)
        payload = {
          id: listing.id,
          title: listing.title,
          headline: listing.headline,
          suburb: listing.suburb,
          state: listing.state,
          price_cents: listing.price_cents,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          property_type: listing.property_type,
          thumbnail_url: listing.thumbnail_url,
          agent: agent_payload(listing.agent),
          description: listing.description,
          street_address: listing.street_address,
          postcode: listing.postcode,
          country: listing.country
        }

        return payload unless is_admin?

        payload.merge(
          listing_status: listing.listing_status,
          internal_status_notes: listing.internal_status_notes
        )
      end

      def agent_payload(agent)
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
