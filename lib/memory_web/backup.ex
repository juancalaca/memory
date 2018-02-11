defmodule MemoryWeb.Backup do
  use Agent
  @moduledoc """
  This module acts as an agent that stores a map of name => game, to store and
  retrieve started games.
  """

  def start_link(initial_state) do
    IO.write "hello"
    Agent.start_link(fn -> initial_state end, name: __MODULE__)
  end

  def get_game(name) do
    Agent.get(__MODULE__, fn state ->
      state["#{name}"]
    end)
  end

  def save_game(name, game) do
    Agent.update(__MODULE__, fn state ->
      Map.put(state, name, game)
    end)
  end
end
