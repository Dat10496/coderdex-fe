import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiService from '../../app/apiService';
import { POKEMONS_PER_PAGE } from '../../app/config';

export const getPokemons = createAsyncThunk('pokemons/getPokemons', async ({ page, search, type }, { rejectWithValue }) => {
    try {
        let url = `/pokemons?page=${page}&limit=${POKEMONS_PER_PAGE}`;
        if (type) url += `&types=${type}`;
        if (search) url += `&name=${search}`;
        const response = await apiService.get(url);
        const timeout = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('ok');
                }, 1000);
            });
        };
        await timeout();
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getPokemonById = createAsyncThunk(
  "pokemons/getPokemonById",
  async (id, { rejectWithValue }) => {
    try {
      let url = `/pokemons/${id}`;
      const response = await apiService.get(url);
      const timeout = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve("ok");
          }, 1000);
        });
      };
      await timeout();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addPokemon = createAsyncThunk(
  "pokemons/addPokemon",
  async ({ name, id, imgUrl, types }, { rejectWithValue }) => {
    try {
      let url = "/pokemons";
      await apiService.post(url, { name, id, url: imgUrl, types });

      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editPokemon = createAsyncThunk(
  "pokemons/editPokemon",
  async ({ name, id, url, types }, { rejectWithValue }) => {
    try {
      let url = `/pokemons/${id}`;
      await apiService.put(url, { name, url, types });
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePokemon = createAsyncThunk(
  "pokemons/deletePokemon",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      let url = `/pokemons/${id}`;
      await apiService.delete(url);
      dispatch(getPokemonById());
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const pokemonSlice = createSlice({
  name: "pokemons",
  initialState: {
    isLoading: false,
    pokemons: [],
    pokemon: {
      pokemon: null,
      nextPokemon: null,
      previousPokemon: null,
    },
    search: "",
    type: "",
    page: 1,
    errorMessage: "",
    isSuccess: false,
  },
  reducers: {
    changePage: (state, action) => {
      if (action.payload) {
        state.page = action.payload;
      } else {
        state.page++;
      }
    },
    typeQuery: (state, action) => {
      state.type = action.payload;
    },
    searchQuery: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: {
    [getPokemons.pending]: (state, action) => {
      state.isLoading = true;
      state.errorMessage = "";
    },
    [getPokemonById.pending]: (state) => {
      state.isLoading = true;
      state.errorMessage = "";
    },

    [addPokemon.pending]: (state) => {
      state.isLoading = true;
      state.errorMessage = "";
      state.isSuccess = false;
    },
    [deletePokemon.pending]: (state) => {
      state.isLoading = true;
      state.errorMessage = "";
    },
    [editPokemon.pending]: (state) => {
      state.isLoading = true;
      state.errorMessage = "";
    },
    [getPokemons.fulfilled]: (state, action) => {
      state.isLoading = false;
      const { search, type } = state;
      if ((search || type) && state.page === 1) {
        state.pokemons = action.payload;
      } else {
        state.pokemons = [...state.pokemons, ...action.payload];
      }
    },
    [getPokemonById.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.pokemon = action.payload;
    },
    [addPokemon.fulfilled]: (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    },
    [deletePokemon.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [editPokemon.fulfilled]: (state) => {
      state.isLoading = true;
    },
    [getPokemons.rejected]: (state, action) => {
      state.isLoading = false;
      state.pokemons = [];
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [getPokemonById.rejected]: (state, action) => {
      state.isLoading = false;

      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },

    [addPokemon.rejected]: (state, action) => {
      state.isLoading = false;
      state.pokemon = {};
      state.pokemons = [];
      state.isSuccess = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [deletePokemon.rejected]: (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
    [editPokemon.rejected]: (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = action.error.message;
      }
    },
  },
});

const { actions, reducer } = pokemonSlice;
export const { changePage, searchQuery, typeQuery } = actions;
export default reducer;
