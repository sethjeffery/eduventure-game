# 🎭 EduVenture - AI-Powered Choose Your Own Adventure

A modern choose-your-own-adventure game engine built with Next.js, featuring AI-generated stories powered by OpenAI.

## ✨ Features

- **🎮 Interactive Gameplay**: Rich storytelling with multiple branching paths
- **🎯 Dynamic Choices**: Multiple paths and consequences for your decisions
- **📊 Stats Tracking**: Character progression with customizable attributes
- **🤖 AI Story Generation**: Create unlimited adventures using OpenAI prompts
- **🎨 Beautiful UI**: Modern glass morphism design with responsive layout
- **📱 Mobile-Friendly**: Optimized for both desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- OpenAI API key (for AI story generation)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd eduventure-game
```

2. Install dependencies:

```bash
npm install
```

3. Set up your OpenAI API key:

```bash
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎮 How to Play

1. **Choose Adventure Type**:

   - Play the sample "Mysterious Forest" adventure
   - Generate a new adventure with AI

2. **AI Adventure Generation**:

   - Enter a creative prompt (e.g., "A space station mystery")
   - Click "Generate Adventure"
   - Wait for AI to create your unique story

3. **Gameplay**:
   - Read the story content
   - Make choices to progress
   - Manage your health and make strategic choices
   - Discover multiple endings

## 🛠️ Technical Architecture

### Core Components

- **Adventure Engine** (`useAdventureGame`): Manages game state and logic
- **Story Renderer** (`StoryStep`): Displays rich text content with markdown
- **Choice System** (`ChoiceButton`): Interactive decision-making interface
- **Game Status** (`GameStatus`): Health, stats, and progress tracking
- **AI Generator** (`AdventureGenerator`): OpenAI-powered story creation

### Data Structure

Adventures follow a structured JSON format with:

- **Steps**: Individual story segments with content and choices
- **Choices**: Player decisions with optional conditions
- **Effects**: Automatic state changes (inventory)
- **Conditions**: Requirements for displaying certain choices

## 🎨 Customization

### Creating Manual Adventures

Add new adventures to `src/data/` following the `Adventure` interface:

```typescript
export const myAdventure: Adventure = {
  id: "my-adventure",
  title: "My Adventure",
  description: "An exciting journey",
  startingStepId: "start",
  steps: {
    start: {
      id: "start",
      title: "The Beginning",
      content: "Your adventure starts here...",
      choices: [
        /* ... */
      ],
      onEnter: [
        /* optional effects */
      ],
    },
  },
};
```

### Styling

The app uses Tailwind CSS with a custom gradient theme. Modify styles in component files or extend the Tailwind configuration.

## 📝 AI Prompt Tips

For best results when generating adventures:

- Be specific about setting and theme
- Include character roles or objectives
- Mention desired complexity level
- Specify any special mechanics you want

Example prompts:

- "A detective solving supernatural crimes in Victorian London"
- "A time traveler trying to prevent a historical disaster"
- "A cyberpunk hacker uncovering a corporate conspiracy"

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect to [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js, including:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source. Feel free to use and modify as needed.

## 🆘 Support

If you encounter issues:

1. Check that your OpenAI API key is properly configured
2. Ensure you have sufficient OpenAI credits
3. Review the browser console for error messages
4. Open an issue on GitHub with details

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and OpenAI
