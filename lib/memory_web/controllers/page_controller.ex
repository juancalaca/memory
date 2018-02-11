defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  # Render index page
  def index(conn, _params) do
    render conn, "index.html"
  end

  # Render game associated to name
  def game(conn, params) do
    render conn, "game.html", game: params["game"]
  end
end
