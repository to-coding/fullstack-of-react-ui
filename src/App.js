import Note from './components/Note'
import {useEffect, useState} from "react";
import noteService from './services/notes'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id)
        const changedNote = {...note, important: !note.important}

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
        console.log(`importance of ${id} needs to be toggled`)
    }

    const hook = () => {
        console.log('effect')
        noteService
            .getAll('http://localhost:3001/notes')
            .then(initialNotes => {
                console.log('promise fulfilled')
                setNotes(initialNotes)
            })
    }

    useEffect(hook, [])
    console.log('render', notes.length, 'notes')

    const handleNoteChange = (event) => {
        console.log(event.target.value)
        setNewNote(event.target.value)
    }
    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5,
        }
        noteService
            .create(noteObject)
            .then(returnedNote => {
                console.log(returnedNote)
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)
    return (
        <div>
            <h1>Notes</h1>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>
        </div>
    );
}

export default App;
