import { SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";

import React from "react";

interface SearchInputProps {
  size?: string;
  placeholder: string;
  searchInput: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  size = "450px",
  placeholder,
  searchInput,
  onSearch,
}) => {
  const { colorMode } = useColorMode();

  const onClear = () => {
    onSearch?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(event);
  };

  return (
    <Box>
      <InputGroup width={size}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          value={searchInput}
          onChange={handleChange}
          bg={colorMode === "dark" ? "gray.700" : "white"}
          placeholder={placeholder}
        />
        {searchInput && (
          <InputRightElement cursor="pointer">
            <SmallCloseIcon color="blue.600" onClick={onClear} />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};

export default SearchInput;
