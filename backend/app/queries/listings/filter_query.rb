# frozen_string_literal: true

module Listings
  class FilterQuery < ApplicationQuery
    SORT_KEYS = {
      "published" => :published_at,
      "price" => :price_cents,
      "beds" => :bedrooms,
      "baths" => :bathrooms
    }.freeze

    SORT_DIRECTIONS = %w[asc desc].freeze
    DEFAULT_SORT_KEY = "published"
    DEFAULT_SORT_DIRECTION = "desc"

    INDEX_SELECT_COLUMNS = %w[
      properties.id
      properties.title
      properties.headline
      properties.listing_status
      properties.suburb
      properties.state
      properties.price_cents
      properties.bedrooms
      properties.bathrooms
      properties.property_type
      properties.thumbnail_url
    ].freeze

    def initialize(relation = nil, params = {})
      super(relation)
      @params = params.to_h.deep_symbolize_keys
    end

    def call
      result = @relation
      result = filter_by_listing_status(result)
      result = filter_by_suburb(result)
      result = filter_by_property_type(result)
      result = filter_by_price_range(result)
      result = filter_by_beds(result)
      result = filter_by_baths(result)
      result = filter_by_keyword(result)
      result = select_index_fields(result)
      apply_sort(result)
    end

    private

    def default_relation
      Property.all
    end

    def filter_by_suburb(relation)
      suburb = @params[:suburb].to_s.strip
      return relation if suburb.blank?

      relation.where("LOWER(properties.suburb) = ?", suburb.downcase)
    end

    def filter_by_listing_status(relation)
      listing_status = @params[:listing_status].to_s.strip
      return relation if listing_status.blank?
      return relation unless Property.listing_statuses.key?(listing_status)

      relation.where(listing_status: listing_status)
    end

    def filter_by_property_type(relation)
      property_type = @params[:property_type].to_s.strip
      return relation if property_type.blank?
      return relation unless Property.property_types.key?(property_type)

      relation.where(property_type: property_type)
    end

    def filter_by_price_range(relation)
      min_price = cast_price_to_cents(@params[:price_min])
      max_price = cast_price_to_cents(@params[:price_max])
      min_price, max_price = max_price, min_price if min_price && max_price && min_price > max_price

      result = relation
      result = result.where("properties.price_cents >= ?", min_price) if min_price
      result = result.where("properties.price_cents <= ?", max_price) if max_price
      result
    end

    def filter_by_beds(relation)
      beds = ::Types::NumberCaster.integer(@params[:beds], min: 0)
      return relation unless beds

      relation.where("properties.bedrooms >= ?", beds)
    end

    def filter_by_baths(relation)
      baths = ::Types::NumberCaster.decimal(@params[:baths], min: 0)
      return relation unless baths

      relation.where("properties.bathrooms >= ?", baths)
    end

    def filter_by_keyword(relation)
      keyword = @params[:keyword].to_s.strip
      return relation if keyword.blank?

      escaped = ActiveRecord::Base.sanitize_sql_like(keyword)
      pattern = "%#{escaped}%"

      relation.where(
        "properties.title ILIKE :pattern OR properties.description ILIKE :pattern OR properties.street_address ILIKE :pattern",
        pattern:
      )
    end

    def apply_sort(relation)
      key = normalized_sort_key
      direction = normalized_sort_direction
      column = SORT_KEYS.fetch(key)

      if column == :published_at
        relation.order(Arel.sql("properties.published_at #{direction.to_s.upcase} NULLS LAST")).order(id: direction)
      else
        relation.order(column => direction, id: direction)
      end
    end

    def select_index_fields(relation)
      relation.joins(:agent).select(*INDEX_SELECT_COLUMNS, Arel.sql("agents.full_name AS agent_name"))
    end

    def normalized_sort_key
      key = @params.dig(:sort, :key).to_s
      SORT_KEYS.key?(key) ? key : DEFAULT_SORT_KEY
    end

    def normalized_sort_direction
      direction = @params.dig(:sort, :direction).to_s.downcase
      SORT_DIRECTIONS.include?(direction) ? direction.to_sym : DEFAULT_SORT_DIRECTION.to_sym
    end

    def cast_price_to_cents(value)
      number = ::Types::NumberCaster.decimal(value, min: 0)
      return nil unless number

      (number * 100).round(0).to_i
    end
  end
end
