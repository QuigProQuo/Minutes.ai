import React, { useContext } from 'react';
import './Texteditor.scoped.css';
import axios from 'axios';
import { appContext } from '../../Context';

function Texteditor(props) {
    const {notes, setNotes} = useContext(appContext)
    const {selected} = useContext(appContext)
    
    return (
        <div className="texteditor-container">
            <div className="route-container">
                {`/${notes[selected].title}`}
            </div>
            <div className="editor-container">
                <input id="heading-editor" className="heading-editor" type="text" placeholder="Title here..." defaultValue={notes[selected].heading} onChange={e => {updateNotes("title", e)}}></input>
                <textarea id="body-editor" className="body-editor" placeholder="Input here..." defaultValue={notes[selected].content} onChange={e => {updateNotes("content", e)}}></textarea>
                <button className="export-drive" onClick={exportToDrive}>Export to Drive</button>
            </div>
        </div>
    )

    function updateNotes(type, event) {
        event.preventDefault()
        let tempArr = notes.slice()
        if (type == "title") {
            tempArr[selected].title = event.target.value
        } else if (type == "content") {
            tempArr[selected].content = event.target.value
        }
        setNotes(tempArr)
    }

    async function exportToDrive() {
        try {
            const note = notes[selected];
            const res = await axios.post('/exportDrive', {
                title: note.title,
                content: note.content,
                transcription: note.transcription
            });
            console.log('Uploaded file ID:', res.data.fileId);
        } catch (err) {
            console.error(err);
        }
    }
}

export default Texteditor;
