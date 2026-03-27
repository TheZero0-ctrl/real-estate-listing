# frozen_string_literal: true

class Property < ApplicationRecord
  belongs_to :agent

  enum :listing_status, %w[draft active under_offer sold archived].index_by(&:itself), validate: true
  enum :property_type, %w[house apartment townhouse villa land].index_by(&:itself), validate: true

  validates :title, :suburb, :price_cents, :bedrooms, :bathrooms, :property_type, :listing_status, presence: true
  validates :price_cents, :bedrooms, :bathrooms, numericality: { greater_than_or_equal_to: 0 }

  def self.visible_scope(is_admin)
    if is_admin
      all
    else
      active
    end
  end
end
