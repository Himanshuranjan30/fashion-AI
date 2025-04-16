# FashionFit - AI-Powered Fashion Assistant

FashionFit is an intelligent fashion assistant that helps users complete their outfits by recommending clothing items based on uploaded images or text descriptions. Using advanced AI technologies, it provides personalized style suggestions while considering user preferences and current fashion trends.

## Features

- 🧾 **Text Input**: Describe any clothing item to get matching suggestions
- 📸 **Image Upload**: Upload photos of clothing items for visual matching
- 🎯 **Smart Recommendations**: Get complete outfit suggestions based on your item
- 🎨 **Style Selection**: Choose from various style categories (casual, streetwear, formal, etc.)
- 📦 **Virtual Try-On**: Preview outfits in a mood board layout
- 🧍‍♂️ **Body Type Customization**: Get recommendations suited to your body type
- 🔄 **Save & Share**: Save your favorite looks and share them with friends

## Tech Stack

- Frontend: Vue 3 + Vite + TypeScript
- Styling: Tailwind CSS
- State Management: Pinia
- Image Upload: Firebase Storage
- Authentication: Firebase Auth
- Database: Firebase Firestore
- AI Services: OpenAI GPT-4 + Replicate API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fashionfit.git
   cd fashionfit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_REPLICATE_API_KEY=your_replicate_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/      # Reusable Vue components
├── views/           # Page components
├── stores/          # Pinia stores
├── router/          # Vue Router configuration
├── assets/          # Static assets
├── api/            # API integration
└── utils/          # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT-4 API
- Replicate for image processing APIs
- Firebase for backend services
- Vue.js team for the amazing framework 