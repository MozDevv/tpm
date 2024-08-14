"use client";
import { createContext, useContext, useState } from "react";

export const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchContextProvider = ({ children }) => {
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const setSearchedKeywordValue = (keyword) => {
    setSearchedKeyword(keyword);
  };

  return (
    <SearchContext.Provider
      value={{ searchedKeyword, setSearchedKeyword: setSearchedKeywordValue }}
    >
      {children}
    </SearchContext.Provider>
  );
};
