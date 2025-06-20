# 🎭 EduVenture - AI-Powered Educational Adventure Game

https://eduventure-game.vercel.app/

A modern educational choose-your-own-adventure game built with Next.js and lots of AI, featuring AI-generated stories powered by OpenAI with integrated learning experiences.

## ✨ Features

- **🎓 Educational Focus**: Interactive learning through adventure with subject-based questions
- **🎮 Interactive Gameplay**: Rich storytelling with multiple branching paths
- **🎯 Smart Choice System**: Mix of adventure and educational choices with consequences
- **📊 Health System**: Strategic gameplay with heart-based health management
- **🤖 AI Story Generation**: Create unlimited adventures using OpenAI prompts
- **🎨 Beautiful UI**: Modern gradient design with responsive layout
- **📱 Mobile-Friendly**: Optimized for both desktop and mobile devices
- **🖼️ AI Image Generation**: Optional DALL-E powered images for story steps

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- OpenAI API key (for AI story generation)

### Installation

1. Clone the repository:

```bash
git clone git@github.com:sethjeffery/eduventure-game.git
cd eduventure-game
```

2. Install dependencies:

```bash
npm install
```

3. Set up your OpenAI API key by creating a `.env.local` file:

```bash
# Create .env.local file in the root directory
OPENAI_API_KEY=your_openai_api_key_here

# Feature Flags
# Set to "true" to enable AI image generation for story steps (expensive!)
# Set to "false" or remove to disable image generation (recommended for cost control)
NEXT_PUBLIC_ENABLE_IMAGE_GENERATION=false
ENABLE_IMAGE_GENERATION=false
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the root directory with the environment variables shown above

### Image Generation (Optional)

The app supports AI-generated images for story steps using DALL-E 3, but this feature is **disabled by default** due to cost considerations:

- **Cost**: Each image costs approximately $0.04-0.08 via OpenAI API
- **Performance**: Images take 10-30 seconds to generate
- **Storage**: Images are served directly from OpenAI (temporary URLs)

To enable image generation:

1. Set both environment variables to `"true"` in your `.env.local` file
2. Deploy/restart your application
3. Images will automatically generate for story steps with sufficient content

## 🎮 How to Play

1. **Choose Educational Subject**:

   - Select from Mathematics, Science, History, Geography, or English
   - Each subject provides context for educational questions during the adventure

2. **Select Difficulty Level**:

   - **Easy**: 7 story steps, simpler concepts
   - **Medium**: 10 story steps, moderate complexity
   - **Hard**: 15 story steps, advanced challenges

3. **Create Your Adventure**:

   - Enter a creative prompt (e.g., "A space station mystery")
   - Click "Generate Adventure"
   - Wait for AI to create your unique educational story

4. **Gameplay**:
   - Read the generated story content
   - Make choices to progress (mix of story and educational decisions)
   - Manage your health (hearts) - wrong answers cost hearts
   - Discover multiple endings based on your performance

## 🛠️ Technical Architecture

### Core Components

- **Adventure Engine** (`useStreamingAdventure`): Manages game state, streaming, and logic
- **Story Renderer** (`StreamingStoryStep`): Displays rich text content with markdown and streaming
- **Choice System** (`ChoiceButton`): Interactive decision-making interface
- **Game Status** (`GameStatus`): Health, stats, and progress tracking
- **AI Generator** (`AdventureGenerator`): Multi-step setup and OpenAI-powered story creation

### Key Features

- **Streaming Content**: Real-time story generation with progressive loading
- **Educational Integration**: Subject-specific questions mixed with adventure choices
- **Smart Difficulty**: Adaptive story length and complexity based on selected level
- **Health System**: Strategic consequences for incorrect educational answers
- **Image Generation**: Optional AI-generated visuals for immersive storytelling

### Data Structure

Adventures use a dynamic streaming format with:

- **Steps**: Generated story segments with content and choices
- **Choices**: Player decisions with correctness indicators (`correct: true/false`)
- **Effects**: Automatic state changes (heart loss for wrong answers)
- **Context**: Educational subject and difficulty level integration

## 🎨 Customization

### Styling

The app uses Tailwind CSS v4 with a custom gradient theme. Modify styles in component files or customize the gradient system in the UI components.

### Adding Educational Subjects

Add new subjects to `src/constants/index.ts`:

```typescript
export const EDUCATIONAL_SUBJECTS = [
  // existing subjects...
  {
    id: "new-subject",
    name: "New Subject",
    description: "Description of the subject",
  },
];
```

### Modifying Adventure Prompts

Update the adventure suggestions in `src/constants/subjects.ts`:

```typescript
export const ADVENTURE_PROMPTS = [
  // Add your custom adventure prompts here
  "Your custom adventure prompt",
];
```

## 📝 AI Prompt Tips

For best results when generating adventures:

- Be specific about setting and theme
- Include character roles or objectives
- Mention desired complexity level
- Consider how educational elements can be naturally integrated

Example prompts:

- "A detective solving supernatural crimes in Victorian London"
- "A time traveler trying to prevent a historical disaster"
- "A cyberpunk hacker uncovering a corporate conspiracy"
- "An underwater explorer discovering an ancient civilization"

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect to [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` environment variable
4. Optionally add `NEXT_PUBLIC_ENABLE_IMAGE_GENERATION=true` for image generation
5. Deploy!

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

## 🔧 Development Notes

- The app uses **streaming responses** for real-time story generation
- Educational questions are dynamically integrated into adventure stories
- Image generation is optional and disabled by default for cost control
- The game uses a **heart system** where wrong educational answers cost health

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and OpenAI
