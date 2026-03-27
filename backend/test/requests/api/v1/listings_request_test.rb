require "test_helper"

module Api
  module V1
    class ListingsRequestTest < ActionDispatch::IntegrationTest
      test "index returns listing cards for public users" do
        property = create_property(
          title: "Card payload listing",
          suburb: "CardSuburb",
          listing_status: "active"
        )

        get "/api/v1/listings"

        assert_response :success

        payload = response_payload
        listing = payload.fetch("data").find { |item| item.fetch("id") == property.id }

        assert_equal Property.visible_scope(false).count, payload.dig("meta", "total_count")
        assert_not_nil listing
        assert_equal property.title, listing.fetch("title")
        assert_equal property.agent.full_name, listing.fetch("agent_name")
        assert_nil listing["agent"]
      end

      test "index applies filters and ignores invalid values" do
        matching = create_property(
          suburb: "FilterVille",
          property_type: "house",
          price_cents: 81_000_000,
          bedrooms: 4,
          listing_status: "active"
        )
        create_property(
          suburb: "FilterVille",
          property_type: "house",
          price_cents: 60_000_000,
          bedrooms: 2,
          listing_status: "active"
        )

        get "/api/v1/listings", params: {
          suburb: "filterville",
          property_type: "house",
          price_min: "800000",
          beds: "invalid"
        }

        assert_response :success

        payload = response_payload
        ids = payload.fetch("data").map { |item| item.fetch("id") }

        assert_includes ids, matching.id
        assert_not_includes ids, properties(:one).id
      end

      test "index supports nested friendly sort params" do
        low_price = create_property(price_cents: 35_000_000, suburb: "SortTown", title: "Low Price")
        high_price = create_property(price_cents: 95_000_000, suburb: "SortTown", title: "High Price")

        get "/api/v1/listings", params: {
          suburb: "sorttown",
          sort: { key: "price", direction: "asc" }
        }

        assert_response :success

        payload = response_payload
        ids = payload.fetch("data").map { |item| item.fetch("id") }
        low_index = ids.index(low_price.id)
        high_index = ids.index(high_price.id)

        assert_not_nil low_index
        assert_not_nil high_index
        assert_operator low_index, :<, high_index
      end

      test "index supports pagination metadata" do
        3.times do |index|
          create_property(
            suburb: "PaginationTown",
            listing_status: "active",
            title: "Pagination Listing #{index}"
          )
        end

        get "/api/v1/listings", params: { suburb: "paginationtown", per_page: 2, page: 2 }

        assert_response :success

        payload = response_payload
        assert_equal 3, payload.dig("meta", "total_count")
        assert_equal 2, payload.dig("meta", "total_pages")
        assert_equal 2, payload.dig("meta", "page")
        assert_equal 2, payload.dig("meta", "per_page")
        assert_equal 1, payload.fetch("data").size
      end

      test "show hides admin fields for public requests" do
        get "/api/v1/listings/#{properties(:one).id}"

        assert_response :success

        payload = response_payload.fetch("data")
        assert_nil payload["listing_status"]
        assert_nil payload["internal_status_notes"]
      end

      test "show returns not found for draft listing in public mode" do
        listing = create_property(listing_status: "draft")

        get "/api/v1/listings/#{listing.id}"

        assert_response :not_found
      end

      test "show includes admin-only fields for admins" do
        listing = create_property(listing_status: "draft", internal_status_notes: "Pending valuation")

        get "/api/v1/listings/#{listing.id}", headers: { "X-Admin" => "true" }

        assert_response :success

        payload = response_payload.fetch("data")
        assert_equal listing.listing_status, payload.fetch("listing_status")
        assert_equal listing.internal_status_notes, payload.fetch("internal_status_notes")
      end

      private

      def create_property(overrides = {})
        Property.create!(
          {
            agent: agents(:one),
            title: "Generated Listing #{SecureRandom.hex(4)}",
            headline: "Well located and bright",
            description: "Close to transit and parks",
            street_address: "1 Test Lane",
            suburb: "Kathmandu",
            state: "Bagmati",
            postcode: "44600",
            country: "Nepal",
            price_cents: 75_000_000,
            bedrooms: 3,
            bathrooms: 2.0,
            property_type: "house",
            listing_status: "active",
            thumbnail_url: "https://example.com/test.jpg",
            published_at: Time.current
          }.merge(overrides)
        )
      end

      def response_payload
        JSON.parse(response.body)
      end
    end
  end
end
