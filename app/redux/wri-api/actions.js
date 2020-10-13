// @flow

import type { NamedAsyncAction } from "../redux.types";
import { ContinentReadAll, CountryReadAll } from "wri-api";
import { createAsyncAction } from "../conditionalActions";
import wriAPI from "../../api/wri";

export type FetchContinentsAction = NamedAsyncAction<"wri/continents", ContinentReadAll>;
export type FetchCountriesAction = NamedAsyncAction<"wri/countries", CountryReadAll>;

export function fetchContinents(): FetchContinentsAction {
  return createAsyncAction({
    type: "wri/continents",
    payload: wriAPI.continents.continentsGet()
  });
}

/**
 * Creates an action that when dispatched will make a request to fetch all countries
 *
 * @return The created action
 */
export function fetchCountries(): FetchCountriesAction {
  return createAsyncAction({
    type: "wri/countries",
    payload: wriAPI.countries.countriesGet()
  });
}
