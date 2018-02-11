defmodule MemoryWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  # channel "room:*", MemoryWeb.RoomChannel
	channel "games:*", MemoryWeb.GamesChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket
  # transport :longpoll, Phoenix.Transports.LongPoll

  # Connect to socket
  def connect(_params, socket) do
    {:ok, socket}
  end

  # Return nil to make socket anonymous
  def id(_socket), do: nil
end
