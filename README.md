<h1>FrenzyQuiz</h1>

<p>FrenzyQuiz is a real-time interactive quiz platform that enables users to create, manage, and engage with a variety of quiz formats including multiple-choice, true/false, and short-answer questions. It provides real-time feedback and a final leaderboard, enhancing the interactive experience for both hosts and players.</p>

<h2>Features</h2>

<h3>For All Users</h3>
<ul>
  <li><strong>Registration and Login:</strong> Secure sign-up and login functionality, with token-based authentication across devices.</li>
  <li><strong>Quiz Management:</strong> Users can create, update, and manage quizzes. Hosts can control quiz flow, including starting the quiz and moving to the next question.</li>
  <li><strong>Room Management:</strong> Hosts can open a quiz room by generating a QR code. Players can join a room either by scanning the QR code or entering a quiz ID.</li>
  <li><strong>Persistent Sessions:</strong> If a user exits a quiz room, their session is saved, allowing them to rejoin without re-entering the quiz ID.</li>
</ul>

<h3>For Players</h3>
<ul>
  <li><strong>Real-time Interaction:</strong> Players receive questions and submit answers in real-time. Feedback is provided after each question and at the end of the quiz.</li>
  <li><strong>Leaderboard:</strong> Post-quiz, players can view their rankings and quiz results.</li>
  <li><strong>Quiz Review:</strong> Players can access past quizzes to review their performance and answers.</li>
</ul>

<h3>For Hosts</h3>
<ul>
  <li><strong>Question Control:</strong> Hosts send questions to players and control the quiz pace by moving to subsequent questions.</li>
  <li><strong>Performance Insights:</strong> After each question and at the end of the quiz, hosts can view a detailed leaderboard and performance metrics.</li>
</ul>

<h2>Technology Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React JS</li>
  <li><strong>Real-time Communication:</strong> Socket.io</li>
  <li><strong>Backend:</strong> Node.js with Express</li>
  <li><strong>Database:</strong> PostgreSQL</li>
  <li><strong>Authentication:</strong> Firebase Authentication</li>
  <li><strong>Hosting:</strong> GCP Windows-based virtual machine</li>
</ul>

<h2>Running the Application</h2>

<h3>Running the Application Using Docker</h3>
<p>You can run the FrenzyQuiz application directly using Docker. Follow these steps:</p>

<h4>1. Pull the Docker Images</h4>
<pre><code>docker pull nhanvyn/frenzyquiz-client:latest
docker pull nhanvyn/frenzyquiz-server:latest</code></pre>

<h4>2. Set Up Supabase PostgreSQL</h4>
<p>Before running the server, you need to set up a Supabase project and obtain the necessary PostgreSQL connection details.</p>
<ul>
  <li>Go to <a href="https://supabase.com">Supabase</a> and create a new project.</li>
  <li>Once the project is set up, navigate to the <strong>Database</strong> section to find the following details:</li>
  <ul>
    <li><strong>DB_USER:</strong> Your Supabase PostgreSQL username.</li>
    <li><strong>DB_HOST:</strong> The host URL for your Supabase PostgreSQL instance.</li>
    <li><strong>DB_DATABASE:</strong> The name of your Supabase PostgreSQL database.</li>
    <li><strong>DB_PASSWORD:</strong> Your Supabase PostgreSQL password.</li>
    <li><strong>DB_PORT:</strong> The port number, typically <code>5432</code>.</li>
  </ul>
</ul>

<h4>3. Set Up Firebase</h4>
<p>You also need to set up a Firebase project to handle authentication and obtain the service account credentials.</p>
<ul>
  <li>Go to <a href="https://firebase.google.com">Firebase Console</a> and create a new project.</li>
  <li>Set up Firebase Authentication and enable the sign-in methods you want to support.</li>
  <li>Generate a Firebase service account key and encode it in base64:</li>
  <ul>
    <li>Navigate to <strong>Project Settings &gt; Service Accounts</strong>, and generate a new private key.</li>
    <li>Base64 encode the downloaded JSON file and store the result as <code>FIREBASE_SERVICE_ACCOUNT_BASE64</code>.</li>
  </ul>
</ul>

<h4>4. Run the Containers</h4>
<p>Once you have the required environment variables, you can run the Docker containers:</p>
<pre><code>docker run -e DB_USER=your_supabase_db_user \
           -e DB_HOST=your_supabase_db_host \
           -e DB_DATABASE=your_supabase_db_name \
           -e DB_PASSWORD=your_supabase_db_password \
           -e DB_PORT=5432 \
           -e FIREBASE_SERVICE_ACCOUNT_BASE64=your_firebase_service_account_base64 \
           -p 3500:3500 nhanvyn/frenzyquiz-server:latest
           
docker run -p 3000:3000 nhanvyn/frenzyquiz-client:latest</code></pre>

<h4>5. Access the Application</h4>
<p>Once the containers are running, you can access the client application in your web browser:</p>
<ul>
  <li><strong>Client:</strong> <a href="http://localhost:3000">http://localhost:3000</a></li>
  <li><strong>Server API:</strong> <a href="http://localhost:3500">http://localhost:3500</a></li>
</ul>

<h3>Running the Application Locally</h3>
<p>If you prefer to run the application locally without Docker, follow these steps:</p>

<pre><code># Running the Server
cd server
npm install
npm run dev

# Running the Client
cd client
npm install
npm start</code></pre>
