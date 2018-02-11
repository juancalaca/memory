defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  @moduledoc """
  This module handles incoming messages to GamesChannel. Uses MemoryWeb.Backup
  to retrieve and store name, game pairs.
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

  # Handles in coming move message, backups updated state.
  def handle_in("move", %{"move" => loc}, socket) do
    game = Memory.Game.move(getbackup(socket.assigns[:name]), loc)
    backup(socket.assigns[:name], game)
    if game.locked do
      broadcast_change(socket.assigns[:name], game)
      game = Memory.Game.unlock(game)
      Process.sleep(1000)
      backup(socket.assigns[:name], game);
      broadcast_change(socket.assigns[:name], game)
      {:noreply, socket}
    else
      broadcast_change(socket.assigns[:name], game)
      {:noreply, socket}
    end
  end

  # Handles incoming restart message, amd backups new game state.
  def handle_in("restart", _payload, socket) do
    game = Memory.Game.new()
    backup(socket.assigns[:name], game)
    broadcast_change(socket.assigns[:name], game)
    {:noreply, socket}
  end

  # Backups game in MemoryWeb.Backup
  defp backup(name, game) do
    MemoryWeb.Backup.save_game(name, game)
  end

  defp getbackup(name) do
    MemoryWeb.Backup.get_game(name);
  end

  defp broadcast_change(name, game) do
    MemoryWeb.Endpoint.broadcast "games:" <> name, "update-state", %{"game" => game}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
