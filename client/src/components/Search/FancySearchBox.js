import React, { useState } from 'react';
import { resetIdCounter, useCombobox } from 'downshift';
import { connect } from 'react-redux';

import { Dropdown, DropdownItem, SearchBar } from '../styles/SearchStyle';
import { useDebouncedCallback, boldIfMatch } from '../../util/util';
import { getLabels, setCurrentLabel } from '../../redux/actions/search';

const FancySearchBox = ({ searchLabels, getLabels, setCurrentLabel }) => {
  const [input, setInput] = useState({ value: '' });

  const findItemsDebounced = useDebouncedCallback(getLabels, 350);
  resetIdCounter();

  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
    isOpen,
  } = useCombobox({
    items: searchLabels,
    onInputValueChange({ inputValue }) {
      setInput({ value: inputValue });
      findItemsDebounced(inputValue);
    },
    onSelectedItemChange({ selectedItem }) {
      setCurrentLabel(selectedItem);
    },
    itemToString: (label) => label,
  });

  return (
    <SearchBar>
      <div {...getComboboxProps()} className='input-wrapper'>
        <input
          {...getInputProps({
            placeholder: 'Labels',
            id: 'search',
          })}
        />
      </div>
      <Dropdown className='dropdown' {...getMenuProps()}>
        {isOpen &&
          searchLabels.map((label, index) => (
            <DropdownItem
              key={label}
              {...getItemProps({ item: label })}
              active={index === highlightedIndex}
              onClick={() => {
                setCurrentLabel(label);
              }}
            >
              {boldIfMatch(label, input.value)}
            </DropdownItem>
          ))}
        {isOpen && !searchLabels.length && (
          <DropdownItem>No item found for {input.value}</DropdownItem>
        )}
      </Dropdown>
    </SearchBar>
  );
};

const mapStateToProps = (state) => {
  return {
    searchLabels: state.search.searchLabels,
  };
};

export default connect(mapStateToProps, { getLabels, setCurrentLabel })(
  FancySearchBox
);
