defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Memory.Game.new()
      socket = assign(socket, :game, game) |> assign(:name, name)
      {:ok, %{"join" => name, "game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("move", %{"move" => loc}, socket) do
    game = Memory.Game.move(socket.assigns[:game], loc)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("restart", payload, socket) do
    game = Memory.Game.new()
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("unlock", payload, socket) do
    game = Memory.Game.unlock(socket.assigns[:game])
    socket = assign(socket, :game, game)
    Process.sleep(1000)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
