export default {
  async fetch(request) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello Fadil</title>
  <style>
    body { margin: 0; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0ea5e9; }
    h1 { color: white; font-size: 3rem; }
  </style>
</head>
<body>
  <h1>Hello Fadil 👋</h1>
</body>
</html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
};
