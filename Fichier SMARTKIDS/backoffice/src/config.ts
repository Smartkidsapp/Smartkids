interface AppConfig {
  apiUrl: string;
  serverUrl: string;
}

const config: AppConfig = {
  serverUrl: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
  apiUrl: import.meta.env.VITE_SERVER_URL + "/api/v1",
};

export default config;
