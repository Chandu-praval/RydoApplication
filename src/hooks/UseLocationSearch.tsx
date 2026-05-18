import { useState,useEffect } from "react"
export const UseLocationSearch=(query:string)=>{
    const [suggestions,setSuggestions]=useState<string[]>();
     const fetchSuggestions = async (search: string) => {
    if (search.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${search}&limit=5`
      );
      const data = await res.json();
      setSuggestions(data.features);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSuggestions(query);
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);
  return { suggestions, setSuggestions };
}