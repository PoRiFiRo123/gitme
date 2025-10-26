# GitRead: AI-Powered README Generator 🔥

GitRead is an AI-powered README generator designed to simplify and accelerate the creation of comprehensive documentation for your GitHub projects. Effortlessly create professional READMEs in seconds, enhancing project visibility and collaboration.

## ✨ Features

- 🚀 **AI-Powered Generation:** Automatically generates README content based on your repository's structure and code.
- 📝 **Markdown Editor:** Customize and refine your README with a built-in markdown editor.
- ⬇️ **Download & Copy:** Easily download the generated README as a `.md` file or copy the content to your clipboard.
- ⚙️ **Metadata Customization:** Add project descriptions, features, and license information to tailor your README.
- ⚡️ **Live Preview:** Instantly preview how your README will look with real-time updates.

## 🛠️ Tech Stack

| Category   | Technologies                               |
| ---------- | ------------------------------------------ |
| Frontend   | React, TypeScript, Vite, Tailwind CSS, shadcn-ui |
| State Management | @tanstack/react-query                    |
| UI Library | Radix UI, lucide-react                     |
| Utilities  | clsx, tailwind-merge                      |
| Other      | Supabase                                   |

## 📦 Installation & Setup

### Prerequisites

- Node.js (>=18)
- npm (>=8)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_PROJECT_ID="your_supabase_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
VITE_SUPABASE_URL="your_supabase_url"
```

Replace the placeholder values with your actual Supabase project credentials.

### Installation Steps

1.  **Clone the repository:**

    ```sh
    git clone <YOUR_GIT_URL>
    ```

2.  **Navigate to the project directory:**

    ```sh
    cd <YOUR_PROJECT_NAME>
    ```

3.  **Install the dependencies:**

    ```sh
    npm install
    ```

4.  **Start the development server:**

    ```sh
    npm run dev
    ```

5.  **Build for production:**

    ```sh
    npm run build
    ```

## 💻 Usage

1.  **Access the Application:**

    Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite during development).

2.  **Generate README:**

    Enter your GitHub repository URL. GitRead will analyze the repository and generate a README based on its contents.

3.  **Customize Metadata:**

    Optionally, add a project description, list of features, and license information through the metadata modal to enhance the generated README.

4.  **Edit and Preview:**

    Use the built-in markdown editor to refine the README content. A live preview will display the rendered markdown.

5.  **Download or Copy:**

    Download the final README as a `.md` file or copy the content to your clipboard for use in your GitHub repository.

## 🗂️ Project Structure

```
gitread/
├── .env                     # Environment variables
├── .gitignore               # Specifies intentionally untracked files that Git should ignore
├── README.md                # This file!
├── components.json          # Configuration for shadcn-ui components
├── eslint.config.js         # ESLint configuration file
├── index.html               # Main HTML entry point
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── public/
│   └── robots.txt           # Robots.txt file for web crawlers
├── src/
│   ├── App.tsx              # Main application component
│   ├── components/
│   │   ├── Footer.tsx       # Footer component
│   │   ├── MarkdownEditor.tsx # Markdown editor component
│   │   ├── MetadataModal.tsx  # Metadata modal component
│   │   ├── Navbar.tsx         # Navigation bar component
│   │   ├── ProcessingLogs.tsx # Component to display processing logs
│   │   └── ui/              # Reusable UI components (using shadcn-ui)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       └── aspect-ratio.tsx
│   └── main.tsx             # Entry point for React application
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🖼️ Screenshots

### Processing Page
<img width="800" height="487" alt="image" src="https://github.com/user-attachments/assets/17f6875b-e78b-4052-a121-4e8871187e3a" />

### Live Editor Page
<img width="800" height="526" alt="image" src="https://github.com/user-attachments/assets/235f0250-ecde-4224-961e-8fdd85a39cbf" />



## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Submit a pull request.

## 📜 License

[Apache-2.0](LICENSE)

## 📧 Contact

[Nishit](https://github.com/PoRiFiRo123)

## 🙏 Thanks + Attribution

- This project uses [shadcn-ui](https://ui.shadcn.com/) for UI components.
- Utilizes [Supabase](https://supabase.com/) for backend services.

_This README was generated using [GitRead](https://git-read.vercel.app)_
