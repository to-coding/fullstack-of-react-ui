import Note from './components/Note'
import {useEffect, useState} from "react";
import noteService from './services/notes'
import Notification from './components/Notification'

const Footer = () => {
    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    return(
        <div style={footerStyle}>
            <br/>
            <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
        </div>
    )
}
const App = () => {
    const [notes, setNotes] = useState(null)
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState('some error happened...')

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id)
        const changedNote = {...note, important: !note.important}

        noteService
            .update(id, changedNote).then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(error => {
                setErrorMessage(`Note '${note.content}' was already deleted from server`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                setNotes(notes.filter(n => n.id !== id))
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
    if (!notes){
        return null
    }
    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
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
            <Footer/>
        </div>
    );
}

export default App;
