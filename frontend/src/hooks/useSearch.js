import { useState } from 'react';

export const useSearch = (initialValue = '') => {
  const [search, setSearch] = useState(initialValue);
  return [search, setSearch];
};
