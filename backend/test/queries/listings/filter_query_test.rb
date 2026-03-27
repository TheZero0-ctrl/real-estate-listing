require "test_helper"

module Listings
  class FilterQueryTest < ActiveSupport::TestCase
    setup do
      @agent = agents(:one)
    end

    test "filters by listing status when valid" do
      sold_listing = create_property(listing_status: "sold")
      active_listing = create_property(listing_status: "active")

      relation = Property.where(id: [ sold_listing.id, active_listing.id ])
      result_ids = FilterQuery.call(relation, listing_status: "sold").pluck(:id)

      assert_equal [ sold_listing.id ], result_ids
    end

    test "ignores unsupported listing status" do
      first_listing = create_property(listing_status: "active")
      second_listing = create_property(listing_status: "sold")

      relation = Property.where(id: [ first_listing.id, second_listing.id ])
      result_ids = FilterQuery.call(relation, listing_status: "paused").pluck(:id)

      assert_equal [ first_listing.id, second_listing.id ].sort, result_ids.sort
    end

    test "filters suburb with case insensitive exact match" do
      exact_match = create_property(suburb: "Kathmandu")
      partial_match = create_property(suburb: "Kathmandu Heights")

      relation = Property.where(id: [ exact_match.id, partial_match.id ])
      result_ids = FilterQuery.call(relation, suburb: "kathmandu").pluck(:id)

      assert_equal [ exact_match.id ], result_ids
    end

    test "applies price range in major units and swaps min and max when needed" do
      mid_price = create_property(price_cents: 80_000_000)
      low_price = create_property(price_cents: 60_000_000)
      high_price = create_property(price_cents: 100_000_000)

      relation = Property.where(id: [ mid_price.id, low_price.id, high_price.id ])
      result_ids = FilterQuery.call(relation, price_min: "900000", price_max: "700000").pluck(:id)

      assert_equal [ mid_price.id ], result_ids
    end

    test "applies beds and baths thresholds" do
      matching = create_property(bedrooms: 4, bathrooms: 2.5)
      non_matching = create_property(bedrooms: 2, bathrooms: 1.0)

      relation = Property.where(id: [ matching.id, non_matching.id ])
      result_ids = FilterQuery.call(relation, beds: "3", baths: "2").pluck(:id)

      assert_equal [ matching.id ], result_ids
    end

    test "matches keyword against title description and street address" do
      title_match = create_property(title: "Harbor View Residence")
      description_match = create_property(description: "Includes a private cinema room")
      street_match = create_property(street_address: "11 Lotus Lane")

      relation = Property.where(id: [ title_match.id, description_match.id, street_match.id ])

      assert_equal [ title_match.id ], FilterQuery.call(relation, keyword: "harbor").pluck(:id)
      assert_equal [ description_match.id ], FilterQuery.call(relation, keyword: "cinema").pluck(:id)
      assert_equal [ street_match.id ], FilterQuery.call(relation, keyword: "lotus").pluck(:id)
    end

    test "sorts by friendly sort params and falls back to default" do
      older = create_property(created_at: 3.days.ago, price_cents: 40_000_000)
      newer = create_property(created_at: 1.day.ago, price_cents: 90_000_000)

      relation = Property.where(id: [ older.id, newer.id ])

      default_order = FilterQuery.call(relation, {}).pluck(:id)
      price_order = FilterQuery.call(relation, sort: { key: "price", direction: "asc" }).pluck(:id)
      fallback_order = FilterQuery.call(relation, sort: { key: "unknown", direction: "sideways" }).pluck(:id)

      assert_equal [ newer.id, older.id ], default_order
      assert_equal [ older.id, newer.id ], price_order
      assert_equal default_order, fallback_order
    end

    test "with index projection exposes agent_name" do
      agent = Agent.create!(full_name: "Query Agent", email: "query.agent@example.com")
      listing = create_property(agent: agent)

      base_relation = FilterQuery.call(Property.where(id: listing.id), {})
      projected_listing = FilterQuery.with_index_projection(base_relation).first

      assert_equal "Query Agent", projected_listing.agent_name
    end

    private

    def create_property(overrides = {})
      Property.create!(
        {
          agent: @agent,
          title: "Query listing #{SecureRandom.hex(4)}",
          headline: "Good family option",
          description: "Spacious and bright layout",
          street_address: "22 Query Street",
          suburb: "Pokhara",
          state: "Gandaki",
          postcode: "33700",
          country: "Nepal",
          price_cents: 75_000_000,
          bedrooms: 3,
          bathrooms: 2.0,
          property_type: "house",
          listing_status: "active",
          thumbnail_url: "https://example.com/query.jpg",
          created_at: Time.current,
          updated_at: Time.current
        }.merge(overrides)
      )
    end
  end
end
