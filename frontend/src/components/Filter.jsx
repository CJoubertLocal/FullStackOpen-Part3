const Filter = ({filterValue, handlefunc}) => (
    <div>
        filter shown with <input 
        value={filterValue} 
        onChange={handlefunc} 
        />
    </div>
)

export default Filter