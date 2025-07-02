const LoginForm = ({
  handleLogin,
  user,
  setUsername,
  setPassword,
  username,
  password,
}) => {
  if (user !== null) {
    return;
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          placeholder="username"
          aria-label="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          placeholder="password"
          aria-label="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
