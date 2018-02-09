defmodule Memory.Game do

  def new() do
    %{
      tiles: setup_tiles(),
      clicks: 0,
      prev_tile: nil,
      locked: false
    }
  end

  def setup_tiles() do
    letters = [
      "A", "A",
      "B", "B",
      "C", "C",
      "D", "D",
      "E", "E",
      "F", "F",
      "G", "G",
      "H", "H"
    ]
    Enum.shuffle(letters)
    |> Enum.map(fn letter ->
      %{
        value: letter,
        found: false,
        selected: false
      }
    end)
  end

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

  def all_tiles_found(state) do
    Enum.all?(state.tiles, fn tile ->
      tile.found == true
    end)
  end

  def update_tiles(state, loc) do
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

  def get_prev(state, loc) do
    if state.prev_tile == nil do
      loc
    else
      nil
    end
  end

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
