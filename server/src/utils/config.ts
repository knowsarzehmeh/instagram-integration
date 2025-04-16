import config from "config";

interface ServerConfig {
  client_url: string;
  host: string;
  port: number;
}

interface InstagramConfig {
  api_url: string;
  api_version: string;
  app_id: string;
  client_id: string;
  client_secret: string;
  graph_url: string;
  redirect_uri: string;
  token_url: string;
}

export const serverConfig = config.get<ServerConfig>("server");
export const instagramConfig = config.get<InstagramConfig>("instagram");
