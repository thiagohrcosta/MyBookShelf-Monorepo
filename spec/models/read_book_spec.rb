require 'rails_helper'

RSpec.describe ReadBook, type: :model do
  subject { build(:read_book) }

  it { should belong_to(:user) }
  it { should belong_to(:book) }
end
