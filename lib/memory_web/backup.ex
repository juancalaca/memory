defmodule MemoryWeb.Backup do
  use Agent
  @moduledoc """
  This module acts as an agent that stores a map of name => game, to store and
  retrieve started games.
  """

  @doc """
  Starts agent with provided initial state
  """
  def start_link(initial_state) do
    Agent.start_link(fn -> initial_state end, name: __MODULE__)
  end

  @doc """
  Returns game state of name, if found. Otherwise return nil
  """
  def get_game(name) do
    Agent.get(__MODULE__, fn state ->
      state["#{name}"]
    end)
  end

  @doc """
  Saves game in Agent state
  """
  def save_game(name, game) do
    Agent.update(__MODULE__, fn state ->
      Map.put(state, name, game)
    end)
  end
end
