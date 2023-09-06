import { useState } from "react";


const useSearchFacade = () => {
  const [search, setSearch] = useState('');

  const _onChangeText = (value) => {
    setSearch(value)
  }
  
  return {
    search,
    _onChangeText
  }
}

export {
  useSearchFacade
}