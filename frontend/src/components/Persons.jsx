import PersonService from '../services/persons'

const Persons = ({persons, personSetter, filterName, notificationSetter, notificationStyleSetter}) => {

    const displayPersonList = (filterName === '')
        ? persons.
            map(p => PersonRow(p, persons, personSetter, notificationSetter, notificationStyleSetter))
        : persons.
            filter(p => 
                p.name.toLowerCase().includes(filterName.toLowerCase())
            ).
            map(p => PersonRow(p, persons, personSetter, notificationSetter, notificationStyleSetter))
    
    return (
        <>
            {displayPersonList}
        </>
    )
}

const PersonRow = (p, persons, personSetter, notificationSetter, notificationStyleSetter) => {
    if (p !== undefined && p !== null) {
        return (
            <p key={p.id}>
                {p.name} {p.number} {DeleteButton(
                                        p.id, 
                                        persons, 
                                        personSetter, 
                                        notificationSetter, 
                                        notificationStyleSetter)}
            </p>
        )
    } else {
        return (
            <></>
        )
    }
}

const DeleteButton = (id, persons, personSetter, notificationSetter, notificationStyleSetter) => (
    <button 
        onClick={() => {
            PersonService.deletePerson(
                id, 
                persons, 
                personSetter, 
                notificationSetter, 
                notificationStyleSetter
            )
        }}>
        delete
    </button>
)



export default Persons