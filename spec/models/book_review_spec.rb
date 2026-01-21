require 'rails_helper'

RSpec.describe BookReview, type: :model do
  subject { build(:book_review) }

  it { should validate_presence_of(:rating) }
  it { should validate_presence_of(:review) }
  it { should belong_to(:user) }
  it { should belong_to(:book) }
end
