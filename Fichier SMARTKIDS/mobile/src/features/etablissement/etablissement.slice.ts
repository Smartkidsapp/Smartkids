import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setItemAsync } from 'expo-secure-store';
import { RootState } from '../../store';
import { Etablissement } from '../../types';
import { CreateEtablissementDto } from './etablissement.request';
import etablissementApiSlice from './etablissement.apiSlice';

interface EtablissementState {
  etablissement: Etablissement | null;
  myEtablissement: Etablissement | null;
  createEtablissement: CreateEtablissementDto | null;
  editEtablissement: Etablissement | null;
  etablissements: Etablissement[] | null,
  mapEtablissements: Etablissement[] | null,
  nextPage: number,
}

const initialState: EtablissementState = {
  etablissement: null,
  myEtablissement: null,
  createEtablissement: null,
  editEtablissement: null,
  etablissements: null,
  mapEtablissements: null,
  nextPage: 1,
};

const etablissementSlice = createSlice({
  name: 'etablissement',
  initialState,
  reducers: {
    setCreateEtablissement(state, { payload }: PayloadAction<Partial<CreateEtablissementDto>>) {
      if (state.createEtablissement) {
        state.createEtablissement = { ...state.createEtablissement, ...payload };
      } else {
        state.createEtablissement = payload as CreateEtablissementDto;
      }
    },
    setEditEtablissement(state, { payload }: PayloadAction<Partial<Etablissement>>) {
      if (state.editEtablissement) {
        state.editEtablissement = { ...state.editEtablissement, ...payload };
      } else {
        state.editEtablissement = payload as Etablissement;
      }
    },
    setEtbsNextPage: (state: EtablissementState, { payload }: PayloadAction<number>) => {
      state.nextPage = payload;
    },
    initCreateEtablissement: (state: EtablissementState, { payload }: PayloadAction<void>) => {
      state.createEtablissement = null;
    },
    setMapEtablissements(state, { payload }: PayloadAction<Partial<Etablissement[]>>) {
      state.mapEtablissements = payload as Etablissement[];
    },
    setEtablissements(state, { payload }: PayloadAction<Partial<Etablissement[]>>) {
      state.etablissements = payload as Etablissement[];
    }
  },
  extraReducers(builder) {
    builder
    /*.addMatcher(
      etablissementApiSlice.endpoints.getEtablissements.matchFulfilled,
      (state, { payload }) => {
        if (state.nextPage == 1) {
          state.etablissements = payload.data;
        } else {
          if (state.etablissements) {
            state.etablissements = [...state.etablissements, ...payload.data];
          } else {
            state.etablissements = payload.data
          }
        }
        state.nextPage = state.nextPage + 1;
      },
    )*/
    .addMatcher(
      etablissementApiSlice.endpoints.getMyEtablissement.matchFulfilled,
      (state, { payload }) => {
        state.myEtablissement = payload.data;
      }
    )
    .addMatcher(
      etablissementApiSlice.endpoints.editEtablissement.matchFulfilled,
      (state, { payload }) => {
        state.myEtablissement = payload.data.etablissement;
      }
    )
  }

});

export const { setEtablissements, setCreateEtablissement, setEtbsNextPage, setEditEtablissement, initCreateEtablissement, setMapEtablissements } = etablissementSlice.actions;

export const selectEtablissement = (state: RootState) => state.etablissement;

export default etablissementSlice.reducer;
