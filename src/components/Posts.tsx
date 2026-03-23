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
            <h3 className="font-bold text-white text-base mb-1">{authorName}</h3>
            {editing ? (
                <form onSubmit={(e) => {
                    e.preventDefault()
                    onEdit(id, { title: editTitle, content: editContent })
                    setEditing(false)
                }}>
                   <input className="bg-gray-700 text-white rounded-lg p-2 mb-2 w-full border border-gray-600"
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    />
                    <textarea 
                    className="bg-gray-700 text-white rounded-lg p-2 mb-2 w-full border border-gray-600"
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)} 
                    />
                    <button className="bg-blue-500 text-white rounded-lg px-3 py-1 mr-2" type="submit">Salvar</button>
                    <button className="bg-gray-600 text-white rounded-lg px-3 py-1" type="button" onClick={() => setEditing(false)}>Cancelar</button>
                </form>
            ) : (
            <>
                    <h2 className="font-bold text-white text-lg mb-2">{title}</h2>
                    <p className="text-gray-300 text-sm mb-3">{content}</p>
            </>
            )}
            {image && <img className="w-full rounded-lg mb-3" src={image}/>}
            <p>{createdAt}</p>
            {currentUserId ===  authorId && (
                <div className="flex gap-3 mt-2">
                    <button className="text-blue-400 text-sm hover:text-blue-300" onClick={() => setEditing(true)}>Editar</button>
                    <button className="text-red-400 text-sm hover:text-red-300" onClick={() => onDelete(id)}>Deletar</button>
                    <button className="text-sm" onClick={handleLike}>{liked ? '❤️' : '🤍'} {likes}</button>
                </div>
            )}
            
        </div>
        
    )
}
export default PostCard