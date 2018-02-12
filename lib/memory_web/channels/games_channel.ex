defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  @moduledoc """
  This module handles incoming messages to GamesChannel. Uses MemoryWeb.Backup
  to retrieve and store name, game pairs. This channel makes sure that all users
  subscribed to the same channel (in same game name) get updates as to prevent
  race conditions in messages reaching the server, and provide real-time updates
  All clients are listening to "state-update" messages. 
  """

  @doc """
  Joins a new game, if a game already exists, joins already existing game.
  """
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = MemoryWeb.Backup.get_game(name) || Memory.Game.new()
      backup(name, game)
      socket = assign(socket, :name, name)
      {:ok, %{"join" => name, "game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @doc """
  Handles incoming move message, backups updated game state associated with socket
  name. Broadcasts the new game state to all users subscribed to channel game:[name].
  If the game is locked, the locked game is broadcasted to avoid race conditions.
  The game is then unlocked, backedup, and broadcasted.
  """
  def handle_in("move", %{"move" => loc}, socket) do
    game = Memory.Game.move(getbackup(socket.assigns[:name]), loc)
    backup(socket.assigns[:name], game)
    if game.locked do
      broadcast_change(socket.assigns[:name], game)
      game = Memory.Game.unlock(game)
      Process.sleep(1000)
      backup(socket.assigns[:name], game);
      broadcast_change(socket.assigns[:name], game)
      {:reply, {:ok, %{"game" => game}}, socket}
    else
      broadcast_change(socket.assigns[:name], game)
      {:reply, {:ok, %{"game" => game}}, socket}
    end
  end

  @doc """
  Handles incoming restart message, amd backups new game state.
  """
  def handle_in("restart", _payload, socket) do
    game = Memory.Game.new()
    backup(socket.assigns[:name], game)
    broadcast_change(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # Backups game in MemoryWeb.Backup Agent
  defp backup(name, game) do
    MemoryWeb.Backup.save_game(name, game)
  end

  # Gets backup from Backup Agent
  defp getbackup(name) do
    MemoryWeb.Backup.get_game(name);
  end

  # Broadcasts message to all clients subsrcibed to "game:name" channel
  defp broadcast_change(name, game) do
    MemoryWeb.Endpoint.broadcast "games:" <> name, "update-state", %{"game" => game}
  end

  # All users are registered per design choice
  defp authorized?(_payload) do
    true
  end
end
