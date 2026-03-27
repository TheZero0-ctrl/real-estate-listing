# frozen_string_literal: true

rng = Random.new(1_234)

AGENT_ROWS = [
  { full_name: "Aarav Sharma", email: "aarav.sharma@example.com", phone: "+977-9800001001", agency_name: "Himalaya Realty" },
  { full_name: "Maya Karki", email: "maya.karki@example.com", phone: "+977-9800001002", agency_name: "Valley Homes" },
  { full_name: "Nischal Thapa", email: "nischal.thapa@example.com", phone: "+977-9800001003", agency_name: "Metro Nest" },
  { full_name: "Sita Gurung", email: "sita.gurung@example.com", phone: "+977-9800001004", agency_name: "Peak Properties" },
  { full_name: "Rohan Basnet", email: "rohan.basnet@example.com", phone: "+977-9800001005", agency_name: "City Key Estates" }
].freeze

SUBURBS = [
  { suburb: "Kathmandu", state: "Bagmati", postcode: "44600" },
  { suburb: "Lalitpur", state: "Bagmati", postcode: "44700" },
  { suburb: "Bhaktapur", state: "Bagmati", postcode: "44800" },
  { suburb: "Pokhara", state: "Gandaki", postcode: "33700" },
  { suburb: "Biratnagar", state: "Koshi", postcode: "56613" },
  { suburb: "Butwal", state: "Lumbini", postcode: "32907" },
  { suburb: "Dharan", state: "Koshi", postcode: "56700" },
  { suburb: "Bharatpur", state: "Bagmati", postcode: "44200" }
].freeze

TITLE_PREFIXES = [ "Family Home", "Modern Residence", "Garden Villa", "City Apartment", "Corner Townhouse", "Sunlit Retreat" ].freeze
KEYWORDS = [ "close to schools", "great investment", "renovated kitchen", "mountain view", "easy commute", "move-in ready" ].freeze

puts "Seeding agents and properties..."

Property.delete_all
Agent.delete_all

agents = AGENT_ROWS.map { |attrs| Agent.create!(attrs) }

listing_statuses = {
  "active" => 70,
  "draft" => 12,
  "under_offer" => 8,
  "sold" => 7,
  "archived" => 3
}

statuses = listing_statuses.flat_map { |status, count| Array.new(count, status) }.shuffle(random: rng)

100.times do |index|
  location = SUBURBS.sample(random: rng)
  property_type = Property.property_types.keys.sample(random: rng)
  bedrooms = rng.rand(1..6)
  bathrooms = [ 1.0, 1.5, 2.0, 2.5, 3.0 ].sample(random: rng)
  base_price = {
    "house" => 75_000_000,
    "apartment" => 45_000_000,
    "townhouse" => 60_000_000,
    "villa" => 120_000_000,
    "land" => 35_000_000
  }.fetch(property_type)

  price_cents = base_price + rng.rand(-15_000_000..25_000_000)
  status = statuses[index]

  title_prefix = TITLE_PREFIXES.sample(random: rng)
  keyword = KEYWORDS.sample(random: rng)
  title = "#{title_prefix} in #{location[:suburb]}"

  Property.create!(
    agent: agents.sample(random: rng),
    title:,
    headline: "#{property_type.capitalize} with #{bedrooms} bed, #{bathrooms} bath",
    description: "#{title}. #{keyword.capitalize}. Spacious layout with practical floor plan and bright interiors.",
    street_address: "#{rng.rand(1..220)} #{%w[Oak Pine Maple Lotus River Sunrise].sample(random: rng)} Street",
    suburb: location[:suburb],
    state: location[:state],
    postcode: location[:postcode],
    country: "Nepal",
    price_cents: [ price_cents, 15_000_000 ].max,
    bedrooms:,
    bathrooms:,
    property_type:,
    listing_status: status,
    internal_status_notes: "Needs final photo selection before publish.",
    published_at: (status == "active" ? rng.rand(1..120).days.ago : nil),
    thumbnail_url: "https://picsum.photos/seed/property-#{index + 1}/800/600"
  )
end

puts "Created #{Agent.count} agents"
puts "Created #{Property.count} properties"
puts "Status breakdown: #{Property.group(:listing_status).count.inspect}"
