import { useState } from "react"
import api from "../services/api"

type PostCardProps = {
    title: string
    authorName: string
    content: string
    image?: string
    createdAt: string
    currentUserId:number
    authorId: number
    id: number
    onDelete: (id: number) => void
    onEdit: (id: number, data: any) => void
    likesCount: number
    likedByMe: boolean
}

function PostCard ({title, authorName, content, image, createdAt, currentUserId, authorId, id, onDelete, onEdit, likesCount, likedByMe}:PostCardProps) {
    const [editing, setEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(title)
    const [editContent, setEditContent] = useState(content)
    const [liked, setLiked] = useState(likedByMe)
    const [likes, setLikes] = useState(likesCount)

    const handleLike = async () => {
        setLiked(!liked)
        setLikes(liked ? likes - 1 : likes + 1)
        await api.post(`/posts/${id}/like`)
    }
    
    return(
        <div className="text-white bg-gray-800 p-8 rounded-lg w-96 flex flex-col mb-5 ">
            <h3>{authorName}</h3>
            {editing ? (
                <form onSubmit={(e) => {
                    e.preventDefault()
                    onEdit(id, { title: editTitle, content: editContent })
                    setEditing(false)
                }}>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
                </form>
            ) : (
            <>
                    <h2>{title}</h2>
                    <p>{content}</p>
            </>
            )}
            {image && <img src={image}/>}
            <p>{createdAt}</p>
            {currentUserId ===  authorId && (
                <div>
                    <button onClick={() => setEditing(true)}>Editar</button>
                    <button onClick={() => onDelete(id)}>Deletar</button>
                    <button onClick={handleLike}>{liked ? '❤️' : '🤍'} {likes}</button>
                </div>
            )}
            
        </div>
        
    )
}
export default PostCard