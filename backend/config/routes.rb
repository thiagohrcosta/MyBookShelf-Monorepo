Rails.application.routes.draw do
  devise_for :users
  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # Swagger/API Documentation Routes
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  # API V1 Routes
  namespace :api do
    namespace :v1 do
      # Authentication Routes
      post "users/register", to: "users#register"
      post "users/login", to: "users#login"
      post "users/logout", to: "users#logout"
      get "users/profile", to: "users#profile"
      patch "users/profile", to: "users#update_profile"

      # Books Routes
      resources :books, only: [ :index, :show, :create, :update, :destroy ]

      # Authors Routes
      resources :authors, only: [ :index, :show, :create, :update, :destroy ]

      # Publishers Routes
      resources :publishers, only: [ :index, :show, :create, :update, :destroy ]

      # Book Reviews Routes
      resources :book_reviews, only: [ :create, :destroy ]
      get "books/:book_id/reviews", to: "book_reviews#index"

      # Book Lists (Shelves) Routes
      resources :book_lists, only: [ :index, :create, :update, :destroy ]
      get "books/:book_id/book_list", to: "book_lists#show_by_book"
      get "users/:user_id/book_lists", to: "book_lists#user_books"

      # Read Books Registry Routes
      resources :read_books, only: [ :index, :create ]

      # Statistics Routes
      get "statistics", to: "statistics#index"

      # Dashboard Routes
      get "dashboard", to: "dashboard#index"

      # Home Page Routes
      get "home", to: "home#index"

      # Subscription Routes
      resources :subscriptions, only: [ :show, :create ]
      post "subscriptions/webhook", to: "subscriptions#webhook"
    end
  end
end
