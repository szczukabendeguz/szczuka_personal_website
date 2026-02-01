# Bendegúz Szczuka - Personal Portfolio

Welcome to my personal portfolio website! 🚀

I built this site to serve as a creative hub for my work, experience, and passions. As a Computer Science Student and Developer, I wanted a space where I could not only list my skills but also demonstrate them through a unique, custom-built design.

## 🎯 My Goal

My goal was to create a portfolio that feels alive and distinct. I moved away from standard templates to build something from scratch that reflects my taste: **bold, futuristic, and interactive**.

## 🛠️ How I Built It

This is a static site built with **HTML5**, **Sass (SCSS)**, and **JavaScript**.
I specifically chose to handle the build process locally to have full control over the styling and removed the dependency on Jekyll's server-side generation.

### Design Philosophy

- **Aesthetics**: I love the contrast of neon gradients against deep black (`#050505`).
- **Typography**: I paired *Clash Display* for impactful headers with *Epilogue* for clean readability.
- **Interactivity**: The site features custom CSS animations and JavaScript-powered scroll reveals to create a dynamic user experience.

## 💻 Running Locally

If you want to peek under the hood or run this locally:

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Start the Dev Server**:

    ```bash
    npm run dev
    ```

    This command watches the SCSS files for changes, compiles them to CSS on the fly, and serves the site locally.

3. **Build for Production**:
    Since I'm not using a server-side generator, I compile the CSS manually before pushing updates:

    ```bash
    npm run build:css
    ```

## 🚢 Deployment

The site is hosted on GitHub Pages as a static site.
Because I've added a `.nojekyll` file, GitHub simply serves the pre-built `index.html` and `assets/css/style.css` directly from the repository.

---
*Thanks for visiting! Feel free to reach out if you want to collaborate or just say hi.* 👋
