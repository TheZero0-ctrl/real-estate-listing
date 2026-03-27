# frozen_string_literal: true

module Api
  module V1
    class ListingsController < ApplicationController
      def index
        relation = Listings::FilterQuery.call(Property.visible_to(is_admin?), listing_params)
        page, per_page = pagination_params
        total_count = relation.except(:select, :joins, :includes, :preload, :eager_load, :order).count

        pagy, paginated_relation = pagy(:offset, relation, page:, limit: per_page, count: total_count)
        listings = Listings::FilterQuery.with_index_projection(paginated_relation)

        render json: {
          data: listings.map { |listing| Api::V1::ListingCardPresenter.new(listing).as_json },
          meta: pagination_meta(pagy)
        }
      end

      def show
        listing = Property
                  .visible_to(is_admin?)
                  .includes(:agent)
                  .find_by(id: params[:id])

        return render json: { error: "Listing not found" }, status: :not_found unless listing

        render json: { data: Api::V1::ListingDetailPresenter.new(listing, is_admin: is_admin?).as_json }
      end

      private

      def listing_params
        params.permit(
          :price_min,
          :price_max,
          :beds,
          :baths,
          :property_type,
          :suburb,
          :keyword,
          :listing_status,
          :page,
          :per_page,
          :format,
          sort: %i[key direction]
        )
      end
    end
  end
end
