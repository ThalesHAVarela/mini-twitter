import { useQuery, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"
import PostCard from "../components/Posts"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


function FeedPage(){

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const logout = async () => {
        await api.post('auth/logout/')
        localStorage.removeItem('token')
        navigate('/')
    }

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['posts', search, page],
        queryFn: () => api.get(`/posts/?search=${search}&page=${page}`).then(res => res.data)   
    })
   
    const postSchema = z.object({
        title: z.string().min (3 , 'Mínimo de 3 caracteres'),
        content: z.string().min (1, 'Mínimo de 1 caracter'),
        image: z.string().optional()
    })

    const { register, handleSubmit, formState:{ errors } } = useForm ({
        resolver: zodResolver(postSchema)
    })

    const onSubmitPost = async (data:any) => {
        console.log(data)
        const response = await api.post('/posts/', data)
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')

    console.log('user id:', user.id, 'tipo:', typeof user.id)

    const handleDelete = async (id: number) => {
        await api.delete(`/posts/${id}`)
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }   

    const handleEdit = async (id: number, data: any) => {
        await api.put(`/posts/${id}`, data)
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    const [editing, setEditing] = useState(false)


    return (
        
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
            <header className=" bg-gray-900 text-white w-full p-5 flex items-center justify-between border-b border-gray-700">
                <div className=""><h2>Mini Twitter</h2></div>
                <div><input type="text" placeholder="Buscar um post..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-gray-800 text-white rounded-full px-4 py-2 w-96 border border-gray-600"></input></div>
                <div><button className=" bg-blue-500 text-white rounded-lg p-3 mt-2" onClick={logout}>Sair</button></div>
            </header>
            <form className="text-white bg-gray-800 p-8 rounded-lg w-96 flex flex-col mb-5 mt-5" onSubmit={handleSubmit(onSubmitPost)}>
                <input {...register('title')} type="text" placeholder="Título" className="bg-gray-700 text-white rounded-lg p-2 mb-2 w-full border border-gray-600 placeholder-gray-400"/>
                <textarea {...register('content')} placeholder="O que está rolando?" className="bg-gray-700 text-white rounded-lg p-2 mb-2 w-full border border-gray-600 placeholder-gray-400"/>
                <input {...register('image')} type="text" placeholder="URL da imagem (opcional)" className="bg-gray-700 text-white rounded-lg p-2 mb-2 w-full border border-gray-600 placeholder-gray-400"/>
                <button type="submit">Postar</button>
            </form>
            <div>{isLoading ? <p>Carregando...</p> : (data.posts.map((post:any) => (
                
                <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    authorName={post.authorName}
                    content={post.content}
                    image={post.image}
                    createdAt={post.createdAt}
                    currentUserId={Number(user.id)}
                    authorId={post.authorId}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    likesCount={post.likesCount}
                    likedByMe={post.likedByMe}
                />
                ))
                )} 
            </div>
            <div className="flex items-center gap-4 mt-6 mb-6">
                <button 
                    className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}>Anterior</button>
                <span className="text-white font-bold">{page}</span>
                <button 
                    className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
                    onClick={() => setPage(page + 1)}>Próximo</button>
            </div>
            <footer className="text-white w-full p-5 flex">
                <div><h2>Mini Twitter</h2></div>
            </footer>
        </div>
    )  
}

export default FeedPage