require 'rails_helper'

RSpec.describe User, type: :model do
  subject { build(:user) }

  it { should validate_presence_of(:full_name) }
  it { should have_many(:book_reviews) }
  it { should have_many(:book_lists) }
  it { should have_many(:read_books) }
  it { should have_one(:subscription) }
end
