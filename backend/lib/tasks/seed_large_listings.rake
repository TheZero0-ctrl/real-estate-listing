# frozen_string_literal: true

namespace :data do
  desc "Reset and seed a fixed large listings dataset for performance testing"
  task seed_large_listings: :environment do
    agent_count = 250
    listing_count = 1_000_000
    batch_size = 10_000
    rng = Random.new(12_345)
    now = Time.current

    suburbs = [
      { suburb: "Kathmandu", state: "Bagmati", postcode: "44600" },
      { suburb: "Lalitpur", state: "Bagmati", postcode: "44700" },
      { suburb: "Bhaktapur", state: "Bagmati", postcode: "44800" },
      { suburb: "Pokhara", state: "Gandaki", postcode: "33700" },
      { suburb: "Biratnagar", state: "Koshi", postcode: "56613" },
      { suburb: "Butwal", state: "Lumbini", postcode: "32907" },
      { suburb: "Dharan", state: "Koshi", postcode: "56700" },
      { suburb: "Bharatpur", state: "Bagmati", postcode: "44200" },
      { suburb: "Hetauda", state: "Bagmati", postcode: "44100" },
      { suburb: "Janakpur", state: "Madhesh", postcode: "45600" }
    ].freeze

    title_prefixes = [ "Family Home", "Modern Residence", "City Apartment", "Garden Villa", "Corner Townhouse", "Quiet Retreat" ].freeze
    keyword_phrases = [ "close to schools", "great investment", "renovated kitchen", "mountain view", "easy commute", "move-in ready" ].freeze
    street_names = [ "Oak", "Pine", "Maple", "Lotus", "River", "Sunrise", "Hilltop", "Park", "Temple", "Lakeside" ].freeze

    status_pool = [
      *Array.new(65, "active"),
      *Array.new(15, "under_offer"),
      *Array.new(10, "sold"),
      *Array.new(7, "draft"),
      *Array.new(3, "archived")
    ].freeze

    property_types = Property.property_types.keys.freeze
    timestamp_started = Process.clock_gettime(Process::CLOCK_MONOTONIC)

    puts "Resetting agents and properties..."
    Property.delete_all
    Agent.delete_all

    puts "Creating #{agent_count} agents..."
    agent_rows = Array.new(agent_count) do |index|
      {
        full_name: "Agent #{index + 1}",
        email: "agent#{index + 1}@example.com",
        phone: "+977-98000#{format('%05d', index + 1)}",
        agency_name: "Agency #{(index % 25) + 1}",
        created_at: now,
        updated_at: now
      }
    end

    Agent.insert_all!(agent_rows)
    agent_ids = Agent.order(:id).pluck(:id)

    puts "Creating #{listing_count} properties in batches of #{batch_size}..."
    inserted = 0
    while inserted < listing_count
      remaining = listing_count - inserted
      current_batch_size = [ batch_size, remaining ].min

      rows = Array.new(current_batch_size) do
        location = suburbs[rng.rand(suburbs.length)]
        property_type = property_types[rng.rand(property_types.length)]
        listing_status = status_pool[rng.rand(status_pool.length)]
        bedrooms = rng.rand(1..6)
        bathrooms = [ 1.0, 1.5, 2.0, 2.5, 3.0 ].sample(random: rng)
        title_prefix = title_prefixes[rng.rand(title_prefixes.length)]
        phrase = keyword_phrases[rng.rand(keyword_phrases.length)]
        created_at = now - rng.rand(0..730).days - rng.rand(0..86_399).seconds

        base_price = {
          "house" => 75_000_000,
          "apartment" => 45_000_000,
          "townhouse" => 60_000_000,
          "villa" => 120_000_000,
          "land" => 35_000_000
        }.fetch(property_type)

        adjusted_price = [ base_price + rng.rand(-20_000_000..30_000_000), 15_000_000 ].max
        published_at = if %w[active under_offer sold].include?(listing_status)
          created_at + rng.rand(0..30).days
        end

        {
          agent_id: agent_ids[rng.rand(agent_ids.length)],
          title: "#{title_prefix} in #{location[:suburb]}",
          headline: "#{property_type.capitalize} with #{bedrooms} bed, #{bathrooms} bath",
          description: "#{phrase.capitalize}. Spacious layout with practical floor plan and bright interiors.",
          street_address: "#{rng.rand(1..350)} #{street_names[rng.rand(street_names.length)]} Street",
          suburb: location[:suburb],
          state: location[:state],
          postcode: location[:postcode],
          country: "Nepal",
          price_cents: adjusted_price,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          property_type: property_type,
          listing_status: listing_status,
          internal_status_notes: "Awaiting internal review.",
          published_at: published_at,
          thumbnail_url: "https://picsum.photos/seed/property-#{inserted + rng.rand(1..current_batch_size)}/800/600",
          created_at: created_at,
          updated_at: now
        }
      end

      Property.insert_all!(rows)
      inserted += current_batch_size

      puts "Inserted #{inserted}/#{listing_count} properties" if (inserted % 50_000).zero? || inserted == listing_count
    end

    elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - timestamp_started
    puts "Large dataset seed complete in #{elapsed.round(2)}s"
    puts "Agents: #{Agent.count}"
    puts "Properties: #{Property.count}"
    puts "Status breakdown: #{Property.group(:listing_status).count.inspect}"
  end
end
