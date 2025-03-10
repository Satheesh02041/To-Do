import { useEffect, useState } from "react"

export default function Todo(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos,setTodos] = useState([]);
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const [editId,setEditId] = useState(-1);
    const [edittitle,setEditTitle] = useState("");
    const [editdescription,setEditDescription] = useState("");
    const apiUrl = "http://localhost:8000"
    const handleSubmit = () => {
        setError("")
        if(title.trim !== '' && description.trim !== '')
        {
            fetch (apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title, description})
            }).then((res)=>{
                if(res.ok)
                {
                    setTodos([...todos,{title,description}])
                    setTitle("");
                    setDescription("");
                    setMessage("Work added to the list")
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                }
                else{
                    setError("Unable to add To-do")
                }
            }).catch(()=>{
                setError("Unable to add To-do")
            })
        }
    }
    useEffect(()=>
    {
        getItems()
    },[])
    const getItems = () => {
        fetch(apiUrl+"/todos")
        .then((res)=>res.json())
        .then((res)=>{
            setTodos(res)
        })
    }
    const handleEdit = (item) =>{
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    }
    const handleUpdate = () =>{
        setError("")
        if(edittitle.trim !== '' && editdescription.trim !== '')
        {
            fetch (apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title:edittitle, description:editdescription})
            }).then((res)=>{
                if(res.ok)
                {
                    const updatedtodos = todos.map((item)=>{
                        if(item._id == editId)
                        {
                            item.title = edittitle;
                            item.description = editdescription;
                        }
                        return item;
                    })
                    setTodos(updatedtodos)
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Work updated to the list")
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                    setEditId(-1)
                }
                else{
                    setError("Unable to add To-do")
                }
            }).catch(()=>{
                setError("Unable to add To-do")
            })
        }
    }
    const handleEditCancel = () =>{
        setEditId(-1)
    }
    const handleDelete = (_id) =>{
        if(window.confirm('Click yes to delete')){
            fetch(apiUrl+'/todos/'+_id,{
                method:"DELETE"
            }).then(()=>{
                const updatedtodos = todos.filter((item)=> item._id !== _id)
                setTodos(updatedtodos)
            })
        }
    }
    return <>
        <div className="row p-3 bg-success text-light">
            <h1>Todo list project</h1>
        </div>
        <div className="row">
            <h3>Add work list</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input placeholder="Title" onChange={(e)=> setTitle(e.target.value)} value={title} className="form-control" type="text"></input>
                <input placeholder="Description" onChange={(e)=> setDescription(e.target.value)} value={description} className="form-control" type="text"></input>
                <btn className="btn btn-dark" onClick={handleSubmit}>Submit</btn>
            </div>
            {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
            {
                todos.map((item)=>
                    <li className="list-group-item d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column me-2">
                    {
                        editId == -1  || editId !== item._id ? <>
                            <span className="fw-bold">{item.title}</span>
                            <span>{item.description}</span>
                        </> : <>
                        <div className="form-group d-flex gap-2">
                            <input placeholder="Title" onChange={(e)=> setEditTitle(e.target.value)} value={edittitle} className="form-control" type="text"></input>
                            <input placeholder="Description" onChange={(e)=> setEditDescription(e.target.value)} value={editdescription} className="form-control" type="text"></input>
                        </div>
                        </>
                    }
                    
                </div>
                <div className="d-flex gap-2">
                    {
                        editId == -1 || editId !== item._id ? 
                        <button className="btn bg-success text-light" onClick={()=>handleEdit(item)}>Edit</button> : <button onClick={handleUpdate} className="btn bg-success text-light">Update</button>
                    }
                    {
                        editId == -1 ? 
                        <button className="btn bg-danger text-light" onClick={()=>handleDelete(item._id)}>Delete</button> : <button className="btn bg-danger text-light" onClick={handleEditCancel}>Cancel</button>
                    }
                </div>
            </li>
                )
            }
        </ul>
    </div>
    </>
}