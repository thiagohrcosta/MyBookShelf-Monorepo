require 'rails_helper'

RSpec.describe Author, type: :model do
  subject { build(:author) }

  it { should validate_presence_of(:name) }
  it { should have_many(:books) }
end
