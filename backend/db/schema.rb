# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_27_062519) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "agents", force: :cascade do |t|
    t.string "agency_name"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "full_name", null: false
    t.string "phone"
    t.datetime "updated_at", null: false
  end

  create_table "properties", force: :cascade do |t|
    t.bigint "agent_id", null: false
    t.decimal "bathrooms", precision: 3, scale: 1, default: "0.0", null: false
    t.integer "bedrooms", default: 0, null: false
    t.string "country", default: "Nepal", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.string "headline"
    t.text "internal_status_notes"
    t.string "listing_status", default: "draft", null: false
    t.string "postcode"
    t.bigint "price_cents", null: false
    t.string "property_type", default: "house", null: false
    t.datetime "published_at"
    t.string "state"
    t.string "street_address"
    t.string "suburb", null: false
    t.string "thumbnail_url"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.check_constraint "bathrooms >= 0::numeric", name: "properties_bathrooms_non_negative"
    t.check_constraint "bedrooms >= 0", name: "properties_bedrooms_non_negative"
    t.check_constraint "price_cents >= 0", name: "properties_price_cents_non_negative"
  end

  add_foreign_key "properties", "agents"
end
