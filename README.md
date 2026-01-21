📚 MyBookShelf API

MyBookShelf is a Ruby on Rails API-only application for managing personal bookshelves, book reviews, and reading statistics.

This project follows clean architecture, explicit business rules, full test coverage, and complete API documentation.

This README is intentionally detailed so that GitHub Copilot (VS Code) can follow the project standards and generate consistent code.

🧱 Tech Stack
Backend

Ruby on Rails (API only)

PostgreSQL

Devise (authentication)

JWT (token-based auth)

Active Storage

Cloudinary (image storage)

Stripe (subscriptions & billing)

Testing

RSpec

FactoryBot

Shoulda Matchers

SimpleCov

Documentation

Swagger (OpenAPI)

rswag

HTTP Client (development)

Axios (frontend integration / CORS support)

🧩 Architecture & Conventions

API only (--api)

Controllers must be thin

Business logic must live in:

app/services

app/queries (for complex queries)

No logic inside serializers

JSON responses must be consistent

Versioned API (/api/v1)

Authorization via policies or service objects

All endpoints must be tested

All endpoints must be documented in Swagger

🔐 Authentication & Authorization
Authentication

Devise for user management

JWT for API authentication

Token required on all protected endpoints

Authorization rules

Any user can view public data

Only authenticated users can:

Add books to their bookshelf

Post reviews (with conditions)

Only users with an active Stripe subscription can:

Create new books

Create new authors

Create new publishers

👤 User
Attributes

full_name

email

password

password_confirmation

has_one_attached :avatar

Associations

has_many :book_reviews

has_many :book_lists

has_many :read_books

has_one :subscription

🏢 Publisher (Editora)
Attributes

name

Rules

Name must be unique (case insensitive)

✍️ Author
Attributes

name

nationality

biography

has_one_attached :photo

📖 Book
Attributes

title

original_title

summary

pages

edition (Brazil, US, France, etc)

release_year

author_id

publisher_id

has_one_attached :box_cover

Rules

A book cannot have the same title + edition duplicated

Different editions of the same book may coexist

Examples

Allowed:

"O Iluminado" (PT-BR)

"The Shining" (US)

Not allowed:

Another "O Iluminado" (PT-BR)

Another "The Shining" (US)

Associations

belongs_to :author

belongs_to :publisher

has_many :book_reviews

has_many :book_lists

⭐ Book Review
Description

A registered user can rate and review a book.

Attributes

rating (0 to 10)

review

user_id

book_id

Rules

A user can only review a book if the book is marked as acquired

A user can only review a book once

📚 BookList (Bookshelf)
Description

Represents a book inside a user’s personal library.

Status enum

acquired

reading

finished

abandoned

wishlist

Associations

belongs_to :user

belongs_to :book

📆 Read Books Registry
Description

When a book is marked as finished, a record must be created.

Attributes

user_id

book_id

month

year

Rules

Used for reading statistics

Must allow filtering by month and year

📊 User Dashboard Endpoint
Must return

Reading statistics

Last 10 books read

Last reviews posted by the user

Last books created on the platform (global)

🏠 Home Page Endpoint
Must return

Latest books created

Latest publishers created

Latest reviews and ratings

🔍 Book Search
Endpoints

GET /books

List books

Show global average rating only

GET /books/:id

Full book details

Reviews and ratings

💳 Subscriptions (Stripe)
Rules

Users must have an active subscription to:

Create books

Create authors

Create publishers

Without subscription:

User can log in

View all content

View their own data

🧪 Testing Requirements

100% coverage on:

Models

Requests

Services

RSpec for all endpoints

FactoryBot for data creation

Shoulda Matchers for validations & associations

SimpleCov enabled by default

📄 API Documentation

All endpoints must be documented with Swagger

Request examples

Response examples

Error responses

🖼️ Image Storage

Active Storage

Cloudinary as provider

Used for:

User avatars

Author photos

Book covers

📁 Suggested Folder Structure
app/
  controllers/
    api/
      v1/
  models/
  services/
  queries/
  serializers/
  policies/
spec/
  requests/
  models/
  services/

🚀 Final Notes for Copilot

Follow RESTful conventions

Prefer explicit code over magic

Do not skip validations

Always write tests

Always update Swagger

Keep controllers minimal

Business rules must be enforced at model or service level