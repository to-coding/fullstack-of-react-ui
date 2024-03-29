import Note from './components/Note'
import { useEffect, useRef, useState } from 'react'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const Footer = () => {
    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    return (
        <div style={footerStyle}>
            <br/>
            <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
        </div>
    )
}
const App = () => {
    const [notes, setNotes] = useState(null)
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState('some error happened...')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const noteFormRef = useRef()


    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(() => {
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
            .getAll('/api/notes')
            .then(initialNotes => {
                console.log('promise fulfilled')
                setNotes(initialNotes)
            })
    }

    useEffect(hook, [])
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteService.setToken(user.token)
        }
    }, [])
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })

            window.localStorage.setItem(
                'loggedNoteAppUser', JSON.stringify(user)
            )
            noteService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)
    if (!notes) {
        return null
    }

    const loginForm = () => {
        return (
            <Togglable buttonLabel='login'>
                <LoginForm
                    username={username}
                    password={password}
                    handleSubmit={handleLogin}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}/>
            </Togglable>
        )
    }

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility()
        noteService
            .create(noteObject)
            .then(returnedNote => setNotes(notes.concat(returnedNote)))
    }
    const noteForm = () => (
        <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote}/>
        </Togglable>
    )
    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            {user === null ? loginForm() :
                <div>
                    <p>{user.name} logged-in</p>
                    {noteForm()}
                </div>}
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
            <Footer/>
        </div>
    )
}

export default App
