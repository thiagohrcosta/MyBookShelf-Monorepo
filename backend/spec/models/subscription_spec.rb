require 'rails_helper'

RSpec.describe Subscription, type: :model do
  subject { build(:subscription) }

  it { should belong_to(:user) }
  it { should validate_presence_of(:stripe_id) }
  it { should validate_presence_of(:status) }
end
