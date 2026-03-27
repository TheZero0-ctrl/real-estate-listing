class CreateProperties < ActiveRecord::Migration[8.1]
  def change
    create_table :properties do |t|
      t.references :agent, null: false, foreign_key: true, index: false
      t.string :title, null: false
      t.string :headline
      t.text :description
      t.string :street_address
      t.string :suburb, null: false
      t.string :state
      t.string :postcode
      t.string :country, null: false, default: "Nepal"
      t.bigint :price_cents, null: false
      t.integer :bedrooms, null: false, default: 0
      t.decimal :bathrooms, precision: 3, scale: 1, null: false, default: 0.0
      t.string :property_type, null: false, default: "house"
      t.string :listing_status, null: false, default: "draft"
      t.text :internal_status_notes
      t.datetime :published_at
      t.string :thumbnail_url

      t.timestamps
    end

    add_check_constraint :properties, "price_cents >= 0", name: "properties_price_cents_non_negative"
    add_check_constraint :properties, "bedrooms >= 0", name: "properties_bedrooms_non_negative"
    add_check_constraint :properties, "bathrooms >= 0", name: "properties_bathrooms_non_negative"
  end
end
