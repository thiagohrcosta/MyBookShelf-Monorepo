require 'rails_helper'
require 'rswag/specs'

RSpec.configure do |config|
  # Rswag gem configuration
  config.openapi_root = Rails.root.join('swagger').to_s

  config.openapi_specs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'MyBookShelf API',
        version: 'v1',
        description: 'API for managing personal bookshelves, book reviews, and reading statistics'
      },
      paths: {},
      servers: [
        {
          url: 'http://localhost:3000',
          variables: {
            defaultHost: {
              default: 'localhost:3000'
            }
          }
        }
      ]
    }
  }

  config.openapi_format = :yaml
end
