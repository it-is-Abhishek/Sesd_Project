# Project Idea: NorthLane E-Commerce Platform

## Project Overview

NorthLane is a full-stack e-commerce website where authenticated users can enter the store, browse products, view product details, add items to the cart, and place orders. The project uses a React frontend, an Express backend, MongoDB for persistence, and Clerk for authentication.

## Problem Statement

Many student e-commerce projects stop at static product pages or mock checkout flows. This project is designed to demonstrate a more realistic architecture with:

- authenticated access
- persistent product and order data
- MongoDB-backed APIs
- clear object-oriented backend design

## Main Objectives

- Build a responsive e-commerce website
- Protect the storefront with authentication
- Store products and orders in MongoDB
- Apply OOP principles in backend implementation
- Document the system using software engineering diagrams

## Core Features

### User Features
- Sign in or sign up using Clerk
- Browse products by category
- Search the product catalog
- View full product details
- Add products to cart
- Complete checkout
- Store orders in MongoDB

### System Features
- Product seeding for first-time startup
- REST API for products, categories, and orders
- User-specific order lookup
- Clean separation of controller, service, and repository layers

## Technology Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: Clerk
- Styling: Custom CSS

## OOP Implementation Requirement

This project follows OOP principles in the backend:

- **Encapsulation**: business logic is wrapped inside service classes
- **Abstraction**: repositories hide direct database access from controllers
- **Single Responsibility**: controllers handle HTTP, services handle logic, repositories handle persistence
- **Modularity**: each domain concern is implemented in separate classes and files

### OOP Classes Used

- `CatalogController`
- `OrderController`
- `InquiryController`
- `CatalogService`
- `OrderService`
- `InquiryService`
- `AuthService`
- `ProductRepository`
- `OrderRepository`
- `MessageRepository`

## Expected Outcome

The final result is a properly documented e-commerce application that is not only functional, but also aligned with software engineering evaluation criteria such as diagrams, architecture clarity, and object-oriented implementation.
