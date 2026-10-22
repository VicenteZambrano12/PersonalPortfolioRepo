# Personal Portfolio app

Application to serve as the gateway to my personal portfolio projects.

## Description

This repository contains a web application designed to serve as the gateway to my personal portfolio in a secure, visually attractive, and cost-effective way. It provides information about my projects, demo videos, and access to my demo project applications hosted on Google Cloud Platform (GCP). Access is secured through Firebase Authentication and managed through my user pool.

Feel free to use it!

## App logo

The supplied robot artwork is served as an optimized 512px PNG at
[`frontend/public/logo.png`](frontend/public/logo.png), shared by the header,
YouTube card, and presentation viewer. Browser favicons (ICO and 32px PNG) and
an Apple touch icon (180px PNG) are also stored in `frontend/public/`.

## 1. Business overview, use case, and value

In today's technology and AI development landscape, individuals and businesses share a common challenge: demonstrating their skills to potential clients, contractors, and hiring teams. A list of past work is not enough; real use cases help show how that knowledge translates into working solutions.

I created this project as a secure, time-efficient, and cost-effective gateway to my portfolio demos. It presents my skills and projects in a simple way through explanations, demo videos, and access to working applications.

The business value is straightforward: showcase my work while keeping access to the demos under my control. Only the people I authorize can use them, rather than making LLM access available to everyone.

The application starts with a basic, low-cost foundation designed to scale and support more features as my portfolio grows.

## 2. Repo structure

The repository has three main modules:

- **`frontend/`**: The React web application that presents my portfolio projects.
- **`infra/`**: The infrastructure module for Terraform files and deployment configuration.
- **`server/`**: The backend that handles application authentication.

The `auth-portal/` directory contains the HTML for the authentication portal served by the application. The `.github/workflows/` directory contains the GitHub Actions workflows. The `Dockerfile` and this README are located at the repository root.

```text
PersonalPortfolioRepo/
├── .github/
│   └── workflows/           # GitHub Actions workflows
├── auth-portal/
│   └── index.html           # Authentication portal HTML
├── frontend/                # React web application
│   ├── public/              # Static assets
│   └── src/                 # Application source and tests
├── infra/                   # Infrastructure module for Terraform
├── server/                  # Authentication backend
│   ├── app.js
│   ├── index.js
│   └── test/
├── Dockerfile               # Container image definition
├── nginx.conf.template      # Nginx configuration template
└── README.md
```