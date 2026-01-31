# Bendegúz Szczuka - Personal Portfolio

A bold, futuristic portfolio website built with HTML, SCSS, and JavaScript. Designed for GitHub Pages (Jekyll).

## 🚀 Running Locally

You have two options to run this project locally.

### Option 1: Node.js (Recommended for fast dev)

This method uses a local proxy to compile SCSS without needing Jekyll installed.

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Start Development Server**:

    ```bash
    npm run dev
    ```

    This will:
    - Compile `assets/css/style-dev.scss` to `assets/css/style.css`.
    - Watch for changes.
    - Open the site in your browser (usually `http://127.0.0.1:8080`).

> **Note**: When editing styles, modify **`assets/css/style-dev.scss`** or the partials in **`_sass/`**. The main `assets/css/style.scss` is only for GitHub Pages production build.

### Option 2: Jekyll (Official)

If you have Ruby and Jekyll installed:

```bash
bundle install
bundle exec jekyll serve
```

## 📂 Project Structure

- `index.html`: Main entry point.
- `_sass/`: SCSS Partials (variables, mixins).
- `assets/css/style.scss`: **Production** entry point (contains YAML front matter for GitHub).
- `assets/css/style-dev.scss`: **Local Development** entry point.
- `assets/js/`: JavaScript files.

## 🎨 Design System

- **Colors**: Neon gradients on deep black (`#050505`).
- **Typography**: *Clash Display* (Headers) + *Epilogue* (Body).
- **Effects**: CSS Filters (Gaussian Blur), Backdrop Filter (Glassmorphism).

## 🚢 Deployment

Push to the `main` branch of your GitHub repository and enable **GitHub Pages** in the repository settings (Source: `main`, `/root`).
