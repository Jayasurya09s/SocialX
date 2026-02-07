POST http://localhost:5000/api/auth/signup

{
  "username": "jayanth",
  "email": "jayanth@test.com",
  "password": "123456"
}

🔹 Login

POST http://localhost:5000/api/auth/login

{
  "email": "jayanth@test.com",
  "password": "123456"
}

POST http://localhost:5000/api/posts

Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
🔹 Text + Emojis Post
{
  "text": "Hello SocialX 🚀",
  "emojis": ["🔥", "🚀"]
}

🔹 Image Post
{
  "imageUrl": "https://example.com/image.jpg"
}
🔹 Poll Post
{
  "poll": {
    "question": "Which stack do you prefer?",
    "options": [
      { "text": "MERN" },
      { "text": "MEAN" },
      { "text": "Spring Boot" }
    ]
  }
}
