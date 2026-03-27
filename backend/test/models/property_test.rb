require "test_helper"

class PropertyTest < ActiveSupport::TestCase
  setup do
    @agent = agents(:one)
  end

  test "is valid with required attributes" do
    property = build_property

    assert property.valid?
  end

  test "is invalid without property_type" do
    property = build_property(property_type: nil)

    assert_not property.valid?
    assert_includes property.errors[:property_type], "can't be blank"
  end

  test "is invalid when listing_status is unsupported" do
    property = build_property(listing_status: "paused")

    assert_not property.valid?
    assert_includes property.errors[:listing_status], "is not included in the list"
  end

  test "is invalid when price is negative" do
    property = build_property(price_cents: -1)

    assert_not property.valid?
    assert_includes property.errors[:price_cents], "must be greater than or equal to 0"
  end

  private

  def build_property(overrides = {})
    Property.new(
      {
        agent: @agent,
        title: "Sample listing",
        suburb: "Kathmandu",
        price_cents: 50_000_000,
        bedrooms: 3,
        bathrooms: 2.0,
        property_type: "house",
        listing_status: "active"
      }.merge(overrides)
    )
  end
end
