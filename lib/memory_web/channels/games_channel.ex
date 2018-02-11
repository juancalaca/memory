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
      socket = assign(socket, :game, game) |> assign(:name, name)
      {:ok, %{"join" => name, "game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Handles in coming move message, backups updated state.
  def handle_in("move", %{"move" => loc}, socket) do
    game = Memory.Game.move(socket.assigns[:game], loc)
    backup(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # Handles incoming restart message, amd backups new game state.
  def handle_in("restart", _payload, socket) do
    game = Memory.Game.new()
    backup(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # Handles unlocking, and stores new state.
  def handle_in("unlock", _payload, socket) do
    game = Memory.Game.unlock(socket.assigns[:game])
    backup(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Backups game in MemoryWeb.Backup
  def backup(name, game) do
    MemoryWeb.Backup.save_game(name, game)
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
