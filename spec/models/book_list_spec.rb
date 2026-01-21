require 'rails_helper'

RSpec.describe BookList, type: :model do
  subject { build(:book_list) }

  it { should belong_to(:user) }
  it { should belong_to(:book) }
end
