class ApplicationController < ActionController::API
  include Pagy::Method
  include PaginationParams

  private

  def is_admin?
    ActiveModel::Type::Boolean.new.cast(request.headers["X-Admin"])
  end
end
