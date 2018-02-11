defmodule Memory.Game do
  @moduledoc """
  This module represents the memory game state and the operations to the state.
  The state is composed of a map, holding:
  + tiles -> list of tiles (maps).
    - These tiles have:
      ~ value: value of card
      ~ found: true if match found, false otherwise
      ~ selected: true if tile currently selected, false otherwise
  + clicks -> number of clicks on cards the user has done in the current game
  + prev_tile -> keeps tracks of selection, if null first card selected, otherwise
                 pair made
  + locked -> true if locked, false otherwise, implemented to have delay when a
              pair is made and not count user's click during timeout
  """

  @doc """
  Function returns the state that defines a new game. Calls helper function
  Memory.Game.setup_tiles/1
  """
  def new() do
    %{
      tiles: setup_tiles(),
      clicks: 0,
      prev_tile: nil,
      locked: false
    }
  end


  # Setups up a list of tiles, where a tile is map describing value, if selected,
  # and if found. Values constrained to letters.
  defp setup_tiles() do
    letters = ~w(A A B B C C D D E E F F G G H H)
    Enum.shuffle(letters)
    |> Enum.map(fn letter ->
      %{
        value: letter,
        found: false,
        selected: false
      }
    end)
  end

  @doc """
  On click handler that updates the game according to the current state and
  currently selected card described by "loc". If all tiles are found the game
  will not update until restart button is hit. If the game is locked, the game
  will not update. Checks if locked to minimize race conditions.
  """
  def move(state, loc) do
    if all_tiles_found(state) || state.locked do
      state
    else
      {lock, tiles} = update_tiles(state, loc)

      Map.put(state, :clicks, state.clicks + 1)
      |> Map.put(:prev_tile, get_prev(state, loc))
      |> Map.put(:tiles, tiles)
      |> Map.put(:locked, lock)
    end
  end


  # Returns true if all tiles found, false otherwise
  defp all_tiles_found(state) do
    Enum.all?(state.tiles, fn tile ->
      tile.found == true
    end)
  end

  #Updates tiles according to currently selected card and the current state of
  #the game. Implements delay of game when match is not found.
  #
  # returns an updated version of the tiles' state depending on selection
  defp update_tiles(state, loc) do
    selected_tile = Enum.at(state.tiles, loc) |> Map.put(:selected, true)
    if state.prev_tile != nil do
      prev_tile = Enum.at(state.tiles, state.prev_tile)
      if selected_tile.value == prev_tile.value && loc != state.prev_tile do
        prev_tile = Map.put(prev_tile, :found, true) |> Map.put(:selected, false)
        selected_tile = Map.put(selected_tile, :found, true) |> Map.put(:selected, false)
        updated_tiles = List.replace_at(state.tiles, loc, selected_tile)
                        |> List.replace_at(state.prev_tile, prev_tile)
        {false, updated_tiles}
      else
        updated_tiles = List.replace_at(state.tiles, loc, selected_tile)
        {true, updated_tiles}
      end
    else
      {false, List.replace_at(state.tiles, loc, selected_tile)}
    end
  end

  # Handles matches, if prev_tile == nil -> the first pair return location,
  # otherwise pair made, return nil
  defp get_prev(state, loc) do
    if state.prev_tile == nil do
      loc
    else
      nil
    end
  end

  @doc """
  Unlocks game by unselecting all cards and setting locked to false.
  """
  def unlock(state) do
    state = Map.put(state, :locked, false)
    updated_tiles = Enum.map(state.tiles, fn tile ->
      if (tile.selected) do
        Map.put(tile, :selected, false)
      else
        tile
      end
    end)
    Map.put(state, :tiles, updated_tiles)
  end

end
