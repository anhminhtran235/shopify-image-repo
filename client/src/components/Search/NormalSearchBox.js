import { SearchBar } from '../styles/SearchStyle';
import { connect } from 'react-redux';

import { setCurrentSearchText } from '../../redux/actions/search';

const NormalSearchBox = ({ currentSearchText, setCurrentSearchText }) => {
  return (
    <SearchBar>
      <input
        type='text'
        placeholder='Username, filename'
        value={currentSearchText}
        onChange={(e) => setCurrentSearchText(e.target.value)}
      />
    </SearchBar>
  );
};

const mapStateToProps = (state) => {
  return {
    currentSearchText: state.search.currentSearchText,
  };
};

export default connect(mapStateToProps, { setCurrentSearchText })(
  NormalSearchBox
);
