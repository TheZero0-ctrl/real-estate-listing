# frozen_string_literal: true

class Agent < ApplicationRecord
  has_many :properties, dependent: :restrict_with_exception

  validates :full_name, :email, presence: true
end
