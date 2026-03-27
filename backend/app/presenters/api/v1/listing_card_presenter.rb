# frozen_string_literal: true

module Api
  module V1
    class ListingCardPresenter < ListingPresenter
      def as_json
        base_payload.merge(agent_name: listing.agent_name)
      end
    end
  end
end
