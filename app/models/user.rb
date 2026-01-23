class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one_attached :avatar
  has_many :book_reviews
  has_many :book_lists
  has_many :read_books
  has_one :subscription
  has_many :authors
  has_many :publishers
  has_many :books

  enum role: { user: "user", admin: "admin" }

  validates :full_name, presence: true
  validates :role, presence: true
end
