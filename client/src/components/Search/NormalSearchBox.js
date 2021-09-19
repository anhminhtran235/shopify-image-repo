import { SearchBar } from '../styles/SearchStyle';
import { connect } from 'react-redux';

import { setTempSearchText } from '../../redux/actions/search';

const NormalSearchBox = ({ tempSearchText, setTempSearchText }) => {
  return (
    <SearchBar>
      <input
        type='text'
        placeholder='Username, filename'
        value={tempSearchText}
        onChange={(e) => setTempSearchText(e.target.value)}
      />
    </SearchBar>
  );
};

const mapStateToProps = (state) => {
  return {
    tempSearchText: state.search.tempSearchText,
  };
};

export default connect(mapStateToProps, { setTempSearchText })(NormalSearchBox);
