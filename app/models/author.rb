class Author < ApplicationRecord
  has_one_attached :photo
  has_many :books, dependent: :destroy
  belongs_to :user

  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
