import { useState } from "react";
import {z} from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from "../services/api";

const loginSchema = z.object({
    email: z.string().email ('Email inválido'),
    password: z.string().min(6, 'Senha precisa ter pelo menos 6 caracteres'),
})

const registerSchema = z.object({
    name: z.string().min (1,'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha precisa ter pelo menos 6 caracteres')
})



function AuthPage(){
    
    const onSubmit = async (data: any) => {
        const response = await api.post('/auth/login', data)
        localStorage.setItem('token', response.data.token)
        console.log(response.data)
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const [abaAtiva, setAbaAtiva] = useState('login')

    return(
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-x1 w-96 ">
                <h1>Mini twitter</h1>
                <button onClick={()=> setAbaAtiva('login')}>Login</button>
                <button onClick={() => setAbaAtiva('cadastrar')}>Cadastrar</button>
                {abaAtiva === 'login' ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input {...register('email')} type="email" placeholder="Digite seu email"/>
                        <input {...register('password')} type="password" placeholder="DIgite sua senha"/>
                        <button type="submit" >Entrar</button>
                    </form>
                ) : <form>
                        <input type="text" placeholder="Digite Seu nome"/>
                        <input type="email" placeholder="Digite seu email"/>
                        <input type="password" placeholder="Digite sua senha"/>
                        <button> Cadastrar</button>
                    </form>
                }
            </div>
        </div>    
    )
}
export default AuthPage