import { useState } from 'react'

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('')
    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }
    const addNote = (event) => {
        event.preventDefault()
        createNote({
            content: newNote,
            important: false,
        })

        setNewNote('')
    }
    return(
        <div className="formDiv">
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleNoteChange}
                    placeholder='write here note content'
                />
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default NoteForm