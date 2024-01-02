import { PropTypes } from 'prop-types'

const Filter = ({ filterValue, handlefunc }) => {
    
    Filter.propTypes = {
        filterValue: PropTypes.number,
        handlefunc: PropTypes.node.isRequired,
    }

    return (
        <div>
            filter shown with <input 
            value={filterValue} 
            onChange={handlefunc} 
            />
        </div>
    )
}

export default Filter