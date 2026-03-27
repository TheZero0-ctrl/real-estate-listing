class AddListingsFilterIndexes < ActiveRecord::Migration[8.1]
  def up
    add_index :properties,
              %i[created_at id],
              name: "index_properties_on_created_at_id",
              if_not_exists: true

    add_index :properties,
              %i[listing_status created_at],
              name: "index_properties_on_status_created",
              if_not_exists: true

    add_index :properties,
              %i[listing_status price_cents],
              name: "index_properties_on_status_price",
              if_not_exists: true

    add_index :properties,
              %i[listing_status bedrooms],
              name: "index_properties_on_status_bedrooms",
              if_not_exists: true

    add_index :properties,
              %i[listing_status bathrooms],
              name: "index_properties_on_status_bathrooms",
              if_not_exists: true

    add_index :properties,
              %i[listing_status property_type],
              name: "index_properties_on_status_property_type",
              if_not_exists: true

    execute <<~SQL
      CREATE INDEX IF NOT EXISTS index_properties_on_lower_suburb_status
      ON properties (LOWER(suburb), listing_status)
    SQL
  end

  def down
    remove_index :properties, name: "index_properties_on_created_at_id", if_exists: true
    remove_index :properties, name: "index_properties_on_status_created", if_exists: true
    remove_index :properties, name: "index_properties_on_status_price", if_exists: true
    remove_index :properties, name: "index_properties_on_status_bedrooms", if_exists: true
    remove_index :properties, name: "index_properties_on_status_bathrooms", if_exists: true
    remove_index :properties, name: "index_properties_on_status_property_type", if_exists: true
    remove_index :properties, name: "index_properties_on_lower_suburb_status", if_exists: true
  end
end
