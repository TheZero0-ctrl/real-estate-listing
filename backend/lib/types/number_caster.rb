# frozen_string_literal: true

module Types
  module NumberCaster
    module_function

    def integer(value, min: nil, max: nil)
      return nil if value.blank?

      number = Integer(value, 10)
      return nil if min && number < min
      return nil if max && number > max

      number
    rescue ArgumentError, TypeError
      nil
    end

    def decimal(value, min: nil, max: nil)
      return nil if value.blank?

      number = BigDecimal(value.to_s)
      return nil if min && number < min
      return nil if max && number > max

      number
    rescue ArgumentError
      nil
    end
  end
end
